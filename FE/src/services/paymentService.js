import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Tạo yêu cầu thanh toán mới
export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment/create`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    throw error;
  }
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (orderId, requestId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment/status`, {
      params: { orderId, requestId },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái:", error);
    throw error;
  }
};

// Xử lý thanh toán thành công
export const handlePaymentSuccess = async (paymentData) => {
  try {
    // TODO: Gửi thông tin thanh toán thành công đến backend
    // để cập nhật trạng thái vé và gửi email xác nhận
    console.log("Thanh toán thành công:", paymentData);
    return { success: true, data: paymentData };
  } catch (error) {
    console.error("Lỗi khi xử lý thanh toán thành công:", error);
    throw error;
  }
};

// Lấy thông tin giá vé
export const getTicketPrice = async (movieId, seatType) => {
  try {
    // TODO: Triển khai API lấy giá vé từ backend
    // Tạm thời trả về giá mặc định
    const prices = {
      standard: 50000,
      vip: 80000,
      couple: 120000,
    };

    return prices[seatType] || prices["standard"];
  } catch (error) {
    console.error("Lỗi khi lấy giá vé:", error);
    throw error;
  }
};
