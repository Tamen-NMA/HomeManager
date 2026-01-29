import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createChoreTaskSchema } from "@/lib/validations/chores";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createChoreTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  // Verify schedule belongs to user
  const schedule = await prisma.choreSchedule.findFirst({
    where: { id: parsed.data.scheduleId, userId: session.user.id },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  const task = await prisma.choreTask.create({
    data: parsed.data,
    include: { assignee: true },
  });

  return NextResponse.json(task, { status: 201 });
}
