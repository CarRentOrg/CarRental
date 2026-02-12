import { Request, Response } from "express";
import User from "../models/User";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as EmailService from "../services/emailService";
import * as SMSService from "../services/smsService";
import OTP from "../models/OTP";

// Generate JWT
const generateToken = (
  id: string,
  role: string,
  expiresIn: string | number = "30d",
) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: expiresIn as any, // Cast to any to avoid complex MS type issues in SignOptions
  });
};

const cookieOptions = (expiresInMs: number, httpOnly: boolean = true) => ({
  httpOnly,
  secure: process.env.NODE_ENV === "production",
  maxAge: expiresInMs,
  sameSite: "lax" as const,
});

// ==========================================
// UNIFIED AUTH LOGIN
// ==========================================

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });

    // 1. OWNER FLOW
    if (user?.role === "owner") {
      if (!password) {
        res.json({
          success: true,
          flow: "password",
          message: "Password required",
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = generateToken(user.id, "owner");
      res.cookie("ownerToken", token, cookieOptions(30 * 24 * 60 * 60 * 1000));
      res.cookie(
        "auth_hint",
        "true",
        cookieOptions(30 * 24 * 60 * 60 * 1000, false),
      );

      res.json({
        success: true,
        user: {
          _id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
      return;
    }

    // 2. USER FLOW (OTP)
    // If not owner, we trigger OTP regardless if user exists (guests will be created on verify)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.findOneAndUpdate(
      { identifier: email },
      { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000), type: "LOGIN" },
      { upsert: true },
    );

    const sent = await EmailService.sendOTP(email, code);
    if (!sent) {
      res.status(500).json({ message: "Failed to send OTP" });
      return;
    }

    res.json({ success: true, flow: "otp", message: "OTP sent to your email" });
  } catch (error) {
    console.error("LOGIN ERROR", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// verifyOTP removed - now handled by otpController.ts

export const logout = (req: Request, res: Response) => {
  const clearOptions = { ...cookieOptions(0), expires: new Date(0) };
  res.cookie("token", "", clearOptions);
  res.cookie("ownerToken", "", clearOptions);
  res.cookie("auth_hint", "", { ...clearOptions, httpOnly: false });
  res.status(200).json({ success: true, message: "Logged out" });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || "user",
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
