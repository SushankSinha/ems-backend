import MissionMetrics from '../models/rha/meals.js';

// Read one
export const getMissionMetric = async (req, res) => {
  try {
    const metric = await MissionMetrics.findOne();
    if (!metric && metric !=null) {
      return res.status(404).json({ error: 'Mission metrics not found' });
    }
    if(metric == null){
      return res.status(200).json({rice: 0,
    pulses: 0,
    atta: 0});
    }
    res.status(200).json({rice:metric.rice, pulses:metric.pulses, atta:metric.atta});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const updateMissionMetric = async (req, res) => {
  try {
    let metric = await MissionMetrics.findOne();

    if (!metric) {
      // No existing document → create a new one with incoming data
      metric = new MissionMetrics({
        rice: req.body.rice ?? 0,
        pulses: req.body.pulses ?? 0,
        atta: req.body.atta ?? 0,
      });

      await metric.save();

      return res.status(201).json(metric); // 201 Created
    }

    // Update existing document
    if (req.body.rice !== undefined) metric.rice = req.body.rice;
    if (req.body.pulses !== undefined) metric.pulses = req.body.pulses;
    if (req.body.atta !== undefined) metric.atta = req.body.atta;

    await metric.save();

    res.status(200).json({message: "Data Updated"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


