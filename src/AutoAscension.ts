import { getAchievementReward } from './Achievements'
import { getMaxChallenges } from './Challenges'
import { maxCorruptionLevel, normalizeCorruptionLevel } from './Corruptions'
import { calculateAvailableRebornELO } from './Features/Ants/AntSacrifice/Rewards/ELO/RebornELO/lib/calculate'
import { toggleAutoAntSacrificeEnabled } from './Features/Ants/toggles/auto-sacrifice'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { reset } from './Reset'
import type { SingularityChallengeDataKeys } from './SingularityChallenges'
import { player, resetCheck } from './Synergism'
import { toggleAutoChallengeRun, toggleChallenges } from './Toggles'
import { challengeExit } from './UpdateHTML'

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

const numberRules = {
  c10: () => player.challengecompletions[10],
  t: () => player.ascensionCounter,
  rt: () => player.ascensionCounterRealReal
} satisfies Record<string, () => number>

const challengeRules = {
  tc: { current: () => player.currentChallenge.transcension, challenges: [1, 2, 3, 4, 5] },
  rc: { current: () => player.currentChallenge.reincarnation, challenges: [6, 7, 8, 9, 10] },
  ac: { current: () => player.currentChallenge.ascension, challenges: [11, 12, 13, 14, 15] }
} satisfies Record<string, { current: () => number; challenges: number[] }>

export type EqualityComparator = '=' | '!='

export const equalityComparatorKeys: EqualityComparator[] = ['=', '!=']

const booleanRules = {
  ch: () =>
    player.currentChallenge.transcension !== 0
    || player.currentChallenge.reincarnation !== 0
    || player.currentChallenge.ascension !== 0,
  tch: () => player.currentChallenge.transcension !== 0,
  rch: () => player.currentChallenge.reincarnation !== 0,
  ach: () => player.currentChallenge.ascension !== 0,
  m10: () => player.challengecompletions[10] >= getMaxChallenges(10),
  m11: () => player.challengecompletions[11] >= getMaxChallenges(11),
  m12: () => player.challengecompletions[12] >= getMaxChallenges(12),
  m13: () => player.challengecompletions[13] >= getMaxChallenges(13),
  m14: () => player.challengecompletions[14] >= getMaxChallenges(14),
  elo: () => calculateAvailableRebornELO() < 0.001,
  x: () => player.insideSingularityChallenge
} satisfies Record<string, () => boolean>

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
  | { rule: ChallengeRuleKey; op: EqualityComparator; value: number }
  | { rule: BooleanRuleKey; value: boolean }
  | { rule: 'exalt'; value: SingularityChallengeDataKeys }

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
  | { type: 'corruptionUnlocked' }
  | { type: 'corruptionCleared' }
  | { type: 'corruptionClimb'; amount: number }
  | { type: 'corruptionDowngrade'; amount: number }
  | { type: 'corruptionCleanse' }

type CorruptionProtocol = Exclude<
  AutoAscendProtocol,
  { type: 'ascend' | 'ascensionChallenge' | 'nextAscensionChallenge' }
>

const protocolModifierIds = {
  as: 'antSacrifice',
  cs: 'challengeSweep'
} as const

export type ProtocolModifierKey = typeof protocolModifierIds[keyof typeof protocolModifierIds]
export type ProtocolModifiers = Partial<Record<ProtocolModifierKey, boolean>>

export const protocolModifierKeys = Object.values(protocolModifierIds)

const protocolModifierShortIds = Object.fromEntries(
  Object.entries(protocolModifierIds).map(([short, key]) => [key, short])
) as Record<ProtocolModifierKey, keyof typeof protocolModifierIds>

const protocolModifierState: Record<ProtocolModifierKey, () => boolean> = {
  antSacrifice: () => player.ants.toggles.autoSacrificeEnabled,
  challengeSweep: () => player.autoChallengeRunning
}

const protocolModifierUnlocks: Record<ProtocolModifierKey, () => boolean> = {
  antSacrifice: () => Boolean(getAchievementReward('autoAntSacrifice')),
  challengeSweep: () => player.researches[150] > 0
}

export const isProtocolModifierUnlocked = (key: ProtocolModifierKey) => protocolModifierUnlocks[key]()

const protocolModifierToggles: Record<ProtocolModifierKey, () => void> = {
  antSacrifice: toggleAutoAntSacrificeEnabled,
  challengeSweep: toggleAutoChallengeRun
}

export type AutoAscendRule = {
  name: string
  condition: AutoAscendExpr
  exception: AutoAscendExpr | null
  protocol: AutoAscendProtocol
  modifiers: ProtocolModifiers
}

export const isChallengeCondition = (
  c: AutoAscendCondition
): c is Extract<AutoAscendCondition, { rule: ChallengeRuleKey }> => Object.hasOwn(challengeRules, c.rule)

const isRuleActive = (rule: AutoAscendRule) =>
  evaluateExpr(rule.condition) && (rule.exception === null || !evaluateExpr(rule.exception))

const evaluateCondition = (c: AutoAscendCondition): boolean => {
  if (c.rule === 'exalt') {
    return player.singularityChallenges[c.value].enabled
  }
  if (isChallengeCondition(c)) {
    return comparators[c.op](challengeRules[c.rule].current(), c.value)
  }
  if ('op' in c) {
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
  | 'unclosedParen'
  | 'expectedProtocol'
  | 'unknownProtocol'
  | 'invalidProtocolValue'
  | 'unknownModifier'
  | 'invalidModifierValue'
  | 'duplicateModifier'
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
  /\s*("(?:[^"\\\r\n]|\\.)*"|\d+(?:\.\d+)?(?:e[+-]?\d+)?|[a-z][a-z0-9]*|>=|<=|!=|[<>=&|!():~+,-])\s*/iy

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
const isExaltId = (id: string): id is keyof typeof exaltIds => Object.hasOwn(exaltIds, id)
const isAscensionChallenge = (n: number): n is AscensionChallenge =>
  (ascensionChallenges as readonly number[]).includes(n)

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

    if (!negated && isNumberRule(id)) {
      i++
      const op = peek()
      if (!isComparator(op)) {
        return fail('expectedComparator')
      }
      i++
      const value = Number(peek())
      if (peek() === '' || !Number.isFinite(value)) {
        return fail('expectedNumber')
      }
      i++
      return { rule: id, op, value }
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

    if (value === 'max' || value === 'clr' || value === 'cln') {
      i++
      return { type: corruptionKeywordProtocols[value] }
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
  while (peek() === ',') {
    i++
    const id = peek()
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
  return { name, condition, exception, protocol, modifiers }
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
    default: {
      const unreachable: never = protocol
      return unreachable
    }
  }
}

export const printRule = (rule: AutoAscendRule) => {
  const name = rule.name === '' ? '' : `${JSON.stringify(rule.name)} `
  const exception = rule.exception === null ? '' : `~${printExpr(rule.exception)}`
  const modifiers = protocolModifierKeys
    .filter((key) => rule.modifiers[key] !== undefined)
    .map((key) => `,${protocolModifierShortIds[key]}=${rule.modifiers[key] ? 1 : 0}`)
    .join('')
  return `${name}${printExpr(rule.condition)}${exception}:${printProtocol(rule.protocol)}${modifiers}`
}

export const printRules = (rules: AutoAscendRule[]) => rules.map(printRule).join('\n')

let pendingCorruptionProtocol: CorruptionProtocol | null = null

const corruptionProtocolLevel = (protocol: CorruptionProtocol) => {
  switch (protocol.type) {
    case 'corruption':
      return protocol.level
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
  if (player.currentChallenge.ascension !== 0) {
    void resetCheck('ascensionChallenge', false, true)
    challengeExit('ascension')
    reset('ascensionChallenge', false)
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

  if (player.currentChallenge.ascension !== 0) {
    void resetCheck('ascensionChallenge', false, true)
  }
  challengeExit('transcension')
  challengeExit('reincarnation')
  challengeExit('ascension')
  toggleChallenges(challenge, true)
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

const applyProtocolModifiers = (modifiers: ProtocolModifiers) => {
  for (const key of protocolModifierKeys) {
    const enabled = modifiers[key]
    if (enabled !== undefined && isProtocolModifierUnlocked(key) && protocolModifierState[key]() !== enabled) {
      protocolModifierToggles[key]()
    }
  }
}

export const runAutoAscendRules = () => {
  const index = player.autoAscendRules.findIndex(isRuleActive)
  if (index === -1) {
    return index
  }
  const firedRule = player.autoAscendRules[index]
  runAutoAscendProtocol(firedRule.protocol)
  applyProtocolModifiers(firedRule.modifiers)
  return index
}
