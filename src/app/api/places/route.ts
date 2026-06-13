import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Place } from "@/models/Place";
import { mockPlaces } from "@/data/mockPlaces";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");

    const db = await connectToDatabase();

    // If no database connection, fallback to mock data
    const filterMockData = (data: typeof mockPlaces) => {
      let result = data;
      if (city && city !== "all") {
        result = result.filter((p) => p.city === city);
      }
      if (category && category !== "all") {
        result = result.filter((p) => p.category === category);
      }
      return result;
    };

    if (!db) {
      console.log("No DB connection. Returning mock data.");
      return NextResponse.json(filterMockData(mockPlaces));
    }

    const query: any = {};
    if (category && category !== "all") query.category = category;
    if (city && city !== "all") query.city = city;

    const places = await Place.find(query).lean();

    // If database is empty, return mock data as fallback for demo purposes
    if (places.length === 0) {
      console.log("DB connected but empty. Returning mock data.");
      return NextResponse.json(filterMockData(mockPlaces));
    }

    // Map _id to id for the frontend
    const formattedPlaces = places.map((p) => ({
      ...p,
      id: p._id?.toString(),
      _id: undefined,
    }));

    return NextResponse.json(formattedPlaces);
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
 