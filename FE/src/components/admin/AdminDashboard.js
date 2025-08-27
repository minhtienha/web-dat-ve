import React, { useState } from "react";
import MovieManager from "../../components/admin/MovieManager";
import UserManager from "../../components/admin/UserManager";
import ShowManager from "../../components/admin/ShowManager";

const AdminDashboard = () => {
  const [tab, setTab] = useState("movies");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Quản trị hệ thống</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("movies")}
            className={tab === "movies" ? "font-bold underline" : ""}
          >
            Quản lý phim
          </button>
          <button
            onClick={() => setTab("shows")}
            className={tab === "shows" ? "font-bold underline" : ""}
          >
            Quản lý suất chiếu
          </button>
          <button
            onClick={() => setTab("users")}
            className={tab === "users" ? "font-bold underline" : ""}
          >
            Quản lý người dùng
          </button>
        </div>
        <div>
          {tab === "movies" && <MovieManager />}
          {tab === "shows" && <ShowManager />}
          {tab === "users" && <UserManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
