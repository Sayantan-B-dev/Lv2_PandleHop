import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getData } from "@/lib/data";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-family",
  display: "swap",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PandalPass — Plan your Pujo night",
    template: "%s — PandalPass",
  },
  description:
    "PandalPass is a personalised Durga Pujo route planner for Kolkata. Build a pandal-hopping night that fits your time, taste and travel style.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7a1024",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const data = getData();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header siteName={data.site.name} />
        <main id="main">{children}</main>
        <Footer siteName={data.site.name} note={data.site.planningNote} />
      </body>
    </html>
  );
}
