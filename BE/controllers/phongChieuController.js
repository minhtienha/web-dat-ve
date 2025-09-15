const PhongChieu = require("../models/Phong_chieu");
const Ghe = require("../models/Ghe");

// Hàm tự động tạo ghế cho phòng
async function taoGheTuDong(MAPHONG, SOHANG, SOCOT) {
  try {
    const rows = Array.from({ length: SOHANG }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    const existingSeats = await Ghe.find({ MAPHONG });
    const existingKeySet = new Set(
      existingSeats.map((g) => `${g.HANG}-${g.SO}`)
    );

    const toCreate = [];
    rows.forEach((row) => {
      for (let num = 1; num <= SOCOT; num += 1) {
        const key = `${row}-${num}`;
        if (existingKeySet.has(key)) continue;
        toCreate.push({ MAPHONG, HANG: row, SO: num, LOAIGHE: "THUONG" });
      }
    });

    if (toCreate.length === 0)
      return { created: 0, skipped: existingKeySet.size };

    const start = await Ghe.countDocuments();
    const docsWithId = toCreate.map((item, idx) => ({
      ...item,
      MAGHE: `G${String(start + idx + 1).padStart(4, "0")}`,
    }));

    const inserted = await Ghe.insertMany(docsWithId, { ordered: false });
    return { created: inserted.length, skipped: existingKeySet.size };
  } catch (error) {
    throw new Error(`Lỗi tạo ghế tự động: ${error.message}`);
  }
}

// [GET] Lấy danh sách phòng chiếu
exports.layDanhSachPhongChieu = async (req, res) => {
  try {
    const danhSachPhongChieu = await PhongChieu.find().populate({
      path: "MARAP",
      model: "RapChieu",
      localField: "MARAP",
      foreignField: "MARAP",
      select: "MARAP TENRAP DIACHI",
    });
    res.json(danhSachPhongChieu);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách phòng chiếu",
      details: err.message,
    });
  }
};

// [GET] Lấy phòng chiếu theo MAPHONG
exports.layPhongChieuTheoMa = async (req, res) => {
  const { maphong } = req.params;
  try {
    const phongChieu = await PhongChieu.findOne({ MAPHONG: maphong }).populate({
      path: "MARAP",
      model: "RapChieu",
      localField: "MARAP",
      foreignField: "MARAP",
      select: "MARAP TENRAP DIACHI",
    });
    if (!phongChieu) {
      return res.status(404).json({ error: "Phòng chiếu không tồn tại" });
    }
    res.json(phongChieu);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy thông tin phòng chiếu",
      details: err.message,
    });
  }
};

// [POST] Thêm phòng chiếu mới + tự động tạo ghế
exports.themPhongChieu = async (req, res) => {
  try {
    const phongChieuMoi = new PhongChieu(req.body);
    const savedPhongChieu = await phongChieuMoi.save();

    // Tự động tạo ghế nếu có SOHANG và SOCOT
    if (req.body.SOHANG && req.body.SOCOT) {
      const { created, skipped } = await taoGheTuDong(
        savedPhongChieu.MAPHONG,
        req.body.SOHANG,
        req.body.SOCOT
      );
      return res.status(201).json({
        phongChieu: savedPhongChieu,
        ghile: { created, skipped },
        message: `Đã tạo ${created} ghế mới, bỏ qua ${skipped} ghế đã tồn tại`,
      });
    }

    res.status(201).json(savedPhongChieu);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể tạo phòng chiếu", details: err.message });
  }
};

// [PUT] Cập nhật phòng chiếu
exports.capNhatPhongChieu = async (req, res) => {
  const { maphong } = req.params;
  try {
    const phongChieuCapNhat = await PhongChieu.findOneAndUpdate(
      { MAPHONG: maphong },
      req.body,
      { new: true }
    );
    if (!phongChieuCapNhat) {
      return res.status(404).json({ error: "Phòng chiếu không tồn tại" });
    }
    res.json(phongChieuCapNhat);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể cập nhật phòng chiếu", details: err.message });
  }
};

// [DELETE] Xóa phòng chiếu
exports.xoaPhongChieu = async (req, res) => {
  const { maphong } = req.params;
  try {
    const phongChieuXoa = await PhongChieu.findOneAndDelete({
      MAPHONG: maphong,
    });
    if (!phongChieuXoa) {
      return res.status(404).json({ error: "Phòng chiếu không tồn tại" });
    }
    res.json({ message: "Phòng chiếu đã được xóa thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi xóa phòng chiếu", details: err.message });
  }
};

// [GET] Lấy danh sách phòng chiếu theo mã rạp
exports.layDanhSachPhongChieuTheoRap = async (req, res) => {
  const { marap } = req.params;
  try {
    const danhSachPhongChieu = await PhongChieu.find({ MARAP: marap }).populate(
      {
        path: "MARAP",
        model: "RapChieu",
        localField: "MARAP",
        foreignField: "MARAP",
        select: "MARAP TENRAP DIACHI",
      }
    );

    // Trả về danh sách rỗng thay vì 404 nếu không có phòng
    res.json(danhSachPhongChieu);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách phòng chiếu theo rạp",
      details: err.message,
    });
  }
};
