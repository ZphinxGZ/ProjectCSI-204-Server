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
