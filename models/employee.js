import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Counter } from './employeeCounter.js';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'rha-rep-admin'], default: 'employee' },
  employeeId: { type: Number, unique: true },
});

employeeSchema.pre('save', async function(next) {
  // Hash the password if it's modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Add employeeId if it's a new document
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'employeeId' }, 
        { $inc: { last_value: 1 } }, 
        { new: true, upsert: true }
      );
      this.employeeId = counter.last_value;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
