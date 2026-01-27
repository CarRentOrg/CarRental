export interface Car {
  id: string;
  model: string;
  brand: string;
  type: string;
  price_per_day: number;
  image_url: string;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  seats: number;
  description: string;
  is_available: boolean;
  created_at?: string;
}

export interface Booking {
  id: string;
  car_id: string;
  user_id?: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at?: string;
  car?: Car;
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

export interface NewsPost {
  id: string;
  title_en: string;
  title_mn: string;
  content_en: string;
  content_mn: string;
  image_url: string;
  author: string;
  created_at: string;
}
