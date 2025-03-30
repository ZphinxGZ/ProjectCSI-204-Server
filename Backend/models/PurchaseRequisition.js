import mongoose from 'mongoose';

const purchaseRequisitionSchema = new mongoose.Schema({
  pr_number: { type: String, required: true, unique: true }, // หมายเลขคำขอซื้อที่ไม่ซ้ำกัน
  requester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้ใช้งานที่ร้องขอการซื้อ
  department: { type: String, required: true }, // แผนกที่ร้องขอการซื้อ
  budget_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }, // งบประมาณที่เกี่ยวข้องกับคำขอซื้อ
  request_date: { type: Date, required: true }, // วันที่ร้องขอการซื้อ
  required_date: { type: Date }, // วันที่ต้องการสินค้า/บริการ
  status: { type: String, enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected'], default: 'Draft' }, // สถานะของคำขอซื้อ
  total_amount: { type: Number, required: true }, // ยอดรวมของคำขอซื้อ
  notes: { type: String }, // หมายเหตุเพิ่มเติม
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ผู้ใช้งานที่อนุมัติคำขอซื้อ
  approved_at: { type: Date }, // วันที่และเวลาที่อนุมัติคำขอซื้อ
  attachments: [{ type: String }], // Paths to uploaded attachments
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างคำขอซื้อ
});

export default mongoose.model('PurchaseRequisition', purchaseRequisitionSchema);
