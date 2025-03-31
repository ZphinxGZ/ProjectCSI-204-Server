import PurchaseOrder from '../models/PurchaseOrder.js';
import Vendor from '../models/Vendor.js';
import PurchaseRequisition from '../models/PurchaseRequisition.js';
import POItem from '../models/POItem.js';
import PRItem from '../models/PRItem.js';
import fs from 'fs';
import path from 'path';

export const createPurchaseOrder = async (req, res) => {
  try {
    const {
      po_number,
      pr_id,
      vendor_id,
      issue_date,
      expected_delivery_date,
      payment_terms,
      subtotal,
      tax,
      total_amount,
      notes,
    } = req.body;

    // Validate required fields
    if (!po_number || !pr_id || !vendor_id || !issue_date || !subtotal || !total_amount) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if PO number already exists
    const existingPO = await PurchaseOrder.findOne({ po_number });
    if (existingPO) {
      return res.status(400).json({ message: 'PO number already exists.' });
    }

    // Check if the vendor exists
    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    // Check if the purchase requisition exists
    const purchaseRequisition = await PurchaseRequisition.findById(pr_id);
    if (!purchaseRequisition) {
      return res.status(404).json({ message: 'Purchase requisition not found.' });
    }

    // Fetch PRItems linked to the purchase requisition
    const prItems = await PRItem.find({ pr_id });
    if (!prItems.length) {
      return res.status(404).json({ message: 'No items found for the given purchase requisition.' });
    }

    // Create a new purchase order
    const newPO = await PurchaseOrder.create({
      po_number,
      pr_id,
      vendor_id,
      issuer_id: req.user._id,
      issue_date,
      expected_delivery_date,
      payment_terms,
      subtotal,
      tax,
      total_amount,
      notes,
    });

    // Map PRItems to POItems
    const poItems = prItems.map(prItem => ({
      po_id: newPO._id,
      pr_item_id: prItem._id,
      description: prItem.description,
      quantity: prItem.quantity,
      unit: prItem.unit,
      unit_price: prItem.estimated_price,
      total_price: prItem.total_price,
    }));

    await POItem.insertMany(poItems);

    res.status(201).json({
      message: 'Purchase order and items created successfully.',
      purchaseOrder: newPO,
      poItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the purchase order by ID and populate related fields
    const purchaseOrder = await PurchaseOrder.findById(id)
      .populate('pr_id', 'pr_number department status') // Populate purchase requisition details
      .populate('vendor_id', 'vendor_name contact_person phone email') // Populate vendor details
      .populate('issuer_id', 'full_name email') // Populate issuer details
      .populate('approved_by', 'full_name email'); // Populate approver details

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    res.status(200).json({ message: 'Purchase order fetched successfully.', purchaseOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const approvePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the purchase order by ID
    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    // Check if the purchase order is already approved
    if (purchaseOrder.status === 'Approved') {
      return res.status(400).json({ message: 'Purchase order is already approved.' });
    }

    // Update the status to "Approved" and set the approver details
    purchaseOrder.status = 'Approved';
    purchaseOrder.approved_by = req.user._id;
    purchaseOrder.approved_at = new Date();

    await purchaseOrder.save();

    res.status(200).json({ message: 'Purchase order approved successfully.', purchaseOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const cancelPurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the purchase order by ID
    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    // Check if the purchase order is already canceled
    if (purchaseOrder.status === 'Cancelled') {
      return res.status(400).json({ message: 'Purchase order is already canceled.' });
    }

    // Update the status to "Cancelled"
    purchaseOrder.status = 'Cancelled';
    purchaseOrder.cancelled_by = req.user._id;
    purchaseOrder.cancelled_at = new Date();

    await purchaseOrder.save();

    res.status(200).json({ message: 'Purchase order canceled successfully.', purchaseOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const uploadPurchaseOrderAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Find the purchase order by ID
    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    // Generate a unique filename by appending the current timestamp
    const timestamp = Date.now();
    const originalFilename = req.file.originalname;
    const uniqueFilename = `${timestamp}_${originalFilename}`;

    // Move the file to the uploads directory with the unique filename
    const newPath = path.join('uploads', uniqueFilename);
    fs.renameSync(req.file.path, newPath);

    // Save the unique filename to the purchase order
    purchaseOrder.attachments = purchaseOrder.attachments || [];
    purchaseOrder.attachments.push(uniqueFilename);
    await purchaseOrder.save();

    res.status(200).json({
      message: 'Attachment uploaded successfully.',
      attachments: purchaseOrder.attachments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const downloadPurchaseOrderAttachment = async (req, res) => {
  try {
    const { id, filename } = req.params;

    // Find the purchase order by ID
    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    // Check if the file exists in the attachments
    const fileExistsInDB = purchaseOrder.attachments.includes(filename);
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
