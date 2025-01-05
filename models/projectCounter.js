// models/Counter.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Counter Schema to hold the last used employeeId
const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  last_value: { type: Number, required: true, default: 0 }  // Default is 0 to start from the first ID
});

// Create Counter model
const ProjectCounter = mongoose.model('ProjectCounter', counterSchema);

export { ProjectCounter };
