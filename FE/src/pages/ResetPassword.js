import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { updatePasswordByEmail } from "../services/api";
import { validateInput } from "../utils/validation";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    const getEmailFromCode = async () => {
      try {
        const emailFromCode = await verifyPasswordResetCode(auth, oobCode);
        setEmail(emailFromCode);
      } catch (error) {
        setError("Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      }
    };

    if (oobCode) {
      getEmailFromCode();
    }
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    const passwordValidation = validateInput("password", newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      // Gọi API backend để cập nhật mật khẩu trong database
      await updatePasswordByEmail({ email, matkhau: newPassword });
      setSuccess(true);

      // Redirect về localhost sau 2 giây
      setTimeout(() => {
        window.location.href = "http://localhost:3000/login";
      }, 2000);
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Đặt lại mật khẩu
              </h1>
              <p className="text-slate-400 text-sm">
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>

            {success ? (
              <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
                <p className="text-green-400 text-sm text-center">
                  Mật khẩu đã được đặt lại thành công! Đang chuyển hướng về
                  trang đăng nhập...
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Mật khẩu mới
                  </label>
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-[1.02] active:scale-[0.98]"
                  } text-white`}
                >
                  {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
