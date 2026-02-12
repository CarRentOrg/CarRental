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
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { api } from "@/lib/api";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Хяналтын самбар", href: "/admin" },
  { icon: Car, label: "Машин удирдах", href: "/admin/cars" },
  { icon: CalendarCheck, label: "Захиалгууд", href: "/admin/bookings" },
  { icon: BarChart3, label: "Тайлан / Статистик", href: "/admin/analytics" },
  { icon: Users, label: "Харилцагчид", href: "/admin/customers" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({
  isCollapsed,
  onNavigate,
  onCloseMobile,
}: {
  isCollapsed: boolean;
  onNavigate?: () => void;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await api.owner.dashboard();
        setPendingCount(stats.totalPending);
      } catch (err) {
        console.error("Failed to load sidebar stats", err);
      }
    }
    loadStats();
    // Refresh every minute to stay updated
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Logo & Close Button (Mobile) */}
      <div className="p-6 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-3 overflow-hidden"
        >
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

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto no-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          const handleClick = () => {
            if (onNavigate) onNavigate();
            if (onCloseMobile) onCloseMobile();
          };

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleClick}
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
                    className="ml-3 z-10 whitespace-nowrap flex-1 flex items-center justify-between"
                  >
                    {item.label}
                    {item.href === "/admin/bookings" && pendingCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {pendingCount}
                      </span>
                    )}
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
              Хурдан үйлдэл
            </p>
          )}
          <Link
            href="/admin/cars/new"
            onClick={() => {
              if (onNavigate) onNavigate();
              if (onCloseMobile) onCloseMobile();
            }}
            className={clsx(
              "flex items-center px-3 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all",
              isCollapsed ? "justify-center" : "gap-3",
            )}
          >
            <PlusCircle className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Машин нэмэх</span>}
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link
          href="/admin/settings"
          onClick={() => {
            if (onNavigate) onNavigate();
            if (onCloseMobile) onCloseMobile();
          }}
          className={clsx(
            "flex items-center px-3 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Тохиргоо</span>}
        </Link>
        <button
          className={clsx(
            "w-full flex items-center px-3 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Гарах</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false); // Mobile sidebar shouldn't "collapse" to 80px icons
      } else {
        // Restore desktop collapse state if needed, or keep it expanded by default
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-[2px] z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Overlay (Mobile) / Fixed (Desktop) */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : -300) : 0,
          width: isMobile ? 280 : isCollapsed ? 80 : 260,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className={clsx(
          "flex flex-col bg-white border-r border-gray-100 h-screen z-50",
          isMobile ? "fixed inset-y-0 left-0" : "sticky top-0 shrink-0",
          "text-[12px] sm:text-[13px] md:text-sm", // Text size reduction
        )}
        style={{
          // On mobile, we don't want the sidebar element to push the flex content
          position: isMobile ? "fixed" : ("sticky" as any),
          flexBasis: isMobile ? 0 : undefined,
          minWidth: isMobile ? 0 : undefined,
        }}
      >
        {/* Collapse Toggle - Hidden on mobile */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 h-6 w-6 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-50 text-gray-400 hover:text-gray-900 hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <SidebarContent
          isCollapsed={isMobile ? false : isCollapsed}
          onCloseMobile={onClose}
        />
      </motion.aside>
    </>
  );
}
