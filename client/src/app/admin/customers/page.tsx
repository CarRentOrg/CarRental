"use client";

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Mail, Search } from 'lucide-react';

export default function AdminCustomersPage() {
    return (
        <div>
            <AdminPageHeader
                title="Customers"
                description="View and manage your customer base."
                breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Customers' }]}
            />

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Customers Found</h3>
                <p className="text-gray-500 mt-2">Your customer list is currently empty or syncing.</p>
            </div>
        </div>
    );
}
