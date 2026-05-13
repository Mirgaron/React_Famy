"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "Inicio", icon: "house.fill" },
  { href: "/ingresos", label: "Ingresos", icon: "arrow.up.circle.fill", colorClass: "text-ios-success" },
  { href: "/gastos", label: "Gastos", icon: "arrow.down.circle.fill", colorClass: "text-ios-danger" },
  { href: "/tarjetas", label: "Tarjetas", icon: "creditcard.fill" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-ios-bg-primary border-t border-ios-bg-tertiary"
      style={{ height: "calc(49px + env(safe-area-inset-bottom))", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-[49px]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 min-w-[64px] touch-target-min transition-opacity ${
                isActive ? "opacity-100" : "opacity-60"
              } active:opacity-40`}
              style={{ WebkitTapHighlightColor: "transparent", minHeight: 44 }}
            >
              <svg
                className={`w-6 h-6 ${isActive ? "text-ios-accent" : "text-ios-text-secondary"} ${tab.colorClass || ""}`}
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={getIconPath(tab.icon)}
                />
              </svg>
              <span
                className={`text-[10px] tracking-wide ${
                  isActive
                    ? "text-ios-accent font-semibold"
                    : "text-ios-text-secondary font-normal"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function getIconPath(icon: string): string {
  const icons: Record<string, string> = {
    "house.fill": "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    "arrow.up.circle.fill": "M12 19V5m-7 7l7-7 7 7",
    "arrow.down.circle.fill": "M12 5v14m7-7l-7 7-7-7",
    "creditcard.fill": "M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z M3 10h18",
  };
  return icons[icon] || icons["house.fill"];
}