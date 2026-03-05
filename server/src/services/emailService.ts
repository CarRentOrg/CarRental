import nodemailer from "nodemailer";
import {
  otpEmail,
  bookingConfirmedEmail,
  bookingRejectedEmail,
  BookingConfirmedData,
  BookingRejectedData,
} from "./emailTemplates";

// ─────────────────────────────────────────────────────────────────────────────
// Transporter (lazy-initialized, reused across calls)
// ─────────────────────────────────────────────────────────────────────────────
let transporter: nodemailer.Transporter;

const initTransporter = () => {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const getTransporter = () => {
  if (!transporter) initTransporter();
  return transporter;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. OTP Email
// ─────────────────────────────────────────────────────────────────────────────
export const sendOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    await getTransporter().sendMail({
      from: `"Car Rental" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: otpEmail(otp),
    });
    console.log(`[EmailService] OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EmailService] OTP email failed:", error);
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Booking Confirmed
// ─────────────────────────────────────────────────────────────────────────────
export const sendBookingConfirmation = async (
  email: string,
  data: BookingConfirmedData,
): Promise<boolean> => {
  try {
    await getTransporter().sendMail({
      from: `"Car Rental" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed — ${data.bookingId}`,
      html: bookingConfirmedEmail(data),
    });
    console.log(`[EmailService] Booking confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EmailService] Booking confirmation failed:", error);
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Booking Rejected
// ─────────────────────────────────────────────────────────────────────────────
export const sendBookingRejection = async (
  email: string,
  data: BookingRejectedData,
): Promise<boolean> => {
  try {
    await getTransporter().sendMail({
      from: `"Car Rental" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Not Approved — ${data.bookingId}`,
      html: bookingRejectedEmail(data),
    });
    console.log(`[EmailService] Booking rejection sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EmailService] Booking rejection failed:", error);
    return false;
  }
};
