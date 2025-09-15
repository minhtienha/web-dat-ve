import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/detail.css";
import { AuthContext } from "../contexts/AuthContext";
import { getReviewsByMovie, upsertReview, deleteReview } from "../services/api";

const TABS = [
  { key: "showtimes", label: "Suất chiếu" },
  { key: "about", label: "Thông tin phim" },
  { key: "reviews", label: "Đánh giá" },
];

const MovieDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  });
  const [tab, setTab] = useState("showtimes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleAddReview = async () => {
    if (newRating === 0 || newComment.trim() === "") return;
    if (!user?.MAKH) {
      alert("Bạn cần đăng nhập để đánh giá");
      return;
    }
    try {
      const payload = {
        MAPHIM: (id || "").trim().toUpperCase(),
        MAKH: user.MAKH,
        SOSAO: newRating,
        BINHLUAN: newComment.trim(),
      };
      const created = await upsertReview(payload);
      const newItem = {
        id: created?.MADG,
        userId: created?.MAKH?.MAKH || created?.MAKH,
        userName:
          created?.MAKH?.TENKH || created?.MAKH || user?.TENKH || user?.MAKH,
        rating: created?.SOSAO,
        comment: created?.BINHLUAN,
        createdAt: created?.NGAYDANHGIA,
      };
      setReviews((prev) => [newItem, ...prev]);
      // Optionally refetch để đồng bộ nếu cần:
      const fresh = await getReviewsByMovie(payload.MAPHIM);
      setReviews(fresh.map(mapReviewToView));
      setNewRating(0);
      setNewComment("");
    } catch (err) {
      const msg =
        err?.response?.data?.details || err.message || "Gửi đánh giá thất bại";
      alert(msg);
    }
  };

  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin phim (bắt buộc phải thành công)
        const movieResponse = await axios.get(
          `http://localhost:5000/api/phim/chi-tiet/${id.trim().toUpperCase()}`
        );
        setMovie(movieResponse.data);

        // 2. Lấy suất chiếu (nếu lỗi thì để mảng rỗng)
        let showtimesData = [];
        try {
          const showtimesResponse = await axios.get(
            `http://localhost:5000/api/suatchieu/theo-phim/${id
              .trim()
              .toUpperCase()}`
          );
          showtimesData = showtimesResponse.data;
          console.log("Dữ liệu suất chiếu:", showtimesData); // Debug log
        } catch (errShowtime) {
          console.error("Lỗi khi lấy suất chiếu:", errShowtime);
          // Nếu 404 thì không cần báo lỗi, chỉ để mảng rỗng
          if (errShowtime.response?.status !== 404) {
            console.error("Chi tiết lỗi:", errShowtime.response?.data);
          }
          showtimesData = [];
        }

        // 3. Sử dụng dữ liệu đã được populate từ backend
        const showtimesWithDetails = showtimesData.map((showtime) => {
          console.log("Showtime data:", showtime);
          return {
            ...showtime,
            room: showtime.MAPHONG?.TENPHONG || "Unknown",
            theater: showtime.MAPHONG?.MARAP?.TENRAP || "Unknown",
            location: showtime.MAPHONG?.MARAP?.DIACHI || "Unknown",
            format: showtime.DINHDANG || "HMT",
            maPhong: showtime.MAPHONG?.MAPHONG,
            maSuat: showtime.MASUAT,
          };
        });

        setShowtimes(showtimesWithDetails);
        setError(null);
      } catch (err) {
        // Chỉ khi API phim lỗi mới set error
        setError(
          `Lỗi: ${err.response?.status || "Unknown"} - ${
            err.response?.data?.error ||
            err.message ||
            "Không tìm thấy phim hoặc lỗi server"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShowtimes();
  }, [id]);

  const mapReviewToView = (r) => ({
    id: r.MADG,
    userId: r?.MAKH?.MAKH || r?.MAKH,
    userName: r?.MAKH?.TENKH || r?.MAKH || "Người dùng",
    rating: r.SOSAO,
    comment: r.BINHLUAN,
    createdAt: r.NGAYDANHGIA,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const m = (id || "").trim().toUpperCase();
        const list = await getReviewsByMovie(m);
        setReviews(list.map(mapReviewToView));
      } catch (e) {
        // ignore silently on detail page
      }
    };
    if (id) fetchReviews();
  }, [id]);

  const formatDateTime = (s) => {
    try {
      return new Date(s).toLocaleString("vi-VN");
    } catch {
      return "";
    }
  };

  const handleDeleteReview = (review) => {
    if (!user?.MAKH) {
      alert("Bạn cần đăng nhập để xóa đánh giá");
      return;
    }
    if (review.userId !== user.MAKH) {
      alert("Bạn chỉ có thể xóa đánh giá của chính bạn");
      return;
    }
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview({
        MADG: reviewToDelete.id,
        MAPHIM: id.trim().toUpperCase(),
        MAKH: user.MAKH,
      });
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
    } catch (err) {
      const msg =
        err?.response?.data?.details || err.message || "Xóa đánh giá thất bại";
      alert(msg);
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleSelectShowtime = (showtime) => {
    navigate("/booking", {
      state: {
        movie: {
          title: movie.TENPHIM,
          images: movie.HINHANH,
          time: showtime.GIOBATDAU,
          date: showtime.NGAYCHIEU,
          theater: showtime.theater,
          room: showtime.room,
        },
        maPhong: showtime.maPhong || showtime.MAPHONG,
        maSuat: showtime.maSuat || showtime.MASUAT,
      },
    });
  };

  const handleOpenTrailer = () => {
    if (movie?.TRAILER) {
      window.open(movie.TRAILER, "_blank");
    } else {
      alert("Trailer không khả dụng");
    }
  };

  // Helper function to get local date string YYYY-MM-DD
  const toLocalDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {error || "Không tìm thấy phim"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Movie Hero Section */}
      <section className="relative h-[50vh] overflow-hidden mb-8">
        {movie.POSTER ? (
          <img
            src={movie.POSTER}
            alt={movie.TENPHIM}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 1 }}
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center"
            style={{ zIndex: 1 }}
          >
            Không có hình ảnh
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 p-8"
          style={{ zIndex: 3 }}
        >
          <div className="container mx-auto flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative w-48 h-72 flex-shrink-0">
              {movie.HINHANH ? (
                <img
                  src={movie.HINHANH[0]}
                  alt={movie.TENPHIM}
                  className="object-cover rounded-lg w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                  Không có hình ảnh
                </div>
              )}
            </div>
            <div className="text-white flex-1">
              <h1 className="text-4xl font-bold mb-4">{movie.TENPHIM}</h1>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="font-semibold">
                    {movie.DANHGIA || "Chưa có đánh giá"}/10
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8v4l3 3"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  <span>{movie.THOILUONG} phút</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                  </svg>
                  <span>
                    {new Date(movie.NGAYKHOICHIEU).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.THELOAI?.map((g) => (
                  <span key={g} className="badge badge-secondary">
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex space-x-4">
                <button className="btn-red" onClick={handleOpenTrailer}>
                  Xem Trailer
                </button>
                <button
                  className="btn-outline-dark"
                  onClick={() => setTab("about")}
                >
                  Thông tin phim
                </button>
                <button
                  className="btn-outline-dark"
                  onClick={() => setTab("reviews")}
                >
                  Đánh giá
                </button>
                <button
                  className="btn-back"
                  onClick={() => navigate("/movies")}
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container mx-auto px-8 md:px-32 py-8">
        <div className="tabs-list grid grid-cols-3 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab-trigger ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "showtimes" && (
          <div className="space-y-6">
            {movie.SAPCHIEU ? (
              <p className="text-2xl font-bold text-center flex items-center justify-center min-h-[200px]">
                Phim này chưa khởi chiếu, chưa có suất chiếu.
              </p>
            ) : showtimes.length === 0 ? (
              <p className="text-muted-foreground">
                Hiện tại chưa có suất chiếu cho phim này.
              </p>
            ) : (
              <>
                {/* Bộ chọn ngày: hôm nay + 4 ngày tới */}
                {(() => {
                  const days = Array.from({ length: 5 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    d.setHours(0, 0, 0, 0);
                    return {
                      key: toLocalDateString(d),
                      label: d.toLocaleDateString("vi-VN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      }),
                    };
                  });
                  const datesWithShows = new Set(
                    showtimes
                      .map((s) => toLocalDateString(s.NGAYCHIEU))
                      .filter(Boolean)
                  );
                  return (
                    <div className="flex flex-wrap gap-2 items-center">
                      {days.map((d) => {
                        const hasShows = datesWithShows.has(d.key);
                        const isActive = selectedDate === d.key;
                        return (
                          <button
                            key={d.key}
                            className={`px-3 py-1 rounded-full border text-sm ${
                              isActive
                                ? "bg-red-600 text-white border-red-600"
                                : hasShows
                                ? "bg-white hover:bg-gray-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => hasShows && setSelectedDate(d.key)}
                            disabled={!hasShows}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {(() => {
                  // Helper function to get local date string YYYY-MM-DD
                  const toLocalDateString = (date) => {
                    const d = new Date(date);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    return `${year}-${month}-${day}`;
                  };

                  const filtered = showtimes.filter((s) => {
                    const k = toLocalDateString(s.NGAYCHIEU);
                    return k === selectedDate;
                  });

                  if (filtered.length === 0) {
                    return (
                      <p className="text-2xl font-bold text-center flex items-center justify-center min-h-[200px]">
                        Không có suất chiếu trong ngày này.
                      </p>
                    );
                  }

                  const byTheater = Object.values(
                    filtered.reduce((acc, st) => {
                      const key = st.theater;
                      if (!acc[key]) {
                        acc[key] = {
                          theater: st.theater,
                          location: st.location,
                          times: [],
                        };
                      }
                      acc[key].times.push(st);
                      return acc;
                    }, {})
                  );

                  return byTheater.map((th, idx) => (
                    <div key={idx} className="card mb-4">
                      <div className="card-content p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {th.theater}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {th.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {th.times.map((st, i) => (
                            <button
                              key={i}
                              className="btn-outline-dark"
                              onClick={() => handleSelectShowtime(st)}
                            >
                              {st.GIOBATDAU}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </>
            )}
          </div>
        )}
        {tab === "about" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-6 border-b pb-2">
              Thông tin phim
            </h3>

            {/* Mô tả */}
            <p className="text-gray-700 mb-6 leading-relaxed">{movie.MOTA}</p>

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-800">
              <p>
                <span className="font-semibold">Đạo diễn:</span> {movie.DAODIEN}
              </p>
              <p>
                <span className="font-semibold">Diễn viên:</span>{" "}
                {movie.DANHSACHDV?.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Thể loại:</span>{" "}
                {movie.THELOAI?.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Ngày khởi chiếu:</span>{" "}
                {new Date(movie.NGAYKHOICHIEU).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <span className="font-semibold">Thời lượng:</span>{" "}
                {movie.THOILUONG} phút
              </p>
            </div>
          </div>
        )}

        {tab === "reviews" &&
          (movie.SAPCHIEU ? (
            <p className="text-2xl font-bold text-center flex items-center justify-center min-h-[200px]">
              Phim này chưa khởi chiếu, bạn không thể đánh giá.
            </p>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow-md">
              {/* Lọc đánh giá */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold">Lọc theo sao:</span>
                {[0, 5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    className={`px-3 py-1 rounded-full border ${
                      filter === star ? "bg-red-600 text-white" : "bg-gray-100"
                    }`}
                    onClick={() => setFilter(star)}
                  >
                    {star === 0 ? "Tất cả" : `${star}★`}
                  </button>
                ))}
              </div>

              {/* Danh sách đánh giá */}
              <div className="space-y-6 mb-8">
                {reviews
                  .filter((r) => filter === 0 || r.rating === filter)
                  .map((review, index) => (
                    <div
                      key={review.id || index}
                      className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800 text-lg">
                            {review.userName}
                          </span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg mr-1 last:mr-0 ${
                                  star <= review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {formatDateTime(review.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-gray-600 leading-relaxed">
                          {review.comment}
                        </p>
                        {user?.MAKH === review.userId && (
                          <button
                            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                            onClick={() => handleDeleteReview(review)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Form thêm đánh giá */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Thêm đánh giá của bạn</h3>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`cursor-pointer text-2xl ${
                        star <= newRating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết nhận xét của bạn..."
                  className="w-full p-2 border rounded-md mb-3"
                />
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          ))}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc muốn xóa đánh giá này không?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setReviewToDelete(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={confirmDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
