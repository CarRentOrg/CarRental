import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log("──────────────────────────────────────");
console.log("📧 Nodemailer Gmail Connection Test");
console.log("──────────────────────────────────────");
console.log(`EMAIL_USER : ${EMAIL_USER ?? "❌ NOT SET"}`);
console.log(`EMAIL_PASS : ${EMAIL_PASS ? `✅ loaded (${EMAIL_PASS.length} chars)` : "❌ NOT SET"}`);
console.log("──────────────────────────────────────\n");

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("❌ Missing EMAIL_USER or EMAIL_PASS in .env — aborting.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Step 1: Verify SMTP connection/auth
console.log("🔌 Step 1 — Verifying SMTP connection...");
try {
  await transporter.verify();
  console.log("✅ SMTP connection & authentication successful!\n");
} catch (err: any) {
  console.error("❌ SMTP verification failed:", err.message);
  console.error("   Common causes:");
  console.error("   • Quotes around EMAIL_PASS in .env  →  remove them");
  console.error("   • Gmail 2FA not enabled            →  enable it");
  console.error("   • App Password not created         →  myaccount.google.com/apppasswords");
  process.exit(1);
}

// Step 2: Send a real test email to yourself
console.log("📤 Step 2 — Sending test email to yourself...");
try {
  const info = await transporter.sendMail({
    from: `"Car Rental Test" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    subject: "✅ Nodemailer Test — Car Rental",
    html: `
      <div style="font-family:sans-serif;padding:24px;max-width:480px">
        <h2 style="color:#16a34a">✅ Nodemailer is working!</h2>
        <p>Your Gmail App Password and <code>.env</code> configuration are correct.</p>
        <hr/>
        <p style="color:#6b7280;font-size:13px">Sent from Car Rental server test script</p>
      </div>
    `,
  });
  console.log("✅ Email sent successfully!");
  console.log(`   Message ID : ${info.messageId}`);
  console.log(`   Accepted   : ${info.accepted.join(", ")}`);
  console.log("\n🎉 All good — Nodemailer is fully configured!");
} catch (err: any) {
  console.error("❌ sendMail failed:", err.message);
  process.exit(1);
}
