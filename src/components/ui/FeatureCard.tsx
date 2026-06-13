import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon, className, ...props }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-950/5 transition-all",
        className
      )}
      {...props}
    >
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-100 text-sky-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </motion.div>
  );
}
