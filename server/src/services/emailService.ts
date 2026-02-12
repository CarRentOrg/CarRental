import nodemailer from "nodemailer";

// Transporter verification
let transporter: nodemailer.Transporter;

const initTransporter = () => {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOTP = async (email: string, otp: string) => {
  if (!transporter) initTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Car Rental OTP Verification",
    text: `Your OTP for login is: ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP for login is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EmailService] Error sending email:", error);
    return false;
  }
};

export const sendBookingConfirmation = async (
  email: string,
  bookingId: string,
) => {
  if (!transporter) initTransporter();
  // Implementation for booking confirmation
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmed",
      text: "Your booking has been confirmed. We look forward to serving you.",
      html: "<p>Your booking has been confirmed. We look forward to serving you.</p>",
    });
    return true;
  } catch (error) {
    console.error("Error sending booking confirmation", error);
    return false;
  }
};
