import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Settings,
  LogOut,
  PlusCircle,
  BarChart3,
  Users,
} from "lucide-react";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Car, label: "Manage Cars", href: "/admin/cars" },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900 leading-none">
            Admin
            <span className="text-blue-600 block text-xs uppercase tracking-widest font-bold">
              Panel
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2 mt-4">
        {MENU_ITEMS.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all group"
          >
            <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="pt-8 mb-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
            Quick Actions
          </p>
          <Link
            href="/admin/cars/new"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add New Car</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link
          href="/admin/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
