"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useOwnerAuth } from "@/contexts/OwnerAuthContext";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ProfileForm() {
  const { user, checkAuth } = useOwnerAuth(); // re-fetch user on update
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Password Form
  const {
    register: registerEx,
    handleSubmit: handleSubmitEx,
    reset: resetEx,
    watch,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onProfileSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await api.auth.updateProfile(data);
      toast.success("Profile updated successfully");
      await checkAuth(); // Refresh context
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await api.auth.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      resetEx();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Info Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gray-50 border-b border-gray-100 relative">
          <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-indigo-50" />
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 flex justify-between items-end">
            <div className="relative group">
              <div className="h-24 w-24 bg-white rounded-2xl p-1 shadow-lg border border-gray-100">
                <div className="h-full w-full bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-black uppercase">
                  {user?.name?.charAt(0) || "A"}
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <form onSubmit={handleSubmit(onProfileSubmit)} className="max-w-4xl">
            {/* Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-black text-gray-900 text-lg">
                  Personal Info
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    {...register("name")}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium disabled:opacity-70 disabled:bg-gray-100/50"
                  />
                  <label className="absolute left-12 -top-1.5 bg-white px-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Full Name
                  </label>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    {...register("email")}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium disabled:opacity-70 disabled:bg-gray-100/50"
                  />
                  <label className="absolute left-12 -top-1.5 bg-white px-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Email Address
                  </label>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    {...register("phone")}
                    disabled={!isEditing}
                    placeholder="Add phone number"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium disabled:opacity-70 disabled:bg-gray-100/50"
                  />
                  <label className="absolute left-12 -top-1.5 bg-white px-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Phone Number
                  </label>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-orange-500" />
            <h3 className="font-black text-gray-900 text-lg">Security</h3>
          </div>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-xl"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form
            onSubmit={handleSubmitEx(onPasswordSubmit)}
            className="max-w-2xl bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4"
          >
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                {...registerEx("currentPassword", { required: true })}
                placeholder="Current Password"
                className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type={showPassword ? "text" : "password"}
                {...registerEx("newPassword", { required: true })}
                placeholder="New Password"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <input
                type={showPassword ? "text" : "password"}
                {...registerEx("confirmPassword", { required: true })}
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  resetEx();
                }}
                className="px-4 py-2 text-gray-500 font-bold hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <KeyRound className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Password</p>
                <p className="text-xs text-gray-500">
                  Keep your account secure
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
