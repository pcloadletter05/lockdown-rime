// Taskbar -- Start button, Start menu, system tray clock, window button management
// Communicates with WindowManager via EventBus.

const Taskbar = {
  windowButtons: new Map(), // windowId -> button element
  startMenuOpen: false,
  submenuTimer: null,

  init: function() {
    this.buildTaskbar();
    this.buildStartMenu();
    this.setupEventListeners();
    this.updateClock();
    setInterval(this.updateClock.bind(this), 60000);
  },

  // ---- Taskbar DOM ----
  buildTaskbar: function() {
    var desktop = document.getElementById('desktop');
    if (!desktop) return;

    var taskbar = document.createElement('div');
    taskbar.id = 'taskbar';
    taskbar.className = 'raised';

    // Start button
    var startBtn = document.createElement('button');
    startBtn.id = 'start-button';
    startBtn.className = 'raised';
    startBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
      '<rect x="1" y="1" width="6" height="6" fill="#FF0000"/>' +
      '<rect x="9" y="1" width="6" height="6" fill="#00FF00"/>' +
      '<rect x="1" y="9" width="6" height="6" fill="#0000FF"/>' +
      '<rect x="9" y="9" width="6" height="6" fill="#FFFF00"/>' +
      '</svg> <span>Start</span>';

    startBtn.addEventListener('mousedown', function(e) {
      e.stopPropagation();
      Taskbar.toggleStartMenu();
    });

    taskbar.appendChild(startBtn);

    // Window buttons area
    var taskbarButtons = document.createElement('div');
    taskbarButtons.id = 'taskbar-buttons';
    taskbar.appendChild(taskbarButtons);

    // System tray
    var systemTray = document.createElement('div');
    systemTray.id = 'system-tray';
    systemTray.className = 'well';

    // Speaker icon (decorative)
    var speakerIcon = document.createElement('span');
    speakerIcon.className = 'tray-icon';
    speakerIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none">' +
      '<polygon points="1,4 4,4 7,1 7,11 4,8 1,8" fill="#000000"/>' +
      '<path d="M8,3.5 Q10,6 8,8.5" stroke="#000000" fill="none" stroke-width="1"/>' +
      '</svg>';
    systemTray.appendChild(speakerIcon);

    // Clock
    var clock = document.createElement('span');
    clock.id = 'tray-clock';
    systemTray.appendChild(clock);

    taskbar.appendChild(systemTray);
    desktop.appendChild(taskbar);
  },

  // ---- Start Menu ----
  buildStartMenu: function() {
    var desktop = document.getElementById('desktop');
    if (!desktop) return;

    var menu = document.createElement('div');
    menu.className = 'start-menu raised';
    menu.style.display = 'none';
    menu.id = 'start-menu';

    // Sidebar
    var sidebar = document.createElement('div');
    sidebar.className = 'start-menu-sidebar';
    var sidebarText = document.createElement('span');
    sidebarText.className = 'start-menu-sidebar-text';
    sidebarText.textContent = 'Windows NT';
    sidebar.appendChild(sidebarText);
    menu.appendChild(sidebar);

    // Items container
    var items = document.createElement('div');
    items.className = 'start-menu-items';

    // Programs (with submenu)
    var programs = this._createMenuItem('Programs', this._folderIconSVG(), true);
    var programsSub = document.createElement('div');
    programsSub.className = 'start-submenu raised';
    programsSub.style.display = 'none';

    var programItems = [
      { label: 'Windows Explorer', appId: 'explorer' },
      { label: 'Outlook', appId: 'outlook' },
      { label: 'Internet Explorer', appId: 'iexplore' },
      { label: 'Notepad', appId: 'notepad' }
    ];

    var self = this;
    programItems.forEach(function(item) {
      var subItem = self._createMenuItem(item.label, null, false);
      subItem.addEventListener('click', function() {
        EventBus.emit('app:launch', { appId: item.appId });
        self.closeStartMenu();
      });
      programsSub.appendChild(subItem);
    });

    programs.appendChild(programsSub);
    this._setupSubmenuHover(programs, programsSub);
    items.appendChild(programs);

    // Documents (disabled)
    var docs = this._createMenuItem('Documents', this._docIconSVG(), false);
    docs.classList.add('disabled');
    items.appendChild(docs);

    // Separator
    items.appendChild(this._createSeparator());

    // Settings (with submenu)
    var settings = this._createMenuItem('Settings', this._gearIconSVG(), true);
    var settingsSub = document.createElement('div');
    settingsSub.className = 'start-submenu raised';
    settingsSub.style.display = 'none';

    var cpItem = this._createMenuItem('Control Panel', null, false);
    cpItem.addEventListener('click', function() {
      EventBus.emit('app:launch', { appId: 'control-panel' });
      self.closeStartMenu();
    });
    settingsSub.appendChild(cpItem);

    settings.appendChild(settingsSub);
    this._setupSubmenuHover(settings, settingsSub);
    items.appendChild(settings);

    // Separator
    items.appendChild(this._createSeparator());

    // Shut Down
    var shutDown = this._createMenuItem('Shut Down...', this._shutdownIconSVG(), false);
    shutDown.addEventListener('click', function() {
      self.closeStartMenu();
      self.showShutdownDialog();
    });
    items.appendChild(shutDown);

    menu.appendChild(items);
    desktop.appendChild(menu);
  },

  _createMenuItem: function(label, iconSVG, hasSubmenu) {
    var item = document.createElement('div');
    item.className = 'start-menu-item';

    if (iconSVG) {
      var icon = document.createElement('span');
      icon.className = 'start-menu-item-icon';
      icon.innerHTML = iconSVG;
      item.appendChild(icon);
    }

    var text = document.createElement('span');
    text.className = 'start-menu-item-text';
    text.textContent = label;
    item.appendChild(text);

    if (hasSubmenu) {
      var arrow = document.createElement('span');
      arrow.className = 'start-menu-arrow';
      arrow.textContent = '\u25B6';
      item.appendChild(arrow);
    }

    return item;
  },

  _createSeparator: function() {
    var sep = document.createElement('div');
    sep.className = 'start-menu-separator';
    return sep;
  },

  _setupSubmenuHover: function(parentItem, submenu) {
    var timer = null;

    parentItem.addEventListener('mouseenter', function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        submenu.style.display = '';
      }, 200);
    });

    parentItem.addEventListener('mouseleave', function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        submenu.style.display = 'none';
      }, 200);
    });
  },

  _folderIconSVG: function() {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
      '<path d="M1,3 L6,3 L7,1 L15,1 L15,13 L1,13 Z" fill="#FFCC00" stroke="#996600" stroke-width="1"/>' +
      '</svg>';
  },

  _docIconSVG: function() {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
      '<rect x="2" y="1" width="10" height="14" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>' +
      '<line x1="4" y1="5" x2="10" y2="5" stroke="#000000" stroke-width="1"/>' +
      '<line x1="4" y1="8" x2="10" y2="8" stroke="#000000" stroke-width="1"/>' +
      '</svg>';
  },

  _gearIconSVG: function() {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
      '<circle cx="8" cy="8" r="3" fill="#808080" stroke="#000000" stroke-width="1"/>' +
      '<circle cx="8" cy="8" r="6" fill="none" stroke="#808080" stroke-width="2" stroke-dasharray="3,2"/>' +
      '</svg>';
  },

  _shutdownIconSVG: function() {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">' +
      '<rect x="3" y="2" width="10" height="12" rx="1" fill="#808080" stroke="#000000" stroke-width="1"/>' +
      '<rect x="5" y="4" width="6" height="6" fill="#000080" stroke="#000000" stroke-width="1"/>' +
      '<rect x="6" y="11" width="4" height="2" fill="#C0C0C0"/>' +
      '</svg>';
  },

  // ---- Start Menu Toggle ----
  toggleStartMenu: function() {
    if (this.startMenuOpen) {
      this.closeStartMenu();
    } else {
      this.openStartMenu();
    }
  },

  openStartMenu: function() {
    var menu = document.getElementById('start-menu');
    var btn = document.getElementById('start-button');
    if (!menu || !btn) return;

    menu.style.display = '';
    btn.classList.remove('raised');
    btn.classList.add('pressed');
    this.startMenuOpen = true;
  },

  closeStartMenu: function() {
    var menu = document.getElementById('start-menu');
    var btn = document.getElementById('start-button');
    if (!menu || !btn) return;

    menu.style.display = 'none';
    btn.classList.remove('pressed');
    btn.classList.add('raised');
    this.startMenuOpen = false;

    // Close all submenus
    var subs = menu.querySelectorAll('.start-submenu');
    subs.forEach(function(sub) {
      sub.style.display = 'none';
    });
  },

  // ---- Shut Down ----
  showShutdownDialog: function() {
    var desktop = document.getElementById('desktop');
    if (!desktop) return;

    var overlay = document.createElement('div');
    overlay.className = 'shutdown-dialog-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '20000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.3)';

    var dialog = document.createElement('div');
    dialog.className = 'nt4-dialog shutdown-dialog';

    var titleBar = document.createElement('div');
    titleBar.className = 'dialog-titlebar';
    titleBar.textContent = 'Shut Down Windows';
    dialog.appendChild(titleBar);

    var body = document.createElement('div');
    body.className = 'dialog-body';
    body.textContent = 'Are you sure you want to shut down?';
    dialog.appendChild(body);

    var buttons = document.createElement('div');
    buttons.className = 'dialog-buttons';

    var yesBtn = document.createElement('button');
    yesBtn.className = 'nt4-button';
    yesBtn.textContent = 'Yes';
    yesBtn.addEventListener('click', function() {
      overlay.remove();
      Taskbar.showShutdownScreen();
    });

    var noBtn = document.createElement('button');
    noBtn.className = 'nt4-button';
    noBtn.textContent = 'No';
    noBtn.addEventListener('click', function() {
      overlay.remove();
    });

    buttons.appendChild(yesBtn);
    buttons.appendChild(noBtn);
    dialog.appendChild(buttons);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  },

  showShutdownScreen: function() {
    // Remove everything and show the classic shutdown screen
    var overlay = document.createElement('div');
    overlay.className = 'shutdown-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '30000';
    overlay.style.background = '#000000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    var text = document.createElement('div');
    text.className = 'shutdown-text';
    text.textContent = 'It is now safe to turn off your computer.';
    text.style.fontFamily = '"Courier New", Courier, monospace';
    text.style.color = '#FF8C00';
    text.style.fontSize = '24px';
    text.style.textAlign = 'center';

    overlay.appendChild(text);
    document.body.appendChild(overlay);
  },

  // ---- System Tray Clock ----
  updateClock: function() {
    var clockEl = document.getElementById('tray-clock');
    if (!clockEl) return;
    var mappedTime = TimeEngine.getMappedTime();
    clockEl.textContent = TimeEngine.formatClockTime(mappedTime);
    clockEl.title = TimeEngine.formatFullDate(mappedTime);
  },

  // ---- Window Button Management ----
  setupEventListeners: function() {
    var self = this;

    // Document-level click to dismiss Start menu
    document.addEventListener('mousedown', function(e) {
      if (!self.startMenuOpen) return;
      var menu = document.getElementById('start-menu');
      var btn = document.getElementById('start-button');
      if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        self.closeStartMenu();
      }
    });

    EventBus.on('window:created', function(detail) {
      self.addWindowButton(detail.windowId, detail.title, detail.icon);
    });

    EventBus.on('window:focused', function(detail) {
      self.updateActiveButton(detail.windowId);
    });

    EventBus.on('window:minimized', function(detail) {
      // Button stays but goes to raised state (handled by updateActiveButton via the focus event)
      var btn = self.windowButtons.get(detail.windowId);
      if (btn) {
        btn.classList.remove('pressed');
        btn.classList.add('raised');
      }
    });

    EventBus.on('window:restored', function(detail) {
      // Handled via the window:focused event that follows restore
    });

    EventBus.on('window:closed', function(detail) {
      self.removeWindowButton(detail.windowId);
    });
  },

  addWindowButton: function(windowId, title, icon) {
    var container = document.getElementById('taskbar-buttons');
    if (!container) return;

    var btn = document.createElement('button');
    btn.className = 'taskbar-window-btn pressed';
    btn.dataset.windowId = windowId;

    if (icon) {
      var iconSpan = document.createElement('span');
      iconSpan.className = 'taskbar-btn-icon';
      iconSpan.innerHTML = icon;
      btn.appendChild(iconSpan);
    }

    var titleSpan = document.createElement('span');
    titleSpan.className = 'taskbar-btn-title';
    titleSpan.textContent = title;
    btn.appendChild(titleSpan);

    btn.addEventListener('click', function() {
      var winData = WindowManager.windows.get(windowId);
      if (!winData) return;

      if (WindowManager.activeWindowId === windowId && !winData.isMinimized) {
        // Toggle: clicking active window's taskbar button minimizes it
        WindowManager.minimizeWindow(windowId);
      } else if (winData.isMinimized) {
        WindowManager.restoreWindow(windowId);
      } else {
        WindowManager.focusWindow(windowId);
      }
    });

    container.appendChild(btn);
    this.windowButtons.set(windowId, btn);
  },

  updateActiveButton: function(activeWindowId) {
    this.windowButtons.forEach(function(btn) {
      btn.classList.remove('pressed');
      btn.classList.add('raised');
    });

    if (activeWindowId) {
      var activeBtn = this.windowButtons.get(activeWindowId);
      if (activeBtn) {
        activeBtn.classList.remove('raised');
        activeBtn.classList.add('pressed');
      }
    }
  },

  removeWindowButton: function(windowId) {
    var btn = this.windowButtons.get(windowId);
    if (btn) {
      btn.remove();
      this.windowButtons.delete(windowId);
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  Taskbar.init();
});
