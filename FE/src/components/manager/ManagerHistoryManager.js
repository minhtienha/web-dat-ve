import React, { useEffect, useState, useMemo, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllTickets, getMoviesForFilter } from "../../services/api";

const ticketsPerPage = 20;

const ManagerHistoryManager = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm chuẩn hóa ngày về yyyy-MM-dd
  const toDateString = (d) => d.toISOString().split("T")[0];

  useEffect(() => {
    if (user && user.MARAP) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [ticketsData, moviesData] = await Promise.all([
            getAllTickets(),
            getMoviesForFilter(),
          ]);
          // Filter tickets by manager's theater
          const filteredTickets = ticketsData.filter(
            (ticket) => ticket.marap === user.MARAP
          );
          setTickets(filteredTickets);
          setMovies(moviesData);
        } catch (err) {
          setError("Lỗi khi tải dữ liệu lịch sử vé.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesMovie = !selectedMovie || ticket.maphim === selectedMovie;

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

      return matchesMovie && matchesDate;
    });
  }, [tickets, selectedMovie, startDate, endDate]);

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
      <h2 className="text-2xl font-bold mb-4">Thống kê vé</h2>

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
            <th className="border px-4 py-2">Phòng</th>
            <th className="border px-4 py-2">Ngày chiếu</th>
            <th className="border px-4 py-2">Ghế</th>
            <th className="border px-4 py-2">Giá vé</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                Không có dữ liệu lịch sử vé.
              </td>
            </tr>
          ) : (
            currentTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="border px-4 py-2">{ticket.ma_ve || "N/A"}</td>
                <td className="border px-4 py-2">{ticket.tenkh || "N/A"}</td>
                <td className="border px-4 py-2">{ticket.tenphim || "N/A"}</td>
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

export default ManagerHistoryManager;
