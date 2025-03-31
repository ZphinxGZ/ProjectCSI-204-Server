import PurchaseOrder from '../models/PurchaseOrder.js';
import AccountsPayable from '../models/AccountsPayable.js';
import Inventory from '../models/InventoryItem.js';

export const getProcurementSummary = async (req, res) => {
  try {
    // Aggregate total purchase orders
    const totalPOs = await PurchaseOrder.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$total_amount' },
          totalApproved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$total_amount', 0] } },
          totalCancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, '$total_amount', 0] } },
        },
      },
    ]);

    // Aggregate accounts payable balances
    const totalAPs = await AccountsPayable.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPaid: { $sum: '$paid_amount' },
          totalRemaining: { $sum: '$remaining_amount' },
        },
      },
    ]);

    // Prepare the response
    const procurementSummary = {
      purchaseOrders: totalPOs.length > 0 ? totalPOs[0] : { totalAmount: 0, totalApproved: 0, totalCancelled: 0 },
      accountsPayable: totalAPs.length > 0 ? totalAPs[0] : { totalAmount: 0, totalPaid: 0, totalRemaining: 0 },
    };

    res.status(200).json({
      message: 'Procurement summary report fetched successfully.',
      procurementSummary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getExpendituresReport = async (req, res) => {
  try {
    // Aggregate expenditures from accounts payable
    const expenditures = await AccountsPayable.aggregate([
      {
        $group: {
          _id: { year: { $year: '$invoice_date' }, month: { $month: '$invoice_date' } },
          totalExpenditure: { $sum: '$paid_amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.status(200).json({
      message: 'Expenditures report fetched successfully.',
      expenditures,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getInventorySummary = async (req, res) => {
  try {
    // Aggregate inventory data
    const inventorySummary = await Inventory.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$current_quantity' },
          totalValue: { $sum: '$total_value' },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by category
      },
    ]);

    res.status(200).json({
      message: 'Inventory summary report fetched successfully.',
      inventorySummary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getAccountsPayableReport = async (req, res) => {
  try {
    // Aggregate accounts payable data
    const accountsPayableReport = await AccountsPayable.aggregate([
      {
        $lookup: {
          from: 'vendors', // Join with the Vendor collection
          localField: 'vendor_id',
          foreignField: '_id',
          as: 'vendorDetails',
        },
      },
      {
        $unwind: '$vendorDetails', // Unwind the vendor details
      },
      {
        $project: {
          _id: 1,
          invoice_number: 1,
          invoice_date: 1,
          due_date: 1,
          amount: 1,
          paid_amount: 1,
          remaining_amount: 1,
          status: 1,
          'vendorDetails.vendor_name': 1,
          'vendorDetails.contact_person': 1,
        },
      },
      {
        $sort: { due_date: 1 }, // Sort by due date
      },
    ]);

    res.status(200).json({
      message: 'Accounts payable report fetched successfully.',
      accountsPayableReport,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
