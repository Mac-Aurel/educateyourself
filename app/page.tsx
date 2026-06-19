import { getAllConflicts } from "@/lib/supabase/queries/conflicts";
import { ConflictGrid } from "@/components/cards/ConflictGrid";

function PageHeader() {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        raise ur voice
      </h1>
      <p className="mt-2 text-zinc-500">
        Learn about active global conflicts and human rights crises. Read, discuss, and act.
      </p>
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
