"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

// Import logo dari lib/assets
import logo from "@/lib/assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
      bg-[rgba(10,15,22,0.65)] 
      backdrop-blur-lg 
      border-b border-white/5
      shadow-[0_2px_15px_rgba(0,0,0,0.25)]
    ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

        {/* Logo + Teks */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              alt="Logo Proyek"
              width={120}
              height={40}
              className="w-[60px] sm:w-[80px] md:w-[120px] h-auto transition-all"
            />
          </Link>

          {/* Teks di sebelah kanan logo */}
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-lg text-gray-50 hover:text-sky-400 transition-colors truncate">
              CV. Bangunan Cerdas Indonesia
            </span>
            <p className="text-[10px] sm:text-xs text-gray-400 truncate mt-0.5">
              Pemasangan Sistem Integrasi Bangunan Cerdas
            </p>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="md:hidden text-gray-200 hover:text-sky-400 transition"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/memory/new"
            className="px-4 py-2 rounded-xl text-gray-900 bg-sky-400 
              hover:bg-sky-300 transition-all font-medium shadow-sm
            "
          >
            + Tambah Project
          </Link>

          <Link
            href="/about"
            className="px-4 py-2 rounded-xl border border-white/10 
              text-gray-200 hover:text-sky-300 hover:bg-white/5 
              transition-all
            "
          >
            Tentang
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden bg-[rgba(10,15,22,0.9)] backdrop-blur-xl 
          border-t border-white/10 transition-all duration-300 overflow-hidden 
          ${menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-6 py-4 flex flex-col space-y-3">

          <Link
            href="/memory/new"
            onClick={() => setMenuOpen(false)}
            className="text-gray-900 bg-sky-400 px-4 py-2 rounded-xl text-center 
              hover:bg-sky-300 transition-all font-medium shadow-sm
            "
          >
            + Tambah Project
          </Link>

          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-gray-200 border border-white/10 px-4 py-2 rounded-xl 
              text-center hover:bg-white/5 hover:text-sky-300 transition-all
            "
          >
            Tentang
          </Link>

        </div>
      </div>
    </nav>
  );
}
