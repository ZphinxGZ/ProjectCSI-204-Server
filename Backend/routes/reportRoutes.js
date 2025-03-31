import express from 'express';
import { getProcurementSummary, getExpendituresReport, getInventorySummary, getAccountsPayableReport } from '../controllers/reportController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for procurement summary report
router.get('/reports/procurement-summary', protect, authorizeRoles('Procurement', 'Management', 'Approvers', 'Finance'), getProcurementSummary);

// Route for expenditures report
router.get('/reports/expenditures', protect, authorizeRoles('Finance', 'Management', 'Approvers'), getExpendituresReport);

// Route for inventory summary report
router.get('/reports/inventory-summary', protect, authorizeRoles('Procurement', 'IT Administrator'), getInventorySummary);

// Route for accounts payable report
router.get('/reports/accounts-payable', protect, authorizeRoles('Finance', 'Management', 'Approvers'), getAccountsPayableReport);

export default router;
