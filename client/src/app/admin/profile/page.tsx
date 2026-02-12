"use client";

import ProfileForm from "@/components/admin/ProfileForm";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPendingBookings = async () => {
    try {
      const res = await api.owner.bookings.getAll();
      const all = res.data || [];
      setPendingBookings(all.filter((b) => b.status === "pending"));
      setConfirmedBookings(all.filter((b) => b.status === "confirmed"));
    } catch (err) {
      console.error("Failed to load pending bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingBookings();
  }, []);

  const handleAction = async (
    id: string,
    action: "approve" | "reject" | "complete",
  ) => {
    try {
      if (action === "approve") await api.bookings.approve(id);
      else if (action === "reject") await api.bookings.reject(id);
      else if (action === "complete") await api.bookings.complete(id);

      toast.success(`Booking ${action}ed successfully`);
      loadPendingBookings();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} booking`);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Owner Dashboard
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Manage your profile and pending bookings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Profile Settings
            </h2>
            <ProfileForm />
          </div>
        </div>

        {/* Pending Bookings Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Clock className="h-6 w-6 text-orange-500" />
              Pending Actions
              {pendingBookings.length > 0 && (
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-black">
                  {pendingBookings.length}
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking, i) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                              Booking ID
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              #{booking._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Customer
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {(booking as any).user?.name ||
                                (booking as any).userSnapshot?.name ||
                                "Guest"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Total
                            </p>
                            <p className="text-sm font-black text-blue-600">
                              {booking.totalPrice.toLocaleString()}₮
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => handleAction(booking._id, "reject")}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          title="Reject"
                        >
                          <XCircle className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => handleAction(booking._id, "approve")}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200"
                >
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    All caught up!
                  </h3>
                  <p className="text-gray-500">
                    No pending bookings to review.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Confirmed Bookings Column */}
        <div className="lg:col-span-2 lg:col-start-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Current Rentals
              {confirmedBookings.length > 0 && (
                <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-black">
                  {confirmedBookings.length}
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {confirmedBookings.length > 0 ? (
                confirmedBookings.map((booking, i) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                              Booking ID
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              #{booking._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Customer
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {(booking as any).user?.name ||
                                (booking as any).userSnapshot?.name ||
                                "Guest"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Status
                            </p>
                            <p className="text-sm font-bold text-green-600 uppercase">
                              {booking.status}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => handleAction(booking._id, "complete")}
                          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center bg-gray-50/50 rounded-4xl border border-dashed border-gray-100 italic text-gray-400 text-sm">
                  No active rentals in progress.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
