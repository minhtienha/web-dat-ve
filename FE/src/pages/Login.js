import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { validateInput } from "../utils/validation";

const Signin = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    const validation = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: validation.message }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    // Validate all fields
    const emailValidation = validateInput("email", formData.email);
    const passwordValidation = validateInput("password", formData.password);

    const newErrors = {
      email: emailValidation.message,
      password: passwordValidation.message,
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    try {
      const response = await login({
        EMAIL: formData.email,
        MATKHAU: formData.password,
      });
      loginContext(response);
      const role = response.VAITRO;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "manager") {
        navigate("/manager");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        "Đăng nhập thất bại: " + (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Đăng nhập</h1>
              <p className="text-slate-400 text-sm">
                Chào mừng quay lại! Vui lòng đăng nhập để tiếp tục
              </p>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
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
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-slate-600"
                  }`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-slate-600"
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.password && touched.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-slate-400">
                    Lưu đăng nhập
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Đăng nhập
              </button>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
