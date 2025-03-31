import FixedAsset from '../models/AssetReceipt.js';
import POItem from '../models/POItem.js';
import Inventory from '../models/InventoryItem.js'; // Import Inventory model

export const receiveAsset = async (req, res) => {
  try {
    const { po_item_id, po_id, asset_code, name, category, serial_number, acquisition_date, cost, useful_life, location } = req.body;

    // Validate required fields
    if (!po_item_id || !po_id || !asset_code || !name || !acquisition_date || !cost) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if the PO item exists
    const poItem = await POItem.findById(po_item_id);
    if (!poItem) {
      return res.status(404).json({ message: 'PO item not found.' });
    }

    // Check if the asset code already exists
    const existingAsset = await FixedAsset.findOne({ asset_code });
    if (existingAsset) {
      return res.status(400).json({ message: 'Asset with this code already exists.' });
    }

    // Create a new fixed asset
    const newAsset = await FixedAsset.create({
      asset_code,
      po_id,
      po_item_id,
      name,
      category,
      serial_number,
      acquisition_date,
      cost,
      useful_life,
      location,
      registered_by: req.user._id,
    });

    // Add the asset to the inventory
    await Inventory.create({
      item_code: asset_code,
      name,
      category,
      unit: 'Unit', // Default unit, adjust as needed
      current_quantity: 1, // Since it's an asset, quantity is 1
      unit_cost: cost,
      total_value: cost,
      supplier_id: po_id, // Assuming supplier is linked to the PO
    });

    res.status(201).json({ message: 'Asset received successfully.', asset: newAsset });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getAssetReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the asset receipt by ID and populate related fields
    const assetReceipt = await FixedAsset.findById(id)
      .populate('po_id', 'po_number issue_date vendor_id')
      .populate('po_item_id', 'description quantity unit')
      .populate('registered_by', 'full_name email');

    if (!assetReceipt) {
      return res.status(404).json({ message: 'Asset receipt not found.' });
    }

    res.status(200).json({
      message: 'Asset receipt fetched successfully.',
      assetReceipt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const registerAsset = async (req, res) => {
  try {
    const { asset_code, name, category, serial_number, acquisition_date, cost, useful_life, location } = req.body;

    // Validate required fields
    if (!asset_code || !name || !acquisition_date || !cost) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if the asset code already exists
    const existingAsset = await FixedAsset.findOne({ asset_code });
    if (existingAsset) {
      return res.status(400).json({ message: 'Asset with this code already exists.' });
    }

    // Create a new fixed asset
    const newAsset = await FixedAsset.create({
      asset_code,
      name,
      category,
      serial_number,
      acquisition_date,
      cost,
      useful_life,
      location,
      registered_by: req.user._id,
    });

    // Add the asset to the inventory
    await Inventory.create({
      item_code: asset_code,
      name,
      category,
      unit: 'Unit', // Default unit, adjust as needed
      current_quantity: 1, // Since it's an asset, quantity is 1
      unit_cost: cost,
      total_value: cost,
    });

    res.status(201).json({ message: 'Asset registered successfully.', asset: newAsset });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateAssetReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, serial_number, acquisition_date, cost, useful_life, location, status } = req.body;

    // Find the asset receipt by ID
    const assetReceipt = await FixedAsset.findById(id);
    if (!assetReceipt) {
      return res.status(404).json({ message: 'Asset receipt not found.' });
    }

    // Update fields
    assetReceipt.name = name || assetReceipt.name;
    assetReceipt.category = category || assetReceipt.category;
    assetReceipt.serial_number = serial_number || assetReceipt.serial_number;
    assetReceipt.acquisition_date = acquisition_date || assetReceipt.acquisition_date;
    assetReceipt.cost = cost || assetReceipt.cost;
    assetReceipt.useful_life = useful_life || assetReceipt.useful_life;
    assetReceipt.location = location || assetReceipt.location;
    assetReceipt.status = status || assetReceipt.status;

    await assetReceipt.save();

    res.status(200).json({ message: 'Asset receipt updated successfully.', assetReceipt });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
