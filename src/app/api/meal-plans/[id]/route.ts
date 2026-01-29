import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateMealPlanSchema } from "@/lib/validations/meals";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await prisma.mealPlan.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      meals: { orderBy: [{ dayOfWeek: "asc" }, { mealType: "asc" }] },
    },
  });

  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(plan);
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
  const parsed = updateMealPlanSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const existing = await prisma.mealPlan.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.weekStart) data.weekStart = new Date(parsed.data.weekStart);
  if (parsed.data.weekEnd) data.weekEnd = new Date(parsed.data.weekEnd);

  const plan = await prisma.mealPlan.update({
    where: { id: params.id },
    data,
    include: { meals: true },
  });

  return NextResponse.json(plan);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.mealPlan.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.mealPlan.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
