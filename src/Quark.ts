import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateAutoWarpQuarkMultiplier,
  calculateCubeQuarkMultiplier,
  calculateMaxSingularityTimeQuarkMultiplier,
  calculateQuarkMultiplier
} from './Calculate'
import { quarksFromELOMult } from './Features/Ants/AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/calculate-quarks'
import { getOcteractUpgradeEffect } from './Octeracts'
import { checkServerDate } from './PollGuard'
import { getShopUpgradeEffects } from './Shop'
import { format, player } from './Synergism'

const quarkResearches = [99, 100, 125, 180, 195]

export const quarkHandler = () => {
  let maxTime = 90000 // In Seconds
  if (player.researches[195] > 0) {
    maxTime += 18000 * player.researches[195] // Research 8x20
  }

  // Part 2: Calculate quark gain per hour
  let baseQuarkPerHour = 5

  for (const el of quarkResearches) {
    baseQuarkPerHour += player.researches[el]
  }

  baseQuarkPerHour *= getOcteractUpgradeEffect('octeractExportQuarks', 'exportQuarkMult')

  const quarkPerHour = baseQuarkPerHour

  // Part 3: Calculates capacity of quarks on export
  const capacity = Math.floor(quarkPerHour * maxTime / 3600)

  // Part 4: Calculate how many quarks are to be gained.
  const quarkGain = Math.floor(player.quarkstimer * quarkPerHour / 3600)

  // Return maxTime, quarkPerHour, capacity and quarkGain as object
  return {
    maxTime,
    perHour: quarkPerHour,
    capacity,
    gain: quarkGain
  }
}

let bonus = 0
let personalQuarkBonus = 0
let globalQuarkBonus = 0

const recalculateBonus = () => {
  bonus = 100 * (1 + globalQuarkBonus / 100) * (1 + personalQuarkBonus / 100) - 100
}

const updateQuarkUI = (personalBonus: number, globalBonus: number) => {
  const currentBonus = DOMCacheGetOrSet('currentBonus')
  if (personalBonus > 0) {
    currentBonus.innerHTML = i18next.t('settings.quarkBonusExtended', {
      globalBonus,
      personalBonusMult: format(1 + personalBonus / 100, 3, true),
      totalBonus: format(bonus, 2, true)
    })
  } else {
    currentBonus.innerHTML = i18next.t('settings.quarkBonusSimple', { globalBonus })
  }
}

export const getQuarkBonus = () => bonus

export const getGlobalBonus = () => globalQuarkBonus
export const getPersonalBonus = () => personalQuarkBonus

export const setPersonalQuarkBonus = (personalBonus: number) => {
  personalQuarkBonus = personalBonus
  recalculateBonus()

  updateQuarkUI(personalBonus, globalQuarkBonus)
}

export const setGlobalQuarkBonus = (globalBonus: number) => {
  globalQuarkBonus = globalBonus
  recalculateBonus()

  updateQuarkUI(personalQuarkBonus, globalBonus)
}

class QuarkHandler {
  /*** Calculates the number of quarks to give with the current bonus. */
  applyBonus (amount: number) {
    return amount * calculateQuarkMultiplier()
  }

  /** Subtracts quarks, as the name suggests. */
  add (amount: number, addToQuarksThisSingularity: boolean) {
    player.worlds += amount
    if (addToQuarksThisSingularity) {
      player.quarksThisSingularity += amount
    }
    return this
  }

  /** Add quarks, as suggested by the function's name. */
  sub (amount: number) {
    player.worlds -= amount
    if (player.worlds < 0) {
      this.set(0)
    }

    return this
  }

  set (value: number) {
    player.worlds = value
  }

  public toString (val: number): string {
    return format(Math.floor(this.applyBonus(val)), 0, true)
  }
}

export const worlds = new QuarkHandler()

export const quarkSourceKeys = [
  'cubes',
  'tesseracts',
  'hypercubes',
  'platonics',
  'ants',
  'export',
  'dailyCode',
  'addCode',
  'timeCode',
  'promoCodes',
  'challenges',
  'synthesis',
  'purpleReactor'
] as const

export type QuarkSourceKey = typeof quarkSourceKeys[number]

export type QuarkLedgerBase = Record<QuarkSourceKey, number>

export interface QuarkLedger {
  base: QuarkLedgerBase
  awarded: number
  challengeCompletions: number[]
}

interface QuarkMultiplierLine {
  i18n: string
  stat: () => number
}

export const quarkCategoryKeys = ['primary', 'miscellaneous'] as const

export type QuarkCategoryKey = typeof quarkCategoryKeys[number]

interface QuarkCategory {
  multiplier: () => number
}

interface QuarkSource {
  category: QuarkCategoryKey
  lines: QuarkMultiplierLine[]
  multiplier: () => number
  unlocked: () => boolean
}

export const quarkCategories: Record<QuarkCategoryKey, QuarkCategory> = {
  primary: {
    multiplier: () =>
      Math.max(1, calculateMaxSingularityTimeQuarkMultiplier() * Math.min(1, player.singularityCounter / 86400))
  },
  miscellaneous: {
    multiplier: () => 1
  }
}

const overfluxOrbLine: QuarkMultiplierLine = {
  i18n: 'overfluxOrbs',
  stat: () => calculateCubeQuarkMultiplier()
}

export const quarkSources: Record<QuarkSourceKey, QuarkSource> = {
  cubes: {
    category: 'primary',
    lines: [
      { i18n: 'cubeToQuark', stat: () => getShopUpgradeEffects('cubeToQuark', 'cubeQuarkMult') },
      overfluxOrbLine
    ],
    multiplier: () => getShopUpgradeEffects('cubeToQuark', 'cubeQuarkMult') * calculateCubeQuarkMultiplier(),
    unlocked: () => player.unlocks.ascensions
  },
  tesseracts: {
    category: 'primary',
    lines: [
      { i18n: 'tesseractToQuark', stat: () => getShopUpgradeEffects('tesseractToQuark', 'tesseractQuarkMult') },
      overfluxOrbLine
    ],
    multiplier: () => getShopUpgradeEffects('tesseractToQuark', 'tesseractQuarkMult') * calculateCubeQuarkMultiplier(),
    unlocked: () => player.unlocks.tesseracts
  },
  hypercubes: {
    category: 'primary',
    lines: [
      { i18n: 'hypercubeToQuark', stat: () => getShopUpgradeEffects('hypercubeToQuark', 'hypercubeQuarkMult') },
      overfluxOrbLine
    ],
    multiplier: () => getShopUpgradeEffects('hypercubeToQuark', 'hypercubeQuarkMult') * calculateCubeQuarkMultiplier(),
    unlocked: () => player.unlocks.hypercubes
  },
  platonics: {
    category: 'primary',
    lines: [
      { i18n: 'platonicCubes', stat: () => 1.5 },
      overfluxOrbLine
    ],
    multiplier: () => 1.5 * calculateCubeQuarkMultiplier(),
    unlocked: () => player.unlocks.platonics
  },
  ants: {
    category: 'primary',
    lines: [
      { i18n: 'allTimeLeaderboard', stat: () => quarksFromELOMult() },
      { i18n: 'autoWarp', stat: () => calculateAutoWarpQuarkMultiplier() }
    ],
    multiplier: () => quarksFromELOMult() * calculateAutoWarpQuarkMultiplier(),
    unlocked: () => player.ants.antSacrificeCount > 0
  },
  export: {
    category: 'miscellaneous',
    lines: [],
    multiplier: () => 1,
    unlocked: () => true
  },
  dailyCode: {
    category: 'miscellaneous',
    lines: [
      { i18n: 'highestSingularity', stat: () => 1 + Math.min(49, player.highestSingularityCount) }
    ],
    multiplier: () => 1 + Math.min(49, player.highestSingularityCount),
    unlocked: () => true
  },
  addCode: {
    category: 'miscellaneous',
    lines: [],
    multiplier: () => 1,
    unlocked: () => true
  },
  timeCode: {
    category: 'miscellaneous',
    lines: [],
    multiplier: () => 1,
    unlocked: () => true
  },
  promoCodes: {
    category: 'miscellaneous',
    lines: [],
    multiplier: () => 1,
    unlocked: () => true
  },
  challenges: {
    category: 'primary',
    lines: [],
    multiplier: () => 1,
    unlocked: () => player.unlocks.transcend || player.highestSingularityCount > 0
  },
  synthesis: {
    category: 'primary',
    lines: [],
    multiplier: () => 1,
    unlocked: () => player.quarkLedger.base.synthesis > 0
  },
  purpleReactor: {
    category: 'primary',
    lines: [],
    multiplier: () => 1,
    unlocked: () => player.quarkLedger.base.purpleReactor > 0
  }
}

export const getQuarkSourceMultiplier = (key: QuarkSourceKey) =>
  quarkSources[key].multiplier() * quarkCategories[quarkSources[key].category].multiplier()

export const createBlankQuarkLedger = (): QuarkLedger => ({
  base: Object.fromEntries(quarkSourceKeys.map((key) => [key, 0])) as QuarkLedgerBase,
  awarded: 0,
  challengeCompletions: Array(15).fill(0) as number[]
})

export const getQuarkSourceQuarks = (key: QuarkSourceKey, globalMultiplier = calculateQuarkMultiplier()) =>
  player.quarkLedger.base[key] * getQuarkSourceMultiplier(key) * globalMultiplier

export const getQuarkLedgerQuarks = (globalMultiplier = calculateQuarkMultiplier()) => {
  let quarks = 0
  for (const key of quarkSourceKeys) {
    quarks += getQuarkSourceQuarks(key, globalMultiplier)
  }
  return Math.floor(quarks)
}

export const settleQuarks = () => {
  const owed = getQuarkLedgerQuarks() - player.quarkLedger.awarded
  if (owed <= 0) {
    return 0
  }
  player.quarkLedger.awarded += owed
  worlds.add(owed, true)
  return owed
}

export const addBaseQuarks = (key: QuarkSourceKey, amount: number) => {
  if (!(amount > 0)) {
    return 0
  }
  player.quarkLedger.base[key] += amount
  return settleQuarks()
}

export const resetQuarkLedger = () => {
  settleQuarks()
  player.quarkLedger = createBlankQuarkLedger()
}

export const refreshQuarkBonus = async () => {
  const response = await fetch('https://synergism.cc/api/v1/quark-bonus')

  checkServerDate(response)

  // eslint-disable-next-line no-shadow
  const { bonus } = await response.json() as { bonus: number }

  setGlobalQuarkBonus(bonus)
}
