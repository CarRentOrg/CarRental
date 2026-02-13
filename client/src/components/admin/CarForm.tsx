"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Upload,
  Save,
  Loader2,
  Car as CarIcon,
  Settings2,
  DollarSign,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Car } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";

// Zod Schema matching the Car interface
const carSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  type: z.string().min(1, "Type is required"),
  transmission: z.enum(["automatic", "manual"]),
  fuel_type: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  seats: z.number().min(1),
  price_per_day: z.number().min(0),
  price_rates: z.object({
    daily: z.number().min(0),
    weekly: z.number().min(0),
    monthly: z.number().min(0),
  }),
  description: z.string().optional(),
  features: z.string().optional(),
  location: z.string().optional(),
  is_available: z.boolean(),
});

type CarFormValues = z.infer<typeof carSchema>;

interface CarFormProps {
  initialData?: Car;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function CarForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}: CarFormProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail?.url || null,
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images?.map((img) => img.url) || [],
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: initialData?.name || "",
      brand: initialData?.brand || "",
      model: initialData?.model || "",
      year: initialData?.year || new Date().getFullYear(),
      type: initialData?.type || "Sedan",
      transmission: initialData?.transmission || "automatic",
      fuel_type: initialData?.fuel_type || "petrol",
      seats: initialData?.seats || 5,
      price_per_day: initialData?.price_per_day || 0,
      price_rates: {
        daily: initialData?.price_rates?.daily || 0,
        weekly: initialData?.price_rates?.weekly || 0,
        monthly: initialData?.price_rates?.monthly || 0,
      },
      description: initialData?.description || "",
      features: initialData?.features?.join(", ") || "",
      location: initialData?.location || "",
      is_available: initialData?.is_available ?? true,
    },
  });

  const dailyPrice = watch("price_per_day");
  useEffect(() => {
    if (!initialData && dailyPrice > 0) {
      setValue("price_rates.daily", dailyPrice);
      setValue("price_rates.weekly", dailyPrice * 7 * 0.9);
      setValue("price_rates.monthly", dailyPrice * 30 * 0.8);
    }
  }, [dailyPrice, initialData, setValue]);

  const onFormSubmit = async (data: CarFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("year", data.year.toString());
    formData.append("type", data.type);
    formData.append("transmission", data.transmission);
    formData.append("fuel_type", data.fuel_type);
    formData.append("seats", data.seats.toString());
    formData.append("price_per_day", data.price_per_day.toString());
    formData.append("description", data.description || "");
    formData.append("location", data.location || "");
    formData.append("is_available", String(data.is_available));

    formData.append("price_rates[daily]", data.price_rates.daily.toString());
    formData.append("price_rates[weekly]", data.price_rates.weekly.toString());
    formData.append(
      "price_rates[monthly]",
      data.price_rates.monthly.toString(),
    );

    if (data.features) {
      const featureList = data.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      featureList.forEach((f) => formData.append("features[]", f));
    }

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const jsonPayload = {
      ...data,
      features:
        data.features
          ?.split(",")
          ?.map((f) => f.trim())
          ?.filter(Boolean) || [],
    };
    formData.append("carData", JSON.stringify(jsonPayload));

    await onSubmit(formData);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const initialCount = initialData?.images?.length || 0;
    if (index >= initialCount) {
      const newIndex = index - initialCount;
      setImageFiles((prev) => prev.filter((_, idx) => idx !== newIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-4xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {initialData ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Fill in the details below to {initialData ? "update" : "create"} a
            car Listing.
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
        <section>
          <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6 group">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CarIcon className="h-4 w-4" />
            </span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Brand
              </label>
              <input
                {...register("brand")}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Tesla"
              />
              {errors.brand && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Model Name
              </label>
              <input
                {...register("model")}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Model 3"
              />
              {errors.model && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.model.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Internal Name / Title
              </label>
              <input
                {...register("name")}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Tesla Model 3 Long Range"
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Year
              </label>
              <input
                type="number"
                {...register("year", { valueAsNumber: true })}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.year && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        <section>
          <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6 group">
            <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mr-3 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Settings2 className="h-4 w-4" />
            </span>
            Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Type
              </label>
              <select
                {...register("type")}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Transmission
              </label>
              <select
                {...register("transmission")}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Fuel Type
              </label>
              <select
                {...register("fuel_type")}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Seats
              </label>
              <input
                type="number"
                {...register("seats", { valueAsNumber: true })}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register("location")}
                  className="w-full pl-10 pr-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
                  placeholder="e.g. Ulaanbaatar, Sukhbaatar District"
                />
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        <section>
          <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6 group">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="h-4 w-4" />
            </span>
            Pricing & Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Base Daily Price
              </label>
              <input
                type="number"
                {...register("price_per_day", { valueAsNumber: true })}
                className="w-full px-5 py-3 bg-emerald-50 border-none rounded-xl font-bold text-emerald-900"
              />
              {errors.price_per_day && (
                <p className="text-xs text-red-500">
                  {errors.price_per_day.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Daily Rate (1-6 days)
              </label>
              <input
                type="number"
                {...register("price_rates.daily", { valueAsNumber: true })}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Weekly Rate (7+ days)
              </label>
              <input
                type="number"
                {...register("price_rates.weekly", { valueAsNumber: true })}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Monthly Rate (30+ days)
              </label>
              <input
                type="number"
                {...register("price_rates.monthly", { valueAsNumber: true })}
                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        <section>
          <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6 group">
            <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center mr-3 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <ImageIcon className="h-4 w-4" />
            </span>
            Images
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Thumbnail Image (Required)
              </label>
              <div className="flex gap-4 items-start">
                <div className="relative w-40 aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  {thumbnailPreview ? (
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Main image displayed in lists.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Gallery Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group"
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="cursor-pointer aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-xs font-bold">Add</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900"
          />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{initialData ? "Save Changes" : "Create Vehicle"}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
