import express from 'express';
import { createPurchaseOrder, getPurchaseOrderById, approvePurchaseOrder, cancelPurchaseOrder } from '../controllers/purchaseOrderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new purchase order
router.post('/purchase-orders', protect, authorizeRoles('Procurement'), createPurchaseOrder);

// Route to get purchase order details by ID
router.get('/purchase-orders/:id', protect, authorizeRoles('Procurement', 'Finance', 'Management', 'Approvers'), getPurchaseOrderById);

// Route to approve a purchase order
router.put('/purchase-orders/:id/approve', protect, authorizeRoles('Management', 'Approvers'), approvePurchaseOrder);

// Route to cancel a purchase order
router.put('/purchase-orders/:id/cancel', protect, authorizeRoles('Management', 'Approvers'), cancelPurchaseOrder);

export default router;
