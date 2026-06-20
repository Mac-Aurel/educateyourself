import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getConflictBySlug } from "@/lib/supabase/queries/conflicts";
import { getDiscussionsByConflict } from "@/lib/supabase/queries/discussions";
import { DiscussionThread } from "@/components/discussion/DiscussionThread";
import { Badge } from "@/components/ui/Badge";
import { ActionLink } from "@/components/ui/ActionLink";
import { formatNumber } from "@/lib/utils/formatNumber";
import { DeleteConflictButton } from "@/components/cards/DeleteConflictButton";
import type { Conflict } from "@/types/conflict";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-10 sm:py-5">
      <Link href="/" className="text-xs font-medium uppercase tracking-[0.25em]">
        Raise ur voice
      </Link>
      <Link
        href="/submit"
        className="text-xs uppercase tracking-[0.15em] underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        Submit
      </Link>
    </nav>
  );
}

function ConflictImage({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  if (!imageUrl) return null;
  return (
    <div className="relative h-[40vh] w-full overflow-hidden sm:h-[55vh]">
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
    <div className="flex flex-col items-center pt-10 pb-8 text-center sm:pt-16 sm:pb-10">
      <Badge status={conflict.status} />
      <h1 className="mt-3 text-2xl font-light uppercase tracking-[0.15em] leading-tight sm:mt-4 sm:text-4xl sm:tracking-[0.2em]">
        {conflict.title}
      </h1>
      <p className="mt-2 text-xs uppercase tracking-[0.1em] text-neutral-500 sm:mt-3 sm:tracking-[0.15em]">
        {conflict.country} · {conflict.region}
        {conflict.startedAt ? ` · Since ${conflict.startedAt}` : ""}
      </p>
    </div>
  );
}

function ConflictStats({ conflict }: { conflict: Conflict }) {
  return (
    <div className="grid grid-cols-2 gap-6 border-y border-neutral-200 py-6 sm:grid-cols-4 sm:gap-8 sm:py-8">
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
      <span className="text-lg font-light sm:text-xl">{value}</span>
      <span className="text-[11px] uppercase tracking-[0.15em] text-neutral-400 sm:text-xs">{label}</span>
    </div>
  );
}

function ConflictSummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <div className="py-8 sm:py-10">
      <SectionLabel>Overview</SectionLabel>
      <p className="mt-4 text-sm leading-[1.9] text-neutral-600 sm:text-[13px]">{summary}</p>
    </div>
  );
}

function ConflictKeyFacts({ facts }: { facts: string[] }) {
  if (facts.length === 0) return null;
  return (
    <div className="border-t border-neutral-200 py-8 sm:py-10">
      <SectionLabel>Key facts</SectionLabel>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <li
            key={fact}
            className="border-l-2 border-black pl-4 text-sm leading-relaxed text-neutral-600 sm:text-xs"
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
    <div className="border-t border-neutral-200 py-8 sm:py-10">
      <SectionLabel>Sources</SectionLabel>
      <ul className="mt-4 flex flex-col gap-2">
        {conflict.sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 underline underline-offset-4 transition-opacity hover:opacity-60 sm:text-xs"
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
    <div className="border-t border-neutral-200 py-8 sm:py-10">
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
    <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-400">
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
      <main className="mx-auto max-w-2xl px-5 sm:px-6">
        <ConflictHeader conflict={conflict} />
        <ConflictStats conflict={conflict} />
        <ConflictSummary summary={conflict.summary} />
        <ConflictKeyFacts facts={conflict.keyFacts} />
        <ConflictSources conflict={conflict} />
        <ConflictActions conflict={conflict} />
        {conflict.submittedBy && (
          <div className="border-t border-neutral-200 py-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Submitted by {conflict.submittedBy}
              </span>
              <DeleteConflictButton slug={conflict.slug} submittedBy={conflict.submittedBy} />
            </div>
          </div>
        )}
        <div className="border-t border-neutral-200 py-8 sm:py-10">
          <DiscussionThread conflictId={conflict.id} initialMessages={messages} />
        </div>
      </main>
      <footer className="border-t border-neutral-200 py-8 text-center text-xs uppercase tracking-[0.2em] text-neutral-400 sm:py-10">
        Raise ur voice
      </footer>
    </>
  );
}
