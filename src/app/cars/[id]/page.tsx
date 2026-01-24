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
} from "lucide-react";
import { Car } from "@/types";

// This would typically come from a DB call in a real app
const getCarById = (id: string): Car | undefined => {
  const cars: Car[] = [
    {
      id: "1",
      name: "Model 3",
      brand: "Tesla",
      type: "Luxury",
      price_per_day: 95,
      image_url:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80",
      transmission: "Automatic",
      fuel_type: "Electric",
      seats: 5,
      description:
        "The Tesla Model 3 is built from the ground up as an electric vehicle. With a dual motor All-Wheel Drive system, the Model 3 provides superior traction and control in all-weather conditions. This premium sedan combines high performance with a sleek, minimalist interior, featuring a massive touchscreen interface for all control functions.",
      is_available: true,
    },
    // ... adding more for demo purposes if needed
  ];
  return cars.find((c) => c.id === id) || cars[0]; // Default to first for demo
};

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const car = getCarById(params.id);

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="bg-gray-50 pb-24">
      {/* Detail Header */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <Link
            href="/cars"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to results</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery Placeholder */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg bg-white">
              <Image
                src={car.image_url}
                alt={car.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Stats */}
            <div className="bg-white rounded-3xl border p-8 shadow-sm space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      {car.type}
                    </span>
                    <div className="flex items-center text-yellow-500 space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold text-gray-900">
                        4.9 (120 reviews)
                      </span>
                    </div>
                  </div>
                  <h1 className="text-4xl font-extrabold text-gray-900">
                    {car.brand} {car.name}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-blue-600">
                    ${car.price_per_day}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">per day</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    icon: Users,
                    label: "Capacity",
                    value: `${car.seats} Persons`,
                  },
                  {
                    icon: Gauge,
                    label: "Transmission",
                    value: car.transmission,
                  },
                  { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
                  { icon: Zap, label: "Performance", value: "High" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <item.icon className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span>About this car</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>

            {/* Features/Specs */}
            <div className="bg-white rounded-3xl border p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Premium Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Bluetooth Connectivity",
                  "GPS Navigation System",
                  "Reverse Camera",
                  "Keyless Entry",
                  "Heated Seats",
                  "Child Seat Support",
                  "Leather Interior",
                  "Premium Sound System",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 text-gray-700 font-medium"
                  >
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl border p-8 shadow-xl space-y-6">
              <h3 className="text-2xl font-bold">Book Now</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Pick-up Location</span>
                  </label>
                  <select className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none">
                    <option>City Center Mall</option>
                    <option>International Airport</option>
                    <option>North Station</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Duration</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                    <input
                      type="date"
                      className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-dashed space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>${car.price_per_day} x 3 days</span>
                  <span>${car.price_per_day * 3}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Insurance & Fees</span>
                  <span>$45</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total Price</span>
                  <span>${car.price_per_day * 3 + 45}</span>
                </div>
              </div>

              <Link
                href={`/booking?carId=${car.id}`}
                className="flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg shadow-blue-200"
              >
                Reserve this car
              </Link>

              <div className="flex items-center justify-center space-x-2 text-xs font-bold text-green-600 bg-green-50 py-2 rounded-lg">
                <ShieldCheck className="h-4 w-4" />
                <span>Free cancellation up to 48h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
