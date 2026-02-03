"use client";

import {
  Bell,
  User,
  Car,
  ExternalLink,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  bookingId?: string;
}

interface AdminTopHeaderProps {
  onMenuClick: () => void;
}

export default function AdminTopHeader({ onMenuClick }: AdminTopHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const pathname = usePathname();

  // Close dropdowns on click outside
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Poll for notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // TODO: Implement notifications API endpoint
        // const data = await api.notifications.getAll();
        // setNotifications(data);
        setNotifications([]); // Empty for now
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();

    // Poll every 5 seconds to simulate real-time
    const interval = setInterval(fetchNotifications, 30000); // Changed to 30s to reduce calls
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    // TODO: Implement notifications API endpoint
    // await api.notifications.markAllRead();
    // Optimistic update
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = async (id: string, bookingId?: string) => {
    // TODO: Implement notifications API endpoint
    // await api.notifications.markRead(id);
    // Optimistic update
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setShowNotifications(false);

    if (bookingId) {
      // In a real app, maybe redirect.
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-3 sm:px-6 lg:px-8 sticky top-0 z-30 w-full">
      {/* Left: Hamburger & Welcome */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden xs:block text-[11px] sm:text-sm font-medium text-gray-500">
          Тавтай морил, <span className="text-gray-900 font-bold">Админ</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-0.5 sm:space-x-2 md:space-x-4">
        <Link
          href="/"
          className="flex items-center space-x-1 px-2 py-1.5 rounded-lg text-[11px] sm:text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Сайт руу очих</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all relative"
          >
            <Bell className="h-4.5 w-4.5" />

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-2 right-2 h-1.5 w-1.5 bg-red-500 rounded-full border border-white"
                />
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">
                    Мэдэгдлүүд
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Бүгдийг уншсан
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">
                      Одоогоор мэдэгдэл алга.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.bookingId ? "/admin/bookings" : "#"}
                        onClick={() =>
                          handleNotificationClick(n.id, n.bookingId)
                        }
                      >
                        <div
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-blue-50/50" : ""}`}
                        >
                          <p
                            className={`text-sm text-gray-700 leading-snug ${!n.isRead ? "font-semibold" : ""}`}
                          >
                            {n.message}
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase">
                            {formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-5 w-px bg-gray-100 mx-0.5 sm:mx-1"></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 group outline-none"
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-100 group-hover:scale-105 transition-all">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-black text-gray-900 leading-none">
                Супер Админ
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Удирдлага
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-50 whitespace-nowrap"
              >
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-900">John Doe</p>
                  <p className="text-[10px] font-medium text-gray-400 truncate">
                    admin@carrental.com
                  </p>
                </div>
                <div className="p-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                    <span>Миний Профайл</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span>Тохиргоо</span>
                  </Link>
                </div>
                <div className="p-1 border-t border-gray-50 mt-1">
                  <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left">
                    <LogOut className="h-4 w-4" />
                    <span>Системээс гарах</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
