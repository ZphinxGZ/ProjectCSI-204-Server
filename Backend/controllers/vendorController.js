import Vendor from '../models/Vendor.js';

// Add new vendor
export const createVendor = async (req, res) => {
  try {
    const { vendor_name, contact_person, phone, email, address, tax_id, payment_terms } = req.body;

    // Validate required fields
    if (!vendor_name || !email || !tax_id) {
      return res.status(400).json({ message: 'Vendor name, email, and tax ID are required.' });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ tax_id });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor with this tax ID already exists.' });
    }

    // Create a new vendor
    const newVendor = await Vendor.create({
      vendor_name,
      contact_person,
      phone,
      email,
      address,
      tax_id,
      payment_terms,
      created_by: req.user._id,
    });

    res.status(201).json({ message: 'Vendor created successfully.', vendor: newVendor });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update vendor information
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendor_name, contact_person, phone, email, address, tax_id, payment_terms } = req.body;

    // Find the vendor by ID
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    // Update vendor fields
    if (vendor_name) vendor.vendor_name = vendor_name;
    if (contact_person) vendor.contact_person = contact_person;
    if (phone) vendor.phone = phone;
    if (email) vendor.email = email;
    if (address) vendor.address = address;
    if (tax_id) vendor.tax_id = tax_id;
    if (payment_terms) vendor.payment_terms = payment_terms;

    // Save the updated vendor
    const updatedVendor = await vendor.save();

    res.status(200).json({ message: 'Vendor updated successfully.', vendor: updatedVendor });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Delete vendor information
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the vendor by ID
    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    res.status(200).json({ message: 'Vendor deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
