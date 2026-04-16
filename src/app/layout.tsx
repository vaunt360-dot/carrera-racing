import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Carrera Racing Club | WM Championship 2026/27",
  description: "Carrera Racing Club — NASCAR Cup & Classic Cup World Championship 2026/2027",
  openGraph: {
    title: "Carrera Racing Club | WM Championship",
    description: "Live standings, race results and championship tracker",
    images: ["/images/hero/hero-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="dark">
      <body className="bg-[#09090B] text-white antialiased overflow-x-hidden">
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
