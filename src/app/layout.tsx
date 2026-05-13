import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Famy - Control de Gastos",
  description: "Sistema de control de gastos familiares",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "React Famy",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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