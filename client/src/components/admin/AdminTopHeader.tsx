"use client";

import { Globe, ExternalLink, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminTopHeader() {
    const { language, setLanguage } = useLanguage();

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 transition-all">
            <div className="flex items-center space-x-4">
                <Link
                    href="/"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                >
                    <ExternalLink className="h-4 w-4" />
                    <span>Visit Website</span>
                </Link>
            </div>

            <div className="flex items-center space-x-6">
                {/* Language Switcher */}
                <button
                    onClick={() => setLanguage(language === 'en' ? 'mn' : 'en')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-gray-100 text-gray-700 hover:bg-gray-50 transition-all"
                    title={language === 'en' ? 'Switch to Mongolian' : 'Switch to English'}
                >
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-black uppercase tracking-wider">{language}</span>
                </button>

                <button className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-100 mx-2"></div>

                <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-gray-900 leading-none">Super Admin</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Management</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-105 transition-all">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
