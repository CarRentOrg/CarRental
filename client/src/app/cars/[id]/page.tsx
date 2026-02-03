"use client";
import { Users, Fuel, Gauge, ShieldCheck, Zap, Bluetooth } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ThumbnailImageGallery from "@/components/cars/ThumbnailImageGallery";
import Returnbutton from "@/components/shared/returnbutton";
import Button from "@/components/shared/button";
import HowToRentSection from "@/components/_sections/HowToRentSection";
import RentalTermsSection from "@/components/_sections/RentalTermsSection";
import FAQSection from "@/components/_sections/FAQSection";
import { useApp } from "@/contexts/AppContext";
import { Car } from "@/types";

export default function CarDetailPage() {
  const { id } = useParams();
  const { getCarById } = useApp();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getCarById(id as string);
      setCar(data || null);
      setLoading(false);
    };
    fetchCar();
  }, [id, getCarById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Car not found</div>
      </div>
    );
  }

  // Build image list - Version 0.5.0-force-type-cast
  const images = [
    ...(car.images || []),
    car.thumbnail_url,
    car.image_url
  ].filter(img => typeof img === 'string' && img !== '') as string[];

  // Build trigger: v4-strict-typing
  const rates = [
    { season: "Daily", price_per_day: car.rates?.daily || car.price_per_day },
    { season: "Weekly (15% off)", price_per_day: car.rates?.weekly || (car.price_per_day * 0.85) },
    { season: "Monthly (30% off)", price_per_day: car.rates?.monthly || (car.price_per_day * 0.70) },
  ];

  const todayPrice = car.price_per_day;

  return (
    <div className="min-h-screen bg-black text-white pt-26 px-3 sm:px-12 mx-auto w-full">
      <div className="lg:px-12 pb-6">
        <Returnbutton href="/cars" text="Back to results" />
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:flex-1 space-y-8">
          <div className="block lg:hidden">
            <CarTitle car={car} />
          </div>
          {/* FORCE_BUILD_TRIGGER_REF_050_STRICT_CAST_APPLIED */}
          {images.length > 0 && (
            <ThumbnailImageGallery images={images} alt={car.model} />
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {[
              {
                icon: Users,
                title: `${car.seats} Persons`,
                subtitle: "Capacity",
              },
              {
                icon: Gauge,
                title: car.transmission,
                subtitle: "Transmission",
              },
              { icon: Fuel, title: car.fuel_type, subtitle: "Fuel Type" },
              {
                icon: Zap,
                // MockData doesn't have horsepower, checking description or default
                title: "450 HP",
                subtitle: "Performance",
              },
              { icon: Bluetooth, title: "Bluetooth", subtitle: "Feature" },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative p-4 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-500 hover:bg-neutral-900/70"
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/0.02 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <item.icon className="h-5 w-5 text-neutral-400 mb-4" />
                <p className="text-base font-medium text-white">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Description added since mockData has it */}
          <div className="prose prose-invert max-w-none text-gray-400">
            <h3 className="text-white text-xl font-medium mb-2">Description</h3>
            <p>{car.description}</p>
          </div>
        </div>

        {/* Right Column - Car Details */}
        <div className="lg:flex-1 space-y-6">
          <div className="hidden lg:block">
            <CarTitle car={car} />
          </div>

          {/* Booking Card */}
          <div className="relative p-8 rounded-3xl bg-linear-to-br from-neutral-900/80 to-neutral-950/90 backdrop-blur-xl border border-neutral-800/50 shadow-2xl shadow-black/50">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/0.03 to-transparent pointer-events-none" />
            <div className="relative space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-light tracking-tight mb-8">
                  Rental Rates
                </h2>
                <div className="space-y-0">
                  {rates.map((rate, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-5 border-b border-neutral-800/50"
                    >
                      <span className="text-neutral-300 font-light">
                        {rate.season}
                      </span>
                      <span className="text-white font-medium">
                        ₮{rate.price_per_day.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Today's Rate */}
                <div className="mt-4 p-4 bg-neutral-800/50 rounded-xl">
                  <span className="text-neutral-300">Base Price:</span>
                  <span className="text-white font-medium ml-2">
                    ₮{todayPrice.toLocaleString()} / day
                  </span>
                </div>
              </div>

              <Button
                text="Book Now"
                className="w-full rounded-xl"
                href={`/booking?carId=${car.id}`}
              />

              <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Free cancellation up to 48h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RentalTermsSection />
      <HowToRentSection />
      <FAQSection />
    </div>
  );
}

const CarTitle = ({ car }: { car: Car }) => (
  <div className="flex gap-4 lg:gap-8 mb-6">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
      {car.brand} <span className="font-medium">{car.model}</span>
    </h1>
    <div className="md:mt-3">
      <span
        className="px-3 py-1.5 bg-neutral-800/60 backdrop-blur-sm
                       text-neutral-300 text-xs md:text-base font-medium rounded-full
                       uppercase tracking-wider border border-neutral-700/50"
      >
        {car.fuel_type}
      </span>
    </div>
  </div>
);
