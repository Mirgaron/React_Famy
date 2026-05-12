import { auth } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-primary">React Famy</h1>
          <nav className="flex gap-4 text-sm">
            <a href="/dashboard" className="hover:text-primary">Dashboard</a>
            <a href="/ingresos" className="hover:text-primary">Ingresos</a>
            <a href="/gastos-fijos" className="hover:text-primary">Gastos</a>
            <a href="/tarjetas" className="hover:text-primary">Tarjetas</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
