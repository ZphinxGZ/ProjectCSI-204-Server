import axios from 'axios';

const testReceiveInventory = async () => {
  try {
    const token = '<your_token>'; // Replace with a valid JWT token
    const response = await axios.post(
      'http://localhost:3001/api/inventory/receive',
      {
        asset_code: 'FA-001', // Replace with a valid asset code from FixedAsset
        quantity: 10,
        transaction_date: '2023-10-10',
        reference_number: 'REF12345',
        notes: 'Restocking inventory',
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

testReceiveInventory();
