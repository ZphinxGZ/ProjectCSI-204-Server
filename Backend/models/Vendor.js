import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendor_name: { type: String, required: true }, // ชื่อของผู้ขาย
  contact_person: { type: String }, // ชื่อผู้ติดต่อของผู้ขาย
  phone: { type: String }, // เบอร์โทรศัพท์ของผู้ขาย
  email: { type: String }, // อีเมลของผู้ขาย
  address: { type: String }, // ที่อยู่ของผู้ขาย
  tax_id: { type: String }, // หมายเลขประจำตัวผู้เสียภาษีของผู้ขาย
  payment_terms: { type: String }, // เงื่อนไขการชำระเงินที่ตกลงกับผู้ขาย
  is_approved: { type: Boolean, default: false }, // สถานะการอนุมัติของผู้ขาย
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ผู้ใช้งานที่สร้างข้อมูลผู้ขายนี้
  created_at: { type: Date, default: Date.now } // วันที่และเวลาที่สร้างข้อมูลผู้ขาย
});

export default mongoose.model('Vendor', vendorSchema);
