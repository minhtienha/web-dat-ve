import React, { useEffect, useState } from "react";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../../services/api";

const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    TENPHIM: "",
    NGAYKHOICHIEU: "",
    SAPCHIEU: true,
    DANGCHIEU: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const data = await getMovies();
    setMovies(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateMovie(editingId, form);
    } else {
      await addMovie(form);
    }
    setForm({
      TENPHIM: "",
      NGAYKHOICHIEU: "",
      SAPCHIEU: true,
      DANGCHIEU: false,
    });
    setEditingId(null);
    fetchMovies();
  };

  const handleEdit = (movie) => {
    setForm(movie);
    setEditingId(movie._id);
  };

  const handleDelete = async (id) => {
    await deleteMovie(id);
    fetchMovies();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý phim</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={form.TENPHIM}
          onChange={(e) => setForm({ ...form, TENPHIM: e.target.value })}
          placeholder="Tên phim"
          required
          className="border px-2"
        />
        <input
          type="date"
          value={form.NGAYKHOICHIEU}
          onChange={(e) => setForm({ ...form, NGAYKHOICHIEU: e.target.value })}
          required
          className="border px-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 rounded">
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border">Tên phim</th>
            <th className="border">Ngày khởi chiếu</th>
            <th className="border">Trạng thái</th>
            <th className="border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m._id}>
              <td className="border">{m.TENPHIM}</td>
              <td className="border">
                {new Date(m.NGAYKHOICHIEU).toLocaleDateString()}
              </td>
              <td className="border">
                {m.DANGCHIEU
                  ? "Đang chiếu"
                  : m.SAPCHIEU
                  ? "Sắp chiếu"
                  : "Đã chiếu"}
              </td>
              <td className="border">
                <button
                  onClick={() => handleEdit(m)}
                  className="text-blue-500 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="text-red-500"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieManager;
