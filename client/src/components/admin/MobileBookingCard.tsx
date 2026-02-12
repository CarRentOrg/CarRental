"use client";

import React from "react";
import {
  Calendar,
  User as UserIcon,
  MapPin,
  DollarSign,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import { User, Car, Booking } from "@/types";

interface MobileBookingCardProps {
  booking: Booking;
  onView: (booking: Booking) => void;
  onApprove: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
  onComplete: (booking: Booking) => void;
}

export default function MobileBookingCard({
  booking,
  onView,
  onApprove,
  onReject,
  onComplete,
}: MobileBookingCardProps) {
  const statusColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    completed: "bg-blue-50 text-blue-700 border-blue-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4 space-y-4"
    >
      {/* Header: ID + Status */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Захиалга
          </span>
          <span className="text-sm font-black text-gray-900">
            #{booking._id.substring(0, 8)}
          </span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[booking.status as keyof typeof statusColors] || "bg-gray-50 text-gray-500"}`}
        >
          {booking.status}
        </span>
      </div>

      {/* Car Info */}
      <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
        <div className="h-12 w-20 rounded-lg bg-white overflow-hidden border border-gray-200 shadow-sm shrink-0">
          {booking.car?.thumbnail?.url ? (
            <img
              src={booking.car?.thumbnail?.url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <MapPin className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-gray-900 truncate">
            {booking.car?.brand} {booking.car?.model}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            Машины ID: {booking.car?._id || "N/A"}
          </span>
        </div>
      </div>

      {/* User + Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <UserIcon className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Хэрэглэгч
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 truncate">
              {booking.user?.name || "Unknown"}
            </span>
            <span className="text-[10px] text-gray-500 truncate">
              {booking.user?.email}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-1.5 text-gray-400">
            <DollarSign className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Төлбөр
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-blue-600">
              ${booking.totalPrice?.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              Буцаан олголтгүй
            </span>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/30">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-600/70 font-bold uppercase leading-none mb-0.5">
              Авах
            </span>
            <span className="text-xs font-bold text-blue-900">
              {new Date(booking.startDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="h-px w-8 bg-blue-200" />
        <div className="flex items-center gap-2 text-right">
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-600/70 font-bold uppercase leading-none mb-0.5">
              Өгөх
            </span>
            <span className="text-xs font-bold text-blue-900">
              {new Date(booking.endDate).toLocaleDateString()}
            </span>
          </div>
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-50">
        <button
          onClick={() => onView(booking)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[11px] font-bold hover:bg-gray-100 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          Харах
        </button>

        {booking.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(booking)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Зөвшөөрөх
            </button>
            <button
              onClick={() => onReject(booking)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold hover:bg-red-100 transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              Татгалзах
            </button>
          </>
        )}
        {booking.status === "confirmed" && (
          <button
            onClick={() => onComplete(booking)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl text-[11px] font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Дуусгах
          </button>
        )}
      </div>
    </motion.div>
  );
}
