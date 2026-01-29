"use client";

import BookingForm from '@/components/booking/BookingForm';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BookingPage() {
    const { t } = useLanguage();

    const includes = [
        t('booking.includes.upgrade'),
        t('booking.includes.mileage'),
        t('booking.includes.assistance')
    ];

    return (
        <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">

                    {/* Main Booking Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border p-8 shadow-sm">
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{t('booking.completeBooking')}</h1>
                            <BookingForm />
                        </div>

                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                            <div className="flex items-start space-x-4">
                                <ShieldCheck className="h-8 w-8 text-blue-200 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{t('booking.safeSecure')}</h3>
                                    <p className="text-blue-100 leading-relaxed text-sm">
                                        {t('booking.safeSecureDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-3xl border p-6 shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold mb-6 border-b pb-4">{t('booking.rentalSummary')}</h3>

                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative h-20 w-32 rounded-xl overflow-hidden shadow-md">
                                    <Image
                                        src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80"
                                        alt="Tesla Model 3"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Tesla Model 3</h4>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <span className="text-blue-600 font-bold mr-2">$95</span>
                                        <span>{t('cars.perDay').replace('per ', '')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-6">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-500">{t('booking.pickupLocation')}</span>
                                    <span className="text-gray-900">City Center</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-500">{t('booking.duration')}</span>
                                    <span className="text-gray-900">3 {t('common.day')}s</span>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <div className="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{t('booking.basePrice')}</span>
                                        <span>$285.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{t('booking.insurance')} (Standard)</span>
                                        <span>$30.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-600">
                                        <span>{t('booking.tax')} (10%)</span>
                                        <span>$31.50</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-4 border-t">
                                        <span>{t('booking.totalPrice')}</span>
                                        <span>$346.50</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                {includes.map((item, i) => (
                                    <div key={i} className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
