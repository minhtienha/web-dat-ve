import React, { useState, useEffect } from "react";
import "../assets/styles/home_clean.css";
import { useNavigate } from "react-router-dom";
import NowShowingSection from "../components/NowShowingSection";
import UpcomingSection from "../components/UpcomingSection";
import {
  getFeaturedMovies,
  getNowShowingMovies,
  getUpcomingMovies,
  getShowtimesByMovie,
  getShowtimeDetail,
  getRoomDetail,
  getTheaterDetail,
} from "../services/api";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const [qbMovieId, setQbMovieId] = useState("");
  const [qbShowtimes, setQbShowtimes] = useState([]);
  const [qbTheater, setQbTheater] = useState("");
  const [qbDate, setQbDate] = useState("");
  const [qbTime, setQbTime] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const featured = await getFeaturedMovies();
        setFeaturedMovies(featured.slice(0, 5));

        const nowShowing = await getNowShowingMovies();
        setMovies(nowShowing);

        const upcoming = await getUpcomingMovies();
        setUpcomingMovies(upcoming);
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    }
    fetchData();
  }, []);

  // Tự động chuyển slide cho phim nổi bật
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredMovies]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
    );
  };

  // Xử lý mua vé
  const handleBuyTicketClick = (movie) => {
    navigate(`/movies/${movie.MAPHIM}`);
  };

  const handleOpenTrailer = (movie) => {
    if (movie?.TRAILER) {
      window.open(movie.TRAILER, "_blank");
    } else {
      alert("Trailer không khả dụng");
    }
  };

  useEffect(() => {
    async function fetchQbShowtimes(movieId) {
      try {
        setQbShowtimes([]);
        setQbTheater("");
        setQbDate("");
        setQbTime("");
        if (!movieId) return;

        const showtimesRes = await getShowtimesByMovie(movieId);
        const enriched = await Promise.all(
          showtimesRes.data.map(async (st) => {
            try {
              const suatChieuRes = await getShowtimeDetail(st.MASUAT.MASUAT);
              const phongRes = await getRoomDetail(
                suatChieuRes.data.MAPHONG.MAPHONG
              );
              const rapRes = await getTheaterDetail(phongRes.data.MARAP.MARAP);

              return {
                maSuat: suatChieuRes.data.MASUAT,
                maPhong: suatChieuRes.data.MAPHONG.MAPHONG,
                time: st.GIOBATDAU,
                date: suatChieuRes.data.NGAYCHIEU,
                theater: rapRes.data.TENRAP,
                room: phongRes.data.TENPHONG,
              };
            } catch {
              return null;
            }
          })
        );
        setQbShowtimes(enriched.filter(Boolean));
      } catch (err) {
        console.error("Lỗi lấy suất chiếu cho đặt vé nhanh:", err);
      }
    }

    if (qbMovieId) fetchQbShowtimes(qbMovieId);
  }, [qbMovieId]);

  const qbTheaterOptions = Array.from(
    new Set(qbShowtimes.map((s) => s.theater))
  );
  const qbDateOptions = Array.from(
    new Set(
      qbShowtimes
        .filter((s) => (!qbTheater ? true : s.theater === qbTheater))
        .map((s) => s.date)
    )
  );
  const qbTimeOptions = qbShowtimes
    .filter(
      (s) =>
        (!qbTheater || s.theater === qbTheater) &&
        (!qbDate || s.date === qbDate)
    )
    .map((s) => s.time);

  const handleQuickBook = () => {
    if (!qbMovieId || !qbTheater || !qbDate || !qbTime) return;
    const movie =
      movies.find((m) => m.MAPHIM === qbMovieId) ||
      featuredMovies.find((m) => m.MAPHIM === qbMovieId);
    const chosen = qbShowtimes.find(
      (s) => s.theater === qbTheater && s.date === qbDate && s.time === qbTime
    );
    if (!movie || !chosen) return;
    navigate("/booking", {
      state: {
        movie: {
          title: movie.TENPHIM,
          poster: movie.POSTER,
          time: chosen.time,
          date: chosen.date,
          theater: chosen.theater,
          room: chosen.room,
        },
        maPhong: chosen.maPhong,
        maSuat: chosen.maSuat,
      },
    });
  };

  return (
    <div className="homepage-app">
      {/* Hero Slider */}
      <section className="homepage-hero-slider">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.MAPHIM}
            className={`homepage-hero-slide ${
              index === currentSlide ? "active" : ""
            }`}
            style={{
              backgroundImage: `url(${movie.POSTER})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              display: index === currentSlide ? "block" : "none",
            }}
          >
            <div className="homepage-hero-overlay" />
            <div className="homepage-hero-content">
              <span className="homepage-badge">Phim nổi bật</span>
              <h1>{movie.TENPHIM}</h1>
              <div className="homepage-hero-info">
                <span>{movie.THELOAI?.join(", ")}</span>
              </div>
              <div className="homepage-hero-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleBuyTicketClick(movie)}
                >
                  Mua vé
                </button>
                <button
                  className="btn-outline"
                  onClick={() => handleOpenTrailer(movie)}
                >
                  ▶ Xem trailer
                </button>
              </div>
            </div>
            {/* Slider Controls */}
            <button
              className="slider-btn prev"
              onClick={prevSlide}
              style={{
                position: "absolute",
                top: "50%",
                left: "20px",
                transform: "translateY(-50%)",
                background: "#d3d3d3",
                color: "black",
                border: "none",
                borderRadius: "50%",
                padding: "15px",
                cursor: "pointer",
                fontSize: "24px",
                zIndex: 10,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
              }}
            >
              {"<"}
            </button>
            <button
              className="slider-btn next"
              onClick={nextSlide}
              style={{
                position: "absolute",
                top: "50%",
                right: "20px",
                transform: "translateY(-50%)",
                background: "#d3d3d3",
                color: "black",
                border: "none",
                borderRadius: "50%",
                padding: "15px",
                cursor: "pointer",
                fontSize: "24px",
                zIndex: 10,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
              }}
            >
              {">"}
            </button>
            {/* Slider Indicators */}
            <div className="slider-indicators">
              {featuredMovies.map((_, idx) => (
                <span
                  key={idx}
                  className={`slider-dot ${
                    idx === currentSlide ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <NowShowingSection
        movies={movies}
        handleBuyTicketClick={handleBuyTicketClick}
        navigate={navigate}
      />

      <UpcomingSection
        upcomingMovies={upcomingMovies}
        handleBuyTicketClick={handleBuyTicketClick}
      />

      {/* Quick Booking Section */}
      <section className="homepage-quick-booking">
        <div className="homepage-section-header center">
          <h2>Đặt vé nhanh</h2>
          <p>
            Đặt vé xem phim chỉ với vài thao tác. Chọn phim, rạp và suất chiếu
            bạn muốn.
          </p>
        </div>
        <div className="homepage-booking-form">
          <select
            value={qbMovieId}
            onChange={(e) => setQbMovieId(e.target.value)}
          >
            <option value="">Chọn phim</option>
            {movies.concat(upcomingMovies).map((m) => (
              <option key={m.MAPHIM} value={m.MAPHIM}>
                {m.TENPHIM}
              </option>
            ))}
          </select>
          <select
            value={qbTheater}
            onChange={(e) => {
              setQbTheater(e.target.value);
              setQbDate("");
              setQbTime("");
            }}
            disabled={!qbMovieId || qbTheaterOptions.length === 0}
          >
            <option value="">Chọn rạp</option>
            {qbTheaterOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={qbDate}
            onChange={(e) => {
              setQbDate(e.target.value);
              setQbTime("");
            }}
            disabled={!qbTheater}
          >
            <option value="">Chọn ngày</option>
            {qbDateOptions.map((d) => (
              <option key={d} value={d}>
                {new Date(d).toLocaleDateString("vi-VN")}
              </option>
            ))}
          </select>
          <select
            value={qbTime}
            onChange={(e) => setQbTime(e.target.value)}
            disabled={!qbDate}
          >
            <option value="">Chọn giờ</option>
            {qbTimeOptions.map((t) => (
              <option key={t} value={t}>
                {new Date(t).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                })}
              </option>
            ))}
          </select>
          <button
            className="btn-primary"
            disabled={!qbTime}
            onClick={handleQuickBook}
          >
            Đặt vé
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
