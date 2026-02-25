"use client";

import { Booking } from "@/types";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";

interface MobileBookingCardProps {
  booking: Booking;
  onView: (booking: Booking) => void;
  onApprove: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
  onComplete?: (booking: Booking) => void;
}

export default function MobileBookingCard({
  booking,
  onView,
  onApprove,
  onReject,
  onComplete,
}: MobileBookingCardProps) {
  const statusColors = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
    completed: "bg-blue-50 text-blue-600 border-blue-100",
  };

  const status = (booking.status || "pending") as keyof typeof statusColors;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="h-12 w-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
            <img
              src={booking.car?.thumbnail?.url || "/placeholder.jpg"}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 leading-tight">
              {booking.car?.brand} {booking.car?.model}
            </h4>
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border inline-block mt-1 ${
                statusColors[status] || statusColors.pending
              }`}
            >
              {status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-blue-600">
            ${booking.totalPrice?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2 bg-gray-50 rounded-lg">
          <p className="text-gray-400 font-bold uppercase text-[9px]">
            Pick-up
          </p>
          <p className="font-semibold text-gray-900 mt-0.5">
            {format(new Date(booking.startDate), "MMM dd, HH:mm")}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg text-right">
          <p className="text-gray-400 font-bold uppercase text-[9px]">
            Drop-off
          </p>
          <p className="font-semibold text-gray-900 mt-0.5">
            {format(new Date(booking.endDate), "MMM dd, HH:mm")}
          </p>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
          {(booking.user?.name || "G").charAt(0)}
        </div>
        <span className="text-xs font-bold text-gray-700">
          {booking.user?.name || "Guest User"}
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => onView(booking)}
          className="col-span-1 flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 font-bold text-xs border border-gray-100"
        >
          <Eye className="h-4 w-4" />
        </button>

        {status === "pending" ? (
          <>
            <button
              onClick={() => onApprove(booking)}
              className="col-span-2 flex items-center justify-center gap-1 p-2 bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-100"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve
            </button>
            <button
              onClick={() => onReject(booking)}
              className="col-span-1 flex items-center justify-center p-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs border border-red-100"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </>
        ) : status === "confirmed" && onComplete ? (
          <button
            onClick={() => onComplete(booking)}
            className="col-span-3 flex items-center justify-center gap-1 p-2 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-100"
          >
            <CheckCircle2 className="h-4 w-4" /> Mark Complete
          </button>
        ) : (
          <div className="col-span-3" />
        )}
      </div>
    </div>
  );
}
