"use client";

import CarForm from "@/components/admin/CarForm";
import { useRouter, useParams } from "next/navigation"; // Correct hook for App Router params
import { useEffect, useState } from "react";
import { use } from "react";
import { api } from "@/lib/api";
import { Car } from "@/types";
import toast from "react-hot-toast";

export default function AdminEditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resolvedParams.id) {
      loadCar(resolvedParams.id);
    }
  }, [resolvedParams.id]);

  async function loadCar(id: string) {
    try {
      const data = await api.cars.getById(id);
      if (data) setCar(data);
      else {
        alert("Car not found");
        router.push("/admin/cars");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (data: any) => {
    if (!car) return;
    try {
      const carData = {
        brand: data.brand,
        model: data.model,
        type: data.type || "Sedan",
        year: parseInt(data.year),
        price_per_day: parseFloat(data.rates?.daily || data.price_per_day),
        transmission: data.transmission || "Automatic",
        fuel_type: data.fuel_type || "Petrol",
        seats: parseInt(data.seats) || 5,
        image_url: data.thumbnail_url || data.image_url || "",
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

      await api.cars.update(car.id, carData);
      toast.success("Car updated successfully!");
      router.push("/admin/cars");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update car");
    }
  };

  if (loading)
    return <div className="p-12 text-center text-gray-500">Loading car...</div>;
  if (!car) return null;

  return <CarForm initialData={car} onSubmit={handleSubmit} isEditing />;
}
