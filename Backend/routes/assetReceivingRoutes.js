import express from 'express';
import { receiveAsset } from '../controllers/assetReceivingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/assets/receive', protect, authorizeRoles('Procurement'), receiveAsset);

export default router;
