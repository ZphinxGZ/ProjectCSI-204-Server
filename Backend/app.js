import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/DB.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log all requests

// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

