import Task from '../models/task.js';

// Get all tasks for a specific employee
export const getTasksForEmployee = async (req, res) => {
  
  try {
    // Find tasks assigned to the employee
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, dueDate, priority, startDate } = req.body;

  try {
    // Create a new task using the provided fields
    const task = new Task({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
      priority: priority || 'Medium', // Default priority if not provided
      startDate,
      status: 'To-Do', // Default status when creating a task
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  const { status, lastUpdatedBy, timeLogs } = req.body; // Include timeLogs and lastUpdatedBy if needed

  try {
    // Find and update the task status
    const task = await Task.findByIdAndUpdate(req.params.id, {
      status,
      lastUpdatedBy, // Update the last employee who updated the task
      ...(timeLogs ? { $push: { timeLogs } } : {}), // If timeLogs are provided, add them
    }, { new: true });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Optionally, you can also calculate total time after updating
    const totalTime = task.calculateTotalTime();
    res.json({ task, totalTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add time log to a task (for time tracking)
export const logTimeForTask = async (req, res) => {
  const { startTime, endTime, duration, approved } = req.body;

  try {
    // Find the task and add a new time log entry
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Create a new time log entry
    const timeLog = {
      loggedBy: req.user.id,
      startTime,
      endTime,
      duration,
      approved: approved || false, // Default to false if not provided
    };

    // Push the new time log to the task's timeLogs array
    task.timeLogs.push(timeLog);
    await task.save();

    // Optionally, recalculate total time
    const totalTime = task.calculateTotalTime();
    res.json({ message: 'Time log added successfully', totalTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject time logs (for admins)
export const approveTimeLog = async (req, res) => {
  const { logId, approved } = req.body;

  try {
    // Find the task by ID
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find the time log and update its approval status
    const timeLog = task.timeLogs.id(logId);
    if (!timeLog) {
      return res.status(404).json({ message: 'Time log not found' });
    }

    timeLog.approved = approved;
    await task.save();

    res.json({ message: 'Time log approval status updated', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for a specific project (Admin or Manager)
export const getTasksForProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ projectId: projectId }).populate('assignedTo', 'name');

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this project' });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

