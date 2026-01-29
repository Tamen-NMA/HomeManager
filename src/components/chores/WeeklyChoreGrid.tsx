"use client";

import { DAYS_OF_WEEK } from "@/lib/utils";
import ChoreTaskRow from "./ChoreTaskRow";
import type { ChoreTaskData } from "@/types";

interface WeeklyChoreGridProps {
  tasks: ChoreTaskData[];
  onToggleTask: (task: ChoreTaskData) => void;
  onDeleteTask: (task: ChoreTaskData) => void;
}

export default function WeeklyChoreGrid({ tasks, onToggleTask, onDeleteTask }: WeeklyChoreGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {DAYS_OF_WEEK.map((day, index) => {
        const dayTasks = tasks.filter((t) => t.dayOfWeek === index);
        const completed = dayTasks.filter((t) => t.isCompleted).length;

        return (
          <div
            key={day}
            className="rounded-xl border border-cream-dark bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-warm-gray">{day}</h3>
              {dayTasks.length > 0 && (
                <span className="text-xs text-warm-gray-light">
                  {completed}/{dayTasks.length}
                </span>
              )}
            </div>
            {dayTasks.length === 0 ? (
              <p className="text-xs italic text-warm-gray-light">No tasks</p>
            ) : (
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <ChoreTaskRow
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
