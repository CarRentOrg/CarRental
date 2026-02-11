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
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, requestOTP, verifyOTP } = useAuth();
  const [step, setStep] = useState<Step>("summary");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (step === "summary") {
      if (user) {
        // Already logged in, go straight to booking logic
        await createFinalBooking();
      } else {
        setStep("identifier");
      }
    } else if (step === "identifier") {
      if (!identifier) return toast.error("Please enter phone or email");
      setIsLoading(true);
      const success = await requestOTP(identifier);
      setIsLoading(false);
      if (success) {
        setStep("otp");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } else if (step === "otp") {
      if (!otp) return toast.error("Please enter the OTP code");
      setIsLoading(true);
      const loggedUser = await verifyOTP(identifier, otp);
      if (loggedUser) {
        await createFinalBooking();
      } else {
        setIsLoading(false);
        toast.error("Invalid OTP code");
      }
    }
  };

  const createFinalBooking = async () => {
    setIsLoading(true);
    try {
      const res = await api.bookings.create({
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

                {step === "identifier" && (
                  <motion.div
                    key="identifier"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black">Утасны дугаар</h4>
                      <p className="text-sm text-zinc-400">
                        Захиалга баталгаажуулахын тулд утсаар нэг удаа нэвтэрнэ
                        үү.
                      </p>
                    </div>
                    <div className="relative group">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Утасны дугаар эсвэл И-мэйл"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-12 py-4 outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={isLoading}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? <LoadingSpinner /> : "OTP Код авах"}
                    </button>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div
                    key="otp"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black">Баталгаажуулах</h4>
                      <p className="text-sm text-zinc-400">
                        {identifier} дугаарт илгээсэн 6 оронтой кодыг оруулна
                        уу.
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="• • • • • •"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-center text-3xl font-black tracking-[1em] outline-none focus:border-blue-500 transition-all"
                    />
                    <button
                      onClick={handleNext}
                      disabled={isLoading}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? <LoadingSpinner /> : "Баталгаажуулах"}
                    </button>
                    <button
                      onClick={() => setStep("identifier")}
                      className="w-full text-sm text-zinc-500 font-bold hover:text-white transition-colors"
                    >
                      Буцах
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
