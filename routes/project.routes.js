import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProjectStatus,
  addEmployeeToProject,
  updateProjectDetails,
  deleteProject,
  getTasksForProject
} from '../controllers/project.controller.js';

const router = express.Router();

// Get all projects (Admin or Manager)
router.get('/', getAllProjects);

// Get a specific project by its ID (includes tasks and employees)
router.get('/:projectId', getProjectById);

// Create a new project
router.post('/', createProject);

// Update project status (e.g., from 'Not Started' to 'In Progress')
router.put('/status/:projectId', updateProjectStatus);

// Add an employee to the project
router.post('/employee/:projectId', addEmployeeToProject);

// Update project details (budget, description, start/end dates)
router.put('/details/:projectId', updateProjectDetails);

// Delete a project
router.delete('/:projectId', deleteProject);

// Get all tasks related to a specific project
router.get('/tasks/:projectId', getTasksForProject);

export default router;
