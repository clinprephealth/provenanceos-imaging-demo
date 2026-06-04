/**
 * ProvenanceOS imaging demo — access gate
 *
 * Uses the same session storage as clinprephealth-demo on clinprephealth.github.io,
 * so one login unlocks both demos for 7 days on the same browser.
 *
 * To disable: set GATE_ENABLED = false and redeploy, or remove gate.js / gate.css
 * from the HTML pages.
 */
(function () {
  'use strict';

  var GATE_ENABLED = true;
  var STORAGE_KEY = 'clinprep-demo-gate';
  var SESSION_DAYS = 7;
  var ACCESS_CODES = [
    { code: 'HIApreview26', label: 'Indu — HIA preview' },
  ];

  function readSession() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var session = JSON.parse(raw);
      if (!session.expiresAt || Date.now() > session.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return session;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function validateCode(input) {
    var normalized = input.trim().toLowerCase();
    for (var i = 0; i < ACCESS_CODES.length; i++) {
      if (ACCESS_CODES[i].code.toLowerCase() === normalized) {
        var grantedAt = Date.now();
        return {
          grantedAt: grantedAt,
          expiresAt: grantedAt + SESSION_DAYS * 24 * 60 * 60 * 1000,
          label: ACCESS_CODES[i].label,
        };
      }
    }
    return null;
  }

  function writeSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function removeGate(overlay) {
    document.body.classList.remove('demo-gate-active');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  function notifyAccess(event, session) {
    if (window.ClinPrepAccessNotify && session) {
      window.ClinPrepAccessNotify.send({
        demo: 'provenanceos-imaging',
        event: event,
        label: session.label,
        sessionExpiresAt: session.expiresAt,
        page: window.location.pathname.split('/').pop() || 'index.html',
      });
    }
  }

  function onAccessGranted(session) {
    notifyAccess('login', session);
  }

  function onSessionOpen(session) {
    notifyAccess('open', session);
  }

  function showGate() {
    var session = readSession();
    if (!GATE_ENABLED) return;

    if (session) {
      onSessionOpen(session);
      return;
    }

    document.body.classList.add('demo-gate-active');

    var overlay = document.createElement('div');
    overlay.id = 'demo-gate-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'demo-gate-title');
    overlay.innerHTML =
      '<div class="gate-card">' +
        '<p class="gate-brand">ProvenanceOS · imaging demo</p>' +
        '<h1 class="gate-title" id="demo-gate-title">Private preview</h1>' +
        '<p class="gate-subtitle">Enter your access code to view this demo.</p>' +
        '<form id="demo-gate-form">' +
          '<label for="demo-gate-code">Access code</label>' +
          '<input type="password" id="demo-gate-code" autocomplete="current-password" placeholder="Enter access code" />' +
          '<p class="gate-error" id="demo-gate-error" aria-live="polite"></p>' +
          '<button type="submit">Continue</button>' +
        '</form>' +
        '<p class="gate-note">Access is valid for 7 days on this device after entry.</p>' +
      '</div>';

    document.body.appendChild(overlay);

    var form = document.getElementById('demo-gate-form');
    var input = document.getElementById('demo-gate-code');
    var error = document.getElementById('demo-gate-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      error.textContent = '';

      var session = validateCode(input.value);
      if (!session) {
        error.textContent = 'That access code isn\'t recognized. Please check your invitation.';
        return;
      }

      writeSession(session);
      removeGate(overlay);
      onAccessGranted(session);
    });

    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showGate);
  } else {
    showGate();
  }
})();
