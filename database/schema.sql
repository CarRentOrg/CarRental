-- ============================================
-- Car Rental Database Schema
-- ============================================
-- Users table (Custom authentication)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    -- 'user' | 'admin' | 'owner'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Cars table
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INT,
    price_per_day NUMERIC NOT NULL,
    transmission TEXT,
    -- 'automatic' | 'manual'
    fuel TEXT,
    seats INT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Profiles table (linked to auth.users if using Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'customer',
    -- 'admin' | 'customer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC,
    status TEXT DEFAULT 'pending',
    -- 'pending' | 'confirmed' | 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    method TEXT,
    -- 'qpay' | 'card' | 'cash'
    status TEXT DEFAULT 'paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);
-- Car Requests table
CREATE TABLE IF NOT EXISTS public.car_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    car_model TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- News / Blog table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_mn TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_mn TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_cars_availability ON public.cars(is_available);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car ON public.bookings(car_id);
-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
-- Users can view own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- Anyone can view cars
CREATE POLICY "Anyone can view cars" ON public.cars FOR
SELECT USING (true);
-- ============================================
-- Sample Admin User (Password: admin123)
-- Hash generated with bcrypt cost 10
-- ============================================
INSERT INTO public.users (name, email, password, role)
VALUES (
        'Admin User',
        'admin@gmail.com',
        '$2b$10$52oES/MbMuY8NMzq2uNqROXqzvdo9xfs8FX5.zPreQziOgEmG2HWi',
        'admin'
    ) ON CONFLICT (email) DO
UPDATE
SET password = EXCLUDED.password,
    role = EXCLUDED.role;