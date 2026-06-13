"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { RouteType } from "./page";

// Vadodara realistic coordinates
const START_POS: [number, number] = [22.3144, 73.1886]; // Sayajigunj
const END_POS: [number, number] = [22.3280, 73.1780];   // Fatehgunj (~2km north)

const SHORTEST_PATH: [number, number][] = [
  START_POS,
  [22.3200, 73.1830], // Isolated back lane
  [22.3245, 73.1805],
  END_POS,
];

const SAFER_PATH: [number, number][] = [
  START_POS,
  [22.3155, 73.1920], // Race Course Road (main road)
  [22.3220, 73.1900], // Near Sterling Hospital
  [22.3260, 73.1840], // Fatehgunj Main Road
  END_POS,
];

const startIcon = L.divIcon({
  className: "",
  html: `<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px #22c55e;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const endIcon = L.divIcon({
  className: "",
  html: `<div style="background:#f43f5e;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px #f43f5e;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapFitter({ activeRoute }: { activeRoute: RouteType }) {
  const map = useMap();
  useEffect(() => {
    // Fix size on load
    setTimeout(() => {
      map.invalidateSize();
      const path = activeRoute === "safer" ? SAFER_PATH : activeRoute === "shortest" ? SHORTEST_PATH : [START_POS, END_POS];
      map.fitBounds(L.latLngBounds(path), { padding: [60, 60], animate: true });
    }, 300);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeRoute, map]);
  return null;
}

export default function SafeRouteMap({ activeRoute }: { activeRoute: RouteType }) {
  return (
    <div className="w-full h-full relative z-0 overflow-hidden bg-[#05050f]">
      <MapContainer
        center={START_POS}
        zoom={14}
        className="w-full h-full"
        zoomControl={false} // Move to custom position
        scrollWheelZoom={true}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapFitter activeRoute={activeRoute} />

        {/* Start marker */}
        <Marker position={START_POS} icon={startIcon}>
          <Popup>📍 Your Location — Sayajigunj, Vadodara</Popup>
        </Marker>

        {/* End marker */}
        <Marker position={END_POS} icon={endIcon}>
          <Popup>🏠 Destination — Sunrise PG & Hostel, Fatehgunj</Popup>
        </Marker>

        {/* Shortest / Unsafe route */}
        {activeRoute === "shortest" && (
          <>
            <Polyline
              positions={SHORTEST_PATH}
              color="#ef4444"
              weight={5}
              opacity={0.9}
              dashArray="12, 8"
            />
          </>
        )}

        {/* Safer route */}
        {activeRoute === "safer" && (
          <>
            <Polyline
              positions={SAFER_PATH}
              color="#10b981"
              weight={5}
              opacity={0.9}
            />
          </>
        )}

        {/* Show both faded if none selected */}
        {!activeRoute && (
          <>
            <Polyline positions={SHORTEST_PATH} color="#ef4444" weight={3} opacity={0.25} dashArray="8, 10" />
            <Polyline positions={SAFER_PATH} color="#10b981" weight={3} opacity={0.25} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
