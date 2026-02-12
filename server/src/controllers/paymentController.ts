import { Request, Response } from "express";

/**
 * @desc    Create a payment intent / Mock QPay QR
 * @route   POST /api/payment/create-intent
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, bookingData } = req.body;

    if (!amount) {
      res.status(400).json({ success: false, message: "Amount required" });
      return;
    }

    // Mock Payment ID
    const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Return Mock QPay Data
    res.status(200).json({
      success: true,
      paymentId,
      qrData: `QPAY://merc/123/amt/${amount}/ref/${paymentId}`, // Mock QR string
      amount,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins to pay
    });
  } catch (error) {
    console.error("PAYMENT INTENT ERROR:", error);
    res.status(500).json({ success: false, message: "Payment setup failed" });
  }
};

/**
 * @desc    Verify Payment Status
 * @route   POST /api/payment/verify
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      res.status(400).json({ success: false, message: "Payment ID required" });
      return;
    }

    // MOCK LOGIC: Valid payment IDs starting with PAY- are considered paid
    // In real wold, we would check DB or call QPay API to verify status

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.status(200).json({
      success: true,
      status: "paid",
      transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
      paidAt: new Date(),
    });
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
