import express from 'express';
import multer from 'multer';
import { createAccountsPayable, payAccountsPayable, getAccountsPayableBalances, uploadPaymentAttachment } from '../controllers/accountsPayableController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to create an accounts payable (AP) entry
router.post('/accounts-payable', protect, authorizeRoles('Finance'), createAccountsPayable);

// Route to process payment for an accounts payable (AP) entry
router.post('/accounts-payable/:id/pay', protect, authorizeRoles('Finance'), payAccountsPayable);

// Route to fetch total accounts payable balances
router.get('/accounts-payable/balances', protect, authorizeRoles('Finance', 'Management', 'Approvers'), getAccountsPayableBalances);

// Route to upload payment attachments for an accounts payable (AP) entry
router.post('/accounts-payable/:id/attachments', protect, authorizeRoles('Finance'), upload.single('attachment'), uploadPaymentAttachment);

export default router;
