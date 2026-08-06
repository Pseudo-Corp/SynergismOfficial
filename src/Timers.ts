import * as workerTimers from 'worker-timers'

const timers: Pick<typeof workerTimers, 'setInterval' | 'clearInterval' | 'setTimeout' | 'clearTimeout'> =
  PLATFORM === 'mobile'
    ? {
      setInterval: (fn, delay) => globalThis.setInterval(fn, delay),
      clearInterval: (timerId) => globalThis.clearInterval(timerId),
      setTimeout: (fn, delay) => globalThis.setTimeout(fn, delay),
      clearTimeout: (timerId) => globalThis.clearTimeout(timerId)
    }
    : workerTimers

interface ActiveTimer {
  id: number
  type: 'interval' | 'timeout'
}

const activeTimers: ActiveTimer[] = []

export const setInterval: typeof workerTimers['setInterval'] = (fn, delay) => {
  const timer = timers.setInterval(fn, delay)
  activeTimers.push({ id: timer, type: 'interval' })
  return timer
}

export const clearInterval: typeof workerTimers['clearInterval'] = (timerId) => {
  for (const timer of activeTimers) {
    if (timer.type === 'interval' && timer.id === timerId) {
      timers.clearInterval(timerId)
      activeTimers.splice(activeTimers.indexOf(timer), 1)
      return
    }
  }
}

export const setTimeout: typeof workerTimers['setTimeout'] = (fn, delay) => {
  const timer = timers.setTimeout(() => {
    fn()
    clearTimeout(timer)
  }, delay)
  activeTimers.push({ id: timer, type: 'timeout' })
  return timer
}

export const clearTimeout: typeof workerTimers['clearTimeout'] = (timerId) => {
  for (const timer of activeTimers) {
    if (timer.type === 'timeout' && timer.id === timerId) {
      timers.clearTimeout(timerId)
      activeTimers.splice(activeTimers.indexOf(timer), 1)
      return
    }
  }
}

export const clearTimers = (): void => {
  // create shallow copy to avoid mutation bug
  const timersCopy = [...activeTimers]
  for (const { id, type } of timersCopy) {
    if (type === 'interval') {
      clearInterval(id)
    } else {
      clearTimeout(id)
    }
  }
}
