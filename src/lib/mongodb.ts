import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI?.trim();

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Configure the MongoDB Atlas connection string.");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "staywayfinder",
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw new Error(
      `MongoDB connection failed. Check that MONGODB_URI is valid and Atlas allows this deployment. Original error: ${e instanceof Error ? e.message : String(e)}`
    );
  }

  return cached.conn;
}

