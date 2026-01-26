"use client";

import Link from "next/link";
import { Search, Calendar, MapPin, ChevronRight, Users, Diamond } from "lucide-react";
import { motion, Variants } from "framer-motion";
import CarCard from "@/components/cars/CarCard";
import { Car } from "@/types";
import Title from "@/components/shared/title";
import FeaturedSection from "@/components/_sections/FeaturedSection";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
            className="h-full w-full object-cover"
            alt="Hero Car"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="container relative mx-auto flex h-screen flex-col justify-center px-6 md:px-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl space-y-8 pt-20"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-neutral-900/80 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-md shadow-2xl"
            >
              <Diamond className="h-4 w-4 text-white fill-white/20" />
              <span className="tracking-wide">Chosen by more than 250 clients</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl font-black leading-[1.1] tracking-tighter text-white md:text-8xl lg:text-9xl"
            >
              Premium <br />
              <span className="text-neutral-500 font-medium tracking-tight">Rental Service</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-xl text-lg text-neutral-400 md:text-xl leading-relaxed font-medium"
            >
              Experience unmatched comfort, style, and service — wherever the road takes you.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 sm:flex-row pt-4"
            >
              <Link
                href="/cars"
                className="inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-lg font-bold text-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:bg-neutral-100"
              >
                Choose Your Car
              </Link>
              <button
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-10 py-5 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                Our Approach
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <FeaturedSection />

      {/* Why Choose Us Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-gray-600">
              The best rental experience with premium benefits
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Many Locations</h3>
              <p className="text-gray-600 leading-relaxed">
                Find us easily with numerous locations across the country,
                making pick-up and drop-off a breeze.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Easy Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Our intuitive platform allows you to book your favorite car in
                just a few clicks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Reliable Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our 24/7 customer support is always here to help you with any
                questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
