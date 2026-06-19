import type { ConflictStatus } from "@/types/conflict";

const STATUS_STYLES: Record<ConflictStatus, string> = {
  active:     "bg-red-100 text-red-700 border-red-200",
  monitoring: "bg-yellow-100 text-yellow-700 border-yellow-200",
  resolved:   "bg-green-100 text-green-700 border-green-200",
};

const STATUS_LABELS: Record<ConflictStatus, string> = {
  active:     "Active",
  monitoring: "Monitoring",
  resolved:   "Resolved",
};

type BadgeProps = {
  status: ConflictStatus;
};

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
