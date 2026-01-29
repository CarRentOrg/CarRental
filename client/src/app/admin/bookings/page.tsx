"use client";

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Booking } from '@/types'; // Make sure Booking is imported
import { AdminTable, Column } from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadBookings();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        setFilteredBookings(
            bookings.filter(b =>
                (b.id && b.id.toLowerCase().includes(lowerSearch)) ||
                (b.status && b.status.toLowerCase().includes(lowerSearch))
            )
        );
    }, [search, bookings]);

    async function loadBookings() {
        try {
            setLoading(true);
            const data = await api.bookings.getAll();
            setBookings(data || []);
            setFilteredBookings(data || []);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(booking: Booking) {
        if (!confirm(`Are you sure you want to delete booking #${booking.id}?`)) return;

        try {
            await api.bookings.delete(booking.id);
            setBookings(prev => prev.filter(b => b.id !== booking.id));
        } catch (error) {
            alert('Failed to delete booking');
            console.error(error);
        }
    }

    const columns: Column<Booking>[] = [
        {
            header: "Booking ID",
            accessorKey: "id",
            className: "font-black text-blue-600 text-xs",
            cell: (row) => `#${row.id.substring(0, 8)}`
        },
        {
            header: "Car ID",
            accessorKey: "car_id",
            className: "text-gray-500 text-xs"
        },
        {
            header: "Date Range",
            cell: (row) => (
                <div className="flex flex-col text-xs font-medium">
                    <span className="text-gray-900">From: {new Date(row.start_date).toLocaleDateString()}</span>
                    <span className="text-gray-500">To: {new Date(row.end_date).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            header: "Total Price",
            cell: (row) => <span className="font-bold text-gray-900">${row.total_price}</span>
        },
        {
            header: "Status",
            cell: (row) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${row.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    row.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {row.status || 'Pending'}
                </span>
            )
        },
        {
            header: "Created At",
            cell: (row) => <span className="text-xs text-gray-400">{new Date(row.created_at).toLocaleDateString()}</span>
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <AdminPageHeader
                title="Bookings"
                description="Manage customer reservations and track status."
                breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Bookings' }]}
            />

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID or status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="p-4">
                    <AdminTable
                        columns={columns}
                        data={filteredBookings}
                        loading={loading}
                        onDelete={handleDelete}
                        emptyMessage="No bookings found."
                    />
                </div>
            </div>
        </div>
    );
}
