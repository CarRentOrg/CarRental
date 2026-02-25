"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS, FAQItem } from "@/constants";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const toggleFAQ = (index: number): void => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative py-16 sm:py-28 overflow-hidden">
      {/* Decorative gradient blur */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2
                    w-[600px] h-[600px] rounded-full
                    bg-linear-to-br from-zinc-800/20 via-zinc-900/10 to-transparent
                    blur-3xl"
      />

      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Header */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Common questions
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t("faq.title")}
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              Everything you need to know before renting. Can&apos;t find what
              you&apos;re looking for? Feel free to contact us.
            </p>

            {/* FAQ count badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/60">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-zinc-400 font-medium">
                {FAQS.length} answers ready
              </span>
            </div>
          </div>

          {/* Right — Accordion */}
          <div className="space-y-3">
            {FAQS.map((item: FAQItem, i: number) => {
              const isOpen = openIndex === i;
              const num = String(i + 1).padStart(2, "0");

              return (
                <div
                  key={i}
                  className={`group rounded-xl border transition-all duration-500 ${
                    isOpen
                      ? "bg-zinc-900/70 border-zinc-700/80 shadow-lg shadow-black/10"
                      : "bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60 hover:border-zinc-700/60"
                  }`}
                >
                  {/* Question row */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(i)}
                    className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
                  >
                    {/* Number accent */}
                    <span
                      className={`text-[11px] font-mono tabular-nums shrink-0 transition-colors duration-500 ${
                        isOpen
                          ? "text-zinc-400"
                          : "text-zinc-700 group-hover:text-zinc-500"
                      }`}
                    >
                      {num}
                    </span>

                    {/* Question text */}
                    <span
                      className={`flex-1 text-[15px] font-medium transition-colors duration-500 ${
                        isOpen
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {t(item.question)}
                    </span>

                    {/* Chevron */}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-all duration-500 ${
                        isOpen
                          ? "rotate-180 text-white"
                          : "text-zinc-600 group-hover:text-zinc-400"
                      }`}
                    />
                  </button>

                  {/* Answer panel */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pl-15">
                        <div className="w-8 h-px bg-zinc-800 mb-3" />
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          {t(item.answer)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
