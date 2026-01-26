import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';

// Mock data for car list
const ALL_CARS: Car[] = [
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
        description: 'The Tesla Model 3 is designed for electric performance.',
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
        description: 'The 911 has been the heart of the Porsche brand for decades.',
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
        description: 'Range Rover Sport is the most dynamic Range Rover.',
        is_available: true,
    },
    {
        id: '4',
        name: 'Camry',
        brand: 'Toyota',
        type: 'Sedan',
        price_per_day: 55,
        image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80',
        transmission: 'Automatic',
        fuel_type: 'Hybrid',
        seats: 5,
        description: 'Reliable and fuel-efficient mid-size sedan.',
        is_available: true,
    },
    {
        id: '5',
        name: 'Civic',
        brand: 'Honda',
        type: 'Sedan',
        price_per_day: 50,
        image_url: 'https://images.unsplash.com/photo-1599912027806-cfec9f5944b6?auto=format&fit=crop&q=80',
        transmission: 'Manual',
        fuel_type: 'Petrol',
        seats: 5,
        description: 'Sporty and practical compact car.',
        is_available: true,
    },
    {
        id: '6',
        name: 'Mustang Mach-E',
        brand: 'Ford',
        type: 'SUV',
        price_per_day: 110,
        image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80',
        transmission: 'Automatic',
        fuel_type: 'Electric',
        seats: 5,
        description: 'All-electric SUV with the heart of a Mustang.',
        is_available: true,
    },
];

export default function CarsPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col space-y-8">
                {/* Header & Search */}
                <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold">Available Cars</h1>
                        <p className="text-gray-600">Choose from our diverse fleet of {ALL_CARS.length} vehicles</p>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand or model..."
                            className="w-full rounded-2xl border-gray-500 bg-gray py-3 pl-12 pr-4 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Filters Sidebar */}
                    <aside className="hidden space-y-8 lg:block">
                        <div className="rounded-3xl border bg-black p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between border-b pb-4">
                                <h3 className="flex items-center space-x-2 text-lg font-bold">
                                    <Filter className="h-4 w-4 text-white" />
                                    <span>Filters</span>
                                </h3>
                                <button className="text-sm font-medium text-blue-600 hover:underline">Clear all</button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">Car Type</h4>
                                    <div className="space-y-2">
                                        {['Sedan', 'SUV', 'Luxury', 'Sports', 'Hatchback'].map((type) => (
                                            <label key={type} className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">Transmission</h4>
                                    <div className="space-y-2">
                                        {['Automatic', 'Manual'].map((type) => (
                                            <label key={type} className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">Price Range</h4>
                                    <input type="range" className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600" />
                                    <div className="mt-2 flex justify-between text-xs font-bold text-gray-500">
                                        <span>$0</span>
                                        <span>$500+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Car Grid */}
                    <div className="lg:col-span-3">
                        {/* Mobile Filter Toggle */}
                        <div className="mb-6 flex lg:hidden">
                            <button className="flex items-center space-x-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold shadow-sm">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Filters</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {ALL_CARS.map(car => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white hover:bg-gray-50">1</button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white hover:bg-gray-50">2</button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white hover:bg-gray-50">3</button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
