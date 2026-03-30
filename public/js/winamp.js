// Winamp 2.x Player -- DOM builder, sprite interactions, playlist panel, audio engine
// Visual layer (Phase 14) + Audio engine (Phase 15)

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

    cell.addEventListener('dblclick', function() {
      loadTrack(i);
      winampPlay();
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

// ---- Audio engine functions ----

function ensureAudioContext() {
  if (WinampPlayer.audioCtx) {
    if (WinampPlayer.audioCtx.state === 'suspended') {
      WinampPlayer.audioCtx.resume();
    }
    return;
  }
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  var source = ctx.createMediaElementSource(WinampPlayer.audio);
  var panner = new StereoPannerNode(ctx, { pan: 0 });
  var analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(panner);
  panner.connect(analyser);
  analyser.connect(ctx.destination);
  WinampPlayer.audioCtx = ctx;
  WinampPlayer.source = source;
  WinampPlayer.panner = panner;
  WinampPlayer.analyser = analyser;
}

function loadTrack(index) {
  var track = WinampState.tracks[index];
  if (!track) return;
  WinampState.selectedTrack = index;
  WinampPlayer.audio.src = 'assets/music/' + track.filename;
  setupTicker(WinampPlayer.webampEl, track.order + '. ' + track.artist + ' - ' + track.title);
  updateTimeDisplay(WinampPlayer.webampEl, 0);
  var pos = WinampPlayer.webampEl.querySelector('#position');
  if (pos) pos.value = '0';
  var plWin = WinampPlayer.webampEl.querySelector('#playlist-window');
  if (plWin) renderPlaylistTracks(plWin, WinampState.tracks, index);
}

function updateNT4Title(text) {
  if (!WinampPlayer.windowId) return;
  var win = document.getElementById(WinampPlayer.windowId);
  if (!win) return;
  var titleEl = win.querySelector('.titlebar-title');
  if (titleEl) titleEl.textContent = text;
}

var consecutiveErrors = 0;

function winampPlay() {
  if (WinampPlayer.playlistError) return;
  if (!WinampState.tracks.length) return;
  ensureAudioContext();

  var track = WinampState.tracks[WinampState.selectedTrack];
  if (WinampState.playState === 'stop') {
    WinampPlayer.audio.src = 'assets/music/' + track.filename;
  }
  WinampPlayer.audio.volume = WinampState.volume / 100;
  if (WinampPlayer.panner) {
    WinampPlayer.panner.pan.value = WinampState.balance / 100;
  }
  WinampPlayer.audio.play();

  WinampState.playState = 'play';
  var mw = WinampPlayer.webampEl.querySelector('#main-window');
  if (mw) mw.className = 'window play';

  updateNT4Title(track.artist + ' - ' + track.title + ' - Winamp');

  // Start visualizer if canvas exists
  var canvas = WinampPlayer.webampEl.querySelector('#visualizer canvas');
  if (canvas && WinampPlayer.analyser) startVisualizer(canvas);
}

function winampPause() {
  WinampPlayer.audio.pause();
  WinampState.playState = 'pause';
  var mw = WinampPlayer.webampEl.querySelector('#main-window');
  if (mw) mw.className = 'window pause';
  cancelAnimationFrame(WinampPlayer.animFrameId);

  updateNT4Title('Winamp [Paused]');
}

function winampStop() {
  WinampPlayer.audio.pause();
  WinampPlayer.audio.currentTime = 0;
  WinampState.playState = 'stop';
  var mw = WinampPlayer.webampEl ? WinampPlayer.webampEl.querySelector('#main-window') : null;
  if (mw) mw.className = 'window stop';
  cancelAnimationFrame(WinampPlayer.animFrameId);
  if (WinampPlayer.webampEl) {
    updateTimeDisplay(WinampPlayer.webampEl, 0);
    // Clear visualizer canvas to black
    var canvas = WinampPlayer.webampEl.querySelector('#visualizer canvas');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Reset seek bar
    var pos = WinampPlayer.webampEl.querySelector('#position');
    if (pos) pos.value = '0';
  }

  updateNT4Title('Winamp');
}

function winampPrev() {
  if (WinampPlayer.audio.currentTime > 3) {
    WinampPlayer.audio.currentTime = 0;
    return;
  }
  var newIndex = WinampState.selectedTrack - 1;
  if (newIndex < 0) newIndex = WinampState.tracks.length - 1;
  loadTrack(newIndex);
  if (WinampState.playState === 'play') {
    WinampPlayer.audio.play();
    var track = WinampState.tracks[newIndex];
    updateNT4Title(track.artist + ' - ' + track.title + ' - Winamp');
  }
}

function winampNext() {
  var newIndex;
  if (WinampState.shuffle) {
    var choices = [];
    for (var i = 0; i < WinampState.tracks.length; i++) {
      if (i !== WinampState.selectedTrack) choices.push(i);
    }
    newIndex = choices.length > 0 ? choices[Math.floor(Math.random() * choices.length)] : 0;
  } else {
    newIndex = WinampState.selectedTrack + 1;
    if (newIndex >= WinampState.tracks.length) newIndex = 0;
  }
  loadTrack(newIndex);
  if (WinampState.playState === 'play') {
    WinampPlayer.audio.play();
    var track = WinampState.tracks[newIndex];
    updateNT4Title(track.artist + ' - ' + track.title + ' - Winamp');
  }
}

function startVisualizer(canvas) {
  if (!WinampPlayer.analyser) return;
  var ctx = canvas.getContext('2d');
  var analyser = WinampPlayer.analyser;
  var bufLen = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufLen);

  function draw() {
    if (WinampState.playState !== 'play') return;
    WinampPlayer.animFrameId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 1;
    ctx.beginPath();

    var sliceW = canvas.width / bufLen;
    for (var i = 0; i < bufLen; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * sliceW, y);
    }
    ctx.stroke();
  }
  WinampPlayer.animFrameId = requestAnimationFrame(draw);
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

  // ===== Create Audio Element =====
  var audio = document.createElement('audio');
  audio.preload = 'auto';
  WinampPlayer.audio = audio;
  WinampPlayer.webampEl = webampEl;

  // ===== Wire Audio Events =====

  audio.addEventListener('timeupdate', function() {
    var elapsed = Math.floor(audio.currentTime);
    updateTimeDisplay(webampEl, elapsed);
    var duration = audio.duration;
    if (duration && isFinite(duration)) {
      var pos = webampEl.querySelector('#position');
      if (pos) pos.value = Math.round((audio.currentTime / duration) * 100);
    }
  });

  audio.addEventListener('ended', function() {
    var isLast = WinampState.selectedTrack >= WinampState.tracks.length - 1;

    if (WinampState.shuffle) {
      winampNext();
    } else if (isLast && !WinampState.repeat) {
      loadTrack(0);
      winampStop();
    } else {
      winampNext();
    }
  });

  audio.addEventListener('error', function() {
    var track = WinampState.tracks[WinampState.selectedTrack];
    if (track) {
      setupTicker(webampEl, 'Error loading: ' + track.filename);
    }
    consecutiveErrors++;
    if (consecutiveErrors >= WinampState.tracks.length) {
      winampStop();
      consecutiveErrors = 0;
      return;
    }
    setTimeout(function() {
      winampNext();
    }, 3000);
  });

  audio.addEventListener('playing', function() {
    consecutiveErrors = 0;
  });

  // ===== Wire Interactions =====

  // Playback buttons -- press states
  [previous, play, pause, stop, next, eject].forEach(function(btn) {
    addPressInteraction(btn);
  });

  // Playback buttons -- click handlers
  play.addEventListener('click', winampPlay);
  pause.addEventListener('click', winampPause);
  stop.addEventListener('click', winampStop);
  previous.addEventListener('click', winampPrev);
  next.addEventListener('click', winampNext);

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
    if (WinampPlayer.audio) {
      WinampPlayer.audio.volume = WinampState.volume / 100;
    }
  });

  // Balance slider
  balInput.addEventListener('input', function() {
    WinampState.balance = parseInt(balInput.value, 10);
    if (WinampPlayer.panner) {
      WinampPlayer.panner.pan.value = WinampState.balance / 100;
    }
  });
  balInput.addEventListener('change', function() {
    var val = parseInt(balInput.value, 10);
    if (val > -5 && val < 5) {
      balInput.value = '0';
      WinampState.balance = 0;
      if (WinampPlayer.panner) {
        WinampPlayer.panner.pan.value = 0;
      }
    }
  });

  // Seek slider
  var wasDraggingWhilePlaying = false;

  position.addEventListener('mousedown', function() {
    if (WinampState.playState === 'play') {
      WinampPlayer.audio.pause();
      wasDraggingWhilePlaying = true;
    }
  });

  position.addEventListener('input', function() {
    WinampState.seekPercent = parseInt(position.value, 10);
    // Live time preview during drag
    var track = WinampState.tracks[WinampState.selectedTrack];
    if (track) {
      var pct = parseInt(position.value, 10) / 100;
      updateTimeDisplay(webampEl, Math.floor(pct * track.duration));
    }
  });

  position.addEventListener('change', function() {
    var pct = parseInt(position.value, 10) / 100;
    if (WinampPlayer.audio.duration && isFinite(WinampPlayer.audio.duration)) {
      WinampPlayer.audio.currentTime = pct * WinampPlayer.audio.duration;
    }
    if (wasDraggingWhilePlaying) {
      WinampPlayer.audio.play();
      wasDraggingWhilePlaying = false;
    }
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
      WinampPlayer.playlistError = true;
    });

  return { element: webampEl };
}

// ---- WinampPlayer singleton ----

var WinampPlayer = {
  windowId: null,
  state: WinampState,
  updateTimeDisplay: updateTimeDisplay,
  setupTicker: setupTicker,
  audio: null,
  audioCtx: null,
  analyser: null,
  source: null,
  panner: null,
  animFrameId: null,
  webampEl: null,
  playlistError: false
};

// ---- EventBus lifecycle hooks ----

EventBus.on('window:closed', function(data) {
  if (data.windowId === WinampPlayer.windowId) {
    winampStop();
    WinampPlayer.windowId = null;
    WinampPlayer.webampEl = null;
    WinampState.volume = 75;
    WinampState.balance = 0;
    WinampState.seekPercent = 0;
    WinampState.shuffle = false;
    WinampState.repeat = false;
    WinampState.playlistOpen = false;
    WinampState.selectedTrack = 0;
    WinampState.playState = 'stop';
  }
});

EventBus.on('window:minimized', function(data) {
  if (data.windowId === WinampPlayer.windowId) {
    cancelAnimationFrame(WinampPlayer.animFrameId);
  }
});

EventBus.on('window:restored', function(data) {
  if (data.windowId === WinampPlayer.windowId) {
    if (WinampState.playState === 'play') {
      var canvas = WinampPlayer.webampEl.querySelector('#visualizer canvas');
      if (canvas) startVisualizer(canvas);
    }
  }
});
