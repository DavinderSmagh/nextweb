"use client";

import React from "react";
import { BedDouble, CalendarCheck, Database, Sparkles } from "lucide-react";

interface HeaderProps {
  isConfigured: boolean;
  source: "supabase" | "sample";
  onOpenBookings: () => void;
  bookingsCount: number;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConfigured,
  source,
  onOpenBookings,
  bookingsCount,
  onOpenGuide
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20">
            <BedDouble className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Luxe<span className="text-amber-500">Stay</span>
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                Next.js + Supabase
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Premium Room Booking & Reservations
            </p>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase status badge */}
          <button
            onClick={onOpenGuide}
            className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              isConfigured && source === "supabase"
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
            }`}
            title="Click to view Supabase setup instructions"
          >
            <Database className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isConfigured && source === "supabase" ? "Supabase Connected" : "Demo Mode (Mock Data)"}
            </span>
            <span className="sm:hidden">
              {isConfigured && source === "supabase" ? "Live" : "Demo"}
            </span>
            <span className="text-[10px] opacity-60 underline underline-offset-2">Setup</span>
          </button>

          {/* My Bookings Trigger */}
          <button
            onClick={onOpenBookings}
            className="relative inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

