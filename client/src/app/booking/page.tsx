"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Star,
  Users,
  Fuel,
  Gauge,
  Check,
  AlertCircle,
} from "lucide-react";
import { mockApi, Car, Booking } from "@/lib/mockData";
import {
  format,
  eachDayOfInterval,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import DateRangePicker from "@/components/ui/DateRangePicker";

// Component to handle Search Params (needed for Suspense boundary)
function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const carId = searchParams.get("carId");

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Data
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Form State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch Data
  useEffect(() => {
    if (!carId) {
      setError("No car specified");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [carData, allBookings] = await Promise.all([
          mockApi.cars.getById(carId),
          mockApi.bookings.getAll({ limit: 1000 }), // Hack to get all for filtering
        ]);

        if (carData) {
          setCar(carData);
          // Filter bookings for this car
          const carBookings = allBookings.data.filter(
            (b) =>
              b.car_id === carId && ["confirmed", "pending"].includes(b.status), // Block confirmed and pending
          );
          setExistingBookings(carBookings);
        } else {
          setError("Car not found");
        }
      } catch (err) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId]);

  // Calculate Disabled Dates
  const disabledDates = useMemo(() => {
    const dates: Date[] = [];
    existingBookings.forEach((booking) => {
      try {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        const interval = eachDayOfInterval({ start, end });
        dates.push(...interval);
      } catch (e) {
        // Handle invalid dates in mock data
      }
    });
    return dates;
  }, [existingBookings]);

  // Calculate Price
  const priceDetails = useMemo(() => {
    if (!car || !startDate || !endDate) return null;

    // Simple duration calc (inclusive or standard rental days logic)
    // Typically: Checkout - Checkin days? Or standard 24h blocks?
    // Using simple difference in days, min 1 day.
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays === 0 ? 1 : diffDays; // Minimum 1 day assumption or 0 nights?
    // Usually car rental is by day. If start==end same day, counts as 1 day?
    // Let's assume start and end are inclusive dates?
    // If I pick Jan 1 to Jan 2, is that 1 day or 2 days?
    // Usually 24h blocks. Let's assume simple days count for now.

    let rate = car.rates?.daily || car.price_per_day;
    let rateName = "Daily Rate";
    let discount = 0;

    if (days >= 30) {
      rate = car.rates?.monthly || rate * 0.7;
      rateName = "Monthly Rate";
      discount = 30; // approx %
    } else if (days >= 7) {
      rate = car.rates?.weekly || rate * 0.85;
      rateName = "Weekly Rate";
      discount = 15;
    }

    return {
      days,
      rate,
      rateName,
      discount,
      subtotal: days * car.price_per_day, // Base price logic for display?
      total: days * rate,
    };
  }, [car, startDate, endDate]);

  const handleSubmit = async () => {
    if (!car || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      await mockApi.bookings.create({
        car_id: car.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_price: priceDetails?.total || 0,
        // note: note // MockAPI doesn't store note but real app would
      });
      setSubmitSuccess(true);
      // Redirect after minor delay
      setTimeout(() => {
        router.push("/admin/bookings"); // Or user dashboard
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Failed to book");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if selected range is valid (no overlaps)
  // DateRangePicker handles valid selection logic partially, but let's ensure
  // we don't allow submitting if there's a conflict (though DatePicker prevents selecting blocked dates usually,
  // user might select A...B where A and B are free but M in middle is blocked?
  // My update to DatePicker.tsx didn't implement complex "path blocked" logic fully in `handleDateClick`
  // (I annotated "In real app, optimize this").
  // So validation here is good.
  const isSelectionValid = useMemo(() => {
    if (!startDate || !endDate) return true;
    // Check if any disabled date is within range
    return !disabledDates.some((disabledDate) =>
      isWithinInterval(disabledDate, { start: startDate, end: endDate }),
    );
  }, [startDate, endDate, disabledDates]);

  // Safe Image Logic
  const carImage = car?.thumbnail_url || car?.images?.[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center max-w-sm w-full"
        >
          <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Requested!</h2>
          <p className="text-gray-400 mb-6">
            Your request for {car?.brand} {car?.model} has been sent. We'll
            notify you once approved.
          </p>
          <div className="animate-pulse text-sm text-blue-400">
            Redirecting...
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 space-y-6"
        >
          <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-10 w-10 text-red-500 opacity-80" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Car Not Found</h1>
            <p className="text-gray-400">
              {error ||
                "We couldn't find the car you're looking for. It might have been removed or the link is invalid."}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-2xl font-bold text-lg transition-colors"
          >
            Browse Other Cars
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32 md:pb-0">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-4 md:hidden">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex-1 truncate">
          <h1 className="text-lg font-bold leading-none truncate">
            {car.brand} {car.model}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ${car.price_per_day} / day
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto md:px-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Car Summary (Sticky on Desktop) */}
          <div className="md:col-span-5 lg:col-span-4 relative">
            <div className="md:sticky md:top-24 space-y-6">
              {/* Car Image Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5"
              >
                <div className="relative aspect-[4/3] w-full bg-zinc-800">
                  {carImage ? (
                    <Image
                      src={carImage}
                      alt={car.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      <span className="text-xs uppercase font-bold tracking-widest">
                        No Image Available
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold">
                        <Star className="h-3 w-3 fill-white" /> 5.0
                      </span>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-bold ${car.status === "available" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {car.status === "available"
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold">{car.name}</h2>
                  </div>
                </div>

                {/* Specs */}
                <div className="p-4 grid grid-cols-3 gap-2 border-t border-white/5">
                  <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-2xl">
                    <Users className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-300">
                      {car.seats} Seats
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-2xl">
                    <Gauge className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-300">
                      {car.transmission}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-2xl">
                    <Fuel className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-300">
                      {car.fuel_type}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Rates Card */}
              <div className="bg-zinc-900/30 rounded-3xl p-6 border border-white/5 hidden md:block">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Rental Rates
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily (1-6 days)</span>
                    <span className="font-bold text-white">
                      ${car.rates?.daily || car.price_per_day}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Weekly (7+ days)</span>
                    <span className="font-bold text-white">
                      $
                      {car.rates?.weekly ||
                        Math.floor(car.price_per_day * 0.85)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Monthly (30+ days)</span>
                    <span className="font-bold text-white">
                      $
                      {car.rates?.monthly ||
                        Math.floor(car.price_per_day * 0.7)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Form */}
          <div className="md:col-span-7 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black md:bg-zinc-900/20 md:backdrop-blur-sm md:rounded-[40px] md:p-8 md:border md:border-white/5"
            >
              <h2 className="text-2xl font-bold mb-6 hidden md:block">
                Complete Reservation
              </h2>

              {/* Form */}
              <div className="flex flex-col gap-6 px-4 md:px-0">
                {/* Calendar Validator Alert */}
                {!isSelectionValid && startDate && endDate && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Selected range includes already booked dates. Please
                      choose different dates.
                    </p>
                  </div>
                )}

                {/* Calendar */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    Select Dates
                  </label>
                  <div className="bg-zinc-900 border border-white/10 rounded-3xl p-1 overflow-hidden">
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(s, e) => {
                        setStartDate(s);
                        setEndDate(e);
                      }}
                      disabledDates={disabledDates}
                      theme="dark"
                      inline={true}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Any special requests? (e.g. child seat, airport pickup)"
                      className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Sticky Footer Action / Desktop Action */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-white/10 md:relative md:bg-transparent md:border-0 md:p-0 md:mt-8 z-50">
                <div className="flex flex-col gap-4">
                  {priceDetails ? (
                    <div className="space-y-1 pb-2 md:pb-0">
                      <div className="flex justify-between items-center text-sm md:text-base text-gray-400">
                        <span>
                          {priceDetails.rateName} (${priceDetails.rate} x{" "}
                          {priceDetails.days} days)
                        </span>
                        <span>${priceDetails.total}</span>
                      </div>
                      {priceDetails.discount > 0 && (
                        <div className="flex justify-between items-center text-xs text-green-400">
                          <span>Applied Discount</span>
                          <span>{priceDetails.discount}% OFF</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-2">
                        <span className="text-lg font-bold text-white">
                          Total
                        </span>
                        <span className="text-2xl font-black text-blue-500">
                          ${priceDetails.total}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-gray-500 text-sm italic py-2">
                      Select dates to see price
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={
                      !priceDetails || !isSelectionValid || isSubmitting
                    }
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
