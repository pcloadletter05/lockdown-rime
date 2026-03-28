// WindowManager -- creates, tracks, and manipulates NT4-style windows
// Communicates lifecycle events via EventBus.

function initDrag(titleBar, windowEl) {
  let offsetX, offsetY, isDragging = false;

  titleBar.addEventListener('mousedown', function(e) {
    if (e.target.closest('.nt4-titlebar-btn')) return;
    isDragging = true;

    // If maximized, unmaximize first and recalculate offsets
    const winId = windowEl.id;
    const winData = WindowManager.windows.get(winId);
    if (winData && winData.isMaximized) {
      // Calculate proportional X position within the window
      const proportionX = e.clientX / window.innerWidth;
      WindowManager.unmaximizeWindow(winId);
      // Reposition so cursor stays proportional within the restored window
      const restoredWidth = parseInt(windowEl.style.width, 10) || 400;
      windowEl.style.left = (e.clientX - restoredWidth * proportionX) + 'px';
      windowEl.style.top = '0px';
    }

    offsetX = e.clientX - windowEl.offsetLeft;
    offsetY = e.clientY - windowEl.offsetTop;
    e.preventDefault();
    document.body.classList.add('dragging');
    window.getSelection().removeAllRanges();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    var newX = e.clientX - offsetX;
    var newY = e.clientY - offsetY;
    var taskbarH = 28;
    newY = Math.max(0, Math.min(newY, window.innerHeight - taskbarH - 20));
    newX = Math.max(-windowEl.offsetWidth + 100, Math.min(newX, window.innerWidth - 100));
    windowEl.style.left = newX + 'px';
    windowEl.style.top = newY + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove('dragging');
    }
  });

  window.addEventListener('blur', function() {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove('dragging');
    }
  });
}

const WindowManager = {
  windows: new Map(),
  topZIndex: 100,
  cascadeOffset: 0,
  activeWindowId: null,

  createWindow: function(opts) {
    var id = opts.id || ('win-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5));
    var title = opts.title || 'Untitled';
    var icon = opts.icon || null;
    var width = opts.width || 400;
    var height = opts.height || 300;
    var content = opts.content || '';

    // Calculate cascade position
    var x = 50 + 30 * this.cascadeOffset;
    var y = 50 + 30 * this.cascadeOffset;
    if (x > window.innerWidth / 2 || y > (window.innerHeight - 28) / 2) {
      this.cascadeOffset = 0;
      x = 50;
      y = 50;
    }
    this.cascadeOffset++;

    // Build window DOM
    var windowEl = document.createElement('div');
    windowEl.className = 'nt4-window';
    windowEl.id = id;
    windowEl.style.left = x + 'px';
    windowEl.style.top = y + 'px';
    windowEl.style.width = width + 'px';
    windowEl.style.height = height + 'px';

    // Title bar
    var titleBarEl = document.createElement('div');
    titleBarEl.className = 'nt4-titlebar';

    if (icon) {
      var iconEl = document.createElement('span');
      iconEl.className = 'titlebar-icon';
      iconEl.style.width = '16px';
      iconEl.style.height = '16px';
      iconEl.style.flexShrink = '0';
      iconEl.style.display = 'inline-flex';
      iconEl.style.alignItems = 'center';
      iconEl.style.marginRight = '4px';
      iconEl.innerHTML = icon;
      titleBarEl.appendChild(iconEl);
    }

    var titleEl = document.createElement('span');
    titleEl.className = 'titlebar-title';
    titleEl.textContent = title;
    titleEl.style.flex = '1';
    titleEl.style.overflow = 'hidden';
    titleEl.style.textOverflow = 'ellipsis';
    titleEl.style.whiteSpace = 'nowrap';
    titleBarEl.appendChild(titleEl);

    var buttonsEl = document.createElement('div');
    buttonsEl.className = 'nt4-titlebar-buttons';

    var minBtn = document.createElement('button');
    minBtn.className = 'nt4-titlebar-btn minimize';
    minBtn.addEventListener('click', function() {
      WindowManager.minimizeWindow(id);
    });

    var maxBtn = document.createElement('button');
    maxBtn.className = 'nt4-titlebar-btn maximize';
    maxBtn.addEventListener('click', function() {
      WindowManager.maximizeWindow(id);
    });

    var closeBtn = document.createElement('button');
    closeBtn.className = 'nt4-titlebar-btn close';
    closeBtn.addEventListener('click', function() {
      WindowManager.closeWindow(id);
    });

    buttonsEl.appendChild(minBtn);
    buttonsEl.appendChild(maxBtn);
    buttonsEl.appendChild(closeBtn);
    titleBarEl.appendChild(buttonsEl);

    windowEl.appendChild(titleBarEl);

    // Content area
    var contentEl = document.createElement('div');
    contentEl.className = 'window-content';
    if (typeof content === 'string' && content) {
      contentEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentEl.appendChild(content);
    }
    windowEl.appendChild(contentEl);

    // Status bar
    var statusBar = document.createElement('div');
    statusBar.className = 'window-statusbar well';
    var statusText = document.createElement('span');
    statusText.textContent = 'Ready';
    statusBar.appendChild(statusText);
    windowEl.appendChild(statusBar);

    // Attach drag handler
    initDrag(titleBarEl, windowEl);

    // Focus on mousedown anywhere in window
    var self = this;
    windowEl.addEventListener('mousedown', function() {
      self.focusWindow(id);
    });

    // Add to DOM
    document.getElementById('desktop').appendChild(windowEl);

    // Store in windows Map
    this.windows.set(id, {
      element: windowEl,
      title: title,
      icon: icon,
      isMinimized: false,
      isMaximized: false,
      savedPosition: null
    });

    // Focus and emit
    this.focusWindow(id);
    EventBus.emit('window:created', { windowId: id, title: title, icon: icon });

    return id;
  },

  focusWindow: function(id) {
    if (id === null || !this.windows.has(id)) return;

    this.topZIndex++;
    var winData = this.windows.get(id);
    winData.element.style.zIndex = this.topZIndex;

    // Set all title bars to inactive, then activate the target
    this.windows.forEach(function(data) {
      var tb = data.element.querySelector('.nt4-titlebar');
      if (tb) tb.classList.add('inactive');
    });
    var targetTb = winData.element.querySelector('.nt4-titlebar');
    if (targetTb) targetTb.classList.remove('inactive');

    this.activeWindowId = id;
    EventBus.emit('window:focused', { windowId: id });
  },

  minimizeWindow: function(id) {
    var winData = this.windows.get(id);
    if (!winData) return;

    winData.element.style.display = 'none';
    winData.isMinimized = true;

    // If this was the active window, focus the topmost visible window
    if (this.activeWindowId === id) {
      var topId = this._findTopVisibleWindow();
      if (topId) {
        this.focusWindow(topId);
      } else {
        this.activeWindowId = null;
        EventBus.emit('window:focused', { windowId: null });
      }
    }

    EventBus.emit('window:minimized', { windowId: id });
  },

  restoreWindow: function(id) {
    var winData = this.windows.get(id);
    if (!winData) return;

    winData.element.style.display = '';
    winData.isMinimized = false;
    this.focusWindow(id);
    EventBus.emit('window:restored', { windowId: id });
  },

  maximizeWindow: function(id) {
    var winData = this.windows.get(id);
    if (!winData) return;

    // Toggle behavior: if already maximized, unmaximize
    if (winData.isMaximized) {
      this.unmaximizeWindow(id);
      return;
    }

    // Save current position/size
    winData.savedPosition = {
      left: winData.element.style.left,
      top: winData.element.style.top,
      width: winData.element.style.width,
      height: winData.element.style.height
    };

    winData.element.style.left = '0px';
    winData.element.style.top = '0px';
    winData.element.style.width = '100vw';
    winData.element.style.height = 'calc(100vh - 28px)';
    winData.isMaximized = true;

    // Change glyph to restore icon
    var maxBtn = winData.element.querySelector('.nt4-titlebar-btn.maximize');
    if (maxBtn) maxBtn.classList.add('restore');

    this.focusWindow(id);
  },

  unmaximizeWindow: function(id) {
    var winData = this.windows.get(id);
    if (!winData || !winData.savedPosition) return;

    winData.element.style.left = winData.savedPosition.left;
    winData.element.style.top = winData.savedPosition.top;
    winData.element.style.width = winData.savedPosition.width;
    winData.element.style.height = winData.savedPosition.height;
    winData.isMaximized = false;

    var maxBtn = winData.element.querySelector('.nt4-titlebar-btn.maximize');
    if (maxBtn) maxBtn.classList.remove('restore');
  },

  closeWindow: function(id) {
    var winData = this.windows.get(id);
    if (!winData) return;

    winData.element.remove();
    this.windows.delete(id);

    // If this was the active window, focus topmost visible
    if (this.activeWindowId === id) {
      var topId = this._findTopVisibleWindow();
      if (topId) {
        this.focusWindow(topId);
      } else {
        this.activeWindowId = null;
      }
    }

    EventBus.emit('window:closed', { windowId: id });
  },

  _findTopVisibleWindow: function() {
    var topZ = -1;
    var topId = null;
    this.windows.forEach(function(data, wid) {
      if (!data.isMinimized) {
        var z = parseInt(data.element.style.zIndex, 10) || 0;
        if (z > topZ) {
          topZ = z;
          topId = wid;
        }
      }
    });
    return topId;
  }
};

// Desktop initialization
document.addEventListener('DOMContentLoaded', function() {
  var desktop = document.getElementById('desktop');
  if (!desktop) return;

  // Click on desktop background deselects all icons
  desktop.addEventListener('click', function(e) {
    if (e.target === desktop) {
      var icons = desktop.querySelectorAll('.desktop-icon.selected');
      icons.forEach(function(icon) {
        icon.classList.remove('selected');
      });
    }
  });
});
