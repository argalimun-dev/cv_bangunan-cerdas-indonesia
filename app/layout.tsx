import "./globals.css";
import Navbar from "@/components/Navbar";
import type { Metadata, Viewport } from "next";

/* ================================
   ⭐ Import Geist Sans (static weights)
   ================================ */
import "@fontsource/geist-sans"; // regular
import "@fontsource/geist-sans/200.css";
import "@fontsource/geist-sans/300.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";

/* ================================
   📌 FIX: viewport (untuk themeColor)
   ================================ */
export const viewport: Viewport = {
  themeColor: "#0b1623",
};

/* ================================
   📌 Metadata normal (tanpa themeColor)
   ================================ */
export const metadata: Metadata = {
  title: "CV. Bangunan Cerdas Indonesia",
  description: "Smart Project Wall untuk menyimpan Project berharga Kami",

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    title: "CV. Bangunan Cerdas Indonesia",
    description: "Smart Project Wall untuk menyimpan Project berharga Kami",
    url: "https://cv-bangunan-cerdas-indonesia.vercel.app/",
    siteName: "CV. Bangunan Cerdas Indonesia",
    locale: "id_ID",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
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
          scrollbar-custom
          font-geist 
          text-gray-200 min-h-screen antialiased 
          selection:bg-sky-400/40
          bg-gradient-to-b 
          from-[#0b1623] via-[#05080c] to-black
        `}
      >
        <Navbar />

        <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
