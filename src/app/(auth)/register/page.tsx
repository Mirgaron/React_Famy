"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema, type UserRegister } from "@/lib/schemas/user.schema";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UserRegister>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  const onSubmit = async (data: UserRegister) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Error al registrarse");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-10">
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-[#0f3460] font-semibold mb-1">
            Control de gastos
          </p>
          <h1 className="text-4xl font-black text-[#1a1a2e] tracking-tight">
            React&nbsp;<span className="text-[#0f3460]">Famy</span>
          </h1>
        </div>

        {/* Card */}
        <div className="w-full max-w-[360px]">
          <div className="bg-white rounded-2xl shadow-xl shadow-[#1a1a2e]/8 border border-[#e8e6e1] p-8">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-1">
              Crea tu cuenta
            </h2>
            <p className="text-sm text-[#6b6b6b] mb-6">
              Empieza a controlar tus gastos hoy
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold tracking-wide uppercase text-[#3d3d3d]"
                >
                  Nombre
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px] placeholder:text-[#b0aea8]"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold tracking-wide uppercase text-[#3d3d3d]"
                >
                  Correo
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px] placeholder:text-[#b0aea8]"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold tracking-wide uppercase text-[#3d3d3d]"
                >
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="h-12 rounded-xl border-[#d4d0c8] bg-[#faf9f7] text-[15px] placeholder:text-[#b0aea8]"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 mt-2 bg-[#1a1a2e] hover:bg-[#16213e] text-white font-semibold rounded-xl text-[15px] tracking-wide transition-colors"
              >
                {form.formState.isSubmitting ? "Creando..." : "Crear cuenta"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-[#6b6b6b] mt-5">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/login"
              className="font-semibold text-[#0f3460] hover:underline"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>

      {/* Bottom subtle pattern */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#d4d0c8] to-transparent" />
    </div>
  );
}