# Braga Veículos — Contexto do Projeto para Nova Conta Cowork
**Uso:** Cole este documento no início de uma nova sessão do Cowork para dar contexto completo ao Claude.

---

## Prompt de Onboarding (copie e cole no Cowork)

> Olá! Estou continuando o projeto de gestão de entregas da Braga Veículos, iniciado por outra conta do time Malia. Preciso que você leia este contexto completo e continue o trabalho de onde paramos.
>
> **Sobre o projeto:**
> A Braga Veículos é uma concessionária Chevrolet. Desenvolvemos um sistema completo de gestão de preparação e entrega de veículos zero km. O sistema inclui um app web, fluxogramas, plano de ação e protocolos de crise.
>
> **Arquivos disponíveis na pasta do projeto:**
> - `braga-veiculos/app/index.html` — app principal de gestão (PWA, mobile-first, dark mode)
> - `FLUXOGRAMA_Preparacao_Entrega_v5.1` — fluxograma operacional vigente
> - `GESTAO_DE_CRISE_Braga_Veiculos.pdf` — protocolo de crise operacional
> - `PLANO_DE_ACAO_2026_Braga_Veiculos.pdf` — plano de implantação e metas
> - `RESUMO_PROJETO_BRAGA_VEICULOS.md` — resumo completo do projeto
> - `MANUAL_DE_USO.md` — manual de uso por perfil
>
> **Leia o RESUMO_PROJETO_BRAGA_VEICULOS.md e o MANUAL_DE_USO.md para o contexto completo.**

---

## Resumo Executivo do Projeto

### O que foi construído

**App Web — `braga-veiculos/app/index.html`**
Sistema completo de gestão com **5 etapas operacionais (Fluxograma v5.1)**, **9
perfis de usuário (por cargo, sem nomes pessoais)**, entrada das planilhas de
programação (PDF/texto), fluxo **Via Rápida** (frota/locadora), **Reagendamento**,
conferência do **VIN SERIAL** (adesivo GM) por OCR, checklists por etapa,
registro de acessórios, defeitos e dashboard gerencial. PWA, dark mode, mobile-first.

### Pipeline operacional (5 etapas — Fluxograma v5.1)

| # | Etapa | Responsável (cargo) | Observação |
|---|-------|---------------------|------------|
| 0 | Preparação no Estoque | Colaborador de Pátio | Foto do **VIN SERIAL** conferida (OCR × grade) p/ liberar; acessórios/películas; lavagem + tapete; **Via Rápida** = frota/locadora |
| 1 | Pré-Entrega | Programador | Validação, liberação financeira, docs e agendamento (48 h antes) |
| 2 | Conferência Final | Equipe Técnica | Confere etapas anteriores; placa instalada; foto da placa |
| 3 | Entrega ao Cliente | Entregador Técnico | Conferência com o cliente; fotos finais; Planilha 4 (Entregues) |
| 4 | Entregue | — | Encerrado no app |

Fora do fluxo linear: **Via Rápida** (frota/locadora — só lavagem + tapete, com
prioridade) e **Reagendamento** (cliente não compareceu → volta p/ Pré-Entrega).

### Perfis de usuário no app (9 — por cargo)

- **Gerente** — Dashboard KPIs, visão geral
- **Torre de Controle** — monitora todo o fluxo, comunicação e atribuição de tarefas
- **Programador** — entrada das planilhas, pipeline, agendamentos (Pré-Entrega)
- **Co-Programador** — recebe pedidos, cadastra veículos, atualiza listas
- **Colaborador de Pátio** — busca o veículo, foto do VIN SERIAL, preparação
- **Instalação de Acessórios** — instala/confirma acessórios e películas
- **Lavador / Tapete** — lavagem, acabamento e tapete (inclui veículos sem acessório)
- **Equipe Técnica** — conferência final e placa
- **Entregador Técnico** — entrega ao cliente, fotos finais e Planilha 4

> Os perfis são **por cargo** — sem nomes pessoais. A lista de pessoas abaixo é
> só uma referência organizacional.

### Remetentes autorizados WhatsApp
Adriana · Adriano · Junior Leão · Adriano Junior

### Canais de entrada de pedidos
WhatsApp (mensagem ou PDF) · E-mail · PDF de planilha (extração automática) · Parser de texto

### Status da implantação
- [x] App construído e atualizado com o **Fluxograma v5.1**
- [x] Importador de planilhas (PDF/texto) com aplicação automática (dedup por chassi)
- [x] Fotos da vistoria + conferência do VIN SERIAL por OCR
- [x] **Firebase configurado** (projeto `entrega-braga`) — sync em tempo real
- [x] **Publicado no Netlify** — https://entrega-braga.netlify.app (PWA instalável)

### Arquitetura vigente
Firebase Firestore (banco) + Netlify (hosting) + PWA (instala como app no celular)
- Custo: R$0
- Resultado: link fixo, 4G/Wi-Fi, toda equipe sincronizada em tempo real

---

## Como abrir o app

**Online (recomendado):** https://entrega-braga.netlify.app — abre no celular ou
computador; instale como PWA (Adicionar à Tela de Início / Instalar app).

**Local (desenvolvimento):**
```bash
cd braga-veiculos/app && python3 -m http.server 8000
```

---

## Pessoas envolvidas

| Nome | Papel |
|------|-------|
| Adriano | Direção / Co-Programador no app |
| Adriana | Direção / Autorizada WhatsApp |
| Junior Leão | Supervisão / Autorizado WhatsApp |
| Adriano Junior | Supervisão / Autorizado WhatsApp |
| Helena | Programador de Entrega |
| Parazinho | Instalador de Acessórios e Películas |
| Andreza | Adm. Sistema D4 |

---

## Arquivos no repositório

```
braga-veiculos/
├── app/                                 ← App publicável (PWA)
│   ├── index.html                       ← APP PRINCIPAL (v5.1)
│   ├── cloud-sync.js                    ← Sincronização Firebase
│   ├── firebase-config.js               ← Chaves do projeto entrega-braga
│   ├── sw.js · manifest.webmanifest · icons/
└── docs/
    ├── MANUAL_DE_USO.md                 ← Manual por perfil
    ├── SETUP_NUVEM.md                   ← Pôr online + sincronizar
    ├── RESUMO_PROJETO_BRAGA_VEICULOS.md ← Resumo completo
    ├── ANALISE_PEDIDOS_E_PLANILHAS.md   ← Padrão das planilhas
    └── samples/                         ← PDFs de teste
```

---

*Projeto Braga Veículos · Grupo Econômico Malia · 2026*
