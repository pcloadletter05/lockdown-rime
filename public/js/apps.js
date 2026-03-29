// AppRegistry, desktop icons, and app launch stubs
// Phase 2 creates stub windows; Phase 3 fills them with real content.

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
    'spreadsheet':   { title: 'Microsoft Excel',             icon: iconImg('file_doc', 16),       width: 650, height: 450 },
    'printqueue':    { title: 'HP LaserJet 4 - \\\\CALCOM-PS01', icon: iconImg('printer', 16),   width: 550, height: 250 }
  },

  launch: function(appId, args) {
    var app = this.apps[appId];
    var content = null;
    var title = null;
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
      title = (args && args.file) ? args.file.name + ' - Excel' : 'Excel';
      width = 650;
      height = 450;
    } else if (appId === 'printqueue') {
      content = buildPrintQueueUI(args);
    }

    if (app || content) {
      WindowManager.createWindow({
        title: title || (app ? app.title : appId),
        icon: app ? app.icon : iconImg('file_doc', 16),
        width: width || (app ? app.width : 400),
        height: height || (app ? app.height : 300),
        content: content
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
  { appId: 'mycomputer', label: 'My Computer',           icon: iconImg('mycomputer', 32) },
  { appId: 'network',    label: 'Network Neighborhood', icon: iconImg('network', 32) },
  { appId: 'iexplore',   label: 'Internet Explorer',    icon: iconImg('iexplore', 32) },
  { appId: 'outlook',    label: 'Inbox',                  icon: iconImg('outlook', 32) }
];

var DESKTOP_ICON_BOTTOM = { appId: 'recycle', label: 'Recycle Bin', icon: iconImg('recycle_bin', 32) };

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
      // Deselect all icons in both containers
      desktop.querySelectorAll('.desktop-icons .desktop-icon.selected, .desktop-icons-bottom .desktop-icon.selected').forEach(function(ic) {
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

// ---- Print Queue ----

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
    th.style.borderBottom = '1px solid #808080';
    th.style.background = '#C0C0C0';
    th.style.fontWeight = 'normal';
    thead.appendChild(th);
  });
  table.appendChild(thead);

  // Stuck job row
  var row = document.createElement('tr');
  row.style.background = '#000080';
  row.style.color = '#FFFFFF';
  ['HORIZON_CATI_SCRIPT_v3.doc', 'Error: PC LOAD LETTER', 'l.milavic', '4', '28 KB', '3:47 PM 12/23/1998'].forEach(function(val) {
    var td = document.createElement('td');
    td.textContent = val;
    td.style.padding = '2px 6px';
    row.appendChild(td);
  });
  table.appendChild(row);

  content.appendChild(table);
  container.appendChild(content);

  // Status bar
  var status = document.createElement('div');
  status.className = 'well';
  status.style.padding = '2px 4px';
  status.style.fontSize = '11px';
  status.style.flexShrink = '0';
  status.style.margin = '2px 4px 4px 4px';
  status.textContent = '1 document(s) in queue';
  container.appendChild(status);

  return container;
}

// ---- Initialization ----

document.addEventListener('DOMContentLoaded', function() {
  renderDesktopIcons();
  EventBus.on('app:launch', function(detail) {
    AppRegistry.launch(detail.appId, detail.args);
  });
});
