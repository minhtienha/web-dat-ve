import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNowShowingMovies, getUpcomingMovies } from "../services/api";

const defaultShowtimes = ["10:00", "13:00", "16:00", "19:00"];

const MoviesPage = () => {
  const navigate = useNavigate();
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tất cả");
  const [genres, setGenres] = useState(["Tất cả"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nowShowingPage, setNowShowingPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [nowMoviesData, upcomingMoviesData] = await Promise.all([
          getNowShowingMovies(),
          getUpcomingMovies(),
        ]);

        const nowMovies = nowMoviesData.map((movie) => ({
          ...movie,
          showtimes: movie.showtimes || defaultShowtimes,
        }));

        const upcomingMovies = upcomingMoviesData.map((movie) => ({
          ...movie,
          showtimes: [],
        }));

        const allGenres = [
          ...new Set(
            [...nowMovies, ...upcomingMovies]
              .flatMap((m) => m.THELOAI || [])
              .map(
                (genre) =>
                  genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()
              )
          ),
        ];
        setGenres(["Tất cả", ...allGenres]);

        setNowShowing(nowMovies);
        setUpcoming(upcomingMovies);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
        setError("Không thể tải danh sách phim");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Scroll to top on filters change for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [searchTerm, selectedGenre]);

  const filterMovies = (list) =>
    list.filter((movie) => {
      const matchesSearch = movie.TENPHIM.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
      const matchesGenre =
        selectedGenre === "Tất cả" ||
        movie.THELOAI.some((g) =>
          g.toLowerCase().includes(selectedGenre.toLowerCase())
        );
      return matchesSearch && matchesGenre;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {error}
      </div>
    );
  }

  const renderMovieCard = (movie, isUpcoming = false) => (
    <div key={movie.MAPHIM} className="movies-card group">
      <div className="movies-img-wrap">
        <img
          src={
            movie.HINHANH[0] ||
            "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.TENPHIM}
          className="movies-img"
        />
        {!isUpcoming && (
          <span className="movies-rating-badge">
            <svg
              className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {movie.DANHGIA || "Chưa có đánh giá"}
          </span>
        )}
        <div className="movies-overlay" />
        <div className="movies-hover-btn">
          {isUpcoming ? (
            <button onClick={() => navigate(`/movies/${movie.MAPHIM}`)}>
              Xem chi tiết
            </button>
          ) : (
            <button onClick={() => navigate(`/movies/${movie.MAPHIM}`)}>
              Đặt vé
            </button>
          )}
        </div>
      </div>
      <div className="movies-info">
        <h3 className="movies-title">{movie.TENPHIM}</h3>
        <p className="movies-genre">{movie.THELOAI.join(", ")}</p>
        {!isUpcoming && (
          <>
            <div className="movies-meta">
              <span className="duration">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4l3 3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                {movie.THOILUONG} phút
              </span>
              <span className="language">{movie.language}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-32 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tất cả phim</h1>
          <p className="text-gray-500">
            Khám phá và đặt vé các bộ phim mới nhất
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 border rounded w-full focus:border-red-500 outline-none"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="border rounded px-3 py-2 focus:border-red-500 outline-none"
            >
              {genres.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Now Showing */}
        <h2 className="text-2xl font-bold mb-4">Phim đang chiếu</h2>
        {filterMovies(nowShowing).length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              {filterMovies(nowShowing)
                .slice((nowShowingPage - 1) * 8, nowShowingPage * 8)
                .map((movie) => renderMovieCard(movie))}
            </div>
            <div className="flex justify-center gap-2 mb-12">
              {Array.from(
                { length: Math.ceil(filterMovies(nowShowing).length / 8) },
                (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      nowShowingPage === i + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setNowShowingPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 mb-12">
            Không tìm thấy phim phù hợp.
          </div>
        )}

        {/* Upcoming */}
        <h2 className="text-2xl font-bold mb-4">Phim sắp chiếu</h2>
        {filterMovies(upcoming).length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterMovies(upcoming)
                .slice((upcomingPage - 1) * 8, upcomingPage * 8)
                .map((movie) => renderMovieCard(movie, true))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {Array.from(
                { length: Math.ceil(filterMovies(upcoming).length / 8) },
                (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      upcomingPage === i + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setUpcomingPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy phim phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
