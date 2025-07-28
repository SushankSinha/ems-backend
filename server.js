import express from 'express';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employee.routes.js';
import taskRoutes from './routes/task.routes.js';
import mealsRoutes from './routes/meals.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import projectRoutes from './routes/project.routes.js';
import cors from 'cors'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'compression';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors({
    // origin : ["http://localhost:5173", "https://ss-ems.netlify.app"],
    origin : ["http://localhost:8080", "https://missionsankalp78-blr.netlify.app"],
    methods : ["GET", "POST", "PUT", "HEAD", "DELETE", "PATCH"],
    credentials : true
}))

// Use routes
app.use('/api/auth', employeeRoutes);  // Employee routes
app.use('/api/task', taskRoutes);          // Task routes
app.use('/api/project', projectRoutes);             // TimeLog routes (note that timeLog is a sub-path under /api)
app.use('/api/metrics', mealsRoutes);
app.use('/api/gallery', galleryRoutes);

const database = process.env.database;
const PORT = process.env.PORT;

mongoose.connect(database).then(()=>(console.log("DB Connected")
)).catch((error)=>(console.log("Error while connecting DB", error)))

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
