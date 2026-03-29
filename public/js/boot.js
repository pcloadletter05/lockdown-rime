// Boot sequence: POST -> NT Boot Loader -> Starting Windows NT -> Ctrl+Alt+Delete -> Login
// Async state machine. Each stage is skippable via click/keypress.
// Return visitors skip entirely via localStorage flag.

/* === Core Utilities === */

function interruptibleSleep(ms) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms);
    const handler = () => {
      clearTimeout(timer);
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
      resolve();
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
  });
}

function waitForInput() {
  return new Promise(resolve => {
    const handler = () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
      resolve();
    };
    document.addEventListener('click', handler);
    document.addEventListener('keydown', handler);
  });
}

function setBootScreen(className, content) {
  var screen = document.getElementById('boot-screen');
  screen.innerHTML = '';
  var div = document.createElement('div');
  div.className = className;
  if (typeof content === 'string') {
    div.innerHTML = content;
  } else {
    div.appendChild(content);
  }
  screen.appendChild(div);
  return div;
}

/* === Viewport Gate === */

function checkViewport() {
  if (window.innerWidth < 800 || window.innerHeight < 600) {
    document.getElementById('boot-screen').style.display = 'none';
    var gate = document.getElementById('viewport-gate');
    gate.style.display = 'block';
    gate.innerHTML = '';
    var dialog = document.createElement('div');
    dialog.className = 'nt4-dialog viewport-gate';
    dialog.innerHTML =
      '<div class="dialog-titlebar"><span>System Error</span></div>' +
      '<div class="dialog-body">' +
        '<div class="dialog-icon">\u26A0</div>' +
        '<div>' +
          '<p style="margin-bottom:8px">This experience requires a minimum display resolution of 800\u00D7600 pixels.</p>' +
          '<p>Please resize your browser window or visit from a desktop computer.</p>' +
        '</div>' +
      '</div>' +
      '<div class="dialog-buttons">' +
        '<button class="nt4-button" onclick="location.reload()">OK</button>' +
      '</div>';
    gate.appendChild(dialog);
    document.body.style.background = '#008080';
    return false;
  }
  return true;
}

/* === Return Visitor Check === */

function isReturnVisitor() {
  try {
    return localStorage.getItem('nt4_booted') === '1';
  } catch (e) {
    return false;
  }
}

function setBootedFlag() {
  try {
    localStorage.setItem('nt4_booted', '1');
  } catch (e) {
    // Silently fail -- next visit will show boot again
  }
}

/* === Password Validation === */

var _k = 'aG9yaXpvbg==';
function validatePassword(input) {
  return input === atob(_k);
}

/* === Memory Count Animation (requestAnimationFrame) === */

function animateMemoryCount(element, targetKB, durationMs) {
  return new Promise(resolve => {
    var start = performance.now();
    function frame(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / durationMs, 1);
      var current = Math.floor(targetKB * progress);
      element.textContent = 'Memory Test:  ' + current + 'K';
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        element.textContent = 'Memory Test:  ' + targetKB + 'K OK';
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

/* === Stage 1: POST Screen === */

async function postScreen() {
  var container = setBootScreen('boot-post', '');

  var lines = [
    'Award Modular BIOS v4.60PG',
    'Copyright (C) 1984-99, Award Software, Inc.',
    '',
    'CalCom Tower Workstation - PENTIUM-II MMX CPU at 350MHz',
    ''
  ];

  // Render initial lines immediately
  container.textContent = lines.join('\n') + '\n';

  // Memory count line
  var memLine = document.createElement('span');
  memLine.textContent = 'Memory Test:  0K';
  container.appendChild(memLine);

  var skipped = false;
  var skipHandler = function() {
    skipped = true;
    document.removeEventListener('click', skipHandler);
    document.removeEventListener('keydown', skipHandler);
  };
  document.addEventListener('click', skipHandler, { once: true });
  document.addEventListener('keydown', skipHandler, { once: true });

  // Animate memory count (~1.5s) or skip
  await Promise.race([
    animateMemoryCount(memLine, 131072, 1500),
    new Promise(function(resolve) {
      (function check() {
        if (skipped) { resolve(); return; }
        setTimeout(check, 50);
      })();
    })
  ]);

  // Ensure final state
  memLine.textContent = 'Memory Test:  131072K OK';

  // Remove skip listeners if still active
  document.removeEventListener('click', skipHandler);
  document.removeEventListener('keydown', skipHandler);

  if (skipped) return;

  var remainingLines = [
    '',
    'Detecting Primary Master   ... WDC AC28400R',
    'Detecting Primary Slave    ... ATAPI CD-ROM',
    'Detecting Secondary Master ... None',
    'Detecting Secondary Slave  ... None',
    '',
    'Press DEL to enter SETUP',
    '12/23/1998-i440BX-W977-2A69KA0CC-00'
  ];

  for (var i = 0; i < remainingLines.length; i++) {
    container.appendChild(document.createTextNode('\n' + remainingLines[i]));
    await interruptibleSleep(100);
  }

  await interruptibleSleep(800);
}

/* === Stage 2: NT Boot Loader === */

async function bootLoader() {
  var content =
    'OS Loader V4.01\n' +
    '\n' +
    'Please select the operating system to start:\n' +
    '\n' +
    '  <span class="highlight">Windows NT Workstation Version 4.00</span>\n' +
    '  Windows NT Workstation Version 4.00 [VGA mode]\n' +
    '\n' +
    'Use \u2191 and \u2193 to move the highlight to your choice.\n' +
    'Press Enter to choose.\n' +
    '\n' +
    'Seconds until highlighted choice will be started automatically: <span id="boot-countdown">5</span>';

  setBootScreen('boot-ntldr', content);

  var countdownEl = document.getElementById('boot-countdown');
  var count = 5;
  var done = false;

  var countdownPromise = new Promise(function(resolve) {
    var interval = setInterval(function() {
      count--;
      countdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });

  await Promise.race([countdownPromise, waitForInput()]);
}

/* === Stage 3: Starting Windows NT === */

async function startingNT() {
  var content =
    '<p>Microsoft (R) Windows NT (TM)</p>' +
    '<p>Version 4.0</p>' +
    '<br>' +
    '<p>Starting Windows NT...</p>' +
    '<p class="progress-dots">.</p>';

  var div = setBootScreen('boot-starting', content);
  var dotsSpan = div.querySelector('.progress-dots');
  var dotCount = 0;
  var dotInterval = setInterval(function() {
    dotCount = (dotCount % 5) + 1;
    dotsSpan.textContent = '.'.repeat(dotCount);
  }, 400);

  await interruptibleSleep(2000);
  clearInterval(dotInterval);
}

/* === Stage 4: Ctrl+Alt+Delete === */

async function ctrlAltDelScreen() {
  var content =
    '<p style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">Windows NT</p>' +
    '<p>Press Ctrl+Alt+Delete to log on.</p>';

  var div = setBootScreen('boot-security', content);

  // Show hint after 3 seconds of no input
  var hintTimeout = setTimeout(function() {
    var hint = document.createElement('p');
    hint.textContent = '(Click anywhere to continue)';
    hint.style.cssText = 'margin-top: 24px; font-size: 11px; opacity: 0.7;';
    div.appendChild(hint);
  }, 3000);

  await waitForInput();
  clearTimeout(hintTimeout);
}

/* === Login Helpers === */

function waitForLoginSubmit() {
  return new Promise(function(resolve) {
    var passwordField = document.getElementById('login-password');
    var okButton = document.getElementById('login-ok');

    function submit() {
      okButton.removeEventListener('click', handleClick);
      passwordField.removeEventListener('keydown', handleKey);
      resolve(passwordField.value);
    }
    function handleClick() { submit(); }
    function handleKey(e) { if (e.key === 'Enter') submit(); }

    okButton.addEventListener('click', handleClick);
    passwordField.addEventListener('keydown', handleKey);
  });
}

async function showLogonError() {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 1001; background: transparent;';
  overlay.innerHTML =
    '<div class="nt4-dialog logon-error" style="width: 420px;">' +
      '<div class="dialog-titlebar"><span>Logon Message</span></div>' +
      '<div class="dialog-body" style="display: flex; gap: 12px; align-items: flex-start;">' +
        '<img src="assets/icons/32/exclamation.png" alt="" class="dialog-icon-img" onerror="this.outerHTML=\'<span class=&quot;dialog-icon&quot;>&#9888;</span>\'">' +
        '<p style="margin: 0;">The system could not log you on. Make sure your user name and domain are correct, then type your password again. Letters in passwords must be typed using the correct case.<br><br>Make sure that Caps Lock is not accidentally on.</p>' +
      '</div>' +
      '<div class="dialog-buttons">' +
        '<button class="nt4-button" id="error-ok">OK</button>' +
      '</div>' +
    '</div>';
  document.getElementById('boot-screen').appendChild(overlay);

  await new Promise(function(resolve) {
    document.getElementById('error-ok').addEventListener('click', function() {
      overlay.remove();
      resolve();
    }, { once: true });
  });
}

/* === Stage 5: Login Dialog === */

async function loginDialog() {
  var dialogHTML =
    '<div class="nt4-dialog" style="width: 340px;">' +
      '<div class="dialog-titlebar"><span>Logon Information</span></div>' +
      '<div class="dialog-body">' +
        '<div style="background: var(--active-title); color: white; padding: 8px 12px; margin-bottom: 12px; text-align: center; font-weight: bold;">' +
          '<img src="assets/calcom/calcom_logo.png" width="80" style="display: block; margin: 0 auto 6px; background: white; padding: 3px;">' +
          'Windows NT' +
        '</div>' +
        '<table style="width: 100%;">' +
          '<tr>' +
            '<td style="padding: 4px 8px 4px 0; white-space: nowrap;">User name:</td>' +
            '<td style="padding: 4px 0;"><input type="text" class="nt4-input" value="l.milavic" readonly style="width: 100%;"></td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 4px 8px 4px 0; white-space: nowrap;">From:</td>' +
            '<td style="padding: 4px 0;">' +
              '<select class="nt4-select" style="width: 100%;">' +
                '<option selected>CALCOM</option>' +
                '<option>CALCOM-PC</option>' +
              '</select>' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 4px 8px 4px 0; white-space: nowrap;">Password:</td>' +
            '<td style="padding: 4px 0;"><input type="password" class="nt4-input" id="login-password" value="" style="width: 100%;"></td>' +
          '</tr>' +
        '</table>' +
      '</div>' +
      '<div class="dialog-buttons">' +
        '<button class="nt4-button" id="login-ok">OK</button>' +
        '<button class="nt4-button" disabled>Cancel</button>' +
        '<button class="nt4-button" disabled>Help</button>' +
        '<button class="nt4-button" disabled>Shut Down</button>' +
      '</div>' +
    '</div>';

  setBootScreen('boot-login', dialogHTML);

  // Focus password field and wait for valid login
  document.getElementById('login-password').focus();

  while (true) {
    var password = await waitForLoginSubmit();
    if (validatePassword(password)) {
      break;
    }
    await showLogonError();
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }

  // Show loading personal settings
  setBootScreen('boot-loading-settings',
    '<p>Loading your personal settings...</p>');

  await interruptibleSleep(1500);
}

/* === Return Visitor Flow === */

async function returnVisitorBoot() {
  setBootScreen('boot-loading-settings',
    '<p>Loading your personal settings...</p>');
  await interruptibleSleep(1500);
  window.location.href = 'desktop.html';
}

/* === Main Boot Sequence === */

async function bootSequence() {
  await postScreen();
  await bootLoader();
  await startingNT();
  await ctrlAltDelScreen();
  await loginDialog();
  setBootedFlag();

  window.location.href = 'desktop.html';
}

document.addEventListener('DOMContentLoaded', function() {
  if (!checkViewport()) return;
  if (isReturnVisitor()) {
    returnVisitorBoot();
  } else {
    bootSequence();
  }
});
