import PurchaseRequisition from '../models/PurchaseRequisition.js';
import PRItem from '../models/PRItem.js';
import path from 'path';
import fs from 'fs';

// Create a new purchase requisition
export const createPurchaseRequisition = async (req, res) => {
  try {
    const {
      pr_number,
      department,
      budget_id,
      request_date,
      required_date,
      notes,
      item_type,
      description,
      quantity,
      unit,
      estimated_price,
      total_price,
    } = req.body;

    // Validate required fields for Purchase Requisition
    if (!pr_number || !department || !request_date) {
      return res.status(400).json({ message: 'Required fields for purchase requisition are missing.' });
    }

    // Validate required fields for PRItem
    if (!item_type || !description || !quantity || !unit || !estimated_price || !total_price) {
      return res.status(400).json({ message: 'Required fields for PR item are missing.' });
    }

    // Check if PR number already exists
    const existingPR = await PurchaseRequisition.findOne({ pr_number });
    if (existingPR) {
      return res.status(400).json({ message: 'PR number already exists.' });
    }

    // Set total_amount equal to total_price
    const total_amount = total_price;

    // Create a new purchase requisition
    const newPR = new PurchaseRequisition({
      pr_number,
      requester_id: req.user._id,
      department,
      budget_id,
      request_date,
      required_date,
      total_amount,
      notes,
    });

    await newPR.save();

    // Create a new PRItem linked to the purchase requisition
    const newPRItem = new PRItem({
      pr_id: newPR._id,
      item_type,
      description,
      quantity,
      unit,
      estimated_price,
      total_price,
      notes,
    });

    await newPRItem.save();

    res.status(201).json({
      message: 'Purchase requisition and item created successfully.',
      purchaseRequisition: newPR,
      prItem: newPRItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get purchase requisition by ID
export const getPurchaseRequisitionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the purchase requisition by ID
    const purchaseRequisition = await PurchaseRequisition.findById(id).populate('requester_id', 'full_name email').populate('approved_by', 'full_name email');

    if (!purchaseRequisition) {
      return res.status(404).json({ message: 'Purchase requisition not found.' });
    }

    res.status(200).json({ message: 'Purchase requisition fetched successfully.', purchaseRequisition });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update purchase requisition status
export const updatePurchaseRequisitionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending Approval', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    // Find and update the purchase requisition
    const purchaseRequisition = await PurchaseRequisition.findById(id);
    if (!purchaseRequisition) {
      return res.status(404).json({ message: 'Purchase requisition not found.' });
    }

    purchaseRequisition.status = status;
    purchaseRequisition.approved_by = req.user._id;
    purchaseRequisition.approved_at = new Date();

    await purchaseRequisition.save();

    res.status(200).json({ message: 'Purchase requisition status updated successfully.', purchaseRequisition });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get all purchase requisitions
export const getAllPurchaseRequisitions = async (req, res) => {
  try {
    const purchaseRequisitions = await PurchaseRequisition.find()
      .populate('requester_id', 'full_name email')
      .populate('approved_by', 'full_name email');

    res.status(200).json({
      message: 'Purchase requisitions fetched successfully.',
      purchaseRequisitions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Upload attachment for a purchase requisition
export const uploadAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Find the purchase requisition by ID
    const purchaseRequisition = await PurchaseRequisition.findById(id);
    if (!purchaseRequisition) {
      return res.status(404).json({ message: 'Purchase requisition not found.' });
    }

    // Generate a unique filename by appending the current timestamp
    const timestamp = Date.now();
    const originalFilename = req.file.originalname;
    const uniqueFilename = `${timestamp}_${originalFilename}`;

    // Move the file to the uploads directory with the unique filename
    const fs = await import('fs/promises');
    const path = await import('path');
    const newPath = path.join('uploads', uniqueFilename);
    await fs.rename(req.file.path, newPath);

    // Save the unique filename to the purchase requisition
    purchaseRequisition.attachments = purchaseRequisition.attachments || [];
    purchaseRequisition.attachments.push(uniqueFilename);
    await purchaseRequisition.save();

    res.status(200).json({
      message: 'Attachment uploaded successfully.',
      attachments: purchaseRequisition.attachments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Download attachment for a purchase requisition
export const downloadAttachment = async (req, res) => {
  try {
    const { id, filename } = req.params;

    // Find the purchase requisition by ID
    const purchaseRequisition = await PurchaseRequisition.findById(id);
    if (!purchaseRequisition) {
      return res.status(404).json({ message: 'Purchase requisition not found.' });
    }

    // Check if the file exists in the attachments
    const fileExistsInDB = purchaseRequisition.attachments.includes(filename);
    if (!fileExistsInDB) {
      return res.status(404).json({ message: 'File not found in attachments.' });
    }

    // Construct the full file path
    const filePath = path.join('uploads', filename);

    // Check if the file exists on the server
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server.' });
    }

    // Send the file to the client
    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
