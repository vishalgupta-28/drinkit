import type { Product, Zone } from "@/types";

export const ZONES: Zone[] = [
  { id: "1", name: "Delhi NCR", slug: "delhi", city: "Delhi" },
  { id: "2", name: "Gurugram", slug: "gurugram", city: "Gurugram" },
];

// Same products, DIFFERENT price per zone (Red Label: Delhi ₹1800, Gurugram ₹1200)
export const MOCK_PRODUCTS: Record<string, Product[]> = {
  delhi: [
    { id: "c", name: "Red Label Whisky", brand: "Johnnie Walker", category: "whisky", volume_ml: 750, pairs_with: "Pizza 🍕", price: 1800, mrp: 1900, stock: 12, points_earned: 180 },
    { id: "d", name: "Kingfisher Premium", brand: "Kingfisher", category: "beer", volume_ml: 650, pairs_with: "Wings 🍗", price: 190, mrp: 220, stock: 40, points_earned: 19 },
    { id: "e", name: "Jacob's Creek Shiraz", brand: "Jacob's Creek", category: "wine", volume_ml: 750, pairs_with: "Cheese 🧀", price: 950, mrp: 1100, stock: 8, points_earned: 95 },
    { id: "f", name: "Smirnoff Vodka", brand: "Smirnoff", category: "vodka", volume_ml: 750, pairs_with: "Nachos 🌮", price: 1150, mrp: 1250, stock: 3, points_earned: 115 },
  ],
  gurugram: [
    { id: "c", name: "Red Label Whisky", brand: "Johnnie Walker", category: "whisky", volume_ml: 750, pairs_with: "Pizza 🍕", price: 1200, mrp: 1900, stock: 2, points_earned: 120 },
    { id: "d", name: "Kingfisher Premium", brand: "Kingfisher", category: "beer", volume_ml: 650, pairs_with: "Wings 🍗", price: 170, mrp: 220, stock: 30, points_earned: 17 },
    { id: "e", name: "Jacob's Creek Shiraz", brand: "Jacob's Creek", category: "wine", volume_ml: 750, pairs_with: "Cheese 🧀", price: 880, mrp: 1100, stock: 5, points_earned: 88 },
    { id: "f", name: "Smirnoff Vodka", brand: "Smirnoff", category: "vodka", volume_ml: 750, pairs_with: "Nachos 🌮", price: 990, mrp: 1250, stock: 6, points_earned: 99 },
  ],
};
