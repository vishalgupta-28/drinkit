import type { Product, Zone } from "@/types";

// state slug -> { display, city, tax multiplier vs Delhi base, serviceable }
// Dry states (serviceable=false) cannot receive alcohol delivery by law.
type ZoneDef = { name: string; city: string; mult: number; serviceable: boolean; shop: string };

const ZONE_DEFS: Record<string, ZoneDef> = {
  delhi:          { name: "Delhi NCR",         city: "Delhi",              mult: 1.0,   serviceable: true,  shop: "Sharma Wines" },
  gurugram:       { name: "Gurugram",          city: "Gurugram",           mult: 0.667, serviceable: true,  shop: "Cyber Hub Liquor" },
  maharashtra:    { name: "Maharashtra",       city: "Mumbai",             mult: 1.20,  serviceable: true,  shop: "Bandra Bottle Co." },
  karnataka:      { name: "Karnataka",         city: "Bengaluru",          mult: 1.30,  serviceable: true,  shop: "MG Road Spirits" },
  kerala:         { name: "Kerala",            city: "Thiruvananthapuram", mult: 1.35,  serviceable: true,  shop: "Kochi Cellars" },
  "tamil-nadu":   { name: "Tamil Nadu",        city: "Chennai",            mult: 1.10,  serviceable: true,  shop: "Marina Wines" },
  telangana:      { name: "Telangana",         city: "Hyderabad",          mult: 1.15,  serviceable: true,  shop: "Hitech Liquors" },
  "andhra-pradesh":{ name: "Andhra Pradesh",   city: "Amaravati",          mult: 1.25,  serviceable: true,  shop: "Vizag Vines" },
  "uttar-pradesh":{ name: "Uttar Pradesh",     city: "Lucknow",            mult: 0.95,  serviceable: true,  shop: "Awadh Spirits" },
  rajasthan:      { name: "Rajasthan",         city: "Jaipur",             mult: 1.00,  serviceable: true,  shop: "Pink City Wines" },
  punjab:         { name: "Punjab",            city: "Chandigarh",         mult: 0.90,  serviceable: true,  shop: "Ludhiana Liquors" },
  "west-bengal":  { name: "West Bengal",       city: "Kolkata",            mult: 1.05,  serviceable: true,  shop: "Park Street Cellars" },
  "madhya-pradesh":{ name: "Madhya Pradesh",   city: "Bhopal",             mult: 1.05,  serviceable: true,  shop: "Bhopal Booze" },
  goa:            { name: "Goa",               city: "Panaji",             mult: 0.55,  serviceable: true,  shop: "Baga Beach Bar Store" },
  himachal:       { name: "Himachal Pradesh",  city: "Shimla",             mult: 0.85,  serviceable: true,  shop: "Shimla Spirits" },
  chandigarh:     { name: "Chandigarh",        city: "Chandigarh",         mult: 0.80,  serviceable: true,  shop: "Sector 17 Wines" },
  puducherry:     { name: "Puducherry",        city: "Puducherry",         mult: 0.60,  serviceable: true,  shop: "White Town Wines" },
  uttarakhand:    { name: "Uttarakhand",       city: "Dehradun",           mult: 0.92,  serviceable: true,  shop: "Doon Cellars" },
  // Dry states — delivery prohibited
  gujarat:        { name: "Gujarat",           city: "Gandhinagar",        mult: 1.0,   serviceable: false, shop: "—" },
  bihar:          { name: "Bihar",             city: "Patna",              mult: 1.0,   serviceable: false, shop: "—" },
  nagaland:       { name: "Nagaland",          city: "Kohima",             mult: 1.0,   serviceable: false, shop: "—" },
  mizoram:        { name: "Mizoram",           city: "Aizawl",             mult: 1.0,   serviceable: false, shop: "—" },
};

export const ZONES: Zone[] = Object.entries(ZONE_DEFS).map(([slug, d], i) => ({
  id: String(i + 1),
  name: d.name,
  slug,
  city: d.city,
  serviceable: d.serviceable,
}));

export const ZONE_SHOP: Record<string, string> = Object.fromEntries(
  Object.entries(ZONE_DEFS).map(([slug, d]) => [slug, d.shop]),
);

// Base catalog (Delhi = baseline). Each state applies its multiplier.
type Base = Omit<Product, "price" | "mrp" | "stock" | "points_earned" | "is_serviceable"> & {
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

function build(slug: string): Product[] {
  const def = ZONE_DEFS[slug];
  const mult = def?.mult ?? 1;
  const serviceable = def?.serviceable ?? true;
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
      stock: Math.max(0, b.stock - (idx % 3)),
      is_serviceable: serviceable,
      points_earned: Math.floor(price / 10),
    };
  });
}

export const MOCK_PRODUCTS: Record<string, Product[]> = Object.fromEntries(
  ZONES.map((z) => [z.slug, build(z.slug)]),
);
