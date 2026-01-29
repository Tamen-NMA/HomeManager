"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { WeeklyMealGrid, DailyMealView, MealViewToggle } from "@/components/meals";
import { STATUS_COLORS, MEAL_TYPES } from "@/lib/constants";
import { formatDateRange, DAYS_OF_WEEK } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import type { MealPlanData, MealData } from "@/types";

export default function MealPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const planId = params.planId as string;

  const [plan, setPlan] = useState<MealPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showEditMeal, setShowEditMeal] = useState(false);
  const [showDeletePlan, setShowDeletePlan] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Meal form state
  const [editingMeal, setEditingMeal] = useState<MealData | null>(null);
  const [mealName, setMealName] = useState("");
  const [mealDesc, setMealDesc] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [mealDay, setMealDay] = useState("0");
  const [mealCalories, setMealCalories] = useState("");
  const [mealPrepTime, setMealPrepTime] = useState("");
  const [mealIngredients, setMealIngredients] = useState("");
  const [mealLoading, setMealLoading] = useState(false);

  const fetchPlan = useCallback(async () => {
    const res = await fetch(`/api/meal-plans/${planId}`);
    if (res.ok) setPlan(await res.json());
    setLoading(false);
  }, [planId]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  function resetMealForm() {
    setMealName("");
    setMealDesc("");
    setMealType("breakfast");
    setMealDay("0");
    setMealCalories("");
    setMealPrepTime("");
    setMealIngredients("");
    setEditingMeal(null);
  }

  function openAddMealWithDefaults(dayOfWeek?: number, type?: string) {
    resetMealForm();
    if (dayOfWeek !== undefined) setMealDay(dayOfWeek.toString());
    if (type) setMealType(type);
    setShowAddMeal(true);
  }

  function openEditMeal(meal: MealData) {
    setEditingMeal(meal);
    setMealName(meal.name);
    setMealDesc(meal.description || "");
    setMealType(meal.mealType);
    setMealDay(meal.dayOfWeek.toString());
    setMealCalories(meal.calories?.toString() || "");
    setMealPrepTime(meal.prepTime?.toString() || "");
    setMealIngredients(meal.ingredients || "");
    setShowEditMeal(true);
  }

  async function handleAddMeal(e: React.FormEvent) {
    e.preventDefault();
    setMealLoading(true);

    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: mealName,
        description: mealDesc || undefined,
        mealType,
        dayOfWeek: parseInt(mealDay),
        calories: mealCalories ? parseInt(mealCalories) : undefined,
        prepTime: mealPrepTime ? parseInt(mealPrepTime) : undefined,
        ingredients: mealIngredients || undefined,
        planId,
      }),
    });

    if (res.ok) {
      addToast("Meal added", "success");
      setShowAddMeal(false);
      resetMealForm();
      fetchPlan();
    } else {
      addToast("Failed to add meal", "error");
    }
    setMealLoading(false);
  }

  async function handleUpdateMeal(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMeal) return;
    setMealLoading(true);

    const res = await fetch(`/api/meals/${editingMeal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: mealName,
        description: mealDesc || undefined,
        mealType,
        dayOfWeek: parseInt(mealDay),
        calories: mealCalories ? parseInt(mealCalories) : undefined,
        prepTime: mealPrepTime ? parseInt(mealPrepTime) : undefined,
        ingredients: mealIngredients || undefined,
      }),
    });

    if (res.ok) {
      addToast("Meal updated", "success");
      setShowEditMeal(false);
      resetMealForm();
      fetchPlan();
    } else {
      addToast("Failed to update meal", "error");
    }
    setMealLoading(false);
  }

  async function handleDeleteMeal(meal: MealData) {
    const res = await fetch(`/api/meals/${meal.id}`, { method: "DELETE" });
    if (res.ok) {
      addToast("Meal removed", "success");
      fetchPlan();
    } else {
      addToast("Failed to remove meal", "error");
    }
  }

  async function handleDeletePlan() {
    setDeleteLoading(true);
    const res = await fetch(`/api/meal-plans/${planId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      addToast("Meal plan deleted", "success");
      router.push("/meals");
    }
    setDeleteLoading(false);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!plan) {
    return <p className="text-warm-gray">Meal plan not found.</p>;
  }

  const MealForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Meal Name"
        id="mealName"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        placeholder="e.g., Grilled Salmon with Vegetables"
        required
      />
      <Textarea
        label="Description (optional)"
        id="mealDesc"
        value={mealDesc}
        onChange={(e) => setMealDesc(e.target.value)}
        placeholder="A brief description of the meal..."
        rows={2}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Day"
          id="mealDay"
          value={mealDay}
          onChange={(e) => setMealDay(e.target.value)}
          options={DAYS_OF_WEEK.map((d, i) => ({
            value: i.toString(),
            label: d,
          }))}
        />
        <Select
          label="Meal Type"
          id="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          options={MEAL_TYPES.map((t) => ({
            value: t,
            label: t.charAt(0).toUpperCase() + t.slice(1),
          }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Calories (optional)"
          id="mealCalories"
          type="number"
          min="0"
          value={mealCalories}
          onChange={(e) => setMealCalories(e.target.value)}
          placeholder="e.g., 450"
        />
        <Input
          label="Prep Time (minutes)"
          id="mealPrepTime"
          type="number"
          min="0"
          value={mealPrepTime}
          onChange={(e) => setMealPrepTime(e.target.value)}
          placeholder="e.g., 30"
        />
      </div>
      <Textarea
        label="Ingredients (optional)"
        id="mealIngredients"
        value={mealIngredients}
        onChange={(e) => setMealIngredients(e.target.value)}
        placeholder="Comma-separated list: salmon fillet, olive oil, lemon, asparagus..."
        rows={3}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setShowAddMeal(false);
            setShowEditMeal(false);
            resetMealForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={mealLoading || !mealName.trim()}>
          {mealLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-brown-dark">
              {plan.title}
            </h1>
            <Badge variant={STATUS_COLORS[plan.status]}>
              {plan.status}
            </Badge>
          </div>
          <p className="text-sm text-warm-gray-light">
            {formatDateRange(plan.weekStart, plan.weekEnd)} • {plan.servings} servings
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MealViewToggle view={view} onViewChange={setView} />
          <Button onClick={() => openAddMealWithDefaults()}>Add Meal</Button>
          <Button variant="ghost" onClick={() => setShowDeletePlan(true)}>
            Delete
          </Button>
        </div>
      </div>

      {view === "daily" ? (
        <DailyMealView
          meals={plan.meals}
          onDeleteMeal={handleDeleteMeal}
          onEditMeal={openEditMeal}
          onAddMeal={openAddMealWithDefaults}
        />
      ) : (
        <WeeklyMealGrid
          meals={plan.meals}
          onDeleteMeal={handleDeleteMeal}
          onEditMeal={openEditMeal}
        />
      )}

      <Modal
        open={showAddMeal}
        onClose={() => {
          setShowAddMeal(false);
          resetMealForm();
        }}
        title="Add Meal"
      >
        <MealForm onSubmit={handleAddMeal} submitLabel="Add Meal" />
      </Modal>

      <Modal
        open={showEditMeal}
        onClose={() => {
          setShowEditMeal(false);
          resetMealForm();
        }}
        title="Edit Meal"
      >
        <MealForm onSubmit={handleUpdateMeal} submitLabel="Save Changes" />
      </Modal>

      <ConfirmDialog
        open={showDeletePlan}
        onClose={() => setShowDeletePlan(false)}
        onConfirm={handleDeletePlan}
        title="Delete Meal Plan"
        message="Are you sure you want to delete this meal plan and all its meals? This cannot be undone."
        confirmLabel="Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
