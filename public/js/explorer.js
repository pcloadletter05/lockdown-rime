// File Explorer — two-pane layout with tree navigation and details file list
// Loads file system data from content/files.json

var _filesCache = null;

var FILE_TYPE_VIEWERS = {
  'doc': 'wordpad',
  'txt': 'notepad',
  'xls': 'spreadsheet',
  'pdf': 'acrobat'
};

var FILE_TYPE_NAMES = {
  'doc': 'WordPad Document',
  'txt': 'Text Document',
  'xls': 'Excel Spreadsheet',
  'pdf': 'Adobe Acrobat Document'
};

function loadFiles() {
  if (_filesCache) {
    return Promise.resolve(_filesCache);
  }
  return fetch('content/files.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      _filesCache = data;
      return data;
    });
}

function resolveFolder(root, pathArray) {
  var node = root;
  for (var i = 0; i < pathArray.length; i++) {
    if (!node.children) return null;
    var found = null;
    for (var j = 0; j < node.children.length; j++) {
      if (node.children[j].name === pathArray[i]) {
        found = node.children[j];
        break;
      }
    }
    if (!found) return null;
    node = found;
  }
  return node;
}

function buildExplorerUI(args) {
  var container = document.createElement('div');
  container.className = 'explorer-app';

  var currentPath = [];
  var treePane = null;
  var filePane = null;
  var addressPath = null;
  var statusBar = null;

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

  // Toolbar
  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  ['Back', 'Forward', 'Up'].forEach(function(label) {
    var btn = document.createElement('button');
    btn.className = 'toolbar-btn raised';
    btn.textContent = label === 'Back' ? '\u2190' : label === 'Forward' ? '\u2192' : '\u2191';
    btn.title = label;
    if (label === 'Up') {
      btn.addEventListener('click', function() {
        if (currentPath.length > 0) {
          currentPath.pop();
          navigateTo(currentPath.slice());
        }
      });
    }
    toolbar.appendChild(btn);
  });
  var sep = document.createElement('div');
  sep.className = 'toolbar-separator';
  toolbar.appendChild(sep);
  container.appendChild(toolbar);

  // Address bar
  var addressBar = document.createElement('div');
  addressBar.className = 'explorer-address';
  var addressLabel = document.createElement('span');
  addressLabel.className = 'address-label';
  addressLabel.textContent = 'Address:';
  addressBar.appendChild(addressLabel);
  addressPath = document.createElement('span');
  addressPath.className = 'address-path';
  addressPath.textContent = 'C:\\';
  addressBar.appendChild(addressPath);
  container.appendChild(addressBar);

  // Body with tree and file list
  var body = document.createElement('div');
  body.className = 'explorer-body';

  treePane = document.createElement('div');
  treePane.className = 'explorer-tree sunken';

  filePane = document.createElement('div');
  filePane.className = 'explorer-files sunken';

  body.appendChild(treePane);
  body.appendChild(filePane);
  container.appendChild(body);

  // Status bar
  statusBar = document.createElement('div');
  statusBar.className = 'explorer-statusbar well';
  statusBar.textContent = '0 object(s)';
  container.appendChild(statusBar);

  function updateAddress() {
    var path = 'C:\\';
    if (currentPath.length > 0) {
      path += currentPath.join('\\');
    }
    addressPath.textContent = path;
  }

  function navigateTo(pathArray) {
    currentPath = pathArray;
    updateAddress();
    renderFileList();
    highlightTreeItem();
  }

  function highlightTreeItem() {
    var items = treePane.querySelectorAll('.tree-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('selected');
    }
    // Find the tree item matching currentPath
    var targetPath = currentPath.join('/');
    for (var i = 0; i < items.length; i++) {
      if (items[i].dataset.path === targetPath) {
        items[i].classList.add('selected');
        break;
      }
    }
  }

  function renderTree(root) {
    treePane.innerHTML = '';
    renderTreeNode(root, treePane, 0, []);
  }

  function renderTreeNode(node, parentEl, depth, path) {
    if (node.type !== 'drive' && node.type !== 'folder') return;

    var itemRow = document.createElement('div');
    itemRow.className = 'tree-item';
    itemRow.style.paddingLeft = (4 + depth * 16) + 'px';
    itemRow.dataset.path = path.join('/');

    var hasFolderChildren = node.children && node.children.some(function(c) {
      return c.type === 'folder';
    });

    // Toggle span
    var toggle = document.createElement('span');
    toggle.className = 'tree-toggle';
    if (hasFolderChildren) {
      toggle.textContent = '+';
    } else {
      toggle.textContent = '';
    }
    itemRow.appendChild(toggle);

    // Icon
    var iconSpan = document.createElement('span');
    iconSpan.style.marginRight = '4px';
    iconSpan.style.display = 'inline-flex';
    iconSpan.style.alignItems = 'center';
    if (node.type === 'drive') {
      iconSpan.innerHTML = iconImg('mycomputer', 16);
    } else {
      iconSpan.innerHTML = iconImg('folder_closed', 16);
    }
    itemRow.appendChild(iconSpan);

    // Name
    var nameSpan = document.createElement('span');
    nameSpan.textContent = node.name;
    itemRow.appendChild(nameSpan);

    parentEl.appendChild(itemRow);

    // Children container
    var childContainer = null;
    if (node.children && node.children.length > 0) {
      childContainer = document.createElement('div');
      childContainer.className = 'tree-children';
      childContainer.style.display = 'none';

      node.children.forEach(function(child) {
        if (child.type === 'folder') {
          var childPath = path.concat(child.name);
          renderTreeNode(child, childContainer, depth + 1, childPath);
        }
      });
      parentEl.appendChild(childContainer);
    }

    // Expand root (C:) by default
    if (node.type === 'drive' && childContainer) {
      childContainer.style.display = 'block';
      toggle.textContent = hasFolderChildren ? '-' : '';
      iconSpan.innerHTML = iconImg('mycomputer', 16);
    }

    // Toggle click
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!childContainer || !hasFolderChildren) return;
      var isOpen = childContainer.style.display !== 'none';
      childContainer.style.display = isOpen ? 'none' : 'block';
      toggle.textContent = isOpen ? '+' : '-';
      if (node.type !== 'drive') {
        iconSpan.innerHTML = iconImg(isOpen ? 'folder_closed' : 'folder_open', 16);
      }
    });

    // Click folder name to navigate
    itemRow.addEventListener('click', function(e) {
      currentPath = path.slice();
      updateAddress();
      renderFileList();
      highlightTreeItem();

      // Expand this node too
      if (childContainer && childContainer.style.display === 'none' && hasFolderChildren) {
        childContainer.style.display = 'block';
        toggle.textContent = '-';
        if (node.type !== 'drive') {
          iconSpan.innerHTML = iconImg('folder_open', 16);
        }
      }
    });
  }

  function renderFileList() {
    filePane.innerHTML = '';

    loadFiles().then(function(data) {
      var folder = resolveFolder(data.root, currentPath);
      if (!folder || !folder.children) {
        statusBar.textContent = '0 object(s)';
        return;
      }

      // Header row
      var header = document.createElement('div');
      header.className = 'file-list-header';

      var cols = [
        { label: 'Name', width: '200px' },
        { label: 'Size', width: '70px' },
        { label: 'Type', width: '100px' },
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

      var selectedItem = null;

      folder.children.forEach(function(child) {
        var row = document.createElement('div');
        row.className = 'file-list-item';

        // Name
        var nameCol = document.createElement('span');
        nameCol.className = 'file-list-col';
        nameCol.style.width = '200px';
        nameCol.style.flexShrink = '0';
        nameCol.style.display = 'flex';
        nameCol.style.alignItems = 'center';
        nameCol.style.gap = '4px';

        var iconName = child.icon || 'file_doc';
        if (child.type === 'folder') {
          iconName = 'folder_closed';
        }
        nameCol.innerHTML = iconImg(iconName, 16);
        var nameText = document.createElement('span');
        nameText.textContent = child.name;
        nameCol.appendChild(nameText);
        row.appendChild(nameCol);

        // Size
        var sizeCol = document.createElement('span');
        sizeCol.className = 'file-list-col';
        sizeCol.style.width = '70px';
        sizeCol.style.flexShrink = '0';
        sizeCol.textContent = child.type === 'folder' ? '' : (child.size || '');
        row.appendChild(sizeCol);

        // Type
        var typeCol = document.createElement('span');
        typeCol.className = 'file-list-col';
        typeCol.style.width = '100px';
        typeCol.style.flexShrink = '0';
        if (child.type === 'folder') {
          typeCol.textContent = 'File Folder';
        } else {
          typeCol.textContent = FILE_TYPE_NAMES[child.file_type] || 'File';
        }
        row.appendChild(typeCol);

        // Modified
        var modCol = document.createElement('span');
        modCol.className = 'file-list-col';
        modCol.style.flex = '1';
        modCol.textContent = child.modified || '';
        row.appendChild(modCol);

        // Click: select
        row.addEventListener('click', function(e) {
          e.stopPropagation();
          if (selectedItem) selectedItem.classList.remove('selected');
          row.classList.add('selected');
          selectedItem = row;
        });

        // Double-click
        row.addEventListener('dblclick', function(e) {
          e.stopPropagation();
          if (child.type === 'folder') {
            currentPath.push(child.name);
            navigateTo(currentPath.slice());
          } else if (child.file_type && FILE_TYPE_VIEWERS[child.file_type]) {
            EventBus.emit('app:launch', {
              appId: FILE_TYPE_VIEWERS[child.file_type],
              args: { file: child }
            });
          }
        });

        filePane.appendChild(row);
      });

      statusBar.textContent = folder.children.length + ' object(s)';
    });
  }

  // Load data and render
  loadFiles().then(function(data) {
    renderTree(data.root);
    renderFileList();
    highlightTreeItem();
  });

  return container;
}
