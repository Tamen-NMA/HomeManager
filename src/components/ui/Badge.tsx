import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export default function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant || "bg-cream-dark text-warm-gray",
        className
      )}
    >
      {children}
    </span>
  );
}
