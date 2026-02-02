"use client";

import { Edit2, Trash2, MoreVertical } from "lucide-react";
import { ReactNode } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { motion, AnimatePresence } from "framer-motion";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyMessage?: string;

  // Pagination Props
  page?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  emptyMessage = "No records found.",
  page = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center border bg-white rounded-2xl border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile View: Stacked Cards */}
      <div className="flex flex-col gap-4 lg:hidden w-full">
        {data.map((row, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={row.id || i}
            className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4 w-full"
          >
            <div className="flex justify-between items-start border-b border-gray-50 pb-3">
              <div className="space-y-1">
                {/* Use the first column as the "Title" in mobile view */}
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {columns[0].header}
                </div>
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  {columns[0].cell
                    ? columns[0].cell(row)
                    : (row[columns[0].accessorKey!] as any)}
                </div>
              </div>

              {(onEdit || onDelete) && (
                <div className="flex items-center gap-1.5">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-xl bg-gray-50 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-xl bg-gray-50 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-4 pt-1">
              {columns.slice(1).map((col, j) => (
                <div key={j} className="space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {col.header}
                  </div>
                  <div className="text-[11px] font-medium text-gray-700 leading-normal">
                    {col.cell ? col.cell(row) : (row[col.accessorKey!] as any)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden lg:block bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                {columns.map((col, i) => (
                  <th key={i} className={`px-8 py-5 ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-8 py-5 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row, i) => (
                <motion.tr
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  key={row.id || i}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className="px-8 py-5 font-medium text-gray-700 text-sm"
                    >
                      {col.cell
                        ? col.cell(row)
                        : (row[col.accessorKey!] as any)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {onPageChange && total > 0 && (
        <div className="mt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
