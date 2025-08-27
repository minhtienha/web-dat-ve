const mongoose = require("mongoose");

const gheSchema = new mongoose.Schema({
  MAGHE: { type: String, unique: true },
  MAPHONG: { type: String, required: true, ref: "PhongChieu" },
  HANG: { type: String, required: true }, // VD: "A", "B"
  SO: { type: Number, required: true }, // VD: 1, 2, 3
  LOAIGHE: {
    type: String,
    enum: ["THUONG", "VIP", "DOI"],
    default: "THUONG",
  },
});

gheSchema.pre("save", async function (next) {
  if (this.isNew && !this.MAGHE) {
    const lastGhe = await mongoose
      .model("Ghe")
      .findOne()
      .sort({ MAGHE: -1 })
      .collation({ locale: "en", numericOrdering: true });

    const lastNumber = lastGhe ? parseInt(lastGhe.MAGHE.slice(1)) : 0;
    this.MAGHE = `G${String(lastNumber + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Ghe", gheSchema, "ghe");
