import mongoose, { Document, Schema } from "mongoose";

export interface ICar extends Omit<Document, "model"> {
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  transmission: "automatic" | "manual";
  fuel_type: "petrol" | "diesel" | "electric" | "hybrid";
  seats: number;
  price_per_day: number;
  price_rates: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  is_available: boolean;
  thumbnail: { url: string; fileId: string };
  images?: { url: string; fileId: string }[];
  description?: string;
  features?: string[];
  location?: string;
  ownerId?: mongoose.Types.ObjectId;
}

const carSchema = new Schema<ICar>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    type: { type: String, required: true },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      required: true,
    },
    fuel_type: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      required: true,
    },
    seats: { type: Number, required: true },
    price_per_day: { type: Number, required: true },
    price_rates: {
      type: {
        hourly: { type: Number, required: false },
        daily: { type: Number, required: false },
        weekly: { type: Number, required: false },
        monthly: { type: Number, required: false },
      },
    },
    is_available: { type: Boolean, default: true },
    thumbnail: {
      url: { type: String, required: true },
      fileId: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: false },
        fileId: { type: String, required: false },
      },
    ],
    description: { type: String },
    features: { type: [String] },
    location: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

carSchema.index({ ownerId: 1 });

export default mongoose.model<ICar>("Car", carSchema);
