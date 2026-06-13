import Image from "next/image";
import { cn } from "@/lib/utils";

interface CityBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  image: string;
}

export function CityBadge({ label, image, className, ...props }: CityBadgeProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3", className)} {...props}>
      <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-900/80">
        <Image src={image} alt={label} fill className="object-cover" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400">Quick city view</p>
      </div>
    </div>
  );
}
