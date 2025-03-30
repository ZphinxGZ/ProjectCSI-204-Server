import express from 'express';
import { createVendor, updateVendor, deleteVendor } from '../controllers/vendorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/vendors', protect, authorizeRoles('Procurement'), createVendor);
router.put('/vendors/:id', protect, authorizeRoles('Procurement'), updateVendor);
router.delete('/vendors/:id', protect, authorizeRoles('Procurement'), deleteVendor);

export default router;
