"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Search } from "lucide-react";
import L from "leaflet";
import { Place, Category, DEMO_CENTER } from "@/data/mockPlaces";

const getIcon = (category: Category) => {
  const colorMap: Record<Category, string> = {
    hostel: "#8b5cf6", food: "#f59e0b", bus: "#3b82f6", atm: "#10b981",
    clinic: "#ef4444", "safe-route": "#06b6d4", emergency: "#ef4444", other: "#94a3b8",
  };
  const emojiMap: Record<Category, string> = {
    hostel: "🏠", food: "🍽️", bus: "🚌", atm: "💳",
    clinic: "🏥", "safe-route": "🛡️", emergency: "🚨", other: "📍",
  };
  const color = colorMap[category] || "#cbd5e1";
  const emoji = emojiMap[category] || "📍";
  return L.divIcon({
    className: "",
    html: `<div style="background-color:${color};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid rgba(255,255,255,0.9);box-shadow:0 4px 14px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);font-size:14px;display:block;line-height:1;">${emoji}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  });
};

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 6px rgba(59,130,246,0.25);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Auto-fit map to show all markers on mount + fix size
function AutoFit({ places, filter }: { places: Place[]; filter: string }) {
  const map = useMap();
  
  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    
    // Initial fix
    setTimeout(() => {
      map.invalidateSize();
      if (places.length > 0) {
        const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      } else {
        map.setView(DEMO_CENTER, 15);
      }
    }, 300);

    return () => window.removeEventListener('resize', handleResize);
  }, [map, places, filter]);
  
  return null;
}

// Map interaction listener
function MapEvents({ onMove }: { onMove: () => void }) {
  const map = useMap();
  useEffect(() => {
    map.on('moveend', onMove);
    return () => { map.off('moveend', onMove); };
  }, [map, onMove]);
  return null;
}
function MapController({ flyTo }: { flyTo: { coords: [number, number]; key: number } | null }) {
  const map = useMap();
  const key = flyTo?.key ?? null;
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo.coords, 17, { animate: true, duration: 1.2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

interface SmartMapProps {
  places: Place[];
  filter?: Category | "all";
  onMarkerClick?: (place: Place) => void;
  flyTo?: { coords: [number, number]; key: number } | null;
  userLocation?: [number, number] | null;
}

export default function SmartMap({ places, filter = "all", onMarkerClick, flyTo = null, userLocation = null }: SmartMapProps) {
  const [showSearchArea, setShowSearchArea] = useState(false);
  const filteredPlaces = filter === "all" ? places : places.filter((p) => p.category === filter);

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-0 relative group">
      {showSearchArea && (
        <button 
          onClick={() => setShowSearchArea(false)}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-2xl hover:bg-gray-100 transition-all flex items-center gap-2 border border-black/10"
        >
          <Search size={14} /> Search this area
        </button>
      )}
      
      <MapContainer
        center={DEMO_CENTER}
        zoom={15}
        className="w-full h-full absolute inset-0"
        zoomControl={false}
        scrollWheelZoom={true}
        tap={false} 
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <AutoFit places={filteredPlaces} filter={filter} />
        <MapController flyTo={flyTo} />
        <MapEvents onMove={() => setShowSearchArea(true)} />

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>📍 You are here</Popup>
          </Marker>
        )}

        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={getIcon(place.category)}
            eventHandlers={{ click: () => onMarkerClick && onMarkerClick(place) }}
          >
            <Popup>
              <div style={{ fontFamily: "sans-serif", minWidth: "160px" }}>
                <p style={{ fontWeight: "bold", fontSize: "14px", margin: "0 0 4px" }}>{place.name}</p>
                <p style={{ color: "#666", fontSize: "12px", margin: "0 0 4px" }}>{place.address}</p>
                {place.budget && <p style={{ color: "#7c3aed", fontWeight: "600", fontSize: "13px", margin: "4px 0 0" }}>₹{place.budget}</p>}
                {place.rating && <p style={{ color: "#d97706", fontSize: "12px", margin: "4px 0 0" }}>⭐ {place.rating} / 5</p>}
                {place.description && <p style={{ color: "#555", fontSize: "11px", marginTop: "6px", borderTop: "1px solid #eee", paddingTop: "6px" }}>{place.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
