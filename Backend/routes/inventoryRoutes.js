import express from 'express';
import { receiveInventory, issueInventory, getInventoryItems, updateInventoryItem } from '../controllers/inventoryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to receive inventory
router.post('/inventory/receive', protect, authorizeRoles('Procurement'), receiveInventory);

// Route to issue inventory
router.post('/inventory/issue', protect, authorizeRoles('Procurement', 'Admin'), issueInventory);

// Route to fetch inventory items
router.get('/inventory', protect, authorizeRoles('Procurement', 'Admin', 'Finance'), getInventoryItems);

// Route to update inventory item
router.put('/inventory/:id', protect, authorizeRoles('Procurement', 'Admin'), updateInventoryItem);

export default router;
