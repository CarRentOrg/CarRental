"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import CarForm from "@/components/admin/CarForm";

export default function AdminNewCarPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("brand", data.brand);
      formData.append("model", data.model);
      formData.append("year", data.year.toString());
      formData.append("price_per_day", data.price_per_day.toString());
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      await api.owner.addCar(formData);
      alert("Car created successfully!");
      router.push("/admin/cars");
    } catch (error) {
      console.error(error);
      alert("Failed to create car");
    }
  };

  return <CarForm onSubmit={handleSubmit} />;
}
