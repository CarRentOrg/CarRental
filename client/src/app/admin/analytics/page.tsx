"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Booking } from "@/types";

export default function AdminAnalyticsPage() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const bookings = await api.owner.bookings.getAll();
        const bookingsList = Array.isArray(bookings) ? bookings : [];

        if (bookingsList.length === 0) {
          setIsEmpty(true);
          setLoading(false);
          return;
        }

        // Process data for last 6 months revenue
        const months = 6;
        const now = new Date();
        const monthlyData = new Array(months).fill(0).map((_, i) => {
          const d = new Date();
          d.setMonth(now.getMonth() - (months - 1 - i));
          return {
            name: d.toLocaleString("default", { month: "short" }),
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            revenue: 0,
            bookings: 0,
          };
        });

        bookingsList.forEach((b) => {
          if (b.status === "confirmed" || b.status === "completed") {
            const date = new Date(b.createdAt);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();

            const targetMonth = monthlyData.find(
              (m) => m.monthIndex === monthIdx && m.year === year,
            );
            if (targetMonth) {
              targetMonth.revenue += b.totalPrice || 0;
              targetMonth.bookings += 1;
            }
          }
        });

        // Check if we actually have data to show (sum of revenue > 0)
        const totalRevenue = monthlyData.reduce(
          (acc, curr) => acc + curr.revenue,
          0,
        );
        if (totalRevenue === 0) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
          setRevenueData(monthlyData);
        }
      } catch (error) {
        console.error("Failed to load analytics", error);
        setIsEmpty(true);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

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

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[400px]">
        <div className="mb-8">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Орлогын тойм
          </h3>
          <p className="text-sm text-gray-400 font-medium">Сүүлийн 6 сар</p>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center animate-pulse">
            <div className="space-y-4 text-center">
              <div className="h-4 w-32 bg-gray-100 rounded mx-auto" />
              <div className="h-3 w-24 bg-gray-50 rounded mx-auto" />
            </div>
          </div>
        ) : isEmpty ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              Одоогоор хангалттай дата алга байна
            </h4>
            <p className="text-sm text-gray-500">
              Захиалга хийгдсэний дараа энд статистик харагдах болно.
            </p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value: number) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontWeight: "bold",
                  }}
                  formatter={(value: any) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
