"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Settings,
  LogOut,
  PlusCircle,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Car, label: "Manage Cars", href: "/admin/cars" },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

function SidebarContent({
  isCollapsed,
  onNavigate,
}: {
  isCollapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <Car className="h-6 w-6 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                <span className="text-xl font-black tracking-tight text-gray-900 leading-none">
                  Admin
                  <span className="text-blue-600 block text-xs uppercase tracking-widest font-bold">
                    Panel
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto no-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "group relative flex items-center px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl bg-blue-50/80"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <item.icon
                className={clsx(
                  "h-5 w-5 shrink-0 z-10 transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600",
                )}
              />

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* Quick Action */}
        <div className="pt-6">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
              Quick Actions
            </p>
          )}
          <Link
            href="/admin/cars/new"
            onClick={onNavigate}
            className={clsx(
              "flex items-center px-3 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all",
              isCollapsed ? "justify-center" : "gap-3",
            )}
          >
            <PlusCircle className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Add New Car</span>}
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link
          href="/admin/settings"
          onClick={onNavigate}
          className={clsx(
            "flex items-center px-3 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        <button
          className={clsx(
            "w-full flex items-center px-3 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col bg-white border-r border-gray-100 h-screen sticky top-0 z-40 shrink-0"
    >
      {/* Collapse Toggle - Hidden on small screens as it auto-collapses */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 h-6 w-6 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-50 text-gray-400 hover:text-gray-900 hidden lg:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <SidebarContent isCollapsed={isCollapsed} />
    </motion.aside>
  );
}
