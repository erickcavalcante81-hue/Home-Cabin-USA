import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super Skill IA — Torre de Controle",
  description: "Gêmeo digital em tempo real para oficinas automotivas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-mono antialiased grid-bg">{children}</body>
    </html>
  );
}
