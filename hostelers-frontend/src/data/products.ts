export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: "food" | "grocery" | "medicine";
  units: string[];
  deliveryCharge: number;
  familyPackPrice?: number;
}

export const categories = [
  { id: "fast-food", name: "Fast Food", emoji: "🍟", type: "food" as const },
  { id: "medicines", name: "Medicines", emoji: "💊", type: "medicine" as const },
  { id: "biryani", name: "Biryani", emoji: "🍛", type: "food" as const },
  { id: "bakery", name: "Bakery Items", emoji: "🧁", type: "food" as const },
  { id: "dry-fruits", name: "Dry Fruits", emoji: "🥜", type: "food" as const },
  { id: "tiffins", name: "Tiffins Center", emoji: "🍱", type: "food" as const },
  { id: "groceries", name: "Groceries", emoji: "🛒", type: "grocery" as const },
];

export const groceryCategories = [
  { id: "vegetables", name: "Vegetables", emoji: "🥕" },
  { id: "fruits", name: "Fruits", emoji: "🍎" },
  { id: "dairy", name: "Dairy", emoji: "🥛" },
  { id: "snacks", name: "Snacks", emoji: "🍿" },
  { id: "beverages", name: "Beverages", emoji: "🥤" },
  { id: "rice-grains", name: "Rice & Grains", emoji: "🌾" },
  { id: "cooking-oil", name: "Cooking Oil", emoji: "🫒" },
  { id: "instant-food", name: "Instant Food", emoji: "🍜" },
];

export const products: Product[] = [
  // Fast Food — removed "half" units, added familyPackPrice
  { id: "ff1", name: "Pani Puri", price: 30, image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate", "2 plates", "3 plates"], deliveryCharge: 15, familyPackPrice: 120 },
  { id: "ff2", name: "Special Puri", price: 50, image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate", "2 plates"], deliveryCharge: 15, familyPackPrice: 180 },
  { id: "ff3", name: "Chat Masala", price: 40, image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate"], deliveryCharge: 10, familyPackPrice: 150 },
  { id: "ff4", name: "Veg Noodles", price: 80, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate"], deliveryCharge: 20, familyPackPrice: 280 },
  { id: "ff5", name: "Non-Veg Noodles", price: 100, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate"], deliveryCharge: 20, familyPackPrice: 350 },
  { id: "ff6", name: "Veg Manchuria", price: 70, image: "https://images.unsplash.com/photo-1645696301019-35adcc18fc71?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate"], deliveryCharge: 15, familyPackPrice: 250 },
  { id: "ff7", name: "Egg Manchuria", price: 90, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate"], deliveryCharge: 20, familyPackPrice: 320 },
  { id: "ff8", name: "Veg Fried Rice", price: 90, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate"], deliveryCharge: 20, familyPackPrice: 320 },
  { id: "ff9", name: "Non-Veg Fried Rice", price: 110, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop", category: "fast-food", type: "food", units: ["plate"], deliveryCharge: 25, familyPackPrice: 400 },

  // Medicines
  { id: "med1", name: "Paracetamol 500mg", price: 30, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop", category: "medicines", type: "medicine", units: ["strip"], deliveryCharge: 10 },
  { id: "med2", name: "Cough Syrup", price: 85, image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=200&fit=crop", category: "medicines", type: "medicine", units: ["bottle"], deliveryCharge: 10 },
  { id: "med3", name: "Bandage Roll", price: 25, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=200&fit=crop", category: "medicines", type: "medicine", units: ["roll"], deliveryCharge: 10 },
  { id: "med4", name: "Vitamin C Tablets", price: 120, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=200&fit=crop", category: "medicines", type: "medicine", units: ["bottle"], deliveryCharge: 15 },
  { id: "med5", name: "Pain Relief Gel", price: 95, image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop", category: "medicines", type: "medicine", units: ["tube"], deliveryCharge: 10 },
  { id: "med6", name: "Antacid Tablets", price: 45, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop", category: "medicines", type: "medicine", units: ["strip"], deliveryCharge: 10 },

  // Biryani — removed "half" and "full", kept "plate"
  { id: "bir1", name: "Chicken Biryani", price: 180, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop", category: "biryani", type: "food", units: ["plate"], deliveryCharge: 25, familyPackPrice: 650 },
  { id: "bir2", name: "Mutton Biryani", price: 250, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=200&fit=crop", category: "biryani", type: "food", units: ["plate"], deliveryCharge: 30, familyPackPrice: 900 },
  { id: "bir3", name: "Veg Biryani", price: 140, image: "https://images.unsplash.com/photo-1630851840633-f96999247032?w=300&h=200&fit=crop", category: "biryani", type: "food", units: ["plate"], deliveryCharge: 20, familyPackPrice: 500 },
  { id: "bir4", name: "Egg Biryani", price: 150, image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=300&h=200&fit=crop", category: "biryani", type: "food", units: ["plate"], deliveryCharge: 20, familyPackPrice: 550 },

  // Bakery
  { id: "bak1", name: "Chocolate Cake", price: 350, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop", category: "bakery", type: "food", units: ["500g", "1kg"], deliveryCharge: 25, familyPackPrice: 600 },
  { id: "bak2", name: "Puff Pastry", price: 25, image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=300&h=200&fit=crop", category: "bakery", type: "food", units: ["piece", "dozen"], deliveryCharge: 10 },
  { id: "bak3", name: "Samosa", price: 15, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", category: "bakery", type: "food", units: ["piece", "dozen"], deliveryCharge: 10 },
  { id: "bak4", name: "Bread", price: 40, image: "https://images.unsplash.com/photo-1549931319-a545753467c8?w=300&h=200&fit=crop", category: "bakery", type: "food", units: ["loaf"], deliveryCharge: 10 },

  // Dry Fruits
  { id: "df1", name: "Almonds", price: 280, image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&h=200&fit=crop", category: "dry-fruits", type: "food", units: ["250g", "500g", "1kg"], deliveryCharge: 15 },
  { id: "df2", name: "Cashews", price: 320, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop", category: "dry-fruits", type: "food", units: ["250g", "500g", "1kg"], deliveryCharge: 15 },
  { id: "df3", name: "Walnuts", price: 350, image: "https://images.unsplash.com/photo-1596362601603-71e23a4d0bb5?w=300&h=200&fit=crop", category: "dry-fruits", type: "food", units: ["250g", "500g"], deliveryCharge: 15 },
  { id: "df4", name: "Raisins", price: 150, image: "https://images.unsplash.com/photo-1596591868264-4ee15e14e0f2?w=300&h=200&fit=crop", category: "dry-fruits", type: "food", units: ["250g", "500g", "1kg"], deliveryCharge: 10 },

  // Tiffins
  { id: "tif1", name: "Idli Sambar", price: 50, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop", category: "tiffins", type: "food", units: ["plate"], deliveryCharge: 15, familyPackPrice: 180 },
  { id: "tif2", name: "Dosa", price: 60, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop", category: "tiffins", type: "food", units: ["plate"], deliveryCharge: 15, familyPackPrice: 200 },
  { id: "tif3", name: "Poha", price: 35, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=300&h=200&fit=crop", category: "tiffins", type: "food", units: ["plate"], deliveryCharge: 10, familyPackPrice: 120 },
  { id: "tif4", name: "Upma", price: 35, image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=200&fit=crop", category: "tiffins", type: "food", units: ["plate"], deliveryCharge: 10, familyPackPrice: 120 },

  // Groceries
  { id: "gr1", name: "Tomato", price: 30, image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=300&h=200&fit=crop", category: "vegetables", type: "grocery", units: ["250g", "500g", "1kg"], deliveryCharge: 15 },
  { id: "gr2", name: "Potato", price: 25, image: "https://images.unsplash.com/photo-1518977676601-b53f82ber40?w=300&h=200&fit=crop", category: "vegetables", type: "grocery", units: ["500g", "1kg", "2kg"], deliveryCharge: 15 },
  { id: "gr3", name: "Onion", price: 35, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=200&fit=crop", category: "vegetables", type: "grocery", units: ["500g", "1kg", "2kg"], deliveryCharge: 15 },
  { id: "gr4", name: "Apple", price: 120, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop", category: "fruits", type: "grocery", units: ["500g", "1kg"], deliveryCharge: 20 },
  { id: "gr5", name: "Banana", price: 40, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop", category: "fruits", type: "grocery", units: ["dozen"], deliveryCharge: 10 },
  { id: "gr6", name: "Milk", price: 28, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop", category: "dairy", type: "grocery", units: ["500ml", "1L"], deliveryCharge: 10 },
  { id: "gr7", name: "Curd", price: 35, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop", category: "dairy", type: "grocery", units: ["250g", "500g"], deliveryCharge: 10 },
  { id: "gr8", name: "Chips", price: 20, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop", category: "snacks", type: "grocery", units: ["packet"], deliveryCharge: 10 },
  { id: "gr9", name: "Cold Drink", price: 40, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=200&fit=crop", category: "beverages", type: "grocery", units: ["250ml", "500ml", "1L", "2L"], deliveryCharge: 10 },
  { id: "gr10", name: "Basmati Rice", price: 90, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop", category: "rice-grains", type: "grocery", units: ["1kg", "5kg"], deliveryCharge: 20 },
  { id: "gr11", name: "Sunflower Oil", price: 150, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop", category: "cooking-oil", type: "grocery", units: ["1L", "5L"], deliveryCharge: 20 },
  { id: "gr12", name: "Maggi Noodles", price: 14, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=200&fit=crop", category: "instant-food", type: "grocery", units: ["packet", "4-pack"], deliveryCharge: 10 },
  { id: "gr13", name: "Eggs", price: 70, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=200&fit=crop", category: "dairy", type: "grocery", units: ["dozen"], deliveryCharge: 15 },
  { id: "gr14", name: "Bread", price: 40, image: "https://images.unsplash.com/photo-1549931319-a545753467c8?w=300&h=200&fit=crop", category: "snacks", type: "grocery", units: ["loaf"], deliveryCharge: 10 },
];

export const quickDeliveryIds = ["gr6", "gr14", "gr13", "gr5"];
