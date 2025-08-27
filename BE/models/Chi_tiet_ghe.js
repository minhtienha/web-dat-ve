const mongoose = require("mongoose");

const chiTietGheSchema = new mongoose.Schema({
  MAGHE: { type: String, required: true, ref: "Ghe" },
  MASUAT: { type: String, required: true, ref: "SuatChieu" },
  MAVE: { type: String, default: null, ref: "Ve" },
  TRANGTHAI: {
    type: String,
    enum: ["TRONG", "DADAT"],
    default: "TRONG",
  },
});

chiTietGheSchema.index({ MAGHE: 1, MASUAT: 1 }, { unique: true });

module.exports = mongoose.model("ChiTietGhe", chiTietGheSchema, "chi_tiet_ghe");
