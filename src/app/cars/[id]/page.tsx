"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  Zap,
  Star,
  FileText,
  Car as CarIcon,
  Wallet,
  Plus,
  ChevronRight,
  Bluetooth,
} from "lucide-react";
import { Car, Car1 } from "@/types";
import ThumbnailImageGallery from "@/components/cars/Thumbnails";
import Returnbutton from "@/components/shared/returnbutton";
import Button from "@/components/shared/button";
import HowToRentSection from "@/components/_sections/HowToRentSection";
import RentalTermsSection from "@/components/_sections/RentalTermsSection";
import FAQSection from "@/components/_sections/FAQSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCarById } from "@/lib/car-api";

const carDaTa: Car1 = {
  id: "gt3rs",
  name: "Porsche 911 GT3 RS",
  images: [
    "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHg1NzB8ZW58MHx8MHx8fDA%3D",
    "https://www.topgear.com/sites/default/files/2022/04/1-Mercedes-AMG-GT-63-S-E-Performance.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/2024-lexus-lc-500-convertible-117-655d765c34a2d.jpg?crop=0.764xw:0.647xh;0.115xw,0.262xh&resize=2048:*",
    "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior-pr-103-6864352bba6da.jpg?crop=0.708xw:0.598xh;0.145xw,0.304xh&resize=1200:*",
    "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior-pr-103-6864352bba6da.jpg?crop=0.708xw:0.598xh;0.145xw,0.304xh&resize=1200:*",
    "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior-pr-103-6864352bba6da.jpg?crop=0.708xw:0.598xh;0.145xw,0.304xh&resize=1200:*",
    "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior-pr-103-6864352bba6da.jpg?crop=0.708xw:0.598xh;0.145xw,0.304xh&resize=1200:*",
  ],
};

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCar() {
      const data = await getCarById(params.id);
      setCar(data);
      setLoading(false);
    }
    fetchCar();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Car not found</p>
      </div>
    );
  }

  const rentalRates = [
    { duration: "Hourly (min. 4 hrs)", price: "$150/hr" },
    { duration: "1 day", price: `$${car.price_per_day * 12}` }, // Just an example
    { duration: "7-14 days", price: `$${car.price_per_day}/day` },
    { duration: "30+ days", price: `$${Math.round(car.price_per_day * 0.8)}/day` },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 px-2 sm:px-10 mx-auto w-full">
      {/* Header Navigation */}

      <div className="px-6 lg:px-12 pb-6">
        <Returnbutton href="/cars" text={t('cars.backToResults')} />
      </div>

      {/* Main Content */}
      <div className=" ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Gallery */}
          <div className="space-y-8">
            <ThumbnailImageGallery images={[car.image_url, ...carDaTa.images.slice(1)]} alt={car.name} />

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: Users,
                  title: `${car.seats} ${t('cars.seats')}`,
                  subtitle: t('cars.capacity'),
                },
                {
                  icon: Gauge,
                  title: car.transmission === 'Automatic' ? t('cars.automatic') : t('cars.manual'),
                  subtitle: t('cars.transmission'),
                },
                { icon: Fuel, title: car.fuel_type, subtitle: t('cars.fuelType') },
                { icon: Zap, title: "520 HP", subtitle: t('cars.performance') },
                {
                  icon: Bluetooth,
                  title: "Bluetooth",
                  subtitle: t('cars.capacity'),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative p-4 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-500 hover:bg-neutral-900/70"
                >
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <item.icon className="h-5 w-5 text-neutral-400 mb-4" />
                  <p className="text-base font-medium text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-neutral-500">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Car Details */}
          <div className="space-y-6">
            {/* Car Title */}
            <div className="flex items-center gap-8 mb-3">
              <h1 className="text-5xl lg:text-6xl font-light tracking-tight leading-tight">
                {car.brand} {""}
                <span className="font-medium">{car.name}</span>
              </h1>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-white fill-white" />
                  <span className="text-sm font-medium text-white">4.9</span>
                  <span className="text-sm text-neutral-500">
                    (120 {t('cars.reviews')})
                  </span>
                </div>
                <span className="px-3 py-1.5 bg-neutral-800/60 backdrop-blur-sm text-neutral-300 text-xs font-medium rounded-full uppercase tracking-wider border border-neutral-700/50">
                  {car.type}
                </span>
              </div>
            </div>

            {/* Stats Grid - Glass Cards */}

            {/* Booking Card - Glassmorphism */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-950/90 backdrop-blur-xl border border-neutral-800/50 shadow-2xl shadow-black/50">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

              <div className="relative space-y-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-light tracking-tight mb-8">
                      {t('cars.rentalRates')}
                    </h2>
                    <div className="space-y-0">
                      {rentalRates.map((rate, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-5 border-b border-neutral-800/50"
                        >
                          <span className="text-neutral-300 font-light">
                            {rate.duration}
                          </span>
                          <span className="text-white font-medium">
                            {rate.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  text={t('nav.bookNow')}
                  className="w-full rounded-xl"
                  href={`/booking?carId=${car.id}`}
                />

                <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t('cars.freeCancellation')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RentalTermsSection />
      <HowToRentSection />
      <FAQSection />

      {/* Bottom Spacing */}
      <div className="h-24" />
    </div>
  );
}
