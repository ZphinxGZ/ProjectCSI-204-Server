import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  fiscal_year: { type: String, required: true }, // ปีงบประมาณ
  department: { type: String, required: true }, // แผนกที่เกี่ยวข้อง
  budget_type: { type: String, enum: ['Asset', 'Inventory'], required: true }, // ประเภทของงบประมาณ
  total_amount: { type: Number, required: true }, // จำนวนเงินทั้งหมดในงบประมาณ
  remaining_amount: { type: Number, required: true }, // จำนวนเงินที่เหลืออยู่ในงบประมาณ
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างงบประมาณ
});

export default mongoose.model('Budget', budgetSchema);
