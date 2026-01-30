"use client";

import { Search, CalendarDays, DollarSign, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { mockApi, Booking } from "@/lib/mockData";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { motion } from "framer-motion";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  useEffect(() => {
    loadBookings();
  }, [page]); // Reload when page changes

  useEffect(() => {
    // Client-side search filtering (ideal world: server-side search)
    const lowerSearch = search.toLowerCase();
    setFilteredBookings(
      bookings.filter(
        (b) =>
          (b.id && b.id.toLowerCase().includes(lowerSearch)) ||
          (b.status && b.status.toLowerCase().includes(lowerSearch)) ||
          b.user?.full_name?.toLowerCase().includes(lowerSearch) ||
          b.car?.name?.toLowerCase().includes(lowerSearch),
      ),
    );
  }, [search, bookings]);

  async function loadBookings() {
    try {
      setLoading(true);
      // Use mockApi with pagination
      const response = await mockApi.bookings.getAll({ page, limit: LIMIT });
      setBookings(response.data || []);
      setTotal(response.total || 0);
      setFilteredBookings(response.data || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(booking: Booking) {
    if (
      !confirm(
        `Are you sure you want to delete booking #${booking.id.substring(0, 8)}?`,
      )
    )
      return;

    try {
      await mockApi.bookings.delete(booking.id);
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      setFilteredBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (error) {
      alert("Failed to delete booking");
      console.error(error);
    }
  }

  const columns: Column<Booking>[] = [
    {
      header: "Booking info",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-900 text-xs tracking-wide">
            #{row.id.substring(0, 8)}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            Created: {new Date(row.created_at).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.user?.avatar_url ||
              `https://ui-avatars.com/api/?name=${row.user?.full_name}&background=random`
            }
            alt=""
            className="h-9 w-9 rounded-full bg-gray-100 object-cover border border-gray-100"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none mb-1">
              {row.user?.full_name || "Unknown User"}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {row.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Vehicle",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-14 rounded-lg bg-gray-100 overflow-hidden relative">
            <img
              src={row.car?.thumbnail_url || row.car?.images?.[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none mb-1">
              {row.car?.name || "Unknown Car"}
            </span>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600 uppercase">
                {row.car?.plate_number}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Duration & Rate",
      cell: (row) => {
        const start = new Date(row.start_date);
        const end = new Date(row.end_date);
        const days = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              <span>{days} Days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  row.rate_applied === "daily"
                    ? "bg-gray-100 text-gray-600"
                    : row.rate_applied === "weekly"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-purple-50 text-purple-600"
                }`}
              >
                {row.rate_applied} Rate
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Total Price",
      cell: (row) => (
        <div className="flex flex-col items-end">
          <span className="font-black text-gray-900 text-base">
            ${row.total_price.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 font-bold">
            $
            {(
              row.total_price /
              Math.ceil(
                (new Date(row.end_date).getTime() -
                  new Date(row.start_date).getTime()) /
                  (1000 * 60 * 60 * 24),
              )
            ).toFixed(0)}{" "}
            / day
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const colors = {
          confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
          pending: "bg-amber-100 text-amber-700 border-amber-200",
          cancelled: "bg-red-50 text-red-600 border-red-100",
          completed: "bg-blue-50 text-blue-700 border-blue-100",
        };
        const status = row.status as keyof typeof colors;

        return (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colors[status] || colors.pending}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <AdminPageHeader
        title="Bookings"
        description="Manage customer reservations and track status."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Bookings" },
        ]}
      />

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all text-sm font-medium placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Download CSV
            </button>
          </div>
        </div>

        <div className="p-4 flex-1">
          <AdminTable
            columns={columns}
            data={filteredBookings}
            loading={loading}
            onDelete={handleDelete}
            emptyMessage="No bookings found."
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
