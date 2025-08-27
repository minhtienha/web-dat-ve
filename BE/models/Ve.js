const mongoose = require("mongoose");

const veSchema = new mongoose.Schema({
  MAVE: { type: String, unique: true },
  MASUAT: { type: String, required: true, ref: "SuatChieu" },
  MAKH: { type: String, required: true, ref: "NguoiDung" },
  NGAYMUA: { type: Date, required: true, default: Date.now },
  GIAVE: { type: Number, required: true },
});

veSchema.pre("save", async function (next) {
  if (this.isNew && !this.MAVE) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.MAVE = `V${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model("Ve", veSchema, "ve");
