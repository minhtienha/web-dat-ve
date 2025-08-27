const express = require("express");
const router = express.Router();
const rapChieuController = require("../controllers/rapChieuController");

router.get("/danh-sach", rapChieuController.layDanhSachRapChieu);
router.get("/chi-tiet/:marap", rapChieuController.layRapChieuTheoMa);
router.post("/them-rap-chieu", rapChieuController.themRapChieu);
router.put("/cap-nhat/:marap", rapChieuController.capNhatRapChieu);
router.delete("/xoa-rap-chieu/:marap", rapChieuController.xoaRapChieu);

module.exports = router;
