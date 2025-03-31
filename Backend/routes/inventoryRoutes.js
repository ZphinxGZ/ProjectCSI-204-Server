import express from 'express';
import { receiveInventory, createInventory } from '../controllers/inventoryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to receive inventory items
router.post('/inventory/receive', protect, authorizeRoles('Procurement'), receiveInventory);

// Route to create inventory items
router.post('/inventory/create', protect, authorizeRoles('Procurement'), createInventory);

export default router;
