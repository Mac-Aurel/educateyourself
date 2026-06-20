import type { ConflictStatus } from "@/types/conflict";

const STATUS_LABELS: Record<ConflictStatus, string> = {
  active: "Active",
  monitoring: "Monitoring",
  resolved: "Resolved",
};

type BadgeProps = {
  status: ConflictStatus;
};

export function Badge({ status }: BadgeProps) {
  return (
    <span className="text-xs uppercase tracking-[0.15em] text-neutral-400">
      {STATUS_LABELS[status]}
    </span>
  );
}
