import axios from 'axios';

const testRegisterAsset = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/assets/register',
      {
        asset_code: 'FA-002', // เปลี่ยนเป็นค่าใหม่ที่ไม่ซ้ำ
        name: 'Laptop',
        category: 'Electronics',
        serial_number: 'SN123456',
        acquisition_date: '2023-10-01',
        cost: 1500,
        useful_life: 5,
        location: 'Office',
        po_id: '64f8c0f4e4b0a5d1c8e4b123', // เพิ่ม po_id ที่เกี่ยวข้อง
        po_item_id: '64f8c0f4e4b0a5d1c8e4b456', // เพิ่ม po_item_id ที่เกี่ยวข้อง
      },
      {
        headers: {
          Authorization: 'Bearer <your_token>', // Replace <your_token> with a valid JWT token
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testRegisterAsset();
