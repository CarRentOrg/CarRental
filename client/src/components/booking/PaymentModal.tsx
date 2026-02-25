"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, Landmark } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingData: any;
  onSuccess: (paymentId: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  bookingData,
  onSuccess,
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
          toast.error("Failed to setup payment");
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
        toast.success("Payment Received!");
        onSuccess(paymentData.paymentId);
        onClose();
      } else {
        toast.error("Payment not found or pending");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-zinc-900 dark:text-white" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Landmark className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Finalize Booking
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Scan QR to pay {amount.toLocaleString()} ₮
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : paymentData ? (
              <div className="space-y-6">
                {/* Mock QR */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mx-auto w-48 h-48 flex items-center justify-center">
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white text-xs font-mono break-all p-2 text-center">
                    [MOCK QPAY QR]
                    <br />
                    {paymentData.paymentId}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200 text-center">
                  Please open your banking app and scan the QR code above.
                </div>

                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" /> Check Payment
                    </>
                  )}
                </button>

                {/* DEV BUTTON */}
                <button
                  onClick={() => {
                    toast.success("DEV: Simulating payment success...");
                    onSuccess(paymentData.paymentId);
                    onClose();
                  }}
                  className="w-full text-zinc-400 text-xs hover:text-zinc-600"
                >
                  DEV: Simulate Paid
                </button>
              </div>
            ) : (
              <div className="text-center text-red-500">
                Failed to load payment info
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
