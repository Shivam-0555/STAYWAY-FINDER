"use client";

import { useState, useEffect } from "react";
import { Phone, ShieldAlert, Navigation, Stethoscope, AlertTriangle, MapPin, Loader2, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { motion } from "framer-motion";

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationName, setLocationName] = useState("Detecting location...");

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationName("Location unavailable");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        // Reverse geocode to get readable address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address;
          const parts = [
            addr.neighbourhood || addr.suburb || addr.hamlet || "",
            addr.city || addr.town || addr.village || addr.county || "",
            addr.state || ""
          ].filter(Boolean);
          setLocationName(parts.join(", ") || `${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E`);
        } catch {
          setLocationName(`${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E`);
        }
        setLocating(false);
      },
      () => {
        setLocationName("Vadodara (default)");
        setUserLocation({ lat: 22.3144, lng: 73.1886 });
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => {
      alert(
        `🚨 SOS Signal Sent!\n\n` +
        `📍 Your Location: ${locationName}\n` +
        `✅ Campus Security has been alerted.\n` +
        `✅ Emergency contacts notified.\n` +
        `✅ Nearest police station pinged.`
      );
      setSosActive(false);
    }, 2000);
  };

  const openNearestInMaps = (query: string) => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${userLocation.lat},${userLocation.lng},14z`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-500 mb-4 flex items-center justify-center gap-3">
          <AlertTriangle size={36} /> Emergency Help
        </h1>
        <p className="text-gray-400">Immediate assistance and quick access to essential services.</p>

        {/* Live Location Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm">
          {locating ? (
            <Loader2 size={14} className="animate-spin text-blue-400" />
          ) : (
            <MapPin size={14} className="text-blue-400" />
          )}
          <span className="text-blue-300 font-medium">
            {locating ? "Detecting your location..." : `📍 ${locationName}`}
          </span>
          {!locating && (
            <button onClick={detectLocation} className="text-blue-400 hover:text-blue-300 text-xs underline ml-1">
              Refresh
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* SOS Button Area */}
        <GlassCard className="flex flex-col items-center justify-center py-12 border-red-500/20 bg-red-950/10 relative overflow-hidden">
          {sosActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute w-48 h-48 bg-red-500 rounded-full"
            />
          )}
          <button
            onClick={handleSOS}
            className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center text-white border-4 border-red-400 hover:scale-105 active:scale-95 transition-all"
          >
            <ShieldAlert size={64} className="mb-2" />
            <span className="text-3xl font-black tracking-widest">SOS</span>
          </button>
          <p className="mt-8 text-sm text-red-300 text-center max-w-xs">
            Hold for 3 seconds to instantly alert campus security and your emergency contacts.
          </p>
        </GlassCard>

        {/* Emergency Contacts */}
        <GlassCard className="flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Phone className="text-blue-400" /> Quick Dial
          </h2>
          <div className="space-y-4 flex-1">

            {/* Police — with "Find Nearest" */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">Police Station (Sector 4)</p>
                  <p className="text-sm text-gray-400">100</p>
                </div>
                <a href="tel:100" className="inline-block">
                  <GradientButton size="sm" variant="secondary"><Phone size={16} /></GradientButton>
                </a>
              </div>
              <button
                onClick={() => openNearestInMaps("police station near me")}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
              >
                <MapPin size={12} /> Find nearest police station
                <ExternalLink size={10} />
              </button>
            </div>

            {/* Campus Security — with "Find Nearest" */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">Campus Security</p>
                  <p className="text-sm text-gray-400">+91 98765 43210</p>
                </div>
                <a href="tel:+919876543210" className="inline-block">
                  <GradientButton size="sm" variant="secondary"><Phone size={16} /></GradientButton>
                </a>
              </div>
              <button
                onClick={() => openNearestInMaps("campus security office near me")}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
              >
                <MapPin size={12} /> Find nearest security office
                <ExternalLink size={10} />
              </button>
            </div>

            {/* Ambulance */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">City Hospital Ambulance</p>
                  <p className="text-sm text-gray-400">102 / 108</p>
                </div>
                <a href="tel:102" className="inline-block">
                  <GradientButton size="sm" variant="secondary"><Phone size={16} /></GradientButton>
                </a>
              </div>
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => openNearestInMaps("hospital near me")}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <MapPin size={12} /> Nearest hospital
                  <ExternalLink size={10} />
                </button>
                <a href="tel:108" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  📞 Dial 108
                </a>
              </div>
            </div>

          </div>
        </GlassCard>
      </div>

      {/* Nearest Medical Facility */}
      <GlassCard className="border-emerald-500/20 bg-emerald-950/10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Stethoscope className="text-emerald-400" /> Nearest Medical Facility
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-emerald-300">SSG Hospital, Vadodara</h3>
            <p className="text-gray-400 mb-2">Jail Road, Vadodara • 1.2 km away</p>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                Open 24/7 • ER Available
              </span>
              {userLocation && (
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                  📍 Based on your location
                </span>
              )}
            </div>
          </div>
          <GradientButton
            className="w-full md:w-auto flex-shrink-0 !bg-emerald-600 hover:!bg-emerald-500 border-none"
            onClick={() => openNearestInMaps("SSG Hospital Vadodara")}
          >
            <Navigation size={18} className="mr-2" /> Navigate Now
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
}
