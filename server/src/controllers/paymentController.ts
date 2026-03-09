import { Request, Response } from "express";

/**
 * @desc    Create a payment intent / Mock QPay QR
 * @route   POST /api/payment/create-intent
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, bookingData, type = "deposit" } = req.body;

    if (!amount) {
      res.status(400).json({ success: false, message: "Amount required" });
      return;
    }

    // Mock Payment ID
    const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const invoiceId = `INV-${Date.now()}`;

    // Mock QPay-structured response
    res.status(200).json({
      success: true,
      paymentId,
      invoiceId,
      amount,
      type, // "deposit" or "final"
      qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QPAY-${paymentId}-${amount}`,
      qrText: `QPAY://merc/123/amt/${amount}/ref/${paymentId}`,
      qPayShortUrl: `https://qpay.mn/payment/${paymentId}`,
      deeplinks: [
        { name: "qPay", icon: "qpay", link: `qpay://payment?id=${paymentId}` },
        {
          name: "Хаан банк",
          icon: "khan",
          link: `khanbank://payment?id=${paymentId}`,
        },
        {
          name: "Голомт банк",
          icon: "golomt",
          link: `golomtbank://payment?id=${paymentId}`,
        },
        {
          name: "Хас банк",
          icon: "khas",
          link: `khasbank://payment?id=${paymentId}`,
        },
        {
          name: "TDB online",
          icon: "tdb",
          link: `tdb://payment?id=${paymentId}`,
        },
        {
          name: "Төрийн банк",
          icon: "state",
          link: `statebank://payment?id=${paymentId}`,
        },
        {
          name: "М банк",
          icon: "mbank",
          link: `mbank://payment?id=${paymentId}`,
        },
        {
          name: "Ард Апп",
          icon: "ard",
          link: `ardapp://payment?id=${paymentId}`,
        },
      ],
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

    // MOCK: All PAY- IDs are considered paid
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
