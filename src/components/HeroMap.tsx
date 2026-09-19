"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, LayersControl, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MarkerItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "hostel" | "food" | "hospital" | "emergency" | "transport" | "atm";
  emoji: string;
  distance: string;
  rating: number;
  status: string;
  color: string;
};

type ApiPlace = {
  id: string;
  name: string;
  category: "hostel" | "food" | "bus" | "atm" | "clinic" | "emergency" | "safe-route" | "other";
  city: string;
  lat: number;
  lng: number;
  budget?: number;
  rating?: number;
  address: string;
  description?: string;
};

type ViewMode = "light" | "satellite";

const DEFAULT_CENTER = { lat: 22.3072, lng: 73.1812 };
const createIcon = (color: string, emoji: string) =>
  L.divIcon({
    html: `<div style="background:${color};" class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm shadow-lg">${emoji}</div>`,
    className: "bg-transparent border-none",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createPulseIcon = () =>
  L.divIcon({
    html: `<div class="relative flex h-8 w-8 items-center justify-center"><span class="absolute h-8 w-8 animate-ping rounded-full bg-sky-400/40"></span><span class="relative h-4 w-4 rounded-full border-2 border-white bg-sky-500 shadow-[0_0_16px_rgba(59,130,246,0.8)]"></span></div>`,
    className: "bg-transparent border-none",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

function MapController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center, zoom, map]);

  return null;
}

interface HeroMapProps {
  className?: string;
  previewOnly?: boolean;
}

export default function HeroMap({ className, previewOnly = false }: HeroMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeMarker, setActiveMarker] = useState<MarkerItem | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("light");
  const [markers, setMarkers] = useState<MarkerItem[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    async function loadMarkers() {
      try {
        const response = await fetch("/api/places");
        if (!response.ok) {
          setMarkers([]);
          return;
        }
        const data: ApiPlace[] = await response.json();
        const nextMarkers: MarkerItem[] = data.map((place) => ({
          id: place.id,
          name: place.name,
          lat: place.lat,
          lng: place.lng,
          type: place.category === "hostel" ? "hostel" : place.category === "food" ? "food" : place.category === "clinic" ? "hospital" : place.category === "emergency" ? "emergency" : "transport",
          emoji: place.category === "hostel" ? "🏠" : place.category === "food" ? "🍽️" : place.category === "clinic" ? "🏥" : place.category === "emergency" ? "🚨" : "🚌",
          distance: "Nearby",
          rating: place.rating ?? 4.5,
          status: "Live",
          color: place.category === "hostel" ? "#8b5cf6" : place.category === "food" ? "#f59e0b" : place.category === "clinic" ? "#ef4444" : place.category === "emergency" ? "#ef4444" : "#3b82f6",
        }));
        setMarkers(nextMarkers);
      } catch {
        setMarkers([]);
      }
    }

    loadMarkers();
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      setUserLocation(DEFAULT_CENTER);
      setIsLoadingLocation(false);
      return;
    }

    if (!("geolocation" in navigator)) {
      setUserLocation(DEFAULT_CENTER);
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLoadingLocation(false);
      },
      () => {
        setUserLocation(DEFAULT_CENTER);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const center = useMemo(() => userLocation ?? DEFAULT_CENTER, [userLocation]);

  const safeRoute = useMemo<[number, number][]>(
    () => [
      [center.lat, center.lng],
      [center.lat + 0.0032, center.lng + 0.0019],
      [center.lat + 0.0054, center.lng + 0.0047],
      [center.lat + 0.0073, center.lng + 0.0024],
      [center.lat + 0.0086, center.lng - 0.0007],
    ],
    [center]
  );

  const riskyRoute = useMemo<[number, number][]>(
    () => [
      [center.lat, center.lng],
      [center.lat + 0.0024, center.lng - 0.0032],
      [center.lat + 0.0046, center.lng - 0.0027],
      [center.lat + 0.0062, center.lng - 0.001],
    ],
    [center]
  );

  const focusOnLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.2 });
    }
  };

  return (
    <div className={`relative h-full w-full overflow-hidden ${className || "rounded-3xl border border-slate-200 shadow-sm"}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        scrollWheelZoom={!previewOnly}
        zoomControl={false}
        dragging={!previewOnly}
        className="h-full w-full z-0"
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <MapController center={center} zoom={14} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!previewOnly && <ZoomControl position="bottomright" />}

        {/* Clean blue navigation route matching reference screenshot */}
        <Polyline 
          pathOptions={{ 
            color: "#2563eb", 
            weight: 5, 
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round"
          }} 
          positions={safeRoute} 
        />
        {!previewOnly && (
          <Polyline pathOptions={{ color: "#ef4444", weight: 3, opacity: 0.7, dashArray: "6 6" }} positions={riskyRoute} />
        )}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createPulseIcon()} />
        )}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createIcon(marker.color, marker.emoji)}
            eventHandlers={{ click: () => setActiveMarker(marker) }}
          >
            <Popup>
              <div className="w-56 rounded-2xl p-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Nearby</p>
                      <h4 className="mt-1 text-sm font-semibold text-slate-900">{marker.name}</h4>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">★ {marker.rating.toFixed(1)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>{marker.distance}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-600">{marker.status}</span>
                  </div>
                  <button type="button" className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {activeMarker && (
          <CircleMarker center={[activeMarker.lat, activeMarker.lng]} radius={8} pathOptions={{ color: activeMarker.color, fillColor: activeMarker.color, fillOpacity: 0.9 }} />
        )}
      </MapContainer>

      {/* Floating Badge for preview mode or full mode */}
      {previewOnly ? (
        <div className="absolute bottom-3 left-3 z-1000 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1.5 text-[11px] font-medium text-white shadow-md backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          You are here
        </div>
      ) : (
        <>
          <div className="absolute left-3 top-3 z-1000 flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            Live Preview
          </div>

          <div className="absolute right-3 top-3 z-1000 flex items-center gap-2">
            <button 
              type="button" 
              onClick={focusOnLocation} 
              className="rounded-full border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:bg-slate-50 transition"
            >
              Locate Me
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3 z-1000 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-3.5 py-2 text-[11px] font-medium text-slate-600 shadow-md backdrop-blur">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">🏠 Hostels & PGs</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">🍔 Food Options</span>
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-violet-700">🏧 ATMs</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">🚌 Bus Stops</span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700">🚨 Emergency Services</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Safe Route
            </div>
          </div>
        </>
      )}

      {isLoadingLocation && !previewOnly && (
        <div className="absolute bottom-16 left-3 z-1000 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
          Detecting your location…
        </div>
      )}
    </div>
  );
}
