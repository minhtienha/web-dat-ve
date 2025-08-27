const express = require("express");
const router = express.Router();
const suatChieuController = require("../controllers/suatChieuController");

router.get("/danh-sach", suatChieuController.layDanhSachSuatChieu);
router.get("/chi-tiet/:masuat", suatChieuController.laySuatChieuTheoMa);
router.post("/them-suat-chieu", suatChieuController.themSuatChieu);
router.put("/cap-nhat/:masuat", suatChieuController.capNhatSuatChieu);
router.delete("/xoa-suat-chieu/:masuat", suatChieuController.xoaSuatChieu);

module.exports = router;
