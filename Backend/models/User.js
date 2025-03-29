import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // ชื่อผู้ใช้งานที่ไม่ซ้ำกัน
  password: { type: String, required: true }, // รหัสผ่านที่ถูกเข้ารหัส
  full_name: { type: String, required: true }, // ชื่อเต็มของผู้ใช้งาน
  email: { type: String, required: true }, // อีเมลของผู้ใช้งาน
  role: { type: String, enum: ['Procurement', 'Finance', 'Management', 'Admin'], required: true }, // บทบาทของผู้ใช้งานในระบบ
  department: { type: String }, // แผนกที่ผู้ใช้งานสังกัด
  is_active: { type: Boolean, default: true }, // สถานะการใช้งานของผู้ใช้งาน
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างข้อมูลผู้ใช้งาน
}, { collection: 'Users' }); // Explicitly set the collection name to 'Users'

export default mongoose.model('User', userSchema);
