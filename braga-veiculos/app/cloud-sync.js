/* ============================================================
   Braga Veículos — Camada de Sincronização em Nuvem (Firebase Firestore)
   ============================================================
   Arquitetura OFFLINE-FIRST:
   - O localStorage continua sendo o armazenamento de trabalho do app
     (rápido, funciona sem internet).
   - Quando há configuração válida (colada no app e salva em
     localStorage['braga_firebase_config'], OU em window.FIREBASE_CONFIG),
     este módulo espelha os dados num único documento do Firestore
     (braga/data) e mantém TODOS os aparelhos sincronizados (onSnapshot).
   - SEM configuração válida, tudo aqui é no-op: o app se comporta
     exatamente como antes, 100% local. Nada quebra.

   Estratégia de conflito (v1): o banco inteiro é um documento; vale a
   última escrita (last-write-wins). Suficiente para uma equipe pequena
   editando veículos diferentes. Evoluível para documento-por-veículo.
   ============================================================ */
(function () {
  function readConfig() {
    try {
      var ls = localStorage.getItem('braga_firebase_config');
      if (ls) { var c = JSON.parse(ls); if (c && c.apiKey && c.projectId) return c; }
    } catch (e) {}
    return window.FIREBASE_CONFIG || {};
  }
  var cfg = readConfig();
  var hasConfig = !!(cfg.apiKey && cfg.projectId && String(cfg.apiKey).indexOf('COLE_') !== 0);

  var SDK_VERSION = '10.12.2';
  var SDK = [
    'https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-firestore-compat.js'
  ];
  var COL = 'braga', DOC = 'data';

  var CloudSync = {
    enabled: hasConfig,
    status: hasConfig ? 'conectando' : 'desligado',   // desligado|conectando|online|erro
    projectId: cfg.projectId || null,
    _applyingRemote: false,
    _seeded: false,
    _ref: null,
    _db: null,
    _pushTimer: null,
    _statusCb: null,
    _clientId: (function () {
      try {
        var k = 'braga_client_id', v = localStorage.getItem(k);
        if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(k, v); }
        return v;
      } catch (e) { return 'anon-' + Math.random().toString(36).slice(2); }
    })(),

    onStatus: function (cb) { this._statusCb = cb; try { cb(this.status); } catch (e) {} },
    _setStatus: function (s) { this.status = s; if (this._statusCb) { try { this._statusCb(s); } catch (e) {} } },

    /* onRemote(dataObj) — chamado quando chega atualização de outro aparelho.
       onEmpty()         — chamado uma vez se o documento ainda não existe. */
    init: function (onRemote, onEmpty) {
      if (!this.enabled) return;
      var self = this;
      self._setStatus('conectando');
      loadScripts(SDK, function () {
        try {
          if (!firebase.apps.length) firebase.initializeApp(cfg);
          var start = function () {
            self._db = firebase.firestore();
            self._ref = self._db.collection(COL).doc(DOC);
            self._ref.onSnapshot(function (snap) {
              self._setStatus('online');
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
            }, function (err) { console.warn('[CloudSync] erro no onSnapshot:', err); self._setStatus('erro'); });
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
          self.enabled = false; self._setStatus('erro');
        }
      }, function () {
        console.warn('[CloudSync] SDK do Firebase não carregou (offline?). App segue local.');
        self._setStatus('erro');
      });
    },

    /* Envia o banco completo para a nuvem (com debounce p/ não escrever demais). */
    push: function (data) {
      if (!this.enabled || !this._ref) return;
      var self = this;
      clearTimeout(this._pushTimer);
      this._pushTimer = setTimeout(function () {
        try {
          self._ref.set({ payload: JSON.stringify(data), origin: self._clientId, updatedAt: Date.now() })
            .then(function () { self._setStatus('online'); })
            .catch(function (e) { console.warn('[CloudSync] push falhou:', e); self._setStatus('erro'); });
        } catch (e) { console.warn('[CloudSync] push falhou:', e); }
      }, 600);
    },

    /* ----- Fotos (coleção separada 'braga_fotos', 1 doc por foto) -----
       Mantém as imagens FORA do documento principal (que tem limite de 1 MB). */
    savePhoto: function (id, obj) {
      if (!this.enabled || !this._db) return;
      try { this._db.collection('braga_fotos').doc(id).set(obj); }
      catch (e) { console.warn('[CloudSync] savePhoto:', e); }
    },
    loadPhoto: function (id) {
      if (!this.enabled || !this._db) return Promise.resolve(null);
      return this._db.collection('braga_fotos').doc(id).get()
        .then(function (s) { return (s.exists && s.data()) ? (s.data().d || null) : null; })
        .catch(function () { return null; });
    },
    deletePhoto: function (id) {
      if (!this.enabled || !this._db) return;
      try { this._db.collection('braga_fotos').doc(id).delete(); } catch (e) {}
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
