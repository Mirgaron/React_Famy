import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { userRegisterSchema } from "@/lib/schemas/user.schema";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.errors }, { status: 400 });
    }
    const { email, password, name } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    return NextResponse.json({ data: { id: user.id, email: user.email }, error: null });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
