import type { Metadata } from "next";
import {
  Fraunces,
  Plus_Jakarta_Sans,
  Alex_Brush,
  Allura,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alex-brush",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cuenta de Cobro | Patryally",
  description:
    "Genera y envía tu cuenta de cobro a Patryally en minutos. Herramienta gratuita para contratistas y proveedores independientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fraunces.variable} ${jakarta.variable} ${alexBrush.variable} ${allura.variable} ${dancingScript.variable} font-sans bg-patry-paper text-patry-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
