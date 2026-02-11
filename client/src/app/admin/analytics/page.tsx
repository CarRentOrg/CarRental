"use client";

import { TrendingUp, Users, Car, DollarSign, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    bookings: 0,
    activeFleet: 0,
    newCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await api.owner.dashboard();
      setStats({
        revenue: data.totalRevenue,
        bookings: data.totalBookings,
        activeFleet: data.totalCars, // Mapped to totalCars or available+rented
        newCustomers: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      label: "Нийт орлого",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+12.5% vs өмнөх сар",
    },
    {
      label: "Нийт захиалга",
      value: stats.bookings,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+8.2% vs өмнөх сар",
    },
    {
      label: "Ашиглагдаж буй машин",
      value: stats.activeFleet,
      icon: Car,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "85% ашиглалт",
    },
    {
      label: "Шинэ хэрэглэгчид",
      value: stats.newCustomers,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+24 энэ долоо хоногт",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <AdminPageHeader
        title="Шинжилгээ, тайлан"
        description="Гол гүйцэтгэлийн үзүүлэлтүүдийн тойм."
        breadcrumbs={[
          { label: "Хяналтын самбар", href: "/admin" },
          { label: "Шинжилгээ, тайлан" },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-4xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                {loading ? "..." : card.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">
                {card.label}
              </p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                {loading ? "..." : card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                Орлогын тойм
              </h3>
              <p className="text-gray-400 text-xs font-bold mt-1">
                Сүүлийн 6 сар
              </p>
            </div>
          </div>

          {/* Mock Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[65, 45, 75, 55, 85, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="w-full bg-gray-50 rounded-t-xl relative h-full overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute bottom-0 w-full bg-blue-600 rounded-t-xl group-hover:bg-blue-500 transition-colors"
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                Хэрэглэгчийн идэвх
              </h3>
              <p className="text-gray-400 text-xs font-bold mt-1">
                Бодит цагийн идэвхтэй хэрэглээ
              </p>
            </div>
          </div>
          {/* Mock Line Chart */}
          <div className="h-64 relative bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center p-8">
            <svg
              viewBox="0 0 100 40"
              className="w-full h-full overflow-visible"
            >
              <motion.path
                d="M 0 30 C 10 25, 20 35, 30 20 S 50 10, 70 25 S 90 15, 100 5"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 0 30 C 10 25, 20 35, 30 20 S 50 10, 70 25 S 90 15, 100 5 L 100 40 L 0 40 Z"
                fill="url(#gradient)"
                stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
