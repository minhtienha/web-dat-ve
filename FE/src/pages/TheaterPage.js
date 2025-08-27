import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTheaters } from "../services/api";

const TheaterPage = () => {
  const [activeCity, setActiveCity] = useState("Tất cả");
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const data = await getTheaters();
        setTheaters(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  // Scroll to top when switching city filter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeCity]);

  // Danh sách thành phố động + "Tất cả"
  const cities = useMemo(() => {
    const set = new Set(theaters.map((t) => t.TINHTHANH).filter(Boolean));
    return ["Tất cả", ...Array.from(set)];
  }, [theaters]);

  // Lọc rạp theo thành phố
  const filteredTheaters = useMemo(() => {
    if (activeCity === "Tất cả") return theaters;
    return theaters.filter((theater) => theater.TINHTHANH === activeCity);
  }, [theaters, activeCity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải danh sách rạp chiếu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Lỗi: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 btn-red rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Hero Section */}
        <div className="rounded-2xl p-8 mb-8 text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hệ thống rạp</h1>
          <p className="opacity-90">
            Khám phá rạp chiếu gần bạn và đặt vé nhanh chóng
          </p>
        </div>

        {/* City Selection */}
        <div className="flex overflow-x-auto mb-8 pb-2 gap-2">
          {cities.map((city) => {
            const count =
              city === "Tất cả"
                ? theaters.length
                : theaters.filter((t) => t.TINHTHANH === city).length;
            const active = activeCity === city;
            return (
              <button
                key={city}
                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => setActiveCity(city)}
              >
                {city} ({count})
              </button>
            );
          })}
        </div>

        {/* Theaters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTheaters.map((theater) => (
            <div
              key={theater.MARAP}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {theater.TENRAP}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {theater.TINHTHANH}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mt-3 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z"
                    />
                  </svg>
                  {theater.DIACHI}
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    className="flex-1 btn-outline"
                    onClick={() => navigate(`/theater/${theater.MARAP}`)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="flex-1 btn-red"
                    onClick={() =>
                      navigate(`/booking/select-movie`, {
                        state: { maRap: theater.MARAP },
                      })
                    }
                  >
                    Đặt vé
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheaterPage;
