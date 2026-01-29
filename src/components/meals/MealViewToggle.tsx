"use client";

interface MealViewToggleProps {
  view: "daily" | "weekly";
  onViewChange: (view: "daily" | "weekly") => void;
}

export default function MealViewToggle({ view, onViewChange }: MealViewToggleProps) {
  return (
    <div className="inline-flex rounded-xl bg-cream-dark p-1">
      <button
        onClick={() => onViewChange("daily")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          view === "daily"
            ? "bg-white text-warm-gray shadow-sm"
            : "text-warm-gray-light hover:text-warm-gray"
        }`}
      >
        Daily View
      </button>
      <button
        onClick={() => onViewChange("weekly")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          view === "weekly"
            ? "bg-white text-warm-gray shadow-sm"
            : "text-warm-gray-light hover:text-warm-gray"
        }`}
      >
        Weekly View
      </button>
    </div>
  );
}
