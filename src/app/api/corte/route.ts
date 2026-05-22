import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const today = new Date();
  const fechaCorte = today.getDate() - 1; // día 20 si hoy 21

  // Buscar tarjetas con fechaCorte = ayer
  const tarjetas = await prisma.tarjeta.findMany({
    where: { userId: session.user.id, fechaCorte },
    include: {
      cargos: {
        where: { pagado: false },
        orderBy: { mesCorte: "asc" },
      },
    },
  });

  // Calcular gastos por período y desglose MSI
  const result = tarjetas.map((tarjeta) => {
    const gastosPeriodo = tarjeta.cargos.reduce((sum, c) => sum + c.monto, 0);
    const msiCargos = tarjeta.cargos.filter((c) => c.msi > 1);
    const sinMSI = tarjeta.cargos.filter((c) => c.msi === 1);

    // Agrupar MSI por mesCorte y exhibicion
    const msiInfo = msiCargos.reduce((acc, c) => {
      if (!acc[c.mesCorte]) acc[c.mesCorte] = { monto: 0, exhibits: [] };
      acc[c.mesCorte].monto += c.monto;
      acc[c.mesCorte].exhibits.push({ exhibicion: c.exhibicion, msi: c.msi, monto: c.monto, pagado: c.pagado });
      return acc;
    }, {} as Record<string, { monto: number; exhibits: any[] }>);

    return {
      tarjeta: {
        id: tarjeta.id,
        nombre: tarjeta.nombre,
        banco: tarjeta.banco,
        limite: tarjeta.limite,
        saldoActual: tarjeta.saldoActual,
        disponible: tarjeta.limite - tarjeta.saldoActual,
      },
      gastosPeriodo,
      saldoDisponible: tarjeta.limite - tarjeta.saldoActual,
      sinMSITotal: sinMSI.reduce((s, c) => s + c.monto, 0),
      msiTotal: msiCargos.reduce((s, c) => s + c.monto, 0),
      msiInfo,
      cargos: tarjeta.cargos,
    };
  });

  return NextResponse.json({ data: result, error: null });
}