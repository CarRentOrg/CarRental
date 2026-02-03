"use client";

import {
  Search,
  CalendarDays,
  DollarSign,
  Clock,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { mockApi, Booking } from "@/lib/mockData";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  useEffect(() => {
    loadBookings();
  }, [page]); // Reload when page changes

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredBookings(
      bookings.filter((b) => {
        const idMatch = b.id?.toLowerCase().includes(lowerSearch);
        const statusMatch = b.status?.toLowerCase().includes(lowerSearch);
        const nameMatch = b.user?.full_name
          ?.toLowerCase()
          .includes(lowerSearch);
        const carMatch = (b.car?.name || b.car?.model)
          ?.toLowerCase()
          .includes(lowerSearch);
        return idMatch || statusMatch || nameMatch || carMatch;
      }),
    );
  }, [search, bookings]);

  async function loadBookings() {
    try {
      setLoading(true);
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

  const openApproveModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalAction("approve");
  };

  const openRejectModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalAction("reject");
    setRejectReason("");
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalAction(null);
    setRejectReason("");
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking || !modalAction) return;

    try {
      setActionLoading(true);

      if (modalAction === "approve") {
        await mockApi.bookings.approve(selectedBooking.id);

        // Update local state
        const updatedBookings = bookings.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: "confirmed" as const }
            : b,
        );
        setBookings(updatedBookings);
        setFilteredBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBooking.id
              ? { ...b, status: "confirmed" as const }
              : b,
          ),
        );
      } else {
        await mockApi.bookings.reject(selectedBooking.id);

        // Update local state
        const updatedBookings = bookings.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: "cancelled" as const }
            : b,
        );
        setBookings(updatedBookings);
        setFilteredBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBooking.id
              ? { ...b, status: "cancelled" as const }
              : b,
          ),
        );
      }

      closeModal();
    } catch (error: any) {
      alert(error.message || `Failed to ${modalAction} booking`);
    } finally {
      setActionLoading(false);
    }
  };

  const columns: Column<Booking>[] = [
    {
      header: "Захиалгын мэдээлэл",
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
      header: "Хэрэглэгчид",
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
      header: "Машин",
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
      header: "Хугацаа / Үнэ",
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
              <span>{days} Хоног</span>
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
      header: "Нийт үнэ",
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
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colors[status] || colors.pending}`}
            >
              {row.status}
            </span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          {row.status === "pending" && (
            <>
              <button
                onClick={() => openApproveModal(row)}
                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all"
                title="Approve Booking"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => openRejectModal(row)}
                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all"
                title="Reject Booking"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
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
        title="Захиалгууд"
        description="Харилцагчдын захиалгыг удирдах болон төлөвийг хянах."
        breadcrumbs={[
          { label: "Хяналтын самбар", href: "/admin" },
          { label: "Захиалгууд" },
        ]}
      />

      <div className="bg-white rounded-4xl sm:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col w-full">
        <div className="p-4 sm:p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all text-xs sm:text-sm font-medium placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 bg-gray-900 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Export
            </button>
          </div>
        </div>

        <div className="p-2 sm:p-4 flex-1 w-full">
          <AdminTable
            columns={columns}
            data={filteredBookings}
            loading={loading}
            emptyMessage="No bookings found."
            // Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={selectedBooking !== null && modalAction !== null}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        isLoading={actionLoading}
        title={modalAction === "approve" ? "Баталгаажуулах" : "Татгалзах"}
        message={
          modalAction === "approve"
            ? `Та ${selectedBooking?.car?.name || selectedBooking?.car?.model || "сонгосон"} машины захиалгыг баталгаажуулахдаа итгэлтэй байна уу?`
            : `Та ${selectedBooking?.car?.name || selectedBooking?.car?.model || "сонгосон"} машины захиалгыг татгалзахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`
        }
        confirmText={modalAction === "approve" ? "Баталгаажуулах" : "Татгалзах"}
        type={modalAction === "approve" ? "success" : "danger"}
      >
        {modalAction === "reject" && (
          <div className="mt-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
              Татгалзах шалтгаан (заавал биш)
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-gray-700"
              rows={3}
              placeholder="e.g., Давхардсан, Машин байхгүй..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        )}
      </ConfirmationModal>
    </motion.div>
  );
}
