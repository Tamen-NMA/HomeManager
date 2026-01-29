"use client";

import { useState } from "react";
import { DAYS_OF_WEEK } from "@/lib/utils";
import { MEAL_TYPES, MEAL_TYPE_COLORS, MEAL_TYPE_ICONS } from "@/lib/constants";
import MealCard from "./MealCard";
import type { MealData } from "@/types";

interface DailyMealViewProps {
  meals: MealData[];
  onDeleteMeal: (meal: MealData) => void;
  onEditMeal?: (meal: MealData) => void;
  onAddMeal?: (dayOfWeek: number, mealType: string) => void;
}

export default function DailyMealView({
  meals,
  onDeleteMeal,
  onEditMeal,
  onAddMeal,
}: DailyMealViewProps) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const dayMeals = meals.filter((m) => m.dayOfWeek === selectedDay);

  return (
    <div>
      {/* Day Selector */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {DAYS_OF_WEEK.map((day, index) => {
          const isSelected = selectedDay === index;
          const dayMealCount = meals.filter((m) => m.dayOfWeek === index).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={`flex-shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "bg-white text-warm-gray hover:bg-cream-dark"
              }`}
            >
              <span className="block">{day.slice(0, 3)}</span>
              {dayMealCount > 0 && (
                <span
                  className={`mt-1 block text-xs ${
                    isSelected ? "text-white/80" : "text-warm-gray-light"
                  }`}
                >
                  {dayMealCount} meal{dayMealCount !== 1 ? "s" : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Meal Type Sections */}
      <div className="space-y-6">
        {MEAL_TYPES.map((mealType) => {
          const typeMeals = dayMeals.filter((m) => m.mealType === mealType);
          const icon = MEAL_TYPE_ICONS[mealType];
          const gradientClass = MEAL_TYPE_COLORS[mealType];

          return (
            <div key={mealType} className="rounded-xl border border-cream-dark bg-white overflow-hidden">
              <div className={`${gradientClass} px-4 py-3`}>
                <h3 className="text-lg font-semibold capitalize text-white">
                  {icon} {mealType}
                </h3>
              </div>
              <div className="p-4">
                {typeMeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-warm-gray-light">
                      No {mealType} planned for {DAYS_OF_WEEK[selectedDay]}
                    </p>
                    {onAddMeal && (
                      <button
                        onClick={() => onAddMeal(selectedDay, mealType)}
                        className="mt-2 text-sm font-medium text-terracotta hover:text-terracotta-dark"
                      >
                        + Add {mealType}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {typeMeals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onDelete={onDeleteMeal}
                        onEdit={onEditMeal}
                      />
                    ))}
                    {onAddMeal && (
                      <button
                        onClick={() => onAddMeal(selectedDay, mealType)}
                        className="flex h-full min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed border-cream-dark text-warm-gray-light transition-colors hover:border-terracotta hover:text-terracotta"
                      >
                        + Add another
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
