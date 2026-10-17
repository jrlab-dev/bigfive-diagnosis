// 600円で開く（2026-10-17）
// 支払いはStripeの支払いページで行う。このファイルは「支払いページへ送る／戻ってきたら確かめる／
// 返金されたら閉じる／返金を頼む」だけを受け持つ。カードの情報はこのサイトには来ない。
// 開くかどうかの判定は unlock.js の isPaidUser()（印＝localStorage の bigfive_paid）。
(function () {
  'use strict';

  var RECORD_KEY = 'bigfive_paid';          // 支払いの記録。bigfive_ で始まるので自動バックアップに入る
  var DEVICE_KEY = 'bigfive_pay_device';    // 買った端末の印（ランダム。個人は特定しない）
  var LAST_CHECK_KEY = 'pay_status_checked'; // 返金の確認を1日1回にするための時刻（端末だけ・バックアップしない）
  var LAST_BACKUP_KEY = 'bigfive_sync_last_auto';

  // 本番は同じドメインの /api/pay/*。手元の検査（localhost）だけ、検査用の宛先を端末に入れて使う
  function apiBase() {
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') {
      try { return localStorage.getItem('dev_pay_api') || ''; } catch (e) { return ''; }
    }
    return '';
  }

  function post(path, body) {
    return fetch(apiBase() + '/api/pay/' + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (res) {
      return res.json().catch(function () { return { ok: false, error: 'server' }; });
    }).catch(function () { return { ok: false, error: 'network' }; });
  }

  function deviceId() {
    try {
      var id = localStorage.getItem(DEVICE_KEY);
      if (id && /^[A-Za-z0-9-]{16,64}$/.test(id)) return id;
      id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
      localStorage.setItem(DEVICE_KEY, id);
      return id;
    } catch (e) { return ''; }
  }

  function record() {
    try { return JSON.parse(localStorage.getItem(RECORD_KEY) || 'null'); } catch (e) { return null; }
  }

  function saveRecord(r) {
    try {
      localStorage.setItem(RECORD_KEY, JSON.stringify(r));
      // 次の画面で自動バックアップが走るように（返金・購入をすぐ控えへ反映する）
      localStorage.removeItem(LAST_BACKUP_KEY);
    } catch (e) {}
  }

  function isPaid() { return typeof window.isPaidUser === 'function' ? window.isPaidUser() : false; }

  // 返金の受付期間内か（購入から7日）
  function canRefund() {
    var r = record();
    return !!(r && r.sid && r.tok && !r.refunded && r.until && Date.now() / 1000 <= r.until);
  }

  function ga(name, params) {
    try {
      if (localStorage.getItem('dev_nocount') === '1') return;
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    } catch (e) {}
  }

  // 支払いページへ。戻り先（やめたとき）は今のページ
  function startCheckout() {
    var id = deviceId();
    if (!id) return Promise.resolve({ ok: false, error: 'device' });
    ga('pay_checkout_start');
    // 支払いのあと「レポートを開く」で戻ってくる場所（今の結果ページ）
    try { localStorage.setItem('pay_return_path', location.pathname + location.search); } catch (e) {}
    return post('checkout', { device_id: id, cancel_path: location.pathname + location.search })
      .then(function (r) {
        if (r && r.ok && r.url && /^https:\/\/checkout\.stripe\.com\//.test(r.url)) { location.assign(r.url); }
        return r;
      });
  }

  // 支払いページから戻ってきたとき（paid.html）
  function verify(sessionId) {
    var id = deviceId();
    return post('verify', { session_id: sessionId, device_id: id }).then(function (r) {
      if (r && r.ok && r.token) {
        saveRecord({ v: 1, sid: sessionId, tok: r.token, dev: id, at: r.paid_at, until: r.refundable_until });
        ga('pay_verified');
      } else if (r && r.error === 'refunded') {
        saveRecord({ v: 1, sid: sessionId, refunded: true, dev: id });
      }
      return r;
    });
  }

  // 返金されたか（Stripeの画面から返金した場合も閉じる）。1日1回だけ問い合わせる
  function refreshStatus(force) {
    var r = record();
    if (!r || !r.sid || !r.tok || r.refunded) return Promise.resolve(null);
    try {
      var last = parseInt(localStorage.getItem(LAST_CHECK_KEY), 10) || 0;
      if (!force && Date.now() - last < 24 * 60 * 60 * 1000) return Promise.resolve(null);
      localStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
    } catch (e) {}
    return post('status', { session_id: r.sid, device_id: r.dev || deviceId(), token: r.tok }).then(function (s) {
      if (s && s.ok && (s.refunded || s.paid === false)) {
        r.refunded = true;
        saveRecord(r);
      }
      return s;
    });
  }

  function refund(reason) {
    var r = record();
    if (!r || !r.sid || !r.tok) return Promise.resolve({ ok: false, error: 'no_record' });
    return post('refund', { session_id: r.sid, device_id: r.dev || deviceId(), token: r.tok, reason: reason })
      .then(function (res) {
        if (res && res.ok) {
          r.refunded = true;
          r.refunded_at = Math.floor(Date.now() / 1000);
          saveRecord(r);
          ga('pay_refund', { reason: reason });
        }
        return res;
      });
  }

  window.BigFivePay = {
    returnPath: function () { try { var v = localStorage.getItem('pay_return_path') || ''; return /^\/[A-Za-z0-9._~\-\/?=&%+]*$/.test(v) && v.indexOf('//') < 0 ? v : ''; } catch (e) { return ''; } },
    deviceId: deviceId, record: record, isPaid: isPaid, canRefund: canRefund,
    startCheckout: startCheckout, verify: verify, refreshStatus: refreshStatus, refund: refund, ga: ga
  };
})();
