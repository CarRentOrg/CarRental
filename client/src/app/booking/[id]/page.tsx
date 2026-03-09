"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Users, Fuel, Gauge, Check, AlertCircle } from "lucide-react";
import {
  eachDayOfInterval,
  isWithinInterval,
  differenceInCalendarDays,
  isSameDay,
} from "date-fns";
import { useApp } from "@/contexts/AppContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import DateRangePicker from "@/components/ui/DateRangePicker";
import TimePicker from "@/components/ui/TimePicker";
import Returnbutton from "@/components/shared/returnbutton";
import { api } from "@/lib/api";
import { Car, Booking } from "@/types";
import { showToast } from "@/lib/toast";

// Modals
import PaymentModal from "@/components/booking/PaymentModal";
import { formatCurrency } from "@/lib/utils";
import OTPModal from "@/components/auth/OTPModal";
import { useLanguage } from "@/contexts/LanguageContext";

function BookingContent() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;
  const { getCarById } = useApp();
  const { user } = useUserAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Data
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Form State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("18:00");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Driver option
  const [withDriver, setWithDriver] = useState(false);

  // Modal States
  const [showPayment, setShowPayment] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  // Fetch Data
  useEffect(() => {
    if (!carId) {
      setError("No car specified");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const carData = await getCarById(carId);
        if (!carData) {
          setError("Car not found");
          return;
        }
        setCar(carData);

        // Fetch bookings using the new dedicated availability endpoint
        const filteredBookings = await api.bookings.getForCar(carId);
        setExistingBookings(filteredBookings);
      } catch (err) {
        setError("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId, getCarById]);

  // Calculate Disabled Dates
  const disabledDates = useMemo(() => {
    const dates: Date[] = [];
    existingBookings.forEach((booking) => {
      try {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const interval = eachDayOfInterval({ start, end });
        dates.push(...interval);
      } catch (e) {}
    });
    return dates;
  }, [existingBookings]);

  // Calculate Price
  const priceDetails = useMemo(() => {
    if (!car || !startDate || !endDate) return null;

    const days = Math.max(1, differenceInCalendarDays(endDate, startDate) + 1);

    const dailyRate = car.price_per_day || 0;
    const driverFeePerDay = car.driver_fee || 0;
    const depositAmount = car.deposit_amount || 0;

    let rate: number = dailyRate;
    let rateName = "Daily Rate";
    let discount = 0;

    // Simplified rate discount since price_rates is removed
    if (days >= 30) {
      rate = dailyRate * 0.7; // Example monthly discount
      rateName = "Monthly Rate";
      discount = 30;
    } else if (days >= 7) {
      rate = dailyRate * 0.85; // Example weekly discount
      rateName = "Weekly Rate";
      discount = 15;
    }

    const rentalTotal = days * rate;
    const totalDriverFee = withDriver ? driverFeePerDay * days : 0;

    return {
      days,
      rate,
      rateName,
      discount,
      subtotal: days * dailyRate,
      total: rentalTotal,
      driverFeePerDay,
      totalDriverFee,
      depositAmount,
      grandTotal: rentalTotal + totalDriverFee,
    };
  }, [car, startDate, endDate, withDriver]);

  const isSelectionValid = useMemo(() => {
    if (!startDate || !endDate) return true;
    return !disabledDates.some((disabledDate) =>
      isWithinInterval(disabledDate, { start: startDate, end: endDate }),
    );
  }, [startDate, endDate, disabledDates]);

  const isTimeValid = useMemo(() => {
    if (!startDate || !endDate) return true;
    if (isSameDay(startDate, endDate)) {
      const [startH, startM] = startTime.split(":").map(Number);
      const [endH, endM] = endTime.split(":").map(Number);
      const startTotal = (startH || 0) * 60 + (startM || 0);
      const endTotal = (endH || 0) * 60 + (endM || 0);
      return endTotal > startTotal;
    }
    return true;
  }, [startDate, endDate, startTime, endTime]);

  // --- HANDLERS ---

  const [draftBooking, setDraftBooking] = useState<Booking | null>(null);

  // ... (existing code)

  const initiateDraftBooking = async () => {
    if (!car || !startDate || !endDate) return;

    setIsSubmitting(true);

    try {
      const payload: any = {
        carId: car._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startTime,
        endTime,
        totalPrice: priceDetails?.total || 0,
        note,
        withDriver,
        driverFee: priceDetails?.totalDriverFee || 0,
        depositAmount: priceDetails?.depositAmount || 0,
      };

      let res;
      if (draftBooking) {
        // Update existing draft if the user closed the modal and retried or changed dates
        res = await api.bookings.updateDraft(draftBooking._id, payload);
      } else {
        // Create new draft
        res = await api.bookings.init(payload);
      }

      setDraftBooking(res);
      setShowPayment(true);
    } catch (err: any) {
      showToast.error(err.message || "Failed to reserve car");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookClick = async () => {
    if (!startDate || !endDate) return showToast.error("Select dates first");
    if (!isSelectionValid) return showToast.error("Dates not available");
    if (!isTimeValid)
      return showToast.error("Please select a valid booking time");

    // Server-side availability check before proceeding
    setIsSubmitting(true);
    try {
      const res = await api.bookings.checkAvailability({
        carId: car!._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startTime,
        endTime,
      });

      if (!res.available) {
        showToast.error("Car is not available for selected dates");
        // Refresh bookings to show new blockages
        const updatedBookings = await api.bookings.getForCar(car!._id);
        setExistingBookings(updatedBookings);
        return;
      }

      // Proceed if available
      if (user) {
        initiateDraftBooking();
      } else {
        setShowOTP(true);
      }
    } catch (error) {
      showToast.error("Failed to check availability");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    // Robust check: Use draftBooking state
    if (!draftBooking?._id) {
      showToast.error("No active reservation found. Please try again.");
      return;
    }

    setShowPayment(false);
    setIsSubmitting(true);

    try {
      await api.bookings.confirm({
        bookingId: draftBooking._id,
        paymentId,
      });

      setSubmitSuccess(true);
      showToast.success("Booking confirmed!");

      setTimeout(() => {
        router.push(`/profile`); // Redirect to profile
      }, 2000);
    } catch (err: any) {
      showToast.error(err.message || "Confirmation failed");
      setIsSubmitting(false);
    }
  };

  const image: string | null = car?.thumbnail?.url ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 bg-black">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center max-w-sm w-full"
        >
          <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Захиалга бүртгэгдлээ!</h2>
          <p className="text-gray-400 mb-6">
            Бид тун удахгүй тантай холбогдох болно.
          </p>
          <div className="animate-pulse text-sm text-blue-400">
            Redirecting to profile...
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !car) {
    return <div>Error loading car</div>; // Simplify for brevity
  }

  return (
    <div className="min-h-screen bg-black text-white py-26 px-3 sm:px-12 mx-auto">
      {/* ... (Keep existing layout code) ... */}

      {/* Mobile Sticky Header */}
      <div className="lg:px-12">
        <Returnbutton text="Back to Car" onClick={() => router.back()} />
      </div>

      {/* ... (Rest of existing UI is fine, mainly just the bottom action logic changed) ... */}

      <main className="max-w-7xl mx-auto md:px-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Car Summary (Same as before) */}
          <div className="md:col-span-5 lg:col-span-4 relative">
            <div className="md:sticky md:top-24 space-y-6">
              {/* Car Image Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5"
              >
                <div className="relative aspect-4/3 w-full bg-zinc-800">
                  {image ? (
                    <Image
                      src={image}
                      alt={car.model}
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold">
                        <Star className="h-3 w-3 fill-white" /> 5.0
                      </span>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-bold ${car.is_available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {car.is_available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold">
                      {car.brand} {car.model}
                    </h2>
                  </div>
                </div>

                {/* Specs */}
                <div className="p-4 grid grid-cols-3 gap-2 border-t border-white/5">
                  <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-2xl">
                    <Users className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-300">
                      {car.seats} {t("cars.seats")}
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
              <div className="bg-zinc-900/30 rounded-3xl p-6 border border-white/5 block">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {t("cars.rentalRates")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t("booking.daily")}</span>
                    <span className="font-bold text-white">
                      {t("common.currency_symbol")}
                      {car.price_per_day}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>{t("booking.weekly")}</span>
                    <span className="font-bold text-white">
                      {t("common.currency_symbol")}
                      {car.price_per_day ? car.price_per_day * 7 : 0}
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

                {!isTimeValid && startDate && endDate && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3 text-orange-400">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Return time must be after pickup time for same-day
                      bookings.
                    </p>
                  </div>
                )}

                {/* Calendar */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    {t("booking.selectDates")}
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

                  {/* Time Pickers */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <TimePicker
                      label="booking.pickupTime"
                      value={startTime}
                      onChange={setStartTime}
                    />
                    <TimePicker
                      label="booking.returnTime"
                      value={endTime}
                      onChange={setEndTime}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Driver Option Toggle */}
                  {car.driver_fee && car.driver_fee > 0 ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                        {t("booking.driverOption")}
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setWithDriver(false)}
                          className={`flex-1 py-3 px-4 rounded-2xl border font-bold text-sm transition-all ${
                            !withDriver
                              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                              : "bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20"
                          }`}
                        >
                          🚗 {t("booking.withoutDriver")}
                        </button>
                        <button
                          onClick={() => setWithDriver(true)}
                          className={`flex-1 py-3 px-4 rounded-2xl border font-bold text-sm transition-all ${
                            withDriver
                              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                              : "bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20"
                          }`}
                        >
                          👨‍✈️ {t("booking.withDriver")} (+₮
                          {formatCurrency(car.driver_fee)})
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                      {t("booking.additionalNotes")}
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
                          {priceDetails.rateName} (₮
                          {formatCurrency(priceDetails.rate)} x{" "}
                          {priceDetails.days} days)
                        </span>
                        <span>₮{formatCurrency(priceDetails.total)}</span>
                      </div>
                      {priceDetails.discount > 0 && (
                        <div className="flex justify-between items-center text-xs text-green-400">
                          <span>Applied Discount</span>
                          <span>{priceDetails.discount}% OFF</span>
                        </div>
                      )}
                      {withDriver && priceDetails.totalDriverFee > 0 && (
                        <div className="flex justify-between items-center text-sm text-gray-400">
                          <span>👨‍✈️ Driver Fee ({priceDetails.days} days)</span>
                          <span>
                            +₮{formatCurrency(priceDetails.totalDriverFee)}
                          </span>
                        </div>
                      )}
                      {priceDetails.depositAmount > 0 && (
                        <div className="flex justify-between items-center text-sm text-emerald-400">
                          <span>Deposit (paid at booking)</span>
                          <span>
                            ₮{formatCurrency(priceDetails.depositAmount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-2">
                        <span className="text-lg font-bold text-white">
                          {priceDetails.depositAmount > 0 ? "Deposit" : "Total"}
                        </span>
                        <span className="text-2xl font-black text-blue-500">
                          ₮
                          {priceDetails.depositAmount > 0
                            ? formatCurrency(priceDetails.depositAmount)
                            : formatCurrency(priceDetails.grandTotal)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-gray-500 text-sm italic py-2">
                      {t("booking.selectDatesToSeePrice")}
                    </div>
                  )}

                  <button
                    onClick={handleBookClick}
                    disabled={
                      !priceDetails ||
                      !isSelectionValid ||
                      !isTimeValid ||
                      isSubmitting
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

      {/* Modals */}

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={
          priceDetails?.depositAmount && priceDetails.depositAmount > 0
            ? priceDetails.depositAmount
            : priceDetails?.grandTotal || 0
        }
        bookingData={{
          carId: car._id,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          totalPrice: priceDetails?.total || 0,
          bookingId: draftBooking?._id,
          type: "Барьцаа",
        }}
      />

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onSuccess={() => {
          setShowOTP(false);
          initiateDraftBooking();
        }}
      />
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
