import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./models/Food.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr_e_menu";

const foods = [
  // Coffee
  {
    name: "Latte",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    description: "Espresso pha với sữa nóng, vị béo nhẹ và thơm.",
    category: "coffee",
    isAvailable: true
  },
  {
    name: "Cappuccino",
    price: 48000,
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    description: "Cà phê espresso với lớp bọt sữa dày và mịn.",
    category: "coffee",
  },
  {
    name: "Espresso",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=800&q=80",
    description: "Một shot espresso đậm đà, dành cho người yêu cà phê mạnh.",
    category: "coffee",
  },
  {
    name: "Caramel Macchiato",
    price: 52000,
    image:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=800&q=80",
    description: "Espresso, sữa và sốt caramel thơm ngọt.",
    category: "coffee",
  },
  // Tea
  {
    name: "Matcha Latte",
    price: 52000,
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80",
    description: "Trà xanh matcha Nhật Bản kết hợp với sữa tươi.",
    category: "tea",
  },
  {
    name: "Peach Tea",
    price: 42000,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80",
    description: "Trà đào mát lạnh, ngọt dịu và thơm mùi đào.",
    category: "tea",
  },
  {
    name: "Lemon Honey Tea",
    price: 39000,
    image:
      "https://images.unsplash.com/photo-1477764227684-8c4e5bca6f0d?auto=format&fit=crop&w=800&q=80",
    description: "Trà chanh mật ong thanh lọc, giải nhiệt cơ thể.",
    category: "tea",
  },
  // Food
  {
    name: "Classic Burger",
    price: 90000,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    description: "Burger bò với phô mai, rau salad và sốt đặc biệt.",
    category: "food",
  },
  {
    name: "Margherita Pizza",
    price: 110000,
    image:
      "https://images.unsplash.com/photo-1548365328-9e8e83a2d1d3?auto=format&fit=crop&w=800&q=80",
    description: "Pizza phô mai mozzarella, sốt cà chua và lá basil tươi.",
    category: "food",
  },
  {
    name: "Creamy Carbonara Pasta",
    price: 98000,
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    description: "Mì Ý sốt kem trứng, bacon và phô mai parmesan.",
    category: "food",
  },
  {
    name: "Caesar Salad",
    price: 78000,
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
    description: "Salad rau xanh, gà nướng, phô mai parmesan và sốt Caesar.",
    category: "food",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await Food.deleteMany({});
    console.log("Cleared existing foods");

    await Food.insertMany(foods);
    console.log(`Inserted ${foods.length} food items`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seed();

