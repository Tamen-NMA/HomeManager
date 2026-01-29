"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { getWeekDates } from "@/lib/utils";

export default function NewMealPlanPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { start, end } = getWeekDates();

  const [title, setTitle] = useState("");
  const [weekStart, setWeekStart] = useState(start.toISOString().split("T")[0]);
  const [weekEnd, setWeekEnd] = useState(end.toISOString().split("T")[0]);
  const [status, setStatus] = useState("draft");
  const [servings, setServings] = useState("4");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/meal-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        weekStart,
        weekEnd,
        status,
        servings: parseInt(servings),
      }),
    });

    if (res.ok) {
      const plan = await res.json();
      addToast("Meal plan created", "success");
      router.push(`/meals/${plan.id}`);
    } else {
      addToast("Failed to create meal plan", "error");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-brown-dark">
        New Meal Plan
      </h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Week of January 27"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Week Start"
              id="weekStart"
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              required
            />
            <Input
              label="Week End"
              id="weekEnd"
              type="date"
              value={weekEnd}
              onChange={(e) => setWeekEnd(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
              ]}
            />
            <Input
              label="Servings"
              id="servings"
              type="number"
              min="1"
              max="20"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? "Creating..." : "Create Meal Plan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
