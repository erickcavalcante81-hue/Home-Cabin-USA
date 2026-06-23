# Braga Veículos — Gestão de Entregas

Sistema de gestão de preparação e entrega de veículos zero km da **Braga
Veículos** (concessionária Chevrolet). App mobile-first em dark mode, com
pipeline de 8 etapas, 5 perfis de usuário, módulo de entrada de pedidos
(WhatsApp / e-mail / PDF / imagem), checklists por etapa, registro de
defeitos e dashboard gerencial.

> **Origem:** este diretório foi integrado a partir da pasta do Google Drive
> [`BRAGA_VEICULOS_Projeto_Completo`](https://drive.google.com/drive/folders/1fgHxd_fKNutviOia5pn4rs8gZepcNxWT)
> (conta `erick.cavalcante81@gmail.com`) para iniciarmos o desenvolvimento
> versionado do app.

---

## Estrutura

```
braga-veiculos/
├── app/                                 ← App publicável (PWA)
│   ├── index.html                       ← App principal (era BRAGA_Gestao_Entregas.html)
│   ├── manifest.webmanifest             ← PWA: instalável no celular
│   ├── sw.js                            ← Service worker: funciona offline
│   ├── cloud-sync.js                    ← Sincronização em tempo real (Firebase)
│   ├── firebase-config.js               ← Chaves do Firebase (vazio = sync desligado)
│   └── icons/                           ← Ícones do app (192/512/apple)
└── docs/
    ├── MANUAL_DE_USO.md                 ← ★ Manual de uso (todos os perfis)
    ├── SETUP_NUVEM.md                   ← ★ Guia: pôr online + sincronizar
    ├── RESUMO_PROJETO_BRAGA_VEICULOS.md ← Resumo completo do projeto
    ├── CONTEXTO_PARA_NOVA_CONTA_COWORK.md
    ├── FLUXOGRAMA_Preparacao_Entrega_v4.pdf
    ├── GESTAO_DE_CRISE_Braga_Veiculos.pdf
    ├── PLANO_DE_ACAO_2026_Braga_Veiculos.pdf
    └── samples/
        └── PEDIDO_TESTE_Tracker_JoaoSilva.pdf  ← PDF para testar o módulo Entrada
```

## Como rodar agora

O app não tem build nem dependências de instalação — sirva a pasta `app/`
(o service worker e o manifest precisam de `http://`, não `file://`):

```bash
cd braga-veiculos/app
python3 -m http.server 8000
# desktop:  http://localhost:8000
# celular:  http://<ip-do-computador>:8000   (mesma rede Wi-Fi)
```

No celular, use **Adicionar à Tela de Início** (iOS) / **Instalar app**
(Android) para instalar como PWA. Para colocar online com link fixo e dados
sincronizados entre aparelhos, siga **[`docs/SETUP_NUVEM.md`](docs/SETUP_NUVEM.md)**.

## Pipeline operacional (Fluxograma v4)

| # | Etapa                  | Responsável   | Observação                         |
|---|------------------------|---------------|------------------------------------|
| 0 | Localização Chassi     | Equipe Pátio  | Foto do chassi obrigatória         |
| 1 | Acessórios / Películas | Inst. Acessórios | Só se houver acessório a instalar |
| 2 | Confirmação de Data    | Co-Programador | Aciona a Lista de Entrega          |
| 3 | Lista de Entrega       | Co-Programador | Gatilho que ativa a lavagem        |
| 4 | Lavagem e Acabamento   | Lavador/Tapete | Lavagem + tapete de fábrica        |
| 5 | Qualidade + Placa      | Responsável   | Foto da placa obrigatória          |
| 6 | Entregador Técnico     | Braga         | Fotos: chassi + placa instalada    |
| 7 | Concluído              | —             | Registrado no app                  |

**Perfis de acesso:** Gerente (dashboard) · Programador · Co-Programador ·
Preparador · Instalação de Acessórios · Lavador / Tapete.

**Remetentes WhatsApp autorizados:** Adriana · Adriano · Junior Leão ·
Adriano Junior.

## Modelo de dados e sincronização

O app trabalha sobre o `localStorage` do navegador, na chave **`braga_data`**:

```js
{ vehicles: [], defects: [], intakes: [], nextId: 1 }
```

Cada veículo é identificado pelo **`chassi`** (chave de deduplicação) e tem
`model/versao/client/color/seller/accessories[]/stage` + os campos
operacionais `entregador` e `horarioEntrega`. Toda a persistência passa por
duas funções isoladas — `getStorage()` e `setStorage()` (em `app/index.html`).

**Importação em lote (Entrada → "Planilha de Entrega"):** dá para **subir o
PDF** da planilha (extração automática via PDF.js, sem copiar/colar) **ou**
colar o texto. O app extrai todos os veículos — âncora no chassi, normaliza
cor/acessórios (corrige typos) e detecta horário/entregador — e **aplica
automaticamente, sem seleção/confirmação**:

- **Novos** → cadastrados direto.
- **Existentes (mesmo chassi) com mudança** → **sobrescritos pela última
  versão** e marcados com a tag **🔔 Alterado** (some ao abrir o veículo). A
  etapa/checklists/fotos são preservados; o histórico registra o que mudou.
- **Idênticos** → ignorados (não duplica).

Ao final mostra um **resumo** (novos · atualizados · sem mudança).

- Leitura do PDF: `loadPdfJs()` (CDN, precisa de internet na 1ª vez) +
  `reconstructPdfRows()` reconstrói as linhas da tabela ancorando no chassi
  (agrupa por Y, ordena por X) → texto limpo em ordem de coluna.
- Parsing/gravação: `parsePlanilha()` / `applyPlanilhaRows()` (com `OVERWRITE_FIELDS`).

Validado contra os PDFs reais das planilhas (ex.: 23/06 → 18/18 veículos).
Padrão dos documentos em
[`docs/ANALISE_PEDIDOS_E_PLANILHAS.md`](docs/ANALISE_PEDIDOS_E_PLANILHAS.md).

**Sincronização em nuvem (offline-first):** quando `firebase-config.js` tem
chaves válidas, `cloud-sync.js` espelha o `braga_data` num documento do
Firestore (`braga/data`) e mantém todos os aparelhos em tempo real via
`onSnapshot` — o `localStorage` segue como cache local, então o app funciona
sem internet e sincroniza ao reconectar. **Sem chaves, a sincronização fica
desligada e o app roda 100% local, como antes.** Passo a passo para ligar:
[`docs/SETUP_NUVEM.md`](docs/SETUP_NUVEM.md).

> Conflito (v1): o banco inteiro é um documento; vale a última escrita
> (*last-write-wins*). Evolução natural: um documento por veículo.

## Roadmap / próximos passos

1. **Hospedar online + sincronizar dados** — ✅ *base pronta:* o app já é PWA
   (instalável/offline) e tem a camada de sync Firestore embutida. **Falta:**
   criar o projeto Firebase, colar as chaves e publicar no Netlify — guia em
   [`docs/SETUP_NUVEM.md`](docs/SETUP_NUVEM.md).
2. **Importar a frota / programação** — ✅ *pronto:* importador em lote de
   PLANILHA DE ENTREGA / preparação no módulo Entrada (dedup por chassi),
   por **upload de PDF** (extração automática) ou colando o texto.
3. **Fotos da vistoria (pátio)** — ✅ *pronto:* aba **📷 Fotos** no detalhe do
   veículo captura chassi/avaria/placa pela **câmera** (comprime no celular).
   As imagens ficam numa coleção separada do Firestore (`braga_fotos`, 1 doc
   por foto) + cache local — **fora** do documento principal (limite 1 MB);
   o veículo guarda só os metadados. Requer a regra `braga_fotos` (ver
   `docs/SETUP_NUVEM.md`). Evolução possível: migrar p/ Firebase Storage.
4. **Sync por veículo** — trocar o last-write-wins por um documento por
   veículo (edição simultânea sem risco de sobrescrita).
5. **Treinar a equipe** — cada pessoa com seu perfil.
6. **Integração D4 / Andreza** — alinhar fluxo de fatura e acessórios.

Documentos de referência completos em [`docs/`](docs/) — em especial o
**[Manual de Uso](docs/MANUAL_DE_USO.md)** (para a equipe) e o
[`RESUMO_PROJETO_BRAGA_VEICULOS.md`](docs/RESUMO_PROJETO_BRAGA_VEICULOS.md).

---

*Projeto Braga Veículos · Chevrolet · Grupo Econômico Malia*
