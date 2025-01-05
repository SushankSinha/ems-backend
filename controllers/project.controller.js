import Project from '../models/project.js';
import Employee from '../models/employee.js';
import Task from '../models/task.js';

// Get all projects (Admin or Manager)
export const getAllProjects = async (req, res) => {
  try {
    // Fetch all projects from the database
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific project by its ID (includes tasks and employees)
export const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find project by its ID and populate related tasks and employees
    const project = await Project.findOne({ projectId : projectId })
      .populate('tasks')
      .populate('employees.employeeId');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  const { projectName, projectId, startDate, endDate, budget, description, createdBy, status } = req.body;

  try {
    // Create a new project document
    const newProject = new Project({
      projectName,
      projectId,
      startDate,
      endDate,
      budget: budget || 0,
      description: description || '',
      createdBy, // Employee ID (Manager who created the project)
      status: status || 'Not Started',
    });

    // Save the new project
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);    
    res.status(500).json({ message: error.message });
  }
};

// Update project status (e.g., from 'Not Started' to 'In Progress')
export const updateProjectStatus = async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  try {
    // Find the project and update its status
    const project = await Project.findOneAndUpdate(
      { projectId },
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add an employee to the project (by employeeId and role)
export const addEmployeeToProject = async (req, res) => {
  const { projectId } = req.params;
  const { employeeId, role } = req.body;

  try {
    // Find the project by projectId
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the employee is already added to the project
    if (project.employees.some(emp => emp.employeeId.toString() === employeeId)) {
      return res.status(400).json({ message: 'Employee is already part of this project' });
    }

    // Add the employee to the project
    project.employees.push({
      employeeId,
      role,
      assignedDate: new Date(),
    });

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project details (budget, description, dates, etc.)
export const updateProjectDetails = async (req, res) => {
  const { projectId } = req.params;
  const { budget, description, startDate, endDate } = req.body;

  try {
    // Find the project and update the provided details
    const project = await Project.findOneAndUpdate(
      { projectId },
      { budget, description, startDate, endDate },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project by its ID
export const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find and delete the project
    const project = await Project.findOneAndDelete({ projectId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks related to a specific project
export const getTasksForProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find tasks associated with a specific project
    const tasks = await Task.find({ project: projectId }).populate('assignedTo');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
