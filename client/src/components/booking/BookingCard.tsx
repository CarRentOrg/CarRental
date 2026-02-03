"use client";

import Image from "next/image";
import { Calendar, DollarSign, Clock } from "lucide-react";
import { Booking } from "@/types";
import { format } from "date-fns";

interface BookingCardProps {
  booking: Booking;
  onClick: (booking: Booking) => void;
}

const BookingCard = ({ booking, onClick }: BookingCardProps) => {
  const car = booking.car;
  if (!car) return null;

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    default: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };


  return (
    <div
      onClick={() => onClick(booking)}
      className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl p-4 sm:p-6 hover:bg-zinc-800/50 transition-all cursor-pointer overflow-hidden"
    >
      <div className="flex items-center gap-4">
        {/* Car Thumbnail */}
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-zinc-800 shrink-0">
          <Image
            src={car.thumbnail_url || car.image_url}
            alt={`${car.brand} ${car.model}`}
            width={96}
            height={96}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-lg text-white truncate">
              {car.brand} {car.model}
            </h3>
            <span
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${statusColors[booking.status] || statusColors.default}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(new Date(booking.start_date), "MMM d")} -{" "}
                {format(new Date(booking.end_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="font-medium text-white">
                ₮{booking.total_price.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500">
                ({booking.rate_applied} rate)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
