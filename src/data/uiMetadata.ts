import { Category, City } from "@/data/mockPlaces";

export type CityMeta = {
  id: City | "all";
  label: string;
  heroImage: string;
  description: string;
  highlight: string;
};

export type CategoryMeta = {
  id: Category;
  label: string;
  image: string;
};

export const cityMetadata: CityMeta[] = [
  {
    id: "all",
    label: "All Cities",
    heroImage: "/images/cities/placeholder-city.svg",
    description: "Browse safe student stays and essential city services across all campuses.",
    highlight: "Pick a city to see curated hostels, dining, transport and emergency services.",
  },
  {
    id: "Hyderabad",
    label: "Hyderabad",
    heroImage: "/images/cities/hyderabad.svg",
    description: "Find student-friendly PGs, food messes, clinics and safe routes in Hyderabad.",
    highlight: "From Charminar charm to tech corridor convenience, stay safe and connected.",
  },
  {
    id: "Mumbai",
    label: "Mumbai",
    heroImage: "/images/cities/mumbai.svg",
    description: "Navigate Mumbai with curated hostel stays, food stops, transit options and emergency services.",
    highlight: "Stay near the Gateway and city hotspots without sacrificing safety.",
  },
  {
    id: "Bengaluru",
    label: "Bengaluru",
    heroImage: "/images/cities/bengaluru.svg",
    description: "Student living in Bengaluru made easy with nearby PGs, dining and healthcare.",
    highlight: "Experience the green tech city with secure stays and easy mobility.",
  },
  {
    id: "Ahmedabad",
    label: "Ahmedabad",
    heroImage: "/images/cities/ahmedabad.svg",
    description: "Discover Ahmedabad landmarks, student stays, mess kitchens and medical help.",
    highlight: "Safe routes and reliable services across Gujarat's fast-growing student hubs.",
  },
  {
    id: "Vadodara",
    label: "Vadodara",
    heroImage: "/images/cities/vadodara.svg",
    description: "Explore Vadodara's campus neighborhoods, heritage landmarks, and trusted student services.",
    highlight: "Vadodara safety maps with hostels, food, hospitals, and emergency support.",
  },
  {
    id: "Patna",
    label: "Patna",
    heroImage: "/images/cities/patna.svg",
    description: "Find comfortable PGs and essential services in Patna's college neighborhoods.",
    highlight: "Keep your campus life connected with trusted food, transport and clinic options.",
  },
];

export const categoryMetadata: CategoryMeta[] = [
  { id: "hostel", label: "Hostel", image: "/images/categories/hostel.svg" },
  { id: "food", label: "Food", image: "/images/categories/food.svg" },
  { id: "atm", label: "ATM", image: "/images/categories/atm.svg" },
  { id: "bus", label: "Bus Stop", image: "/images/categories/bus.svg" },
  { id: "clinic", label: "Hospital", image: "/images/categories/clinic.svg" },
  { id: "emergency", label: "Emergency", image: "/images/categories/emergency.svg" },
];

export const categoryFallbackImage = "/images/categories/placeholder.svg";
