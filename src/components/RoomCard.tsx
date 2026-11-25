"use client";

import React from "react";
import Image from "next/image";
import { Star, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  onBookNow: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBookNow }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={room.image_url}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Room Type Tag */}
        <div className="absolute left-3.5 top-3.5">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {room.room_type}
          </span>
        </div>

        {/* Capacity Tag */}
        <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-800 backdrop-blur-md dark:bg-zinc-900/90 dark:text-zinc-200">
          <Users className="h-3.5 w-3.5 text-zinc-500" />
          <span>Up to {room.capacity} guests</span>
        </div>

        {/* Rating */}
        {room.rating && (
          <div className="absolute bottom-3 left-3.5 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-xs font-medium text-amber-300 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{room.rating.toFixed(2)}</span>
            {room.reviews_count && (
              <span className="text-zinc-300">({room.reviews_count})</span>
            )}
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {room.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
            {room.description}
          </p>

          {/* Amenities pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer with Price and Book CTA */}
        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              ${room.price_per_night}
            </span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {" "}/ night
            </span>
          </div>

          <button
            onClick={() => onBookNow(room)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600 hover:shadow-amber-500/30 active:scale-95"
          >
            <span>Book Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

