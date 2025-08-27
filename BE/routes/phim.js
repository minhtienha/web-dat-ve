const express = require("express");
const router = express.Router();
const phimController = require("../controllers/phimController");

router.get("/danh-sach", phimController.layDanhSachPhim);
router.get("/chi-tiet/:maphim", phimController.layPhimTheoMa);
router.post("/them-phim", phimController.themPhim);
router.put("/cap-nhat/:maphim", phimController.capNhatPhim);
router.delete("/xoa-phim/:maphim", phimController.xoaPhim);
router.get("/tim-kiem", phimController.timKiemPhim);
router.get("/danh-sach-dang-chieu", phimController.layPhimDangChieu);
router.get("/danh-sach-sap-chieu", phimController.layPhimSapChieu);
router.post("/cap-nhat-phim-sap-chieu", phimController.capNhatPhimSapChieu);

module.exports = router;
