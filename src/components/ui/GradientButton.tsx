import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GradientButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function GradientButton({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: GradientButtonProps) {
  const baseStyles = "relative font-semibold rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    danger: "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.5)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
