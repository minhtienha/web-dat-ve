const RapChieu = require("../models/Rap_chieu");

// [GET] Lấy danh sách rạp chiếu
exports.layDanhSachRapChieu = async (req, res) => {
  try {
    const danhSachRapChieu = await RapChieu.find();
    res.json(danhSachRapChieu);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách rạp chiếu", details: err.message });
  }
};

// [GET] Lấy rạp chiếu theo MARAP
exports.layRapChieuTheoMa = async (req, res) => {
  const { marap } = req.params;
  try {
    const rapChieu = await RapChieu.findOne({ MARAP: marap });
    if (!rapChieu) {
      return res.status(404).json({ error: "Rạp chiếu không tồn tại" });
    }
    res.json(rapChieu);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy thông tin rạp chiếu", details: err.message });
  }
};

// [POST] Thêm rạp chiếu mới
exports.themRapChieu = async (req, res) => {
  try {
    const rapChieuMoi = new RapChieu(req.body);
    const savedRapChieu = await rapChieuMoi.save();
    res.status(201).json(savedRapChieu);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể tạo rạp chiếu", details: err.message });
  }
};

// [PUT] Cập nhật rạp chiếu
exports.capNhatRapChieu = async (req, res) => {
  const { marap } = req.params;
  try {
    const rapChieuCapNhat = await RapChieu.findOneAndUpdate(
      { MARAP: marap },
      req.body,
      { new: true }
    );
    if (!rapChieuCapNhat) {
      return res.status(404).json({ error: "Rạp chiếu không tồn tại" });
    }
    res.json(rapChieuCapNhat);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể cập nhật rạp chiếu", details: err.message });
  }
};

// [DELETE] Xóa rạp chiếu
exports.xoaRapChieu = async (req, res) => {
  const { marap } = req.params;
  try {
    const rapChieuXoa = await RapChieu.findOneAndDelete({ MARAP: marap });
    if (!rapChieuXoa) {
      return res.status(404).json({ error: "Rạp chiếu không tồn tại" });
    }
    res.json({ message: "Rạp chiếu đã được xóa thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi xóa rạp chiếu", details: err.message });
  }
};
