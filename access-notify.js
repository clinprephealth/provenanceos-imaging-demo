/**
 * Demo access notifications — shared with clinprephealth-demo (React build).
 * POSTs to Cloudflare Worker for email + IP tracking.
 */
(function (global) {
  'use strict';

  var NOTIFY_ENABLED = true;
  var NOTIFY_ENDPOINT = 'https://clinprep-demo-notify.clinprephealth.workers.dev/notify';
  var DEBOUNCE_PREFIX = 'demo-notify-day';

  function shouldSendOpenNotification(demo) {
    var today = new Date().toISOString().slice(0, 10);
    var key = DEBOUNCE_PREFIX + ':' + demo + ':' + today;
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, '1');
    return true;
  }

  function fetchClientIp() {
    return fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(4000) })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        return data && data.ip ? data.ip : null;
      })
      .catch(function () {
        return null;
      });
  }

  function sendDemoAccessNotification(payload) {
    if (!NOTIFY_ENABLED || !NOTIFY_ENDPOINT) return Promise.resolve();

    if (payload.event === 'open' && !shouldSendOpenNotification(payload.demo)) {
      return Promise.resolve();
    }

    return fetchClientIp().then(function (clientIp) {
      return fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demo: payload.demo,
          event: payload.event,
          label: payload.label,
          sessionExpiresAt: payload.sessionExpiresAt,
          page: payload.page || global.location.pathname.split('/').pop() || 'index.html',
          clientIp: clientIp,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      });
    }).catch(function () {
      /* non-blocking */
    });
  }

  global.ClinPrepAccessNotify = {
    send: sendDemoAccessNotification,
  };
})(typeof window !== 'undefined' ? window : globalThis);
