import express from 'express';
import { receiveAsset, getAssetReceiptById, registerAsset, updateAssetReceipt } from '../controllers/assetReceivingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to receive fixed assets
router.post('/assets/receive', protect, authorizeRoles('Procurement'), receiveAsset);

// Route to get asset receipt details by ID
router.get('/assets/receipts/:id', protect, authorizeRoles('Procurement', 'Finance', 'Management', 'Approvers'), getAssetReceiptById);

// Route to register a fixed asset
router.post('/assets/register', protect, authorizeRoles('Procurement', 'Admin'), registerAsset);

// Route to update an asset receipt
router.put('/assets/receipts/:id', protect, authorizeRoles('Procurement', 'Finance'), updateAssetReceipt);

export default router;
