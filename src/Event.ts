import { player } from './Synergism'
import { Globals as G } from './Variables'
import { DOMCacheGetOrSet } from './Cache/DOM'
import i18next from 'i18next'
import { Alert, revealStuff } from './UpdateHTML'

export interface EventData {
  name: string
  color: string
  url: string
  start: Date
  end: Date
  notice: number
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
    oneMind?: number
  }
}

// Editing the event is here
const events = new Map<string, EventData>(Object.entries({
  last: {
    name: 'Synergism 3: More Synergies',
    color: 'white',
    url: 'https://www.youtube.com/watch?v=M8JO51TLGgg',
    start: new Date('05/01/2023 00:00:00'),
    end: new Date('05/07/2023 23:59:59'),
    notice: 20,
    buffs: {
      quark: 0.33,
      globalSpeed: 0.33,
      ascensionSpeed: 0.33,
      antSacrifice: 0.33,
      offering: 0.33,
      obtainium: 0.33,
      octeract: 0.33,
      powderConversion: 0.33,
      goldenQuark: 0,
      oneMind: 0.033
    }
  }
}))

export const Events = {
  lastFetchedList: 0,

  memoizedList: {} as Record<string, string[]>,

  /**
   * Return the names of all active and events that are starting or ending soon.
   */
  get list () {
    if (Date.now() - this.lastFetchedList <= 60_000) {
      return this.memoizedList
    }

    const list = {
      active: [] as string[],
      starting: [] as string[],
      ending: [] as string[]
    } satisfies Record<string, string[]>

    const date = Date.now()

    for (const [name, { start, end, notice }] of events) {
      const startTime = start.getTime()
      const endTime = end.getTime()

      // If the current time is between [start, end]
      if (date >= startTime && date <= endTime) {
        list.active.push(name)
        continue
      }

      const noticeOffset = 60 * 1000 * notice

      // If the event is starting soon
      if (date >= startTime - noticeOffset) {
        list.starting.push(name)
        continue
      }

      // If the event is ending soon
      if (date >= endTime - noticeOffset) {
        list.ending.push(name)
        continue
      }
    }

    this.lastFetchedList = Date.now()
    this.memoizedList = list

    return list
  },

  /**
   * Return the buffs/debuffs for the active event, stacked
   */
  get rewards (): Required<EventData['buffs']> {
    const { active } = this.list
    const rewards = {
      quark: 0,
      goldenQuark: 0,
      cubes: 0,
      powderConversion: 0,
      ascensionSpeed: 0,
      globalSpeed: 0,
      ascensionScore: 0,
      antSacrifice: 0,
      offering: 0,
      obtainium: 0,
      octeract: 0,
      oneMind: 0
    } satisfies EventData['buffs']

    if (active.length === 0) {
      return rewards
    }

    return active.reduce((a, b) => {
      const { buffs } = events.get(b)!
      for (const key of Object.keys(buffs) as (keyof EventData['buffs'])[]) {
        a[key] += buffs[key] ?? 0
      }

      return a
    }, rewards)
  },

  setBuffText () {
    const { active } = this.list
    const buffs = this.rewards
    const buffText: string[] = []

    for (const [key, value] of Object.entries(buffs)) {
      // If there is no buff
      if (!value) continue

      if (key === 'oneMind' && player.singularityUpgrades.oneMind.level > 0) {
        buffText.push(`<span style="color: gold">${value > 0 ? '+' : '-'}${Math.round(Math.abs(value) * 100)}% ${key}</span>`)
      } else {
        buffText.push(`${value > 0 ? '+' : '-'}${Math.round(Math.abs(value) * 100)}% ${key}`)
      }
    }

    if (buffText.length) {
      const text = `${buffText.join(', ')}!`
      DOMCacheGetOrSet('eventBuffs').innerHTML = text

      const { start, end, url } = active.reduce((a, b) => {
        const { start, end, url } = events.get(b)!

        if (a.start > start.getTime()) a.start = start.getTime()
        if (a.end < end.getTime()) a.end = end.getTime()
        if (url) a.url = url

        return a
      }, { start: Infinity, end: 0, url: '' })

      const href = DOMCacheGetOrSet('happyHolidays') as HTMLAnchorElement
      href.textContent = active.join(', ')
      href.href = url.length ? url : '#'

      DOMCacheGetOrSet('eventCurrent').textContent = G.isEvent
        ? i18next.t('settings.events.activeUntil', { x: new Date(end) })
        : i18next.t('settings.events.starts', { x: new Date(start) })

      revealStuff()
    }
  }
}

export const clickSmith = (): Promise<void> => {
  G.eventClicked = true
  DOMCacheGetOrSet('eventClicked').style.display = 'block'
  return Alert(i18next.t('event.aprilFools.clicked'))
}
