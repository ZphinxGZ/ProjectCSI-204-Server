import express from 'express';
import multer from 'multer';
import { createPurchaseRequisition, getPurchaseRequisitionById, updatePurchaseRequisitionStatus, getAllPurchaseRequisitions, uploadAttachment, downloadAttachment } from '../controllers/purchaseRequisitionController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/purchase-requisitions', protect, createPurchaseRequisition);
router.get('/purchase-requisitions/:id', protect, authorizeRoles('Procurement', 'Management', 'Approvers'), getPurchaseRequisitionById);
router.put('/purchase-requisitions/:id/status', protect, authorizeRoles('Management', 'Approvers'), updatePurchaseRequisitionStatus);
router.get('/purchase-requisitions', protect, authorizeRoles('Procurement', 'Management', 'Finance'), getAllPurchaseRequisitions);

// New route for uploading attachments
router.post('/purchase-requisitions/:id/attachments', protect, authorizeRoles('Procurement'), upload.single('attachment'), uploadAttachment);

// New route for downloading attachments
router.get('/purchase-requisitions/:id/attachments/:filename', protect, authorizeRoles('Procurement', 'Management', 'Finance'), downloadAttachment);

export default router;

