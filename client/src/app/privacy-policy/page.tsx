"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const sections = [
    {
      title: "privacyPolicy.a1.title",
      content: "privacyPolicy.a1.content",
    },
    {
      title: "privacyPolicy.a2.title",
      content: "privacyPolicy.a2.content",
    },
    {
      title: "privacyPolicy.a3.title",
      content: "privacyPolicy.a3.content",
    },
    {
      title: "privacyPolicy.a4.title",
      content: "privacyPolicy.a4.content",
    },
    {
      title: "privacyPolicy.a5.title",
      content: "privacyPolicy.a5.content",
    },
    {
      title: "privacyPolicy.a6.title",
      content: "privacyPolicy.a6.content",
    },
    {
      title: "privacyPolicy.a7.title",
      content: "privacyPolicy.a7.content",
    },
    {
      title: "privacyPolicy.a8.title",
      content: "privacyPolicy.a8.content",
    },
    {
      title: "privacyPolicy.a9.title",
      content: "privacyPolicy.a9.content",
    },
    {
      title: "privacyPolicy.a10.title",
      content: "privacyPolicy.a10.content",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 py-20">
      {/* 1. HERO SECTION */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 via-black/50 to-black z-0" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-2 border border-blue-500/20"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            Privacy <span className="text-blue-600">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-gray-400 font-light max-w-2xl mx-auto"
          >
            Understanding how we protect and manage your personal information in
            our car rental marketplace.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section className="pt-16 px-4 sm:px-12 max-w-4xl mx-auto lg:-mt-10 relative z-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-white/5 shadow-2xl space-y-12"
        >
          {sections.map((section, index) => (
            <motion.div key={index} variants={fadeIn} className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white border-b border-white/5 pb-4">
                {t(section.title)}
              </h2>
              <div className="text-gray-300 leading-relaxed font-light">
                {t(section.content)}
              </div>
            </motion.div>
          ))}

          <motion.div
            variants={fadeIn}
            className="pt-8 border-t border-white/10 text-center"
          >
            <p className="text-gray-500 text-sm">
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
