import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const tarjetas = await prisma.tarjeta.findMany({ where: { userId: session.user.id }, include: { cargos: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: tarjetas, error: null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const tarjeta = await prisma.tarjeta.create({ data: { ...body, userId: session.user.id } });
    return NextResponse.json({ data: tarjeta, error: null });
  } catch { return NextResponse.json({ error: "Error al crear" }, { status: 500 }); }
}
