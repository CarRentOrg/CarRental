"use client";

import CarForm from "@/components/admin/CarForm";
import { mockApi } from "@/lib/mockData";
import { useRouter } from "next/navigation";

export default function AdminNewCarPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await mockApi.cars.create({
        ...data,
        image_url: `https://loremflickr.com/640/480/car?random=${Math.random()}`,
      });
      alert("Car created successfully!");
      router.push("/admin/cars");
    } catch (error) {
      console.error(error);
      alert("Failed to create car");
    }
  };

  return <CarForm onSubmit={handleSubmit} />;
}
