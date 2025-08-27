const SuatChieu = require("../models/Suat_chieu");

// [GET] Lấy danh sách suất chiếu
exports.layDanhSachSuatChieu = async (req, res) => {
  try {
    const danhSachSuatChieu = await SuatChieu.find().populate("MAPHONG");
    res.json(danhSachSuatChieu);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách suất chiếu",
      details: err.message,
    });
  }
};

// [GET] Lấy suất chiếu theo MASUAT
exports.laySuatChieuTheoMa = async (req, res) => {
  const { masuat } = req.params;
  try {
    const suatChieu = await SuatChieu.findOne({ MASUAT: masuat }).populate({
      path: "MAPHONG",
      model: "PhongChieu",
      localField: "MAPHONG",
      foreignField: "MAPHONG",
      select: "MAPHONG TENPHONG RAPCHIEU",
    });
    if (!suatChieu) {
      return res.status(404).json({ error: "Suất chiếu không tồn tại" });
    }
    res.json(suatChieu);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy thông tin suất chiếu",
      details: err.message,
    });
  }
};

// [POST] Thêm suất chiếu mới
exports.themSuatChieu = async (req, res) => {
  try {
    const suatChieuMoi = new SuatChieu(req.body);
    const savedSuatChieu = await suatChieuMoi.save();
    res.status(201).json(savedSuatChieu);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể tạo suất chiếu", details: err.message });
  }
};

// [PUT] Cập nhật suất chiếu
exports.capNhatSuatChieu = async (req, res) => {
  const { masuat } = req.params;
  try {
    const suatChieuCapNhat = await SuatChieu.findOneAndUpdate(
      { MASUAT: masuat },
      req.body,
      { new: true }
    );
    if (!suatChieuCapNhat) {
      return res.status(404).json({ error: "Suất chiếu không tồn tại" });
    }
    res.json(suatChieuCapNhat);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể cập nhật suất chiếu", details: err.message });
  }
};

// [DELETE] Xóa suất chiếu
exports.xoaSuatChieu = async (req, res) => {
  const { masuat } = req.params;
  try {
    const suatChieuXoa = await SuatChieu.findOneAndDelete({ MASUAT: masuat });
    if (!suatChieuXoa) {
      return res.status(404).json({ error: "Suất chiếu không tồn tại" });
    }
    res.json({ message: "Suất chiếu đã được xóa thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi xóa suất chiếu", details: err.message });
  }
};
