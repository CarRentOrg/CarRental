"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  Info,
  AlertCircle,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useApp } from "@/contexts/AppContext";
import ConfirmModal from "../shared/ConfirmModal";
import { api } from "@/lib/api";
import { Booking } from "@/types";

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

const BookingDetailModal = ({ booking, onClose }: BookingDetailModalProps) => {
  const { fetchMyBookings } = useApp();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  if (!booking) return null;

  const car = booking.car;
  const days =
    differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) ||
    1;

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  const handleCancelConfirm = async () => {
    setShowConfirmCancel(false);
    setIsCancelling(true);
    try {
      await api.bookings.reject(booking._id);
      await fetchMyBookings();
      onClose();
    } catch (error) {
      alert("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <AnimatePresence mode="wait">
      <div
        key="booking-detail-modal"
        className="fixed inset-0 z-100 flex items-end sm:items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          key="booking-detail-content"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/50 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header Image */}
          <div className="relative h-48 sm:h-56 bg-zinc-800">
            {car?.thumbnail?.url && (
              <Image
                src={car.thumbnail.url}
                alt={car.model}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${statusColors[booking.status as keyof typeof statusColors]}`}
              >
                {booking.status}
              </div>
              <h2 className="text-2xl font-black text-white">
                {car?.brand} {car?.model}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                  Pickup
                </span>
                <p className="font-bold text-white">
                  {format(new Date(booking.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                  Return
                </span>
                <p className="font-bold text-white">
                  {format(new Date(booking.endDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Info className="h-3 w-3" /> Price Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Duration</span>
                  <span className="font-medium text-white">{days} Days</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Rate Applied</span>
                  <span className="font-medium text-white capitalize">
                    {booking.rateApplied}
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-blue-500">
                    ${booking.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {booking.status === "pending" && (
                <button
                  onClick={handleCancelClick}
                  disabled={isCancelling}
                  className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      Cancel Booking
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-4 bg-white/5 text-white/50 hover:text-white rounded-2xl font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <ConfirmModal
        key="confirm-cancel-modal"
        isOpen={showConfirmCancel}
        onClose={() => setShowConfirmCancel(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        type="danger"
        isLoading={isCancelling}
      />
    </AnimatePresence>
  );
};

export default BookingDetailModal;
