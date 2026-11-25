# LuxeStay - Room Booking App

A modern, responsive Room Booking Application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## 🌟 Key Features

1. **Room Catalog from Supabase**
   - Displays a rich collection of rooms with high-resolution imagery, pricing per night, capacity, star ratings, and amenities.
   - Real-time search across room titles, descriptions, and amenities.
   - Category filtering (Suites, Chalets, Penthouses, Villas, Studios, Family Suites) and price/capacity sorting.
   - Seamless fallback & demo mode when Supabase credentials are not yet configured.

2. **Interactive Date Picker & Live Price Calculation**
   - Pick **Check-in** and **Check-out** dates with validation (check-out must be after check-in, check-in from today).
   - Dynamic real-time calculation:
     - Number of nights calculated instantly (`checkOut - checkIn`)
     - Subtotal breakdown (`price_per_night × nights`)
     - Estimated taxes & service fee (10%)
     - Accurate total price display updating live as dates change.

3. **Booking Reservation & Database Persistence**
   - Guest details input (Full Name, Email, Phone, Special requests, Guest count).
   - Saves reservation to the Supabase `bookings` table via Next.js Server Actions.
   - Instant confirmation receipt with reference ID, summary of charges, and reservation dates.
   - "My Bookings" modal to review all confirmed reservations loaded from the database.

4. **Supabase Integration & 1-Click Seeding**
   - Full SQL schema with table definitions, foreign keys, and Row Level Security (RLS) policies in `supabase/schema.sql`.
   - "Seed Database" button in the UI to quickly populate your Supabase project with sample rooms.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Optional for Live DB)
The app works immediately in **Demo Mode** with mock data and local storage. To connect your live Supabase project:

1. Create a project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the script in:
   ```
   supabase/schema.sql
   ```
3. Copy your project credentials from **Project Settings -> API** and create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── booking.ts       # Server actions for rooms & bookings
│   │   ├── globals.css          # Tailwind CSS styles
│   │   ├── layout.tsx           # Root layout with fonts & metadata
│   │   └── page.tsx             # Main room booking homepage
│   ├── components/
│   │   ├── BookingModal.tsx     # Date selection, live price calc & checkout
│   │   ├── BookingsListModal.tsx# Saved reservations view
│   │   ├── Header.tsx           # Brand navbar & Supabase status badge
│   │   ├── RoomCard.tsx         # Room card with amenities & Book Now CTA
│   │   ├── SupabaseGuideModal.tsx # Setup instructions popup
│   │   └── SupabaseNotice.tsx   # Connection banner & seed button
│   ├── lib/
│   │   ├── mock-data.ts         # Initial sample rooms
│   │   └── supabase.ts          # Supabase client & environment checker
│   └── types/
│       └── index.ts             # TypeScript interfaces for Room & Booking
├── supabase/
│   └── schema.sql               # Database migration & seed script
└── next.config.ts               # Next.js configuration & image domains
```
