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
      className="border border-black px-5 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white sm:text-[11px] sm:tracking-[0.15em]"
    >
      {action.label}
    </a>
  );
}
