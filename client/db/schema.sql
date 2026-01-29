create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    phone text,
    role text default 'customer',
    -- admin | customer
    created_at timestamp with time zone default now()
);
-- Cars table
create table public.cars (
    id uuid primary key default gen_random_uuid(),
    brand text not null,
    model text not null,
    year int,
    price_per_day numeric not null,
    transmission text,
    -- automatic / manual
    fuel text,
    seats int,
    image_url text,
    is_available boolean default true,
    created_at timestamp with time zone default now()
);
-- Bookings table
create table public.bookings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade,
    car_id uuid references public.cars(id) on delete cascade,
    start_date date not null,
    end_date date not null,
    total_price numeric,
    status text default 'pending',
    -- pending | confirmed | cancelled
    created_at timestamp with time zone default now()
);
create table public.payments (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid references public.bookings(id) on delete cascade,
    amount numeric not null,
    method text,
    -- qpay | card | cash
    status text default 'paid',
    created_at timestamp with time zone default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for
select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for
update using (auth.uid() = id);
alter table cars enable row level security;
create policy "Anyone can view cars" on cars for
select using (true);
-- Categories table (Optional)
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);
-- Car Requests table
CREATE TABLE car_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    car_model TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- News / Blog table
CREATE TABLE news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_mn TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_mn TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
