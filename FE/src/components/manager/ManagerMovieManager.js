import React, { useEffect, useState } from "react";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../../services/api";

const initialForm = {
  MAPHIM: "",
  TENPHIM: "",
  MOTA: "",
  THOILUONG: "",
  NGAYKHOICHIEU: "",
  THELOAI: [],
  DAODIEN: "",
  DANHSACHDV: [],
  TRAILER: "",
  POSTER: "",
  HINHANH: [],
  DANHGIA: 0,
  DANGCHIEU: false,
  SAPCHIEU: false,
};

const ManagerMovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const data = await getMovies();
    setMovies(data);
  };

  // Mở form thêm mới
  const handleAdd = () => {
    setForm({ ...initialForm, DANHGIA: 0 }); // Đánh giá mặc định 0 khi thêm mới
    setIsEdit(false);
    setShowForm(true);
  };

  // Mở form sửa
  const handleEdit = (movie) => {
    setForm({
      ...movie,
      NGAYKHOICHIEU: movie.NGAYKHOICHIEU
        ? movie.NGAYKHOICHIEU.slice(0, 10)
        : "",
      THELOAI: movie.THELOAI || [],
      DANHSACHDV: movie.DANHSACHDV || [],
      HINHANH: movie.HINHANH || [],
      THOILUONG: movie.THOILUONG || "",
      DANHGIA: movie.DANHGIA || 0,
      DANGCHIEU: !!movie.DANGCHIEU,
      SAPCHIEU: !!movie.SAPCHIEU,
    });
    setIsEdit(true);
    setShowForm(true);
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["THELOAI", "DANHSACHDV", "HINHANH"].includes(name)) {
      setForm({ ...form, [name]: value.split(",").map((v) => v.trim()) });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (name === "THOILUONG" || name === "DANHGIA") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Lưu phim
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateMovie(form.MAPHIM, form);
      } else {
        await addMovie(form);
      }
      setShowForm(false);
      fetchMovies(); // Refresh danh sách phim
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error);
      alert("Không thể lưu phim. Vui lòng thử lại!");
    }
  };

  // Hàm xóa phim
  const handleDelete = async (maphim) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      try {
        await deleteMovie(maphim);
        fetchMovies(); // Refresh danh sách phim
      } catch (error) {
        console.error("Lỗi khi xóa phim:", error);
        alert("Không thể xóa phim. Vui lòng thử lại!");
      }
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Tính toán phân trang
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý phim</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAdd}
        >
          Thêm phim mới
        </button>
      </div>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-blue-300">
          <tr>
            <th className="border px-4 py-3 text-left w-80">Tên phim</th>
            <th className="border px-4 py-3 text-left">Ngày khởi chiếu</th>
            <th className="border px-4 py-3 text-left">Thể loại</th>
            <th className="border px-4 py-3 text-left">Trạng thái</th>
            <th className="border px-4 py-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((m) => (
            <tr key={m.MAPHIM} className="hover:bg-gray-50">
              <td className="border px-4 py-4 w-60 align-middle break-words whitespace-pre-line">
                {m.TENPHIM}
              </td>
              <td className="border px-4 py-4 align-middle">
                {formatDate(m.NGAYKHOICHIEU)}
              </td>
              <td className="border px-4 py-4 align-middle">
                {m.THELOAI && m.THELOAI.join(", ")}
              </td>
              <td className="border px-4 py-4 align-middle">
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                    m.DANGCHIEU ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {m.DANGCHIEU ? "Đang chiếu" : "Sắp chiếu"}
                </span>
              </td>
              <td className="border px-4 py-4 text-blue-500 cursor-pointer align-middle">
                <span
                  onClick={() => handleEdit(m)}
                  className="mr-2 hover:underline"
                >
                  Sửa
                </span>
                <span
                  onClick={() => handleDelete(m.MAPHIM)}
                  className="text-red-500 hover:underline ml-2"
                >
                  Xóa
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
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

      {/* Form thêm/sửa phim */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow w-[700px] space-y-3 max-h-[90vh] overflow-y-auto"
            onSubmit={handleSubmit}
          >
            <h3 className="text-lg font-bold mb-2">
              {isEdit ? "Sửa phim" : "Thêm phim mới"}
            </h3>
            <div>
              <label className="block mb-1">Tên phim</label>
              <input
                type="text"
                name="TENPHIM"
                value={form.TENPHIM}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Mô tả</label>
              <textarea
                name="MOTA"
                value={form.MOTA}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                rows={2}
              />
            </div>
            <div>
              <label className="block mb-1">Thời lượng (phút)</label>
              <input
                type="number"
                name="THOILUONG"
                value={form.THOILUONG}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Ngày khởi chiếu</label>
              <input
                type="date"
                name="NGAYKHOICHIEU"
                value={form.NGAYKHOICHIEU}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Thể loại</label>
              <input
                type="text"
                name="THELOAI"
                value={form.THELOAI.join(", ")}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                placeholder="Hành động, Hài, Tình cảm"
              />
            </div>
            <div>
              <label className="block mb-1">Đạo diễn</label>
              <input
                type="text"
                name="DAODIEN"
                value={form.DAODIEN}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Diễn viên</label>
              <input
                type="text"
                name="DANHSACHDV"
                value={form.DANHSACHDV.join(", ")}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                placeholder="Nguyễn Văn A, Trần Thị B"
              />
            </div>
            <div>
              <label className="block mb-1">Trailer (link)</label>
              <input
                type="text"
                name="TRAILER"
                value={form.TRAILER}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Poster (dán link)</label>
              <input
                type="text"
                name="POSTER"
                value={form.POSTER}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                placeholder="Dán link ảnh"
              />
              {form.POSTER && (
                <img src={form.POSTER} alt="Poster" className="mt-2 h-24" />
              )}
            </div>
            <div>
              <label className="block mb-1">
                Hình ảnh (dán link, cách nhau dấu phẩy)
              </label>
              <input
                type="text"
                name="HINHANH"
                value={form.HINHANH.join(", ")}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                placeholder="link1.jpg, link2.jpg"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.HINHANH.map((img, idx) => (
                  <img key={idx} src={img} alt={`img${idx}`} className="h-16" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="DANGCHIEU"
                  checked={form.DANGCHIEU}
                  onChange={handleChange}
                />
                Đang chiếu
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="SAPCHIEU"
                  checked={form.SAPCHIEU}
                  onChange={handleChange}
                />
                Sắp chiếu
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-300"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-blue-500 text-white"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagerMovieManager;
