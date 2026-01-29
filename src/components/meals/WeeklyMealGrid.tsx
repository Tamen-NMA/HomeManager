"use client";

import { DAYS_OF_WEEK } from "@/lib/utils";
import { MEAL_TYPES, MEAL_TYPE_ICONS } from "@/lib/constants";
import MealCard from "./MealCard";
import type { MealData } from "@/types";

interface WeeklyMealGridProps {
  meals: MealData[];
  onDeleteMeal: (meal: MealData) => void;
  onEditMeal?: (meal: MealData) => void;
}

export default function WeeklyMealGrid({ meals, onDeleteMeal, onEditMeal }: WeeklyMealGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {DAYS_OF_WEEK.map((day, dayIndex) => {
        const dayMeals = meals.filter((m) => m.dayOfWeek === dayIndex);
        const mealCount = dayMeals.length;

        return (
          <div
            key={day}
            className="rounded-xl border border-cream-dark bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-warm-gray">{day}</h3>
              {mealCount > 0 && (
                <span className="text-xs text-warm-gray-light">
                  {mealCount} meal{mealCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {mealCount === 0 ? (
              <p className="text-xs italic text-warm-gray-light">No meals planned</p>
            ) : (
              <div className="space-y-3">
                {MEAL_TYPES.map((mealType) => {
                  const typeMeals = dayMeals.filter((m) => m.mealType === mealType);
                  if (typeMeals.length === 0) return null;

                  return typeMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onDelete={onDeleteMeal}
                      onEdit={onEditMeal}
                    />
                  ));
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
