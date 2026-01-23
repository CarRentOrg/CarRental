import Link from 'next/link';
import Image from 'next/image';
import { Users, Fuel, Gauge, ArrowRight } from 'lucide-react';
import { Car } from '@/types';

interface CarCardProps {
    car: Car;
}

export default function CarCard({ car }: CarCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all hover:shadow-xl">
            <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl">
                <Image
                    src={car.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80'}
                    alt={car.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-blue-600 backdrop-blur-sm">
                    ${car.price_per_day}/day
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{car.brand} {car.name}</h3>
                    <p className="text-sm text-gray-500">{car.type}</p>
                </div>

                <div className="flex justify-between border-y border-gray-100 py-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1.5">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>{car.seats} Seats</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <Fuel className="h-4 w-4 text-blue-500" />
                        <span>{car.fuel_type}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <Gauge className="h-4 w-4 text-blue-500" />
                        <span>{car.transmission}</span>
                    </div>
                </div>

                <Link
                    href={`/cars/${car.id}`}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                    <span>Rent Now</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
