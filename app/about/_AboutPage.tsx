// app/about/_AboutPage.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

/* ======================
   ✅ METADATA ABOUT (OVERRIDE GLOBAL)
   ====================== */
export const metadata: Metadata = {
  title: "Tentang Kami | CV. Bangunan Cerdas Indonesia",
  description:
    "CV. Bangunan Cerdas Indonesia — Platform Galeri Pemasaran Digital Interaktif untuk menampilkan, menyimpan, dan mendokumentasikan berbagai Project Smart Building.",

  openGraph: {
    title: "Tentang Kami | CV. Bangunan Cerdas Indonesia",
    description:
      "CV. Bangunan Cerdas Indonesia — Platform Galeri Pemasaran Digital Interaktif untuk menampilkan, menyimpan, dan mendokumentasikan berbagai Project Smart Building.",
    url: "/about",
    images: [
      {
        url: "/images/og-about.png",
        width: 1200,
        height: 630,
        alt: "Tentang Kami - CV. Bangunan Cerdas Indonesia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tentang Kami | CV. Bangunan Cerdas Indonesia",
    description:
      "CV. Bangunan Cerdas Indonesia — Platform Galeri Pemasaran Digital Interaktif untuk menampilkan, menyimpan, dan mendokumentasikan berbagai Project Smart Building.",
    images: ["/images/og-about.png"],
  },

  alternates: {
    canonical: "/about",
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* ======================
   ✅ PAGE COMPONENT
   ====================== */
export default function AboutPage() {
  const teamMembers = [
    {
      name: "Arga Bharata",
      phone: "089680858462",
      waLink: "https://wa.me/6289680858462",
      email: "arga.limun@gmail.com",
      role: "Marketing & Administrator",
    },
    {
      name: "Tim CV. Bangunan Cerdas Indonesia",
      phone: null,
      waLink: null,
      email: null,
      role: "Desain & Instalatur",
    },
    {
      name: "Farid Farhan",
      phone: null,
      waLink: null,
      email: "faridfarhan444@gmail.com",
      role: "Pengembang Utama & Integrator",
    },
  ];

  return (
    <main className="min-h-screen pt-4 pb-10 px-2 sm:py-6 sm:px-6 md:py-8 md:px-6 scrollbar-custom">
      <div className="max-w-3xl mx-auto">
        {/* HERO LOGO FULL WIDTH */}
        <div className="flex justify-center mb-8 px-0">
          <Image
            src="/logo.png"
            alt="Logo CV. Bangunan Cerdas Indonesia"
            className="w-[800px] max-w-full h-auto object-contain"
            width={800}
            height={800}
            priority
          />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white tracking-tight mb-4">
          Tentang Kami
        </h1>

        {/* DESCRIPTION BLOCK */}
        <section className="space-y-6 text-gray-300 leading-relaxed text-justify px-1 sm:px-4 md:px-6 mb-6">
          <p className="text-lg">
            <strong className="text-white">CV. Bangunan Cerdas Indonesia</strong>{" "}
            adalah konsultan dan kontraktor listrik berbasis{" "}
            <em>Project Based Learning</em> yang berfokus pada implementasi sistem
            integrasi bangunan cerdas. Website ini dirancang sebagai{" "}
            <strong className="text-white">
              Galeri Pemasaran Digital Interaktif
            </strong>{" "}
            untuk menampilkan, menyimpan dan mendokumentasikan berbagai{" "}
            Project terkait <em>Smart Building</em>.
          </p>

          <p className="text-lg">
            Setiap Project dapat dilihat secara detail, diberi komentar dan
            menjadi bagian dari dokumentasi perkembangan. Situs ini dibangun
            menggunakan teknologi modern seperti{" "}
            <strong className="text-white">Next.js</strong>,{" "}
            <strong className="text-white">Tailwind CSS</strong> dan{" "}
            <strong className="text-white">Vercel</strong> untuk memastikan
            performa yang cepat, stabil dan responsif.
          </p>
        </section>

        {/* TEAM SECTION */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Tim Pengembang
          </h2>

          <ul className="space-y-3 text-gray-300 text-lg">
            {teamMembers.map((member, idx) => {
              let icon = "👨🏽‍💼🤝"; // default
              if (!member.phone && !member.email) icon = "🏗️";
              else if (!member.phone && member.email) icon = "👨🏽‍💻💡";

              return (
                <li key={idx}>
                  {icon}{" "}
                  <strong className="text-white">
                    {member.name}
                    {member.phone && member.waLink && (
                      <>
                        {" | "}
                        <a
                          href={member.waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-green-400"
                        >
                          {member.phone}
                        </a>
                      </>
                    )}
                    {member.email && (
                      <>
                        {" | "}
                        <a
                          href={`mailto:${member.email}`}
                          className="underline hover:text-blue-400"
                        >
                          {member.email}
                        </a>
                      </>
                    )}
                  </strong>{" "}
                  — {member.role}
                </li>
              );
            })}
          </ul>
        </section>

        {/* BACK BUTTON */}
        <div className="text-center pt-2">
          <Link
            href="/project"
            className="inline-block px-6 py-3 text-white rounded-xl 
            bg-blue-600/80 hover:bg-blue-600 transition-all duration-200 
            shadow-md text-base tracking-tight"
          >
            ← Kembali ke Smart Project Wall
          </Link>
        </div>
      </div>
    </main>
  );
}
