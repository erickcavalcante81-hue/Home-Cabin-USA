# Manual de Uso — App Braga Veículos (Gestão de Entregas)

**Acesse em:** https://entrega-braga.netlify.app
**Funciona em:** celular e computador (navegador). Dá para instalar como app.

Este manual explica o app para **todos os perfis**: Gerente, Helena
(Programador), Adriano (Co-Programador), Preparador e Instalador.

---

## 1. Primeiros passos (todos)

### Abrir e instalar como app no celular
1. Abra **https://entrega-braga.netlify.app** no navegador.
2. **iPhone (Safari):** botão **Compartilhar** → **Adicionar à Tela de Início**.
   **Android (Chrome):** menu **⋮** → **Instalar app**.
3. Vira um ícone como qualquer app, abre em tela cheia e funciona até **sem internet** (sincroniza quando a conexão volta).

### Entrar (escolher o perfil)
Na tela inicial, toque no seu perfil: **Gerente**, **Helena**, **Adriano**,
**Preparador** ou **Instalador**. Para trocar de perfil, toque no seu nome no
canto superior direito.

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
(abaixo). O botão **+** (cadastrar veículo) aparece só para Gerente, Helena
e Adriano.*

---

## 3. O fluxo de 8 etapas

Todo veículo percorre estas etapas (a barrinha de progresso mostra onde está):

| # | Etapa | Quem faz | Atenção |
|---|-------|----------|---------|
| 0 | Localização Chassi | Equipe Pátio | 📸 Foto do chassi (e da avaria, se houver) |
| 1 | Acessórios / Películas | Instalador (Parazinho) | Independe da data de entrega |
| 2 | Confirmação de Data | Adriano | Aciona a Lista de Entrega |
| 3 | Lista de Entrega | Adriano | Dispara a lavagem |
| 4 | Lavagem e Acabamento | Lavador | Agendado por WhatsApp/e-mail |
| 5 | Qualidade + Placa | Responsável | 📸 Foto da placa instalada |
| 6 | Entregador Técnico | Braga | 📸 Foto do chassi + da placa |
| 7 | Concluído | — | Registrado no app |

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

### 📋 Helena — Programador (coração da operação)
Você organiza o pipeline do início ao fim.
- **Cadastrar veículos:** botão **+** (um a um) **ou** aba **Entrada** para
  importar uma **planilha inteira** de uma vez (ver seção 5).
- **Acompanhar o pipeline:** aba **Veículos** → abra um veículo → aba **Info**.
- **Agendar a entrega:** no detalhe do veículo, campo **"Agendar Data de
  Entrega"** → escolha a data → **Salvar**.
- **Avançar as etapas:** conforme a equipe conclui cada fase, abra o veículo e
  toque em **"✓ Concluir: <etapa> → <próxima>"** (ver seção 6).

### 👨‍💼 Adriano — Co-Programador
Você recebe os pedidos (geralmente da Helena, por WhatsApp) e alimenta o app.
- Aba **Entrada**: quando logado como **Adriano**, aparece o atalho verde
  **"Recebi mensagem da Helena"** — toque, cole o texto e confirme.
- Você também importa **planilhas** (PDF) e cadastra veículos (botão **+**).
- É o responsável pelas etapas **2 (Confirmação de Data)** e **3 (Lista de
  Entrega)** — confirme a data com o cliente e avance essas etapas.

### 🔧 Preparador de Veículos
Seu trabalho aparece na aba **Checklist**.
1. Aba **Checklist** → escolha o veículo da lista.
2. Aparece o checklist **da etapa atual** dele (ex.: lavagem, qualidade).
3. **Toque em cada item** conforme vai fazendo — ele fica verde. A barrinha
   mostra o progresso (ex.: 5/9).
4. Itens com **📸 (foto obrigatória)** lembram de registrar a foto do chassi/
   placa/avaria antes de concluir.
5. Achou um problema no carro? Registre em **Defeitos** (ver seção 9).

### 🛠️ Instalador de Acessórios
Seu foco é confirmar a instalação (etapa 1).
1. Aba **Veículos** → abra o veículo → aba **Acessórios**.
2. Toque na **bolinha** ao lado de cada acessório quando instalar — vira ✅ e
   grava a data automaticamente.
3. Faltou um acessório na lista? Toque em **"+ Adicionar"** e digite o nome.
4. Com tudo instalado e conferido, o veículo pode avançar da etapa 1.

---

## 5. Importar uma PLANILHA DE ENTREGA (vários veículos de uma vez)

Para Helena/Adriano/Gerente. Cadastra a planilha do dia inteira em segundos —
**de forma automática, sem precisar selecionar ou confirmar veículo por veículo**.

1. Aba **Entrada** → **"+ Nova Entrada"**.
2. Escolha a origem **"📋 Planilha de Entrega (lote)"**.
3. **Opção A — PDF:** em **"Ler direto de um PDF"**, toque e escolha o arquivo
   (ex.: `PLANILHA DE ENTREGA - 23_06.pdf`). O app lê tudo sozinho.
   **Opção B — Colar:** cole o texto da planilha no campo de baixo.
4. O app **aplica tudo automaticamente** e mostra um **resumo**:
   - **✅ Novos** — cadastrados direto.
   - **🔔 Atualizados** — veículos que já existiam (mesmo chassi) e tiveram
     alguma mudança (ex.: trocou o entregador ou o horário). O app **substitui
     pela versão mais recente** e marca o veículo com a tag **🔔 Alterado** na
     lista de Veículos. A tag **some quando alguém abre** o veículo.
   - **= Sem mudança** — já estavam idênticos (nada a fazer).

> O **chassi** é o identificador: reimportar a mesma planilha **não duplica**.
> Etapa, checklists e fotos do veículo são **preservados** numa atualização —
> só os dados da planilha (cliente, cor, vendedor, entregador, horário, data,
> acessórios) são atualizados, e o histórico registra exatamente o que mudou.

---

## 6. Avançar (ou voltar) uma etapa

1. Abra o veículo (aba **Veículos** → toque no card) → aba **Info**.
2. Role até embaixo:
   - **"✓ Concluir: <etapa atual> → <próxima>"** avança para a próxima etapa.
   - **"‹ Voltar: <etapa anterior>"** volta uma etapa (se errou).
3. A linha do tempo mostra o que já foi concluído e o que está em andamento.
4. Ao concluir a última etapa, aparece **"🎉 Serviço Concluído!"**.

---

## 7. Cadastrar UM veículo manualmente

Para Helena/Adriano/Gerente.
1. Toque no botão **+** (canto inferior direito).
2. Preencha: modelo, cor, placa/chassi, nº fatura, cliente, celular, data da
   fatura, consultor e observações.
3. **Salvar** — ele entra na etapa 0.

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

**As fotos (chassi/placa/avaria)?**
Hoje o checklist tem os **lembretes** de foto obrigatória para você marcar.
O envio das fotos dentro do app está planejado como próxima evolução.

---

*Braga Veículos · Chevrolet · App de Gestão de Preparação e Entrega*
