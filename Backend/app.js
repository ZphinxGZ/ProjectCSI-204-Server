import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/DB.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import purchaseRequisitionRoutes from './routes/purchaseRequisitionRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import assetReceivingRoutes from './routes/assetReceivingRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import accountsPayableRoutes from './routes/accountsPayableRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log all requests

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', purchaseRequisitionRoutes);
app.use('/api', vendorRoutes);
app.use('/api', budgetRoutes);
app.use('/api', purchaseOrderRoutes);
app.use('/api', assetReceivingRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', accountsPayableRoutes);
app.use('/api', reportRoutes);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

