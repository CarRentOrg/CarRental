"use client";

import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCars } from '@/lib/car-api';
import { Car } from '@/types';

export default function AdminCarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCars() {
            try {
                const data = await getCars();
                setCars(data || []);
            } catch (error) {
                console.error('Failed to load cars:', error);
            } finally {
                setLoading(false);
            }
        }
        loadCars();
    }, []);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Car Fleet</h1>
                    <p className="text-gray-500 font-medium">Manage your vehicles and their availability.</p>
                </div>
                <Link
                    href="/admin/cars/new"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add New Vehicle</span>
                </Link>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand or model..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-8 py-5">Vehicle</th>
                                    <th className="px-8 py-5">Category</th>
                                    <th className="px-8 py-5">Price/Day</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 border-t">
                                {cars.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-10 text-center text-gray-500 font-medium">
                                            No vehicles found in the fleet.
                                        </td>
                                    </tr>
                                ) : (
                                    cars.map((car, i) => (
                                        <tr key={car.id || i} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative h-14 w-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-gray-100">
                                                        {car.image_url ? (
                                                            <Image src={car.image_url} alt={car.model} fill className="object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full w-full">
                                                                <Filter className="h-6 w-6 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 leading-tight">{car.brand} {car.model}</p>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1">
                                                            ID: #C-{car.id ? car.id.substring(0, 8) : 'NEW'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-700">{car.type}</td>
                                            <td className="px-8 py-5 text-sm font-black text-blue-600">${car.price_per_day}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${car.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {car.is_available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
