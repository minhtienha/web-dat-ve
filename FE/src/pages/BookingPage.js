import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import screenImg from "../assets/images/manhinh.png";
import { createTicket } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import SimplePopup from "../components/SimplePopup";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, maPhong, maSuat } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isPaying, setIsPaying] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const { user } = useContext(AuthContext);

  const ticketPrice = 1000;
  const total = ticketPrice * selectedSeats.length;

  // Lấy dữ liệu ghế từ API (tự resolve MAPHONG nếu thiếu)
  useEffect(() => {
    async function fetchSeats() {
      try {
        setIsLoading(true);
        setError(null);
        let effectiveRoom = maPhong;
        if (!effectiveRoom && maSuat) {
          const suatRes = await axios.get(
            `http://localhost:5000/api/suatchieu/chi-tiet/${maSuat}`
          );
          effectiveRoom =
            suatRes.data?.MAPHONG?.MAPHONG || suatRes.data?.MAPHONG || null;
        }
        if (!effectiveRoom || !maSuat) return;

        const res = await axios.get(
          `http://localhost:5000/api/ghe/theo-phong-va-suat/${effectiveRoom}/${maSuat}`
        );
        if (res.data) {
          const typeOrder = { THUONG: 1, VIP: 2, DOI: 3 };
          const sorted = [...res.data].sort((a, b) => {
            if (typeOrder[a.LOAIGHE] !== typeOrder[b.LOAIGHE]) {
              return typeOrder[a.LOAIGHE] - typeOrder[b.LOAIGHE];
            }
            if (a.HANG === b.HANG) {
              return a.SO - b.SO;
            }
            return a.HANG.localeCompare(b.HANG);
          });
          setSeats(sorted);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách ghế:", err);
        setError("Không tải được sơ đồ ghế. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }

    if (maSuat) {
      fetchSeats();
    }
  }, [maPhong, maSuat]);

  const toggleSeat = (seat) => {
    if (seat.TRANGTHAI === "DADAT") return;
    setSelectedSeats((prev) =>
      prev.includes(`${seat.HANG}${seat.SO}`)
        ? prev.filter((s) => s !== `${seat.HANG}${seat.SO}`)
        : [...prev, `${seat.HANG}${seat.SO}`]
    );
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
  };

  const handleConfirmPayment = async () => {
    try {
      if (!user?.MAKH) {
        alert("Bạn cần đăng nhập để thanh toán");
        navigate("/login");
        return;
      }
      if (!maSuat) {
        alert("Thiếu mã suất chiếu");
        return;
      }
      if (selectedSeats.length === 0) return;

      setIsPaying(true);
      // Map tên ghế (A1, A2, ...) -> MAGHE
      const selectedMagheList = seats
        .filter((seat) => selectedSeats.includes(`${seat.HANG}${seat.SO}`))
        .map((seat) => seat.MAGHE);

      if (paymentMethod === "momo") {
        // Gọi API backend tạo payment MoMo
        const amountStr = (ticketPrice * selectedSeats.length).toString();
        const orderId = "order_" + new Date().getTime();
        const orderInfo = `Thanh toán vé phim ${movie.title}`;
        const redirectUrl = "http://localhost:3000/";
        const ipnUrl =
          "https://99dc4c9b4c4e.ngrok-free.app/api/thanh-toan/momo/callback";

        try {
          const res = await axios.post(
            "http://localhost:5000/api/thanh-toan/momo",
            {
              amount: amountStr,
              orderId,
              orderInfo,
              redirectUrl,
              ipnUrl,
              extraData: JSON.stringify({
                MASUAT: maSuat,
                MAKH: user.MAKH,
                GHE_LIST: selectedMagheList,
                GIAVE: ticketPrice,
              }),
            }
          );
          if (res.data && res.data.payUrl) {
            window.location.href = res.data.payUrl;
          } else {
            alert("Không nhận được đường dẫn thanh toán MoMo");
          }
        } catch (error) {
          alert("Lỗi khi tạo thanh toán MoMo: " + error.message);
        } finally {
          setIsPaying(false);
        }
        return;
      }

      // Nếu không phải momo, xử lý thanh toán bình thường
      const payload = {
        MASUAT: maSuat,
        MAKH: user.MAKH,
        GHE_LIST: selectedMagheList,
        GIAVE: ticketPrice,
      };

      try {
        const result = await createTicket(payload);
        setStep(3);
      } catch (err) {
        if (!err.response) {
          setPopupMessage("Ghế đã được đặt, vui lòng chọn ghế khác!");
        }
      }
    } finally {
      if (paymentMethod !== "momo") {
        setIsPaying(false);
      }
    }
  };

  if (!movie) return <div>Không có dữ liệu phim!</div>;

  const SeatLegend = () => (
    <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 bg-gray-300 rounded" />
        <span>Ghế thường</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 bg-yellow-300 rounded" />
        <span>Ghế VIP</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 bg-purple-300 rounded" />
        <span>Ghế đôi</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 bg-green-500 rounded" />
        <span>Đã chọn</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 bg-red-500 rounded" />
        <span>Đã bán</span>
      </div>
    </div>
  );

  const renderSeatButtonClass = (seat, isSelected) => {
    if (seat.TRANGTHAI === "DADAT") return "bg-red-500 cursor-not-allowed";
    const typeColor =
      seat.LOAIGHE === "VIP"
        ? "bg-yellow-300 hover:bg-yellow-400"
        : seat.LOAIGHE === "DOI"
        ? "bg-purple-300 hover:bg-purple-400"
        : "bg-gray-300 hover:bg-gray-400";
    return isSelected
      ? "bg-green-500 hover:bg-green-600 ring-2 ring-offset-1 ring-green-700"
      : typeColor;
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Đặt vé thành công!</h2>
          <p className="mb-4">
            Bạn đã đặt vé thành công cho phim <b>{movie.title}</b>.
          </p>
          <div className="mb-2">
            <b>Ghế:</b> {selectedSeats.join(", ")}
          </div>
          <div className="mb-2">
            <b>Tổng tiền:</b> {total.toLocaleString()}đ
          </div>

          <button className="btn-red mt-4" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Group seats theo hàng
  const groupedSeats = {};
  seats.forEach((seat) => {
    if (!groupedSeats[seat.HANG]) groupedSeats[seat.HANG] = [];
    groupedSeats[seat.HANG].push(seat);
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              {movie.theater} • {movie.room} •{" "}
              {new Date(movie.time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
              })}
            </div>

            {step === 1 && (
              <div className="mb-4 w-full flex justify-center">
                <img
                  src={screenImg}
                  alt="Màn hình"
                  className="max-h-10 opacity-80"
                />
              </div>
            )}

            {step === 1 && (
              <>
                {isLoading ? (
                  <div className="py-10 text-center text-gray-500">
                    Đang tải sơ đồ ghế...
                  </div>
                ) : error ? (
                  <div className="py-10 text-center text-red-500">{error}</div>
                ) : seats.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    Chưa có dữ liệu ghế cho phòng này.
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {Object.keys(groupedSeats)
                        .sort()
                        .map((row) => (
                          <div
                            key={row}
                            className="flex items-center justify-center gap-1"
                          >
                            <span className="w-6 text-center font-semibold">
                              {row}
                            </span>
                            <div className="flex flex-wrap gap-1 max-w-full">
                              {groupedSeats[row]
                                .sort((a, b) => a.SO - b.SO)
                                .map((seat) => {
                                  const isSelected = selectedSeats.includes(
                                    `${seat.HANG}${seat.SO}`
                                  );
                                  const btnClass = renderSeatButtonClass(
                                    seat,
                                    isSelected
                                  );
                                  return (
                                    <button
                                      key={seat.MAGHE}
                                      onClick={() => toggleSeat(seat)}
                                      className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${btnClass}`}
                                      disabled={seat.TRANGTHAI === "DADAT"}
                                      title={`${seat.HANG}${seat.SO} • ${seat.LOAIGHE}`}
                                    >
                                      {seat.SO}
                                    </button>
                                  );
                                })}
                            </div>
                            <span className="w-6 text-center font-semibold">
                              {row}
                            </span>
                          </div>
                        ))}
                    </div>
                    <SeatLegend />
                  </>
                )}
                <div className="flex justify-end mt-6">
                  <button
                    className="btn-red px-6 py-2"
                    disabled={selectedSeats.length === 0}
                    onClick={() => setStep(2)}
                  >
                    Tiếp tục ({selectedSeats.length} ghế)
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-xl font-bold mb-4">Thanh toán</h2>
                <div className="mb-4">
                  <label className="font-semibold mr-4">
                    Phương thức thanh toán:
                  </label>
                  <select
                    className="border rounded px-3 py-2"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="card">Thẻ ngân hàng</option>
                    <option value="momo">Ví MoMo</option>
                    <option value="zalopay">ZaloPay</option>
                  </select>
                </div>
                <div className="mb-4">
                  <b>Ghế đã chọn:</b> {selectedSeats.join(", ")}
                </div>
                <div className="mb-4">
                  <b>Giá vé:</b> {ticketPrice.toLocaleString()}đ x{" "}
                  {selectedSeats.length} ={" "}
                  {(ticketPrice * selectedSeats.length).toLocaleString()}đ
                </div>
                {/* <div className="mb-4">
                  <b>Phí tiện ích:</b>{" "}
                  {selectedSeats.length > 0 ? fee.toLocaleString() : 0}đ
                </div> */}
                <div className="mb-4">
                  <b>Tổng cộng:</b> {total.toLocaleString()}đ
                </div>
                <div className="flex space-x-2">
                  <button className="btn-outline" onClick={() => setStep(1)}>
                    Quay lại
                  </button>
                  <button
                    className="btn-red disabled:opacity-60"
                    disabled={isPaying || selectedSeats.length === 0}
                    onClick={handleConfirmPayment}
                  >
                    {isPaying ? "Đang xử lý..." : "Xác nhận thanh toán"}
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="w-full md:w-72 bg-gray-50 rounded-lg p-4 h-fit border">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={movie.images[0]}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <div className="font-semibold">{movie.title}</div>
                <div className="text-sm text-gray-500">
                  {movie.theater} • {movie.room}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(movie.time).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                </div>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ghế đã chọn</span>
                <span className="font-medium">
                  {selectedSeats.join(", ") || "--"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Giá vé</span>
                <span>
                  {ticketPrice.toLocaleString()}đ x {selectedSeats.length}
                </span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {popupMessage && (
        <SimplePopup
          message={popupMessage}
          onConfirm={handleClosePopup}
          type="info"
          confirmText="Đóng"
        />
      )}
    </div>
  );
}
