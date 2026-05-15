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
    <div className="h-screen w-full relative flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0">
      {/* Side Panel */}
      <div className="w-full md:w-[400px] p-4 md:p-6 z-10 flex flex-col gap-4 relative">
        <GlassCard className="border-white/20 bg-black/60 backdrop-blur-xl">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Safe Night Navigation
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Our AI analyzes street lights, crowd density, and nearby hospitals to suggest the safest route home.
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">From</p>
              <input 
                type="text" 
                defaultValue="Current Location" 
                className="bg-transparent font-medium text-white w-full outline-none placeholder-gray-600"
                placeholder="Enter start location..."
              />
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">To</p>
              <input 
                type="text" 
                defaultValue="Sunrise PG & Hostel" 
                className="bg-transparent font-medium text-white w-full outline-none placeholder-gray-600"
                placeholder="Enter destination..."
              />
            </div>
          </div>

          <div className="flex gap-2">
            <GradientButton 
              className="flex-1 text-sm py-2" 
              variant={selectedRoute === "safer" ? "primary" : "secondary"}
              onClick={() => calculateRoute("safer")}
            >
              Safer Route
            </GradientButton>
            <GradientButton 
              className="flex-1 text-sm py-2"
              variant={selectedRoute === "shortest" ? "primary" : "secondary"}
              onClick={() => calculateRoute("shortest")}
            >
              Shortest
            </GradientButton>
          </div>
        </GlassCard>

        {calculating && (
          <GlassCard className="animate-pulse bg-blue-900/20 border-blue-500/30">
            <p className="text-center text-blue-400">Analyzing route safety...</p>
          </GlassCard>
        )}

        {selectedRoute === "shortest" && !calculating && (
          <GlassCard className="border-red-500/30 bg-red-950/40 animate-in slide-in-from-left-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-full">
                <ShieldAlert className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-red-400">Unsafe Route</h3>
                <p className="text-sm text-gray-300">Risk Score: 75%</p>
              </div>
            </div>
            <ul className="text-sm text-gray-400 space-y-2 mb-4">
              <li className="flex justify-between"><span>Isolated road</span> <span className="text-red-400">+30 risk</span></li>
              <li className="flex justify-between"><span>Night time</span> <span className="text-red-400">+25 risk</span></li>
              <li className="flex justify-between"><span>No hospital nearby</span> <span className="text-red-400">+20 risk</span></li>
            </ul>
            <p className="text-xs text-red-300">Warning: Not recommended after 10 PM.</p>
          </GlassCard>
        )}

        {selectedRoute === "safer" && !calculating && (
          <GlassCard className="border-emerald-500/30 bg-emerald-950/40 animate-in slide-in-from-left-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-full">
                <ShieldCheck className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-400">Safe Route</h3>
                <p className="text-sm text-gray-300">Risk Score: 20%</p>
              </div>
            </div>
            <ul className="text-sm text-gray-400 space-y-2 mb-4">
              <li className="flex justify-between"><span>Night time</span> <span className="text-red-400">+25 risk</span></li>
              <li className="flex justify-between"><span>Main road</span> <span className="text-emerald-400">-20 risk</span></li>
              <li className="flex justify-between"><span>Crowded area</span> <span className="text-emerald-400">-15 risk</span></li>
              <li className="flex justify-between"><span>Hospital nearby</span> <span className="text-emerald-400">-10 risk</span></li>
            </ul>
            <GradientButton 
              size="sm" 
              className="w-full"
              onClick={() => alert("Starting live GPS navigation along the safer route...")}
            >
              <Navigation size={16} className="mr-2" /> Start Navigation
            </GradientButton>
          </GlassCard>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 absolute md:relative inset-0 w-full h-full z-0">
        <SafeRouteMap activeRoute={selectedRoute} />
      </div>
    </div>
  );
}
