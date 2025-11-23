import "./globals.css";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

/* ⭐ Import Geist Sans (Variable) dari Fontsource */
import "@fontsource/geist-sans";

export const metadata: Metadata = {
  title: "CV. Bangunan Cerdas Indonesia",
  description: "Smart Project Wall untuk menyimpan Project berharga Kami",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`
          font-geist 
          text-gray-200 min-h-screen antialiased 
          selection:bg-sky-400/40
          bg-gradient-to-b 
          from-[#0b1623] via-[#05080c] to-black
        `}
      >
        {/* ⭐ Navbar fixed premium */}
        <Navbar />

        {/* ⭐ Safe content spacing */}
        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
