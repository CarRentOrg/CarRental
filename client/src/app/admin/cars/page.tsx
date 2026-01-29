"use client";

import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Car } from '@/types';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function AdminCarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadCars();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFilteredCars(
            cars.filter(car =>
                car.brand.toLowerCase().includes(lowerSearch) ||
                car.model.toLowerCase().includes(lowerSearch)
            )
        );
    }, [search, cars]);

    async function loadCars() {
        try {
            setLoading(true);
            const data = await api.cars.getAll();
            setCars(data);
            setFilteredCars(data);
        } catch (error) {
            console.error('Failed to load cars:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(car: Car) {
        if (!confirm(`Are you sure you want to delete ${car.brand} ${car.model}?`)) return;

        try {
            await api.cars.delete(car.id);
            setCars(prev => prev.filter(c => c.id !== car.id));
        } catch (error) {
            alert('Failed to delete car');
            console.error(error);
        }
    }

    const columns: Column<Car>[] = [
        {
            header: "Vehicle",
            cell: (car) => (
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
                            ID: #{car.id.substring(0, 8)}
                        </p>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessorKey: "type",
            className: "font-bold text-gray-700"
        },
        {
            header: "Price/Day",
            cell: (car) => <span className="text-blue-600 font-black">${car.price_per_day}</span>
        },
        {
            header: "Status",
            cell: (car) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${car.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {car.is_available ? 'Available' : 'Unavailable'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <AdminPageHeader
                title="Fleet Management"
                description="Manage your vehicles, track availability, and update pricing."
                breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Fleet' }]}
                actions={
                    <Link
                        href="/admin/cars/new"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add New Vehicle</span>
                    </Link>
                }
            />

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand or model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="p-4">
                    <AdminTable
                        columns={columns}
                        data={filteredCars}
                        loading={loading}
                        onEdit={(car) => router.push(`/admin/cars/${car.id}`)}
                        onDelete={handleDelete}
                        emptyMessage="No vehicles match your search."
                    />
                </div>
            </div>
        </div>
    );
}
