import mongoose from 'mongoose';

const poItemSchema = new mongoose.Schema({
  po_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true }, // ใบสั่งซื้อที่เกี่ยวข้อง
  pr_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PRItem', required: true }, // รายการในคำขอซื้อที่เกี่ยวข้อง
  description: { type: String, required: true }, // รายละเอียดสินค้า/บริการ
  quantity: { type: Number, required: true }, // จำนวนสินค้า/บริการ
  unit: { type: String, required: true }, // หน่วยของสินค้า/บริการ
  unit_price: { type: Number, required: true }, // ราคาต่อหน่วย
  total_price: { type: Number }, // มูลค่ารวม
  received_quantity: { type: Number, default: 0 }, // จำนวนสินค้าที่ได้รับแล้ว
  remaining_quantity: { type: Number } // จำนวนสินค้าที่เหลืออยู่
});

export default mongoose.model('POItem', poItemSchema);
