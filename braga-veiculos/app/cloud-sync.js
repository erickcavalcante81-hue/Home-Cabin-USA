/* ============================================================
   Braga Veículos — Camada de Sincronização em Nuvem (Firebase Firestore)
   ============================================================
   Arquitetura OFFLINE-FIRST + SYNC POR VEÍCULO (v2):
   - O localStorage continua sendo o armazenamento de trabalho do app
     (rápido, funciona sem internet).
   - Com configuração válida (localStorage['braga_firebase_config'] OU
     window.FIREBASE_CONFIG), este módulo espelha os dados assim:
       • um documento POR VEÍCULO em  braga_veiculos/{id}
       • um documento de apoio         braga/meta   (defeitos, entradas,
         contadores e versão de esquema)
       • as fotos seguem em            braga_fotos/{id}  (1 doc por foto)
     e mantém todos os aparelhos sincronizados via onSnapshot.
   - SEM configuração válida, tudo aqui é no-op: o app roda 100% local.

   Por que documento-por-veículo: no modelo antigo o banco inteiro era UM
   documento (braga/data) com last-write-wins — dois aparelhos editando
   veículos diferentes ao mesmo tempo podiam se sobrescrever. Agora cada
   veículo é um documento independente: editar o veículo A não afeta o B.
   (Dentro do MESMO veículo ainda vale a última escrita.)

   Migração: na 1ª conexão, se a coleção braga_veiculos estiver vazia e
   existir o documento antigo braga/data, os veículos são migrados
   automaticamente (sem perder nada). O braga/data antigo é preservado.
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
  var COL = 'braga', DOC = 'data', META = 'meta', VCOL = 'braga_veiculos', PCOL = 'braga_fotos';

  function metaOf(data) {
    return { defects: data.defects || [], intakes: data.intakes || [], nextId: data.nextId || 1, _schema: data._schema || 51 };
  }

  var CloudSync = {
    enabled: hasConfig,
    status: hasConfig ? 'conectando' : 'desligado',   // desligado|conectando|online|erro
    projectId: cfg.projectId || null,
    _applyingRemote: false,
    _seeded: false,
    _db: null,
    _cbs: null,
    _pushTimer: null,
    _statusCb: null,
    _legacy: false,                 // fallback p/ o modelo antigo (braga/data) se as regras
                                    // do braga_veiculos ainda não estiverem publicadas
    _unsub: [],                     // handles p/ desassinar os listeners ao cair no fallback
    _last: { veh: {}, meta: '' },   // espelho da última escrita (base do diff)
    _clientId: (function () {
      try {
        var k = 'braga_client_id', v = localStorage.getItem(k);
        if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(k, v); }
        return v;
      } catch (e) { return 'anon-' + Math.random().toString(36).slice(2); }
    })(),

    onStatus: function (cb) { this._statusCb = cb; try { cb(this.status); } catch (e) {} },
    _setStatus: function (s) { this.status = s; if (this._statusCb) { try { this._statusCb(s); } catch (e) {} } },

    /* init(callbacks) — callbacks:
         onVehicle(vehicleObj)     upsert de um veículo vindo de outro aparelho
         onVehicleRemoved(id)      veículo removido em outro aparelho
         onMeta(metaObj)           defeitos/entradas/contadores atualizados
         onEmpty()                 nuvem vazia e sem legado (semeia deste aparelho) */
    init: function (callbacks) {
      if (!this.enabled) return;
      var self = this;
      self._cbs = callbacks || {};
      self._setStatus('conectando');
      loadScripts(SDK, function () {
        try {
          if (!firebase.apps.length) firebase.initializeApp(cfg);
          var start = function () {
            self._db = firebase.firestore();
            self._subscribeMeta();
            self._subscribeVehicles();
          };
          if (firebase.auth) {
            firebase.auth().signInAnonymously().then(start)
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

    _subscribeMeta: function () {
      var self = this;
      var unsub = self._db.collection(COL).doc(META).onSnapshot(function (s) {
        if (self._legacy) return;
        self._setStatus('online');
        if (!s.exists) return;
        var dd = s.data() || {};
        self._last.meta = JSON.stringify(dd.meta || {});
        if (dd.origin === self._clientId) return;             // eco da própria escrita
        if (dd.meta && self._cbs && typeof self._cbs.onMeta === 'function') self._cbs.onMeta(dd.meta);
      }, function (err) { console.warn('[CloudSync] onSnapshot(meta):', err); /* fallback decidido pelo listener de veículos */ });
      if (typeof unsub === 'function') self._unsub.push(unsub);
    },

    _subscribeVehicles: function () {
      var self = this, first = true;
      var unsub = self._db.collection(VCOL).onSnapshot(function (snap) {
        if (self._legacy) return;
        self._setStatus('online');
        if (first) {
          first = false;
          if (snap.empty) { self._migrateOrSeed(); return; }
        }
        var changes = snap.docChanges ? snap.docChanges() : [];
        changes.forEach(function (ch) {
          var id = ch.doc.id, dd = ch.doc.data() || {};
          if (ch.type === 'removed') {
            delete self._last.veh[id];
            if (self._cbs && typeof self._cbs.onVehicleRemoved === 'function') self._cbs.onVehicleRemoved(id);
            return;
          }
          self._last.veh[id] = JSON.stringify(dd.v);            // mantém a base do diff em dia
          if (dd.origin === self._clientId) return;             // eco da própria escrita
          if (dd.v && self._cbs && typeof self._cbs.onVehicle === 'function') self._cbs.onVehicle(dd.v);
        });
      }, function (err) {
        // Sem permissão em braga_veiculos (regras v2 ainda não publicadas) ou outra
        // falha de leitura → cai para o modelo antigo (braga/data). Auto-recupera
        // quando as regras forem publicadas e o app recarregar.
        console.warn('[CloudSync] onSnapshot(veículos) falhou — usando o modelo antigo (braga/data):', err);
        self._fallbackLegacy();
      });
      if (typeof unsub === 'function') self._unsub.push(unsub);
    },

    /* Fallback: sincroniza pelo documento único braga/data (comportamento v1).
       Idempotente. Ativado quando as regras do braga_veiculos ainda não existem. */
    _fallbackLegacy: function () {
      var self = this, cbs = self._cbs || {};
      if (self._legacy) return;
      self._legacy = true;
      self._unsub.forEach(function (u) { try { u(); } catch (e) {} });   // desassina os listeners v2
      self._unsub = [];
      self._setStatus('online');
      self._db.collection(COL).doc(DOC).onSnapshot(function (snap) {
        self._setStatus('online');
        if (!snap.exists) { if (!self._seeded && typeof cbs.onEmpty === 'function') { self._seeded = true; cbs.onEmpty(); } return; }
        self._seeded = true;
        var d = snap.data() || {};
        if (d.origin === self._clientId) return;               // eco da própria escrita
        if (!d.payload) return;
        var parsed; try { parsed = JSON.parse(d.payload); } catch (e) { return; }
        if (typeof cbs.onFull === 'function') cbs.onFull(parsed);
      }, function (err) { console.warn('[CloudSync] onSnapshot(braga/data):', err); self._setStatus('erro'); });
    },

    /* 1ª conexão com a coleção vazia: migra o legado braga/data, ou semeia
       a partir deste aparelho. */
    _migrateOrSeed: function () {
      var self = this, cbs = self._cbs || {};
      self._db.collection(COL).doc(DOC).get().then(function (s) {
        var parsed = null;
        if (s.exists) { var d = s.data() || {}; try { parsed = JSON.parse(d.payload); } catch (e) {} }
        if (parsed && parsed.vehicles && parsed.vehicles.length) {
          // aplica local (mostra já) e escreve per-veículo na nuvem
          (parsed.vehicles || []).forEach(function (v) { if (typeof cbs.onVehicle === 'function') cbs.onVehicle(v); });
          if (typeof cbs.onMeta === 'function') cbs.onMeta(metaOf(parsed));
          self.push(parsed);
          return;
        }
        if (typeof cbs.onEmpty === 'function') cbs.onEmpty();
      }).catch(function () { if (typeof cbs.onEmpty === 'function') cbs.onEmpty(); });
    },

    /* Espelha o banco na nuvem — escreve SÓ o que mudou (diff por veículo). */
    push: function (data) {
      if (!this.enabled || !this._db) return;
      var self = this;
      clearTimeout(this._pushTimer);
      this._pushTimer = setTimeout(function () { self._flush(data); }, 600);
    },
    _flush: function (data) {
      var self = this;
      if (self._legacy) return self._flushLegacy(data);   // regras v2 ausentes: grava braga/data
      try {
        var batch = self._db.batch();
        var vcol = self._db.collection(VCOL);
        var now = Date.now(), wrote = 0;
        var curr = {};
        (data.vehicles || []).forEach(function (v) { if (v && v.id != null) curr[String(v.id)] = JSON.stringify(v); });
        // upserts (novos/alterados)
        Object.keys(curr).forEach(function (id) {
          if (self._last.veh[id] !== curr[id]) {
            batch.set(vcol.doc(id), { v: JSON.parse(curr[id]), origin: self._clientId, updatedAt: now });
            wrote++;
          }
        });
        // remoções
        Object.keys(self._last.veh).forEach(function (id) {
          if (!(id in curr)) { batch.delete(vcol.doc(id)); wrote++; }
        });
        // meta (defeitos/entradas/contadores)
        var meta = metaOf(data), metaJson = JSON.stringify(meta);
        if (metaJson !== self._last.meta) {
          batch.set(self._db.collection(COL).doc(META), { meta: meta, origin: self._clientId, updatedAt: now });
          wrote++;
        }
        if (wrote === 0) { self._setStatus('online'); return; }
        batch.commit()
          .then(function () { self._setStatus('online'); self._last = { veh: curr, meta: metaJson }; })
          .catch(function (e) {
            // permissão negada no batch (regras v2 ausentes) → cai para o modelo antigo e regrava
            console.warn('[CloudSync] push (v2) falhou — tentando o modelo antigo (braga/data):', e);
            self._fallbackLegacy(); self._flushLegacy(data);
          });
      } catch (e) { console.warn('[CloudSync] push falhou:', e); self._setStatus('erro'); }
    },
    /* Fallback de escrita: banco inteiro no documento único braga/data (v1). */
    _flushLegacy: function (data) {
      var self = this;
      try {
        self._db.collection(COL).doc(DOC).set({ payload: JSON.stringify(data), origin: self._clientId, updatedAt: Date.now() })
          .then(function () { self._setStatus('online'); })
          .catch(function (e) { console.warn('[CloudSync] push (braga/data) falhou:', e); self._setStatus('erro'); });
      } catch (e) { console.warn('[CloudSync] push (braga/data) falhou:', e); self._setStatus('erro'); }
    },

    /* ----- Fotos (coleção separada, 1 doc por foto, fora do limite de 1 MB) ----- */
    savePhoto: function (id, obj) {
      if (!this.enabled || !this._db) return;
      try { this._db.collection(PCOL).doc(id).set(obj); }
      catch (e) { console.warn('[CloudSync] savePhoto:', e); }
    },
    loadPhoto: function (id) {
      if (!this.enabled || !this._db) return Promise.resolve(null);
      return this._db.collection(PCOL).doc(id).get()
        .then(function (s) { return (s.exists && s.data()) ? (s.data().d || null) : null; })
        .catch(function () { return null; });
    },
    deletePhoto: function (id) {
      if (!this.enabled || !this._db) return;
      try { this._db.collection(PCOL).doc(id).delete(); } catch (e) {}
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
