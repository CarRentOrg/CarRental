"use client";

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Users, Zap, Award, Target, Heart } from 'lucide-react';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
                        alt="Luxury Car Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="relative z-20 text-center container mx-auto px-6">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        {t('about.title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
                        {t('about.subtitle')}
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-b border-white/10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-2">
                            <span className="text-5xl font-black text-blue-500">10+</span>
                            <p className="text-gray-400 uppercase tracking-widest text-sm">{t('about.stats.years')}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-5xl font-black text-blue-500">5k+</span>
                            <p className="text-gray-400 uppercase tracking-widest text-sm">{t('about.stats.clients')}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-5xl font-black text-blue-500">150+</span>
                            <p className="text-gray-400 uppercase tracking-widest text-sm">{t('about.stats.cars')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold">{t('about.storyTitle')}</h2>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                {t('about.storyText')}
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <Award className="h-8 w-8 text-blue-500 mb-4" />
                                    <h4 className="font-bold mb-2">Premium Quality</h4>
                                    <p className="text-sm text-gray-500">Only the best vehicles for our clients</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <Users className="h-8 w-8 text-blue-500 mb-4" />
                                    <h4 className="font-bold mb-2">Expert Team</h4>
                                    <p className="text-sm text-gray-500">Dedicated professionals at your service</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-square lg:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20">
                            <Image
                                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80"
                                alt="Our Story"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-neutral-900">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16">{t('about.valuesTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-black border border-white/10 hover:border-blue-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <Heart className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{t('about.values.v1')}</h3>
                            <p className="text-gray-400">We prioritize your comfort and satisfaction above all else.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-black border border-white/10 hover:border-blue-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <Shield className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{t('about.values.v2')}</h3>
                            <p className="text-gray-400">Meticulously maintained fleet ensuring safety and reliability.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-black border border-white/10 hover:border-blue-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <Zap className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{t('about.values.v3')}</h3>
                            <p className="text-gray-400">Embracing the latest technology for a seamless experience.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
