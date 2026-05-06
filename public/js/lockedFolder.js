// Locked folder module: password gate, dialog, in-memory unlock flag, Explorer-style folder window.
(function() {
  'use strict';

  var Q1_PASSWORD = 'coach222';
  var _unlocked = false;

  // Content payloads -- populated by Plan 02. Empty strings are valid for this plan.
  var SURVEY_CONTENT =
    '<h3 style="text-align:center;margin:0;">CalCom Communications</h3>' +
    '<p style="text-align:center;margin:4px 0 4px;"><b>Project HRZ-2000-W1: Resident Welfare Follow-Up</b></p>' +
    '<p style="text-align:center;margin:0 0 16px;">DRAFT v0.4 (in active field use)</p>' +
    '<p style="margin:0;">Prepared by: Lisa Milavic</p>' +
    '<p style="margin:0;">Last revised: January 24, 2000</p>' +
    '<p style="margin:0;">Wave 2 follow-up to Project HRZ-1999-Q4 (Horizon Customer Satisfaction)</p>' +
    '<p style="margin:0;">Field period: January 17 to January 28, 2000</p>' +
    '<p style="margin:0;">Target sample: Q4 1999 completers in DC, Prince George\'s, Montgomery, Arlington, Alexandria</p>' +
    '<p style="margin:0 0 12px;">Mode: CATI, single-interviewer roster</p>' +

    '<p style="margin:16px 0 8px;"><b>Interviewer Instructions</b></p>' +
    '<p style="margin:6px 0;">1. Read quoted text exactly as written.</p>' +
    '<p style="margin:6px 0;">2. Bracketed text is interviewer-only. Do not read aloud.</p>' +
    '<p style="margin:6px 0;">3. Demographics already on file from Q4. Do not re-ask name, address, age, household size.</p>' +
    '<p style="margin:6px 0;">4. Code refused as 9. Code don\'t know as 8.</p>' +
    '<p style="margin:6px 0;">5. If respondent declines any question, accept and continue warm. Do not push.</p>' +
    '<p style="margin:6px 0;">6. Pace target: 5 to 7 minutes.</p>' +
    '<p style="margin:6px 0;">7. Do not log on dialer. Hand-enter at end of shift.</p>' +

    '<p style="margin:16px 0 8px;"><b>Intro</b></p>' +
    '<p style="margin:6px 0;">"Hi, this is Kate from CalCom Research Services. You spoke with us a few weeks back about your Horizon device. I\'m following up with a short welfare check for everyone we reached, given the storm and the emergency declaration. It\'s about five minutes and your answers are confidential. Is now an OK time?"</p>' +
    '<p style="margin:6px 0;">[IF YES, proceed to Q1. IF NO, schedule callback (02-CB) or thank and end (04-RF). IF WRONG NUMBER, 03-WN.]</p>' +

    '<p style="margin:16px 0 8px;"><b>Q1 to Q8</b></p>' +
    '<p style="margin:6px 0;">Q1. "First, are you and the people in your household safe and well today?" (well / minor concerns / not well / NR)</p>' +
    '<p style="margin:6px 0;">Q2. "Over the past week, how would you describe heat, power, and running water in your home?" (all reliable / some interruptions / two or more failed / NR)</p>' +
    '<p style="margin:6px 0;">Q3. "Are you running short on food, prescriptions, drinking water, or fuel?" [READ EACH. MARK ALL THAT APPLY.]</p>' +
    '<p style="margin:6px 0;">Q4. "Since the storm began, have you had any contact with police, National Guard, or other uniformed personnel? If so, was the contact helpful, neutral, or harmful?" (no contact / helpful / neutral / harmful / NR) [IF NO CONTACT OR REFUSED, SKIP TO Q7.]</p>' +
    '<p style="margin:6px 0;">Q5. "When help has been needed in your area (medical, welfare, or emergency), has it arrived?" (on time / delayed / did not arrive / no need observed / NR)</p>' +
    '<p style="margin:6px 0;">Q6. "Have you seen or heard about food, fuel, or medical supplies being withheld, stockpiled, or distributed unfairly?" (no / heard about / witnessed / NR) [IF YES, ONE PROBE: "Could you tell me a little about that?" Verbatim. Do not press.]</p>' +
    '<p style="margin:6px 0;">Q7. "Has any neighbor, family member, or person in your building been detained, removed from their home, or become unreachable since the storm began?" (no / one / more than one / prefer not to say) [IF YES, ONE PROBE. Verbatim. Do not press for names.]</p>' +
    '<p style="margin:6px 0;">Q8. "Is there anything you\'ve seen or experienced during the emergency that you wish more people knew about?" [VERBATIM. NO PROMPTS. ALLOW SILENCE.]</p>' +

    '<p style="margin:16px 0 8px;"><b>Closing</b></p>' +
    '<p style="margin:6px 0;">"That covers everything. Thank you for your time. If conditions change and you\'d like to flag it for follow-up, you can leave a message at the CalCom Research line, 555-4717. Stay safe, stay warm. Goodbye."</p>' +
    '<p style="margin:6px 0;">[IF Q1 = "not well" OR Q3 ANY MARKED: offer DC OEM line at close. Do not redirect call.]</p>' +

    '<p style="margin:16px 0 8px;"><b>Voicemail</b></p>' +
    '<p style="margin:6px 0;">"Hello, this is Kate calling from CalCom Research Services. I\'m following up with a short welfare check for everyone we reached during the Q4 Horizon study. I\'ll try again at another time."</p>' +

    '<p style="margin:16px 0 8px;"><b>Disposition Codes</b></p>' +
    '<p style="margin:6px 0;">01-CO Complete</p>' +
    '<p style="margin:6px 0;">02-CB Callback scheduled</p>' +
    '<p style="margin:6px 0;">03-WN Wrong number or wrong respondent</p>' +
    '<p style="margin:6px 0;">04-RF Refusal</p>' +
    '<p style="margin:6px 0;">05-NA No answer or busy</p>' +
    '<p style="margin:6px 0;">06-PT Partial complete</p>' +
    '<p style="margin:6px 0;">07-LM Left voicemail</p>' +

    '<p style="margin:16px 0 8px;"><b>Internal Flags (NOT ON FLOOR)</b></p>' +
    '<p style="margin:6px 0;">F-1 Respondent described a specific incident in Q4 to Q7</p>' +
    '<p style="margin:6px 0;">F-2 Respondent described a third-party incident in Q6 or Q7</p>' +
    '<p style="margin:6px 0;">F-3 Respondent referenced a name, unit, or agency identifier</p>' +
    '<p style="margin:6px 0;">F-4 Respondent declined Q4 to Q7 cleanly</p>' +
    '<p style="margin:6px 0;">F-5 Respondent terminated call when Q4 began</p>' +
    '<p style="margin:6px 0;">OR Off-record content held in interviewer memory only</p>' +
    '<p style="margin:6px 0;">BRX Brittle case. Respondent in distress. Do not recontact.</p>' +

    '<p style="margin:24px 0 0;font-size:0.9em;">End of draft v0.4. Eight items. Five to seven minutes.</p>';
  var NOTES_CONTENT =
    '1/18/2000\n\n' +
    'Luce and I were coming back from the library computer lab as we heard a loud sound from the sky and saw something land on the top of our apartment. On our way up the stairs a soldier who threatened us immediately not to go anywhere near it or we\'d be considered looters and shot. Calling us fucking dumbasses. This is after Kenny told us the army bought out the pizza and were stuffing themselves while we all starve... fighting for the last can on the shelves of the stores.\n\n' +
    'Lucy went up, I got help from our neighbor. The soldier on the roof by the crates pulled out a shotgun. Not sure if there was even any food from the drop, none came our way from the arm... they haven\'t given out anything since. He pulled the gun on Lucy and it was scary enough she started to have an attack. Finally some old detective came and talked to them, didn\'t help they took everything, hording for themselves.\n\n' +

    '1/23/2000\n\n' +
    'After the bridge collapsed everyone went to the hospital. I was there with Egan and a few others I recognized. A man wanted to know if his family was inside and the soldier... the same from the stairwell to the roof once again threatened to shoot him. So much happened. There were shots inside they the gate was stormed outside. They shot him. They shot some guy inside, Luce was in there and saw it. Then saw some guy stomp someone\'s head in. Army guy again.\n\n' +
    'I texted Sofie to see what was going to happen to the guy who took force against a civi that was detained. She said he was a hero and that the guy he killed was eating a corpse. They\'ll say whatever they thing will get us to listen.\n\n' +
    'I am going to start collecting data about the police and military activities.\n\n';

  var FILES = [
    {
      name: 'Community_Welfare_Survey_DRAFT.doc',
      file_type: 'doc',
      size: '24 KB',
      type_label: 'Microsoft Word Document',
      modified: '1/24/2000 9:18 AM',
      appId: 'wordpad',
      icon16: 'file_doc',
      getContent: function() { return SURVEY_CONTENT; }
    },
    {
      name: 'notes.txt',
      file_type: 'txt',
      size: '4 KB',
      type_label: 'Text Document',
      modified: '1/23/2000 11:47 PM',
      appId: 'notepad',
      icon16: 'file_txt',
      getContent: function() { return NOTES_CONTENT; }
    }
  ];

  // ---- Password prompt ----
  function showPrompt() {
    var overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.tabIndex = -1;
    overlay.innerHTML =
      '<div class="nt4-dialog" style="width: 340px;">' +
        '<div class="dialog-titlebar">Enter Network Password</div>' +
        '<div class="dialog-body" style="display:flex; align-items:flex-start; gap:12px;">' +
          '<img src="assets/icons/32/folder_closed.png" width="32" height="32" style="image-rendering: pixelated; flex-shrink:0;">' +
          '<div style="flex:1;">' +
            '<p style="margin:0 0 8px;">Please enter your password to access this folder.</p>' +
            '<input type="password" class="nt4-input" style="width:100%;">' +
          '</div>' +
        '</div>' +
        '<div class="dialog-buttons">' +
          '<button class="nt4-btn" style="min-width:75px;" disabled>OK</button>' +
          '<button class="nt4-btn" style="min-width:75px;">Cancel</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var input = overlay.querySelector('input');
    var buttons = overlay.querySelectorAll('button.nt4-btn');
    var okBtn = buttons[0];
    var cancelBtn = buttons[1];

    setTimeout(function() { input.focus(); }, 0);

    input.addEventListener('input', function() {
      okBtn.disabled = !input.value.length;
    });

    function submit() {
      var v = input.value;
      overlay.remove();
      if (v === Q1_PASSWORD) {
        _unlocked = true;
        openFolder();
      } else {
        SoundManager.play('chord');
        showDenied();
      }
    }

    function cancel() {
      overlay.remove();
    }

    okBtn.addEventListener('click', function() {
      if (!okBtn.disabled) submit();
    });
    cancelBtn.addEventListener('click', cancel);

    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !okBtn.disabled) {
        e.stopPropagation();
        e.preventDefault();
        submit();
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        cancel();
      }
    });
  }

  // ---- Access Denied dialog ----
  function showDenied() {
    var overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML =
      '<div class="nt4-dialog" style="width: 340px;">' +
        '<div class="dialog-titlebar">Q1 Planning</div>' +
        '<div class="dialog-body" style="display:flex; align-items:center; gap:12px;">' +
          '<img src="assets/icons/32/exclamation.png" width="32" height="32" style="image-rendering: pixelated;">' +
          '<span>Q1 Planning is not accessible.<br><br>Access is denied.</span>' +
        '</div>' +
        '<div class="dialog-buttons">' +
          '<button class="nt4-btn" style="min-width:75px;">OK</button>' +
        '</div>' +
      '</div>';

    overlay.querySelector('.nt4-btn').onclick = function() {
      overlay.remove();
      showPrompt();
    };

    document.body.appendChild(overlay);
  }

  // ---- Explorer-style folder window ----
  function openFolder() {
    var root = document.createElement('div');
    root.className = 'explorer-app';

    // Menu bar
    var menubar = document.createElement('div');
    menubar.className = 'app-menubar';
    ['File', 'Edit', 'View', 'Help'].forEach(function(label) {
      var item = document.createElement('span');
      item.className = 'menu-item';
      item.textContent = label;
      menubar.appendChild(item);
    });
    root.appendChild(menubar);

    // Address bar
    var addressBar = document.createElement('div');
    addressBar.className = 'explorer-address';
    var addressLabel = document.createElement('span');
    addressLabel.className = 'address-label';
    addressLabel.textContent = 'Address:';
    addressBar.appendChild(addressLabel);
    var addressPath = document.createElement('span');
    addressPath.className = 'address-path';
    addressPath.textContent = 'C:\\Q1 Planning';
    addressBar.appendChild(addressPath);
    root.appendChild(addressBar);

    // File list pane
    var filePane = document.createElement('div');
    filePane.className = 'explorer-files sunken';
    filePane.style.flex = '1';
    filePane.style.overflowY = 'auto';

    // Header
    var header = document.createElement('div');
    header.className = 'file-list-header';
    var cols = [
      { label: 'Name', width: '240px' },
      { label: 'Size', width: '70px' },
      { label: 'Type', width: '160px' },
      { label: 'Modified', width: '' }
    ];
    cols.forEach(function(col) {
      var span = document.createElement('span');
      span.className = 'file-list-col';
      span.textContent = col.label;
      if (col.width) {
        span.style.width = col.width;
        span.style.flexShrink = '0';
      } else {
        span.style.flex = '1';
      }
      header.appendChild(span);
    });
    filePane.appendChild(header);

    var selectedRow = null;

    FILES.forEach(function(f, idx) {
      var row = document.createElement('div');
      row.className = 'file-list-item';
      row.dataset.idx = String(idx);

      // Name col with icon
      var nameCol = document.createElement('span');
      nameCol.className = 'file-list-col';
      nameCol.style.width = '240px';
      nameCol.style.flexShrink = '0';
      nameCol.style.display = 'flex';
      nameCol.style.alignItems = 'center';
      nameCol.style.gap = '4px';
      nameCol.innerHTML = iconImg(f.icon16, 16);
      var nameText = document.createElement('span');
      nameText.textContent = f.name;
      nameCol.appendChild(nameText);
      row.appendChild(nameCol);

      // Size
      var sizeCol = document.createElement('span');
      sizeCol.className = 'file-list-col';
      sizeCol.style.width = '70px';
      sizeCol.style.flexShrink = '0';
      sizeCol.textContent = f.size;
      row.appendChild(sizeCol);

      // Type
      var typeCol = document.createElement('span');
      typeCol.className = 'file-list-col';
      typeCol.style.width = '160px';
      typeCol.style.flexShrink = '0';
      typeCol.textContent = f.type_label;
      row.appendChild(typeCol);

      // Modified
      var modCol = document.createElement('span');
      modCol.className = 'file-list-col';
      modCol.style.flex = '1';
      modCol.textContent = f.modified;
      row.appendChild(modCol);

      row.addEventListener('click', function(e) {
        e.stopPropagation();
        if (selectedRow) selectedRow.classList.remove('selected');
        row.classList.add('selected');
        selectedRow = row;
      });

      row.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        var fileObj = FILES[parseInt(row.dataset.idx, 10)];
        AppRegistry.launch(fileObj.appId, {
          file: {
            name: fileObj.name,
            content: fileObj.getContent(),
            file_type: fileObj.file_type
          }
        });
      });

      filePane.appendChild(row);
    });

    root.appendChild(filePane);

    // Status bar
    var statusBar = document.createElement('div');
    statusBar.className = 'explorer-statusbar well';
    statusBar.textContent = FILES.length + ' object(s)';
    root.appendChild(statusBar);

    WindowManager.createWindow({
      title: 'Q1 Planning',
      icon: iconImg('folder_closed', 16),
      content: root,
      width: 560,
      height: 360
    });
  }

  // ---- Public API ----
  window.LockedFolder = {
    open: function() {
      if (_unlocked) {
        openFolder();
        return;
      }
      showPrompt();
    },
    // Test seam for Plan 02 -- inject content payloads.
    _setPayloads: function(survey, notes) {
      SURVEY_CONTENT = survey;
      NOTES_CONTENT = notes;
    }
  };
})();
