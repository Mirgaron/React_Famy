import { auth } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SignOutButton } from "@/components/layout/sign-out-button";

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
    <div className="min-h-screen bg-[#faf9f7] pb-20">
      <header className="bg-[#1a1a2e] text-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs text-white/40 tracking-widest uppercase">Bienvenido</p>
            <h1 className="text-lg font-black tracking-tight">React Famy</h1>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="px-4 py-5">{children}</main>
      <MobileNav />
    </div>
  );
}