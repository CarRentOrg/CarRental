export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string;
          model: string;
          brand: string;
          type: string;
          price_per_day: number;
          image_url: string;
          thumbnail_url: string | null;
          rates: Json | null; // or Json
          transmission: string;
          fuel_type: string;
          seats: number;
          description: string;
          is_available: boolean;
          max_speed_kmh: number | null;
          acceleration_sec: number | null;
          horsepower: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          model: string;
          brand: string;
          type: string;
          price_per_day: number;
          image_url: string;
          thumbnail_url?: string | null;
          rates?: Json | null;
          transmission: string;
          fuel_type: string;
          seats: number;
          description: string;
          is_available?: boolean;
          max_speed_kmh?: number | null;
          acceleration_sec?: number | null;
          horsepower?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          model?: string;
          brand?: string;
          type?: string;
          price_per_day?: number;
          image_url?: string;
          thumbnail_url?: string | null;
          rates?: Json | null;
          transmission?: string;
          fuel_type?: string;
          seats?: number;
          description?: string;
          is_available?: boolean;
          max_speed_kmh?: number | null;
          acceleration_sec?: number | null;
          horsepower?: number | null;
          created_at?: string;
        };
      };
      car_requests: {
        Row: {
          id: string;
          user_name: string;
          user_email: string;
          car_model: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          user_email: string;
          car_model: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_name?: string;
          user_email?: string;
          car_model?: string;
          message?: string;
          created_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title_en: string;
          title_mn: string;
          content_en: string;
          content_mn: string;
          image_url: string;
          author: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_mn: string;
          content_en: string;
          content_mn: string;
          image_url: string;
          author: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_mn?: string;
          content_en?: string;
          content_mn?: string;
          image_url?: string;
          author?: string;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          car_id: string;
          user_id: string | null;
          start_date: string;
          end_date: string;
          total_price: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          car_id: string;
          user_id?: string | null;
          start_date: string;
          end_date: string;
          total_price: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          car_id?: string;
          user_id?: string | null;
          start_date?: string;
          end_date?: string;
          total_price?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
