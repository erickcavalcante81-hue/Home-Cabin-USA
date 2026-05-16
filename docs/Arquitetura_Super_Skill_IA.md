# Arquitetura de Sistema — Super Skill IA · by Conecta Market Hub

> **Documento técnico interno.** Master Prompt e contexto estrutural para desenvolvimento do **Super Skill IA**, produto da **Conecta Market Hub**, usando *Vibe Coding* via Claude Code.

> ⚠️ **Não é material apresentável ao cliente.** Este documento nomeia explicitamente a stack interna (fornecedor de visão computacional, brokers, modelos). Para terminologia pública (PPTX, dashboard, propostas), consulte [`design.md` — Seções 8.4, 9 e 10](../design.md): use **Motor de Visão Computacional**, **Inteligência de Negócio**, **Barramento de Eventos** e **Bridge Semântica**.

---

## 0. Posicionamento de Marca

| Eixo                          | Posicionamento                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **Produto comercial**         | Super Skill IA                                                                  |
| **Empresa / dono da marca**   | Conecta Market Hub                                                              |
| **Cliente atual em proposta** | Braga Veículos (Ramos Ferreira + Djalma Batista, 27 boxes, 14 produtivos)       |
| **Modelo de entrega**         | White-label · stack interna invisível para o cliente final                      |
| **Camadas modulares**         | Motor de Visão Computacional (captura/CV) + Inteligência de Negócio (Super Skill IA) |

### 0.1 Dicionário Interno → Público

A coluna da esquerda é usada **somente** dentro deste repositório (código, docker-compose, comentários técnicos). A coluna da direita é o que aparece para o cliente.

| Interno (este repo)               | Público (PPTX / dashboard / proposta)        |
| --------------------------------- | -------------------------------------------- |
| WEG Vision AI                     | Motor de Visão Computacional                 |
| MQTT broker / Mosquitto           | Barramento de Eventos                        |
| Tópico `weg/braga/...`            | Tópico `vision/braga/...`                    |
| `mqtt_bridge.py`                  | Bridge Semântica                             |
| Modelos YOLOv8 / Pose / ReID      | Motor de detecção proprietário               |
| "integração com fornecedor"       | "arquitetura modular Conecta Market Hub"     |

---

## 1. Contexto do Projeto (Cliente Atual: Braga Veículos)

**Objetivo:** Entregar o **Super Skill IA**, produto white-label da Conecta Market Hub, como **Gêmeo Digital em tempo real** das 2 unidades da Braga Veículos (Ramos Ferreira + Djalma Batista) — 27 boxes operacionais, 12 mecânicos produtivos + 2 auxiliares, com Boqueta de Peças instrumentada como diferencial.

**A Dor:** Hoje o pátio é cego — Down Time invisível, Boqueta de Peças sem métrica, desbalanço Ramos × Djalma sem comparativo objetivo, máquinas-gargalo (2 alinhamentos + 2 balanceamentos) sem fila instrumentada.

**A Solução:** Solução em **duas camadas modulares** sob a mesma marca:

1. **Motor de Visão Computacional** (camada industrial, on-premise por unidade)
   — Conecta nas ~35 câmeras IP/RTSP existentes
   — Detecta pessoas, veículos, EPI, contagens e padrões operacionais
   — Publica eventos no Barramento de Eventos
2. **Inteligência de Negócio** (Super Skill IA propriamente dito)
   — Bridge Semântica traduz eventos → domínio Braga (mecânico, OS, box, peça)
   — Módulos exclusivos: BoxOccupancy, BoquetaFlow, EquipmentQueue, OSAttribution, CrossUnitComparator
   — Torre de Controle ao vivo (Next.js + WebSocket) com toggle Ramos × Djalma

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

## 6. Dimensionamento — Braga Veículos (Hiperpersonalização)

Configuração real do cliente extraída do *Relatório Consolidado de
Infraestrutura* (Ramos Ferreira + Djalma Batista):

| Unidade            | Boxes | C/ Elevador | S/ Elevador | Mecânicos | Auxiliares | Alinham. | Balanc. |
| ------------------ | :---: | :---------: | :---------: | :-------: | :--------: | :------: | :-----: |
| Ramos Ferreira     |  18   |     16      |      2      |    10     |     0      |    1     |    1    |
| Djalma Batista     |   9   |      3      |      6      |     2     |     2      |    1     |    1    |
| **Total**          |  27   |     19      |      8      |    12     |     2      |    2     |    2    |

### Topologia de câmeras proposta

- **Ramos Ferreira (18 boxes):** ~22 câmeras 4K
  - 18 cobrindo um box cada (zenital, captura QR Code A4 no teto)
  - 2 sobre as máquinas de alinhamento + balanceamento (medição de fila)
  - 1 dedicada ao **Boqueta de Peças** (entrada/saída de peças e mecânicos)
  - 1 panorâmica de pátio (ReID + handoff entre câmeras)

- **Djalma Batista (9 boxes):** ~13 câmeras 4K
  - 9 zenitais por box
  - 2 sobre alinhamento + balanceamento
  - 1 dedicada ao Boqueta de Peças
  - 1 panorâmica

- **Total: ~35 câmeras** distribuídas em **2 edges físicos**, sincronizando
  para uma Torre de Controle única.

### Módulos de IA específicos da Braga

| Módulo                          | O que mede                                                                 |
| ------------------------------- | -------------------------------------------------------------------------- |
| `BoxOccupancyDetector`          | Ocupação por box (c/ elevador × s/ elevador) e tempo médio de uso         |
| `BoquetaFlowDetector`           | Tempo entre mecânico chegar no Boqueta e sair com a peça (Down Time)      |
| `EquipmentQueueDetector`        | Fila virtual nas máquinas de alinhamento e balanceamento                  |
| `OSAttributionDetector`         | Cruza presença (mecânico × veículo × box) com OS para HF real             |
| `CrossUnitComparator`           | Indicadores comparados Ramos Ferreira × Djalma Batista                    |

### KPIs hiperpersonalizados (foco financeiro)

1. **Down Time médio por OS** (alvo: -40%)
2. **Tempo de Atendimento no Boqueta de Peças** (alvo: -60%)
3. **Taxa de Ocupação de Box** com/sem elevador (alvo: +30%)
4. **Horas Faturadas (HF) reais × HF apuradas hoje** (alvo: +20%)
5. **Fila nas máquinas críticas** (alinhamento/balanceamento)
6. **Comparativo cruzado** entre as 2 unidades

---

## 7. Fluxo de Dados (End-to-End)

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

---

## 8. Integração com WEG Vision AI (Modo Híbrido) — INTERNO

> 🔒 **Nomenclatura técnica interna.** Em **qualquer material apresentável ao cliente**, esta camada é chamada apenas de **Motor de Visão Computacional** — nunca pelo nome do fornecedor. Esta seção existe apenas para orientar a integração técnica feita pelo time da Conecta Market Hub.

A partir do diagnóstico do cliente Braga Veículos, identificamos que adotar o
**WEG Vision AI** como camada de captura/inferência de visão computacional
reduz substancialmente a complexidade do projeto, ao mesmo tempo em que mantém
toda a nossa camada de inteligência de negócio (módulos de Boqueta, KPIs,
comparativo Ramos × Djalma, dashboard) — que é **exatamente** o que diferencia
o produto Super Skill IA no mercado.

### O que o WEG Vision AI entrega de forma nativa

Segundo a documentação pública do produto (fonte: blog WEG Digital e página
oficial do produto):

- Conexão direta a **câmeras IP/analógicas via RTSP**, aproveitando a
  infraestrutura existente do cliente.
- Inferência on-premise (instalado em CPU local dedicada).
- Casos de uso suportados: perdas de manufatura, logística, qualidade,
  segurança (EPI, perímetro), contagem e padrões operacionais.
- Geração de eventos publicados via **protocolo MQTT**, exportação para
  CSV, dashboards próprios, disparo de ações automatizadas.
- Integração nativa com painéis elétricos, CLPs e camadas industriais
  (MES/ERP).

### Por que isso muda nosso projeto

| Antes (sem WEG)                                    | Com WEG Vision AI                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| Treinamos YOLOv8 / Pose Estimation / ReID nós mesmos | WEG fornece detecção de pessoas, veículos, EPI prontas             |
| Gerenciamos captura RTSP de 35 câmeras             | WEG faz captura + buffer + reconnect                                |
| Risco técnico em modelos de CV                     | Risco transferido para fornecedor consolidado                       |
| ~5 semanas para AI engine funcional                | ~1 semana de bridge MQTT → nossa fila                               |
| Foco diluído entre CV e produto                    | Foco 100% em **lógica de negócio Braga**                            |

### Arquitetura híbrida resultante

```
                ┌────────────────────────────────────────────┐
                │  WEG VISION AI  (instância por unidade)    │
                │  · Ingest RTSP das ~35 câmeras             │
                │  · Inferência (pessoas, veículos, EPI)     │
                │  · Eventos publicados via MQTT             │
                └────────────────────┬───────────────────────┘
                                     │ MQTT topics:
                                     │   weg/braga/ramos/eventos
                                     │   weg/braga/djalma/eventos
                                     ▼
                ┌────────────────────────────────────────────┐
                │  SUPER SKILL IA — BRIDGE MQTT              │
                │  backend/app/mqtt_bridge.py                │
                │  Normaliza payload WEG → EventoQueueMessage │
                └────────────────────┬───────────────────────┘
                                     ▼
                       [Redis Queue: "eventos_operacionais"]
                                     │
                                     ▼
                       [backend: worker.py]   ──┐
                                 │              │
                                 ▼              ▼
                     [PostgreSQL]      [Redis PubSub → WebSocket]
                                                │
                                                ▼
                                       [Torre de Controle]
```

### O que continua sendo NOSSO (e justifica o projeto)

1. **Módulos de negócio dedicados:** `BoquetaFlowDetector`,
   `BoxOccupancyDetector`, `EquipmentQueueDetector`, `OSAttributionDetector`,
   `CrossUnitComparator`.
2. **Modelagem de dados Braga:** `Funcionario`, `Veiculo`,
   `EventoOperacional` ligados a OS e box.
3. **Dashboard Torre de Controle** com toggle Ramos × Djalma, KPIs
   personalizados, alertas inteligentes.
4. **Lógica de KPI** (Down Time, HF real, tempo no Boqueta) — não vem do
   WEG, é calculada por nós sobre o stream de eventos.
5. **Bridge MQTT** que traduz o vocabulário WEG (entidades genéricas) para
   o domínio Braga (mecânico, OS, box, peça).

### Modo fallback (sem WEG)

O `ai-engine` desenvolvido no projeto continua disponível como caminho
alternativo (mock + OpenCV + YOLOv8) caso o cliente opte por não
contratar a stack do fornecedor, garantindo independência tecnológica
e preservando a proposta white-label da Conecta Market Hub.

---

## 9. Mapeamento Repo → Apresentação (referência rápida)

Quando você for produzir qualquer artefato apresentável (slide, screen do
dashboard, e-mail comercial, vídeo, demo), use sempre o termo da coluna
**Apresentação**. Os identificadores reais ficam no código e neste documento.

| Componente real (repo)               | Apresentação ao cliente                          | Onde aparece              |
| ------------------------------------ | ------------------------------------------------ | ------------------------- |
| `ai-engine/` + WEG Vision AI         | **Motor de Visão Computacional**                 | PPTX slides 4, 5, 6, 8    |
| MQTT broker (Mosquitto)              | **Barramento de Eventos**                        | PPTX slide 6              |
| Tópicos `weg/braga/*/eventos`        | Tópicos `vision/braga/*/operacionais`            | PPTX slide 6, dashboard   |
| `backend/app/mqtt_bridge.py`         | **Bridge Semântica**                             | PPTX slides 4, 6          |
| `backend/app/worker.py` + PostgreSQL | **Inteligência de Negócio · Super Skill IA**    | PPTX slides 4, 5          |
| `backend/app/routers/ws.py`          | **Torre de Controle ao vivo**                    | PPTX slides 6, 10         |
| `frontend/` (Next.js)                | **Dashboard Super Skill IA**                     | PPTX slide 10             |
| Stack interna do fornecedor          | "Stack industrial consolidada"                   | PPTX slides 12, 13        |

### 9.1 Status visual no dashboard

| Estado interno                       | Texto exibido               |
| ------------------------------------ | --------------------------- |
| MQTT bridge conectado + worker OK    | `● IA ATIVA`                |
| Bridge caída / reconectando          | `● RECONECTANDO`            |
| Worker fora                          | `● OFFLINE`                 |

Sem citar fornecedor em qualquer um dos estados.

---

## 10. Roadmap Técnico (alinhado à PPTX v4)

| Fase | Semanas | Entrega técnica                                                                                                  |
| :--: | :-----: | ---------------------------------------------------------------------------------------------------------------- |
|  1   |  1–2    | Edge instalado na Djalma · Motor de Visão configurado · `mqtt_bridge.py` + Redis + PostgreSQL rodando            |
|  2   |  3–4    | Módulos de negócio ativos: `BoquetaFlow`, `BoxOccupancy`, `EquipmentQueue`, `OSAttribution`                      |
|  3   |  5–6    | Dashboard Next.js entregue · WebSocket ao vivo · Validação com gestor Djalma                                     |
|  4   |  7–9    | Rollout em Ramos Ferreira · `CrossUnitComparator` ON · Migração + handoff                                        |

**Piloto validado em 6 semanas · Operação completa em 9 semanas.**

---

## 11. Estrutura atualizada do repositório

```
Home-Cabin-USA/
├── design.md                              ← Design System v1.1 (white-label CMH)
├── docs/
│   ├── Arquitetura_Super_Skill_IA.md     ← este documento (interno)
│   └── Super_Skill_IA_Braga_v4_ConectaMH.pptx  ← entregável ao CEO
├── docker-compose.yml                     ← inclui profile "weg" p/ Mosquitto
├── .env.example
├── backend/
│   └── app/
│       ├── main.py                        ← lifespan c/ worker + ws + mqtt_bridge
│       ├── mqtt_bridge.py                 ← Bridge Semântica (interno)
│       ├── worker.py
│       ├── models.py                      ← Funcionario, Veiculo, EventoOperacional
│       ├── routers/dashboard.py
│       └── routers/ws.py
├── ai-engine/                             ← fallback se cliente não contratar Motor de Visão
└── frontend/                              ← Dashboard Torre de Controle
```

---

## 12. Changelog

- **v1.2 — Posicionamento white-label Conecta Market Hub.**
  - Seção 0 nova: posicionamento de marca + dicionário interno↔público.
  - Seção 1 reescrita para o cliente real (Braga Veículos), com a narrativa em 2 camadas modulares.
  - Seção 8 (WEG) explicitamente marcada como **nomenclatura interna**.
  - Seções 9, 10 e 11 novas: mapeamento repo→apresentação, roadmap técnico, estrutura do repo.
  - Cross-reference para `design.md` Seções 8.4, 9 e 10.
  - Alinhado à `Super_Skill_IA_Braga_v4_ConectaMH.pptx`.

- **v1.1 — Integração com fornecedor de visão computacional.**
  - Seção 8 nova: modo híbrido com MQTT bridge.
  - `backend/app/mqtt_bridge.py` e perfil docker `weg` adicionados.

- **v1.0 — Hiperpersonalização Braga Veículos.**
  - Seções 6 e 7 com dimensionamento real (27 boxes, 14 produtivos, 2 unidades).
  - Módulos de negócio Braga definidos.

- **v0.1 — Arquitetura inicial.** Stack base FastAPI + Redis + PostgreSQL + Next.js.

