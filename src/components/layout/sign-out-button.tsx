"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-xs font-semibold tracking-wide uppercase text-white/60 hover:text-white transition-colors px-3 py-2"
    >
      Salir
    </button>
  );
}