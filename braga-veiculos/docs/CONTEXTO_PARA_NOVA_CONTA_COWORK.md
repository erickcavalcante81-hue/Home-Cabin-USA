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
> - `BRAGA_Gestao_Entregas.html` — app principal de gestão (mobile-first, dark mode)
> - `FLUXOGRAMA_Preparacao_Entrega_v4.pdf` — fluxograma operacional aprovado
> - `GESTAO_DE_CRISE_Braga_Veiculos.pdf` — protocolo de crise operacional
> - `PLANO_DE_ACAO_2026_Braga_Veiculos.pdf` — plano de implantação e metas
> - `RESUMO_PROJETO_BRAGA_VEICULOS.md` — resumo completo do projeto
>
> **Leia o arquivo RESUMO_PROJETO_BRAGA_VEICULOS.md para ter o contexto completo.**

---

## Resumo Executivo do Projeto

### O que foi construído

**App Web — `BRAGA_Gestao_Entregas.html`**
Sistema completo de gestão com 8 etapas operacionais, 5 perfis de usuário, módulo de entrada por WhatsApp/PDF/email, checklists por etapa, registro de acessórios, defeitos e dashboard gerencial. Dark mode, mobile-first.

### Pipeline operacional (8 etapas — Fluxograma v4)

| # | Etapa | Responsável | Observação |
|---|-------|------------|------------|
| 0 | Localização Chassi | Equipe Pátio | Foto do chassi obrigatória. Foto de avaria se houver |
| 1 | Acessórios / Películas | **Parazinho** | Independente da data de entrega |
| 2 | Confirmação de Data | **Adriano** | Aciona a Lista de Entrega |
| 3 | Lista de Entrega | **Adriano** | Gatilho que ativa a lavagem |
| 4 | Lavagem e Acabamento | Lavador | Agendado via WhatsApp/email |
| 5 | Qualidade + Placa | Responsável | Foto da placa obrigatória |
| 6 | Entregador Técnico | Braga | Fotos: chassi + placa instalada |
| 7 | Concluído | — | Registrado no app |

### Perfis de usuário no app

- **Gerente** — Dashboard KPIs, visão geral
- **Helena** — Programador (pipeline, agendamentos)
- **Adriano** — Co-Programador (recebe pedidos da Helena, cadastra veículos)
- **Preparador** — Checklists e defeitos
- **Instalador** — Confirmação de acessórios

### Remetentes autorizados WhatsApp
Adriana · Adriano · Junior Leão · Adriano Junior

### Canais de entrada de pedidos
WhatsApp (mensagem ou PDF) · E-mail · Parser automático extrai dados

### Status da implantação
- [x] App construído e atualizado com fluxograma v4
- [x] Fluxograma exportado como PDF
- [x] Plano de Ação 2026 criado
- [x] Gestão de Crise criada
- [ ] **Próximo passo crítico: hospedar o app online (Firebase + Netlify)**
  - App hoje roda como arquivo local — cada dispositivo tem sua cópia
  - Firebase = banco de dados em tempo real (gratuito)
  - Netlify = hospedagem com link fixo (gratuito)
  - Estimativa: ~2 horas, R$0

### Arquitetura aprovada
Firebase Firestore (banco) + Netlify (hosting) + PWA (instala como app no celular)
- Custo: R$0
- Implantação: ~2h
- Resultado: link fixo, 4G/Wi-Fi, toda equipe sincronizada

---

## Como abrir o app agora (antes do deploy online)

**No Mac:**
Duplo clique em `▶ ABRIR APP NO CELULAR.command` → abre servidor local → QR code no Chrome

**No celular (iOS/Android):**
Mesma rede Wi-Fi do Mac → escaneia QR code → abre no Safari/Chrome

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

## Arquivos na pasta do projeto

```
projeto de entrega 2026/
├── BRAGA_Gestao_Entregas.html        ← APP PRINCIPAL
├── ▶ ABRIR APP NO CELULAR.command    ← Inicia servidor Wi-Fi
├── FLUXOGRAMA_Preparacao_Entrega_v4.pdf
├── GESTAO_DE_CRISE_Braga_Veiculos.pdf
├── PLANO_DE_ACAO_2026_Braga_Veiculos.pdf
├── RESUMO_PROJETO_BRAGA_VEICULOS.md
├── PEDIDO_TESTE_Tracker_JoaoSilva.pdf  ← PDF para testar módulo Entrada
├── FPD 1 a 7 *.pdf                   ← Padrão Entrega Chevrolet (referência)
└── Materiais de Apoio *.pdf          ← Check-in e Check-out Chevrolet
```

---

*Projeto Braga Veículos · Grupo Econômico Malia · Junho 2026*
