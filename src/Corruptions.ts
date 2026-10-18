import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateCubeBank,
  calculateCubeBankSources,
  challengeTenCubeBankMultiplier,
  reincarnationChallengeCubeBankPerCompletion
} from './Calculate'
import { campaignTokenRewardHTMLUpdate, corruptionLevelTokenInfo, updateMaxTokens, updateTokens } from './Campaign'
import { getOcteractUpgradeEffect, octeractUpgrades } from './Octeracts'
import { getRuneEffects } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { getSingularityChallengeEffect } from './SingularityChallenges'
import { calculateCorruptionCubeMultiplierParts } from './Statistics'
import { format, player } from './Synergism'
import { getTalismanEffects } from './Talismans'
import { IconSets } from './Themes'
import { CloseModal, Confirm, MEDIUM_MODAL_UPDATE_TICK, Modal, Notification } from './UpdateHTML'
import { getElementById, isMobile, validateNonnegativeInteger } from './Utility'
import { Globals as G } from './Variables'

type CorruptionEffectValues = {
  construction: number
  viscosity: number
  salvage: number
  drought: Decimal
  hyperchallenge: number
  illiteracy: Decimal
  obtainium: Decimal
  recession: number
  blunders: number
}

type CorruptionKey = keyof CorruptionEffectValues

type CorruptionBand = 0 | 1 | 2 | 3 | 4

type ActiveCorruptionBand = Exclude<CorruptionBand, 0>

export type CorruptionCubeType = 'cubes' | 'tesseracts' | 'hypercubes' | 'platonics' | 'hepteracts' | 'octeracts'

type CorruptionBandData = {
  unlockChallenge: number
  lastLevel: number
}

type CorruptionCubeUnlock = {
  level: number
  requiresChallenge15: boolean
}

const c14LevelCap = 20
const levelCapPerIncrease = 5
const fastClimbSingularity = 2
const fastClimbStep = 2

const corruptionBands: Record<ActiveCorruptionBand, CorruptionBandData> = {
  1: { unlockChallenge: 11, lastLevel: 4 },
  2: { unlockChallenge: 12, lastLevel: 8 },
  3: { unlockChallenge: 13, lastLevel: 14 },
  4: { unlockChallenge: 14, lastLevel: Number.POSITIVE_INFINITY }
}

const corruptionCubeUnlocks: Record<CorruptionCubeType, CorruptionCubeUnlock> = {
  cubes: { level: 0, requiresChallenge15: false },
  tesseracts: { level: 0, requiresChallenge15: false },
  hypercubes: { level: 8, requiresChallenge15: false },
  platonics: { level: 14, requiresChallenge15: false },
  hepteracts: { level: 20, requiresChallenge15: true },
  octeracts: { level: 35, requiresChallenge15: false }
}

type CorruptionCubeRate = {
  base: number
  earlyGrowth: number
  growth: number
  endgameGrowth: number
}

const corruptionCubeRates: Record<CorruptionCubeType, CorruptionCubeRate> = {
  cubes: { base: 1.602, earlyGrowth: 1.35, growth: 1.25, endgameGrowth: 1.1 },
  tesseracts: { base: 1.824e-3, earlyGrowth: 1.35, growth: 1.3, endgameGrowth: 1.15 },
  hypercubes: { base: 5.032e-4, earlyGrowth: 1.6, growth: 1.4, endgameGrowth: 1.2 },
  platonics: { base: 7.135e-4, earlyGrowth: 1.6, growth: 1.4, endgameGrowth: 1.2 },
  hepteracts: { base: 1.33e-5, earlyGrowth: 1.3, growth: 1.2, endgameGrowth: 1.1 },
  octeracts: { base: 8.587e-7, earlyGrowth: 1.2, growth: 1.1, endgameGrowth: 1.1 }
}

const corruptionCubeEarlyLevels = 10

const corruptionCubeIcons: Record<CorruptionCubeType, string> = {
  cubes: '/WowCube.png',
  tesseracts: '/WowTessaract.png',
  hypercubes: '/WowHypercube.png',
  platonics: '/PlatonicCube.png',
  hepteracts: '/Hepteract.png',
  octeracts: '/Octeract.png'
}

const corruptionCubeTypes = Object.keys(corruptionCubeIcons) as CorruptionCubeType[]

const midgameLevel = 20
const endgameLevel = 45

type CorruptionLevelEffect<K extends CorruptionKey> = [
  (level: number) => CorruptionEffectValues[K],
  (level: number) => CorruptionEffectValues[K],
  (level: number) => CorruptionEffectValues[K]
]

const tenToTheDecimal = (exponent: number) => Decimal.pow(10, exponent)
const twoToTheTwenty = Math.pow(2, 20)
const hyperchallengeMidBase = Math.pow(1.25, 20)
const hyperchallengeEndBase = hyperchallengeMidBase * Math.pow(1.5, 25)

const corruptionLevelEffects: { [K in CorruptionKey]: CorruptionLevelEffect<K> } = {
  construction: [
    (l) => 1 + 0.2 * l,
    (l) => 5 + 0.4 * (l - midgameLevel),
    (l) => 15 * Math.pow(1.05, l - endgameLevel)
  ],
  viscosity: [
    (l) => Math.pow(2, 2 * l),
    (l) => Math.pow(2, 40 + 3 * (l - midgameLevel)),
    (l) => Math.min(1e300, Math.pow(2, 115 + 3 * Math.pow(l - endgameLevel, 1.5)))
  ],
  salvage: [
    (l) => -62.5 * l,
    (l) => -1250 - 150 * (l - midgameLevel),
    (l) => -5000 - 500 * (l - endgameLevel)
  ],
  drought: [
    (l) => Decimal.pow(2, l),
    (l) => tenToTheDecimal(l - midgameLevel).times(twoToTheTwenty),
    (l) => tenToTheDecimal(25 + Math.pow(l - endgameLevel, 1.5)).times(twoToTheTwenty)
  ],
  hyperchallenge: [
    (l) => Math.pow(1.25, l),
    (l) => hyperchallengeMidBase * Math.pow(1.5, l - midgameLevel),
    (l) => Math.min(1e300, hyperchallengeEndBase * Math.pow(10, Math.max(0, l - endgameLevel - 1)))
  ],
  illiteracy: [
    (l) => tenToTheDecimal(l),
    (l) => tenToTheDecimal(20 + 2 * (l - midgameLevel)),
    (l) => tenToTheDecimal(70 + 2 * Math.pow(l - endgameLevel, 1.5))
  ],
  obtainium: [
    (l) => Decimal.pow(2, l),
    (l) => tenToTheDecimal(l - midgameLevel).times(twoToTheTwenty),
    (l) => tenToTheDecimal(25 + Math.pow(l - endgameLevel, 1.5)).times(twoToTheTwenty)
  ],
  recession: [
    (l) => Math.pow(0.7, l),
    (l) => Math.pow(0.7, l),
    (l) => Math.pow(0.7, endgameLevel + Math.pow(l - endgameLevel, 1.5))
  ],
  blunders: [
    (l) => 0.02 * l,
    (l) => 0.02 * l,
    () => 0.9
  ]
}

export const corruptionKeys = Object.keys(corruptionLevelEffects) as CorruptionKey[]

type CorruptionScalingReduction = {
  upgrade: number
  perLevel: number
}

const corruptionScalingReductions: Partial<Record<CorruptionKey, CorruptionScalingReduction>> = {
  construction: { upgrade: 11, perLevel: 0.3 },
  viscosity: { upgrade: 6, perLevel: 0.03 },
  drought: { upgrade: 7, perLevel: 0.02 },
  hyperchallenge: { upgrade: 8, perLevel: 0.06 },
  illiteracy: { upgrade: 9, perLevel: 0.3 },
  obtainium: { upgrade: 7, perLevel: 0.02 },
  recession: { upgrade: 14, perLevel: 0.3 },
  blunders: { upgrade: 12, perLevel: 0.03 }
}

const corruptionScaling = (corr: CorruptionKey) => {
  const reduction = corruptionScalingReductions[corr]
  return reduction === undefined ? 1 : 1 - reduction.perLevel * player.platonicUpgrades[reduction.upgrade]
}

const corruptionBandBoundary = (corr: CorruptionKey, edge: number) => {
  return Math.floor(edge / corruptionScaling(corr) + 1e-9)
}

const corruptionFormulaBranch = (corr: CorruptionKey, level: number) => {
  if (level <= corruptionBandBoundary(corr, midgameLevel)) {
    return 0
  }
  return level <= corruptionBandBoundary(corr, endgameLevel) ? 1 : 2
}

export const corruptionEffect = <K extends CorruptionKey>(level: number, corr: K): CorruptionEffectValues[K] => {
  const effects: CorruptionLevelEffect<K> = corruptionLevelEffects[corr]
  return effects[corruptionFormulaBranch(corr, level)](level * corruptionScaling(corr))
}

const challenge15CorruptionStrength = 11

export const challenge15CorruptionLevel = () => {
  return player.currentChallenge.ascension === 15 ? challenge15CorruptionStrength : 0
}

export const challenge15IlliteracyBase = 0.2

export const challenge15IlliteracyMax = () => {
  return Math.min(challenge15IlliteracyBase * (1 + player.platonicUpgrades[9]), 1)
}

const challenge15CorruptionEffects = {
  viscosity: () => Math.min(0.2 * (1 + player.platonicUpgrades[6] / 30), 1),
  drought: () => -1250,
  deflation: () => 1e-25,
  extinction: () => 10,
  illiteracy: () => {
    const multiplier = player.obtainium.gte(G.dOne)
      ? 1 + (1 / 100) * player.platonicUpgrades[9] * Math.min(100, Decimal.log10(player.obtainium))
      : 1
    return Math.min(challenge15IlliteracyBase * multiplier, 1)
  },
  recession: () => 0.09,
  dilation: () => 1e-24,
  hyperchallenge: () => Math.max(1, 100 / (1 + 2 / 5 * player.platonicUpgrades[8])),
  spirit: () => 3
}

type Challenge15CorruptionKey = keyof typeof challenge15CorruptionEffects

const challenge15CorruptionNeutral: Record<Challenge15CorruptionKey, number> = {
  viscosity: 1,
  drought: 0,
  deflation: 1,
  extinction: 1,
  illiteracy: 1,
  recession: 1,
  dilation: 1,
  hyperchallenge: 1,
  spirit: 1
}

export const isCorruptionLevelOverwritten = () => player.currentChallenge.ascension !== 0

export const activeCorruptionLevel = () => isCorruptionLevelOverwritten() ? 0 : player.corruptions.used

export const challenge15CorruptionValue = (corr: Challenge15CorruptionKey) => {
  return challenge15CorruptionEffects[corr]()
}

export const challenge15CorruptionEffect = (corr: Challenge15CorruptionKey) => {
  return player.currentChallenge.ascension === 15
    ? challenge15CorruptionValue(corr)
    : challenge15CorruptionNeutral[corr]
}

export const isCorruptionBandUnlocked = (band: CorruptionBand) => {
  return band === 0
    || player.challengecompletions[corruptionBands[band].unlockChallenge] > 0
    || getGQUpgradeEffect('platonicTau', 'unlocked')
}

const corruptionBandOf = (level: number): CorruptionBand => {
  if (level <= 0) {
    return 0
  }
  for (const band of [1, 2, 3] as const) {
    if (level <= corruptionBands[band].lastLevel) {
      return band
    }
  }
  return 4
}

const corruptionLevelCapIncrease = () => {
  return (player.platonicUpgrades[5] > 0 ? levelCapPerIncrease : 0)
    + (player.platonicUpgrades[10] > 0 ? levelCapPerIncrease : 0)
    + (getGQUpgradeEffect('corruptionFourteen', 'unlocked') ? levelCapPerIncrease : 0)
    + levelCapPerIncrease * getOcteractUpgradeEffect('octeractCorruption', 'corruptionLevelCapIncrease')
}

const isCorruptionLevelCapMaxed = () => {
  return player.platonicUpgrades[5] > 0
    && player.platonicUpgrades[10] > 0
    && getGQUpgradeEffect('corruptionFourteen', 'unlocked')
    && getOcteractUpgradeEffect('octeractCorruption', 'corruptionLevelCapIncrease')
      >= octeractUpgrades.octeractCorruption.maxLevel
}

const corruptionLevelCap = () => {
  if (getGQUpgradeEffect('platonicTau', 'unlocked')) {
    return Number.POSITIVE_INFINITY
  }
  if (isCorruptionBandUnlocked(4)) {
    return c14LevelCap + corruptionLevelCapIncrease()
  }
  for (const band of [3, 2, 1] as const) {
    if (isCorruptionBandUnlocked(band)) {
      return corruptionBands[band].lastLevel
    }
  }
  return 0
}

const corruptionClimbStep = () => {
  return player.highestSingularityCount >= fastClimbSingularity ? fastClimbStep : 1
}

export const maxCorruptionLevel = () => {
  const highest = player.corruptions.highestCleared
  return Math.max(highest, Math.min(corruptionLevelCap(), highest + corruptionClimbStep()))
}

export const clearCorruptionLevel = (level: number) => {
  if (level <= player.corruptions.highestCleared || level > player.corruptions.highestCleared + corruptionClimbStep()) {
    return
  }
  player.corruptions.highestCleared = level
  if (player.corruptions.autoIncrease) {
    player.corruptions.next = Math.max(player.corruptions.next, maxCorruptionLevel())
  }
  corruptionStatsUpdate()
}

export const normalizeCorruptionLevel = (level: number) => {
  return validateNonnegativeInteger(level) ? Math.min(level, maxCorruptionLevel()) : 0
}

export const corruptionFreeLevels = () => {
  let freeLevels = 0.4 * getGQUpgradeEffect('corruptionFifteen', 'freeCorruptionLevel')
  freeLevels += 0.6 * getSingularityChallengeEffect('oneChallengeCap', 'freeCorruptionLevel')
  freeLevels += getTalismanEffects('cookieGrandma').freeCorruptionLevel
  freeLevels += getRuneEffects('finiteDescent', 'corruptionFreeLevels')
  freeLevels += getGQUpgradeEffect('corruptionFourteen', 'unlocked') ? 0.2 : 0
  freeLevels += 0.2 * getOcteractUpgradeEffect('octeractCorruption', 'corruptionLevelCapIncrease')
  freeLevels += player.platonicUpgrades[5] > 0 ? 0.2 : 0
  freeLevels += player.platonicUpgrades[10] > 0 ? 0.2 : 0
  freeLevels += getGQUpgradeEffect('masterPack', 'freeCorruptionLevels')
  freeLevels += getGQUpgradeEffect('advancedPack', 'corruptionScoreIncrease') > 0 ? 0.4 : 0
  freeLevels += 0.8 * getSingularityChallengeEffect('oneChallengeCap', 'corrScoreIncrease')
  freeLevels += 0.4 * player.cubeUpgrades[74]
  freeLevels += 0.2 * player.platonicUpgrades[17]
  return freeLevels
}

export const effectiveCorruptionLevel = (level: number) => {
  return level + corruptionFreeLevels()
}

export const corruptionCubeRate = (cube: CorruptionCubeType, level: number) => {
  const { base, earlyGrowth, growth, endgameGrowth } = corruptionCubeRates[cube]
  const effectiveLevel = effectiveCorruptionLevel(level)
  const levelsPastUnlock = Math.max(0, Math.min(effectiveLevel, endgameLevel) - corruptionCubeUnlocks[cube].level)
  const earlyLevels = Math.min(levelsPastUnlock, corruptionCubeEarlyLevels)
  return base
    * Math.pow(earlyGrowth, earlyLevels)
    * Math.pow(growth, levelsPastUnlock - earlyLevels)
    * Math.pow(endgameGrowth, Math.max(0, effectiveLevel - endgameLevel))
}

const meetsCorruptionCubeLevel = (level: number, cube: CorruptionCubeType) => {
  const unlock = corruptionCubeUnlocks[cube]
  return effectiveCorruptionLevel(level) >= unlock.level
}

const corruptionCubeUnlockLevel = (cube: CorruptionCubeType) => {
  const level = Math.max(0, Math.floor(corruptionCubeUnlocks[cube].level - corruptionFreeLevels()))
  return meetsCorruptionCubeLevel(level, cube) ? level : level + 1
}

export const isCorruptionCubeUnlocked = (level: number, cube: CorruptionCubeType) => {
  return meetsCorruptionCubeLevel(level, cube)
    && (!corruptionCubeUnlocks[cube].requiresChallenge15 || G.challenge15Rewards.hepteractsUnlocked.value > 0)
}

export const setNextCorruptionLevel = (level: number) => {
  player.corruptions.next = normalizeCorruptionLevel(Math.floor(level))
  corruptionStatsUpdate()
}

export const changeNextCorruptionLevel = (delta: number) => {
  setNextCorruptionLevel(Math.max(0, player.corruptions.next + delta))
}

export const maxNextCorruptionLevel = () => {
  setNextCorruptionLevel(maxCorruptionLevel())
}

const corruptionCleanseLevel = () => {
  return Math.min(player.corruptions.highestCleared, maxCorruptionLevel())
}

export const toggleCorruptionAutoIncrease = () => {
  player.corruptions.autoIncrease = !player.corruptions.autoIncrease
  corruptionStatsUpdate()
}

export const toggleCorruptionCleanseToHighest = () => {
  player.corruptions.cleanseToHighest = !player.corruptions.cleanseToHighest
  corruptionStatsUpdate()
}

export const cleanseCorruptions = () => {
  const level = player.corruptions.cleanseToHighest ? corruptionCleanseLevel() : 0
  player.corruptions.used = Math.min(player.corruptions.used, level)
  setNextCorruptionLevel(level)
  DOMCacheGetOrSet('corruptionCleanseConfirm').style.visibility = 'hidden'
}

export const resetCorruptionProgress = async () => {
  if (!await Confirm(i18next.t('corruptions.resetProgress.confirm'))) {
    return
  }

  player.corruptions.used = 0
  player.corruptions.next = 0
  player.corruptions.highestCleared = 0
  player.corruptions.tokenCompletions.fill(0)
  updateTokens()
  updateMaxTokens()
  campaignTokenRewardHTMLUpdate()
  corruptionStatsUpdate()
  void Notification(i18next.t('corruptions.resetProgress.done'))
}

export const corrIcons: Record<CorruptionKey, string> = {
  construction: '/CorruptDeflation.png',
  viscosity: '/CorruptViscosity.png',
  salvage: '/CorruptDrought.png',
  drought: '/Offering.png',
  hyperchallenge: '/CorruptHyperchallenge.png',
  illiteracy: '/CorruptIlliteracy.png',
  obtainium: '/Obtainium.png',
  recession: '/CorruptRecession.png',
  blunders: '/CorruptExtinction.png'
}

type CorruptionFormulaRow = { range: string; formula: string }

const corruptionFormulaRanges = [
  'low',
  'mid',
  'high'
] as const

const corruptionFormulaRangeText = [
  (mid: number) => i18next.t('corruptions.modal.firstRange', { to: mid }),
  (mid: number, end: number) => i18next.t('corruptions.modal.range', { from: mid, to: end }),
  (_mid: number, end: number) => i18next.t('corruptions.modal.lastRange', { from: end })
]

const corruptionScalingHTML = (corr: CorruptionKey) => {
  const reduction = corruptionScalingReductions[corr]
  if (reduction === undefined || corruptionScaling(corr) === 1) {
    return ''
  }
  return `<div>${
    i18next.t('corruptions.modal.scaling', {
      scaling: format(corruptionScaling(corr), 2, true),
      upgrade: `${Math.ceil(reduction.upgrade / 5)}x${(reduction.upgrade - 1) % 5 + 1}`
    })
  }</div>`
}

const corruptionFormulaTableHTML = (rows: CorruptionFormulaRow[], current: number, next: number) => {
  const cells = rows.map(({ range, formula }, i) => {
    const active = i === current ? ' corruptionFormulaActive' : ''
    const currentMarker = i === current
      ? i18next.t('corruptions.modal.currentMarker', { level: format(activeCorruptionLevel()) })
      : ''
    const nextMarker = i === next
      ? i18next.t('corruptions.modal.nextMarker', { level: format(player.corruptions.next) })
      : ''
    return `<span class="corruptionFormulaCurrent">${currentMarker}</span>
      <span class="corruptionFormulaRange${active}">${range}</span>
      <span class="corruptionFormulaExpression${active}">${formula}</span>
      <span class="corruptionFormulaNext">${nextMarker}</span>`
  }).join('')
  return `<div class="corruptionFormulaTable">${cells}</div>`
}

const corruptionLevelFormulaHTML = (corr: CorruptionKey) => {
  const scaling = corruptionScaling(corr)
  const L = scaling === 1 ? 'L' : `${format(scaling, 2, true)}L`
  const mid = corruptionBandBoundary(corr, midgameLevel)
  const end = corruptionBandBoundary(corr, endgameLevel)
  const rows = corruptionFormulaRanges.map((formula, i) => ({
    range: corruptionFormulaRangeText[i](mid, end),
    formula: i18next.t(`corruptions.levelFormulas.${corr}.${formula}`, { L })
  }))
  return `${corruptionScalingHTML(corr)}<div>${i18next.t(`corruptions.effectDescriptions.${corr}`)} ${
    i18next.t('corruptions.modal.levelFormula')
  }</div>${
    corruptionFormulaTableHTML(
      rows,
      corruptionFormulaBranch(corr, activeCorruptionLevel()),
      corruptionFormulaBranch(corr, player.corruptions.next)
    )
  }`
}

type CorruptionPanelTarget = CorruptionCubeType | 'cubeBank'

type CorruptionModalTarget = CorruptionKey | 'exit' | CorruptionPanelTarget

const corruptionPanelIcons: Record<Exclude<CorruptionPanelTarget, CorruptionCubeType>, string> = {
  cubeBank: '/Challenge.png'
}

const corruptionModalShell = (icon: string, title: string, body: string) => {
  return `<div class="corruptionDetailsModal" data-modal-preserve="children">
    <div class="corruptionDetailsModalTitle" data-modal-preserve="children">
      <img src="Pictures/${
    IconSets[player.iconSet][0]
  }${icon}" alt="" class="corruptionImg" data-modal-preserve="children">
      <span>${title}</span>
    </div>
    ${body}
  </div>`
}

const corruptionBreakdownTable = (headers: string[], rows: string[][]) => {
  const head = headers.map((header) => `<th>${header}</th>`).join('')
  const body = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')
  return `<table class="corruptionBreakdown"><tr>${head}</tr>${body}</table>`
}

const corruptionLevelHeaders = () => {
  return [
    '',
    i18next.t('corruptions.breakdown.current', { level: format(activeCorruptionLevel()) }),
    i18next.t('corruptions.breakdown.next', { level: format(player.corruptions.next) })
  ]
}

const corruptionLevelRow = (label: string, value: (level: number) => string) => {
  return [label, value(activeCorruptionLevel()), value(player.corruptions.next)]
}

const formatTimes = (value: number) => `x${format(value, 3)}`

const corruptionCubeModalHTML = (cube: CorruptionCubeType) => {
  const { global, specific } = calculateCorruptionCubeMultiplierParts(cube)
  const locked = (level: number) => !isCorruptionCubeUnlocked(level, cube)
  const lockedText = i18next.t('corruptions.breakdown.locked')
  const unlock = corruptionCubeUnlocks[cube]

  const rows = [
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.effectiveLevel'),
      (level) => format(effectiveCorruptionLevel(level), 2, true)
    ),
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.rate'),
      (level) => locked(level) ? lockedText : formatTimes(corruptionCubeRate(cube, level))
    ),
    corruptionLevelRow(i18next.t(`corruptions.breakdown.global.${cube}`), () => formatTimes(global)),
    corruptionLevelRow(i18next.t(`corruptions.breakdown.specific.${cube}`), () => formatTimes(specific)),
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.total'),
      (level) => locked(level) ? lockedText : formatTimes(corruptionCubeRate(cube, level) * global * specific)
    )
  ]

  return corruptionModalShell(
    corruptionCubeIcons[cube],
    i18next.t(`corruptions.tiers.cubes.${cube}`),
    `<div class="corruptionDetailsModalDescription">${i18next.t(`corruptions.breakdown.cubeFormula.${cube}`)}</div>
    ${corruptionBreakdownTable(corruptionLevelHeaders(), rows)}
    ${
      locked(player.corruptions.next)
        ? `<div class="corruptionDetailsModalFormula">${
          i18next.t(unlock.requiresChallenge15 ? 'corruptions.breakdown.unlockC15' : 'corruptions.breakdown.unlock', {
            level: corruptionCubeUnlockLevel(cube),
            base: unlock.level
          })
        }</div>`
        : ''
    }
    <div class="corruptionBreakdownNote">${i18next.t('corruptions.breakdown.otherMultipliers')}</div>`
  )
}

const corruptionCubeBankModalHTML = () => {
  const { transcensionChallenges, ants, reincarnationChallenges, challengeTen } = calculateCubeBankSources()
  const rows = [
    ...transcensionChallenges.map(({ from, to, completions, perCompletion, amount }) => [
      Number.isFinite(to)
        ? i18next.t('corruptions.breakdown.bankSources.transcensionChallenges', { from, to })
        : i18next.t('corruptions.breakdown.bankSources.transcensionChallengesFrom', { from }),
      format(completions),
      `+${format(perCompletion, 2, true)}`,
      `+${format(amount, 1, true)}`
    ]),
    [
      i18next.t('corruptions.breakdown.bankSources.reincarnationChallenges'),
      format(reincarnationChallenges.completions),
      `+${format(reincarnationChallengeCubeBankPerCompletion)}`,
      `+${format(reincarnationChallenges.amount, 1, true)}`
    ],
    [i18next.t('corruptions.breakdown.bankSources.ants'), '', '', `+${format(ants, 1, true)}`],
    [
      i18next.t('corruptions.breakdown.bankSources.challengeTen'),
      format(challengeTen.completions),
      formatTimes(challengeTenCubeBankMultiplier()),
      formatTimes(challengeTen.multiplier)
    ],
    [i18next.t('corruptions.breakdown.total'), '', '', format(calculateCubeBank(), 1, true)]
  ]

  return corruptionModalShell(
    corruptionPanelIcons.cubeBank,
    i18next.t('corruptions.tiers.cubeBank'),
    `<div class="corruptionDetailsModalDescription">${i18next.t('corruptions.breakdown.cubeBankDescription')}</div>
    ${
      corruptionBreakdownTable([
        i18next.t('corruptions.breakdown.source'),
        i18next.t('corruptions.breakdown.completions'),
        i18next.t('corruptions.breakdown.perCompletion'),
        i18next.t('corruptions.breakdown.amount')
      ], rows)
    }`
  )
}

const corruptionPanelModalHTML = (target: CorruptionPanelTarget) => {
  switch (target) {
    case 'cubeBank':
      return corruptionCubeBankModalHTML()
    default:
      return corruptionCubeModalHTML(target)
  }
}

const isCorruptionKey = (target: CorruptionModalTarget): target is CorruptionKey => {
  return target in corrIcons
}

const corruptionDetailsModalHTML = (target: CorruptionModalTarget) => {
  if (target !== 'exit' && !isCorruptionKey(target)) {
    return corruptionPanelModalHTML(target)
  }
  const corr = target

  if (corr === 'exit') {
    return `<div class="corruptionDetailsModal" data-modal-preserve="children">
    <div class="corruptionDetailsModalTitle" data-modal-preserve="children">
      <img src="Pictures/${
      IconSets[player.iconSet][0]
    }/CorruptExit.png" alt="" class="corruptionImg" data-modal-preserve="children">
      <span>${i18next.t('corruptions.exitCorruption.name')}</span>
    </div>
    <div class="corruptionDetailsModalDescription">${i18next.t('corruptions.exitCorruption.description')}</div>
    <div class="corruptionDetailsModalCurrent">${
      player.corruptions.cleanseToHighest
        ? i18next.t('corruptions.exitCorruption.currentHighest', { level: format(corruptionCleanseLevel()) })
        : i18next.t('corruptions.exitCorruption.current')
    }</div>
    <div class="corruptionDetailsModalPlanned">${i18next.t('corruptions.exitCorruption.planned')}</div>
    <div class="corruptionDetailsModalFormula">${i18next.t('corruptions.exitCorruption.multiplier')}</div>
  </div>`
  }

  return `<div class="corruptionDetailsModal" data-modal-preserve="children">
    <div class="corruptionDetailsModalTitle" data-modal-preserve="children">
      <img src="Pictures/${IconSets[player.iconSet][0]}${
    corrIcons[corr]
  }" alt="" class="corruptionImg" data-modal-preserve="children">
      <span>${i18next.t(`corruptions.names.${corr}`)}</span>
    </div>
    <div class="corruptionDetailsModalDescription">${i18next.t(`corruptions.descriptions.${corr}`)}</div>
    <div class="corruptionDetailsModalFormula">${corruptionLevelFormulaHTML(corr)}</div>
  </div>`
}

const openCorruptionDetailsModal = (
  corr: CorruptionModalTarget,
  event: MouseEvent,
  targetElement: HTMLElement
) => {
  Modal(
    () => corruptionDetailsModalHTML(corr),
    event.clientX,
    event.clientY,
    { borderColor: 'var(--crimson-text-color)' },
    MEDIUM_MODAL_UPDATE_TICK,
    targetElement
  )
}

export const registerCorruptionDetailsModal = (element: HTMLElement, corr: CorruptionModalTarget) => {
  if (isMobile) {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
      openCorruptionDetailsModal(corr, event, element)
    })
    return
  }

  element.addEventListener('mousemove', (event) => openCorruptionDetailsModal(corr, event, element))
  element.addEventListener('mouseout', CloseModal)
}

const createCorruptionIcon = (corr: CorruptionKey) => {
  const icon = document.createElement('img')
  icon.className = 'corruptionImg'
  icon.src = `Pictures/${IconSets[player.iconSet][0]}${corrIcons[corr]}`
  icon.alt = ''
  icon.loading = 'lazy'
  return icon
}

const createCorruptionTextRow = (
  id: string,
  nameKey: string,
  target: Exclude<CorruptionPanelTarget, CorruptionCubeType>
) => {
  const row = document.createElement('div')
  row.id = `${id}Row`
  row.className = 'corruptionStatRow'

  const icon = document.createElement('img')
  icon.className = 'corruptionImg'
  icon.src = `Pictures/${IconSets[player.iconSet][0]}${corruptionPanelIcons[target]}`
  icon.alt = ''
  icon.loading = 'lazy'
  registerCorruptionDetailsModal(icon, target)
  row.appendChild(icon)

  const name = document.createElement('span')
  name.className = 'corrDesc'
  name.innerHTML = i18next.t(nameKey)
  row.appendChild(name)

  const value = document.createElement('span')
  value.id = id
  value.className = 'corrDesc corruptionStatValue'
  row.appendChild(value)

  return row
}

const corruptionCubeLockedText = (level: number, cube: CorruptionCubeType) => {
  if (meetsCorruptionCubeLevel(level, cube)) {
    return i18next.t('corruptions.tiers.cubeLocked.challenge15')
  }
  const free = corruptionFreeLevels()
  return free > 0
    ? i18next.t('corruptions.tiers.cubeLocked.levelFree', {
      level: format(corruptionCubeUnlockLevel(cube)),
      base: format(corruptionCubeUnlocks[cube].level),
      free: format(free, 2, true)
    })
    : i18next.t('corruptions.tiers.cubeLocked.level', { level: format(corruptionCubeUnlockLevel(cube)) })
}

const corruptionCubeMultiplierText = (cube: CorruptionCubeType) => {
  if (!isCorruptionCubeUnlocked(player.corruptions.next, cube)) {
    return corruptionCubeLockedText(player.corruptions.next, cube)
  }

  const { global, specific } = calculateCorruptionCubeMultiplierParts(cube)
  const next = format(corruptionCubeRate(cube, player.corruptions.next) * global * specific, 3)
  if (!isCorruptionCubeUnlocked(activeCorruptionLevel(), cube)) {
    return i18next.t('corruptions.tiers.cubeMultiplierNew', { next })
  }

  return corruptionMultiplierChangeText(
    format(corruptionCubeRate(cube, activeCorruptionLevel()) * global * specific, 3),
    next
  )
}

const isCorruptionLevelChanging = () => activeCorruptionLevel() !== player.corruptions.next

const corruptionMultiplierChangeText = (curr: string, next: string) => {
  return isCorruptionLevelChanging()
    ? i18next.t('corruptions.tiers.cubeMultiplier', { curr, next })
    : i18next.t('corruptions.tiers.cubeMultiplierSame', { value: next })
}

const corruptionLevelTitle = () => {
  const used = activeCorruptionLevel()
  const next = player.corruptions.next
  if (used !== next) {
    return i18next.t('corruptions.tiers.levelChange', { old: format(used), new: format(next) })
  }
  return used === 0
    ? i18next.t('corruptions.tiers.notCorrupted')
    : i18next.t('corruptions.tiers.level', { level: format(used) })
}

const corruptionLevelOverwrittenUpdate = () => {
  const element = DOMCacheGetOrSet('corruptionLevelOverwritten')
  element.style.display = isCorruptionLevelOverwritten() ? '' : 'none'
  if (isCorruptionLevelOverwritten()) {
    element.innerHTML = i18next.t('corruptions.tiers.levelOverwritten', { level: format(player.corruptions.used) })
  }
}

const createCorruptionCubeRow = (cube: CorruptionCubeType) => {
  const row = document.createElement('div')
  row.id = `corruptionCubeRow${cube}`
  row.className = 'corruptionStatRow'

  const icon = document.createElement('img')
  icon.src = `Pictures/${IconSets[player.iconSet][0]}${corruptionCubeIcons[cube]}`
  icon.alt = ''
  icon.loading = 'lazy'
  registerCorruptionDetailsModal(icon, cube)
  row.appendChild(icon)

  const name = document.createElement('span')
  name.className = 'corrDesc corruptionCubeName'
  name.innerHTML = i18next.t(`corruptions.tiers.cubes.${cube}`)
  row.appendChild(name)

  const value = document.createElement('span')
  value.id = `corruptionCubeValue${cube}`
  value.className = 'corrDesc corruptionStatValue'
  row.appendChild(value)

  return row
}

const corruptionTokenBlankLines = ['&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;']

const corruptionTokenBonusLine = (key: 'first' | 'last', amount: number, earned: boolean) => {
  return i18next.t(`corruptions.tiers.tokens.${key}${earned ? 'Earned' : ''}`, { amount: format(amount) })
}

const corruptionTokenUpdate = (level: number) => {
  if (level === 0) {
    DOMCacheGetOrSet('corruptionTierTokens').innerHTML = [
      i18next.t('corruptions.tiers.tokens.selectLevel'),
      ...corruptionTokenBlankLines
    ].join('<br>')
    return
  }
  const info = corruptionLevelTokenInfo(level)
  const lines = [
    i18next.t(
      info.earnable > 0 && info.earned >= info.earnable
        ? 'corruptions.tiers.tokens.levelComplete'
        : 'corruptions.tiers.tokens.level',
      { level: format(level), earned: format(info.earned), earnable: format(info.earnable) }
    ),
    i18next.t('corruptions.tiers.tokens.completions', {
      completions: format(info.completions),
      cap: format(info.cap),
      tokens: format(info.completionTokens)
    }),
    corruptionTokenBonusLine('first', info.first, info.firstEarned),
    corruptionTokenBonusLine('last', info.last, info.lastEarned),
    info.earlier > 0 ? i18next.t('corruptions.tiers.tokens.earlier', { tokens: format(info.earlier) }) : '&nbsp;'
  ]
  DOMCacheGetOrSet('corruptionTierTokens').innerHTML = lines.join('<br>')
}

export const corruptionLevelScoreUpdate = () => {
  const next = player.corruptions.next
  const changing = isCorruptionLevelChanging()
  DOMCacheGetOrSet('corruptionTierLevel').innerHTML = corruptionLevelTitle()
  corruptionLevelOverwrittenUpdate()
  DOMCacheGetOrSet('corruptionTierEffectsHeading').innerHTML = i18next.t(
    changing ? 'corruptions.tiers.effectsHeading' : 'corruptions.tiers.effectsHeadingSame'
  )
  DOMCacheGetOrSet('corruptionTierCubeHeading').innerHTML = i18next.t(
    changing ? 'corruptions.tiers.cubeMultipliersHeading' : 'corruptions.tiers.cubeMultipliersHeadingSame'
  )
  const freeLevels = corruptionFreeLevels()
  DOMCacheGetOrSet('corruptionRewardFreeLevels').innerHTML = freeLevels > 0
    ? i18next.t('corruptions.tiers.freeLevels', { free: format(freeLevels, 2, true) })
    : '&nbsp;'

  corruptionTokenUpdate(next)

  for (const cube of corruptionCubeTypes) {
    const shown = cube !== 'octeracts' || getGQUpgradeEffect('octeractUnlock', 'unlocked')
    DOMCacheGetOrSet(`corruptionCubeRow${cube}`).style.display = shown ? '' : 'none'
    if (shown) {
      DOMCacheGetOrSet(`corruptionCubeValue${cube}`).innerHTML = corruptionCubeMultiplierText(cube)
    }
  }
}

const corruptionLevelCapText = (cap: number) => {
  if (!isCorruptionBandUnlocked(4)) {
    return i18next.t('corruptions.tiers.levelCap', {
      cap,
      challenge: corruptionBands[(corruptionBandOf(cap) + 1) as ActiveCorruptionBand].unlockChallenge
    })
  }
  return isCorruptionLevelCapMaxed()
    ? i18next.t('corruptions.tiers.levelCapFinal', { cap })
    : i18next.t('corruptions.tiers.levelCapIncreasable', { cap })
}

const corruptionLevelCapUpdate = () => {
  const cap = corruptionLevelCap()
  const highest = player.corruptions.highestCleared
  DOMCacheGetOrSet('corruptionHighestCleared').innerHTML = i18next.t('corruptions.tiers.highestCleared', {
    level: format(highest)
  })
  const step = corruptionClimbStep()
  DOMCacheGetOrSet('corruptionLevelCap').innerHTML = highest > cap
    ? i18next.t('corruptions.tiers.levelCapBelowHighest', { highest: format(highest), cap: format(cap) })
    : highest + step >= cap
    ? corruptionLevelCapText(cap)
    : step === 1
    ? i18next.t('corruptions.tiers.nextUnlock', { level: format(highest + 1), unlock: format(highest + 2) })
    : i18next.t('corruptions.tiers.nextUnlockRange', { level: format(highest + step), step })
  getElementById<HTMLInputElement>('corruptionAutoIncreaseToggle').checked = player.corruptions.autoIncrease
  getElementById<HTMLInputElement>('corruptionCleanseToHighestToggle').checked = player.corruptions.cleanseToHighest
}

const formatCorruptionEffect = (corr: CorruptionKey, level: number) => {
  return corr === 'blunders'
    ? format(100 * corruptionEffect(level, 'blunders'), 0, true)
    : format(corruptionEffect(level, corr), 3, true)
}

export const corruptionEffectsUpdate = () => {
  const changing = isCorruptionLevelChanging()
  for (const corr of corruptionKeys) {
    const next = formatCorruptionEffect(corr, player.corruptions.next)
    DOMCacheGetOrSet(`corrEffect${corr}`).innerHTML = changing
      ? i18next.t(`corruptions.effectSummary.${corr}.change`, {
        curr: formatCorruptionEffect(corr, activeCorruptionLevel()),
        next
      })
      : i18next.t(`corruptions.effectSummary.${corr}.same`, { value: next })
  }
}

export const corruptionStatsUpdate = () => {
  corruptionLevelCapUpdate()

  DOMCacheGetOrSet('corruptionLevelControls').style.display = maxCorruptionLevel() === 0 ? 'none' : ''
  getElementById<HTMLInputElement>('corruptionLevelInput').value = `${player.corruptions.next}`

  corruptionEffectsUpdate()
  corruptionLevelScoreUpdate()
}

export const corruptionPanelCreate = () => {
  DOMCacheGetOrSet('corruptionTierCubeRows').replaceChildren(
    ...corruptionCubeTypes.map(createCorruptionCubeRow),
    createCorruptionTextRow('corruptionCubeBank', 'corruptions.tiers.cubeBank', 'cubeBank')
  )

  const effects = DOMCacheGetOrSet('corruptionTierEffects')
  effects.replaceChildren()

  for (const corr of corruptionKeys) {
    const row = document.createElement('div')
    row.id = `corruptionEffectRow${corr}`
    row.className = 'corruptionStatRow'

    const icon = createCorruptionIcon(corr)
    registerCorruptionDetailsModal(icon, corr)
    row.appendChild(icon)

    const name = document.createElement('span')
    name.className = 'corrDesc corruptionEffectName'
    name.innerHTML = i18next.t(`corruptions.effectNames.${corr}`)
    row.appendChild(name)

    const text = document.createElement('span')
    text.id = `corrEffect${corr}`
    text.className = 'corrDesc corruptionStatValue'
    row.appendChild(text)

    effects.appendChild(row)
  }

  corruptionStatsUpdate()
}

export const corruptionCleanseConfirm = () => {
  const corrupt = DOMCacheGetOrSet('corruptionCleanseConfirm')
  corrupt.style.visibility = 'visible'
  setTimeout(() => corrupt.style.visibility = 'hidden', 10000)
}

export const revealCorruptions = () => {
  corruptionLevelCapUpdate()
}
