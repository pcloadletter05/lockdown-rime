// EventBus -- lightweight event emitter for component decoupling
// WindowManager emits events; Taskbar and other components listen.

const EventBus = {
  _listeners: {},
  on(event, fn) {
    (this._listeners[event] ||= []).push(fn);
  },
  off(event, fn) {
    const arr = this._listeners[event];
    if (arr) this._listeners[event] = arr.filter(f => f !== fn);
  },
  emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn(detail));
  }
};
