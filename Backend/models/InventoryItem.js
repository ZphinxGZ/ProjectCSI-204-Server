import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  item_code: { type: String, required: true, unique: true }, // Asset code or inventory code
  name: { type: String, required: true }, // ชื่อสินค้า
  category: { type: String }, // หมวดหมู่สินค้า
  unit: { type: String, required: true }, // หน่วยของสินค้า
  min_order: { type: Number, default: 0 }, // จำนวนขั้นต่ำในการสั่งซื้อ
  current_quantity: { type: Number, default: 0 }, // จำนวนสินค้าคงคลังปัจจุบัน
  unit_cost: { type: Number, required: true }, // ราคาต่อหน่วยของสินค้า
  total_value: { type: Number }, // มูลค่ารวมของสินค้า
  last_restock_date: { type: Date }, // วันที่เติมสินค้าในคลังครั้งล่าสุด
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' } // ผู้ขายที่เกี่ยวข้อง
});

export default mongoose.model('Inventory', inventorySchema);
