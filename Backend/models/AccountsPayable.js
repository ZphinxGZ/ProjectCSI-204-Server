import mongoose from 'mongoose';

const accountsPayableSchema = new mongoose.Schema({
  po_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true }, // ใบสั่งซื้อที่เกี่ยวข้อง
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, // ผู้ขายที่เกี่ยวข้อง
  invoice_number: { type: String, required: true }, // หมายเลขใบแจ้งหนี้
  invoice_date: { type: Date, required: true }, // วันที่ในใบแจ้งหนี้
  due_date: { type: Date, required: true }, // วันที่ครบกำหนดชำระเงิน
  amount: { type: Number, required: true }, // จำนวนเงินทั้งหมดในใบแจ้งหนี้
  paid_amount: { type: Number, default: 0 }, // จำนวนเงินที่ชำระแล้ว
  remaining_amount: { type: Number }, // จำนวนเงินที่เหลืออยู่
  status: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' }, // สถานะการชำระเงิน
  notes: { type: String }, // หมายเหตุเพิ่มเติม
  attachments: [{ type: String }], // Paths to uploaded attachments
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างข้อมูล
});

export default mongoose.model('AccountsPayable', accountsPayableSchema);
