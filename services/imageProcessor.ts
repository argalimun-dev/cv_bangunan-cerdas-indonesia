// /services/imageProcessor.ts

export class ImageProcessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessError";
  }
}

// ===========================
// 📌 HELPER: DETEKSI MOBILE
// ===========================
export function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

// ===========================
// 📌 HELPER: COMPRESS + RESIZE MOBILE
// ===========================
export async function compressImageMobile(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const MAX_SIZE = 1600;

      const scale = Math.min(
        1,
        MAX_SIZE / img.width,
        MAX_SIZE / img.height
      );

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return reject(new ImageProcessError("Canvas context gagal"));
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);

          if (!blob) return reject(new Error("Compress menghasilkan blob null"));

          // 🔒 HARD LIMIT 2 MB
          if (blob.size > 2 * 1024 * 1024) {
            return reject(
                new ImageProcessError("Ukuran gambar terlalu besar setelah compress")
            );
          }

          const compressedFile = new File(
            [blob],
            file.name.replace(/\.jpg|\.jpeg/i, "-m.jpg"),
            { type: "image/jpeg" }
          );

          resolve(compressedFile);
        },
        "image/jpeg",
        0.9 // ✅ kualitas 90%
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new ImageProcessError("Gagal load image"));
    };

    img.src = objectUrl;
  });
}

// ===========================
// 📌 HELPER: PROSES FILE (HEIC + JPG + MOBILE SAFE)
// ===========================
export async function processImageFile(file: File): Promise<File> {
  let selected = file;

  // ==========================
  // 1️⃣ HEIC → JPEG (QUALITY 0.95)
  // ==========================
  const isHeic =
    selected.type === "image/heic" ||
    selected.type === "image/heif" ||
    selected.name.toLowerCase().endsWith(".heic");

  if (isHeic) {
    const heic2any = (await import("heic2any")).default;

    const convertedBlob = (await heic2any({
      blob: selected,
      toType: "image/jpeg",
      quality: 0.95, // ✅ tetap tinggi
    })) as Blob;

    selected = new File(
      [convertedBlob],
      selected.name.replace(/\.heic/i, ".jpg"),
      { type: "image/jpeg" }
    );
  }

  // ==========================
  // 2️⃣ SEMUA JPG DIPROSES DI MOBILE (ANTI RAM CRASH)
  // ==========================
  const isJpeg =
    selected.type === "image/jpeg" ||
    selected.name.match(/\.jpg|\.jpeg/i);

  if (isMobileDevice() && isJpeg) {
    selected = await compressImageMobile(selected);
  }

  return selected;
}
