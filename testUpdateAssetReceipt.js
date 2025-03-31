import axios from 'axios';

const testUpdateAssetReceipt = async () => {
  try {
    const assetReceiptId = '<asset_receipt_id>'; // Replace with a valid asset receipt ID
    const token = '<your_token>'; // Replace with a valid JWT token

    const response = await axios.put(
      `http://localhost:3001/api/assets/receipts/${assetReceiptId}`,
      {
        name: 'Updated Laptop',
        category: 'Updated Electronics',
        serial_number: 'SN654321',
        acquisition_date: '2023-10-10',
        cost: 1600,
        useful_life: 6,
        location: 'Updated Office',
        status: 'Under Maintenance',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testUpdateAssetReceipt();
