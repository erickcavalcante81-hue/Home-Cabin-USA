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
├── app/
│   └── BRAGA_Gestao_Entregas.html      ← App principal (HTML/CSS/JS, 1 arquivo)
└── docs/
    ├── RESUMO_PROJETO_BRAGA_VEICULOS.md ← Resumo completo do projeto
    ├── CONTEXTO_PARA_NOVA_CONTA_COWORK.md
    ├── FLUXOGRAMA_Preparacao_Entrega_v4.pdf
    ├── GESTAO_DE_CRISE_Braga_Veiculos.pdf
    ├── PLANO_DE_ACAO_2026_Braga_Veiculos.pdf
    └── samples/
        └── PEDIDO_TESTE_Tracker_JoaoSilva.pdf  ← PDF para testar o módulo Entrada
```

## Como rodar agora

O app é um único arquivo HTML, sem dependências externas — basta abrir
`app/BRAGA_Gestao_Entregas.html` no navegador (desktop ou celular).

Para testar no iPhone via Wi-Fi local (Safari não abre `.html` local
direto), sirva a pasta:

```bash
cd braga-veiculos/app
python3 -m http.server 8000
# abra http://<ip-do-computador>:8000/BRAGA_Gestao_Entregas.html no celular
```

## Pipeline operacional (Fluxograma v4)

| # | Etapa                  | Responsável   | Observação                         |
|---|------------------------|---------------|------------------------------------|
| 0 | Localização Chassi     | Equipe Pátio  | Foto do chassi obrigatória         |
| 1 | Acessórios / Películas | Parazinho     | Independente da data de entrega    |
| 2 | Confirmação de Data    | Adriano       | Aciona a Lista de Entrega          |
| 3 | Lista de Entrega       | Adriano       | Gatilho que ativa a lavagem        |
| 4 | Lavagem e Acabamento   | Lavador       | Agendado via WhatsApp/e-mail       |
| 5 | Qualidade + Placa      | Responsável   | Foto da placa obrigatória          |
| 6 | Entregador Técnico     | Braga         | Fotos: chassi + placa instalada    |
| 7 | Concluído              | —             | Registrado no app                  |

**Perfis:** Gerente (dashboard) · Helena (Programador) · Adriano
(Co-Programador) · Preparador · Instalador.

**Remetentes WhatsApp autorizados:** Adriana · Adriano · Junior Leão ·
Adriano Junior.

## Modelo de dados atual

O app guarda tudo no `localStorage` do navegador, na chave **`braga_data`**:

```js
{ vehicles: [], defects: [], intakes: [], nextId: 1 }
```

Toda a persistência passa por duas funções isoladas — `getStorage()` e
`setStorage()` (em `app/BRAGA_Gestao_Entregas.html`). Isso é proposital: a
migração para um backend em nuvem (sincronização em tempo real entre
dispositivos) se concentra basicamente em trocar essas duas funções por
leitura/escrita assíncrona + um listener de atualizações.

**Limitação:** hoje cada dispositivo tem sua própria cópia dos dados (não há
sincronização). Resolver isso é o próximo passo do projeto.

## Roadmap / próximos passos

1. **Hospedar online + sincronizar dados** — eliminar a dependência de
   servidor local e dar a toda a equipe uma cópia única e em tempo real.
   Caminho sugerido: backend (Firebase Firestore ou Supabase) + hospedagem
   estática (Netlify/Vercel) + PWA (instala como app no celular). Custo R$0
   nos planos gratuitos.
2. **Persistir fotos** — chassi, avarias e placa hoje ficam no dispositivo;
   passar para storage em nuvem.
3. **Importar a frota atual** — cadastrar os veículos em preparação.
4. **Treinar a equipe** — cada pessoa com seu perfil.
5. **Integração D4 / Andreza** — alinhar fluxo de fatura e acessórios.

Documentos de referência completos em [`docs/`](docs/) — em especial
[`RESUMO_PROJETO_BRAGA_VEICULOS.md`](docs/RESUMO_PROJETO_BRAGA_VEICULOS.md).

---

*Projeto Braga Veículos · Chevrolet · Grupo Econômico Malia*
