import { clearEvent } from './Event'
import { DateNow, PerformanceNow } from './Utility'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const probeDelayMs = 5000
const probeMinimumElapsedMs = 4000
const maxClockRate = 2
const serverDateSlackMs = 30_000
const strikesToStop = 3
const pollCreditPerInterval = 4

export let pollsStopped = false

let lastServerDate = 0
let lastServerClocks = { wall: 0, mono: 0 }
let serverStrikes = 0

const stopPolls = () => {
  pollsStopped = true
  clearEvent()
}

const readClocks = () => ({ wall: DateNow(), mono: PerformanceNow() })

const elapsedSince = (clocks: ReturnType<typeof readClocks>) =>
  Math.max(DateNow() - clocks.wall, PerformanceNow() - clocks.mono)

const daysSinceEpoch = (year: number, month: number, day: number) => {
  const shiftedYear = month <= 1 ? year - 1 : year
  const era = Math.floor(shiftedYear / 400)
  const yearOfEra = shiftedYear - era * 400
  const shiftedMonth = (month + 10) % 12
  const dayOfYear = Math.floor((153 * shiftedMonth + 2) / 5) + day - 1
  const dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear

  return era * 146097 + dayOfEra - 719468
}

const parseHttpDate = (header: string) => {
  const parts = header.split(' ')

  if (parts.length !== 6) {
    return Number.NaN
  }

  const [, day, monthName, year, time] = parts
  const month = monthNames.indexOf(monthName)

  if (month === -1) {
    return Number.NaN
  }

  const [hours, minutes, seconds] = time.split(':').map(Number)
  const days = daysSinceEpoch(Number(year), month, Number(day))

  return (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000
}

export const checkServerDate = (response: Response) => {
  const header = response.headers.get('date')

  if (header === null) {
    return
  }

  const serverDate = parseHttpDate(header)

  if (Number.isNaN(serverDate) || serverDate <= lastServerDate) {
    return
  }

  const isFast = elapsedSince(lastServerClocks) > maxClockRate * (serverDate - lastServerDate) + serverDateSlackMs

  serverStrikes = isFast ? serverStrikes + 1 : 0
  lastServerDate = serverDate
  lastServerClocks = readClocks()

  if (serverStrikes === strikesToStop) {
    stopPolls()
  }
}

export const startSpeedProbe = async () => {
  let strikes = 0

  while (!pollsStopped) {
    const clocks = readClocks()

    await new Promise<void>((resolve) => {
      const int = setInterval(() => {
        clearInterval(int)
        resolve()
      }, probeDelayMs)
    })

    strikes = elapsedSince(clocks) < probeMinimumElapsedMs ? strikes + 1 : 0

    if (strikes === strikesToStop) {
      stopPolls()
    }
  }
}

export const guardPoll = (poll: () => void, interval: number) => {
  let clocks = readClocks()
  let credit = 0

  return () => {
    if (pollsStopped) {
      return
    }

    credit = Math.max(credit, pollCreditPerInterval * elapsedSince(clocks) / interval) - 1
    clocks = readClocks()

    if (credit < 0) {
      stopPolls()
      return
    }

    poll()
  }
}
