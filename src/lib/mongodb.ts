import mongoose from "mongoose";
import { Place } from "../models/Place";
import User from "../models/User";
import City from "../models/City";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/staywayfinder";
const MONGODB_URI = (process.env.MONGODB_URI || DEFAULT_MONGODB_URI).trim();

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function seedCitiesIfNeeded() {
  try {
    const count = await City.countDocuments();
    if (count === 0) {
      console.log("Cities collection is empty. Seeding cities...");
      const citiesToInsert = [
        { name: "Hyderabad", state: "Telangana", country: "India", coordinates: { lat: 17.3850, lng: 78.4867 } },
        { name: "Mumbai", state: "Maharashtra", country: "India", coordinates: { lat: 19.0760, lng: 72.8777 } },
        { name: "Bengaluru", state: "Karnataka", country: "India", coordinates: { lat: 12.9716, lng: 77.5946 } },
        { name: "Ahmedabad", state: "Gujarat", country: "India", coordinates: { lat: 23.0225, lng: 72.5714 } },
        { name: "Vadodara", state: "Gujarat", country: "India", coordinates: { lat: 22.3072, lng: 73.1812 } },
        { name: "Patna", state: "Bihar", country: "India", coordinates: { lat: 25.5941, lng: 85.1376 } },
      ];
      await City.insertMany(citiesToInsert);
      console.log(`Successfully seeded ${citiesToInsert.length} cities.`);
    }
  } catch (error) {
    console.error("Error seeding cities:", error);
  }
}

async function seedUsersIfNeeded() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("Users collection is empty. Seeding demo user...");
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash("demo123", salt);
      await User.create({
        name: "Demo User",
        email: "demo@example.com",
        passwordHash,
        role: "student",
      });
      console.log("Successfully seeded demo user: demo@example.com / demo123");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

async function seedRealPlacesIfNeeded() {
  try {
    const filePath = path.join(process.cwd(), "src/data/mapMarkers.json");
    if (!fs.existsSync(filePath)) return;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const markers = JSON.parse(fileContent);

    const typeToCategory: Record<string, string> = {
      hostel: "hostel",
      food: "food",
      hospital: "clinic",
      emergency: "emergency",
      transit: "bus",
      atm: "atm",
      bus: "bus",
      clinic: "clinic",
    };

    // Fields explicitly managed by the core schema — everything else is extra
    const coreFields = new Set([
      "id", "emoji", "color", "distance", // UI-only, skip
    ]);

    const placesToUpsert = markers.map((item: any) => {
      // Collect all category-specific extra fields dynamically
      const extra: Record<string, any> = {};
      for (const [key, val] of Object.entries(item)) {
        if (!coreFields.has(key)) extra[key] = val;
      }

      return {
        name: item.name,
        category: typeToCategory[item.type] || item.category || "hostel",
        city: item.city || "Vadodara",
        lat: item.lat,
        lng: item.lng,
        address: item.address || item.name + ", Vadodara",
        description: item.description || item.status || "Verified service",
        rating: item.rating || 4.0,
        verified: item.verified !== false,
        type: item.type,
        imageUrl: item.imageUrl,
        phone: item.phone,
        website: item.website,
        budget: item.budget,
        // Spread all remaining category-specific keys (amenities, popularDishes,
        // medicalServices, cashWithdrawal, stationType, etc.)
        ...extra,
      };
    });

    const count = await Place.countDocuments();
    if (count === 0) {
      console.log("Places collection is empty. Seeding places from mapMarkers.json...");
      await Place.insertMany(placesToUpsert);
      console.log(`Seeded ${placesToUpsert.length} places into MongoDB.`);
    } else {
      // Sync all fields for existing docs so category-specific data stays current
      for (const placeData of placesToUpsert) {
        const { name, ...rest } = placeData;
        await Place.updateOne(
          {
            $or: [
              { name },
              { lat: placeData.lat, lng: placeData.lng },
              { address: placeData.address },
            ],
          },
          { $set: { ...rest, name } },
          { upsert: true }
        );
      }
      console.log("Synced category-specific fields for existing places.");
    }
  } catch (error) {
    console.error("Error seeding real places:", error);
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is missing. Set it in .env.local or use the local default MongoDB URI."
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    await seedRealPlacesIfNeeded();
    await seedCitiesIfNeeded();
    await seedUsersIfNeeded();
  } catch (e) {
    cached.promise = null;
    throw new Error(
      `MongoDB connection failed. Check that MongoDB is running and that MONGODB_URI is valid. Original error: ${e instanceof Error ? e.message : String(e)}`
    );
  }

  return cached.conn;
}

