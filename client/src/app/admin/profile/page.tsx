"use client";

import ProfileForm from "@/components/admin/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            My Profile
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <ProfileForm />
    </div>
  );
}
