// Locked folder module: password gate, dialog, in-memory unlock flag, Explorer-style folder window.
(function() {
  'use strict';

  var Q1_PASSWORD = 'coach222';
  var _unlocked = false;

  // Content payloads -- populated by Plan 02. Empty strings are valid for this plan.
  var SURVEY_CONTENT =
    '<h3 style="text-align:center;margin:0;">CalCom Communications</h3>' +
    '<p style="text-align:center;margin:4px 0 16px;"><b>Community Welfare Survey -- DRAFT v0.3</b></p>' +
    '<p style="margin:0;">Prepared by: Lisa Milavic</p>' +
    '<p style="margin:0 0 12px;">Last revised: January 22, 2000</p>' +
    '<p style="margin:0 0 16px;">Interviewer reads aloud. Circle or mark the respondent\'s answer. Open response items may be transcribed verbatim. If respondent declines to answer any item, mark NR and continue.</p>' +

    '<p style="margin:16px 0 8px;"><b>Section A: Household and Community Welfare</b></p>' +

    '<p style="margin:6px 0;">A1. In the past 14 days, how often has your household run short of food? (never short / sometimes short / often short / NR)</p>' +
    '<p style="margin:6px 0;">A2. How would you describe the reliability of heat and utilities at your residence over the past 14 days? (stable / intermittent / out / NR)</p>' +
    '<p style="margin:6px 0;">A3. Please tell us the composition of your household. Record number of adults (18 to 64), number of children (under 18), and number of dependents aged 65 or older.</p>' +
    '<p style="margin:6px 0;">A4. Are you aware of the following community resources in your area? Mark Y or N for each: (a) food bank, (b) warming center, (c) public library, (d) community medical clinic.</p>' +
    '<p style="margin:6px 0;">A5. Over the past 30 days, how would you rate your sense of safety in your immediate neighborhood? (1 = very safe, 2 = safe, 3 = neutral, 4 = unsafe, 5 = very unsafe)</p>' +
    '<p style="margin:6px 0;">A6. Are you currently able to reach essential services (grocery, pharmacy, clinic) on foot from your residence? (Y / N; if N, briefly note reason)</p>' +
    '<p style="margin:6px 0;">A7. In the past 7 days, how often have you had contact with neighbors? (daily / several times / once / not at all / NR)</p>' +
    '<p style="margin:6px 0;">A8. In the past 14 days, has any member of your household missed a scheduled medication or medical appointment? (Y / N; if Y, briefly note reason)</p>' +

    '<p style="margin:16px 0 8px;"><b>Section B: Emergency Services and Government Response</b></p>' +

    '<p style="margin:6px 0;">B1. Are you aware of the current State of Emergency provisions in effect in your area? (Y / N / NR)</p>' +
    '<p style="margin:6px 0;">B2. In the past 14 days, how many checkpoints have you encountered while traveling? Record count and general locations if respondent volunteers them.</p>' +
    '<p style="margin:6px 0;">B3. Have you observed military or uniformed personnel present at any aid distribution site you have attended or witnessed? (yes / no / not applicable; if yes, briefly describe).</p>' +
    '<p style="margin:6px 0;">B4. What items, if any, were distributed at aid events you attended or observed? Open response. Prompt examples if needed: food, water, blankets, medical supplies, other.</p>' +
    '<p style="margin:6px 0;">B5. Have any rationing rules or distribution limits been imposed on you or your household by an official party? (Y / N; if Y, briefly describe).</p>' +
    '<p style="margin:6px 0;">B6. Have you or any household member witnessed force used during a medical emergency in the past 30 days? (Y / N; if Y, briefly describe. Prompt: force may include physical restraint, weapon display, or physical harm.)</p>' +
    '<p style="margin:6px 0;">B7. How confident are you in official information sources regarding the current emergency? (1 = very confident, 2 = confident, 3 = neutral, 4 = not confident, 5 = not at all confident)</p>' +

    '<p style="margin:24px 0 0;font-size:0.9em;">End of draft v0.3. Pending review and pilot test.</p>';
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
      modified: '1/22/2000 3:14 PM',
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
