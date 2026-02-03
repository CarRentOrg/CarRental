"use client";

import {
  ArrowLeft,
  Save,
  Upload,
  Car as CarIcon,
  DollarSign,
  Fuel,
  X,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Car } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface CarFormProps {
  initialData?: Car;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export default function CarForm({
  initialData,
  onSubmit,
  isEditing = false,
}: CarFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state including rates
  const [formData, setFormData] = useState({
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    plate_number: initialData?.plate_number || "",
    seats: initialData?.seats || 4,
    transmission: initialData?.transmission || "Automatic",
    fuel_type: initialData?.fuel_type || "Petrol",
    description: initialData?.description || "",
    status: initialData?.is_available === false ? "rented" : "available",
    thumbnail_url: initialData?.thumbnail_url || "",
    rates: {
      daily: initialData?.rates?.daily || initialData?.price_per_day || 0,
      weekly: initialData?.rates?.weekly || 0,
      monthly: initialData?.rates?.monthly || 0,
    },
  });

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRateChange = (
    rateType: "daily" | "weekly" | "monthly",
    value: string,
  ) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        [rateType]: numValue,
      },
    }));
  };

  const handleAddImage = () => {
    // Mock image upload by adding a placeholder
    const newImage = `https://loremflickr.com/640/480/car?random=${Math.random()}`;
    setImages((prev) => [...prev, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        year: Number(formData.year),
        price_per_day: formData.rates.daily, // Sync for backward compatibility
        images,
        imageFile: selectedFile, // Pass the real file
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/cars"
          className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {isEditing ? "Edit Car" : "Add New Car"}
          </h1>
          <p className="text-gray-500 font-medium">
            {isEditing
              ? "Update vehicle details."
              : "Add a new vehicle to the fleet."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-8 space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <CarIcon className="h-5 w-5 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Make / Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                  placeholder="e.g. Tesla"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                  placeholder="e.g. Model S"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  License Plate
                </label>
                <input
                  type="text"
                  name="plate_number"
                  required
                  value={formData.plate_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                  placeholder="e.g. ABC-1234"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Media */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              Media
            </h3>

            {/* Thumbnail */}
            <div className="mb-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Vehicle Image
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="car-image-upload"
                />
                <label
                  htmlFor="car-image-upload"
                  className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Select Image
                </label>
                {formData.thumbnail_url && (
                  <div className="h-20 w-32 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Detail Images */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Gallery Images
                </label>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  + Add Mock Image
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {images.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="aspect-square rounded-xl bg-gray-100 relative group overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col gap-2 items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-500 transition-all"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-xs font-bold">Upload</span>
                  </button>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Specs */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <Fuel className="h-5 w-5 text-blue-600" />
              Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Fuel Type
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  min="2"
                  max="50"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Pricing & Status
            </h3>

            {/* Rates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between">
                  <span>Daily Rate</span>
                  <span className="text-blue-600">&le; 6 days</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.rates.daily || ""}
                    onChange={(e) => handleRateChange("daily", e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between">
                  <span>Weekly Rate</span>
                  <span className="text-blue-600">7+ days</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.rates.weekly || ""}
                    onChange={(e) => handleRateChange("weekly", e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-blue-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-blue-900"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between">
                  <span>Monthly Rate</span>
                  <span className="text-blue-600">30+ days</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.rates.monthly || ""}
                    onChange={(e) =>
                      handleRateChange("monthly", e.target.value)
                    }
                    className="w-full pl-8 pr-4 py-3 bg-purple-50/50 border-none rounded-xl focus:ring-2 focus:ring-purple-600/20 focus:bg-white transition-all font-bold text-purple-900"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Price Validation Warning */}
            {formData.rates.daily < formData.rates.weekly && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-600 text-xs font-bold mb-6">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Warning: Weekly rate is typically lower than daily rate.
                </span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Vehicle Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all font-bold text-gray-900"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{isEditing ? "Save Changes" : "Create Car"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
