const mongoose = require("mongoose");

const chiTietSuatSchema = new mongoose.Schema({
  MAPHIM: { type: String, required: true, ref: "Phim" },
  MASUAT: { type: String, required: true, ref: "SuatChieu" },
  GIOBATDAU: { type: Date, required: true },
  GIOKETTHUC: { type: Date, required: true },
});

chiTietSuatSchema.index(
  { MAPHIM: 1, MASUAT: 1, GIOBATDAU: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ChiTietSuat",
  chiTietSuatSchema,
  "chi_tiet_suat"
);
