"use client";

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
    return (
        <div>
            <AdminPageHeader
                title="Analytics"
                description="Deep dive into your business performance."
                breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Analytics' }]}
            />

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Analytics Dashboard</h3>
                <p className="text-gray-500 mt-2">Detailed charts and reports are coming soon.</p>
            </div>
        </div>
    );
}
