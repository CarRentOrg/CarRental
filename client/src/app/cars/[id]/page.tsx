"use client";

import { Users, Fuel, Gauge, ShieldCheck, Zap, Bluetooth } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ThumbnailImageGallery from "@/components/cars/ThumbnailImageGallery";
import Returnbutton from "@/components/shared/returnbutton";
import HowToRentSection from "@/components/_sections/HowToRentSection";
import RentalTermsSection from "@/components/_sections/RentalTermsSection";
import FAQSection from "@/components/_sections/FAQSection";
import RentalTermsModal from "@/components/booking/RentalTermsModal";
import { useApp } from "@/contexts/AppContext";
import { Car } from "@/types";

export default function CarDetailPage() {
  const { id } = useParams();
  const { getCarById } = useApp();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const carId = Array.isArray(id) ? id[0] : (id ?? "");

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
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-12 mx-auto w-full overflow-x-hidden">
      <div className="lg:px-12 pb-6">
        <Returnbutton href="/cars" text="Back to results" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        {/* LEFT */}
        <div className="lg:flex-1 min-w-0 space-y-8">
          <div className="block lg:hidden">
            <CarTitle car={car} />
          </div>

          {images.length > 0 && (
            <ThumbnailImageGallery
              images={images.map((img) => img || "/placeholder.svg")}
              alt={car.model}
            />
          )}

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
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
              {
                icon: ShieldCheck,
                title: "Insurance",
                subtitle: "Included",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors"
              >
                <item.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white mb-1.5 sm:mb-3" />
                <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                  {item.title}
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          {car.description && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-white text-2xl font-bold mb-4">
                About This Vehicle
              </h3>
              <p className="text-zinc-300 leading-relaxed">{car.description}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:flex-1 lg:max-w-lg space-y-4">
          <div className="hidden lg:block">
            <CarTitle car={car} />
          </div>

          {/* Prominent Price Display */}
          <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800">
            <p className="text-sm text-zinc-400 uppercase tracking-wide mb-2">
              Starting From
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                ₮{(car.price_rates?.daily ?? 0).toLocaleString()}
              </span>
              <span className="text-xl text-zinc-400 font-medium">/day</span>
            </div>
          </div>

          {/* Booking Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">Rental Rates</h2>
              <p className="text-sm text-zinc-400 mt-1">
                {car.brand} {car.model}
              </p>
            </div>

            <div className="space-y-3">
              {rates.map((r, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b border-zinc-800 last:border-0"
                >
                  <span className="text-zinc-300 font-medium">{r.season}</span>
                  <span className="text-white font-bold text-lg">
                    ₮{r.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTermsModal(true)}
              className="w-full py-3.5 bg-white hover:bg-zinc-100 text-black font-bold rounded-xl transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Now
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
              <ShieldCheck className="h-5 w-5" />
              <span>Free cancellation up to 48h</span>
            </div>
          </div>
        </div>
      </div>

      <RentalTermsSection />
      <HowToRentSection />
      <FAQSection />

      {/* Rental Terms Modal */}
      <RentalTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        carId={carId}
      />
    </div>
  );
}

// =====================
// TITLE COMPONENT
// =====================
const CarTitle = ({ car }: { car: Car }) => (
  <div className="space-y-3 mb-6">
    <div className="flex items-center gap-3">
      <span className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs uppercase font-bold rounded-full">
        {car.fuel_type}
      </span>
    </div>
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight wrap-break-word">
      {car.brand}{" "}
      <span className="bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent">
        {car.model}
      </span>
    </h1>
  </div>
);
