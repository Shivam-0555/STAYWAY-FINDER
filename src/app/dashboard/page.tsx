"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Coffee, Bus, CreditCard, Stethoscope, X, Star, Navigation, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LocationSwiper } from "@/components/ui/LocationSwiper";
import { Category, Place, mockPlaces } from "@/data/mockPlaces";

const SmartMap = dynamic(() => import("@/components/SmartMap"), { ssr: false });

const categories = [
  { id: "all",    label: "All",        icon: MapPin },
  { id: "hostel", label: "Hostel/PG",  icon: MapPin },
  { id: "food",   label: "Food/Mess",  icon: Coffee },
  { id: "bus",    label: "Bus Stops",  icon: Bus },
  { id: "atm",    label: "ATMs",       icon: CreditCard },
  { id: "clinic", label: "Clinics",    icon: Stethoscope },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [flyTo, setFlyTo] = useState<{ coords: [number, number]; key: number } | null>(null);
  const flyToKeyRef = useRef(0);
  const [locating, setLocating] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Load search from URL if present
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      const matchedPlace = mockPlaces.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
      if (matchedPlace) {
        setSelectedPlace(matchedPlace);
        triggerFlyTo([matchedPlace.lat, matchedPlace.lng]);
      }
    }
  }, [searchParams]);

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

  // Autocomplete suggestions from all places
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return mockPlaces
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.budget && `${p.budget}`.includes(q))
      )
      .slice(0, 5);
  }, [searchQuery]);

  // Panel list filter
  const filteredForPanel = useMemo(() => {
    let places = filter === "all" ? mockPlaces : mockPlaces.filter((p) => p.category === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      places = places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.budget && `${p.budget}`.includes(q))
      );
    }
    return places;
  }, [filter, searchQuery]);

  const triggerFlyTo = (coords: [number, number]) => {
    flyToKeyRef.current += 1;
    setFlyTo({ coords, key: flyToKeyRef.current });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        triggerFlyTo(coords);
        setLocating(false);
      },
      () => {
        alert("Could not get your location. Please allow location access.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSelectSuggestion = (place: Place) => {
    setSearchQuery(place.name);
    setShowSuggestions(false);
    setSelectedPlace(place);
    triggerFlyTo([place.lat, place.lng]);
  };

  return (
    <div className="h-screen w-full relative flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0">
      {/* Side Panel */}
      <div className="w-full md:w-96 p-3 md:p-4 z-10 flex flex-col gap-3 pointer-events-none absolute md:relative inset-0 md:inset-auto">
        <GlassCard className="pointer-events-auto border-white/20 bg-black/60 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Explore City
            </h1>
            {/* Near Me Button */}
            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 transition-all disabled:opacity-50"
            >
              {locating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
              {locating ? "Locating..." : "Near Me"}
            </button>
          </div>

          {/* Search with Autocomplete */}
          <div className="relative mb-4" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
            <input
              type="text"
              placeholder="Search PG under ₹5000..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-9 pr-9 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {suggestions.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelectSuggestion(place)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={13} className="text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{place.name}</p>
                      <p className="text-xs text-gray-400 truncate">{place.address}</p>
                    </div>
                    {place.budget && (
                      <span className="ml-auto text-xs text-purple-300 flex-shrink-0">₹{place.budget}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Quick Filters</p>
          <div className="flex flex-wrap gap-2">
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
        <div className="pointer-events-auto flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredForPanel.length === 0 && searchQuery && (
            <GlassCard className="p-4 text-center text-sm text-gray-400 bg-black/50">
              No places found for &quot;{searchQuery}&quot;
            </GlassCard>
          )}
          {filteredForPanel.map((place) => (
            <GlassCard
              key={place.id}
              className={`cursor-pointer p-3 bg-black/50 transition-all hover:bg-black/70 ${
                selectedPlace?.id === place.id ? "border-purple-500/60 ring-1 ring-purple-500/40" : "border-white/10"
              }`}
              onClick={() => { setSelectedPlace(place); triggerFlyTo([place.lat, place.lng]); }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{place.name}</p>
                  <p className="text-xs text-gray-400 truncate">{place.address}</p>
                </div>
                {place.rating && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 flex-shrink-0">
                    <Star size={11} fill="currentColor" /> {place.rating}
                  </span>
                )}
              </div>
              {place.budget && (
                <span className="mt-1.5 inline-block bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                  ₹{place.budget}
                </span>
              )}
            </GlassCard>
          ))}
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
      <div className="flex-1 absolute md:relative inset-0 w-full h-full z-0">
        <SmartMap
          filter={filter}
          onMarkerClick={(place) => { setSelectedPlace(place); triggerFlyTo([place.lat, place.lng]); }}
          flyTo={flyTo}
          userLocation={userLocation}
        />
      </div>

      {/* Map Legend Overlay */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-10 hidden sm:block">
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
