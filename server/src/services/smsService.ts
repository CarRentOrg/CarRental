export const sendOTP = async (phone: string, otp: string) => {
  // Mock SMS Service for OTP
  console.log("========================================");
  console.log(`[MOCK SMS] Sending OTP to ${phone}`);
  console.log(`[MOCK SMS] CODE: ${otp}`);
  console.log("========================================");
  return true;
};

export const sendMockNotification = async (phone: string, message: string) => {
  // Mock SMS Service for Notifications
  console.log("========================================");
  console.log(`[MOCK SMS] To: ${phone}`);
  console.log(`[MOCK SMS] MSG: "${message}"`);
  console.log("========================================");
  return true;
};
