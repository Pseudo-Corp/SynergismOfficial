import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAdditiveLuckMult, calculateAmbrosiaGenerationSpeed, calculateAmbrosiaLuck } from './Calculate'
import { format, getTimePinnedToLoadDate, player } from './Synergism'
import { Alert, revealStuff } from './UpdateHTML'
import { Globals as G } from './Variables'

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

interface GameEvent {
  name: string[]
  url: string[]
  start: number
  end: number
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
  color: string[]
}

let nowEvent: GameEvent | null = null

export const getEvent = () => nowEvent

export const eventCheck = async () => {
  if (!player.dayCheck) {
    return
  }

  const response = await fetch('https://synergism.cc/api/v2/events/get')

  if (!response.ok) {
    throw new Error('God fucking dammit')
  }

  const apiEvents = await response.json() as GameEvent

  nowEvent = null

  const now = new Date(getTimePinnedToLoadDate()).getTime()

  if (now >= apiEvents.start && now <= apiEvents.end && apiEvents.name.length) {
    nowEvent = apiEvents
  }

  const happyHolidays = DOMCacheGetOrSet('happyHolidays') as HTMLAnchorElement
  const eventBuffs = DOMCacheGetOrSet('eventBuffs')
  const updateIsEventCheck = G.isEvent

  if (nowEvent) {
    G.isEvent = true
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

    DOMCacheGetOrSet('eventCurrent').textContent = i18next.t('settings.events.activeUntil', {
      x: new Date(nowEvent.end)
    })

    eventBuffs.innerHTML = G.isEvent && buffs.length ? `Current Buffs: ${buffs.join(', ')}` : ''
    // eventBuffs.style.color = 'lime';
    happyHolidays.innerHTML = `(${nowEvent.name.length}) ${nowEvent.name.join(', ')}`
    happyHolidays.style.color = nowEvent.color[Math.floor(Math.random() * nowEvent.color.length)]
    happyHolidays.href = nowEvent.url.length > 0 ? nowEvent.url[Math.floor(Math.random() * nowEvent.url.length)] : '#'
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
    G.ambrosiaCurrStats.ambrosiaAdditiveLuckMult = calculateAdditiveLuckMult().value
    G.ambrosiaCurrStats.ambrosiaLuck = calculateAmbrosiaLuck().value
    G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value
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
      return event.quark ?? 0
    case BuffType.GoldenQuark:
      return event.goldenQuark ?? 0
    case BuffType.Cubes:
      return event.cubes ?? 0
    case BuffType.PowderConversion:
      return event.powderConversion ?? 0
    case BuffType.AscensionSpeed:
      return event.ascensionSpeed ?? 0
    case BuffType.GlobalSpeed:
      return event.globalSpeed ?? 0
    case BuffType.AscensionScore:
      return event.ascensionScore ?? 0
    case BuffType.AntSacrifice:
      return event.antSacrifice ?? 0
    case BuffType.Offering:
      return event.offering ?? 0
    case BuffType.Obtainium:
      return event.obtainium ?? 0
    case BuffType.Octeract:
      return event.octeract ?? 0
    case BuffType.OneMind:
      return player.singularityUpgrades.oneMind.level > 0 ? event.oneMind : 0
    case BuffType.BlueberryTime:
      return event.blueberryTime ?? 0
    case BuffType.AmbrosiaLuck:
      return event.ambrosiaLuck ?? 0
  }
}

export const clickSmith = (): Promise<void> => {
  G.eventClicked = true
  DOMCacheGetOrSet('eventClicked').style.display = 'block'
  return Alert(i18next.t('event.aprilFools.clicked'))
}
