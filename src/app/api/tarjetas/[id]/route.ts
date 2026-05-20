import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const tarjeta = await prisma.tarjeta.update({ where: { id }, data: body });
    return NextResponse.json({ data: tarjeta, error: null });
  } catch { return NextResponse.json({ error: "Error al actualizar" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    await prisma.tarjeta.delete({ where: { id } });
    return NextResponse.json({ data: null, error: null });
  } catch { return NextResponse.json({ error: "Error al eliminar" }, { status: 500 }); }
}