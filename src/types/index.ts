export interface Room {
  id: string;
  name: string;
  description: string;
  room_type: string;
  price_per_night: number;
  capacity: number;
  image_url: string;
  amenities: string[];
  rating?: number;
  reviews_count?: number;
  available?: boolean;
}

export interface Booking {
  id: string;
  room_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  nights: number;
  guests_count: number;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at?: string;
  special_requests?: string;
  // joined relation
  room?: Room;
}

export interface BookingFormData {
  roomId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  specialRequests?: string;
}

