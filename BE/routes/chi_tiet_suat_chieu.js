const express = require("express");
const router = express.Router();
const chiTietSCController = require("../controllers/chiTietSCController");

router.get("/danh-sach", chiTietSCController.layDanhSachChiTietSuat);
router.get("/theo-phim/:maphim", chiTietSCController.layChiTietSuatTheoPhim);
router.get(
  "/chi-tiet-ma-suat/:masuat",
  chiTietSCController.layChiTietSuatChieuTheoMaSuat
);
router.get("/day-du", chiTietSCController.layTatCaChiTietDayDu);
router.post("/them-chi-tiet-suat", chiTietSCController.themChiTietSuat);
router.put(
  "/cap-nhat/:maphim/:masuat/:giobatdau",
  chiTietSCController.capNhatChiTietSuat
);
router.delete(
  "/xoa-chi-tiet-suat/:maphim/:masuat/:giobatdau",
  chiTietSCController.xoaChiTietSuat
);

module.exports = router;
