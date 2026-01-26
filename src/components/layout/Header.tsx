"use client";

import Link from 'next/link';
import { Car, Search, Menu, User, X, Instagram, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-transparent backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-gray-500" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Car<span className="text-gray-500">Rent</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-secondary-foreground">
          <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
          <Link href="/cars" className="transition-colors hover:text-blue-600">Browse Cars</Link>
          <Link href="/about" className="transition-colors hover:text-blue-600">About Us</Link>
          <Link href="/contact" className="transition-colors hover:text-blue-600">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 text-secondary-foreground focus:text-white md:hidden"
            aria-label="Search"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/admin"
            className="hidden md:flex items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
          >
            <User className="h-4 w-4" />
            <span>Admin</span>
          </Link>
          <button
            className="p-2 text-secondary-foreground focus:text-white md:hidden"
            aria-label="Open menu"
            title="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="m-6 rounded-3xl w-[90vw] max-w-md h-auto bg-neutral-900 text-white shadow-xl p-8 flex flex-col"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  {/* Replace with your logo/image if needed */}
                  <div className="bg-neutral-800 rounded-xl p-2">
                    <Car className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-2xl font-semibold">Luxerra</span>
                </div>
                <button
                  className="p-2"
                  aria-label="Close menu"
                  title="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
              {/* Nav Links */}
              <nav className="flex flex-col space-y-6 text-xl font-medium mb-8">
                <Link href="/cars" onClick={() => setOpen(false)} className="hover:text-blue-400">Cars</Link>
                <Link href="/terms" onClick={() => setOpen(false)} className="hover:text-blue-400">Rental Terms</Link>
                <Link href="/news" onClick={() => setOpen(false)} className="hover:text-blue-400">News</Link>
              </nav>
              {/* Book Now and Socials */}
              <div className="flex items-center space-x-6 mt-auto">
                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="bg-white text-black rounded-full px-8 py-4 text-lg font-medium shadow hover:bg-gray-200 transition"
                >
                  Book Now
                </Link>
                <div className="flex items-center space-x-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-7 w-7" />
                  </a>
                  <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <MessageCircle className="h-7 w-7" />
                  </a>
                  <a href="tel:+123456789" aria-label="Phone">
                    <Phone className="h-7 w-7" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
