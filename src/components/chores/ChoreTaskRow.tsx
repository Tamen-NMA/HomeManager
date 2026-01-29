"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PRIORITY_COLORS } from "@/lib/constants";
import type { ChoreTaskData } from "@/types";

interface ChoreTaskRowProps {
  task: ChoreTaskData;
  onToggle: (task: ChoreTaskData) => void;
  onDelete: (task: ChoreTaskData) => void;
}

export default function ChoreTaskRow({ task, onToggle, onDelete }: ChoreTaskRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-cream-dark bg-white px-3 py-2">
      <button
        onClick={() => onToggle(task)}
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
          task.isCompleted
            ? "border-sage bg-sage text-white"
            : "border-warm-gray-light hover:border-sage"
        }`}
      >
        {task.isCompleted && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            task.isCompleted ? "text-warm-gray-light line-through" : "text-warm-gray"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-warm-gray-light truncate">{task.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {task.assignee && (
          <span className="text-xs text-warm-gray-light">
            {task.assignee.avatar || "👤"} {task.assignee.name}
          </span>
        )}
        <Badge variant={PRIORITY_COLORS[task.priority]}>
          {task.priority}
        </Badge>
        <Button variant="ghost" size="sm" onClick={() => onDelete(task)}>
          ×
        </Button>
      </div>
    </div>
  );
}
