"use client";

import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const { t } = useLanguage();
  return (
    <div className="group w-full">
      {/* IMAGE PART */}
      <Link
        href={`/cars/${car.id}`}
        className="
          relative block overflow-hidden
          rounded-[20px] sm:rounded-[30px]
          transition-transform duration-300 ease-out
          md:group-hover:scale-[1.02]
        "
      >
        {/* Image */}
        <div className="relative w-full overflow-hidden max-w-full aspect-3/2">
          <Image
            src={car.image_url}
            alt={car.model}
            fill
            priority
            className="object-cover transition-transform duration-500 ease-out md:group-hover:scale-105"
          />
        </div>
      </Link>

      {/* BOTTOM PART */}
      <div className="px-2.5 pt-6">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-[18px] font-medium leading-7">{car.brand} {car.model}</h3>
            <a
              href=""
              className="flex items-center text-base text-[#b8b8b8] hover:text-white"
            >
              <span>{t('common.learnMore')}</span>
              <ChevronRight className="h-5 w-5 " />
            </a>
          </div>
          <div>
            <p className="text-base text-[#b8b8b8]">
              {t('common.from')} {``} <span>${car.price_per_day} / {t('cars.perDay').replace('per ', '')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
