# Braga Veículos — Resumo do Projeto de Gestão de Entregas
**Data:** 22 de junho de 2026  
**Status:** Em implantação

---

## O que foi construído

### 1. App de Gestão — `BRAGA_Gestao_Entregas.html`

Sistema completo de gestão de preparação e entrega de veículos Chevrolet, baseado nos 7 passos do Padrão de Entrega Chevrolet (FPD 1 a 7). Roda no navegador do celular e do computador, sem instalação.

**5 telas principais:**

| Tela | Função |
|------|--------|
| 📊 Dashboard | KPIs em tempo real, semáforo verde/amarelo/vermelho, entregas do dia, pipeline por etapa |
| 🚗 Veículos | Lista completa com busca, filtro por etapa e barra de progresso por veículo |
| ✅ Checklist | Checklists dos passos FPD 3 e 4 — preparador marca item a item |
| 📥 Entrada | Cadastro via WhatsApp, email, PDF ou imagem com parser automático |
| ⚠️ Defeitos | Registro de defeitos por tipo, local, severidade e resolução |

**Pipeline de 7 etapas:**
Área Adm → Instalação de Acessórios → Revisão Técnica → Bolsão/Lavagem → Agendamento → Pré-Entrega → Entregue

**Perfis de acesso:**
- Gerente / Dashboard
- Helena — Programador
- Adriano — Co-Programador *(recebe pedidos da Helena e cadastra)*
- Preparador de Veículos
- Instalador de Acessórios

---

### 2. Módulo de Entrada de Pedidos

Recebe pedidos de múltiplas origens e extrai os dados automaticamente:

- **WhatsApp** — remetentes autorizados: Adriana, Adriano, Junior Leão, Adriano Junior
- **E-mail** — cola o texto, sistema extrai modelo/cor/cliente/acessórios
- **PDF** — faz upload do arquivo, transcreve os dados
- **Imagem/Print** — upload de foto de tela

**Ação rápida do Adriano:** quando logado como Adriano, a aba Entrada mostra botão verde direto "Recebi mensagem da Helena" — WhatsApp + Adriano já pré-selecionados, só cola o texto.

---

### 3. Documentos gerados

| Arquivo | Descrição |
|---------|-----------|
| `PEDIDO_TESTE_Tracker_JoaoSilva.pdf` | PDF de pedido simulado para testar o módulo de Entrada |
| `GESTAO_DE_CRISE_Braga_Veiculos.pdf` | Protocolo para acúmulo de veículos sem preparação validada — triagem, priorização, script de comunicação com cliente, checklist de saída de crise |
| `PLANO_DE_ACAO_2026_Braga_Veiculos.pdf` | Cronograma de implantação (Jun–Dez 2026), 8 metas operacionais com indicadores, matriz de responsabilidades com espaço para assinatura |

---

## Fluxo de operação

```
WhatsApp (Helena → Adriano)
        ↓
Adriano abre o app → Aba Entrada → botão verde
Cola o texto → Sistema extrai dados → Confirma
        ↓
Veículo entra na fila — Área Adm
        ↓
Helena (Programador) acompanha o pipeline
        ↓
Preparador: marca checklist no celular
Instalador: confirma acessórios um a um
        ↓
Helena avança etapas conforme concluídas
        ↓
Agendamento com cliente → Pré-Entrega → Entregue
        ↓
Gerente vê dashboard em tempo real
```

---

## Remetentes autorizados WhatsApp

O sistema bloqueia pedidos via WhatsApp de qualquer pessoa fora desta lista:

1. **Adriana**
2. **Adriano**
3. **Junior Leão**
4. **Adriano Junior**

---

## Como abrir no celular

**Problema identificado:** iOS Safari não abre arquivos `.html` locais diretamente. A solução é rodar um servidor local via Wi-Fi.

**Passos:**
1. Mac e celular na **mesma rede Wi-Fi**
2. No Finder: `Documentos → entrega de novos → projeto de entrega 2026`
3. Duplo clique em **`▶ ABRIR APP NO CELULAR.command`**
4. O Terminal abre mostrando o endereço e o QR code aparece no Chrome
5. Aponte a câmera do iPhone para o QR code
6. No Safari: **Compartilhar → Adicionar à Tela de Início** → vira ícone de app

**Se der "permissão negada":** clique com botão direito → Abrir → Abrir mesmo assim

---

## Limitação atual — dados por dispositivo

O app salva os dados localmente em cada dispositivo (localStorage). Isso significa que cada celular tem sua própria cópia dos dados.

**Solução imediata:** Um único dispositivo (preferencialmente o da Helena) é o master. Os demais acessam via Wi-Fi pelo endereço do servidor.

**Próximo passo:** hospedar o app online (Firebase/Vercel) para toda a equipe sincronizar em tempo real — sem servidor local, sem Wi-Fi obrigatório.

---

## Arquivos na pasta

| Arquivo | Tipo | Uso |
|---------|------|-----|
| `BRAGA_Gestao_Entregas.html` | App | Abrir no navegador — sistema completo |
| `▶ ABRIR APP NO CELULAR.command` | Script | Duplo clique no Mac para iniciar servidor Wi-Fi |
| `INICIAR_APP_NO_CELULAR.py` | Script Python | Alternativa ao .command |
| `PEDIDO_TESTE_Tracker_JoaoSilva.pdf` | PDF | Teste do módulo de Entrada |
| `GESTAO_DE_CRISE_Braga_Veiculos.pdf` | PDF | Protocolo de crise operacional |
| `PLANO_DE_ACAO_2026_Braga_Veiculos.pdf` | PDF | Plano de implantação e metas 2026 |

---

## Próximos passos sugeridos

1. **Resolver acesso no celular** — hospedar o app online para eliminar dependência do servidor local
2. **Importar lista atual de veículos** — cadastrar todos os veículos em preparação hoje
3. **Treinar a equipe** — Helena, Adriano, Preparador e Instalador cada um com seu perfil
4. **Integrar com D4/Andreza** — alinhar o fluxo de fatura e acessórios com o sistema existente
5. **Primeiro relatório** — agosto/2026, conforme Plano de Ação

---

*Desenvolvido com Claude — Braga Veículos / Chevrolet — Junho 2026*
