"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Mail,
  User,
  Phone
} from "lucide-react";
import { Room, Booking, BookingFormData } from "@/types";
import { createBooking } from "@/app/actions/booking";

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking, savedTo: "supabase" | "local_demo") => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  isOpen,
  onClose,
  onBookingSuccess
}) => {
  const [todayStr, setTodayStr] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    booking: Booking;
    savedTo: "supabase" | "local_demo";
  } | null>(null);

  // Initialize dates inside useEffect to prevent prerendering issues
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowVal = tomorrow.toISOString().split("T")[0];

      setTodayStr(today);
      setCheckIn(today);
      setCheckOut(tomorrowVal);
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Dynamic calculation of nights and total price
  const calculation = useMemo(() => {
    if (!room || !checkIn || !checkOut) {
      return { nights: 0, subtotal: 0, taxes: 0, total: 0, isValid: false };
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { nights: 0, subtotal: 0, taxes: 0, total: 0, isValid: false };
    }

    const diff = end.getTime() - start.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return { nights: 0, subtotal: 0, taxes: 0, total: 0, isValid: false };
    }

    const subtotal = nights * Number(room.price_per_night);
    // Flat 10% taxes and service fee
    const taxes = Math.round(subtotal * 0.1);
    const total = subtotal + taxes;

    return {
      nights,
      subtotal,
      taxes,
      total,
      isValid: true
    };
  }, [room, checkIn, checkOut]);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!calculation.isValid || calculation.nights <= 0) {
      setErrorMsg("Check-out date must be at least 1 day after check-in.");
      return;
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg("Please provide your name and email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: BookingFormData = {
        roomId: room.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        checkIn,
        checkOut,
        guestsCount,
        specialRequests: specialRequests.trim()
      };

      const result = await createBooking(payload);

      if (!result.success || !result.booking) {
        setErrorMsg(result.error || "Failed to confirm booking.");
        setIsSubmitting(false);
        return;
      }

      setConfirmedBooking({
        booking: result.booking,
        savedTo: result.savedTo
      });
      onBookingSuccess(result.booking, result.savedTo);
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setConfirmedBooking(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleModalClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {room.room_type}
            </span>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {confirmedBooking ? "Booking Confirmed!" : `Book ${room.name}`}
            </h2>
          </div>
          <button
            onClick={handleModalClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Your Reservation is Confirmed!
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  We have saved your booking to the{" "}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {confirmedBooking.savedTo === "supabase" ? "Supabase Database" : "Local Demo Store"}
                  </span>
                  .
                </p>
              </div>

              {/* Receipt Card */}
              <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-left dark:border-zinc-800 dark:bg-zinc-950/50">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                  <span className="text-xs font-medium text-zinc-500">Booking Reference</span>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {confirmedBooking.booking.id}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400">Guest Name</span>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {confirmedBooking.booking.customer_name}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Email</span>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {confirmedBooking.booking.customer_email}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Check-in</span>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {confirmedBooking.booking.check_in}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Check-out</span>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {confirmedBooking.booking.check_out}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Duration</span>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {confirmedBooking.booking.nights} night{confirmedBooking.booking.nights > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Total Charged</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${confirmedBooking.booking.total_price}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleModalClose}
                  className="rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room Snapshot */}
              <div className="flex gap-4 rounded-2xl bg-zinc-50 p-3.5 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={room.image_url}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {room.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Capacity: Up to {room.capacity} guests
                  </p>
                  <p className="mt-1 text-sm font-bold text-amber-600 dark:text-amber-400">
                    ${room.price_per_night}{" "}
                    <span className="text-xs font-normal text-zinc-500">/ night</span>
                  </p>
                </div>
              </div>

              {/* Date Selection Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  1. Select Stay Dates & Guests
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Check-in Date
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="date"
                        min={todayStr || undefined}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Check-out Date
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="date"
                        min={checkIn || todayStr || undefined}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Guests
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Price Calculation Box */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-900/40">
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
                    Pricing Breakdown
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    <Sparkles className="h-3 w-3" /> Live Calculation
                  </span>
                </div>

                {calculation.isValid ? (
                  <div className="mt-3 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex justify-between">
                      <span>
                        ${room.price_per_night} × {calculation.nights} night
                        {calculation.nights > 1 ? "s" : ""}
                      </span>
                      <span className="font-medium">${calculation.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Taxes & Service fees (10%)</span>
                      <span>${calculation.taxes}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-amber-200/60 pt-2 text-sm font-bold text-zinc-900 dark:border-amber-900/40 dark:text-zinc-100">
                      <span>Total Price</span>
                      <span className="text-lg text-amber-600 dark:text-amber-400">
                        ${calculation.total}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                    Please choose a valid check-out date after check-in to see price calculation.
                  </p>
                )}
              </div>

              {/* Guest Information */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  2. Guest Details
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Full Name *
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Email Address *
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Phone Number (Optional)
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Special Requests
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Quiet room, late check-in"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !calculation.isValid}
                  className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      Saving Booking to Database...
                    </span>
                  ) : (
                    <span>
                      Confirm & Save Booking (${calculation.total})
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
