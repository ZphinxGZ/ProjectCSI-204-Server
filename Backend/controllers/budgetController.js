import Budget from '../models/Budget.js';
import mongoose from 'mongoose';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find(); // Fetch all budgets
    res.status(200).json({
      message: 'Budgets fetched successfully.',
      budgets,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const createBudget = async (req, res) => {
  try {
    const { fiscal_year, department, budget_type, total_amount } = req.body;

    // Validate required fields
    if (!fiscal_year || !department || !budget_type || !total_amount) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new budget
    const newBudget = await Budget.create({
      fiscal_year,
      department,
      budget_type,
      total_amount,
      remaining_amount: total_amount, // Initialize remaining amount as total amount
    });

    res.status(201).json({
      message: 'Budget created successfully.',
      budget: newBudget,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getBudgetBalance = async (req, res) => {
  try {
    const { id, fiscal_year } = req.body;

    // Validate that either id or fiscal_year is provided
    if (!id && !fiscal_year) {
      return res.status(400).json({ message: 'Either budget ID or fiscal year is required.' });
    }

    let budget;

    // Fetch budget by ID if provided
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid budget ID.' });
      }
      budget = await Budget.findById(id);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found by ID.' });
      }
    }

    // If fiscal_year is provided, validate it matches the budget
    if (fiscal_year) {
      if (budget && budget.fiscal_year !== fiscal_year) {
        return res.status(400).json({ message: 'Fiscal year does not match the budget ID.' });
      }
      if (!budget) {
        budget = await Budget.findOne({ fiscal_year });
        if (!budget) {
          return res.status(404).json({ message: 'Budget not found by fiscal year.' });
        }
      }
    }

    res.status(200).json({
      message: 'Budget balance fetched successfully.',
      balance: budget.remaining_amount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { fiscal_year, department, budget_type, total_amount, remaining_amount } = req.body;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid budget ID.' });
    }

    // Find the budget by ID
    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    // Update fields if provided
    budget.fiscal_year = fiscal_year || budget.fiscal_year;
    budget.department = department || budget.department;
    budget.budget_type = budget_type || budget.budget_type;
    budget.total_amount = total_amount !== undefined ? total_amount : budget.total_amount;
    budget.remaining_amount = remaining_amount !== undefined ? remaining_amount : budget.remaining_amount;

    // Save the updated budget
    await budget.save();

    res.status(200).json({
      message: 'Budget updated successfully.',
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const adjustBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment_amount } = req.body;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid budget ID.' });
    }

    // Validate adjustment amount
    if (typeof adjustment_amount !== 'number') {
      return res.status(400).json({ message: 'Adjustment amount must be a number.' });
    }

    // Find the budget by ID
    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    // Adjust the total amount
    budget.total_amount += adjustment_amount;

    // Adjust the remaining amount
    budget.remaining_amount += adjustment_amount;

    // Ensure remaining amount does not exceed total amount
    if (budget.remaining_amount > budget.total_amount) {
      return res.status(400).json({ message: 'Remaining amount cannot exceed total amount.' });
    }

    // Ensure total amount is not negative
    if (budget.total_amount < 0) {
      return res.status(400).json({ message: 'Total amount cannot be negative.' });
    }

    // Save the updated budget
    await budget.save();

    res.status(200).json({
      message: 'Budget adjusted successfully.',
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
