export function formatEgyptDateTime(
  value?: string | null,
  withTime = true,
): string {
  if (!value) return "-";

  const normalized = value.includes("T")
    ? value
    : value.replace(" ", "T");

  const hasTime = normalized.length > 10;

  const date = hasTime
    ? new Date(normalized.endsWith("Z") ? normalized : `${normalized}Z`)
    : new Date(`${normalized.slice(0, 10)}T00:00:00Z`);

  if (isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(withTime
      ? { hour: "numeric", minute: "2-digit", hour12: true }
      : {}),
  }).format(date);
}
