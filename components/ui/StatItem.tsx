type StatItemProps = {
  label: string;
  value: string;
};

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">{label}</span>
      <span className="text-sm font-light">{value}</span>
    </div>
  );
}
