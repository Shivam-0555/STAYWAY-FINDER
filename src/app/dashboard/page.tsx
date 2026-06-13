"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Coffee, Bus, CreditCard, Stethoscope, X, Star, Navigation, Loader2, Building2, Phone } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { LocationSwiper } from "@/components/ui/LocationSwiper";
import { StatisticCard } from "@/components/ui/StatisticCard";
import { Category, City, Place } from "@/data/mockPlaces";
import { categoryMetadata, cityMetadata, categoryFallbackImage } from "@/data/uiMetadata";

const SmartMap = dynamic(() => import("@/components/SmartMap"), { ssr: false });

const categories = [
  { id: "all",    label: "All",        icon: MapPin },
  { id: "hostel", label: "Hostel/PG",  icon: MapPin },
  { id: "food",   label: "Food/Mess",  icon: Coffee },
  { id: "bus",    label: "Bus Stops",  icon: Bus },
  { id: "atm",    label: "ATMs",       icon: CreditCard },
  { id: "clinic", label: "Clinics",    icon: Stethoscope },
];

const cities = [
  { id: "all", label: "All Cities" },
  { id: "Hyderabad", label: "Hyderabad" },
  { id: "Mumbai", label: "Mumbai" },
  { id: "Bengaluru", label: "Bengaluru" },
  { id: "Ahmedabad", label: "Ahmedabad" },
  { id: "Patna", label: "Patna" },
  { id: "Vadodara", label: "Vadodara" },
];

const defaultVadodaraLocation: [number, number] = [22.3072, 73.1812];
const defaultLocationLabel = "Vadodara, Gujarat";
const supportedCities: City[] = ["Hyderabad", "Mumbai", "Bengaluru", "Ahmedabad", "Patna", "Vadodara"];

const emergencyQuickActions = [
  { label: "Police", value: "100", icon: MapPin, color: "red" },
  { label: "Ambulance", value: "108", icon: Stethoscope, color: "emerald" },
  { label: "Hospital", value: "Nearby", icon: Building2, color: "amber" },
  { label: "Helpline", value: "+91 98765 43210", icon: Phone, color: "blue" },
];

const categoryColors: Record<string, string> = {
  hostel: "bg-purple-600 text-white border-purple-400 shadow-purple-500/30",
  food:   "bg-amber-500 text-white border-amber-400 shadow-amber-500/30",
  bus:    "bg-blue-600 text-white border-blue-400 shadow-blue-500/30",
  atm:    "bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/30",
  clinic: "bg-red-600 text-white border-red-400 shadow-red-500/30",
  all:    "bg-purple-600 text-white border-purple-400 shadow-purple-500/30",
};

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[#05050f] text-white">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [city, setCity] = useState<City | "all">("Vadodara");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const selectedCityMeta = cityMetadata.find((item) => item.id === city) ?? cityMetadata[0];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(defaultVadodaraLocation);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationMode, setLocationMode] = useState<"real" | "fallback">("fallback");
  const [locationInfo, setLocationInfo] = useState({
    label: defaultLocationLabel,
    city: "Vadodara",
    region: "Gujarat",
    country: "India",
    coords: `${defaultVadodaraLocation[0].toFixed(4)}, ${defaultVadodaraLocation[1].toFixed(4)}`,
    status: "Fallback Location",
  });
  const [flyTo, setFlyTo] = useState<{ coords: [number, number]; key: number } | null>(null);
  const flyToKeyRef = useRef(0);
  const [locating, setLocating] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const updateLocationFromCoords = async (coords: [number, number], isFallback = false) => {
    setUserLocation(coords);
    triggerFlyTo(coords);

    let label = "Current Location";
    let region = "";
    let country = "";
    let cityValue = "";
    let status = isFallback ? "Fallback Location" : "Live Location";

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords[0]}&lon=${coords[1]}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        cityValue = address.city || address.town || address.village || address.county || "";
        region = address.state || "";
        country = address.country || "";
        const locationParts = [cityValue, region, country].filter(Boolean);
        if (locationParts.length > 0) {
          label = locationParts.join(", ");
        }
        if (cityValue && supportedCities.includes(cityValue as City)) {
          setCity(cityValue as City);
        } else if (!isFallback) {
          setCity("all");
        }
      }
    } catch {
      if (!isFallback) {
        setCity("all");
      }
    }

    if (isFallback) {
      cityValue = cityValue || "Vadodara";
      region = region || "Gujarat";
      country = country || "India";
    }

    setLocationInfo({
      label: label || defaultLocationLabel,
      city: cityValue || "Vadodara",
      region: region || (isFallback ? "Gujarat" : ""),
      country: country || "India",
      coords: `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`,
      status,
    });
    setLocationMode(isFallback ? "fallback" : "real");
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocationFromCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        updateLocationFromCoords(defaultVadodaraLocation, true);
      },
      { timeout: 10000 }
    );
  }, []);

  // Fetch places from backend API
  useEffect(() => {
    async function fetchPlaces() {
      setIsLoadingPlaces(true);
      try {
        let url = "/api/places";
        if (city && city !== "all") {
          url += `?city=${encodeURIComponent(city)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setPlaces(data);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setIsLoadingPlaces(false);
      }
    }
    fetchPlaces();
  }, [city]);

  // Load search from URL if present
  useEffect(() => {
    if (isLoadingPlaces) return;
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      const matchedPlace = places.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
      if (matchedPlace) {
        setSelectedPlace(matchedPlace);
        triggerFlyTo([matchedPlace.lat, matchedPlace.lng]);
      }
    }
  }, [searchParams, isLoadingPlaces, places]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  // Autocomplete suggestions from all places
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return places
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.budget && `${p.budget}`.includes(q))
      )
      .slice(0, 5);
  }, [searchQuery, places]);

  const cityStats = useMemo(() => {
    const hostel = places.filter((p) => p.category === "hostel").length;
    const food = places.filter((p) => p.category === "food").length;
    const clinic = places.filter((p) => p.category === "clinic").length;
    const emergency = places.filter((p) => p.category === "emergency").length;
    return { hostel, food, clinic, emergency, total: places.length };
  }, [places]);

  const categorySummary = useMemo(() => {
    return categoryMetadata.map((meta) => ({
      ...meta,
      count: places.filter((p) => p.category === meta.id).length,
    }));
  }, [places]);

  // Panel list filter
  const filteredForPanel = useMemo(() => {
    let filtered = filter === "all" ? places : places.filter((p) => p.category === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.budget && `${p.budget}`.includes(q))
      );
    }
    return filtered;
  }, [filter, searchQuery, places]);

  const triggerFlyTo = (coords: [number, number]) => {
    flyToKeyRef.current += 1;
    setFlyTo({ coords, key: flyToKeyRef.current });
  };

  const getDistanceText = (place: Place, location: [number, number]) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const [lat1, lon1] = location;
    const [lat2, lon2] = [place.lat, place.lng];
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return `${distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`} away`;
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await updateLocationFromCoords([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        alert("Could not get your location. Loading Vadodara fallback location.");
        updateLocationFromCoords(defaultVadodaraLocation, true);
        setCity("Vadodara");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSelectSuggestion = (place: Place) => {
    setSearchQuery(place.name);
    setShowSuggestions(false);
    setSelectedPlace(place);
    triggerFlyTo([place.lat, place.lng]);
  };

  return (
    <div className="min-h-screen w-full relative grid grid-cols-1 md:grid-cols-[minmax(340px,420px)_1fr] md:h-screen overflow-hidden">
      {/* Side Panel */}
      <div className="w-full p-3 md:p-4 z-20 flex flex-col gap-3 relative md:sticky md:top-0 md:h-screen max-h-screen overflow-y-auto">
        

        <GlassCard className="pointer-events-auto border-white/10 bg-slate-950/85 backdrop-blur-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.24em] text-sky-400">Current location</p>
              <h2 className="text-2xl font-semibold text-white">{locationInfo.label}</h2>
              <p className="text-sm text-slate-400 mt-2">Smart city insights for {locationInfo.city} and nearby college neighborhoods.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-right text-sm text-slate-300">
              <p className="font-semibold text-white">{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              <p>Live update</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[.24em] text-slate-400">Coordinates</p>
              <p className="mt-2 text-white font-semibold">{locationInfo.coords}</p>
              <p className="mt-1 text-sm text-slate-500">{locationInfo.city}, {locationInfo.region}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[.24em] text-slate-400">Safety score</p>
              <p className="mt-2 text-white font-semibold text-3xl">{locationMode === "fallback" ? 92 : Math.min(98, 70 + cityStats.total * 2)}%</p>
              <p className="mt-1 text-sm text-slate-500">Based on nearby hostels, food, clinics and emergency access.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[.24em] text-slate-400">Hostels</p>
              <p className="mt-2 text-white font-semibold">{cityStats.hostel}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[.24em] text-slate-400">Food spots</p>
              <p className="mt-2 text-white font-semibold">{cityStats.food}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[.24em] text-slate-400">Hospitals</p>
              <p className="mt-2 text-white font-semibold">{cityStats.clinic}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[.24em] text-slate-400">Emergency</p>
              <p className="mt-2 text-white font-semibold">{cityStats.emergency}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="pointer-events-auto border-white/10 bg-slate-950/85 backdrop-blur-xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">City Dashboard</h1>
              <p className="text-sm text-slate-400">Track places, filter by category, and explore the safest student spots.</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <button
                onClick={handleLocateMe}
                disabled={locating}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-100 hover:bg-blue-600/30 transition-all disabled:opacity-50"
              >
                {locating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                {locating ? "Scanning..." : "Use My Location"}
              </button>
              <Link href="/emergency" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-600/30 transition-all">
                <Phone size={14} /> Emergency Center
              </Link>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 mt-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <label className="text-xs uppercase tracking-[.24em] text-slate-400">City</label>
              <select
                value={city}
                onChange={(event) => {
                  const value = event.target.value as City | "all";
                  setCity(value);
                  setSelectedPlace(null);
                  setSearchQuery("");
                }}
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                {cities.map((option) => (
                  <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <label className="text-xs uppercase tracking-[.24em] text-slate-400">Search by category</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryMetadata.map((cat) => {
                  const active = filter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilter(cat.id as Category | "all")}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                        active ? "border-blue-500 bg-blue-500/15 text-blue-200" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <span className="relative h-7 w-7 overflow-hidden rounded-2xl bg-slate-900/80">
                        <Image src={cat.image} alt={cat.label} fill className="object-contain p-1" />
                      </span>
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative mt-5" ref={searchRef}>
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search hostels, food, ATMs, clinics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 py-4 pl-14 pr-4 text-sm text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-3xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/30">
                {suggestions.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelectSuggestion(place)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{place.name}</p>
                      <p className="truncate text-xs text-slate-400">{place.address}</p>
                    </div>
                    {place.budget && <span className="ml-auto text-xs text-sky-300">₹{place.budget}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Quick Filters</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryMetadata.map((cat) => {
              const isActive = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id as Category | "all")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-3xl border p-3 min-w-25 transition-all ${
                    isActive ? "border-blue-500/60 bg-blue-500/10" : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="relative h-10 w-10">
                    <Image src={cat.image} alt={cat.label} fill className="object-contain" />
                  </div>
                  <span className="text-[11px] text-gray-200">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id as Category | "all")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border shadow-lg ${
                    isActive ? categoryColors[cat.id] : "bg-white/5 text-gray-300 hover:bg-white/10 border-white/10"
                  }`}
                >
                  <Icon size={13} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Results List */}
        <div className="pointer-events-auto flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {filteredForPanel.length === 0 && searchQuery && (
            <GlassCard className="p-4 text-center text-sm text-slate-400 bg-slate-950/70">
              No places found for &quot;{searchQuery}&quot;
            </GlassCard>
          )}

          {filteredForPanel.map((place) => {
            const categoryMeta = categoryMetadata.find((cat) => cat.id === place.category);
            return (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard
                  className={`cursor-pointer border-white/10 bg-slate-950/80 transition-all hover:-translate-y-1 hover:bg-slate-900/95 ${
                    selectedPlace?.id === place.id ? "border-blue-500/50 ring-1 ring-blue-500/30" : ""
                  }`}
                  onClick={() => { setSelectedPlace(place); triggerFlyTo([place.lat, place.lng]); }}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-slate-900/80 border border-white/10">
                      <Image
                        src={categoryMeta?.image ?? categoryFallbackImage}
                        alt={categoryMeta?.label ?? "Category"}
                        fill
                        className="object-contain p-3"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-white truncate">{place.name}</p>
                          <p className="text-sm text-slate-400 truncate">{place.address}</p>
                        </div>
                        <div className="text-right">
                          {place.rating && (
                            <p className="text-sm font-semibold text-amber-300">⭐ {place.rating}</p>
                          )}
                          {place.budget && (
                            <p className="mt-2 text-sm text-sky-300">₹{place.budget}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 items-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[.18em] text-slate-300">
                          {categoryMeta?.label ?? place.category}
                        </span>
                        <span className="text-[11px] text-slate-500">Nearby</span>
                        <button
                          className="ml-auto rounded-full bg-blue-500/15 px-3 py-1.5 text-[11px] font-semibold text-blue-200 hover:bg-blue-500/25 transition-all"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedPlace(place);
                            triggerFlyTo([place.lat, place.lng]);
                          }}
                        >
                          View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Place Detail with Reviews */}
        {selectedPlace && (
          <GlassCard className="pointer-events-auto border-purple-500/30 bg-black/70 p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-white text-base">{selectedPlace.name}</h2>
              <button onClick={() => setSelectedPlace(null)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-2">{selectedPlace.address}</p>
            <div className="flex gap-2 flex-wrap mb-2">
              {selectedPlace.budget && (
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">₹{selectedPlace.budget}</span>
              )}
              {selectedPlace.rating && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-xs">⭐ {selectedPlace.rating}</span>
              )}
            </div>
            {selectedPlace.description && (
              <p className="text-xs text-gray-300 mb-3">{selectedPlace.description}</p>
            )}
            {selectedPlace.reviews && selectedPlace.reviews.length > 0 && (
              <div className="space-y-2 border-t border-white/10 pt-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Student Reviews</p>
                {selectedPlace.reviews.map((r, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium text-white">{r.user}</span>
                      <span className="text-amber-400">{"⭐".repeat(r.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-400">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}
      </div>

      {/* Mobile Swipe View - Bottom Overlay */}
      <div className="fixed bottom-24 left-0 right-0 z-20 md:hidden pointer-events-none">
        <div className="pointer-events-auto overflow-hidden">
          <LocationSwiper 
            places={filteredForPanel} 
            onSelect={(place) => { setSelectedPlace(place); triggerFlyTo([place.lat, place.lng]); }}
            selectedId={selectedPlace?.id}
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative w-full min-h-[55vh] md:min-h-screen z-0">
        <SmartMap
          places={places}
          filter={filter}
          onMarkerClick={(place) => { setSelectedPlace(place); triggerFlyTo([place.lat, place.lng]); }}
          flyTo={flyTo}
          userLocation={userLocation}
        />
        <button
          onClick={handleLocateMe}
          className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/90 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/40 backdrop-blur-md transition hover:bg-slate-900"
        >
          <Navigation size={16} />
          Locate Me
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="fixed bottom-6 right-6 z-10 hidden sm:block">
        <GlassCard className="p-3 border-white/10 bg-black/60 backdrop-blur-md">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Map Legend</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {categories.filter(c => c.id !== "all").map(cat => (
              <div key={cat.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${categoryColors[cat.id].split(' ')[0]}`} />
                <span className="text-[10px] text-gray-300 font-medium">{cat.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
