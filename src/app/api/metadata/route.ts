import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import City from "@/models/City";

const categoryMetadata = [
  { id: "hostel", label: "Hostel", image: "/images/categories/hostel.svg" },
  { id: "food", label: "Food", image: "/images/categories/food.svg" },
  { id: "atm", label: "ATM", image: "/images/categories/atm.svg" },
  { id: "bus", label: "Bus Stop", image: "/images/categories/bus.svg" },
  { id: "clinic", label: "Hospital", image: "/images/categories/clinic.svg" },
  { id: "emergency", label: "Emergency", image: "/images/categories/emergency.svg" },
];

const cityImageMap: Record<string, string> = {
  Hyderabad: "/images/cities/hyderabad.svg",
  Mumbai: "/images/cities/mumbai.svg",
  Bengaluru: "/images/cities/bengaluru.svg",
  Ahmedabad: "/images/cities/ahmedabad.svg",
  Vadodara: "/images/cities/vadodara.svg",
  Patna: "/images/cities/patna.svg",
};

export async function GET() {
  try {
    await connectToDatabase();
    const cities = await City.find({}).sort({ name: 1 }).lean();

    const normalizedCities = [
      {
        id: "all",
        label: "All Cities",
        heroImage: "/images/cities/placeholder-city.svg",
        description: "Browse safe student stays and essential city services across all campuses.",
        highlight: "Pick a city to see curated hostels, dining, transport and emergency services.",
      },
      ...cities.map((city: any) => ({
        id: city.name,
        label: city.name,
        heroImage: cityImageMap[city.name] ?? "/images/cities/placeholder-city.svg",
        description: `Find student-friendly stays and city services in ${city.name}.`,
        highlight: `Explore trusted campus living, food, transport, and emergency support in ${city.name}.`,
      })),
    ];

    return NextResponse.json({
      cities: normalizedCities,
      categories: categoryMetadata,
    });
  } catch (error) {
    console.error("Failed to load metadata:", error);
    return NextResponse.json(
      {
        cities: [
          {
            id: "all",
            label: "All Cities",
            heroImage: "/images/cities/placeholder-city.svg",
            description: "Browse safe student stays and essential city services across all campuses.",
            highlight: "Pick a city to see curated hostels, dining, transport and emergency services.",
          },
        ],
        categories: categoryMetadata,
      },
      { status: 200 }
    );
  }
}
