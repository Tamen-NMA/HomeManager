import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateChoreScheduleSchema } from "@/lib/validations/chores";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schedule = await prisma.choreSchedule.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      tasks: {
        include: { assignee: true },
        orderBy: [{ dayOfWeek: "asc" }, { priority: "desc" }],
      },
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(schedule);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateChoreScheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const existing = await prisma.choreSchedule.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.weekStart) data.weekStart = new Date(parsed.data.weekStart);
  if (parsed.data.weekEnd) data.weekEnd = new Date(parsed.data.weekEnd);

  const schedule = await prisma.choreSchedule.update({
    where: { id: params.id },
    data,
    include: { tasks: { include: { assignee: true } } },
  });

  return NextResponse.json(schedule);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.choreSchedule.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.choreSchedule.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
