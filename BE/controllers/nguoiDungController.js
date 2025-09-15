const NguoiDung = require("../models/Nguoi_dung");

// Hàm kiểm tra định dạng email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// [POST] Đăng ký
exports.dangKy = async (req, res) => {
  try {
    const { EMAIL, SDT } = req.body;

    // Kiểm tra định dạng email
    if (!isValidEmail(EMAIL)) {
      return res.status(400).json({
        error: "INVALID_EMAIL",
        message: "Email không hợp lệ",
      });
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await NguoiDung.findOne({ EMAIL });
    if (existingEmail) {
      return res.status(400).json({
        error: "EMAIL_EXISTS",
        message: "Email đã tồn tại",
      });
    }

    // Kiểm tra số điện thoại đã tồn tại
    const existingPhone = await NguoiDung.findOne({ SDT });
    if (existingPhone) {
      return res.status(400).json({
        error: "PHONE_EXISTS",
        message: "Số điện thoại đã tồn tại",
      });
    }

    const khachHangMoi = new NguoiDung(req.body);
    const savedKH = await khachHangMoi.save();
    res.status(201).json(savedKH);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      if (field === "EMAIL") {
        return res.status(400).json({
          error: "EMAIL_EXISTS",
          message: "Email đã tồn tại",
        });
      } else if (field === "SDT") {
        return res.status(400).json({
          error: "PHONE_EXISTS",
          message: "Số điện thoại đã tồn tại",
        });
      }
    }

    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Dữ liệu không hợp lệ",
    });
  }
};

// [POST] Đăng nhập
exports.dangNhap = async (req, res) => {
  const { EMAIL, MATKHAU } = req.body;
  try {
    const khachHang = await NguoiDung.findOne({ EMAIL });
    if (!khachHang || khachHang.MATKHAU !== MATKHAU) {
      return res.status(401).json({ error: "Sai thông tin đăng nhập" });
    }
    // Nếu là manager, kiểm tra MARAP có hợp lệ không
    if (khachHang.VAITRO === "manager" && !khachHang.MARAP) {
      return res.status(403).json({ error: "Manager chưa được gán rạp" });
    }
    res.json(khachHang);
  } catch (err) {
    res.status(500).json({ error: "Lỗi đăng nhập", details: err.message });
  }
};

// [GET] Lấy thông tin khách hàng theo ID
exports.layKhachHangTheoMa = async (req, res) => {
  const { makh } = req.params;
  try {
    const khachHang = await NguoiDung.findOne({ MAKH: makh });
    if (!khachHang) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }
    res.json(khachHang);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy thông tin khách hàng",
      details: err.message,
    });
  }
};

// [PUT] Cập nhật thông tin khách hàng
exports.capNhatKhachHang = async (req, res) => {
  const { makh } = req.params;
  try {
    const khachHangCapNhat = await NguoiDung.findOneAndUpdate(
      { MAKH: makh },
      req.body,
      { new: true }
    );
    if (!khachHangCapNhat) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }
    res.json(khachHangCapNhat);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể cập nhật khách hàng", details: err.message });
  }
};

// [DELETE] Xóa khách hàng
exports.xoaKhachHang = async (req, res) => {
  const { makh } = req.params;
  try {
    const khachHangXoa = await NguoiDung.findOneAndDelete({ MAKH: makh });
    if (!khachHangXoa) {
      return res.status(404).json({ error: "Khách hàng không tồn tại" });
    }
    res.json({ message: "Khách hàng đã được xóa thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi xóa khách hàng", details: err.message });
  }
};

// [PUT] Cập nhật mật khẩu người dùng theo email
exports.capNhatMatKhau = async (req, res) => {
  const { email, matkhau } = req.body;
  if (!email || !matkhau) {
    return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
  }
  try {
    const user = await NguoiDung.findOne({ EMAIL: email });
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }
    user.MATKHAU = matkhau;
    await user.save();
    res.json({ message: "Cập nhật mật khẩu thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi cập nhật mật khẩu", details: err.message });
  }
};

// [GET] Lấy danh sách người dùng
exports.layDanhSachNguoiDung = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.find();
    res.json(nguoiDung);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách người dùng",
      details: err.message,
    });
  }
};

// [POST] Thêm người dùng
exports.themNguoiDung = async (req, res) => {
  try {
    const { EMAIL, SDT } = req.body;

    // Kiểm tra định dạng email
    if (!isValidEmail(EMAIL)) {
      return res.status(400).json({
        error: "INVALID_EMAIL",
        message: "Email không hợp lệ",
      });
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await NguoiDung.findOne({ EMAIL });
    if (existingEmail) {
      return res.status(400).json({
        error: "EMAIL_EXISTS",
        message: "Email đã tồn tại",
      });
    }

    // Kiểm tra số điện thoại đã tồn tại nếu có
    if (SDT) {
      const existingPhone = await NguoiDung.findOne({ SDT });
      if (existingPhone) {
        return res.status(400).json({
          error: "PHONE_EXISTS",
          message: "Số điện thoại đã tồn tại",
        });
      }
    }

    const nguoiDungMoi = new NguoiDung(req.body);
    const saved = await nguoiDungMoi.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      if (field === "EMAIL") {
        return res.status(400).json({
          error: "EMAIL_EXISTS",
          message: "Email đã tồn tại",
        });
      } else if (field === "SDT") {
        return res.status(400).json({
          error: "PHONE_EXISTS",
          message: "Số điện thoại đã tồn tại",
        });
      }
    }

    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Dữ liệu không hợp lệ",
    });
  }
};
