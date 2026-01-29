import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createChoreScheduleSchema } from "@/lib/validations/chores";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schedules = await prisma.choreSchedule.findMany({
    where: { userId: session.user.id },
    include: {
      tasks: {
        include: { assignee: true },
        orderBy: [{ dayOfWeek: "asc" }, { priority: "desc" }],
      },
    },
    orderBy: { weekStart: "desc" },
  });

  return NextResponse.json(schedules);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createChoreScheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const schedule = await prisma.choreSchedule.create({
    data: {
      ...parsed.data,
      weekStart: new Date(parsed.data.weekStart),
      weekEnd: new Date(parsed.data.weekEnd),
      userId: session.user.id,
    },
    include: { tasks: true },
  });

  return NextResponse.json(schedule, { status: 201 });
}
