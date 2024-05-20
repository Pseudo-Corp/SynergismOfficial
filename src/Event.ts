import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { format, getTimePinnedToLoadDate, player } from './Synergism'
import { Alert, revealStuff } from './UpdateHTML'
import { Globals as G } from './Variables'

const dayMs = 60 * 1000 * 60 * 24

export enum BuffType {
  Quark = 0,
  GoldenQuark = 1,
  Cubes = 2,
  PowderConversion = 3,
  AscensionSpeed = 4,
  GlobalSpeed = 5,
  AscensionScore = 6,
  AntSacrifice = 7,
  Offering = 8,
  Obtainium = 9,
  Octeract = 10,
  BlueberryTime = 11,
  AmbrosiaLuck = 12,
  OneMind = 13
}

interface EventData {
  name: string
  color: string
  url: string
  start: string
  end: string
  buffs: {
    quark?: number
    goldenQuark?: number
    cubes?: number
    powderConversion?: number
    ascensionSpeed?: number
    globalSpeed?: number
    ascensionScore?: number
    antSacrifice?: number
    offering?: number
    obtainium?: number
    octeract?: number
    blueberryTime?: number
    ambrosiaLuck?: number
    oneMind?: number
  }
}

interface APIEventData {
  name: string
  url: string
  start: `${number}-${number}-${number}T${number}:${number}`
  end: `${number}-${number}-${number}T${number}:${number}`
  quark: number
  goldenQuark: number
  cubes: number
  powderConversion: number
  ascensionSpeed: number
  globalSpeed: number
  ascensionScore: number
  antSacrifice: number
  offering: number
  obtainium: number
  octeract: number
  blueberryTime: number
  ambrosiaLuck: number
  oneMind: number
  color: string
}

let nowEvent: EventData | null = null

export const getEvent = () => nowEvent

export const eventCheck = async () => {
  if (!player.dayCheck) {
    return
  }

  const response = await fetch('https://synergism.cc/api/v1/events/get')

  if (!response.ok) {
    throw new Error('God fucking dammit')
  }

  const apiEvents = await response.json() as APIEventData[]

  const events: EventData[] = apiEvents.map((value) => {
    const { name, color, start, end, url, ...buffs } = value
    return {
      name,
      color,
      start,
      end,
      url,
      buffs
    }
  })

  const activeEvents: EventData[] = []
  nowEvent = null

  const now = new Date(getTimePinnedToLoadDate())
  let start: Date
  let end: Date

  for (const event of events) {
    // TODO: use setDate instead to set the correct day.
    start = new Date(event.start)
    end = new Date(event.end)

    if (now.getTime() >= end.getTime() + dayMs) {
      continue
    }

    if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
      activeEvents.push(event)
    }
  }

  const happyHolidays = DOMCacheGetOrSet('happyHolidays') as HTMLAnchorElement
  const eventBuffs = DOMCacheGetOrSet('eventBuffs')
  const updateIsEventCheck = G.isEvent

  if (activeEvents.length) {
    nowEvent = activeEvents.slice(1).reduce((prev, curr) => {
      prev.name += `, ${curr.name}`

      for (const key of (Object.keys(curr.buffs) as (keyof EventData['buffs'])[])) {
        prev.buffs[key] ??= 0
        // biome-ignore lint/suspicious/noExtraNonNullAssertion: rule is broken
        prev.buffs[key]! += curr.buffs[key]!
      }

      // Pick the oldest time as the start, and the furthest time away as the end.
      if (new Date(prev.start).getTime() > new Date(curr.start).getTime()) {
        prev.start = curr.start
      }
      if (new Date(prev.end).getTime() < new Date(curr.end).getTime()) {
        prev.end = curr.end
      }

      return prev
    }, cloneEvent(activeEvents[0]))

    start = new Date(nowEvent.start)
    end = new Date(nowEvent.end)
    G.isEvent = activeEvents.length > 0
    const buffs: string[] = []

    for (let i = 0; i < eventBuffType.length; i++) {
      const eventBuff = calculateEventSourceBuff(BuffType[eventBuffType[i]])

      if (eventBuff !== 0) {
        if (eventBuffType[i] === 'OneMind' && player.singularityUpgrades.oneMind.level > 0) {
          buffs.push(
            `<span style="color: gold">${eventBuff >= 0 ? '+' : '-'}${format(100 * eventBuff, 3, true)}% ${
              eventBuffName[i]
            }</span>`
          )
        } else if (eventBuffType[i] !== 'OneMind' || player.singularityUpgrades.oneMind.level === 0) {
          buffs.push(`${eventBuff >= 0 ? '+' : '-'}${format(100 * eventBuff, 2, true)}% ${eventBuffName[i]}`)
        }
      }
    }

    DOMCacheGetOrSet('eventCurrent').textContent = G.isEvent
      ? i18next.t('settings.events.activeUntil', { x: end })
      : i18next.t('settings.events.starts', { x: start })
    eventBuffs.innerHTML = G.isEvent && buffs.length ? `Current Buffs: ${buffs.join(', ')}` : ''
    // eventBuffs.style.color = 'lime';
    happyHolidays.innerHTML = `(${activeEvents.length}) ${nowEvent.name}`
    happyHolidays.style.color = nowEvent.color
    happyHolidays.href = nowEvent.url.length > 0 ? nowEvent.url : '#'
  } else {
    G.isEvent = false
    DOMCacheGetOrSet('eventCurrent').innerHTML = i18next.t('settings.events.inactive')
    eventBuffs.textContent = ''
    eventBuffs.style.color = 'var(--red-text-color)'
    happyHolidays.innerHTML = ''
    happyHolidays.href = ''
  }

  if (G.isEvent !== updateIsEventCheck) {
    revealStuff()
    player.caches.ambrosiaGeneration.updateVal('Event')
    player.caches.ambrosiaLuckAdditiveMult.updateVal('Event')
  }
}

const eventBuffType: (keyof typeof BuffType)[] = [
  'Quark',
  'GoldenQuark',
  'Cubes',
  'PowderConversion',
  'AscensionSpeed',
  'GlobalSpeed',
  'AscensionScore',
  'AntSacrifice',
  'Offering',
  'Obtainium',
  'Octeract',
  'BlueberryTime',
  'AmbrosiaLuck',
  'OneMind'
]
const eventBuffName = [
  'Quarks',
  'Golden Quarks',
  'Cubes from all type',
  'Powder Conversion',
  'Ascension Speed',
  'Global Speed',
  'Ascension Score',
  'Ant Sacrifice rewards',
  'Offering',
  'Obtainium',
  'Eight Dimensional Hypercubes',
  'Blueberry Time Generation',
  'Ambrosia Luck (Additive Mult)',
  'One Mind Quark Bonus'
]

export const calculateEventSourceBuff = (buff: BuffType): number => {
  const event = getEvent()

  if (event === null) {
    return 0
  }

  switch (buff) {
    case BuffType.Quark:
      return event.buffs.quark ?? 0
    case BuffType.GoldenQuark:
      return event.buffs.goldenQuark ?? 0
    case BuffType.Cubes:
      return event.buffs.cubes ?? 0
    case BuffType.PowderConversion:
      return event.buffs.powderConversion ?? 0
    case BuffType.AscensionSpeed:
      return event.buffs.ascensionSpeed ?? 0
    case BuffType.GlobalSpeed:
      return event.buffs.globalSpeed ?? 0
    case BuffType.AscensionScore:
      return event.buffs.ascensionScore ?? 0
    case BuffType.AntSacrifice:
      return event.buffs.antSacrifice ?? 0
    case BuffType.Offering:
      return event.buffs.offering ?? 0
    case BuffType.Obtainium:
      return event.buffs.obtainium ?? 0
    case BuffType.Octeract:
      return event.buffs.octeract ?? 0
    case BuffType.OneMind:
      return (player.singularityUpgrades.oneMind.level > 0) ? event.buffs.oneMind ?? 0 : 0
    case BuffType.BlueberryTime:
      return event.buffs.blueberryTime ?? 0
    case BuffType.AmbrosiaLuck:
      return event.buffs.ambrosiaLuck ?? 0
  }
}

export const clickSmith = (): Promise<void> => {
  G.eventClicked = true
  DOMCacheGetOrSet('eventClicked').style.display = 'block'
  return Alert(i18next.t('event.aprilFools.clicked'))
}

const cloneEvent = (event: EventData): EventData => {
  return { ...event, buffs: { ...event.buffs } }
}
