export const APP_NAME = "Naya Dream Home";

export const MEMBER_ROLES = ["adult", "teen", "child"] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const CHORE_PRIORITIES = ["low", "medium", "high"] as const;
export type ChorePriority = (typeof CHORE_PRIORITIES)[number];

export const SCHEDULE_STATUSES = ["draft", "active", "completed"] as const;
export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const MEMBER_AVATARS = [
  "👩", "👨", "👧", "👦", "👶", "🧓", "👵", "👴",
  "🧑‍🍳", "🧑‍🌾", "🧑‍💻", "🧑‍🎨",
];

export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-amber-100 text-amber-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export const MEAL_TYPE_COLORS: Record<string, string> = {
  breakfast: "bg-gradient-to-r from-amber-400 to-orange-400",
  lunch: "bg-gradient-to-r from-green-400 to-emerald-400",
  dinner: "bg-gradient-to-r from-purple-400 to-pink-400",
  snack: "bg-gradient-to-r from-blue-400 to-cyan-400",
};

export const MEAL_TYPE_ICONS: Record<string, string> = {
  breakfast: "🍳",
  lunch: "🥗",
  dinner: "🍽️",
  snack: "🍎",
};
