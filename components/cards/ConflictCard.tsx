import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { StatItem } from "@/components/ui/StatItem";
import { formatNumber } from "@/lib/utils/formatNumber";
import type { ConflictSummary } from "@/types/conflict";

type ConflictCardProps = {
  conflict: ConflictSummary;
};

function CardImage({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  if (!imageUrl) return null;
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}

function CardHeader({ conflict }: { conflict: ConflictSummary }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
          {conflict.title}
        </h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          {conflict.country} · {conflict.region}
        </p>
        {conflict.startedAt && (
          <p className="mt-0.5 text-xs text-zinc-400">Since {conflict.startedAt}</p>
        )}
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
    </div>
  );
}

export function ConflictCard({ conflict }: ConflictCardProps) {
  return (
    <Link
      href={`/conflicts/${conflict.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <CardImage imageUrl={conflict.imageUrl} title={conflict.title} />
      <div className="flex flex-1 flex-col p-5">
        <CardHeader conflict={conflict} />
        <CardSummary summary={conflict.summary} />
        <div className="mt-auto">
          <CardStats conflict={conflict} />
        </div>
      </div>
    </Link>
  );
}
