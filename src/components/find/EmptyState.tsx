"use client";

import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 text-center min-h-[300px]">
      <div className="bg-slate-800/50 p-4 rounded-full mb-4 ring-1 ring-white/10">
        <SearchX className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No places found</h3>
      <p className="text-slate-400 max-w-sm">
        We couldn't find any places matching your current search. Try adjusting your filters or searching for something else.
      </p>
    </div>
  );
}
