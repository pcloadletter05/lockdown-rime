// Winamp 2.x Player -- DOM builder, sprite interactions, playlist panel
// Visual layer only (Phase 14). Audio hookup deferred to Phase 15.

var WinampState = {
  volume: 75,
  balance: 0,
  seekPercent: 0,
  shuffle: false,
  repeat: false,
  playlistOpen: false,
  selectedTrack: 0,
  tracks: [],
  playState: 'stop'
};

// ---- LCD time digit renderer ----

function updateTimeDisplay(webampEl, totalSeconds) {
  var mins = Math.floor(totalSeconds / 60);
  var secs = totalSeconds % 60;
  var m1 = Math.floor(mins / 10);
  var m2 = mins % 10;
  var s1 = Math.floor(secs / 10);
  var s2 = secs % 10;

  var d1 = webampEl.querySelector('#minute-first-digit');
  var d2 = webampEl.querySelector('#minute-second-digit');
  var d3 = webampEl.querySelector('#second-first-digit');
  var d4 = webampEl.querySelector('#second-second-digit');

  if (d1) d1.className = 'digit digit-' + m1;
  if (d2) d2.className = 'digit digit-' + m2;
  if (d3) d3.className = 'digit digit-' + s1;
  if (d4) d4.className = 'digit digit-' + s2;
}

// ---- Scrolling marquee ticker ----

function setupTicker(webampEl, text) {
  var marquee = webampEl.querySelector('#marquee');
  if (!marquee) return;
  marquee.innerHTML = '';
  var tickerText = document.createElement('div');
  tickerText.className = 'ticker-text';
  tickerText.textContent = text;
  marquee.appendChild(tickerText);
}

// ---- Playlist track renderer ----

function renderPlaylistTracks(playlistEl, tracks, selectedIndex) {
  var container = playlistEl.querySelector('.playlist-tracks');
  if (!container) return;
  container.innerHTML = '';

  tracks.forEach(function(track, i) {
    var cell = document.createElement('div');
    cell.className = 'track-cell';
    if (i === selectedIndex) {
      cell.classList.add('selected');
    }

    var secs = track.duration % 60;
    var mins = Math.floor(track.duration / 60);
    var timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;
    cell.textContent = track.order + '. ' + track.artist + ' - ' + track.title + '  ' + timeStr;

    cell.addEventListener('click', function() {
      WinampState.selectedTrack = i;
      renderPlaylistTracks(playlistEl, tracks, i);
    });

    container.appendChild(cell);
  });
}

// ---- Helper: add press interaction to a button ----

function addPressInteraction(el) {
  el.addEventListener('mousedown', function() {
    el.classList.add('winamp-active');
  });
  el.addEventListener('mouseup', function() {
    el.classList.remove('winamp-active');
  });
  el.addEventListener('mouseleave', function() {
    el.classList.remove('winamp-active');
  });
}

// ---- Helper: create a div with id and optional className ----

function wDiv(id, className) {
  var el = document.createElement('div');
  if (id) el.id = id;
  if (className) el.className = className;
  return el;
}

// ---- Main DOM builder ----

function buildWinampUI(args) {
  var webampEl = wDiv(null, 'webamp');

  // ===== Main Window =====
  var mainWindow = wDiv('main-window', 'window stop');

  // Title bar
  var titleBar = wDiv('title-bar');
  var option = wDiv('option');
  var optionContext = wDiv('option-context');
  option.appendChild(optionContext);
  titleBar.appendChild(option);

  var minimize = wDiv('minimize');
  var shade = wDiv('shade');
  var close = wDiv('close');
  titleBar.appendChild(minimize);
  titleBar.appendChild(shade);
  titleBar.appendChild(close);
  mainWindow.appendChild(titleBar);

  // Webamp status area
  var webampStatus = wDiv(null, 'webamp-status');

  var clutterBar = wDiv('clutter-bar');
  ['button-o', 'button-a', 'button-i', 'button-d', 'button-v'].forEach(function(bid) {
    clutterBar.appendChild(wDiv(bid));
  });
  webampStatus.appendChild(clutterBar);

  var playPause = wDiv('play-pause');
  webampStatus.appendChild(playPause);

  var time = wDiv('time');
  var mfd = wDiv('minute-first-digit', 'digit digit-0');
  var msd = wDiv('minute-second-digit', 'digit digit-0');
  var sfd = wDiv('second-first-digit', 'digit digit-0');
  var ssd = wDiv('second-second-digit', 'digit digit-0');
  time.appendChild(mfd);
  time.appendChild(msd);
  time.appendChild(sfd);
  time.appendChild(ssd);
  webampStatus.appendChild(time);

  mainWindow.appendChild(webampStatus);

  // Visualizer
  var visualizer = wDiv('visualizer');
  visualizer.style.width = '76px';
  visualizer.style.height = '16px';
  visualizer.style.background = '#000';
  mainWindow.appendChild(visualizer);

  // Marquee
  var marquee = wDiv('marquee');
  mainWindow.appendChild(marquee);

  // Media info
  var mediaInfo = wDiv(null, 'media-info');
  mediaInfo.appendChild(wDiv('kbps'));
  mediaInfo.appendChild(wDiv('khz'));
  var monoStereo = wDiv(null, 'mono-stereo');
  monoStereo.appendChild(wDiv('mono'));
  var stereo = wDiv('stereo', 'selected');
  monoStereo.appendChild(stereo);
  mediaInfo.appendChild(monoStereo);
  mainWindow.appendChild(mediaInfo);

  // Volume slider
  var volume = wDiv('volume');
  var volInput = document.createElement('input');
  volInput.type = 'range';
  volInput.min = '0';
  volInput.max = '100';
  volInput.value = '75';
  volume.appendChild(volInput);
  mainWindow.appendChild(volume);

  // Balance slider
  var balance = wDiv('balance');
  var balInput = document.createElement('input');
  balInput.type = 'range';
  balInput.min = '-100';
  balInput.max = '100';
  balInput.value = '0';
  balance.appendChild(balInput);
  mainWindow.appendChild(balance);

  // EQ / PL buttons
  var windows = wDiv(null, 'windows');
  var eqButton = wDiv('equalizer-button');
  var plButton = wDiv('playlist-button');
  windows.appendChild(eqButton);
  windows.appendChild(plButton);
  mainWindow.appendChild(windows);

  // Seek / position slider
  var position = document.createElement('input');
  position.id = 'position';
  position.type = 'range';
  position.min = '0';
  position.max = '100';
  position.value = '0';
  mainWindow.appendChild(position);

  // Playback actions
  var actions = wDiv(null, 'actions');
  var previous = wDiv('previous');
  previous.title = 'Previous Track';
  var play = wDiv('play');
  play.title = 'Play';
  var pause = wDiv('pause');
  pause.title = 'Pause';
  var stop = wDiv('stop');
  stop.title = 'Stop';
  var next = wDiv('next');
  next.title = 'Next Track';
  actions.appendChild(previous);
  actions.appendChild(play);
  actions.appendChild(pause);
  actions.appendChild(stop);
  actions.appendChild(next);
  mainWindow.appendChild(actions);

  // Eject
  var eject = wDiv('eject');
  mainWindow.appendChild(eject);

  // Shuffle / Repeat
  var shuffleRepeat = wDiv(null, 'shuffle-repeat');
  var shuffle = wDiv('shuffle');
  shuffle.title = 'Toggle Shuffle';
  var repeat = wDiv('repeat');
  repeat.title = 'Toggle Repeat';
  shuffleRepeat.appendChild(shuffle);
  shuffleRepeat.appendChild(repeat);
  mainWindow.appendChild(shuffleRepeat);

  webampEl.appendChild(mainWindow);

  // ===== Playlist Window =====
  var playlistWindow = wDiv('playlist-window', 'window');
  playlistWindow.style.display = 'none';

  // Playlist top
  var plTop = wDiv(null, 'playlist-top');
  plTop.appendChild(wDiv(null, 'playlist-top-left'));
  plTop.appendChild(wDiv(null, 'playlist-top-left-spacer'));
  plTop.appendChild(wDiv(null, 'playlist-top-left-fill'));
  plTop.appendChild(wDiv(null, 'playlist-top-title'));
  plTop.appendChild(wDiv(null, 'playlist-top-right-spacer'));
  plTop.appendChild(wDiv(null, 'playlist-top-right-fill'));
  plTop.appendChild(wDiv(null, 'playlist-top-right'));
  playlistWindow.appendChild(plTop);

  // Playlist middle
  var plMiddle = wDiv(null, 'playlist-middle');
  plMiddle.appendChild(wDiv(null, 'playlist-middle-left'));
  var plCenter = wDiv(null, 'playlist-middle-center');
  plCenter.style.background = '#000';
  var plTracks = wDiv(null, 'playlist-tracks');
  plCenter.appendChild(plTracks);
  plMiddle.appendChild(plCenter);
  plMiddle.appendChild(wDiv(null, 'playlist-middle-right'));
  playlistWindow.appendChild(plMiddle);

  // Playlist bottom
  var plBottom = wDiv(null, 'playlist-bottom');
  var plBottomLeft = wDiv(null, 'playlist-bottom-left');
  plBottomLeft.appendChild(wDiv('playlist-add-menu'));
  plBottomLeft.appendChild(wDiv('playlist-remove-menu'));
  plBottomLeft.appendChild(wDiv('playlist-selection-menu'));
  plBottomLeft.appendChild(wDiv('playlist-misc-menu'));
  plBottom.appendChild(plBottomLeft);
  var plBottomRight = wDiv(null, 'playlist-bottom-right');
  plBottomRight.appendChild(wDiv('playlist-list-menu'));
  plBottom.appendChild(plBottomRight);
  playlistWindow.appendChild(plBottom);

  // Playlist close and shade buttons
  playlistWindow.appendChild(wDiv('playlist-close-button'));
  playlistWindow.appendChild(wDiv('playlist-shade-button'));

  // Playlist status
  var plStatus = wDiv(null, 'playlist-status');
  playlistWindow.appendChild(plStatus);

  webampEl.appendChild(playlistWindow);

  // ===== Wire Interactions =====

  // Playback buttons -- press states
  [previous, play, pause, stop, next, eject].forEach(function(btn) {
    addPressInteraction(btn);
  });

  // EQ button -- momentary press
  addPressInteraction(eqButton);

  // Shade button -- momentary press
  addPressInteraction(shade);

  // Shuffle toggle
  shuffle.addEventListener('click', function() {
    WinampState.shuffle = !WinampState.shuffle;
    shuffle.classList.toggle('selected');
  });

  // Repeat toggle
  repeat.addEventListener('click', function() {
    WinampState.repeat = !WinampState.repeat;
    repeat.classList.toggle('selected');
  });

  // PL button -- toggle playlist
  function togglePlaylist() {
    WinampState.playlistOpen = !WinampState.playlistOpen;
    plButton.classList.toggle('selected');

    if (WinampState.playlistOpen) {
      playlistWindow.style.display = '';
    } else {
      playlistWindow.style.display = 'none';
    }

    // Adjust NT4 window height
    var nt4Window = webampEl.closest('.nt4-window');
    if (nt4Window) {
      nt4Window.style.transition = 'height 200ms ease-out';
      if (WinampState.playlistOpen) {
        nt4Window.style.height = '454px';
      } else {
        nt4Window.style.height = '254px';
      }
    }
  }

  plButton.addEventListener('click', togglePlaylist);

  // Playlist close button
  var plCloseBtn = webampEl.querySelector('#playlist-close-button');
  if (plCloseBtn) {
    plCloseBtn.addEventListener('click', function() {
      if (WinampState.playlistOpen) {
        togglePlaylist();
      }
    });
  }

  // Volume slider
  volInput.addEventListener('input', function() {
    WinampState.volume = parseInt(volInput.value, 10);
  });

  // Balance slider
  balInput.addEventListener('input', function() {
    WinampState.balance = parseInt(balInput.value, 10);
  });
  balInput.addEventListener('change', function() {
    var val = parseInt(balInput.value, 10);
    if (val > -5 && val < 5) {
      balInput.value = '0';
      WinampState.balance = 0;
    }
  });

  // Seek slider
  position.addEventListener('input', function() {
    WinampState.seekPercent = parseInt(position.value, 10);
  });

  // Skin title bar minimize -- wired after window creation via WinampPlayer.windowId
  minimize.addEventListener('click', function() {
    if (WinampPlayer.windowId) {
      WindowManager.minimizeWindow(WinampPlayer.windowId);
    }
  });

  // Skin title bar close
  close.addEventListener('click', function() {
    if (WinampPlayer.windowId) {
      WindowManager.closeWindow(WinampPlayer.windowId);
    }
  });

  // ===== Initialize displays =====

  // LCD time to 0:00
  updateTimeDisplay(webampEl, 0);

  // Loading ticker (replaced once playlist loads)
  setupTicker(webampEl, 'Loading...');

  // Fetch playlist data
  fetch('content/playlist.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      WinampState.tracks = data.tracks;
      WinampState.selectedTrack = data.lastPlaying || 0;
      var track = data.tracks[WinampState.selectedTrack];
      setupTicker(webampEl, track.order + '. ' + track.artist + ' - ' + track.title);
      renderPlaylistTracks(playlistWindow, data.tracks, WinampState.selectedTrack);
      // Calculate and display status text
      var totalSecs = data.tracks.reduce(function(sum, t) { return sum + t.duration; }, 0);
      var mins = Math.floor(totalSecs / 60);
      var secs = totalSecs % 60;
      plStatus.textContent = data.tracks.length + ' tracks ~ ' + mins + ':' + (secs < 10 ? '0' : '') + secs;
    })
    .catch(function() {
      setupTicker(webampEl, '*** Playlist error ***');
    });

  return { element: webampEl };
}

// ---- WinampPlayer singleton ----

var WinampPlayer = {
  windowId: null,
  state: WinampState,
  updateTimeDisplay: updateTimeDisplay,
  setupTicker: setupTicker
};
