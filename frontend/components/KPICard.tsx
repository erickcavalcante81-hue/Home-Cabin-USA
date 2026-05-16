type KPICardProps = {
  label: string;
  value: string;
  delta?: string;
  accent?: "cyan" | "green" | "amber" | "red";
};

const ACCENT_MAP: Record<NonNullable<KPICardProps["accent"]>, string> = {
  cyan: "text-neon-cyan border-neon-cyan/40 shadow-neon-cyan",
  green: "text-neon-green border-neon-green/40",
  amber: "text-neon-amber border-neon-amber/40",
  red: "text-neon-red border-neon-red/40",
};

export function KPICard({ label, value, delta, accent = "cyan" }: KPICardProps) {
  const accentClass = ACCENT_MAP[accent];
  return (
    <div
      className={`rounded-2xl border bg-carbon-800/60 backdrop-blur p-5 flex flex-col gap-2 transition ${accentClass}`}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">{label}</span>
      <span className="text-4xl font-semibold">{value}</span>
      {delta ? <span className="text-xs text-zinc-500">{delta}</span> : null}
    </div>
  );
}
