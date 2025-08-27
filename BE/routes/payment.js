const express = require("express");
const router = express.Router();
const {
  createPayment,
  handleIPN,
  checkPaymentStatus,
} = require("../controllers/paymentController");

// Tạo yêu cầu thanh toán mới
router.post("/create", createPayment);

// Xử lý IPN từ MoMo
router.post("/ipn", handleIPN);

// Kiểm tra trạng thái thanh toán
router.get("/status", checkPaymentStatus);

module.exports = router;
