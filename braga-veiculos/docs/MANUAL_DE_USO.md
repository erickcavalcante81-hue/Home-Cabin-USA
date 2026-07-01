# Manual de Uso — App Braga Veículos (Gestão de Entregas)

**Acesse em:** https://entrega-braga.netlify.app
**Funciona em:** celular e computador (navegador). Dá para instalar como app.

Este manual explica o app (alinhado ao **Fluxograma v5.1**) para **todos os
perfis**: Gerente, Torre de Controle, Programador, Co-Programador, Colaborador
de Pátio, Instalação de Acessórios, Lavador / Tapete, Equipe Técnica e
Entregador Técnico.

---

## 1. Primeiros passos (todos)

### Abrir e instalar como app no celular
1. Abra **https://entrega-braga.netlify.app** no navegador.
2. **iPhone (Safari):** botão **Compartilhar** → **Adicionar à Tela de Início**.
   **Android (Chrome):** menu **⋮** → **Instalar app**.
3. Vira um ícone como qualquer app, abre em tela cheia e funciona até **sem internet** (sincroniza quando a conexão volta).

### Entrar (escolher o perfil)
Na tela inicial, toque no seu perfil: **Gerente**, **Torre de Controle**,
**Programador**, **Co-Programador**, **Colaborador de Pátio**, **Instalação de
Acessórios**, **Lavador / Tapete**, **Equipe Técnica** ou **Entregador
Técnico**. Para trocar de perfil, toque no cargo no canto superior direito.
*(Os perfis são por **cargo** — sem nomes pessoais.)*

### O chip de sincronização (canto superior direito)
Mostra se os dados estão na nuvem (sincronizados entre todos os aparelhos):

| Chip | Significa |
|------|-----------|
| 🟢 **Nuvem** | Sincronizado em tempo real com toda a equipe |
| 🟡 **…** | Conectando |
| 🔴 **Offline** | Sem internet no momento (continua salvando local e sobe depois) |
| ☁️ **Local** | Sincronização desligada (só neste aparelho) |

> Importante: o que **um** cadastra/atualiza aparece **para todos** em segundos.

---

## 2. As 5 abas (barra de baixo)

| Aba | Para quê |
|-----|----------|
| 📊 **Dashboard** | Visão geral: números do dia, semáforo e pipeline por etapa |
| 🚗 **Veículos** | Lista de todos os veículos, busca e filtro por etapa |
| ✅ **Checklist** | Marcar item a item o que foi feito em cada etapa |
| 📥 **Entrada** | Cadastrar pedidos e **importar planilhas** (lote) |
| ⚠️ **Defeitos** | Registrar e acompanhar avarias/defeitos |

*Todos os perfis enxergam todas as abas — cada um foca nas suas tarefas
(abaixo). O botão **+** (cadastrar veículo) aparece só para Gerente, Torre de
Controle, Programador e Co-Programador.*

---

## 3. O fluxo de 5 etapas (v5.1)

Todo veículo percorre estas etapas (a barrinha de progresso mostra onde está):

| # | Etapa | Quem faz | Atenção |
|---|-------|----------|---------|
| 0 | 🔧 Preparação no Estoque | Colaborador de Pátio | 📸 Foto do **VIN SERIAL** (adesivo GM) **conferida (OCR × grade)** p/ liberar; acessórios/películas; lavagem + tapete; avaria → foto + avisar |
| 1 | 📄 Pré-Entrega | Programador | Validação, liberação financeira, documentos e **agendamento** (48 h antes) |
| 2 | 🏁 Conferência Final | Equipe Técnica | Confere etapas anteriores; **placa** instalada; 📸 foto da placa |
| 3 | 🚗 Entrega ao Cliente | Entregador Técnico | Conferência com o cliente; 📸 VIN SERIAL + placa; **Planilha 4** |
| 4 | ✅ Entregue | — | Encerrado no app |

**Fora do fluxo linear:**
- **⚡ Via Rápida (Frota/Locadora):** veículos sem acessório — só **lavagem +
  tapete**, com **prioridade**. Botão no detalhe do veículo (marca/desmarca).
- **🔁 Reagendamento:** se o cliente **não compareceu**, o veículo **volta para
  Pré-Entrega** e o app pede a nova data (registra o motivo no histórico).

---

## 4. Manual por perfil

### 📊 Gerente
Seu foco é **acompanhar**, não operar.
- Abra a aba **Dashboard**: veja **quantos** veículos estão em preparação, as
  **entregas do dia**, o **semáforo** (verde/amarelo/vermelho por tempo) e
  **quantos** estão em cada etapa do pipeline.
- Aba **Veículos** para procurar um caso específico (busca por cliente/modelo/
  chassi) e abrir os detalhes.
- Aba **Defeitos** para ver pendências de qualidade.
- Você também pode cadastrar veículos (botão **+**), se precisar.

### 🗼 Torre de Controle
Você é o **ponto central de comunicação e atribuição** — monitora todo o fluxo.
- Aba **Dashboard** para a visão geral e **Veículos** para acompanhar caso a caso.
- Garante que a **comunicação obrigatória** aconteça a cada conclusão de etapa
  (equipe, vendedor, gerência) e que cada veículo tenha responsável.
- Pode cadastrar veículos e importar planilhas (botão **+** / aba **Entrada**).

### 📋 Programador (coração da operação)
Você organiza o pipeline e cuida da **Pré-Entrega**.
- **Cadastrar veículos:** botão **+** (um a um) **ou** aba **Entrada** para
  importar uma **planilha inteira** de uma vez (ver seção 5).
- **Acompanhar o pipeline:** aba **Veículos** → abra um veículo → aba **Info**.
- **Agendar a entrega:** no detalhe do veículo, campo **"Agendar Data de
  Entrega"** → escolha a data → **Salvar** (etapa **Pré-Entrega**, 48 h antes).
- **Avançar as etapas:** conforme a equipe conclui cada fase, abra o veículo e
  toque em **"✓ Concluir: <etapa> → <próxima>"** (ver seção 6).

### 👨‍💼 Co-Programador
Você recebe os pedidos (geralmente do Programador, por WhatsApp) e alimenta o app.
- Aba **Entrada**: quando logado como **Co-Programador**, aparece o atalho
  verde **"Recebi mensagem do Programador"** — toque, escolha o remetente
  autorizado, cole o texto e confirme.
- Você também importa **planilhas** (PDF) e cadastra veículos (botão **+**).
- Apoia o Programador na **Pré-Entrega**: confirma data/horário com o cliente e
  mantém as listas atualizadas.

### 🔧 Colaborador de Pátio
Você **busca o veículo no estoque** e faz a **Preparação** (etapa 0).
1. Aba **Veículos** → abra o veículo (use a **busca** por chassi/cliente).
2. Aba **📷 Fotos** → tire a foto do **VIN SERIAL** (adesivo GM no para-brisa):
   o app **lê e confere com a grade** — só assim a preparação é **liberada**
   (ver seção 11). Avaria? Registre **uma foto por avaria** e avise a equipe.
3. Aba **Checklist** → marque a preparação item a item (acessórios, películas,
   lavagem, tapete, conferência) conforme avança.
4. **⚡ Via Rápida?** Se for frota/locadora (sem acessório), marque o botão
   **Via Rápida** no detalhe — o foco vira **lavagem + tapete** com prioridade.
5. Achou um problema no carro? Registre em **Defeitos** (ver seção 9).

### 🛠️ Instalação de Acessórios
Para veículos **com** acessórios/películas (dentro da **Preparação**).
1. Aba **Veículos** → abra o veículo → aba **Acessórios**.
2. Toque na **bolinha** ao lado de cada acessório quando instalar — vira ✅ e
   grava a data automaticamente.
3. Faltou um acessório na lista? Toque em **"+ Adicionar"** e digite o nome.
4. Com tudo instalado e conferido, o veículo segue na preparação.

### ✨ Lavador / Tapete
Para a **lavagem e acabamento** — inclui os veículos que **não têm acessório**
(⚡ Via Rápida): são apenas lavados e entregues com o **tapete de fábrica**.
1. Aba **Checklist** → escolha o veículo na **Preparação**.
2. **Toque em cada item** da lavagem conforme faz, incluindo o **tapete de
   fábrica**.
3. Concluída a preparação, o veículo segue para a **Pré-Entrega**.
> Veículo **Via Rápida** não tem acessório a instalar — o foco é a sua etapa:
> lavar, colocar o tapete e encaminhar (com prioridade).

### 🏁 Equipe Técnica
Você faz a **Conferência Final** (etapa 2).
1. Aba **Veículos** → abra o veículo na **Conferência Final**.
2. Aba **Checklist** → confira **todas as etapas anteriores**, acessórios,
   películas e lavagem.
3. Confirme a **placa instalada** e registre a **📸 foto da placa** (aba Fotos).
4. Validado, avance para **Entrega ao Cliente**.

### 🚗 Entregador Técnico
Você faz a **Entrega ao Cliente** (etapa 3).
1. Acione o cliente e faça a **conferência final** junto com ele.
2. Aba **📷 Fotos** → registre o **VIN SERIAL + placa** (registro final).
3. Colha o aceite/assinatura e **atualize a Planilha 4 (Entregues)**.
4. Avance para **Entregue** — o veículo é encerrado no app.

---

## 5. Importar as 4 planilhas de programação (lote — v5.1)

Para Gerente/Torre/Programador/Co-Programador. Cadastra a planilha inteira em
segundos — **de forma automática, sem precisar selecionar ou confirmar veículo
por veículo**.

1. Aba **Entrada** → **"+ Nova Entrada"**.
2. Escolha a origem **"📋 Planilhas de programação (lote)"**.
3. **Escolha qual planilha** (a regra muda conforme o tipo):
   - **1 · 🔧 Preparação** — cadastra novos na **Preparação** e atualiza os existentes.
   - **2 · 🚗 Entrega (agendar)** — define **data/horário/entregador** e leva o
     veículo para a **Pré-Entrega**.
   - **3 · 🔁 Reagendamento** — marca **🔁 Reagendado** e volta para a Pré-Entrega.
   - **4 · ✅ Entregues** — marca os veículos como **✅ Entregue**.
4. **Opção A — PDF:** em **"Ler direto de um PDF"**, toque e escolha o arquivo.
   O app lê tudo sozinho. **Opção B — Colar:** cole o texto no campo de baixo.
5. O app **aplica tudo automaticamente** e mostra um **resumo** (com o tipo da
   planilha):
   - **✅ Novos** — cadastrados direto.
   - **🔔 Atualizados** — já existiam (mesmo chassi) e mudaram. O app **substitui
     pela versão mais recente** e marca com **🔔 Alterado** na lista. A tag
     **some quando alguém abre** o veículo.
   - **= Sem mudança** — já estavam idênticos (nada a fazer).

> O **chassi** é o identificador: reimportar a mesma planilha **não duplica**.
> Checklists e fotos são **preservados**; só os dados da planilha (cliente, cor,
> vendedor, entregador, horário, data, acessórios) e a **etapa/estado** conforme
> o tipo são atualizados, e o histórico registra o que mudou.

---

## 5b. Torre de Controle, comunicação e responsável

- **🗼 Torre de Controle (Dashboard):** no topo do Dashboard, o painel de
  **pendências** — chassi/VIN SERIAL não conferido, **comunicação pendente**,
  **sem responsável**, Pré-Entrega sem data e atrasados. Toque numa pendência
  para expandir e vá direto ao veículo.
- **📲 Comunicar (obrigatório a cada etapa):** ao concluir uma etapa, o veículo
  fica com **📲 Comunicar** e o botão aparece em destaque no detalhe. Toque para
  o app **montar a mensagem** (veículo, chassi, etapa, responsável, entrega) e
  **compartilhar/copiar** no WhatsApp — Equipe · Vendedor · Gerência · Torre. Ao
  enviar, a pendência é resolvida e fica registrada no histórico.
- **👤 Responsável:** no detalhe do veículo, informe **quem está responsável**
  pela etapa atual e toque em **Salvar**. Aparece no card e na Torre; a cada
  avanço de etapa o responsável é **zerado** para ser reatribuído.

---

## 6. Avançar (ou voltar) uma etapa

1. Abra o veículo (aba **Veículos** → toque no card) → aba **Info**.
2. Role até embaixo:
   - **"✓ Concluir: <etapa atual> → <próxima>"** avança para a próxima etapa.
   - **"‹ Voltar: <etapa anterior>"** volta uma etapa (se errou).
   - **"⚡ Marcar Via Rápida"** (frota/locadora): só lavagem + tapete, prioridade.
   - **"🔁 Reagendamento"** (a partir da Pré-Entrega): cliente não compareceu →
     o veículo volta para a Pré-Entrega e o app pede a nova data.
3. A linha do tempo mostra o que já foi concluído e o que está em andamento.
4. Na **etapa 0 (Preparação)** o avanço só aparece com o **VIN SERIAL conferido**
   (ver seção 11).
5. Ao concluir a última etapa, aparece **"🎉 Entregue!"**.

---

## 7. Cadastrar UM veículo manualmente

Para Gerente/Torre/Programador/Co-Programador.
1. Toque no botão **+** (canto inferior direito).
2. Preencha: modelo, cor, placa/chassi, nº fatura, cliente, celular, data da
   fatura, consultor e observações.
3. **Salvar** — ele entra na etapa 0 (**Preparação no Estoque**).

---

## 8. Registrar um pedido (WhatsApp / e-mail / PDF / imagem)

1. Aba **Entrada** → **"+ Nova Entrada"** → escolha a origem.
2. **WhatsApp:** selecione o **remetente autorizado** (Adriana, Adriano,
   Junior Leão ou Adriano Junior) — pedidos de outras pessoas são bloqueados.
3. Cole o texto (ou suba o PDF/imagem e transcreva os dados).
4. Toque em **"Processar e Extrair Dados"** → o app preenche o cadastro.
5. **Revise** os campos e toque em **"Cadastrar Veículo"**.

---

## 9. Registrar um defeito / avaria

1. Aba **Defeitos** → **"+ Registrar Defeito"**.
2. Escolha o **veículo**, o **tipo** (riscos, amassado, etc.), o **local**, a
   **gravidade** e descreva o problema.
3. **Salvar**. O defeito fica listado até alguém marcar como **resolvido**.

---

## 10. Perguntas frequentes

**Sumiu/ não aparece nada ao entrar?**
Com a nuvem ligada, o app começa **vazio** (sem dados de exemplo). Importe uma
planilha ou cadastre um veículo — aí enche para todos.

**Outro aparelho não atualizou?**
Confira o chip: precisa estar **🟢**. Se estiver 🔴, é falta de internet —
quando voltar, sincroniza sozinho.

**Funciona sem internet?**
Sim. Você continua usando; as mudanças sobem para a nuvem quando reconectar.

**O que é a tag 🔔 Alterado na lista?**
Quando uma nova planilha é importada e um veículo que já existia teve mudança,
o app atualiza sozinho e marca com **🔔 Alterado** para a equipe perceber. A tag
**desaparece quando alguém abre** o veículo (no histórico fica o que mudou).

**Trocar de perfil?**
Toque no seu nome (canto superior direito) → confirme.

**Como registro as fotos (VIN SERIAL/placa/avaria)?**
Abra o veículo → aba **📷 Fotos** → toque em **VIN SERIAL**, **Avaria**,
**Placa** ou **Outra**: abre a **câmera do celular**, você tira a foto e ela
fica salva no veículo. Veja o passo a passo na seção 11.

---

## 11. 📷 Registrar fotos da vistoria no pátio

Para quem **busca o carro no pátio** e inicia a **Preparação** (etapa 0). Use o
**celular** para fotografar o VIN SERIAL, avarias e a placa.

1. Aba **Veículos** → toque no veículo (use a **busca** por chassi/cliente).
2. Abra a aba **📷 Fotos**.
3. Toque no tipo da foto: **🔢 VIN SERIAL**, **⚠️ Avaria**, **🔖 Placa** ou
   **📷 Outra** → abre a **câmera do celular** → tire a foto.
4. A foto entra na grade do veículo (com tipo, data e quem registrou) e fica
   registrada no **histórico**. Toque numa foto para **ver ampliada**; o **✕**
   remove.

### ✅ Conferência automática do VIN SERIAL (libera a preparação)
Ao tirar a **foto do VIN SERIAL**, o app **lê o número (OCR)** e **compara com a
grade** (que veio da planilha). Aprova de duas formas:
- pelo **VIN SERIAL de 6 dígitos** do adesivo GM (no para-brisa), **ou**
- pelo **chassi cheio** (17 caracteres, na etiqueta da porta/vidro).

- **Confere** → aparece **"✓ VIN SERIAL conferido"** e o veículo pode **avançar**
  da etapa 0 para a preparação.
- **Não confere** → mostra a leitura × a grade e a **liberação fica
  bloqueada** (botão de avançar não aparece). Tire a foto de novo, com o número
  **legível**.
- Botão **"🔍 Verificar chassi"** refaz a leitura da última foto.
- Em exceção (OCR não lê um número válido), há **"Liberar manualmente"** —
  fica **registrado no histórico** como exceção.

**Boas práticas no pátio:**
- Fotografe o **VIN SERIAL** (adesivo GM no para-brisa) bem **enquadrado e
  legível**, sem reflexo — é o que libera a preparação.
- Se houver **avaria**, registre **uma foto por avaria** antes de iniciar o preparo.
- A placa normalmente é fotografada mais à frente (Conferência Final / Entrega).
- A leitura usa **OCR na nuvem** (mais preciso) quando configurado; sem nuvem
  ou offline, cai para o **leitor no aparelho** (precisa de internet na 1ª vez
  para baixá-lo). O selo do chassi mostra a fonte (**OCR nuvem** / **aparelho**).
  Para ligar a nuvem, veja `SETUP_NUVEM.md` (Parte 4b).

> As fotos são **comprimidas** no próprio celular (ficam leves) e, com a nuvem
> ligada, **sincronizam** para a equipe (precisa da regra `braga_fotos` —
> ver `SETUP_NUVEM.md`). Sem internet, ficam salvas no aparelho e sobem depois.
> Dica: a aba **📷 Fotos** está em **todos os veículos** — qualquer perfil pode
> registrar; quem faz a vistoria no pátio é o foco aqui.

---

*Braga Veículos · Chevrolet · App de Gestão de Preparação e Entrega*
