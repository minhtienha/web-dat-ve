const ChiTietSuat = require("../models/Chi_tiet_suat_chieu");

// [GET] Lấy danh sách chi tiết suất chiếu
exports.layDanhSachChiTietSuat = async (req, res) => {
  try {
    const danhSachChiTietSuat = await ChiTietSuat.find().populate(
      "MAPHIM MASUAT"
    );
    res.json(danhSachChiTietSuat);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách chi tiết suất chiếu",
      details: err.message,
    });
  }
};

// [GET] Lấy chi tiết suất chiếu theo MAPHIM
exports.layChiTietSuatTheoPhim = async (req, res) => {
  const { maphim } = req.params;
  try {
    const chiTietSuat = await ChiTietSuat.find({ MAPHIM: maphim })
      .populate({
        path: "MASUAT",
        model: "SuatChieu",
        localField: "MASUAT",
        foreignField: "MASUAT",
        select: "MASUAT MAPHONG NGAYCHIEU",
      })
      .select("GIOBATDAU GIOKETTHUC");
    if (!chiTietSuat.length) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy suất chiếu cho phim này" });
    }
    res.json(chiTietSuat);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy chi tiết suất chiếu", details: err.message });
  }
};

// [POST] Thêm chi tiết suất chiếu mới
exports.themChiTietSuat = async (req, res) => {
  try {
    const chiTietSuatMoi = new ChiTietSuat(req.body);
    const savedChiTietSuat = await chiTietSuatMoi.save();
    res.status(201).json(savedChiTietSuat);
  } catch (err) {
    res.status(400).json({
      error: "Không thể tạo chi tiết suất chiếu",
      details: err.message,
    });
  }
};

// [PUT] Cập nhật chi tiết suất chiếu
exports.capNhatChiTietSuat = async (req, res) => {
  const { maphim, masuat, giobatdau } = req.params;
  try {
    const chiTietSuatCapNhat = await ChiTietSuat.findOneAndUpdate(
      { MAPHIM: maphim, MASUAT: masuat, GIOBATDAU: new Date(giobatdau) },
      req.body,
      { new: true }
    );
    if (!chiTietSuatCapNhat) {
      return res
        .status(404)
        .json({ error: "Chi tiết suất chiếu không tồn tại" });
    }
    res.json(chiTietSuatCapNhat);
  } catch (err) {
    res.status(400).json({
      error: "Không thể cập nhật chi tiết suất chiếu",
      details: err.message,
    });
  }
};

// [DELETE] Xóa chi tiết suất chiếu
exports.xoaChiTietSuat = async (req, res) => {
  const { maphim, masuat, giobatdau } = req.params;
  try {
    const chiTietSuatXoa = await ChiTietSuat.findOneAndDelete({
      MAPHIM: maphim,
      MASUAT: masuat,
      GIOBATDAU: new Date(giobatdau),
    });
    if (!chiTietSuatXoa) {
      return res
        .status(404)
        .json({ error: "Chi tiết suất chiếu không tồn tại" });
    }
    res.json({ message: "Chi tiết suất chiếu đã được xóa thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi xóa chi tiết suất chiếu", details: err.message });
  }
};
