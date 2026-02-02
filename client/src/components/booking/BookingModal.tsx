"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Car, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Car as CarType } from "@/lib/mockData";
import { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  car: CarType;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  isLoading?: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  onConfirm,
  car,
  startDate,
  endDate,
  totalPrice,
  isLoading = false,
}: BookingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={car.images[0] || car.thumbnail_url}
                alt={car.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <p className="text-sm font-medium opacity-90">{car.brand}</p>
                <h3 className="text-2xl font-bold">{car.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Dates */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Start Date
                    </p>
                    <p className="font-bold text-gray-900">
                      {format(startDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    End Date
                  </p>
                  <p className="font-bold text-gray-900">
                    {format(endDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Rate per day</span>
                  <span>${car.price_per_day}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Duration</span>
                  <span>
                    {Math.ceil(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    Days
                  </span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-blue-600">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-200 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <CheckCircle className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
