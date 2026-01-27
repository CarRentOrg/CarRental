"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MapPin, Phone, Send, ArrowRight, Plus } from 'lucide-react';

export default function ContactPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">{t('contact.title')}</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('contact.form.name')}</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('contact.form.email')}</label>
                                <input
                                    type="email"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('contact.form.message')}</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Your message..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 group"
                            >
                                <span>{t('contact.form.send')}</span>
                                <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* Info & Map */}
                    <div className="space-y-8">
                        {/* New Car Request Form */}
                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                                <Plus className="h-6 w-6 text-blue-500" />
                                <span>Request a Specific Car</span>
                            </h2>
                            <form
                                className="space-y-4"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data = {
                                        user_name: formData.get('name') as string,
                                        user_email: formData.get('email') as string,
                                        car_model: formData.get('model') as string,
                                        message: formData.get('message') as string,
                                    };

                                    const { requestCar } = await import('@/lib/car-api');
                                    const success = await requestCar(data);
                                    if (success) {
                                        alert('Request submitted successfully!');
                                        (e.target as HTMLFormElement).reset();
                                    } else {
                                        alert('Failed to submit request.');
                                    }
                                }}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="name"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 transition-colors"
                                        placeholder="Your Name"
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 transition-colors"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <input
                                    name="model"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 transition-colors"
                                    placeholder="Desired Car Model (e.g. 2024 Ferrari SF90)"
                                />
                                <textarea
                                    name="message"
                                    rows={3}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Any special requirements?"
                                />
                                <button className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase text-xs tracking-widest">
                                    Submit Request
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <MapPin className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{t('contact.info.office')}</h3>
                                    <p className="text-gray-400">{t('footer.address')}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <Phone className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{t('contact.info.phone')}</h3>
                                    <p className="text-gray-400">+976 99999999</p>
                                    <p className="text-gray-500 text-sm mt-1">Mon-Fri 9am-6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <Mail className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{t('contact.info.email')}</h3>
                                    <p className="text-gray-400">support@luxerra.com</p>
                                    <p className="text-gray-500 text-sm mt-1">We reply within 2 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl h-64 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.4194,37.7749,12,0,0/600x400?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-bold">{t('contact.info.mapTitle')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
