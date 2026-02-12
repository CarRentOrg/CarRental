"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarDays,
  CheckCircle,
  Smartphone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Car as CarType } from "@/types";
import { useState } from "react";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarType;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}

type Step = "summary" | "identifier" | "otp" | "success";

export default function BookingModal({
  isOpen,
  onClose,
  car,
  startDate,
  endDate,
  totalPrice,
}: BookingModalProps) {
  const { user } = useUserAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("summary");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (step === "summary") {
      if (user) {
        await createFinalBooking();
      } else {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
        );
      }
    }
  };

  const createFinalBooking = async () => {
    setIsLoading(true);
    try {
      const res = await api.bookings.init({
        carId: car._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
      });

      if (res) {
        setStep("success");
      }
    } catch (err: any) {
      toast.error(err.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden text-white"
          >
            {/* Header / Car Image */}
            <div className="relative h-40 bg-zinc-900">
              <img
                src={car.thumbnail?.url || car.images?.[0]?.url}
                alt={car.model}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                  {car.brand}
                </p>
                <h3 className="text-xl font-black">
                  {car.model} {car.year}
                </h3>
              </div>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === "summary" && (
                  <motion.div
                    key="summary"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                          Start
                        </p>
                        <p className="font-bold">
                          {format(startDate, "MMM dd")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                          End
                        </p>
                        <p className="font-bold">{format(endDate, "MMM dd")}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-zinc-400 font-medium">
                        Total Price
                      </span>
                      <span className="text-3xl font-black text-blue-500">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={isLoading}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          Next <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center justify-center py-8 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/10">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-3xl font-black">Амжилттай!</h4>
                      <p className="text-zinc-400">
                        Таны захиалга бүртгэгдлээ. Бид тун удахгүй тантай
                        холбогдох болно.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = "/profile";
                      }}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-neutral-100 transition-all"
                    >
                      Миний захиалгууд
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const LoadingSpinner = () => (
  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);
