export const EventBus = {
  events: {} as Record<string, Function[]>,
  on(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
  },
  off(event: string, callback?: Function) {
    if (!this.events[event]) return
    if (callback) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    } else {
      delete this.events[event]
    }
  },
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(...args))
    }
  }
}