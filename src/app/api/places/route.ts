import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Hostel from "@/models/Hostel";
import EmergencyService from "@/models/EmergencyService";
import { mockPlaces } from "@/data/mockPlaces";
import City from "@/models/City";
import Review from "@/models/Review";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const cityParam = searchParams.get("city");

    const db = await connectToDatabase();

    const filterMockData = (data: typeof mockPlaces) => {
      let result = data;
      if (cityParam && cityParam !== "all") {
        result = result.filter((p) => p.city === cityParam);
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

    let allPlaces: any[] = [];

    // Fetch Hostels
    if (!category || category === "all" || category === "hostel") {
      let query: any = { status: 'approved' };
      if (cityParam && cityParam !== "all") {
        const cityDoc = await City.findOne({ name: cityParam });
        if (cityDoc) {
          query.city = cityDoc._id;
        }
      }
      const hostels = await Hostel.find(query).populate('city');
      const formattedHostels = await Promise.all(hostels.map(async (h: any) => {
        const reviews = await Review.find({ hostel: h._id }).populate('user', 'name');
        return {
          id: h._id.toString(),
          name: h.name,
          category: "hostel",
          city: h.city?.name || "Vadodara",
          lat: h.location?.coordinates?.[1] || 22.3072, // fallback coordinates if missing
          lng: h.location?.coordinates?.[0] || 73.1812,
          budget: h.pricePerNight,
          rating: h.rating,
          address: h.address,
          description: h.description,
          reviews: reviews.map((r: any) => ({
            user: r.user?.name || 'User',
            comment: r.comment,
            rating: r.rating
          }))
        };
      }));
      allPlaces = [...allPlaces, ...formattedHostels];
    }

    // Fetch Emergency Services (Clinic/Emergency)
    if (!category || category === "all" || category === "clinic" || category === "emergency") {
      let query: any = {};
      if (category === "clinic") query.type = "hospital";
      if (category === "emergency") query.type = { $in: ["police", "fire"] };
      
      if (cityParam && cityParam !== "all") {
        const cityDoc = await City.findOne({ name: cityParam });
        if (cityDoc) query.city = cityDoc._id;
      }

      const services = await EmergencyService.find(query).populate('city');
      const formattedServices = services.map((s: any) => ({
        id: s._id.toString(),
        name: s.name,
        category: s.type === 'hospital' ? 'clinic' : 'emergency',
        city: s.city?.name || "Vadodara",
        lat: s.location?.coordinates?.lat || 22.3072,
        lng: s.location?.coordinates?.lng || 73.1812,
        address: s.location?.address || 'Address not available',
        description: `Phone: ${s.phone}`,
      }));
      allPlaces = [...allPlaces, ...formattedServices];
    }

    // Add remaining categories from mock data temporarily if they don't have DB models yet (food, bus, atm)
    if (!category || category === "all" || ["food", "bus", "atm", "safe-route"].includes(category)) {
      const remainingMocks = mockPlaces.filter(p => ["food", "bus", "atm", "safe-route"].includes(p.category));
      const filteredMocks = filterMockData(remainingMocks);
      allPlaces = [...allPlaces, ...filteredMocks];
    }

    if (allPlaces.length === 0) {
      return NextResponse.json(filterMockData(mockPlaces));
    }

    return NextResponse.json(allPlaces);
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
 