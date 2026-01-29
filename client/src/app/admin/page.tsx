"use client";

import {
    Users, Car, CalendarCheck, DollarSign,
    TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface DashboardStats {
    revenue: number;
    bookings: number;
    activeFleet: number;
    newCustomers: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        revenue: 0,
        bookings: 0,
        activeFleet: 0,
        newCustomers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await api.stats.getDashboard();
                setStats(data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const STAT_CARDS = [
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+12.5%', isUp: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Bookings', value: stats.bookings.toString(), change: '+8.2%', isUp: true, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Fleet', value: stats.activeFleet.toString(), change: '-2.1%', isUp: false, icon: Car, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'New Customers', value: stats.newCustomers.toString(), change: '+18.4%', isUp: true, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-10 pb-12">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back, Admin! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STAT_CARDS.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={`flex items-center space-x-1 text-sm font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                <span>{stat.change}</span>
                                {stat.isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900">
                                {loading ? "..." : stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fleet Distribution / Quick Analytics */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8 lg:col-span-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Fleet Status</h2>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-500">Available</span>
                                <span className="text-gray-900">{stats.activeFleet > 0 ? Math.floor(stats.activeFleet * 0.7) : 0} Cars</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-500">On Rent</span>
                                <span className="text-gray-900">{stats.activeFleet > 0 ? Math.floor(stats.activeFleet * 0.2) : 0} Cars</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }} />
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-dashed">
                        <button className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm transition-all hover:bg-gray-800">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
