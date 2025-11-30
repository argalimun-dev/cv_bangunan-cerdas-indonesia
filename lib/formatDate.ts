// lib/formatDate.ts
export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
