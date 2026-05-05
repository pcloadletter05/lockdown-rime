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
    '1/15/2000\n\n' +
    'Ran into Lucy at the library again. She was at one of the back carrels with her sister. I had the corner machine, dialed in to my workstation, working through call sheets. The library is quieter than I expected for a Saturday in this weather. Maybe twenty people total.\n\n' +
    'Lucy waved me over on her way out. She said she has been wanting to talk to someone she trusts and asked if I had a few minutes later in the week. I told her any time. She looked tired. Not just storm tired. Something underneath it.\n\n' +
    'I told her I would be at the library most days now while the bridge is closed. She said she would find me. Her sister stayed back by the window the whole time and did not come over.\n\n' +
    'Writing this down so I remember exactly what she said. I do not want to color it later.\n\n' +

    '1/19/2000\n\n' +
    'Lucy found me at the library this afternoon. We sat in the periodicals room where nobody else was. She talked for about forty minutes. I am putting it down here as close to her words as I can while it is fresh.\n\n' +
    'She said the building she lives in had a drop two days ago. On the roof. Not the ground floor, the roof. She said she and her sister went up because someone in the building told them aid was coming and to bring something to carry it in. They brought two canvas bags.\n\n' +
    'Her words: "There was no food. No water. Nothing for people. They opened the crates on the roof and it was guns. Long guns and short ones, in foam. That was the whole drop."\n\n' +
    'She said the soldiers were in full kit, faces covered. Four of them. One of them told her and her sister to back away from the crates and not to say a word about what they saw. She said he used the word twins. "He pointed at us and said you twins stay back." She said the way he said it scared her more than the rest of it because it meant he had been watching them long enough to know.\n\n' +
    'And then this part. She said one of the soldiers had a shotgun across his chest and when she did not move fast enough he swung it down and for a second the barrel was on her. She said she does not know if he meant to point it at her or if it was just where his body went, but it was on her, and she froze, and then he lowered it and told them to go back downstairs.\n\n' +
    'I asked her if anyone else from the building saw it. She said two of the older men on her floor were on the stairwell and turned around when they heard the soldiers shouting. She thinks they saw enough.\n\n' +
    'This does not match anything CalCom has been told about the EO 13152 distributions. Nothing matches it. I do not know what to do with this yet. I am writing it down.\n\n' +

    '1/22/2000\n\n' +
    'Second long talk with Lucy. She came to the library specifically to find me. Her sister waited in the lobby this time.\n\n' +
    'She told me about something that happened near the hospital on Friday. There was a small crowd outside the emergency entrance, people trying to get inside, the doors were being controlled. She said a man on the sidewalk had a seizure. He went down hard, hit the curb, started shaking. People around him backed up to give him room.\n\n' +
    'Her words: "Two soldiers came over. They did not check him. They did not call anyone. One of them put a boot on his chest and the other one stomped on his head. They stomped him. In front of all of us."\n\n' +
    'She said he stopped moving. She does not know if he died there or later. The soldiers stood over him for a minute and then walked back to the line at the doors. Nobody from the hospital came out.\n\n' +
    'Then this. She said two days later cops were going around the block telling people the man had been "eating a corpse" when the soldiers found him. That was the story being passed at the corner store and at the bus shelter and at the laundromat. Eating a corpse. She said it plainly was not true. She was ten feet away. He was on the sidewalk having a seizure and they killed him for it, and then somebody decided the story needed to be that he was a cannibal so the boots made sense.\n\n' +
    'I asked her if she would say any of this to anyone official. She laughed at that. Not a real laugh.\n\n' +
    'I am keeping this with the draft. Both of these together or not at all.\n\n' +

    '1/23/2000\n\n' +
    'Working late from the library again. Storm has not let up. I am keeping these notes and the draft together in one place, somewhere out of sight, where I can find them and nobody else will. I am not sure yet what I am building. I just know I do not want any of this to be lost or smoothed over by the time someone asks.\n\n' +
    'Lucy asked me yesterday whether I thought what she told me would matter to anyone. I told her I did not know yet. That was the honest answer. I am still telling myself it is the honest answer.\n';

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
