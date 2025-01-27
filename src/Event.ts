import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAdditiveLuckMult, calculateAmbrosiaGenerationSpeed, calculateAmbrosiaLuck } from './Calculate'
import { getTimePinnedToLoadDate, player } from './Synergism'
import { revealStuff } from './UpdateHTML'
import { timeReminingHours } from './Utility'
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

export let nowEvent: GameEvent | null = null

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

  const eventNowEndDate = new Date(nowEvent?.end ?? 0)
  DOMCacheGetOrSet('globalEventTimer').textContent = timeReminingHours(eventNowEndDate)

  const updateIsEventCheck = G.isEvent

  if (nowEvent) {
    G.isEvent = true
  } else {
    G.isEvent = false
  }

  if (G.isEvent !== updateIsEventCheck) {
    revealStuff()
    G.ambrosiaCurrStats.ambrosiaAdditiveLuckMult = calculateAdditiveLuckMult().value
    G.ambrosiaCurrStats.ambrosiaLuck = calculateAmbrosiaLuck().value
    G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value
  }
}

export const eventBuffType: (keyof typeof BuffType)[] = [
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
