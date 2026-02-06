"use client";

import { useRouter } from "next/navigation";
import CarForm from "@/components/admin/CarForm";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminNewCarPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // Create car data object
      const carData = {
        brand: data.brand,
        model: data.model,
        type: data.type || "Sedan",
        year: parseInt(data.year),
        price_per_day: parseFloat(data.rates?.daily || data.price_per_day),
        transmission: data.transmission || "Automatic",
        fuel_type: data.fuel_type || "Petrol",
        seats: parseInt(data.seats) || 5,
        image_url: data.thumbnail_url || "", // Use thumbnail as main image for now
        thumbnail_url: data.thumbnail_url || null,
        description: data.description || "",
        is_available: data.status === "available",
        rates: data.rates || null,
        max_speed_kmh: data.max_speed_kmh ? parseInt(data.max_speed_kmh) : null,
        acceleration_sec: data.acceleration_sec
          ? parseFloat(data.acceleration_sec)
          : null,
        horsepower: data.horsepower ? parseInt(data.horsepower) : null,
      };

      await api.owner.addCar(carData);
      toast.success("Car created successfully!");
      router.push("/admin/cars");
    } catch (error: any) {
      console.error("Failed to create car:", error);
      toast.error(error?.message || "Failed to create car");
    }
  };

  return <CarForm onSubmit={handleSubmit} />;
}
