// ===== 1. IMPORT CÁC MODULE ===== //
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// ===== 2. IMPORT ROUTES ===== //
const nguoiDungRoutes = require("./routes/nguoi_dung");
const phimRoutes = require("./routes/phim");
const veRoutes = require("./routes/ve");
const gheRoutes = require("./routes/ghe");
const chiTietSuatRoutes = require("./routes/chi_tiet_suat_chieu");
const danhGiaRoutes = require("./routes/danh_gia");
const rapChieuRoutes = require("./routes/rap_chieu");
const chiTietGheRoutes = require("./routes/chi_tiet_ghe");
const suatChieuRoutes = require("./routes/suat_chieu");
const phongChieuRoutes = require("./routes/phong_chieu");
const paymentRoutes = require("./routes/payment");
const phimController = require("./controllers/phimController");

// ===== 3. KHAI BÁO APP EXPRESS ===== //
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ===== 4. MIDDLEWARE ===== //
app.use(cors());
app.use(express.json());

// ===== 5. ROUTES API ===== //
app.use("/api/nguoidung", nguoiDungRoutes);
app.use("/api/phim", phimRoutes);
app.use("/api/ve", veRoutes);
app.use("/api/ghe", gheRoutes);
app.use("/api/chitietsuatchieu", chiTietSuatRoutes);
app.use("/api/rapchieu", rapChieuRoutes);
app.use("/api/chitietghe", chiTietGheRoutes);
app.use("/api/suatchieu", suatChieuRoutes);
app.use("/api/phongchieu", phongChieuRoutes);
app.use("/api/danhgia", danhGiaRoutes);
app.use("/api/payment", paymentRoutes);

// ===== 6. KẾT NỐI DATABASE ===== //
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ===== 7. ROUTE TEST ===== //
app.get("/", (req, res) => {
  res.send("✅ Server running...");
});

// ===== 8. TỰ ĐỘNG CẬP NHẬT PHIM SẮP CHIẾU ===== //
cron.schedule(
  "*/1 * * * *",
  async () => {
    try {
      const req = {}; // Fake req object
      const res = {
        json: (data) => console.log("✅ Kết quả cập nhật:", data), // Log kết quả
        status: (code) => ({
          json: (err) => console.error("❌ Lỗi cập nhật:", err), // Log lỗi
        }),
      };
      await phimController.capNhatPhimSapChieu(req, res);
    } catch (err) {
      console.error("❌ Lỗi khi chạy cron job:", err);
    }
  },
  {
    timezone: "Asia/Ho_Chi_Minh", // Đặt timezone cho Việt Nam
  }
);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

// ===== 9. CHẠY SERVER ===== //
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = { app, server, io };
