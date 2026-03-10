"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // custom sleek easing
    },
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 min-h-screen flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32"
        >
          {/* LEFT: Typography & Contact Info */}
          <div className="flex flex-col justify-between">
            <motion.div variants={itemVariants} className="space-y-6 max-w-lg">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                {t("contact.title")}
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                {t("contact.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-16 lg:mt-32 space-y-8"
            >
              <div>
                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">
                  {t("contact.info.office")}
                </h3>
                <p className="text-lg text-white font-medium flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-zinc-500" />
                  {t("footer.address")}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">
                  {t("contact.info.phone")}
                </h3>
                <a
                  href="tel:+13235557842"
                  className="text-lg text-white font-medium hover:text-zinc-300 transition-colors flex items-center gap-3"
                >
                  <Phone className="h-5 w-5 text-zinc-500" />
                  +1 (323) 555-7842
                </a>
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">
                  {t("contact.info.email")}
                </h3>
                <a
                  href="mailto:hello@luxerra.com"
                  className="text-lg text-white font-medium hover:text-zinc-300 transition-colors flex items-center gap-3"
                >
                  <Mail className="h-5 w-5 text-zinc-500" />
                  hello@luxerra.com
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Minimal Form */}
          <motion.div variants={itemVariants} className="flex items-center">
            <form onSubmit={handleSubmit} className="w-full space-y-12">
              <div className="group relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-zinc-800 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 top-4 text-xl text-zinc-600 pointer-events-none transition-all
                             peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white
                             peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
                >
                  {t("contact.form.name")}
                </label>
              </div>

              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-zinc-800 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-4 text-xl text-zinc-600 pointer-events-none transition-all
                             peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white
                             peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
                >
                  {t("contact.form.email")}
                </label>
              </div>

              <div className="group relative">
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-zinc-800 py-4 text-xl text-white focus:outline-none focus:border-white transition-colors resize-none"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-4 text-xl text-zinc-600 pointer-events-none transition-all
                             peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white
                             peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
                >
                  {t("contact.form.message")}
                </label>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="relative overflow-hidden w-full lg:w-auto px-12 py-5 bg-white text-black font-bold text-lg rounded-full flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>{t("contact.sending")}</span>
                      </motion.div>
                    ) : isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-600"
                      >
                        {t("contact.successMessage")}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        {t("contact.form.send")}
                        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
