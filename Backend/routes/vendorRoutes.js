import express from 'express';
import { createVendor, updateVendor, deleteVendor } from '../controllers/vendorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new vendor
router.post('/vendors', protect, authorizeRoles('Procurement', 'Admin'), createVendor);

// Route to update vendor information
router.put('/vendors/:id', protect, authorizeRoles('Procurement', 'Admin'), updateVendor);

// Route to delete a vendor
router.delete('/vendors/:id', protect, authorizeRoles('Procurement', 'Admin'), deleteVendor);

export default router;
