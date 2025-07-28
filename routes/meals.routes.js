import express from 'express';
import {
  getMissionMetric,
  updateMissionMetric,
} from '../controllers/meals.controller.js';
import { protect, rhaAdmin } from '../middlewares/access.js';
import { limiter } from '../utils/rateLimiter.js';

const router = express.Router();

router.get('/', limiter, getMissionMetric);
router.patch('/', protect, rhaAdmin, updateMissionMetric);

export default router;
