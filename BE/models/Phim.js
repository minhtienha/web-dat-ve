const mongoose = require("mongoose");

const phimSchema = new mongoose.Schema({
  MAPHIM: { type: String, unique: true },
  TENPHIM: { type: String, required: true },
  MOTA: String,
  THOILUONG: { type: Number, required: true }, // phút
  NGAYKHOICHIEU: { type: Date, required: true },
  THELOAI: [String],
  DAODIEN: String,
  DANHSACHDV: [String],
  TRAILER: String,
  POSTER: String,
  HINHANH: [String],
  DANHGIA: { type: Number, default: 0 },
  DANGCHIEU: { type: Boolean, default: false },
  SAPCHIEU: { type: Boolean, default: false },
  NGAYTAO: { type: Date, default: Date.now },
  NGAYCAPNHAT: { type: Date, default: Date.now },
});

// Tự tạo MAPHIM trước khi lưu
phimSchema.pre("save", async function (next) {
  if (this.isNew && !this.MAPHIM) {
    const lastPhim = await mongoose
      .model("Phim")
      .findOne()
      .sort({ MAPHIM: -1 })
      .collation({ locale: "en", numericOrdering: true });
    const lastMaphim = lastPhim ? parseInt(lastPhim.MAPHIM.slice(2)) : 0;
    this.MAPHIM = `PH${String(lastMaphim + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Phim", phimSchema, "phim");
