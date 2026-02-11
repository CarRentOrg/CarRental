"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulate Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    // Reset after success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* 1. HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80"
            alt="Contact Hero"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Get in <span className="text-blue-600">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg text-gray-400 font-light max-w-2xl mx-auto"
          >
            Have a question or need assistance? We are here to help you 24/7.
            Reach out to us and we'll get back to you shortly.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <section className="py-20 px-4 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* LEFT COLUMN: Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Send us a Message</h2>
              <p className="text-gray-400">
                Fill the form below and our team will contact you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Your Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || isSuccess}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  isSuccess
                    ? "bg-green-600 text-white shadow-green-900/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
                } shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSuccess ? (
                  "Message Sent!"
                ) : (
                  <>
                    Send Message <Send className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT COLUMN: Info & Map */}
          <div className="space-y-8">
            {/* Info Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-3 hover:bg-zinc-900/60 transition-colors">
                <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Call Us</h3>
                  <p className="text-gray-400 text-sm">+1 (323) 555-7842</p>
                </div>
              </div>
              <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-3 hover:bg-zinc-900/60 transition-colors">
                <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Email</h3>
                  <p className="text-gray-400 text-sm">hello@luxerra.com</p>
                </div>
              </div>
              <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-3 hover:bg-zinc-900/60 transition-colors">
                <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Opening Hours</h3>
                  <p className="text-gray-400 text-sm">Mon-Sun: 8am - 10pm</p>
                </div>
              </div>
              <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-3 hover:bg-zinc-900/60 transition-colors">
                <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Location</h3>
                  <p className="text-gray-400 text-sm">
                    Central Tower, Ulaanbaatar
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full h-80 sm:h-96 rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl"
            >
              <iframe
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Central%20Tower%2C%20Ulaanbaatar%2C%20Mongolia+(Luxerra%20Office)&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) invert(90%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Central Tower Location"
              />
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-4 justify-start pt-4">
              <a
                href="#"
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-blue-400 transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-blue-400 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
