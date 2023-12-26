import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { format, getTimePinnedToLoadDate, player } from './Synergism'
import { Alert, revealStuff } from './UpdateHTML'
import { Globals as G } from './Variables'

interface HolidayData {
  name: string
  color: string
  url: string
  start: string
  end: string
  /** Time in days */
  notice: number
  event: boolean
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

// Editing the event is here
// can change the basic game balance by setting default to event: true, but cannot stack events
const events: HolidayData[] = [
  {
    name: 'fuck is this shit for?',
    color: 'white',
    url: '',
    start: '1/1/2001 00:00:00',
    end: '12/31/2099 23:59:59',
    notice: 0,
    event: false,
    buffs: {
      quark: -0.2,
      goldenQuark: 0,
      cubes: 0,
      powderConversion: 0,
      ascensionSpeed: 0,
      globalSpeed: 0,
      ascensionScore: 0,
      antSacrifice: 0,
      offering: 0,
      obtainium: 0
    }
  },
  // Last active event
  {
    name: 'Quarksmas 2023',
    color: '#a31f34',
    url: 'https://www.youtube.com/watch?v=eVH5DABrBQ0',
    start: '12/25/2023 00:00:00',
    end: '01/01/2024 00:00:00',
    notice: 2,
    event: true,
    buffs: {
      quark: 0.69,
      globalSpeed: 0.3,
      ascensionSpeed: 0.3,
      antSacrifice: 0.3,
      offering: 0.3,
      obtainium: 0.3,
      octeract: 0.3,
      powderConversion: 0.3,
      goldenQuark: 0.3,
      blueberryTime: 0.3,
      ambrosiaLuck: 0.3,
      oneMind: 0.03
    }
  }
]

let nowEvent = events[0]

export const getEvent = () => nowEvent

export const eventCheck = () => {
  if (!player.dayCheck) {
    return
  }
  const now = new Date(getTimePinnedToLoadDate())
  let start: Date
  let end: Date

  // Disable the event if there is any fraud, such as setting a device clock in the past
  /* TODO: Figure out why some people get tagged for cheating even when they are playing legitimately
             I have temporarily disabled the checks. */
  nowEvent = events[0]

  // if (now.getTime() >= player.dayCheck.getTime()) {
  // Update currently valid events
  for (const event of events) {
    if (event.event) {
      start = new Date(event.start)
      end = new Date(event.end)
      if (now.getTime() >= end.getTime() + 86400000) {
        continue
      }
      if (now.getTime() >= start.getTime() - event.notice * 86400000 && now.getTime() <= end.getTime()) {
        nowEvent = event
        if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
          break
        }
      }
    }
  }
  // }
  const happyHolidays = DOMCacheGetOrSet('happyHolidays') as HTMLAnchorElement
  const eventBuffs = DOMCacheGetOrSet('eventBuffs')
  const updateIsEventCheck = G.isEvent
  if (nowEvent.event) {
    start = new Date(nowEvent.start)
    end = new Date(nowEvent.end)
    G.isEvent = now.getTime() >= start.getTime() && now.getTime() <= end.getTime()
    let buffs = ''
    for (let i = 0; i < eventBuffType.length; i++) {
      const eventBuff = calculateEventSourceBuff(eventBuffType[i])
      if (eventBuff !== 0) {
        if (eventBuffType[i] === 'One Mind' && player.singularityUpgrades.oneMind.level > 0) {
          buffs += `<span style="color: gold">${eventBuff >= 0 ? '+' : '-'}${format(100 * eventBuff, 3, true)}% ${
            eventBuffName[i]
          }</span> ,`
        } else if (eventBuffType[i] !== 'One Mind' || player.singularityUpgrades.oneMind.level === 0) {
          buffs += `${eventBuff >= 0 ? '+' : '-'}${format(100 * eventBuff, 2, true)}% ${eventBuffName[i]}, `
        }
      }
    }
    if (buffs.length > 2) {
      buffs = buffs.substring(0, buffs.length - 2)
      buffs += '!'
    }
    DOMCacheGetOrSet('eventCurrent').textContent = G.isEvent
      ? i18next.t('settings.events.activeUntil', { x: end })
      : i18next.t('settings.events.starts', { x: start })
    eventBuffs.innerHTML = G.isEvent ? `Current Buffs: ${buffs}` : ''
    // eventBuffs.style.color = 'lime';
    happyHolidays.innerHTML = nowEvent.name
    happyHolidays.style.color = nowEvent.color
    happyHolidays.href = nowEvent.url.length > 0 ? nowEvent.url : '#'
  } else {
    G.isEvent = false
    DOMCacheGetOrSet('eventCurrent').innerHTML = i18next.t('settings.events.inactive')
    eventBuffs.textContent = now.getTime() >= player.dayCheck.getTime() ? '' : ''
    eventBuffs.style.color = 'var(--red-text-color)'
    happyHolidays.innerHTML = ''
    happyHolidays.href = ''
  }
  if (G.isEvent !== updateIsEventCheck) {
    revealStuff()
    player.caches.ambrosiaGeneration.updateVal('Event')
    player.caches.ambrosiaLuck.updateVal('Event')
  }
}

const eventBuffType = [
  'Quarks',
  'Golden Quarks',
  'Cubes',
  'Powder Conversion',
  'Ascension Speed',
  'Global Speed',
  'Ascension Score',
  'Ant Sacrifice',
  'Offering',
  'Obtainium',
  'Octeract',
  'Blueberry Time',
  'Ambrosia Luck',
  'One Mind'
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
  'Ambrosia Luck (Additive)',
  'One Mind Quark Bonus'
]

export const calculateEventSourceBuff = (buff: string): number => {
  const event = getEvent()
  switch (buff) {
    case 'Quarks':
      return event.buffs.quark ?? 0
    case 'Golden Quarks':
      return event.buffs.goldenQuark ?? 0
    case 'Cubes':
      return event.buffs.cubes ?? 0
    case 'Powder Conversion':
      return event.buffs.powderConversion ?? 0
    case 'Ascension Speed':
      return event.buffs.ascensionSpeed ?? 0
    case 'Global Speed':
      return event.buffs.globalSpeed ?? 0
    case 'Ascension Score':
      return event.buffs.ascensionScore ?? 0
    case 'Ant Sacrifice':
      return event.buffs.antSacrifice ?? 0
    case 'Offering':
      return event.buffs.offering ?? 0
    case 'Obtainium':
      return event.buffs.obtainium ?? 0
    case 'Octeract':
      return event.buffs.octeract ?? 0
    case 'One Mind':
      return (player.singularityUpgrades.oneMind.level > 0) ? event.buffs.oneMind ?? 0 : 0
    case 'Blueberry Time':
      return event.buffs.blueberryTime ?? 0
    case 'Ambrosia Luck':
      return event.buffs.ambrosiaLuck ?? 0
    default:
      return 0
  }
}

export const clickSmith = (): Promise<void> => {
  G.eventClicked = true
  DOMCacheGetOrSet('eventClicked').style.display = 'block'
  return Alert(i18next.t('event.aprilFools.clicked'))
}
