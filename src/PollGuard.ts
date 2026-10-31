const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const maxClockLeadMs = 1000 * 60 * 60 * 12
const probeDelayMs = 5000
const probeMinimumElapsedMs = 4000
const maxPollingDurationMs = 1000 * 60 * 60 * 24 * 30

let pollsStopped = false

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

  if (Date.now() - parseHttpDate(header) > maxClockLeadMs) {
    pollsStopped = true
  }
}

export const startSpeedProbe = async () => {
  while (!pollsStopped) {
    const start = Date.now()

    await new Promise<void>((resolve) => {
      const int = setInterval(() => {
        clearInterval(int)
        resolve()
      }, probeDelayMs)
    })

    if (Date.now() - start < probeMinimumElapsedMs) {
      pollsStopped = true
    }
  }
}

export const guardPoll = (poll: () => void, interval: number) => {
  let remainingCalls = Math.floor(maxPollingDurationMs / interval)

  return () => {
    if (pollsStopped || remainingCalls === 0) {
      return
    }

    remainingCalls--
    poll()
  }
}
