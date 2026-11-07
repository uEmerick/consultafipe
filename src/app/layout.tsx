import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import fipeIcon from "./iconFipeVeloz.png";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FipeVeloz | Consulta de preços de veículos",
  description: "Consulte o valor de referência do seu veículo na Tabela FIPE.",
  icons: {
    icon: fipeIcon.src,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
