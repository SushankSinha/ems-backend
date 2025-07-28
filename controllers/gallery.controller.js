import Gallery from '../models/rha/gallery.js';
import fs from 'fs';

export const createGalleryImage = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Read file from temp path and convert to base64
    const base64Image = fs.readFileSync(file.path, { encoding: 'base64' });
    const imageUrl = `data:${file.mimetype};base64,${base64Image}`;

    // Create and save document
    const newImage = new Gallery({
      title,
      description,
      location,
      date: new Date(date),
      imageUrl, // Save as base64 string
    });

    await newImage.save();

    // Clean up temp file
    fs.unlinkSync(file.path);

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error saving gallery image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
};

// Read all
// Read all, with optional ?date=YYYY-MM-DD to filter by date
export const getAllGalleryImages = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      // Match date exactly (assuming 'date' stored as ISO date string or Date)
      // You may need to adjust depending on your date field type
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query.date = { $gte: start, $lt: end };
    }

    const images = await Gallery.find(query)
      .sort({ date: -1 })
      .limit(date ? 0 : 6); // limit 6 only if no date filter

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New API: Get all unique dates with photos
export const getGalleryDates = async (req, res) => {
  try {
    const dates = await Gallery.aggregate([
      {
        $match: {
          date: { $exists: true, $ne: null },
        },
      },
      {
        $addFields: {
          dateObj: {
            $cond: {
              if: { $eq: [{ $type: "$date" }, "date"] },
              then: "$date",
              else: { $toDate: "$date" },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dateObj",
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
        },
      },
    ]);
    res.status(200).json(dates.map((d) => d.date));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Read one
export const getGalleryImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const updateGalleryImage = async (req, res) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ error: 'Image not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
export const deleteGalleryImage = async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Image not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
