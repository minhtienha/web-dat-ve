import React, { useEffect, useState } from "react";
import { getShows, addShow, deleteShow } from "../../services/api";

const ShowManager = () => {
  const [shows, setShows] = useState([]);
  const [form, setForm] = useState({ MAPHIM: "", NGAYCHIEU: "", GIOCHIEU: "" });

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    const data = await getShows();
    setShows(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addShow(form);
    setForm({ MAPHIM: "", NGAYCHIEU: "", GIOCHIEU: "" });
    fetchShows();
  };

  const handleDelete = async (id) => {
    await deleteShow(id);
    fetchShows();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý suất chiếu</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={form.MAPHIM}
          onChange={(e) => setForm({ ...form, MAPHIM: e.target.value })}
          placeholder="Mã phim"
          required
          className="border px-2"
        />
        <input
          type="date"
          value={form.NGAYCHIEU}
          onChange={(e) => setForm({ ...form, NGAYCHIEU: e.target.value })}
          required
          className="border px-2"
        />
        <input
          type="time"
          value={form.GIOCHIEU}
          onChange={(e) => setForm({ ...form, GIOCHIEU: e.target.value })}
          required
          className="border px-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 rounded">
          Thêm
        </button>
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border">Mã phim</th>
            <th className="border">Ngày chiếu</th>
            <th className="border">Giờ chiếu</th>
            <th className="border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((s) => (
            <tr key={s._id}>
              <td className="border">{s.MAPHIM}</td>
              <td className="border">{s.NGAYCHIEU}</td>
              <td className="border">{s.GIOCHIEU}</td>
              <td className="border">
                <button
                  onClick={() => handleDelete(s._id)}
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

export default ShowManager;
