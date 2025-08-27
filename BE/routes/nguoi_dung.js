const express = require("express");
const router = express.Router();
const nguoiDungController = require("../controllers/nguoiDungController");

router.post("/dang-ky", nguoiDungController.dangKy);
router.post("/dang-nhap", nguoiDungController.dangNhap);
router.get("/chi-tiet/:makh", nguoiDungController.layKhachHangTheoMa);
router.put("/cap-nhat/:makh", nguoiDungController.capNhatKhachHang);

module.exports = router;
