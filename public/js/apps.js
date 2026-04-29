// AppRegistry, desktop icons, file-type routing, and app builders.
// Phase 2: File Explorer, document viewers, PDF viewer, file-type dispatch.

// ---- Icon helper ----
// All icons live in /assets/icons/{size}/{name}.png
// Sizes: 16 (title bars, taskbar, Start menu) and 32 (desktop icons)

function iconImg(name, size) {
  return '<img src="assets/icons/' + size + '/' + name + '.png" width="' + size + '" height="' + size + '" alt="" draggable="false" style="image-rendering: pixelated;">';
}

// ---- Helper to get icon by appId and size ----

function getIcon(appId, size) {
  var nameMap = {
    'mycomputer': 'mycomputer',
    'network': 'network',
    'recycle': 'recycle_bin',
    'outlook': 'outlook',
    'iexplore': 'iexplore',
    'explorer': 'explorer',
    'notepad': 'notepad',
    'control-panel': 'control_panel'
  };
  var name = nameMap[appId];
  if (!name) return '';
  var s = (size === 16) ? 16 : 32;
  return iconImg(name, s);
}

// ============================================================
//  File-Type Router
//  Maps file_type → appId so double-clicking a file in Explorer
//  (or clicking an email attachment) opens the right viewer.
// ============================================================

var FileRouter = {
  // file_type string from files.json → appId in AppRegistry
  typeMap: {
    'doc':  'wordpad',
    'txt':  'notepad',
    'xls':  'spreadsheet',
    'pdf':  'acrobat',
    'bmp':  'imageviewer',
    'htm':  'iexplore',
    'html': 'iexplore'
  },

  // Infer file_type from filename extension as fallback
  inferType: function(filename) {
    if (!filename) return null;
    var dot = filename.lastIndexOf('.');
    if (dot === -1) return null;
    var ext = filename.substring(dot + 1).toLowerCase();
    // Map common extensions to our internal types
    var extMap = {
      'doc': 'doc', 'rtf': 'doc',
      'txt': 'txt', 'log': 'txt', 'ini': 'txt', 'bat': 'txt',
      'xls': 'xls', 'csv': 'xls',
      'pdf': 'pdf',
      'bmp': 'bmp', 'jpg': 'bmp', 'gif': 'bmp', 'png': 'bmp',
      'htm': 'htm', 'html': 'html'
    };
    return extMap[ext] || null;
  },

  // Open a file node from files.json in the appropriate viewer
  openFile: function(fileNode) {
    if (!fileNode || fileNode.type !== 'file') return;

    var ft = fileNode.file_type || this.inferType(fileNode.name);
    var appId = this.typeMap[ft] || 'notepad'; // fallback to notepad

    // For PDFs, ensure the path is passed through
    if (ft === 'pdf' && fileNode.path && !fileNode.content) {
      AppRegistry.launch('acrobat', { file: { name: fileNode.name, path: fileNode.path } });
      return;
    }

    AppRegistry.launch(appId, { file: fileNode });
  },

  // Open an email attachment by filename + optional path
  openAttachment: function(filename, filePath) {
    var ft = this.inferType(filename);
    var appId = this.typeMap[ft] || 'notepad';

    if (ft === 'pdf' && filePath) {
      // PDF with a real file path — open Acrobat directly with the path
      AppRegistry.launch('acrobat', { file: { name: filename, path: filePath } });
    } else {
      // For other types, create a minimal file node
      AppRegistry.launch(appId, { file: { name: filename, content: '(Attachment content not available)' } });
    }
  }
};


// ---- Calculator App ----

function buildCalculatorUI() {
  var displayValue = '0';
  var accumulator = null;
  var pendingOp = null;
  var waitingForOperand = false;
  var memory = 0;
  var lastOp = null;
  var lastOperand = null;
  var errorState = false;

  var container = document.createElement('div');
  container.className = 'calculator-app';
  container.tabIndex = 0;

  // Menu bar
  var menuBar = document.createElement('div');
  menuBar.className = 'app-menubar';

  var editMenu = document.createElement('span');
  editMenu.className = 'menu-item';
  editMenu.textContent = 'Edit';
  editMenu.addEventListener('click', function() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(display.textContent);
    }
  });
  menuBar.appendChild(editMenu);

  var helpMenu = document.createElement('span');
  helpMenu.className = 'menu-item';
  helpMenu.textContent = 'Help';
  helpMenu.style.color = 'var(--disabled-text)';
  helpMenu.style.pointerEvents = 'none';
  menuBar.appendChild(helpMenu);

  container.appendChild(menuBar);

  // Display area
  var displayArea = document.createElement('div');
  displayArea.className = 'calc-display-area';

  var display = document.createElement('div');
  display.className = 'calc-display';
  display.textContent = '0';
  displayArea.appendChild(display);

  var memIndicator = document.createElement('div');
  memIndicator.className = 'calc-memory-indicator';
  memIndicator.textContent = '';
  displayArea.appendChild(memIndicator);

  container.appendChild(displayArea);

  // Button grid
  var btnGrid = document.createElement('div');
  btnGrid.className = 'calc-buttons';

  // Button layout: [label, extraClasses, colSpan]
  var buttons = [
    // Row 0
    ['',          '',         1],
    ['Backspace', 'calc-btn-red', 3],
    ['CE',        'calc-btn-red', 1],
    ['C',         'calc-btn-red', 1],
    // Row 1
    ['MC',  'calc-btn-blue', 1],
    ['7',   '',              1],
    ['8',   '',              1],
    ['9',   '',              1],
    ['/',   'calc-btn-red',  1],
    ['sqrt','calc-btn-blue', 1],
    // Row 2
    ['MR',  'calc-btn-blue', 1],
    ['4',   '',              1],
    ['5',   '',              1],
    ['6',   '',              1],
    ['*',   'calc-btn-red',  1],
    ['%',   'calc-btn-blue', 1],
    // Row 3
    ['MS',  'calc-btn-blue', 1],
    ['1',   '',              1],
    ['2',   '',              1],
    ['3',   '',              1],
    ['-',   'calc-btn-red',  1],
    ['1/x', 'calc-btn-blue', 1],
    // Row 4
    ['M+',  'calc-btn-blue', 1],
    ['0',   '',              2],
    ['.',   '',              1],
    ['+',   'calc-btn-red',  1],
    ['=',   'calc-btn-red',  1]
  ];

  function performOperation(op, a, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) return 'ERROR_DIV_ZERO';
        return a / b;
      default: return b;
    }
  }

  function formatDisplay(value) {
    if (typeof value === 'string') return value;
    var str = parseFloat(value.toPrecision(15)).toString();
    if (str.length > 20) str = str.substring(0, 20);
    return str;
  }

  function updateDisplay() {
    if (errorState) {
      display.textContent = displayValue;
    } else {
      display.textContent = displayValue;
    }
    memIndicator.textContent = memory !== 0 ? 'M' : '';
  }

  function handleButton(label) {
    // Error state guard: only C allowed
    if (errorState) {
      if (label === 'C') {
        displayValue = '0';
        accumulator = null;
        pendingOp = null;
        waitingForOperand = false;
        lastOp = null;
        lastOperand = null;
        errorState = false;
        updateDisplay();
      }
      return;
    }

    // Digits 0-9
    if (label >= '0' && label <= '9') {
      if (waitingForOperand) {
        displayValue = label;
        waitingForOperand = false;
      } else if (displayValue === '0') {
        if (label !== '0') displayValue = label;
      } else {
        if (displayValue.length < 20) displayValue += label;
      }
      updateDisplay();
      return;
    }

    // Decimal point
    if (label === '.') {
      if (waitingForOperand) {
        displayValue = '0.';
        waitingForOperand = false;
      } else if (displayValue.indexOf('.') === -1) {
        displayValue += '.';
      }
      updateDisplay();
      return;
    }

    // Operators
    if (label === '+' || label === '-' || label === '*' || label === '/') {
      var currentVal = parseFloat(displayValue);
      if (accumulator !== null && !waitingForOperand) {
        var result = performOperation(pendingOp, accumulator, currentVal);
        if (result === 'ERROR_DIV_ZERO') {
          displayValue = 'Cannot divide by zero';
          errorState = true;
          updateDisplay();
          return;
        }
        accumulator = result;
        displayValue = formatDisplay(result);
      } else {
        accumulator = currentVal;
      }
      pendingOp = label;
      waitingForOperand = true;
      lastOp = null;
      updateDisplay();
      return;
    }

    // Equals
    if (label === '=') {
      var currentVal = parseFloat(displayValue);
      var result;
      if (lastOp !== null && waitingForOperand) {
        result = performOperation(lastOp, currentVal, lastOperand);
      } else if (accumulator !== null) {
        lastOperand = currentVal;
        lastOp = pendingOp;
        result = performOperation(pendingOp, accumulator, currentVal);
      } else {
        return;
      }
      if (result === 'ERROR_DIV_ZERO') {
        displayValue = 'Cannot divide by zero';
        errorState = true;
        updateDisplay();
        return;
      }
      displayValue = formatDisplay(result);
      accumulator = result;
      pendingOp = null;
      waitingForOperand = true;
      updateDisplay();
      return;
    }

    // C - Clear All
    if (label === 'C') {
      displayValue = '0';
      accumulator = null;
      pendingOp = null;
      waitingForOperand = false;
      lastOp = null;
      lastOperand = null;
      errorState = false;
      updateDisplay();
      return;
    }

    // CE - Clear Entry
    if (label === 'CE') {
      displayValue = '0';
      updateDisplay();
      return;
    }

    // Backspace
    if (label === 'Backspace') {
      if (!waitingForOperand) {
        if (displayValue.length > 1) {
          displayValue = displayValue.slice(0, -1);
          if (displayValue === '-') displayValue = '0';
        } else {
          displayValue = '0';
        }
      }
      updateDisplay();
      return;
    }

    // +/- (negate)
    if (label === '+/-') {
      if (displayValue !== '0' && displayValue !== '0.') {
        if (displayValue.charAt(0) === '-') {
          displayValue = displayValue.substring(1);
        } else {
          displayValue = '-' + displayValue;
        }
      }
      updateDisplay();
      return;
    }

    // sqrt
    if (label === 'sqrt') {
      var val = parseFloat(displayValue);
      if (val < 0) {
        displayValue = 'Invalid input';
        errorState = true;
      } else {
        displayValue = formatDisplay(Math.sqrt(val));
      }
      waitingForOperand = true;
      updateDisplay();
      return;
    }

    // % (percentage)
    if (label === '%') {
      var currentVal = parseFloat(displayValue);
      if (accumulator !== null) {
        currentVal = accumulator * (currentVal / 100);
      }
      displayValue = formatDisplay(currentVal);
      waitingForOperand = true;
      updateDisplay();
      return;
    }

    // 1/x (reciprocal)
    if (label === '1/x') {
      var val = parseFloat(displayValue);
      if (val === 0) {
        displayValue = 'Cannot divide by zero';
        errorState = true;
      } else {
        displayValue = formatDisplay(1 / val);
      }
      waitingForOperand = true;
      updateDisplay();
      return;
    }

    // MC - Memory Clear
    if (label === 'MC') { memory = 0; updateDisplay(); return; }
    // MR - Memory Recall
    if (label === 'MR') { displayValue = formatDisplay(memory); waitingForOperand = true; updateDisplay(); return; }
    // MS - Memory Store
    if (label === 'MS') { memory = parseFloat(displayValue); updateDisplay(); return; }
    // M+ - Memory Add
    if (label === 'M+') { memory = memory + parseFloat(displayValue); updateDisplay(); return; }
  }

  buttons.forEach(function(def) {
    var label = def[0];
    var extraClass = def[1];
    var span = def[2];

    var btn = document.createElement('button');
    btn.className = 'calc-btn raised' + (extraClass ? ' ' + extraClass : '');
    btn.textContent = label;
    if (span > 1) {
      btn.style.gridColumn = 'span ' + span;
    }
    if (label) {
      btn.addEventListener('click', function() { handleButton(label); });
    } else {
      btn.disabled = true;
      btn.style.visibility = 'hidden';
    }
    btnGrid.appendChild(btn);
  });

  container.appendChild(btnGrid);

  // Keyboard support
  container.addEventListener('keydown', function(e) {
    var key = e.key;
    var handled = true;
    if (key >= '0' && key <= '9') {
      handleButton(key);
    } else if (key === '.') {
      handleButton('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleButton(key);
    } else if (key === 'Enter' || key === '=') {
      handleButton('=');
    } else if (key === 'Escape') {
      handleButton('C');
    } else if (key === 'Backspace') {
      handleButton('Backspace');
    } else if (key === 'Delete') {
      handleButton('CE');
    } else {
      handled = false;
    }
    if (handled) e.preventDefault();
  });

  // Focus container for keyboard input
  setTimeout(function() { container.focus(); }, 0);

  return container;
}

// ---- App Registry ----

var AppRegistry = {
  apps: {
    'explorer':      { title: 'Windows Explorer',            icon: iconImg('explorer', 16),       width: 640, height: 480 },
    'outlook':       { title: 'Inbox - Outlook',             icon: iconImg('outlook', 16),        width: 700, height: 500 },
    'iexplore':      { title: 'Microsoft Internet Explorer', icon: iconImg('iexplore', 16),       width: 800, height: 600 },
    'notepad':       { title: 'Notepad',                     icon: iconImg('notepad', 16),        width: 480, height: 360 },
    'mycomputer':    { title: 'My Computer',                 icon: iconImg('mycomputer', 16),     width: 500, height: 400 },
    'control-panel': { title: 'Control Panel',               icon: iconImg('control_panel', 16),  width: 450, height: 350 },
    'wordpad':       { title: 'WordPad',                     icon: iconImg('file_doc', 16),       width: 600, height: 450 },
    'spreadsheet':   { title: 'Microsoft Excel',             icon: iconImg('file_xls', 16),       width: 650, height: 450 },
    'acrobat':       { title: 'Adobe Acrobat Reader',        icon: iconImg('file_pdf', 16),       width: 680, height: 520 },
    'printqueue':    { title: 'HP LaserJet 4 - \\\\CALCOM-PS01', icon: iconImg('printer', 16),   width: 550, height: 250 },
    'winamp':        { title: 'Winamp',                        icon: iconImg('winamp', 16),     width: 275, height: 'auto' },
    'network':       { title: 'Network Neighborhood',          icon: iconImg('network', 16),    width: 640, height: 480 },
    'calculator':    { title: 'Calculator',                     icon: iconImg('calculator', 16), width: 248, height: 310 }
  },

  launch: function(appId, args) {
    var app = this.apps[appId];

    // Singleton enforcement for Winamp
    if (appId === 'winamp' && WinampPlayer.windowId !== null && WindowManager.windows.has(WinampPlayer.windowId)) {
      var winData = WindowManager.windows.get(WinampPlayer.windowId);
      if (winData.isMinimized) {
        WindowManager.restoreWindow(WinampPlayer.windowId);
      } else {
        WindowManager.focusWindow(WinampPlayer.windowId);
      }
      return;
    }

    var content = null;
    var title = null;
    var icon = null;
    var width = null;
    var height = null;

    // Route to app builders
    if (appId === 'explorer' || appId === 'mycomputer') {
      content = buildExplorerUI(args);
    } else if (appId === 'outlook') {
      content = buildEmailUI(args);
    } else if (appId === 'iexplore') {
      content = buildBrowserUI(args);
    } else if (appId === 'wordpad') {
      content = buildWordPadUI(args);
      title = (args && args.file) ? args.file.name + ' - WordPad' : 'WordPad';
      width = 600;
      height = 450;
    } else if (appId === 'notepad') {
      content = buildNotepadUI(args);
      title = (args && args.file) ? args.file.name + ' - Notepad' : 'Notepad';
      width = 480;
      height = 360;
    } else if (appId === 'spreadsheet') {
      content = buildSpreadsheetUI(args);
      title = (args && args.file) ? args.file.name + ' - Microsoft Excel' : 'Microsoft Excel';
      width = 650;
      height = 450;
    } else if (appId === 'acrobat') {
      content = buildAcrobatUI(args);
      title = (args && args.file) ? args.file.name + ' - Adobe Acrobat Reader' : 'Adobe Acrobat Reader';
      width = 680;
      height = 520;
    } else if (appId === 'printqueue') {
      content = buildPrintQueueUI(args);
    } else if (appId === 'winamp') {
      var winampResult = buildWinampUI(args);
      content = winampResult.element;
    } else if (appId === 'network') {
      content = buildNetworkUI(args);
    } else if (appId === 'recycle') {
      content = buildRecycleBinUI(args);
      title = 'Recycle Bin';
      icon = iconImg('recycle_bin', 16);
      width = 620;
      height = 400;
    } else if (appId === 'calculator') {
      content = buildCalculatorUI();
    }

    if (app || content) {
      var winOpts = {
        title: title || (app ? app.title : appId),
        icon: icon || (app ? app.icon : iconImg('file_doc', 16)),
        width: width || (app ? app.width : 400),
        height: height || (app ? app.height : 300),
        content: content
      };
      if (appId === 'winamp') {
        winOpts.statusBar = false;
        winOpts.resizable = false;
        winOpts.maximizable = false;
        winOpts.chromeless = true;
      }
      if (appId === 'calculator') {
        winOpts.resizable = false;
        winOpts.maximizable = false;
        winOpts.statusBar = false;
      }
      var winId = WindowManager.createWindow(winOpts);
      if (appId === 'winamp') {
        WinampPlayer.windowId = winId;
      }
    } else {
      // Fallback for unregistered apps (Network Neighborhood, Recycle Bin, etc.)
      var icon16 = getIcon(appId, 16);
      WindowManager.createWindow({
        title: appId.charAt(0).toUpperCase() + appId.slice(1).replace(/-/g, ' '),
        icon: icon16 || null,
        width: 400,
        height: 300,
        content: null
      });
    }
  }
};


// ---- Desktop Icons ----

var DESKTOP_ICONS = [
  { appId: 'mycomputer', label: 'My Computer',           icon: iconImg('mycomputer', 32) },
  { appId: 'network',    label: 'Network Neighborhood', icon: iconImg('network', 32) },
  { appId: 'iexplore',   label: 'Internet Explorer',    icon: iconImg('iexplore', 32) },
  { appId: 'outlook',    label: 'Inbox',                  icon: iconImg('outlook', 32) },
  { appId: 'notepad',   label: 'notes.txt',              icon: iconImg('file_txt', 32),
    filePath: 'C:\\My Documents\\Personal\\notes.txt' }
];

var DESKTOP_ICON_BOTTOM = { appId: 'recycle', label: 'Recycle Bin', icon: iconImg('recycle_bin_full', 32) };

function findFileByPath(node, targetPath) {
  // Split path like "C:\\My Documents\\Personal\\notes.txt" into segments
  var parts = targetPath.replace(/\\/g, '/').split('/');
  var current = node; // start at root (C:)
  // Skip the drive letter (first segment like "C:")
  for (var i = 1; i < parts.length; i++) {
    if (!current || !current.children) return null;
    var found = null;
    for (var j = 0; j < current.children.length; j++) {
      if (current.children[j].name === parts[i]) {
        found = current.children[j];
        break;
      }
    }
    if (!found) return null;
    current = found;
  }
  return current;
}

function renderDesktopIcons() {
  var desktop = document.getElementById('desktop');
  if (!desktop) return;

  var container = document.createElement('div');
  container.className = 'desktop-icons';

  DESKTOP_ICONS.forEach(function(iconDef) {
    var iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.dataset.appId = iconDef.appId;

    var image = document.createElement('div');
    image.className = 'desktop-icon-image';
    image.innerHTML = iconDef.icon;
    iconEl.appendChild(image);

    var label = document.createElement('span');
    label.className = 'desktop-icon-label';
    label.textContent = iconDef.label;
    iconEl.appendChild(label);

    // Single click: select
    iconEl.addEventListener('click', function(e) {
      e.stopPropagation();
      desktop.querySelectorAll('.desktop-icons .desktop-icon.selected, .desktop-icons-bottom .desktop-icon.selected').forEach(function(ic) {
        ic.classList.remove('selected');
      });
      iconEl.classList.add('selected');
    });

    // Double click: open
    iconEl.addEventListener('dblclick', function(e) {
      e.stopPropagation();
      if (iconDef.filePath) {
        // Desktop icon pointing to a specific file -- find it in files.json and open in appropriate viewer
        fetch('content/files.json').then(function(r) { return r.json(); }).then(function(data) {
          var file = findFileByPath(data.root, iconDef.filePath);
          if (file) {
            var FileRouterRef = typeof FileRouter !== 'undefined' ? FileRouter : null;
            if (FileRouterRef) {
              FileRouterRef.openFile(file);
            } else {
              AppRegistry.launch(iconDef.appId, { file: file });
            }
          }
        });
      } else {
        EventBus.emit('app:launch', { appId: iconDef.appId });
      }
    });

    container.appendChild(iconEl);
  });

  desktop.insertBefore(container, desktop.firstChild);

  // Bottom-anchored Recycle Bin
  var bottomContainer = document.createElement('div');
  bottomContainer.className = 'desktop-icons-bottom';

  var recycleEl = document.createElement('div');
  recycleEl.className = 'desktop-icon';
  recycleEl.dataset.appId = DESKTOP_ICON_BOTTOM.appId;

  var recycleImage = document.createElement('div');
  recycleImage.className = 'desktop-icon-image';
  recycleImage.innerHTML = DESKTOP_ICON_BOTTOM.icon;
  recycleEl.appendChild(recycleImage);

  var recycleLabel = document.createElement('span');
  recycleLabel.className = 'desktop-icon-label';
  recycleLabel.textContent = DESKTOP_ICON_BOTTOM.label;
  recycleEl.appendChild(recycleLabel);

  recycleEl.addEventListener('click', function(e) {
    e.stopPropagation();
    desktop.querySelectorAll('.desktop-icons .desktop-icon.selected, .desktop-icons-bottom .desktop-icon.selected').forEach(function(ic) {
      ic.classList.remove('selected');
    });
    recycleEl.classList.add('selected');
  });

  recycleEl.addEventListener('dblclick', function(e) {
    e.stopPropagation();
    EventBus.emit('app:launch', { appId: DESKTOP_ICON_BOTTOM.appId });
  });

  bottomContainer.appendChild(recycleEl);
  desktop.insertBefore(bottomContainer, desktop.firstChild);
}


// ============================================================
//  WordPad — renders .doc HTML content
// ============================================================

function buildWordPadUI(args) {
  var container = document.createElement('div');
  container.className = 'wordpad-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Insert', 'Format', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Toolbar
  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  var tbItems = [
    { text: 'New', disabled: true },
    { text: 'Open', disabled: true },
    { text: 'Save', disabled: true }
  ];
  tbItems.forEach(function(btn) {
    var el = document.createElement('button');
    el.className = 'toolbar-btn-text raised';
    el.textContent = btn.text;
    if (btn.disabled) el.disabled = true;
    toolbar.appendChild(el);
  });
  container.appendChild(toolbar);

  // Format bar (font controls — decorative)
  var formatBar = document.createElement('div');
  formatBar.className = 'app-toolbar';
  formatBar.style.borderBottom = '1px solid var(--button-shadow)';

  var fontSelect = document.createElement('select');
  fontSelect.className = 'nt4-select';
  fontSelect.style.width = '140px';
  ['Times New Roman', 'Arial', 'Courier New'].forEach(function(f) {
    var opt = document.createElement('option');
    opt.textContent = f;
    opt.selected = (f === 'Times New Roman');
    fontSelect.appendChild(opt);
  });
  formatBar.appendChild(fontSelect);

  var sizeSelect = document.createElement('select');
  sizeSelect.className = 'nt4-select';
  sizeSelect.style.width = '44px';
  sizeSelect.style.marginLeft = '4px';
  ['10', '12', '14', '16'].forEach(function(s) {
    var opt = document.createElement('option');
    opt.textContent = s;
    opt.selected = (s === '12');
    sizeSelect.appendChild(opt);
  });
  formatBar.appendChild(sizeSelect);
  container.appendChild(formatBar);

  // Document content area
  var contentArea = document.createElement('div');
  contentArea.className = 'wordpad-content';

  if (args && args.file && args.file.content) {
    if (typeof args.file.content === 'string') {
      contentArea.innerHTML = args.file.content;
    } else {
      contentArea.textContent = JSON.stringify(args.file.content, null, 2);
    }
  } else {
    contentArea.innerHTML = '';
  }

  container.appendChild(contentArea);
  return container;
}


// ============================================================
//  Notepad — renders .txt plain text
// ============================================================

function buildNotepadUI(args) {
  var container = document.createElement('div');
  container.className = 'notepad-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'Search', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Text area
  var contentArea = document.createElement('pre');
  contentArea.className = 'notepad-content';

  if (args && args.file && args.file.content) {
    if (typeof args.file.content === 'string') {
      contentArea.textContent = args.file.content;
    } else {
      contentArea.textContent = JSON.stringify(args.file.content, null, 2);
    }
  } else {
    contentArea.textContent = '';
  }

  container.appendChild(contentArea);
  return container;
}


// ============================================================
//  Spreadsheet Viewer — renders .xls tabular data
// ============================================================

function buildSpreadsheetUI(args) {
  var container = document.createElement('div');
  container.className = 'spreadsheet-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Data', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Formula bar (decorative)
  var formulaBar = document.createElement('div');
  formulaBar.className = 'formula-bar';
  var cellRef = document.createElement('span');
  cellRef.className = 'cell-ref';
  cellRef.textContent = 'A1';
  formulaBar.appendChild(cellRef);
  var formulaInput = document.createElement('span');
  formulaInput.style.flex = '1';
  formulaInput.style.padding = '1px 4px';
  formulaInput.style.background = 'white';
  formulaInput.innerHTML = '&nbsp;';
  formulaBar.appendChild(formulaInput);
  container.appendChild(formulaBar);

  // Spreadsheet grid
  var scrollArea = document.createElement('div');
  scrollArea.className = 'spreadsheet-content';

  var data = (args && args.file && args.file.content && typeof args.file.content === 'object')
    ? args.file.content : null;

  if (data && data.columns && data.rows) {
    var table = document.createElement('table');
    table.className = 'spreadsheet-grid';

    // Header row
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    // Row number header (blank corner cell)
    var cornerTh = document.createElement('th');
    cornerTh.className = 'row-header';
    cornerTh.textContent = '';
    headerRow.appendChild(cornerTh);

    data.columns.forEach(function(col, i) {
      var th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Data rows
    var tbody = document.createElement('tbody');
    data.rows.forEach(function(row, rowIndex) {
      var tr = document.createElement('tr');
      // Row number
      var rowNum = document.createElement('td');
      rowNum.className = 'row-header';
      rowNum.textContent = (rowIndex + 1).toString();
      tr.appendChild(rowNum);

      row.forEach(function(cellVal) {
        var td = document.createElement('td');
        td.textContent = cellVal;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    scrollArea.appendChild(table);
  } else {
    scrollArea.innerHTML = '<div style="padding: 8px; color: #808080;">(Empty workbook)</div>';
  }

  container.appendChild(scrollArea);
  return container;
}


// ============================================================
//  Adobe Acrobat Reader 4.0 — renders PDFs in an iframe
// ============================================================

function buildAcrobatUI(args) {
  var container = document.createElement('div');
  container.className = 'acrobat-app';

  var pdfPath = '';
  if (args && args.file) {
    // Direct path from attachment_paths or from files.json
    pdfPath = args.file.path || '';
  }

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'Document', 'View', 'Tools', 'Window', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Acrobat toolbar
  var toolbar = document.createElement('div');
  toolbar.className = 'acrobat-toolbar raised';

  // Navigation cluster
  var navCluster = document.createElement('div');
  navCluster.className = 'acrobat-nav-cluster';

  var btnFirst = document.createElement('button');
  btnFirst.className = 'toolbar-btn raised';
  btnFirst.innerHTML = '|&#9664;';
  btnFirst.title = 'First Page';
  navCluster.appendChild(btnFirst);

  var btnPrev = document.createElement('button');
  btnPrev.className = 'toolbar-btn raised';
  btnPrev.innerHTML = '&#9664;';
  btnPrev.title = 'Previous Page';
  navCluster.appendChild(btnPrev);

  var pageInput = document.createElement('input');
  pageInput.className = 'nt4-input acrobat-page-input';
  pageInput.type = 'text';
  pageInput.value = '1';
  pageInput.readOnly = true;
  navCluster.appendChild(pageInput);

  var pageOf = document.createElement('span');
  pageOf.className = 'acrobat-page-label';
  pageOf.textContent = 'of ?';
  navCluster.appendChild(pageOf);

  var btnNext = document.createElement('button');
  btnNext.className = 'toolbar-btn raised';
  btnNext.innerHTML = '&#9654;';
  btnNext.title = 'Next Page';
  navCluster.appendChild(btnNext);

  var btnLast = document.createElement('button');
  btnLast.className = 'toolbar-btn raised';
  btnLast.innerHTML = '&#9654;|';
  btnLast.title = 'Last Page';
  navCluster.appendChild(btnLast);

  toolbar.appendChild(navCluster);

  // Separator
  var sep1 = document.createElement('div');
  sep1.className = 'toolbar-separator';
  toolbar.appendChild(sep1);

  // Zoom controls
  var zoomCluster = document.createElement('div');
  zoomCluster.className = 'acrobat-zoom-cluster';

  var btnZoomOut = document.createElement('button');
  btnZoomOut.className = 'toolbar-btn raised';
  btnZoomOut.textContent = '\u2212';
  btnZoomOut.title = 'Zoom Out';
  zoomCluster.appendChild(btnZoomOut);

  var zoomSelect = document.createElement('select');
  zoomSelect.className = 'nt4-select acrobat-zoom-select';
  ['Fit Width', 'Fit Page', '50%', '75%', '100%', '125%', '150%', '200%'].forEach(function(z) {
    var opt = document.createElement('option');
    opt.textContent = z;
    opt.selected = (z === 'Fit Width');
    zoomSelect.appendChild(opt);
  });
  zoomCluster.appendChild(zoomSelect);

  var btnZoomIn = document.createElement('button');
  btnZoomIn.className = 'toolbar-btn raised';
  btnZoomIn.textContent = '+';
  btnZoomIn.title = 'Zoom In';
  zoomCluster.appendChild(btnZoomIn);

  toolbar.appendChild(zoomCluster);

  // Separator
  var sep2 = document.createElement('div');
  sep2.className = 'toolbar-separator';
  toolbar.appendChild(sep2);

  // Tool buttons (decorative)
  var toolCluster = document.createElement('div');
  toolCluster.className = 'acrobat-tool-cluster';

  var btnHand = document.createElement('button');
  btnHand.className = 'toolbar-btn raised acrobat-tool-active';
  btnHand.innerHTML = '&#9758;';
  btnHand.title = 'Hand Tool';
  toolCluster.appendChild(btnHand);

  var btnSearch = document.createElement('button');
  btnSearch.className = 'toolbar-btn raised';
  btnSearch.innerHTML = '&#128269;';
  btnSearch.title = 'Find';
  btnSearch.style.fontSize = '12px';
  toolCluster.appendChild(btnSearch);

  toolbar.appendChild(toolCluster);

  container.appendChild(toolbar);

  // PDF iframe content area
  var viewerArea = document.createElement('div');
  viewerArea.className = 'acrobat-viewer';

  if (pdfPath) {
    var iframe = document.createElement('iframe');
    iframe.className = 'acrobat-iframe';
    iframe.src = pdfPath;
    iframe.setAttribute('type', 'application/pdf');
    viewerArea.appendChild(iframe);
  } else {
    viewerArea.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #808080; font-size: 12px;">No document loaded.</div>';
  }

  container.appendChild(viewerArea);
  return container;
}


// ============================================================
//  File Explorer — two-pane (tree + file list)
// ============================================================

var _fileSystemData = null;

function loadFileSystem(callback) {
  if (_fileSystemData) { callback(_fileSystemData); return; }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'content/files.json', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      _fileSystemData = JSON.parse(xhr.responseText);
      callback(_fileSystemData);
    }
  };
  xhr.send();
}

function buildExplorerUI(args) {
  var container = document.createElement('div');
  container.className = 'explorer-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Tools', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Toolbar
  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  var btnBack = document.createElement('button');
  btnBack.className = 'toolbar-btn-text raised';
  btnBack.textContent = 'Back';
  btnBack.disabled = true;
  toolbar.appendChild(btnBack);
  var btnUp = document.createElement('button');
  btnUp.className = 'toolbar-btn-text raised';
  btnUp.textContent = 'Up';
  toolbar.appendChild(btnUp);
  container.appendChild(toolbar);

  // Address bar
  var addressBar = document.createElement('div');
  addressBar.className = 'explorer-address';
  var addrLabel = document.createElement('span');
  addrLabel.className = 'address-label';
  addrLabel.textContent = 'Address:';
  addressBar.appendChild(addrLabel);
  var addrPath = document.createElement('span');
  addrPath.className = 'address-path';
  addrPath.textContent = 'C:\\';
  addressBar.appendChild(addrPath);
  container.appendChild(addressBar);

  // Body (tree + file list)
  var body = document.createElement('div');
  body.className = 'explorer-body';

  // Left pane: tree
  var treePane = document.createElement('div');
  treePane.className = 'explorer-tree sunken';

  // Vertical splitter (decorative)
  var splitter = document.createElement('div');
  splitter.style.width = '4px';
  splitter.style.cursor = 'ew-resize';
  splitter.style.background = 'var(--button-face)';
  splitter.style.flexShrink = '0';

  // Right pane: file list
  var filePane = document.createElement('div');
  filePane.className = 'explorer-files sunken';

  body.appendChild(treePane);
  body.appendChild(splitter);
  body.appendChild(filePane);
  container.appendChild(body);

  // Status bar
  var statusBar = document.createElement('div');
  statusBar.className = 'explorer-statusbar well';
  statusBar.textContent = 'Loading...';
  container.appendChild(statusBar);

  // State
  var history = [];
  var currentNode = null;

  // Load filesystem and populate
  loadFileSystem(function(fsData) {
    var rootNode = fsData.root;

    function getPath(node, parent) {
      // Build a simple path string for display
      if (!parent) return node.name + '\\';
      return parent + node.name + '\\';
    }

    function buildTreeNode(node, depth, parentPath) {
      var item = document.createElement('div');
      item.className = 'tree-item';
      item.style.paddingLeft = (4 + depth * 16) + 'px';

      var toggle = document.createElement('span');
      toggle.className = 'tree-toggle';
      if (node.children && node.children.length > 0) {
        toggle.textContent = '+';
      } else {
        toggle.textContent = ' ';
      }
      item.appendChild(toggle);

      var iconSpan = document.createElement('span');
      iconSpan.style.marginRight = '4px';
      var iconName = node.icon || 'folder_closed';
      if (node.type === 'drive') iconName = 'mycomputer';
      iconSpan.innerHTML = iconImg(iconName, 16);
      item.appendChild(iconSpan);

      var label = document.createElement('span');
      label.textContent = node.name;
      item.appendChild(label);

      treePane.appendChild(item);

      var childContainer = document.createElement('div');
      childContainer.style.display = 'none';
      treePane.appendChild(childContainer);

      var expanded = false;

      // Click: navigate to this folder
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        // Select
        treePane.querySelectorAll('.tree-item.selected').forEach(function(el) {
          el.classList.remove('selected');
        });
        item.classList.add('selected');

        if (node.children) {
          navigateTo(node, parentPath);
        }
      });

      // Toggle expand/collapse
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!node.children || node.children.length === 0) return;

        expanded = !expanded;
        toggle.textContent = expanded ? '\u2212' : '+';
        childContainer.style.display = expanded ? 'block' : 'none';

        if (expanded && childContainer.children.length === 0) {
          // Build child tree nodes
          var currentPath = parentPath + node.name + '\\';
          node.children.forEach(function(child) {
            if (child.type === 'folder' || child.type === 'drive') {
              buildTreeNode(child, depth + 1, currentPath);
            }
          });
          // Move new children into childContainer
          // (they were appended to treePane, we need to move them)
        }
      });

      // Auto-expand on first click
      item.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        if (!expanded && node.children && node.children.length > 0) {
          toggle.click();
        }
      });

      // Build children immediately (collapsed) for tree structure
      if (node.children) {
        var currentPath = parentPath + node.name + '\\';
        node.children.forEach(function(child) {
          if (child.type === 'folder' || child.type === 'drive') {
            var childItem = document.createElement('div');
            childItem.style.display = 'contents';
            childContainer.appendChild(childItem);
            buildTreeNodeInto(child, depth + 1, currentPath, childContainer);
          }
        });
      }
    }

    function buildTreeNodeInto(node, depth, parentPath, parentEl) {
      var item = document.createElement('div');
      item.className = 'tree-item';
      item.style.paddingLeft = (4 + depth * 16) + 'px';

      var toggle = document.createElement('span');
      toggle.className = 'tree-toggle';
      var hasFolderChildren = node.children && node.children.some(function(c) {
        return c.type === 'folder';
      });
      toggle.textContent = hasFolderChildren ? '+' : ' ';
      item.appendChild(toggle);

      var iconSpan = document.createElement('span');
      iconSpan.style.marginRight = '4px';
      iconSpan.innerHTML = iconImg(node.icon || 'folder_closed', 16);
      item.appendChild(iconSpan);

      var label = document.createElement('span');
      label.textContent = node.name;
      item.appendChild(label);

      parentEl.appendChild(item);

      var childContainer = document.createElement('div');
      childContainer.style.display = 'none';
      parentEl.appendChild(childContainer);

      var expanded = false;

      item.addEventListener('click', function(e) {
        e.stopPropagation();
        treePane.querySelectorAll('.tree-item.selected').forEach(function(el) {
          el.classList.remove('selected');
        });
        item.classList.add('selected');
        if (node.children) {
          navigateTo(node, parentPath);
        }
      });

      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!hasFolderChildren) return;
        expanded = !expanded;
        toggle.textContent = expanded ? '\u2212' : '+';
        childContainer.style.display = expanded ? 'block' : 'none';

        if (expanded && childContainer.children.length === 0) {
          var currentPath = parentPath + node.name + '\\';
          node.children.forEach(function(child) {
            if (child.type === 'folder') {
              buildTreeNodeInto(child, depth + 1, currentPath, childContainer);
            }
          });
        }
      });
    }

    function navigateTo(node, parentPath) {
      currentNode = node;
      var path = parentPath + node.name + '\\';
      addrPath.textContent = path;

      // Update file list
      filePane.innerHTML = '';

      // Column headers
      var header = document.createElement('div');
      header.className = 'file-list-header';
      var cols = [
        { text: 'Name', width: '45%' },
        { text: 'Size', width: '15%' },
        { text: 'Type', width: '20%' },
        { text: 'Modified', width: '20%' }
      ];
      cols.forEach(function(col) {
        var span = document.createElement('span');
        span.textContent = col.text;
        span.style.width = col.width;
        header.appendChild(span);
      });
      filePane.appendChild(header);

      // List children
      if (node.children) {
        // Folders first, then files
        var folders = [];
        var files = [];
        node.children.forEach(function(child) {
          if (child.type === 'folder') folders.push(child);
          else files.push(child);
        });

        folders.concat(files).forEach(function(child) {
          var row = document.createElement('div');
          row.className = 'file-list-item';

          // Name column
          var nameCol = document.createElement('span');
          nameCol.className = 'file-list-col';
          nameCol.style.width = '45%';
          nameCol.style.display = 'flex';
          nameCol.style.alignItems = 'center';
          nameCol.style.gap = '4px';

          var iconName = child.icon || (child.type === 'folder' ? 'folder_closed' : 'file_doc');
          nameCol.innerHTML = iconImg(iconName, 16) + ' ' + child.name;
          row.appendChild(nameCol);

          // Size column
          var sizeCol = document.createElement('span');
          sizeCol.className = 'file-list-col';
          sizeCol.style.width = '15%';
          sizeCol.textContent = child.size || '';
          row.appendChild(sizeCol);

          // Type column
          var typeCol = document.createElement('span');
          typeCol.className = 'file-list-col';
          typeCol.style.width = '20%';
          if (child.type === 'folder') {
            typeCol.textContent = 'File Folder';
          } else {
            var typeNames = {
              'doc': 'Word Document',
              'txt': 'Text Document',
              'xls': 'Excel Spreadsheet',
              'pdf': 'Adobe Acrobat Document',
              'bmp': 'Bitmap Image'
            };
            typeCol.textContent = typeNames[child.file_type] || 'File';
          }
          row.appendChild(typeCol);

          // Modified column
          var modCol = document.createElement('span');
          modCol.className = 'file-list-col';
          modCol.style.width = '20%';
          modCol.textContent = child.modified || '';
          row.appendChild(modCol);

          // Click: select
          row.addEventListener('click', function(e) {
            e.stopPropagation();
            filePane.querySelectorAll('.file-list-item.selected').forEach(function(el) {
              el.classList.remove('selected');
            });
            row.classList.add('selected');
          });

          // Double-click: open
          row.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            if (child.type === 'folder') {
              navigateTo(child, path);
              // Expand in tree too would be nice but skip for now
            } else {
              FileRouter.openFile(child);
            }
          });

          filePane.appendChild(row);
        });

        // Status bar
        var folderCount = folders.length;
        var fileCount = files.length;
        statusBar.textContent = folderCount + ' folder(s), ' + fileCount + ' file(s)';
      } else {
        statusBar.textContent = '0 object(s)';
      }

      // Back button
      btnBack.disabled = history.length === 0;

      // Up button
      btnUp.onclick = function() {
        if (history.length > 0) {
          var prev = history.pop();
          navigateTo(prev.node, prev.parentPath);
        }
      };
    }

    // Wrap navigateTo to track history
    var _origNavigate = navigateTo;
    navigateTo = function(node, parentPath) {
      if (currentNode && currentNode !== node) {
        // figure out the parent path of the current node — just use address bar
        var curPath = addrPath.textContent;
        // strip trailing node name
        var parts = curPath.split('\\').filter(Boolean);
        parts.pop();
        var pp = parts.length > 0 ? parts.join('\\') + '\\' : '';
        history.push({ node: currentNode, parentPath: pp });
      }
      _origNavigate(node, parentPath);
      btnBack.disabled = history.length === 0;
    };

    // Build tree starting from root
    buildTreeNode(rootNode, 0, '');

    // Navigate to My Documents by default
    var myDocs = rootNode.children ? rootNode.children.find(function(c) {
      return c.name === 'My Documents';
    }) : null;
    if (myDocs) {
      navigateTo(myDocs, rootNode.name + '\\');
    } else {
      navigateTo(rootNode, '');
    }
  });

  return container;
}


// ============================================================
//  Network Neighborhood — Explorer shell for network browsing
// ============================================================

var _networkData = null;

function loadNetworkData(callback) {
  if (_networkData) { callback(_networkData); return; }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'content/network.json', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      _networkData = JSON.parse(xhr.responseText);
      callback(_networkData);
    }
  };
  xhr.send();
}

function findMachine(data, name) {
  for (var i = 0; i < data.machines.length; i++) {
    if (data.machines[i].name === name) return data.machines[i];
  }
  return null;
}

function showAccessDenied(path) {
  var overlay = document.createElement('div');
  overlay.className = 'dialog-overlay';
  overlay.innerHTML =
    '<div class="nt4-dialog" style="width: 340px;">' +
      '<div class="dialog-titlebar">' + path + '</div>' +
      '<div class="dialog-body" style="display: flex; align-items: center; gap: 12px;">' +
        '<img src="assets/icons/32/exclamation.png" width="32" height="32" style="image-rendering: pixelated;">' +
        '<span>' + path + ' is not accessible.<br><br>Access is denied.</span>' +
      '</div>' +
      '<div class="dialog-buttons">' +
        '<button class="nt4-btn" style="min-width: 75px;">OK</button>' +
      '</div>' +
    '</div>';
  overlay.querySelector('.nt4-btn').onclick = function() { overlay.remove(); };
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function buildRecycleBinUI(args) {
  var container = document.createElement('div');
  container.className = 'explorer-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Toolbar (all buttons disabled — open-and-look only)
  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  ['Restore', 'Delete', 'Properties'].forEach(function(label) {
    var btn = document.createElement('button');
    btn.className = 'toolbar-btn-text raised';
    btn.textContent = label;
    btn.disabled = true;
    toolbar.appendChild(btn);
  });
  container.appendChild(toolbar);

  // Address bar
  var addressBar = document.createElement('div');
  addressBar.className = 'explorer-address';
  var addrLabel = document.createElement('span');
  addrLabel.className = 'address-label';
  addrLabel.textContent = 'Address:';
  addressBar.appendChild(addrLabel);
  var addrPath = document.createElement('span');
  addrPath.className = 'address-path';
  addrPath.textContent = 'Recycle Bin';
  addressBar.appendChild(addrPath);
  container.appendChild(addressBar);

  // Body — no tree pane, just the file list
  var body = document.createElement('div');
  body.className = 'explorer-body';
  var filePane = document.createElement('div');
  filePane.className = 'explorer-files sunken';
  filePane.style.flex = '1';
  body.appendChild(filePane);
  container.appendChild(body);

  // Status bar
  var statusBar = document.createElement('div');
  statusBar.className = 'explorer-statusbar well';
  statusBar.textContent = 'Loading...';
  container.appendChild(statusBar);

  // Fetch and render
  fetch('content/recycle-bin.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      renderRecycleBinList(filePane, statusBar, data.items);
    });

  function renderRecycleBinList(pane, sbar, items) {
    // Header row
    var header = document.createElement('div');
    header.className = 'file-list-header';
    var cols = [
      { label: 'Name', width: '200px' },
      { label: 'Original Location', width: '160px' },
      { label: 'Date Deleted', width: '130px' },
      { label: 'Type', flex: true }
    ];
    cols.forEach(function(col) {
      var span = document.createElement('span');
      span.className = 'file-list-col';
      span.textContent = col.label;
      if (col.flex) {
        span.style.flex = '1';
      } else {
        span.style.width = col.width;
        span.style.flexShrink = '0';
      }
      header.appendChild(span);
    });
    pane.appendChild(header);

    // Item rows
    var selectedRow = null;
    items.forEach(function(item) {
      var row = document.createElement('div');
      row.className = 'file-list-item';

      // Name column
      var nameCol = document.createElement('span');
      nameCol.className = 'file-list-col';
      nameCol.style.width = '200px';
      nameCol.style.flexShrink = '0';
      nameCol.style.display = 'flex';
      nameCol.style.alignItems = 'center';
      nameCol.style.gap = '4px';
      nameCol.innerHTML = iconImg('file_doc', 16);
      var nameText = document.createElement('span');
      nameText.textContent = item.name;
      nameCol.appendChild(nameText);
      row.appendChild(nameCol);

      // Original Location column
      var locCol = document.createElement('span');
      locCol.className = 'file-list-col';
      locCol.style.width = '160px';
      locCol.style.flexShrink = '0';
      locCol.textContent = item.originalLocation;
      row.appendChild(locCol);

      // Date Deleted column
      var dateCol = document.createElement('span');
      dateCol.className = 'file-list-col';
      dateCol.style.width = '130px';
      dateCol.style.flexShrink = '0';
      dateCol.textContent = item.dateDeleted;
      row.appendChild(dateCol);

      // Type column
      var typeCol = document.createElement('span');
      typeCol.className = 'file-list-col';
      typeCol.style.flex = '1';
      typeCol.textContent = 'WordPad Document';
      row.appendChild(typeCol);

      // Click — select row
      row.addEventListener('click', function(e) {
        e.stopPropagation();
        if (selectedRow) selectedRow.classList.remove('selected');
        row.classList.add('selected');
        selectedRow = row;
      });

      // Double-click — open in WordPad
      row.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        EventBus.emit('app:launch', {
          appId: 'wordpad',
          args: { file: { name: item.name, content: item.content } }
        });
      });

      pane.appendChild(row);
    });

    sbar.textContent = items.length + ' object(s)';
  }

  return container;
}

function buildNetworkUI(args) {
  var container = document.createElement('div');
  container.className = 'explorer-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Tools', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Toolbar
  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  var btnBack = document.createElement('button');
  btnBack.className = 'toolbar-btn-text raised';
  btnBack.textContent = 'Back';
  btnBack.disabled = true;
  toolbar.appendChild(btnBack);
  var btnUp = document.createElement('button');
  btnUp.className = 'toolbar-btn-text raised';
  btnUp.textContent = 'Up';
  btnUp.disabled = true;
  toolbar.appendChild(btnUp);
  container.appendChild(toolbar);

  // Address bar
  var addressBar = document.createElement('div');
  addressBar.className = 'explorer-address';
  var addrLabel = document.createElement('span');
  addrLabel.className = 'address-label';
  addrLabel.textContent = 'Address:';
  addressBar.appendChild(addrLabel);
  var addrPath = document.createElement('span');
  addrPath.className = 'address-path';
  addrPath.textContent = 'Network Neighborhood';
  addressBar.appendChild(addrPath);
  container.appendChild(addressBar);

  // Body — NO tree pane, just the file/content area
  var body = document.createElement('div');
  body.className = 'explorer-body';
  var filePane = document.createElement('div');
  filePane.className = 'explorer-files sunken';
  filePane.style.flex = '1';
  body.appendChild(filePane);
  container.appendChild(body);

  // Status bar
  var statusBar = document.createElement('div');
  statusBar.className = 'explorer-statusbar well';
  statusBar.textContent = 'Loading...';
  container.appendChild(statusBar);

  // Navigation state
  var navState = {
    level: 'root',
    domain: null,
    machine: null,
    path: [],
    history: []
  };

  // Type name map
  var typeNames = {
    'doc': 'Word Document', 'txt': 'Text Document', 'xls': 'Excel Spreadsheet',
    'pdf': 'Adobe Acrobat Document', 'bmp': 'Bitmap Image', 'jpg': 'JPEG Image',
    'ppt': 'PowerPoint Presentation', 'pst': 'Outlook Data File',
    'mp3': 'MP3 Audio', 'ra': 'RealAudio File', 'm3u': 'Playlist File'
  };

  function buildUNCPath(state) {
    if (state.level === 'root') return 'Network Neighborhood';
    if (state.level === 'entire_network') return 'Entire Network';
    if (state.level === 'domain') return state.domain;
    if (state.level === 'machine') return '\\\\' + state.machine;
    // Folder level: \\MACHINE\share\subfolder (no trailing backslash)
    return '\\\\' + state.machine + '\\' + state.path.join('\\');
  }

  // Address bar display adds trailing backslash at folder level
  function buildAddressPath(state) {
    var p = buildUNCPath(state);
    if (state.level === 'folder') p += '\\';
    return p;
  }

  // --- ICON GRID RENDERER (for root, entire_network, domain levels) ---
  function renderIconGrid(items, gridContainer) {
    gridContainer.innerHTML = '';
    gridContainer.className = 'explorer-files sunken';
    var grid = document.createElement('div');
    grid.className = 'network-icon-grid';

    items.forEach(function(item) {
      var iconDiv = document.createElement('div');
      iconDiv.className = 'network-icon-item';
      var iconSize = item.iconSize || 32;
      var iconName = item.icon || 'mycomputer';
      iconDiv.innerHTML =
        '<div class="network-icon-img">' + iconImg(iconName, iconSize) + '</div>' +
        '<div class="network-icon-label">' + item.name + '</div>';

      iconDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        grid.querySelectorAll('.network-icon-item.selected').forEach(function(el) {
          el.classList.remove('selected');
        });
        iconDiv.classList.add('selected');
      });

      if (item.onDblClick) {
        iconDiv.addEventListener('dblclick', function(e) {
          e.stopPropagation();
          item.onDblClick();
        });
      }

      grid.appendChild(iconDiv);
    });

    grid.addEventListener('click', function() {
      grid.querySelectorAll('.network-icon-item.selected').forEach(function(el) {
        el.classList.remove('selected');
      });
    });

    gridContainer.innerHTML = '';
    gridContainer.appendChild(grid);
  }

  // --- LIST VIEW RENDERER (for machine, folder levels) ---
  function renderListView(children, listContainer) {
    listContainer.innerHTML = '';
    listContainer.className = 'explorer-files sunken';

    var header = document.createElement('div');
    header.className = 'file-list-header';
    var isPrinterList = children.length > 0 && children[0].type === 'printer';

    if (isPrinterList) {
      var nameH = document.createElement('span');
      nameH.className = 'file-list-col';
      nameH.style.flex = '1';
      nameH.textContent = 'Name';
      header.appendChild(nameH);
      var statusH = document.createElement('span');
      statusH.className = 'file-list-col';
      statusH.style.flex = '1';
      statusH.textContent = 'Status';
      header.appendChild(statusH);
    } else {
      ['Name', 'Size', 'Type', 'Modified'].forEach(function(col, i) {
        var h = document.createElement('span');
        h.className = 'file-list-col';
        if (i === 0) h.style.flex = '1';
        else if (i === 1) h.style.width = '80px';
        else h.style.width = '140px';
        h.textContent = col;
        header.appendChild(h);
      });
    }
    listContainer.appendChild(header);

    var sorted = children.slice().sort(function(a, b) {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });

    sorted.forEach(function(child) {
      var row = document.createElement('div');
      row.className = 'file-list-item';

      if (isPrinterList) {
        var nameCol = document.createElement('span');
        nameCol.className = 'file-list-col';
        nameCol.style.flex = '1';
        nameCol.style.display = 'flex';
        nameCol.style.alignItems = 'center';
        nameCol.style.gap = '4px';
        nameCol.innerHTML = iconImg('printer', 16) + ' ' + child.name;
        row.appendChild(nameCol);

        var statusCol = document.createElement('span');
        statusCol.className = 'file-list-col network-printer-status';
        statusCol.style.flex = '1';
        statusCol.textContent = child.status || '';
        row.appendChild(statusCol);
      } else {
        var nameCol = document.createElement('span');
        nameCol.className = 'file-list-col';
        nameCol.style.flex = '1';
        nameCol.style.display = 'flex';
        nameCol.style.alignItems = 'center';
        nameCol.style.gap = '4px';
        var iconName = child.icon || (child.type === 'folder' ? 'folder_closed' : 'file_doc');
        nameCol.innerHTML = iconImg(iconName, 16) + ' ' + child.name;
        row.appendChild(nameCol);

        var sizeCol = document.createElement('span');
        sizeCol.className = 'file-list-col';
        sizeCol.style.width = '80px';
        sizeCol.textContent = child.size || '';
        row.appendChild(sizeCol);

        var typeCol = document.createElement('span');
        typeCol.className = 'file-list-col';
        typeCol.style.width = '140px';
        if (child.type === 'folder') {
          typeCol.textContent = 'File Folder';
        } else if (child.type === 'printer') {
          typeCol.textContent = 'Printer';
        } else {
          typeCol.textContent = typeNames[child.file_type] || 'File';
        }
        row.appendChild(typeCol);

        var modCol = document.createElement('span');
        modCol.className = 'file-list-col';
        modCol.style.width = '140px';
        modCol.textContent = child.modified || '';
        row.appendChild(modCol);
      }

      row.addEventListener('click', function(e) {
        e.stopPropagation();
        listContainer.querySelectorAll('.file-list-item.selected').forEach(function(el) {
          el.classList.remove('selected');
        });
        row.classList.add('selected');
      });

      row.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        if (child.access === 'denied') {
          showAccessDenied(buildUNCPath(navState) + '\\' + child.name);
          return;
        }
        if (child.type === 'folder' && child.children) {
          navState.history.push({
            level: navState.level,
            domain: navState.domain,
            machine: navState.machine,
            path: navState.path.slice()
          });
          navState.path.push(child.name);
          navState.level = 'folder';
          render(data);
        }
      });

      listContainer.appendChild(row);
    });
  }

  // --- MAIN NAVIGATION FUNCTION ---
  var data = null;

  function render(netData) {
    data = netData;
    addrPath.textContent = buildAddressPath(navState);

    btnUp.disabled = (navState.level === 'root');
    btnBack.disabled = (navState.history.length === 0);

    if (navState.level === 'root') {
      var domain = netData.domains[netData.default_domain];
      var items = [
        { name: 'Entire Network', icon: 'network', onDblClick: function() {
          navState.history.push({ level: 'root', domain: null, machine: null, path: [] });
          navState.level = 'entire_network';
          render(netData);
        }}
      ];
      domain.machines.forEach(function(machineName) {
        var m = findMachine(netData, machineName);
        if (m) {
          items.push({
            name: m.name,
            icon: m.icon || (m.type === 'server' ? 'server' : 'mycomputer'),
            onDblClick: function() {
              navState.history.push({ level: 'root', domain: netData.default_domain, machine: null, path: [] });
              navState.machine = m.name;
              navState.level = 'machine';
              render(netData);
            }
          });
        }
      });
      renderIconGrid(items, filePane);
      statusBar.textContent = items.length + ' object(s)';

    } else if (navState.level === 'entire_network') {
      var items = netData.entire_network.map(function(entry) {
        return {
          name: entry.name,
          icon: entry.icon || 'network',
          onDblClick: function() {
            if (netData.domains[entry.name]) {
              navState.history.push({ level: 'entire_network', domain: null, machine: null, path: [] });
              navState.level = 'domain';
              navState.domain = entry.name;
              render(netData);
            }
          }
        };
      });
      renderIconGrid(items, filePane);
      statusBar.textContent = items.length + ' object(s)';

    } else if (navState.level === 'domain') {
      var domainData = netData.domains[navState.domain];
      var items = domainData.machines.map(function(machineName) {
        var m = findMachine(netData, machineName);
        return {
          name: m ? m.name : machineName,
          icon: m ? (m.icon || 'mycomputer') : 'mycomputer',
          onDblClick: function() {
            navState.history.push({ level: 'domain', domain: navState.domain, machine: null, path: [] });
            navState.machine = machineName;
            navState.level = 'machine';
            render(netData);
          }
        };
      });
      renderIconGrid(items, filePane);
      statusBar.textContent = items.length + ' object(s)';

    } else if (navState.level === 'machine') {
      var m = findMachine(netData, navState.machine);
      var shares = m ? m.shares : [];
      renderListView(shares, filePane);
      statusBar.textContent = shares.length + ' object(s)';

    } else if (navState.level === 'folder') {
      var m = findMachine(netData, navState.machine);
      var node = null;
      if (m && m.shares) {
        var current = m.shares;
        for (var i = 0; i < navState.path.length; i++) {
          var found = null;
          for (var j = 0; j < current.length; j++) {
            if (current[j].name === navState.path[i]) {
              found = current[j];
              break;
            }
          }
          if (found && i < navState.path.length - 1) {
            current = found.children || [];
          } else {
            node = found;
          }
        }
      }
      var children = (node && node.children) ? node.children : [];
      renderListView(children, filePane);
      statusBar.textContent = children.length + ' object(s)';
    }
  }

  // Up button handler
  btnUp.onclick = function() {
    if (navState.level === 'folder' && navState.path.length > 1) {
      navState.history.push({
        level: navState.level, domain: navState.domain,
        machine: navState.machine, path: navState.path.slice()
      });
      navState.path.pop();
      render(data);
    } else if (navState.level === 'folder' && navState.path.length === 1) {
      navState.history.push({
        level: navState.level, domain: navState.domain,
        machine: navState.machine, path: navState.path.slice()
      });
      navState.path = [];
      navState.level = 'machine';
      render(data);
    } else if (navState.level === 'machine') {
      navState.history.push({
        level: navState.level, domain: navState.domain,
        machine: navState.machine, path: []
      });
      navState.machine = null;
      navState.level = navState.domain ? 'domain' : 'root';
      render(data);
    } else if (navState.level === 'domain') {
      navState.history.push({
        level: navState.level, domain: navState.domain,
        machine: null, path: []
      });
      navState.domain = null;
      navState.level = 'entire_network';
      render(data);
    } else if (navState.level === 'entire_network') {
      navState.history.push({
        level: navState.level, domain: null, machine: null, path: []
      });
      navState.level = 'root';
      render(data);
    }
  };

  // Back button handler
  btnBack.onclick = function() {
    if (navState.history.length > 0) {
      var prev = navState.history.pop();
      navState.level = prev.level;
      navState.domain = prev.domain;
      navState.machine = prev.machine;
      navState.path = prev.path;
      render(data);
    }
  };

  // Load data and render
  loadNetworkData(function(netData) {
    render(netData);
  });

  return container;
}


// ============================================================
//  Email Client (Outlook 98) — stub, filled in Phase 3
// ============================================================

function buildEmailUI(args) {
  var container = document.createElement('div');
  container.className = 'email-app';

  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Actions', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  ['New', 'Reply', 'Forward', 'Send/Receive'].forEach(function(label) {
    var btn = document.createElement('button');
    btn.className = 'toolbar-btn-text raised';
    btn.textContent = label;
    btn.disabled = (label !== 'Send/Receive');
    toolbar.appendChild(btn);
  });
  container.appendChild(toolbar);

  // Three-pane layout
  var body = document.createElement('div');
  body.className = 'email-body';

  // Left: folders
  var folderPane = document.createElement('div');
  folderPane.className = 'email-folders sunken';

  var _emailData = null;

  function loadEmails(cb) {
    if (_emailData) { cb(_emailData); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'content/emails.json', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        _emailData = JSON.parse(xhr.responseText);
        cb(_emailData);
      }
    };
    xhr.send();
  }

  // Right side: message list + preview
  var rightPane = document.createElement('div');
  rightPane.className = 'email-right';

  var msgList = document.createElement('div');
  msgList.className = 'email-messages sunken';

  var divider = document.createElement('div');
  divider.className = 'email-divider';

  var preview = document.createElement('div');
  preview.className = 'email-preview';

  rightPane.appendChild(msgList);
  rightPane.appendChild(divider);
  rightPane.appendChild(preview);

  body.appendChild(folderPane);
  body.appendChild(rightPane);
  container.appendChild(body);

  // Load and render
  loadEmails(function(data) {
    var folders = ['Inbox', 'Sent Items', 'Drafts', 'Deleted Items'];
    var items = data.items || [];

    function countUnread(folder) {
      return items.filter(function(m) { return m.folder === folder && !m.read; }).length;
    }

    function showFolder(folderName) {
      // Highlight folder
      folderPane.querySelectorAll('.email-folder-item').forEach(function(el) {
        el.classList.toggle('selected', el.dataset.folder === folderName);
      });

      // Filter messages
      var msgs = items.filter(function(m) { return m.folder === folderName; });
      msgs.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

      // Message list header
      msgList.innerHTML = '';
      var header = document.createElement('div');
      header.className = 'email-msg-header';
      [
        { text: '!', width: '20px' },
        { text: 'From', width: '25%' },
        { text: 'Subject', width: '45%' },
        { text: 'Date', width: '25%' }
      ].forEach(function(col) {
        var span = document.createElement('span');
        span.textContent = col.text;
        span.style.width = col.width;
        header.appendChild(span);
      });
      msgList.appendChild(header);

      msgs.forEach(function(msg) {
        var row = document.createElement('div');
        row.className = 'email-msg-item';
        if (!msg.read) row.classList.add('unread');

        // Importance
        var impCol = document.createElement('span');
        impCol.className = 'email-msg-col';
        impCol.style.width = '20px';
        impCol.textContent = msg.attachments && msg.attachments.length > 0 ? '\uD83D\uDCCE' : '';
        row.appendChild(impCol);

        // From
        var fromCol = document.createElement('span');
        fromCol.className = 'email-msg-col';
        fromCol.style.width = '25%';
        // Show just the display name
        var fromName = msg.from.replace(/<[^>]+>/, '').trim();
        fromCol.textContent = fromName;
        row.appendChild(fromCol);

        // Subject
        var subjCol = document.createElement('span');
        subjCol.className = 'email-msg-col';
        subjCol.style.width = '45%';
        subjCol.textContent = msg.subject;
        row.appendChild(subjCol);

        // Date
        var dateCol = document.createElement('span');
        dateCol.className = 'email-msg-col';
        dateCol.style.width = '25%';
        var d = new Date(msg.date);
        dateCol.textContent = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear().toString().substr(2) + ' ' +
          d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        row.appendChild(dateCol);

        row.addEventListener('click', function() {
          msgList.querySelectorAll('.email-msg-item.selected').forEach(function(el) {
            el.classList.remove('selected');
          });
          row.classList.add('selected');
          msg.read = true;
          row.classList.remove('unread');
          showMessage(msg);
        });

        msgList.appendChild(row);
      });

      // Show first message by default
      if (msgs.length > 0) {
        showMessage(msgs[0]);
      } else {
        preview.innerHTML = '';
      }
    }

    function showMessage(msg) {
      preview.innerHTML = '';

      var headers = document.createElement('div');
      headers.className = 'email-preview-headers';
      headers.innerHTML =
        '<div><span class="header-label">From:</span> ' + escHtml(msg.from) + '</div>' +
        '<div><span class="header-label">To:</span> ' + escHtml(msg.to) + '</div>' +
        (msg.cc ? '<div><span class="header-label">Cc:</span> ' + escHtml(msg.cc) + '</div>' : '') +
        '<div><span class="header-label">Date:</span> ' + escHtml(msg.date) + '</div>' +
        '<div><span class="header-label">Subject:</span> ' + escHtml(msg.subject) + '</div>';
      preview.appendChild(headers);

      // Attachment bar
      if (msg.attachments && msg.attachments.length > 0) {
        var attBar = document.createElement('div');
        attBar.className = 'email-attachment-bar';
        var attLabel = document.createElement('span');
        attLabel.textContent = 'Attachments:';
        attLabel.style.fontWeight = 'bold';
        attBar.appendChild(attLabel);

        msg.attachments.forEach(function(attName) {
          var attLink = document.createElement('span');
          attLink.className = 'email-attachment-link';
          attLink.style.cursor = 'pointer';
          attLink.style.textDecoration = 'underline';
          attLink.style.color = '#0000FF';
          attLink.innerHTML = iconImg('file_doc', 16) + ' ' + escHtml(attName);

          attLink.addEventListener('dblclick', function() {
            // Check for attachment_paths (real files)
            var filePath = msg.attachment_paths ? msg.attachment_paths[attName] : null;
            if (filePath) {
              FileRouter.openAttachment(attName, filePath);
            } else {
              // Try to find as a file in the filesystem
              FileRouter.openAttachment(attName, null);
            }
          });

          attBar.appendChild(attLink);
        });

        preview.appendChild(attBar);
      }

      // Body
      var bodyEl = document.createElement('div');
      bodyEl.className = 'email-preview-body';
      // Process quoted text
      var bodyText = msg.body || '';
      var lines = bodyText.split('\n');
      var html = '';
      var inQuote = false;

      lines.forEach(function(line) {
        if (line.startsWith('>')) {
          if (!inQuote) { html += '<div class="email-quoted">'; inQuote = true; }
          html += escHtml(line.substring(1).trim()) + '<br>';
        } else {
          if (inQuote) { html += '</div>'; inQuote = false; }
          html += escHtml(line) + '<br>';
        }
      });
      if (inQuote) html += '</div>';

      bodyEl.innerHTML = html;
      preview.appendChild(bodyEl);
    }

    // Build folder list
    folders.forEach(function(folder) {
      var item = document.createElement('div');
      item.className = 'email-folder-item';
      item.dataset.folder = folder;

      item.innerHTML = iconImg('folder_closed', 16) + ' ' + folder;

      var unread = countUnread(folder);
      if (unread > 0) {
        var badge = document.createElement('span');
        badge.className = 'email-unread-count';
        badge.textContent = '(' + unread + ')';
        item.appendChild(badge);
      }

      item.addEventListener('click', function() {
        showFolder(folder);
      });

      folderPane.appendChild(item);
    });

    // Default to Inbox
    showFolder('Inbox');
  });

  return container;
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


// Browser (IE5) — real implementation lives in browser.js


// ============================================================
//  Print Queue
// ============================================================

function buildPrintQueueUI(args) {
  var container = document.createElement('div');
  container.className = 'printqueue-app';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.height = '100%';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['Printer', 'Document', 'View', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Job list
  var content = document.createElement('div');
  content.className = 'printqueue-content sunken';
  content.style.flex = '1';
  content.style.overflow = 'auto';
  content.style.background = '#FFFFFF';
  content.style.margin = '2px 4px';

  var table = document.createElement('table');
  table.className = 'printqueue-list';
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontSize = '11px';

  // Header row
  var thead = document.createElement('tr');
  ['Document Name', 'Status', 'Owner', 'Pages', 'Size', 'Submitted'].forEach(function(col) {
    var th = document.createElement('th');
    th.textContent = col;
    th.style.textAlign = 'left';
    th.style.padding = '2px 6px';
    th.style.background = 'var(--button-face)';
    th.style.borderBottom = '1px solid var(--button-shadow)';
    th.style.fontWeight = 'normal';
    thead.appendChild(th);
  });
  table.appendChild(thead);

  // Stuck print job — the narratively significant one
  var jobRow = document.createElement('tr');
  var jobData = [
    'HORIZON_CATI_Script_v3.doc',
    'Error: PC LOAD LETTER',
    'l.milavic',
    '3/7',
    '28 KB',
    '12/23/1999 3:47 PM'
  ];
  jobData.forEach(function(val) {
    var td = document.createElement('td');
    td.textContent = val;
    td.style.padding = '2px 6px';
    if (val === 'Error: PC LOAD LETTER') {
      td.style.color = '#FF0000';
    }
    jobRow.appendChild(td);
  });
  table.appendChild(jobRow);

  content.appendChild(table);
  container.appendChild(content);

  return container;
}


// ============================================================
//  Initialization — render desktop icons & wire app:launch
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  renderDesktopIcons();
  EventBus.on('app:launch', function(detail) {
    AppRegistry.launch(detail.appId, detail.args);
  });
});
