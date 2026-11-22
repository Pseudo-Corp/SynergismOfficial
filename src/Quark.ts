import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateCubeQuarkMultiplier,
  calculateDailyWarpQuarkMultiplier,
  calculateQuarkMultiplier,
  calculateSingularityTimeQuarkRate
} from './Calculate'
import { quarksFromELOMult } from './Features/Ants/AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/calculate-quarks'
import { getOcteractUpgradeEffect } from './Octeracts'
import { checkServerDate } from './PollGuard'
import { getPurpleReactorUpgradeEffects } from './Purple'
import { isResearchMaxed } from './Research'
import { RuneType } from './Runes'
import { getShopUpgradeEffects } from './Shop'
import { format, player } from './Synergism'
import { getSynthesisUpgradeEffect } from './Synthesis'

const quarkResearches = [99, 100, 125, 180, 195]

export const dailyExportBaseQuarks = 60

const calculateExportResearchMultiplier = () => {
  let levels = 0
  for (const research of quarkResearches) {
    levels += player.researches[research]
  }
  return 1 + 0.2 * levels
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

export type QuarkSourceRecord = Record<QuarkSourceKey, number>

export interface QuarkLedger {
  base: QuarkSourceRecord
  awarded: QuarkSourceRecord
  credited: Record<QuarkCategoryKey, number>
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

export const calculateSingularityTimePrimaryMultiplier = (singularityTime: number) => {
  if (!getShopUpgradeEffects('shopRootsOfUnity', 'singularityTimeQuarks')) {
    return 1
  }
  return Math.max(1, calculateSingularityTimeQuarkRate() * singularityTime / 86400)
}

const calculatePrimaryQuarkMultiplier = (singularityTime: number) =>
  calculateSingularityTimePrimaryMultiplier(singularityTime) * calculateDailyWarpQuarkMultiplier()

export const quarkCategories: Record<QuarkCategoryKey, QuarkCategory> = {
  primary: {
    multiplier: () => calculatePrimaryQuarkMultiplier(player.singularityCounter)
  },
  miscellaneous: {
    multiplier: () => 1
  }
}

const overfluxOrbLine: QuarkMultiplierLine = {
  i18n: 'overfluxOrbs',
  stat: () => calculateCubeQuarkMultiplier()
}

const basicProgressionMilestones: (() => boolean)[] = [
  () => player.reincarnationCount > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[6] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[7] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[8] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[9] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[10] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
  () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[11] > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[12] > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[13] > 0 || player.highestSingularityCount > 0,
  () => player.challengecompletions[14] > 0 || player.highestSingularityCount > 0,
  () => isResearchMaxed(200),
  () => player.cubeUpgrades[50] >= 100000,
  () => player.platonicUpgrades[5] > 0,
  () => player.platonicUpgrades[10] > 0,
  () => player.platonicUpgrades[15] > 0,
  () => player.platonicUpgrades[20] > 0,
  () => player.runeLevels[RuneType.Antiquities] > 0,
  () => player.corruptions.highestCleared >= 45
]

const calculateBasicProgressionMultiplier = () => {
  let multiplier = 1
  for (const milestone of basicProgressionMilestones) {
    if (milestone()) {
      multiplier += 1
    }
  }
  return multiplier
}

const exportResearchLine: QuarkMultiplierLine = {
  i18n: 'exportResearches',
  stat: () => calculateExportResearchMultiplier()
}

export const calculateTimeCodeCookieMultiplier = () => 1 + 0.03 * player.cubeUpgrades[61]

const octeractExportLine: QuarkMultiplierLine = {
  i18n: 'octeractExportQuarks',
  stat: () => getOcteractUpgradeEffect('octeractExportQuarks', 'exportQuarkMult')
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
      { i18n: 'allTimeLeaderboard', stat: () => quarksFromELOMult() }
    ],
    multiplier: () => quarksFromELOMult(),
    unlocked: () => player.ants.antSacrificeCount > 0
  },
  export: {
    category: 'miscellaneous',
    lines: [
      exportResearchLine,
      octeractExportLine,
      { i18n: 'calculator5', stat: () => 1 + player.dailyExportAddCodeMult }
    ],
    multiplier: () =>
      calculateExportResearchMultiplier()
      * getOcteractUpgradeEffect('octeractExportQuarks', 'exportQuarkMult')
      * (1 + player.dailyExportAddCodeMult),
    unlocked: () => true
  },
  dailyCode: {
    category: 'miscellaneous',
    lines: [
      { i18n: 'basicProgression', stat: () => calculateBasicProgressionMultiplier() },
      { i18n: 'highestSingularity', stat: () => 1 + Math.min(49, player.highestSingularityCount) },
      {
        i18n: 'shopImprovedDaily',
        stat: () => getShopUpgradeEffects('shopImprovedDaily', 'dailyCodeQuarkMult')
      },
      {
        i18n: 'shopImprovedDaily2',
        stat: () => getShopUpgradeEffects('shopImprovedDaily2', 'dailyCodeQuarkMult')
      },
      {
        i18n: 'shopImprovedDaily3',
        stat: () => getShopUpgradeEffects('shopImprovedDaily3', 'dailyCodeQuarkMult')
      },
      {
        i18n: 'shopImprovedDaily4',
        stat: () => getShopUpgradeEffects('shopImprovedDaily4', 'dailyCodeQuarkMult')
      },
      {
        i18n: 'shopImprovedDaily5',
        stat: () => getShopUpgradeEffects('shopImprovedDaily5', 'dailyCodeQuarkMult')
      }
    ],
    multiplier: () =>
      calculateBasicProgressionMultiplier()
      * (1 + Math.min(49, player.highestSingularityCount))
      * getShopUpgradeEffects('shopImprovedDaily', 'dailyCodeQuarkMult')
      * getShopUpgradeEffects('shopImprovedDaily2', 'dailyCodeQuarkMult')
      * getShopUpgradeEffects('shopImprovedDaily3', 'dailyCodeQuarkMult')
      * getShopUpgradeEffects('shopImprovedDaily4', 'dailyCodeQuarkMult')
      * getShopUpgradeEffects('shopImprovedDaily5', 'dailyCodeQuarkMult'),
    unlocked: () => true
  },
  addCode: {
    category: 'miscellaneous',
    lines: [
      { i18n: 'calculator', stat: () => getShopUpgradeEffects('calculator', 'addQuarkMult') },
      { i18n: 'calculator2', stat: () => getShopUpgradeEffects('calculator2', 'addQuarkMult') },
      exportResearchLine,
      octeractExportLine
    ],
    multiplier: () =>
      getShopUpgradeEffects('calculator', 'addQuarkMult')
      * getShopUpgradeEffects('calculator2', 'addQuarkMult')
      * calculateExportResearchMultiplier()
      * getOcteractUpgradeEffect('octeractExportQuarks', 'exportQuarkMult'),
    unlocked: () => true
  },
  timeCode: {
    category: 'miscellaneous',
    lines: [
      { i18n: 'timeCodeHighestSingularity', stat: () => Math.max(1, player.highestSingularityCount) },
      { i18n: 'cookieUpgrade61', stat: calculateTimeCodeCookieMultiplier }
    ],
    multiplier: () => Math.max(1, player.highestSingularityCount) * calculateTimeCodeCookieMultiplier(),
    unlocked: () => true
  },
  promoCodes: {
    category: 'miscellaneous',
    lines: [],
    multiplier: () => 1,
    unlocked: () => player.quarkLedger.base.promoCodes > 0
  },
  challenges: {
    category: 'primary',
    lines: [],
    multiplier: () => 1,
    unlocked: () => player.unlocks.transcend || player.highestSingularityCount > 0
  },
  synthesis: {
    category: 'miscellaneous',
    lines: [{ i18n: 'subatomicShavings', stat: () => getSynthesisUpgradeEffect('subatomicShavings') }],
    multiplier: () => getSynthesisUpgradeEffect('subatomicShavings'),
    unlocked: () => player.quarkLedger.base.synthesis > 0
  },
  purpleReactor: {
    category: 'miscellaneous',
    lines: [{ i18n: 'purpleQuarkGain', stat: () => getPurpleReactorUpgradeEffects('purpleQuarkGain', 'quarkMult') }],
    multiplier: () => getPurpleReactorUpgradeEffects('purpleQuarkGain', 'quarkMult'),
    unlocked: () => player.quarkLedger.base.purpleReactor > 0
  }
}

export const getQuarkSourceMultiplier = (key: QuarkSourceKey) =>
  quarkSources[key].multiplier() * quarkCategories[quarkSources[key].category].multiplier()

const createBlankQuarkSourceRecord = () =>
  Object.fromEntries(quarkSourceKeys.map((key) => [key, 0])) as QuarkSourceRecord

export const createBlankQuarkLedger = (): QuarkLedger => ({
  base: createBlankQuarkSourceRecord(),
  awarded: createBlankQuarkSourceRecord(),
  credited: { primary: 0, miscellaneous: 0 },
  challengeCompletions: Array(15).fill(0) as number[]
})

export const getQuarkCategoryAwarded = (category: QuarkCategoryKey) => {
  let quarks = 0
  for (const key of quarkSourceKeys) {
    if (quarkSources[key].category === category) {
      quarks += player.quarkLedger.awarded[key]
    }
  }
  return Math.floor(quarks)
}

export const settleQuarks = () => {
  const globalMultiplier = calculateQuarkMultiplier()
  for (const key of quarkSourceKeys) {
    player.quarkLedger.awarded[key] = Math.max(
      player.quarkLedger.awarded[key],
      player.quarkLedger.base[key] * getQuarkSourceMultiplier(key) * globalMultiplier
    )
  }
  for (const category of quarkCategoryKeys) {
    const owed = getQuarkCategoryAwarded(category) - player.quarkLedger.credited[category]
    if (owed <= 0) {
      continue
    }
    const worldsBefore = player.worlds
    worlds.add(owed, false)
    const credited = player.worlds - worldsBefore
    player.quarksThisSingularity += credited
    player.quarkLedger.credited[category] += credited
  }
}

export const addBaseQuarks = (key: QuarkSourceKey, amount: number) => {
  if (!(amount > 0)) {
    return 0
  }
  const quarks = amount * getQuarkSourceMultiplier(key) * calculateQuarkMultiplier()
  player.quarkLedger.base[key] += amount
  player.quarkLedger.awarded[key] += quarks
  settleQuarks()
  return quarks
}

export const calculateQuarkRation = (singularityTime: number) => {
  const globalMultiplier = calculateQuarkMultiplier()
  const primaryMultiplier = calculatePrimaryQuarkMultiplier(singularityTime)
  const ration: Record<QuarkCategoryKey, number> = { primary: 0, miscellaneous: 0 }
  for (const key of quarkSourceKeys) {
    const category = quarkSources[key].category
    const categoryMultiplier = category === 'primary' ? primaryMultiplier : quarkCategories[category].multiplier()
    ration[category] += player.quarkLedger.base[key] * quarkSources[key].multiplier() * categoryMultiplier
      * globalMultiplier
  }
  return {
    primary: Math.floor(ration.primary),
    miscellaneous: Math.floor(ration.miscellaneous),
    primaryMultiplier
  }
}

const resetQuarkCategory = (category: QuarkCategoryKey) => {
  for (const key of quarkSourceKeys) {
    if (quarkSources[key].category === category) {
      player.quarkLedger.base[key] = 0
      player.quarkLedger.awarded[key] = 0
    }
  }
  player.quarkLedger.credited[category] = 0
}

export const resetPrimaryQuarks = () => {
  resetQuarkCategory('primary')
  player.quarkLedger.challengeCompletions = Array(15).fill(0) as number[]
}

export const resetQuarkLedger = () => {
  settleQuarks()
  resetQuarkCategory('miscellaneous')
  if (!getShopUpgradeEffects('shopRootsOfUnity', 'singularityTimeQuarks')) {
    resetPrimaryQuarks()
  }
}

export const refreshQuarkBonus = async () => {
  const response = await fetch('https://synergism.cc/api/v1/quark-bonus')

  checkServerDate(response)

  // eslint-disable-next-line no-shadow
  const { bonus } = await response.json() as { bonus: number }

  setGlobalQuarkBonus(bonus)
}
