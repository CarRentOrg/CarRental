"use client";

import { RENTAL_TERMS } from "@/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, ArrowRight } from "lucide-react";

const RentalTermsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="rental-terms" className="mt-16 sm:mt-28">
      {/* Section header */}
      <div className="mb-10 sm:mb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
          Before you book
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Rental Terms
        </h2>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Terms grid — spans 3 cols */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RENTAL_TERMS.map((term, i) => (
            <div
              key={i}
              className="group relative p-5 sm:p-6 rounded-2xl
                         bg-zinc-900/40 border border-zinc-800/60
                         hover:bg-zinc-900/70 hover:border-zinc-700/80
                         transition-all duration-500"
            >
              {/* Numbering accent */}
              <span className="absolute top-5 right-5 text-[10px] font-mono text-zinc-700 tabular-nums">
                0{i + 1}
              </span>

              <div
                className="w-9 h-9 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-4
                            group-hover:bg-white/10 transition-colors duration-500"
              >
                <term.icon className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors duration-500" />
              </div>

              <p className="text-[15px] font-semibold text-white mb-1 leading-snug">
                {t(term.title)}
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t(term.subtitle)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA card — spans 2 cols */}
        <div className="lg:col-span-2">
          <div
            className="h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl
                        bg-gradient-to-br from-zinc-900/60 to-zinc-900/30
                        border border-zinc-800/60"
          >
            <div className="space-y-4">
              <div
                className="w-11 h-11 rounded-xl bg-white/5 border border-zinc-800
                            flex items-center justify-center"
              >
                <Phone className="h-5 w-5 text-zinc-300" />
              </div>

              <h3 className="text-xl font-bold text-white leading-snug">
                Need help choosing
                <br />
                the right car?
              </h3>

              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                Our team is ready to assist you — finding the perfect car that
                matches your needs and budget.
              </p>
            </div>

            {/* Agent + CTA */}
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center ring-2 ring-zinc-700/50">
                  <span className="text-sm font-semibold text-zinc-300">
                    MC
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Michael Carter
                  </p>
                  <p className="text-xs text-zinc-600">
                    Personal Rental Assistant
                  </p>
                </div>
              </div>

              <button
                className="group/btn w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                           bg-white text-black font-semibold text-sm
                           hover:bg-zinc-100 hover:scale-[1.02]
                           active:scale-[0.98]
                           transition-all duration-300
                           shadow-lg shadow-black/20"
              >
                <span>Call Us Now</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalTermsSection;
