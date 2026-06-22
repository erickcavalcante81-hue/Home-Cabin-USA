# Análise do padrão de informação — documentos que dão *start* ao fluxo

Análise dos documentos reais da pasta do Drive
`BRAGA_VEICULOS_Projeto_Completo` (enviados por Adriano em 22/06/2026) que
disparam e alimentam o fluxo operacional de preparação e entrega.

Amostra analisada (representativa): `PLANILHA DE ENTREGA - 23_06.pdf` e
`- 20_06.pdf`; `PENDENTE DE ENTREGA.xlsx`; `PREPARAÇÃO DIA 19.xlsx`;
`download (12).pdf` (proposta do DMS); `PEDIDO_TESTE_Tracker_JoaoSilva.pdf`.
As demais `PLANILHA DE ENTREGA - DD_06.pdf` seguem o mesmo template diário.

---

## 1. Tipos de documento e onde entram no fluxo

| Tipo | Documento | O que é | Etapa do fluxograma que dispara |
|------|-----------|---------|---------------------------------|
| **A** | `PLANILHA DE ENTREGA - DD_06.pdf` (1/dia) | Agenda diária de entregas: por horário, com cliente, veículo, acessórios e **entregador** | **2–3** (Confirmação de Data → Lista de Entrega) e dispara **4** (Lavagem) |
| **B** | `PREPARAÇÃO DIA 19.xlsx`, `PENDENTE DE ENTREGA.xlsx` | Fila de preparação, agrupada por data (`VEICULOS EM PREPARAÇÃO DD/06`) | **0–1** (entrada no pipeline / acessórios) |
| **C** | `download (12).pdf` | Proposta/Pedido do **DMS da concessionária** (3 págs: cliente, veículo, pagamento, acessórios, contrato) | Origem da venda → cria o registro do veículo |
| **D** | `PEDIDO_TESTE_Tracker_JoaoSilva.pdf` | Pedido **sintético** (modelo idealizado que o app tenta parsear hoje) | — (não corresponde a um doc real) |

> **Fluxo real:** Venda (C, proposta DMS) → entra na fila de **Preparação**
> (B) → quando pronto, vai para a **Planilha de Entrega** diária (A), que
> define horário + entregador e dispara a lavagem → entrega.

---

## 2. Dicionário de dados

### Tipo A — PLANILHA DE ENTREGA (agenda diária)
Cabeçalho: `DD/MM DIA-DA-SEMANA` (ex.: `23/06 TERÇA`). Colunas:

```
HORÁRIO | CLIENTE | MODELO | CHASSI | COR | VENDEDOR | ACESSÓRIOS | PLACA | ENTREGADOR
```

Exemplo de linha (23/06):

```
09:00:00 | RICARDO XAVIER DE SOUZA | S10 HIGH COUNTRY PDJ CD |
9BG148PK0TC447981 | BRANCO SUMMIT | DIRETORIA | TAPETE | (vazio) | THAIS
```

- Agrupado por **faixas de horário** (09:00, 10:00, 11:00, 14:00, 15:00,
  16:00) — várias entregas por faixa. Sem 12–13h (almoço); janela 09–17h.
- `PLACA` quase sempre **vazia** (definida só na etapa Qualidade+Placa).
- `ENTREGADOR` recorrente: **THAIS, GABRIEL, LUCAS** (técnicos de entrega).
- Pedidos de frota: `A C B LOCADORA DE VEICULOS LTDA` aparece com 5 S10 no
  mesmo horário (corresponde ao `ACB LOCADORA.docx`).

### Tipo B — PREPARAÇÃO / PENDENTE (fila de preparação)
Blocos `VEICULOS EM PREPARAÇÃO DD/06`. Colunas:

```
FATURAMENTO(data) | CLIENTE | MODELO | CHASSI | COR | VENDEDOR | ENTREGADOR | ACESSORIOS | STATUS | PENDENTE
```

Mesmos campos centrais da Planilha + **data de faturamento** e **status**.

### Tipo C — Proposta do DMS (`download (12).pdf`)
Documento oficial do sistema (BRAGA VEICULOS MATRIZ, Proposta nº 3074).
Campos ricos: cliente (cód, CPF/CNPJ, telefone, e-mail), veículo (marca,
modelo `S10 HIGH COUNTRY CD PDB`, **chassi** `9BG148PK0TC448285`, cor, ano,
combustível, **opcionais** `PDB/R7U/UE1`), valores e formas de pagamento,
**acessórios com valor** (KIT INSULFIM, PISO VERNILON, POLIMENTO, etc.),
cláusulas contratuais.

---

## 3. Esquema canônico (registro único por veículo)

**CHASSI é a chave universal** — aparece em **todos** os documentos e é o que
permite casar/deduplicar a mesma unidade entre proposta → preparação →
entrega. Formato VIN de 17 caracteres, prefixos `9BG…`, `8AG…`, `906…`.

```jsonc
{
  "chassi":       "9BG148PK0TC447981",   // CHAVE
  "cliente":      "RICARDO XAVIER DE SOUZA",
  "modelo":       "S10 HIGH COUNTRY CD",
  "versao":       "PDJ",                  // código de opcional/pacote
  "cor":          "BRANCO SUMMIT",
  "vendedor":     "DIRETORIA",
  "acessorios":   ["TAPETE"],
  "entregador":   "THAIS",                // técnico de entrega
  "dataFaturamento": "2026-05-31",
  "dataEntrega":  "2026-06-23",
  "horarioEntrega": "09:00",
  "placa":        "",                     // preenchida na etapa 5
  "status":       "preparacao|agendado|entregue",
  "nfFatura":     "FT-9042"               // quando disponível (tipo C/D)
}
```

---

## 4. Regras de parsing observadas

- **CHASSI:** 17 caracteres alfanuméricos (sem I/O/Q). Regex prática:
  `\b[0-9A-HJ-NPR-Z]{17}\b`, normalmente iniciando em `9BG`, `8AG` ou `906`.
- **COR:** 2–3 palavras de uma paleta conhecida — BRANCO SUMMIT, PRATA SHARK,
  VERMELHO SCARLET, PRETO OURO NEGRO, AZUL BOREAL, CINZA TOPAZIO/MOSS/URBANO/
  REDENTOR, BRANCO CUPUACU. (No texto cru, cor e vendedor às vezes se colam.)
- **MODELO:** prefixo de modelo conhecido (S10 HIGH COUNTRY, ONIX [PLUS], NV
  TRACKER / TRACKER, MONTANA, SPARK EUV ACTIV, SONIC, EQUINOX, BLAZER) +
  **código de versão** (PDB, PDJ, R7U, R7R, R7J, R8E, R8A, RFE, RGE, PEB, NB).
- **ACESSÓRIOS:** texto separado por vírgula. Vocabulário recorrente:
  INSULFILM, TAPETE(S), PROTETOR DE CARTER, PROTETOR DE CAÇAMBA, KIT BRAGA,
  PISO VERNILON, SENSOR DE ESTACIONAMENTO/RÉ, CÂMERA DE RÉ, FRISO, SOLEIRA,
  ESTRIBO LATERAL/INTEGRADO, LETREIRO CROMADO, "N LITROS DE COMBUSTÍVEL",
  FILTRO DE AR, BANCO DE COURO, PONTEIRA DE ESCAPAMENTO, CAMISA CHEVROLET.
  ⚠️ **Muitos erros de digitação** — INSULFIM / INSULFIILM, TAPPETE / TAPETEE,
  PROTETORR, AMPRTECEDOR. O parser precisa **normalizar** (dicionário de
  sinônimos/fuzzy), não casar texto exato.
- **ENTREGADOR:** conjunto pequeno (THAIS, GABRIEL, LUCAS, …).
- **HORÁRIO:** `HH:MM:SS`, faixas de 09 a 17h (sem 12–13h).

---

## 5. Gaps em relação ao app atual

1. **Falta o campo `chassi`** no modelo de dados do app (hoje o veículo tem
   `model/client/color/plate/invoice/seller/stage/accessories`). Como o chassi
   é a chave real, ele deve ser adicionado e usado para deduplicação.
2. **A "Entrada" é mono-veículo.** O app foi feito para parsear **um** pedido
   (tipo D, idealizado). O *start* real é uma **planilha diária com várias
   linhas** (tipo A) e as **planilhas de preparação** (tipo B) → falta um
   **importador em lote** (uma planilha → vários veículos).
3. **Faltam campos operacionais:** `entregador` (técnico de entrega → etapa 6)
   e `horarioEntrega` (faixa da agenda diária).
4. **Acessórios:** precisa de vocabulário controlado + normalização de typos.
5. **Vendedor "DIRETORIA"** marca vendas internas/frota (ex.: ACB Locadora).

---

## 6. Recomendações / próximos passos

1. **Adicionar `chassi` (chave), `entregador` e `horarioEntrega`** ao modelo
   de veículo do app.
2. **Construir um importador de "PLANILHA DE ENTREGA"** (cola o texto / sobe o
   PDF → extrai N linhas → cria/atualiza veículos por chassi). Mesma lógica
   serve para as planilhas de preparação (tipo B).
3. **Dicionário de normalização** de modelos, cores e acessórios (corrige
   typos e padroniza).
4. (Opcional) **Parser da proposta do DMS** (tipo C) para criar o registro já
   na venda, com cliente/telefone/e-mail e acessórios cobrados.

> Observação de dados: as planilhas contêm **dados pessoais de clientes**
> (nomes, e telefones/e-mail nas propostas). Ao subir para a nuvem, manter as
> Regras do Firestore restritas (ver `SETUP_NUVEM.md`).
