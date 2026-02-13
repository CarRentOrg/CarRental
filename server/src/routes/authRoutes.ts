import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  changePassword,
} from "../controllers/authController";
import { requestOTP, verifyOTP } from "../controllers/otpController";
import { protect } from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/otp/request", requestOTP);
router.post("/otp/verify", verifyOTP);
router.get("/data", protect, getMe);
router.post("/change-password", protect, changePassword);

export default router;
