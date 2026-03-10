"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { showToast } from "@/lib/toast";
import OTPInput from "@/components/ui/OTPInput";

// Simple validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "method" | "otp";

export default function OTPModal({
  isOpen,
  onClose,
  onSuccess,
}: OTPModalProps) {
  const { requestOTP, verifyOTP } = useUserAuth();

  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep("method");
      setMethod("email");
      setIdentifier("");
      setOtp("");
      setError("");
    }
  }, [isOpen]);

  const handleMethodChange = (newMethod: "email" | "phone") => {
    if (method === newMethod) return;
    setMethod(newMethod);
    setIdentifier("");
    setError("");
  };

  const validateIdentifier = (): string | null => {
    if (!identifier) return "Мэдээллээ оруулна уу";

    if (method === "email") {
      if (!EMAIL_REGEX.test(identifier)) {
        return "И-мэйл хаяг буруу байна";
      }
    } else {
      if (identifier.length !== 8) {
        return "Утасны дугаар буруу байна";
      }
    }

    return null;
  };

  const handleSendOTP = async () => {
    const validationError = validateIdentifier();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    const success = await requestOTP(identifier);
    setLoading(false);

    if (success) {
      setStep("otp");
      setTimer(60);
      showToast.success(`OTP sent to ${identifier}`);
    } else {
      showToast.error("Failed to send OTP");
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return showToast.error("Enter full code");

    setLoading(true);
    setError("");
    try {
      const user = await verifyOTP(identifier, otp);
      if (user) {
        showToast.success("Verified!");
        onSuccess();
        onClose();
      }
    } catch (e: any) {
      const msg =
        e.message || "Уншсан код буруу эсвэл хугацаа нь дууссан байна.";
      setError(msg);
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <div className="mt-2">
              <h2 className="text-2xl font-bold text-white mb-2">
                {step === "method" ? "Нэвтрэх" : "Баталгаажуулах код"}
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                {step === "method"
                  ? "Захиалгаа үргэлжлүүлэхийн тулд мэдээллээ оруулна уу."
                  : `${identifier} рүү илгээсэн кодыг оруулна уу`}
              </p>

              {step === "method" && (
                <div className="space-y-4">
                  {/* Tabs */}
                  <div className="flex bg-zinc-950 p-1 rounded-xl">
                    <button
                      onClick={() => handleMethodChange("email")}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        method === "email"
                          ? "bg-zinc-800 text-white shadow-lg"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Mail className="h-4 w-4" /> Email
                    </button>
                    <button
                      onClick={() => handleMethodChange("phone")}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        method === "phone"
                          ? "bg-zinc-800 text-white shadow-lg"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Smartphone className="h-4 w-4" /> Утасны дугаар
                    </button>
                  </div>

                  <div className="relative">
                    {method === "email" ? (
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    ) : (
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    )}
                    <input
                      type={method === "email" ? "email" : "tel"}
                      inputMode={method === "email" ? "email" : "numeric"}
                      placeholder={
                        method === "email" ? "name@example.com" : "99112233"
                      }
                      value={identifier}
                      maxLength={method === "phone" ? 8 : undefined}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (method === "phone") {
                          val = val.replace(/[^0-9]/g, "");
                        }
                        setIdentifier(val);
                        if (error) setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && identifier) {
                          e.preventDefault();
                          handleSendOTP();
                        }
                      }}
                      className={`w-full bg-zinc-950 border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 transition-colors outline-none ${
                        error && step === "method"
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-zinc-800 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {error && step === "method" && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs font-bold px-1"
                    >
                      {error}
                    </motion.p>
                  )}

                  {method === "phone" && (
                    <div className="text-xs text-zinc-500 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                      <span className="font-bold text-blue-500">DEV MODE:</span>{" "}
                      Use number{" "}
                      <span className="font-mono text-white">99112233</span> and
                      OTP <span className="font-mono text-white">123123</span>
                    </div>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={loading || !identifier}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        Нэвтрэх <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {step === "otp" && (
                <div className="space-y-6">
                  <OTPInput
                    value={otp}
                    onChange={(val) => {
                      setOtp(val);
                      setError("");
                    }}
                    onSubmit={handleVerify}
                    error={error}
                    disabled={loading}
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs font-bold text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Баталгаажуулах"
                    )}
                  </button>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-sm text-zinc-500">
                        дахин илгээх{" "}
                        <span className="text-white font-mono">{timer}с</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOTP}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Үндсэн код илгээх
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setStep("method")}
                    className="w-full text-zinc-500 text-sm hover:text-white"
                  >
                    Буцах
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
