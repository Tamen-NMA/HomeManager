import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateMealSchema } from "@/lib/validations/meals";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const meal = await prisma.meal.findFirst({
    where: { id: params.id, plan: { userId: session.user.id } },
    include: { plan: true },
  });

  if (!meal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(meal);
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
  const parsed = updateMealSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  // Verify meal belongs to user's plan
  const existing = await prisma.meal.findFirst({
    where: { id: params.id, plan: { userId: session.user.id } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const meal = await prisma.meal.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json(meal);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.meal.findFirst({
    where: { id: params.id, plan: { userId: session.user.id } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.meal.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
