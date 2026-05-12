import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const cargos = await prisma.cargo.findMany({ where: { tarjeta: { userId: session.user.id } }, include: { tarjeta: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: cargos, error: null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const cargo = await prisma.cargo.create({ data: body });
    return NextResponse.json({ data: cargo, error: null });
  } catch { return NextResponse.json({ error: "Error al crear" }, { status: 500 }); }
}
