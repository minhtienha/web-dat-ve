const express = require("express");
const router = express.Router();
const chiTietGheController = require("../controllers/chiTietGheController");

router.get("/danh-sach", chiTietGheController.layDanhSachChiTietGhe);
router.get("/chi-tiet/:maghe/:mave", chiTietGheController.layChiTietGheTheoMa);
router.post("/them-chi-tiet-ghe", chiTietGheController.themChiTietGhe);
router.put("/cap-nhat/:maghe/:mave", chiTietGheController.capNhatChiTietGhe);
router.delete(
  "/xoa-chi-tiet-ghe/:maghe/:mave",
  chiTietGheController.xoaChiTietGhe
);

module.exports = router;
