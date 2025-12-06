import "./globals.css";
import Navbar from "@/components/Navbar";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

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
   📌 Metadata default untuk halaman statis
   ================================ */
export const metadata: Metadata = {
  metadataBase: new URL("https://bangunancerdas.web.id/"),
  title: "CV. Bangunan Cerdas Indonesia",
  description: "Smart Project Wall untuk menyimpan Project berharga Kami",

  icons: {
    icon: [
      {
        url: "/icons/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icons/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcut: "/icons/favicon.ico",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    title: "CV. Bangunan Cerdas Indonesia",
    description: "Smart Project Wall untuk menyimpan Project berharga Kami",
    url: "/", // default homepage
    siteName: "CV. Bangunan Cerdas Indonesia",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og/default.webp",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CV. Bangunan Cerdas Indonesia",
    description: "Smart Project Wall untuk menyimpan Project berharga Kami",
    images: ["/og/default.webp"],
    site: "@CVBangunanCerdas",
    creator: "@CVBangunanCerdas",
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
    <html
      lang="id"
      suppressHydrationWarning
      data-scroll-behavior="smooth"   // ✅ FIX UNTUK WARNING NEXT.JS
    >
      <body
        className="
          font-geist
          text-gray-200 
          min-h-screen 
          antialiased
          selection:bg-sky-400/40
          bg-gradient-to-b from-[#0b1623] via-[#05080c] to-black
        "
      >
        {/* ✅ Scroll hanya di BODY, bukan di div lain */}
      
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-2YMPX617GW`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2YMPX617GW', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

        <Navbar />

        <main className="pt-16 pb-10 px-0 sm:py-16 sm:px-0 md:py-16 md:px-0 lg:py-20 lg:px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
