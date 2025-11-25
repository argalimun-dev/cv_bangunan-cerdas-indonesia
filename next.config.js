/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "gbflgmylrpjqmpszlvut.supabase.co",
      },
    ],
    formats: ["image/webp", "image/avif"], // aktifkan format modern yang lebih ringan
  },

  // Hapus experimental.optimizeImages karena Next 16+ otomatis handle optimisasi
  // experimental: {
  //   optimizeImages: true,
  // },

  // Tambahan opsional (rekomendasi)
  compress: true, // kompres seluruh output server
};

module.exports = nextConfig;
