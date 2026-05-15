"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, Navigation, Phone, Home } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Map", href: "/dashboard", icon: Map },
    { name: "Safe Route", href: "/route", icon: Navigation },
    { name: "Emergency", href: "/emergency", icon: Phone },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <nav className="glass-panel flex items-center gap-2 px-4 py-3 rounded-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                isActive
                  ? "bg-white/20 text-white font-semibold shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={18} />
              <span className="hidden md:inline text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
