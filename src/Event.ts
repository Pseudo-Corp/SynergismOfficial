import { player, getTimePinnedToLoadDate, format } from './Synergism'
import { Globals as G } from './Variables'
import { DOMCacheGetOrSet } from './Cache/DOM'
import i18next from 'i18next'
import { Alert, revealStuff } from './UpdateHTML'

interface HolidayData {
    name: string
    color: string
    url: string
    everyYear: boolean
    start: string
    end: string
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
const events: Record<string, HolidayData> = {
  default: {
    name: 'Game Modified',
    color: 'white',
    url: '',
    everyYear: true,
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
  last: {
    name: 'Quarkstravaganza 2023',
    color: '#a31f34',
    url: 'https://www.youtube.com/watch?v=eVH5DABrBQ0',
    everyYear: false,
    start: '12/14/2023 00:00:00',
    end: '12/17/2023 23:59:59',
    notice: 20,
    event: true,
    buffs: {
      quark: 2,
      globalSpeed: 0,
      ascensionSpeed: 0,
      antSacrifice: 0,
      offering: 0,
      obtainium: 0,
      octeract: 0,
      powderConversion: 0,
      goldenQuark: 0,
      blueberryTime: 0,
      ambrosiaLuck: 0,
      oneMind: 0.02
    }
  },
  khafra: {
    name: 'Thanks for Boosting the Discord',
    color: 'var(--green-text-color)', //Plat please use var color instead for any of these (darkorchid, orchid, darkcyan, red, maroon, orangered, crimson, gray, green, lightseagreen)
    url: 'https://www.youtube.com/watch?v=iYYRH4apXDo',
    everyYear: false,
    start: '12/07/2022 00:00:00',
    end: '12/08/2022 23:59:59',
    notice: 20,
    event: true,
    buffs: {
      quark: .2,
      globalSpeed: 0,
      ascensionSpeed: 0,
      antSacrifice: 0,
      offering: 0,
      obtainium: 0,
      octeract: 0,
      powderConversion: 0,
      goldenQuark: 0,
      oneMind: 0
    }
  }
  /*next: {
        name: 'Derpmas 2022: Daily Extravaganza!',
        color: 'white',
        url: 'https://www.youtube.com/watch?v=A6-vc-R9np8',
        everyYear: false,
        start: '12/25/2022 00:00:00',
        end: '01/01/2023 23:59:59',
        notice: 30,
        event: true,
        buffs: {
            quark: 0,
            globalSpeed: 0,
            ascensionSpeed: 0,
            antSacrifice: 0,
            offering: 0,
            obtainium: 0,
            octeract: 0,
            powderConversion: 0,
            goldenQuark: 0,
            oneMind: 0.05
        }
    }*/
  // Event example
  /*
    newyear: {
        name: '&#127881; New Year Event! &#127881;',
        color: 'yellow',
        url: '',
        everyYear: true,
        start: '12/31/2001 00:00:00',
        end: '01/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            ascensionSpeed: 2,
            globalSpeed: 2
        }
    },
    spring: {
        name: '&#127800; Spring Event! &#127800;',
        color: 'pink',
        url: '',
        everyYear: true,
        start: '04/01/2001 00:00:00',
        end: '04/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            ascensionScore: 0.5,
            antSacrifice: 1
        }
    },
    summer: {
        name: '&#9728 Summer Event! &#9728',
        color: 'lightgoldenrodyellow',
        url: '',
        everyYear: true,
        start: '07/01/2001 00:00:00',
        end: '07/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            ascensionSpeed: 1,
            obtainium: 2
        }
    },
    autumn: {
        name: '&#127810; Autumn Event! &#127810;',
        color: 'tomato',
        url: '',
        everyYear: true,
        start: '10/01/2001 00:00:00',
        end: '10/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            cubes: 1,
            offering: 2
        }
    },
    winter: {
        name: '&#10052 Winter Event! &#10052',
        color: 'lightblue',
        url: '',
        everyYear: true,
        start: '02/01/2001 00:00:00',
        end: '02/02/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            powderConversion: 2,
            globalSpeed: 2
        }
    },
    birthday: {
        name: '&#127874; Synergism Birthday! &#127874;',
        color: 'white',
        url: '',
        everyYear: true,
        start: '01/05/2001 00:00:00',
        end: '01/05/2001 23:59:59',
        notice: 3,
        event: true,
        buffs: {
            quark: 1,
            goldenQuark: 1,
            cubes: 1,
            powderConversion: 1,
            ascensionSpeed: 1,
            globalSpeed: 1,
            ascensionScore: 1,
            antSacrifice: 1,
            offering: 1,
            obtainium: 1
        }
    }
    */
}

let nowEvent = events.default

export const getEvent = (): HolidayData => {
  return nowEvent
}

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
  nowEvent = events.default
  //if (now.getTime() >= player.dayCheck.getTime()) {
  // Update currently valid events
  for (const e in events) {
    const event = events[e]
    if (event.name !== 'default' && event.event) {
      start = new Date(event.start)
      end = new Date(event.end)
      if (event.everyYear) {
        const nowFullYear = now.getFullYear()
        start = new Date(event.start)
        end = new Date(event.end)
        start.setFullYear(nowFullYear)
        end.setFullYear(nowFullYear)
        if (start.getTime() > end.getTime()) {
          end.setFullYear(nowFullYear + 1)
        }
        if (now.getTime() >= start.getTime() - 31536000000 && now.getTime() <= end.getTime() - 31536000000) {
          start.setFullYear(start.getFullYear() - 1)
          end.setFullYear(end.getFullYear() - 1)
        }
        if (now.getTime() >= end.getTime() + 86400000) {
          continue
        }
      } else if (now.getTime() >= end.getTime() + 86400000) {
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
  //}
  const happyHolidays = DOMCacheGetOrSet('happyHolidays') as HTMLAnchorElement
  const eventBuffs = DOMCacheGetOrSet('eventBuffs')
  const updateIsEventCheck = G.isEvent
  if (nowEvent.event) {
    start = new Date(nowEvent.start)
    end = new Date(nowEvent.end)
    if (nowEvent.everyYear) {
      const nowFullYear = now.getFullYear()
      start.setFullYear(nowFullYear)
      end.setFullYear(nowFullYear)
      if (start.getTime() > end.getTime()) {
        end.setFullYear(nowFullYear + 1)
      }
      if (now.getTime() >= start.getTime() - 31536000000 && now.getTime() <= end.getTime() - 31536000000) {
        start.setFullYear(start.getFullYear() - 1)
        end.setFullYear(end.getFullYear() - 1)
      }
    }
    G.isEvent = now.getTime() >= start.getTime() && now.getTime() <= end.getTime()
    let buffs = ''
    for (let i = 0; i < eventBuffType.length; i++) {
      const eventBuff = calculateEventSourceBuff(eventBuffType[i])
      if (eventBuff !== 0) {
        if (eventBuffType[i] === 'One Mind' && player.singularityUpgrades.oneMind.level > 0) {
          buffs += `<span style="color: gold">${eventBuff >= 0 ? '+' : '-'}${format(100 * eventBuff, 3, true)}% ${eventBuffName[i]}</span> ,`
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
    eventBuffs.innerHTML = G.isEvent ? 'Current Buffs: ' + buffs : ''
    //eventBuffs.style.color = 'lime';
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

const eventBuffType = ['Quarks', 'Golden Quarks', 'Cubes', 'Powder Conversion', 'Ascension Speed', 'Global Speed', 'Ascension Score', 'Ant Sacrifice', 'Offering', 'Obtainium', 'Octeract', 'Blueberry Time', 'Ambrosia Luck', 'One Mind']
const eventBuffName = ['Quarks', 'Golden Quarks', 'Cubes from all type', 'Powder Conversion', 'Ascension Speed', 'Global Speed', 'Ascension Score', 'Ant Sacrifice rewards', 'Offering', 'Obtainium', 'Eight Dimensional Hypercubes', 'Blueberry Time Generation', 'Ambrosia Luck (Additive)', 'One Mind Quark Bonus']

export const calculateEventSourceBuff = (buff: string): number => {
  const event = getEvent()
  switch (buff) {
    case 'Quarks': return event.buffs.quark ?? 0
    case 'Golden Quarks': return event.buffs.goldenQuark ?? 0
    case 'Cubes': return event.buffs.cubes ?? 0
    case 'Powder Conversion': return event.buffs.powderConversion ?? 0
    case 'Ascension Speed': return event.buffs.ascensionSpeed ?? 0
    case 'Global Speed': return event.buffs.globalSpeed ?? 0
    case 'Ascension Score': return event.buffs.ascensionScore ?? 0
    case 'Ant Sacrifice': return event.buffs.antSacrifice ?? 0
    case 'Offering': return event.buffs.offering ?? 0
    case 'Obtainium': return event.buffs.obtainium ?? 0
    case 'Octeract': return event.buffs.octeract ?? 0
    case 'One Mind': return (player.singularityUpgrades.oneMind.level > 0) ? event.buffs.oneMind ?? 0 : 0
    case 'Blueberry Time': return event.buffs.blueberryTime ?? 0
    case 'Ambrosia Luck': return event.buffs.ambrosiaLuck ?? 0
    default: return 0
  }
}

export const clickSmith = (): Promise<void> => {
  G.eventClicked = true
  DOMCacheGetOrSet('eventClicked').style.display = 'block'
  return Alert(i18next.t('event.aprilFools.clicked'))
}
