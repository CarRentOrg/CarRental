"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Flag, CreditCard } from "lucide-react";
import RentalBreakdownCard from "./RentalBreakdownCard";
import PaymentModal from "./PaymentModal";
import { Booking } from "@/types";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";

interface FinishTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onCompleted: () => void;
}

type Step = "breakdown" | "payment" | "success";

export default function FinishTripModal({
  isOpen,
  onClose,
  booking,
  onCompleted,
}: FinishTripModalProps) {
  const [step, setStep] = useState<Step>("breakdown");
  const [loading, setLoading] = useState(false);
  const [breakdown, setBreakdown] = useState<{
    rentalTotal: number;
    driverFee: number;
    depositPaid: number;
    remainingPayment: number;
  } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Calculate values from booking data
  const car = booking.car;
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const days = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const dailyPrice = car?.price_per_day || 0;
  const rentalTotal = booking.totalPrice;
  const driverFee = booking.driverFee || 0;
  const depositPaid = booking.depositAmount || 0;
  const remainingPayment = rentalTotal + driverFee - depositPaid;

  const handleFinishTrip = async () => {
    setLoading(true);
    try {
      const res = await api.bookings.complete(booking._id);

      if (res.requiresPayment && res.breakdown) {
        setBreakdown(res.breakdown);
        // If remaining payment > 0, show payment
        if (res.breakdown.remainingPayment > 0) {
          setStep("payment");
        } else {
          setStep("success");
          onCompleted();
        }
      } else {
        // No payment needed
        setStep("success");
        onCompleted();
        showToast.success("Аялал амжилттай дууслаа!");
      }
    } catch (err: any) {
      showToast.error(err.message || "Аялал дуусгахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      await api.bookings.finishPayment({
        bookingId: booking._id,
        paymentId,
      });
      setShowPaymentModal(false);
      setStep("success");
      onCompleted();
      showToast.success("Төлбөр амжилттай! Аялал дууслаа.");
    } catch (err: any) {
      showToast.error(err.message || "Төлбөр баталгаажуулахад алдаа гарлаа");
    }
  };

  const handleClose = () => {
    setStep("breakdown");
    setBreakdown(null);
    setShowPaymentModal(false);
    onClose();
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden text-white"
            >
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {/* ── Step 1: Breakdown ── */}
                  {step === "breakdown" && (
                    <motion.div
                      key="breakdown"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                          <Flag className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Аялал дуусгах</h2>
                          <p className="text-sm text-zinc-400">
                            Төлбөрийн мэдээллийг шалгана уу
                          </p>
                        </div>
                      </div>

                      {/* Car info */}
                      <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                        {car?.thumbnail?.url && (
                          <img
                            src={car.thumbnail.url}
                            alt={car.model}
                            className="w-16 h-12 rounded-xl object-cover"
                          />
                        )}
                        <div>
                          <p className="font-bold text-sm">
                            {car?.brand} {car?.model}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(booking.startDate).toLocaleDateString()} —{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <RentalBreakdownCard
                        dailyPrice={dailyPrice}
                        rentalDays={days}
                        rentalTotal={rentalTotal}
                        driverFee={driverFee}
                        depositPaid={depositPaid}
                        remainingPayment={remainingPayment}
                        withDriver={booking.withDriver}
                      />

                      {/* CTA */}
                      <button
                        onClick={handleFinishTrip}
                        disabled={loading}
                        className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="h-6 w-6 border-2 border-zinc-400/30 border-t-zinc-800 rounded-full animate-spin" />
                        ) : (
                          <>
                            {remainingPayment > 0 ? (
                              <>
                                Төлбөр төлөх ({formatCurrency(remainingPayment)}
                                ₮)
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                Аялал дуусгах
                              </>
                            )}
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* ── Step 2: Payment needed ── */}
                  {step === "payment" && (
                    <motion.div
                      key="payment"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">
                          Үлдэгдэл төлбөр
                        </h3>
                        <p className="text-zinc-400 text-sm">
                          Үлдэгдэл дүнг QPay-ээр төлнө үү
                        </p>
                        <p className="text-3xl font-black text-blue-500 mt-3">
                          {formatCurrency(
                            breakdown?.remainingPayment || remainingPayment,
                          )}
                          ₮
                        </p>
                      </div>

                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-blue-900/20"
                      >
                        QPay-ээр төлөх
                      </button>

                      <button
                        onClick={() => setStep("breakdown")}
                        className="w-full text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
                      >
                        ← Буцах
                      </button>
                    </motion.div>
                  )}

                  {/* ── Step 3: Success ── */}
                  {step === "success" && (
                    <motion.div
                      key="success"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-col items-center justify-center py-8 text-center space-y-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: 15,
                          stiffness: 200,
                          delay: 0.2,
                        }}
                        className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/10"
                      >
                        <CheckCircle className="h-10 w-10" />
                      </motion.div>
                      <div className="space-y-2">
                        <h4 className="text-3xl font-black">Амжилттай!</h4>
                        <p className="text-zinc-400">
                          Аялал амжилттай дууслаа. Баярлалаа!
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-neutral-100 transition-all"
                      >
                        Хаах
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QPay Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={breakdown?.remainingPayment || remainingPayment}
        bookingData={{ bookingId: booking._id, type: "final" }}
        onSuccess={handlePaymentSuccess}
        title="Үлдэгдэл төлбөр"
        subtitle="Үлдэгдэл дүнг төлнө үү"
      />
    </>
  );
}
