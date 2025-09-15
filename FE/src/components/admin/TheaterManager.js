import React, { useEffect, useState } from "react";
import {
  getTheaters,
  deleteTheater,
  addTheater,
  updateTheater,
} from "../../services/api";

const theatersPerPage = 10;

const initialForm = {
  TENRAP: "",
  DIACHI: "",
  TINHTHANH: "",
};

const TheaterManager = () => {
  const [theaters, setTheaters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const data = await getTheaters();
      setTheaters(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp chiếu:", error);
      alert("Không thể tải danh sách rạp chiếu. Kiểm tra server!");
    }
  };

  const handleAdd = () => {
    setForm(initialForm);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEdit = (theater) => {
    setForm({
      TENRAP: theater.TENRAP,
      DIACHI: theater.DIACHI,
      TINHTHANH: theater.TINHTHANH,
    });
    setIsEdit(true);
    setSelectedTheater(theater);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra trùng tên rạp
    const isDuplicate = theaters.some(
      (t) =>
        t.TENRAP.toLowerCase() === form.TENRAP.toLowerCase() &&
        (!isEdit || t.MARAP !== selectedTheater.MARAP)
    );
    if (isDuplicate) {
      alert("Tên rạp đã tồn tại! Vui lòng chọn tên khác.");
      return;
    }

    try {
      if (isEdit && selectedTheater) {
        await updateTheater(selectedTheater.MARAP, form);
      } else {
        await addTheater(form);
      }
      setShowForm(false);
      fetchTheaters();
    } catch (error) {
      console.error("Lỗi khi lưu rạp chiếu:", error);
      alert("Không thể lưu rạp chiếu. Vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    if (selectedTheater) {
      try {
        await deleteTheater(selectedTheater.MARAP);
        setShowDelete(false);
        setSelectedTheater(null);
        fetchTheaters();
      } catch (error) {
        console.error("Lỗi khi xóa rạp chiếu:", error);
        alert("Không thể xóa rạp chiếu. Vui lòng thử lại!");
      }
    }
  };

  // Tính toán phân trang
  const indexOfLastTheater = currentPage * theatersPerPage;
  const indexOfFirstTheater = indexOfLastTheater - theatersPerPage;
  const currentTheaters = theaters.slice(
    indexOfFirstTheater,
    indexOfLastTheater
  );
  const totalPages = Math.ceil(theaters.length / theatersPerPage);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý rạp chiếu phim</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Thêm rạp chiếu
        </button>
      </div>

      <table className="w-full border border-gray-300 text-sm rounded overflow-hidden">
        <thead className="bg-blue-300">
          <tr>
            <th className="border px-4 py-3 text-left">Mã rạp</th>
            <th className="border px-4 py-3 text-left w-60">Tên rạp</th>
            <th className="border px-4 py-3 text-left">Địa chỉ</th>
            <th className="border px-4 py-3 text-left">Tỉnh thành</th>
            <th className="border px-4 py-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentTheaters.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-400">
                Không có dữ liệu rạp chiếu.
              </td>
            </tr>
          ) : (
            currentTheaters.map((t) => (
              <tr key={t.MARAP} className="hover:bg-blue-50">
                <td className="border px-4 py-4 align-middle">{t.MARAP}</td>
                <td className="border px-4 py-4 w-60 align-middle break-words whitespace-pre-line">
                  {t.TENRAP}
                </td>
                <td className="border px-4 py-4 align-middle">{t.DIACHI}</td>
                <td className="border px-4 py-4 align-middle">{t.TINHTHANH}</td>
                <td className="border px-4 py-4 text-blue-500 cursor-pointer align-middle">
                  <span
                    onClick={() => handleEdit(t)}
                    className="mr-2 hover:underline"
                  >
                    Sửa
                  </span>
                  <span
                    onClick={() => {
                      setSelectedTheater(t);
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

      {/* Form thêm/sửa rạp chiếu */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg w-96"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold mb-4">
              {isEdit ? "Sửa rạp chiếu" : "Thêm rạp chiếu"}
            </h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Tên rạp</label>
              <input
                type="text"
                name="TENRAP"
                value={form.TENRAP}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Địa chỉ</label>
              <input
                type="text"
                name="DIACHI"
                value={form.DIACHI}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Tỉnh thành</label>
              <input
                type="text"
                name="TINHTHANH"
                value={form.TINHTHANH}
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

      {/* Modal xác nhận xóa */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Xác nhận xóa
            </h3>
            <p>
              Bạn có chắc chắn muốn xóa rạp chiếu "{selectedTheater?.TENRAP}"
              không?
            </p>
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
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheaterManager;
