import React from "react";

const NowShowingSection = ({ movies, navigate }) => {
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
          loading="lazy"
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
        <p className="movies-genre">{movie.THELOAI?.join(", ")}</p>
        {!isUpcoming && (
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
            <span className="language">
              {movie.language || "Không xác định"}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className="homepage-nowshowing py-4 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-32">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Đang chiếu</h2>
        </div>
        {movies.length === 0 ? (
          <div className="homepage-empty text-center py-4 col-span-full">
            Hiện tại chưa có phim nào đang chiếu.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.slice(0, 8).map((movie) => renderMovieCard(movie))}
            </div>
            <div className="text-center mt-8">
              <button
                className="btn-outline"
                onClick={() => navigate("/movies")}
              >
                Xem thêm
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NowShowingSection;
