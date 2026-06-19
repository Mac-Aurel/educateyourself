import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { StatItem } from "@/components/ui/StatItem";
import { formatNumber } from "@/lib/utils/formatNumber";
import { formatRelativeDate } from "@/lib/utils/formatDate";
import type { ConflictSummary } from "@/types/conflict";

type ConflictCardProps = {
  conflict: ConflictSummary;
};

function CardHeader({ conflict }: { conflict: ConflictSummary }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
          {conflict.title}
        </h2>
        <p className="mt-0.5 text-sm text-zinc-500">{conflict.country}</p>
      </div>
      <Badge status={conflict.status} />
    </div>
  );
}

function CardSummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      {summary}
    </p>
  );
}

function CardStats({ conflict }: { conflict: ConflictSummary }) {
  return (
    <div className="mt-4 flex gap-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
      <StatItem label="Fatalities" value={formatNumber(conflict.fatalities)} />
      <StatItem label="Displaced" value={formatNumber(conflict.displaced)} />
      {conflict.lastSyncedAt && (
        <StatItem label="Updated" value={formatRelativeDate(conflict.lastSyncedAt)} />
      )}
    </div>
  );
}

export function ConflictCard({ conflict }: ConflictCardProps) {
  return (
    <Link
      href={`/conflicts/${conflict.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <CardHeader conflict={conflict} />
      <CardSummary summary={conflict.summary} />
      <CardStats conflict={conflict} />
    </Link>
  );
}
