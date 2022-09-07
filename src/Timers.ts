import * as workerTimers from 'worker-timers'

interface ActiveTimer {
	id: number
	type: 'interval' | 'timeout'
}

const activeTimers: ActiveTimer[] = []

export const setInterval: typeof workerTimers['setInterval'] = (fn, delay) => {
    const timer = workerTimers.setInterval(fn, delay)
    activeTimers.push({ id: timer, type: 'interval' })
    return timer
}

export const clearInterval: typeof workerTimers['clearInterval'] = (timerId) => {
    for (const timer of activeTimers) {
        if (timer.type === 'interval' && timer.id === timerId) {
            workerTimers.clearInterval(timerId)
            activeTimers.splice(activeTimers.indexOf(timer), 1)
            return
        }
    }
}

export const setTimeout: typeof workerTimers['setTimeout'] = (fn, delay) => {
    const timer = workerTimers.setTimeout(fn, delay)
    activeTimers.push({ id: timer, type: 'timeout' })
    return timer
}

export const clearTimeout: typeof workerTimers['clearTimeout'] = (timerId) => {
    for (const timer of activeTimers) {
        if (timer.type === 'timeout' && timer.id === timerId) {
            workerTimers.clearTimeout(timerId)
            activeTimers.splice(activeTimers.indexOf(timer), 1)
            return
        }
    }
}

export const clearTimers = (): void => {
    for (const { id, type } of activeTimers) {
        if (type === 'interval') {
            clearInterval(id)
        } else {
            clearTimeout(id)
        }
    }
}