import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const colegiaturas = await prisma.colegiatura.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: colegiaturas, error: null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const c = await prisma.colegiatura.create({ data: { ...body, userId: session.user.id } });
    return NextResponse.json({ data: c, error: null });
  } catch { return NextResponse.json({ error: "Error al crear" }, { status: 500 }); }
}
