"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Award,
  CalendarDays,
  LucideIcon,
} from "lucide-react";

interface Benefit {
  label: string;
  icon: LucideIcon;
}

const BENEFITS: Benefit[] = [
  { label: "24/7 Premium Support", icon: Zap },
  { label: "Trusted & Certified Fleet", icon: ShieldCheck },
  { label: "Flexible Booking Options", icon: CalendarDays },
  { label: "Transparent Pricing", icon: Award },
];

export default function WhyChooseSection() {
  return (
    <section className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Why Drivers <br /> Choose{" "}
              <span className="text-blue-600">Luxerra</span>
            </h2>
            <div className="space-y-6">
              {BENEFITS.map((point, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                    <point.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-semibold">{point.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative h-[500px] w-full rounded-[3rem] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80"
              alt="Why Choose Us"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
