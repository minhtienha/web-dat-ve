const mongoose = require("mongoose");

const suatChieuSchema = new mongoose.Schema(
  {
    MASUAT: { type: String, unique: true },
    MAPHONG: { type: String, required: true, ref: "PhongChieu" },
    NGAYCHIEU: { type: Date, required: true },
  },
  { strictPopulate: false }
);

suatChieuSchema.pre("save", async function (next) {
  if (this.isNew && !this.MASUAT) {
    const lastSuat = await mongoose
      .model("SuatChieu")
      .findOne()
      .sort({ MASUAT: -1 })
      .collation({ locale: "en", numericOrdering: true });

    const lastNumber = lastSuat ? parseInt(lastSuat.MASUAT.slice(2)) : 0;
    this.MASUAT = `SC${String(lastNumber + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("SuatChieu", suatChieuSchema, "suat_chieu");
