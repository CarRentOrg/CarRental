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
  const carId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!carId) return;

    const fetchCar = async () => {
      setLoading(true);
      const data = await getCarById(carId);
      setCar(data ?? null);

      setLoading(false);
    };

    fetchCar();
  }, [carId, getCarById]);

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

  // =====================
  // Images (REAL DATA SAFE)
  // =====================
  // Extract URLs from images array, fallback to thumbnail.url
  const images: string[] = (
    car.images && car.images.length > 0
      ? car.images.map((img) => img.url).filter(Boolean)
      : car.thumbnail?.url
        ? [car.thumbnail.url]
        : []
  ) as string[];

  // =====================
  // Rates (REAL DATA)
  // =====================
  const rates = [
    { season: "Daily", price: car.price_rates?.daily ?? 0 },
    {
      season: "Weekly (15% off)",
      price: car.price_rates?.weekly ?? 0,
    },
    {
      season: "Monthly (30% off)",
      price: car.price_rates?.monthly ?? 0,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-26 px-3 sm:px-12 mx-auto w-full">
      <div className="lg:px-12 pb-6">
        <Returnbutton href="/cars" text="Back to results" />
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* LEFT */}
        <div className="lg:flex-1 space-y-8">
          <div className="block lg:hidden">
            <CarTitle car={car} />
          </div>

          {images.length > 0 && (
            <ThumbnailImageGallery images={images} alt={car.model} />
          )}

          {/* Specs */}
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
              {
                icon: Fuel,
                title: car.fuel_type,
                subtitle: "Fuel Type",
              },
              {
                icon: Zap,
                title: "Electric Power",
                subtitle: "Performance",
              },
              {
                icon: Bluetooth,
                title: "Bluetooth",
                subtitle: "Feature",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/50"
              >
                <item.icon className="h-5 w-5 text-neutral-400 mb-4" />
                <p className="text-base font-medium text-white">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {car.description && (
            <div className="prose prose-invert max-w-none text-gray-400">
              <h3 className="text-white text-xl font-medium mb-2">
                Description
              </h3>
              <p>{car.description}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:flex-1 space-y-6">
          <div className="hidden lg:block">
            <CarTitle car={car} />
          </div>

          {/* Booking Card */}
          <div className="p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800/50">
            <h2 className="text-3xl font-light mb-6">Rental Rates</h2>

            {rates.map((r, i) => (
              <div
                key={i}
                className="flex justify-between py-4 border-b border-neutral-800/50"
              >
                <span className="text-neutral-300">{r.season}</span>
                <span className="text-white font-medium">
                  ₮{r.price.toLocaleString()}
                </span>
              </div>
            ))}

            <Button
              text="Book Now"
              className="w-full mt-6 rounded-xl"
              href={`/booking?carId=${carId}`}
            />

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Free cancellation up to 48h</span>
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

// =====================
// TITLE COMPONENT
// =====================
const CarTitle = ({ car }: { car: Car }) => (
  <div className="flex gap-4 mb-6">
    <h1 className="text-4xl sm:text-5xl font-light">
      {car.brand} <span className="font-medium">{car.model}</span>
    </h1>
    <span className="h-fit px-3 py-1.5 bg-neutral-800 text-xs uppercase rounded-full">
      {car.fuel_type}
    </span>
  </div>
);
