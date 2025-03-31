import Inventory from '../models/InventoryItem.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import FixedAsset from '../models/AssetReceipt.js';

export const receiveInventory = async (req, res) => {
  try {
    const { asset_code, quantity, transaction_date, reference_number, notes } = req.body;

    // Validate required fields
    if (!asset_code || !quantity || !transaction_date) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Find the fixed asset by asset_code
    const fixedAsset = await FixedAsset.findOne({ asset_code });
    if (!fixedAsset) {
      return res.status(404).json({ message: 'Fixed asset not found.' });
    }

    // Find the inventory item by item_code (use asset_code as item_code)
    const inventoryItem = await Inventory.findOne({ item_code: asset_code });
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    // Update inventory quantity and total value
    inventoryItem.current_quantity += quantity;
    inventoryItem.total_value = inventoryItem.current_quantity * inventoryItem.unit_cost;
    inventoryItem.last_restock_date = new Date(transaction_date);
    await inventoryItem.save();

    // Create an inventory transaction
    const newTransaction = await InventoryTransaction.create({
      item_id: inventoryItem._id,
      transaction_type: 'Purchase',
      quantity,
      unit_cost: fixedAsset.cost, // Use cost from FixedAsset
      total_cost: quantity * fixedAsset.cost,
      transaction_date,
      reference_number,
      notes,
      processed_by: req.user._id,
    });

    res.status(201).json({
      message: 'Inventory received successfully.',
      inventoryItem,
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const createInventory = async (req, res) => {
  try {
    const { item_code, name, category, unit, min_order, unit_cost } = req.body;

    // Validate required fields
    if (!item_code || !name || !unit || !unit_cost) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if item_code already exists
    const existingItem = await Inventory.findOne({ item_code });
    if (existingItem) {
      return res.status(400).json({ message: 'Item code already exists.' });
    }

    // Create a new inventory item
    const newInventory = await Inventory.create({
      item_code,
      name,
      category,
      unit,
      min_order,
      current_quantity: 0,
      unit_cost,
      total_value: 0,
      last_restock_date: null,
    });

    res.status(201).json({ message: 'Inventory created successfully.', inventory: newInventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
