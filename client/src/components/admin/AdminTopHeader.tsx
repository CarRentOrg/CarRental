"use client";

import { useOwnerAuth } from "@/contexts/OwnerAuthContext";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminTopHeaderProps {
  onMenuClick: () => void;
}

export default function AdminTopHeader({ onMenuClick }: AdminTopHeaderProps) {
  const { user, logout } = useOwnerAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar (Optional placeholder) */}
        <div className="hidden md:flex flex-1 max-w-sm">
          {/* Add global search here if needed later */}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Сайт руу очих</span>
          </Link>

          {/* Notifications */}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl transition-all border border-transparent ${
                isProfileOpen
                  ? "bg-gray-50 border-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-100">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-gray-900 leading-none">
                  {user?.name || "Admin"}
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                  удирдлага
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 origin-top-right focus:outline-none"
                >
                  <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <Link
                      href="/admin/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Профайл
                    </Link>
                  </div>

                  <div className="p-1.5 border-t border-gray-100 mt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Гарах
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
