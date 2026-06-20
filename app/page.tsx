import Link from "next/link";
import { getAllConflicts } from "@/lib/supabase/queries/conflicts";
import { ConflictGrid } from "@/components/cards/ConflictGrid";

function PageHeader() {
  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          raise ur voice
        </h1>
        <p className="mt-2 text-zinc-500">
          Learn about active global conflicts and human rights crises. Read, discuss, and act.
        </p>
      </div>
      <Link
        href="/submit"
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Submit a conflict
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const conflicts = await getAllConflicts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <PageHeader />
      <ConflictGrid conflicts={conflicts} />
    </main>
  );
}
