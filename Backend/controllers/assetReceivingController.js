import FixedAsset from '../models/AssetReceipt.js';
import POItem from '../models/POItem.js';

export const receiveAsset = async (req, res) => {
  try {
    const { po_item_id, asset_code, name, category, serial_number, acquisition_date, cost, useful_life, location } = req.body;

    // Validate required fields
    if (!po_item_id || !asset_code || !name || !acquisition_date || !cost) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if the PO item exists
    const poItem = await POItem.findById(po_item_id);
    if (!poItem) {
      return res.status(404).json({ message: 'PO item not found.' });
    }

    // Check if the asset code is unique
    const existingAsset = await FixedAsset.findOne({ asset_code });
    if (existingAsset) {
      return res.status(400).json({ message: 'Asset code already exists.' });
    }

    // Create a new fixed asset
    const newAsset = await FixedAsset.create({
      asset_code,
      po_id: poItem.po_id,
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

    res.status(201).json({ message: 'Asset received successfully.', asset: newAsset });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
