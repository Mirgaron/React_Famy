import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Famy - Control de Gastos",
  description: "Sistema de control de gastos familiares",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
