// simulate-momo-callback.js (phiên bản rút gọn)
const axios = require("axios");

(async () => {
  try {
    const ipnUrl = "http://localhost:5000/api/thanh-toan/momo/callback";

    const payload = {
      orderId: "order_test_123",
      resultCode: 0,
      message: "Giao dich thanh cong",
      extraData: JSON.stringify({
        MASUAT: "SC0002",
        MAKH: "KH003",
        GHE_LIST: ["B1", "B2"],
        GIAVE: 500,
      }),
    };

    console.log("🚀 Gửi payload test callback:", payload);
    const resp = await axios.post(ipnUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("✅ Phản hồi server:", resp.status, resp.data);
  } catch (err) {
    console.error(
      "❌ Lỗi khi giả lập callback:",
      err.response?.data || err.message
    );
  }
})();
