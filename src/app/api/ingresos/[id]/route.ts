import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.ingreso.updateMany({ where: { id, userId: session.user.id }, data: body });
  if (updated.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ data: await prisma.ingreso.findUnique({ where: { id } }), error: null });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.ingreso.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ data: null, error: null });
}
