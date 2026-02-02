"use client";

import {
  Users,
  Car,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { mockApi, Activity } from "@/lib/mockData"; // Use mockApi
import { motion } from "framer-motion";

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
    newCustomers: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, activityData] = await Promise.all([
          mockApi.stats.getDashboard(),
          mockApi.stats.getRecentActivity(),
        ]);
        setStats(statsData);
        setActivities(activityData || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const STAT_CARDS = [
    {
      label: "Нийт орлого",
      value: `$${stats.revenue.toLocaleString()}`,
      change: "+12.5%",
      isUp: true,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Нийт захиалга",
      value: stats.bookings.toString(),
      change: "+8.2%",
      isUp: true,
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Нийт машин",
      value: stats.activeFleet.toString(),
      change: "-2.1%",
      isUp: false,
      icon: Car,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Шинэ хэрэглэгчид",
      value: stats.newCustomers.toString(),
      change: "+18.4%",
      isUp: true,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-12"
    >
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Хяналтын самбар
        </h1>
        <p className="text-gray-500 font-medium">
          Тавтай морил, Админ! Өнөөдрийн мэдээллийг эндээс харна уу.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm font-bold ${stat.isUp ? "text-emerald-500" : "text-red-500"}`}
              >
                <span>{stat.change}</span>
                {stat.isUp ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-gray-900">
                {loading ? "..." : stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fleet Distribution */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8 lg:col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Машинуудын төлөв
            </h2>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Түрээслэгдэх боломжтой</span>
                <span className="text-gray-900">
                  {stats.activeFleet > 0
                    ? Math.floor(stats.activeFleet * 0.7)
                    : 0}{" "}
                  Машин
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Түрээслэгдсэн</span>
                <span className="text-gray-900">
                  {stats.activeFleet > 0
                    ? Math.floor(stats.activeFleet * 0.2)
                    : 0}{" "}
                  Машин
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "20%" }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Засвартай</span>
                <span className="text-gray-900">
                  {stats.activeFleet > 0
                    ? Math.floor(stats.activeFleet * 0.1)
                    : 0}{" "}
                  Машин
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "10%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Сүүлийн үйлдлүүд
            </h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            {loading ? (
              <p className="text-sm text-gray-400">
                Үйлдлийг ачааллаж байна...
              </p>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                      activity.type === "booking_new"
                        ? "bg-blue-500"
                        : activity.type === "booking_cancelled"
                          ? "bg-red-500"
                          : activity.type === "car_added"
                            ? "bg-emerald-500"
                            : "bg-purple-500"
                    }`}
                  />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      {new Date(activity.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                      {activity.message}
                    </p>
                    {activity.user && (
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={activity.user.avatar}
                          className="h-4 w-4 rounded-full"
                          alt=""
                        />
                        <span className="text-[10px] text-gray-500 font-medium">
                          {activity.user.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {activities.length === 0 && !loading && (
              <p className="text-sm text-gray-400">
                Сүүлийн үйлдэл байхгүй байна.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
