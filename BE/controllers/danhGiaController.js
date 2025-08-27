const DanhGia = require("../models/Danh_gia");
const Phim = require("../models/Phim");
const NguoiDung = require("../models/Nguoi_dung");

// [GET] Danh sách đánh giá theo MAPHIM
exports.layDanhGiaTheoPhim = async (req, res) => {
  const { maphim } = req.params;
  try {
    const list = await DanhGia.aggregate([
      { $match: { MAPHIM: maphim } },
      { $sort: { NGAYDANHGIA: -1 } },
      {
        $lookup: {
          from: "nguoi_dung",
          localField: "MAKH",
          foreignField: "MAKH",
          as: "kh",
        },
      },
      {
        $addFields: {
          MAKH: {
            $let: {
              vars: { k: { $arrayElemAt: ["$kh", 0] } },
              in: { MAKH: "$MAKH", TENKH: "$$k.TENKH", EMAIL: "$$k.EMAIL" },
            },
          },
        },
      },
      { $project: { kh: 0 } },
    ]);
    return res.json(list);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Lỗi khi lấy đánh giá", details: err.message });
  }
};

// [GET] Danh sách đánh giá theo MAKH
exports.layDanhGiaTheoNguoiDung = async (req, res) => {
  const { makh } = req.params;
  try {
    const reviews = await DanhGia.find({ MAKH: makh })
      .populate({
        path: "MAPHIM",
        select: "TENPHIM HINHANH",
        model: Phim,
        foreignField: "MAPHIM",
        localField: "MAPHIM",
      })
      .sort({ NGAYDANHGIA: -1 });

    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy đánh giá", details: error.message });
  }
};

// [POST] Thêm đánh giá mới
exports.themDanhGia = async (req, res) => {
  const { MAPHIM, MAKH, SOSAO, BINHLUAN } = req.body || {};
  if (!MAPHIM || !MAKH || !SOSAO) {
    return res
      .status(400)
      .json({ error: "INVALID_INPUT", message: "Cần MAPHIM, MAKH, SOSAO" });
  }

  try {
    // Kiểm tra xem người dùng đã đánh giá phim này chưa
    const existingReview = await DanhGia.findOne({ MAPHIM, MAKH });
    if (existingReview) {
      return res
        .status(400)
        .json({
          error: "DUPLICATE_REVIEW",
          message: "Người dùng đã đánh giá phim này",
        });
    }

    // Tạo đánh giá mới
    const dg = new DanhGia({
      MAPHIM,
      MAKH,
      SOSAO,
      BINHLUAN: BINHLUAN || "",
      NGAYDANHGIA: new Date(),
    });

    await dg.save();

    // Cập nhật điểm trung bình phim
    const agg = await DanhGia.aggregate([
      { $match: { MAPHIM } },
      { $group: { _id: "$MAPHIM", avg: { $avg: "$SOSAO" } } },
    ]);
    const avg = agg?.[0]?.avg || 0;
    await Phim.findOneAndUpdate(
      { MAPHIM },
      { DANHGIA: Math.round(avg * 10) / 10, NGAYCAPNHAT: new Date() }
    );

    const kh = await NguoiDung.findOne({ MAKH }, "TENKH EMAIL MAKH").lean();
    const obj = dg.toObject();
    return res.status(201).json({ ...obj, MAKH: kh || { MAKH } });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "CREATE_REVIEW_FAILED", details: err.message });
  }
};

// [PUT] Cập nhật đánh giá
exports.capNhatDanhGia = async (req, res) => {
  const { MAPHIM, MAKH, SOSAO, BINHLUAN } = req.body || {};
  if (!MAPHIM || !MAKH || !SOSAO) {
    return res
      .status(400)
      .json({ error: "INVALID_INPUT", message: "Cần MAPHIM, MAKH, SOSAO" });
  }

  try {
    const dg = await DanhGia.findOneAndUpdate(
      { MAPHIM, MAKH },
      {
        SOSAO,
        BINHLUAN: BINHLUAN || "",
        NGAYDANHGIA: new Date(),
      },
      { new: true }
    );

    if (!dg) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Không tìm thấy đánh giá" });
    }

    // Cập nhật điểm trung bình phim
    const agg = await DanhGia.aggregate([
      { $match: { MAPHIM } },
      { $group: { _id: "$MAPHIM", avg: { $avg: "$SOSAO" } } },
    ]);
    const avg = agg?.[0]?.avg || 0;
    await Phim.findOneAndUpdate(
      { MAPHIM },
      { DANHGIA: Math.round(avg * 10) / 10, NGAYCAPNHAT: new Date() }
    );

    const kh = await NguoiDung.findOne({ MAKH }, "TENKH EMAIL MAKH").lean();
    const obj = dg.toObject();
    return res.json({ ...obj, MAKH: kh || { MAKH } });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "UPDATE_REVIEW_FAILED", details: err.message });
  }
};

// [DELETE] Xóa đánh giá theo MADG hoặc theo (MAPHIM, MAKH)
exports.xoaDanhGia = async (req, res) => {
  try {
    const madg = req.query.madg || req.body?.MADG;
    const maphim = req.query.maphim || req.body?.MAPHIM;
    const makh = req.query.makh || req.body?.MAKH;

    if (!madg && !(maphim && makh)) {
      return res.status(400).json({
        error: "INVALID_INPUT",
        message: "Cần MADG hoặc cặp MAPHIM & MAKH",
      });
    }

    // Lấy docU để biết MAPHIM phục vụ cập nhật trung bình
    let doc = null;
    if (madg) {
      doc = await DanhGia.findOne({ MADG: madg });
    } else if (maphim && makh) {
      doc = await DanhGia.findOne({ MAPHIM: maphim, MAKH: makh });
    }

    if (!doc) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Không tìm thấy đánh giá" });
    }

    const movieId = doc.MAPHIM;

    await DanhGia.deleteOne({ _id: doc._id });

    // Cập nhật điểm trung bình cho phim
    const agg = await DanhGia.aggregate([
      { $match: { MAPHIM: movieId } },
      { $group: { _id: "$MAPHIM", avg: { $avg: "$SOSAO" } } },
    ]);
    const avg = agg?.[0]?.avg || 0;
    await Phim.findOneAndUpdate(
      { MAPHIM: movieId },
      { DANHGIA: Math.round(avg * 10) / 10, NGAYCAPNHAT: new Date() }
    );

    return res.json({ message: "Đã xóa đánh giá" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "DELETE_REVIEW_FAILED", details: err.message });
  }
};
