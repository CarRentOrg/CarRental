"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Home, ArrowRight, Printer, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ConfirmationPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setMounted(true);
    setBookingNumber(
      "CR-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    );
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const steps = [
    t("confirmation.steps.s1"),
    t("confirmation.steps.s2"),
    t("confirmation.steps.s3"),
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="bg-white p-12 text-center text-black">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-md mb-6 animate-pulse">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4">
              {t("confirmation.title")}
            </h1>
            <p className="text-zinc-800 text-lg">{t("confirmation.desc")}</p>
          </div>

          <div className="p-12 space-y-10">
            <div className="flex justify-center flex-wrap gap-4">
              <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {t("confirmation.bookingId")}
                </span>
                <span className="text-xl font-black text-black">
                  {bookingNumber}
                </span>
              </div>
              <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {t("confirmation.date")}
                </span>
                <span className="text-xl font-black text-gray-900">
                  {currentDate}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-4">
                {t("confirmation.nextSteps")}
              </h3>
              <ul className="space-y-5">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start space-x-4">
                    <div className="shrink-0 h-6 w-6 rounded-full bg-zinc-200 text-black flex items-center justify-center text-xs font-black">
                      {i + 1}
                    </div>
                    <p className="text-gray-600 font-medium">{step}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <Link
                href="/"
                className="flex items-center justify-center space-x-2 rounded-2xl bg-gray-900 py-4 font-bold text-white transition-all hover:bg-gray-800"
              >
                <Home className="h-4 w-4" />
                <span>{t("confirmation.returnHome")}</span>
              </Link>
              <button className="flex items-center justify-center space-x-2 rounded-2xl border-2 border-gray-100 py-4 font-bold text-gray-900 transition-all hover:bg-gray-50">
                <Printer className="h-4 w-4" />
                <span>{t("confirmation.print")}</span>
              </button>
            </div>

            <div className="flex justify-center pt-4">
              <button className="text-sm font-bold text-black flex items-center space-x-2 hover:underline">
                <Share2 className="h-4 w-4" />
                <span>{t("confirmation.share")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
