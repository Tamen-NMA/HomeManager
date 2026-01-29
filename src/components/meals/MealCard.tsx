"use client";

import Button from "@/components/ui/Button";
import { MEAL_TYPE_COLORS, MEAL_TYPE_ICONS } from "@/lib/constants";
import type { MealData } from "@/types";

interface MealCardProps {
  meal: MealData;
  onDelete: (meal: MealData) => void;
  onEdit?: (meal: MealData) => void;
}

export default function MealCard({ meal, onDelete, onEdit }: MealCardProps) {
  const icon = MEAL_TYPE_ICONS[meal.mealType] || "🍽️";
  const gradientClass = MEAL_TYPE_COLORS[meal.mealType] || MEAL_TYPE_COLORS.dinner;

  return (
    <div className="overflow-hidden rounded-xl border border-cream-dark bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={`${gradientClass} px-3 py-2`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold capitalize text-white">
            {icon} {meal.mealType}
          </span>
          {meal.prepTime && (
            <span className="text-xs text-white/90">
              {meal.prepTime} min
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-warm-gray">{meal.name}</h4>
        {meal.description && (
          <p className="mt-1 text-xs text-warm-gray-light line-clamp-2">
            {meal.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-warm-gray-light">
          {meal.calories && (
            <span className="rounded-full bg-cream px-2 py-0.5">
              {meal.calories} kcal
            </span>
          )}
          {meal.ingredients && (
            <span className="rounded-full bg-cream px-2 py-0.5">
              {meal.ingredients.split(",").length} ingredients
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1 border-t border-cream-dark pt-2">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(meal)}>
              Edit
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete(meal)}>
            ×
          </Button>
        </div>
      </div>
    </div>
  );
}
