import Link from "next/link";
import Image from "next/image";
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
import { BOOKING_STEPS } from "@/constants";

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

                <Link
                  href={`/booking?carId=${car.id}`}
                  className="flex w-full items-center justify-center rounded-xl bg-white py-4 font-medium text-black transition-all duration-300 hover:bg-neutral-200 hover:shadow-lg hover:shadow-white/10"
                >
                  Reserve this car
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Free cancellation up to 48h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Terms Section */}
      <section className="mt-32 py-20 border-t border-neutral-800/50 bg-[#0e0e0e] rounded-4xl">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side */}
            <div className="space-y-6">
              <h2 className="text-4xl font-light tracking-tight">
                Rental Terms
              </h2>
              <p className="text-neutral-400 font-light max-w-sm">
                We're here for you — ready to help find the perfect car that
                matches your needs.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                  <span className="text-lg font-medium">MC</span>
                </div>
                <div>
                  <p className="font-medium text-white">Michael Carter</p>
                  <p className="text-sm text-neutral-500">
                    Your Personal Rental Assistant
                  </p>
                </div>
              </div>

              <button className="mt-4 px-6 py-3 rounded-full border border-neutral-700 text-white text-sm font-medium hover:bg-neutral-800/50 transition-all duration-300">
                Call Us Now
              </button>
            </div>

            {/* Right Side - Terms Grid */}
            <div className="grid grid-cols-2 gap-4">
              {rentalTerms.map((term, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#171717] backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-500"
                >
                  <term.icon className="h-5 w-5 text-neutral-400 mb-4" />
                  <p className="text-lg font-medium text-white">{term.title}</p>
                  <p className="text-sm text-neutral-500">{term.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-light tracking-tight text-center mb-16">
            Get Rolling in 4 Steps
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Featured Image */}
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80"
                alt="Luxury car"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-2 gap-4">
              {BOOKING_STEPS.map((step, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-500 group"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border  border-neutral-700 text-sm font-medium text-neutral-400 mb-4 group-hover:border-white group-hover:text-white transition-all duration-300">
                    {step.number}
                  </span>
                  <h4 className="text-lg font-medium text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-neutral-800/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side */}
            <div>
              <h2 className="text-4xl font-light tracking-tight">
                Frequently Asked
                <br />
                Questions
              </h2>
            </div>

            {/* Right Side - FAQ List */}
            <div className="space-y-0">
              {faqs.map((question, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-6 border-b border-neutral-800/50 group cursor-pointer hover:border-neutral-700 transition-all duration-300"
                >
                  <span className="text-neutral-300 font-light group-hover:text-white transition-colors duration-300">
                    {question}
                  </span>
                  <Plus className="h-5 w-5 text-neutral-500 group-hover:text-white transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-24" />
    </div>
  );
}
