import React, { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  addUser,
  updateUser,
  getTheaters,
} from "../../services/api";

const theaterAdminsPerPage = 10;

const initialForm = {
  HOTEN: "",
  EMAIL: "",
  SDT: "",
  MATKHAU: "",
  VAITRO: "manager",
  MARAP: "",
};

const TheaterAdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    fetchAdmins();
    fetchTheaters();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getUsers();
      const theaterAdmins = data.filter(
        (user) => user.VAITRO === "manager" || user.VAITRO === "admin"
      );
      setAdmins(theaterAdmins || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách quản trị viên rạp:", error);
      alert("Không thể tải danh sách quản trị viên rạp. Kiểm tra server!");
    }
  };

  const fetchTheaters = async () => {
    try {
      const data = await getTheaters();
      setTheaters(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp:", error);
    }
  };

  const handleAdd = () => {
    setForm(initialForm);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEdit = (admin) => {
    setForm({
      HOTEN: admin.HOTEN,
      EMAIL: admin.EMAIL,
      SDT: admin.SDT,
      MATKHAU: admin.MATKHAU,
      VAITRO: admin.VAITRO,
      MARAP: admin.MARAP || "",
    });
    setIsEdit(true);
    setSelectedAdmin(admin);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra trùng email
    const isDuplicate = admins.some(
      (a) =>
        a.EMAIL.toLowerCase() === form.EMAIL.toLowerCase() &&
        (!isEdit || a._id !== selectedAdmin._id)
    );
    if (isDuplicate) {
      alert("Email đã tồn tại! Vui lòng chọn email khác.");
      return;
    }

    try {
      if (isEdit && selectedAdmin) {
        await updateUser(selectedAdmin._id, form);
      } else {
        await addUser(form);
      }
      setShowForm(false);
      fetchAdmins();
    } catch (error) {
      console.error("Lỗi khi lưu quản trị viên rạp:", error);
      alert("Không thể lưu quản trị viên rạp. Vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    if (selectedAdmin) {
      try {
        await deleteUser(selectedAdmin._id);
        setShowDelete(false);
        setSelectedAdmin(null);
        fetchAdmins();
      } catch (error) {
        console.error("Lỗi khi xóa quản trị viên rạp:", error);
        alert("Không thể xóa quản trị viên rạp. Vui lòng thử lại!");
      }
    }
  };

  // Tính toán phân trang
  const indexOfLastAdmin = currentPage * theaterAdminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - theaterAdminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(admins.length / theaterAdminsPerPage);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý quản trị viên rạp</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Thêm quản trị viên rạp
        </button>
      </div>

      <table className="w-full border border-gray-300 text-sm rounded overflow-hidden">
        <thead className="bg-blue-300">
          <tr>
            <th className="border px-4 py-3 text-left">Họ tên</th>
            <th className="border px-4 py-3 text-left">Email</th>
            <th className="border px-4 py-3 text-left">Số điện thoại</th>
            <th className="border px-4 py-3 text-left">Quyền</th>
            <th className="border px-4 py-3 text-left">Rạp quản lý</th>
            <th className="border px-4 py-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentAdmins.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                Không có dữ liệu quản trị viên rạp.
              </td>
            </tr>
          ) : (
            currentAdmins.map((a) => {
              const theater = theaters.find((t) => t.MARAP === a.MARAP);
              return (
                <tr key={a._id} className="hover:bg-blue-50">
                  <td className="border px-4 py-4 align-middle">{a.HOTEN}</td>
                  <td className="border px-4 py-4 align-middle">{a.EMAIL}</td>
                  <td className="border px-4 py-4 align-middle">{a.SDT}</td>
                  <td className="border px-4 py-4 align-middle">
                    {a.VAITRO === "admin" ? "Admin" : "Quản lý"}
                  </td>
                  <td className="border px-4 py-4 align-middle">
                    {theater ? theater.TENRAP : "N/A"}
                  </td>
                  <td className="border px-4 py-4 text-blue-500 cursor-pointer align-middle">
                    <span
                      onClick={() => handleEdit(a)}
                      className="mr-2 hover:underline"
                    >
                      Sửa
                    </span>
                    <span
                      onClick={() => {
                        setSelectedAdmin(a);
                        setShowDelete(true);
                      }}
                      className="text-red-500 hover:underline ml-2"
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
              );
            })
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

      {/* Form thêm/sửa quản trị viên rạp */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg w-96"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold mb-4">
              {isEdit ? "Sửa quản trị viên rạp" : "Thêm quản trị viên rạp"}
            </h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Họ tên</label>
              <input
                type="text"
                name="HOTEN"
                value={form.HOTEN}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                name="EMAIL"
                value={form.EMAIL}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Số điện thoại</label>
              <input
                type="phone"
                name="SDT"
                value={form.SDT}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Quyền</label>
              <select
                name="VAITRO"
                value={form.VAITRO}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="manager">Quản lý</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Rạp quản lý</label>
              <select
                name="MARAP"
                value={form.MARAP}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Chọn rạp</option>
                {theaters.map((theater) => (
                  <option key={theater._id} value={theater.MARAP}>
                    {theater.TENRAP}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Mật khẩu</label>
              <input
                type={isEdit ? "text" : "password"}
                name="MATKHAU"
                value={form.MATKHAU}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required={!isEdit}
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
              Bạn có chắc chắn muốn xóa quản trị viên rạp "
              {selectedAdmin?.HOTEN}" không?
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

export default TheaterAdminManager;
