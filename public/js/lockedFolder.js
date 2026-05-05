// Locked folder module: password gate, dialog, in-memory unlock flag, Explorer-style folder window.
(function() {
  'use strict';

  var Q1_PASSWORD = 'coach222';
  var _unlocked = false;

  // Content payloads -- populated by Plan 02. Empty strings are valid for this plan.
  var SURVEY_CONTENT = '';
  var NOTES_CONTENT = '';

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
