"use client";

import { Search, Mail, Phone, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { mockApi, User } from "@/lib/mockData";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { motion } from "framer-motion";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  useEffect(() => {
    loadCustomers();
  }, [page]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredCustomers(
      customers.filter(
        (c) =>
          (c.full_name && c.full_name.toLowerCase().includes(lowerSearch)) ||
          (c.email && c.email.toLowerCase().includes(lowerSearch)),
      ),
    );
  }, [search, customers]);

  async function loadCustomers() {
    try {
      setLoading(true);
      const response = await mockApi.customers.getAll({ page, limit: LIMIT });
      setCustomers(response.data || []);
      setTotal(response.total || 0);
      setFilteredCustomers(response.data || []);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<
    User & { total_bookings?: number; total_spent?: number }
  >[] = [
    {
      header: "User",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={
              row.avatar_url ||
              `https://ui-avatars.com/api/?name=${row.full_name}&background=random`
            }
            alt=""
            className="h-10 w-10 rounded-full bg-gray-100 object-cover border border-gray-100"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {row.full_name}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              {row.role}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Info",
      cell: (row) => (
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span>{row.email}</span>
          </div>
          {row.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Joined",
      cell: (row) => (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>{new Date(row.created_at).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: "Stats",
      cell: (row) => (
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Bookings
            </span>
            <span className="text-sm font-black text-gray-900">
              {row.total_bookings || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Spent
            </span>
            <span className="text-sm font-black text-emerald-600">
              ${(row.total_spent || 0).toLocaleString()}
            </span>
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
        title="Customers"
        description="View and manage user accounts."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Customers" },
        ]}
      />

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all text-sm font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="p-4">
          <AdminTable
            columns={columns}
            data={filteredCustomers}
            loading={loading}
            emptyMessage="No customers found."
            // Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </div>
      </div>
    </motion.div>
  );
}
