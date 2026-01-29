type ClassValue = string | undefined | null | false | Record<string, boolean | undefined>;

export function cn(...classes: ClassValue[]): string {
  return classes
    .flatMap((cls) => {
      if (!cls) return [];
      if (typeof cls === "string") return cls;
      return Object.entries(cls)
        .filter(([, condition]) => condition)
        .map(([className]) => className);
    })
    .join(" ");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sMonth = s.toLocaleDateString("en-US", { month: "short" });
  const eMonth = e.toLocaleDateString("en-US", { month: "short" });
  if (sMonth === eMonth) {
    return `${sMonth} ${s.getDate()} - ${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${formatDate(s)} - ${formatDate(e)}`;
}

export function getWeekDates(date: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function getDayName(dayOfWeek: number): string {
  return DAYS_OF_WEEK[dayOfWeek] ?? "Unknown";
}
