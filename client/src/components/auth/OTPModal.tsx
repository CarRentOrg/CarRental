"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { useUserAuth } from "@/contexts/UserAuthContext";
import toast from "react-hot-toast";

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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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
      setIdentifier("");
      setOtp(["", "", "", "", "", ""]);
      setError("");
    }
  }, [isOpen]);

  const handleSendOTP = async () => {
    if (!identifier) return toast.error("Please enter your details");

    setLoading(true);
    setError("");
    const success = await requestOTP(identifier);
    setLoading(false);

    if (success) {
      setStep("otp");
      setTimer(60);
      toast.success(`OTP sent to ${identifier}`);
    } else {
      toast.error("Failed to send OTP");
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter full code");

    setLoading(true);
    setError("");
    try {
      const user = await verifyOTP(identifier, code);
      if (user) {
        toast.success("Verified!");
        onSuccess();
        onClose();
      }
    } catch (e: any) {
      const msg =
        e.message || "Уншсан код буруу эсвэл хугацаа нь дууссан байна.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    setError(""); // Clear error on any key down in OTP fields
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
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
                {step === "method" ? "Login / Register" : "Verify OTP"}
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                {step === "method"
                  ? "Enter your details to continue booking."
                  : `Enter the code sent to ${identifier}`}
              </p>

              {step === "method" && (
                <div className="space-y-4">
                  {/* Tabs */}
                  <div className="flex bg-zinc-950 p-1 rounded-xl">
                    <button
                      onClick={() => setMethod("email")}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        method === "email"
                          ? "bg-zinc-800 text-white shadow-lg"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Mail className="h-4 w-4" /> Email
                    </button>
                    <button
                      onClick={() => setMethod("phone")}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        method === "phone"
                          ? "bg-zinc-800 text-white shadow-lg"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Smartphone className="h-4 w-4" /> Phone
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
                      placeholder={
                        method === "email" ? "name@example.com" : "99112233"
                      }
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-blue-500 transition-colors outline-none"
                    />
                  </div>

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
                        Continue <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {step === "otp" && (
                <div className="space-y-6">
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-12 h-14 bg-zinc-950 border ${
                          error ? "border-red-500/50" : "border-zinc-800"
                        } rounded-xl text-center text-xl font-bold text-white focus:border-blue-500 outline-none transition-colors`}
                      />
                    ))}
                  </div>

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
                      "Verify & Login"
                    )}
                  </button>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-sm text-zinc-500">
                        Resend in{" "}
                        <span className="text-white font-mono">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOTP}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setStep("method")}
                    className="w-full text-zinc-500 text-sm hover:text-white"
                  >
                    Go Back
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
