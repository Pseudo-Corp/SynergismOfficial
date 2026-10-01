import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateCubeBank,
  calculateCubeBankSources,
  challengeTenCubeBankMultiplier,
  reincarnationChallengeCubeBankPerCompletion,
  transcensionChallengeCubeBankPerCompletion
} from './Calculate'
import { campaignTokenRewardHTMLUpdate, corruptionLevelTokenInfo, updateMaxTokens, updateTokens } from './Campaign'
import { getOcteractUpgradeEffect, octeractUpgrades } from './Octeracts'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getRuneEffects } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { getSingularityChallengeEffect } from './SingularityChallenges'
import { calculateCorruptionCubeMultiplierParts } from './Statistics'
import { format, player } from './Synergism'
import { getTalismanEffects } from './Talismans'
import { IconSets } from './Themes'
import { Alert, CloseModal, Confirm, MEDIUM_MODAL_UPDATE_TICK, Modal, Notification, Prompt } from './UpdateHTML'
import { assert, getElementById, isMobile, validateNonnegativeInteger } from './Utility'
import { Globals as G } from './Variables'

enum CorruptionIndices {
  'viscosity' = 0,
  'dilation' = 1,
  'hyperchallenge' = 2,
  'illiteracy' = 3,
  'deflation' = 4,
  'extinction' = 5,
  'drought' = 6,
  'recession' = 7
}

export const convertInputToCorruption = (array: number[]): Corruptions => {
  return {
    viscosity: array[CorruptionIndices.viscosity],
    drought: array[CorruptionIndices.drought],
    deflation: array[CorruptionIndices.deflation],
    extinction: array[CorruptionIndices.extinction],
    illiteracy: array[CorruptionIndices.illiteracy],
    recession: array[CorruptionIndices.recession],
    dilation: array[CorruptionIndices.dilation],
    hyperchallenge: array[CorruptionIndices.hyperchallenge]
  }
}

export type Corruptions = {
  viscosity: number
  drought: number
  deflation: number
  extinction: number
  illiteracy: number
  recession: number
  dilation: number
  hyperchallenge: number
}

type CorruptionBand = 0 | 1 | 2 | 3 | 4

type ActiveCorruptionBand = Exclude<CorruptionBand, 0>

export type CorruptionPreset = {
  name: string
  level: number
}

export type CorruptionCubeType = 'cubes' | 'tesseracts' | 'hypercubes' | 'platonics' | 'hepteracts' | 'octeracts'

type CorruptionBandData = {
  unlockChallenge: number
  lastLevel: number
}

type CorruptionCubeUnlock = {
  level: number
  requiresChallenge15: boolean
}

const BASE_CORRUPTION_PRESET_COUNT = 8
const MAX_CORRUPTION_PRESET_COUNT = 16

export const getUnlockedCorruptionPresetCount = () => {
  const presetCount = BASE_CORRUPTION_PRESET_COUNT + PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL
  assert(presetCount <= MAX_CORRUPTION_PRESET_COUNT, 'Corruption preset count exceeds the supported maximum.')
  return presetCount
}

export const isCorruptionPresetUnlocked = (presetNum: number) => {
  return Number.isInteger(presetNum) && presetNum >= 0 && presetNum < getUnlockedCorruptionPresetCount()
}

export const createDefaultCorruptionPresets = (): CorruptionPreset[] => {
  return Array.from({ length: MAX_CORRUPTION_PRESET_COUNT }, (_, index) => ({
    name: `Preset ${index + 1}`,
    level: 0
  }))
}

export const c15CorruptionLevel = 20
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

type CorruptionScaling = 'linear' | 'exponential' | 'formula'

const corruptionScalings: Record<keyof Corruptions, CorruptionScaling> = {
  viscosity: 'linear',
  drought: 'linear',
  deflation: 'formula',
  extinction: 'linear',
  illiteracy: 'linear',
  recession: 'linear',
  dilation: 'formula',
  hyperchallenge: 'exponential'
}

export const corruptionKeys = Object.keys(corruptionScalings) as Array<keyof Corruptions>

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

const endgameLevel = 45
const deflationZeroLevel = 40
const goldenRatio = (1 + Math.sqrt(5)) / 2

const c15CorruptionEffects: Record<keyof Corruptions, number> = {
  viscosity: 0.2,
  drought: -1250,
  deflation: 1e-25,
  extinction: 10,
  illiteracy: 0.2,
  recession: 0.09,
  dilation: 1e-24,
  hyperchallenge: 100
}

const baseCorruptionEffects: Record<keyof Corruptions, number> = {
  viscosity: 1,
  drought: 0,
  deflation: 1,
  extinction: 1,
  illiteracy: 1,
  recession: 1,
  dilation: 1,
  hyperchallenge: 1
}

export const corruptionLevelStrength = (level: number) => Math.min(0.55 * level, 0.2 * level + 7)

const endgameScaledStrength = (level: number, slope: number) => {
  return 0.2 * Math.min(level, endgameLevel) + 7 + 5 * slope * Math.max(0, level - endgameLevel)
}

const corruptionLevelEffects: Record<keyof Corruptions, (level: number) => number> = {
  viscosity: () => 0,
  drought: (l) => -10 * Math.pow(0.2 * l + 7, 2),
  deflation: (l) => l >= deflationZeroLevel ? 0 : Math.pow(10, -25 * Math.pow(corruptionLevelStrength(l) / 11, 2)),
  extinction: (l) => 1 + Math.pow(0.2 * l + 7, 2) / (0.2 * l + 9.5),
  illiteracy: (l) => Math.pow(2, -(0.2 * l + 7) / 5),
  recession: (l) => Math.pow(0.81, endgameScaledStrength(l, 1)),
  dilation: (l) => Math.max(1e-300, Math.pow(10, -24 * Math.pow(corruptionLevelStrength(l) / 11, 2))),
  hyperchallenge: (l) => Math.min(1e300, (1 + Math.pow(goldenRatio, endgameScaledStrength(l, 1.6))) / 2)
}

const adjustCorruptionEffect = (corr: keyof Corruptions, base: number) => {
  switch (corr) {
    case 'viscosity':
      return Math.min(base * (1 + player.platonicUpgrades[6] / 30), 1)
    case 'drought':
      return player.platonicUpgrades[13] > 0 ? base * 0.5 : base
    case 'illiteracy': {
      const multiplier = player.obtainium.gte(G.dOne)
        ? 1 + (1 / 100) * player.platonicUpgrades[9] * Math.min(100, Decimal.log10(player.obtainium))
        : 1
      return Math.min(base * multiplier, 1)
    }
    case 'hyperchallenge':
      return Math.max(1, base / (1 + 2 / 5 * player.platonicUpgrades[8]))
    default:
      return base
  }
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

export const autoClimbCorruptionLevel = () => {
  if (player.corruptions.autoClimb <= 0) {
    return
  }
  const target = Math.min(maxCorruptionLevel(), player.corruptions.used + player.corruptions.autoClimb)
  player.corruptions.next = Math.max(player.corruptions.next, target)
}

export const setCorruptionAutoClimb = (amount: number) => {
  player.corruptions.autoClimb = validateNonnegativeInteger(amount) ? amount : 0
  corruptionStatsUpdate()
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
  corruptionPresetTableUpdate()
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

const corruptionSegments = (corr: keyof Corruptions) => {
  return [
    { from: 0, to: c15CorruptionLevel, start: baseCorruptionEffects[corr], end: c15CorruptionEffects[corr] },
    {
      from: c15CorruptionLevel,
      to: endgameLevel,
      start: c15CorruptionEffects[corr],
      end: corruptionLevelEffects[corr](endgameLevel)
    }
  ]
}

const scaledCorruptionValue = (corr: keyof Corruptions, level: number) => {
  const scaling = corruptionScalings[corr]
  if (scaling === 'formula' || level > endgameLevel) {
    return corruptionLevelEffects[corr](level)
  }

  const { from, to, start, end } = corruptionSegments(corr)[level <= c15CorruptionLevel ? 0 : 1]
  const progress = (level - from) / (to - from)
  return scaling === 'linear' ? start + (end - start) * progress : start * Math.pow(end / start, progress)
}

export const corruptionEffect = (level: number, corr: keyof Corruptions) => {
  return adjustCorruptionEffect(corr, scaledCorruptionValue(corr, level))
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

export const corruptionSpiritMultiplier = (level: number) => {
  if (level === 0) {
    return 1
  }

  return 1 + 0.04 * corruptionKeys.length * Math.pow(corruptionLevelStrength(effectiveCorruptionLevel(level)), 2)
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
  corruptionPresetTableUpdate()
}

export const changeNextCorruptionLevel = (delta: number) => {
  setNextCorruptionLevel(Math.max(0, player.corruptions.next + delta))
}

export const maxNextCorruptionLevel = () => {
  setNextCorruptionLevel(maxCorruptionLevel())
}

export const resetNextCorruptions = () => {
  setNextCorruptionLevel(0)
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
  if (player.currentChallenge.ascension === 15) {
    void Notification(i18next.t('corruptions.resetCorruptionsError'))
    return
  }

  const level = player.corruptions.cleanseToHighest ? corruptionCleanseLevel() : 0
  player.corruptions.used = Math.min(player.corruptions.used, level)
  setNextCorruptionLevel(level)
  DOMCacheGetOrSet('corruptionCleanseConfirm').style.visibility = 'hidden'
}

export const resetCorruptionProgress = async () => {
  if (player.currentChallenge.ascension === 15) {
    void Notification(i18next.t('corruptions.resetCorruptionsError'))
    return
  }

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
  corruptionPresetTableUpdate()
  void Notification(i18next.t('corruptions.resetProgress.done'))
}

export const corrIcons: Record<keyof Corruptions, string> = {
  viscosity: '/CorruptViscosity.png',
  drought: '/CorruptDrought.png',
  deflation: '/CorruptDeflation.png',
  extinction: '/CorruptExtinction.png',
  illiteracy: '/CorruptIlliteracy.png',
  recession: '/CorruptRecession.png',
  dilation: '/CorruptDilation.png',
  hyperchallenge: '/CorruptHyperchallenge.png'
}

const formatCoefficient = (value: number, digits = 4) => {
  const rounded = String(Number(Math.abs(value).toPrecision(digits)))
  return value < 0 ? `−${rounded}` : rounded
}

const corruptionFormulaSegment = (
  corr: keyof Corruptions,
  { from, to, start, end }: ReturnType<typeof corruptionSegments>[number]
) => {
  const range = from === 0
    ? i18next.t('corruptions.modal.firstRange', { to })
    : i18next.t('corruptions.modal.range', { from, to })
  const slope = formatCoefficient(Math.abs(end - start) / (to - from))
  const sign = end < start ? '−' : '+'
  let formula: string
  if (corruptionScalings[corr] === 'exponential') {
    formula = from === 0
      ? i18next.t('corruptions.modal.exponentialFromOne', { end: formatCoefficient(end), to })
      : i18next.t('corruptions.modal.exponential', {
        start: formatCoefficient(start),
        ratio: formatCoefficient(Math.pow(end / start, 1 / (to - from)), 6),
        from
      })
  } else if (from === 0) {
    formula = start === 0
      ? i18next.t('corruptions.modal.linearNoStart', { sign: sign === '−' ? sign : '', slope })
      : i18next.t('corruptions.modal.linearFromZero', { start: formatCoefficient(start), sign, slope })
  } else {
    formula = i18next.t('corruptions.modal.linear', { start: formatCoefficient(start), sign, slope, from })
  }
  return { range, formula }
}

const corruptionFormulaBranch = (corr: keyof Corruptions, level: number) => {
  if (level <= c15CorruptionLevel) {
    return 0
  }
  switch (corr) {
    case 'deflation':
      return level < deflationZeroLevel ? 1 : 2
    case 'dilation':
      return 1
    default:
      return level <= endgameLevel ? 1 : 2
  }
}

type CorruptionFormulaRow = { range: string; formula: string }

const corruptionFormulaRanges: Partial<Record<keyof Corruptions, Array<{ formula: string; range: () => string }>>> = {
  deflation: [
    { formula: 'low', range: () => i18next.t('corruptions.modal.firstRange', { to: c15CorruptionLevel }) },
    {
      formula: 'mid',
      range: () => i18next.t('corruptions.modal.openRange', { from: c15CorruptionLevel, to: deflationZeroLevel })
    },
    { formula: 'zero', range: () => i18next.t('corruptions.modal.atLeast', { from: deflationZeroLevel }) }
  ],
  dilation: [
    { formula: 'low', range: () => i18next.t('corruptions.modal.firstRange', { to: c15CorruptionLevel }) },
    { formula: 'high', range: () => i18next.t('corruptions.modal.lastRange', { from: c15CorruptionLevel }) }
  ]
}

const corruptionFormulaTableHTML = (rows: CorruptionFormulaRow[], current: number, next: number) => {
  const cells = rows.map(({ range, formula }, i) => {
    const active = i === current ? ' corruptionFormulaActive' : ''
    const currentMarker = i === current
      ? i18next.t('corruptions.modal.currentMarker', { level: format(player.corruptions.used) })
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

const corruptionLevelFormulaHTML = (corr: keyof Corruptions) => {
  const ranges = corruptionFormulaRanges[corr]
  const rows = ranges === undefined
    ? [
      ...corruptionSegments(corr).map((segment) => corruptionFormulaSegment(corr, segment)),
      {
        range: i18next.t('corruptions.modal.lastRange', { from: endgameLevel }),
        formula: i18next.t(`corruptions.levelFormulas.${corr}`)
      }
    ]
    : ranges.map(({ formula, range }) => ({
      range: range(),
      formula: i18next.t(`corruptions.levelFormulas.${corr}.${formula}`)
    }))
  return `<div>${i18next.t('corruptions.modal.levelFormula')}</div>${
    corruptionFormulaTableHTML(
      rows,
      corruptionFormulaBranch(corr, player.corruptions.used),
      corruptionFormulaBranch(corr, player.corruptions.next)
    )
  }`
}

type CorruptionPanelTarget = CorruptionCubeType | 'cubeBank' | 'spirit'

type CorruptionModalTarget = keyof Corruptions | 'exit' | CorruptionPanelTarget

const corruptionPanelIcons: Record<Exclude<CorruptionPanelTarget, CorruptionCubeType>, string> = {
  cubeBank: '/Challenge.png',
  spirit: '/perkinvigoratedSpirits.png'
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
    i18next.t('corruptions.breakdown.current', { level: format(player.corruptions.used) }),
    i18next.t('corruptions.breakdown.next', { level: format(player.corruptions.next) })
  ]
}

const corruptionLevelRow = (label: string, value: (level: number) => string) => {
  return [label, value(player.corruptions.used), value(player.corruptions.next)]
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
    [
      i18next.t('corruptions.breakdown.bankSources.transcensionChallenges'),
      format(transcensionChallenges.completions),
      `+${format(transcensionChallengeCubeBankPerCompletion(), 2, true)}`,
      `+${format(transcensionChallenges.amount, 1, true)}`
    ],
    [i18next.t('corruptions.breakdown.bankSources.ants'), '', '', `+${format(ants, 1, true)}`],
    [
      i18next.t('corruptions.breakdown.bankSources.reincarnationChallenges'),
      format(reincarnationChallenges.completions),
      `+${format(100 * reincarnationChallengeCubeBankPerCompletion, 0, true)}%`,
      formatTimes(reincarnationChallenges.multiplier)
    ],
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

const corruptionSpiritModalHTML = () => {
  const rows = [
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.effectiveLevel'),
      (level) => format(effectiveCorruptionLevel(level), 2, true)
    ),
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.strength'),
      (level) => format(corruptionLevelStrength(effectiveCorruptionLevel(level)), 3, true)
    ),
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.spiritMultiplier'),
      (level) => formatTimes(corruptionSpiritMultiplier(level))
    )
  ]

  return corruptionModalShell(
    corruptionPanelIcons.spirit,
    i18next.t('corruptions.tiers.spiritPower'),
    `<div class="corruptionDetailsModalDescription">${i18next.t('corruptions.breakdown.spiritDescription')}</div>
    <div class="corruptionDetailsModalFormula">${i18next.t('corruptions.breakdown.spiritFormula')}</div>
    ${corruptionBreakdownTable(corruptionLevelHeaders(), rows)}`
  )
}

const corruptionPanelModalHTML = (target: CorruptionPanelTarget) => {
  switch (target) {
    case 'cubeBank':
      return corruptionCubeBankModalHTML()
    case 'spirit':
      return corruptionSpiritModalHTML()
    default:
      return corruptionCubeModalHTML(target)
  }
}

const isCorruptionKey = (target: CorruptionModalTarget): target is keyof Corruptions => {
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

const createCorruptionIcon = (corr: keyof Corruptions) => {
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
  if (!isCorruptionCubeUnlocked(player.corruptions.used, cube)) {
    return i18next.t('corruptions.tiers.cubeMultiplierNew', { next })
  }

  return corruptionMultiplierChangeText(
    format(corruptionCubeRate(cube, player.corruptions.used) * global * specific, 3),
    next
  )
}

const isCorruptionLevelChanging = () => player.corruptions.used !== player.corruptions.next

export const corruptionMultiplierChangeText = (curr: string, next: string) => {
  return isCorruptionLevelChanging()
    ? i18next.t('corruptions.tiers.cubeMultiplier', { curr, next })
    : i18next.t('corruptions.tiers.cubeMultiplierSame', { value: next })
}

const corruptionLevelTitle = () => {
  const { used, next } = player.corruptions
  if (used !== next) {
    return i18next.t('corruptions.tiers.levelChange', { old: format(used), new: format(next) })
  }
  return used === 0
    ? i18next.t('corruptions.tiers.notCorrupted')
    : i18next.t('corruptions.tiers.level', { level: format(used) })
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
  getElementById<HTMLInputElement>('corruptionAutoClimbInput').value = `${player.corruptions.autoClimb}`
}

export const corruptionEffectsUpdate = () => {
  const changing = isCorruptionLevelChanging()
  for (const corr of corruptionKeys) {
    const next = format(corruptionEffect(player.corruptions.next, corr), 3, true)
    DOMCacheGetOrSet(`corrEffect${corr}`).innerHTML = changing
      ? i18next.t(`corruptions.effectSummary.${corr}.change`, {
        curr: format(corruptionEffect(player.corruptions.used, corr), 3, true),
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
  effects.appendChild(createCorruptionTextRow('corruptionSpiritValue', 'corruptions.tiers.spiritPower', 'spirit'))

  corruptionStatsUpdate()
}

export const corruptionPresetTableCreate = () => {
  const table = getElementById<HTMLTableElement>('corruptionLoadoutTable')

  for (let i = table.rows.length - 1; i >= 1; i--) {
    table.deleteRow(i)
  }

  const nextRow = table.insertRow()
  const nextCell = nextRow.insertCell()
  nextCell.className = 'testTitle'
  nextCell.textContent = i18next.t('corruptions.loadoutTable.next')
  nextRow.insertCell()

  const zeroCell = nextRow.insertCell()
  zeroCell.colSpan = 2
  const zeroBtn = document.createElement('button')
  zeroBtn.className = 'corrLoad'
  zeroBtn.textContent = i18next.t('corruptions.loadoutTable.zero')
  zeroBtn.addEventListener('click', () => resetNextCorruptions())
  zeroCell.appendChild(zeroBtn)
  zeroCell.title = i18next.t('corruptions.loadoutTable.zeroTitle')

  for (let i = 0; i < getUnlockedCorruptionPresetCount(); i++) {
    const row = table.insertRow()

    const titleCell = row.insertCell()
    titleCell.className = 'testTitle corrLoadoutName'
    titleCell.title = i18next.t('corruptions.loadoutTable.otherRowTitle', { value: i + 1 })
    titleCell.addEventListener('click', () => void corruptionPresetGetNewName(i))

    row.insertCell()

    let cell = row.insertCell()
    let btn = document.createElement('button')
    btn.className = 'corrSave'
    btn.textContent = i18next.t('corruptions.loadoutTable.save')
    btn.addEventListener('click', () => saveCorruptionPreset(i))
    cell.appendChild(btn)
    cell.title = i18next.t('corruptions.loadoutTable.saveTitle')

    cell = row.insertCell()
    btn = document.createElement('button')
    btn.className = 'corrLoad'
    btn.textContent = i18next.t('corruptions.loadoutTable.load')
    btn.addEventListener('click', () => loadCorruptionPreset(i))
    cell.appendChild(btn)
  }

  corruptionPresetTableUpdate()
}

export const corruptionPresetTableUpdate = () => {
  const rows = getElementById<HTMLTableElement>('corruptionLoadoutTable').rows
  if (rows.length < 2) {
    return
  }

  rows[1].cells[1].textContent = format(player.corruptions.next)

  for (let i = 0; i < getUnlockedCorruptionPresetCount() && i + 2 < rows.length; i++) {
    const cells = rows[i + 2].cells
    cells[0].textContent = `${player.corruptions.presets[i].name}:`
    cells[1].textContent = format(player.corruptions.presets[i].level)
  }
}

const saveCorruptionPreset = (presetNum: number) => {
  if (!isCorruptionPresetUnlocked(presetNum)) {
    return
  }

  player.corruptions.presets[presetNum] = {
    name: player.corruptions.presets[presetNum].name,
    level: player.corruptions.next
  }
  corruptionPresetTableUpdate()
}

export const loadCorruptionPreset = (presetNum: number) => {
  if (!isCorruptionPresetUnlocked(presetNum)) {
    return
  }

  setNextCorruptionLevel(player.corruptions.presets[presetNum].level)
}

async function corruptionPresetGetNewName (presetNum: number) {
  if (!isCorruptionPresetUnlocked(presetNum)) {
    return
  }

  const maxChars = 9
  // eslint-disable-next-line no-control-regex
  const regex = /^[\x00-\xFF]*$/
  const renamePrompt = await Prompt(
    i18next.t('corruptions.corruptionLoadoutName.loadoutPrompt', { loadNum: presetNum + 1, maxChars })
  )

  if (!renamePrompt) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.noName'))
  } else if (renamePrompt.length > maxChars) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.exceedsCharacterLimit'))
  } else if (!regex.test(renamePrompt)) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.regexError'))
  } else {
    player.corruptions.presets[presetNum].name = renamePrompt
    corruptionPresetTableUpdate()
    if (renamePrompt === 'crazy') {
      return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.crazyJoke'))
    }
  }
}

export const corruptionCleanseConfirm = () => {
  const corrupt = DOMCacheGetOrSet('corruptionCleanseConfirm')
  corrupt.style.visibility = 'visible'
  setTimeout(() => corrupt.style.visibility = 'hidden', 10000)
}

export const revealCorruptions = () => {
  corruptionLevelCapUpdate()
}
