"use client";

import { useRouter } from "next/navigation";
import CarForm from "@/components/admin/CarForm";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminNewCarPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      await api.owner.addCar(formData);
      toast.success("Car created successfully!");
      router.push("/admin/cars");
    } catch (error: any) {
      console.error("Failed to create car:", error);
      toast.error(error?.message || "Failed to create car");
    }
  };

  return <CarForm onSubmit={handleSubmit} />;
}
