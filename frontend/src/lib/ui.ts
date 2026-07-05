/**
 * Shared UI formatting + status-style helpers.
 * Centralizes logic that was previously duplicated (and diverging) across the
 * applicant dashboard, applications page, employer dashboard, and candidate views.
 */

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  INR: "₹",
  NPR: "₨",
};

function abbrev(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${n}`;
}

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency?: string | null,
  period?: string | null,
): string | null {
  if (!min && !max) return null;
  const sym = currency ? CURRENCY_SYMBOLS[currency] ?? `${currency} ` : "$";
  const suffix = period ? `/${period === "yearly" ? "yr" : period === "monthly" ? "mo" : "hr"}` : "";
  if (min && max) return `${sym}${abbrev(min)} – ${sym}${abbrev(max)}${suffix}`;
  const v = (min ?? max) as number;
  return `${sym}${abbrev(v)}${suffix}`;
}

export function timeAgo(date?: string | Date | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  if (Number.isNaN(diff)) return "";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "selected"
  | "rejected";

type StatusStyle = {
  label: string;
  /** Badge/chip classes — translucent tint + ring, tuned for the dark theme. */
  badge: string;
  /** Solid dot color for timelines/indicators. */
  dot: string;
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  applied: {
    label: "Applied",
    badge: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/25",
    dot: "bg-sky-400",
  },
  reviewing: {
    label: "Reviewing",
    badge: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25",
    dot: "bg-amber-400",
  },
  shortlisted: {
    label: "Shortlisted",
    badge: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25",
    dot: "bg-violet-400",
  },
  selected: {
    label: "Selected",
    badge: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/25",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/25",
    dot: "bg-rose-400",
  },
};

export function statusStyle(status?: string | null): StatusStyle {
  return (
    STATUS_STYLES[(status ?? "").toLowerCase()] ?? {
      label: status ? status[0].toUpperCase() + status.slice(1) : "Unknown",
      badge: "bg-white/[0.06] text-muted-foreground ring-1 ring-white/10",
      dot: "bg-muted-foreground",
    }
  );
}

/** Title-case an enum value like "senior level" → "Senior Level". */
export function humanize(value?: string | null): string {
  if (!value) return "";
  return value
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
