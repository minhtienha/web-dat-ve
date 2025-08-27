const express = require("express");
const router = express.Router();
const danhGiaController = require("../controllers/danhGiaController");

// Lấy list đánh giá theo phim
router.get("/theo-phim/:maphim", danhGiaController.layDanhGiaTheoPhim);
router.get("/theo-nguoi-dung/:makh", danhGiaController.layDanhGiaTheoNguoiDung);

// Thêm đánh giá mới
router.post("/them", danhGiaController.themDanhGia);

// Cập nhật đánh giá
router.put("/cap-nhat", danhGiaController.capNhatDanhGia);

// Xóa đánh giá
router.delete("/xoa", danhGiaController.xoaDanhGia);

module.exports = router;