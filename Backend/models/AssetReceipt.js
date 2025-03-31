import mongoose from 'mongoose';

const fixedAssetSchema = new mongoose.Schema({
  asset_code: { type: String, required: true, unique: true }, // รหัสทรัพย์สิน
  po_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' }, // ไม่จำเป็น
  po_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'POItem' }, // ไม่จำเป็น
  name: { type: String, required: true }, // ชื่อทรัพย์สิน
  category: { type: String }, // หมวดหมู่ของทรัพย์สิน
  serial_number: { type: String }, // หมายเลขซีเรียลของทรัพย์สิน
  acquisition_date: { type: Date, required: true }, // วันที่ได้มาของทรัพย์สิน
  cost: { type: Number, required: true }, // ราคาทรัพย์สิน
  useful_life: { type: Number }, // อายุการใช้งานของทรัพย์สิน
  location: { type: String }, // ตำแหน่งที่ตั้งของทรัพย์สิน
  status: { type: String, enum: ['Active', 'Disposed', 'Under Maintenance'], default: 'Active' }, // สถานะของทรัพย์สิน
  registered_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้ใช้งานที่ลงทะเบียนทรัพย์สิน
  registered_at: { type: Date, default: Date.now } // วันที่และเวลาที่ลงทะเบียนทรัพย์สิน
});

export default mongoose.model('FixedAsset', fixedAssetSchema);
