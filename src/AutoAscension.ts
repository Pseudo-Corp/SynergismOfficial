import { getAchievementReward } from './Achievements'
import { autoLoadBlueberryLoadout, MAX_BLUEBERRY_LOADOUT_COUNT } from './BlueberryUpgrades'
import { CalcCorruptionStuff, calculateCubeBank } from './Calculate'
import { getMaxChallenges } from './Challenges'
import { canChangeCorruptions, maxCorruptionLevel, normalizeCorruptionLevel } from './Corruptions'
import { activeHappyHourBells } from './Event'
import { calculateAvailableRebornELO } from './Features/Ants/AntSacrifice/Rewards/ELO/RebornELO/lib/calculate'
import { toggleAutoAntSacrificeEnabled } from './Features/Ants/toggles/auto-sacrifice'
import { hepteractKeys, toggleAutomaticHepteracts } from './Hepteracts'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { reset } from './Reset'
import { runes } from './Runes'
import type { SingularityChallengeDataKeys } from './SingularityChallenges'
import { gameStages, synergismStageNumber } from './Statistics'
import { player, resetCheck } from './Synergism'
import {
  autoCubeUpgradesToggle,
  autoPlatonicUpgradesToggle,
  toggleautobuytesseract,
  toggleAutoChallengeRun,
  toggleautoopensCubes,
  toggleChallenges
} from './Toggles'
import { challengeExit } from './UpdateHTML'
import { nullPrototype } from './Utility'

const comparators = {
  '>=': (a: number, b: number) => a >= b,
  '>': (a: number, b: number) => a > b,
  '<=': (a: number, b: number) => a <= b,
  '<': (a: number, b: number) => a < b,
  '=': (a: number, b: number) => a === b,
  '!=': (a: number, b: number) => a !== b
}

export type Comparator = keyof typeof comparators

export const comparatorKeys = Object.keys(comparators) as Comparator[]

const numberRules = nullPrototype(
  {
    t: () => player.ascensionCounter,
    rt: () => player.ascensionCounterRealReal,
    sg: () => player.singularityCount,
    aag: () => runes.antiquities.level,
    gs: () => synergismStageNumber(),
    cl: () => player.corruptions.used,
    hcl: () => player.corruptions.highestCleared,
    cb: () => calculateCubeBank(),
    hb: () => activeHappyHourBells()
  } satisfies Record<string, () => number>
)

export const completionChallenges = Array.from({ length: 15 }, (_, i) => i + 1)

const completionIds: Record<string, number> = Object.fromEntries(
  completionChallenges.map((challenge) => [`c${challenge}`, challenge])
)

export const maxedChallenges = Array.from({ length: 14 }, (_, i) => i + 1)

const maxedIds: Record<string, number> = Object.fromEntries(
  maxedChallenges.map((challenge) => [`m${challenge}`, challenge])
)

const cubeStallIds = {
  sc: 'wowCubes',
  st: 'wowTesseracts',
  sh: 'wowHypercubes',
  sp: 'wowPlatonicCubes',
  shp: 'wowHepteracts'
} as const

export type CubeRateKey = typeof cubeStallIds[keyof typeof cubeStallIds]

export const cubeRateKeys = Object.values(cubeStallIds)

const cubeStallShortIds = Object.fromEntries(
  Object.entries(cubeStallIds).map(([short, key]) => [key, short])
) as Record<CubeRateKey, keyof typeof cubeStallIds>

const cubeRateSampleInterval = 1

type StallCondition = Extract<AutoAscendCondition, { rule: 'stall' }>

const cubeRateTrackers = new Map<string, { rate: number; at: number }>()

let lastCubeRateSample = Number.NEGATIVE_INFINITY

const cubeRateTrackerKey = ({ cube, tolerance }: StallCondition) => `${cube}@${tolerance}`

export const resetCubeRateTracking = () => {
  cubeRateTrackers.clear()
  lastCubeRateSample = Number.NEGATIVE_INFINITY
}

const stallConditions = (expr: AutoAscendExpr | null): StallCondition[] => {
  if (expr === null) {
    return []
  }
  if (expr.type === 'rule') {
    return expr.condition.rule === 'stall' ? [expr.condition] : []
  }
  return expr.children.flatMap(stallConditions)
}

const sampleCubeRates = () => {
  const now = player.ascensionCounterRealReal
  if (now - lastCubeRateSample < cubeRateSampleInterval) {
    return
  }
  lastCubeRateSample = now
  const gains = CalcCorruptionStuff()
  const time = player.ascensionCounter === 0 ? 1 : player.ascensionCounter
  for (const rule of player.autoAscendRules) {
    for (const condition of [...stallConditions(rule.condition), ...stallConditions(rule.exception)]) {
      const key = cubeRateTrackerKey(condition)
      const tracker = cubeRateTrackers.get(key) ?? { rate: 0, at: 0 }
      cubeRateTrackers.set(key, tracker)
      const rate = gains[condition.cube] / time
      if (rate > tracker.rate * (1 + condition.tolerance / 100)) {
        tracker.rate = rate
        tracker.at = now
      }
    }
  }
}

const cubeRateStallSeconds = (condition: StallCondition) => {
  const tracker = cubeRateTrackers.get(cubeRateTrackerKey(condition))
  return tracker === undefined ? 0 : player.ascensionCounterRealReal - tracker.at
}

const challengeCompletionValue = (challenge: number) =>
  challenge === 15 ? player.challenge15Exponent : player.challengecompletions[challenge]

const isGameStage = (value: number) => Number.isInteger(value) && value >= 0 && value < gameStages().length

const challengeRules = nullPrototype(
  {
    tc: { current: () => player.currentChallenge.transcension, challenges: [1, 2, 3, 4, 5] },
    rc: { current: () => player.currentChallenge.reincarnation, challenges: [6, 7, 8, 9, 10] },
    ac: { current: () => player.currentChallenge.ascension, challenges: [11, 12, 13, 14, 15] }
  } satisfies Record<string, { current: () => number; challenges: number[] }>
)

export type EqualityComparator = '=' | '!='

export const equalityComparatorKeys: EqualityComparator[] = ['=', '!=']

const booleanRules = nullPrototype(
  {
    ch: () =>
      player.currentChallenge.transcension !== 0
      || player.currentChallenge.reincarnation !== 0
      || player.currentChallenge.ascension !== 0,
    tch: () => player.currentChallenge.transcension !== 0,
    rch: () => player.currentChallenge.reincarnation !== 0,
    ach: () => player.currentChallenge.ascension !== 0,
    elo: () => calculateAvailableRebornELO() < 0.001,
    x: () => player.insideSingularityChallenge
  } satisfies Record<string, () => boolean>
)

const exaltIds = {
  nsu: 'noSingularityUpgrades',
  occ: 'oneChallengeCap',
  noc: 'noOcteracts',
  la: 'limitedAscensions',
  nau: 'noAmbrosiaUpgrades',
  nqu: 'noQuarkUpgrades',
  lt: 'limitedTime',
  sp: 'sadisticPrequel',
  tls: 'taxmanLastStand',
  bd: 'barDependence'
} satisfies Record<string, SingularityChallengeDataKeys>

const exaltShortIds = Object.fromEntries(
  Object.entries(exaltIds).map(([short, key]) => [key, short])
) as Record<SingularityChallengeDataKeys, keyof typeof exaltIds>

export type NumberRuleKey = keyof typeof numberRules
export type BooleanRuleKey = keyof typeof booleanRules
export type ChallengeRuleKey = keyof typeof challengeRules

export const numberRuleKeys = Object.keys(numberRules) as NumberRuleKey[]
export const booleanRuleKeys = Object.keys(booleanRules) as BooleanRuleKey[]
export const challengeRuleKeys = Object.keys(challengeRules) as ChallengeRuleKey[]
export const challengeRuleChallenges = (key: ChallengeRuleKey): readonly number[] => challengeRules[key].challenges
export const exaltKeys: SingularityChallengeDataKeys[] = Object.values(exaltIds)

export type AutoAscendCondition =
  | { rule: NumberRuleKey; op: Comparator; value: number }
  | { rule: 'cc'; challenge: number; op: Comparator; value: number }
  | { rule: 'mc'; challenge: number; value: boolean }
  | { rule: 'stall'; cube: CubeRateKey; tolerance: number; op: Comparator; value: number }
  | { rule: ChallengeRuleKey; op: EqualityComparator; value: number }
  | { rule: BooleanRuleKey; value: boolean }
  | { rule: 'exalt'; value: SingularityChallengeDataKeys }

export const ruleVariableKeys: AutoAscendCondition['rule'][] = [
  'cc',
  'mc',
  'stall',
  ...numberRuleKeys,
  ...challengeRuleKeys,
  ...booleanRuleKeys,
  'exalt'
]

export type AutoAscendExpr =
  | { type: 'rule'; condition: AutoAscendCondition }
  | { type: 'and'; children: AutoAscendExpr[] }
  | { type: 'or'; children: AutoAscendExpr[] }

export const ascensionChallenges = [11, 12, 13, 14, 15] as const

export type AscensionChallenge = typeof ascensionChallenges[number]

export type AutoAscendProtocol =
  | { type: 'ascend' }
  | { type: 'ascensionChallenge'; challenge: AscensionChallenge }
  | { type: 'nextAscensionChallenge' }
  | { type: 'corruption'; level: number }
  | { type: 'corruptionLoadout'; slot: number }
  | { type: 'corruptionUnlocked' }
  | { type: 'corruptionCleared' }
  | { type: 'corruptionClimb'; amount: number }
  | { type: 'corruptionDowngrade'; amount: number }
  | { type: 'corruptionCleanse' }
  | { type: 'corruptionBest'; cube: CubeRateKey; runs: number }

type CorruptionProtocol = Exclude<
  AutoAscendProtocol,
  { type: 'ascend' | 'ascensionChallenge' | 'nextAscensionChallenge' }
>

const protocolModifierIds = {
  as: 'antSacrifice',
  cs: 'challengeSweep',
  co: 'cubeOpens',
  tb: 'tesseractBuildings',
  cu: 'cubeUpgrades',
  pu: 'platonicUpgrades',
  ha: 'hepteracts'
} as const

export type ProtocolModifierKey = typeof protocolModifierIds[keyof typeof protocolModifierIds]
export type ProtocolModifiers = Partial<Record<ProtocolModifierKey, boolean>>

export const protocolModifierKeys = Object.values(protocolModifierIds)

const protocolModifierShortIds = Object.fromEntries(
  Object.entries(protocolModifierIds).map(([short, key]) => [key, short])
) as Record<ProtocolModifierKey, keyof typeof protocolModifierIds>

const protocolModifierUnlocks: Record<ProtocolModifierKey, () => boolean> = {
  antSacrifice: () => getAchievementReward('autoAntSacrifice'),
  challengeSweep: () => player.researches[150] > 0,
  cubeOpens: () => player.highestSingularityCount >= 10,
  tesseractBuildings: () => player.researches[190] > 0,
  cubeUpgrades: () => player.highestSingularityCount >= 50,
  platonicUpgrades: () => player.highestSingularityCount >= 50,
  hepteracts: () => player.highestSingularityCount >= 1
}

export const isProtocolModifierUnlocked = (key: ProtocolModifierKey) => protocolModifierUnlocks[key]()

const autoOpenCubeKeys = [
  'autoOpenCubes',
  'autoOpenTesseracts',
  'autoOpenHypercubes',
  'autoOpenPlatonicsCubes'
] as const

const protocolModifierSetters: Record<ProtocolModifierKey, (enabled: boolean) => void> = {
  antSacrifice: (enabled) => {
    if (player.ants.toggles.autoSacrificeEnabled !== enabled) {
      toggleAutoAntSacrificeEnabled()
    }
  },
  challengeSweep: (enabled) => {
    if (player.autoChallengeRunning !== enabled) {
      toggleAutoChallengeRun()
    }
  },
  cubeOpens: (enabled) => {
    autoOpenCubeKeys.forEach((key, index) => {
      if (player[key] !== enabled) {
        toggleautoopensCubes(index + 1)
      }
    })
  },
  tesseractBuildings: (enabled) => {
    if (player.tesseractAutoBuyerToggle !== enabled) {
      toggleautobuytesseract()
    }
  },
  cubeUpgrades: (enabled) => {
    player.autoCubeUpgradesToggle = enabled
    autoCubeUpgradesToggle(false)
  },
  platonicUpgrades: (enabled) => {
    player.autoPlatonicUpgradesToggle = enabled
    autoPlatonicUpgradesToggle(false)
  },
  hepteracts: (enabled) => {
    for (const hept of hepteractKeys) {
      toggleAutomaticHepteracts(hept, enabled)
    }
  }
}

export const isAutoAscendUnlocked = () =>
  player.highestSingularityCount > 0 || (player.challengecompletions[11] > 0 && player.cubeUpgrades[10] > 0)

export const isAutoAscendRunning = () => player.autoAscend && player.unlocks.ascensions && isAutoAscendUnlocked()

export const isAmbrosiaLoadoutUnlocked = () => player.singularityChallenges.noSingularityUpgrades.completions > 0

export const corruptionLoadoutCount = 8

export const corruptionLoadoutSlots = Array.from({ length: corruptionLoadoutCount }, (_, i) => i + 1)

const loadoutOpMinimums = { '=': 0, '+': 1, '-': 1 } as const

export type LoadoutOp = keyof typeof loadoutOpMinimums

export const loadoutOps = Object.keys(loadoutOpMinimums) as LoadoutOp[]

export const loadoutOpMinimum = (op: LoadoutOp) => loadoutOpMinimums[op]

export type LoadoutWrite = { slot: number; op: LoadoutOp; value: number }

export type AutoAscendRule = {
  name: string
  condition: AutoAscendExpr
  exception: AutoAscendExpr | null
  protocol: AutoAscendProtocol
  modifiers: ProtocolModifiers
  loadouts: LoadoutWrite[]
  ambrosiaLoadout: number | null
  disabled: boolean
}

export const isChallengeCondition = (
  c: AutoAscendCondition
): c is Extract<AutoAscendCondition, { rule: ChallengeRuleKey }> => Object.hasOwn(challengeRules, c.rule)

const nonCorruptionProtocolTypes = new Set<AutoAscendProtocol['type']>([
  'ascend',
  'ascensionChallenge',
  'nextAscensionChallenge'
])

const affectsCorruptions = (rule: AutoAscendRule) =>
  !nonCorruptionProtocolTypes.has(rule.protocol.type) || rule.loadouts.length > 0

const isRuleActive = (rule: AutoAscendRule) =>
  !rule.disabled
  && (canChangeCorruptions() || !affectsCorruptions(rule))
  && evaluateExpr(rule.condition)
  && (rule.exception === null || !evaluateExpr(rule.exception))

const evaluateCondition = (c: AutoAscendCondition): boolean => {
  if (c.rule === 'exalt') {
    return player.singularityChallenges[c.value].enabled
  }
  if (isChallengeCondition(c)) {
    return comparators[c.op](challengeRules[c.rule].current(), c.value)
  }
  if (c.rule === 'cc') {
    return comparators[c.op](challengeCompletionValue(c.challenge), c.value)
  }
  if (c.rule === 'mc') {
    return (player.challengecompletions[c.challenge] >= getMaxChallenges(c.challenge)) === c.value
  }
  if (c.rule === 'stall') {
    return comparators[c.op](cubeRateStallSeconds(c), c.value)
  }
  if ('op' in c) {
    if (c.rule === 't' && player.challengecompletions[10] === 0) {
      return false
    }
    return comparators[c.op](numberRules[c.rule](), c.value)
  }
  return booleanRules[c.rule]() === c.value
}

const evaluateExpr = (expr: AutoAscendExpr): boolean => {
  switch (expr.type) {
    case 'rule':
      return evaluateCondition(expr.condition)
    case 'and':
      return expr.children.every(evaluateExpr)
    case 'or':
      return expr.children.some(evaluateExpr)
    default: {
      const unreachable: never = expr
      return unreachable
    }
  }
}

const baseAutoAscendRuleSlots = 8
const maxAutoAscendRuleSlots = 16

export const getAutoAscendRuleSlots = () =>
  Math.min(maxAutoAscendRuleSlots, baseAutoAscendRuleSlots + PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL)

export const maxComparisonsPerExpr = 16
export const maxRuleNameLength = 16
const maxRuleLength = 1024

const countComparisons = (expr: AutoAscendExpr): number =>
  expr.type === 'rule' ? 1 : expr.children.reduce((sum, child) => sum + countComparisons(child), 0)

export const normalizeExpr = (expr: AutoAscendExpr): AutoAscendExpr | null => {
  if (expr.type === 'rule') {
    return expr
  }
  const children = expr.children
    .map(normalizeExpr)
    .filter((child) => child !== null)
    .flatMap((child) => child.type === expr.type ? child.children : [child])
  if (children.length === 0) {
    return null
  }
  if (children.length === 1) {
    return children[0]
  }
  return { type: expr.type, children }
}

type RuleParseErrorCode =
  | 'unexpectedToken'
  | 'unknownRule'
  | 'unknownExalt'
  | 'expectedComparator'
  | 'expectedNumber'
  | 'expectedEquality'
  | 'invalidChallenge'
  | 'invalidStage'
  | 'invalidTolerance'
  | 'unclosedParen'
  | 'expectedProtocol'
  | 'unknownProtocol'
  | 'invalidProtocolValue'
  | 'unknownModifier'
  | 'invalidModifierValue'
  | 'duplicateModifier'
  | 'invalidLoadout'
  | 'duplicateLoadout'
  | 'invalidAmbrosiaLoadout'
  | 'tooManyComparisons'
  | 'invalidName'
  | 'nameTooLong'
  | 'ruleTooLong'

export class RuleParseError extends Error {
  constructor (readonly code: RuleParseErrorCode, readonly column: number, readonly line = 0) {
    super(code)
  }
}

const identifierPattern = /^[a-z]/
const tokenPattern =
  /\s*("(?:[^"\\\r\n]|\\.)*"|\d+(?:\.\d+)?(?:e[+-]?\d+)?|[a-z][a-z0-9]*|>=|<=|!=|[<>=&|!():~+,#@-])\s*/iy

const tokenize = (text: string) => {
  const tokens: { text: string; column: number }[] = []
  tokenPattern.lastIndex = 0
  while (tokenPattern.lastIndex < text.length) {
    const start = tokenPattern.lastIndex
    const match = tokenPattern.exec(text)
    if (match === null) {
      throw new RuleParseError('unexpectedToken', start + text.slice(start).search(/\S/))
    }
    const token = match[1]
    tokens.push({
      text: token.startsWith('"') ? token : token.toLowerCase(),
      column: match.index + match[0].indexOf(token)
    })
  }
  return tokens
}

const isNumberRule = (id: string): id is NumberRuleKey => Object.hasOwn(numberRules, id)
const isChallengeRule = (id: string): id is ChallengeRuleKey => Object.hasOwn(challengeRules, id)
const isBooleanRule = (id: string): id is BooleanRuleKey => Object.hasOwn(booleanRules, id)
const isComparator = (id: string): id is Comparator => Object.hasOwn(comparators, id)
const isModifierId = (id: string): id is keyof typeof protocolModifierIds => Object.hasOwn(protocolModifierIds, id)
const isLoadoutOp = (id: string): id is LoadoutOp => Object.hasOwn(loadoutOpMinimums, id)
const isCubeStallId = (id: string): id is keyof typeof cubeStallIds => Object.hasOwn(cubeStallIds, id)
const isExaltId = (id: string): id is keyof typeof exaltIds => Object.hasOwn(exaltIds, id)
const isAscensionChallenge = (n: number): n is AscensionChallenge =>
  (ascensionChallenges as readonly number[]).includes(n)

const loadoutIdPattern = /^s(\d+)$/

const parseLoadoutSlot = (id: string) => {
  const match = loadoutIdPattern.exec(id)
  if (match === null) {
    return null
  }
  const slot = Number(match[1])
  return slot >= 1 && slot <= corruptionLoadoutCount ? slot : Number.NaN
}

const corruptionKeywordProtocols = {
  max: 'corruptionUnlocked',
  clr: 'corruptionCleared',
  cln: 'corruptionCleanse'
} as const

const parseRuleName = (token: string, column: number) => {
  let name: unknown
  try {
    name = JSON.parse(token)
  } catch {
    throw new RuleParseError('invalidName', column)
  }
  if (typeof name !== 'string') {
    throw new RuleParseError('invalidName', column)
  }
  const trimmed = name.trim()
  if (trimmed.length > maxRuleNameLength) {
    throw new RuleParseError('nameTooLong', column)
  }
  return trimmed
}

export const parseRule = (text: string): AutoAscendRule => {
  if (text.length > maxRuleLength) {
    throw new RuleParseError('ruleTooLong', maxRuleLength)
  }

  const tokens = tokenize(text)
  let i = 0

  const peek = () => tokens[i]?.text ?? ''
  const fail = (code: RuleParseErrorCode): never => {
    throw new RuleParseError(code, tokens[i]?.column ?? text.length)
  }

  const parseGroup = (
    symbol: '&' | '|',
    type: 'and' | 'or',
    parseChild: () => AutoAscendExpr
  ): AutoAscendExpr => {
    const children = [parseChild()]
    while (peek() === symbol) {
      i++
      children.push(parseChild())
    }
    if (children.length === 1) {
      return children[0]
    }
    return { type, children: children.flatMap((child) => child.type === type ? child.children : [child]) }
  }

  const parseComparison = (isValid: (value: number) => boolean, code: RuleParseErrorCode) => {
    const op = peek()
    if (!isComparator(op)) {
      return fail('expectedComparator')
    }
    i++
    const value = Number(peek())
    if (peek() === '' || !isValid(value)) {
      return fail(code)
    }
    i++
    return { op, value }
  }

  const parseCondition = (): AutoAscendCondition => {
    const negated = peek() === '!'
    if (negated) {
      i++
    }
    const id = peek()

    if (id === 'x' && !negated && tokens[i + 1]?.text === '=') {
      i += 2
      const exalt = peek()
      if (!isExaltId(exalt)) {
        return fail('unknownExalt')
      }
      i++
      return { rule: 'exalt', value: exaltIds[exalt] }
    }

    if (isBooleanRule(id)) {
      i++
      return { rule: id, value: !negated }
    }

    if (Object.hasOwn(maxedIds, id)) {
      i++
      return { rule: 'mc', challenge: maxedIds[id], value: !negated }
    }

    if (!negated && isChallengeRule(id)) {
      i++
      const op = peek()
      if (op !== '=' && op !== '!=') {
        return fail('expectedEquality')
      }
      i++
      const value = Number(peek())
      if (peek() === '' || !challengeRules[id].challenges.includes(value)) {
        return fail('invalidChallenge')
      }
      i++
      return { rule: id, op, value }
    }

    if (!negated && Object.hasOwn(completionIds, id)) {
      i++
      return { rule: 'cc', challenge: completionIds[id], ...parseComparison(Number.isFinite, 'expectedNumber') }
    }

    if (!negated && isCubeStallId(id)) {
      i++
      const comparison = parseComparison(Number.isFinite, 'expectedNumber')
      let tolerance = 0
      if (peek() === '@') {
        i++
        tolerance = Number(peek())
        if (peek() === '' || !Number.isFinite(tolerance) || tolerance < 0) {
          return fail('invalidTolerance')
        }
        i++
      }
      return { rule: 'stall', cube: cubeStallIds[id], tolerance, ...comparison }
    }

    if (!negated && isNumberRule(id)) {
      i++
      const comparison = id === 'gs'
        ? parseComparison(isGameStage, 'invalidStage')
        : parseComparison(Number.isFinite, 'expectedNumber')
      return { rule: id, ...comparison }
    }

    return fail(identifierPattern.test(id) ? 'unknownRule' : 'unexpectedToken')
  }

  const parseFactor = (): AutoAscendExpr => {
    if (peek() === '(') {
      i++
      const expr = parseOr()
      if (peek() !== ')') {
        return fail('unclosedParen')
      }
      i++
      return expr
    }
    return { type: 'rule', condition: parseCondition() }
  }

  const parseAnd = () => parseGroup('&', 'and', parseFactor)
  const parseOr = (): AutoAscendExpr => parseGroup('|', 'or', parseAnd)

  const parseProtocol = (): AutoAscendProtocol => {
    const id = peek()
    if (id === 'asc') {
      i++
      return { type: 'ascend' }
    }
    if (id !== 'c' && id !== 'l') {
      return fail(id === '' ? 'expectedProtocol' : 'unknownProtocol')
    }
    i++

    if (id === 'l' && (peek() === '+' || peek() === '-')) {
      const type = peek() === '+' ? 'corruptionClimb' : 'corruptionDowngrade'
      i++
      const amount = Number(peek())
      if (peek() === '' || !Number.isInteger(amount) || amount < 1) {
        return fail('invalidProtocolValue')
      }
      i++
      return { type, amount }
    }

    if (peek() !== '=') {
      return fail('unexpectedToken')
    }
    i++
    const value = peek()

    if (id === 'c') {
      if (value === 'next') {
        i++
        return { type: 'nextAscensionChallenge' }
      }
      const challenge = Number(value)
      if (value === '' || !isAscensionChallenge(challenge)) {
        return fail('invalidProtocolValue')
      }
      i++
      return { type: 'ascensionChallenge', challenge }
    }

    if (value === 'best') {
      i++
      if (peek() !== '(') {
        return fail('unexpectedToken')
      }
      i++
      const cube = peek()
      if (!isCubeStallId(cube)) {
        return fail('invalidProtocolValue')
      }
      i++
      if (peek() !== ',') {
        return fail('unexpectedToken')
      }
      i++
      const runs = Number(peek())
      if (peek() === '' || !Number.isInteger(runs) || runs < 1) {
        return fail('invalidProtocolValue')
      }
      i++
      if (peek() !== ')') {
        return fail('unclosedParen')
      }
      i++
      return { type: 'corruptionBest', cube: cubeStallIds[cube], runs }
    }

    if (value === 'max' || value === 'clr' || value === 'cln') {
      i++
      return { type: corruptionKeywordProtocols[value] }
    }

    const slot = parseLoadoutSlot(value)
    if (slot !== null) {
      if (Number.isNaN(slot)) {
        return fail('invalidLoadout')
      }
      i++
      return { type: 'corruptionLoadout', slot }
    }

    const level = Number(value)
    if (value === '' || !Number.isInteger(level) || level < 0) {
      return fail('invalidProtocolValue')
    }
    i++
    return { type: 'corruption', level }
  }

  const parseLimitedExpr = () => {
    const column = tokens[i]?.column ?? text.length
    const expr = parseOr()
    if (countComparisons(expr) > maxComparisonsPerExpr) {
      throw new RuleParseError('tooManyComparisons', column)
    }
    return expr
  }

  const disabled = peek() === '#'
  if (disabled) {
    i++
  }

  let name = ''
  if (peek().startsWith('"')) {
    name = parseRuleName(peek(), tokens[i].column)
    i++
  }

  const condition = parseLimitedExpr()
  let exception: AutoAscendExpr | null = null
  if (peek() === '~') {
    i++
    exception = parseLimitedExpr()
  }
  if (peek() !== ':') {
    fail(i < tokens.length ? 'unexpectedToken' : 'expectedProtocol')
  }
  i++
  const protocol = parseProtocol()
  const modifiers: ProtocolModifiers = {}
  const loadouts: LoadoutWrite[] = []
  let ambrosiaLoadout: number | null = null
  while (peek() === ',') {
    i++
    const id = peek()
    if (id === 'al') {
      if (ambrosiaLoadout !== null) {
        fail('duplicateModifier')
      }
      i++
      if (peek() !== '=') {
        fail('unexpectedToken')
      }
      i++
      const slot = Number(peek())
      if (peek() === '' || !Number.isInteger(slot) || slot < 1 || slot > MAX_BLUEBERRY_LOADOUT_COUNT) {
        fail('invalidAmbrosiaLoadout')
      }
      i++
      ambrosiaLoadout = slot
      continue
    }
    const slot = parseLoadoutSlot(id)
    if (slot !== null) {
      if (Number.isNaN(slot)) {
        fail('invalidLoadout')
      }
      if (loadouts.some((write) => write.slot === slot)) {
        fail('duplicateLoadout')
      }
      i++
      const op = peek()
      if (!isLoadoutOp(op)) {
        return fail('unexpectedToken')
      }
      i++
      const value = Number(peek())
      if (peek() === '' || !Number.isInteger(value) || value < loadoutOpMinimums[op]) {
        fail('invalidLoadout')
      }
      i++
      loadouts.push({ slot, op, value })
      continue
    }
    if (!isModifierId(id)) {
      fail('unknownModifier')
    }
    const key = protocolModifierIds[id as keyof typeof protocolModifierIds]
    if (modifiers[key] !== undefined) {
      fail('duplicateModifier')
    }
    i++
    if (peek() !== '=') {
      fail('unexpectedToken')
    }
    i++
    if (peek() !== '1' && peek() !== '0') {
      fail('invalidModifierValue')
    }
    modifiers[key] = peek() === '1'
    i++
  }
  if (i < tokens.length) {
    fail('unexpectedToken')
  }
  return { name, condition, exception, protocol, modifiers, loadouts, ambrosiaLoadout, disabled }
}

export const parseRules = (text: string): AutoAscendRule[] => {
  const lines = text.split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(({ line }) => line !== '')

  return lines.map(({ line, index }) => {
    try {
      return parseRule(line)
    } catch (error) {
      if (error instanceof RuleParseError) {
        throw new RuleParseError(error.code, error.column, index + 1)
      }
      throw error
    }
  })
}

export const parseSavedRules = (text: string): AutoAscendRule[] =>
  text.split('\n').flatMap((line) => {
    try {
      return line === '' ? [] : [parseRule(line)]
    } catch {
      return []
    }
  }).slice(0, maxAutoAscendRuleSlots)

const printCondition = (condition: AutoAscendCondition): string => {
  if (condition.rule === 'exalt') {
    return `x=${exaltShortIds[condition.value]}`
  }
  if (condition.rule === 'cc') {
    return `c${condition.challenge}${condition.op}${condition.value}`
  }
  if (condition.rule === 'mc') {
    return `${condition.value ? '' : '!'}m${condition.challenge}`
  }
  if (condition.rule === 'stall') {
    const tolerance = condition.tolerance === 0 ? '' : `@${condition.tolerance}`
    return `${cubeStallShortIds[condition.cube]}${condition.op}${condition.value}${tolerance}`
  }
  if ('op' in condition) {
    return `${condition.rule}${condition.op}${condition.value}`
  }
  return condition.value ? condition.rule : `!${condition.rule}`
}

const printExpr = (expr: AutoAscendExpr, parent?: 'and' | 'or'): string => {
  switch (expr.type) {
    case 'rule':
      return printCondition(expr.condition)
    case 'and':
      return expr.children.map((child) => printExpr(child, 'and')).join('&')
    case 'or': {
      const text = expr.children.map((child) => printExpr(child, 'or')).join('|')
      return parent === 'and' ? `(${text})` : text
    }
    default: {
      const unreachable: never = expr
      return unreachable
    }
  }
}

const printProtocol = (protocol: AutoAscendProtocol): string => {
  switch (protocol.type) {
    case 'ascend':
      return 'asc'
    case 'ascensionChallenge':
      return `c=${protocol.challenge}`
    case 'nextAscensionChallenge':
      return 'c=next'
    case 'corruption':
      return `l=${protocol.level}`
    case 'corruptionLoadout':
      return `l=s${protocol.slot}`
    case 'corruptionUnlocked':
      return 'l=max'
    case 'corruptionCleared':
      return 'l=clr'
    case 'corruptionClimb':
      return `l+${protocol.amount}`
    case 'corruptionDowngrade':
      return `l-${protocol.amount}`
    case 'corruptionCleanse':
      return 'l=cln'
    case 'corruptionBest':
      return `l=best(${cubeStallShortIds[protocol.cube]},${protocol.runs})`
    default: {
      const unreachable: never = protocol
      return unreachable
    }
  }
}

export const printRule = (rule: AutoAscendRule) => {
  const disabled = rule.disabled ? '#' : ''
  const name = rule.name === '' ? '' : `${JSON.stringify(rule.name)} `
  const exception = rule.exception === null ? '' : `~${printExpr(rule.exception)}`
  const modifiers = protocolModifierKeys
    .filter((key) => rule.modifiers[key] !== undefined)
    .map((key) => `,${protocolModifierShortIds[key]}=${rule.modifiers[key] ? 1 : 0}`)
    .join('')
  const loadouts = rule.loadouts.map(({ slot, op, value }) => `,s${slot}${op}${value}`).join('')
  const ambrosiaLoadout = rule.ambrosiaLoadout === null ? '' : `,al=${rule.ambrosiaLoadout}`
  return `${disabled}${name}${printExpr(rule.condition)}${exception}:${
    printProtocol(rule.protocol)
  }${loadouts}${modifiers}${ambrosiaLoadout}`
}

export const printRules = (rules: AutoAscendRule[]) => rules.map(printRule).join('\n')

let pendingCorruptionProtocol: CorruptionProtocol | null = null

const bestRecentCorruptionLevel = ({ cube, runs }: Extract<CorruptionProtocol, { type: 'corruptionBest' }>) => {
  let level = player.corruptions.next
  let bestRate = Number.NEGATIVE_INFINITY
  let counted = 0
  for (let i = player.history.ascend.length - 1; i >= 0 && counted < runs; i--) {
    const entry = player.history.ascend[i]
    if (
      entry.kind !== 'ascend'
      || entry.currentChallenge !== undefined
      || typeof entry.usedCorruptions !== 'number'
      || entry.realSeconds === undefined
      || entry.realSeconds <= 0
    ) {
      continue
    }
    counted++
    const rate = entry[cube] / entry.realSeconds
    if (rate > bestRate) {
      bestRate = rate
      level = entry.usedCorruptions
    }
  }
  return level
}

const corruptionProtocolLevel = (protocol: CorruptionProtocol) => {
  switch (protocol.type) {
    case 'corruption':
      return protocol.level
    case 'corruptionLoadout':
      return player.corruptions.loadouts[protocol.slot - 1]
    case 'corruptionUnlocked':
      return maxCorruptionLevel()
    case 'corruptionCleared':
      return player.corruptions.highestCleared
    case 'corruptionClimb':
      return player.corruptions.used + protocol.amount
    case 'corruptionDowngrade':
      return Math.max(0, player.corruptions.used - protocol.amount)
    case 'corruptionCleanse':
      return 0
    case 'corruptionBest':
      return bestRecentCorruptionLevel(protocol)
    default: {
      const unreachable: never = protocol
      return unreachable
    }
  }
}

export const applyPendingAutoAscendProtocol = (challengeTenCompleted: boolean) => {
  if (pendingCorruptionProtocol === null) {
    return
  }
  const level = corruptionProtocolLevel(pendingCorruptionProtocol)
  player.corruptions.next = normalizeCorruptionLevel(
    challengeTenCompleted ? level : Math.min(level, player.corruptions.used)
  )
  pendingCorruptionProtocol = null
}

const ascend = () => {
  const challenge = player.currentChallenge.ascension
  if (challenge !== 0) {
    void resetCheck('ascensionChallenge', false, true, false)
    challengeExit('ascension')
    reset('ascensionChallenge', false, undefined, challenge)
  } else {
    reset('ascension', false)
  }
}

const isAscensionChallengeUnlocked = (challenge: AscensionChallenge) =>
  challenge === 11 ? player.unlocks.ascensions : player.highestchallengecompletions[challenge - 1] > 0

const isAscensionChallengeCompleted = (challenge: AscensionChallenge) =>
  challenge !== 15 && player.highestchallengecompletions[challenge] >= getMaxChallenges(challenge)

const nextUnlockedAscensionChallenge = () => {
  const start = (ascensionChallenges as readonly number[]).indexOf(player.currentChallenge.ascension)
  for (let step = 1; step <= ascensionChallenges.length; step++) {
    const challenge = ascensionChallenges[(start + step) % ascensionChallenges.length]
    if (isAscensionChallengeUnlocked(challenge) && !isAscensionChallengeCompleted(challenge)) {
      return challenge
    }
  }
  return null
}

const enterAscensionChallenge = (challenge: AscensionChallenge | null) => {
  if (challenge === null || !isAscensionChallengeUnlocked(challenge)) {
    ascend()
    return
  }

  const leftChallenge = player.currentChallenge.ascension
  if (leftChallenge !== 0) {
    void resetCheck('ascensionChallenge', false, true, false)
  }
  challengeExit('transcension')
  challengeExit('reincarnation')
  challengeExit('ascension')
  toggleChallenges(challenge, true, leftChallenge)
}

const runAutoAscendProtocol = (protocol: AutoAscendProtocol) => {
  if (protocol.type === 'ascend') {
    ascend()
    return
  }
  if (protocol.type === 'ascensionChallenge') {
    enterAscensionChallenge(protocol.challenge)
    return
  }
  if (protocol.type === 'nextAscensionChallenge') {
    enterAscensionChallenge(nextUnlockedAscensionChallenge())
    return
  }

  pendingCorruptionProtocol = protocol
  ascend()
  pendingCorruptionProtocol = null
}

const loadoutWriteLevel = (current: number, { op, value }: LoadoutWrite) => {
  switch (op) {
    case '=':
      return value
    case '+':
      return Math.max(current, Math.min(current + value, maxCorruptionLevel()))
    case '-':
      return Math.max(0, current - value)
    default: {
      const unreachable: never = op
      return unreachable
    }
  }
}

const applyLoadoutWrites = (loadouts: LoadoutWrite[]) => {
  for (const write of loadouts) {
    player.corruptions.loadouts[write.slot - 1] = loadoutWriteLevel(player.corruptions.loadouts[write.slot - 1], write)
  }
}

const applyProtocolModifiers = (modifiers: ProtocolModifiers) => {
  for (const key of protocolModifierKeys) {
    const enabled = modifiers[key]
    if (enabled !== undefined && isProtocolModifierUnlocked(key)) {
      protocolModifierSetters[key](enabled)
    }
  }
}

export const runAutoAscendRules = () => {
  sampleCubeRates()
  const index = player.autoAscendRules.findIndex(isRuleActive)
  if (index === -1) {
    return index
  }
  const firedRule = player.autoAscendRules[index]
  runAutoAscendProtocol(firedRule.protocol)
  applyLoadoutWrites(firedRule.loadouts)
  applyProtocolModifiers(firedRule.modifiers)
  if (firedRule.ambrosiaLoadout !== null && isAmbrosiaLoadoutUnlocked()) {
    autoLoadBlueberryLoadout(firedRule.ambrosiaLoadout)
  }
  return index
}
