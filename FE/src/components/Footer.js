import React from "react";
import "../assets/styles/home_clean.css";

const Footer = () => (
  <footer className="footer-modern">
    <div className="footer-container">
      <div>
        <div className="footer-logo-wrap">
          <div className="footer-logo-icon">MT</div>
          <span className="footer-logo-text">MovieBooking</span>
        </div>
        <p className="footer-desc">
          Nền tảng đặt vé xem phim trực tuyến nhanh chóng, tiện lợi và an toàn
          cho mọi rạp chiếu.
        </p>
      </div>
      <div>
        <h3 className="footer-title">Liên kết nhanh</h3>
        <ul className="footer-list">
          <li>
            <a href="/movies">Phim</a>
          </li>
          <li>
            <a href="/theaters">Rạp chiếu</a>
          </li>
          <li>
            <a href="/offers">Ưu đãi</a>
          </li>
          <li>
            <a href="/gift-cards">Thẻ quà tặng</a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="footer-title">Hỗ trợ</h3>
        <ul className="footer-list">
          <li>
            <a href="/help">Trung tâm trợ giúp</a>
          </li>
          <li>
            <a href="/contact">Liên hệ</a>
          </li>
          <li>
            <a href="/feedback">Góp ý</a>
          </li>
          <li>
            <a href="/terms">Điều khoản dịch vụ</a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="footer-title">Kết nối</h3>
        <ul className="footer-list">
          <li>
            <a href="#">Facebook</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
          <li>
            <a href="#">Instagram</a>
          </li>
          <li>
            <a href="#">YouTube</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>
        &copy; {new Date().getFullYear()} Đặt Vé Xem Phim. Đã đăng ký bản quyền.
      </p>
    </div>
  </footer>
);

export default Footer;
