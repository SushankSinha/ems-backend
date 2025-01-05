import express from 'express';
import {
  getTasksForEmployee,
  createTask,
  updateTaskStatus,
  logTimeForTask,
  approveTimeLog,
  getTasksForProject
} from '../controllers/task.controller.js';
import {protect} from '../middlewares/access.js'

const router = express.Router();

// Get all tasks for a specific employee
router.get('/', protect, getTasksForEmployee);

// Create a new task
router.post('/:projectId', createTask);

// Update task status (e.g., mark as 'In Progress', 'Done')
router.put('/:id', updateTaskStatus);

// Add a time log to a task (for time tracking)
router.post('/time-log/:id', logTimeForTask);

// Approve or reject time log (for admins)
router.put('/time-log/approve/:id/:logId', approveTimeLog);

// Get all tasks for a specific project (Admin or Manager)
router.get('/:projectId', getTasksForProject);

export default router;
