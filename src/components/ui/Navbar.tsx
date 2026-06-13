"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, AlertTriangle, Home, Compass } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Compass },
  { href: "/route", label: "Safe Route", icon: ShieldCheck },
  { href: "/emergency", label: "Emergency", icon: AlertTriangle },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-slate-200/20 bg-white/85 backdrop-blur-xl shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 px-3 py-2 transition hover:bg-slate-200">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-500/20">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">StayWay Finder</p>
            <p className="text-[11px] text-slate-500">Google Maps-inspired UI</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-3xl px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={16} className={active ? "text-white" : "text-blue-600"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
