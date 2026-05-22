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
    const { descripcion, monto, tarjetaId, msi = 1, fecha } = body;

    const fechaDate = new Date(fecha);
    const cargoPadreId = crypto.randomUUID();

    if (msi > 1) {
      // Crear cargo padre + n exhibiciones
      const exhibicionMonto = monto / msi;
      const cargos = [];
      for (let i = 1; i <= msi; i++) {
        const exhibitDate = new Date(fechaDate);
        exhibitDate.setMonth(exhibitDate.getMonth() + i);
        // Primer exhibición en el siguiente corte después de la compra
        const mesCorte = `${exhibitDate.getFullYear()}-${String(exhibitDate.getMonth() + 1).padStart(2, "0")}`;
        cargos.push({
          id: crypto.randomUUID(),
          descripcion: `${descripcion} (${i}/${msi})`,
          monto: exhibicionMonto,
          msi,
          mesCorte,
          tarjetaId,
          pagado: false,
          cargoPadreId: i === 1 ? cargoPadreId : null,
          exhibicion: i,
        });
      }
      await prisma.cargo.createMany({ data: cargos });
      return NextResponse.json({ data: { id: cargoPadreId, cargos }, error: null });
    } else {
      // Cargo normal sin MSI
      const mesCorte = `${fechaDate.getFullYear()}-${String(fechaDate.getMonth() + 1).padStart(2, "0")}`;
      const cargo = await prisma.cargo.create({
        data: { descripcion, monto, msi: 1, mesCorte, tarjetaId, cargoPadreId: null, exhibicion: 1, pagado: false },
      });
      return NextResponse.json({ data: cargo, error: null });
    }
  } catch (e: any) { return NextResponse.json({ error: e.message || "Error al crear" }, { status: 500 }); }
}
