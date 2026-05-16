# Arquitetura de Sistema: Super Skill IA (Guia para Vibe Coding com Claude Code)

Este documento atua como o **Master Prompt / Contexto Estrutural** para desenvolver o sistema "Super Skill IA" utilizando a abordagem de *Vibe Coding* (programação guiada por intenção natural) através do **Claude Code** (ou agents similares).

---

## 1. Contexto do Projeto (O "Vibe" Geral)

**Objetivo:** Transformar o chão de fábrica de uma oficina automotiva (4 unidades, 40 colaboradores, 15+ serviços simultâneos) em um **Gêmeo Digital** em tempo real.

**O Problema:** Atualmente a operação tem um "pátio cego" (20% de visibilidade), causando 10% de retrabalho e 12% de desperdício.

**A Solução:** Um sistema que utiliza 14 câmeras 4K processando dados via Inteligência Artificial (YOLOv8, Pose Estimation, ReID) para rastrear carros (via QR Code A4 no teto) e funcionários (por marcadores no uniforme), cruzando esses dados para deduzir qual atividade produtiva está acontecendo.

---

## 2. Stack Tecnológica

* **AI / Computer Vision Engine:** `Python`, `OpenCV`, `Ultralytics (YOLOv8)`, `MediaPipe` (para Pose Estimation).
* **Backend (Torre de Controle):** `Python` + `FastAPI` (Ideal para microsserviços de IA e alta performance assíncrona).
* **Real-time & Mensageria:** `Redis` + `WebSockets` (Para streaming dos alertas e status em tempo real).
* **Banco de Dados:** `PostgreSQL` (Relacional para cadastros e histórico) + `TimescaleDB` ou logs simples para séries temporais.
* **Frontend (Dashboard):** `Next.js` (React) com `TailwindCSS` e `Recharts` (Para os painéis e métricas).
* **Infraestrutura:** `Docker` e `Docker Compose` (Para garantir que tudo rode uniformemente no servidor local da oficina).

---

## 3. Estrutura de Diretórios

```
Home-Cabin-USA/
├── docs/                        # Documentação e Master Prompt
│   └── Arquitetura_Super_Skill_IA.md
├── docker-compose.yml           # Orquestração da stack completa
├── .env.example                 # Variáveis de ambiente template
├── backend/                     # Cérebro: FastAPI + SQLAlchemy
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py              # Entrypoint FastAPI
│       ├── config.py            # Configurações via env
│       ├── database.py          # Conexão SQLAlchemy
│       ├── models.py            # ORM models
│       ├── schemas.py           # Pydantic schemas
│       ├── redis_client.py      # Cliente Redis (pub/sub + queue)
│       ├── worker.py            # Consumer da fila Redis
│       └── routers/
│           ├── dashboard.py     # REST endpoints
│           └── ws.py            # WebSocket /ws/dashboard
├── ai-engine/                   # Olhos: Visão Computacional
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                  # Pipeline orchestrator
│   ├── stream_simulator.py      # Simulador de stream RTSP
│   └── detectors/
│       ├── vehicle_detector.py  # QR Code A4 no teto
│       ├── employee_detector.py # YOLOv8 mockado
│       └── action_detector.py   # Cruzamento proximidade
└── frontend/                    # Torre de Controle: Next.js
    ├── Dockerfile
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx             # Dashboard principal
    │   └── globals.css
    └── components/
        ├── KPICard.tsx          # Cards de métricas
        ├── EventList.tsx        # Feed ao vivo
        └── EfficiencyMatrix.tsx # Matriz comparativa
```

---

## 4. Prompts de Vibe Coding para o Claude Code

Copie e cole estes prompts sequencialmente no terminal do Claude Code para construir o projeto iterativamente.

### Fase 1: Setup de Infraestrutura e Banco de Dados

> **Vibe Prompt 1:** "Claude, estamos construindo o 'Super Skill IA', um sistema de gestão de oficinas guiado por Visão Computacional. Inicialize um projeto com Docker Compose contendo um container PostgreSQL e um container Redis. Crie também a base de um backend em FastAPI na pasta /backend com a conexão ao banco via SQLAlchemy. Os modelos de banco devem ser: Funcionario (com id, nome, cor_uniforme), Veiculo (com id, placa, id_qr_code) e EventoOperacional (timestamp, veiculo_id, funcionario_id, tipo_servico)."

### Fase 2: O Motor de IA (Processamento Neural)

> **Vibe Prompt 2:** "Claude, agora vamos criar o ai-engine em Python. Eu preciso de um script modular que simule a captura de um stream de vídeo (RTSP). Crie classes separadas para: 1. VehicleDetector (que detecta QR codes A4 no teto usando OpenCV), 2. EmployeeDetector (que usa um modelo YOLOv8 mockado para achar pessoas), e 3. ActionDetector (que analisa a proximidade entre a pessoa e o carro para retornar qual serviço está sendo feito). Faça esse motor publicar o evento em formato JSON numa fila do Redis."

### Fase 3: Backend e Integração em Tempo Real

> **Vibe Prompt 3:** "Claude, volte ao backend FastAPI. Preciso de um worker rodando em background (pode usar asyncio ou Celery) que fique escutando a fila do Redis populada pela IA. Quando um novo EventoOperacional chegar, salve no PostgreSQL. Crie também um endpoint WebSocket /ws/dashboard que faça o broadcast desse evento para os clientes conectados para que o painel atualize instantaneamente."

### Fase 4: O Gêmeo Digital (Frontend Dashboard)

> **Vibe Prompt 4:** "Claude, inicialize um projeto Next.js com Tailwind na pasta /frontend. Crie um Dashboard de Torre de Controle escuro (dark mode, pegada tecnológica automotiva). A tela principal deve se conectar ao WebSocket /ws/dashboard do nosso backend. Exiba três componentes: 1. Cards de KPI (Carros em processamento, Visibilidade % - que deve começar em 20% e ir a 95%, e Taxa de Retrabalho), 2. Uma lista rolável dos últimos eventos da IA ao vivo (ex: 'João iniciou Polimento no veículo XYZ'), 3. Um layout de 'Matriz de Eficiência' comparando o estado atual com o Super Skill IA."

---

## 5. Regras de Ouro para Vibe Coding neste Projeto

1. **Contexto Contínuo:** Sempre lembre o Claude que as câmeras são os "olhos" (Borda), o FastAPI é o "cérebro" e o Next.js é a "Torre de Controle".
2. **Mocking Primeiro:** Como treinar YOLO e Pose Estimation leva tempo, comece pedindo para o Claude criar as interfaces de IA retornando dados simulados (*mocks* com bounding boxes fake) para garantir que o fluxo de dados (Câmera → Redis → FastAPI → WebSocket → Tela) funciona em tempo real.
3. **Escalabilidade:** O código deve estar preparado para processar streams de 14 câmeras 4K. Instrua o Claude a usar processamento assíncrono e batching.

---

## 6. Fluxo de Dados (End-to-End)

```
[Câmera 4K RTSP]                          (Borda)
       │
       ▼
[ai-engine: stream_simulator]
       │ frames
       ▼
[VehicleDetector] ─┐
[EmployeeDetector] ┼──▶ [ActionDetector] ──▶ JSON Event
[Pose Estimation] ─┘
       │
       ▼
[Redis Queue: "eventos_operacionais"]      (Mensageria)
       │
       ▼
[backend: worker.py]                       (Cérebro)
       │
       ├──▶ [PostgreSQL: EventoOperacional]
       │
       └──▶ [Redis PubSub: "dashboard_broadcast"]
                 │
                 ▼
        [backend: ws.py WebSocket]
                 │
                 ▼
        [frontend: Dashboard]              (Torre de Controle)
```
