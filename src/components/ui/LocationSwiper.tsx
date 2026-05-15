"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, ChevronRight, Navigation } from "lucide-react";
import { Place } from "@/data/mockPlaces";
import { GlassCard } from "./GlassCard";

interface LocationSwiperProps {
  places: Place[];
  onSelect: (place: Place) => void;
  selectedId?: string;
}

export function LocationSwiper({ places, onSelect, selectedId }: LocationSwiperProps) {
  if (places.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory flex gap-4 px-4">
      {places.map((place) => (
        <motion.div
          key={place.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0 w-[280px] snap-center"
          onClick={() => onSelect(place)}
        >
          <GlassCard
            className={`cursor-pointer h-full border-white/10 transition-all hover:bg-black/60 ${
              selectedId === place.id ? "border-purple-500/50 ring-1 ring-purple-500/30 bg-black/70" : "bg-black/40"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                {place.category}
              </span>
              {place.rating && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star size={12} fill="currentColor" /> {place.rating}
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-white text-sm mb-1 truncate">{place.name}</h3>
            <p className="text-[11px] text-gray-400 mb-3 truncate flex items-center gap-1">
              <MapPin size={10} /> {place.address}
            </p>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
              <span className="text-xs font-bold text-purple-300">
                {place.budget ? `₹${place.budget}` : "View Price"}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 group">
                Fly To <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
