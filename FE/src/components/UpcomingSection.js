import React from "react";

import { useNavigate } from "react-router-dom";

const UpcomingSection = ({ upcomingMovies, handleBuyTicketClick }) => {
  const navigate = useNavigate();
  const renderMovieCard = (movie, isUpcoming = true) => (
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
        <span className="movies-rating-badge">
          <svg
            className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          {movie.DANHGIA || "Chưa có đánh giá"}
        </span>
        <div className="movies-overlay" />
        <div className="movies-hover-btn">
          <button onClick={() => handleBuyTicketClick(movie)}>
            Xem chi tiết
          </button>
        </div>
      </div>
      <div className="movies-info">
        <h3 className="movies-title">{movie.TENPHIM}</h3>
        <p className="movies-genre">{movie.THELOAI?.join(", ")}</p>
      </div>
    </div>
  );

  return (
    <section className="homepage-upcoming py-4 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-32">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Sắp chiếu</h2>
        </div>
        {upcomingMovies.length === 0 ? (
          <div className="homepage-empty text-center py-4 col-span-full">
            Không tìm thấy phim phù hợp.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingMovies
                .slice(0, 8)
                .map((movie) => renderMovieCard(movie))}
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

export default UpcomingSection;
