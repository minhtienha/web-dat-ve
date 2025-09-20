const axios = require("axios");
const crypto = require("crypto");
const { datVeNhieuGhe } = require("./veController");

const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
const requestType = "payWithMethod";
const defaultRedirectUrl = "http://localhost:3000/";
const defaultIpnUrl = "http://localhost:5000/api/thanh-toan/momo/callback";

const createMoMoPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl, ipnUrl, extraData } =
      req.body;
    const requestId = partnerCode + Date.now();

    const finalOrderId = orderId || requestId;
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData || ""}` +
      `&ipnUrl=${ipnUrl || defaultIpnUrl}` +
      `&orderId=${finalOrderId}` +
      `&orderInfo=${orderInfo || "Thanh toán với MoMo"}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl || defaultRedirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId: finalOrderId,
      orderInfo: orderInfo || "Thanh toán với MoMo",
      redirectUrl: redirectUrl || defaultRedirectUrl,
      ipnUrl: ipnUrl || defaultIpnUrl,
      extraData: extraData || "",
      requestType,
      signature,
      lang: "vi",
    };

    const response = await axios.post(endpoint, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Lỗi tạo thanh toán MoMo:", error.message);
    res.status(500).json({ error: "Không thể tạo thanh toán MoMo" });
  }
};

const handleMoMoCallback = async (req, res) => {
  try {
    const { orderId, resultCode, extraData } = req.body;
    console.log("📩 Callback MoMo:", req.body);

    if (resultCode === 0) {
      let parsed = {};
      try {
        parsed =
          typeof extraData === "string" ? JSON.parse(extraData) : extraData;
      } catch {
        console.error("❌ extraData parse error");
      }

      await datVeNhieuGhe(
        { body: parsed },
        {
          status: (c) => ({ json: (d) => console.log(`↩️ ${c}:`, d) }),
        }
      );

      console.log("✅ Thanh toán thành công:", orderId);
    }

    res.json({ message: "Đã xử lý callback MoMo" });
  } catch (error) {
    console.error("🔥 Lỗi callback MoMo:", error.message);
    res.status(500).json({ error: "Không thể xử lý callback MoMo" });
  }
};

module.exports = { createMoMoPayment, handleMoMoCallback };
