# Braga Veículos — Resumo do Projeto de Gestão de Entregas
**Versão:** Fluxograma v5.1
**Status:** Em produção (nuvem + PWA)
**App:** https://entrega-braga.netlify.app

---

## O que é

Sistema de gestão de **preparação e entrega de veículos zero km** da Braga
Veículos (concessionária Chevrolet). PWA mobile-first em dark mode, instalável
no celular, que funciona **offline** e **sincroniza em tempo real** entre toda
a equipe (Firebase Firestore). Roda no navegador — sem instalação, sem servidor
local.

Arquivos do app em `braga-veiculos/app/` (`index.html`, `cloud-sync.js`,
`firebase-config.js`, `sw.js`, `manifest.webmanifest`, `icons/`).

---

## Pipeline de 5 etapas (v5.1)

| # | Etapa | Responsável (cargo) | Destaque |
|---|-------|---------------------|----------|
| 0 | 🔧 Preparação no Estoque | Colaborador de Pátio | Foto do **VIN SERIAL** (adesivo GM) conferida por OCR × grade libera a etapa; acessórios/películas; lavagem + tapete |
| 1 | 📄 Pré-Entrega | Programador | Validação, liberação financeira, docs e **agendamento** (48 h antes) |
| 2 | 🏁 Conferência Final | Equipe Técnica | Confere etapas anteriores; **placa** instalada; foto da placa |
| 3 | 🚗 Entrega ao Cliente | Entregador Técnico | Conferência com o cliente; fotos finais; Planilha 4 |
| 4 | ✅ Entregue | — | Encerrado no app |

**Fluxos transversais:**
- **⚡ Via Rápida (Frota/Locadora):** veículos sem acessório — só lavagem +
  tapete, com prioridade.
- **🔁 Reagendamento:** cliente não compareceu → volta para a Pré-Entrega com
  nova data (motivo no histórico).

---

## Telas / abas

| Aba | Função |
|-----|--------|
| 📊 Dashboard | KPIs, semáforo, entregas do dia, **🗼 Torre de Controle (pendências)** e pipeline por etapa |
| 🚗 Veículos | Lista com busca, filtro por etapa e barra de progresso |
| ✅ Checklist | Checklists por etapa — item a item |
| 📥 Entrada | Cadastro de pedidos e **importação das 4 planilhas** (lote) |
| ⚠️ Defeitos | Registro de defeitos por tipo, local, severidade e resolução |

E, por veículo: aba **📷 Fotos** (câmera + OCR do VIN SERIAL), **Acessórios**,
**Checklist** e **Histórico**.

---

## Perfis de acesso (9 — por cargo, sem nomes pessoais)

Gerente · **Torre de Controle** · Programador · Co-Programador · Colaborador de
Pátio · Instalação de Acessórios · Lavador / Tapete · **Equipe Técnica** ·
**Entregador Técnico**.

---

## Entrada das 4 planilhas de programação (v5.1)

Na aba **Entrada** → **Planilhas de programação (lote)**, escolhe-se **qual**
planilha e sobe-se o **PDF** (extração automática) ou cola-se o texto. A
aplicação é **automática** (sem seleção veículo a veículo), deduplicada pelo
**chassi**:

1. **Preparação** — cadastra novos na etapa Preparação; atualiza existentes.
2. **Entrega (agendamento)** — define data/horário/entregador e leva o veículo
   para a **Pré-Entrega**.
3. **Reagendamento** — marca 🔁 Reagendado e volta para a Pré-Entrega.
4. **Entregues** — marca os veículos como ✅ Entregue.

Novos entram direto; existentes com mudança são **sobrescritos pela última
versão** e marcados com **🔔 Alterado**; idênticos são ignorados. Ao final,
mostra um resumo (novos · atualizados · sem mudança). Padrão dos documentos em
[`ANALISE_PEDIDOS_E_PLANILHAS.md`](ANALISE_PEDIDOS_E_PLANILHAS.md).

---

## Torre de Controle, comunicação e atribuição

- **🗼 Torre de Controle (Dashboard):** painel de pendências — chassi/VIN SERIAL
  não conferido, comunicação pendente, sem responsável, Pré-Entrega sem data e
  atrasados — cada uma com contagem e atalho para o veículo.
- **📲 Comunicação obrigatória:** ao concluir uma etapa, o app pede para
  **comunicar** (Equipe · Vendedor · Gerência · Torre). Monta a mensagem e
  **compartilha/copia** para o WhatsApp, registrando no histórico.
- **👤 Atribuição de tarefas:** cada veículo tem um **responsável** pela etapa
  atual (reatribuído a cada avanço), visível no card e na Torre.

---

## Conferência do VIN SERIAL por OCR

A foto do **VIN SERIAL** (adesivo GM no para-brisa) é lida no próprio aparelho
(Tesseract.js) e cruzada com a grade. Aprova pelo **VIN SERIAL de 6 dígitos**
ou pelo **chassi cheio** (17). A etapa 0 só libera a preparação se **conferir**
(com liberação manual registrada como exceção).

---

## Sincronização e dados

- Banco: um documento Firestore `braga/data` (last-write-wins) espelhando o
  `localStorage` (`braga_data`). Fotos numa coleção separada `braga_fotos`
  (1 doc/foto) + cache local — **fora** do documento principal (limite 1 MB).
- **Chassi** é a chave de deduplicação. `migrateStages()` converte dados do
  pipeline v4 → v5.1 uma única vez (`_schema:51`).
- Passo a passo da nuvem: [`SETUP_NUVEM.md`](SETUP_NUVEM.md). Manual da equipe:
  [`MANUAL_DE_USO.md`](MANUAL_DE_USO.md).

> As planilhas contêm **dados pessoais** de clientes — manter as Regras do
> Firestore restritas (ver `SETUP_NUVEM.md`).

---

## Remetentes autorizados WhatsApp

Adriana · Adriano · Junior Leão · Adriano Junior *(whitelist de quem pode
enviar pedidos; separada dos perfis de acesso, que são por cargo).*

---

## Próximos passos sugeridos

1. **OCR em nuvem (Vision/LLM)** para maior precisão do VIN SERIAL.
2. **Sync por veículo** (um documento por veículo) no lugar do last-write-wins.
3. **Migrar imagens** para o Firebase Storage.
4. **Integração D4 / Andreza** — alinhar fluxo de fatura e acessórios.
5. **Treinar a equipe** — cada pessoa no seu perfil.

---

*Projeto Braga Veículos · Chevrolet · Grupo Econômico Malia · 2026*
