"use client";

import Link from 'next/link';
import { Car, Search, Menu, User, X, Instagram, MessageCircle, Phone, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 bg-transparent min-md:backdrop-blur-md'>
      <div className={`
        flex items-center justify-between transition-all duration-500
        
        /* Mobile: Floating Pill */
        max-md:mx-auto max-md:mt-4 max-md:w-[92%] max-md:max-w-sm max-md:rounded-full max-md:px-6 max-md:py-0.5 max-md:border max-md:border-white/10 max-md:bg-neutral-900 max-md:shadow-2xl
        
        /* Desktop: Full Width */
        w-full md:px-12 ${scrolled ? 'md:h-20' : 'md:h-24'}
      `}>
        <Link href="/" className="flex items-center space-x-3 group">
          <div className={`p-2 rounded-xl transition-all duration-300 ${scrolled ? 'bg-white/10' : 'bg-white/5 backdrop-blur-sm'}`}>
            <Car className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            Luxerra
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-12 text-sm font-bold tracking-wide uppercase text-white/70">
          <Link href="/" className="transition-all hover:text-white relative group">
            {t('nav.home')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
          </Link>
          <Link href="/cars" className="transition-all hover:text-white relative group">
            {t('nav.cars')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
          </Link>
          <Link href="/about" className="transition-all hover:text-white relative group">
            {t('nav.about')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
          </Link>
          <Link href="/contact" className="transition-all hover:text-white relative group">
            {t('nav.contact')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
          </Link>
        </nav>

        <div className="flex items-center space-x-6">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'mn' : 'en')}
            className={`hidden md:flex items-center justify-center p-2 rounded-full border transition-all
              ${scrolled ? 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}
            `}
            title={language === 'en' ? 'Switch to Mongolian' : 'Switch to English'}
          >
            <Globe className="h-5 w-5" />
          </button>

          <Link
            href="/admin"
            className="hidden md:flex items-center space-x-2 rounded-full bg-white px-7 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
          >
            <User className="h-4 w-4" />
            <span>{t('nav.admin')}</span>
          </Link>
          <button
            className="md:hidden p-2 text-white/80 hover:text-white transition-all transform active:scale-90"
            aria-label="Open menu"
            title="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-3 backdrop-blur-md md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="relative w-full max-w-sm rounded-[2.5rem] bg-neutral-900 border border-white/10 p-6 shadow-3xl overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-8">
                <button
                  className="p-2 text-white/50 hover:text-white transition-colors"
                  aria-label="Close menu"
                  title="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-8 w-8" />
                </button>
              </div>

              {/* Header Row */}
              <div className="flex items-center space-x-3 mb-10">
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">Luxerra</span>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col space-y-6 text-xl font-bold mb-8 text-white/80">
                <Link href="/cars" onClick={() => setOpen(false)} className="hover:text-white transition-all hover:translate-x-2">{t('nav.cars')}</Link>
                <Link href="/terms" onClick={() => setOpen(false)} className="hover:text-white transition-all hover:translate-x-2">{t('nav.rentalTerms')}</Link>
                <Link href="/news" onClick={() => setOpen(false)} className="hover:text-white transition-all hover:translate-x-2">{t('nav.news')}</Link>
              </nav>

              {/* Language Switcher Mobile */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'mn' : 'en')}
                className="flex items-center justify-center p-4 rounded-full border border-white/20 bg-white/10 text-white mb-6 hover:bg-white/20 transition-all"
                title={language === 'en' ? 'Switch to Mongolian' : 'Switch to English'}
              >
                <Globe className="h-6 w-6" />
              </button>

              {/* Book Now and Socials */}
              <div className="flex items-center justify-between pt-3">
                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="bg-white text-black rounded-full px-8 py-4 text-lg font-black shadow-2xl shadow-white/10 hover:bg-neutral-100 transition-all active:scale-95"
                >
                  {t('nav.bookNow')}
                </Link>
                <div className="flex items-center space-x-5 text-white/40">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white hover:scale-110 transition-all">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white hover:scale-110 transition-all">
                    <MessageCircle className="h-6 w-6" />
                  </a>
                  <a href="tel:+123456789" aria-label="Phone" className="hover:text-white hover:scale-110 transition-all">
                    <Phone className="h-6 w-6" />
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
