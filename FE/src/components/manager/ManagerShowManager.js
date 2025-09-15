import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getAllShowDetails,
  addShow,
  updateShow,
  deleteShow,
  getMovies,
  getRoomsByTheater,
} from "../../services/api";

const showsPerPage = 10;

const initialForm = {
  MAPHIM: "",
  MAPHONG: "",
  NGAYCHIEU: "",
  GIOBATDAU: "",
};

const ManagerShowManager = () => {
  const { user } = useContext(AuthContext);
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (user && user.MARAP) {
      fetchShows();
      fetchMovies();
      fetchRooms(user.MARAP);
    }
  }, [user]);

  const fetchShows = async () => {
    try {
      const data = await getAllShowDetails();
      console.log("Dữ liệu suất chiếu từ backend:", data); // Debug log
      // Filter shows by manager's theater
      const filteredShows = data.filter(
        (show) => show.MAPHONG?.MARAP?.MARAP === user.MARAP
      );
      setShows(filteredShows || []);
    } catch (error) {
      console.error("Lỗi fetch shows: ", error);
      alert("Không thể tải suất chiếu. Kiểm tra server!");
    }
  };

  const fetchMovies = async () => {
    const data = await getMovies();
    console.log("Dữ liệu phim:", data); // Debug
    setMovies(data || []);
  };

  const fetchRooms = async (maRap) => {
    if (!maRap) {
      setRooms([]);
      return;
    }
    const data = await getRoomsByTheater(maRap);
    setRooms(data || []);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getEndTime = (gioBatDau, thoiLuongPhim) => {
    const [h, m] = gioBatDau.split(":").map(Number);
    const start = new Date(0, 0, 0, h, m);
    start.setMinutes(start.getMinutes() + Number(thoiLuongPhim));
    const hh = String(start.getHours()).padStart(2, "0");
    const mm = String(start.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(shows.length / showsPerPage);

  const handleAdd = () => {
    setForm(initialForm);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEdit = (show) => {
    console.log("Editing show:", show); // Debug log
    console.log("Dữ liệu show để chỉnh sửa:", {
      MAPHIM: show.MAPHIM?.MAPHIM,
      MAPHONG: show.MAPHONG?.MAPHONG,
      NGAYCHIEU: show.NGAYCHIEU,
      GIOBATDAU: show.GIOBATDAU,
      GIOKETTHUC: show.GIOKETTHUC,
    });
    setForm({
      MAPHIM: show.MAPHIM?.MAPHIM || "",
      MAPHONG: show.MAPHONG?.MAPHONG || "",
      NGAYCHIEU: show.NGAYCHIEU?.slice(0, 10) || "",
      GIOBATDAU: show.GIOBATDAU || "",
    });
    setIsEdit(true);
    setShowForm(true);
    setSelectedShow(show);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const isTimeOverlap = (start1, end1, start2, end2) => {
    const s1 = toMinutes(start1);
    let e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    let e2 = toMinutes(end2);

    // Nếu interval 1 cross midnight
    const aSegments = [];
    if (e1 <= s1) {
      aSegments.push({ start: s1, end: 1440 });
      aSegments.push({ start: 0, end: e1 });
    } else {
      aSegments.push({ start: s1, end: e1 });
    }

    // Nếu interval 2 cross midnight
    const bSegments = [];
    if (e2 <= s2) {
      bSegments.push({ start: s2, end: 1440 });
      bSegments.push({ start: 0, end: e2 });
    } else {
      bSegments.push({ start: s2, end: e2 });
    }

    // Kiểm tra từng segment
    for (const a of aSegments) {
      for (const b of bSegments) {
        if (a.start < b.end && b.start < a.end) {
          return true;
        }
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedMovie = movies.find((m) => m.MAPHIM === form.MAPHIM);
    if (!selectedMovie || !selectedMovie.THOILUONG) {
      alert("Phim không có thời lượng hợp lệ!");
      return;
    }
    const sameRoomShows = shows.filter(
      (s) =>
        s.MAPHONG?.MAPHONG === form.MAPHONG &&
        s.NGAYCHIEU?.slice(0, 10) === form.NGAYCHIEU
    );
    const newStart = form.GIOBATDAU;
    const newEnd = getEndTime(form.GIOBATDAU, selectedMovie.THOILUONG || 0);
    for (const s of sameRoomShows) {
      if (isEdit && selectedShow && s.MASUAT === selectedShow.MASUAT) continue;
      const existStart = s.GIOBATDAU;
      const existEnd = getEndTime(s.GIOBATDAU, s.MAPHIM?.THOILUONG || 0);
      if (isTimeOverlap(newStart, newEnd, existStart, existEnd)) {
        alert("Suất chiếu bị trùng hoặc chồng lấn thời gian!");
        return;
      }
    }
    try {
      const endTime = getEndTime(form.GIOBATDAU, selectedMovie.THOILUONG || 0);
      if (isEdit && selectedShow) {
        const updateData = {
          NGAYCHIEU: form.NGAYCHIEU,
          MAPHONG: form.MAPHONG,
          MAPHIM: form.MAPHIM,
          GIOBATDAU: form.GIOBATDAU,
          GIOKETTHUC: endTime,
        };
        console.log("Dữ liệu gửi để cập nhật:", updateData);
        await updateShow(selectedShow.MASUAT, updateData);
      } else {
        const suatChieuData = {
          NGAYCHIEU: form.NGAYCHIEU,
          MAPHONG: form.MAPHONG,
          MAPHIM: form.MAPHIM,
          GIOBATDAU: form.GIOBATDAU,
          GIOKETTHUC: endTime,
        };
        console.log("Dữ liệu gửi để thêm:", suatChieuData);
        await addShow(suatChieuData);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Lỗi khi lưu suất chiếu:", error);
      alert("Không thể lưu suất chiếu. Vui lòng thử lại!");
      return;
    }
    // Fetch shows after successful save
    try {
      await fetchShows();
    } catch (error) {
      console.error("Lỗi khi tải lại danh sách suất chiếu:", error);
      // Không hiển thị alert lỗi vì dữ liệu đã được lưu thành công
    }
  };

  const handleDelete = async () => {
    if (selectedShow) {
      try {
        await deleteShow(selectedShow.MASUAT);
        setShowDelete(false);
        setSelectedShow(null);
        fetchShows();
      } catch (error) {
        console.error("Lỗi khi xóa suất chiếu:", error);
        alert("Không thể xóa suất chiếu. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý suất chiếu</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Thêm suất chiếu
        </button>
      </div>
      <table className="w-full border border-gray-300 text-sm rounded overflow-hidden">
        <thead className="bg-blue-300">
          <tr>
            <th className="border px-4 py-3 text-left w-60">Tên phim</th>
            <th className="border px-4 py-3 text-left">Phòng</th>
            <th className="border px-4 py-3 text-left">Ngày</th>
            <th className="border px-4 py-3 text-left">Giờ</th>
            <th className="border px-4 py-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentShows.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-400">
                Không có dữ liệu suất chiếu.
              </td>
            </tr>
          ) : (
            currentShows.map((s, idx) => (
              <tr key={idx} className="hover:bg-blue-50">
                <td className="border px-4 py-4 w-60 align-middle break-words whitespace-pre-line">
                  {s.MAPHIM?.TENPHIM || ""}
                </td>
                <td className="border px-4 py-4 align-middle">
                  {s.MAPHONG?.TENPHONG || ""}
                </td>
                <td className="border px-4 py-4 align-middle">
                  {s.NGAYCHIEU ? formatDate(s.NGAYCHIEU) : ""}
                </td>
                <td className="border px-4 py-4 align-middle">
                  {s.GIOBATDAU + " - " + s.GIOKETTHUC || ""}
                </td>
                <td className="border px-4 py-4 text-blue-500 cursor-pointer align-middle">
                  <span
                    onClick={() => handleEdit(s)}
                    className="mr-2 hover:underline"
                  >
                    Sửa
                  </span>
                  <span
                    onClick={() => {
                      setSelectedShow(s);
                      setShowDelete(true);
                    }}
                    className="text-red-500 hover:underline ml-2"
                  >
                    Xóa
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg w-96"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold mb-4">
              {isEdit ? "Sửa suất chiếu" : "Thêm suất chiếu"}
            </h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Phim</label>
              <select
                name="MAPHIM"
                value={form.MAPHIM}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
                disabled={isEdit}
              >
                <option value="">-- Chọn phim --</option>
                {movies.map((m) => (
                  <option key={m.MAPHIM} value={m.MAPHIM}>
                    {m.TENPHIM}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Phòng</label>
              <select
                name="MAPHONG"
                value={form.MAPHONG}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn phòng --</option>
                {rooms.map((p) => (
                  <option key={p.MAPHONG} value={p.MAPHONG}>
                    {p.TENPHONG}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Ngày chiếu</label>
              <input
                type="date"
                name="NGAYCHIEU"
                value={form.NGAYCHIEU}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Giờ bắt đầu</label>
              <input
                type="time"
                name="GIOBATDAU"
                value={form.GIOBATDAU}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Xác nhận xoá
            </h3>
            <p>Bạn có chắc chắn muốn xoá suất chiếu này không?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowDelete(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerShowManager;
