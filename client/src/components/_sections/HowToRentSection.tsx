"use client";

import { BOOKING_STEPS } from "@/constants";
import Image from "next/image";

const HowToRentSection = () => {
  return (
    <section id="rental-guide" className="py-16 sm:py-28 w-full">
      {/* Section header */}
      <div className="mb-12 sm:mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Get Rolling in 4 Steps
        </h2>
      </div>

      {/* Timeline steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left — Steps */}
        <div className="space-y-0">
          {BOOKING_STEPS.map((step, i) => {
            const isLast = i === BOOKING_STEPS.length - 1;

            return (
              <div key={i} className="group relative flex gap-5">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="relative z-10 w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800
                                flex items-center justify-center shrink-0
                                group-hover:bg-white/10 group-hover:border-zinc-600
                                transition-all duration-500"
                  >
                    <span className="text-xs font-mono font-semibold text-zinc-500 group-hover:text-white transition-colors duration-500">
                      {step.number}
                    </span>
                  </div>
                  {/* Connecting line */}
                  {!isLast && (
                    <div className="w-px flex-1 bg-gradient-to-b from-zinc-800 to-transparent min-h-8" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <h4 className="text-base font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right — Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80"
            alt="Luxury car"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          {/* Floating badge */}
          <div className="absolute bottom-5 left-5 right-5">
            <div className="px-4 py-3 rounded-xl bg-black/60 backdrop-blur-md border border-zinc-700/50">
              <p className="text-xs text-zinc-400 mb-0.5">Ready to drive?</p>
              <p className="text-sm font-semibold text-white">
                Book in under 5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToRentSection;
