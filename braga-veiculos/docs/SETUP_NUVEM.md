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
       match /braga/data {
         allow read, write: if request.auth != null;
       }
       match /braga_fotos/{id} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

   > A segunda regra (`braga_fotos`) libera as **fotos da vistoria** (guardadas
   > em documentos separados). Sem ela, as fotos ficam **só no aparelho** que
   > tirou; com ela, sincronizam para toda a equipe.

   Isso permite ler/gravar **apenas** o documento do app, e **apenas** para
   quem está autenticado (o login anônimo do próprio app).

## Parte 3 — Colar as chaves no app

Há **duas formas** (escolha uma):

**Forma A — Direto no app (mais fácil, sem mexer em arquivo):**
1. Abra o app → toque em **☁️ Configurar sincronização** (na tela de login) ou
   no **chip ☁️** no topo.
2. **Cole o bloco `firebaseConfig`** que você copiou na Parte 1 → **Salvar e
   conectar**. O app reinicia já sincronizando. O chip no topo mostra o status:
   🟢 Sincronizado · 🟡 Conectando · 🔴 Sem conexão · ⚪ Local.
   - *Obs.: isso vale por aparelho.* Para configurar a equipe toda de uma vez,
     use a Forma B (ou me mande as chaves que eu deixo embutido no app).

**Forma B — No arquivo (todos os aparelhos já vêm configurados):**
Abra **`braga-veiculos/app/firebase-config.js`** e substitua os valores
`COLE_...` pelos que você copiou na Parte 1:

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

Assim que houver chaves válidas, a sincronização liga sozinha.

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
- O banco inteiro fica em **um documento** `braga/data`. A cada alteração, o
  app envia o estado completo (com *debounce*) e escuta atualizações via
  `onSnapshot`.
- **Conflito (v1):** vale a última escrita (*last-write-wins*). Bom para uma
  equipe pequena editando veículos diferentes. Evolução natural: um documento
  por veículo, para edição simultânea sem risco de sobrescrita.
- Com a nuvem ligada, o app **não** carrega os dados de exemplo (demo) — ele
  começa do que estiver na nuvem. Cadastre o primeiro veículo e ele aparece em
  todos os aparelhos.

## Próximas evoluções sugeridas
- Documento por veículo (edição simultânea sem last-write-wins).
- Fotos (chassi/avaria/placa) no Firebase Storage.
- Regras por perfil (quem pode editar o quê) com papéis no login.
