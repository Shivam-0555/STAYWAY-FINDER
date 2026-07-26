// src/components/find/SearchBar.tsx
"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
}

export default function SearchBar({ query, setQuery, loading }: SearchBarProps) {
  const [local, setLocal] = useState(query);

  // Debounce input → update parent query after 300ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => setQuery(local), 300);
    return () => clearTimeout(handler);
  }, [local, setQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setLocal(e.target.value);
  const clear = () => {
    setLocal("");
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder="Search hostels, food, hospitals, transport, ATM or address..."
        className={cn(
          "w-full rounded-3xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-14 text-base text-white placeholder:text-slate-500 shadow-2xl shadow-black/20 outline-none transition-all focus:border-blue-500 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20",
          loading && "opacity-80"
        )}
      />
      {local && !loading && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      )}
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
          <Loader2 size={20} className="animate-spin" />
        </div>
      )}
    </div>
  );
}
