export type { MemberRole, ChorePriority, ScheduleStatus, MealType } from "@/lib/constants";

export interface HouseholdMemberData {
  id: string;
  name: string;
  avatar: string | null;
  age: number | null;
  role: string;
}

export interface ChoreScheduleData {
  id: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  aiGenerated: boolean;
  tasks: ChoreTaskData[];
}

export interface ChoreTaskData {
  id: string;
  title: string;
  description: string | null;
  dayOfWeek: number;
  isCompleted: boolean;
  priority: string;
  assigneeId: string | null;
  assignee?: HouseholdMemberData | null;
}

export interface MealPlanData {
  id: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  servings: number;
  aiGenerated: boolean;
  meals: MealData[];
}

export interface MealData {
  id: string;
  name: string;
  description: string | null;
  mealType: string;
  dayOfWeek: number;
  calories: number | null;
  prepTime: number | null;
  ingredients: string | null;
}
