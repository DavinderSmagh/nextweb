"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  BedDouble,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Room, Booking } from "@/types";
import { Header } from "@/components/Header";
import { RoomCard } from "@/components/RoomCard";
import { BookingModal } from "@/components/BookingModal";
import { BookingsListModal } from "@/components/BookingsListModal";
import { SupabaseNotice } from "@/components/SupabaseNotice";
import { SupabaseGuideModal } from "@/components/SupabaseGuideModal";
import { getRooms, getBookings } from "@/app/actions/booking";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [source, setSource] = useState<"supabase" | "sample">("sample");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsSource, setBookingsSource] = useState<"supabase" | "local_demo">("local_demo");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "capacity">("price-asc");

  // Modals state
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isBookingsListOpen, setIsBookingsListOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Load initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const roomsRes = await getRooms();
      setRooms(roomsRes.rooms);
      setIsConfigured(roomsRes.isConfigured);
      setSource(roomsRes.source);

      const bookingsRes = await getBookings();
      setBookings(bookingsRes.bookings);
      setBookingsSource(bookingsRes.source);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const matchesQuery =
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType =
          selectedType === "All" || room.room_type.toLowerCase() === selectedType.toLowerCase();

        return matchesQuery && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price_per_night - b.price_per_night;
        if (sortBy === "price-desc") return b.price_per_night - a.price_per_night;
        if (sortBy === "capacity") return b.capacity - a.capacity;
        return 0;
      });
  }, [rooms, searchQuery, selectedType, sortBy]);

  // Unique room types
  const roomTypes = useMemo(() => {
    const types = Array.from(new Set(rooms.map((r) => r.room_type)));
    return ["All", ...types];
  }, [rooms]);

  const handleOpenBooking = (room: Room) => {
    setSelectedRoomForBooking(room);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking, savedTo: "supabase" | "local_demo") => {
    setBookings((prev) => [newBooking, ...prev]);
    setBookingsSource(savedTo);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 antialiased dark:bg-black dark:text-zinc-100 flex flex-col">
      {/* Navigation Header */}
      <Header
        isConfigured={isConfigured}
        source={source}
        onOpenBookings={() => setIsBookingsListOpen(true)}
        bookingsCount={bookings.length}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-zinc-200/60 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent py-12 dark:border-zinc-800/80 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50/80 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next.js TypeScript + Supabase Booking App</span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-zinc-900 dark:text-white">
                Find & Book Your <br />
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Dream Getaway
                </span>
              </h1>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                Browse our collection of handpicked luxury rooms, pick your check-in and check-out dates, inspect live pricing calculations, and save reservations directly to Supabase.
              </p>
            </div>

            {/* Supabase Status / Notice Box */}
            <div className="mt-8">
              <SupabaseNotice
                isConfigured={isConfigured && source === "supabase"}
                onRefresh={fetchData}
              />
            </div>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search by room name, view, or amenities (e.g. Balcony, Pool, Ocean)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
              />
            </div>

            {/* Type filters pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    selectedType === type
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="capacity">Max Guests (Capacity)</option>
              </select>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Available Rooms ({filteredRooms.length})
              </h2>
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40"
                  />
                ))}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
                <BedDouble className="mx-auto h-12 w-12 text-zinc-400 stroke-1" />
                <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  No rooms match your search
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Try clearing your search filters or resetting the category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("All");
                  }}
                  className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onBookNow={handleOpenBooking}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200/80 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-zinc-500 dark:text-zinc-400 sm:px-6 lg:px-8">
          <p>© 2026 LuxeStay. Built with Next.js App Router, TypeScript, Tailwind CSS & Supabase.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        room={selectedRoomForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Bookings History Drawer/Modal */}
      <BookingsListModal
        isOpen={isBookingsListOpen}
        onClose={() => setIsBookingsListOpen(false)}
        bookings={bookings}
        source={bookingsSource}
      />

      {/* Supabase Guide Modal */}
      <SupabaseGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
