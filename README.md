# Super Skill IA — Gêmeo Digital de Oficinas Automotivas

Sistema de Visão Computacional + Torre de Controle em tempo real para
oficinas automotivas: rastreamento de veículos por QR Code A4 no teto,
identificação de funcionários por uniforme e dedução de serviços via
proximidade.

> **Master Prompt / Arquitetura:** veja [`docs/Arquitetura_Super_Skill_IA.md`](docs/Arquitetura_Super_Skill_IA.md).

## Stack

| Camada            | Tech                                       |
| ----------------- | ------------------------------------------ |
| AI Engine (Olhos) | Python · OpenCV · YOLOv8 (mock) · MediaPipe |
| Backend (Cérebro) | FastAPI · SQLAlchemy · WebSockets          |
| Mensageria        | Redis (queue + pub/sub)                    |
| Banco             | PostgreSQL 16                              |
| Frontend          | Next.js 14 · TailwindCSS · Recharts        |
| Infra             | Docker Compose                             |

## Estrutura

```
docs/                    Documentação e Master Prompt
docker-compose.yml       Orquestração full-stack
backend/                 FastAPI + worker Redis + WebSocket
ai-engine/               Pipeline CV + detectores mockados
frontend/                Dashboard "Torre de Controle"
```

## Como rodar (full stack)

```bash
cp .env.example .env
docker compose up --build
```

Endpoints quando subir:

- **Dashboard:** http://localhost:3000
- **API:** http://localhost:8000/docs
- **WebSocket:** ws://localhost:8000/ws/dashboard
- **Postgres:** localhost:5432 · **Redis:** localhost:6379

## Fluxo de dados

```
ai-engine ─JSON─▶ Redis queue ─▶ backend worker ─▶ PostgreSQL
                                       │
                                       └─▶ Redis pubsub ─▶ WebSocket ─▶ Next.js
```

Os detectores rodam em modo `mock=True` por padrão para que o pipeline
end-to-end (câmera → tela) funcione antes mesmo dos modelos reais
estarem treinados — basta trocar para `mock=False` quando o YOLOv8 e o
pipeline de QR Code estiverem prontos para produção.

## Fases de implementação

1. **Infra + Backend base** — Docker Compose, FastAPI, SQLAlchemy.
2. **AI Engine** — `VehicleDetector`, `EmployeeDetector`, `ActionDetector`.
3. **Backend em tempo real** — worker Redis + WebSocket `/ws/dashboard`.
4. **Frontend** — Dashboard dark com KPIs, feed ao vivo e matriz de eficiência.
