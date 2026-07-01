# Guia — Colocar o app online com sincronização em tempo real

Este guia liga a **nuvem** (Firebase) e publica o app num **link fixo**
(Netlify), para toda a equipe usar do celular/computador com os **dados
sincronizados em tempo real**. Tudo nos planos gratuitos — **custo R$0**.

> Enquanto você **não** fizer a Parte 1–3, o app continua funcionando
> normal, offline, em cada aparelho (sem sincronizar). Nada quebra.

Tempo estimado: ~15 minutos.

---

## Parte 1 — Criar o projeto no Firebase (banco em tempo real)

1. Acesse **https://console.firebase.google.com** e entre com a conta Google.
2. Clique em **Adicionar projeto** → dê o nome `braga-veiculos` → pode
   **desativar** o Google Analytics → **Criar projeto**.
3. No painel do projeto, clique no ícone **`</>` (Web)** para registrar um app.
   - Apelido do app: `Braga Entregas` → **Registrar app**.
4. O Firebase vai mostrar um trecho de código com um objeto
   **`firebaseConfig`**. **Copie esses valores** (apiKey, authDomain,
   projectId, etc.). É só o que precisamos daqui.

## Parte 2 — Ativar o banco e o login

1. Menu lateral → **Build → Firestore Database** → **Criar banco de dados**
   → escolha a região (ex.: `southamerica-east1`) → inicie em **modo de
   produção** (as regras abaixo cuidam do acesso).
2. Menu lateral → **Build → Authentication** → **Começar** → aba
   **Sign-in method** → ative **Anônimo** → **Salvar**.
   *(O app faz login anônimo automaticamente — ninguém precisa criar senha.)*
3. Volte em **Firestore → aba Regras**, cole as regras abaixo e **Publicar**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /braga/{doc} {
         allow read, write: if request.auth != null;   // legado braga/data + braga/meta
       }
       match /braga_veiculos/{id} {
         allow read, write: if request.auth != null;   // um documento por veículo
       }
       match /braga_fotos/{id} {
         allow read, write: if request.auth != null;   // fotos da vistoria
       }
     }
   }
   ```

   > **`braga_veiculos`** guarda **um documento por veículo** (sync por veículo —
   > dois aparelhos editam veículos diferentes sem se sobrescrever). **`braga`**
   > cobre o `braga/meta` (defeitos/entradas/contadores) e o `braga/data` antigo
   > (migrado automaticamente). **`braga_fotos`** libera as **fotos da vistoria**
   > (documentos separados) — sem ela, as fotos ficam só no aparelho que tirou.
   > Se você já tinha as regras antigas, **basta publicar estas** por cima.

   Isso permite ler/gravar **apenas** o documento do app, e **apenas** para
   quem está autenticado (o login anônimo do próprio app).

## Parte 3 — Colar as chaves no app

As chaves ficam **embutidas no app** (assim todos os aparelhos já vêm
configurados — não há tela de configuração dentro do app). Abra
**`braga-veiculos/app/firebase-config.js`** e substitua os valores `COLE_...`
pelos que você copiou na Parte 1:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "braga-veiculos.firebaseapp.com",
  projectId: "braga-veiculos",
  storageBucket: "braga-veiculos.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
```

> Pode commitar este arquivo. As chaves do Firebase Web **não são secretas**
> (vão para o navegador de qualquer forma); a segurança é feita pelas Regras
> do Firestore + login anônimo da Parte 2.

Assim que houver chaves válidas, a sincronização liga sozinha. O status aparece
no **chip no topo** e na tela de login: 🟢 Sincronizado · 🟡 Conectando ·
🔴 Sem conexão · ⚪ Local (é só indicador — não há botão de configurar).

## Parte 4 — Publicar (link fixo) no Netlify

**Opção A — Arrastar e soltar (mais simples, sem Git):**
1. Acesse **https://app.netlify.com** → entre.
2. Vá em **Sites** → arraste a pasta **`braga-veiculos/app`** inteira para a
   área "Drag and drop your site output folder here".
3. Pronto: o Netlify gera um link tipo `https://seu-app.netlify.app`.
   Em **Site settings → Change site name** você pode personalizar o endereço.

**Opção B — Conectar ao GitHub (atualiza sozinho a cada push):**
1. Netlify → **Add new site → Import an existing project → GitHub** → escolha
   este repositório.
2. O arquivo `netlify.toml` (na raiz) já aponta o publish para
   `braga-veiculos/app` — é só confirmar e **Deploy**.

## Parte 4b — (Opcional) OCR do VIN SERIAL na nuvem — mais preciso

O app já lê o **VIN SERIAL** (adesivo GM) pelo OCR **do próprio aparelho**
(Tesseract). Para **mais precisão**, dá para ligar um OCR na **nuvem** — a
chave fica no **servidor** (função Netlify `netlify/functions/ocr-vin.js`),
nunca no app. Se não configurar, o app usa o OCR local normalmente (fallback
automático).

Escolha **um** provedor e configure a variável no Netlify
(**Site settings → Environment variables**):

- **Google Cloud Vision** (recomendado — mesmo projeto do Firebase):
  1. No **Google Cloud Console** do projeto, habilite a **Cloud Vision API**.
  2. Crie uma **API key** (APIs & Services → Credentials).
  3. No Netlify, defina `GOOGLE_VISION_API_KEY = <sua chave>`.
- **ou Claude (Anthropic):** defina `ANTHROPIC_API_KEY = <sua chave>`.

Depois é só **redeployar** (ou um novo push). O app passa a tentar a nuvem
primeiro e mostra a fonte da leitura (**OCR nuvem** / **OCR aparelho**) no
histórico e no selo do chassi.

> Custo: ambos são pagos por uso (o Vision tem cota grátis mensal); o OCR só é
> chamado ao tirar a foto do VIN SERIAL. Sem chave = 100% local, sem custo.

## Parte 5 — Usar e instalar como app no celular

1. Abra o link do Netlify no celular.
2. **iPhone (Safari):** botão Compartilhar → **Adicionar à Tela de Início**.
   **Android (Chrome):** menu ⋮ → **Instalar app / Adicionar à tela inicial**.
3. Vira um ícone igual a um app instalado, abre em tela cheia e funciona
   mesmo sem internet (os dados sincronizam quando a conexão voltar).

### Teste rápido de sincronização
Abra o link em **dois aparelhos**, faça login (ex.: Helena num, Gerente
noutro) e cadastre/edite um veículo: a mudança aparece no outro em segundos.

---

## Como funciona (resumo técnico)

- **Offline-first:** o app trabalha sobre o `localStorage`; o Firestore é um
  espelho em tempo real. Sem internet, tudo continua funcionando e sincroniza
  ao reconectar.
- **Sync por veículo:** cada veículo é **um documento** em `braga_veiculos/{id}`;
  o app escreve **só o que mudou** (diff) e escuta a coleção via `onSnapshot`.
  Defeitos/entradas/contadores ficam num documento de apoio `braga/meta`. Assim,
  dois aparelhos editando **veículos diferentes** não se sobrescrevem (dentro do
  **mesmo** veículo, ainda vale a última escrita).
- **Migração automática:** na 1ª conexão, se a coleção estiver vazia e existir o
  `braga/data` antigo (modelo v1, documento único), os veículos são **migrados
  sozinhos** para `braga_veiculos` (o `braga/data` é preservado). Enquanto os
  aparelhos atualizam para a nova versão (service worker), pode haver um curto
  período de convivência — assim que todos recarregam, ficam no novo modelo.
- Com a nuvem ligada, o app **não** carrega os dados de exemplo (demo) — ele
  começa do que estiver na nuvem.

## Próximas evoluções sugeridas
- Fotos (VIN SERIAL/avaria/placa) no Firebase Storage.
- Regras por perfil (quem pode editar o quê) com papéis no login.
- ID de veículo por chassi (evitar colisão de `nextId` entre aparelhos offline).
