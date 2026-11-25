-- ============================================================
-- Supabase Schema for Room Booking App
-- Run this script in your Supabase Project: SQL Editor -> New Query
-- ============================================================

-- 1. Create 'rooms' table
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    room_type TEXT NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL,
    capacity INT NOT NULL DEFAULT 2,
    image_url TEXT NOT NULL,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 4.9,
    reviews_count INT DEFAULT 50,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'bookings' table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INT NOT NULL,
    guests_count INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Allow anyone to read rooms
DROP POLICY IF EXISTS "Public can view rooms" ON public.rooms;
CREATE POLICY "Public can view rooms"
    ON public.rooms FOR SELECT
    USING (true);

-- Allow public to insert rooms (for seed utility)
DROP POLICY IF EXISTS "Public can insert rooms" ON public.rooms;
CREATE POLICY "Public can insert rooms"
    ON public.rooms FOR INSERT
    WITH CHECK (true);

-- Allow public to create bookings
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
CREATE POLICY "Public can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

-- Allow public to read their bookings
DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
CREATE POLICY "Public can view bookings"
    ON public.bookings FOR SELECT
    USING (true);

-- 5. Seed initial room data
INSERT INTO public.rooms (id, name, description, room_type, price_per_night, capacity, image_url, amenities, rating, reviews_count)
VALUES
  (
    'r1-deluxe-ocean',
    'Deluxe Ocean Panorama Suite',
    'Perched high above the azure coastline, this suite features floor-to-ceiling glass walls, a private teak balcony, and soothing ocean sounds.',
    'Suite',
    280,
    2,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Ocean View', 'King Bed', 'Private Balcony', 'High-Speed Wi-Fi', 'Espresso Machine', 'Marble Bath'],
    4.95,
    128
  ),
  (
    'r2-alpine-chalet',
    'Nordic Pine Chalet',
    'Cozy timber-accented room with a stone fireplace, handcrafted wool furnishings, and breathtaking alpine valley views.',
    'Chalet',
    195,
    3,
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Mountain View', 'Fireplace', 'Queen + Twin Bed', 'Breakfast Included', 'Heated Floors'],
    4.88,
    94
  ),
  (
    'r3-urban-penthouse',
    'Executive Skyline Penthouse',
    'Modern minimalist luxury in the city center with 360-degree skyline views, dedicated workspace, and designer acoustics.',
    'Penthouse',
    350,
    4,
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    ARRAY['City View', '2 King Beds', 'Ergonomic Work Desk', 'Smart Room Controls', 'Cocktail Bar'],
    4.92,
    156
  ),
  (
    'r4-garden-sanctuary',
    'Zen Botanical Garden Villa',
    'Nestled within lush tropical foliage with an outdoor rain shower, private plunge pool, and natural stone finishes.',
    'Villa',
    240,
    2,
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Private Pool', 'Outdoor Rain Shower', 'King Bed', 'Organic Toiletries', 'Yoga Mats'],
    4.97,
    82
  ),
  (
    'r5-cozy-studio',
    'Artisan Heritage Studio',
    'Charming boutique studio featuring exposed brickwork, custom mid-century lighting, and a fully equipped kitchenette.',
    'Studio',
    120,
    2,
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Kitchenette', 'Queen Bed', 'Smart TV', 'Fast Wi-Fi', 'Café on Ground Floor'],
    4.79,
    210
  ),
  (
    'r6-family-suite',
    'Grand Coastal Family Retreat',
    'Spacious dual-bedroom layout designed for families, featuring a game lounge, full kitchen, and steps to the sand.',
    'Family Suite',
    320,
    5,
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ARRAY['Beach Access', '2 Bedrooms', 'Full Kitchen', 'Living Room', 'Washer/Dryer', 'Kids Board Games'],
    4.89,
    115
  )
ON CONFLICT (id) DO NOTHING;

