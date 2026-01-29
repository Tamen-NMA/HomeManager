"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { STATUS_COLORS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils";
import type { ChoreScheduleData } from "@/types";

export default function ChoresPage() {
  const [schedules, setSchedules] = useState<ChoreScheduleData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = useCallback(async () => {
    const res = await fetch("/api/chore-schedules");
    if (res.ok) setSchedules(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

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
            Chore Schedules
          </h1>
          <p className="text-sm text-warm-gray-light">
            Manage weekly chore schedules for your household
          </p>
        </div>
        <Link href="/chores/new">
          <Button>New Schedule</Button>
        </Link>
      </div>

      {schedules.length === 0 ? (
        <EmptyState
          icon="🧹"
          title="No chore schedules yet"
          description="Create a weekly chore schedule to keep your household organized."
          actionLabel="Create Schedule"
          actionHref="/chores/new"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => {
            const completed = schedule.tasks.filter((t) => t.isCompleted).length;
            const total = schedule.tasks.length;
            return (
              <Link key={schedule.id} href={`/chores/${schedule.id}`}>
                <Card hover className="cursor-pointer">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-warm-gray">
                      {schedule.title}
                    </h3>
                    <Badge variant={STATUS_COLORS[schedule.status]}>
                      {schedule.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-warm-gray-light">
                    {formatDateRange(schedule.weekStart, schedule.weekEnd)}
                  </p>
                  {total > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-warm-gray-light">
                        <span>
                          {completed}/{total} tasks completed
                        </span>
                        <span>{Math.round((completed / total) * 100)}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-dark">
                        <div
                          className="h-full rounded-full bg-sage transition-all"
                          style={{
                            width: `${(completed / total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {schedule.aiGenerated && (
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
