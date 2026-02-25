"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Target, Globe, ShieldCheck, LucideIcon } from "lucide-react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface ValueCard {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const VALUES: ValueCard[] = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To empower clients with seamless, premium travel experiences defined by confidence and style.",
  },
  {
    icon: Globe,
    title: "Global Vision",
    desc: "Becoming the world's most trusted luxury mobility partner, connecting you to excellence anywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Core Values",
    desc: "Integrity, safety, and an obsession with quality guide every decision we make.",
  },
];

export default function StorySection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <span className="text-white font-bold tracking-widest uppercase text-sm">
            Our Story
          </span>
          <h2 className="text-3xl md:text-5xl font-black">
            More Than Just a Rental
          </h2>
          <p className="text-gray-400 leading-relaxed text-lg">
            Founded with a passion for automotive excellence, Luxerra began as a
            small fleet of hand-picked premium vehicles. Over the years, our
            commitment to quality and customer satisfaction has fueled our
            growth into a premier luxury car rental service. Our mission is
            simple: to elevate your travel experience by providing unparalleled
            comfort, style, and performance. We envision a world where every
            journey is as memorable as the destination itself.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {VALUES.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 hover:bg-zinc-900 transition-colors group"
            >
              <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
