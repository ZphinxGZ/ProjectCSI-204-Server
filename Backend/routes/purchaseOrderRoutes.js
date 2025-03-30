import express from 'express';
import multer from 'multer';
import { createPurchaseOrder, getPurchaseOrderById, approvePurchaseOrder, cancelPurchaseOrder, uploadAttachment, downloadAttachment } from '../controllers/purchaseOrderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// New route for creating a purchase order
router.post('/purchase-orders', protect, authorizeRoles('Procurement'), createPurchaseOrder);

// New route for fetching purchase order details
router.get('/purchase-orders/:id', protect, authorizeRoles('Procurement', 'Finance', 'Management', 'Approvers'), getPurchaseOrderById);

// New route for approving a purchase order
router.put('/purchase-orders/:id/approve', protect, authorizeRoles('Management', 'Approvers'), approvePurchaseOrder);

// New route for canceling a purchase order
router.put('/purchase-orders/:id/cancel', protect, authorizeRoles('Management', 'Approvers'), cancelPurchaseOrder);

// New route for uploading attachments
router.post('/purchase-orders/:id/attachments', protect, authorizeRoles('Procurement'), upload.single('attachment'), uploadAttachment);

// New route for downloading attachments
router.get('/purchase-orders/:id/attachments/:filename', protect, authorizeRoles('Procurement', 'Finance', 'Management'), downloadAttachment);

export default router;
