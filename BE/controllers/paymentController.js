const crypto = require("crypto");
const axios = require("axios");

// Cấu hình MoMo
const MOMO_CONFIG = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl: "http://localhost:3000/payment/success",
  ipnUrl: "http://localhost:5000/api/payment/ipn",
  requestType: "captureWallet",
};

// Tạo yêu cầu thanh toán
const createPayment = async (req, res) => {
  try {
    const { amount, orderInfo, orderId, extraData } = req.body;

    const requestId = MOMO_CONFIG.partnerCode + new Date().getTime();
    const requestType = MOMO_CONFIG.requestType;

    // Tạo chữ ký
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", MOMO_CONFIG.secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo request body
    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      partnerName: "Test Partner",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      lang: "vi",
      extraData: extraData,
      requestType: requestType,
      signature: signature,
    };

    // Gửi request đến MoMo
    const response = await axios.post(MOMO_CONFIG.endpoint, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.json({
      success: true,
      payUrl: response.data.payUrl,
      orderId: orderId,
      requestId: requestId,
    });
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo thanh toán",
      error: error.message,
    });
  }
};

// Xử lý IPN (Instant Payment Notification)
const handleIPN = (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    // TODO: Xác thực chữ ký
    // TODO: Cập nhật trạng thái đơn hàng trong database
    // TODO: Gửi email xác nhận nếu cần

    console.log("IPN received:", {
      orderId,
      amount,
      resultCode,
      message,
      transId,
    });

    res.status(200).json({ RspCode: "0", Message: "Success" });
  } catch (error) {
    console.error("Lỗi khi xử lý IPN:", error);
    res.status(500).json({ RspCode: "99", Message: "Failed" });
  }
};

// Kiểm tra trạng thái thanh toán
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId, requestId } = req.query;

    // TODO: Triển khai API kiểm tra trạng thái từ MoMo
    // Hoặc kiểm tra từ database nếu đã lưu thông tin

    res.json({
      success: true,
      status: "pending", // pending, success, failed
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi kiểm tra trạng thái thanh toán",
    });
  }
};

module.exports = {
  createPayment,
  handleIPN,
  checkPaymentStatus,
};
