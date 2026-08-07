import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Place } from "@/models/Place";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const cityParam = searchParams.get("city");

    const query: Record<string, any> = {};
    if (category && category !== "all") {
      query.category = category;
    }
    if (cityParam && cityParam !== "all") {
      query.city = cityParam;
    }

    const places = await Place.find(query).lean();

    const formattedPlaces = places.map((p: any) => {
      const { _id, ...rest } = p;
      return {
        ...rest,
        id: _id.toString(),
      };
    });

    return NextResponse.json(formattedPlaces);
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
