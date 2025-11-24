import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DOMAIN = "https://cv-bangunan-cerdas-indonesia.vercel.app";

// Fungsi untuk membaca semua halaman di folder /app (recursively)
function getAllPages(dir: string, basePath = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let pages: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue; // skip _app, _error, dll
    const fullPath = path.join(dir, entry.name);
    const routePath = path.join(basePath, entry.name.replace(/\.tsx?$/, ""));
    if (entry.isDirectory()) {
      pages = pages.concat(getAllPages(fullPath, routePath));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      if (entry.name === "page.tsx") {
        pages.push(basePath || "/"); // root of folder
      } else {
        pages.push(routePath);
      }
    }
  }

  return pages.map((p) => p.replace(/\\/g, "/")); // Windows path fix
}

export async function GET() {
  const appDir = path.join(process.cwd(), "app"); // folder /app
  const pages = getAllPages(appDir);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${DOMAIN}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
