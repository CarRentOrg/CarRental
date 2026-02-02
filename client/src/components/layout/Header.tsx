"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Car,
  Menu,
  X,
  Instagram,
  MessageCircle,
  Phone,
  Globe,
  User,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NavLink from "../shared/navLink";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 bg-transparent md:backdrop-blur-md">
      <div
        className={`
          flex items-center justify-between transition-all duration-500
          max-lg:mx-auto max-lg:mt-4 max-lg:w-[92%] max-lg:max-w-full max-lg:rounded-full max-lg:px-6 max-lg:py-0.5 max-lg:border max-lg:border-white/10 max-lg:bg-neutral-900 max-lg:shadow-2xl
          w-full md:px-12 ${scrolled ? "lg:h-20" : "lg:h-24"}
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div
            className={`p-2 rounded-xl transition-all duration-300 ${scrolled ? "bg-white/10" : "bg-white/5 backdrop-blur-sm"}`}
          >
            <Car className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            LoGO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-wide uppercase text-white/70">
          <NavLink href="/cars">{t("nav.cars")}</NavLink>
          <NavLink href="/#rental-terms">{t("nav.rentalTerms")}</NavLink>
          <NavLink href="/about">{t("nav.about")}</NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-4 text-white/90">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:scale-110 transition-all"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:scale-110 transition-all"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href="tel:+123456789"
              className="hover:text-white hover:scale-110 transition-all"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              onClick={() => setLanguage(language === "en" ? "mn" : "en")}
              className={`hidden lg:flex items-center justify-center p-1.5 rounded-full border transition-all
              ${scrolled ? "border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10" : "border-white/20 bg-white/10 text-white hover:bg-white/20"}
            `}
            >
              <Globe className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/admin"
            className="hidden lg:flex items-center space-x-2 rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
          >
            <User className="h-4 w-4" />
            <span>{t("nav.admin")}</span>
          </Link>

          <button
            className="lg:hidden p-2 text-white/80 hover:text-white transition-all transform active:scale-90"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-3 backdrop-blur-lg lg:hidden "
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="relative w-[93%] min-w-sm rounded-[2.5rem] bg-neutral-900 border border-white/10 p-6 shadow-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-8">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>

              {/* Mobile Nav */}
              <nav className="flex flex-col space-y-5 text-sm font-medium mb-6 text-white/80">
                <NavLink href="/cars" setOpen={setOpen}>
                  {t("nav.cars")}
                </NavLink>
                <NavLink href="/cars#rental-terms" setOpen={setOpen}>
                  {t("nav.rentalTerms")}
                </NavLink>
                <NavLink href="/#rental-guide" setOpen={setOpen}>
                  {t("nav.guide")}
                </NavLink>
                <NavLink href="/about" setOpen={setOpen}>
                  {t("nav.about")}
                </NavLink>
              </nav>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === "en" ? "mn" : "en")}
                className="flex items-center justify-center p-2 rounded-full border border-white/20 bg-white/10 text-white mb-6 hover:bg-white/20 transition-all"
              >
                <Globe className="h-5 w-5" />
              </button>

              {/* Book & Social */}
              <div className="flex items-center gap-6">
                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="bg-white text-black rounded-full px-5 py-3.5 text-sm font-medium shadow-2xl shadow-white/10 hover:bg-neutral-100 transition-all active:scale-95"
                >
                  {t("nav.bookNow")}
                </Link>
                <div className="flex items-center space-x-4 text-white/90">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:scale-110 transition-all"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://wa.me/123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:scale-110 transition-all"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                  <a
                    href="tel:+123456789"
                    className="hover:text-white hover:scale-110 transition-all"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
