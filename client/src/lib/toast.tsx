import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Mongolian translations for common toast messages
// Keys are the English messages used throughout the codebase.
// If a message isn't in this map, we show it as-is (handles API messages).
// ─────────────────────────────────────────────────────────────────────────────
const mnMessages: Record<string, string> = {
  // ── Auth ──
  "Welcome back!": "Тавтай морилно уу!",
  "Invalid credentials": "Нэвтрэх мэдээлэл буруу байна",
  "Auth failed": "Нэвтрэлт амжилтгүй",
  "Access Denied": "Хандалт хориглогдсон",
  "Welcome, Owner!": "Тавтай морилно уу, Эзэмшигч!",
  "Invalid password": "Нууц үг буруу байна",
  "Registration successful! Please login.": "Бүртгэл амжилттай! Нэвтэрнэ үү.",
  "Registration failed": "Бүртгэл амжилтгүй",
  "Unauthorized. Access restricted to owners.":
    "Зөвшөөрөлгүй. Зөвхөн эзэмшигчид хандах боломжтой.",
  "This email is not registered as an owner.":
    "Энэ имэйл хаяг эзэмшигчээр бүртгэлгүй байна.",

  // ── OTP ──
  "Please enter your details": "Мэдээллээ оруулна уу",
  "Failed to send OTP": "OTP илгээхэд алдаа гарлаа",
  "Enter full code": "Кодоо бүрэн оруулна уу",
  "Verified!": "Баталгаажлаа!",

  // ── Profile ──
  "Profile updated successfully": "Профайл амжилттай шинэчлэгдлээ",
  "Failed to update profile": "Профайл шинэчлэхэд алдаа гарлаа",
  "Password changed successfully!": "Нууц үг амжилттай солигдлоо!",
  "Password changed successfully": "Нууц үг амжилттай солигдлоо",
  "Failed to change password": "Нууц үг солиход алдаа гарлаа",
  "New passwords do not match": "Шинэ нууц үгүүд таарахгүй байна",

  // ── Bookings ──
  "Booking cancelled": "Захиалга цуцлагдлаа",
  "Failed to cancel booking": "Захиалга цуцлахад алдаа гарлаа",
  "Booking failed": "Захиалга амжилтгүй",
  "Booking not found": "Захиалга олдсонгүй",
  "Failed to load booking details": "Захиалгын мэдээлэл ачаалахад алдаа гарлаа",
  "Select dates first": "Эхлээд огноогоо сонгоно уу",
  "Booking successfully approved": "Захиалга амжилттай батлагдлаа",
  "Booking successfully completed": "Захиалга амжилттай дууслаа",
  "Booking successfully rejected": "Захиалга амжилттай татгалзлаа",

  // ── Cars ──
  "Availability updated": "Бэлэн эсэх мэдээлэл шинэчлэгдлээ",
  "Failed to toggle availability": "Бэлэн эсэхийг өөрчлөхөд алдаа гарлаа",
  "Car deleted successfully": "Машин амжилттай устгагдлаа",
  "Failed to delete car": "Машин устгахад алдаа гарлаа",
  "Car created successfully!": "Машин амжилттай бүртгэгдлээ!",
  "Failed to create car": "Машин бүртгэхэд алдаа гарлаа",
  "Car updated successfully!": "Машин амжилттай шинэчлэгдлээ!",
  "Failed to update car": "Машин шинэчлэхэд алдаа гарлаа",
  "Thumbnail image is required": "Үндсэн зураг шаардлагатай",
  "Thumbnail is required": "Үндсэн зураг шаардлагатай",
  "Please upload a thumbnail image": "Үндсэн зураг оруулна уу",

  // ── Payment ──
  "Failed to setup payment": "Төлбөр тохируулахад алдаа гарлаа",
  "Payment Received!": "Төлбөр хүлээн авлаа!",
  "Payment not found or pending": "Төлбөр олдсонгүй эсвэл хүлээгдэж байна",
  "Verification failed": "Баталгаажуулалт амжилтгүй",
  "Car reserved for 10 minutes!": "Машин 10 минутаар захиалагдлаа!",
  "Failed to reserve car": "Машин захиалахад алдаа гарлаа",

  // ── Generic ──
  "Something went wrong": "Алдаа гарлаа",
};

// ─────────────────────────────────────────────────────────────────────────────
// Language detection & Message Resolution
// ─────────────────────────────────────────────────────────────────────────────
export type ApiMessage = { mn?: string; en?: string };
export type ToastMessage = string | ApiMessage;

// Requirement 1 & 2: Detect active language
// Admin dashboard always shows Mongolian. User web respects the EN/MN toggle.
function getLanguage(): "en" | "mn" {
  if (typeof window === "undefined") return "mn"; // Default for SSR

  // Enforce Mongolian for any route starting with /admin
  if (window.location.pathname.startsWith("/admin")) return "mn";

  // Respect user's selected language toggle state
  const saved = localStorage.getItem("language");
  return saved === "en" ? "en" : "mn";
}

/**
 * Resolve the message based on current language context
 * and API object structure.
 */
function resolveMessage(msg: ToastMessage): string {
  const lang = getLanguage();

  // Handle API message objects containing both translations
  // Requirement 1: Fallback logic
  if (typeof msg === "object" && msg !== null) {
    if (lang === "mn") {
      // Prioritize Mongolian, fallback to English
      return msg.mn || msg.en || "Алдаа гарлаа";
    }
    // Prioritize English, fallback to Mongolian
    return msg.en || msg.mn || "Something went wrong";
  }

  // Handle local predefined string keys
  if (lang === "en") return msg;
  return mnMessages[msg] ?? msg; // Return raw message if no Mongolian translation exists
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom UI Components & Design System
// ─────────────────────────────────────────────────────────────────────────────
type ToastProps = {
  t: any;
  title: string;
  message: string;
  iconSrc: React.ReactNode;
  iconBg: string;
};

const CustomToast = ({ t, title, message, iconSrc, iconBg }: ToastProps) => (
  <div
    className={`${
      t.visible
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 -translate-y-2 scale-95"
    } transition-all duration-300 ease-out max-w-sm w-full bg-[#1c1c1e] shadow-2xl rounded-2xl pointer-events-auto flex items-start p-4 border border-white/5`}
  >
    {/* Icon Container */}
    <div
      className="shrink-0 h-[38px] w-[38px] flex items-center justify-center rounded-full mt-0.5"
      style={{ backgroundColor: iconBg }}
    >
      {iconSrc}
    </div>

    {/* Content Container */}
    <div className="ml-3.5 flex-1 pt-0.5">
      <p className="text-[16px] font-semibold text-white tracking-wide">
        {title}
      </p>
      {message && (
        <p className="mt-1 text-[14px] font-medium text-[#9ca3af] leading-[1.4]">
          {message}
        </p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Icons Matching the Design
// ─────────────────────────────────────────────────────────────────────────────
const Icons = {
  Success: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Error: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Info: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Warning: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1c1c1e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper to extract Title vs Description
// ─────────────────────────────────────────────────────────────────────────────
function extractTitleAndMsg(resolvedMsg: string, defaultTitle: string) {
  // If the message is short, use it as the title and clear the message.
  // Otherwise, fallback to the default title and use the message as description.
  if (resolvedMsg.length <= 25 && !resolvedMsg.includes(".")) {
    return { title: resolvedMsg, message: "" };
  }
  return { title: defaultTitle, message: resolvedMsg };
}

export const showToast = {
  success: (msg: ToastMessage, customTitle?: string) => {
    const resolved = resolveMessage(msg);
    const { title, message } = extractTitleAndMsg(
      resolved,
      customTitle || (getLanguage() === "mn" ? "Амжилттай" : "Success"),
    );
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          title={title}
          message={message}
          iconBg="#10b981"
          iconSrc={Icons.Success}
        />
      ),
      { duration: 2000 },
    );
  },

  error: (msg: ToastMessage, customTitle?: string) => {
    const resolved = resolveMessage(msg);
    const { title, message } = extractTitleAndMsg(
      resolved,
      customTitle || (getLanguage() === "mn" ? "Алдаа гарлаа" : "Error"),
    );
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          title={title}
          message={message}
          iconBg="#ef4444"
          iconSrc={Icons.Error}
        />
      ),
      { duration: 2000 },
    );
  },

  info: (msg: ToastMessage, customTitle?: string) => {
    const resolved = resolveMessage(msg);
    const { title, message } = extractTitleAndMsg(
      resolved,
      customTitle || (getLanguage() === "mn" ? "Мэдээлэл" : "Info"),
    );
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          title={title}
          message={message}
          iconBg="#3b82f6"
          iconSrc={Icons.Info}
        />
      ),
      { duration: 2000 },
    );
  },

  warning: (msg: ToastMessage, customTitle?: string) => {
    const resolved = resolveMessage(msg);
    const { title, message } = extractTitleAndMsg(
      resolved,
      customTitle || (getLanguage() === "mn" ? "Анхааруулга" : "Warning"),
    );
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          title={title}
          message={message}
          iconBg="#fbbf24"
          iconSrc={Icons.Warning}
        />
      ),
      { duration: 2000 },
    );
  },

  loading: (msg: ToastMessage) =>
    toast.loading(resolveMessage(msg), {
      duration: 2000,
      style: {
        borderRadius: "12px",
        background: "#1c1c1e",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.05)",
      },
    }),

  dismiss: toast.dismiss,

  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: ToastMessage;
      success: ToastMessage;
      error: ToastMessage | ((err: any) => ToastMessage);
    },
  ) =>
    toast.promise(
      promise,
      {
        loading: resolveMessage(msgs.loading),
        success: resolveMessage(msgs.success),
        error: (err) =>
          resolveMessage(
            typeof msgs.error === "function" ? msgs.error(err) : msgs.error,
          ),
      },
      {
        style: {
          borderRadius: "12px",
          background: "#1c1c1e",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.05)",
          transition: "all 0.3s ease-out",
        },
        success: { duration: 2000 },
        error: { duration: 2000 },
      },
    ),
};
