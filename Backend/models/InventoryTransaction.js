import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true }, // สินค้าที่เกี่ยวข้อง
  po_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' }, // ใบสั่งซื้อที่เกี่ยวข้อง
  transaction_type: { type: String, enum: ['Purchase', 'Issue', 'Adjustment', 'Return'], required: true }, // ประเภทของธุรกรรม
  quantity: { type: Number, required: true }, // จำนวนสินค้า
  unit_cost: { type: Number, required: true }, // ราคาต่อหน่วย
  total_cost: { type: Number }, // มูลค่ารวมของธุรกรรม
  reference_number: { type: String }, // หมายเลขอ้างอิง
  transaction_date: { type: Date, required: true }, // วันที่ทำธุรกรรม
  notes: { type: String }, // หมายเหตุเพิ่มเติม
  processed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้ใช้งานที่ดำเนินการธุรกรรม
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างธุรกรรม
});

export default mongoose.model('InventoryTransaction', inventoryTransactionSchema);
