import { notFound } from "next/navigation";
import Link from "next/link";
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

function ConflictHeader({ conflict }: { conflict: Conflict }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {conflict.title}
        </h1>
        <p className="mt-1 text-zinc-500">{conflict.country}</p>
      </div>
      <Badge status={conflict.status} />
    </div>
  );
}

function ConflictStats({ conflict }: { conflict: Conflict }) {
  return (
    <div className="mt-6 flex flex-wrap gap-8 rounded-xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <StatItem label="Fatalities" value={formatNumber(conflict.fatalities)} />
      <StatItem label="Displaced" value={formatNumber(conflict.displaced)} />
      {conflict.lastSyncedAt && (
        <StatItem label="Last updated" value={formatDate(conflict.lastSyncedAt)} />
      )}
    </div>
  );
}

function ConflictSummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <p className="mt-6 leading-relaxed text-zinc-700 dark:text-zinc-300">{summary}</p>
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
      <ConflictHeader conflict={conflict} />
      <ConflictStats conflict={conflict} />
      <ConflictSummary summary={conflict.summary} />
      <ConflictSources conflict={conflict} />
      <ConflictActions conflict={conflict} />
      <DiscussionThread conflictId={conflict.id} initialMessages={messages} />
    </main>
  );
}
