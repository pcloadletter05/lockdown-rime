// Document Viewers — WordPad, Notepad, Spreadsheet
// Each builder returns an HTMLElement for use in WindowManager windows.

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
  var buttons = [
    { label: 'B', title: 'Bold', bold: true },
    { label: 'I', title: 'Italic', italic: true },
    { label: 'U', title: 'Underline', underline: true },
    { sep: true },
    { label: '\u2261', title: 'Align Left' },
    { label: '\u2261', title: 'Center' },
    { label: '\u2261', title: 'Align Right' },
    { sep: true },
    { label: '\u2022', title: 'Bullets' }
  ];
  buttons.forEach(function(b) {
    if (b.sep) {
      var sep = document.createElement('div');
      sep.className = 'toolbar-separator';
      toolbar.appendChild(sep);
      return;
    }
    var btn = document.createElement('button');
    btn.className = 'toolbar-btn raised';
    btn.textContent = b.label;
    btn.title = b.title;
    if (b.bold) btn.style.fontWeight = 'bold';
    if (b.italic) btn.style.fontStyle = 'italic';
    if (b.underline) btn.style.textDecoration = 'underline';
    toolbar.appendChild(btn);
  });
  container.appendChild(toolbar);

  // Format bar
  var formatBar = document.createElement('div');
  formatBar.className = 'app-toolbar raised';

  var fontSelect = document.createElement('select');
  fontSelect.className = 'nt4-select';
  var fontOpt = document.createElement('option');
  fontOpt.textContent = 'Times New Roman';
  fontSelect.appendChild(fontOpt);
  formatBar.appendChild(fontSelect);

  var sizeSelect = document.createElement('select');
  sizeSelect.className = 'nt4-select';
  sizeSelect.style.width = '50px';
  sizeSelect.style.marginLeft = '4px';
  var sizeOpt = document.createElement('option');
  sizeOpt.textContent = '12';
  sizeSelect.appendChild(sizeOpt);
  formatBar.appendChild(sizeSelect);

  container.appendChild(formatBar);

  // Content area
  var content = document.createElement('div');
  content.className = 'wordpad-content';
  if (args && args.file && args.file.content) {
    content.innerHTML = args.file.content;
  }
  container.appendChild(content);

  // Status bar
  var status = document.createElement('div');
  status.className = 'well';
  status.style.padding = '2px 4px';
  status.style.fontSize = '11px';
  status.style.flexShrink = '0';
  status.textContent = 'For Help, press F1';
  container.appendChild(status);

  return container;
}

function buildNotepadUI(args) {
  var container = document.createElement('div');
  container.className = 'notepad-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Content area (pre for monospace text)
  var content = document.createElement('pre');
  content.className = 'notepad-content';
  if (args && args.file && args.file.content) {
    content.textContent = args.file.content;
  }
  container.appendChild(content);

  return container;
}

function buildSpreadsheetUI(args) {
  var container = document.createElement('div');
  container.className = 'spreadsheet-app';

  // Menu bar
  var menubar = document.createElement('div');
  menubar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'].forEach(function(label) {
    var item = document.createElement('span');
    item.className = 'menu-item';
    item.textContent = label;
    menubar.appendChild(item);
  });
  container.appendChild(menubar);

  // Toolbar
  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised';
  var tbButtons = [
    { label: 'B', title: 'Bold', bold: true },
    { label: 'I', title: 'Italic', italic: true },
    { sep: true },
    { label: '$', title: 'Currency' },
    { label: '%', title: 'Percent' },
    { label: ',', title: 'Comma' },
    { sep: true },
    { label: '\u229E', title: 'Merge Cells' }
  ];
  tbButtons.forEach(function(b) {
    if (b.sep) {
      var sep = document.createElement('div');
      sep.className = 'toolbar-separator';
      toolbar.appendChild(sep);
      return;
    }
    var btn = document.createElement('button');
    btn.className = 'toolbar-btn raised';
    btn.textContent = b.label;
    btn.title = b.title;
    if (b.bold) btn.style.fontWeight = 'bold';
    if (b.italic) btn.style.fontStyle = 'italic';
    toolbar.appendChild(btn);
  });
  container.appendChild(toolbar);

  // Formula bar
  var formulaBar = document.createElement('div');
  formulaBar.className = 'formula-bar raised';
  var cellRef = document.createElement('span');
  cellRef.className = 'cell-ref';
  cellRef.textContent = 'A1';
  formulaBar.appendChild(cellRef);
  var formulaInput = document.createElement('input');
  formulaInput.className = 'nt4-input';
  formulaInput.style.flex = '1';
  formulaInput.readOnly = true;
  formulaBar.appendChild(formulaInput);
  container.appendChild(formulaBar);

  // Content area with table
  var contentArea = document.createElement('div');
  contentArea.className = 'spreadsheet-content';

  if (args && args.file && args.file.content && args.file.content.columns) {
    var data = args.file.content;
    var table = document.createElement('table');
    table.className = 'spreadsheet-grid';

    // Column letter header row
    var letterRow = document.createElement('tr');
    var cornerCell = document.createElement('th');
    cornerCell.className = 'row-header';
    cornerCell.textContent = '';
    letterRow.appendChild(cornerCell);
    for (var c = 0; c < data.columns.length; c++) {
      var letterTh = document.createElement('th');
      letterTh.textContent = String.fromCharCode(65 + c);
      letterRow.appendChild(letterTh);
    }
    table.appendChild(letterRow);

    // Column names row
    var nameRow = document.createElement('tr');
    var rowNumCell = document.createElement('td');
    rowNumCell.className = 'row-header';
    rowNumCell.textContent = '1';
    nameRow.appendChild(rowNumCell);
    data.columns.forEach(function(colName) {
      var td = document.createElement('td');
      td.textContent = colName;
      td.style.fontWeight = 'bold';
      nameRow.appendChild(td);
    });
    table.appendChild(nameRow);

    // Data rows
    data.rows.forEach(function(row, rowIdx) {
      var tr = document.createElement('tr');
      var rowNum = document.createElement('td');
      rowNum.className = 'row-header';
      rowNum.textContent = String(rowIdx + 2);
      tr.appendChild(rowNum);
      row.forEach(function(cellVal) {
        var td = document.createElement('td');
        td.textContent = cellVal;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    table.addEventListener('click', function(e) {
      var td = e.target.closest('td');
      if (!td || td.className === 'row-header') return;
      var tr = td.parentElement;
      var colIdx = Array.prototype.indexOf.call(tr.children, td) - 1;
      var rowIdx = Array.prototype.indexOf.call(table.children, tr);
      if (colIdx >= 0 && rowIdx >= 0) {
        cellRef.textContent = String.fromCharCode(65 + colIdx) + rowIdx;
        formulaInput.value = td.textContent;
      }
    });

    contentArea.appendChild(table);
  }

  container.appendChild(contentArea);

  // Status bar
  var status = document.createElement('div');
  status.className = 'well';
  status.style.padding = '2px 4px';
  status.style.fontSize = '11px';
  status.style.flexShrink = '0';
  status.textContent = 'Ready';
  container.appendChild(status);

  return container;
}
