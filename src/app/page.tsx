import Link from 'next/link';
import { Search, Calendar, MapPin, ChevronRight, Users } from 'lucide-react';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';

// Mock data for featured cars
const FEATURED_CARS: Car[] = [
  {
    id: '1',
    name: 'Model 3',
    brand: 'Tesla',
    type: 'Luxury',
    price_per_day: 95,
    image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80',
    transmission: 'Automatic',
    fuel_type: 'Electric',
    seats: 5,
    description: 'The Tesla Model 3 is designed for electric performance, with dual motor AWD, quick acceleration, long range and fast charging.',
    is_available: true,
  },
  {
    id: '2',
    name: '911 Carrera',
    brand: 'Porsche',
    type: 'Sports',
    price_per_day: 250,
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 4,
    description: 'The 911 has been the heart of the Porsche brand for decades. A sports car legend that is as versatile as it is timeless.',
    is_available: true,
  },
  {
    id: '3',
    name: 'Range Rover Sport',
    brand: 'Land Rover',
    type: 'SUV',
    price_per_day: 180,
    image_url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    description: 'Range Rover Sport is the most dynamic Range Rover. It is a powerful, refined SUV with an assertive design.',
    is_available: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
            className="h-full w-full object-cover opacity-50"
            alt="Hero Car"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            Find, book, rent a car <span className="text-blue-500">quick and easy!</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Streamline your car rental experience with our effortless booking process.
          </p>

          {/* Search Box */}
          <div className="mt-12 w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="space-y-2 text-left">
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-900">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>Pick-up Location</span>
                </label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-900">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Pick-up Date</span>
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-900">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Drop-off Date</span>
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex items-end">
                <button className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg">
                  <Search className="h-5 w-5" />
                  <span>Search Cars</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Featured Cars</h2>
              <p className="text-gray-600">Explore our most popular rental choices</p>
            </div>
            <Link
              href="/cars"
              className="group flex items-center space-x-1 font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>View all cars</span>
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_CARS.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Why Choose Us?</h2>
            <p className="mt-4 text-gray-600">The best rental experience with premium benefits</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Many Locations</h3>
              <p className="text-gray-600 leading-relaxed">
                Find us easily with numerous locations across the country, making pick-up and drop-off a breeze.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Easy Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Our intuitive platform allows you to book your favorite car in just a few clicks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Reliable Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our 24/7 customer support is always here to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
