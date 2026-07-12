"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GradientButton } from "@/components/ui/GradientButton";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { StatisticCard } from "@/components/ui/StatisticCard";
import { Search, MapPin, Home as HomeIcon, ShieldAlert, Mail, Phone, MapPin as Pin, ArrowRight } from "lucide-react";

const HeroMap = dynamic(() => import("@/components/HeroMap"), { ssr: false });

const stats = [
  { label: "Total Places", value: "58", accent: "blue" },
  { label: "Hostels", value: "24", accent: "purple" },
  { label: "Food Spots", value: "18", accent: "amber" },
  { label: "Hospitals", value: "6", accent: "red" },
  { label: "Emergency Services", value: "10", accent: "emerald" },
];

const aboutPoints = [
  {
    title: "What StayWay Finder is",
    description: "A smart student safety platform that brings safe stays, food spots, routes, and emergency support into one modern experience.",
  },
  {
    title: "Our mission",
    description: "To help students explore new cities with confidence by surfacing trusted places and safer travel choices in real time.",
  },
  {
    title: "Our vision",
    description: "To become the go-to safety companion for students everywhere, making every journey more secure, informed, and stress-free.",
  },
  {
    title: "Why students use it",
    description: "Because it saves time, reduces risk, and makes city exploration feel simpler, smarter, and more dependable from day one.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-white text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_20%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-10 md:px-8 lg:flex-row lg:items-center lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="z-10 flex-1"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Launching a safer student city experience.
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl text-slate-950">
              Find Safe Stays, Food, Routes & Essential Services Around You!
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              StayWay Finder gives students fast access to secure hostels, trusted food spots, emergency services and safe navigational routes around you!
            </p>
            <p className="mt-4 max-w-2xl text-sm text-slate-500">
              Workable across all supported cities — instant safety insights for every student journey.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/dashboard">
                <GradientButton size="lg" className="w-full sm:w-auto">
                  <MapPin size={18} /> Use My Location
                </GradientButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative flex-1 overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 md:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,245,245,0.9),transparent_32%)]" />
            <div className="relative flex h-full flex-col gap-6">
              <div className="rounded-[1.75rem] border border-slate-200 overflow-hidden bg-slate-50 shadow-inner shadow-slate-900/5">
                <div className="relative h-96 w-full">
                  <HeroMap />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-slate-50 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[.3em] text-sky-500">About StayWay Finder</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">
              A premium safety platform designed for students who want confidence in every city.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              StayWay Finder brings together the essentials of modern student travel into one polished experience so every move feels informed, secure, and effortless.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {aboutPoints.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[.3em] text-sky-500">Why StayWay Finder</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">Premium safety features for every student.</h2>
            <p className="mt-4 text-base text-slate-500">Modern tools, smart search, and safe routes brought together in a startup-grade experience.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-4">
            <FeatureCard
              title="Smart Search"
              description="Search hostels, food, ATMs, hospitals and emergency services from one place."
              icon={<Search size={22} />}
            />
            <FeatureCard
              title="Premium Map"
              description="See your current location, live markers, and safe routes in a beautiful city map."
              icon={<MapPin size={22} />}
            />
            <FeatureCard
              title="Emergency Ready"
              description="One-tap emergency actions for police, ambulance, hospitals and helplines."
              icon={<ShieldAlert size={22} />}
            />
            <FeatureCard
              title="Student-First UX"
              description="A polished experience designed for young adults exploring new cities."
              icon={<HomeIcon size={22} />}
            />
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-white px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.06)] md:p-12">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[.3em] text-sky-500">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">Let’s build safer student journeys together.</h2>
            <p className="mt-4 text-base text-slate-600">Reach out for product questions, partnership ideas, or support while exploring the platform.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-semibold">hello@staywayfinder.com</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-semibold">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Pin size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-semibold">Vadodara, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Name</span>
                  <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="Your name" />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  <span className="mb-2 block">Email</span>
                  <input type="email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="you@example.com" />
                </label>
              </div>

              <label className="mt-5 block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Message</span>
                <textarea rows={5} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="Tell us how we can help." />
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <GradientButton type="submit" size="md" className="w-full sm:w-auto">
                  Send Message <ArrowRight size={16} />
                </GradientButton>
                <p className="text-sm text-slate-500">We usually reply within 24 hours.</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4 md:px-8">
        <div className="mx-auto max-w-7xl rounded-4xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-900/10">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-8 max-w-xl">
              <p className="text-sm uppercase tracking-[.3em] text-sky-500">Live Safety Map</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">Explore the map of safe student spots.</h2>
              <p className="mt-4 text-base text-slate-600">See hostels, food, ATM, clinic and emergency markers in one live preview.</p>
            </div>
          </div>
          <div className="h-130 w-full">
            <HeroMap />
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-5">
            {stats.map((stat, index) => (
              <StatisticCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                accent={stat.accent as any}
                className={index === 0 ? "lg:col-span-2" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 px-4 md:px-8 text-white">
        <div className="mx-auto max-w-7xl rounded-4xl border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[.3em] text-sky-300">Stay Connected</p>
              <h2 className="mt-4 text-4xl font-semibold">Launch your city safety journey with StayWay Finder.</h2>
              <p className="mt-4 max-w-xl text-slate-300">Trusted by students looking for safe stays, quick food, reliable hospitals, and fast emergency support.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[.3em] text-slate-400">Get Started</p>
              <p className="mt-3 text-lg font-semibold text-white">Open the dashboard and begin your city exploration.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
