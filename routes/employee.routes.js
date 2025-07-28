import express from 'express';
import {checkAuth, registerEmployee, loginEmployee, getAllEmployees } from '../controllers/employee.controller.js'; // Add getAllEmployees controller
import { protect } from '../middlewares/access.js';

const router = express.Router();

// Registration route
// router.post('/register', registerEmployee);

// Login route
router.post('/login', loginEmployee);
router.get('/check', protect, checkAuth);

// Get all employees route (only name and employeeId)
// router.get('/all', getAllEmployees);

export default router;
