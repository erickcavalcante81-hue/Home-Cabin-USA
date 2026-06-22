/* ============================================================
   CONFIGURAÇÃO DO FIREBASE  —  cole aqui as chaves do seu projeto
   ============================================================
   Onde pegar: console.firebase.google.com  →  seu projeto  →
   ⚙ Configurações do projeto  →  "Seus apps"  →  app Web  →  SDK.

   Enquanto os valores começarem com "COLE_", a sincronização em nuvem
   fica DESLIGADA e o app funciona normalmente, offline, em cada aparelho.

   Estas chaves do Firebase Web NÃO são secretas (são enviadas ao
   navegador por design). A segurança vem das Regras do Firestore +
   login anônimo — veja docs/SETUP_NUVEM.md.
   ============================================================ */
window.FIREBASE_CONFIG = {
  apiKey: "COLE_SUA_API_KEY",
  authDomain: "COLE_SEU_PROJETO.firebaseapp.com",
  projectId: "COLE_SEU_PROJECT_ID",
  storageBucket: "COLE_SEU_PROJETO.appspot.com",
  messagingSenderId: "COLE_SEU_SENDER_ID",
  appId: "COLE_SEU_APP_ID"
};
