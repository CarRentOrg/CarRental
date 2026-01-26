"use client";
import {
  Users,
  Fuel,
  Gauge,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Zap,
  Info,
  MapPin,
  Star,
  Check,
  Clock,
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

// Rental rates data
const rentalRates = [
  { duration: "Hourly (min. 4 hrs)", price: "$150/hr" },
  { duration: "1 day", price: "$1200" },
  { duration: "7-14 days", price: "$700/day" },
  { duration: "30+ days", price: "$600/day" },
];

// Rental terms data
const rentalTerms = [
  { icon: Users, title: "21 years", subtitle: "Minimum age" },
  {
    icon: FileText,
    title: "2 documents",
    subtitle: "Passport and Driver's License",
  },
  { icon: CarIcon, title: "1 year", subtitle: "Of driving experience" },
  { icon: Wallet, title: "From 1000$", subtitle: "Security deposit" },
];

// FAQ data
const faqs = [
  "What are the terms and conditions for using the car?",
  "Can I drive the car outside the city?",
  "What is your fuel policy?",
  "Can the car be decorated for the wedding?",
  "Do you offer a driver service?",
  "What happens if I return the car late?",
];

// Steps data

// This would typically come from a DB call in a real app
const getCarById = (id: string): Car | undefined => {
  const cars: Car[] = [
    {
      id: "2",
      name: "LX 570",
      brand: "Lexus",
      type: "Luxury SUV",
      price_per_day: 180,
      image_url:
        "https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHg1NzB8ZW58MHx8MHx8fDA%3D",
      transmission: "Automatic",
      fuel_type: "Petrol",
      seats: 7,
      description:
        "The Lexus LX 570 features a 5.7L V8 engine with around 383 hp and 4WD luxury performance with premium leather interior and advanced safety suite.",
      is_available: true,
    },
  ];
  return cars.find((c) => c.id === id) || cars[0];
};

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const car = getCarById(params.id);

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Car not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-2 sm:px-10 mx-auto w-full">
      {/* Header Navigation */}

      <div className="px-6 lg:px-12 pb-6">
        <Returnbutton href="/cars" text="Back to results" />
      </div>

      {/* Main Content */}
      <div className=" ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Gallery */}
          <div className="space-y-8">
            <ThumbnailImageGallery images={carDaTa.images} alt={carDaTa.name} />

            {/* Rental Rates Section */}
            {/* <div className="pt-12">
              <h2 className="text-3xl font-light tracking-tight mb-8">
                Rental Rates
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
                    <span className="text-white font-medium">{rate.price}</span>
                  </div>
                ))}
              </div>
            </div> */}
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
                { icon: Zap, title: "520 HP", subtitle: "Performance" },
                {
                  icon: Bluetooth,
                  title: "Bluetooth",
                  subtitle: "Capacity",
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
                    (120 reviews)
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
                      Rental Rates
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
      </div>

      <RentalTermsSection />
      <HowToRentSection />
      <FAQSection />

      {/* Bottom Spacing */}
      <div className="h-24" />
    </div>
  );
}
