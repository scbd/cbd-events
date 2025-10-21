// Vue 3 compatible event bus using mitt pattern
class EventBus {
  constructor() {
    this.events = {}
  }

  $on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  $emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args))
    }
  }

  $off(event, callback) {
    if (this.events[event]) {
      if (callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback)
      } else {
        delete this.events[event]
      }
    }
  }
}

const events = new EventBus()

export default events
