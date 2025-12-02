// /services/imageProcessor.ts

// ===========================
// 📌 HELPER: DETEKSI MOBILE
// ===========================
export function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

// ===========================
// 📌 HELPER: COMPRESS JPG MOBILE
// ===========================
export async function compressImageMobile(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const maxWidth = 1600; // aman untuk web & mobile
      const scale = Math.min(1, maxWidth / img.width);

      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context gagal"));

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compress menghasilkan blob null"));

          const compressedFile = new File(
            [blob],
            file.name.replace(/\.jpg|\.jpeg/i, "-m.jpg"),
            { type: "image/jpeg" }
          );

          resolve(compressedFile);
        },
        "image/jpeg",
        0.85 // kualitas 85%
      );
    };

    img.onerror = () => reject(new Error("Gagal load image"));
    img.src = URL.createObjectURL(file);
  });
}

// ===========================
// 📌 HELPER: PROSES FILE (HEIC + COMPRESS MOBILE)
// ===========================
export async function processImageFile(file: File): Promise<File> {
  let selected = file;

  // ==========================
  // 1️⃣ HEIC → JPEG
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
      quality: 0.95,
    })) as Blob;

    selected = new File(
      [convertedBlob],
      selected.name.replace(/\.heic/i, ".jpg"),
      { type: "image/jpeg" }
    );
  }

  // ==========================
  // 2️⃣ COMPRESS JPG KHUSUS MOBILE
  // ==========================
  const isJpeg =
    selected.type === "image/jpeg" ||
    selected.name.match(/\.jpg|\.jpeg/i);

  if (isMobileDevice() && isJpeg && selected.size > 4 * 1024 * 1024) {
    selected = await compressImageMobile(selected);
  }

  return selected;
}
