import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getConflictBySlug } from "@/lib/supabase/queries/conflicts";
import { getDiscussionsByConflict } from "@/lib/supabase/queries/discussions";
import { DiscussionThread } from "@/components/discussion/DiscussionThread";
import { Badge } from "@/components/ui/Badge";
import { StatItem } from "@/components/ui/StatItem";
import { ActionLink } from "@/components/ui/ActionLink";
import { formatNumber } from "@/lib/utils/formatNumber";
import { formatDate } from "@/lib/utils/formatDate";
import type { Conflict } from "@/types/conflict";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function BackLink() {
  return (
    <Link
      href="/"
      className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
    >
      ← All conflicts
    </Link>
  );
}

function ConflictImage({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  if (!imageUrl) return null;
  return (
    <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl sm:h-80">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
        priority
      />
    </div>
  );
}

function ConflictHeader({ conflict }: { conflict: Conflict }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {conflict.title}
        </h1>
        <p className="mt-1 text-zinc-500">
          {conflict.country} · {conflict.region}
        </p>
        {conflict.startedAt && (
          <p className="mt-1 text-sm text-zinc-400">Since {conflict.startedAt}</p>
        )}
      </div>
      <Badge status={conflict.status} />
    </div>
  );
}

function ConflictStats({ conflict }: { conflict: Conflict }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-5 sm:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900">
      <StatItem label="Fatalities" value={formatNumber(conflict.fatalities)} />
      <StatItem label="Displaced" value={formatNumber(conflict.displaced)} />
      <StatItem label="Refugees" value={formatNumber(conflict.refugees)} />
      <StatItem label="Children affected" value={formatNumber(conflict.childrenAffected)} />
      {conflict.lastSyncedAt && (
        <StatItem label="Last updated" value={formatDate(conflict.lastSyncedAt)} />
      )}
    </div>
  );
}

function ConflictSummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Overview
      </h2>
      <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{summary}</p>
    </div>
  );
}

function ConflictKeyFacts({ facts }: { facts: string[] }) {
  if (facts.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Key facts
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {facts.map((fact) => (
          <li
            key={fact}
            className="flex items-start gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <span className="mt-0.5 shrink-0 text-red-500">●</span>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConflictSources({ conflict }: { conflict: Conflict }) {
  if (conflict.sources.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Sources
      </h2>
      <ul className="flex flex-col gap-1">
        {conflict.sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
            >
              {source.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConflictActions({ conflict }: { conflict: Conflict }) {
  if (conflict.actions.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        How to act
      </h2>
      <div className="flex flex-wrap gap-2">
        {conflict.actions.map((action) => (
          <ActionLink key={action.url} action={action} />
        ))}
      </div>
    </div>
  );
}

export default async function ConflictPage({ params }: PageProps) {
  const { slug } = await params;
  const conflict = await getConflictBySlug(slug);

  if (!conflict) notFound();

  const messages = await getDiscussionsByConflict(conflict.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <BackLink />
      <ConflictImage imageUrl={conflict.imageUrl} title={conflict.title} />
      <ConflictHeader conflict={conflict} />
      <ConflictStats conflict={conflict} />
      <ConflictSummary summary={conflict.summary} />
      <ConflictKeyFacts facts={conflict.keyFacts} />
      <ConflictSources conflict={conflict} />
      <ConflictActions conflict={conflict} />
      <DiscussionThread conflictId={conflict.id} initialMessages={messages} />
    </main>
  );
}
