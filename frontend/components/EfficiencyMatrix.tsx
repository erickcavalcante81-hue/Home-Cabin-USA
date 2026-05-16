type MetricRow = {
  metrica: string;
  antes: string;
  depois: string;
  ganho: string;
};

const ROWS: MetricRow[] = [
  { metrica: "Visibilidade do pátio", antes: "20%", depois: "95%", ganho: "+75 p.p." },
  { metrica: "Taxa de retrabalho", antes: "10%", depois: "2%", ganho: "-8 p.p." },
  { metrica: "Desperdício operacional", antes: "12%", depois: "3%", ganho: "-9 p.p." },
  { metrica: "Tempo médio de resposta", antes: "8 min", depois: "45 s", ganho: "-90%" },
  { metrica: "Carros simultâneos rastreados", antes: "3", depois: "15+", ganho: "+5x" },
];

export function EfficiencyMatrix() {
  return (
    <div className="rounded-2xl border border-carbon-600 bg-carbon-800/60 backdrop-blur p-5">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-400">
          Matriz de Eficiência
        </h2>
        <span className="text-[10px] text-zinc-500">ANTES → SUPER SKILL IA</span>
      </header>
      <div className="overflow-hidden rounded-xl border border-carbon-600">
        <table className="w-full text-sm">
          <thead className="bg-carbon-700/60 text-zinc-400 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="text-left px-4 py-2 font-normal">Métrica</th>
              <th className="text-right px-4 py-2 font-normal">Antes</th>
              <th className="text-right px-4 py-2 font-normal">Com IA</th>
              <th className="text-right px-4 py-2 font-normal">Ganho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-600">
            {ROWS.map((row) => (
              <tr key={row.metrica} className="hover:bg-carbon-700/40 transition">
                <td className="px-4 py-3 text-zinc-200">{row.metrica}</td>
                <td className="px-4 py-3 text-right text-zinc-500 tabular-nums">{row.antes}</td>
                <td className="px-4 py-3 text-right text-neon-cyan tabular-nums">{row.depois}</td>
                <td className="px-4 py-3 text-right text-neon-green tabular-nums">{row.ganho}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
