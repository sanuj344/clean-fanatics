import razorpay from "../config/razorpay.js";
import prisma from "../config/db.js";
import crypto from "crypto";

export const createCreditOrder = async (req, res) => {
  const { credits } = req.body;
  const userId = req.user.userId;

  if (!credits || credits <= 0) {
    return res.status(400).json({ message: "Invalid credits" });
  }

  // Example: ₹1 = 1 credit (keep simple)
  const amount = credits * 100; // paise

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `credits_${Date.now()}`,
  });

  await prisma.payment.create({
    data: {
      userId,
      razorpayOrderId: order.id,
      creditsAdded: credits,
      status: "CREATED",
    },
  });

  // Return order with Razorpay key_id (public key, safe to expose)
  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: razorpay_order_id },
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  // Add credits
  await prisma.user.update({
    where: { id: payment.userId },
    data: {
      credits: { increment: payment.creditsAdded },
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId: razorpay_payment_id,
      status: "SUCCESS",
    },
  });

  res.json({ message: "Credits added successfully" });
};
