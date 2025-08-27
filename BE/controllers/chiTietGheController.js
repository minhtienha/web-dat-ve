const ChiTietGhe = require("../models/Chi_tiet_ghe");

// [GET] Lấy danh sách chi tiết ghế
exports.layDanhSachChiTietGhe = async (req, res) => {
  try {
    const danhSachChiTietGhe = await ChiTietGhe.find().populate("MAGHE MAVE");
    res.json(danhSachChiTietGhe);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách chi tiết ghế",
      details: err.message,
    });
  }
};

// [PUT] Cập nhật chi tiết ghế
exports.capNhatChiTietGhe = async (req, res) => {
  const { maghe, mave } = req.params;
  try {
    const updatedChiTietGhe = await ChiTietGhe.findOneAndUpdate(
      { MAGHE: maghe, MAVE: mave },
      req.body,
      { new: true }
    );
    if (!updatedChiTietGhe) {
      return res.status(404).json({ error: "Chi tiết ghế không tồn tại" });
    }
    res.json(updatedChiTietGhe);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi cập nhật chi tiết ghế",
      details: err.message,
    });
  }
};

// [DELETE] Xóa chi tiết ghế
exports.xoaChiTietGhe = async (req, res) => {
  const { maghe, mave } = req.params;
  try {
    const deletedChiTietGhe = await ChiTietGhe.findOneAndDelete({
      MAGHE: maghe,
      MAVE: mave,
    });
    if (!deletedChiTietGhe) {
      return res.status(404).json({ error: "Chi tiết ghế không tồn tại" });
    }
    res.json({ message: "Xóa chi tiết ghế thành công" });
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi xóa chi tiết ghế",
      details: err.message,
    });
  }
};

// [GET] Lấy chi tiết ghế theo MAGHE và MAVE
exports.layChiTietGheTheoMa = async (req, res) => {
  const { maghe, mave } = req.params;
  try {
    const chiTietGhe = await ChiTietGhe.findOne({
      MAGHE: maghe,
      MAVE: mave,
    }).populate("MAGHE MAVE");
    if (!chiTietGhe) {
      return res.status(404).json({ error: "Chi tiết ghế không tồn tại" });
    }
    res.json(chiTietGhe);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy thông tin chi tiết ghế",
      details: err.message,
    });
  }
};

// [POST] Thêm chi tiết ghế mới
exports.themChiTietGhe = async (req, res) => {
  try {
    const chiTietGheMoi = new ChiTietGhe(req.body);
    const savedChiTietGhe = await chiTietGheMoi.save();
    res.status(201).json(savedChiTietGhe);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể tạo chi tiết ghế", details: err.message });
  }
};
