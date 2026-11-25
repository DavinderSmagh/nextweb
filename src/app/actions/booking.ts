"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SAMPLE_ROOMS } from "@/lib/mock-data";
import { Room, Booking, BookingFormData } from "@/types";

// In-memory demo store for when Supabase keys are not yet configured
let localBookings: Booking[] = [];

export interface GetRoomsResponse {
  rooms: Room[];
  isConfigured: boolean;
  source: "supabase" | "sample";
  error?: string;
}

export async function getRooms(): Promise<GetRoomsResponse> {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return {
      rooms: SAMPLE_ROOMS,
      isConfigured: false,
      source: "sample"
    };
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("price_per_night", { ascending: true });

    if (error) {
      console.error("Supabase getRooms error:", error.message);
      return {
        rooms: SAMPLE_ROOMS,
        isConfigured: true,
        source: "sample",
        error: error.message
      };
    }

    if (!data || data.length === 0) {
      return {
        rooms: SAMPLE_ROOMS,
        isConfigured: true,
        source: "sample"
      };
    }

    return {
      rooms: data as Room[],
      isConfigured: true,
      source: "supabase"
    };
  } catch (err: any) {
    return {
      rooms: SAMPLE_ROOMS,
      isConfigured: true,
      source: "sample",
      error: err?.message || "Failed to query Supabase"
    };
  }
}

export interface CreateBookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
  savedTo: "supabase" | "local_demo";
}

export async function createBooking(formData: BookingFormData): Promise<CreateBookingResponse> {
  try {
    const {
      roomId,
      customerName,
      customerEmail,
      customerPhone,
      checkIn,
      checkOut,
      guestsCount,
      specialRequests
    } = formData;

    // Validation
    if (!roomId || !customerName || !customerEmail || !checkIn || !checkOut) {
      return {
        success: false,
        error: "Please fill in all required fields.",
        savedTo: "local_demo"
      };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return {
        success: false,
        error: "Invalid check-in or check-out date.",
        savedTo: "local_demo"
      };
    }

    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return {
        success: false,
        error: "Check-out date must be at least one day after check-in date.",
        savedTo: "local_demo"
      };
    }

    // Find room to calculate price accurately
    let room = SAMPLE_ROOMS.find((r) => r.id === roomId);

    const configured = isSupabaseConfigured();
    if (configured) {
      const { data: dbRoom } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();
      if (dbRoom) {
        room = dbRoom as Room;
      }
    }

    const pricePerNight = room ? Number(room.price_per_night) : 150;
    const totalPrice = nights * pricePerNight;

    if (configured) {
      const { data: newBooking, error: insertError } = await supabase
        .from("bookings")
        .insert({
          room_id: roomId,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim().toLowerCase(),
          customer_phone: customerPhone ? customerPhone.trim() : null,
          check_in: checkIn,
          check_out: checkOut,
          nights,
          guests_count: guestsCount || 1,
          total_price: totalPrice,
          status: "confirmed",
          special_requests: specialRequests || null
        })
        .select()
        .single();

      if (insertError) {
        console.error("Supabase booking insert error:", insertError.message);
        return {
          success: false,
          error: `Database error: ${insertError.message}`,
          savedTo: "supabase"
        };
      }

      const fullBooking: Booking = {
        ...(newBooking as Booking),
        room
      };

      return {
        success: true,
        booking: fullBooking,
        savedTo: "supabase"
      };
    }

    // Fallback in-memory booking for demo mode
    const demoBooking: Booking = {
      id: "bk-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      room_id: roomId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      check_in: checkIn,
      check_out: checkOut,
      nights,
      guests_count: guestsCount || 1,
      total_price: totalPrice,
      status: "confirmed",
      special_requests: specialRequests,
      created_at: new Date().toISOString(),
      room
    };

    localBookings.unshift(demoBooking);

    return {
      success: true,
      booking: demoBooking,
      savedTo: "local_demo"
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred while booking.",
      savedTo: "local_demo"
    };
  }
}

export async function getBookings(): Promise<{ bookings: Booking[]; source: "supabase" | "local_demo" }> {
  if (!isSupabaseConfigured()) {
    return { bookings: localBookings, source: "local_demo" };
  }

  try {
    const { data: bookingsData, error } = await supabase
      .from("bookings")
      .select(`
        *,
        room:rooms(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      return { bookings: localBookings, source: "local_demo" };
    }

    return {
      bookings: (bookingsData as any[]) || [],
      source: "supabase"
    };
  } catch (err) {
    return { bookings: localBookings, source: "local_demo" };
  }
}

export async function seedRoomsToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Supabase credentials are not configured in .env.local yet."
    };
  }

  try {
    const { error } = await supabase.from("rooms").upsert(
      SAMPLE_ROOMS.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        room_type: r.room_type,
        price_per_night: r.price_per_night,
        capacity: r.capacity,
        image_url: r.image_url,
        amenities: r.amenities,
        rating: r.rating,
        reviews_count: r.reviews_count,
        available: true
      }))
    );

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Successfully seeded 6 rooms to Supabase!" };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to seed rooms" };
  }
}

