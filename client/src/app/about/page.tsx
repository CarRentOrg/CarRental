"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Target,
  Award,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  Plane,
  Clock,
  Car,
  DollarSign,
  Star,
  Quote,
} from "lucide-react";
import Link from "next/link";

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
            alt="Luxury Car Background"
            fill
            className="object-cover opacity-40 scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black" />
        </div>

        <div className="relative z-10 px-6 max-w-7xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl"
          >
            DRIVEN BY <span className="text-blue-600">EXCELLENCE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Redefining luxury mobility. We connect you with the world's most
            exclusive vehicles for an unforgettable journey.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-70"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 2. OUR STORY & VISION */}
      <section className="py-24 md:py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-black">
              More Than Just a Rental
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Founded with a passion for automotive excellence, Luxerra began as
              a small fleet of hand-picked premium vehicles. Over the years, our
              commitment to quality and customer satisfaction has fueled our
              growth into a premier luxury car rental service. Our mission is
              simple: to elevate your travel experience by providing
              unparalleled comfort, style, and performance. We envision a world
              where every journey is as memorable as the destination itself.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {[
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
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 hover:bg-zinc-900 transition-colors group"
              >
                <div className="h-14 w-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-7 w-7 text-blue-500" />
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

      {/* 3. SERVICES / FEATURES */}
      <section className="py-24 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/5 skew-y-3 transform origin-bottom-left" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-2">
              Premium Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
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
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-zinc-900 border border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-blue-400">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
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
                {[
                  { label: "24/7 Premium Support", icon: Zap },
                  { label: "Trusted & Certified Fleet", icon: ShieldCheck },
                  { label: "Flexible Booking Options", icon: CalendarIcon },
                  { label: "Transparent Pricing", icon: Award },
                ].map((point, i) => (
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

      {/* 5. TEAM */}
      <section className="py-24 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black">Meet the Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The experts ensuring your journey is nothing short of perfect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {[
              {
                name: "Alex Morgan",
                role: "CEO & Founder",
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
              },
              {
                name: "Sarah Chen",
                role: "Head of Operations",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
              },
              {
                name: "Marcus Johnson",
                role: "Fleet Manager",
                img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative h-96 w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 filter saturate-0 group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white">
                      {member.name}
                    </h3>
                    <p className="text-blue-500 font-medium">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">
              Voices of Trust
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-2">
              Client Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Luxerra isn't just a rental service, it's an experience. The car was pristine and the service was impeccable.",
                author: "James Peterson",
                role: "Entrepreneur",
              },
              {
                quote:
                  "I've rented from many companies, but none match the attention to detail and quality of fleet here.",
                author: "Emily Clark",
                role: "Travel Blogger",
              },
              {
                quote:
                  "Seamless from booking to return. The airport pickup was a lifesaver for my business trip.",
                author: "Michael Chang",
                role: "Executive",
              },
            ].map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 p-8 rounded-3xl border border-white/5 relative"
              >
                <Quote className="absolute top-8 right-8 h-8 w-8 text-blue-600/20 rotate-180" />
                <div className="flex gap-1 text-amber-500 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">
                  "{story.quote}"
                </p>
                <div>
                  <h4 className="font-bold text-white">{story.author}</h4>
                  <p className="text-sm text-gray-500">{story.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80"
            alt="CTA Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white"
          >
            Drive Your <span className="text-blue-400">Dream</span> Today
          </motion.h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/cars"
              className="px-10 py-5 bg-white text-blue-900 rounded-full font-black text-lg hover:bg-blue-50 transition-all flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95"
            >
              Book a Car <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
