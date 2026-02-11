import { ReactNode } from "react";

/* Car Type */
export interface Car {
  price_per_week: any;
  rate_applied: ReactNode;
  _id: string; // MongoDB ID
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  transmission: "automatic" | "manual";
  fuel_type: "petrol" | "diesel" | "electric" | "hybrid";
  seats: number;
  price_per_day?: number;
  price_rates?: {
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
  ownerId?: string;
  created_at?: string;
  updated_at?: string;
}

/* Booking Type */
export interface Booking {
  _id: string;
  car: Car;
  car_id: string;
  user: User;
  user_id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus?: "pending" | "paid" | "failed";
  rateApplied?: string;
  createdAt?: string;
  updatedAt?: string;
  note?: string;
}

/* User Type */
/* ---------------------------------- */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "owner";
  phone?: string;
  created_at: string;
}

/* News Type */
export interface NewsPost {
  _id: string;
  title: string;
  content: string;
  authorId?: string;
  created_at: string;
  updated_at?: string;
}

/* Activity Type */
export interface Activity {
  id: string;
  type:
    | "booking_new"
    | "booking_cancelled"
    | "car_added"
    | "user_registered"
    | string;
  title: string;
  message: string;
  time: string;
  createdAt?: string;
  user?: {
    name: string;
    avatar: string;
  };
}
/* Rental Rate Type */
export interface RentalRate {
  season?: string | null;
  start_date?: string;
  end_date?: string;
  price_per_day: number;
}

/* Simplified Car for listings */
export interface CarListing {
  _id: string;
  name: string;
  images: string[];
  price_per_day: number;
  is_available: boolean;
}

/* Car Data for frontend */
export interface CarData {
  _id: string;
  name: string;
  brand: string;
  type: string;
  price_per_day: number;
  image_url: {
    main: string;
    gallery: string[];
  };
  transmission: "Automatic" | "Manual";
  fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  seats: number;
  description: string;
  is_available: boolean;
  created_at?: string;
}
