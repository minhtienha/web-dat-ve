const express = require("express");
const router = express.Router();
const gheController = require("../controllers/gheController");

router.get("/danh-sach", gheController.layDanhSachGhe);
router.get("/chi-tiet/:maghe", gheController.layGheTheoMa);
router.get(
  "/theo-phong-va-suat/:maphong/:masuat",
  gheController.layGheTheoPhongVaSuat
);
router.post("/them-ghe", gheController.themGhe);
router.post("/seed-phong", gheController.seedGheChoPhong);
router.put("/cap-nhat/:maghe", gheController.capNhatGhe);
router.delete("/xoa-ghe/:maghe", gheController.xoaGhe);

module.exports = router;
