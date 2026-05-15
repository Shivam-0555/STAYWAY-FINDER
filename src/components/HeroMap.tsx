"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DEMO_CENTER } from "@/data/mockPlaces";

// Route paths around Vadodara / MS University
const SAFE_ROUTE: [number, number][] = [
  [22.3100, 73.1860],
  [22.3120, 73.1920],
  [22.3155, 73.1940],
  [22.3180, 73.1925],
  [22.3200, 73.1900],
];
const RISKY_ROUTE: [number, number][] = [
  [22.3100, 73.1860],
  [22.3130, 73.1865],
  [22.3165, 73.1870],
  [22.3200, 73.1900],
];

const MARKERS = [
  { pos: [22.3160, 73.1900] as [number,number], color: "#8b5cf6", emoji: "🏠", label: "Sunrise PG" },
  { pos: [22.3148, 73.1895] as [number,number], color: "#f59e0b", emoji: "🍽️", label: "Student Mess" },
  { pos: [22.3115, 73.1855] as [number,number], color: "#ef4444", emoji: "🏥", label: "SSG Hospital" },
  { pos: [22.3138, 73.1878] as [number,number], color: "#10b981", emoji: "💳", label: "SBI ATM" },
  { pos: [22.3168, 73.1908] as [number,number], color: "#3b82f6", emoji: "🚌", label: "Bus Stop" },
];

// User location marker (pulsing blue)
const userIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(59,130,246,0.25);animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
    <div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:2.5px solid white;box-shadow:0 0 10px #3b82f6;z-index:1;"></div>
  </div>
  <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const makePin = (color: string, emoji: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      background:${color};width:34px;height:34px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);border:2.5px solid white;
      box-shadow:0 4px 14px ${color}88;
      display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);font-size:14px;">${emoji}</span>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
  });

// Optional: Controller to ensure the map stays focused on the demo area
function MapFocus() {
  const map = useMap();
  useEffect(() => {
    // Fix size and fit bounds
    const timer = setTimeout(() => {
      map.invalidateSize();
      const allPoints = [...SAFE_ROUTE, ...RISKY_ROUTE, ...MARKERS.map(m => m.pos)];
      if (allPoints.length > 0) {
        map.fitBounds(L.latLngBounds(allPoints as L.LatLngExpression[]), { padding: [30, 30], animate: true });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function HeroMap() {
  return (
    <div className="w-full h-full relative z-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      <MapContainer
        center={DEMO_CENTER}
        zoom={15}
        minZoom={13}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapFocus />

        {/* Risky route — red dashed */}
        <Polyline
          positions={RISKY_ROUTE}
          pathOptions={{ color: "#ef4444", weight: 4, opacity: 0.75, dashArray: "10 8" }}
        />

        {/* Safe route — green glowing */}
        <Polyline
          positions={SAFE_ROUTE}
          pathOptions={{ color: "#22c55e", weight: 5, opacity: 0.9 }}
        />
        {/* Glow layer */}
        <Polyline
          positions={SAFE_ROUTE}
          pathOptions={{ color: "#4ade80", weight: 12, opacity: 0.18 }}
        />

        {/* User location */}
        <Marker position={DEMO_CENTER} icon={userIcon} />

        {/* Category markers */}
        {MARKERS.map((m, i) => (
          <Marker key={i} position={m.pos} icon={makePin(m.color, m.emoji)}>
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold text-sm mb-1">{m.label}</p>
                <a 
                  href={`/dashboard?search=${encodeURIComponent(m.label)}`}
                  className="text-[10px] text-purple-400 font-bold hover:underline"
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Route legend overlay */}
      <div className="absolute top-3 right-3 z-[500] flex flex-col gap-1.5">
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-500/30 text-xs text-green-400 font-medium">
          <span className="w-6 h-0.5 rounded-full bg-green-400 block" />
          Safe Route
        </div>
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30 text-xs text-red-400 font-medium">
          <span className="w-6 h-0.5 rounded-full bg-red-400 block" style={{ backgroundImage: "repeating-linear-gradient(90deg,#f87171 0,#f87171 4px,transparent 4px,transparent 8px)" }} />
          Risky Route
        </div>
      </div>

      {/* "Live" badge */}
      <div className="absolute bottom-3 left-3 z-[500] flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
        <span className="text-green-300 text-xs font-semibold">Live Preview</span>
      </div>
    </div>
  );
}
