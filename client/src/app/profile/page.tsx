"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Star, Clock, Car } from "lucide-react";
import BookingCard from "@/components/booking/BookingCard";
import BookingDetailModal from "@/components/booking/BookingDetailModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import { Booking } from "@/types";
import { Shield, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { user, bookings, loadingBookings } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!user) return null;

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
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-12">
        {/* Mobile-First Header */}
        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-8 mb-12">
          {/* Avatar */}
          <div className="relative group mb-6 md:mb-0">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white/10 p-1 group-hover:border-blue-500 transition-colors">
              <Image
                src={
                  user.avatar_url ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
                }
                alt={user.full_name || "User"}
                width={128}
                height={128}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center border-4 border-black">
              <Star className="h-4 w-4 text-white fill-white" />
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left space-y-2">
            <div className="text-3xl md:text-5xl font-black tracking-tight">
              {user.full_name}
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-zinc-400 font-medium">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats - Horizontal Scroll on Mobile, Grid on Desktop */}
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

        {/* Account Security Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Account Security</h2>
            <div className="h-px flex-1 bg-white/5 ml-6" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-blue-500/10 rounded-4xl flex items-center justify-center shrink-0">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Password & Security
                </h3>
                <p className="text-zinc-500 text-sm">
                  Update your password to keep your account safe.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/5 text-white hover:bg-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group"
            >
              Change Password
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Bookings List */}
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
              bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={(b) => setSelectedBooking(b)}
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

      {/* Detail Modal */}
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
