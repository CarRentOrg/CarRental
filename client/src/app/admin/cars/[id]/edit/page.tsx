"use client";

import CarForm, { CarFormData } from "@/components/admin/CarForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";
import { api } from "@/lib/api";
import { Car } from "@/types";
import toast from "react-hot-toast";

function getChangedFields(
  original: Car,
  updated: CarFormData,
): Partial<CarFormData> {
  const changes: Record<string, any> = {};

  // Simple scalar fields
  const scalarKeys: (keyof CarFormData)[] = [
    "brand",
    "model",
    "year",
    "transmission",
    "fuel_type",
    "seats",
    "price_per_day",
    "location",
    "description",
    "is_available",
  ];

  for (const key of scalarKeys) {
    const origVal = (original as any)[key];
    const newVal = (updated as any)[key];
    if (origVal !== newVal && newVal !== undefined) {
      changes[key] = newVal;
    }
  }

  // Compare price_rates (nested object)
  if (updated.price_rates) {
    const origRates = original.price_rates || ({} as any);
    const newRates = updated.price_rates;
    if (
      Number(origRates.daily) !== newRates.daily ||
      Number(origRates.hourly || 0) !== Number(newRates.hourly || 0) ||
      Number(origRates.weekly || 0) !== Number(newRates.weekly || 0)
    ) {
      changes.price_rates = newRates;
    }
  }

  // Compare features array
  const origFeatures = (original.features || []).sort().join(",");
  const newFeatures = (updated.features || []).sort().join(",");
  if (origFeatures !== newFeatures) {
    changes.features = updated.features;
  }

  return changes as Partial<CarFormData>;
}

export default function AdminEditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (
    data: CarFormData,
    thumbnailFile: File | null,
    galleryFiles: File[],
  ) => {
    if (!car) return;

    const changedFields = getChangedFields(car, data);
    const hasFieldChanges = Object.keys(changedFields).length > 0;
    const hasNewFiles = !!thumbnailFile || galleryFiles.length > 0;

    if (!hasFieldChanges && !hasNewFiles) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      // Only send changed fields (or full data if there are file uploads,
      // since the backend might need context for file association)
      const dataToSend = hasNewFiles ? data : changedFields;
      formData.append("carData", JSON.stringify(dataToSend));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      await api.owner.updateCar(car._id, formData);
      toast.success("Car updated successfully!");
      router.push("/admin/cars");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update car");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="p-12 text-center text-gray-500">Loading car...</div>;
  if (!car) return null;

  return (
    <CarForm
      initialData={car}
      onSubmit={handleSubmit}
      isLoading={submitting}
      onCancel={() => router.push("/admin/cars")}
    />
  );
}
