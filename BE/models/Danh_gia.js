const mongoose = require("mongoose");

const danhGiaSchema = new mongoose.Schema({
  MADG: { type: String, unique: true },
  MAPHIM: { type: String, required: true, ref: "Phim" },
  MAKH: { type: String, required: true, ref: "NguoiDung" },
  SOSAO: { type: Number, required: true, min: 1, max: 5 },
  BINHLUAN: { type: String, default: "" },
  NGAYDANHGIA: { type: Date, default: Date.now },
});

// 1 người chỉ được 1 đánh giá / phim
danhGiaSchema.index({ MAPHIM: 1, MAKH: 1 }, { unique: true });

// Auto MADG
danhGiaSchema.pre("save", async function (next) {
  if (this.isNew && !this.MADG) {
    const lastDanhGia = await mongoose
      .model("DanhGia")
      .findOne()
      .sort({ MADG: -1 })
      .collation({ locale: "en", numericOrdering: true });

    const lastNumber = lastDanhGia ? parseInt(lastDanhGia.MADG.slice(2)) : 0;
    this.MADG = `DG${String(lastNumber + 1).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("DanhGia", danhGiaSchema, "danh_gia");
