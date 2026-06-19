type StatItemProps = {
  label: string;
  value: string;
};

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{value}</span>
    </div>
  );
}
