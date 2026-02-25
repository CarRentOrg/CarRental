"use client";

import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types";
import { ArrowUpRight, Fuel, Gauge, Users, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarCardProps {
  car: Car;
  onBook?: (car: Car) => void;
}

export default function CarCard({ car, onBook }: CarCardProps) {
  const { t } = useLanguage();
  const price = car.price_rates?.daily ?? car.price_per_day;

  const specs = [
    car.seats && { icon: Users, label: `${car.seats}` },
    car.fuel_type && { icon: Fuel, label: car.fuel_type },
    car.transmission && { icon: Gauge, label: car.transmission },
    car.year && { icon: Calendar, label: `${car.year}` },
  ].filter(Boolean) as { icon: typeof Users; label: string }[];

  return (
    <div className="group w-full relative">
      <div
        className="relative rounded-2xl bg-zinc-900/50 border border-zinc-800/60
                    overflow-hidden transition-all duration-500
                    hover:border-zinc-700 hover:shadow-2xl hover:shadow-white/3"
      >
        {/* ─── IMAGE ─── */}
        <Link
          href={`/cars/${car._id}`}
          className="relative block overflow-hidden"
          aria-label={`View details for ${car.brand} ${car.model}`}
        >
          <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-800">
            {car.thumbnail ? (
              <Image
                src={car.thumbnail.url}
                alt={`${car.brand} ${car.model}`}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs uppercase font-semibold tracking-widest text-zinc-600">
                  No Image
                </span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

            {/* Top-right arrow indicator */}
            <div
              className="absolute top-4 right-4 w-9 h-9 rounded-xl
                          bg-white/10 backdrop-blur-md border border-white/10
                          flex items-center justify-center
                          opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                          transition-all duration-500"
            >
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>

            {/* Car type badge */}
            {car.type && (
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold
                              tracking-[0.15em] bg-white/10 backdrop-blur-md
                              border border-white/10 text-white/80"
                >
                  {car.type}
                </span>
              </div>
            )}

            {/* Floating price on image */}
            <div className="absolute bottom-4 left-5">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  ${price}
                </span>
                <span className="text-xs text-white/60 font-medium">
                  /{t("cars.perDay").replace("per ", "")}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ─── CONTENT ─── */}
        <div className="p-5 space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <Link href={`/cars/${car._id}`} className="flex-1 min-w-0">
              <h3
                className="text-lg font-bold text-white leading-snug tracking-tight
                            group-hover:text-zinc-100 transition-colors duration-300
                            truncate"
              >
                {car.brand} {car.model}
              </h3>
              {car.year && (
                <p className="text-xs text-zinc-600 font-medium mt-0.5">
                  {car.year} Model
                </p>
              )}
            </Link>

            {/* Availability dot */}
            {car.is_available && (
              <div className="flex items-center gap-1.5 shrink-0 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
                  Available
                </span>
              </div>
            )}
          </div>

          {/* Spec pills */}
          <div className="flex flex-wrap gap-1.5">
            {specs.map((spec, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                            bg-zinc-800/60 border border-zinc-800/80
                            transition-colors duration-300
                            group-hover:bg-zinc-800/80 group-hover:border-zinc-700/60"
              >
                <spec.icon className="h-3 w-3 text-zinc-500" />
                <span className="text-[11px] font-medium text-zinc-400 capitalize">
                  {spec.label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-800/60" />

          {/* Action row */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              {t("common.from")}{" "}
              <span className="text-zinc-400 font-semibold">${price}</span>
              <span className="text-zinc-600">
                /{t("cars.perDay").replace("per ", "")}
              </span>
            </p>

            {onBook ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBook(car);
                }}
                className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl
                            bg-white text-black text-xs font-bold
                            hover:bg-zinc-100 active:scale-95
                            transition-all duration-300
                            shadow-lg shadow-black/20"
                aria-label={`Book ${car.brand} ${car.model}`}
              >
                <span>Book Now</span>
                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            ) : (
              <Link
                href={`/cars/${car._id}`}
                className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl
                            bg-white text-black text-xs font-bold
                            hover:bg-zinc-100 active:scale-95
                            transition-all duration-300
                            shadow-lg shadow-black/20"
                aria-label={`View details for ${car.brand} ${car.model}`}
              >
                <span>View Details</span>
                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
