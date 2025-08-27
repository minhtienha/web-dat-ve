const mongoose = require("mongoose");

const phongChieuSchema = new mongoose.Schema({
  MAPHONG: { type: String, unique: true },
  TENPHONG: { type: String, required: true },
  MARAP: { type: String, required: true, ref: "RapChieu" },
});

phongChieuSchema.pre("save", async function (next) {
  if (this.isNew && !this.MAPHONG) {
    const lastPhong = await mongoose
      .model("PhongChieu")
      .findOne()
      .sort({ MAPHONG: -1 })
      .collation({ locale: "en", numericOrdering: true });

    const lastNumber = lastPhong ? parseInt(lastPhong.MAPHONG.slice(1)) : 0;
    this.MAPHONG = `P${String(lastNumber + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("PhongChieu", phongChieuSchema, "phong_chieu");
