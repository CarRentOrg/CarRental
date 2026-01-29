import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar />
            <main className="flex-grow p-8">
                <div className="max-w-7xl mx-auto text-white">
                    {children}
                </div>
            </main>
        </div>
    );
}
