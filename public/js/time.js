// TimeEngine -- two-clock model for the offline-state simulation
//
// getStoryNow() returns "story now" anchored at Feb 10, 2000 -- used internally
//   by isAfter() to gate deliver_at on emails. Real hours/minutes/seconds map
//   1:1 onto Feb 10. This is what content gating reads. Never rendered to chrome.
//
// getDisplayClock() returns the 1980-anchored display clock -- used ONLY by the
//   taskbar (chrome). The CMOS battery failed during the workstation move, so
//   the BIOS reset to factory default (Jan 1, 1980 00:00:00). Fresh per session
//   (no localStorage). Walks forward from the moment of page load.
//
// Authoring rule: any new deliver_at timestamp uses the Feb 10 anchor or later,
//   NEVER 1980 dates.

const TimeEngine = {
  // Story-now anchor (internal gating; do not render)
  ANCHOR_YEAR: 2000,
  ANCHOR_MONTH: 1,   // February (0-indexed)
  ANCHOR_DAY: 10,

  // Display-clock baseline (chrome only; CMOS factory default Jan 1, 1980 00:00:00)
  CMOS_YEAR: 1980,
  CMOS_MONTH: 0,     // January (0-indexed)
  CMOS_DAY: 1,
  CMOS_HOUR: 0,
  CMOS_MINUTE: 0,
  CMOS_SECOND: 0,

  // Lazy-initialized on first getDisplayClock() call so the visible 1980 clock
  // anchors to the moment the desktop renders, not module-load.
  _bootMs: null,

  getStoryNow() {
    const now = new Date();
    return new Date(
      this.ANCHOR_YEAR,
      this.ANCHOR_MONTH,
      this.ANCHOR_DAY,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
  },

  getDisplayClock() {
    if (this._bootMs === null) this._bootMs = Date.now();
    const baseline = new Date(
      this.CMOS_YEAR,
      this.CMOS_MONTH,
      this.CMOS_DAY,
      this.CMOS_HOUR,
      this.CMOS_MINUTE,
      this.CMOS_SECOND
    ).getTime();
    return new Date(baseline + (Date.now() - this._bootMs));
  },

  formatClockTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return hours + ':' + minutes + ' ' + ampm;
  },

  formatFullDate(date) {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  },

  isAfter(deliverAt) {
    // Check if the current story-now is past the deliver_at timestamp
    const now = this.getStoryNow();
    const target = new Date(deliverAt);
    return now >= target;
  }
};
