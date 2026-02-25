"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Shield, CreditCard, Car, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface RentalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
}

export default function RentalTermsModal({
  isOpen,
  onClose,
  carId,
}: RentalTermsModalProps) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (accepted) {
      router.push(`/booking/${carId}`);
    }
  };

  const terms = [
    {
      icon: Clock,
      title: "Rental Policy",
      items: [
        "Minimum rental period: 24 hours",
        "Driver must be 21 years or older",
        "Valid driver's license required",
        "International license accepted with translation",
      ],
    },
    {
      icon: Shield,
      title: "Insurance & Protection",
      items: [
        "Basic insurance included in rental price",
        "Optional premium coverage available",
        "Collision damage waiver recommended",
        "Maximum liability: $5,000 deductible",
      ],
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      items: [
        "Security deposit: $500 (refundable)",
        "Credit card required for deposit",
        "Free cancellation up to 48 hours",
        "Full refund for early cancellations",
      ],
    },
    {
      icon: Car,
      title: "Vehicle Condition",
      items: [
        "Pre-rental inspection documented",
        "Return with same fuel level",
        "Daily mileage limit: 200 km",
        "Additional mileage: $0.50/km",
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col pointer-events-auto"
            >
              {/* Header - Sticky */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-800">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Rental Terms & Conditions
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Please review before proceeding
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6 text-zinc-400" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {terms.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-zinc-300"
                        >
                          <Check className="h-5 w-5 text-white shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Footer - Sticky */}
              <div className="p-6 md:p-8 border-t border-zinc-800 bg-zinc-950 space-y-4">
                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-zinc-700 bg-zinc-900 checked:bg-white checked:border-white transition-all"
                    />
                    <Check className="absolute h-3 w-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm text-zinc-300 leading-relaxed group-hover:text-white transition-colors">
                    I have read and agree to the rental terms and conditions,
                    including the insurance policy, payment terms, and vehicle
                    return requirements.
                  </span>
                </label>

                {/* CTA Button */}
                <button
                  onClick={handleContinue}
                  disabled={!accepted}
                  className="w-full py-4 bg-white hover:bg-zinc-100 text-black font-bold rounded-xl transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-lg"
                >
                  Continue to Booking
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
