import express from 'express';
import multer from 'multer';

import {
  createGalleryImage,
  getAllGalleryImages,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryDates
} from '../controllers/gallery.controller.js';
import { protect, rhaAdmin } from '../middlewares/access.js';
import { limiter } from '../utils/rateLimiter.js';

const router = express.Router();

// Set up multer (temporary disk storage)
const upload = multer({ dest: 'uploads/' });

// Only use multer for routes that receive image files
router.post('/', protect, rhaAdmin, upload.single('image'), createGalleryImage);
router.patch('/:id', protect, rhaAdmin, upload.single('image'), updateGalleryImage);

router.get('/dates', limiter, getGalleryDates);
router.get('/', limiter, getAllGalleryImages);

export default router;
