import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateCubeBank,
  calculateCubeBankSources,
  challengeTenCubeBankMultiplier,
  reincarnationChallengeCubeBankPerCompletion
} from './Calculate'
import { campaignTokenRewardHTMLUpdate, corruptionLevelTokenInfo, updateTokens } from './Campaign'
import { platonicCorruptionScaling } from './Platonic'
import { getGQUpgradeEffect } from './singularity'
import {
  calculateCorruptionCubeMultiplierParts,
  freeCorruptionLevelStatsSum,
  hasCorruptionScaledCubeStats
} from './Statistics'
import { format, player } from './Synergism'
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

export type CorruptionCubeType = 'cubes' | 'tesseracts' | 'hypercubes' | 'platonics' | 'hepteracts' | 'octeracts'

type CorruptionCubeUnlock = {
  level: number
  requiresChallenge15: boolean
}

const fastClimbSingularity = 2
const fastClimbStep = 2

const corruptionCubeUnlocks: Record<CorruptionCubeType, CorruptionCubeUnlock> = {
  cubes: { level: 0, requiresChallenge15: false },
  tesseracts: { level: 0, requiresChallenge15: false },
  hypercubes: { level: 5, requiresChallenge15: false },
  platonics: { level: 11, requiresChallenge15: false },
  hepteracts: { level: 20, requiresChallenge15: true },
  octeracts: { level: 35, requiresChallenge15: false }
}

type CorruptionCubeRate = {
  base: number
  growth: number
  lateGrowth?: number
  endgameGrowth: number
}

const corruptionCubeRates: Record<CorruptionCubeType, CorruptionCubeRate> = {
  cubes: { base: 1, growth: 1.1, endgameGrowth: 1.05 },
  tesseracts: { base: 1e-3, growth: 1.15, endgameGrowth: 1.07 },
  hypercubes: { base: 1e-3, growth: 1.2, endgameGrowth: 1.1 },
  platonics: { base: 5e-4, growth: 1.25, endgameGrowth: 1.1 },
  hepteracts: { base: 1e-4, growth: 1.4, lateGrowth: 1.1, endgameGrowth: 1.1 },
  octeracts: { base: 1 / (5e19 * 3600 * 24 * 365), growth: 1.45, endgameGrowth: 1.05 }
}

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
const lateGameLevel = 36
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
    (l) => Math.pow(3, l),
    (l) => Math.pow(3, 20 + 3 * (l - midgameLevel)),
    (l) => Math.min(1e300, Math.pow(3, 95) * Math.pow(21, 2 * (l - endgameLevel)))
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

const corruptionBandBoundary = (edge: number) => {
  return Math.floor(edge / platonicCorruptionScaling() + 1e-9)
}

const corruptionFormulaBranch = (level: number) => {
  if (level <= corruptionBandBoundary(midgameLevel)) {
    return 0
  }
  return level <= corruptionBandBoundary(endgameLevel) ? 1 : 2
}

export const corruptionEffect = <K extends CorruptionKey>(level: number, corr: K): CorruptionEffectValues[K] => {
  const effects: CorruptionLevelEffect<K> = corruptionLevelEffects[corr]
  return effects[corruptionFormulaBranch(level)](level * platonicCorruptionScaling())
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

export const ascensionCorruptionLevel = () => Math.min(player.corruptions.ascensionLevel, activeCorruptionLevel())

export const challenge15CorruptionValue = (corr: Challenge15CorruptionKey) => {
  return challenge15CorruptionEffects[corr]()
}

export const challenge15CorruptionEffect = (corr: Challenge15CorruptionKey) => {
  return player.currentChallenge.ascension === 15
    ? challenge15CorruptionValue(corr)
    : challenge15CorruptionNeutral[corr]
}

const corruptionClimbStep = () => {
  return player.highestSingularityCount >= fastClimbSingularity ? fastClimbStep : 1
}

export const canChangeCorruptions = () => player.challengecompletions[11] > 0

export const isCorruptionTabUnlocked = () => canChangeCorruptions() || player.highestSingularityCount > 0

export const maxCorruptionLevel = () => {
  if (!canChangeCorruptions()) {
    return 0
  }
  return player.corruptions.highestCleared + corruptionClimbStep()
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

export const corruptionFreeLevels = () => freeCorruptionLevelStatsSum()

export const effectiveCorruptionLevel = (level: number) => {
  return level + corruptionFreeLevels()
}

export const activeEffectiveCorruptionLevel = () => {
  return isCorruptionLevelOverwritten() ? 0 : effectiveCorruptionLevel(activeCorruptionLevel())
}

export const ascensionEffectiveCorruptionLevel = () => {
  return isCorruptionLevelOverwritten() ? 0 : effectiveCorruptionLevel(ascensionCorruptionLevel())
}

export const corruptionCubeBase = (cube: CorruptionCubeType) => corruptionCubeRates[cube].base

export const corruptionCubeRate = (cube: CorruptionCubeType, effectiveLevel: number) => {
  const unlockLevel = corruptionCubeUnlocks[cube].level
  const earlyLevels = Math.max(0, Math.min(effectiveLevel, lateGameLevel) - unlockLevel)
  const lateLevels = Math.max(0, Math.min(effectiveLevel, endgameLevel) - Math.max(lateGameLevel, unlockLevel))
  const { growth, lateGrowth = growth, endgameGrowth } = corruptionCubeRates[cube]
  return Math.pow(growth, earlyLevels) * Math.pow(lateGrowth, lateLevels)
    * Math.pow(endgameGrowth, Math.max(0, effectiveLevel - endgameLevel))
}

const meetsCorruptionCubeLevel = (effectiveLevel: number, cube: CorruptionCubeType) => {
  return effectiveLevel >= corruptionCubeUnlocks[cube].level
}

const corruptionCubeUnlockLevel = (cube: CorruptionCubeType) => {
  const level = Math.max(0, Math.floor(corruptionCubeUnlocks[cube].level - corruptionFreeLevels()))
  return meetsCorruptionCubeLevel(effectiveCorruptionLevel(level), cube) ? level : level + 1
}

export const isCorruptionCubeUnlocked = (effectiveLevel: number, cube: CorruptionCubeType) => {
  return meetsCorruptionCubeLevel(effectiveLevel, cube)
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
  player.corruptions.ascensionLevel = 0
  player.corruptions.next = 0
  player.corruptions.highestCleared = 0
  player.corruptions.tokenCompletions = [0]
  updateTokens()
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

const corruptionScalingHTML = () => {
  const scaling = platonicCorruptionScaling()
  if (scaling === 1) {
    return ''
  }
  return `<div>${i18next.t('corruptions.modal.scaling', { scaling: format(scaling, 3, true) })}</div>`
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
  const scaling = platonicCorruptionScaling()
  const L = scaling === 1 ? 'L' : `${format(scaling, 3, true)}L`
  const mid = corruptionBandBoundary(midgameLevel)
  const end = corruptionBandBoundary(endgameLevel)
  const rows = corruptionFormulaRanges.map((formula, i) => ({
    range: corruptionFormulaRangeText[i](mid, end),
    formula: i18next.t(`corruptions.levelFormulas.${corr}.${formula}`, { L })
  }))
  return `${corruptionScalingHTML()}<div>${i18next.t(`corruptions.effectDescriptions.${corr}`)} ${
    i18next.t('corruptions.modal.levelFormula')
  }</div>${
    corruptionFormulaTableHTML(
      rows,
      corruptionFormulaBranch(activeCorruptionLevel()),
      corruptionFormulaBranch(player.corruptions.next)
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

const corruptionLevelRow = (label: string, value: (effectiveLevel: number) => string) => {
  return [label, value(activeEffectiveCorruptionLevel()), value(effectiveCorruptionLevel(player.corruptions.next))]
}

const formatTimes = (value: number) => `x${format(value, 3)}`

type CorruptionCubeMultiplierParts = ReturnType<typeof calculateCorruptionCubeMultiplierParts>

const corruptionCubeMultiplierProduct = ({ global, specific, scaling }: CorruptionCubeMultiplierParts) => {
  return global * specific * scaling
}

const corruptionCubeModalHTML = (cube: CorruptionCubeType) => {
  const nextLevel = effectiveCorruptionLevel(player.corruptions.next)
  const current = calculateCorruptionCubeMultiplierParts(cube)
  const next = calculateCorruptionCubeMultiplierParts(cube, nextLevel)
  const locked = (level: number) => !isCorruptionCubeUnlocked(level, cube)
  const lockedText = i18next.t('corruptions.breakdown.locked')
  const unlock = corruptionCubeUnlocks[cube]
  const base = corruptionCubeBase(cube)
  const total = (level: number, parts: CorruptionCubeMultiplierParts) => {
    return locked(level)
      ? lockedText
      : formatTimes(base * corruptionCubeRate(cube, level) * corruptionCubeMultiplierProduct(parts))
  }

  const rows = [
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.effectiveLevel'),
      (level) => format(level, 2, true)
    ),
    corruptionLevelRow(
      i18next.t('corruptions.breakdown.rate'),
      (level) => locked(level) ? lockedText : formatTimes(corruptionCubeRate(cube, level))
    ),
    corruptionLevelRow(i18next.t('corruptions.breakdown.base'), () => formatTimes(base)),
    corruptionLevelRow(i18next.t(`corruptions.breakdown.global.${cube}`), () => formatTimes(current.global)),
    corruptionLevelRow(i18next.t(`corruptions.breakdown.specific.${cube}`), () => formatTimes(current.specific)),
    ...(hasCorruptionScaledCubeStats(cube)
      ? [[i18next.t('corruptions.breakdown.scaling'), formatTimes(current.scaling), formatTimes(next.scaling)]]
      : []),
    [
      i18next.t('corruptions.breakdown.total'),
      total(activeEffectiveCorruptionLevel(), current),
      total(nextLevel, next)
    ]
  ]

  return corruptionModalShell(
    corruptionCubeIcons[cube],
    i18next.t(`corruptions.tiers.cubes.${cube}`),
    `<div class="corruptionDetailsModalDescription">${i18next.t(`corruptions.breakdown.cubeFormula.${cube}`)}</div>
    ${corruptionBreakdownTable(corruptionLevelHeaders(), rows)}
    ${
      locked(nextLevel)
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
  const {
    transcensionChallenges,
    ants,
    cubeUpgrades,
    finiteDescent,
    achievements,
    advancedPack,
    reincarnationChallenges,
    challengeTen
  } = calculateCubeBankSources()
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
    ...Object.entries({ ants, cubeUpgrades, finiteDescent, achievements, advancedPack })
      .filter(([, amount]) => amount !== 0)
      .map(([key, amount]) => [
        i18next.t(`corruptions.breakdown.bankSources.${key}`),
        '',
        '',
        `+${format(amount, 1, true)}`
      ]),
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
    corruptionBreakdownTable([
      i18next.t('corruptions.breakdown.source'),
      i18next.t('corruptions.breakdown.completions'),
      i18next.t('corruptions.breakdown.perCompletion'),
      i18next.t('corruptions.breakdown.amount')
    ], rows)
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

const createCorruptionRowName = (nameKey: string) => {
  const name = document.createElement('span')
  name.className = 'corrDesc corruptionStatName'
  name.innerHTML = i18next.t(nameKey)
  return name
}

const createCorruptionValueCells = (id: string) => {
  const curr = document.createElement('span')
  curr.id = `${id}Curr`
  curr.className = 'corrDesc corruptionStatCurr'

  const arrow = document.createElement('span')
  arrow.className = 'corrDesc corruptionStatArrow'
  arrow.innerHTML = i18next.t('corruptions.tiers.arrow')

  const next = document.createElement('span')
  next.id = `${id}Next`
  next.className = 'corrDesc corruptionStatNext'

  return [curr, arrow, next]
}

const corruptionValueUpdate = (id: string, curr: string, next: string) => {
  DOMCacheGetOrSet(`${id}Curr`).innerHTML = curr
  DOMCacheGetOrSet(`${id}Next`).innerHTML = next
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

  row.appendChild(createCorruptionRowName(nameKey))

  const value = document.createElement('span')
  value.id = id
  value.className = 'corrDesc corruptionStatCentered'
  row.appendChild(value)

  return row
}

const corruptionCubeValueText = (cube: CorruptionCubeType, effectiveLevel: number, multiplier: number) => {
  return isCorruptionCubeUnlocked(effectiveLevel, cube)
    ? i18next.t('corruptions.tiers.cubeValue', {
      value: format(corruptionCubeBase(cube) * corruptionCubeRate(cube, effectiveLevel) * multiplier, 3)
    })
    : i18next.t('corruptions.tiers.locked')
}

const isCorruptionLevelChanging = () => {
  return ascensionEffectiveCorruptionLevel() !== effectiveCorruptionLevel(player.corruptions.next)
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
  row.appendChild(createCorruptionRowName(`corruptions.tiers.cubes.${cube}`))
  row.append(...createCorruptionValueCells(`corruptionCubeValue${cube}`))

  return row
}

const corruptionTokenBlankLines = ['&nbsp;', '&nbsp;']

const corruptionTokenFirstLine = (amount: number, earned: boolean) => {
  return i18next.t(`corruptions.tiers.tokens.first${earned ? 'Earned' : ''}`, { amount: format(amount) })
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
    i18next.t('corruptions.tiers.tokens.level', { level: format(level), earned: format(info.earned) }),
    i18next.t('corruptions.tiers.tokens.completions', {
      completions: format(info.completions)
    }),
    corruptionTokenFirstLine(info.first, info.firstEarned)
  ]
  DOMCacheGetOrSet('corruptionTierTokens').innerHTML = lines.join('<br>')
}

export const corruptionLevelScoreUpdate = () => {
  const next = player.corruptions.next
  const changing = isCorruptionLevelChanging()
  DOMCacheGetOrSet('corruptionTierGrid').classList.toggle('corruptionLevelSame', !changing)
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
      const nextLevel = effectiveCorruptionLevel(next)
      corruptionValueUpdate(
        `corruptionCubeValue${cube}`,
        corruptionCubeValueText(
          cube,
          ascensionEffectiveCorruptionLevel(),
          corruptionCubeMultiplierProduct(calculateCorruptionCubeMultiplierParts(cube))
        ),
        corruptionCubeValueText(
          cube,
          nextLevel,
          corruptionCubeMultiplierProduct(calculateCorruptionCubeMultiplierParts(cube, nextLevel))
        )
      )
    }
  }
}

const corruptionLevelCapUpdate = () => {
  const highest = player.corruptions.highestCleared
  DOMCacheGetOrSet('corruptionHighestCleared').innerHTML = i18next.t('corruptions.tiers.highestCleared', {
    level: format(highest)
  })
  const step = corruptionClimbStep()
  DOMCacheGetOrSet('corruptionLevelCap').innerHTML = !canChangeCorruptions()
    ? i18next.t('corruptions.tiers.requiresChallenge11')
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
  for (const corr of corruptionKeys) {
    corruptionValueUpdate(
      `corrEffect${corr}`,
      i18next.t(`corruptions.effectSummary.${corr}`, { value: formatCorruptionEffect(corr, activeCorruptionLevel()) }),
      i18next.t(`corruptions.effectSummary.${corr}`, { value: formatCorruptionEffect(corr, player.corruptions.next) })
    )
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
    row.appendChild(createCorruptionRowName(`corruptions.effectNames.${corr}`))
    row.append(...createCorruptionValueCells(`corrEffect${corr}`))

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
