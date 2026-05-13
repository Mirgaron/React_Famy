import { auth } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";

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
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold">React Famy</h1>
        </div>
      </header>
      <main className="px-4 py-4">{children}</main>
      <MobileNav />
    </div>
  );
}
