import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const gastoFijo = await prisma.gastoFijo.update({ where: { id }, data: body });
    return NextResponse.json({ data: gastoFijo, error: null });
  } catch { return NextResponse.json({ error: "Error al actualizar" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    await prisma.gastoFijo.delete({ where: { id } });
    return NextResponse.json({ data: null, error: null });
  } catch { return NextResponse.json({ error: "Error al eliminar" }, { status: 500 }); }
}