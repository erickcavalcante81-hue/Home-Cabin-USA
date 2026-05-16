export type LiveEvent = {
  id?: number;
  timestamp: string;
  placa: string;
  funcionario_nome: string;
  tipo_servico: string;
  camera_id?: string | null;
};

type EventListProps = {
  events: LiveEvent[];
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour12: false });
  } catch {
    return iso;
  }
}

export function EventList({ events }: EventListProps) {
  return (
    <div className="rounded-2xl border border-carbon-600 bg-carbon-800/60 backdrop-blur h-full flex flex-col">
      <header className="px-5 py-3 border-b border-carbon-600 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-400">Feed ao Vivo</h2>
        <span className="text-xs text-neon-green flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          IA ATIVA
        </span>
      </header>
      <ul className="overflow-y-auto divide-y divide-carbon-600 flex-1 max-h-[480px]">
        {events.length === 0 ? (
          <li className="px-5 py-6 text-sm text-zinc-500">
            Aguardando eventos da IA. Verifique o ai-engine.
          </li>
        ) : (
          events.map((evt, idx) => {
            const isRetrabalho = evt.tipo_servico.toLowerCase().includes("retrabalho");
            return (
              <li
                key={`${evt.id ?? idx}-${evt.timestamp}`}
                className="px-5 py-3 flex items-center justify-between gap-4 text-sm"
              >
                <div className="flex flex-col">
                  <span className="text-zinc-100">
                    <span className="text-neon-cyan">{evt.funcionario_nome}</span>{" "}
                    <span className="text-zinc-400">iniciou</span>{" "}
                    <span className={isRetrabalho ? "text-neon-red" : "text-neon-amber"}>
                      {evt.tipo_servico}
                    </span>{" "}
                    <span className="text-zinc-400">no veículo</span>{" "}
                    <span className="text-zinc-100">{evt.placa}</span>
                  </span>
                  {evt.camera_id ? (
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                      {evt.camera_id}
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-zinc-500 tabular-nums">
                  {formatTime(evt.timestamp)}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
