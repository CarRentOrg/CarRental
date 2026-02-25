"use client";

import { useForm, SubmitHandler, Resolver, Path } from "react-hook-form";
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
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Eye,
  Fuel,
  Users,
  Trash2,
  Info,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Car } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import type { UseFormRegister, UseFormGetFieldState } from "react-hook-form";

// --- Schema for Form State (String-based numbers) ---
// We treat numbers as strings here to fix mobile keyboard issues and "0" defaults
const carFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1900, {
    message: "Invalid year",
  }),
  type: z.string().min(1, "Car type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuel_type: z.string().min(1, "Fuel type is required"),
  seats: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
    message: "Seats must be at least 1",
  }),
  price_rates: z.object({
    daily: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be positive",
    }),
    hourly: z.string().optional(),
    weekly: z.string().optional(),
  }),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  is_available: z.boolean().default(true),
  images: z.array(z.string()).optional(),
});

type CarFormValues = z.infer<typeof carFormSchema>;

// --- Final Submission Schema (Numbers) ---
// Used to type the data passed to the onSubmit prop
export type CarFormData = {
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  price_per_day: number;
  price_rates: {
    daily: number;
    hourly?: number;
    weekly?: number;
  };
  location: string;
  description?: string;
  features?: string[];
  is_available: boolean;
  images?: string[];
};

interface CarFormProps {
  initialData?: Car;
  onSubmit: (
    data: CarFormData,
    thumbnailFile: File | null,
    galleryFiles: File[],
  ) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: "Basic Info", icon: CarIcon },
  { id: 2, title: "Specs & Price", icon: Settings2 },
  { id: 3, title: "Images", icon: ImageIcon },
  { id: 4, title: "Review", icon: Eye },
];

// --- Premium Reusable Input Component (defined OUTSIDE CarForm to prevent remount on re-render) ---
const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  options,
  className,
  register,
  getFieldState,
  ...props
}: {
  label: string;
  name: Path<CarFormValues>;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
  register: UseFormRegister<CarFormValues>;
  getFieldState: UseFormGetFieldState<CarFormValues>;
  [key: string]: any;
}) => {
  const { error } = getFieldState(name);

  const containerClasses = "space-y-1.5";
  const labelClasses =
    "text-xs font-bold text-gray-700 uppercase tracking-wide ml-1";
  const inputBaseClasses = `w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-300 placeholder:font-normal`;
  const errorInputClasses =
    "border-red-300 focus:border-red-500 focus:ring-red-500/10";

  return (
    <div className={`${containerClasses} ${className || ""}`}>
      <label htmlFor={name} className={labelClasses}>
        {label}
      </label>

      {type === "select" ? (
        <div className="relative">
          <select
            id={name}
            {...register(name)}
            className={`${inputBaseClasses} appearance-none cursor-pointer ${
              error ? errorInputClasses : ""
            }`}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronRight className="h-4 w-4 rotate-90" />
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          className={`${inputBaseClasses} min-h-[120px] resize-none ${
            error ? errorInputClasses : ""
          }`}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type === "number" ? "text" : type}
          inputMode={type === "number" ? "numeric" : undefined}
          step={type === "number" ? "any" : undefined}
          {...register(name)}
          placeholder={placeholder}
          className={`${inputBaseClasses} ${error ? errorInputClasses : ""}`}
          {...props}
        />
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"
        >
          <Info className="h-3 w-3" />
          {error.message}
        </motion.p>
      )}
    </div>
  );
};

export default function CarForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: CarFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail?.url || null,
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || [],
  );

  // Initialize form with string values for numbers
  const defaultValues: CarFormValues = initialData
    ? {
        brand: initialData.brand,
        model: initialData.model,
        year: String(initialData.year),
        type: initialData.type || "sedan",
        transmission: initialData.transmission,
        fuel_type: initialData.fuel_type,
        seats: String(initialData.seats),
        price_rates: {
          daily: String(
            initialData.price_rates?.daily || initialData.price_per_day || 0,
          ),
          hourly: initialData.price_rates?.hourly
            ? String(initialData.price_rates.hourly)
            : "",
          weekly: initialData.price_rates?.weekly
            ? String(initialData.price_rates.weekly)
            : "",
        },
        location: initialData.location || "",
        description: initialData.description || "",
        features: initialData.features || [],
        is_available: initialData.is_available,
        images: initialData.images?.map((img: any) => img.url) || [],
      }
    : {
        brand: "",
        model: "",
        year: String(new Date().getFullYear()),
        type: "sedan",
        transmission: "automatic",
        fuel_type: "petrol",
        seats: "5",
        price_rates: { daily: "", hourly: "", weekly: "" },
        location: "",
        is_available: true,
        description: "",
        features: [],
      };

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getFieldState,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const formData = watch();

  // --- Drag & Drop for Thumbnail ---
  const onDropThumbnail = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }, []);

  const {
    getRootProps: getThumbRootProps,
    getInputProps: getThumbInputProps,
    isDragActive: isThumbDragActive,
  } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
  } as any);

  // --- Drag & Drop for Gallery Images ---
  const onDropGallery = useCallback((acceptedFiles: File[]) => {
    setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...acceptedFiles.map((f) => URL.createObjectURL(f)),
    ]);
  }, []);

  const removeGalleryImage = useCallback((index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => {
      const url = prev[index];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
    isDragActive: isGalleryDragActive,
  } = useDropzone({
    onDrop: onDropGallery,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 5,
  } as any);

  // --- Navigation & Validation ---
  const nextStep = async () => {
    let fieldsToValidate: (keyof CarFormValues | string)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["brand", "model", "year", "type"];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "transmission",
        "fuel_type",
        "seats",
        "location",
        "price_rates.daily",
      ];
    } else if (currentStep === 3) {
      if (!thumbnailPreview && !thumbnailFile) {
        toast.error("Thumbnail image is required");
        return;
      }
      // "description" is optional, so no strict validation needed unless we add rules
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      // Double check thumbnail on step 3 exit
      if (currentStep === 3 && !thumbnailPreview) {
        toast.error("Please upload a thumbnail image");
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFinalSubmit: SubmitHandler<CarFormValues> = async (data) => {
    if (!thumbnailPreview && !thumbnailFile) {
      toast.error("Thumbnail is required");
      return;
    }

    // Convert string values back to numbers for API
    const submissionData: CarFormData = {
      ...data,
      name: `${data.brand} ${data.model}`.trim(),
      year: Number(data.year),
      seats: Number(data.seats),
      price_per_day: Number(data.price_rates.daily),
      price_rates: {
        daily: Number(data.price_rates.daily),
        hourly: data.price_rates.hourly
          ? Number(data.price_rates.hourly)
          : undefined,
        weekly: data.price_rates.weekly
          ? Number(data.price_rates.weekly)
          : undefined,
      },
      features: data.features || [],
      images: data.images || [],
    };

    await onSubmit(submissionData, thumbnailFile, galleryFiles);
  };

  // FormInput is now defined outside CarForm — no inline definition needed here.

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden max-w-4xl mx-auto">
      {/* Header / Progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 md:px-10 md:py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              {initialData ? "Edit Vehicle" : "Add New Vehicle"}
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-1">
              Complete the steps below to list a car.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Improved Progress Bar */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-out -translate-y-1/2"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />

          <div className="relative flex justify-between">
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-3 cursor-default"
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 border-4 border-white ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                        : isCompleted
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <step.icon className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 hidden md:block ${
                      isActive || isCompleted
                        ? "text-blue-600"
                        : "text-gray-300"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 min-h-[400px]">
        <form
          onSubmit={handleSubmit(handleFinalSubmit as any)}
          className="max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: BASIC INFO */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    register={register}
                    getFieldState={getFieldState}
                    label="Brand"
                    name="brand"
                    placeholder="e.g. Toyota, BMW"
                  />
                  <FormInput
                    register={register}
                    getFieldState={getFieldState}
                    label="Model"
                    name="model"
                    placeholder="e.g. Camry, X5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormInput
                    register={register}
                    getFieldState={getFieldState}
                    label="Year"
                    name="year"
                    type="number"
                    placeholder="2024"
                  />
                  <FormInput
                    register={register}
                    getFieldState={getFieldState}
                    label="Body Type"
                    name="type"
                    type="select"
                    options={[
                      { value: "sedan", label: "Sedan" },
                      { value: "suv", label: "SUV" },
                      { value: "coupe", label: "Coupe" },
                      { value: "luxury", label: "Luxury" },
                      { value: "van", label: "Van" },
                      { value: "truck", label: "Truck" },
                      { value: "hatchback", label: "Hatchback" },
                    ]}
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: SPECS & PRICING */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Specs Section */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2">
                    SPECIFICATIONS
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormInput
                      register={register}
                      getFieldState={getFieldState}
                      label="Transmission"
                      name="transmission"
                      type="select"
                      options={[
                        { value: "automatic", label: "Automatic" },
                        { value: "manual", label: "Manual" },
                      ]}
                    />
                    <FormInput
                      register={register}
                      getFieldState={getFieldState}
                      label="Fuel Type"
                      name="fuel_type"
                      type="select"
                      options={[
                        { value: "petrol", label: "Petrol" },
                        { value: "diesel", label: "Diesel" },
                        { value: "hybrid", label: "Hybrid" },
                        { value: "electric", label: "Electric" },
                      ]}
                    />
                    <FormInput
                      register={register}
                      getFieldState={getFieldState}
                      label="Seats"
                      name="seats"
                      type="number"
                      placeholder="5"
                    />
                  </div>
                  <FormInput
                    register={register}
                    getFieldState={getFieldState}
                    label="Location"
                    name="location"
                    placeholder="e.g. Ulaanbaatar, MN"
                  />
                </div>

                {/* Pricing Section */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    PRICING{" "}
                    <span className="text-xs font-normal text-gray-400">
                      (MNT)
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      register={register}
                      getFieldState={getFieldState}
                      label="Daily Rate (Required)"
                      name="price_rates.daily"
                      type="number"
                      placeholder="150000"
                    />
                    <FormInput
                      register={register}
                      getFieldState={getFieldState}
                      label="Hourly Rate (Optional)"
                      name="price_rates.hourly"
                      type="number"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: IMAGES */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">
                      Main Thumbnail (Required)
                    </label>
                    {thumbnailPreview && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThumbnailFile(null);
                          setThumbnailPreview(null);
                        }}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div
                    {...getThumbRootProps()}
                    className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center relative overflow-hidden group min-h-[250px] flex flex-col items-center justify-center ${
                      isThumbDragActive
                        ? "border-blue-500 bg-blue-50"
                        : thumbnailPreview
                          ? "border-gray-200 bg-gray-50 hover:border-blue-300"
                          : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-white"
                    }`}
                  >
                    <input {...(getThumbInputProps() as any)} />

                    {thumbnailPreview ? (
                      <div className="absolute inset-0 w-full h-full">
                        <Image
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          fill
                          className="object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                          <Upload className="h-8 w-8 mb-2" />
                          <p className="font-bold">Click to Replace</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 px-6 py-8">
                        <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Upload className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            Click or drag image here
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Supports JPG, PNG (Max 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images (Optional) */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">
                      Other Images (Optional)
                    </label>
                    <span className="text-xs text-gray-400 font-medium">
                      {galleryPreviews.length}/5 uploaded
                    </span>
                  </div>

                  {/* Preview Grid */}
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryPreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-4/3 rounded-xl overflow-hidden border border-gray-100 group bg-gray-50"
                        >
                          <Image
                            src={src}
                            alt={`Gallery ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            aria-label="Remove image"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropzone */}
                  {galleryPreviews.length < 5 && (
                    <div
                      {...getGalleryRootProps()}
                      className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center py-8 px-4 ${
                        isGalleryDragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-white"
                      }`}
                    >
                      <input {...(getGalleryInputProps() as any)} />
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                          <Upload className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-bold text-gray-600">
                          Click or drag images here
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG, WebP — up to 5 images
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <FormInput
                    register={register}
                    getFieldState={getFieldState}
                    label="Description (Optional)"
                    name="description"
                    type="textarea"
                    placeholder="Describe the car's features, condition, etc..."
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex gap-4 items-start">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">
                      Summary Review
                    </h4>
                    <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                      Please review the car details below. This is how it will
                      appear to customers.
                    </p>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="max-w-sm mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden ring-1 ring-black/5">
                  <div className="aspect-4/3 bg-gray-100 relative">
                    <img
                      src={
                        thumbnailPreview ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      Available
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                          {formData.brand || "Brand"}
                        </p>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">
                          {formData.model || "Model"} {formData.year}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-black text-xl">
                          ₮
                          {Number(
                            formData.price_rates?.daily || 0,
                          ).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                          per day
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50">
                      <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50">
                        <Settings2 className="h-4 w-4 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-600 capitalize">
                          {formData.transmission || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-600 capitalize">
                          {formData.fuel_type || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-600">
                          {formData.seats || "-"} Seats
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {formData.location || "Location not set"}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER ACTIONS */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 hover:shadow-xl hover:shadow-gray-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-10 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm & Create
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
