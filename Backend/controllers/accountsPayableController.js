import AccountsPayable from '../models/AccountsPayable.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import path from 'path';
import fs from 'fs/promises';

export const createAccountsPayable = async (req, res) => {
  try {
    const { po_id, invoice_number, invoice_date, due_date, amount, notes } = req.body;

    // Validate required fields
    if (!po_id || !invoice_number || !invoice_date || !due_date || !amount) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if the purchase order exists
    const purchaseOrder = await PurchaseOrder.findById(po_id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    // Check if an AP entry with the same invoice number already exists
    const existingAP = await AccountsPayable.findOne({ invoice_number });
    if (existingAP) {
      return res.status(400).json({ message: 'Accounts payable with this invoice number already exists.' });
    }

    // Create a new accounts payable entry
    const newAP = await AccountsPayable.create({
      po_id,
      vendor_id: purchaseOrder.vendor_id,
      invoice_number,
      invoice_date,
      due_date,
      amount,
      remaining_amount: amount,
      notes,
    });

    res.status(201).json({ message: 'Accounts payable created successfully.', accountsPayable: newAP });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const payAccountsPayable = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_date, payment_method, amount, reference_number, notes } = req.body;

    // Validate required fields
    if (!payment_date || !payment_method || !amount) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Find the accounts payable entry by ID
    const accountsPayable = await AccountsPayable.findById(id);
    if (!accountsPayable) {
      return res.status(404).json({ message: 'Accounts payable not found.' });
    }

    // Check if the payment amount exceeds the remaining amount
    if (amount > accountsPayable.remaining_amount) {
      return res.status(400).json({ message: 'Payment amount exceeds the remaining balance.' });
    }

    // Create a payment transaction
    const paymentTransaction = await PaymentTransaction.create({
      ap_id: accountsPayable._id,
      payment_date,
      payment_method,
      amount,
      reference_number,
      notes,
      processed_by: req.user._id,
    });

    // Update the accounts payable entry
    accountsPayable.paid_amount += amount;
    accountsPayable.remaining_amount -= amount;
    accountsPayable.status = accountsPayable.remaining_amount === 0 ? 'Paid' : 'Partial';
    await accountsPayable.save();

    res.status(200).json({
      message: 'Payment processed successfully.',
      accountsPayable,
      paymentTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getAccountsPayableBalances = async (req, res) => {
  try {
    // Aggregate total balances
    const totalBalances = await AccountsPayable.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPaid: { $sum: '$paid_amount' },
          totalRemaining: { $sum: '$remaining_amount' },
        },
      },
    ]);

    // If no data exists, return zeros
    const balances = totalBalances.length > 0 ? totalBalances[0] : { totalAmount: 0, totalPaid: 0, totalRemaining: 0 };

    res.status(200).json({
      message: 'Accounts payable balances fetched successfully.',
      balances: {
        totalAmount: balances.totalAmount,
        totalPaid: balances.totalPaid,
        totalRemaining: balances.totalRemaining,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const uploadPaymentAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Find the accounts payable entry by ID
    const accountsPayable = await AccountsPayable.findById(id);
    if (!accountsPayable) {
      return res.status(404).json({ message: 'Accounts payable not found.' });
    }

    // Generate a unique filename by appending the current timestamp
    const timestamp = Date.now();
    const originalFilename = req.file.originalname;
    const uniqueFilename = `${timestamp}_${originalFilename}`;

    // Move the file to the uploads directory with the unique filename
    const newPath = path.join('uploads', uniqueFilename);
    await fs.rename(req.file.path, newPath);

    // Save the unique filename to the accounts payable entry
    accountsPayable.attachments = accountsPayable.attachments || [];
    accountsPayable.attachments.push(uniqueFilename);
    await accountsPayable.save();

    res.status(200).json({
      message: 'Attachment uploaded successfully.',
      attachments: accountsPayable.attachments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
