import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ผู้ใช้งานที่ทำการเปลี่ยนแปลง
  action: { type: String, required: true }, // การกระทำที่เกิดขึ้น
  table_name: { type: String, required: true }, // ชื่อตารางที่ถูกเปลี่ยนแปลง
  record_id: { type: Number }, // ไอดีของเรคคอร์ดที่ถูกเปลี่ยนแปลง
  old_values: { type: String }, // ค่าก่อนการเปลี่ยนแปลง
  new_values: { type: String }, // ค่าหลังการเปลี่ยนแปลง
  ip_address: { type: String }, // ไอพีแอดเดรสของผู้ใช้งาน
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่บันทึกการเปลี่ยนแปลง
});

export default mongoose.model('AuditLog', auditLogSchema);
