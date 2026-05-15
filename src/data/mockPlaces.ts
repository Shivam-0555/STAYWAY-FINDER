export type Category = "hostel" | "food" | "bus" | "atm" | "clinic" | "safe-route" | "emergency" | "other";

export interface Place {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  budget?: number;
  rating?: number;
  address: string;
  description?: string;
  reviews?: Array<{ user: string; comment: string; rating: number }>;
}

// Centered around MS University, Vadodara
export const DEMO_CENTER: [number, number] = [22.3144, 73.1886];

export const mockPlaces: Place[] = [
  // Hostels / PGs
  {
    id: "1",
    name: "Sunrise PG & Hostel",
    category: "hostel",
    lat: 22.3160,
    lng: 73.1900,
    budget: 4500,
    rating: 4.2,
    address: "Near MSU Gate, Vadodara",
    description: "Affordable PG with Wi-Fi and 3 meals a day.",
    reviews: [
      { user: "Rahul", comment: "Good place, nice food.", rating: 4 },
      { user: "Aman", comment: "A bit noisy at night.", rating: 3 }
    ]
  },
  {
    id: "6",
    name: "Cozy Corners PG",
    category: "hostel",
    lat: 22.3120,
    lng: 73.1870,
    budget: 5500,
    rating: 4.0,
    address: "Sayajigunj, Vadodara",
    description: "Spacious rooms with AC and hot water.",
    reviews: [
      { user: "Neha", comment: "Very clean and safe locality.", rating: 5 }
    ]
  },
  {
    id: "8",
    name: "Metro View Residency",
    category: "hostel",
    lat: 22.3175,
    lng: 73.1920,
    budget: 6000,
    rating: 4.5,
    address: "Alkapuri, Vadodara",
    description: "Premium PG close to Alkapuri circle.",
  },

  // Food / Mess
  {
    id: "2",
    name: "Student Mess Canteen",
    category: "food",
    lat: 22.3148,
    lng: 73.1895,
    budget: 60,
    rating: 4.5,
    address: "MSU Campus, Vadodara",
    description: "Unlimited thali for ₹60.",
    reviews: [
      { user: "Priya", comment: "Best rajma chawal!", rating: 5 }
    ]
  },
  {
    id: "7",
    name: "Late Night Maggie Point",
    category: "food",
    lat: 22.3130,
    lng: 73.1860,
    budget: 40,
    rating: 4.7,
    address: "Sayajigunj Market, Vadodara",
    description: "Open till 2 AM. Best maggie in town.",
  },
  {
    id: "9",
    name: "Anand Bhavan Canteen",
    category: "food",
    lat: 22.3160,
    lng: 73.1920,
    budget: 80,
    rating: 4.3,
    address: "Race Course, Vadodara",
    description: "Authentic Gujarati thali at student prices.",
  },

  // Bus Stops
  {
    id: "3",
    name: "Sayajigunj Bus Stand",
    category: "bus",
    lat: 22.3144,
    lng: 73.1886,
    address: "Sayajigunj, Vadodara",
  },
  {
    id: "10",
    name: "MSU Campus Bus Stop",
    category: "bus",
    lat: 22.3168,
    lng: 73.1908,
    address: "MSU North Gate, Vadodara",
  },

  // ATMs
  {
    id: "4",
    name: "SBI ATM",
    category: "atm",
    lat: 22.3138,
    lng: 73.1878,
    address: "Near Vadodara Railway Station",
  },
  {
    id: "11",
    name: "HDFC ATM",
    category: "atm",
    lat: 22.3155,
    lng: 73.1898,
    address: "Alkapuri Circle, Vadodara",
  },
  {
    id: "12",
    name: "ICICI ATM",
    category: "atm",
    lat: 22.3128,
    lng: 73.1872,
    address: "Sayajigunj Main Road",
  },

  // Clinics
  {
    id: "5",
    name: "SSG Hospital",
    category: "clinic",
    lat: 22.3115,
    lng: 73.1855,
    rating: 4.8,
    address: "Jail Road, Vadodara",
    description: "Major government hospital. 24/7 Emergency.",
  },
  {
    id: "13",
    name: "Sterling Hospital",
    category: "clinic",
    lat: 22.3172,
    lng: 73.1930,
    rating: 4.6,
    address: "Race Course Road, Vadodara",
    description: "Multi-specialty private hospital with ER.",
  },
];
