/* ============================================================
   Braga Veículos — Camada de Sincronização em Nuvem (Firebase Firestore)
   ============================================================
   Arquitetura OFFLINE-FIRST:
   - O localStorage continua sendo o armazenamento de trabalho do app
     (rápido, funciona sem internet).
   - Quando há configuração válida em window.FIREBASE_CONFIG, este módulo
     espelha os dados num único documento do Firestore (braga/data) e mantém
     TODOS os aparelhos sincronizados em tempo real (onSnapshot).
   - SEM configuração válida, tudo aqui é no-op: o app se comporta
     exatamente como antes, 100% local. Nada quebra.

   Estratégia de conflito (v1): o banco inteiro é um documento; vale a
   última escrita (last-write-wins). Suficiente para uma equipe pequena
   editando veículos diferentes. Evoluível para documento-por-veículo.
   ============================================================ */
(function () {
  var cfg = window.FIREBASE_CONFIG || {};
  var hasConfig = !!(cfg.apiKey && cfg.projectId && cfg.apiKey.indexOf('COLE_') !== 0);

  var SDK_VERSION = '10.12.2';
  var SDK = [
    'https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-firestore-compat.js'
  ];
  var COL = 'braga', DOC = 'data';

  var CloudSync = {
    enabled: hasConfig,
    _applyingRemote: false,
    _seeded: false,
    _ref: null,
    _pushTimer: null,
    _clientId: (function () {
      try {
        var k = 'braga_client_id', v = localStorage.getItem(k);
        if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(k, v); }
        return v;
      } catch (e) { return 'anon-' + Math.random().toString(36).slice(2); }
    })(),

    /* onRemote(dataObj) — chamado quando chega atualização de outro aparelho.
       onEmpty()         — chamado uma vez se o documento ainda não existe. */
    init: function (onRemote, onEmpty) {
      if (!this.enabled) return;
      var self = this;
      loadScripts(SDK, function () {
        try {
          if (!firebase.apps.length) firebase.initializeApp(cfg);
          var start = function () {
            self._ref = firebase.firestore().collection(COL).doc(DOC);
            self._ref.onSnapshot(function (snap) {
              if (!snap.exists) {
                if (!self._seeded && typeof onEmpty === 'function') { self._seeded = true; onEmpty(); }
                return;
              }
              self._seeded = true;
              var d = snap.data() || {};
              if (d.origin === self._clientId) return;     // eco da própria escrita: ignora
              if (!d.payload) return;
              var parsed; try { parsed = JSON.parse(d.payload); } catch (e) { return; }
              if (typeof onRemote === 'function') onRemote(parsed);
            }, function (err) { console.warn('[CloudSync] erro no onSnapshot:', err); });
          };
          // Login anônimo (recomendado pelas Regras do Firestore). Se falhar,
          // tenta seguir mesmo assim (caso as regras estejam abertas p/ teste).
          if (firebase.auth) {
            firebase.auth().signInAnonymously()
              .then(start)
              .catch(function (e) { console.warn('[CloudSync] auth anônima falhou:', e); start(); });
          } else { start(); }
        } catch (e) {
          console.warn('[CloudSync] init falhou — seguindo offline:', e);
          self.enabled = false;
        }
      }, function () {
        console.warn('[CloudSync] SDK do Firebase não carregou (offline?). App segue local.');
      });
    },

    /* Envia o banco completo para a nuvem (com debounce p/ não escrever demais). */
    push: function (data) {
      if (!this.enabled || !this._ref) return;
      var self = this;
      clearTimeout(this._pushTimer);
      this._pushTimer = setTimeout(function () {
        try {
          self._ref.set({ payload: JSON.stringify(data), origin: self._clientId, updatedAt: Date.now() });
        } catch (e) { console.warn('[CloudSync] push falhou:', e); }
      }, 600);
    }
  };

  function loadScripts(urls, onDone, onErr) {
    var i = 0;
    (function next() {
      if (i >= urls.length) return onDone();
      var s = document.createElement('script');
      s.src = urls[i++];
      s.async = false;
      s.onload = next;
      s.onerror = function () { (onErr || function () {})(); };
      document.head.appendChild(s);
    })();
  }

  window.CloudSync = CloudSync;
})();
