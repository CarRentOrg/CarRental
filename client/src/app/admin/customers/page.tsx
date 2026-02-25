"use client";

import { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

interface CustomerData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt: string;
  totalBookings: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const res = await api.owner.getBookingUsers();
      const data = (res as any)?.data || res || [];
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredCustomers(
      customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q),
      ),
    );
  }, [search, customers]);

  const columns: Column<CustomerData>[] = [
    {
      header: "Нэр",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-100">
            {row.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{row.name}</p>
            <p className="text-[10px] text-gray-400 font-medium capitalize">
              {row.role || "user"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Холбоо барих",
      cell: (row) => (
        <div>
          <p className="text-sm text-gray-700 font-medium">{row.email}</p>
          <p className="text-xs text-gray-400">{row.phone || "Утас байхгүй"}</p>
        </div>
      ),
    },
    {
      header: "Бүртгүүлсэн огноо",
      cell: (row) => (
        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Статистик",
      cell: (row) => (
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Bookings
            </p>
            <p className="text-sm font-bold text-gray-900">
              {row.totalBookings}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Spent
            </p>
            <p className="text-sm font-bold text-blue-600">
              ₮{row.totalSpent?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <AdminPageHeader
        title="Харилцагчид"
        description="Бүртгэлтэй болон захиалга өгсөн хэрэглэгчдийн жагсаалт."
        breadcrumbs={[
          { label: "Хяналтын самбар", href: "/admin" },
          { label: "Харилцагчид" },
        ]}
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-8 border-b border-gray-100">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:outline-none transition-all text-sm font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="p-2 sm:p-4">
          <AdminTable
            columns={columns}
            data={filteredCustomers}
            loading={loading}
            emptyMessage="No customers found."
            page={page}
            total={filteredCustomers.length}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </div>
      </div>
    </motion.div>
  );
}
