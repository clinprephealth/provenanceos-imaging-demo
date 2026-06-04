/**
 * Demo access notifications — shared with clinprephealth-demo (React build).
 */
(function (window) {
  'use strict';

  var NOTIFY_ENABLED = true;
  var NOTIFY_ENDPOINT = 'https://clinprep-demo-notify.clinprephealth.workers.dev/notify';
  var NOTIFY_EMAIL_FALLBACK = 'michael@clinprephealth.com';
  var DEBOUNCE_PREFIX = 'demo-notify-day';

  function shouldSendOpenNotification(demo) {
    var today = new Date().toISOString().slice(0, 10);
    var key = DEBOUNCE_PREFIX + ':' + demo + ':' + today;
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, '1');
    return true;
  }

  function fetchClientIp() {
    return fetch('https://api.ipify.org?format=json')
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

  function demoLabel(demo) {
    return demo === 'clinprep'
      ? 'ClinPrep care coordination demo'
      : 'ProvenanceOS imaging demo';
  }

  function sendViaFormSubmit(payload, clientIp) {
    if (!NOTIFY_EMAIL_FALLBACK) return Promise.resolve();

    var label = demoLabel(payload.demo);
    var subject =
      '[Demo] ' +
      label +
      ' — ' +
      (payload.event === 'login' ? 'new login' : 'opened');

    return fetch(
      'https://formsubmit.co/ajax/' + encodeURIComponent(NOTIFY_EMAIL_FALLBACK),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          event:
            payload.event === 'login'
              ? 'New login (7-day session started)'
              : 'Demo opened',
          demo: label,
          access_label: payload.label || 'unknown',
          page: payload.page || '(main)',
          ip_address: clientIp || 'unknown',
          ip_note:
            'Compare to prior emails to spot a new address. Deploy notify-worker for automatic IP tracking.',
          session_expires: payload.sessionExpiresAt
            ? new Date(payload.sessionExpiresAt).toISOString()
            : 'unknown',
          time_utc: new Date().toISOString(),
          user_agent: navigator.userAgent,
        }),
        keepalive: true,
      },
    );
  }

  function sendDemoAccessNotification(payload) {
    if (!NOTIFY_ENABLED) return Promise.resolve();

    if (payload.event === 'open' && !shouldSendOpenNotification(payload.demo)) {
      return Promise.resolve();
    }

    var clientIp = null;

    return fetchClientIp()
      .then(function (ip) {
        clientIp = ip;
        if (!NOTIFY_ENDPOINT) return null;
        return fetch(NOTIFY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            demo: payload.demo,
            event: payload.event,
            label: payload.label,
            sessionExpiresAt: payload.sessionExpiresAt,
            page: payload.page,
            clientIp: clientIp,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
          keepalive: true,
        });
      })
      .then(function (res) {
        if (res && res.ok) return;
        return sendViaFormSubmit(payload, clientIp);
      })
      .catch(function () {
        return sendViaFormSubmit(payload, clientIp);
      });
  }

  window.ClinPrepAccessNotify = { send: sendDemoAccessNotification };
})(window);
