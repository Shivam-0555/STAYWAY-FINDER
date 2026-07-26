"use client";
import { Home, Utensils, AlertTriangle, Stethoscope, Bus, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryKey } from "./types";

export type { CategoryKey };

interface CategoryFiltersProps {
  selected: CategoryKey;
  onSelect: (cat: CategoryKey) => void;
}

type CategoryDef = {
  key: CategoryKey;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  activeGradient: string;
};

const categories: CategoryDef[] = [
  {
    key: "hostel",
    label: "Hostel / PG",
    Icon: Home,
    gradient: "from-blue-500/10 to-cyan-500/5 border-blue-500/20",
    activeGradient: "from-blue-600 to-cyan-600 border-blue-500",
  },
  {
    key: "food",
    label: "Food",
    Icon: Utensils,
    gradient: "from-orange-500/10 to-yellow-500/5 border-orange-500/20",
    activeGradient: "from-orange-600 to-yellow-500 border-orange-500",
  },
  {
    key: "emergency",
    label: "Emergency / SOS",
    Icon: AlertTriangle,
    gradient: "from-rose-500/10 to-pink-500/5 border-rose-500/20",
    activeGradient: "from-rose-600 to-pink-600 border-rose-500",
  },
  {
    key: "clinic",
    label: "Hospital",
    Icon: Stethoscope,
    gradient: "from-red-500/10 to-rose-500/5 border-red-500/20",
    activeGradient: "from-red-600 to-rose-600 border-red-500",
  },
  {
    key: "bus",
    label: "Transport",
    Icon: Bus,
    gradient: "from-purple-500/10 to-violet-500/5 border-purple-500/20",
    activeGradient: "from-purple-600 to-violet-600 border-purple-500",
  },
  {
    key: "atm",
    label: "ATM",
    Icon: CreditCard,
    gradient: "from-green-500/10 to-emerald-500/5 border-green-500/20",
    activeGradient: "from-green-600 to-emerald-600 border-green-500",
  },
];

export default function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      {/* All button */}
      <button
        onClick={() => onSelect("")}
        className={cn(
          "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold border backdrop-blur transition-all duration-200",
          selected === ""
            ? "bg-gradient-to-r from-slate-500 to-slate-600 border-slate-400 text-white shadow-lg shadow-slate-500/20"
            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
        )}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key === selected ? "" : cat.key)}
          className={cn(
            "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold border backdrop-blur transition-all duration-200",
            selected === cat.key
              ? `bg-gradient-to-r ${cat.activeGradient} text-white shadow-lg`
              : `bg-gradient-to-r ${cat.gradient} text-slate-300 hover:text-white hover:scale-105`
          )}
        >
          <cat.Icon className="h-4 w-4" />
          {cat.label}
        </button>
      ))}
    </div>
  );
}
