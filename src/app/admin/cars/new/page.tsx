"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Info, Sliders, DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';

import { createCar } from '@/lib/car-api';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function NewCarPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CarFormValues>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            transmission: 'Automatic',
            fuelType: 'Petrol',
            seats: '5',
        }
    });

    const onSubmit = async (data: CarFormValues) => {
        try {
            const formattedData = {
                model: data.name,
                brand: data.brand,
                type: data.type,
                price_per_day: Number(data.pricePerDay),
                transmission: data.transmission,
                fuel: data.fuelType,
                seats: Number(data.seats),
                description: data.description,
                image_url: data.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80',
                is_available: true
            };

            const result = await createCar(formattedData as any);
            if (result) {
                router.push('/admin/cars');
                router.refresh();
            } else {
                alert('Failed to create car. Please check your Supabase connection and tables.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred while saving the car.');
        }
    };

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
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Add New Vehicle</h1>
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
                                placeholder="e.g. Tesla"
                            />
                            {errors.brand && <p className="text-xs text-red-500 font-bold">{errors.brand.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Model Name</label>
                            <input
                                {...register('name')}
                                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                placeholder="e.g. Model 3"
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
                                    placeholder="95"
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
                            placeholder="Provide a detailed description of the vehicle..."
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
                                placeholder="5"
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
                            placeholder="https://images.unsplash.com/..."
                        />
                        {errors.imageUrl && <p className="text-xs text-red-500 font-bold">{errors.imageUrl.message}</p>}
                    </div>

                    <div className="border-4 border-dashed border-gray-50 rounded-[2rem] p-12 text-center group hover:border-blue-100 transition-all">
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Drop image here or click to upload</p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4 pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-grow flex items-center justify-center space-x-3 bg-blue-600 text-white rounded-[2rem] py-6 font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-1 disabled:opacity-50"
                    >
                        <Save className="h-6 w-6" />
                        <span>{isSubmitting ? 'Saving...' : 'Save Vehicle'}</span>
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
