import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AQUARIA — Explore The Ocean",
  description:
    "A breathtaking journey through the wonders of marine life, from vibrant reefs to the mysterious depths.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#020712] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
