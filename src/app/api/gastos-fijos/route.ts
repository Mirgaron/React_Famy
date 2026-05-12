import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const gastos = await prisma.gastoFijo.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: gastos, error: null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const gasto = await prisma.gastoFijo.create({ data: { ...body, userId: session.user.id } });
    return NextResponse.json({ data: gasto, error: null });
  } catch { return NextResponse.json({ error: "Error al crear" }, { status: 500 }); }
}
