import { Room } from "@/types";

export const SAMPLE_ROOMS: Room[] = [
  {
    id: "r1-deluxe-ocean",
    name: "Deluxe Ocean Panorama Suite",
    description: "Perched high above the azure coastline, this suite features floor-to-ceiling glass walls, a private teak balcony, and soothing ocean sounds.",
    room_type: "Suite",
    price_per_night: 280,
    capacity: 2,
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Ocean View", "King Bed", "Private Balcony", "High-Speed Wi-Fi", "Espresso Machine", "Marble Bath"],
    rating: 4.95,
    reviews_count: 128,
    available: true
  },
  {
    id: "r2-alpine-chalet",
    name: "Nordic Pine Chalet",
    description: "Cozy timber-accented room with a stone fireplace, handcrafted wool furnishings, and breathtaking alpine valley views.",
    room_type: "Chalet",
    price_per_night: 195,
    capacity: 3,
    image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Mountain View", "Fireplace", "Queen + Twin Bed", "Breakfast Included", "Heated Floors"],
    rating: 4.88,
    reviews_count: 94,
    available: true
  },
  {
    id: "r3-urban-penthouse",
    name: "Executive Skyline Penthouse",
    description: "Modern minimalist luxury in the city center with 360-degree skyline views, dedicated workspace, and designer acoustics.",
    room_type: "Penthouse",
    price_per_night: 350,
    capacity: 4,
    image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    amenities: ["City View", "2 King Beds", "Ergonomic Work Desk", "Smart Room Controls", "Cocktail Bar"],
    rating: 4.92,
    reviews_count: 156,
    available: true
  },
  {
    id: "r4-garden-sanctuary",
    name: "Zen Botanical Garden Villa",
    description: "Nestled within lush tropical foliage with an outdoor rain shower, private plunge pool, and natural stone finishes.",
    room_type: "Villa",
    price_per_night: 240,
    capacity: 2,
    image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Private Pool", "Outdoor Rain Shower", "King Bed", "Organic Toiletries", "Yoga Mats"],
    rating: 4.97,
    reviews_count: 82,
    available: true
  },
  {
    id: "r5-cozy-studio",
    name: "Artisan Heritage Studio",
    description: "Charming boutique studio featuring exposed brickwork, custom mid-century lighting, and a fully equipped kitchenette.",
    room_type: "Studio",
    price_per_night: 120,
    capacity: 2,
    image_url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Kitchenette", "Queen Bed", "Smart TV", "Fast Wi-Fi", "Café on Ground Floor"],
    rating: 4.79,
    reviews_count: 210,
    available: true
  },
  {
    id: "r6-family-suite",
    name: "Grand Coastal Family Retreat",
    description: "Spacious dual-bedroom layout designed for families, featuring a game lounge, full kitchen, and steps to the sand.",
    room_type: "Family Suite",
    price_per_night: 320,
    capacity: 5,
    image_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Beach Access", "2 Bedrooms", "Full Kitchen", "Living Room", "Washer/Dryer", "Kids Board Games"],
    rating: 4.89,
    reviews_count: 115,
    available: true
  }
];

