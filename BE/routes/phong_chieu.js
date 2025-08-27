const express = require("express");
const router = express.Router();
const phongChieuController = require("../controllers/phongChieuController");

router.get("/danh-sach", phongChieuController.layDanhSachPhongChieu);
router.get("/chi-tiet/:maphong", phongChieuController.layPhongChieuTheoMa);
router.post("/them-phong-chieu", phongChieuController.themPhongChieu);
router.put("/cap-nhat/:maphong", phongChieuController.capNhatPhongChieu);
router.delete("/xoa-phong-chieu/:maphong", phongChieuController.xoaPhongChieu);

module.exports = router;
