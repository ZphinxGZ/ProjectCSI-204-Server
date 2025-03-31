import express from 'express';
import { getBudgets, createBudget, getBudgetBalance, updateBudget, adjustBudget } from '../controllers/budgetController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to fetch budgets
router.get('/budgets', protect, authorizeRoles('Finance', 'Management'), getBudgets);

// Route to fetch budget balance by fiscal_year or ID
router.post('/budgets/balance', protect, authorizeRoles('Finance', 'Management'), getBudgetBalance);

// Route to create a budget
router.post('/budgets', protect, authorizeRoles('Finance'), createBudget);

// Route to update a budget by ID
router.put('/budgets/:id', protect, authorizeRoles('Finance'), updateBudget);

// Route to adjust budget amount by ID
router.post('/budgets/:id/adjust', protect, authorizeRoles('Finance', 'Management'), adjustBudget);

export default router;
