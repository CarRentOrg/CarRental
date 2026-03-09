"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Shield, CreditCard, Car, Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [accepted, setAccepted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
    setScrollProgress(progress);
    if (scrollHeight - scrollTop - clientHeight < 40) {
      setHasScrolledToBottom(true);
      setAccepted(true);
    }
  }, []);

  const handleContinue = () => {
    if (accepted) {
      router.push(`/booking/${carId}`);
    }
  };

  const terms = [
    {
      key: "rentalPolicy",
      icon: Clock,
      title: "termsList.rentalPolicy.title",
      items: [
        "termsList.rentalPolicy.items.0",
        "termsList.rentalPolicy.items.1",
        "termsList.rentalPolicy.items.2",
        "termsList.rentalPolicy.items.3",
      ],
    },
    {
      key: "insurance",
      icon: Shield,
      title: "termsList.insurance.title",
      items: [
        "termsList.insurance.items.0",
        "termsList.insurance.items.1",
        "termsList.insurance.items.2",
        "termsList.insurance.items.3",
      ],
    },
    {
      key: "payment",
      icon: CreditCard,
      title: "termsList.payment.title",
      items: [
        "termsList.payment.items.0",
        "termsList.payment.items.1",
        "termsList.payment.items.2",
        "termsList.payment.items.3",
      ],
    },
    {
      key: "vehicle",
      icon: Car,
      title: "termsList.vehicle.title",
      items: [
        "termsList.vehicle.items.0",
        "termsList.vehicle.items.1",
        "termsList.vehicle.items.2",
        "termsList.vehicle.items.3",
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
              <div
                ref={contentRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6"
              >
                {/* Scroll hint */}
                {!hasScrolledToBottom && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2 animate-bounce">
                    <ChevronDown className="h-4 w-4" />
                    <span>Scroll to read all terms</span>
                  </div>
                )}
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
                        {t(section.title)}
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
                            {t(item)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Footer - Sticky */}
              <div className="p-6 md:p-8 border-t border-zinc-800 bg-zinc-950 space-y-4">
                {/* Scroll progress bar */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-200 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
                {!hasScrolledToBottom && (
                  <p className="text-xs text-zinc-500 text-center">
                    Read all terms to enable checkbox ({scrollProgress}%)
                  </p>
                )}
                {/* Checkbox */}
                <label className={`flex items-start gap-3 cursor-pointer group ${!hasScrolledToBottom ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={accepted}
                      disabled={!hasScrolledToBottom}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-zinc-700 bg-zinc-900 checked:bg-white checked:border-white transition-all disabled:cursor-not-allowed"
                    />
                    <Check className="absolute h-3 w-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm text-zinc-300 leading-relaxed group-hover:text-white transition-colors">
                    {t("terms.agreement")}
                  </span>
                </label>

                {/* CTA Button */}
                <button
                  onClick={handleContinue}
                  disabled={!accepted}
                  className="w-full py-4 bg-white hover:bg-zinc-100 text-black font-bold rounded-xl transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-lg"
                >
                  {t("terms.continue")}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
