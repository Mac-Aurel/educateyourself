import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getConflictBySlug } from "@/lib/supabase/queries/conflicts";
import { getDiscussionsByConflict } from "@/lib/supabase/queries/discussions";
import { DiscussionThread } from "@/components/discussion/DiscussionThread";
import { Badge } from "@/components/ui/Badge";
import { ActionLink } from "@/components/ui/ActionLink";
import { formatNumber } from "@/lib/utils/formatNumber";
import type { Conflict } from "@/types/conflict";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 sm:px-10">
      <Link href="/" className="text-xs uppercase tracking-[0.3em]">
        Raise ur voice
      </Link>
      <Link
        href="/submit"
        className="text-xs uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        Submit
      </Link>
    </nav>
  );
}

function ConflictImage({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  if (!imageUrl) return null;
  return (
    <div className="relative h-[50vh] w-full overflow-hidden sm:h-[60vh]">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </div>
  );
}

function ConflictHeader({ conflict }: { conflict: Conflict }) {
  return (
    <div className="flex flex-col items-center pt-16 pb-10 text-center">
      <Badge status={conflict.status} />
      <h1 className="mt-4 text-[clamp(1.5rem,4vw,2.5rem)] font-light uppercase tracking-[0.2em] leading-tight">
        {conflict.title}
      </h1>
      <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
        {conflict.country} · {conflict.region}
        {conflict.startedAt ? ` · Since ${conflict.startedAt}` : ""}
      </p>
    </div>
  );
}

function ConflictStats({ conflict }: { conflict: Conflict }) {
  return (
    <div className="grid grid-cols-2 gap-8 border-y border-neutral-200 py-8 sm:grid-cols-4">
      <StatBlock label="Fatalities" value={formatNumber(conflict.fatalities)} />
      <StatBlock label="Displaced" value={formatNumber(conflict.displaced)} />
      <StatBlock label="Refugees" value={formatNumber(conflict.refugees)} />
      <StatBlock label="Children affected" value={formatNumber(conflict.childrenAffected)} />
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-lg font-light">{value}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">{label}</span>
    </div>
  );
}

function ConflictSummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <div className="py-10">
      <SectionLabel>Overview</SectionLabel>
      <p className="mt-4 text-sm leading-[1.8] text-neutral-600">{summary}</p>
    </div>
  );
}

function ConflictKeyFacts({ facts }: { facts: string[] }) {
  if (facts.length === 0) return null;
  return (
    <div className="border-t border-neutral-200 py-10">
      <SectionLabel>Key facts</SectionLabel>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <li
            key={fact}
            className="border-l-2 border-black pl-4 text-[11px] leading-relaxed text-neutral-600"
          >
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
    <div className="border-t border-neutral-200 py-10">
      <SectionLabel>Sources</SectionLabel>
      <ul className="mt-4 flex flex-col gap-2">
        {conflict.sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 underline underline-offset-4 transition-opacity hover:opacity-60"
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
    <div className="border-t border-neutral-200 py-10">
      <SectionLabel>How to act</SectionLabel>
      <div className="mt-4 flex flex-wrap gap-3">
        {conflict.actions.map((action) => (
          <ActionLink key={action.url} action={action} />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
      {children}
    </h2>
  );
}

export default async function ConflictPage({ params }: PageProps) {
  const { slug } = await params;
  const conflict = await getConflictBySlug(slug);

  if (!conflict) notFound();

  const messages = await getDiscussionsByConflict(conflict.id);

  return (
    <>
      <Navbar />
      <ConflictImage imageUrl={conflict.imageUrl} title={conflict.title} />
      <main className="mx-auto max-w-2xl px-6">
        <ConflictHeader conflict={conflict} />
        <ConflictStats conflict={conflict} />
        <ConflictSummary summary={conflict.summary} />
        <ConflictKeyFacts facts={conflict.keyFacts} />
        <ConflictSources conflict={conflict} />
        <ConflictActions conflict={conflict} />
        <div className="border-t border-neutral-200 py-10">
          <DiscussionThread conflictId={conflict.id} initialMessages={messages} />
        </div>
      </main>
      <footer className="border-t border-neutral-200 py-10 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        Raise ur voice
      </footer>
    </>
  );
}
