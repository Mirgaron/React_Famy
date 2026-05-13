import { auth } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/mobile/bottom-nav";

export default async function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-ios-bg-secondary">
      <main className="px-4 py-6 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}