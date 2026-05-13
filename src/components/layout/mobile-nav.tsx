"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: "⌂" },
  { href: "/ingresos", label: "Ingresos", icon: "↑" },
  { href: "/gastos-fijos", label: "Gastos", icon: "↓" },
  { href: "/tarjetas", label: "Tarjetas", icon: "▦" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e8e6e1]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors min-w-[64px] ${
                isActive
                  ? "text-[#0f3460] font-bold"
                  : "text-[#6b6b6b] hover:text-[#1a1a2e]"
              }`}
            >
              <span
                className={`text-lg leading-none ${
                  isActive ? "text-[#0f3460]" : "text-[#6b6b6b]"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[11px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}