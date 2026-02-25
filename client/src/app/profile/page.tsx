"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useOwnerAuth } from "@/contexts/OwnerAuthContext";
import { useRouter } from "next/navigation";

import BookingCard from "@/components/booking/BookingCard";
import BookingDetailModal from "@/components/booking/BookingDetailModal";
import OTPModal from "@/components/auth/OTPModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Star,
  Clock,
  Car,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { bookings, loadingBookings, fetchMyBookings } = useApp();
  const { user, logout: userLogout } = useUserAuth();
  const { owner, logout: ownerLogout } = useOwnerAuth();

  const [mounted, setMounted] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showOTP, setShowOTP] = useState(false);

  const { isLoading: authLoading } = useUserAuth();

  useEffect(() => {
    setMounted(true);
    if (owner) {
      router.push("/admin/profile");
    } else if (!user && mounted && !authLoading) {
      setShowOTP(true);
    }
  }, [user, owner, router, mounted, authLoading]);

  // Refetch bookings on mount and when tab regains focus
  useEffect(() => {
    if (!user) return;

    fetchMyBookings(true);

    const handleFocus = () => fetchMyBookings(true);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchMyBookings(true);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user, fetchMyBookings]);

  // 1. Initial mounting loader
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-bold animate-pulse">
            Уншиж байна...
          </p>
        </div>
      </div>
    );
  }

  // 2. Redirect for owners
  if (owner) return null;

  // 3. Data fetching loader for authenticated users
  if (user && loadingBookings) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-bold animate-pulse">
            Захиалгын түүх уншиж байна...
          </p>
        </div>
      </div>
    );
  }

  // 4. Hide content if no user (OTP will be shown below via AnimatePresence)
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        {!showOTP && (
          <div className="text-center space-y-6">
            <div className="h-20 w-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <UserIcon className="h-10 w-10 text-zinc-600" />
            </div>
            <h2 className="text-3xl font-black">Нэвтрэх шаардлагатай</h2>
            <p className="text-zinc-500 max-w-sm mx-auto">
              Та өөрийн захиалгын түүхийг харахын тулд баталгаажуулна уу.
            </p>
            <button
              onClick={() => setShowOTP(true)}
              className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
            >
              Баталгаажуулах
            </button>
          </div>
        )}

        <AnimatePresence>
          {showOTP && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="w-full max-w-md">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black mb-2">Миний захиалга</h2>
                  <p className="text-zinc-500">
                    Захиалгаа харахын тулд баталгаажуулна уу
                  </p>
                </div>
                <OTPModal
                  isOpen={true}
                  onClose={() => setShowOTP(false)}
                  onSuccess={() => {
                    setShowOTP(false);
                  }}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const displayName = user?.name || "User";
  const displayEmail = user?.email;
  const displayPhone = user?.phone;
  const myBookings = bookings;

  const stats = [
    { label: "Нийт захиалга", value: myBookings.length, icon: Calendar },
    {
      label: "Баталгаажсан",
      value: myBookings.filter((b) => b.status === "confirmed").length,
      icon: Car,
    },
    {
      label: "Хүлээгдэж буй",
      value: myBookings.filter((b) => b.status === "pending").length,
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header content... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-black/20">
              <span className="text-3xl font-black">
                {displayName[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {displayName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-400 mt-1">
                {displayEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {displayEmail}
                  </span>
                )}
                {displayPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> {displayPhone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => userLogout()}
            className="group flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-red-500/10 hover:text-red-500 text-zinc-400 font-bold rounded-2xl transition-all border border-zinc-800 hover:border-red-500/20"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Гарах</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-6 rounded-4xl hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-2xl">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-black">{stat.value}</span>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Сүүлийн захиалгууд</h2>
            {myBookings.length > 0 && (
              <span className="text-sm font-bold text-zinc-500">
                Нийт {myBookings.length}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myBookings.length > 0 ? (
              myBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onClick={setSelectedBooking}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center border border-dashed border-zinc-800 rounded-4xl">
                <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Захиалга алга</h3>
                <p className="text-zinc-500 mb-6">
                  Та одоогоор ямар нэгэн захиалга хийгээгүй байна.
                </p>
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors"
                >
                  Машин хайх <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
