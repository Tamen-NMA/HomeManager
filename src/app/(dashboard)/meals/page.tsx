"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { STATUS_COLORS, MEAL_TYPE_ICONS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils";
import type { MealPlanData } from "@/types";

export default function MealsPage() {
  const [plans, setPlans] = useState<MealPlanData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    const res = await fetch("/api/meal-plans");
    if (res.ok) setPlans(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brown-dark">
            Meal Plans
          </h1>
          <p className="text-sm text-warm-gray-light">
            Plan your weekly meals and recipes
          </p>
        </div>
        <Link href="/meals/new">
          <Button>New Meal Plan</Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No meal plans yet"
          description="Create a weekly meal plan to organize your breakfast, lunch, dinner, and snacks."
          actionLabel="Create Meal Plan"
          actionHref="/meals/new"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const mealCounts = {
              breakfast: plan.meals.filter((m) => m.mealType === "breakfast").length,
              lunch: plan.meals.filter((m) => m.mealType === "lunch").length,
              dinner: plan.meals.filter((m) => m.mealType === "dinner").length,
              snack: plan.meals.filter((m) => m.mealType === "snack").length,
            };
            const totalMeals = plan.meals.length;

            return (
              <Link key={plan.id} href={`/meals/${plan.id}`}>
                <Card hover className="cursor-pointer">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-warm-gray">
                      {plan.title}
                    </h3>
                    <Badge variant={STATUS_COLORS[plan.status]}>
                      {plan.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-warm-gray-light">
                    {formatDateRange(plan.weekStart, plan.weekEnd)}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-sm text-warm-gray-light">
                    <span>👥 {plan.servings} servings</span>
                  </div>
                  {totalMeals > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mealCounts.breakfast > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                          {MEAL_TYPE_ICONS.breakfast} {mealCounts.breakfast}
                        </span>
                      )}
                      {mealCounts.lunch > 0 && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          {MEAL_TYPE_ICONS.lunch} {mealCounts.lunch}
                        </span>
                      )}
                      {mealCounts.dinner > 0 && (
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                          {MEAL_TYPE_ICONS.dinner} {mealCounts.dinner}
                        </span>
                      )}
                      {mealCounts.snack > 0 && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          {MEAL_TYPE_ICONS.snack} {mealCounts.snack}
                        </span>
                      )}
                    </div>
                  )}
                  {plan.aiGenerated && (
                    <span className="mt-2 inline-block text-xs text-warm-gray-light">
                      AI Generated
                    </span>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
