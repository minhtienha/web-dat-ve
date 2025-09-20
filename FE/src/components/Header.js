// Header.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.js";
import "../assets/styles/home_clean.css";
import "../assets/styles/responsive.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-modern">
      <div className="header-container flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div
          className="header-logo flex items-center cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          <div className="header-logo-icon">MT</div>
          <span className="header-logo-text ml-2">MovieBooking</span>
        </div>

        {/* Mobile Menu Button - Cùng hàng với logo */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav hidden md:flex items-center space-x-6">
          <span
            onClick={() => handleNavigate("/")}
            className="header-link cursor-pointer"
          >
            Trang chủ
          </span>
          <span
            onClick={() => handleNavigate("/movies")}
            className="header-link cursor-pointer"
          >
            Phim
          </span>
          <span
            onClick={() => handleNavigate("/theaters")}
            className="header-link cursor-pointer"
          >
            Rạp chiếu
          </span>
          <span
            onClick={() => handleNavigate("/bookings")}
            className="header-link cursor-pointer"
          >
            Vé của tôi
          </span>
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions hidden md:flex items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span
                className="header-account cursor-pointer hover:text-red-800"
                onClick={() => handleNavigate("/account")}
              >
                {user.HOTEN || "Người dùng"}
              </span>
              <button
                className="header-signout text-white hover:text-gray-300 px-3 py-1"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              className="header-signin text-white hover:text-gray-300 px-3 py-1"
              onClick={() => handleNavigate("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed left-0 right-0 bg-gray-900 shadow-lg z-50 border-t border-gray-700"
          onClick={() => setIsMenuOpen(false)}
        >
          <nav
            className="flex flex-col p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              onClick={() => handleNavigate("/")}
              className="header-link py-3 px-4 hover:bg-gray-800 rounded cursor-pointer text-white block"
            >
              Trang chủ
            </span>
            <span
              onClick={() => handleNavigate("/movies")}
              className="header-link py-3 px-4 hover:bg-gray-800 rounded cursor-pointer text-white block"
            >
              Phim
            </span>
            <span
              onClick={() => handleNavigate("/theaters")}
              className="header-link py-3 px-4 hover:bg-gray-800 rounded cursor-pointer text-white block"
            >
              Rạp chiếu
            </span>
            <span
              onClick={() => handleNavigate("/bookings")}
              className="header-link py-3 px-4 hover:bg-gray-800 rounded cursor-pointer text-white block"
            >
              Vé của tôi
            </span>
            {user ? (
              <>
                <span
                  onClick={() => handleNavigate("/account")}
                  className="header-link py-3 px-4 hover:bg-gray-800 rounded cursor-pointer text-white block"
                >
                  {user.HOTEN || "Người dùng"}
                </span>
                <button
                  className="header-signout text-left py-3 px-4 hover:bg-gray-800 rounded text-white w-full text-left"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                className="header-signin text-left py-3 px-4 hover:bg-gray-800 rounded text-white w-full text-left"
                onClick={() => handleNavigate("/login")}
              >
                Đăng nhập
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
