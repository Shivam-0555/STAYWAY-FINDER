import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatisticCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  label: string;
  value: string;
  accent?: "blue" | "emerald" | "red" | "amber" | "purple";
}

const accentStyles: Record<string, string> = {
  blue: "from-blue-500/15 to-slate-900/10 text-blue-300 border-blue-500/20",
  emerald: "from-emerald-500/15 to-slate-900/10 text-emerald-300 border-emerald-500/20",
  red: "from-red-500/15 to-slate-900/10 text-red-300 border-red-500/20",
  amber: "from-amber-500/15 to-slate-900/10 text-amber-300 border-amber-500/20",
};

export function StatisticCard({ label, value, accent = "blue", className, ...props }: StatisticCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        `rounded-3xl border bg-gradient-to-br ${accentStyles[accent]} p-6 shadow-2xl shadow-slate-950/10 transition-all`,
        className
      )}
      {...props}
    >
      <p className="text-sm uppercase tracking-[.25em] text-slate-400 mb-3">{label}</p>
      <p className="text-4xl font-black tracking-tight">{value}</p>
    </motion.div>
  );
}
