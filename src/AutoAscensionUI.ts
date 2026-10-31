import i18next from 'i18next'
import {
  ascensionChallenges,
  type AutoAscendCondition,
  type AutoAscendExpr,
  type AutoAscendProtocol,
  type AutoAscendRule,
  type BooleanRuleKey,
  booleanRuleKeys,
  challengeRuleChallenges,
  type ChallengeRuleKey,
  challengeRuleKeys,
  type Comparator,
  comparatorKeys,
  completionChallenges,
  corruptionLoadoutCount,
  corruptionLoadoutSlots,
  type CubeRateKey,
  cubeRateKeys,
  equalityComparatorKeys,
  exaltKeys,
  getAutoAscendRuleSlots,
  isAmbrosiaLoadoutUnlocked,
  isChallengeCondition,
  isProtocolModifierUnlocked,
  type LoadoutOp,
  loadoutOpMinimum,
  loadoutOps,
  type LoadoutWrite,
  maxComparisonsPerExpr,
  maxedChallenges,
  maxRuleNameLength,
  normalizeExpr,
  type NumberRuleKey,
  numberRuleKeys,
  parseRule,
  parseRules,
  printRule,
  printRules,
  type ProtocolModifierKey,
  protocolModifierKeys,
  type ProtocolModifiers,
  RuleParseError,
  ruleVariableKeys
} from './AutoAscension'
import { getUnlockedBlueberryLoadoutCount } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { getMaxChallenges } from './Challenges'
import { activeCorruptionLevel, maxCorruptionLevel } from './Corruptions'
import { readFileAsText } from './ImportExport'
import type { SingularityChallengeDataKeys } from './SingularityChallenges'
import { gameStages } from './Statistics'
import { format, formatTimeShort, player } from './Synergism'
import { Alert, CloseModal, Confirm, MEDIUM_MODAL_UPDATE_TICK, Modal, Notification } from './UpdateHTML'
import { isMobile } from './Utility'

type VariableKey = AutoAscendCondition['rule']
type ProtocolType = AutoAscendProtocol['type']
type GroupOp = 'and' | 'or'

type DraftComparison = { kind: 'comparison'; condition: AutoAscendCondition }
type DraftGroup = { kind: 'group'; op: GroupOp; children: DraftNode[] }
type DraftNode = DraftComparison | DraftGroup

type RuleDraft = {
  index: number | null
  name: string
  condition: DraftGroup
  exception: DraftGroup
  protocol: AutoAscendProtocol | null
  modifiers: ProtocolModifiers
  loadouts: LoadoutWrite[]
  ambrosiaLoadout: number | null
  disabled: boolean
}

const modifierStates = ['keep', 'enable', 'disable'] as const

type ModifierState = typeof modifierStates[number]

const uiKey = 'corruptions.autoAscend.rules.ui'
const errorKey = 'corruptions.autoAscend.rules.errors'
const paletteFileName = 'Synergism-AutoAscension-Rules.txt'

const integerNumberRules = new Set<VariableKey>(['sg', 'cb', 'hb'])
const groupOps: GroupOp[] = ['and', 'or']
const protocolTypes: ProtocolType[] = [
  'ascend',
  'ascensionChallenge',
  'nextAscensionChallenge',
  'corruption',
  'corruptionLoadout',
  'corruptionUnlocked',
  'corruptionCleared',
  'corruptionClimb',
  'corruptionDowngrade',
  'corruptionCleanse'
]

const loadoutOpKeys: Record<LoadoutOp, string> = {
  '=': 'set',
  '+': 'increase',
  '-': 'decrease'
}

const comparatorSymbols: Record<Comparator, string> = {
  '>=': '≥',
  '>': '>',
  '<=': '≤',
  '<': '<',
  '=': '=',
  '!=': '≠'
}

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
}

const escapeHTML = (text: string) => text.replace(/[&<>"']/g, (character) => htmlEscapes[character])

const selectMenuMargin = 8
const selectMenuSteps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 }

let draft: RuleDraft | null = null
let openSelect: HTMLButtonElement | null = null

const rulePulseDuration = 1600
let rulePulse: { element: Element; timeout: ReturnType<typeof setTimeout> } | null = null
let lastFiredRule: { rule: AutoAscendRule; index: number } | null = null

const isNumberRuleKey = (key: VariableKey): key is NumberRuleKey => (numberRuleKeys as string[]).includes(key)
const isChallengeRuleKey = (key: VariableKey): key is ChallengeRuleKey => (challengeRuleKeys as string[]).includes(key)
const isBooleanRuleKey = (key: VariableKey): key is BooleanRuleKey => (booleanRuleKeys as string[]).includes(key)

const variableName = (key: VariableKey) => i18next.t(`${uiKey}.variables.${key}`)
const exaltName = (key: SingularityChallengeDataKeys) => i18next.t(`singularityChallenge.data.${key}.name`)
const challengeName = (challenge: number) => i18next.t(`challenges.${challenge}.progressName`)
const protocolName = (type: ProtocolType) => i18next.t(`${uiKey}.protocols.${type}`)
const modifierName = (key: ProtocolModifierKey) => i18next.t(`${uiKey}.modifiers.${key}`)
const modifierStateName = (state: ModifierState) => i18next.t(`${uiKey}.modifierStates.${state}`)
const loadoutName = (slot: number) => i18next.t(`${uiKey}.loadoutSlot`, { slot })
const loadoutSlotOptions = (slots: number[]) => slots.map((slot) => ({ value: slot, label: loadoutName(slot) }))
const ambrosiaLoadoutName = (slot: number) => i18next.t(`${uiKey}.ambrosiaLoadoutSlot`, { slot })
const completionName = (challenge: number) =>
  `${challengeName(challenge)} ${i18next.t(`${uiKey}.${challenge === 15 ? 'challengeScore' : 'challengeCompletions'}`)}`
const numberedChallengeName = (challenge: number) => `(${challenge}) ${challengeName(challenge)}`
const maxedName = (challenge: number) => `${challengeName(challenge)} ${i18next.t(`${uiKey}.challengeMaxed`)}`
const cubeStallName = (cube: CubeRateKey) => i18next.t(`${uiKey}.cubeStall.${cube}`)
const gameStageName = (stage: number) => `${stage}: ${gameStages()[stage]?.name ?? ''}`

const modifierState = (enabled: boolean | undefined): ModifierState =>
  enabled === undefined ? 'keep' : enabled ? 'enable' : 'disable'

const createElement = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') => {
  const element = document.createElement(tag)
  if (className !== '') {
    element.className = className
  }
  if (text !== '') {
    element.textContent = text
  }
  return element
}

const createButton = (text: string, onClick: () => void, className = 'autoAscendButton') => {
  const button = createElement('button', className, text)
  button.type = 'button'
  button.addEventListener('click', onClick)
  return button
}

const closeSelectMenu = (restoreFocus = false) => {
  if (openSelect === null) {
    return
  }
  const trigger = openSelect
  openSelect = null
  trigger.setAttribute('aria-expanded', 'false')
  const menu = DOMCacheGetOrSet('autoAscendSelectMenu')
  menu.hidden = true
  menu.replaceChildren()
  if (restoreFocus) {
    trigger.focus()
  }
}

const positionSelectMenu = (trigger: HTMLElement, menu: HTMLElement) => {
  const rect = trigger.getBoundingClientRect()
  const below = window.innerHeight - rect.bottom - selectMenuMargin
  const above = rect.top - selectMenuMargin
  const placeAbove = menu.scrollHeight > below && above > below
  menu.style.minWidth = `${rect.width}px`
  menu.style.maxHeight = `${placeAbove ? above : below}px`
  menu.style.left = `${
    Math.max(selectMenuMargin, Math.min(rect.left, window.innerWidth - menu.offsetWidth - selectMenuMargin))
  }px`
  menu.style.top = `${placeAbove ? rect.top - menu.offsetHeight : rect.bottom}px`
}

const openSelectMenu = <T extends string | number>(
  trigger: HTMLButtonElement,
  options: readonly { value: T; label: string }[],
  selected: T | null,
  onPick: (value: T) => void
) => {
  closeSelectMenu()
  const menu = DOMCacheGetOrSet('autoAscendSelectMenu')
  const items = options.map((entry) => {
    const item = createButton(entry.label, () => {
      closeSelectMenu(true)
      onPick(entry.value)
    }, 'autoAscendSelectOption')
    item.tabIndex = -1
    item.setAttribute('role', 'option')
    item.setAttribute('aria-selected', String(entry.value === selected))
    return item
  })
  menu.replaceChildren(...items)
  menu.hidden = false
  openSelect = trigger
  trigger.setAttribute('aria-expanded', 'true')
  positionSelectMenu(trigger, menu)

  const active = items.find((item) => item.getAttribute('aria-selected') === 'true') ?? items[0]
  if (active !== undefined) {
    menu.scrollTop = active.offsetTop - (menu.clientHeight - active.offsetHeight) / 2
    active.focus({ preventScroll: true })
  }
}

const createSelect = <T extends string | number>(
  options: readonly { value: T; label: string }[],
  selected: T | null,
  onChange: (value: T) => void,
  placeholder = ''
) => {
  let current = selected
  const labelOf = (value: T | null) => options.find((entry) => entry.value === value)?.label ?? placeholder
  const open = () =>
    openSelectMenu(trigger, options, current, (value) => {
      current = value
      trigger.textContent = labelOf(value)
      onChange(value)
    })
  const trigger = createButton(labelOf(current), () => {
    if (openSelect === trigger) {
      closeSelectMenu()
    } else {
      open()
    }
  }, 'autoAscendSelect')
  trigger.setAttribute('aria-haspopup', 'listbox')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.addEventListener('keydown', (event) => {
    if (selectMenuSteps[event.key] !== undefined) {
      event.preventDefault()
      open()
    }
  })
  return trigger
}

const createNumberInput = (value: number, integer: boolean, onValid: (value: number) => void, min = 0) => {
  const input = createElement('input', 'autoAscendNumber')
  input.type = 'number'
  input.min = String(min)
  input.step = integer ? '1' : 'any'
  input.value = String(value)
  input.addEventListener('input', () => {
    const parsed = Number(input.value)
    const valid = input.value.trim() !== '' && Number.isFinite(parsed) && parsed >= min
      && (!integer || Number.isInteger(parsed))
    input.classList.toggle('autoAscendInvalid', !valid)
    if (valid) {
      onValid(parsed)
      updatePreview()
    }
  })
  return input
}

const defaultCondition = (key: VariableKey): AutoAscendCondition => {
  if (key === 'cc') {
    return { rule: key, challenge: 10, op: '>=', value: 0 }
  }
  if (key === 'mc') {
    return { rule: key, challenge: 10, value: true }
  }
  if (key === 'stall') {
    return { rule: key, cube: cubeRateKeys[0], tolerance: 0, op: '>=', value: 30 }
  }
  if (isNumberRuleKey(key)) {
    return { rule: key, op: '>=', value: 0 }
  }
  if (isChallengeRuleKey(key)) {
    return { rule: key, op: '=', value: challengeRuleChallenges(key)[0] }
  }
  if (isBooleanRuleKey(key)) {
    return { rule: key, value: true }
  }
  return { rule: 'exalt', value: exaltKeys[0] }
}

const defaultProtocol = (type: ProtocolType): AutoAscendProtocol => {
  switch (type) {
    case 'ascensionChallenge':
      return { type, challenge: 11 }
    case 'corruption':
      return { type, level: 0 }
    case 'corruptionLoadout':
      return { type, slot: 1 }
    case 'corruptionClimb':
    case 'corruptionDowngrade':
      return { type, amount: 1 }
    case 'ascend':
    case 'nextAscensionChallenge':
    case 'corruptionUnlocked':
    case 'corruptionCleared':
    case 'corruptionCleanse':
      return { type }
    default: {
      const unreachable: never = type
      return unreachable
    }
  }
}

const newComparison = (): DraftComparison => ({
  kind: 'comparison',
  condition: { rule: 'cc', challenge: 10, op: '>=', value: 1 }
})

const toDraftNode = (node: AutoAscendExpr): DraftNode =>
  node.type === 'rule'
    ? { kind: 'comparison', condition: { ...node.condition } }
    : { kind: 'group', op: node.type, children: node.children.map(toDraftNode) }

const toDraft = (expr: AutoAscendExpr): DraftGroup => {
  const root = toDraftNode(expr)
  return root.kind === 'group' ? root : { kind: 'group', op: 'and', children: [root] }
}

const toExpr = (node: DraftNode): AutoAscendExpr =>
  node.kind === 'comparison'
    ? { type: 'rule', condition: { ...node.condition } }
    : { type: node.op, children: node.children.map(toExpr) }

const fromDraft = (group: DraftGroup): AutoAscendExpr | null => normalizeExpr(toExpr(group))

const countDraftComparisons = (node: DraftNode): number =>
  node.kind === 'comparison' ? 1 : node.children.reduce((sum, child) => sum + countDraftComparisons(child), 0)

const describeCondition = (condition: AutoAscendCondition) => {
  if (condition.rule === 'exalt') {
    return `${variableName('exalt')}: ${exaltName(condition.value)}`
  }
  if (isChallengeCondition(condition)) {
    return `${variableName(condition.rule)} ${comparatorSymbols[condition.op]} ${challengeName(condition.value)}`
  }
  if (condition.rule === 'cc') {
    return `${completionName(condition.challenge)} ${comparatorSymbols[condition.op]} ${
      format(condition.value, 2, true)
    }`
  }
  if (condition.rule === 'mc') {
    const name = maxedName(condition.challenge)
    return condition.value ? name : `${i18next.t(`${uiKey}.not`)} ${name}`
  }
  if (condition.rule === 'stall') {
    const tolerance = condition.tolerance === 0
      ? ''
      : ` ${i18next.t(`${uiKey}.stallTolerance`, { percent: format(condition.tolerance, 2, true) })}`
    return `${cubeStallName(condition.cube)}${tolerance} ${comparatorSymbols[condition.op]} ${
      format(condition.value, 2, true)
    }`
  }
  if (condition.rule === 'gs') {
    return `${variableName(condition.rule)} ${comparatorSymbols[condition.op]} ${gameStageName(condition.value)}`
  }
  if ('op' in condition) {
    return `${variableName(condition.rule)} ${comparatorSymbols[condition.op]} ${format(condition.value, 2, true)}`
  }
  return condition.value ? variableName(condition.rule) : `${i18next.t(`${uiKey}.not`)} ${variableName(condition.rule)}`
}

const describeExpr = (expr: AutoAscendExpr, parent?: GroupOp): string => {
  switch (expr.type) {
    case 'rule':
      return describeCondition(expr.condition)
    case 'and':
      return expr.children.map((child) => describeExpr(child, 'and')).join(` ${i18next.t(`${uiKey}.and`)} `)
    case 'or': {
      const text = expr.children.map((child) => describeExpr(child, 'or')).join(` ${i18next.t(`${uiKey}.or`)} `)
      return parent === 'and' ? `(${text})` : text
    }
    default: {
      const unreachable: never = expr
      return unreachable
    }
  }
}

const describeProtocol = (protocol: AutoAscendProtocol) => {
  switch (protocol.type) {
    case 'ascensionChallenge':
      return `${protocolName(protocol.type)}: ${challengeName(protocol.challenge)}`
    case 'corruption':
      return `${protocolName(protocol.type)} ${format(protocol.level)}`
    case 'corruptionLoadout':
      return `${protocolName(protocol.type)}: ${loadoutName(protocol.slot)}`
    case 'corruptionClimb':
    case 'corruptionDowngrade':
      return `${protocolName(protocol.type)} ${format(protocol.amount)}`
    case 'ascend':
    case 'nextAscensionChallenge':
    case 'corruptionUnlocked':
    case 'corruptionCleared':
    case 'corruptionCleanse':
      return protocolName(protocol.type)
    default: {
      const unreachable: never = protocol
      return unreachable
    }
  }
}

const describeRule = (rule: AutoAscendRule) => {
  const exception = rule.exception === null
    ? ''
    : ` ${i18next.t(`${uiKey}.unless`)} ${describeExpr(rule.exception)}`
  const loadouts = rule.loadouts.map(({ slot, op, value }) =>
    i18next.t(`${uiKey}.loadoutWrites.${loadoutOpKeys[op]}`, { slot, value: format(value) })
  )
  const modifiers = protocolModifierKeys
    .filter((key) => rule.modifiers[key] !== undefined && isProtocolModifierUnlocked(key))
    .map((key) => `${modifierName(key)}: ${modifierStateName(modifierState(rule.modifiers[key]))}`)
  const ambrosiaLoadout = rule.ambrosiaLoadout !== null && isAmbrosiaLoadoutUnlocked()
    ? [i18next.t(`${uiKey}.ambrosiaLoadoutWrite`, { slot: rule.ambrosiaLoadout })]
    : []
  const extras = [...loadouts, ...modifiers, ...ambrosiaLoadout].join(', ')
  const modifierText = extras === '' ? '' : ` (${extras})`
  return `${i18next.t(`${uiKey}.when`)} ${describeExpr(rule.condition)}${exception} → ${
    describeProtocol(rule.protocol)
  }${modifierText}`
}

const renderComparison = (node: DraftComparison, parent: DraftGroup, rerender: () => void) => {
  const row = createElement('div', 'autoAscendComparison')

  row.append(createSelect(
    ruleVariableKeys.map((key) => ({ value: key, label: variableName(key) })),
    node.condition.rule,
    (key) => {
      node.condition = defaultCondition(key)
      rerender()
    }
  ))

  const condition = node.condition
  const comparatorSelect = (target: { op: Comparator }) =>
    createSelect(
      comparatorKeys.map((op) => ({ value: op, label: comparatorSymbols[op] })),
      target.op,
      (op) => {
        target.op = op
        updatePreview()
      }
    )
  const booleanSelect = (target: { value: boolean }) =>
    createSelect(
      [{ value: 'true', label: i18next.t(`${uiKey}.is`) }, { value: 'false', label: i18next.t(`${uiKey}.isNot`) }],
      target.value ? 'true' : 'false',
      (value) => {
        target.value = value === 'true'
        updatePreview()
      }
    )

  if (condition.rule === 'exalt') {
    row.append(createSelect(
      exaltKeys.map((key) => ({ value: key, label: exaltName(key) })),
      condition.value,
      (key) => {
        condition.value = key
        updatePreview()
      }
    ))
  } else if (isChallengeCondition(condition)) {
    row.append(
      createSelect(
        equalityComparatorKeys.map((op) => ({ value: op, label: comparatorSymbols[op] })),
        condition.op,
        (op) => {
          condition.op = op
          updatePreview()
        }
      ),
      createSelect(
        challengeRuleChallenges(condition.rule).map((challenge) => ({
          value: challenge,
          label: challengeName(challenge)
        })),
        condition.value,
        (challenge) => {
          condition.value = challenge
          updatePreview()
        }
      )
    )
  } else if (condition.rule === 'cc') {
    row.append(
      createSelect(
        completionChallenges.map((challenge) => ({ value: challenge, label: completionName(challenge) })),
        condition.challenge,
        (challenge) => {
          condition.challenge = challenge
          if (challenge !== 15) {
            condition.value = Math.floor(condition.value)
          }
          rerender()
        }
      ),
      comparatorSelect(condition),
      createNumberInput(condition.value, condition.challenge !== 15, (value) => {
        condition.value = value
      })
    )
  } else if (condition.rule === 'mc') {
    row.append(
      createSelect(
        maxedChallenges.map((challenge) => ({ value: challenge, label: numberedChallengeName(challenge) })),
        condition.challenge,
        (challenge) => {
          condition.challenge = challenge
          updatePreview()
        }
      ),
      booleanSelect(condition)
    )
  } else if (condition.rule === 'stall') {
    row.append(
      createSelect(
        cubeRateKeys.map((cube) => ({ value: cube, label: cubeStallName(cube) })),
        condition.cube,
        (cube) => {
          condition.cube = cube
          updatePreview()
        }
      ),
      comparatorSelect(condition),
      createNumberInput(condition.value, false, (value) => {
        condition.value = value
      }),
      createElement('span', '', i18next.t(`${uiKey}.stallToleranceLabel`)),
      createNumberInput(condition.tolerance, false, (tolerance) => {
        condition.tolerance = tolerance
      })
    )
  } else if (condition.rule === 'gs') {
    row.append(
      comparatorSelect(condition),
      createSelect(
        gameStages().map(({ stage }) => ({ value: stage, label: gameStageName(stage) })),
        condition.value,
        (stage) => {
          condition.value = stage
          updatePreview()
        }
      )
    )
  } else if ('op' in condition) {
    row.append(
      comparatorSelect(condition),
      createNumberInput(condition.value, integerNumberRules.has(condition.rule), (value) => {
        condition.value = value
      })
    )
  } else {
    row.append(booleanSelect(condition))
  }

  const remove = createButton('×', () => {
    parent.children.splice(parent.children.indexOf(node), 1)
    rerender()
  }, 'autoAscendButton autoAscendRemove')
  remove.setAttribute('aria-label', i18next.t(`${uiKey}.remove`))
  row.append(remove)

  return row
}

const renderGroup = (
  group: DraftGroup,
  parent: DraftGroup | null,
  root: DraftGroup,
  rerender: () => void
): HTMLElement => {
  const box = createElement('div', parent === null ? 'autoAscendGroup autoAscendRootGroup' : 'autoAscendGroup')
  const atLimit = countDraftComparisons(root) >= maxComparisonsPerExpr

  if (group.children.length > 1 || parent !== null) {
    const header = createElement('div', 'autoAscendGroupHeader')
    header.append(createSelect(
      groupOps.map((op) => ({ value: op, label: i18next.t(`${uiKey}.group.${op}`) })),
      group.op,
      (op) => {
        group.op = op
        updatePreview()
      }
    ))
    if (parent !== null) {
      header.append(createButton(i18next.t(`${uiKey}.removeGroup`), () => {
        parent.children.splice(parent.children.indexOf(group), 1)
        rerender()
      }))
    }
    box.append(header)
  }

  for (const child of group.children) {
    box.append(
      child.kind === 'comparison'
        ? renderComparison(child, group, rerender)
        : renderGroup(child, group, root, rerender)
    )
  }

  const footer = createElement('div', 'autoAscendGroupFooter')
  const addComparison = createButton(i18next.t(`${uiKey}.addComparison`), () => {
    group.children.push(newComparison())
    rerender()
  })
  const addGroup = createButton(i18next.t(`${uiKey}.addGroup`), () => {
    group.children.push({ kind: 'group', op: group.op === 'and' ? 'or' : 'and', children: [newComparison()] })
    rerender()
  })
  addComparison.disabled = atLimit
  addGroup.disabled = atLimit
  footer.append(addComparison, addGroup)
  box.append(footer)

  return box
}

const renderExprEditor = (containerId: string, root: DraftGroup) => {
  const container = DOMCacheGetOrSet(containerId)
  const rerender = () => {
    renderExprEditor(containerId, root)
    updatePreview()
  }
  const count = createElement(
    'p',
    'autoAscendCount',
    i18next.t(`${uiKey}.comparisonCount`, { count: countDraftComparisons(root), max: maxComparisonsPerExpr })
  )
  container.replaceChildren(renderGroup(root, null, root, rerender), count)
}

const renderProtocolEditor = () => {
  if (draft === null) {
    return
  }
  const currentDraft = draft
  const container = DOMCacheGetOrSet('autoAscendProtocolEditor')
  const row = createElement('div', 'autoAscendComparison')

  row.append(createSelect(
    protocolTypes.map((type) => ({ value: type, label: protocolName(type) })),
    currentDraft.protocol?.type ?? null,
    (type) => {
      currentDraft.protocol = defaultProtocol(type)
      renderProtocolEditor()
      updatePreview()
    },
    i18next.t(`${uiKey}.protocols.choose`)
  ))

  const protocol = currentDraft.protocol
  if (protocol?.type === 'ascensionChallenge') {
    row.append(createSelect(
      ascensionChallenges.map((challenge) => ({ value: challenge, label: challengeName(challenge) })),
      protocol.challenge,
      (challenge) => {
        protocol.challenge = challenge
        updatePreview()
      }
    ))
  } else if (protocol?.type === 'corruption') {
    row.append(createNumberInput(protocol.level, true, (level) => {
      protocol.level = level
    }))
  } else if (protocol?.type === 'corruptionLoadout') {
    row.append(createSelect(loadoutSlotOptions(corruptionLoadoutSlots), protocol.slot, (slot) => {
      protocol.slot = slot
      updatePreview()
    }))
  } else if (protocol?.type === 'corruptionClimb' || protocol?.type === 'corruptionDowngrade') {
    row.append(createNumberInput(protocol.amount, true, (amount) => {
      protocol.amount = amount
    }, 1))
  }

  const rerenderProtocol = () => {
    renderProtocolEditor()
    updatePreview()
  }
  const usedSlots = new Set(currentDraft.loadouts.map((write) => write.slot))
  const loadoutRows = currentDraft.loadouts.map((write) => {
    const loadoutRow = createElement('div', 'autoAscendComparison')
    const remove = createButton('×', () => {
      currentDraft.loadouts.splice(currentDraft.loadouts.indexOf(write), 1)
      rerenderProtocol()
    }, 'autoAscendButton autoAscendRemove')
    remove.setAttribute('aria-label', i18next.t(`${uiKey}.remove`))
    loadoutRow.append(
      createSelect(
        loadoutSlotOptions(corruptionLoadoutSlots.filter((slot) => slot === write.slot || !usedSlots.has(slot))),
        write.slot,
        (slot) => {
          write.slot = slot
          rerenderProtocol()
        }
      ),
      createSelect(
        loadoutOps.map((op) => ({ value: op, label: i18next.t(`${uiKey}.loadoutOps.${loadoutOpKeys[op]}`) })),
        write.op,
        (op) => {
          write.op = op
          write.value = Math.max(write.value, loadoutOpMinimum(op))
          rerenderProtocol()
        }
      ),
      createNumberInput(write.value, true, (value) => {
        write.value = value
      }, loadoutOpMinimum(write.op)),
      remove
    )
    return loadoutRow
  })
  const addLoadout = createButton(i18next.t(`${uiKey}.addLoadout`), () => {
    const slot = corruptionLoadoutSlots.find((candidate) => !usedSlots.has(candidate))
    if (slot !== undefined) {
      currentDraft.loadouts.push({ slot, op: '=', value: 0 })
      rerenderProtocol()
    }
  })
  addLoadout.disabled = usedSlots.size >= corruptionLoadoutCount

  const modifierRows = protocolModifierKeys.filter(isProtocolModifierUnlocked).map((key) => {
    const modifierRow = createElement('label', 'autoAscendComparison autoAscendModifier')
    modifierRow.append(
      createElement('span', '', modifierName(key)),
      createSelect(
        modifierStates.map((state) => ({ value: state, label: modifierStateName(state) })),
        modifierState(currentDraft.modifiers[key]),
        (state) => {
          currentDraft.modifiers[key] = state === 'keep' ? undefined : state === 'enable'
          updatePreview()
        }
      )
    )
    return modifierRow
  })

  if (isAmbrosiaLoadoutUnlocked()) {
    const ambrosiaRow = createElement('label', 'autoAscendComparison autoAscendModifier')
    const slotCount = Math.max(getUnlockedBlueberryLoadoutCount(), currentDraft.ambrosiaLoadout ?? 0)
    ambrosiaRow.append(
      createElement('span', '', i18next.t(`${uiKey}.ambrosiaLoadout`)),
      createSelect(
        [
          { value: 0, label: modifierStateName('keep') },
          ...Array.from({ length: slotCount }, (_, i) => ({ value: i + 1, label: ambrosiaLoadoutName(i + 1) }))
        ],
        currentDraft.ambrosiaLoadout ?? 0,
        (slot) => {
          currentDraft.ambrosiaLoadout = slot === 0 ? null : slot
          updatePreview()
        }
      )
    )
    modifierRows.push(ambrosiaRow)
  }

  container.replaceChildren(
    row,
    createElement('p', 'autoAscendHelp', i18next.t(`${uiKey}.loadoutsHelp`)),
    ...loadoutRows,
    addLoadout
  )
  if (modifierRows.length > 0) {
    container.append(createElement('p', 'autoAscendHelp', i18next.t(`${uiKey}.modifiersHelp`)), ...modifierRows)
  }
}

const buildDraftRule = (): AutoAscendRule | null => {
  if (draft === null || draft.protocol === null) {
    return null
  }
  const condition = fromDraft(draft.condition)
  if (condition === null) {
    return null
  }
  return {
    name: draft.name.trim(),
    condition,
    exception: fromDraft(draft.exception),
    protocol: draft.protocol,
    modifiers: { ...draft.modifiers },
    loadouts: draft.loadouts.map((write) => ({ ...write })),
    ambrosiaLoadout: draft.ambrosiaLoadout,
    disabled: draft.disabled
  }
}

const updatePreview = () => {
  const rule = buildDraftRule()
  DOMCacheGetOrSet('autoAscendRulePreview').textContent = rule === null
    ? i18next.t(`${uiKey}.previewIncomplete`)
    : describeRule(rule)
  const ruleText = DOMCacheGetOrSet('autoAscendRuleText') as HTMLInputElement
  if (document.activeElement !== ruleText) {
    ruleText.value = rule === null ? '' : printRule(rule)
    DOMCacheGetOrSet('autoAscendRuleTextError').textContent = ''
  }
  DOMCacheGetOrSet('autoAscendRuleError').textContent = ''
}

const renderEditor = () => {
  if (draft === null) {
    return
  }
  DOMCacheGetOrSet('autoAscendRuleEditorTitle').textContent = draft.index === null
    ? i18next.t(`${uiKey}.newTitle`)
    : i18next.t(`${uiKey}.editTitle`, { number: draft.index + 1 })
  renderExprEditor('autoAscendConditionEditor', draft.condition)
  renderProtocolEditor()
  renderExprEditor('autoAscendExceptionEditor', draft.exception)
  updatePreview()
}

const draftFromRule = (index: number | null, rule: AutoAscendRule | undefined): RuleDraft => ({
  index,
  name: rule?.name ?? '',
  condition: rule === undefined ? { kind: 'group', op: 'and', children: [newComparison()] } : toDraft(rule.condition),
  exception: rule?.exception ? toDraft(rule.exception) : { kind: 'group', op: 'and', children: [] },
  protocol: rule === undefined ? null : { ...rule.protocol },
  modifiers: rule === undefined ? {} : { ...rule.modifiers },
  loadouts: rule === undefined ? [] : rule.loadouts.map((write) => ({ ...write })),
  ambrosiaLoadout: rule?.ambrosiaLoadout ?? null,
  disabled: rule?.disabled ?? false
})

const parseErrorMessage = (error: RuleParseError, line: number) =>
  i18next.t(`${errorKey}.${error.code}`, { line, column: error.column + 1 })

const applyRuleText = (text: string) => {
  if (draft === null) {
    return
  }
  const errorElement = DOMCacheGetOrSet('autoAscendRuleTextError')
  if (text.trim() === '') {
    errorElement.textContent = ''
    return
  }
  try {
    draft = draftFromRule(draft.index, parseRule(text.trim()))
  } catch (error) {
    if (!(error instanceof RuleParseError)) {
      throw error
    }
    errorElement.textContent = parseErrorMessage(error, 1)
    return
  }
  errorElement.textContent = ''
  ;(DOMCacheGetOrSet('autoAscendRuleName') as HTMLInputElement).value = draft.name
  renderEditor()
}

const openEditor = (index: number | null) => {
  draft = draftFromRule(index, index === null ? undefined : player.autoAscendRules[index])
  const nameInput = DOMCacheGetOrSet('autoAscendRuleName') as HTMLInputElement
  nameInput.value = draft.name
  nameInput.placeholder = i18next.t(`${uiKey}.namePlaceholder`, {
    number: (index ?? player.autoAscendRules.length) + 1
  })
  renderEditor()
  const dialog = DOMCacheGetOrSet('autoAscendRuleEditor')
  dialog.hidden = false
  dialog.focus()
}

const closeEditor = () => {
  closeSelectMenu()
  draft = null
  DOMCacheGetOrSet('autoAscendRuleEditor').hidden = true
  DOMCacheGetOrSet('autoAscendAddRule').focus()
}

const showEditorError = (key: string) => {
  DOMCacheGetOrSet('autoAscendRuleError').textContent = i18next.t(`${uiKey}.errors.${key}`)
}

const saveDraft = () => {
  if (draft === null) {
    return
  }
  if (DOMCacheGetOrSet('autoAscendRuleEditor').querySelector('.autoAscendInvalid') !== null) {
    return showEditorError('invalidNumber')
  }
  if (draft.name.trim().length > maxRuleNameLength) {
    return showEditorError('nameTooLong')
  }
  if (fromDraft(draft.condition) === null) {
    return showEditorError('emptyCondition')
  }
  const rule = buildDraftRule()
  if (rule === null) {
    return showEditorError('noProtocol')
  }

  if (draft.index === null) {
    if (player.autoAscendRules.length >= getAutoAscendRuleSlots()) {
      return showEditorError('noSlots')
    }
    player.autoAscendRules.push(rule)
  } else {
    player.autoAscendRules[draft.index] = rule
  }

  closeEditor()
  renderAutoAscendRules()
}

const moveRule = (index: number, delta: number) => {
  const target = index + delta
  if (target < 0 || target >= player.autoAscendRules.length) {
    return
  }
  player.autoAscendRules.splice(target, 0, ...player.autoAscendRules.splice(index, 1))
  renderAutoAscendRules()
}

const toggleRule = (index: number) => {
  player.autoAscendRules[index].disabled = !player.autoAscendRules[index].disabled
  CloseModal()
  renderAutoAscendRules()
}

const deleteRule = (index: number) => {
  player.autoAscendRules.splice(index, 1)
  renderAutoAscendRules()
}

const ruleDisplayName = (rule: AutoAscendRule, index: number) =>
  rule.name === '' ? i18next.t(`${uiKey}.namePlaceholder`, { number: index + 1 }) : rule.name

const registerRuleModal = (element: HTMLElement, rule: AutoAscendRule, index: number) => {
  const html = () =>
    `<div class="autoAscendRuleModal"><p class="autoAscendRuleModalName">${
      escapeHTML(ruleDisplayName(rule, index))
    }</p><p>${escapeHTML(describeRule(rule))}</p><p class="autoAscendRuleModalHint">${
      i18next.t(`${uiKey}.${rule.disabled ? 'enableHint' : 'disableHint'}`)
    }</p></div>`

  if (isMobile) {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
      Modal(html, event.clientX, event.clientY, { borderColor: 'orange' }, MEDIUM_MODAL_UPDATE_TICK, element)
    })
    return
  }

  element.addEventListener('mousemove', (event) => {
    Modal(html, event.clientX, event.clientY, { borderColor: 'orange' }, MEDIUM_MODAL_UPDATE_TICK, element)
  })
  element.addEventListener('mouseout', CloseModal)
}

const renderRuleItem = (rule: AutoAscendRule, index: number, total: number) => {
  const item = createElement('li', rule.disabled ? 'autoAscendRuleItem autoAscendRuleDisabled' : 'autoAscendRuleItem')
  item.addEventListener('click', () => toggleRule(index))
  const name = createElement('span', 'autoAscendRuleName', ruleDisplayName(rule, index))
  name.setAttribute('aria-description', describeRule(rule))
  registerRuleModal(name, rule, index)
  const state = createElement(
    'button',
    'autoAscendRuleState',
    i18next.t(`${uiKey}.${rule.disabled ? 'ruleOff' : 'ruleOn'}`)
  )
  state.type = 'button'
  state.setAttribute('aria-pressed', String(!rule.disabled))
  state.setAttribute('aria-label', ruleDisplayName(rule, index))
  item.append(createElement('span', 'autoAscendRuleNumber', `${index + 1}.`), state, name)

  const actions = createElement('span', 'autoAscendRuleActions')
  actions.addEventListener('click', (event) => event.stopPropagation())
  const up = createButton('↑', () => moveRule(index, -1))
  const down = createButton('↓', () => moveRule(index, 1))
  up.disabled = index === 0
  down.disabled = index === total - 1
  up.setAttribute('aria-label', i18next.t(`${uiKey}.moveUp`))
  down.setAttribute('aria-label', i18next.t(`${uiKey}.moveDown`))
  actions.append(
    up,
    down,
    createButton(i18next.t(`${uiKey}.edit`), () => openEditor(index)),
    createButton(i18next.t(`${uiKey}.delete`), () => deleteRule(index), 'autoAscendButton autoAscendRemove')
  )
  item.append(actions)

  return item
}

export const pulseAutoAscendRule = (index: number) => {
  lastFiredRule = { rule: player.autoAscendRules[index], index }

  if (rulePulse !== null) {
    clearTimeout(rulePulse.timeout)
    rulePulse.element.classList.remove('autoAscendRuleFired')
    rulePulse = null
  }

  const element = DOMCacheGetOrSet('autoAscendRuleList').children.item(index)
  if (element === null) {
    return
  }

  void element.getBoundingClientRect()
  element.classList.add('autoAscendRuleFired')
  rulePulse = {
    element,
    timeout: setTimeout(() => {
      element.classList.remove('autoAscendRuleFired')
      rulePulse = null
    }, rulePulseDuration)
  }
}

export const updateAutoAscendStatus = () => {
  DOMCacheGetOrSet('autoAscendRequiresC10').hidden = player.unlocks.ascensions
  DOMCacheGetOrSet('autoAscendStatusCorruption').textContent = `${format(activeCorruptionLevel())} / ${
    format(maxCorruptionLevel())
  }`
  DOMCacheGetOrSet('autoAscendStatusC10').textContent = `${format(player.challengecompletions[10])} / ${
    format(getMaxChallenges(10))
  }`
  const challenge = player.currentChallenge.ascension
  const challengeElement = DOMCacheGetOrSet('autoAscendStatusChallenge')
  challengeElement.textContent = challenge === 0 ? i18next.t('corruptions.autoAscend.status.none') : `C${challenge}`
  challengeElement.title = challenge === 0 ? '' : challengeName(challenge)
  DOMCacheGetOrSet('autoAscendStatusTime').textContent = formatTimeShort(player.ascensionCounter, 0)
  DOMCacheGetOrSet('autoAscendStatusTimeReal').textContent = formatTimeShort(player.ascensionCounterRealReal, 0)
  const lastFiredElement = DOMCacheGetOrSet('autoAscendStatusLastFired')
  lastFiredElement.textContent = lastFiredRule === null
    ? i18next.t('corruptions.autoAscend.status.none')
    : ruleDisplayName(lastFiredRule.rule, lastFiredRule.index)
  lastFiredElement.title = lastFiredRule === null ? '' : describeRule(lastFiredRule.rule)
  updateCorruptionLoadouts()
}

const loadoutInput = (slot: number) => DOMCacheGetOrSet(`corruptionLoadoutInput${slot}`) as HTMLInputElement

export const updateCorruptionLoadouts = () => {
  if (DOMCacheGetOrSet('corruptionLoadoutList').childElementCount === 0) {
    return
  }
  for (const slot of corruptionLoadoutSlots) {
    const input = loadoutInput(slot)
    if (document.activeElement !== input) {
      input.value = String(player.corruptions.loadouts[slot - 1])
      input.classList.remove('autoAscendInvalid')
    }
  }
}

const createLoadoutRow = (slot: number) => {
  const row = createElement('label', 'corruptionLoadoutRow')
  const input = createElement('input', 'autoAscendNumber')
  input.id = `corruptionLoadoutInput${slot}`
  input.type = 'number'
  input.min = '0'
  input.step = '1'
  input.addEventListener('input', () => {
    const level = Number(input.value)
    const valid = input.value.trim() !== '' && Number.isInteger(level) && level >= 0
    input.classList.toggle('autoAscendInvalid', !valid)
    if (valid) {
      player.corruptions.loadouts[slot - 1] = level
    }
  })
  input.addEventListener('blur', updateCorruptionLoadouts)
  row.append(
    createElement('span', 'corruptionLoadoutName', loadoutName(slot)),
    createElement('code', 'corruptionLoadoutId', `s${slot}`),
    input
  )
  return row
}

export const renderAutoAscendRules = () => {
  const rules = player.autoAscendRules
  const slots = getAutoAscendRuleSlots()

  DOMCacheGetOrSet('autoAscendRuleSlots').textContent = i18next.t(`${uiKey}.slots`, {
    count: rules.length,
    max: slots
  })
  DOMCacheGetOrSet('autoAscendRulesEmpty').hidden = rules.length > 0
  DOMCacheGetOrSet('autoAscendRuleList').replaceChildren(
    ...rules.map((rule, index) => renderRuleItem(rule, index, rules.length))
  )
  DOMCacheGetOrSet('autoAscendAddRule').toggleAttribute('disabled', rules.length >= slots)
  updateCorruptionLoadouts()
}

export const autoAscendRulesUICreate = () => {
  const dialog = DOMCacheGetOrSet('autoAscendRuleEditor')
  const selectMenu = DOMCacheGetOrSet('autoAscendSelectMenu')
  dialog.addEventListener('keydown', (event) => {
    event.stopPropagation()
    if (event.key === 'Escape') {
      if (openSelect === null) {
        closeEditor()
      } else {
        closeSelectMenu(true)
      }
    }
  })
  dialog.addEventListener('click', (event) => {
    const target = event.target as Node
    if (openSelect !== null && !openSelect.contains(target) && !selectMenu.contains(target)) {
      closeSelectMenu()
    }
  })
  dialog.addEventListener('scroll', (event) => {
    if (event.target !== selectMenu) {
      closeSelectMenu()
    }
  }, true)
  window.addEventListener('resize', () => closeSelectMenu())
  selectMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      closeSelectMenu(true)
      return
    }
    const step = selectMenuSteps[event.key]
    if (step === undefined) {
      return
    }
    event.preventDefault()
    const items = Array.from(selectMenu.children) as HTMLElement[]
    const index = items.indexOf(document.activeElement as HTMLElement)
    items[(index + step + items.length) % items.length]?.focus()
  })
  DOMCacheGetOrSet('autoAscendRuleName').addEventListener('input', (event) => {
    if (draft !== null) {
      draft.name = (event.target as HTMLInputElement).value
      updatePreview()
    }
  })
  DOMCacheGetOrSet('autoAscendRuleText').addEventListener('input', (event) => {
    applyRuleText((event.target as HTMLInputElement).value)
  })
  DOMCacheGetOrSet('autoAscendRuleCopy').addEventListener('click', () => void copyDraftRule())
  DOMCacheGetOrSet('autoAscendRulePaste').addEventListener('click', () => void pasteDraftRule())
  DOMCacheGetOrSet('autoAscendPaletteCopy').addEventListener('click', () => void exportRulePalette(false))
  DOMCacheGetOrSet('autoAscendPaletteExportFile').addEventListener('click', () => void exportRulePalette(true))
  DOMCacheGetOrSet('autoAscendPalettePaste').addEventListener('click', () => void importRulePaletteFromClipboard())
  const fileInput = DOMCacheGetOrSet('autoAscendPaletteFile') as HTMLInputElement
  DOMCacheGetOrSet('autoAscendPaletteImportFile').addEventListener('click', () => fileInput.click())
  fileInput.addEventListener('change', () => void importRulePaletteFromFile(fileInput))
  DOMCacheGetOrSet('autoAscendAddRule').addEventListener('click', () => openEditor(null))
  DOMCacheGetOrSet('autoAscendRuleEditorClose').addEventListener('click', closeEditor)
  DOMCacheGetOrSet('autoAscendRuleCancel').addEventListener('click', closeEditor)
  DOMCacheGetOrSet('autoAscendRuleSave').addEventListener('click', saveDraft)
  DOMCacheGetOrSet('corruptionLoadoutList').replaceChildren(...corruptionLoadoutSlots.map(createLoadoutRow))
  renderAutoAscendRules()
}

const writeClipboard = async (text: string) => {
  if (PLATFORM === 'mobile') {
    const { exportMobileData } = await import('./mobile/export')
    await exportMobileData(text, paletteFileName, true)
    return
  }
  await navigator.clipboard.writeText(text)
}

const readClipboard = async () => {
  if (PLATFORM === 'mobile') {
    const { readMobileClipboard } = await import('./mobile/export')
    return readMobileClipboard()
  }
  return navigator.clipboard.readText()
}

const saveTextFile = async (text: string, fileName: string) => {
  if (PLATFORM === 'mobile') {
    const { exportMobileData } = await import('./mobile/export')
    await exportMobileData(text, fileName, false)
    return
  }
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const link = createElement('a')
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

const copyDraftRule = async () => {
  const rule = buildDraftRule()
  if (rule === null) {
    return showEditorError('incompleteRule')
  }
  try {
    await writeClipboard(printRule(rule))
    void Notification(i18next.t(`${uiKey}.ruleCopied`), 5000)
  } catch {
    showEditorError('copyFailed')
  }
}

const pasteDraftRule = async () => {
  let text: string
  try {
    text = await readClipboard()
  } catch {
    return showEditorError('pasteFailed')
  }
  ;(DOMCacheGetOrSet('autoAscendRuleText') as HTMLInputElement).value = text.trim()
  applyRuleText(text)
}

const importRulePalette = async (text: string) => {
  let rules: AutoAscendRule[]
  try {
    rules = parseRules(text)
  } catch (error) {
    if (!(error instanceof RuleParseError)) {
      throw error
    }
    return Alert(parseErrorMessage(error, error.line))
  }
  if (rules.length === 0) {
    return Alert(i18next.t(`${uiKey}.palette.empty`))
  }

  const slots = getAutoAscendRuleSlots()
  const imported = rules.slice(0, slots)
  if (player.autoAscendRules.length > 0) {
    const confirmed = await Confirm(i18next.t(`${uiKey}.palette.confirm`, { count: imported.length }))
    if (!confirmed) {
      return
    }
  }

  player.autoAscendRules = [...imported, ...player.autoAscendRules.slice(imported.length)].slice(0, slots)
  renderAutoAscendRules()
  await Alert(i18next.t(rules.length > slots ? `${uiKey}.palette.importedAbridged` : `${uiKey}.palette.imported`, {
    count: imported.length,
    dropped: rules.length - imported.length,
    slots
  }))
}

const importRulePaletteFromClipboard = async () => {
  let text: string
  try {
    text = await readClipboard()
  } catch {
    return Alert(i18next.t(`${uiKey}.palette.pasteFailed`))
  }
  await importRulePalette(text)
}

const importRulePaletteFromFile = async (input: HTMLInputElement) => {
  const file = input.files?.[0]
  if (file === undefined) {
    return
  }
  const text = await readFileAsText(file)
  input.value = ''
  await importRulePalette(text)
}

const exportRulePalette = async (toFile: boolean) => {
  if (player.autoAscendRules.length === 0) {
    return Alert(i18next.t(`${uiKey}.palette.nothingToExport`))
  }
  const text = printRules(player.autoAscendRules)
  try {
    if (toFile) {
      await saveTextFile(text, paletteFileName)
    } else {
      await writeClipboard(text)
    }
    void Notification(i18next.t(`${uiKey}.palette.${toFile ? 'exportedFile' : 'copied'}`), 5000)
  } catch {
    await Alert(i18next.t(`${uiKey}.palette.${toFile ? 'exportFileFailed' : 'copyFailed'}`))
  }
}
