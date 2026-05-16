# Super Skill IA · by Conecta Market Hub — Design System

> Sistema de design original do **Super Skill IA**, produto da **Conecta Market Hub**. Inspirado em convenções amplamente difundidas no segmento *automotive premium* e *industrial tech*. Não reproduz marcas, fontes ou imagens proprietárias de terceiros — apenas adota padrões de hierarquia, contraste e ritmo visuais consagrados na indústria.

**Posicionamento de marca:** o Super Skill IA é apresentado ao cliente final como **solução proprietária da Conecta Market Hub**. A stack técnica que sustenta a camada de visão computacional não é exposta no material apresentável (PPTX, dashboard, propostas) — apenas na documentação técnica interna do repositório, destinada ao time de engenharia.

---

## 1. Brand North Star

> **"Engenharia visível."**
> Tudo o que aparece na tela é resultado de medição em tempo real. Nada é estética sem propósito. A interface tem a sobriedade de um painel de instrumentos de alta performance: escuro, contrastado, técnico.

**Princípios:**

1. **Dado em primeiro lugar.** Tipografia tabular para números. Cores semânticas (verde = saudável, âmbar = atenção, vermelho = ação).
2. **Hierarquia rígida.** Um título por tela. Um KPI dominante por grupo.
3. **Silêncio visual.** Sem decoração. Cada pixel responde a uma pergunta de negócio.
4. **Movimento como sinal.** Animação só quando comunica mudança de estado (pulse no "ao vivo", ramp em métrica que melhora).
5. **Toque automotivo.** Linhas finas, cantos pouco arredondados, paleta carbono, micro-acentos neon — referência visual a HUD de painéis e telemetria de pista.

---

## 2. Sistema de Cores

### 2.1 Carbono (background system)

| Token         | Hex       | Uso                                                  |
| ------------- | --------- | ---------------------------------------------------- |
| `carbon-900`  | `#07090D` | Fundo de slide / página                              |
| `carbon-800`  | `#0D1117` | Cards primários                                      |
| `carbon-700`  | `#141A23` | Cards secundários / hover                            |
| `carbon-600`  | `#1C2430` | Bordas suaves, divisórias                            |

### 2.2 Tinta (ink — texto)

| Token       | Hex       | Uso                                          |
| ----------- | --------- | -------------------------------------------- |
| `ink-100`   | `#E5E7EB` | Texto primário                               |
| `ink-300`   | `#CBD5E1` | Texto secundário                             |
| `ink-400`   | `#9CA3AF` | Labels, descrições                           |
| `ink-500`   | `#6B7280` | Rodapé, timestamps, texto desativado         |

### 2.3 Neon (semânticos)

| Token         | Hex       | Significado                                                  |
| ------------- | --------- | ------------------------------------------------------------ |
| `neon-cyan`   | `#22D3EE` | Marca / acento principal · estado neutro positivo            |
| `neon-green`  | `#34D399` | Sucesso · meta atingida · KPI saudável                       |
| `neon-amber`  | `#FBBF24` | Atenção · fila · espera · em andamento                       |
| `neon-red`    | `#F87171` | Crítico · ação imediata · retrabalho                         |
| `neon-violet` | `#A78BFA` | Diferencial estratégico · benchmark · comparativo            |

### 2.4 Regra de uso

- **Nunca mais que 1 cor neon dominante por tela** — escolha a função (saudável, crítico, comparativo) e mantenha.
- Bordas neon = `1pt` a `1.5pt`. Acima disso vira chamativo de marketing, não painel técnico.
- Texto sobre fundo carbono nunca usa `ink-500` (contraste insuficiente).

### 2.5 Sombreamento de marca (gradient discreto)

```
radial-gradient(circle at top, #0D1117 0%, #07090D 60%, #050608 100%)
```

Usado apenas no `body` de páginas e no fundo dos slides de capa/encerramento — nunca dentro de cards.

---

## 3. Tipografia

### 3.1 Famílias

- **Display & UI:** *Inter* (open source, Google Fonts). Substituto seguro para fontes geométricas proprietárias.
- **Mono / dados tabulares:** *JetBrains Mono* ou *IBM Plex Mono* (open source). Usadas em KPIs numéricos, timestamps e identificadores (placas, IDs de câmera).
- **Fallback nativo:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

> **Não usamos** fontes oem de fabricantes (BMW Type, Chevrolet Sans, Louis Global, etc.) — são licenciadas. *Inter* entrega a mesma legibilidade industrial.

### 3.2 Escala (web)

| Token       | Tamanho | Peso  | Uso                                     |
| ----------- | ------- | ----- | --------------------------------------- |
| `display`   | 56–72px | 700   | Hero, capas, números de página          |
| `h1`        | 32px    | 700   | Título de tela                          |
| `h2`        | 24px    | 600   | Bloco principal                         |
| `h3`        | 18px    | 600   | Card title                              |
| `body`      | 14–16px | 400   | Parágrafos                              |
| `caption`   | 11–12px | 500   | Labels, ALL-CAPS com letter-spacing     |
| `kpi`       | 36–64px | 700   | KPI numérico — sempre tabular           |

### 3.3 Letter-spacing

- ALL-CAPS labels: `0.2em` a `0.3em` (sensação de telemetria/HUD).
- Body: padrão `0`.

---

## 4. Grid & Espaçamento

### 4.1 Grid base

Sistema de 4px. Tudo é múltiplo de 4: padding, margem, gap.

| Escala | px  | Token         |
| -----: | --: | ------------- |
|      1 |   4 | `space-1`     |
|      2 |   8 | `space-2`     |
|      3 |  12 | `space-3`     |
|      4 |  16 | `space-4`     |
|      6 |  24 | `space-6`     |
|      8 |  32 | `space-8`     |
|     12 |  48 | `space-12`    |
|     16 |  64 | `space-16`    |

### 4.2 Layout de slide (16:9, 13.333" × 7.5")

- Margem útil: `0.6"` em todas as bordas.
- Faixa neon de topo: `0.08"` (assinatura visual).
- Header: `eyebrow` ALL-CAPS + `título` em 28pt logo abaixo.
- Footer: nome do projeto à esquerda, paginação à direita, ambos `9pt` em `ink-500`.

### 4.3 Cantos

- Cards: borda arredondada **discreta** (≈ 6–8px / `0.08` no PPTX rounded rect). Cantos muito redondos pesam comercial; queremos painel.
- Pills/badges: `border-radius: 999px` (totalmente redondas só para estado).

---

## 5. Componentes

### 5.1 KPI Card

```
┌─────────────────────────────┐
│ LABEL · UPPERCASE caption   │  ← ink-400, 9pt, tracking 0.2em
│                             │
│   1h 47m                    │  ← kpi 28–36pt, cor semântica
│                             │
│ contexto curto              │  ← ink-500, 9–10pt
└─────────────────────────────┘
   borda 1pt neon semântico
```

### 5.2 Status pill

`fill: cor semântica` · `text: carbon-900 bold` · arredondamento 50%. Comprimento curto: 1 palavra ou 1 número.

### 5.3 Live feed row

| Timestamp | Sujeito (neon-cyan, bold) | verbo (ink-400) | objeto (cor semântica) | placa (ink-100 bold) | local (ink-500) |

### 5.4 Comparative table

Linhas alternam `carbon-800 ↔ carbon-700`. Header `carbon-700` com label em `ink-400 + caps`. Divisórias `carbon-600` em `0.75pt`.

### 5.5 Phase card (roadmap)

Topo: pill com `FASE N` em cor semântica. Meio: número grande do prazo. Base: descrição curta em `ink-400`.

---

## 6. Iconografia & Ilustração

### 6.1 Ícones

- Estilo *outline*, peso 1.5pt, cantos retos.
- Tamanho base 24px (16, 24, 32 como múltiplos).
- Cor única — herda do contexto.

### 6.2 Silhuetas de veículo

> **Política:** o projeto **não usa fotos de veículos das marcas Chevrolet, BMW ou qualquer outra montadora** — são imagens protegidas por direito autoral, marca registrada e direito de imagem. No lugar disso, usamos **silhuetas vetoriais genéricas** ou *line art* automotivo.

**Fontes recomendadas (uso comercial):**

- *The Noun Project* (`car`, `vehicle top view`, `sedan side`) — com atribuição ou plano premium.
- *Streamline Icons* (licença comercial).
- *Unsplash* / *Pexels* (apenas se a foto não destacar a marca/logo do veículo; verificar política de cada plataforma).
- **Geração própria** — composição em PPTX com retângulos arredondados + elipses + linhas finas em `neon-cyan`, estilo *blueprint*.

### 6.3 Cenas de oficina

Usar fotografia *stock* genérica (operários com EPI, oficina iluminada, elevadores) — **sem** logos visíveis de marcas no fundo. Tratamento: filtro azul-frio leve, vinheta sutil, contraste alto.

---

## 7. Motion

- Pulse "ao vivo": opacidade `0.4 → 1 → 0.4` em ciclo de 1.4s. Apenas em status `● AO VIVO`.
- Transições de hover: `150ms ease-out`. Borda muda de `carbon-600` para a cor semântica do card.
- Entrada de evento novo no feed: `translateY(-8px) + fade-in` em `220ms`.
- **Nenhuma animação decorativa.** Movimento sempre comunica.

---

## 8. Diretrizes para a apresentação ao CEO

### 8.1 Estilo de slide

1. **Tom escuro permanente** — capa, miolo, encerramento.
2. **1 ideia por slide.** Se o título demanda dois substantivos, são dois slides.
3. **Hierarquia em 3 níveis:** eyebrow (caps), título (28pt), conteúdo. Nunca mais que 3 níveis tipográficos visíveis.
4. **Sem ícones decorativos** dentro de blocos densos de dado.
5. **Sempre cite a fonte** quando o dado vier do cliente ("Fonte: Relatório Consolidado Braga Veículos").

### 8.2 Padrão de número grande

- KPI dominante no centro do card, cor semântica, peso 700, tabular.
- Logo abaixo: variação ou contexto em 9–10pt, `ink-500`.
- Nunca arredonde mais do que o necessário (ex: `1h 47m`, não "≈ 2h").

### 8.3 Padrão de comparação

Para comparar Ramos Ferreira × Djalma Batista (ou qualquer par): mesma escala, mesmas unidades, cor distinta por unidade (`neon-cyan` vs `neon-violet`). Nunca usar cores semânticas (verde/vermelho) na comparação de unidades — confunde com "uma é boa, outra é ruim".

### 8.4 Posicionamento de marca (regra crítica)

Em **toda peça apresentável ao cliente final** (PPTX, dashboard, proposta comercial, demos, vídeos), o produto é apresentado como **solução proprietária da Conecta Market Hub**. Não citar nominalmente fornecedores que compõem a stack interna.

- Header / capa: `Super Skill IA`
- Assinatura: `by Conecta Market Hub`
- Rodapé: `SUPER SKILL IA · BY CONECTA MARKET HUB · PROPOSTA [CLIENTE] · CONFIDENCIAL`

---

## 9. Nomenclatura White-Label

O produto é apresentado em **duas camadas modulares** sob a marca única Conecta Market Hub. Use estes termos exatos em todo material apresentável:

| Camada                                | Termo público (PPTX, dashboard, cliente)    | Cor de marca   |
| ------------------------------------- | ------------------------------------------- | -------------- |
| Captura RTSP + inferência on-premise  | **Motor de Visão Computacional**            | `ink-100`      |
| Lógica de negócio + KPIs + dashboard  | **Inteligência de Negócio** (`Super Skill IA`) | `neon-cyan` |
| Mensageria entre camadas              | **Barramento de Eventos**                   | `neon-amber`   |
| Tópicos do barramento (exemplo)       | `vision/<cliente>/<unidade>/operacionais`   | —              |

### 9.1 Dicionário Interno → Público

Use a coluna da direita em qualquer artefato que sai para o cliente. A coluna da esquerda só aparece no repositório técnico (arquitetura, código, docker-compose), nunca em material apresentável.

| Termo interno (repo)               | Termo público (apresentação)                |
| ---------------------------------- | ------------------------------------------- |
| Nome comercial do fornecedor de CV | **Motor de Visão Computacional**            |
| MQTT broker / Mosquitto            | **Barramento de Eventos**                   |
| Tópico `weg/...`                   | Tópico `vision/...`                         |
| MQTT Bridge                        | **Bridge Semântica**                        |
| "stack do fornecedor X"            | "stack industrial consolidada"              |
| "integração com fornecedor"        | "arquitetura modular Conecta Market Hub"    |
| Modelo YOLOv8 / Pose Estimation    | "motor de detecção proprietário"            |

### 9.2 Status indicadores

- **Em material público:** `● IA ATIVA` (sem citar provedor)
- **Em logs internos / dev:** identificadores reais permitidos

### 9.3 Slides nominais (na PPTX v4)

| Slide | Termo correto                                                |
| ----- | ------------------------------------------------------------ |
| Capa  | "Super Skill IA" · subtítulo "solução Conecta Market Hub"    |
| 4     | "Nossa solução proprietária: visão computacional + inteligência de negócio" |
| 5     | "Arquitetura Modular · As duas camadas da solução Conecta Market Hub" |
| 6     | "Motor de Visão Computacional · Inferência On-Premise"       |
| 8     | "Motor de visão detecta entrada e identifica..."             |
| 13    | "Stack industrial consolidada"                               |
| 14    | "Super Skill IA · by Conecta Market Hub"                     |

---

## 10. Política de uso de marcas e imagens de terceiros

O Super Skill IA é **vendor-agnóstico por arquitetura**, mas **vendor-invisível por posicionamento**: a marca aparente é sempre Conecta Market Hub. Mesmo quando integramos com qualquer fornecedor de visão computacional ou de hardware:

| Permitido (apenas em docs técnicas internas)                            | Proibido em qualquer material apresentável                            |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Citar nome do fornecedor em arquitetura técnica do repo                 | Citar nome do fornecedor de visão em PPTX, dashboard ou proposta        |
| Descrever protocolo (MQTT, RTSP, REST) em comentários de código         | Reproduzir o logotipo oficial de qualquer fornecedor                    |
| Capturas de tela do **nosso** dashboard (assinado Conecta Market Hub)   | Capturas de tela de produtos de fornecedores ou concorrentes            |
| Silhuetas vetoriais genéricas de veículos (blueprint, line art)         | Fotos de modelos específicos de Chevrolet, BMW, etc. com marca visível  |
| Padrões de cor e tipografia inspirados em convenções de gênero           | Reprodução literal de fontes proprietárias (BMW Type, Chevrolet Sans…)  |

Quando precisar de imagem real de carro para o cliente Braga Veículos, **use fotos do próprio frota/pátio dele** (após autorização por escrito), não da Chevrolet ou BMW. Isso reforça a personalização e elimina o risco jurídico.

---

## 11. Referências para estudo (não cópia)

Padrões observáveis publicamente que **inspiraram** este sistema (sem cópia literal):

- Painéis HUD de telemetria automotiva (cantos retos, paleta carbono + acento neon).
- Convenções de documentação de plataformas industriais de visão computacional (densidade informacional, KPIs em destaque, layout multi-coluna).
- Convenções tipográficas de *automotive premium digital* (capitalização ampla, tracking pronunciado em labels).
- Princípios de Material Design e IBM Carbon Design System (open source, livres para inspirar).

Tudo o que está acima é **estilo de gênero** — não propriedade de uma marca específica.

---

## 12. Changelog

- **v1.1 — White-label Conecta Market Hub.** Adição das seções 8.4 (posicionamento de marca), 9 (nomenclatura white-label com dicionário interno → público) e atualização da seção 10 (política de marcas com regra de vendor-invisível por posicionamento). Aplicado na PPTX `Super_Skill_IA_Braga_v4_ConectaMH.pptx`.
- **v1.0 — Sistema inicial.** Paleta carbono+neon, tipografia Inter/JetBrains Mono, grid 4px, componentes, motion, política de marcas.
