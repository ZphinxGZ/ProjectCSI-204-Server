import express from 'express';
import multer from 'multer';
import { createPurchaseOrder, getPurchaseOrderById, approvePurchaseOrder, cancelPurchaseOrder, uploadPurchaseOrderAttachment, downloadPurchaseOrderAttachment } from '../controllers/purchaseOrderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to create a new purchase order
router.post('/purchase-orders', protect, authorizeRoles('Procurement'), createPurchaseOrder);

// Route to get purchase order details by ID
router.get('/purchase-orders/:id', protect, authorizeRoles('Procurement', 'Finance', 'Management', 'Approvers'), getPurchaseOrderById);

// Route to approve a purchase order
router.put('/purchase-orders/:id/approve', protect, authorizeRoles('Management', 'Approvers'), approvePurchaseOrder);

// Route to cancel a purchase order
router.put('/purchase-orders/:id/cancel', protect, authorizeRoles('Management', 'Approvers'), cancelPurchaseOrder);

// New route for uploading attachments to a purchase order
router.post('/purchase-orders/:id/attachments', protect, authorizeRoles('Procurement'), upload.single('attachment'), uploadPurchaseOrderAttachment);

// New route for downloading attachments from a purchase order
router.get('/purchase-orders/:id/attachments/:filename', protect, authorizeRoles('Procurement', 'Finance', 'Management', 'Approvers'), downloadPurchaseOrderAttachment);

export default router;
