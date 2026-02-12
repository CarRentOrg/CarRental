import { Router } from "express";
import {
  createPaymentIntent,
  verifyPayment,
} from "../controllers/paymentController";
import { protect } from "../middlewares/auth";

const router = Router();

// Ensure user is authenticated to make payments
router.post("/create-intent", protect, createPaymentIntent);
router.post("/verify", protect, verifyPayment);

export default router;
