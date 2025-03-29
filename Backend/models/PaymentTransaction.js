import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema({
  ap_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountsPayable', required: true }, // ใบแจ้งหนี้ที่เกี่ยวข้อง
  payment_date: { type: Date, required: true }, // วันที่ชำระเงิน
  payment_method: { type: String, enum: ['Transfer', 'Cash', 'Check'], required: true }, // วิธีการชำระเงิน
  amount: { type: Number, required: true }, // จำนวนเงินที่ชำระ
  reference_number: { type: String }, // หมายเลขอ้างอิง
  notes: { type: String }, // หมายเหตุเพิ่มเติม
  processed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้ใช้งานที่ดำเนินการชำระเงิน
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างธุรกรรมการชำระเงิน
});

export default mongoose.model('PaymentTransaction', paymentTransactionSchema);
