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
      // Crear cargo padre primero
      const cargoPadreId = crypto.randomUUID();
      const cargoPadre = await prisma.cargo.create({
        data: {
          id: cargoPadreId,
          descripcion: `${descripcion} (padre MSI)`,
          monto,
          msi,
          mesCorte: `${fechaDate.getFullYear()}-${String(fechaDate.getMonth() + 1).padStart(2, "0")}`,
          tarjetaId,
          pagado: false,
          cargoPadreId: null,
          exhibicion: 0,
        },
      });

      // Crear n exhibiciones
      const exhibicionMonto = monto / msi;
      const exhibiciones = [];
      for (let i = 1; i <= msi; i++) {
        const exhibitDate = new Date(fechaDate);
        exhibitDate.setMonth(exhibitDate.getMonth() + i);
        const mesCorte = `${exhibitDate.getFullYear()}-${String(exhibitDate.getMonth() + 1).padStart(2, "0")}`;
        exhibiciones.push({
          id: crypto.randomUUID(),
          descripcion: `${descripcion} (${i}/${msi})`,
          monto: exhibicionMonto,
          msi,
          mesCorte,
          tarjetaId,
          pagado: false,
          cargoPadreId: cargoPadreId,
          exhibicion: i,
        });
      }
      await prisma.cargo.createMany({ data: exhibiciones });
      return NextResponse.json({ data: { id: cargoPadreId, cargoPadre, exhibiciones }, error: null });
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
