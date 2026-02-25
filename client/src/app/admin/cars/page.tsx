"use client";

import {
  Search,
  Plus,
  Fuel,
  Settings2,
  Users,
  Trash2,
  X,
  Power,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "@/components/ui/Pagination";
import { api } from "@/lib/api";
import { Car } from "@/types";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 9;

  useEffect(() => {
    loadCars();
  }, [page]);

  async function loadCars() {
    try {
      setLoading(true);
      const data = await api.owner.getCars();
      setCars(data || []);
      setTotal(data?.length || 0);
      setFilteredCars(data || []);
    } catch (error) {
      console.error("Failed to load cars:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAvailability(carId: string) {
    setTogglingId(carId);

    // Optimistic update
    setCars((prev) =>
      prev.map((c) =>
        c._id === carId ? { ...c, is_available: !c.is_available } : c,
      ),
    );

    try {
      await api.owner.toggleAvailability(carId);
      toast.success("Availability updated");
    } catch (error: any) {
      // Revert on error
      setCars((prev) =>
        prev.map((c) =>
          c._id === carId ? { ...c, is_available: !c.is_available } : c,
        ),
      );
      toast.error(error.message || "Failed to toggle availability");
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await api.owner.deleteCar(deleteId);
      setCars((prev) => prev.filter((c) => c._id !== deleteId));
      setDeleteId(null);
      toast.success("Car deleted successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete car");
    }
  }

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredCars(
      cars.filter((c) => {
        const nameMatch = c.model?.toLowerCase().includes(lowerSearch);
        const brandMatch = c.brand?.toLowerCase().includes(lowerSearch);
        return nameMatch || brandMatch;
      }),
    );
  }, [search, cars]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <AdminPageHeader
        title="Машин удирдах"
        description="Автопаркийн мэдээллийг харах болон удирдах."
        breadcrumbs={[
          { label: "Хяналтын самбар", href: "/admin" },
          { label: "Машинууд" },
        ]}
        actions={
          <Link
            href="/admin/cars/new"
            className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100"
          >
            <Plus className="h-5 w-5" />
            <span>машин нэмэх</span>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search cars by name or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 shadow-sm"
                />
              ))
            : filteredCars.map((car) => (
                <motion.div
                  key={car._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative"
                >
                  <div className="aspect-4/3 bg-gray-100 relative overflow-hidden group">
                    <img
                      src={car.thumbnail?.url || ""}
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        car.is_available
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {car.is_available ? "Available" : "Rented"}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
                          {car.brand}
                        </p>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">
                          {car.model}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-black text-xl">
                          ₮{car.price_rates?.daily ?? car.price_per_day}
                        </p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase">
                          / хоног
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl border border-gray-100">
                        <Settings2 className="h-4 w-4 text-gray-400 mb-1" />
                        <span className="text-[10px] font-bold text-gray-600">
                          {car.transmission}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl border border-gray-100">
                        <Fuel className="h-4 w-4 text-gray-400 mb-1" />
                        <span className="text-[10px] font-bold text-gray-600">
                          {car.fuel_type}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl border border-gray-100">
                        <Users className="h-4 w-4 text-gray-400 mb-1" />
                        <span className="text-[10px] font-bold text-gray-600">
                          {car.seats} Seats
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleAvailability(car._id)}
                        disabled={togglingId === car._id}
                        className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold transition-all border ${
                          togglingId === car._id
                            ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400"
                            : car.is_available
                              ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {togglingId === car._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Power className="h-3.5 w-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {car.is_available
                            ? "Set Unavailable"
                            : "Set Available"}
                        </span>
                      </button>
                      <Link
                        href={`/admin/cars/${car._id}/edit`}
                        className="flex-1 py-3 text-center rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all"
                      >
                        Edit Car
                      </Link>
                      <button
                        onClick={() => setDeleteId(car._id)}
                        className="px-4 py-3 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / LIMIT)}
          onPageChange={setPage}
        />
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setDeleteId(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto border-4 border-red-50">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Delete Car?
              </h3>
              <p className="text-center text-gray-500 text-sm mb-8">
                This action cannot be undone. This car will be permanently
                removed from your fleet.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
