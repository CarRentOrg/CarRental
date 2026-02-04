export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            cars: {
                Row: {
                    id: string
                    brand: string
                    model: string
                    type: string
                    year: number | null
                    price_per_day: number
                    transmission: string | null
                    fuel_type: string | null
                    seats: number | null
                    image_url: string | null
                    thumbnail_url: string | null
                    description: string | null
                    is_available: boolean
                    rates: Json | null
                    max_speed_kmh: number | null
                    acceleration_sec: number | null
                    horsepower: number | null
                    created_at: string
                    owner_id: string | null
                }
                Insert: {
                    id?: string
                    brand: string
                    model: string
                    type: string
                    year?: number | null
                    price_per_day: number
                    transmission?: string | null
                    fuel_type?: string | null
                    seats?: number | null
                    image_url?: string | null
                    thumbnail_url?: string | null
                    description?: string | null
                    is_available?: boolean
                    rates?: Json | null
                    max_speed_kmh?: number | null
                    acceleration_sec?: number | null
                    horsepower?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    brand?: string
                    model?: string
                    type?: string
                    year?: number | null
                    price_per_day?: number
                    transmission?: string | null
                    fuel_type?: string | null
                    seats?: number | null
                    image_url?: string | null
                    thumbnail_url?: string | null
                    description?: string | null
                    is_available?: boolean
                    rates?: Json | null
                    max_speed_kmh?: number | null
                    acceleration_sec?: number | null
                    horsepower?: number | null
                    created_at?: string
                }
            }
            car_requests: {
                Row: {
                    id: string
                    user_name: string
                    user_email: string
                    car_model: string
                    message: string
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_name: string
                    user_email: string
                    car_model: string
                    message: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_name?: string
                    user_email?: string
                    car_model?: string
                    message?: string
                    status?: string
                    created_at?: string
                }
            }
            car_details: {
                Row: {
                    id: string
                    car_id: string
                    image_gallery: Json[]
                    price_rate: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    car_id: string
                    image_gallery?: Json[]
                    price_rate?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    car_id?: string
                    image_gallery?: Json[]
                    price_rate?: Json
                    created_at?: string
                }
            }
            news: {
                Row: {
                    id: string
                    title_en: string
                    title_mn: string
                    content_en: string
                    content_mn: string
                    image_url: string
                    author: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title_en: string
                    title_mn: string
                    content_en: string
                    content_mn: string
                    image_url: string
                    author: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title_en?: string
                    title_mn?: string
                    content_en?: string
                    content_mn?: string
                    image_url?: string
                    author?: string
                    created_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    car_id: string
                    user_id: string | null
                    start_date: string
                    end_date: string
                    total_price: number
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    car_id: string
                    user_id?: string | null
                    start_date: string
                    end_date: string
                    total_price: number
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    car_id?: string
                    user_id?: string | null
                    start_date?: string
                    end_date?: string
                    total_price?: number
                    status?: string
                    created_at?: string
                }
            }
            users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    password: string
                    role: string
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    password: string
                    role?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    password?: string
                    role?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
