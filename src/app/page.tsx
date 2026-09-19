"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Home as HomeIcon, 
  Utensils, 
  Building2, 
  ShieldAlert, 
  Compass, 
  Phone, 
  Mail, 
  Target, 
  Eye, 
  Sparkles,
  ChevronDown
} from "lucide-react";

const HeroMap = dynamic(() => import("@/components/HeroMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
      Loading interactive map…
    </div>
  )
});

const stats = [
  { label: "Total Cities", sublabel: "Total Places", value: "58", icon: MapPin },
  { label: "Active Services", sublabel: "Hostels", value: "24", icon: Building2 },
  { label: "Emergency Support", sublabel: "Food Spots", value: "18", icon: ShieldAlert },
  { label: "Safety Features", sublabel: "Hospitals", value: "6", icon: Sparkles },
  { label: "Happy Students", sublabel: "Emergency Services", value: "10", icon: ShieldCheck },
];

const checklistItems = [
  "Find safe and affordable stays",
  "Get safe night routes",
  "Discover food options nearby",
  "Save time and travel smart",
  "Locate ATMs & bus stops",
  "Explore your new city with ease",
  "Access emergency services",
  "Feel secure, always",
];

const featureCards = [
  {
    icon: HomeIcon,
    title: "Find Hostels & PGs",
    description: "Discover verified and budget-friendly stays near you.",
    altTitle: "Smart Search",
    altDescription: "Search hostels, food, ATMs, hospitals and emergency services from one place."
  },
  {
    icon: Utensils,
    title: "Affordable Food Options",
    description: "Explore best food places within your budget.",
    altTitle: "Student-First UX",
    altDescription: "A polished experience designed for young adults exploring new cities."
  },
  {
    icon: Building2,
    title: "Locate ATMs & Bus Stops",
    description: "Easily find ATMs and nearby bus stops.",
    altTitle: "City Transit",
    altDescription: "Navigate campus routes, bus hubs, and transit stations with ease."
  },
  {
    icon: ShieldAlert,
    title: "Emergency Services",
    description: "Quick access to help when you need it most.",
    altTitle: "Emergency Ready",
    altDescription: "One-tap emergency actions for police, ambulance, hospitals and helplines."
  },
  {
    icon: Compass,
    title: "Night Safe Navigation",
    description: "Get safer routes for night travel.",
    altTitle: "Premium Map",
    altDescription: "See your current location, live markers, and safe routes in a beautiful city map."
  },
];

const CITIES = [
  "Select City",
  "Vadodara",
  "Ahmedabad",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Patna"
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "contact",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCity && selectedCity !== "Select City") params.set("city", selectedCity);
    router.push(`/find?${params.toString()}`);
  };

  const handleUseMyLocation = () => {
    router.push("/dashboard");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidPhone = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return true;
    if (/[A-Za-z]/.test(trimmed)) return false;
    const digitsOnly = trimmed.replace(/\D/g, "");
    if (digitsOnly.length < 6) return false;
    return /^[+]?[-()\s\d]+$/.test(trimmed);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    if (!isValidPhone(formData.phone)) {
      setSubmitMessage("Please enter a valid phone number or leave the field empty.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Unable to send message.");
      }

      setSubmitMessage("Your message has been received. We will review it shortly.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", category: "contact" });
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "Unable to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-white pt-8 pb-16 md:pt-14 md:pb-24">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(238,242,255,0.7),transparent_50%),radial-gradient(circle_at_top_right,rgba(224,242,254,0.6),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Headline, Subtitle, Search Control */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm shadow-2xs">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>Safe Students • Smarter Cities</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline text-slate-500 font-normal">Launching a safer student city experience.</span>
              </div>

              {/* Headline */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.15]">
                Find Safe Stays, Food, Routes & Essential Services{" "}
                <span className="text-blue-600 font-extrabold">Around You!</span>
              </h1>

              {/* Supporting Text */}
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                StayWay Finder helps students discover affordable stays, food options, ATMs, bus stops, emergency services and safe routes — all in one place.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                StayWay Finder gives students fast access to secure hostels, trusted food spots, emergency services and safe navigational routes around you! Workable across all supported cities — instant safety insights for every student journey.
              </p>

              {/* Interactive Search Bar Control (Matches Screenshot) */}
              <form 
                onSubmit={handleSearchSubmit}
                className="mt-8 w-full max-w-2xl rounded-2xl sm:rounded-full border border-slate-200/90 bg-white p-2 shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
              >
                {/* Use My Location Button */}
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="flex items-center gap-2 rounded-xl sm:rounded-full px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shrink-0 cursor-pointer"
                >
                  <MapPin size={15} className="text-blue-600" />
                  <span>Use My Location</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                <div className="hidden sm:block h-6 w-px bg-slate-200" />

                {/* City Selector */}
                <div className="relative flex items-center px-3 py-1 shrink-0">
                  <Building2 size={15} className="text-slate-400 mr-2 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-4 appearance-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="pointer-events-none text-slate-400 -ml-3" />
                </div>

                <div className="hidden sm:block h-6 w-px bg-slate-200" />

                {/* Query Input */}
                <div className="relative flex-1 flex items-center px-3 py-1">
                  <Search size={15} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for hostels, food, ATM..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>

                {/* Search CTA */}
                <button
                  type="submit"
                  className="rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 text-xs sm:text-sm shadow-sm shadow-blue-500/25 transition shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Search</span>
                </button>
              </form>
            </motion.div>

            {/* Right Column: Natural Student Photography & Map Preview below image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 flex flex-col gap-4 relative max-w-lg mx-auto w-full"
            >
              {/* Main Student Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-[14/9] w-full overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/70">
                <Image
                  src="/images/hero_student_campus.jpg"
                  alt="Student with backpack on campus looking toward city"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                {/* Floating Top Badge: Safer Routes */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 px-3 py-1.5 shadow-md shadow-slate-300/40 backdrop-blur-md">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Safer Routes</p>
                    <p className="text-[9px] text-slate-500 font-medium">Better Choices</p>
                  </div>
                </div>
              </div>

              {/* Map Preview Card Shifted Below the Image */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full h-48 sm:h-52 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/60"
              >
                <HeroMap previewOnly={true} className="rounded-2xl" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABOUT STAYWAY FINDER SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Content Side */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1 text-xs font-semibold text-sky-700">
                <span>About StayWay Finder</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                About StayWay Finder
              </h2>

              <p className="mt-5 text-base leading-relaxed text-slate-600">
                StayWay Finder is built to make student life easier and safer. We help you find affordable stays, food options, ATMs, bus stops, emergency services and the safest routes in a new city — all in one place.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                A premium safety platform designed for students who want confidence in every city. StayWay Finder brings together the essentials of modern student travel into one polished experience so every move feels informed, secure, and effortless.
              </p>

              <div className="mt-7">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
                >
                  <span>Learn More</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Photographic Split with Mission & Vision Overlay Cards */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/60">
                <Image
                  src="/images/campus_students_walk.jpg"
                  alt="University students walking together on campus"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                {/* Overlaid Mission & Vision Cards matching the screenshot */}
                <div className="absolute inset-x-4 bottom-4 grid grid-cols-1 sm:grid-cols-2 gap-3 z-10">
                  {/* Mission Card */}
                  <div className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg shadow-slate-900/10 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Target size={18} />
                      <h3 className="text-sm font-bold text-slate-900">Mission</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      To make every student's journey safer, simpler and more affordable.
                    </p>
                  </div>

                  {/* Vision Card */}
                  <div className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg shadow-slate-900/10 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Eye size={18} />
                      <h3 className="text-sm font-bold text-slate-900">Vision</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      To become the most trusted student safety platform across every city.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHY STUDENTS USE IT SECTION */}
      {/* ========================================================================= */}
      <section className="bg-slate-50/70 py-16 md:py-24 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1 text-xs font-semibold text-sky-700">
                <span>What StayWay Finder is</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Why Students Use It
              </h2>

              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Because safety, convenience and affordability matter. StayWay Finder gives students everything they need to live, explore and move confidently in a new city.
              </p>

              <p className="mt-3 text-sm text-slate-500">
                Because it saves time, reduces risk, and makes city exploration feel simpler, smarter, and more dependable from day one.
              </p>
            </div>

            {/* Right Column: 2-Column Checklist with Blue Checkmark Icons */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {checklistItems.map((item) => (
                  <div 
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-2xs transition hover:border-slate-300"
                  >
                    <CheckCircle2 size={19} className="text-blue-600 shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WHY STUDENTS CHOOSE STAYWAY FINDER (FEATURE SECTION) */}
      {/* ========================================================================= */}
      <section id="features" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col items-start mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1 text-xs font-semibold text-sky-700">
              <span>Why StayWay Finder</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Why Students Choose StayWay Finder
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Premium safety features for every student. Modern tools, smart search, and safe routes brought together in a startup-grade experience.
            </p>
          </div>

          {/* 5 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900 leading-snug">
                      {feat.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {feat.description}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-400 italic">
                    {feat.altTitle}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* LIVE SAFETY MAP SECTION (Dark Navy Theme) */}
      {/* ========================================================================= */}
      <section className="bg-slate-950 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            
            {/* Left Column: Heading, Subtext, Badges & CTA */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
                <MapPin size={13} className="text-sky-400" />
                <span>Live Safety Map</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Explore Safe Places Near You
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Use our interactive map to find hostels, food options, ATMs, bus stops, emergency services and safe routes in real-time.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                See hostels, food, ATM, clinic and emergency markers in one live preview.
              </p>

              {/* Open Map CTA */}
              <div className="mt-7">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 hover:bg-slate-100 transition"
                >
                  <span>Open Map</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* 3 Indicators matching Screenshot */}
              <div className="mt-10 grid grid-cols-3 gap-3 w-full border-t border-white/10 pt-6">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sky-400">
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">Real-time Locations</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sky-400">
                    <Compass size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">Safe Route Suggestions</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-sky-400">
                    <Building2 size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">Multiple Categories</span>
                </div>
              </div>
            </div>

            {/* Right Column: Real Leaflet Map Container */}
            <div className="lg:col-span-7">
              <div className="relative h-[380px] sm:h-[440px] w-full overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/60">
                <HeroMap previewOnly={false} className="rounded-3xl" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* STATISTICS SECTION ("Our Impact in Numbers") */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 md:py-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col items-start mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-1 text-xs font-semibold text-sky-700">
              <span>Trusted by Students</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Our Impact in Numbers
            </h2>
          </div>

          {/* 5 Compact Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-blue-600 shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold tracking-tight text-slate-950">{stat.value}</p>
                      <p className="text-xs font-semibold text-slate-600">{stat.label}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-wider">{stat.sublabel}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTACT SECTION */}
      {/* ========================================================================= */}
      <section id="contact" className="scroll-mt-24 bg-slate-50/70 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-blue-600">Contact</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Let’s build safer student journeys together.
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Reach out for product questions, partnership ideas, or support while exploring the platform.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Contact Details */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <Mail size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Email</p>
                    <p className="text-sm font-bold text-slate-900">hello@staywayfinder.com</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 shrink-0">
                    <Phone size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Phone</p>
                    <p className="text-sm font-bold text-slate-900">+91 98765 43217</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Location</p>
                    <p className="text-sm font-bold text-slate-900">Vadodara, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700">
                  <span className="mb-2 block">Name</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    required
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  <span className="mb-2 block">Email</span>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700">
                  <span className="mb-2 block">Phone</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                    placeholder="Optional"
                    value={formData.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  <span className="mb-2 block">Subject</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                    placeholder="Support request"
                    value={formData.subject}
                    onChange={(event) => handleChange("subject", event.target.value)}
                  />
                </label>
              </div>

              <label className="mt-5 block text-xs font-semibold text-slate-700">
                <span className="mb-2 block">Message</span>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="Tell us how we can help."
                  value={formData.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                  required
                />
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"} <ArrowRight size={15} />
                </button>
                <p className="text-xs text-slate-500">We usually reply within 10 hours.</p>
              </div>
              {submitMessage && (
                <p className={`mt-4 text-xs font-semibold ${submitMessage.includes("received") ? "text-emerald-600" : "text-rose-600"}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CTA BANNER (Panoramic Skyline Background) */}
      {/* ========================================================================= */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-8 sm:p-12 shadow-2xl">
            {/* Background Photographic Skyline */}
            <div className="absolute inset-0 opacity-40">
              <Image
                src="/images/city_skyline_banner.jpg"
                alt="City skyline at twilight"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-2">
                  <MapPin size={14} />
                  <span>Stay Connected</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Ready to Explore Your New City Safely?
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Join thousands of students who trust StayWay Finder for a safer, smarter and easier city experience. Launch your city safety journey with StayWay Finder. Trusted by students looking for safe stays, quick food, reliable hospitals, and fast emergency support.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950 shadow-xl hover:bg-slate-100 transition"
                >
                  <span>Get Started</span>
                  <ArrowRight size={15} className="text-blue-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            
            {/* Left Brand */}
            <div className="flex flex-col items-start gap-1">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <MapPin size={16} />
                </div>
                <span className="text-base font-bold tracking-tight text-white">
                  StayWay Finder
                </span>
              </Link>
              <p className="mt-1 text-xs text-slate-400">
                Safe Stays • Smart Routes • Better Tomorrow
              </p>
            </div>

            {/* Center Navigation */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/#about" className="hover:text-white transition">About</Link>
              <Link href="/#features" className="hover:text-white transition">Features</Link>
              <Link href="/#contact" className="hover:text-white transition">Contact</Link>
              <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            </div>

            {/* Right Social Icons & Copyright */}
            <div className="flex flex-col md:items-end gap-2">
              <div className="flex items-center gap-4 text-slate-400">
                <a href="#" aria-label="Facebook" className="hover:text-white transition">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" aria-label="X (Twitter)" className="hover:text-white transition">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-white transition">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <p className="text-xs text-slate-500">
                © 2026 StayWay Finder. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </footer>
    </main>
  );
}

