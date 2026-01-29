import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMealSchema } from "@/lib/validations/meals";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");

  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 });
  }

  // Verify plan belongs to user
  const plan = await prisma.mealPlan.findFirst({
    where: { id: planId, userId: session.user.id },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const meals = await prisma.meal.findMany({
    where: { planId },
    orderBy: [{ dayOfWeek: "asc" }, { mealType: "asc" }],
  });

  return NextResponse.json(meals);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createMealSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  // Verify plan belongs to user
  const plan = await prisma.mealPlan.findFirst({
    where: { id: parsed.data.planId, userId: session.user.id },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const meal = await prisma.meal.create({
    data: parsed.data,
  });

  return NextResponse.json(meal, { status: 201 });
}
