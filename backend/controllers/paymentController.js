// ─────────────────────────────────────────────────────────────
//  controllers/paymentController.js  –  Razorpay order & verify
// ─────────────────────────────────────────────────────────────
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");

// ── Initialise Razorpay instance ───────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ──────────────────────────────────────────────────────────
//  POST /api/payment/create-order
//  Body: { amount, mobileNumber, studentClass }
//  Creates a Razorpay order and saves a Payment doc (status=created)
// ──────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  const { amount, mobileNumber, studentClass } = req.body;

  // ── Validation ─────────────────────────────────────────
  if (!amount || !mobileNumber || !studentClass) {
    return res
      .status(400)
      .json({ success: false, message: "amount, mobileNumber, and studentClass are required" });
  }

  if (!/^\d{10}$/.test(mobileNumber)) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number must be exactly 10 digits" });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount < 1) {
    return res
      .status(400)
      .json({ success: false, message: "Minimum payment amount is ₹400" });
  }

  try {
    // Razorpay expects amount in the smallest currency unit (paise)
    const amountInPaise = Math.round(numericAmount * 100);

    // Create an order on Razorpay
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        mobileNumber,
        studentClass,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save the pending payment in MongoDB
    const payment = await Payment.create({
      mobileNumber,
      studentClass,
      amount: numericAmount,
      amountInPaise,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.status(201).json({
      success: true,
      message: "Order created",
      orderId: order.id,
      amount: amountInPaise,  // frontend needs paise
      currency: "INR",
      paymentDbId: payment._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ success: false, message: "Could not create order" });
  }
};

// ──────────────────────────────────────────────────────────
//  POST /api/payment/verify
//  Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
//  Verifies HMAC-SHA256 signature and marks payment as paid
// ──────────────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Missing payment details" });
  }

  try {
    // Razorpay signature check:
    // HMAC-SHA256( key_secret, orderId + "|" + paymentId )
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      // Mark payment as failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed – invalid signature" });
    }

    // Signature matched → mark as paid
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { new: true } // return the updated document
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ success: false, message: "Server error during verification" });
  }
};

module.exports = { createOrder, verifyPayment };
