import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/api";

const UserManager = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý người dùng</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border">Tên</th>
            <th className="border">Email</th>
            <th className="border">Quyền</th>
            <th className="border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border">{u.HOTEN}</td>
              <td className="border">{u.EMAIL}</td>
              <td className="border">{u.role}</td>
              <td className="border">
                <button
                  onClick={() => handleDelete(u._id)}
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

export default UserManager;
