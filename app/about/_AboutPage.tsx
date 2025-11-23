"use client";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Arga Bharata",
      phone: "089680858462",
      waLink: "https://wa.me/6289680858462",
      email: "arga.limun@gmail.com",
      role: "Pengembang Utama & Integrator",
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
      role: "Dosen Pembimbing",
    },
  ];

  return (
    <main className="min-h-screen px-4 sm:px-6 py-14">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white tracking-tight">
          Tentang Proyek
        </h1>

        {/* DESCRIPTION BLOCK */}
        <section className="space-y-6 text-gray-300 leading-relaxed">

          <p className="text-lg">
            <strong className="text-white">CV. Bangunan Cerdas Indonesia</strong> adalah konsultan dan kontraktor listrik berbasis 
            <em> Project Based Learning</em> yang berfokus pada implementasi sistem integrasi bangunan cerdas.
            Website ini dirancang sebagai galeri digital interaktif untuk menampilkan, menyimpan
            dan mendokumentasikan berbagai <em>Project</em> yang terkait Smart Building.
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
              // Tentukan ikon
              let icon = "👨‍💻"; // default
              if (!member.phone && !member.email) icon = "🏗️";
              else if (!member.phone && member.email) icon = "💡";

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
  );
}
