"use client";
import ResultCard from "./ResultCard";
import { PlaceDTO } from "@/components/find/types";

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-2/3" />
        <div className="flex gap-2 pt-3">
          <div className="h-8 bg-slate-700 rounded-xl flex-1" />
          <div className="h-8 w-8 bg-slate-800 rounded-xl" />
          <div className="h-8 w-8 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

type Props = {
  places: PlaceDTO[];
  onViewMap: (id: string) => void;
  onSelectPlace?: (place: PlaceDTO) => void;
  selectedId?: string | null;
  loading?: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
};

export default function ResultsGrid({
  places,
  onViewMap,
  onSelectPlace,
  selectedId,
  loading,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {total > 0 && (
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="text-slate-300 font-semibold">{places.length}</span>{" "}
          of <span className="text-slate-300 font-semibold">{total}</span> results
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {places.map((place) => (
          <ResultCard
            key={place._id}
            place={place}
            onViewMap={onViewMap}
            onSelectPlace={onSelectPlace}
            isSelected={selectedId === place._id}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 border border-white/10 transition-all"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 border border-white/10 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
