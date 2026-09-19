"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ShieldAlert, ShieldCheck, Navigation } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";

// Import map dynamically
const SafeRouteMap = dynamic(() => import("./SafeRouteMap"), { ssr: false });

export type RouteType = "shortest" | "safer" | null;

export default function SafeRoutePage() {
  const [selectedRoute, setSelectedRoute] = useState<RouteType>(null);
  const [calculating, setCalculating] = useState(false);

  const calculateRoute = (type: RouteType) => {
    setCalculating(true);
    setTimeout(() => {
      setSelectedRoute(type);
      setCalculating(false);
    }, 1000);
  };

  return (
    <div className="h-screen w-full relative flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0 bg-slate-950 text-white">
      {/* Side Panel */}
      <div className="w-full md:w-[420px] p-4 md:p-6 z-10 flex flex-col gap-4 relative">
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">
            Safe Night Navigation
          </h1>
          <p className="text-sm font-medium text-slate-200 leading-relaxed mb-6">
            Our AI analyzes street lights, crowd density, and nearby hospitals to suggest the safest route home.
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">From</p>
              <input 
                type="text" 
                defaultValue="Current Location" 
                className="bg-transparent font-semibold text-white w-full outline-none placeholder-slate-400 text-sm"
                placeholder="Enter start location..."
              />
            </div>
            <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">To</p>
              <input 
                type="text" 
                defaultValue="Sunrise PG & Hostel" 
                className="bg-transparent font-semibold text-white w-full outline-none placeholder-slate-400 text-sm"
                placeholder="Enter destination..."
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              type="button"
              className={`flex-1 text-sm font-bold py-3 rounded-full transition cursor-pointer ${
                selectedRoute === "safer"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
              onClick={() => calculateRoute("safer")}
            >
              Safer Route
            </button>
            <button 
              type="button"
              className={`flex-1 text-sm font-bold py-3 rounded-full transition cursor-pointer ${
                selectedRoute === "shortest"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
              onClick={() => calculateRoute("shortest")}
            >
              Shortest
            </button>
          </div>
        </div>

        {calculating && (
          <div className="animate-pulse bg-blue-950/80 border border-blue-500/40 p-4 rounded-2xl text-center">
            <p className="text-sm font-bold text-blue-300">Analyzing route safety...</p>
          </div>
        )}

        {selectedRoute === "shortest" && !calculating && (
          <div className="rounded-3xl border border-rose-500/50 bg-rose-950/90 p-5 shadow-xl animate-in slide-in-from-left-4 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-rose-500/30 rounded-xl text-rose-300">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-rose-300">Unsafe Route</h3>
                <p className="text-xs font-bold text-slate-200">Risk Score: 75%</p>
              </div>
            </div>
            <ul className="text-xs font-semibold text-slate-200 space-y-2 mb-4">
              <li className="flex justify-between border-b border-rose-900/50 pb-1"><span>Isolated road</span> <span className="text-rose-300 font-bold">+30 risk</span></li>
              <li className="flex justify-between border-b border-rose-900/50 pb-1"><span>Night time</span> <span className="text-rose-300 font-bold">+25 risk</span></li>
              <li className="flex justify-between"><span>No hospital nearby</span> <span className="text-rose-300 font-bold">+20 risk</span></li>
            </ul>
            <p className="text-xs font-bold text-rose-300">Warning: Not recommended after 10 PM.</p>
          </div>
        )}

        {selectedRoute === "safer" && !calculating && (
          <div className="rounded-3xl border border-emerald-500/50 bg-emerald-950/90 p-5 shadow-xl animate-in slide-in-from-left-4 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-500/30 rounded-xl text-emerald-300">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-emerald-300">Safe Route</h3>
                <p className="text-xs font-bold text-slate-200">Risk Score: 20%</p>
              </div>
            </div>
            <ul className="text-xs font-semibold text-slate-200 space-y-2 mb-4">
              <li className="flex justify-between border-b border-emerald-900/50 pb-1"><span>Night time</span> <span className="text-rose-300 font-bold">+25 risk</span></li>
              <li className="flex justify-between border-b border-emerald-900/50 pb-1"><span>Main road</span> <span className="text-emerald-300 font-bold">-20 risk</span></li>
              <li className="flex justify-between border-b border-emerald-900/50 pb-1"><span>Crowded area</span> <span className="text-emerald-300 font-bold">-15 risk</span></li>
              <li className="flex justify-between"><span>Hospital nearby</span> <span className="text-emerald-300 font-bold">-10 risk</span></li>
            </ul>
            <button 
              type="button"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-full transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              onClick={() => alert("Starting live GPS navigation along the safer route...")}
            >
              <Navigation size={15} />
              <span>Start Navigation</span>
            </button>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 absolute md:relative inset-0 w-full h-full z-0">
        <SafeRouteMap activeRoute={selectedRoute} />
      </div>
    </div>
  );
}
