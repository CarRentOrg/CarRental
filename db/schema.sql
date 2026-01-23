-- Cars table
CREATE TABLE cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    type TEXT NOT NULL,
    -- e.g., Sedan, SUV, Luxury
    price_per_day NUMERIC NOT NULL,
    image_url TEXT,
    transmission TEXT NOT NULL,
    -- e.g., Automatic, Manual
    fuel_type TEXT NOT NULL,
    -- e.g., Petrol, Diesel, Electric
    seats INTEGER NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Bookings table
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    -- pending, confirmed, cancelled
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Categories table (Optional)
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);