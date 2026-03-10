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
      subject: "Баталгаажуулах код",
      html: otpEmail(otp),
    });
    console.log(`[EmailService] OTP илгээгдлээ ${email}`);
    return true;
  } catch (error) {
    console.error("[EmailService] OTP илгээхэд алдаа гарлаа:", error);
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
      subject: `Захиалга баталгаажлаа — ${data.bookingId}`,
      html: bookingConfirmedEmail(data),
    });
    console.log(`[EmailService] Захиалга баталгаажлаа ${email}`);
    return true;
  } catch (error) {
    console.error(
      "[EmailService] Захиалга баталгаажуулахад алдаа гарлаа:",
      error,
    );
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
      subject: `Захиалга баталгаажаагүй байна — ${data.bookingId}`,
      html: bookingRejectedEmail(data),
    });
    console.log(`[EmailService] Захиалгын цуцлалт илгээгдлээ: ${email}`);
    return true;
  } catch (error) {
    console.error(
      "[EmailService] Захиалгын цуцлалт илгээхэд алдаа гарлаа:",
      error,
    );
    return false;
  }
};
