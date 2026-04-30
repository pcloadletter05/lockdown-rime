// SoundManager — NT4 system sounds singleton
// Provides play/toggleMute/isMuted. Does NOT affect Winamp audio.

var SoundManager = (function() {
  var sounds = {};
  var muted = sessionStorage.getItem('nt4-muted') === 'true';
  var names = ['tada', 'chord', 'ding', 'chimes', 'default'];

  function preload() {
    for (var i = 0; i < names.length; i++) {
      var audio = new Audio('assets/sounds/' + names[i] + '.wav');
      audio.preload = 'auto';
      sounds[names[i]] = audio;
    }
  }

  function play(name) {
    if (muted || !sounds[name]) return;
    sounds[name].currentTime = 0;
    sounds[name].play().catch(function() {});
  }

  function toggleMute() {
    muted = !muted;
    sessionStorage.setItem('nt4-muted', muted ? 'true' : 'false');
    return muted;
  }

  function isMuted() { return muted; }

  preload();
  return { play: play, toggleMute: toggleMute, isMuted: isMuted };
})();
