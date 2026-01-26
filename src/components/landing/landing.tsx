import Link from "next/link";
import { Search, Calendar, MapPin, ChevronRight, Users } from "lucide-react";
import CarCard from "@/components/cars/CarCard";
import { Car } from "@/types";
import Title from "@/components/shared/title";
import FeaturedSection from "@/components/_sections/FeaturedSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
       <section className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
            className="h-full w-full object-cover opacity-60"
            alt="Hero Car"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative mx-auto flex h-screen flex-col justify-center px-6 md:px-12">
          <div className="max-w-3xl space-y-8 pt-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Chosen by more than 250 clients
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
              Premium Car Rental <br />
              <span className="text-gray-400">in Los Angeles</span>
            </h1>

            <p className="max-w-xl text-lg text-gray-400 md:text-xl leading-relaxed">
              Experience unmatched comfort, style, and service — wherever the road takes you.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-transform hover:scale-105 active:scale-95"
              >
                Choose Your Car
              </Link>
              <button
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/40"
              >
                Our Approach
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <FeaturedSection />

      {/* Why Choose Us Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-gray-600">
              The best rental experience with premium benefits
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Many Locations</h3>
              <p className="text-gray-600 leading-relaxed">
                Find us easily with numerous locations across the country,
                making pick-up and drop-off a breeze.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Easy Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Our intuitive platform allows you to book your favorite car in
                just a few clicks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Reliable Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our 24/7 customer support is always here to help you with any
                questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
