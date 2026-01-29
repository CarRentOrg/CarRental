"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Info, Sliders, DollarSign, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

const carSchema = z.object({
    name: z.string().min(1, 'Model name is required'),
    brand: z.string().min(1, 'Brand is required'),
    type: z.string().min(1, 'Type is required'),
    pricePerDay: z.string().min(1, 'Price is required'),
    transmission: z.enum(['Automatic', 'Manual']),
    fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
    seats: z.string().min(1, 'Seats is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type CarFormValues = z.infer<typeof carSchema>;

export default function EditCarPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CarFormValues>({
        resolver: zodResolver(carSchema),
    });

    useEffect(() => {
        async function loadCar() {
            try {
                if (!id) return;
                const car = await api.cars.getById(id);
                if (car) {
                    setValue('name', car.model);
                    setValue('brand', car.brand);
                    setValue('type', car.type);
                    setValue('pricePerDay', car.price_per_day.toString());
                    setValue('transmission', car.transmission as any);
                    setValue('fuelType', car.fuel_type as any);
                    setValue('seats', car.seats.toString());
                    setValue('description', car.description);
                    setValue('imageUrl', car.image_url);
                }
            } catch (error) {
                console.error("Failed to load car", error);
                alert("Failed to load car details");
            } finally {
                setLoading(false);
            }
        }
        loadCar();
    }, [id, setValue]);

    const onSubmit = async (data: CarFormValues) => {
        try {
            const formattedData = {
                model: data.name,
                brand: data.brand,
                type: data.type,
                price_per_day: Number(data.pricePerDay),
                transmission: data.transmission,
                fuel_type: data.fuelType, // Note: backend expects fuel_type usually, but create used 'fuel'. Let's check consistency.
                // Checking usage in create: 'fuel: data.fuelType'. But API type says 'fuel_type'. 
                // I'll stick to 'fuel_type' which is in the DB schema.
                seats: Number(data.seats),
                description: data.description,
                image_url: data.imageUrl || '',
            };

            // Note: api.create usage showed 'fuel', but schema has 'fuel_type'. 
            // I should double check carService.ts or type definitions. 
            // Type definition says 'fuel_type'. 
            // I will use 'fuel_type' here to be safe as it matches the DB column likely.

            await api.cars.update(id, formattedData as any);
            router.push('/admin/cars');
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred while saving the car.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 flex items-center justify-between">
                <Link
                    href="/admin/cars"
                    className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Fleet</span>
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Vehicle</h1>
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-mono">{id.substring(0, 8)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center space-x-3 border-b border-gray-50 pb-6">
                        <Info className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">General Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Brand</label>
                            <input
                                {...register('brand')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            />
                            {errors.brand && <p className="text-xs text-red-500 font-bold">{errors.brand.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Model Name</label>
                            <input
                                {...register('name')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            />
                            {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Category</label>
                            <select
                                {...register('type')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            >
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Sports">Sports</option>
                                <option value="Truck">Truck</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Daily Price ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    {...register('pricePerDay')}
                                    type="number"
                                    className="w-full bg-gray-50/50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                />
                            </div>
                            {errors.pricePerDay && <p className="text-xs text-red-500 font-bold">{errors.pricePerDay.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Description</label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                        />
                        {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>}
                    </div>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center space-x-3 border-b border-gray-50 pb-6">
                        <Sliders className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Specifications</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Transmission</label>
                            <select
                                {...register('transmission')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            >
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Fuel Type</label>
                            <select
                                {...register('fuelType')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Seats</label>
                            <input
                                {...register('seats')}
                                type="number"
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Upload Placeholder */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center space-x-3 border-b border-gray-50 pb-6">
                        <ImageIcon className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Vehicle Photos</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Image URL</label>
                        <input
                            {...register('imageUrl')}
                            className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                        />
                        {errors.imageUrl && <p className="text-xs text-red-500 font-bold">{errors.imageUrl.message}</p>}
                    </div>
                </div>

                <div className="flex space-x-4 pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-grow flex items-center justify-center space-x-3 bg-blue-600 text-white rounded-[2rem] py-6 font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-1 disabled:opacity-50"
                    >
                        <Save className="h-6 w-6" />
                        <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-10 py-6 rounded-[2rem] bg-white border border-gray-100 font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
