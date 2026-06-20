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
      className="border border-black px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
    >
      {action.label}
    </a>
  );
}
