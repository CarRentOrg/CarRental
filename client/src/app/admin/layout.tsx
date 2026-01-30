import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopHeader from "@/components/admin/AdminTopHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminTopHeader />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
