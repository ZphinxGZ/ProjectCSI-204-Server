import express from 'express';
import { receiveInventory } from '../controllers/inventoryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to receive inventory
router.post('/inventory/receive', protect, authorizeRoles('Procurement'), receiveInventory);

export default router;
