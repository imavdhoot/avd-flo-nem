

export function parseBaseDate(dateStr: string): Date | null {
  if (!/^\d{8}$/.test(dateStr)) return null;
  return new Date(
    Number(dateStr.slice(0, 4)),      // year
    Number(dateStr.slice(4, 6)) - 1,  // month 0‑based
    Number(dateStr.slice(6, 8))       // day
  );
}