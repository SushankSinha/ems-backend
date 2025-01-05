import express from 'express';
import { registerEmployee, loginEmployee, getAllEmployees } from '../controllers/employee.controller.js'; // Add getAllEmployees controller

const router = express.Router();

// Registration route
router.post('/register', registerEmployee);

// Login route
router.post('/login', loginEmployee);

// Get all employees route (only name and employeeId)
router.get('/all', getAllEmployees);

export default router;
