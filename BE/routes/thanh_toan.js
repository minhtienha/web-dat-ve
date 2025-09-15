const express = require("express");
const router = express.Router();
const thanhToanController = require("../controllers/thanhToanController");

// Route for MoMo payment
router.post("/momo", thanhToanController.createMoMoPayment);

// Route for MoMo callback
router.post("/momo/callback", thanhToanController.handleMoMoCallback);

module.exports = router;
