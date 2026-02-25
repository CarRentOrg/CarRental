"use client";

import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  // Pagination props
  page?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function AdminTable<T extends { _id: string }>({
  columns,
  data,
  loading,
  onRowClick,
  emptyMessage = "No data found.",
  page = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: AdminTableProps<T>) {
  const totalPages = Math.ceil(total / limit);

  // Mobile Card View Rendering
  const renderMobileCard = (row: T) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onClick={() => onRowClick && onRowClick(row)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 mb-4 active:scale-[0.99] transition-transform"
    >
      {columns.map((col, idx) => (
        <div key={idx} className="flex justify-between items-start gap-4">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest shrink-0 mt-0.5">
            {col.header}
          </span>
          <div className="text-right text-sm">
            {col.cell
              ? col.cell(row)
              : col.accessorKey
                ? String(row[col.accessorKey])
                : "-"}
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest ${col.className || ""}`}
                  >
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-colors">
                      {col.header}
                      {col.sortable && (
                        <ArrowUpDown className="h-3 w-3 text-gray-300" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded w-full max-w-[100px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-400 font-medium"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <motion.tr
                    key={row._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`group transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className={`px-6 py-4 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors ${col.className || ""}`}
                      >
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                            ? String(row[col.accessorKey])
                            : "-"}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-xs font-bold text-gray-400">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} results
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl hover:bg-white hover:shadow-sm hover:text-gray-900 text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Show current, first, last, range around current
                  if (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  ) {
                    return (
                      <button
                        key={p}
                        onClick={() => onPageChange?.(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          page === p
                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100"
                            : "text-gray-500 hover:bg-white hover:text-gray-900"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return (
                      <span
                        key={p}
                        className="w-8 text-center text-gray-300 text-xs"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => onPageChange?.(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-xl hover:bg-white hover:shadow-sm hover:text-gray-900 text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 mb-4 animate-pulse border border-gray-100"
            >
              <div className="h-4 w-1/3 bg-gray-100 rounded mb-4" />
              <div className="h-20 w-full bg-gray-50 rounded" />
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <div>
            {data.map((row) => (
              <div key={row._id}>{renderMobileCard(row)}</div>
            ))}
            {/* Mobile Load More / Pagination could go here */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-4 pb-8">
                <button
                  onClick={() => onPageChange?.(page + 1)}
                  disabled={page >= totalPages}
                  className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 shadow-sm disabled:opacity-50"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
