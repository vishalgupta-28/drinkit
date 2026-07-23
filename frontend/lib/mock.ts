import type { Product, Zone } from "@/types";

export const ZONES: Zone[] = [
  { id: "1", name: "Delhi NCR", slug: "delhi", city: "Delhi" },
  { id: "2", name: "Gurugram", slug: "gurugram", city: "Gurugram" },
  { id: "3", name: "Noida", slug: "noida", city: "Noida" },
  { id: "4", name: "Bengaluru", slug: "bengaluru", city: "Bengaluru" },
  { id: "5", name: "Mumbai", slug: "mumbai", city: "Mumbai" },
];

// Default shop shown per zone in the LocationBar
export const ZONE_SHOP: Record<string, string> = {
  delhi: "Sharma Wines",
  gurugram: "Cyber Hub Liquor",
  noida: "Sector 18 Cellars",
  bengaluru: "MG Road Spirits",
  mumbai: "Bandra Bottle Co.",
};

// Base catalog (Delhi = 1.0). Each zone applies a price multiplier so the
// SAME product costs a DIFFERENT amount per zone (e.g. Red Label 1800 vs 1200).
type Base = Omit<Product, "price" | "mrp" | "stock" | "points_earned"> & {
  base: number;
  mrp: number;
  stock: number;
};

const BASE: Base[] = [
  { id: "c", name: "Red Label Whisky", brand: "Johnnie Walker", category: "whisky", volume_ml: 750, pairs_with: "Pizza 🍕", base: 1800, mrp: 1900, stock: 12 },
  { id: "d", name: "Kingfisher Premium", brand: "Kingfisher", category: "beer", volume_ml: 650, pairs_with: "Wings 🍗", base: 190, mrp: 220, stock: 40 },
  { id: "e", name: "Jacob's Creek Shiraz", brand: "Jacob's Creek", category: "wine", volume_ml: 750, pairs_with: "Cheese 🧀", base: 950, mrp: 1100, stock: 8 },
  { id: "f", name: "Smirnoff Vodka", brand: "Smirnoff", category: "vodka", volume_ml: 750, pairs_with: "Nachos 🌮", base: 1150, mrp: 1250, stock: 3 },
  { id: "g", name: "Old Monk Rum", brand: "Mohan Meakin", category: "rum", volume_ml: 750, pairs_with: "Cola 🥤", base: 650, mrp: 720, stock: 22 },
  { id: "h", name: "Bombay Sapphire Gin", brand: "Bombay", category: "gin", volume_ml: 750, pairs_with: "Tonic 🍋", base: 2300, mrp: 2500, stock: 6 },
  { id: "i", name: "Budweiser Magnum", brand: "Budweiser", category: "beer", volume_ml: 650, pairs_with: "Fries 🍟", base: 210, mrp: 240, stock: 35 },
  { id: "j", name: "Jack Daniel's No.7", brand: "Jack Daniel's", category: "whisky", volume_ml: 750, pairs_with: "BBQ 🍖", base: 2800, mrp: 3000, stock: 4 },
];

const ZONE_MULT: Record<string, number> = {
  delhi: 1.0,
  gurugram: 0.667, // Red Label ~ 1200
  noida: 0.9,
  bengaluru: 1.1,
  mumbai: 1.18,
};

function build(slug: string): Product[] {
  const mult = ZONE_MULT[slug] ?? 1;
  return BASE.map((b, idx) => {
    const price = Math.round((b.base * mult) / 10) * 10;
    return {
      id: b.id,
      name: b.name,
      brand: b.brand,
      category: b.category,
      volume_ml: b.volume_ml,
      pairs_with: b.pairs_with,
      price,
      mrp: b.mrp,
      // vary stock a little per zone so "Only N left!" differs
      stock: Math.max(0, b.stock - (idx % 3) * (slug === "gurugram" ? 4 : 1)),
      points_earned: Math.floor(price / 10),
    };
  });
}

export const MOCK_PRODUCTS: Record<string, Product[]> = Object.fromEntries(
  ZONES.map((z) => [z.slug, build(z.slug)]),
);
