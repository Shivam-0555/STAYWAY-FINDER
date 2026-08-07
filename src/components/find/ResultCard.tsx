"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import {
  Star,
  MapPin,
  Navigation,
  Phone,
  Globe,
  ShieldCheck,
  Ruler,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceDTO } from "@/components/find/types";

const CATEGORY_COLORS: Record<string, string> = {
  hostel: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300",
  food: "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-300",
  atm: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-300",
  bus: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300",
  clinic: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-300",
  emergency: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-300",
};

const CATEGORY_LABELS: Record<string, string> = {
  hostel: "Hostel / PG",
  food: "Food",
  atm: "ATM",
  bus: "Transport",
  clinic: "Hospital",
  emergency: "Emergency / SOS",
  "safe-route": "Safe Route",
};

interface ResultCardProps {
  place: PlaceDTO;
  onViewMap: (id: string) => void;
  onSelectPlace?: (place: PlaceDTO) => void;
  isSelected?: boolean;
}

const CATEGORY_IMAGES: Record<string, string> = {
  hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
  food: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  atm: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=600&q=80",
  bus: "https://images.unsplash.com/photo-1592844002373-a55ecd7af140?q=80&w=1170&auto=format&fit=crop",
  railway: "https://images.unsplash.com/photo-1592844002373-a55ecd7af140?q=80&w=1170&auto=format&fit=crop",
  clinic: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
  emergency: "https://images.unsplash.com/photo-1708299983282-9429c6ad67ee?q=80&w=1935&auto=format&fit=crop",
};

function getPlaceHeroImage(place: PlaceDTO): string {
  if (place.imageUrl) return place.imageUrl;
  const nameLower = (place.name || "").toLowerCase();
  const typeLower = (place.type || "").toLowerCase();
  const catLower = (place.category || "").toLowerCase();

  if (nameLower.includes("police") || nameLower.includes("cop") || catLower === "emergency") {
    return CATEGORY_IMAGES.emergency;
  }

  if (
    (nameLower.includes("railway") || nameLower.includes("train") || typeLower.includes("transit") || typeLower.includes("railway")) &&
    !nameLower.includes("police")
  ) {
    return CATEGORY_IMAGES.railway;
  }

  return CATEGORY_IMAGES[catLower] || CATEGORY_IMAGES.hostel;
}

export default function ResultCard({ place, onViewMap, onSelectPlace, isSelected }: ResultCardProps) {
  const rating = place.rating ?? 0;
  const categoryKey = place.category.toLowerCase();
  const colorClass =
    CATEGORY_COLORS[categoryKey] ??
    "from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-300";
  const label = CATEGORY_LABELS[categoryKey] ?? place.category;
  const cardImage = getPlaceHeroImage(place);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [bookingForm, setBookingForm] = useState({
    studentName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    message: ""
  });
  const [isBooking, setIsBooking] = useState(false);

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    try {
      const res = await fetch("/api/visit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingForm, hostelId: place._id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book visit");
      toast.success("Visit request submitted successfully.");
      setShowBookingModal(false);
      setBookingForm({ studentName: "", phone: "", email: "", date: "", time: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Error submitting request");
    } finally {
      setIsBooking(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking action buttons/links, don't open modal
    if ((e.target as HTMLElement).closest("button, a")) return;
    if (onSelectPlace) {
      onSelectPlace(place);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 cursor-pointer",
        "backdrop-blur-xl border border-white/10 shadow-lg",
        "hover:shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col",
        isSelected && "ring-2 ring-blue-500/60 border-blue-500/40 shadow-blue-500/20 shadow-xl"
      )}
    >
      {/* Thumbnail Header Image */}
      <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
        <img
          src={cardImage}
          alt={place.name}
          onError={(e) => {
            e.currentTarget.src = CATEGORY_IMAGES[categoryKey] || CATEGORY_IMAGES.hostel;
          }}
          className="w-full h-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md bg-gradient-to-r",
              colorClass
            )}
          >
            {label}
          </span>
          {place.budget != null && (
            <span className="shrink-0 bg-emerald-500/90 text-slate-950 font-bold text-[11px] px-2 py-0.5 rounded-full shadow">
              ₹{place.budget}/mo
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-base font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                {place.name}
              </h3>
              {place.verified && (
                <span title="Verified">
                  <ShieldCheck
                    size={15}
                    className="shrink-0 text-blue-400"
                  />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
              <MapPin size={11} className="shrink-0 text-slate-500" />
              {place.address}, {place.city}
            </p>
          </div>
        </div>

        {/* Rating & Distance */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-amber-300">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-xs">{rating.toFixed(1)}</span>
            </div>
          )}

          {place.distanceKm != null && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 ml-auto">
              <Ruler size={11} className="text-slate-500" />
              {place.distanceKm < 1
                ? `${Math.round(place.distanceKm * 1000)} m`
                : `${place.distanceKm.toFixed(1)} km`}
            </span>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-3 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewMap(place._id);
              }}
              className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              <MapPin size={13} />
              View on Map
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectPlace) onSelectPlace(place);
              }}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 transition-all"
            >
              Details
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Get Directions"
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 p-2 rounded-xl border border-white/10 transition-all"
            >
              <Navigation size={13} />
            </a>
          </div>
          {(categoryKey === "hostel" || categoryKey === "pg") && (
            <div className="flex justify-between items-center mt-2">
              <a href={`/owner-dashboard?placeId=${place.id}`} onClick={(e) => e.stopPropagation()} className="text-[11px] text-purple-400 hover:text-purple-300 font-medium underline decoration-purple-400/30 hover:decoration-purple-400 transition-colors">
                Claim This Listing
              </a>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowBookingModal(true); }}
                className="text-[11px] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium px-3 py-1 rounded-md hover:from-emerald-400 hover:to-emerald-500 transition-colors flex items-center gap-1 shadow-lg shadow-emerald-500/20"
              >
                📅 Book Visit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Book a Visit to {place.name}</h3>
            <form onSubmit={handleBookVisit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Name *</label>
                  <input required type="text" value={bookingForm.studentName} onChange={(e) => setBookingForm({...bookingForm, studentName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone *</label>
                  <input required type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email *</label>
                <input required type="email" value={bookingForm.email} onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Preferred Date *</label>
                  <input required type="date" value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Preferred Time *</label>
                  <input required type="time" value={bookingForm.time} onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Message (Optional)</label>
                <textarea rows={2} value={bookingForm.message} onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none resize-none"></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowBookingModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isBooking} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
                  {isBooking ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
