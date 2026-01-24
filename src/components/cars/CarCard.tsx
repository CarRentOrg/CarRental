import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types";
import { ChevronRight } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="group w-full">
      {/* IMAGE PART */}
      <Link
        href={`/cars/${car.is_available}`}
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
            alt={car.name}
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
            <h3 className="text-[18px] font-medium leading-7">{car.name}</h3>
            <a
              href=""
              className="flex items-center text-base text-[#b8b8b8] hover:text-white"
            >
              <span>Learn More</span>
              <ChevronRight className="h-5 w-5 " />
            </a>
          </div>
          <div>
            <p className="text-base text-[#b8b8b8]">
              from {``} <span>${car.price_per_day}/day</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
