"use client";

import React from "react";
import { X, Calendar, DollarSign, User, ShieldCheck } from "lucide-react";
import { Booking } from "@/types";

interface BookingsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  source: "supabase" | "local_demo";
}

export const BookingsListModal: React.FC<BookingsListModalProps> = ({
  isOpen,
  onClose,
  bookings,
  source
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Saved Bookings ({bookings.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Retrieved from:{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {source === "supabase" ? "Supabase Database" : "Local Demo Store"}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <Calendar className="mx-auto h-12 w-12 stroke-1 opacity-50" />
              <p className="mt-3 text-sm font-medium">No bookings saved yet</p>
              <p className="mt-1 text-xs">Pick a room and complete a booking to view it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {b.room?.name || `Room ${b.room_id}`}
                      </h4>
                      <p className="text-xs font-mono text-zinc-500">Ref: {b.id}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      {b.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                    <div>
                      <span className="text-zinc-400">Guest</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {b.customer_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Dates</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">
                        {b.check_in} → {b.check_out}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Duration</span>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">
                        {b.nights} night{b.nights > 1 ? "s" : ""} ({b.guests_count} guest{b.guests_count > 1 ? "s" : ""})
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Total Price</span>
                      <p className="font-bold text-amber-600 dark:text-amber-400">
                        ${b.total_price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

