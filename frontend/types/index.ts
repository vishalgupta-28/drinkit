export type Category =
  | "beer"
  | "whisky"
  | "wine"
  | "vodka"
  | "rum"
  | "gin";

export interface Zone {
  id: string;
  name: string; // "Delhi NCR"
  slug: string; // "delhi"
  city: string;
}

export interface Shop {
  id: string;
  name: string; // "Sharma Wines"
  address: string;
  phone: string;
  rating: number;
  is_open: boolean;
  lat: number;
  lng: number;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: Category;
  volume_ml?: number;
  image_url?: string;
  pairs_with?: string; // "Pizza 🍕"
  price: number; // zone-resolved
  mrp?: number; // struck-through
  stock: number; // "Only 2 left!"
  shop_id?: string;
  points_earned: number; // 1 pt / ₹10
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type RewardLevel = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface PointsEntry {
  id: string;
  label: string;
  points: number; // +earned / -redeemed
  at: string; // ISO
}

export interface Rider {
  id: string;
  name: string;
  rating: number;
  phone: string;
}

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "picked_up"
  | "delivered";
