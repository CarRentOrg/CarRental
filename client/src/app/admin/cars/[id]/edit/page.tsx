"use client";

import CarForm from "@/components/admin/CarForm";
import { mockApi, Car } from "@/lib/mockData";
import { useRouter, useParams } from "next/navigation"; // Correct hook for App Router params
import { useEffect, useState } from "react";
import { use } from "react";

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
      const data = await mockApi.cars.getById(id);
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
      await mockApi.cars.update(car.id, data);
      alert("Car updated successfully!");
      router.push("/admin/cars");
    } catch (error) {
      console.error(error);
      alert("Failed to update car");
    }
  };

  if (loading)
    return <div className="p-12 text-center text-gray-500">Loading car...</div>;
  if (!car) return null;

  return <CarForm initialData={car} onSubmit={handleSubmit} isEditing />;
}
