const mongoose = require("mongoose");

const nguoiDungSchema = new mongoose.Schema({
  MAKH: { type: String, unique: true },
  HOTEN: String,
  EMAIL: { type: String, required: true, unique: true },
  SDT: { type: String, unique: true },
  MATKHAU: { type: String, required: true },
  NGAYDANGKY: { type: Date, default: Date.now },
  VAITRO: {
    type: String,
    enum: ["user", "admin", "manager"],
    default: "user",
  },
  MARAP: { type: String, default: null },
});

// Tạo MAKH tự động trước khi lưu
nguoiDungSchema.pre("save", async function (next) {
  if (this.isNew && !this.MAKH) {
    const lastNguoiDung = await mongoose
      .model("NguoiDung")
      .findOne()
      .sort({ MAKH: -1 })
      .collation({ locale: "en", numericOrdering: true });

    const lastNumber = lastNguoiDung
      ? parseInt(lastNguoiDung.MAKH.slice(2))
      : 0;
    this.MAKH = `KH${String(lastNumber + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("NguoiDung", nguoiDungSchema, "nguoi_dung");
