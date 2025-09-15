import React, { useEffect, useState, useMemo } from "react";
import {
  getAllTickets,
  getMoviesForFilter,
  getTheatersForFilter,
} from "../../services/api";

const ticketsPerPage = 20;

const HistoryManager = () => {
  const [tickets, setTickets] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm chuẩn hóa ngày về yyyy-MM-dd
  const toDateString = (d) => d.toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsData, moviesData, theatersData] = await Promise.all([
          getAllTickets(),
          getMoviesForFilter(),
          getTheatersForFilter(),
        ]);
        setTickets(ticketsData);
        setMovies(moviesData);
        setTheaters(theatersData);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu lịch sử vé.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesMovie = !selectedMovie || ticket.maphim === selectedMovie;
      const matchesTheater =
        !selectedTheater || ticket.marap === selectedTheater;

      // chuẩn hóa ngày chiếu từ ticket
      const ticketDate = ticket.ngaychieu
        ? toDateString(new Date(ticket.ngaychieu))
        : null;

      const start = startDate || null;
      const end = endDate || null;

      const matchesDate =
        (!start && !end) ||
        (ticketDate &&
          (!start || ticketDate >= start) &&
          (!end || ticketDate <= end));

      return matchesMovie && matchesTheater && matchesDate;
    });
  }, [tickets, selectedMovie, selectedTheater, startDate, endDate]);

  const totalRevenue = useMemo(() => {
    return filteredTickets.reduce(
      (sum, ticket) => sum + (ticket.giave || 0),
      0
    );
  }, [filteredTickets]);

  const ticketsSold = filteredTickets.length;

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lịch sử vé</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phim:</label>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Tất cả phim</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.TENPHIM}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rạp:</label>
          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Tất cả rạp</option>
            {theaters.map((theater) => (
              <option key={theater._id} value={theater._id}>
                {theater.TENRAP}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="mb-4 flex gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
          <p className="text-2xl font-bold">
            {totalRevenue.toLocaleString()} VND
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Vé đã bán</h3>
          <p className="text-2xl font-bold">{ticketsSold}</p>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-blue-300">
          <tr>
            <th className="border px-4 py-2">Mã vé</th>
            <th className="border px-4 py-2">Khách hàng</th>
            <th className="border px-4 py-2">Tên phim</th>
            <th className="border px-4 py-2">Rạp</th>
            <th className="border px-4 py-2">Phòng</th>
            <th className="border px-4 py-2">Ngày chiếu</th>
            <th className="border px-4 py-2">Ghế</th>
            <th className="border px-4 py-2">Giá vé</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4">
                Không có dữ liệu lịch sử vé.
              </td>
            </tr>
          ) : (
            currentTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="border px-4 py-2">{ticket.ma_ve || "N/A"}</td>
                <td className="border px-4 py-2">{ticket.tenkh || "N/A"}</td>
                <td className="border px-4 py-2">{ticket.tenphim || "N/A"}</td>
                <td className="border px-4 py-2">{ticket.tenrap || "N/A"}</td>
                <td className="border px-4 py-2">{ticket.tenphong || "N/A"}</td>
                <td className="border px-4 py-2">
                  {ticket.ngaychieu
                    ? new Date(ticket.ngaychieu).toLocaleDateString("vi-VN")
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">{ticket.maghe || "N/A"}</td>
                <td className="border px-4 py-2">
                  {ticket.giave
                    ? ticket.giave.toLocaleString() + " VND"
                    : "N/A"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryManager;
