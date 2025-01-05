// models/project.js
import mongoose from 'mongoose';
import {ProjectCounter} from './projectCounter.js'; // Import projectCounter model

// Project Schema
const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectId: { type: Number, unique: true },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task'
    }
  ],
  employees: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      role: { type: String, enum: ['Manager', 'Developer', 'Designer', 'QA', 'Others', 'Employee'] },
      assignedDate: { type: Date, default: Date.now }
    }
  ],
  startDate: { type: Date },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'], 
    default: 'Not Started' 
  },
  attachments: [
    {
      fileUrl: { type: String },
      fileName: { type: String },
    }
  ], 
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Project Manager
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-increment logic for `projectId`
projectSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await ProjectCounter.findOneAndUpdate(
        { name: 'projectId' }, 
        { $inc: { last_value: 1 } }, 
        { new: true, upsert: true }
      );
      this.projectId = counter.last_value;;
    } catch (error) {
      return next(error);
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Create Project Model
const Project = mongoose.model('Project', projectSchema);

export default Project;
