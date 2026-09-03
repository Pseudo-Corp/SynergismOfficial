import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { registerPurpleReactorAPContribution } from './Purple'
import { getPurpleReactorPopupMode } from './PurpleUpgradeTab'
import { format, player } from './Synergism'
import { addTimers } from './Helper'

export const SYNTHESIS_RED_AMBROSIA_COST = 2_500
export const SYNTHESIS_PURPLE_HONEY_COST = 500
export const SYNTHESIS_AUTOMATION_COST = 200

const SYNTHESIS_PURPLE_AMBROSIA_YIELD = 1
const SYNTHESIS_RESOURCE_TOLERANCE = 1e-7

export const synthesisUpgradeNames = [
  'redAmbrosiaReduction',
  'purpleHoneyReduction',
  'subatomicShavings',
  'exceptionalLieGroup'
] as const

export type SynthesisUpgradeName = (typeof synthesisUpgradeNames)[number]
type SynthesisUpgradeInvestmentByName = {
  redAmbrosiaReduction: {
    purpleAmbrosia: number
    redAmbrosia: number
  }
  purpleHoneyReduction: {
    purpleAmbrosia: number
    purpleHoney: number
  }
  subatomicShavings: {
    purpleAmbrosia: number
    quarks: number
  }
  exceptionalLieGroup: {
    purpleAmbrosia: number
    octeracts: number
  }
}
export type SynthesisUpgradeInvestment<K extends SynthesisUpgradeName = SynthesisUpgradeName> =
  SynthesisUpgradeInvestmentByName[K]
export type SynthesisUpgrades = {
  [K in SynthesisUpgradeName]: SynthesisUpgradeInvestment<K>
}
export type SynthesisCraftAmount = 1 | 10 | 100 | 1000 | 'max'
export type SynthesisUpgradePurchaseAmount = 1 | 10 | 100 | 'max'

type SynthesisUpgradeDefinition<K extends SynthesisUpgradeName> = {
  maxLevel: number
  cumulativeCost: (level: number) => SynthesisUpgradeInvestment<K>
  effect: (level: number) => number
  notMaxedEffectsDescription: (level: number) => string
  maxedEffectsDescription: (level: number) => string
  apValue: {
    apPerInterval: number
    levelsPerAP: number
  }
}

type SynthesisUpgradeDefinitions = {
  [K in SynthesisUpgradeName]: SynthesisUpgradeDefinition<K>
}

type SynthesisUpgradeCard = {
  level: HTMLElement
  effect: HTMLElement
  nextCost: HTMLElement
  ap: HTMLElement
  purchaseButtons: HTMLElement
  buttons: Map<SynthesisUpgradePurchaseAmount, HTMLButtonElement>
}

export const createBlankSynthesisUpgradeObject = (): SynthesisUpgrades => ({
  redAmbrosiaReduction: {
    purpleAmbrosia: 0,
    redAmbrosia: 0
  },
  purpleHoneyReduction: {
    purpleAmbrosia: 0,
    purpleHoney: 0
  },
  subatomicShavings: {
    purpleAmbrosia: 0,
    quarks: 0
  },
  exceptionalLieGroup: {
    purpleAmbrosia: 0,
    octeracts: 0
  }
})

export const blankSynthesisUpgradeObject = createBlankSynthesisUpgradeObject()

const synthesisUpgradeData: SynthesisUpgradeDefinitions = {
  redAmbrosiaReduction: {
    maxLevel: 500,
    cumulativeCost: (level) => ({
      purpleAmbrosia: level,
      redAmbrosia: 1_250 * level
    }),
    effect: (level) => level,
    notMaxedEffectsDescription: (level) =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.redAmbrosiaReduction.effectNotMaxed',
        {
          current: format(SYNTHESIS_RED_AMBROSIA_COST - level, 0, true),
          next: format(SYNTHESIS_RED_AMBROSIA_COST - level - 1, 0, true)
        }
      ),
    maxedEffectsDescription: () =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.redAmbrosiaReduction.effectMaxed',
        { value: format(SYNTHESIS_RED_AMBROSIA_COST - 500, 0, true) }
      ),
    apValue: {
      apPerInterval: 5,
      levelsPerAP: 50
    }
  },
  purpleHoneyReduction: {
    maxLevel: 100,
    cumulativeCost: (level) => ({
      purpleAmbrosia: 5 * level,
      purpleHoney: 2_500 * level
    }),
    effect: (level) => level,
    notMaxedEffectsDescription: (level) =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.purpleHoneyReduction.effectNotMaxed',
        {
          current: format(SYNTHESIS_PURPLE_HONEY_COST - level, 0, true),
          next: format(SYNTHESIS_PURPLE_HONEY_COST - level - 1, 0, true)
        }
      ),
    maxedEffectsDescription: () =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.purpleHoneyReduction.effectMaxed',
        { value: format(SYNTHESIS_PURPLE_HONEY_COST - 100, 0, true) }
      ),
    apValue: {
      apPerInterval: 5,
      levelsPerAP: 10
    }
  },
  subatomicShavings: {
    maxLevel: 100,
    cumulativeCost: (level) => ({
      purpleAmbrosia: 20 * level,
      quarks: 1e26 * level
    }),
    effect: (level) => level,
    notMaxedEffectsDescription: (level) =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.subatomicShavings.effectNotMaxed',
        { current: format(level, 0, true), next: format(level + 1, 0, true) }
      ),
    maxedEffectsDescription: (level) =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.subatomicShavings.effectMaxed',
        { value: format(level, 0, true) }
      ),
    apValue: {
      apPerInterval: 5,
      levelsPerAP: 10
    }
  },
  exceptionalLieGroup: {
    maxLevel: 30,
    cumulativeCost: (level) => ({
      purpleAmbrosia: 100 * level,
      octeracts: level === 0 ? 0 : 1e130 * (10 ** level - 1) / 9
    }),
    effect: (level) => level,
    notMaxedEffectsDescription: (level) =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.exceptionalLieGroup.effectNotMaxed',
        { current: format(level, 0, true), next: format(level + 1, 0, true) }
      ),
    maxedEffectsDescription: (level) =>
      i18next.t(
        'purpleReactor.synthesis.upgrades.exceptionalLieGroup.effectMaxed',
        { value: format(level, 0, true) }
      ),
    apValue: {
      apPerInterval: 5,
      levelsPerAP: 3
    }
  }
}

export const synthesisCraftButtons = [
  { id: 'synthesisCraftOne', amount: 1 },
  { id: 'synthesisCraftTen', amount: 10 },
  { id: 'synthesisCraftHundred', amount: 100 },
  { id: 'synthesisCraftThousand', amount: 1000 },
  { id: 'synthesisCraftMax', amount: 'max' }
] as const satisfies readonly { id: string; amount: SynthesisCraftAmount }[]

const synthesisCraftButtonRows = ['synthesisCraftButtonsPrimary', 'synthesisCraftButtonsSecondary'] as const
export const synthesisUpgradePurchaseAmounts = [1, 10, 100, 'max'] as const satisfies readonly SynthesisUpgradePurchaseAmount[]
const synthesisUpgradeElementIDPrefixes = {
  redAmbrosiaReduction: 'synthesisRedAmbrosiaReduction',
  purpleHoneyReduction: 'synthesisPurpleHoneyReduction',
  subatomicShavings: 'synthesisSubatomicShavings',
  exceptionalLieGroup: 'synthesisExceptionalLieGroup'
} as const satisfies Record<SynthesisUpgradeName, string>
const synthesisUpgradePurchaseButtonIDSuffixes = {
  1: 'BuyOne',
  10: 'BuyTen',
  100: 'BuyHundred',
  max: 'BuyMax'
} as const satisfies Record<SynthesisUpgradePurchaseAmount, string>
const synthesisUpgradeCards = new Map<SynthesisUpgradeName, SynthesisUpgradeCard>()

export const getSynthesisUpgradePurchaseButtonID = (
  upgradeKey: SynthesisUpgradeName,
  amount: SynthesisUpgradePurchaseAmount
) => `${synthesisUpgradeElementIDPrefixes[upgradeKey]}${synthesisUpgradePurchaseButtonIDSuffixes[amount]}`

let lastSynthesisCraftButtonLayout = ''

type SynthesisUpgradeResource = 'purpleAmbrosia' | 'redAmbrosia' | 'purpleHoney' | 'quarks' | 'octeracts'
type SynthesisUpgradeWallet = Record<SynthesisUpgradeResource, number>

const getAffordableSynthesisAmount = (resource: number, cost: number) => {
  const exactAmount = resource / cost
  if (!Number.isFinite(exactAmount)) {
    return 0
  }

  return Math.max(0, Math.floor(exactAmount + SYNTHESIS_RESOURCE_TOLERANCE / cost))
}

const getSynthesisUpgradeWallet = (): SynthesisUpgradeWallet => ({
  purpleAmbrosia: player.purpleAmbrosia,
  redAmbrosia: player.redAmbrosia,
  purpleHoney: player.purpleReactor.purpleHoney,
  quarks: Number(player.worlds),
  octeracts: player.wowOcteracts
})

const getSynthesisUpgradeInvestmentEntries = <K extends SynthesisUpgradeName>(
  investment: SynthesisUpgradeInvestment<K>
): [SynthesisUpgradeResource, number][] => Object.entries(investment) as [SynthesisUpgradeResource, number][]

const getSynthesisUpgradeInvestmentValue = (
  investment: SynthesisUpgradeInvestment | SynthesisUpgradeWallet,
  resource: SynthesisUpgradeResource
) => (investment as Partial<SynthesisUpgradeWallet>)[resource] ?? 0

const addSynthesisUpgradeCosts = <K extends SynthesisUpgradeName>(
  first: SynthesisUpgradeInvestment<K>,
  second: SynthesisUpgradeInvestment<K>
): SynthesisUpgradeInvestment<K> => {
  return Object.fromEntries(
    getSynthesisUpgradeInvestmentEntries(first).map(([resource, amount]) => [
      resource,
      amount + getSynthesisUpgradeInvestmentValue(second, resource)
    ])
  ) as SynthesisUpgradeInvestment<K>
}

const addSynthesisUpgradeInvestmentToWallet = <K extends SynthesisUpgradeName>(
  wallet: SynthesisUpgradeWallet,
  investment: SynthesisUpgradeInvestment<K>
): SynthesisUpgradeWallet => {
  const result = { ...wallet }
  for (const [resource, amount] of getSynthesisUpgradeInvestmentEntries(investment)) {
    result[resource] += amount
  }
  return result
}

const subtractSynthesisUpgradeCosts = <K extends SynthesisUpgradeName>(
  first: SynthesisUpgradeInvestment<K>,
  second: SynthesisUpgradeInvestment<K>
): SynthesisUpgradeInvestment<K> => {
  return Object.fromEntries(
    getSynthesisUpgradeInvestmentEntries(first).map(([resource, amount]) => [
      resource,
      Math.max(0, amount - getSynthesisUpgradeInvestmentValue(second, resource))
    ])
  ) as SynthesisUpgradeInvestment<K>
}

const getSynthesisUpgradeAPAtLevel = (
  upgrade: SynthesisUpgradeDefinition<SynthesisUpgradeName>,
  level: number
) => Math.floor(level / upgrade.apValue.levelsPerAP) * upgrade.apValue.apPerInterval

const isSynthesisUpgradeCostAffordable = <K extends SynthesisUpgradeName>(
  cost: SynthesisUpgradeInvestment<K>,
  wallet: SynthesisUpgradeWallet | SynthesisUpgradeInvestment<K> = getSynthesisUpgradeWallet()
) => {
  return getSynthesisUpgradeInvestmentEntries(cost).every(([resource, amount]) => {
    return amount <= getSynthesisUpgradeInvestmentValue(wallet, resource)
  })
}

const getSynthesisUpgradeLevelForWallet = <K extends SynthesisUpgradeName>(
  upgradeKey: K,
  wallet: SynthesisUpgradeWallet | SynthesisUpgradeInvestment<K>
): number => {
  const upgrade = synthesisUpgradeData[upgradeKey]
  let low = 0
  let high = upgrade.maxLevel

  while (low < high) {
    const middle = low + Math.ceil((high - low) / 2)
    if (isSynthesisUpgradeCostAffordable(upgrade.cumulativeCost(middle), wallet)) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return low
}

export const getSynthesisUpgradeLevel = <K extends SynthesisUpgradeName>(upgradeKey: K): number => {
  return getSynthesisUpgradeLevelForWallet(upgradeKey, player.synthesisUpgrades[upgradeKey])
}

export const getSynthesisUpgradeEffect = (upgradeKey: SynthesisUpgradeName) => {
  return synthesisUpgradeData[upgradeKey].effect(getSynthesisUpgradeLevel(upgradeKey))
}

const getSynthesisRedAmbrosiaCost = () => {
  return SYNTHESIS_RED_AMBROSIA_COST - getSynthesisUpgradeEffect('redAmbrosiaReduction')
}

const getSynthesisPurpleHoneyCost = () => {
  return SYNTHESIS_PURPLE_HONEY_COST - getSynthesisUpgradeEffect('purpleHoneyReduction')
}

export const getMaximumSynthesisCraftAmount = (): number => {
  const redAmbrosiaAmount = getAffordableSynthesisAmount(player.redAmbrosia, getSynthesisRedAmbrosiaCost())
  const purpleHoneyAmount = getAffordableSynthesisAmount(
    player.purpleReactor.purpleHoney,
    getSynthesisPurpleHoneyCost()
  )

  return Math.max(0, Math.min(redAmbrosiaAmount, purpleHoneyAmount))
}

export const getSynthesisCraftCost = (amount: number) => ({
  redAmbrosia: amount * getSynthesisRedAmbrosiaCost(),
  purpleHoney: amount * getSynthesisPurpleHoneyCost()
})

export const getSynthesisUpgradePurchase = <K extends SynthesisUpgradeName>(
  upgradeKey: K,
  purchaseAmount: SynthesisUpgradePurchaseAmount
): { amount: number; cost: SynthesisUpgradeInvestment<K> } => {
  const upgrade = synthesisUpgradeData[upgradeKey]
  const currentLevel = getSynthesisUpgradeLevel(upgradeKey)
  const targetLevel = purchaseAmount === 'max'
    ? getSynthesisUpgradeLevelForWallet(
      upgradeKey,
      addSynthesisUpgradeInvestmentToWallet(
        getSynthesisUpgradeWallet(),
        player.synthesisUpgrades[upgradeKey]
      )
    )
    : Math.min(currentLevel + purchaseAmount, upgrade.maxLevel)
  const totalCost = upgrade.cumulativeCost(targetLevel)

  return {
    amount: targetLevel - currentLevel,
    cost: subtractSynthesisUpgradeCosts(totalCost, player.synthesisUpgrades[upgradeKey])
  }
}

export const buySynthesisUpgrade = <K extends SynthesisUpgradeName>(
  upgradeKey: K,
  purchaseAmount: SynthesisUpgradePurchaseAmount = 1
): boolean => {
  const purchase = getSynthesisUpgradePurchase(upgradeKey, purchaseAmount)
  if (purchase.amount <= 0 || !isSynthesisUpgradeCostAffordable(purchase.cost)) {
    return false
  }

  player.purpleAmbrosia -= getSynthesisUpgradeInvestmentValue(purchase.cost, 'purpleAmbrosia')
  player.redAmbrosia -= getSynthesisUpgradeInvestmentValue(purchase.cost, 'redAmbrosia')
  player.purpleReactor.purpleHoney -= getSynthesisUpgradeInvestmentValue(purchase.cost, 'purpleHoney')
  player.worlds.sub(getSynthesisUpgradeInvestmentValue(purchase.cost, 'quarks'))
  player.wowOcteracts -= getSynthesisUpgradeInvestmentValue(purchase.cost, 'octeracts')
  player.spentPurpleHoney.upgrades += getSynthesisUpgradeInvestmentValue(purchase.cost, 'purpleHoney')
  player.synthesisUpgrades[upgradeKey] = addSynthesisUpgradeCosts(
    player.synthesisUpgrades[upgradeKey],
    purchase.cost
  )

  updateSynthesis()
  return true
}

export const calculateSynthesisUpgradeAP = (): number => {
  return synthesisUpgradeNames.reduce((total, upgradeKey) => {
    const upgrade = synthesisUpgradeData[upgradeKey]
    const level = getSynthesisUpgradeLevel(upgradeKey)
    return total + getSynthesisUpgradeAPAtLevel(upgrade, level)
  }, 0)
}

export const maxSynthesisUpgradeAP = synthesisUpgradeNames.reduce((total, upgradeKey) => {
  const upgrade = synthesisUpgradeData[upgradeKey]
  return total + getSynthesisUpgradeAPAtLevel(upgrade, upgrade.maxLevel)
}, 0)

export const craftPurpleAmbrosia = (requestedAmount: number | 'max'): number => {
  const maximumAmount = getMaximumSynthesisCraftAmount()
  const amount = requestedAmount === 'max' ? maximumAmount : requestedAmount

  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0 || amount > maximumAmount) {
    return 0
  }

  const cost = getSynthesisCraftCost(amount)

  player.redAmbrosia -= cost.redAmbrosia
  player.purpleReactor.purpleHoney -= cost.purpleHoney
  player.spentPurpleHoney.purpleAmbrosia += cost.purpleHoney
  player.purpleAmbrosia += amount
  player.lifetimePurpleAmbrosia += amount

  const quarks = amount * getSynthesisUpgradeEffect('subatomicShavings')
  if (quarks > 0) {
    player.worlds.add(quarks, true, true)
  }

  const octeractSeconds = amount * getSynthesisUpgradeEffect('exceptionalLieGroup')
  if (octeractSeconds > 0) {
    addTimers('octeracts', octeractSeconds)
  }

  return amount
}

export const unlockSynthesisAutomation = (): boolean => {
  if (
    player.synthesisAutomationUnlocked
    || player.purpleAmbrosia < SYNTHESIS_AUTOMATION_COST
  ) {
    return false
  }

  player.purpleAmbrosia -= SYNTHESIS_AUTOMATION_COST
  player.synthesisAutomationUnlocked = true
  updateSynthesis()
  return true
}

export const setSynthesisAutomationEnabled = (enabled: boolean): void => {
  if (!player.synthesisAutomationUnlocked) {
    return
  }

  player.synthesisAutomationEnabled = enabled
  updateSynthesis()
}

export const autoCraftSynthesis = (): number => {
  if (!player.synthesisAutomationUnlocked || !player.synthesisAutomationEnabled) {
    return 0
  }

  return craftPurpleAmbrosia(getMaximumSynthesisCraftAmount())
}

const getSynthesisUpgradeCostTranslationParams = (cost: SynthesisUpgradeInvestment) => ({
  purpleAmbrosia: format(getSynthesisUpgradeInvestmentValue(cost, 'purpleAmbrosia'), 2, true),
  redAmbrosia: format(getSynthesisUpgradeInvestmentValue(cost, 'redAmbrosia'), 2, true),
  purpleHoney: format(getSynthesisUpgradeInvestmentValue(cost, 'purpleHoney'), 2, true),
  quarks: format(getSynthesisUpgradeInvestmentValue(cost, 'quarks'), 2, true),
  octeracts: format(getSynthesisUpgradeInvestmentValue(cost, 'octeracts'), 2, true)
})

const initializeSynthesisUpgradeCard = (upgradeKey: SynthesisUpgradeName) => {
  const elementIDPrefix = synthesisUpgradeElementIDPrefixes[upgradeKey]
  const buttons = new Map<SynthesisUpgradePurchaseAmount, HTMLButtonElement>()

  for (const amount of synthesisUpgradePurchaseAmounts) {
    const button = DOMCacheGetOrSet(getSynthesisUpgradePurchaseButtonID(upgradeKey, amount)) as HTMLButtonElement
    buttons.set(amount, button)
  }

  synthesisUpgradeCards.set(upgradeKey, {
    level: DOMCacheGetOrSet(`${elementIDPrefix}Level`),
    effect: DOMCacheGetOrSet(`${elementIDPrefix}Effect`),
    nextCost: DOMCacheGetOrSet(`${elementIDPrefix}NextCost`),
    ap: DOMCacheGetOrSet(`${elementIDPrefix}AP`),
    purchaseButtons: DOMCacheGetOrSet(`${elementIDPrefix}PurchaseButtons`),
    buttons
  })
}

const initializeSynthesisUpgrades = () => {
  for (const upgradeKey of synthesisUpgradeNames) {
    initializeSynthesisUpgradeCard(upgradeKey)
  }
}

const updateSynthesisUpgrades = () => {
  for (const upgradeKey of synthesisUpgradeNames) {
    const card = synthesisUpgradeCards.get(upgradeKey)
    if (!card) {
      continue
    }

    const upgrade = synthesisUpgradeData[upgradeKey]
    const level = getSynthesisUpgradeLevel(upgradeKey)
    const isMaxed = level === upgrade.maxLevel
    card.level.textContent = isMaxed
      ? i18next.t('purpleReactor.synthesis.upgradeMaxed')
      : i18next.t('purpleReactor.synthesis.upgradeLevel', {
        current: format(level, 0, true),
        max: format(upgrade.maxLevel, 0, true)
      })
    card.effect.innerHTML = isMaxed
      ? upgrade.maxedEffectsDescription(level)
      : upgrade.notMaxedEffectsDescription(level)
    card.effect.classList.toggle('synthesisUpgradeEffectMaxed', isMaxed)
    card.nextCost.innerHTML = i18next.t(
      `purpleReactor.synthesis.upgrades.${upgradeKey}.cost`,
      getSynthesisUpgradeCostTranslationParams(getSynthesisUpgradePurchase(upgradeKey, 1).cost)
    )
    card.nextCost.hidden = isMaxed
    card.ap.textContent = i18next.t('purpleReactor.synthesis.upgradeAPProgress', {
      amount: format(getSynthesisUpgradeAPAtLevel(upgrade, level), 0, true),
      levels: format(upgrade.apValue.levelsPerAP, 0, true)
    })

    const remainingLevels = upgrade.maxLevel - level
    for (const [amount, button] of card.buttons) {
      const purchase = getSynthesisUpgradePurchase(upgradeKey, amount)
      const canAfford = purchase.amount > 0 && isSynthesisUpgradeCostAffordable(purchase.cost)
      button.disabled = !canAfford
      button.hidden = isMaxed || (amount !== 'max' && remainingLevels <= amount)
      button.textContent = amount === 'max'
        ? i18next.t('purpleReactor.synthesis.purchaseMax')
        : i18next.t('purpleReactor.synthesis.purchaseAmount', { amount })
      const accessibleLabel = i18next.t(`purpleReactor.synthesis.upgrades.${upgradeKey}.purchaseAria`, {
        amount: format(purchase.amount, 0, true),
        ...getSynthesisUpgradeCostTranslationParams(purchase.cost)
      })
      button.title = accessibleLabel
      button.setAttribute('aria-label', accessibleLabel)
    }
    card.purchaseButtons.hidden = isMaxed
  }
}

const animateSynthesisGain = (amount: number) => {
  const gain = document.createElement('span')
  gain.classList.add('purpleHoneyGain', 'synthesisGain')
  gain.textContent = i18next.t('purpleReactor.synthesis.gain', {
    amount: format(amount, 0, true)
  })
  const removeGain = () => gain.remove()
  gain.addEventListener('animationend', removeGain, { once: true })

  DOMCacheGetOrSet('synthesisGainContainer').appendChild(gain)
  requestAnimationFrame(() => gain.classList.add('purpleHoneyGainAnimating'))
  setTimeout(removeGain, 1000)
}

const getRequestedCraftAmount = (amount: SynthesisCraftAmount) => {
  return amount === 'max' ? getMaximumSynthesisCraftAmount() : amount
}

const getSynthesisCraftButtonLayout = (maximumAmount: number) => {
  if (maximumAmount <= 1) {
    return [[1], []] as const
  }

  if (maximumAmount <= 10) {
    return [[1, 'max'], []] as const
  }

  if (maximumAmount <= 100) {
    return [[1, 10, 'max'], []] as const
  }

  if (maximumAmount <= 1000) {
    return [[1, 10], [100, 'max']] as const
  }

  return [[1, 10, 100], [1000, 'max']] as const
}

const updateSynthesisCraftButtonLayout = (maximumAmount: number) => {
  const layout = getSynthesisCraftButtonLayout(maximumAmount)
  const automationEnabled = player.synthesisAutomationUnlocked && player.synthesisAutomationEnabled
  const layoutKey = `${layout.map((row) => row.join(',')).join('|')}|automation:${automationEnabled}`
  if (layoutKey === lastSynthesisCraftButtonLayout) {
    return
  }

  const visibleAmounts = new Set<SynthesisCraftAmount>(layout.flat())
  for (const { id, amount } of synthesisCraftButtons) {
    const button = DOMCacheGetOrSet(id) as HTMLButtonElement
    button.hidden = !visibleAmounts.has(amount)
  }

  for (const [index, row] of layout.entries()) {
    const rowElement = DOMCacheGetOrSet(synthesisCraftButtonRows[index])
    rowElement.hidden = automationEnabled || row.length === 0
    for (const amount of row) {
      const button = synthesisCraftButtons.find((craftButton) => craftButton.amount === amount)
      if (button) {
        rowElement.append(DOMCacheGetOrSet(button.id))
      }
    }
  }

  lastSynthesisCraftButtonLayout = layoutKey
}

export const craftFromSynthesis = (requestedAmount: SynthesisCraftAmount, sourceButtonId: string) => {
  const amount = getRequestedCraftAmount(requestedAmount)
  const maximumAmount = getMaximumSynthesisCraftAmount()
  if (amount <= 0 || amount > maximumAmount) {
    updateSynthesis()
    return
  }

  const crafted = craftPurpleAmbrosia(amount)
  if (crafted > 0) {
    animateSynthesisGain(crafted)
  }
  updateSynthesis()

  if (getPurpleReactorPopupMode() === 'synthesis') {
    requestAnimationFrame(() => {
      const sourceButton = DOMCacheGetOrSet(sourceButtonId) as HTMLButtonElement
      const focusTarget = sourceButton.disabled ? DOMCacheGetOrSet('purpleSynthesisClose') : sourceButton
      focusTarget.focus()
    })
  }
}

export const initializeSynthesis = () => {
  registerPurpleReactorAPContribution({
    id: 'synthesis',
    calculateAP: calculateSynthesisUpgradeAP,
    maximumAP: maxSynthesisUpgradeAP
  })
  initializeSynthesisUpgrades()
}

export const updateSynthesis = () => {
  if (getPurpleReactorPopupMode() !== 'synthesis') {
    return
  }

  const redAmbrosiaCost = getSynthesisRedAmbrosiaCost()
  const purpleHoneyCost = getSynthesisPurpleHoneyCost()
  DOMCacheGetOrSet('synthesisRedAmbrosiaAmount').textContent = format(player.redAmbrosia, 0, true)
  DOMCacheGetOrSet('synthesisPurpleHoneyAmount').textContent = format(player.purpleReactor.purpleHoney, 2, true)
  DOMCacheGetOrSet('synthesisRedAmbrosiaCost').textContent = format(redAmbrosiaCost, 0, true)
  DOMCacheGetOrSet('synthesisPurpleHoneyCost').textContent = format(purpleHoneyCost, 0, true)
  DOMCacheGetOrSet('synthesisConversionRedAmbrosiaCost').textContent = format(redAmbrosiaCost, 0, true)
  DOMCacheGetOrSet('synthesisConversionPurpleHoneyCost').textContent = format(purpleHoneyCost, 0, true)
  DOMCacheGetOrSet('synthesisConversionPurpleAmbrosiaAmount').textContent = format(
    SYNTHESIS_PURPLE_AMBROSIA_YIELD,
    0,
    true
  )

  const redAmbrosiaPotential = getAffordableSynthesisAmount(player.redAmbrosia, redAmbrosiaCost)
  const purpleHoneyPotential = getAffordableSynthesisAmount(player.purpleReactor.purpleHoney, purpleHoneyCost)
  const maximumAmount = Math.max(0, Math.min(redAmbrosiaPotential, purpleHoneyPotential))
  updateSynthesisCraftButtonLayout(maximumAmount)
  updateSynthesisUpgrades()

  const automationUnlock = DOMCacheGetOrSet('synthesisAutomationUnlock') as HTMLButtonElement
  automationUnlock.hidden = player.synthesisAutomationUnlocked
  automationUnlock.disabled = !Number.isFinite(player.purpleAmbrosia)
    || player.purpleAmbrosia < SYNTHESIS_AUTOMATION_COST
  automationUnlock.textContent = i18next.t('purpleReactor.synthesis.unlockAutomation', {
    cost: format(SYNTHESIS_AUTOMATION_COST, 0, true)
  })
  const automationToggleContainer = DOMCacheGetOrSet('synthesisAutomationToggleContainer')
  automationToggleContainer.hidden = !player.synthesisAutomationUnlocked
  const automationToggle = DOMCacheGetOrSet('synthesisAutomationToggle') as HTMLInputElement
  automationToggle.disabled = !player.synthesisAutomationUnlocked
  automationToggle.checked = player.synthesisAutomationEnabled

  DOMCacheGetOrSet('synthesisPurpleAmbrosiaAmount').textContent = i18next.t('purpleReactor.synthesis.owned', {
    amount: format(player.purpleAmbrosia, 0, true)
  })
  DOMCacheGetOrSet('synthesisMaximumCraftAmount').textContent = i18next.t('purpleReactor.synthesis.craftable', {
    amount: format(maximumAmount, 0, true)
  })

  DOMCacheGetOrSet('synthesisRedAmbrosiaInventory').classList.toggle(
    'synthesisResourceInsufficient',
    redAmbrosiaPotential <= 0
  )
  DOMCacheGetOrSet('synthesisPurpleHoneyInventory').classList.toggle(
    'synthesisResourceInsufficient',
    purpleHoneyPotential <= 0
  )

  for (const { id, amount } of synthesisCraftButtons) {
    const craftAmount = amount === 'max' ? maximumAmount : amount
    const cost = getSynthesisCraftCost(craftAmount)
    const button = DOMCacheGetOrSet(id) as HTMLButtonElement

    button.disabled = craftAmount <= 0 || craftAmount > maximumAmount
    button.textContent = i18next.t('purpleReactor.synthesis.craftAmount', {
      amount: format(craftAmount, 0, true)
    })

    const accessibleLabel = i18next.t('purpleReactor.synthesis.craftAria', {
      amount: format(craftAmount, 0, true),
      redAmbrosia: format(cost.redAmbrosia, 0, true),
      purpleHoney: format(cost.purpleHoney, 0, true)
    })
    button.title = accessibleLabel
    button.setAttribute('aria-label', accessibleLabel)
  }
}
