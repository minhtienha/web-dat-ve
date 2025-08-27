import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    console.log("Submitting with email:", email);
    console.log("Auth instance:", auth);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn."
      );
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      switch (error.code) {
        case "auth/user-not-found":
          setError("Không tìm thấy tài khoản với email này.");
          break;
        case "auth/invalid-email":
          setError("Email không hợp lệ.");
          break;
        case "auth/too-many-requests":
          setError("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
          break;
        default:
          setError(`Có lỗi xảy ra: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Quên mật khẩu?
              </h1>
              <p className="text-slate-400 text-sm">
                Nhập email của bạn để nhận link đặt lại mật khẩu
              </p>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
                <p className="text-green-400 text-sm text-center">{message}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    error && email ? "border-red-500" : "border-slate-600"
                  }`}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-[1.02] active:scale-[0.98]"
                } text-white`}
              >
                {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
