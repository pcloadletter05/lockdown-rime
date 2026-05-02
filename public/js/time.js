// TimeEngine -- maps real-world time to January 20, 2000
// 1:1 mapping: current hour/minute/second maps to same time on Jan 17, 2000

const TimeEngine = {
  ANCHOR_YEAR: 2000,
  ANCHOR_MONTH: 0,  // January (0-indexed)
  ANCHOR_DAY: 20,

  getMappedTime() {
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
    // Check if the current mapped time is past the deliver_at timestamp
    const mapped = this.getMappedTime();
    const target = new Date(deliverAt);
    return mapped >= target;
  }
};
