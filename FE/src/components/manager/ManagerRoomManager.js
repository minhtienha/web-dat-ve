import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getRoomsByTheater,
  addRoom,
  updateRoom,
  deleteRoom,
} from "../../services/api";

const roomsPerPage = 10;

const initialForm = {
  TENPHONG: "",
  MARAP: "",
};

const ManagerRoomManager = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (user && user.MARAP) {
      fetchRooms(user.MARAP);
    }
  }, [user]);

  const fetchRooms = async (marap) => {
    try {
      const data = await getRoomsByTheater(marap);
      setRooms(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng:", error);
      alert("Không thể tải danh sách phòng. Kiểm tra server!");
    }
  };

  const handleAdd = () => {
    setForm({ ...initialForm, MARAP: user.MARAP });
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEdit = (room) => {
    setForm({
      TENPHONG: room.TENPHONG,
      MARAP: room.MARAP,
    });
    setIsEdit(true);
    setSelectedRoom(room);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra trùng tên phòng trong rạp
    const isDuplicate = rooms.some(
      (r) =>
        r.TENPHONG.toLowerCase() === form.TENPHONG.toLowerCase() &&
        (!isEdit || r.MAPHONG !== selectedRoom.MAPHONG)
    );
    if (isDuplicate) {
      alert("Tên phòng đã tồn tại trong rạp này! Vui lòng chọn tên khác.");
      return;
    }

    try {
      if (isEdit && selectedRoom) {
        await updateRoom(selectedRoom.MAPHONG, form);
      } else {
        await addRoom(form);
      }
      setShowForm(false);
      fetchRooms(user.MARAP);
    } catch (error) {
      console.error("Lỗi khi lưu phòng chiếu:", error);
      alert("Không thể lưu phòng chiếu. Vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    if (selectedRoom) {
      try {
        await deleteRoom(selectedRoom.MAPHONG);
        setShowDelete(false);
        setSelectedRoom(null);
        fetchRooms(user.MARAP);
      } catch (error) {
        console.error("Lỗi khi xóa phòng chiếu:", error);
        alert("Không thể xóa phòng chiếu. Vui lòng thử lại!");
      }
    }
  };

  // Tính toán phân trang
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý phòng chiếu</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Thêm phòng chiếu
        </button>
      </div>

      <table className="w-full border border-gray-300 text-sm rounded overflow-hidden">
        <thead className="bg-blue-300">
          <tr>
            <th className="border px-4 py-3 text-left">Mã phòng</th>
            <th className="border px-4 py-3 text-left w-60">Tên phòng</th>
            <th className="border px-4 py-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentRooms.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-8 text-gray-400">
                Không có dữ liệu phòng chiếu.
              </td>
            </tr>
          ) : (
            currentRooms.map((r) => (
              <tr key={r.MAPHONG} className="hover:bg-blue-50">
                <td className="border px-4 py-4 align-middle">{r.MAPHONG}</td>
                <td className="border px-4 py-4 w-60 align-middle break-words whitespace-pre-line">
                  {r.TENPHONG}
                </td>
                <td className="border px-4 py-4 text-blue-500 cursor-pointer align-middle">
                  <span
                    onClick={() => handleEdit(r)}
                    className="mr-2 hover:underline"
                  >
                    Sửa
                  </span>
                  <span
                    onClick={() => {
                      setSelectedRoom(r);
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

      {/* Form thêm/sửa phòng chiếu */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg w-96"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-bold mb-4">
              {isEdit ? "Sửa phòng chiếu" : "Thêm phòng chiếu"}
            </h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Tên phòng</label>
              <input
                type="text"
                name="TENPHONG"
                value={form.TENPHONG}
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
              Bạn có chắc chắn muốn xóa phòng chiếu "{selectedRoom?.TENPHONG}"
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

export default ManagerRoomManager;
