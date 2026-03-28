// Outlook 98-style email client
// Three-pane layout: folder tree, message list, preview pane

var _emailsCache = null;
var selectedFolder = 'Inbox';
var selectedMessageId = null;

function loadEmails() {
  if (_emailsCache) {
    return Promise.resolve(_emailsCache);
  }
  return fetch('content/emails.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      _emailsCache = data.items;
      return _emailsCache;
    });
}

function getVisibleEmails(folder) {
  if (!_emailsCache) return [];
  return _emailsCache.filter(function(email) {
    return email.folder === folder && TimeEngine.isAfter(email.deliver_at);
  });
}

function getUnreadCount(folder) {
  return getVisibleEmails(folder).filter(function(e) {
    return !e.read;
  }).length;
}

function formatEmailDate(isoString) {
  var d = new Date(isoString);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var year = String(d.getFullYear()).slice(2);
  var hours = d.getHours();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  var minutes = String(d.getMinutes()).padStart(2, '0');
  return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ' ' + ampm;
}

function renderEmailBody(bodyText) {
  var lines = bodyText.split('\n');
  var html = '';
  var inQuote = false;
  var quoteLines = [];

  function flushQuote() {
    if (quoteLines.length > 0) {
      html += '<div class="email-quoted">' +
        quoteLines.map(function(l) {
          // Strip leading > and space
          var text = l.replace(/^>\s?/, '');
          return escapeHtml(text);
        }).join('<br>') +
        '</div>';
      quoteLines = [];
    }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.charAt(0) === '>') {
      if (!inQuote) {
        inQuote = true;
      }
      quoteLines.push(line);
    } else {
      if (inQuote) {
        flushQuote();
        inQuote = false;
      }
      html += escapeHtml(line) + '<br>';
    }
  }
  // Flush any remaining quoted lines
  if (inQuote) {
    flushQuote();
  }

  return html;
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function buildEmailUI(args) {
  var container = document.createElement('div');
  container.className = 'email-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Tools', 'Help'].forEach(function(label) {
    var item = document.createElement('div');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Toolbar
  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  var toolbarButtons = [
    { label: 'New', sep: false },
    { label: null, sep: true },
    { label: 'Reply', sep: false },
    { label: 'Reply All', sep: false },
    { label: 'Forward', sep: false },
    { label: null, sep: true },
    { label: 'Delete', sep: false },
    { label: null, sep: true },
    { label: 'Send/Receive', sep: false }
  ];
  toolbarButtons.forEach(function(btn) {
    if (btn.sep) {
      var sep = document.createElement('div');
      sep.className = 'toolbar-separator';
      toolbar.appendChild(sep);
    } else {
      var button = document.createElement('button');
      button.className = 'toolbar-btn-text raised';
      button.textContent = btn.label;
      toolbar.appendChild(button);
    }
  });
  container.appendChild(toolbar);

  // Body (three-pane)
  var body = document.createElement('div');
  body.className = 'email-body';

  // Folder pane
  var folderPane = document.createElement('div');
  folderPane.className = 'email-folders sunken';

  // Right column
  var rightCol = document.createElement('div');
  rightCol.className = 'email-right';

  // Message list
  var messageList = document.createElement('div');
  messageList.className = 'email-messages sunken';

  // Divider
  var divider = document.createElement('div');
  divider.className = 'email-divider';

  // Preview pane
  var preview = document.createElement('div');
  preview.className = 'email-preview sunken';

  rightCol.appendChild(messageList);
  rightCol.appendChild(divider);
  rightCol.appendChild(preview);

  body.appendChild(folderPane);
  body.appendChild(rightCol);
  container.appendChild(body);

  // Status bar
  var statusBar = document.createElement('div');
  statusBar.className = 'well';
  statusBar.style.fontSize = '11px';
  statusBar.style.padding = '2px 4px';
  statusBar.textContent = '0 message(s)';
  container.appendChild(statusBar);

  // Render functions scoped to this instance
  function renderFolders() {
    folderPane.innerHTML = '';
    var folders = ['Inbox', 'Sent Items', 'Drafts', 'Deleted Items'];
    folders.forEach(function(folder) {
      var item = document.createElement('div');
      item.className = 'email-folder-item';
      if (folder === selectedFolder) {
        item.classList.add('selected');
      }

      var icon = iconImg('mailbox', 16);
      item.innerHTML = icon;

      var nameSpan = document.createElement('span');
      nameSpan.textContent = folder;
      item.appendChild(nameSpan);

      var unread = getUnreadCount(folder);
      if (unread > 0) {
        var countSpan = document.createElement('span');
        countSpan.className = 'email-unread-count';
        countSpan.textContent = '(' + unread + ')';
        item.appendChild(countSpan);
      }

      item.addEventListener('click', function() {
        selectedFolder = folder;
        selectedMessageId = null;
        renderFolders();
        renderMessages();
        preview.innerHTML = '';
      });

      folderPane.appendChild(item);
    });
  }

  function renderMessages() {
    messageList.innerHTML = '';

    // Header row
    var header = document.createElement('div');
    header.className = 'email-msg-header';
    var colFrom = document.createElement('span');
    colFrom.textContent = 'From';
    colFrom.style.width = '180px';
    var colSubject = document.createElement('span');
    colSubject.textContent = 'Subject';
    colSubject.style.flex = '1';
    var colDate = document.createElement('span');
    colDate.textContent = 'Received';
    colDate.style.width = '120px';
    header.appendChild(colFrom);
    header.appendChild(colSubject);
    header.appendChild(colDate);
    messageList.appendChild(header);

    var emails = getVisibleEmails(selectedFolder);
    // Sort by date descending (newest first)
    emails.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    emails.forEach(function(email) {
      var row = document.createElement('div');
      row.className = 'email-msg-item';
      if (!email.read) {
        row.classList.add('unread');
      }
      if (email.id === selectedMessageId) {
        row.classList.add('selected');
      }

      var fromCol = document.createElement('span');
      fromCol.className = 'email-msg-col';
      fromCol.style.width = '180px';
      // Extract display name from "Name <email>" format
      var displayName = email.from.replace(/<[^>]+>/, '').trim();
      fromCol.textContent = displayName;

      var subjCol = document.createElement('span');
      subjCol.className = 'email-msg-col';
      subjCol.style.flex = '1';
      subjCol.textContent = email.subject;

      var dateCol = document.createElement('span');
      dateCol.className = 'email-msg-col';
      dateCol.style.width = '120px';
      dateCol.textContent = formatEmailDate(email.date);

      row.appendChild(fromCol);
      row.appendChild(subjCol);
      row.appendChild(dateCol);

      row.addEventListener('click', function() {
        selectedMessageId = email.id;
        email.read = true;
        renderFolders();
        renderMessages();
        renderPreview(email);
      });

      messageList.appendChild(row);
    });

    // Update status bar
    statusBar.textContent = emails.length + ' message(s)';
  }

  function renderPreview(email) {
    preview.innerHTML = '';

    // Headers
    var headers = document.createElement('div');
    headers.className = 'email-preview-headers';

    function addHeader(label, value) {
      var div = document.createElement('div');
      var labelSpan = document.createElement('span');
      labelSpan.className = 'header-label';
      labelSpan.textContent = label + ':';
      div.appendChild(labelSpan);
      var valueSpan = document.createElement('span');
      valueSpan.textContent = ' ' + value;
      div.appendChild(valueSpan);
      headers.appendChild(div);
    }

    addHeader('From', email.from);
    addHeader('To', email.to);
    if (email.cc) {
      addHeader('CC', email.cc);
    }
    addHeader('Date', formatEmailDate(email.date));
    addHeader('Subject', email.subject);

    preview.appendChild(headers);

    // Separator
    var hr = document.createElement('hr');
    hr.style.border = 'none';
    hr.style.borderTop = '1px solid #C0C0C0';
    hr.style.margin = '8px 0';
    preview.appendChild(hr);

    // Body
    var bodyDiv = document.createElement('div');
    bodyDiv.className = 'email-preview-body';
    bodyDiv.innerHTML = renderEmailBody(email.body);
    preview.appendChild(bodyDiv);
  }

  // Load and render
  loadEmails().then(function() {
    renderFolders();
    renderMessages();
  });

  return container;
}
