"use client";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head"; // import Head untuk SEO
import logo from "@/lib/assets/logo.png"; // pastikan path benar

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
      role: "Desain & Dokumentasi",
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
    <>
      {/* ======================
            SEO TAGS
         ====================== */}
      <Head>
        <title>Tentang Kami | CV. Bangunan Cerdas Indonesia</title>
        <meta
          name="description"
          content="CV. Bangunan Cerdas Indonesia — Platform Galeri Pemasaran Digital Interaktif untuk menampilkan, menyimpan, dan mendokumentasikan berbagai Project Smart Building."
        />

        {/* Open Graph / Social Preview */}
        <meta property="og:title" content="Tentang Kami | CV. Bangunan Cerdas Indonesia" />
        <meta
          property="og:description"
          content="CV. Bangunan Cerdas Indonesia — Platform Galeri Pemasaran Digital Interaktif untuk menampilkan, menyimpan, dan mendokumentasikan berbagai Project Smart Building."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cv-bangunan-cerdas-indonesia.vercel.app/" />
        <meta property="og:image" content="/images/og-about.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tentang Kami | CV. Bangunan Cerdas Indonesia" />
        <meta
          name="twitter:description"
          content="CV. Bangunan Cerdas Indonesia — Platform Galeri Pemasaran Digital Interaktif untuk menampilkan, menyimpan, dan mendokumentasikan berbagai Project Smart Building."
        />
        <meta name="twitter:image" content="/images/og-about.png" />
      </Head>

      {/* ======================
            PAGE CONTENT
         ====================== */}
      <main className="min-h-screen px-4 sm:px-6 py-14 scrollbar-custom">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* HERO LOGO FULL WIDTH */}
          <div className="flex justify-center mb-8 px-0">
            <Image
              src={logo}
              alt="Logo CV. Bangunan Cerdas Indonesia"
              className="w-[800px] max-w-full h-auto object-contain"
              width={800}
              height={800}
            />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white tracking-tight">
            Tentang Kami
          </h1>

          {/* DESCRIPTION BLOCK */}
          <section className="space-y-6 text-gray-300 leading-relaxed text-justify">
            <p className="text-lg">
              <strong className="text-white">CV. Bangunan Cerdas Indonesia</strong> adalah konsultan dan kontraktor listrik berbasis{" "}
              <em>Project Based Learning</em> yang berfokus pada implementasi sistem integrasi bangunan cerdas.
              Website ini dirancang sebagai <strong className="text-white">Galeri Pemasaran Digital Interaktif</strong> untuk menampilkan, menyimpan
              dan mendokumentasikan berbagai <em>Project</em> terkait Smart Building.
            </p>

            <p className="text-lg">
              Setiap Project dapat dilihat secara detail, diberi komentar dan menjadi bagian dari dokumentasi perkembangan.
              Situs ini dibangun menggunakan teknologi modern seperti{" "}
              <strong className="text-white">Next.js</strong>,{" "}
              <strong className="text-white">Tailwind CSS</strong> dan{" "}
              <strong className="text-white">Vercel</strong> untuk memastikan performa yang cepat, stabil dan responsif.
            </p>
          </section>

          {/* TEAM SECTION */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg">
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
              href="/memory"
              className="inline-block px-6 py-3 text-white rounded-xl 
              bg-blue-600/80 hover:bg-blue-600 transition-all duration-200 
              shadow-md text-base tracking-tight"
            >
              ← Kembali ke Smart Project Wall
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
