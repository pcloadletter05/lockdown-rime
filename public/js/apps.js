// AppRegistry, desktop icons, and app launch stubs
// Phase 2 creates stub windows; Phase 3 fills them with real content.

// ---- Icon SVGs (32x32) ----

var MYCOMPUTER_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<rect x="3" y="3" width="26" height="18" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="5" y="5" width="22" height="14" fill="#000080"/>' +
  '<rect x="12" y="22" width="8" height="3" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="8" y="25" width="16" height="3" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '</svg>';

var NETWORK_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<rect x="1" y="6" width="12" height="10" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="3" y="8" width="8" height="6" fill="#000080"/>' +
  '<rect x="19" y="6" width="12" height="10" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="21" y="8" width="8" height="6" fill="#000080"/>' +
  '<line x1="13" y1="11" x2="19" y2="11" stroke="#000000" stroke-width="2"/>' +
  '<rect x="4" y="17" width="6" height="2" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="22" y="17" width="6" height="2" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '</svg>';

var RECYCLE_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<path d="M8,8 L24,8 L22,28 L10,28 Z" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="6" y="5" width="20" height="3" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="13" y="3" width="6" height="3" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<line x1="13" y1="12" x2="13" y2="24" stroke="#808080" stroke-width="1"/>' +
  '<line x1="16" y1="12" x2="16" y2="24" stroke="#808080" stroke-width="1"/>' +
  '<line x1="19" y1="12" x2="19" y2="24" stroke="#808080" stroke-width="1"/>' +
  '</svg>';

var OUTLOOK_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<rect x="3" y="7" width="26" height="18" fill="#E8D8A0" stroke="#000000" stroke-width="1"/>' +
  '<polyline points="3,7 16,17 29,7" fill="none" stroke="#000000" stroke-width="1"/>' +
  '<line x1="3" y1="25" x2="12" y2="16" stroke="#C0B070" stroke-width="1"/>' +
  '<line x1="29" y1="25" x2="20" y2="16" stroke="#C0B070" stroke-width="1"/>' +
  '</svg>';

var IE_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<circle cx="16" cy="16" r="12" fill="none" stroke="#0000CC" stroke-width="2"/>' +
  '<text x="11" y="22" font-size="18" font-weight="bold" fill="#0000CC" font-family="serif">e</text>' +
  '<ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="#0000CC" stroke-width="1.5" transform="rotate(-30 16 16)"/>' +
  '</svg>';

var EXPLORER_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<path d="M2,8 L13,8 L15,5 L30,5 L30,27 L2,27 Z" fill="#FFCC00" stroke="#996600" stroke-width="1"/>' +
  '<rect x="2" y="10" width="28" height="17" fill="#FFE066" stroke="#996600" stroke-width="1"/>' +
  '</svg>';

var NOTEPAD_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<rect x="5" y="2" width="22" height="28" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>' +
  '<line x1="8" y1="8" x2="24" y2="8" stroke="#000000" stroke-width="1"/>' +
  '<line x1="8" y1="12" x2="24" y2="12" stroke="#000000" stroke-width="1"/>' +
  '<line x1="8" y1="16" x2="24" y2="16" stroke="#000000" stroke-width="1"/>' +
  '<line x1="8" y1="20" x2="20" y2="20" stroke="#000000" stroke-width="1"/>' +
  '<rect x="5" y="2" width="4" height="28" fill="#E0E0FF" stroke="#000000" stroke-width="1"/>' +
  '</svg>';

var SETTINGS_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none">' +
  '<circle cx="16" cy="16" r="6" fill="#808080" stroke="#000000" stroke-width="1"/>' +
  '<circle cx="16" cy="16" r="10" fill="none" stroke="#808080" stroke-width="3" stroke-dasharray="5,3"/>' +
  '</svg>';

// ---- Icon SVGs (16x16 for title bars and taskbar) ----

var MYCOMPUTER_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<rect x="3" y="3" width="26" height="18" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="5" y="5" width="22" height="14" fill="#000080"/>' +
  '<rect x="12" y="22" width="8" height="3" fill="#C0C0C0"/>' +
  '<rect x="8" y="25" width="16" height="3" fill="#C0C0C0"/>' +
  '</svg>';

var NETWORK_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<rect x="1" y="6" width="12" height="10" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="3" y="8" width="8" height="6" fill="#000080"/>' +
  '<rect x="19" y="6" width="12" height="10" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="21" y="8" width="8" height="6" fill="#000080"/>' +
  '<line x1="13" y1="11" x2="19" y2="11" stroke="#000000" stroke-width="2"/>' +
  '</svg>';

var RECYCLE_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<path d="M8,8 L24,8 L22,28 L10,28 Z" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '<rect x="6" y="5" width="20" height="3" rx="1" fill="#C0C0C0" stroke="#000000" stroke-width="1"/>' +
  '</svg>';

var OUTLOOK_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<rect x="3" y="7" width="26" height="18" fill="#E8D8A0" stroke="#000000" stroke-width="1"/>' +
  '<polyline points="3,7 16,17 29,7" fill="none" stroke="#000000" stroke-width="1"/>' +
  '</svg>';

var IE_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<circle cx="16" cy="16" r="12" fill="none" stroke="#0000CC" stroke-width="2"/>' +
  '<text x="11" y="22" font-size="18" font-weight="bold" fill="#0000CC" font-family="serif">e</text>' +
  '</svg>';

var EXPLORER_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<path d="M2,8 L13,8 L15,5 L30,5 L30,27 L2,27 Z" fill="#FFCC00" stroke="#996600" stroke-width="1"/>' +
  '<rect x="2" y="10" width="28" height="17" fill="#FFE066" stroke="#996600" stroke-width="1"/>' +
  '</svg>';

var NOTEPAD_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<rect x="5" y="2" width="22" height="28" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>' +
  '<line x1="8" y1="8" x2="24" y2="8" stroke="#000000" stroke-width="1"/>' +
  '<line x1="8" y1="12" x2="24" y2="12" stroke="#000000" stroke-width="1"/>' +
  '<line x1="8" y1="16" x2="24" y2="16" stroke="#000000" stroke-width="1"/>' +
  '</svg>';

var SETTINGS_SVG_16 = '<svg width="16" height="16" viewBox="0 0 32 32" fill="none">' +
  '<circle cx="16" cy="16" r="6" fill="#808080" stroke="#000000" stroke-width="1"/>' +
  '<circle cx="16" cy="16" r="10" fill="none" stroke="#808080" stroke-width="3" stroke-dasharray="5,3"/>' +
  '</svg>';

// ---- Helper to get icon by appId and size ----

function getIcon(appId, size) {
  var icons16 = {
    'mycomputer': MYCOMPUTER_SVG_16,
    'network': NETWORK_SVG_16,
    'recycle': RECYCLE_SVG_16,
    'outlook': OUTLOOK_SVG_16,
    'iexplore': IE_SVG_16,
    'explorer': EXPLORER_SVG_16,
    'notepad': NOTEPAD_SVG_16,
    'control-panel': SETTINGS_SVG_16
  };
  var icons32 = {
    'mycomputer': MYCOMPUTER_SVG,
    'network': NETWORK_SVG,
    'recycle': RECYCLE_SVG,
    'outlook': OUTLOOK_SVG,
    'iexplore': IE_SVG,
    'explorer': EXPLORER_SVG,
    'notepad': NOTEPAD_SVG,
    'control-panel': SETTINGS_SVG
  };
  if (size === 16) return icons16[appId] || '';
  return icons32[appId] || '';
}

// ---- App Registry ----

var AppRegistry = {
  apps: {
    'explorer':      { title: 'Windows Explorer',            icon: EXPLORER_SVG_16,  width: 640, height: 480 },
    'outlook':       { title: 'Inbox - Outlook',             icon: OUTLOOK_SVG_16,   width: 700, height: 500 },
    'iexplore':      { title: 'Microsoft Internet Explorer', icon: IE_SVG_16,        width: 800, height: 600 },
    'notepad':       { title: 'Notepad',                     icon: NOTEPAD_SVG_16,   width: 480, height: 360 },
    'mycomputer':    { title: 'My Computer',                 icon: MYCOMPUTER_SVG_16, width: 500, height: 400 },
    'control-panel': { title: 'Control Panel',               icon: SETTINGS_SVG_16,  width: 450, height: 350 }
  },

  launch: function(appId, args) {
    var app = this.apps[appId];
    if (app) {
      WindowManager.createWindow({
        title: app.title,
        icon: app.icon,
        width: app.width,
        height: app.height,
        content: null
      });
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
  { appId: 'mycomputer', label: 'My Computer',           icon: MYCOMPUTER_SVG },
  { appId: 'network',    label: 'Network\nNeighborhood', icon: NETWORK_SVG },
  { appId: 'recycle',    label: 'Recycle Bin',            icon: RECYCLE_SVG },
  { appId: 'outlook',    label: 'Inbox',                  icon: OUTLOOK_SVG },
  { appId: 'iexplore',   label: 'Internet\nExplorer',    icon: IE_SVG }
];

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
      // Deselect all
      container.querySelectorAll('.desktop-icon.selected').forEach(function(ic) {
        ic.classList.remove('selected');
      });
      iconEl.classList.add('selected');
    });

    // Double click: open
    iconEl.addEventListener('dblclick', function(e) {
      e.stopPropagation();
      EventBus.emit('app:launch', { appId: iconDef.appId });
    });

    container.appendChild(iconEl);
  });

  // Insert before other children so icons are behind windows
  desktop.insertBefore(container, desktop.firstChild);
}

// ---- Initialization ----

document.addEventListener('DOMContentLoaded', function() {
  renderDesktopIcons();
  EventBus.on('app:launch', function(detail) {
    AppRegistry.launch(detail.appId, detail.args);
  });
});
