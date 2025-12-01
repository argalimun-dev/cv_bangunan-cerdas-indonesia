// components/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  src: string;
}

export default function ProjectCard({ id, title, description, src }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${id}`}
      className="block group" 
      // PATCH: group → enable hover effects sinkron untuk konten dalam card
    >
      <div
        className="
          bg-gray-800/60 backdrop-blur-sm 
          border border-gray-700/50
          rounded-2xl overflow-hidden 
          shadow-md 
          transition-all duration-200 
          group-hover:shadow-lg
          hover:scale-[1.02] active:scale-[0.98] 
        "
      >
        <div className="relative w-full h-64">
          <Image
            src={src}
            alt={title}
            fill
            className="
              object-cover 
              transition-transform duration-300 
              group-hover:scale-105 
              // PATCH: zoom ringan saat hover seperti galeri modern
            "
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>

        <div className="p-4 text-white">
          <h3 className="text-lg font-semibold truncate">
            {title}
          </h3>

          <p className="text-gray-300 text-sm line-clamp-2">
            {description || "Tidak ada deskripsi."}
          </p>
        </div>
      </div>
    </Link>
  );
}
