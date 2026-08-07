import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Place } from "@/models/Place";

const PARUL_LAT = 22.7796;
const PARUL_LNG = 73.6908;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapCategory(cat: string): string[] {
  const lc = cat.toLowerCase();
  if (lc === "hospital") return ["clinic"];
  if (lc === "transport" || lc === "bus" || lc === "railway") return ["bus"];
  if (lc === "pg" || lc === "hostel/pg") return ["hostel"];
  if (lc === "sos") return ["emergency"];
  return [lc];
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const minRating = parseFloat(searchParams.get("minRating") || "0") || 0;
    const verified = searchParams.get("verified") === "true" ? true : undefined;
    const sortBy = searchParams.get("sortBy") || "alphabetical";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20") || 20));

    const filter: Record<string, any> = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { type: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      const mapped = mapCategory(category);
      filter.category =
        mapped.length === 1
          ? { $regex: `^${mapped[0]}$`, $options: "i" }
          : { $in: mapped.map((c) => new RegExp(`^${c}$`, "i")) };
    }

    if (city) {
      filter.city = { $regex: `^${city}$`, $options: "i" };
    }

    if (minRating > 0) {
      filter.rating = { $gte: minRating };
    }

    if (verified !== undefined) {
      filter.verified = verified;
    }

    let mongoSort: Record<string, 1 | -1> = { name: 1 };
    if (sortBy === "rating") {
      mongoSort = { rating: -1 };
    } else if (sortBy === "alphabetical") {
      mongoSort = { name: 1 };
    }

    const skip = (page - 1) * limit;
    const fetchLimit = sortBy === "nearest" ? 1000 : limit;
    const fetchSkip = sortBy === "nearest" ? 0 : skip;

    const [rawPlaces, total] = await Promise.all([
      Place.find(filter).sort(mongoSort).skip(fetchSkip).limit(fetchLimit).lean(),
      Place.countDocuments(filter),
    ]);

    let places = rawPlaces.map((p: any) => {
      const { _id, ...rest } = p;
      return {
        ...rest,
        _id: _id.toString(),
        id: _id.toString(),
        name: p.name,
        category: p.category,
        city: p.city,
        lat: p.lat,
        lng: p.lng,
        address: p.address,
        description: p.description,
        rating: p.rating,
        budget: p.budget,
        verified: p.verified ?? false,
        website: p.website,
        phone: p.phone,
        imageUrl: p.imageUrl,
        owner: p.owner,
        type: p.type,
        distanceKm: haversineKm(PARUL_LAT, PARUL_LNG, p.lat, p.lng),
      };
    });

    if (sortBy === "nearest") {
      places.sort((a, b) => a.distanceKm - b.distanceKm);
      places = places.slice(skip, skip + limit);
    }

    return NextResponse.json({
      places,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("/api/places/search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
