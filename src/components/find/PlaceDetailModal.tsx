"use client";

import { useEffect } from "react";
import {
  X,
  MapPin,
  Star,
  Navigation,
  Phone,
  Globe,
  ShieldCheck,
  Ruler,
  Info,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { PlaceDTO } from "./types";
import { cn } from "@/lib/utils";

interface PlaceDetailModalProps {
  place: PlaceDTO | null;
  onClose: () => void;
  onViewMap: (id: string) => void;
}

// ─── Category styling ────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  hostel: "Hostel / PG",
  food: "Food & Dining",
  atm: "ATM & Banking",
  bus: "Transit & Transport",
  clinic: "Hospital & Healthcare",
  emergency: "Emergency & SOS",
};

const CATEGORY_COLORS: Record<string, string> = {
  hostel: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  food: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  atm: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  bus: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  clinic: "bg-red-500/20 text-red-300 border-red-500/30",
  emergency: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
  food: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  atm: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80",
  bus: "https://images.unsplash.com/photo-1592844002373-a55ecd7af140?auto=format&fit=crop&w=800&q=80",
  clinic: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
  emergency: "https://images.unsplash.com/photo-1708299983282-9429c6ad67ee?auto=format&fit=crop&w=800&q=80",
};

function getHeroImage(place: PlaceDTO): string {
  if (place.imageUrl) return place.imageUrl;
  return CATEGORY_FALLBACK_IMAGES[place.category?.toLowerCase()] ?? CATEGORY_FALLBACK_IMAGES.hostel;
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

/** A single boolean feature badge — only renders when value is explicitly true */
function Feature({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-800/60 px-2.5 py-1 text-[11px] font-medium text-slate-300">
      <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
      {label}
    </span>
  );
}

/** Section wrapper — only renders when children is non-empty */
function Section({
  icon,
  title,
  children,
  accent = "text-blue-400",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className={cn("flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400")}>
        <span className={accent}>{icon}</span>
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

/** Chip-list — only renders when list has items */
function ChipList({ items, color = "bg-slate-800 text-slate-200" }: { items: string[]; color?: string }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={cn("rounded-xl border border-white/8 px-2.5 py-1 text-[11px] font-medium", color)}>
          {item}
        </span>
      ))}
    </div>
  );
}

/** Key–value info row */
function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-800/50 border border-white/5 px-3 py-2">
      <span className="text-[11px] text-slate-400">{label}</span>
      <span className="text-xs font-semibold text-white">{value}</span>
    </div>
  );
}

// ─── Per-category dynamic sections ───────────────────────────────────────────

function HostelSection({ p }: { p: PlaceDTO }) {
  const amenities: string[] = Array.isArray(p.amenities) ? p.amenities : [];

  if (!amenities.length && !p.budget) return null;

  return (
    <>
      {!!p.budget && (
        <Section icon={<Building size={13} />} title="Pricing" accent="text-emerald-400">
          <InfoRow label="Monthly Budget" value={`₹${p.budget}`} />
        </Section>
      )}

      {amenities.length > 0 && (
        <Section icon={<CheckCircle2 size={13} />} title="Student Facilities" accent="text-blue-400">
          <div className="flex flex-wrap gap-1.5">
            {amenities.map((a) => (
              <Feature key={a} label={a} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function FoodSection({ p }: { p: PlaceDTO }) {
  const dishes: string[] = Array.isArray(p.popularDishes) ? p.popularDishes : [];
  const payments: string[] = Array.isArray(p.paymentMethods) ? p.paymentMethods : [];

  // Boolean flags
  const flags: string[] = [
    p.delivery === true && "Delivery",
    p.takeaway === true && "Takeaway",
    p.outdoorSeating === true && "Outdoor Seating",
    p.indoorSeating === true && "Indoor Seating",
    p.ac === true && "Air Conditioned",
    p.fastService === true && "Fast Service",
  ].filter(Boolean) as string[];

  const hasAny =
    dishes.length || payments.length || flags.length || p.foodType || p.openingHours || p.averageCost || p.studentDiscount;

  if (!hasAny) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {p.foodType && <InfoRow label="Food Type" value={p.foodType} />}
        {p.openingHours && <InfoRow label="Hours" value={p.openingHours} />}
        {p.averageCost != null && <InfoRow label="Avg. Cost" value={`₹${p.averageCost}`} />}
        {p.budget != null && <InfoRow label="Starting From" value={`₹${p.budget}`} />}
      </div>

      {p.studentDiscount && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 flex items-center gap-2">
          <ShieldCheck size={14} className="shrink-0" />
          {p.studentDiscount}
        </div>
      )}

      {dishes.length > 0 && (
        <Section icon={<Info size={13} />} title="Popular Dishes" accent="text-orange-400">
          <ChipList items={dishes} color="bg-orange-500/10 border-orange-500/20 text-orange-200" />
        </Section>
      )}

      {flags.length > 0 && (
        <Section icon={<CheckCircle2 size={13} />} title="Features" accent="text-blue-400">
          <div className="flex flex-wrap gap-1.5">
            {flags.map((f) => (
              <Feature key={f} label={f} />
            ))}
          </div>
        </Section>
      )}

      {payments.length > 0 && (
        <Section icon={<CheckCircle2 size={13} />} title="Payment Methods" accent="text-purple-400">
          <ChipList items={payments} color="bg-purple-500/10 border-purple-500/20 text-purple-200" />
        </Section>
      )}
    </>
  );
}

function HospitalSection({ p }: { p: PlaceDTO }) {
  const services: string[] = Array.isArray(p.medicalServices) ? p.medicalServices : [];
  if (!services.length) return null;

  return (
    <Section icon={<AlertTriangle size={13} />} title="Medical Services" accent="text-red-400">
      <div className="flex flex-wrap gap-1.5">
        {services.map((s) => (
          <Feature key={s} label={s} />
        ))}
      </div>
    </Section>
  );
}

function ATMSection({ p }: { p: PlaceDTO }) {
  const flags: string[] = [
    p.cashWithdrawal === true && "Cash Withdrawal",
    p.cashDeposit === true && "Cash Deposit",
    p.passbookUpdate === true && "Passbook Update",
    p.miniStatement === true && "Mini Statement",
    p.cardlessWithdrawal === true && "Cardless Withdrawal",
    p.wheelchairAccess === true && "Wheelchair Access",
    p.availability24x7 === true && "24×7 Available",
  ].filter(Boolean) as string[];

  const hasAny = flags.length || p.branchType;
  if (!hasAny) return null;

  return (
    <>
      {p.branchType && (
        <div className="grid grid-cols-1 gap-2">
          <InfoRow label="Branch Type" value={p.branchType} />
        </div>
      )}
      {flags.length > 0 && (
        <Section icon={<CheckCircle2 size={13} />} title="ATM Services" accent="text-emerald-400">
          <div className="flex flex-wrap gap-1.5">
            {flags.map((f) => (
              <Feature key={f} label={f} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function TransportSection({ p }: { p: PlaceDTO }) {
  const flags: string[] = [
    p.ticketCounter === true && "Ticket Counter",
    p.parking === true && "Parking",
    p.waitingArea === true && "Waiting Area",
    p.nightService === true && "Night Service",
    p.wheelchairAccess === true && "Wheelchair Access",
  ].filter(Boolean) as string[];

  const hasAny = flags.length || p.transportType || p.operatingHours || p.platformInfo;
  if (!hasAny) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {p.transportType && <InfoRow label="Type" value={p.transportType} />}
        {p.operatingHours && <InfoRow label="Hours" value={p.operatingHours} />}
        {p.platformInfo && (
          <div className="col-span-2">
            <InfoRow label="Platform Info" value={p.platformInfo} />
          </div>
        )}
      </div>
      {flags.length > 0 && (
        <Section icon={<CheckCircle2 size={13} />} title="Transport Facilities" accent="text-purple-400">
          <div className="flex flex-wrap gap-1.5">
            {flags.map((f) => (
              <Feature key={f} label={f} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function EmergencySection({ p }: { p: PlaceDTO }) {
  const flags: string[] = [
    p.womensHelpDesk === true && "Women's Help Desk",
    p.availability24x7 === true && "24×7 Active",
  ].filter(Boolean) as string[];

  const hasAny =
    flags.length ||
    p.stationType ||
    p.emergencyContact ||
    p.nearestHospital ||
    p.responseTime ||
    p.safetyNotes;

  if (!hasAny) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {p.stationType && <InfoRow label="Station Type" value={p.stationType} />}
        {p.emergencyContact && <InfoRow label="Emergency No." value={p.emergencyContact} />}
        {p.responseTime && <InfoRow label="Response Time" value={p.responseTime} />}
        {p.nearestHospital && (
          <div className="col-span-2">
            <InfoRow label="Nearest Hospital" value={p.nearestHospital} />
          </div>
        )}
      </div>

      {flags.length > 0 && (
        <Section icon={<CheckCircle2 size={13} />} title="Services" accent="text-rose-400">
          <div className="flex flex-wrap gap-1.5">
            {flags.map((f) => (
              <Feature key={f} label={f} />
            ))}
          </div>
        </Section>
      )}

      {p.safetyNotes && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 text-amber-400 mt-0.5" />
          {p.safetyNotes}
        </div>
      )}
    </>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function PlaceDetailModal({ place, onClose, onViewMap }: PlaceDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (place) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [place, onClose]);

  if (!place) return null;

  const categoryKey = (place.category ?? "").toLowerCase();
  const heroImage = getHeroImage(place);
  const colorStyle = CATEGORY_COLORS[categoryKey] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30";
  const categoryLabel = CATEGORY_LABELS[categoryKey] ?? place.category;
  const rating = place.rating;

  // Resolve the "status" / availability display from the actual data field
  const statusValue: string | null =
    (place as any).status ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 border border-white/15 shadow-2xl shadow-black/80 z-10 animate-in zoom-in-95 duration-200 my-auto">

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950 overflow-hidden">
          <img
            src={heroImage}
            alt={place.name}
            onError={(e) => {
              e.currentTarget.src = CATEGORY_FALLBACK_IMAGES[categoryKey] ?? CATEGORY_FALLBACK_IMAGES.hostel;
            }}
            className="w-full h-full object-cover brightness-90 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-950/70 text-slate-300 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-lg"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border backdrop-blur-md",
                  colorStyle
                )}
              >
                {categoryLabel}
              </span>
              {place.verified && (
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 backdrop-blur-md">
                  <ShieldCheck size={14} className="text-blue-400" /> Verified
                </span>
              )}
            </div>
            {/* Budget badge only when present */}
            {place.budget != null && categoryKey === "hostel" && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                ₹{place.budget}/mo
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{place.name}</h2>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin size={14} className="text-blue-400 shrink-0" />
                {place.address}, {place.city}
              </p>
            </div>
            {rating != null && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 shrink-0">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <span className="text-base font-bold">{rating.toFixed(1)}</span>
                <span className="text-xs text-amber-400/70">/ 5.0</span>
              </div>
            )}
          </div>

          {/* Quick Metrics — only show cells with real data */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {place.distanceKm != null && (
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Ruler size={13} className="text-blue-400" /> Distance
                </p>
                <p className="text-sm font-semibold text-white">
                  {place.distanceKm < 1
                    ? `${Math.round(place.distanceKm * 1000)} m`
                    : `${place.distanceKm.toFixed(1)} km`}
                </p>
              </div>
            )}

            {statusValue && (
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock size={13} className="text-emerald-400" /> Status
                </p>
                <p className="text-sm font-semibold text-emerald-300">{statusValue}</p>
              </div>
            )}

            {place.city && (
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Building size={13} className="text-purple-400" /> City
                </p>
                <p className="text-sm font-semibold text-white">{place.city}</p>
              </div>
            )}
          </div>

          {/* Description — only if it exists */}
          {place.description && (
            <Section icon={<Info size={13} />} title="Overview & Details" accent="text-blue-400">
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                {place.description}
              </p>
            </Section>
          )}

          {/* Category-specific dynamic sections */}
          {categoryKey === "hostel" && <HostelSection p={place} />}
          {categoryKey === "food" && <FoodSection p={place} />}
          {categoryKey === "clinic" && <HospitalSection p={place} />}
          {categoryKey === "atm" && <ATMSection p={place} />}
          {categoryKey === "bus" && <TransportSection p={place} />}
          {categoryKey === "emergency" && <EmergencySection p={place} />}

          {/* Contact & Links */}
          {(place.phone || place.website) && (
            <div className="grid grid-cols-2 gap-2">
              {place.phone && <InfoRow label="Phone" value={place.phone} />}
              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-slate-800/50 border border-white/5 px-3 py-2 hover:bg-slate-800 transition-colors group"
                >
                  <span className="text-[11px] text-slate-400">Website</span>
                  <span className="text-xs font-semibold text-blue-400 group-hover:underline flex items-center gap-1">
                    <Globe size={11} /> Visit
                  </span>
                </a>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                onViewMap(place._id);
                onClose();
              }}
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/25"
            >
              <MapPin size={16} />
              View on Map
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 active:scale-95 text-white text-sm font-semibold px-4 py-3 rounded-2xl border border-white/10 transition-all"
            >
              <Navigation size={16} className="text-cyan-400" />
              Directions
            </a>

            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-sm font-semibold px-4 py-3 rounded-2xl border border-emerald-500/30 transition-all"
              >
                <Phone size={16} />
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
