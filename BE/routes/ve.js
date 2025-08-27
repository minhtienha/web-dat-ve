const express = require("express");
const router = express.Router();
const veController = require("../controllers/veController");

router.get("/danh-sach", veController.layDanhSachVe);
router.get("/chi-tiet/:mave", veController.layVeTheoMa);
router.post("/them-ve", veController.themVe);
// router.put("/cap-nhat/:mave", veController.capNhatVe);
// router.delete("/xoa-ve/:mave", veController.xoaVe);
router.get("/lay-ve-theo-makh/:makh", veController.layVeTheoMaKH);
// Đặt vé nhiều ghế sau thanh toán thành công
router.post("/dat-ve", veController.datVeNhieuGhe);

module.exports = router;
