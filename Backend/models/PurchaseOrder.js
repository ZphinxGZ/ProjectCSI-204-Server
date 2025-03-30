import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  po_number: { type: String, required: true, unique: true }, // หมายเลขใบสั่งซื้อที่ไม่ซ้ำกัน
  pr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseRequisition', required: true }, // คำขอซื้อที่เกี่ยวข้อง
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, // ผู้ขายที่เกี่ยวข้องกับใบสั่งซื้อ
  issuer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้ใช้งานที่ออกใบสั่งซื้อ
  issue_date: { type: Date, required: true }, // วันที่ออกใบสั่งซื้อ
  expected_delivery_date: { type: Date }, // วันที่คาดว่าจะได้รับสินค้า/บริการ
  status: { type: String, enum: ['Draft', 'Approved', 'Rejected', 'Cancelled'], default: 'Draft' }, // สถานะของใบสั่งซื้อ
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ผู้ใช้งานที่อนุมัติใบสั่งซื้อ
  approved_at: { type: Date }, // วันที่และเวลาที่อนุมัติใบสั่งซื้อ
  cancelled_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ผู้ใช้งานที่ยกเลิกใบสั่งซื้อ
  cancelled_at: { type: Date }, // วันที่และเวลาที่ยกเลิกใบสั่งซื้อ
  payment_terms: { type: String }, // เงื่อนไขการชำระเงิน
  subtotal: { type: Number, required: true }, // ยอดรวมก่อนภาษี
  tax: { type: Number, default: 0 }, // จำนวนภาษี
  total_amount: { type: Number }, // ยอดรวมทั้งหมด
  notes: { type: String }, // หมายเหตุเพิ่มเติม
  attachments: [{ type: String }], // Paths to uploaded attachments
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างใบสั่งซื้อ
});

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
