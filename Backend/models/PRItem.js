import mongoose from 'mongoose';

const prItemSchema = new mongoose.Schema({
  pr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseRequisition', required: true }, // คำขอซื้อที่เกี่ยวข้อง
  item_type: { type: String, enum: ['Asset', 'Inventory'], required: true }, // ประเภทของรายการ (ทรัพย์สินหรือสินค้าคงคลัง)
  description: { type: String, required: true }, // รายละเอียดสินค้า/บริการ
  quantity: { type: Number, required: true }, // จำนวนสินค้า/บริการ
  unit: { type: String, required: true }, // หน่วยของสินค้า/บริการ
  estimated_price: { type: Number, required: true }, // ราคาประมาณการต่อหน่วย
  total_price: { type: Number }, // มูลค่ารวม
  needed_date: { type: Date }, // วันที่ต้องการสินค้า/บริการ
  notes: { type: String } // หมายเหตุเพิ่มเติม
});

export default mongoose.model('PRItem', prItemSchema);
