const ChiTietSuat = require("../models/Chi_tiet_suat_chieu");

// [GET] Lấy danh sách chi tiết suất chiếu
exports.layDanhSachChiTietSuat = async (req, res) => {
  try {
    const danhSachChiTietSuat = await ChiTietSuat.find()
      .populate({
        path: "MAPHIM",
        model: "Phim",
        localField: "MAPHIM",
        foreignField: "MAPHIM",
        select: "TENPHIM THOILUONG",
      })
      .populate({
        path: "MASUAT",
        model: "SuatChieu",
        localField: "MASUAT",
        foreignField: "MASUAT",
        select: "MAPHONG NGAYCHIEU",
      });
    res.json(danhSachChiTietSuat);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách chi tiết suất chiếu",
      details: err.message,
    });
  }
};

// [GET] Lấy chi tiết suất chiếu theo MASUAT
exports.layChiTietSuatChieuTheoMaSuat = async (req, res) => {
  const { masuat } = req.params;
  try {
    const chiTietSuat = await ChiTietSuat.find({ MASUAT: masuat })
      .populate({
        path: "MAPHIM",
        model: "Phim",
        localField: "MAPHIM",
        foreignField: "MAPHIM",
        select: "TENPHIM THOILUONG",
      })
      .populate({
        path: "MASUAT",
        model: "SuatChieu",
        localField: "MASUAT",
        foreignField: "MASUAT",
        select: "MAPHONG NGAYCHIEU",
      });
    if (!chiTietSuat.length) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy suất chiếu cho mã suất này" });
    }
    res.json(chiTietSuat);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy chi tiết suất chiếu", details: err.message });
  }
};

// [GET] Lấy tất cả chi tiết suất chiếu kèm phim, phòng, rạp
exports.layTatCaChiTietDayDu = async (req, res) => {
  try {
    const chiTiet = await ChiTietSuat.find()
      .populate({
        path: "MAPHIM",
        model: "Phim",
        localField: "MAPHIM",
        foreignField: "MAPHIM",
        justOne: true,
        select: "MAPHIM TENPHIM",
      })
      .populate({
        path: "MASUAT",
        model: "SuatChieu",
        localField: "MASUAT",
        foreignField: "MASUAT",
        justOne: true,
        select: "MASUAT NGAYCHIEU MAPHONG",
        populate: {
          path: "MAPHONG",
          model: "PhongChieu",
          localField: "MASUAT.MAPHONG",
          foreignField: "MAPHONG",
          justOne: true,
          select: "MAPHONG TENPHONG MARAP",
          populate: {
            path: "MARAP",
            model: "RapChieu",
            localField: "MAPHONG.MARAP",
            foreignField: "MARAP",
            justOne: true,
            select: "MARAP TENRAP",
          },
        },
      });
    res.json(chiTiet);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy chi tiết suất chiếu đầy đủ",
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
