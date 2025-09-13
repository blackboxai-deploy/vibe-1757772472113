import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { InitProvider } from "@/components/InitProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "CEBIP - Sistema de Membresía Premium",
  description: "Plataforma exclusiva de beneficios y promociones para miembros CEBIP",
  keywords: "membresía, beneficios, promociones, descuentos, CEBIP",
  authors: [{ name: "CEBIP" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}>
        <InitProvider>
          {children}
        </InitProvider>
      </body>
    </html>
  );
}