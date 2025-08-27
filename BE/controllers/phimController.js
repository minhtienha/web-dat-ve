const Phim = require("../models/Phim");

// [GET] Lấy danh sách phim
exports.layDanhSachPhim = async (req, res) => {
  try {
    const danhSachPhim = await Phim.find();
    console.log("Danh sách phim:", danhSachPhim); // Debug
    res.json(danhSachPhim);
  } catch (err) {
    console.error("Lỗi layDanhSachPhim:", err); // Debug
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách phim", details: err.message });
  }
};

// [GET] Lấy thông tin phim theo MAPHIM
exports.layPhimTheoMa = async (req, res) => {
  const { maphim } = req.params;
  console.log("Request MAPHIM:", maphim); // Debug
  try {
    const phimTimThay = await Phim.findOne({ MAPHIM: maphim.toUpperCase() });
    console.log("Phim found:", phimTimThay); // Debug
    if (!phimTimThay) {
      return res.status(404).json({ error: "Phim không tồn tại" });
    }
    res.json(phimTimThay);
  } catch (err) {
    console.error("Error in layPhimTheoMa:", err); // Debug
    res
      .status(500)
      .json({ error: "Lỗi khi lấy thông tin phim", details: err.message });
  }
};

// [POST] Thêm phim mới
exports.themPhim = async (req, res) => {
  try {
    const phimMoi = new Phim(req.body);
    console.log("Phim mới:", phimMoi); // Debug
    const savedPhim = await phimMoi.save();
    res.status(201).json(savedPhim);
  } catch (err) {
    console.error("Lỗi themPhim:", err); // Debug
    res.status(400).json({ error: "Không thể tạo phim", details: err.message });
  }
};

// [PUT] Cập nhật thông tin phim
exports.capNhatPhim = async (req, res) => {
  const { maphim } = req.params;
  try {
    const phimCapNhat = await Phim.findOneAndUpdate(
      { MAPHIM: maphim.toUpperCase() },
      req.body,
      { new: true }
    );
    if (!phimCapNhat) {
      return res.status(404).json({ error: "Phim không tồn tại" });
    }
    res.json(phimCapNhat);
  } catch (err) {
    console.error("Lỗi capNhatPhim:", err); // Debug
    res
      .status(400)
      .json({ error: "Không thể cập nhật phim", details: err.message });
  }
};

// [DELETE] Xóa phim
exports.xoaPhim = async (req, res) => {
  const { maphim } = req.params;
  try {
    const phimXoa = await Phim.findOneAndDelete({
      MAPHIM: maphim.toUpperCase(),
    });
    if (!phimXoa) {
      return res.status(404).json({ error: "Phim không tồn tại" });
    }
    res.json({ message: "Phim đã được xóa thành công" });
  } catch (err) {
    console.error("Lỗi xoaPhim:", err); // Debug
    res.status(500).json({ error: "Lỗi khi xóa phim", details: err.message });
  }
};

// [GET] Lấy danh sách phim đang chiếu
exports.layPhimDangChieu = async (req, res) => {
  try {
    const phimDangChieu = await Phim.find({ DANGCHIEU: true });
    console.log("Phim đang chiếu:", phimDangChieu); // Debug
    res.json(phimDangChieu);
  } catch (err) {
    console.error("Lỗi layPhimDangChieu:", err); // Debug
    res.status(500).json({
      error: "Lỗi khi lấy danh sách phim đang chiếu",
      details: err.message,
    });
  }
};

// [GET] Lấy danh sách phim sắp chiếu
exports.layPhimSapChieu = async (req, res) => {
  try {
    const phimSapChieu = await Phim.find({ SAPCHIEU: true });
    console.log("Phim sắp chiếu:", phimSapChieu); // Debug
    res.json(phimSapChieu);
  } catch (err) {
    console.error("Lỗi layPhimSapChieu:", err); // Debug
    res.status(500).json({
      error: "Lỗi khi lấy danh sách phim sắp chiếu",
      details: err.message,
    });
  }
};

// [GET] Tìm kiếm phim theo tên
exports.timKiemPhim = async (req, res) => {
  const { tenPhim } = req.query;

  try {
    const phimTimKiem = await Phim.find({
      /*  - $regex: dùng biểu thức chính quy để tìm kiếm mờ (partial match).
        - $options: "i": không phân biệt chữ hoa chữ thường (case-insensitive). */
      TENPHIM: { $regex: tenPhim, $options: "i" },
    });

    // Kiểm tra nếu không có phim nào được tìm thấy
    if (!phimTimKiem || phimTimKiem.length === 0) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Không tìm thấy phim",
      });
    }

    console.log("Phim tìm kiếm:", phimTimKiem); // Debug
    res.json(phimTimKiem);
  } catch (err) {
    console.error("Lỗi timKiemPhim:", err); // Debug
    res.status(500).json({
      error: "SERVER_ERROR",
      message: "Lỗi khi tìm kiếm phim",
      details: err.message,
    });
  }
};

exports.capNhatPhimSapChieu = async (req, res) => {
  try {
    const today = new Date();
    // Cập nhật tất cả phim có ngày khởi chiếu <= hôm nay và còn SAPCHIEU
    const result = await Phim.updateMany(
      {
        NGAYKHOICHIEU: { $lte: today },
        SAPCHIEU: true,
      },
      {
        $set: { DANGCHIEU: true, SAPCHIEU: false },
      }
    );
    res.json({
      message: "Đã cập nhật trạng thái phim.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
