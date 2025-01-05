import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employee from '../models/employee.js';

// Registration logic
export const registerEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const employee = new Employee({ name, email, password, role });
    await employee.save();
    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login logic
export const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: employee._id, role: employee.role, name: employee.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json( {token : token, role : employee.role, name: employee.name});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all employee (Admin or Manager)
export const getAllEmployees = async (req, res) => {
  try {
    // Fetch all projects from the database
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};