const axios = require("axios");
const crypto = require("crypto");

// MoMo parameters
const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const requestType = "captureWallet";
const extraData = "";

// Function to create MoMo payment
const createMoMoPayment = async (req, res) => {
  try {
    const { amount, orderId, orderInfo, redirectUrl, ipnUrl } = req.body;

    const requestId = partnerCode + new Date().getTime();
    const finalOrderId = orderId || requestId;
    const finalOrderInfo = orderInfo || "pay with MoMo";
    const finalRedirectUrl =
      redirectUrl || "http://localhost:3000/booking-success";
    const finalIpnUrl =
      ipnUrl || "http://localhost:5000/api/thanh-toan/momo/callback";

    // Create raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${finalIpnUrl}&orderId=${finalOrderId}&orderInfo=${finalOrderInfo}&partnerCode=${partnerCode}&redirectUrl=${finalRedirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Generate signature
    const signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    // Request body
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId: finalOrderId,
      orderInfo: finalOrderInfo,
      redirectUrl: finalRedirectUrl,
      ipnUrl: finalIpnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    // Send to MoMo API
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("MoMo payment error:", error);
    res.status(500).json({ error: "Failed to create MoMo payment" });
  }
};

// Function to handle MoMo callback
const handleMoMoCallback = async (req, res) => {
  try {
    const { orderId, resultCode, message } = req.body;

    // Verify signature if needed
    // For simplicity, assume success if resultCode == 0

    if (resultCode === 0) {
      // Payment successful, process the ticket booking
      // Here you would call createTicket or similar
      console.log("Payment successful for order:", orderId);
      // You can store the orderId and process later
    } else {
      console.log("Payment failed for order:", orderId, message);
    }

    res.json({ message: "Callback received" });
  } catch (error) {
    console.error("MoMo callback error:", error);
    res.status(500).json({ error: "Callback processing failed" });
  }
};

module.exports = {
  createMoMoPayment,
  handleMoMoCallback,
};
