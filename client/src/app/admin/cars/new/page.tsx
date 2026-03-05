"use client";

import { useRouter } from "next/navigation";
import CarForm, { CarFormData } from "@/components/admin/CarForm";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { useState } from "react";

export default function AdminNewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    data: CarFormData,
    thumbnailFile: File | null,
    galleryFiles: File[],
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("carData", JSON.stringify(data));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else {
        showToast.error("Thumbnail image is required");
        setLoading(false);
        return;
      }

      // Append gallery images (optional)
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      await api.owner.addCar(formData);
      showToast.success("Car created successfully!");
      router.push("/admin/cars");
    } catch (error: any) {
      console.error("Failed to create car:", error);
      showToast.error(error?.message || "Failed to create car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CarForm
      onSubmit={handleSubmit}
      isLoading={loading}
      onCancel={() => router.push("/admin/cars")}
    />
  );
}
