import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTheaterByMarap } from "../../services/api";
import ManagerMovieManager from "./ManagerMovieManager";
import ManagerShowManager from "./ManagerShowManager";
import ManagerHistoryManager from "./ManagerHistoryManager";
import ManagerRoomManager from "./ManagerRoomManager";

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theater, setTheater] = useState(null);
  const [tab, setTab] = useState("movies");

  useEffect(() => {
    if (!user || user.VAITRO !== "manager") {
      navigate("/");
      return;
    }
    if (user.MARAP) {
      getTheaterByMarap(user.MARAP)
        .then((data) => setTheater(data))
        .catch(() => setTheater(null));
    }
  }, [user, navigate]);

  if (!user || user.VAITRO !== "manager") {
    return null;
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-end items-center">
        <span className="text-lg font-semibold">
          Xin chào, {user?.HOTEN || "Quản lý"}
        </span>
        <span className="mx-2"> | </span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar cố định chiều cao */}
        <div className="w-full md:w-1/6 bg-blue-500 p-4 shadow h-full">
          {/* Nút chuyển tab */}
          <button
            onClick={() => setTab("movies")}
            className={`w-full text-left py-2 ${
              tab === "movies" ? "font-bold text-yellow-400" : "text-white"
            }`}
          >
            Quản lý phim
          </button>
          <hr className="my-2 border-gray-300" />
          <button
            onClick={() => setTab("shows")}
            className={`w-full text-left py-2 ${
              tab === "shows" ? "font-bold text-yellow-400" : "text-white"
            }`}
          >
            Quản lý suất chiếu
          </button>
          <hr className="my-2 border-gray-300" />
          <button
            onClick={() => setTab("rooms")}
            className={`w-full text-left py-2 ${
              tab === "rooms" ? "font-bold text-yellow-400" : "text-white"
            }`}
          >
            Quản lý phòng chiếu
          </button>
          <hr className="my-2 border-gray-300" />
          <button
            onClick={() => setTab("history")}
            className={`w-full text-left py-2 ${
              tab === "history" ? "font-bold text-yellow-400" : "text-white"
            }`}
          >
            Thống kê
          </button>
          <hr className="my-2 border-gray-300" />
        </div>

        {/* Main content cuộn nếu dài */}
        <div className="flex-1 overflow-y-auto p-8">
          {tab === "movies" && <ManagerMovieManager />}
          {tab === "shows" && <ManagerShowManager />}
          {tab === "rooms" && <ManagerRoomManager />}
          {tab === "history" && <ManagerHistoryManager />}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
