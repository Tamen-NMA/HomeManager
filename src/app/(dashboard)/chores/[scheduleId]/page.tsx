"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SkeletonCard } from "@/components/ui/Skeleton";
import WeeklyChoreGrid from "@/components/chores/WeeklyChoreGrid";
import AIGenerateChoresButton from "@/components/chores/AIGenerateChoresButton";
import { STATUS_COLORS, CHORE_PRIORITIES } from "@/lib/constants";
import { formatDateRange, DAYS_OF_WEEK } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import type { ChoreScheduleData, ChoreTaskData, HouseholdMemberData } from "@/types";

export default function ChoreScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const scheduleId = params.scheduleId as string;

  const [schedule, setSchedule] = useState<ChoreScheduleData | null>(null);
  const [members, setMembers] = useState<HouseholdMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDay, setTaskDay] = useState("0");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);

  const fetchSchedule = useCallback(async () => {
    const res = await fetch(`/api/chore-schedules/${scheduleId}`);
    if (res.ok) setSchedule(await res.json());
    setLoading(false);
  }, [scheduleId]);

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/household-members");
    if (res.ok) setMembers(await res.json());
  }, []);

  useEffect(() => {
    fetchSchedule();
    fetchMembers();
  }, [fetchSchedule, fetchMembers]);

  async function handleToggleTask(task: ChoreTaskData) {
    const res = await fetch(`/api/chore-tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !task.isCompleted }),
    });
    if (res.ok) fetchSchedule();
  }

  async function handleDeleteTask(task: ChoreTaskData) {
    const res = await fetch(`/api/chore-tasks/${task.id}`, { method: "DELETE" });
    if (res.ok) {
      addToast("Task removed", "success");
      fetchSchedule();
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    setTaskLoading(true);
    const res = await fetch("/api/chore-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskTitle,
        description: taskDesc || undefined,
        dayOfWeek: parseInt(taskDay),
        priority: taskPriority,
        scheduleId,
        assigneeId: taskAssignee || null,
      }),
    });
    if (res.ok) {
      addToast("Task added", "success");
      setShowAddTask(false);
      setTaskTitle("");
      setTaskDesc("");
      setTaskDay("0");
      setTaskPriority("medium");
      setTaskAssignee("");
      fetchSchedule();
    } else {
      addToast("Failed to add task", "error");
    }
    setTaskLoading(false);
  }

  async function handleDeleteSchedule() {
    setDeleteLoading(true);
    const res = await fetch(`/api/chore-schedules/${scheduleId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      addToast("Schedule deleted", "success");
      router.push("/chores");
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

  if (!schedule) {
    return <p className="text-warm-gray">Schedule not found.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-brown-dark">
              {schedule.title}
            </h1>
            <Badge variant={STATUS_COLORS[schedule.status]}>
              {schedule.status}
            </Badge>
          </div>
          <p className="text-sm text-warm-gray-light">
            {formatDateRange(schedule.weekStart, schedule.weekEnd)}
          </p>
        </div>
        <div className="flex gap-2">
          <AIGenerateChoresButton
            scheduleId={scheduleId}
            onGenerated={fetchSchedule}
          />
          <Button onClick={() => setShowAddTask(true)}>Add Task</Button>
          <Button variant="ghost" onClick={() => setShowDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      <WeeklyChoreGrid
        tasks={schedule.tasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />

      <Modal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        title="Add Chore Task"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <Input
            label="Task Title"
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g., Vacuum living room"
            required
          />
          <Input
            label="Description (optional)"
            id="taskDesc"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Additional details..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Day"
              id="taskDay"
              value={taskDay}
              onChange={(e) => setTaskDay(e.target.value)}
              options={DAYS_OF_WEEK.map((d, i) => ({
                value: i.toString(),
                label: d,
              }))}
            />
            <Select
              label="Priority"
              id="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              options={CHORE_PRIORITIES.map((p) => ({
                value: p,
                label: p.charAt(0).toUpperCase() + p.slice(1),
              }))}
            />
          </div>
          <Select
            label="Assign To (optional)"
            id="taskAssignee"
            value={taskAssignee}
            onChange={(e) => setTaskAssignee(e.target.value)}
            options={[
              { value: "", label: "Unassigned" },
              ...members.map((m) => ({ value: m.id, label: m.name })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={taskLoading || !taskTitle.trim()}>
              {taskLoading ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteSchedule}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule and all its tasks? This cannot be undone."
        confirmLabel="Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
