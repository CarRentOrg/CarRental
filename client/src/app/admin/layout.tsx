import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopHeader from '@/components/admin/AdminTopHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            <AdminSidebar />
            <div className="flex-grow flex flex-col min-h-screen">
                <AdminTopHeader />
                <main className="p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
