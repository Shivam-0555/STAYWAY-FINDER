"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import SearchBar from "@/components/find/SearchBar";
import CategoryFilters from "@/components/find/CategoryFilters";
import ResultsGrid from "@/components/find/ResultsGrid";
import EmptyState from "@/components/find/EmptyState";
import { PlaceDTO, SortOption } from "@/components/find/types";
import type { CategoryKey } from "@/components/find/types";
import dynamic from "next/dynamic";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import PlaceDetailModal from "@/components/find/PlaceDetailModal";

const SmartMap = dynamic(() => import("@/components/SmartMap"), { ssr: false });

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "alphabetical", label: "A → Z" },
  { value: "rating", label: "Highest Rated" },
  { value: "nearest", label: "Nearest" },
];

const CITY_OPTIONS = ["", "Hyderabad", "Mumbai", "Bengaluru", "Ahmedabad", "Vadodara", "Patna"];

export default function FindPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey>("");
  const [city, setCity] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [places, setPlaces] = useState<PlaceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [detailPlace, setDetailPlace] = useState<PlaceDTO | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPlaces = useCallback(async (pg: number) => {
    // Abort previous fetch
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      if (city) params.set("city", city);
      if (minRating > 0) params.set("minRating", String(minRating));
      if (verifiedOnly) params.set("verified", "true");
      params.set("sortBy", sortBy);
      params.set("page", String(pg));
      params.set("limit", "18");

      const res = await fetch(`/api/places/search?${params}`, {
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error("Failed to fetch places");
      const data = await res.json();
      setPlaces(data.places ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      console.error(e);
      setError("Could not load places. Please try again.");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, city, minRating, verifiedOnly, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setSelectedPlaceId(null);
  }, [query, category, city, minRating, verifiedOnly, sortBy]);

  useEffect(() => {
    fetchPlaces(page);
  }, [fetchPlaces, page]);

  const handleViewOnMap = (id: string) => setSelectedPlaceId(id);

  const selectedPlace = places.find((p) => p._id === selectedPlaceId);
  const flyTo = selectedPlace
    ? { coords: [selectedPlace.lat, selectedPlace.lng] as [number, number], key: Date.now() }
    : null;

  const activeFiltersCount = [
    city !== "",
    minRating > 0,
    verifiedOnly,
    sortBy !== "alphabetical",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/5 py-12 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent pointer-events-none" />
        <h1 className="relative text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent mb-3">
          Find Places
        </h1>
        <p className="relative text-slate-400 text-base max-w-lg mx-auto">
          Search hostels, restaurants, hospitals, ATMs, transport & emergency services near Parul University — powered by live MongoDB data.
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Search Bar */}
        <SearchBar query={query} setQuery={setQuery} loading={loading} />

        {/* Category Filters */}
        <CategoryFilters selected={category} onSelect={setCategory} />

        {/* Filter + Sort Controls */}
        <div className="flex items-center gap-3 justify-between flex-wrap">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border transition-all",
              showFilters || activeFiltersCount > 0
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
            )}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">Sort:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  sortBy === opt.value
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Advanced Filters</h3>
              <button
                onClick={() => {
                  setCity("");
                  setMinRating(0);
                  setVerifiedOnly(false);
                  setSortBy("alphabetical");
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Reset all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* City filter */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-blue-500 transition"
                >
                  {CITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c || "All Cities"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Min Rating: {minRating > 0 ? `${minRating}★` : "Any"}
                </label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Verified Only */}
              <div className="flex items-center gap-3 pt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  <span className="ml-2 text-sm text-slate-300">Verified only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results + Map */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Results */}
          <section>
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 mb-4">
                {error}
              </div>
            )}
            {!loading && !error && places.length === 0 ? (
              <EmptyState />
            ) : (
              <ResultsGrid
                places={places}
                onViewMap={handleViewOnMap}
                onSelectPlace={(p) => setDetailPlace(p)}
                selectedId={selectedPlaceId}
                loading={loading}
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
              />
            )}
          </section>

          {/* Map */}
          <section className="h-[520px] rounded-2xl overflow-hidden shadow-2xl sticky top-24 border border-white/10">
            <SmartMap
              places={places as any}
              flyTo={flyTo}
              onMarkerClick={(p: any) => {
                const found = places.find((item) => item._id === (p.id || p._id));
                if (found) setDetailPlace(found);
                setSelectedPlaceId(p.id || p._id);
              }}
            />
          </section>
        </div>

        {/* Place Detail Modal */}
        <PlaceDetailModal
          place={detailPlace}
          onClose={() => setDetailPlace(null)}
          onViewMap={handleViewOnMap}
        />
      </div>
    </div>
  );
}

