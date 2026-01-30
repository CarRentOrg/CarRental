"use client";

import {
  Bell,
  User,
  Car,
  ExternalLink,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTopHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Close dropdowns on click outside
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      {/* Left: Logo */}
      <div className="flex items-center">
        {/* <Link href="/admin" className="flex items-center space-x-2 lg:hidden">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-gray-900">
            Admin
          </span>
        </Link> */}
        <div className="hidden lg:block text-sm font-medium text-gray-500">
          Welcome back, <span className="text-gray-900 font-bold">Admin</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden md:inline">Visit Website</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">
                    Notifications
                  </span>
                  <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    >
                      <p className="text-sm text-gray-700 leading-snug">
                        <span className="font-bold">New Booking</span> from John
                        Doe for Tesla Model S.
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase">
                        2 hours ago
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 text-center">
                  <button className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-gray-100 mx-1"></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-3 group outline-none"
          >
            <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-105 transition-all">
              <User className="h-5 w-5" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-black text-gray-900 leading-none">
                Super Admin
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Management
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-50 whitespace-nowrap"
              >
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-900">John Doe</p>
                  <p className="text-[10px] font-medium text-gray-400 truncate">
                    admin@carrental.com
                  </p>
                </div>
                <div className="p-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span>Account Settings</span>
                  </Link>
                </div>
                <div className="p-1 border-t border-gray-50 mt-1">
                  <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
