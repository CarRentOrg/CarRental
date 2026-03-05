// ─────────────────────────────────────────────────────────────────────────────
// Email HTML templates — inline CSS for maximum email-client compatibility
// ─────────────────────────────────────────────────────────────────────────────

const BRAND = "Car Rental";
const BRAND_COLOR = "#2563eb"; // Modern blue
const BG_COLOR = "#f4f6f8";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1a1a2e";
const TEXT_SECONDARY = "#6b7280";
const BORDER_RADIUS = "12px";

/** Shared outer wrapper + card container */
const wrapInLayout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Logo / Brand -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:22px;font-weight:700;color:${BRAND_COLOR};letter-spacing:-0.5px;">🚗 ${BRAND}</span>
            </td>
          </tr>
        </table>

        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${CARD_BG};border-radius:${BORDER_RADIUS};overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:36px 32px;">
              ${content}
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td align="center" style="padding-top:24px;font-size:12px;color:${TEXT_SECONDARY};">
              © ${new Date().getFullYear()} ${BRAND}. All rights reserved.<br/>
              This is an automated message — please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. OTP Email
// ─────────────────────────────────────────────────────────────────────────────
export const otpEmail = (otp: string, expiresInMinutes: number = 10) =>
  wrapInLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${TEXT_PRIMARY};">
      Verification Code
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT_SECONDARY};line-height:1.5;">
      Use the code below to complete your login. It's valid for <strong>${expiresInMinutes} minutes</strong>.
    </p>

    <!-- OTP Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px 0;">
          <div style="display:inline-block;background:#f0f5ff;border:2px dashed ${BRAND_COLOR};border-radius:10px;padding:16px 40px;letter-spacing:10px;font-size:32px;font-weight:800;color:${BRAND_COLOR};">
            ${otp}
          </div>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-size:13px;color:${TEXT_SECONDARY};line-height:1.6;">
      If you didn't request this code, you can safely ignore this email. Someone may have entered your email by mistake.
    </p>
  `);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Booking Confirmed Email
// ─────────────────────────────────────────────────────────────────────────────
export interface BookingConfirmedData {
  bookingId: string;
  carName: string;
  startDate: string; // already formatted
  endDate: string;
  totalPrice: string;
}

export const bookingConfirmedEmail = (data: BookingConfirmedData) =>
  wrapInLayout(`
    <!-- Success Badge -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom:20px;">
          <div style="display:inline-block;background:#ecfdf5;color:#059669;font-size:13px;font-weight:600;padding:6px 16px;border-radius:20px;">
            ✅ Booking Confirmed
          </div>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${TEXT_PRIMARY};text-align:center;">
      You're all set!
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT_SECONDARY};line-height:1.5;text-align:center;">
      Your booking has been confirmed. Here are the details:
    </p>

    <!-- Details Table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
          <span style="font-size:12px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Booking ID</span><br/>
          <span style="font-size:15px;font-weight:600;color:${TEXT_PRIMARY};">${data.bookingId}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
          <span style="font-size:12px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Car</span><br/>
          <span style="font-size:15px;font-weight:600;color:${TEXT_PRIMARY};">${data.carName}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
          <span style="font-size:12px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Dates</span><br/>
          <span style="font-size:15px;font-weight:600;color:${TEXT_PRIMARY};">${data.startDate} → ${data.endDate}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <span style="font-size:12px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Total</span><br/>
          <span style="font-size:18px;font-weight:700;color:${BRAND_COLOR};">₮${data.totalPrice}</span>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:14px;color:${TEXT_SECONDARY};line-height:1.6;text-align:center;">
      Thank you for choosing <strong>${BRAND}</strong>. We look forward to serving you!
    </p>
  `);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Booking Rejected Email
// ─────────────────────────────────────────────────────────────────────────────
export interface BookingRejectedData {
  bookingId: string;
  carName: string;
  reason?: string;
  supportEmail?: string;
}

export const bookingRejectedEmail = (data: BookingRejectedData) => {
  const reason =
    data.reason ||
    "The owner was unable to fulfill this request at the selected dates.";
  const supportEmail = data.supportEmail || "support@carrental.mn";

  return wrapInLayout(`
    <!-- Rejected Badge -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom:20px;">
          <div style="display:inline-block;background:#fef2f2;color:#dc2626;font-size:13px;font-weight:600;padding:6px 16px;border-radius:20px;">
            ✕ Booking Not Approved
          </div>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${TEXT_PRIMARY};text-align:center;">
      We're sorry
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT_SECONDARY};line-height:1.5;text-align:center;">
      Unfortunately, your booking could not be approved.
    </p>

    <!-- Details -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
          <span style="font-size:12px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Booking ID</span><br/>
          <span style="font-size:15px;font-weight:600;color:${TEXT_PRIMARY};">${data.bookingId}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
          <span style="font-size:12px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Car</span><br/>
          <span style="font-size:15px;font-weight:600;color:${TEXT_PRIMARY};">${data.carName}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <span style="font-size:12px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;">Reason</span><br/>
          <span style="font-size:14px;color:${TEXT_PRIMARY};line-height:1.5;">${reason}</span>
        </td>
      </tr>
    </table>

    <!-- Action Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom:20px;">
          <a href="mailto:${supportEmail}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
            Contact Support
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:${TEXT_SECONDARY};line-height:1.6;text-align:center;">
      If a refund is applicable, it will be processed within 3–5 business days.<br/>
      Feel free to try booking a different car or different dates.
    </p>
  `);
};
