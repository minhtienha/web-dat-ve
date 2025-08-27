const mongoose = require("mongoose");

const rapChieuSchema = new mongoose.Schema({
  MARAP: { type: String, unique: true },
  TENRAP: { type: String, required: true, trim: true },
  DIACHI: { type: String, required: true, trim: true },
  TINHTHANH: { type: String, required: true, trim: true },
});

// Auto-generate MARAP an toàn hơn (không bị trùng khi xóa giữa chừng)
rapChieuSchema.pre("save", async function (next) {
  if (this.isNew && !this.MARAP) {
    const lastRap = await mongoose
      .model("RapChieu")
      .findOne({})
      .sort({ MARAP: -1 })
      .collation({ locale: "en_US", numericOrdering: true });

    const lastNumber = lastRap ? parseInt(lastRap.MARAP.slice(1)) : 0;
    this.MARAP = `R${String(lastNumber + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("RapChieu", rapChieuSchema, "rap_chieu");
