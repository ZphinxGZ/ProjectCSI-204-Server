import Inventory from '../models/InventoryItem.js';
import InventoryTransaction from '../models/InventoryTransaction.js';

export const receiveInventory = async (req, res) => {
  try {
    const { item_code, quantity, unit_cost, transaction_date, reference_number, notes } = req.body;

    // Validate required fields
    if (!item_code || !quantity || !unit_cost || !transaction_date) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Find the inventory item by item_code
    const inventoryItem = await Inventory.findOne({ item_code });
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    // Update inventory quantity and total value
    inventoryItem.current_quantity += quantity;
    inventoryItem.total_value = inventoryItem.current_quantity * inventoryItem.unit_cost;
    inventoryItem.last_restock_date = transaction_date;
    await inventoryItem.save();

    // Create an inventory transaction
    const newTransaction = await InventoryTransaction.create({
      item_id: inventoryItem._id,
      transaction_type: 'Purchase',
      quantity,
      unit_cost,
      total_cost: quantity * unit_cost,
      reference_number,
      transaction_date,
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

export const issueInventory = async (req, res) => {
  try {
    const { item_code, quantity, transaction_date, reference_number, notes } = req.body;

    // Validate required fields
    if (!item_code || !quantity || !transaction_date) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Find the inventory item by item_code
    const inventoryItem = await Inventory.findOne({ item_code });
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    // Check if there is enough quantity to issue
    if (inventoryItem.current_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient inventory quantity.' });
    }

    // Update inventory quantity and total value
    inventoryItem.current_quantity -= quantity;
    inventoryItem.total_value = inventoryItem.current_quantity * inventoryItem.unit_cost;
    await inventoryItem.save();

    // Create an inventory transaction
    const newTransaction = await InventoryTransaction.create({
      item_id: inventoryItem._id,
      transaction_type: 'Issue',
      quantity,
      unit_cost: inventoryItem.unit_cost,
      total_cost: quantity * inventoryItem.unit_cost,
      reference_number,
      transaction_date,
      notes,
      processed_by: req.user._id,
    });

    res.status(201).json({
      message: 'Inventory issued successfully.',
      inventoryItem,
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.status(200).json({
      message: 'Inventory items fetched successfully.',
      inventoryItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, unit, min_order, unit_cost, current_quantity } = req.body;

    // Find the inventory item by ID
    const inventoryItem = await Inventory.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    // Update fields
    inventoryItem.name = name || inventoryItem.name;
    inventoryItem.category = category || inventoryItem.category;
    inventoryItem.unit = unit || inventoryItem.unit;
    inventoryItem.min_order = min_order !== undefined ? min_order : inventoryItem.min_order;
    inventoryItem.unit_cost = unit_cost !== undefined ? unit_cost : inventoryItem.unit_cost;
    inventoryItem.current_quantity = current_quantity !== undefined ? current_quantity : inventoryItem.current_quantity;

    // Recalculate total value
    inventoryItem.total_value = inventoryItem.current_quantity * inventoryItem.unit_cost;

    await inventoryItem.save();

    res.status(200).json({ message: 'Inventory item updated successfully.', inventoryItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
