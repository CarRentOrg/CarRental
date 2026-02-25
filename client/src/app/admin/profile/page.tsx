"use client";

import ProfileForm from "@/components/admin/ProfileForm";
import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Profile Section */}
      <div className="w-full">
        <ProfileForm />
      </div>
    </motion.div>
  );
}
