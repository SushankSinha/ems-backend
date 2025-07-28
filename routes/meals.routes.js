import express from 'express';
import {
  getMissionMetric,
  updateMissionMetric,
} from '../controllers/meals.controller.js';
import { protect, rhaAdmin } from '../middlewares/access.js';

const router = express.Router();

router.get('/', getMissionMetric);
router.patch('/', protect, rhaAdmin, updateMissionMetric);

export default router;
