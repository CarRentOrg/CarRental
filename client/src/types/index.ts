import { Database } from './supabase';

export type Car = Database['public']['Tables']['cars']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type NewsPost = Database['public']['Tables']['news']['Row'];

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
