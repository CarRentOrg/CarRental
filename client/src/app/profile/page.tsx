"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import BookingCard from "@/components/booking/BookingCard";
import BookingDetailModal from "@/components/booking/BookingDetailModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

import {
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Clock,
  Car,
  Shield,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, bookings, loadingBookings } = useApp();
  const { token, logout, setShowLogin } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Guest view
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        {/* Guest content */}
        <div className="text-center mt-24">
          <div className="h-32 w-32 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-6">
            <User className="h-16 w-16 text-zinc-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome, Guest</h1>
          <p className="text-zinc-400 mb-6">
            Please login to view your profile and bookings.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Logged-in user view
  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: Calendar },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: Star,
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: Clock,
    },
    {
      label: "Active",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: Car,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 relative">
      {/* Header-like Logout */}
      <div className="fixed top-0 left-0 right-0 flex justify-end p-4 z-50">
        <button
          onClick={logout}
          className="px-6 py-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-12">
        {/* User info */}
        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-8 mb-12">
          <div className="text-center md:text-left space-y-2">
            <div className="text-3xl md:text-5xl font-black tracking-tight">
              {user.name}
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-zinc-400 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {user.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-snap-x selection:bg-none">
          <div className="flex md:grid md:grid-cols-4 gap-4 min-w-max md:min-w-full">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-40 md:w-full scroll-snap-align-start shrink-0 bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] space-y-4 hover:bg-zinc-800 transition-colors"
              >
                <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bookings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">My Bookings</h2>
            <div className="h-px flex-1 bg-white/5 ml-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingBookings ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-zinc-900/50 rounded-3xl animate-pulse"
                />
              ))
            ) : bookings.length > 0 ? (
              bookings.map((b) => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  onClick={setSelectedBooking}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-10 w-10 text-zinc-600" />
                </div>
                <p className="text-zinc-500 font-medium text-lg">
                  You haven't made any bookings yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
