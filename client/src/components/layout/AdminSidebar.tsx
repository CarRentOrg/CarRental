"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  BarChart3,
  Users,
  Settings,
  X,
  Plus,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOwnerAuth } from "@/contexts/OwnerAuthContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useOwnerAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.owner.bookings.getPending();
        setPendingCount(res.count || 0);
      } catch (e) {
        console.error("Failed to fetch pending count", e);
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      title: "Хяналтын самбар",
      icon: LayoutDashboard,
      href: "/admin",
      exact: true,
    },
    {
      title: "Машин удирдах",
      icon: Car,
      href: "/admin/cars",
    },
    {
      title: "Захиалгууд",
      icon: CalendarDays,
      href: "/admin/bookings",
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      title: "Тайлан / Статистик",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      title: "Харилцагчид",
      icon: Users,
      href: "/admin/customers",
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <Link href="/admin" className="flex flex-col group">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-600 rounded-xl p-2 text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <Car className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Admin
            </h1>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">
            Panel
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-2">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span>{item.title}</span>
              </div>

              {item.badge ? (
                <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-orange-100 animate-pulse relative z-10">
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="h-4 w-4 text-blue-400 relative z-10" />
              ) : null}
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-gray-100">
          <p className="px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">
            хурдан үйлдэл
          </p>
          <Link
            href="/admin/cars/new"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className="flex items-center gap-3 px-4 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 group hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5"
          >
            <div className="bg-white/20 p-1 rounded-lg">
              <Plus className="h-4 w-4" />
            </div>
            <span>Машин нэмэх</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-white rounded-xl transition-all font-bold text-sm mb-1"
        >
          <Settings className="h-4 w-4" />
          <span>Тохиргоо</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all font-bold text-sm group"
        >
          <LogOut className="h-4 w-4 group-hover:text-white transition-colors" />
          <span>Гарах</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
