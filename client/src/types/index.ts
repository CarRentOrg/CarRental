import { Database } from "./supabase";

export type Car = Database["public"]["Tables"]["cars"]["Row"] & {
  year?: number;
  plate_number?: string;
  images?: (string | null)[];
  status?: string;
  rates?: any;
};
export type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
  car?: Car;
  user?: User;
  rate_applied?: string;
};
export type NewsPost = Database["public"]["Tables"]["news"]["Row"];

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  type: "booking_new" | "booking_cancelled" | "car_added" | "user_registered" | any;
  title: string;
  message: string;
  time: string;
  createdAt?: string;
  user?: {
    name: string;
    avatar: string;
  };
}


export interface TitleProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export interface CarData {
  id: string;
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

export interface Car1 {
  id: string;
  name: string;
  images: string[];
}
export interface RENTAL_RATE {
  season: string | null;
  start_date?: string;
  end_date?: string;
  price_per_day: number;
}
