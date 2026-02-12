import { Request, Response } from "express";
import User from "../models/User";
import OTP from "../models/OTP";
import jwt from "jsonwebtoken";

// Helper to generate JWT
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: "10m",
  });
};

/**
 * @desc    Request OTP (SMS or Email)
 */
export const requestOTP = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      res
        .status(400)
        .json({ success: false, message: "Identifier is required" });
      return;
    }

    // Generate 6-digit OTP
    let code: string;

    // DEV MODE: Fixed OTP for testing
    if (identifier === "99112233") {
      code = "123123";
    } else {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    }
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    // Save to DB (upsert)
    await OTP.findOneAndUpdate(
      { identifier },
      { code, expiresAt },
      { upsert: true, new: true },
    );

    // MOCK: Send OTP (In production, call SMS/Email API here)
    console.log(`[AUTH] OTP for ${identifier}: ${code}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      code: process.env.NODE_ENV === "development" ? code : undefined,
    });
  } catch (error: any) {
    console.error("OTP REQUEST ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

/**
 * @desc    Verify OTP & Login/Register
 */
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      res
        .status(400)
        .json({ success: false, message: "Identifier and code are required" });
      return;
    }

    const otpEntry = await OTP.findOne({ identifier, code });

    if (!otpEntry) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
      return;
    }

    if (new Date() > otpEntry.expiresAt) {
      res.status(400).json({ success: false, message: "OTP has expired" });
      return;
    }

    // OTP is valid, find or create user
    const isEmail = identifier.includes("@");
    let user = await User.findOne(
      isEmail ? { email: identifier } : { phone: identifier },
    );

    if (!user) {
      user = await User.create({
        [isEmail ? "email" : "phone"]: identifier,
        name: identifier.split("@")[0],
        role: "user",
      });
    }

    await OTP.deleteOne({ _id: otpEntry._id });

    // Generate session
    const token = generateToken(user._id.toString(), user.role);

    // 10 minute cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      // IMPORTANT: We do NOT send token in body anymore for HttpOnly strictness
      // But user might need to know layout state?
      // Actually, for AuthContext to know we represent "authenticated" by success
    });
  } catch (error: any) {
    console.error("OTP VERIFY ERROR:", error);
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};
