const SuatChieuMerged = require("../models/Suat_chieu");
const ChiTietSuat = require("../models/Chi_tiet_suat_chieu");

// [GET] Lấy danh sách tất cả suất chiếu (merged)
exports.layDanhSachSuatChieu = async (req, res) => {
  try {
    const danhSachSuatChieu = await SuatChieuMerged.find()
      .populate({
        path: "MAPHONG",
        model: "PhongChieu",
        select: "MAPHONG TENPHONG MARAP",
        populate: {
          path: "MARAP",
          model: "RapChieu",
          select: "MARAP TENRAP",
        },
      })
      .populate({
        path: "MAPHIM",
        model: "Phim",
        select: "MAPHIM TENPHIM THOILUONG",
      });
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
    const suatChieu = await SuatChieuMerged.findOne({ MASUAT: masuat })
      .populate({
        path: "MAPHONG",
        model: "PhongChieu",
        select: "MAPHONG TENPHONG MARAP",
        populate: {
          path: "MARAP",
          model: "RapChieu",
          select: "MARAP TENRAP",
        },
      })
      .populate({
        path: "MAPHIM",
        model: "Phim",
        select: "MAPHIM TENPHIM THOILUONG",
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

// [GET] Lấy suất chiếu theo MAPHIM (phim)
exports.laySuatChieuTheoPhim = async (req, res) => {
  const { maphim } = req.params;
  try {
    const suatChieu = await SuatChieuMerged.find({ MAPHIM: maphim })
      .populate({
        path: "MAPHONG",
        model: "PhongChieu",
        localField: "MAPHONG",
        foreignField: "MAPHONG",
        select: "MAPHONG TENPHONG MARAP",
        populate: {
          path: "MARAP",
          model: "RapChieu",
          localField: "MARAP",
          foreignField: "MARAP",
          select: "MARAP TENRAP DIACHI TINHTHANH",
        },
      })
      .select("GIOBATDAU GIOKETTHUC NGAYCHIEU MASUAT MAPHONG");

    if (!suatChieu.length) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy suất chiếu cho phim này" });
    }
    res.json(suatChieu);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy suất chiếu theo phim",
      details: err.message,
    });
  }
};

// [GET] Lấy tất cả suất chiếu đầy đủ thông tin (phim, phòng, rạp)
exports.layTatCaSuatChieuDayDu = async (req, res) => {
  try {
    console.log("Fetching all showtimes with full details...");
    const suatChieu = await SuatChieuMerged.find()
      .populate({
        path: "MAPHIM",
        model: "Phim",
        localField: "MAPHIM",
        foreignField: "MAPHIM",
        select: "MAPHIM TENPHIM",
      })
      .populate({
        path: "MAPHONG",
        model: "PhongChieu",
        localField: "MAPHONG",
        foreignField: "MAPHONG",
        select: "MAPHONG TENPHONG MARAP",
        populate: {
          path: "MARAP",
          model: "RapChieu",
          localField: "MARAP",
          foreignField: "MARAP",
          select: "MARAP TENRAP",
        },
      });

    console.log(`Found ${suatChieu.length} showtimes`);
    res.json(suatChieu);
  } catch (err) {
    console.error("Lỗi populate: ", err); // Thêm log
    res
      .status(500)
      .json({ error: "Lỗi khi lấy dữ liệu", details: err.message });
  }
};

// [POST] Thêm suất chiếu mới và tạo chi tiết suất chiếu
exports.themSuatChieu = async (req, res) => {
  try {
    console.log("Dữ liệu nhận: ", req.body);
    const { NGAYCHIEU, MAPHONG, MAPHIM, GIOBATDAU, GIOKETTHUC } = req.body;

    // Tạo suất chiếu mới
    const suatChieuMoi = new SuatChieuMerged({
      NGAYCHIEU,
      MAPHONG,
      MAPHIM,
      GIOBATDAU,
      GIOKETTHUC,
    });
    const savedSuatChieu = await suatChieuMoi.save();

    // Tạo chi tiết suất chiếu tương ứng
    const chiTietSuatMoi = new ChiTietSuat({
      MAPHIM,
      MASUAT: savedSuatChieu.MASUAT,
      GIOBATDAU: new Date(`${NGAYCHIEU}T${GIOBATDAU}:00`),
      GIOKETTHUC: new Date(`${NGAYCHIEU}T${GIOKETTHUC}:00`),
    });
    await chiTietSuatMoi.save();

    res.status(201).json(savedSuatChieu);
  } catch (err) {
    console.error("Lỗi chi tiết: ", err);
    res.status(400).json({
      error: "Không thể tạo suất chiếu",
      details: err.message,
    });
  }
};

// [PUT] Cập nhật suất chiếu và chi tiết suất chiếu
exports.capNhatSuatChieu = async (req, res) => {
  const { masuat } = req.params;
  try {
    const suatChieuCapNhat = await SuatChieuMerged.findOneAndUpdate(
      { MASUAT: masuat },
      req.body,
      { new: true, runValidators: true }
    );
    if (!suatChieuCapNhat) {
      return res.status(404).json({ error: "Suất chiếu không tồn tại" });
    }

    // Cập nhật chi tiết suất chiếu nếu có
    if (req.body.GIOBATDAU || req.body.GIOKETTHUC) {
      const updateData = {};
      // Hàm format date thành YYYY-MM-DD
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const ngayChieuFormatted = formatDate(suatChieuCapNhat.NGAYCHIEU);

      if (req.body.GIOBATDAU) {
        updateData.GIOBATDAU = new Date(
          `${ngayChieuFormatted}T${req.body.GIOBATDAU}:00`
        );
      }
      if (req.body.GIOKETTHUC) {
        updateData.GIOKETTHUC = new Date(
          `${ngayChieuFormatted}T${req.body.GIOKETTHUC}:00`
        );
      }
      await ChiTietSuat.findOneAndUpdate({ MASUAT: masuat }, updateData, {
        new: true,
      });
    }

    res.json(suatChieuCapNhat);
  } catch (err) {
    res.status(400).json({
      error: "Không thể cập nhật suất chiếu",
      details: err.message,
    });
  }
};

// [DELETE] Xóa suất chiếu và chi tiết suất chiếu
exports.xoaSuatChieu = async (req, res) => {
  const { masuat } = req.params;
  try {
    const suatChieuXoa = await SuatChieuMerged.findOneAndDelete({
      MASUAT: masuat,
    });
    if (!suatChieuXoa) {
      return res.status(404).json({ error: "Suất chiếu không tồn tại" });
    }

    // Xóa chi tiết suất chiếu tương ứng
    await ChiTietSuat.findOneAndDelete({ MASUAT: masuat });

    res.json({ message: "Suất chiếu đã được xóa thành công" });
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi xóa suất chiếu",
      details: err.message,
    });
  }
};
