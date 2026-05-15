import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hoverEffect && "hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
