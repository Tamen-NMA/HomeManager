"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/chores", label: "Chores", icon: "🧹" },
  { href: "/meals", label: "Meals", icon: "🍽️" },
  { href: "/household", label: "Household", icon: "👨‍👩‍👧‍👦" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-cream-dark px-6">
          <span className="font-display text-xl font-bold text-terracotta">
            Naya Dream Home
          </span>
          <button onClick={onClose} className="text-warm-gray-light hover:text-warm-gray">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-warm-gray hover:bg-cream"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
