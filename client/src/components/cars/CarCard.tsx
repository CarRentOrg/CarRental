"use client";

import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types";
import { ChevronRight, Fuel, Gauge, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const { t } = useLanguage();
  return (
    <div className="group w-full cursor-pointer">
      {/* IMAGE PART */}
      <Link
        href={`/cars/${car.id}`}
        className="
          relative block overflow-hidden
          rounded-[30px]
          transition-transform duration-300 ease-out
          md:group-hover:scale-[1.02]
        "
      >
        {/* Spec Badges - Floating on Image */}
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {car.seats && (
            <div className="flex items-center justify-center gap-1 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <User className="h-5 w-5 text-secondary-foreground" />
              <span className="text-xs font-semibold text-secondary-foreground">
                {car.seats}
              </span>
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center justify-center gap-1 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <Fuel className="h-5 w-5 text-secondary-foreground" />
              <span className="text-xs font-semibold text-secondary-foreground">
                {car.fuel_type}
              </span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center justify-center gap-1 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <Gauge className="h-5 w-5 text-secondary-foreground" />
              <span className="text-xs font-semibold text-secondary-foreground">
                {car.transmission}
              </span>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-[3/2] w-full max-w-full overflow-hidden">
          <Image
            src={car.image_url}
            alt={car.model}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-110"
          />
          {/* Gradient Overlay for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      {/* BOTTOM PART */}
      <div className="px-2 pt-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-white group-hover:text-blue-500 transition-colors">
              {car.brand} {car.model}
            </h3>
            <Link
              href={`/cars/${car.id}`}
              className="group/link flex items-center space-x-1 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <span>{t("common.learnMore")}</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>
          <div>
            <p className="text-base text-gray-400">
              {t("common.from")}{" "}
              <span className="font-semibold text-white">
                ${car.price_per_day}/{t("cars.perDay").replace("per ", "")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
