import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateChoreTaskSchema } from "@/lib/validations/chores";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateChoreTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  // Verify task belongs to user's schedule
  const existing = await prisma.choreTask.findFirst({
    where: { id: params.id, schedule: { userId: session.user.id } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const task = await prisma.choreTask.update({
    where: { id: params.id },
    data: parsed.data,
    include: { assignee: true },
  });

  return NextResponse.json(task);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.choreTask.findFirst({
    where: { id: params.id, schedule: { userId: session.user.id } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.choreTask.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
