import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handlePaymentSuccess } from "../services/paymentService";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Lấy dữ liệu từ query parameters hoặc state
        const searchParams = new URLSearchParams(location.search);
        const orderId = searchParams.get("orderId");
        const resultCode = searchParams.get("resultCode");
        const amount = searchParams.get("amount");

        if (orderId && resultCode === "0") {
          const paymentInfo = {
            orderId,
            amount,
            status: "success",
            transactionTime: new Date().toLocaleString("vi-VN"),
          };

          // Gửi thông tin thanh toán thành công đến backend
          await handlePaymentSuccess(paymentInfo);
          setPaymentData(paymentInfo);
        } else {
          setPaymentData({ status: "failed" });
        }
      } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        setPaymentData({ status: "error" });
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
        </div>
      </div>
    );
  }

  if (paymentData?.status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã đặt vé. Vé của bạn đã được xác nhận.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium">
                  {parseInt(paymentData.amount).toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">
                  {paymentData.transactionTime}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate("/account")}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Xem vé của tôi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-gray-600 mb-6">
            Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
