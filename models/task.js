import mongoose from 'mongoose';

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  status: { 
    type: String, 
    enum: ['To-Do', 'In Progress', 'Done'], 
    default: 'To-Do' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  dueDate: { type: Date },
  startDate: { type: Date },
  completionDate: { type: Date },
  timeSpent: { type: Number, default: 0 }, // in hours or minutes
  startTime: { type: Date },
  endTime: { type: Date },
  timeLogs: [
    {
      loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      startTime: { type: Date },
      endTime: { type: Date },
      duration: { type: Number }, // in minutes or hours
      approved: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      comment: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Tracks the last employee to update the task
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

// Add method to calculate total time spent on the task
taskSchema.methods.calculateTotalTime = function() {
  return this.timeLogs.reduce((total, log) => total + log.duration, 0); // Calculate time from logs
};

// Create Task Model
const Task = mongoose.model('Task', taskSchema);

export default Task;
