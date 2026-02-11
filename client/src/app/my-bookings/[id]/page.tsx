"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import {
  Calendar,
  Clock,
  Info,
  AlertCircle,
  ChevronLeft,
  X,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import { useApp } from "@/contexts/AppContext";
import Returnbutton from "@/components/shared/returnbutton";
import toast from "react-hot-toast";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { fetchMyBookings } = useApp();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await api.bookings.getById(id);
        if (data) {
          setBooking(data);
        } else {
          toast.error("Booking not found");
          router.push("/profile");
        }
      } catch (error) {
        console.error("Failed to fetch booking", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id, router]);

  const handleCancelBooking = async () => {
    if (!booking || !confirm("Are you sure you want to cancel this booking?"))
      return;

    setIsCancelling(true);
    try {
      await api.bookings.reject(booking._id);
      toast.success("Booking cancelled");
      await fetchMyBookings();
      // Refresh local data
      const updated = await api.bookings.getById(id);
      setBooking(updated);
    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) return null;

  const car = booking.car;
  const days =
    differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) ||
    1;

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Returnbutton
            text="Back to My Bookings"
            onClick={() => router.push("/profile")}
          />
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden">
          {/* Header Image */}
          <div className="relative h-48 sm:h-64 bg-zinc-800">
            {car?.thumbnail?.url ? (
              <Image
                src={car.thumbnail.url}
                alt={car.model}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${statusColors[booking.status as keyof typeof statusColors]}`}
              >
                {booking.status}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {car?.brand} {car?.model}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* ID and Date */}
            <div className="flex flex-col sm:flex-row justify-between text-zinc-400 text-sm gap-2">
              <span>
                Booking ID:{" "}
                <span className="text-white font-mono">{booking._id}</span>
              </span>
              <span>
                Created:{" "}
                {new Date(booking.createdAt || "").toLocaleDateString()}
              </span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 rounded-2xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Pickup
                </span>
                <p className="font-bold text-white text-lg">
                  {format(new Date(booking.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Return
                </span>
                <p className="font-bold text-white text-lg">
                  {format(new Date(booking.endDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Info className="h-3 w-3" /> Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Duration</span>
                  <span className="font-medium text-white">{days} Days</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Rate Type</span>
                  <span className="font-medium text-white capitalize">
                    {booking.rateApplied || "Standard"}
                  </span>
                </div>
                {booking.note && (
                  <div className="flex flex-col gap-1 text-zinc-400">
                    <span>Note:</span>
                    <span className="text-white bg-zinc-800 p-3 rounded-lg text-sm italic">
                      "{booking.note}"
                    </span>
                  </div>
                )}

                <div className="h-px bg-white/5 my-2" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-blue-500">
                    ${booking.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {booking.status === "pending" && (
              <div className="pt-6">
                <button
                  onClick={handleCancelBooking}
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
                <p className="text-center text-zinc-500 text-xs mt-4">
                  You can cancel your booking while it is still pending.
                </p>
              </div>
            )}

            {booking.status === "confirmed" && (
              <div className="pt-6">
                <div className="w-full py-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-default">
                  <Check className="h-5 w-5" />
                  Booking Confirmed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
