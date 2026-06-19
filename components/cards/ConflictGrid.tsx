import { ConflictCard } from "@/components/cards/ConflictCard";
import type { ConflictSummary } from "@/types/conflict";

type ConflictGridProps = {
  conflicts: ConflictSummary[];
};

function EmptyState() {
  return (
    <p className="col-span-full text-center text-sm text-zinc-500">
      No conflicts found.
    </p>
  );
}

export function ConflictGrid({ conflicts }: ConflictGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
