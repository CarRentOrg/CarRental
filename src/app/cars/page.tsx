"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCars } from '@/lib/car-api';

export default function CarsPage() {
    const { t } = useLanguage();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCars() {
            try {
                const data = await getCars();
                setCars(data);
            } catch (error) {
                console.error('Failed to load cars:', error);
            } finally {
                setLoading(false);
            }
        }
        loadCars();
    }, []);

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col space-y-8">
                {/* Header & Search */}
                <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold">{t('cars.title')}</h1>
                        <p className="text-gray-600">{t('cars.subtitle')}</p>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('cars.searchPlaceholder')}
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
                                    <span>{t('common.filter')}</span>
                                </h3>
                                <button className="text-sm font-medium text-blue-600 hover:underline">{t('common.clearAll')}</button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">{t('cars.carType')}</h4>
                                    <div className="space-y-2">
                                        {['Sedan', 'SUV', 'Luxury', 'Sports', 'Hatchback'].map((type) => (
                                            <label key={type} className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span>{type === 'SUV' ? t('cars.types.suv') : t(`cars.types.${type.toLowerCase()}` as any)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">{t('cars.transmission')}</h4>
                                    <div className="space-y-2">
                                        {['Automatic', 'Manual'].map((type) => (
                                            <label key={type} className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span>{t(`cars.${type.toLowerCase()}` as any)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">{t('cars.priceRange')}</h4>
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
                                <span>{t('common.filter')}</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {cars.map((car: Car) => (
                                    <CarCard key={car.id} car={car} />
                                ))}
                            </div>
                        )}

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
