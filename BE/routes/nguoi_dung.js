const express = require("express");
const router = express.Router();
const nguoiDungController = require("../controllers/nguoiDungController");

router.post("/dang-ky", nguoiDungController.dangKy);
router.post("/dang-nhap", nguoiDungController.dangNhap);
router.get("/chi-tiet/:makh", nguoiDungController.layKhachHangTheoMa);
router.put("/cap-nhat/:makh", nguoiDungController.capNhatKhachHang);
router.put("/cap-nhat-mat-khau", nguoiDungController.capNhatMatKhau);
router.get("/danh-sach", nguoiDungController.layDanhSachNguoiDung);
router.post("/them", nguoiDungController.themNguoiDung);
router.delete("/xoa/:makh", nguoiDungController.xoaKhachHang);

module.exports = router;
