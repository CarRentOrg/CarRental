"use client";

import {
  Search,
  CalendarDays,
  Clock,
  Check,
  X,
  Eye,
  X as CloseIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import Image from "next/image";
import MobileBookingCard from "@/components/admin/MobileBookingCard";
import BookingTimeline from "@/components/admin/BookingTimeline";
import { BookingStatus } from "@/constants";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // View Modal / Side Panel State
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalAction, setModalAction] = useState<
    "approve" | "reject" | "complete" | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const isInitialMount = useRef(true);
  const lastFetchedPage = useRef<number | null>(null);

  useEffect(() => {
    if (isInitialMount.current || page !== lastFetchedPage.current) {
      loadBookings();
      isInitialMount.current = false;
      lastFetchedPage.current = page;
    }
  }, [page]);

  async function loadBookings() {
    try {
      setLoading(true);
      const bookings = await api.owner.bookings.getAll();
      const list = Array.isArray(bookings) ? bookings : [];

      setBookings(list);
      setFilteredBookings(list);
      setTotal(list.length);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredBookings(
      bookings.filter((b) => {
        const idMatch = b._id?.toLowerCase().includes(lowerSearch);
        const statusMatch = b.status?.toLowerCase().includes(lowerSearch);
        const nameMatch = b.user?.name?.toLowerCase().includes(lowerSearch);
        const carMatch = b.car?.model?.toLowerCase().includes(lowerSearch);
        return idMatch || statusMatch || nameMatch || carMatch;
      }),
    );
  }, [search, bookings]);

  const openApproveModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalAction("approve");
  };

  const openRejectModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalAction("reject");
    setRejectReason("");
  };

  const openCompleteModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalAction("complete");
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalAction(null);
    setRejectReason("");
  };

  const openViewPanel = (booking: Booking) => {
    setViewBooking(booking);
    setIsViewOpen(true);
  };

  const closeViewPanel = () => {
    setIsViewOpen(false);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking || !modalAction) return;

    try {
      setActionLoading(true);

      if (modalAction === "approve") {
        await api.bookings.approve(selectedBooking._id);
        const updatedStatus = "confirmed" as const;
        updateLocalBookingStatus(selectedBooking._id, updatedStatus);
      } else if (modalAction === "complete") {
        await api.bookings.complete(selectedBooking._id);
        const updatedStatus = "completed" as const;
        updateLocalBookingStatus(selectedBooking._id, updatedStatus);
      } else {
        await api.bookings.reject(selectedBooking._id);
        const updatedStatus = "cancelled" as const;
        updateLocalBookingStatus(selectedBooking._id, updatedStatus);
      }

      toast.success(
        `Booking successfully ${modalAction === "approve" ? "approved" : modalAction === "complete" ? "completed" : "rejected"}`,
      );
      closeModal();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${modalAction} booking`);
    } finally {
      setActionLoading(false);
    }
  };

  const updateLocalBookingStatus = (id: string, status: any) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b)),
    );
    setFilteredBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b)),
    );
  };

  const statusLabel: Record<string, string> = {
    [BookingStatus.Pending]: "Хүлээгдэж буй",
    [BookingStatus.Confirmed]: "Баталгаажсан",
    [BookingStatus.Cancelled]: "Цуцлагдсан",
    [BookingStatus.Completed]: "Дууссан",
    locked: "Түр хаагдсан",
  };

  const columns: Column<Booking>[] = [
    {
      header: "Захиалгын мэдээлэл",
      accessorKey: "_id",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-900 text-xs tracking-wide">
            #{row._id.substring(0, 8)}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            Created:{" "}
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Машин",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-14 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
            <Image
              src={row.car?.thumbnail?.url ?? "/placeholder.jpg"}
              alt={row.car?.model ?? "Unknown Car"}
              className="h-full w-full object-cover"
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none mb-1">
              {row.car?.model || "Unknown Car"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Хугацаа",
      cell: (row) => {
        const start = new Date(row.startDate);
        const end = new Date(row.endDate);
        const days = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span>{days} Хоног</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Status",
      cell: (row) => {
        const colors: Record<string, string> = {
          confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
          pending: "bg-amber-50 text-amber-700 border-amber-100",
          cancelled: "bg-red-50 text-red-600 border-red-100",
          completed: "bg-blue-50 text-blue-700 border-blue-100",
          locked: "bg-zinc-50 text-zinc-700 border-zinc-100",
        };
        const status = row.status || "pending";

        return (
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider border ${colors[status] || colors.pending}`}
            >
              {statusLabel[status] || status}
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
          <button
            onClick={() => openViewPanel(row)}
            className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all border border-gray-100"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === "pending" && (
            <>
              <button
                onClick={() => openApproveModal(row)}
                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all border border-emerald-100"
                title="Approve Booking"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => openRejectModal(row)}
                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all border border-red-100"
                title="Reject Booking"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          {row.status === "confirmed" && (
            <button
              onClick={() => openCompleteModal(row)}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all border border-blue-100"
              title="Mark as Completed"
            >
              <Check className="h-4 w-4" />
            </button>
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

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col w-full">
        <div className="p-4 sm:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-xs sm:text-sm font-medium placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Export
            </button>
          </div>
        </div>

        <div className="p-2 sm:p-4 flex-1 w-full bg-white">
          <div className="hidden md:block">
            <AdminTable
              columns={columns}
              data={filteredBookings}
              loading={loading}
              emptyMessage="No bookings found."
              page={page}
              total={total}
              limit={LIMIT}
              onPageChange={setPage}
            />
          </div>

          <div className="md:hidden space-y-4 px-2 pb-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="h-10 w-10 bg-gray-100 rounded-full mb-4" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <MobileBookingCard
                  key={booking._id}
                  booking={booking}
                  onView={openViewPanel}
                  onApprove={openApproveModal}
                  onReject={openRejectModal}
                  onComplete={openCompleteModal}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-sm font-medium text-gray-400">
                  Захиалга олдсонгүй.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isViewOpen && viewBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeViewPanel}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-xs z-50 flex justify-end"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-60 shadow-2xl flex flex-col border-l border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-900 leading-none mb-1">
                    Захиалгын дэлгэрэнгүй
                  </h2>
                  <p className="text-xs text-gray-500 font-medium tracking-tight uppercase">
                    ID: {viewBooking._id}
                  </p>
                </div>
                <button
                  onClick={closeViewPanel}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Захиалгын явц
                  </h3>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <BookingTimeline status={viewBooking.status as any} />
                  </div>
                </section>

                <section className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Машины мэдээлэл
                    </h4>
                    <div className="flex gap-3">
                      <div className="h-12 w-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                        <Image
                          src={
                            viewBooking.car?.thumbnail?.url ||
                            "/placeholder.jpg"
                          }
                          alt=""
                          className="h-full w-full object-cover"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {viewBooking.car?.brand} {viewBooking.car?.model}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${viewBooking.car?.price_per_day} / хоног
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Хэрэглэгчийн мэдээлэл
                    </h4>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs  text-gray-900">
                        Name:{" "}
                        <span className="text-xs font-semibold text-gray-900">
                          {viewBooking.user?.name || "Unknown"}
                        </span>
                      </span>
                      <span className="text-xs  text-gray-900">
                        Email:{" "}
                        <span className="text-xs font-semibold text-gray-900">
                          {viewBooking.user?.email}
                        </span>
                      </span>
                      <span className="text-xs  text-gray-900">
                        Phone:{" "}
                        <span className="text-xs font-semibold text-gray-900">
                          {viewBooking.user?.phone || "Утас байхгүй"}
                        </span>
                      </span>
                    </div>
                  </div>
                </section>

                <section className="p-6 bg-blue-600 rounded-2xl text-white space-y-4 shadow-xl shadow-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold opacity-80">
                      Нийт төлбөр
                    </span>
                    <span className="text-2xl font-black">
                      ${viewBooking.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold opacity-60">
                        Авах өдөр
                      </span>
                      <span className="text-sm font-bold">
                        {new Date(viewBooking.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold opacity-60">
                        Өгөх өдөр
                      </span>
                      <span className="text-sm font-bold">
                        {new Date(viewBooking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              {viewBooking.status === "pending" && (
                <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-3 bg-white">
                  <button
                    onClick={() => {
                      setIsViewOpen(false);
                      openApproveModal(viewBooking);
                    }}
                    className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    <Check className="h-4 w-4" />
                    Зөвшөөрөх
                  </button>
                  <button
                    onClick={() => {
                      setIsViewOpen(false);
                      openRejectModal(viewBooking);
                    }}
                    className="flex items-center justify-center gap-2 py-4 bg-white border border-red-200 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-50 transition-all"
                  >
                    <X className="h-4 w-4" />
                    Татгалзах
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={selectedBooking !== null && modalAction !== null}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        isLoading={actionLoading}
        title={
          modalAction === "approve"
            ? "Баталгаажуулах"
            : modalAction === "complete"
              ? "Дуусгах"
              : "Татгалзах"
        }
        message={
          modalAction === "approve"
            ? `Та ${selectedBooking?.car?.model || "сонгосон"} машины захиалгыг баталгаажуулахдаа итгэлтэй байна уу?`
            : modalAction === "complete"
              ? `Захиалгыг дууссан гэж тэмдэглэх үү?`
              : `Та ${selectedBooking?.car?.model || "сонгосон"} машины захиалгыг татгалзахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`
        }
        confirmText={
          modalAction === "approve"
            ? "Баталгаажуулах"
            : modalAction === "complete"
              ? "Дуусгах"
              : "Татгалзах"
        }
        type={modalAction === "reject" ? "danger" : "success"}
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
