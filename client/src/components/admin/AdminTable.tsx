"use client";

import { Edit2, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (row: T) => ReactNode;
    className?: string;
}

interface AdminTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    emptyMessage?: string;
}

export function AdminTable<T extends { id: string }>({
    columns,
    data,
    loading,
    onEdit,
    onDelete,
    emptyMessage = "No records found."
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

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                            {columns.map((col, i) => (
                                <th key={i} className={`px-8 py-5 ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && <th className="px-8 py-5 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((row, i) => (
                            <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors group">
                                {columns.map((col, j) => (
                                    <td key={j} className="px-8 py-5 font-medium text-gray-700 text-sm">
                                        {col.cell ? col.cell(row) : (row[col.accessorKey!] as any)}
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
