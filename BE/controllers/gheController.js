const Ghe = require("../models/Ghe");
const ChiTietGhe = require("../models/Chi_tiet_ghe");

// [GET] Lấy danh sách ghế
exports.layDanhSachGhe = async (req, res) => {
  try {
    const danhSachGhe = await Ghe.find();
    res.json(danhSachGhe);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách ghế", details: err.message });
  }
};

// [GET] Lấy ghế theo MAGHE
exports.layGheTheoMa = async (req, res) => {
  const { maghe } = req.params;
  try {
    const ghe = await Ghe.findOne({ MAGHE: maghe });
    if (!ghe) {
      return res.status(404).json({ error: "Ghế không tồn tại" });
    }
    res.json(ghe);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy thông tin ghế", details: err.message });
  }
};

// [POST] Thêm ghế mới
exports.themGhe = async (req, res) => {
  try {
    const gheMoi = new Ghe(req.body);
    const savedGhe = await gheMoi.save();
    res.status(201).json(savedGhe);
  } catch (err) {
    res.status(400).json({ error: "Không thể tạo ghế", details: err.message });
  }
};

// [PUT] Cập nhật ghế
exports.capNhatGhe = async (req, res) => {
  const { maghe } = req.params;
  try {
    const gheCapNhat = await Ghe.findOneAndUpdate({ MAGHE: maghe }, req.body, {
      new: true,
    });
    if (!gheCapNhat) {
      return res.status(404).json({ error: "Ghế không tồn tại" });
    }
    res.json(gheCapNhat);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Không thể cập nhật ghế", details: err.message });
  }
};

// [DELETE] Xóa ghế
exports.xoaGhe = async (req, res) => {
  const { maghe } = req.params;
  try {
    const gheXoa = await Ghe.findOneAndDelete({ MAGHE: maghe });
    if (!gheXoa) {
      return res.status(404).json({ error: "Ghế không tồn tại" });
    }
    res.json({ message: "Ghế đã được xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi xóa ghế", details: err.message });
  }
};

// [GET] Lấy ghế theo phòng và suất chiếu, kèm trạng thái
exports.layGheTheoPhongVaSuat = async (req, res) => {
  const { maphong, masuat } = req.params;
  try {
    // Lấy danh sách ghế trong phòng
    const danhSachGhe = await Ghe.find({ MAPHONG: maphong });
    const danhSachMaGhe = danhSachGhe.map((ghe) => ghe.MAGHE);

    // Lấy chi tiết ghế theo suất cho các ghế trên
    const danhSachChiTiet = await ChiTietGhe.find({
      MASUAT: masuat,
      MAGHE: { $in: danhSachMaGhe },
    });

    const mapTrangThaiTheoMaGhe = new Map(
      danhSachChiTiet.map((ct) => [ct.MAGHE, ct.TRANGTHAI])
    );

    const ketQua = danhSachGhe.map((ghe) => ({
      MAGHE: ghe.MAGHE,
      MAPHONG: ghe.MAPHONG,
      HANG: ghe.HANG,
      SO: ghe.SO,
      LOAIGHE: ghe.LOAIGHE,
      TRANGTHAI: mapTrangThaiTheoMaGhe.get(ghe.MAGHE) || "TRONG",
    }));

    res.json(ketQua);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy ghế theo phòng và suất",
      details: err.message,
    });
  }
};

exports.seedGheChoPhong = async (req, res) => {
  try {
    const { MAPHONG, rows, seatsPerRow, types } = req.body || {};
    if (!MAPHONG || !Array.isArray(rows) || !seatsPerRow) {
      return res.status(400).json({
        error: "Thiếu tham số",
        details: "Cần MAPHONG, rows (array), seatsPerRow (number)",
      });
    }

    const existingSeats = await Ghe.find({ MAPHONG });
    const existingKeySet = new Set(
      existingSeats.map((g) => `${g.HANG}-${g.SO}`)
    );

    const toCreate = [];
    rows.forEach((row) => {
      for (let num = 1; num <= Number(seatsPerRow); num += 1) {
        const key = `${row}-${num}`;
        if (existingKeySet.has(key)) continue;
        const loai = types?.[row] || "THUONG";
        toCreate.push({ MAPHONG, HANG: row, SO: num, LOAIGHE: loai });
      }
    });

    if (toCreate.length === 0) {
      return res.json({ message: "Không có ghế mới để tạo", created: 0 });
    }

    const start = await Ghe.countDocuments();
    const docsWithId = toCreate.map((item, idx) => ({
      ...item,
      MAGHE: `G${String(start + idx + 1).padStart(4, "0")}`,
    }));

    const inserted = await Ghe.insertMany(docsWithId, { ordered: false });
    return res.status(201).json({
      message: "Seed ghế thành công",
      created: inserted.length,
      skipped: existingKeySet.size,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Không thể seed ghế", details: err.message });
  }
};
