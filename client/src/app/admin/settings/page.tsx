"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <AdminPageHeader
        title="Settings"
        description="Configure your admin panel and application preferences."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings" },
        ]}
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
          <Settings className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Settings Configuration
        </h3>
        <p className="text-gray-500 mt-2 text-sm">
          Global settings will be available here.
        </p>
      </div>
    </motion.div>
  );
}
