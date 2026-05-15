"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { GradientButton } from "@/components/ui/GradientButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Map, ShieldCheck, HeartPulse, Search, MapPin, Utensils, Building2, ShieldAlert } from "lucide-react";
import Link from "next/link";

const HeroMap = dynamic(() => import("@/components/HeroMap"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Smart Student City Navigation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 leading-tight"
          >
            Helping Students Navigate Cities Safely.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0"
          >
            CampusCompass is your smart student city helper. Find hostels, affordable food, and safe routes home with our interactive map and safety score.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link href="/dashboard">
              <GradientButton size="lg" className="w-full sm:w-auto">
                <Map className="mr-2" size={20} /> Open Smart Map
              </GradientButton>
            </Link>
            <Link href="/route">
              <GradientButton variant="secondary" size="lg" className="w-full sm:w-auto">
                <ShieldCheck className="mr-2" size={20} /> Check Safe Route
              </GradientButton>
            </Link>
          </motion.div>
        </div>

        {/* REAL Leaflet Map Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 relative w-full max-w-xl"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]">
            <HeroMap />
          </div>
        </motion.div>
      </section>

      {/* Stats Section — Glass Cards */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto -mt-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: MapPin, value: "24+", label: "Hostels & PGs", color: "purple", gradient: "from-purple-500/20 to-purple-900/10", border: "border-purple-500/20" },
            { icon: Utensils, value: "18+", label: "Food Spots", color: "amber", gradient: "from-amber-500/20 to-amber-900/10", border: "border-amber-500/20" },
            { icon: Building2, value: "6", label: "Clinics", color: "red", gradient: "from-red-500/20 to-red-900/10", border: "border-red-500/20" },
            { icon: ShieldAlert, value: "92%", label: "Safety Score", color: "emerald", gradient: "from-emerald-500/20 to-emerald-900/10", border: "border-emerald-500/20" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
              >
                <div className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-xl border ${stat.border} rounded-2xl p-5 text-center hover:scale-105 transition-transform`}>
                  <Icon size={22} className={`mx-auto mb-2 text-${stat.color}-400`} />
                  <p className={`text-3xl font-black text-${stat.color}-400`}>{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-lg">Designed specifically for students new to the city.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard" className="block h-full group">
            <GlassCard hoverEffect className="h-full cursor-pointer group-hover:border-blue-500/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                <Search className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Search</h3>
              <p className="text-gray-400">Find PG under ₹5000 or mess under ₹80 with intelligent filters.</p>
            </GlassCard>
          </Link>

          <Link href="/route" className="block h-full group">
            <GlassCard hoverEffect className="h-full cursor-pointer group-hover:border-purple-500/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Safe Routes</h3>
              <p className="text-gray-400">Night navigation logic that avoids isolated roads and prioritizes main streets.</p>
            </GlassCard>
          </Link>

          <Link href="/emergency" className="block h-full group">
            <GlassCard hoverEffect className="h-full cursor-pointer group-hover:border-pink-500/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-6">
                <HeartPulse className="text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Emergency Help</h3>
              <p className="text-gray-400">One-click SOS and instant navigation to the nearest clinic or hospital.</p>
            </GlassCard>
          </Link>

          <Link href="/dashboard" className="block h-full group">
            <GlassCard hoverEffect className="h-full cursor-pointer group-hover:border-emerald-500/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                <Map className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Student Reviews</h3>
              <p className="text-gray-400">Read honest reviews from other students about food quality and hostel safety.</p>
            </GlassCard>
          </Link>
        </div>
      </section>

      {/* Safety Banner */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <GlassCard className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-purple-500/30 text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Never Feel Lost or Unsafe Again</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Our proprietary Safety Score Logic analyzes crowd density, road type, and lighting to give you the most secure path back to your dorm.
          </p>
          <Link href="/route">
            <GradientButton>Try Safe Route Feature</GradientButton>
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
