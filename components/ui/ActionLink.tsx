import type { ConflictAction } from "@/types/conflict";

type ActionLinkProps = {
  action: ConflictAction;
};

export function ActionLink({ action }: ActionLinkProps) {
  return (
    <a
      href={action.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {action.label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
