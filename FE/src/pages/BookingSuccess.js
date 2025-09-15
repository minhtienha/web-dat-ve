import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resultCode = searchParams.get("resultCode");
  const message = searchParams.get("message");

  useEffect(() => {
    // If cancelled or failed, redirect to home or movie detail
    if (resultCode !== "0") {
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [resultCode, navigate]);

  if (resultCode === "0") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thanh toán thành công!</h2>
          <p className="mb-4">Vé của bạn đã được đặt thành công.</p>
          <button className="btn-red mt-4" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thanh toán thất bại</h2>
          <p className="mb-4">
            {message || "Giao dịch đã bị huỷ hoặc thất bại."}
          </p>
          <p className="text-sm text-gray-500">
            Đang chuyển hướng về trang chủ...
          </p>
        </div>
      </div>
    );
  }
}
