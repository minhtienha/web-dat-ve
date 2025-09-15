import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { validateInput } from "../utils/validation";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleRegister = async (event) => {
    event.preventDefault();

    // Validate all fields
    const validations = {
      name: validateInput("name", formData.name),
      email: validateInput("email", formData.email),
      phone: validateInput("phone", formData.phone),
      password: validateInput("password", formData.password),
    };

    const newErrors = {};
    let hasErrors = false;

    Object.keys(validations).forEach((key) => {
      if (!validations[key].isValid) {
        newErrors[key] = validations[key].message;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, password: true });

    if (hasErrors) {
      return;
    }

    try {
      const account = {
        HOTEN: formData.name,
        EMAIL: formData.email,
        SDT: formData.phone,
        MATKHAU: formData.password,
      };

      await register(account);
      setShowSuccessModal(true);
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        switch (errorData.error) {
          case "EMAIL_EXISTS":
            setError("Email đã tồn tại. Vui lòng sử dụng email khác.");
            break;
          case "PHONE_EXISTS":
            setError(
              "Số điện thoại đã tồn tại. Vui lòng sử dụng số điện thoại khác."
            );
            break;
          case "VALIDATION_ERROR":
            setError("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.");
            break;
          default:
            setError(
              "Lỗi đăng ký: " + (errorData.message || "Vui lòng thử lại sau.")
            );
        }
      } else {
        setError("Lỗi đăng ký: " + error.message);
      }
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  const getInputClassName = (fieldName) => {
    return `w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
      errors[fieldName] && touched[fieldName]
        ? "border-red-500"
        : "border-slate-600"
    }`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Đăng ký tài khoản
              </h1>
              <p className="text-slate-400 text-sm">
                Tạo tài khoản để trải nghiệm đặt vé xem phim nhanh chóng
              </p>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={getInputClassName("name")}
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.name && touched.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={getInputClassName("email")}
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
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className={getInputClassName("phone")}
                    placeholder="0987654321"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
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
                  className={getInputClassName("password")}
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

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-slate-400">
                    Tôi đồng ý với{" "}
                    <span className="text-red-400 hover:text-red-300 cursor-pointer transition-colors">
                      điều khoản và dịch vụ
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Đăng ký
              </button>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/30 border border-green-700 mb-4">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Đăng ký thành công!
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Tài khoản của bạn đã được tạo thành công. Bạn có thể đăng nhập
                ngay bây giờ.
              </p>
              <button
                onClick={handleSuccessConfirm}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Register;
