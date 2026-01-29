import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMealPlanSchema } from "@/lib/validations/meals";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plans = await prisma.mealPlan.findMany({
    where: { userId: session.user.id },
    include: {
      meals: { orderBy: [{ dayOfWeek: "asc" }, { mealType: "asc" }] },
    },
    orderBy: { weekStart: "desc" },
  });

  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createMealPlanSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const plan = await prisma.mealPlan.create({
    data: {
      ...parsed.data,
      weekStart: new Date(parsed.data.weekStart),
      weekEnd: new Date(parsed.data.weekEnd),
      userId: session.user.id,
    },
    include: { meals: true },
  });

  return NextResponse.json(plan, { status: 201 });
}
