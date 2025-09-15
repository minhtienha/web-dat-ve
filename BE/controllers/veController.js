const Ve = require("../models/Ve");
const ChiTietGhe = require("../models/Chi_tiet_ghe");
const mongoose = require("mongoose");
const ChiTietSuat = require("../models/Chi_tiet_suat_chieu");
const Ghe = require("../models/Ghe");
const { io } = require("../server");

// [GET] Lấy danh sách vé
exports.layDanhSachVe = async (req, res) => {
  try {
    const danhSachVe = await Ve.find()
      .populate({
        path: "MASUAT",
        model: "SuatChieu",
        localField: "MASUAT",
        foreignField: "MASUAT",
        populate: [
          {
            path: "MAPHIM",
            model: "Phim",
            localField: "MAPHIM",
            foreignField: "MAPHIM",
            select: "TENPHIM POSTER",
          },
          {
            path: "MAPHONG",
            model: "PhongChieu",
            localField: "MAPHONG",
            foreignField: "MAPHONG",
            populate: {
              path: "MARAP",
              model: "RapChieu",
              localField: "MARAP",
              foreignField: "MARAP",
              select: "TENRAP TINHTHANH",
            },
          },
        ],
      })
      .populate({
        path: "MAKH",
        model: "NguoiDung",
        localField: "MAKH",
        foreignField: "MAKH",
        select: "TENKH EMAIL",
      })
      .sort({ NGAYMUA: -1 });

    const formattedTickets = await Promise.all(
      danhSachVe.map(async (ticket) => {
        const masuatCode = ticket.MASUAT?.MASUAT || ticket.MASUAT;

        // Lấy thông tin suất chiếu + phim
        const chiTietSuat = await ChiTietSuat.findOne({
          MASUAT: masuatCode,
        }).populate({
          path: "MAPHIM",
          model: "Phim",
          localField: "MAPHIM",
          foreignField: "MAPHIM",
          select: "TENPHIM POSTER",
        });

        // Lấy danh sách ghế đã đặt cho vé này
        const gheList = await ChiTietGhe.find({ MAVE: ticket.MAVE }).populate({
          path: "MAGHE",
          model: "Ghe",
          localField: "MAGHE",
          foreignField: "MAGHE",
          select: "HANG SO",
        });

        const magheStr = gheList
          .map((g) => `${g.MAGHE?.HANG || ""}${g.MAGHE?.SO || ""}`)
          .join(", ");

        return {
          id: ticket._id,
          ma_ve: ticket.MAVE,
          makh: ticket.MAKH?.MAKH || "",
          tenkh: ticket.MAKH?.TENKH || "",
          tenphim: ticket.MASUAT?.MAPHIM?.TENPHIM || "Không xác định",
          poster: ticket.MASUAT?.MAPHIM?.POSTER || "",
          tenrap: ticket.MASUAT?.MAPHONG?.MARAP?.TENRAP || "Không xác định",
          tinhThanh: ticket.MASUAT?.MAPHONG?.MARAP?.TINHTHANH || "",
          tenphong: ticket.MASUAT?.MAPHONG?.TENPHONG || "Không xác định",
          ngaychieu: ticket.MASUAT?.NGAYCHIEU || "",
          giobatdau: ticket.MASUAT?.GIOBATDAU || "",
          gioketthuc: ticket.MASUAT?.GIOKETTHUC || "",
          maghe: magheStr || "",
          giave: ticket.GIAVE || 0,
          trang_thai: ticket.TRANGTHAI || "confirmed",
          ngaydat: ticket.NGAYMUA || new Date(),
          maphim: ticket.MASUAT?.MAPHIM?._id || "",
          marap: ticket.MASUAT?.MAPHONG?.MARAP?._id || "",
        };
      })
    );

    res.json(formattedTickets);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách vé", details: err.message });
  }
};

// [GET] Lấy vé theo MAKH (user ID)
exports.layVeTheoMaKH = async (req, res) => {
  try {
    const { makh } = req.params;
    if (!makh) {
      return res.status(400).json({ error: "Thiếu mã khách hàng" });
    }

    // Lấy danh sách vé của KH, populate MASUAT, MAPHONG, MARAP
    const danhSachVe = await Ve.find({ MAKH: makh })
      .populate({
        path: "MASUAT",
        model: "SuatChieu",
        localField: "MASUAT",
        foreignField: "MASUAT",
        populate: {
          path: "MAPHONG",
          model: "PhongChieu",
          localField: "MAPHONG",
          foreignField: "MAPHONG",
          populate: {
            path: "MARAP",
            model: "RapChieu",
            localField: "MARAP",
            foreignField: "MARAP",
            select: "TENRAP TINHTHANH",
          },
        },
      })
      .populate({
        path: "MAKH",
        model: "NguoiDung",
        localField: "MAKH",
        foreignField: "MAKH",
        select: "TENKH EMAIL",
      })
      .sort({ NGAYMUA: -1 });

    const formattedTickets = await Promise.all(
      danhSachVe.map(async (ticket) => {
        const masuatCode = ticket.MASUAT?.MASUAT || ticket.MASUAT;

        // Lấy thông tin suất chiếu + phim
        const chiTietSuat = await ChiTietSuat.findOne({
          MASUAT: masuatCode,
        }).populate({
          path: "MAPHIM",
          model: "Phim",
          localField: "MAPHIM",
          foreignField: "MAPHIM",
          select: "TENPHIM POSTER",
        });

        // Lấy danh sách ghế đã đặt cho vé này
        const gheList = await ChiTietGhe.find({ MAVE: ticket.MAVE }).populate({
          path: "MAGHE",
          model: "Ghe",
          localField: "MAGHE",
          foreignField: "MAGHE",
          select: "HANG SO",
        });

        const magheStr = gheList
          .map((g) => `${g.MAGHE?.HANG || ""}${g.MAGHE?.SO || ""}`)
          .join(", ");

        return {
          id: ticket._id,
          ma_ve: ticket.MAVE,
          makh: ticket.MAKH?.MAKH || "",
          tenphim: chiTietSuat?.MAPHIM?.TENPHIM || "Không xác định",
          poster: chiTietSuat?.MAPHIM?.POSTER || "",
          tenrap: ticket.MASUAT?.MAPHONG?.MARAP?.TENRAP || "Không xác định",
          tinhThanh: ticket.MASUAT?.MAPHONG?.MARAP?.TINHTHANH || "",
          tenphong: ticket.MASUAT?.MAPHONG?.TENPHONG || "Không xác định",
          ngaychieu: ticket.MASUAT?.NGAYCHIEU || "",
          giobatdau: chiTietSuat?.GIOBATDAU || "",
          gioketthuc: chiTietSuat?.GIOKETTHUC || "",
          maghe: magheStr || "",
          giave: ticket.GIAVE || 0,
          trang_thai: ticket.TRANGTHAI || "confirmed",
          ngaydat: ticket.NGAYMUA || new Date(),
        };
      })
    );

    res.json(formattedTickets);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi lấy danh sách vé",
      details: err.message,
    });
  }
};

// [GET] Lấy vé theo MAVE
exports.layVeTheoMa = async (req, res) => {
  const { mave } = req.params;
  try {
    const ve = await Ve.findOne({ MAVE: mave }).populate("MASUAT MAKH");
    if (!ve) {
      return res.status(404).json({ error: "Vé không tồn tại" });
    }
    res.json(ve);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy thông tin vé", details: err.message });
  }
};

// [POST] Thêm vé mới
exports.themVe = async (req, res) => {
  try {
    const veMoi = new Ve(req.body);
    const savedVe = await veMoi.save();
    res.status(201).json(savedVe);
  } catch (err) {
    res.status(400).json({ error: "Không thể tạo vé", details: err.message });
  }
};

// [PUT] Cập nhật vé
// exports.capNhatVe = async (req, res) => {
//   const { mave } = req.params;
//   try {
//     const veCapNhat = await Ve.findOneAndUpdate({ MAVE: mave }, req.body, {
//       new: true,
//     });
//     if (!veCapNhat) {
//       return res.status(404).json({ error: "Vé không tồn tại" });
//     }
//     res.json(veCapNhat);
//   } catch (err) {
//     res
//       .status(400)
//       .json({ error: "Không thể cập nhật vé", details: err.message });
//   }
// };

// [DELETE] Xóa vé
// exports.xoaVe = async (req, res) => {
//   const { mave } = req.params;
//   try {
//     const veXoa = await Ve.findOneAndDelete({ MAVE: mave });
//     if (!veXoa) {
//       return res.status(404).json({ error: "Vé không tồn tại" });
//     }
//     res.json({ message: "Vé đã được xóa thành công" });
//   } catch (err) {
//     res.status(500).json({ error: "Lỗi khi xóa vé", details: err.message });
//   }
// };

// [POST] Đặt vé (nhiều ghế) và cập nhật trạng thái ghế khi thanh toán thành công
// Body: { MASUAT: string, MAKH: string, GHE_LIST: string[], GIAVE: number }
exports.datVeNhieuGhe = async (req, res) => {
  const { MASUAT, MAKH, GHE_LIST, GIAVE } = req.body || {};
  if (
    !MASUAT ||
    !MAKH ||
    !Array.isArray(GHE_LIST) ||
    GHE_LIST.length === 0 ||
    !GIAVE
  ) {
    return res.status(400).json({
      error: "INVALID_INPUT",
      message: "Cần MASUAT, MAKH, GHE_LIST (array > 0) và GIAVE",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1) Kiểm tra tình trạng ghế
    const chiTietList = await ChiTietGhe.find({
      MASUAT,
      MAGHE: { $in: GHE_LIST },
    }).session(session);

    const magheToTrangThai = new Map(
      chiTietList.map((ct) => [ct.MAGHE, ct.TRANGTHAI])
    );
    const gheDaDat = GHE_LIST.filter(
      (maghe) => magheToTrangThai.get(maghe) === "DADAT"
    );
    if (gheDaDat.length > 0) {
      throw new Error(`Ghế đã được đặt: ${gheDaDat.join(", ")}`);
    }

    // 2) Tạo 1 vé duy nhất
    const tongTien = GIAVE * GHE_LIST.length;
    const veMoi = new Ve({ MASUAT, MAKH, GIAVE: tongTien });
    const savedVe = await veMoi.save({ session });

    // 3) Gán tất cả ghế vào cùng vé này
    for (const maghe of GHE_LIST) {
      await ChiTietGhe.findOneAndUpdate(
        { MAGHE: maghe, MASUAT },
        { MAGHE: maghe, MASUAT, MAVE: savedVe.MAVE, TRANGTHAI: "DADAT" },
        { new: true, upsert: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Đặt vé thành công",
      ticket: savedVe,
      ghe: GHE_LIST,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(400)
      .json({ error: "BOOKING_FAILED", details: err.message });
  }
};

// [POST] Đặt vé (một ghế) - không cần kiểm tra tình trạng ghế
// Body: { MASUAT: string, MAKH: string, MAGHE: string, GIAVE: number }
exports.datVe = async (req, res) => {
  const { MASUAT, MAKH, GHE_LIST, GIAVE } = req.body;
  try {
    // Kiểm tra ghế đã được đặt chưa
    const gheDaBan = await Ve.find({ MASUAT, MAGHE: { $in: GHE_LIST } });
    if (gheDaBan.length > 0) {
      return res.status(400).json({ error: "Ghế đã có người đặt!" });
    }
    // Nếu chưa ai đặt, tiến hành đặt vé
    const veList = GHE_LIST.map((MAGHE) => ({
      MASUAT,
      MAKH,
      MAGHE,
      GIAVE,
      NGAYDAT: new Date(),
    }));
    const result = await Ve.insertMany(veList);
    io.emit("seatBooked", { MASUAT, GHE_LIST }); // Phát sự kiện cho tất cả client
    res.json({ success: true, tickets: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
