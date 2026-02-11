"use client";
import { api } from "@/lib/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Calendar, User, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingForm() {
  const router = useRouter();
  const { t } = useLanguage();

  const bookingSchema = z.object({
    firstName: z.string().min(2, t("booking.firstName") + " is required"),
    lastName: z.string().min(2, t("booking.lastName") + " is required"),
    email: z.string().email(t("booking.email") + " is invalid"),
    phone: z.string().min(8, t("booking.phone") + " is required"),
    pickupLocation: z
      .string()
      .min(1, t("booking.pickupLocation") + " is required"),
    dropoffLocation: z
      .string()
      .min(1, t("booking.dropoffLocation") + " is required"),
    pickupDate: z.string().min(1, t("booking.pickupDate") + " is required"),
    dropoffDate: z.string().min(1, t("booking.returnDate") + " is required"),
  });

  type BookingFormValues = z.infer<typeof bookingSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const carId = searchParams.get("carId");

      if (!carId) {
        alert("No vehicle selected for booking.");
        return;
      }

      const bookingData = {
        carId: carId,
        startDate: data.pickupDate,
        endDate: data.dropoffDate,
        status: "pending" as const,
        totalPrice: 0,
        note: `Contact: ${data.firstName} ${data.lastName}, ${data.phone}, ${data.email}. Locations: ${data.pickupLocation} -> ${data.dropoffLocation}`,
      };

      const result = await api.bookings.create(bookingData);
      if (result) {
        router.push("/confirmation");
      } else {
        alert("Failed to process booking.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred during booking.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Step 1: Booking Info */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b pb-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-bold">{t("booking.details")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.pickupLocation")}
            </label>
            <input
              {...register("pickupLocation")}
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder={t("booking.cityOrAirport")}
            />
            {errors.pickupLocation && (
              <p className="text-xs text-red-500 font-medium">
                {errors.pickupLocation.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.dropoffLocation")}
            </label>
            <input
              {...register("dropoffLocation")}
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder={t("booking.cityOrAirport")}
            />
            {errors.dropoffLocation && (
              <p className="text-xs text-red-500 font-medium">
                {errors.dropoffLocation.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.pickupDate")}
            </label>
            <input
              {...register("pickupDate")}
              type="date"
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            {errors.pickupDate && (
              <p className="text-xs text-red-500 font-medium">
                {errors.pickupDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.returnDate")}
            </label>
            <input
              {...register("dropoffDate")}
              type="date"
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            {errors.dropoffDate && (
              <p className="text-xs text-red-500 font-medium">
                {errors.dropoffDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Personal Info */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b pb-2">
          <User className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-bold">{t("booking.personalInfo")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.firstName")}
            </label>
            <input
              {...register("firstName")}
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 font-medium">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.lastName")}
            </label>
            <input
              {...register("lastName")}
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 font-medium">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.email")}
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("booking.phone")}
            </label>
            <input
              {...register("phone")}
              className="w-full rounded-xl border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="+1 234 567 890"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
      >
        <span>
          {isSubmitting ? t("booking.processing") : t("booking.confirmBooking")}
        </span>
      </button>
    </form>
  );
}
