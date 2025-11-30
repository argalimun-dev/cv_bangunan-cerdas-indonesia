// services/projectService.ts

export interface UpdateMemoryParams {
  id: string;
  title?: string;          // ✅ opsional
  description?: string;    // ✅ opsional
  uploader: string;        // ✅ wajib
  file?: File | null;      // ✅ opsional
  secretCode?: string;     // ✅ opsional: bisa update tanpa kode rahasia
}

// ================================
// UTIL: Safe ArrayBuffer → Base64
// ================================
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

// ================================
// DELETE MEMORY (client-safe)
// ================================
export async function deleteMemory(memoryId: string, secretCode: string) {
  if (!memoryId) throw new Error("Project ID invalid");
  if (!secretCode?.trim()) throw new Error("Masukkan kode rahasia!");

  const res = await fetch("/api/projectServer/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memoryId, secretCode }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Gagal menghapus Project!");
  }

  return true;
}

// ================================
// UPDATE MEMORY (client-safe, final realtime)
// ================================
export async function updateMemory({
  id,
  title,
  description,
  uploader,
  file,
  secretCode,
}: UpdateMemoryParams) {
  if (!id) throw new Error("Project ID invalid");
  if (!uploader?.trim()) throw new Error("Uploader wajib diisi");

  let fileBase64: string | undefined;
  let fileName: string | undefined;
  let fileType: string | undefined;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    fileBase64 = arrayBufferToBase64(arrayBuffer);
    fileName = file.name;
    fileType = file.type;
  }

  // ✅ PAYLOAD AMAN: hanya kirim field yang ada
  const payload: { [key: string]: any } = {
    id,
    uploader,
  };

  if (secretCode?.trim()) payload.secretCode = secretCode; // ✅ kirim secretCode hanya kalau ada
  if (title !== undefined) payload.title = title;
  if (description !== undefined) payload.description = description;
  if (fileBase64 && fileName && fileType) {
    payload.fileBase64 = fileBase64;
    payload.fileName = fileName;
    payload.fileType = fileType;
  }

  const res = await fetch("/api/projectServer/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Gagal memperbarui project!");
  }

  // ✅ RETURN DATA TERBARU untuk langsung update state di frontend
  return await res.json(); // { ok: true, data: updatedMemory }
}
