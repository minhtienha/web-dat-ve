const express = require("express");
const router = express.Router();
const suatChieuController = require("../controllers/suatChieuController");

// Lấy danh sách tất cả suất chiếu
router.get("/danh-sach", suatChieuController.layDanhSachSuatChieu);

// Lấy suất chiếu theo mã suất
router.get("/chi-tiet/:masuat", suatChieuController.laySuatChieuTheoMa);

// Lấy suất chiếu theo mã phim
router.get("/theo-phim/:maphim", suatChieuController.laySuatChieuTheoPhim);

// Lấy tất cả suất chiếu đầy đủ thông tin
router.get("/day-du", suatChieuController.layTatCaSuatChieuDayDu);

// Thêm suất chiếu mới
router.post("/them-suat-chieu", suatChieuController.themSuatChieu);

// Cập nhật suất chiếu
router.put("/cap-nhat/:masuat", suatChieuController.capNhatSuatChieu);

// Xóa suất chiếu
router.delete("/xoa-suat-chieu/:masuat", suatChieuController.xoaSuatChieu);

module.exports = router;
