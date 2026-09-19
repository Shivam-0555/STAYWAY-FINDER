"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Home, 
  Compass, 
  Menu, 
  X, 
  LogOut, 
  Search, 
  Sun,
  MapPin
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/authContext";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/dashboard", label: "Dashboard", icon: Compass },
  { href: "/route", label: "Safe Route", icon: ShieldCheck },
  { href: "/emergency", label: "Emergency", icon: AlertTriangle },
  { href: "/find", label: "Find", icon: Search },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group transition">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/25 transition group-hover:bg-blue-700">
            <MapPin size={20} className="fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            StayWay <span className="text-blue-600">Finder</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex">
          {navItems.map((item) => {
            const isHashLink = item.href.startsWith("/#");
            const active = isHashLink 
              ? pathname === "/" 
              : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-sm font-semibold transition rounded-full ${
                  active
                    ? "bg-blue-50 text-blue-600 font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Subtle theme toggle icon */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            <Sun size={18} />
          </button>

          {!loading && user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-800 shadow-xs transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(" ")[0]}</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Compass size={16} className="text-blue-600" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-xs shadow-blue-500/20 hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden shadow-lg"
        >
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    active 
                      ? "bg-blue-50 text-blue-600 font-semibold" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {Icon && <Icon size={16} className={active ? "text-blue-600" : "text-slate-400"} />}
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-slate-100" />

            {!loading && user ? (
              <>
                <div className="px-3.5 py-2">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 shadow-xs"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-xl bg-blue-600 py-2 text-sm font-medium text-white shadow-xs shadow-blue-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
