"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { EfficiencyMatrix } from "../components/EfficiencyMatrix";
import { EventList, type LiveEvent } from "../components/EventList";
import { KPICard } from "../components/KPICard";

const MAX_EVENTS = 50;
const VIS_TARGET = 95;
const VIS_START = 20;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/dashboard";

export default function Page() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let stopped = false;
    let retry = 0;

    function connect() {
      if (stopped) return;
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => {
        retry = 0;
        setConnected(true);
      };
      ws.onmessage = (msg) => {
        try {
          const evt = JSON.parse(msg.data) as LiveEvent;
          setEvents((prev) => [evt, ...prev].slice(0, MAX_EVENTS));
        } catch {
          /* ignore malformed */
        }
      };
      ws.onclose = () => {
        setConnected(false);
        if (stopped) return;
        retry += 1;
        const delay = Math.min(8000, 500 * 2 ** retry);
        setTimeout(connect, delay);
      };
      ws.onerror = () => ws.close();
    }

    connect();
    return () => {
      stopped = true;
      wsRef.current?.close();
    };
  }, []);

  const kpis = useMemo(() => {
    const carros = new Set(events.map((e) => e.placa)).size;
    const ramp = Math.min(1, events.length / 25);
    const visibilidade = (VIS_START + ramp * (VIS_TARGET - VIS_START)).toFixed(0);
    const retrabalhos = events.filter((e) =>
      e.tipo_servico.toLowerCase().includes("retrabalho")
    ).length;
    const retrabalho = events.length
      ? ((retrabalhos / events.length) * 100).toFixed(1)
      : "0.0";
    return { carros, visibilidade, retrabalho };
  }, [events]);

  return (
    <main className="min-h-screen px-8 py-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Super Skill IA
          </p>
          <h1 className="text-2xl text-zinc-100">Torre de Controle · Gêmeo Digital</h1>
        </div>
        <span
          className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${
            connected
              ? "text-neon-green border-neon-green/40"
              : "text-neon-red border-neon-red/40"
          }`}
        >
          WS {connected ? "ONLINE" : "OFFLINE"}
        </span>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          label="Carros em processamento"
          value={String(kpis.carros)}
          delta="janela 1h"
          accent="cyan"
        />
        <KPICard
          label="Visibilidade do pátio"
          value={`${kpis.visibilidade}%`}
          delta={`meta ${VIS_TARGET}%`}
          accent="green"
        />
        <KPICard
          label="Taxa de retrabalho"
          value={`${kpis.retrabalho}%`}
          delta="ao vivo"
          accent={Number(kpis.retrabalho) > 5 ? "red" : "amber"}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EventList events={events} />
        </div>
        <div className="lg:col-span-1">
          <EfficiencyMatrix />
        </div>
      </section>
    </main>
  );
}
