import { BOOKING_STEPS } from "@/constants";
import Image from "next/image";
import React from "react";
import Title from "../shared/title";

const HowToRentSection = () => {
  return (
    <section className="py-24">
      {/* <h2 className="text-4xl font-light tracking-tight text-center mb-16">
        Get Rolling in 4 Steps
      </h2> */}

      <div className="mb-16">
        <Title title="Get Rolling in 4 Steps" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Featured Image */}
        <div className="relative aspect-4/3 rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80"
            alt="Luxury car"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 gap-4 h-full">
          {BOOKING_STEPS.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-6 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-500 group"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#171717] border  border-neutral-700 text-sm font-medium text-neutral-400 mb-4 group-hover:border-white group-hover:text-white transition-all duration-300">
                {step.number}
              </span>
              <h4 className="text-lg font-medium text-white mb-2 text-center">
                {step.title}
              </h4>
              <p className="text-sm text-neutral-500 leading-relaxed text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToRentSection;
