import { ConflictCard } from "@/components/cards/ConflictCard";
import type { ConflictSummary } from "@/types/conflict";

type ConflictGridProps = {
  conflicts: ConflictSummary[];
};

function EmptyState() {
  return (
    <p className="col-span-full py-20 text-center text-xs uppercase tracking-[0.15em] text-neutral-400">
      No conflicts found.
    </p>
  );
}

export function ConflictGrid({ conflicts }: ConflictGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
      {conflicts.length === 0 ? (
        <EmptyState />
      ) : (
        conflicts.map((conflict) => (
          <ConflictCard key={conflict.id} conflict={conflict} />
        ))
      )}
    </div>
  );
}
