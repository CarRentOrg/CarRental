"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  DollarSign,
  Car,
  CalendarDays,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Booking, DashboardStats } from "@/types"; // Ensure these types exist or are inferred
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardData, bookingsData] = await Promise.all([
          api.owner.dashboard(),
          api.owner.bookings.getAll(),
        ]);

        setStats(dashboardData);

        // Ensure bookings is an array and sort by date (newest first) if not already
        const bookingsList = Array.isArray(bookingsData) ? bookingsData : [];
        // Assuming API returns sorted, but just in case
        const sortedBookings = [...bookingsList].sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setRecentBookings(sortedBookings.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    {
      title: "Нийт орлого",
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "...",
      icon: DollarSign,
      color: "emerald",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Нийт машин",
      value: stats ? stats.totalCars : "...",
      icon: Car,
      color: "orange",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "Нийт захиалга",
      value: stats ? stats.totalBookings : "...",
      icon: CalendarDays,
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Хүлээгдэж буй",
      value: stats ? stats.pendingBookings : "...",
      icon: Clock,
      color: "purple",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-100";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <AdminPageHeader
        title="Хяналтын самбар"
        description="Тавтай морил, Админ! Өнөөдрийн мэдээллийг эндээс харна уу"
      />

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} shadow-sm`}>
                <stat.icon className={`h-6 w-6 ${stat.text}`} />
              </div>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 2. Car Usage Status */}
        <div className="xl:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-none">
                Машины төлөв
              </h3>
              <p className="text-sm text-gray-400 font-medium mt-1">
                Одоогийн байдлаар
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Ашиглагдаж байгаа
                </span>
                <span className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                  {stats ? stats.carStatus.rented : 0}
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Ашиглагдаагүй
                </span>
                <span className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {stats ? stats.carStatus.available : 0}
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Нийт машин</span>
              <span className="font-bold text-gray-900">
                {stats ? stats.totalCars : 0}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden flex">
              <div
                className="bg-blue-500 h-full"
                style={{
                  width:
                    stats && stats.totalCars > 0
                      ? `${(stats.carStatus.rented / stats.totalCars) * 100}%`
                      : "0%",
                }}
              />
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width:
                    stats && stats.totalCars > 0
                      ? `${(stats.carStatus.available / stats.totalCars) * 100}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. Recent Activities */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              Сүүлийн үйлдлүүд
            </h3>
            <Link
              href="/admin/bookings"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Бүгдийг харах
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking, i) => (
                <div
                  key={booking._id}
                  onClick={() =>
                    router.push(`/admin/bookings?id=${booking._id}`)
                  } // Or open modal/detail page if implemented
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        Шинэ захиалга бүртгэгдлээ
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {booking.car?.brand} {booking.car?.model} -{" "}
                        {(booking.user as any)?.name || "Guest"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(booking.status)}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="uppercase">{booking.status}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                Одоогоор шинэ үйлдэл алга байна.
              </div>
            )}

            {recentBookings.length > 0 && (
              <button
                onClick={() => router.push("/admin/bookings")}
                className="w-full py-3 mt-2 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-2"
              >
                <span>Бүгдийг харах</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
