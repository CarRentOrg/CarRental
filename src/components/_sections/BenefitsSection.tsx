"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

const BenefitsSection = () => {
    const { t } = useLanguage();

    const benefits = [
        {
            title: t("benefits.title1"),
            desc: t("benefits.desc1"),
            image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80",
        },
        {
            title: t("benefits.title2"),
            desc: t("benefits.desc2"),
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80",
        },
        {
            title: t("benefits.title3"),
            desc: t("benefits.desc3"),
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80",
        },
        {
            title: t("benefits.title4"),
            desc: t("benefits.desc4"),
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80",
        },
    ];

    return (
        <section className="py-12 sm:px-10 mx-auto w-full px-4 bg-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative h-[300px] md:h-[400px] overflow-hidden rounded-[2.5rem] bg-neutral-900"
                    >
                        {/* Background Image */}
                        <Image
                            src={benefit.image}
                            alt={benefit.title}
                            fill
                            className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Content */}
                        <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">
                                {benefit.title}
                            </h3>
                            <p className="text-neutral-400 text-xs md:text-sm font-medium leading-relaxed max-w-xs transition-colors group-hover:text-neutral-300">
                                {benefit.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default BenefitsSection;
