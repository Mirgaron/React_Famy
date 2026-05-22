import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const tarjetaId = searchParams.get("tarjetaId");
  const where: any = { userId: session.user.id };
  if (tarjetaId) {
    where.OR = [{ tarjetaCreditoId: tarjetaId }, { tarjetaOrigenId: tarjetaId }];
  }
  const payments = await prisma.payment.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: payments, error: null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json();
    const { tarjetaCreditoId, tarjetaOrigenId, monto, tipoOrigen } = body;

    await prisma.$transaction(async (tx) => {
      // Payment en tarjeta crédito (PAGO = +)
      await tx.payment.create({
        data: { monto, tipo: "PAGO", tarjetaCreditoId, userId: session.user.id },
      });
      // Payment en tarjeta origen (CARGO = -)
      if (tarjetaOrigenId && tipoOrigen !== "EFECTIVO") {
        await tx.payment.create({
          data: { monto, tipo: "CARGO", tarjetaOrigenId, userId: session.user.id },
        });
        // Restar del saldo de origen
        await tx.tarjeta.update({
          where: { id: tarjetaOrigenId },
          data: { saldoActual: { decrement: monto } },
        });
      }
      // Reducir saldoActual de tarjeta crédito (pago reduce deuda)
      await tx.tarjeta.update({
        where: { id: tarjetaCreditoId },
        data: { saldoActual: { decrement: monto } },
      });
      // Marcar cargos del período como pagados
      const today = new Date();
      const mesCorte = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      await tx.cargo.updateMany({
        where: { tarjetaId: tarjetaCreditoId, mesCorte, pagado: false },
        data: { pagado: true },
      });
    });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (e: any) { return NextResponse.json({ error: e.message || "Error al pagar" }, { status: 500 }); }
}