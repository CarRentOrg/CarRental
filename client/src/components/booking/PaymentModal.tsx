"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Bank app data for QPay grid
// ─────────────────────────────────────────────────────────────────────────────
const BANK_APPS = [
  { name: "qPay", icon: "https://cdn.qpay.mn/q/logo.png", color: "#0066FF" },
  {
    name: "Хаан банк",
    icon: "https://play-lh.googleusercontent.com/1Sj_NmkNHoMhfP7QjnkRY-S5i8GUxqIYVVDXhjQVBqY8sSfeKqWP3JfjW_roajf_mkP",
    color: "#006838",
  },
  {
    name: "Төрийн банк",
    icon: "https://play-lh.googleusercontent.com/GGJ5X-g8mXuCHh403gfEpNHkDFnmXNE2i6qGhNLAy1jBqL9TdFZqb-h-gAGaKq7PnW0",
    color: "#00A651",
  },
  {
    name: "Хас банк",
    icon: "https://play-lh.googleusercontent.com/d5rJBCyN_8Yw0oEjQfCz--wtZ_X_eUOZWNrST-tYIMqBJRKKR-_mMQl2mWWRnHbQVw",
    color: "#E31E24",
  },
  {
    name: "TDB online",
    icon: "https://play-lh.googleusercontent.com/BaP2aR8JlMiAMcFRoB6YHVzPDG_SSTnSRPuK7dTyP6LMn64R3d18ZFqQQNHobk-IXQ",
    color: "#003DA5",
  },
  {
    name: "Голомт банк",
    icon: "https://play-lh.googleusercontent.com/U-qI0qrsBX-q4M5w7P-M0j-P1z2gRgqFyW5aTjL4TtSn-oCJAEJEgGCf_hKLClJp5w",
    color: "#ED1C24",
  },
  {
    name: "MOST money",
    icon: "https://play-lh.googleusercontent.com/szHcUGgaWI6bFcPNDWnJIpmxB1H_CK_tF2GxfT_L8QYKR06z5XoLBE-_2sIPMxYl5A",
    color: "#00B140",
  },
  {
    name: "Үндэсний хөрөнгө оруулалт банк",
    icon: "https://play-lh.googleusercontent.com/EFoW-5CW7qYJTjMT_u3K1vvJQ2ZfwP5qBuN12j_2VB2eYUVfS-q3gNoJlJBb1vXvqw",
    color: "#C8102E",
  },
  {
    name: "Чингис хаан банк",
    icon: "https://play-lh.googleusercontent.com/0ppZP_r9iKUXpxP-5P0V8qwG-B-Kh14p8t6Y-jcD4G9_QStJhvZVnM1m5vH6Q68hag",
    color: "#FFD100",
  },
  {
    name: "Капитрон банк",
    icon: "https://play-lh.googleusercontent.com/xQhGlICh_VXqUy-xp4dRIXjgr9V2rTTf-XcwqwMWIlKG-vXxfU9TQ1RR7Cc3c6W0GA",
    color: "#6B2FA0",
  },
  {
    name: "М банк",
    icon: "https://play-lh.googleusercontent.com/dTLaG9CtZ8E_R7SfE-VL1m6n_n63DQNJB8gJ3W6N6J2svWqT-sCkOFf-8RM_s4m1oYI",
    color: "#1A1A2E",
  },
  {
    name: "Ард Апп",
    icon: "https://play-lh.googleusercontent.com/iM_MV3Vb7G2MWFXQZ1P_lnkJvBJRKFLqVDIU0G9NjLFJ-H-nQL8c-bN3m5VlqBcCaA",
    color: "#FF6B35",
  },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingData: any;
  onSuccess: (paymentId: string) => void;
  title?: string;
  subtitle?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  bookingData,
  onSuccess,
  title = "Төлбөр хүлээж байна",
  subtitle,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  // Initialize Payment
  useEffect(() => {
    if (isOpen) {
      const initPayment = async () => {
        setLoading(true);
        try {
          const res = await api.payment.createIntent(amount, bookingData);
          setPaymentData(res);
        } catch (error) {
          showToast.error("Failed to setup payment");
          onClose();
        } finally {
          setLoading(false);
        }
      };
      initPayment();
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!paymentData?.paymentId) return;

    setVerifying(true);
    try {
      const res = await api.payment.verify(paymentData.paymentId);
      if (res.status === "paid") {
        showToast.success("Payment Received!");
        onSuccess(paymentData.paymentId);
        onClose();
      } else {
        showToast.error("Payment not found or pending");
      }
    } catch (error) {
      showToast.error("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-zinc-900 dark:text-white" />
            </button>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
                <p className="text-zinc-500 text-sm">Төлбөр бэлдэж байна...</p>
              </div>
            ) : paymentData ? (
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="text-center pt-2">
                  {/* QPay-style icon */}
                  <div className="mx-auto w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                    <svg
                      className="h-7 w-7 text-blue-600 dark:text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M12 10v4" />
                      <path d="M10 12h4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {subtitle || "Банкны апп-аар QR кодыг уншуулна уу"}
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-2xl shadow-lg border border-zinc-200">
                    <img
                      src={paymentData.qrImage}
                      alt="QPay QR"
                      className="w-52 h-52 object-contain"
                    />
                  </div>
                </div>

                {/* Amount badge */}
                <div className="text-center">
                  <span className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold">
                    {formatCurrency(amount)}₮
                  </span>
                </div>

                {/* Bank apps section */}
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center mb-3">
                    Банкны апп-аар төлөх
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {BANK_APPS.map((bank, i) => (
                      <button
                        key={i}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center bg-white">
                          <div
                            className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: bank.color }}
                          >
                            {bank.name.charAt(0)}
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center leading-tight truncate w-full group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {bank.name.length > 8
                            ? bank.name.substring(0, 7) + "..."
                            : bank.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-blue-900/20"
                  >
                    {verifying ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Төлбөр шалгах
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-3.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]"
                  >
                    Буцах
                  </button>
                </div>

                {/* DEV BUTTON */}
                <button
                  onClick={() => {
                    showToast.success("DEV: Simulating payment success...");
                    onSuccess(paymentData.paymentId);
                    onClose();
                  }}
                  className="w-full text-zinc-400 text-xs hover:text-zinc-600 py-2"
                >
                  DEV: Simulate Paid
                </button>
              </div>
            ) : (
              <div className="text-center text-red-500 py-16">
                Төлбөрийн мэдээлэл ачаалахад алдаа гарлаа
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
