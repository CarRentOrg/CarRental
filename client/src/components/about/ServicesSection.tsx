"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, DollarSign, Plane, Clock, LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const SERVICES: Service[] = [
  {
    icon: Car,
    title: "Luxury Fleet",
    desc: "Top-tier vehicles from brands like Ferrari, Rolls Royce, and Porsche.",
  },
  {
    icon: DollarSign,
    title: "Best Value",
    desc: "Competitive rates for premium experiences, without hidden fees.",
  },
  {
    icon: Plane,
    title: "Airport Pickup",
    desc: "VIP meet-and-greet service upon your arrival at any major airport.",
  },
  {
    icon: Clock,
    title: "Long-Term",
    desc: "Flexible monthly rental plans for extended stays and business trips.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-white/5 skew-y-3 transform origin-bottom-left" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-white font-bold tracking-widest uppercase text-sm">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-2">
            Premium Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-zinc-900 border border-white/10 hover:border-white/30 transition-colors"
            >
              <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
