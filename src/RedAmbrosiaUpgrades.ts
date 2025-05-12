import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { formatAsPercentIncrease } from './Campaign'
import { DynamicUpgrade, type IUpgradeData } from './DynamicUpgrade'
import { format, player } from './Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { visualUpdateAmbrosia } from './UpdateVisuals'

interface BaseReward {
  desc: string
}

interface TutorialReward extends BaseReward {
  cubeMult: number
  obtainiumMult: number
  offeringMult: number
}

interface ConversionImprovementReward extends BaseReward {
  conversionImprovement: number
}

interface FreeLevelReward extends BaseReward {
  freeLevels: number
}

interface BlueberrySpeedReward extends BaseReward {
  blueberryGenerationSpeed: number
}

interface AmbrosiaLuckReward extends BaseReward {
  ambrosiaLuck: number
}

interface RedAmbrosiaSpeedReward extends BaseReward {
  redAmbrosiaGenerationSpeed: number
}

interface RedAmbrosiaLuckReward extends BaseReward {
  redAmbrosiaLuck: number
}

interface UnlockedRedAmbrosiaCubeReward extends BaseReward {
  unlockedRedAmbrosiaCube: number
}

interface UnlockRedAmbrosiaObtainiumReward extends BaseReward {
  unlockRedAmbrosiaObtainium: number
}

interface UnlockRedAmbrosiaOfferingReward extends BaseReward {
  unlockRedAmbrosiaOffering: number
}

interface RedAmbrosiaCubeImproverReward extends BaseReward {
  extraExponent: number
}

interface RedAmbrosiaAcceleratorReward extends BaseReward {
  ambrosiaTimePerRedAmbrosia: number
}

interface ViscountReward extends BaseReward {
  roleUnlock: boolean
  quarkBonus: number
  luckBonus: number
  redLuckBonus: number
}

type RewardTypeMap = {
  'tutorial': TutorialReward
  'conversionImprovement1': ConversionImprovementReward
  'conversionImprovement2': ConversionImprovementReward
  'conversionImprovement3': ConversionImprovementReward
  'freeTutorialLevels': FreeLevelReward
  'freeLevelsRow2': FreeLevelReward
  'freeLevelsRow3': FreeLevelReward
  'freeLevelsRow4': FreeLevelReward
  'freeLevelsRow5': FreeLevelReward
  'blueberryGenerationSpeed': BlueberrySpeedReward
  'regularLuck': AmbrosiaLuckReward
  'redGenerationSpeed': RedAmbrosiaSpeedReward
  'redLuck': RedAmbrosiaLuckReward
  'redAmbrosiaCube': UnlockedRedAmbrosiaCubeReward
  'redAmbrosiaObtainium': UnlockRedAmbrosiaObtainiumReward
  'redAmbrosiaOffering': UnlockRedAmbrosiaOfferingReward
  'redAmbrosiaCubeImprover': RedAmbrosiaCubeImproverReward
  'viscount': ViscountReward
  'infiniteShopUpgrades': FreeLevelReward
  'redAmbrosiaAccelerator': RedAmbrosiaAcceleratorReward
  'regularLuck2': AmbrosiaLuckReward
  'blueberryGenerationSpeed2': BlueberrySpeedReward
}

export type RedAmbrosiaKeys = keyof RewardTypeMap

export interface IRedAmbrosiaData<K extends RedAmbrosiaKeys>
  extends Omit<IUpgradeData, 'name' | 'description' | 'effect' | 'level'>
{
  costFormula(this: void, level: number, baseCost: number): number
  rewards(this: void, n: number): RewardTypeMap[K]
  redAmbrosiaInvested?: number
}

export class RedAmbrosiaUpgrade<K extends RedAmbrosiaKeys> extends DynamicUpgrade {
  readonly costFormula: (level: number, baseCost: number) => number
  readonly rewards: (n: number) => RewardTypeMap[K]
  public redAmbrosiaInvested = 0
  public level = 0
  #key: K

  constructor (data: IRedAmbrosiaData<K>, key: K) {
    const name = i18next.t(`redAmbrosia.data.${key}.name`)
    const description = i18next.t(`redAmbrosia.data.${key}.description`)

    super({ ...data, name, description })
    this.costFormula = data.costFormula
    this.rewards = data.rewards
    this.redAmbrosiaInvested = data.redAmbrosiaInvested ?? 0
    this.#key = key
    this.updateLevelFromInvested()
  }

  updateLevelFromInvested (): void {
    let level = 0
    let budget = this.redAmbrosiaInvested

    let nextCost = this.costFormula(level, this.costPerLevel)

    while (budget >= nextCost) {
      budget -= nextCost
      level += 1
      nextCost = this.costFormula(level, this.costPerLevel)

      if (level >= this.maxLevel) {
        break
      }
    }

    // If there is leftover budget, then the formulae has probably changed, or above max.
    // We refund the remaining budget.
    this.refund(budget)
    this.level = level
  }

  getCostTNL (): number {
    if (this.level === this.maxLevel) {
      return 0
    }
    return this.costFormula(this.level, this.costPerLevel)
  }

  /**
   * Buy levels up until togglebuy or maxed.
   * @returns An alert indicating cannot afford, already maxed or purchased with how many
   *          levels purchased
   */
  public async buyLevel (event: MouseEvent): Promise<void> {
    let purchased = 0
    let maxPurchasable = 1
    let redAmbrosiaBudget = player.redAmbrosia

    if (event.shiftKey) {
      maxPurchasable = 1000000
      const buy = Number(
        await Prompt(
          i18next.t('redAmbrosia.redAmbrosiaBuyPrompt', {
            amount: format(player.redAmbrosia, 0, true)
          })
        )
      )

      if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
        // nan + Infinity checks
        return Alert(i18next.t('general.validation.finite'))
      }

      if (buy === -1) {
        redAmbrosiaBudget = player.redAmbrosia
      } else if (buy <= 0) {
        return Alert(i18next.t('octeract.buyLevel.cancelPurchase')) // For some reason this is in the Octeract section (???)
      } else {
        redAmbrosiaBudget = buy
      }
      redAmbrosiaBudget = Math.min(player.redAmbrosia, redAmbrosiaBudget)
    }

    if (this.maxLevel > 0) {
      maxPurchasable = Math.min(maxPurchasable, this.maxLevel - this.level)
    }

    if (maxPurchasable === 0) {
      return Alert(i18next.t('octeract.buyLevel.alreadyMax')) // Once again
    }

    while (maxPurchasable > 0) {
      const cost = this.getCostTNL()
      if (player.redAmbrosia < cost || redAmbrosiaBudget < cost) {
        break
      } else {
        player.redAmbrosia -= cost
        redAmbrosiaBudget -= cost
        this.redAmbrosiaInvested += cost
        this.level += 1
        purchased += 1
        maxPurchasable -= 1

        // This particular form of Dynamic Upgrade is NOT stored in the player
        // We ONLY store the total invested, and apply dynamically.
        player.redAmbrosiaUpgrades[this.#key] += cost
      }
    }

    if (purchased === 0) {
      return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
    }
    if (purchased > 1) {
      return Alert(
        `${i18next.t('octeract.buyLevel.multiBuy', { n: format(purchased) })}`
      )
    }

    this.updateUpgradeHTML()
  }

  toString (): string {
    const costNextLevel = this.getCostTNL()
    const maxLevel = this.maxLevel === -1 ? '' : `/${format(this.maxLevel, 0, true)}`
    const isMaxLevel = this.maxLevel === this.level
    const color = isMaxLevel ? 'plum' : 'white'

    const isAffordable = costNextLevel <= player.redAmbrosia
    const affordableInfo = isMaxLevel
      ? `<span style="color: plum"> ${i18next.t('general.maxed')}</span>`
      : isAffordable
      ? `<span style="color: var(--green-text-color)"> ${
        i18next.t(
          'general.affordable'
        )
      }</span>`
      : `<span style="color: yellow"> ${
        i18next.t(
          'octeract.buyLevel.cannotAfford'
        )
      }</span>`

    const nameSpan = `<span style="color: gold">${this.name}</span>`
    const levelSpan = `<span style="color: ${color}"> ${
      i18next.t(
        'general.level'
      )
    } ${format(this.level, 0, true)}${maxLevel}</span>`
    const descriptionSpan = `<span style="color: lightblue">${this.description}</span>`
    const rewardDescSpan = `<span style="color: gold">${this.rewardDesc}</span>`
    const costNextLevelSpan = i18next.t('octeract.toString.costNextLevel', {
      amount: `<span style="color:red">${format(costNextLevel, 0, true, true, true)}</span>`,
      resource: i18next.t('redAmbrosia.redAmbrosia')
    })
    const spentSpan = `${i18next.t('general.spent')} ${i18next.t('redAmbrosia.redAmbrosia')}: <span style="color:red">${
      format(this.redAmbrosiaInvested, 0, true, true, true)
    }</span>`
    const purchaseWarningSpan = `<span>${i18next.t('redAmbrosia.purchaseWarning')}</span>`
    return `${nameSpan} \n ${levelSpan} \n ${descriptionSpan} \n ${rewardDescSpan} \n ${
      (!isMaxLevel) ? `${costNextLevelSpan} ${affordableInfo} \n` : ''
    } ${spentSpan} \n ${purchaseWarningSpan}`
  }

  updateUpgradeHTML (): void {
    DOMCacheGetOrSet('singularityAmbrosiaMultiline').innerHTML = this.toString()
    visualUpdateAmbrosia()
  }

  refund (toRefund: number): void {
    player.redAmbrosiaUpgrades[this.#key] -= toRefund
    this.redAmbrosiaInvested -= toRefund
    player.redAmbrosia += toRefund
  }

  public get rewardDesc (): string {
    const effectiveLevel = this.level
    return this.rewards(effectiveLevel).desc
  }

  public get bonus () {
    const effectiveLevel = this.level
    return this.rewards(effectiveLevel)
  }
}

export const redAmbrosiaUpgradeData: { [K in RedAmbrosiaKeys]: IRedAmbrosiaData<K> } = {
  tutorial: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 0 * level // Level has no effect.
    },
    rewards: (n: number) => {
      const val = Math.pow(1.01, n)
      return {
        desc: i18next.t('redAmbrosia.data.tutorial.effect', { amount: formatAsPercentIncrease(val) }),
        cubeMult: val,
        obtainiumMult: val,
        offeringMult: val
      }
    },
    maxLevel: 100,
    costPerLevel: 1
  },
  conversionImprovement1: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.conversionImprovement1.effect', { amount: n }),
        conversionImprovement: -n
      }
    },
    maxLevel: 5,
    costPerLevel: 5
  },
  conversionImprovement2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(4, level)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.conversionImprovement2.effect', { amount: n }),
        conversionImprovement: -n
      }
    },
    maxLevel: 3,
    costPerLevel: 200
  },
  conversionImprovement3: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.conversionImprovement3.effect', { amount: n }),
        conversionImprovement: -n
      }
    },
    maxLevel: 2,
    costPerLevel: 10000
  },
  freeTutorialLevels: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost + level
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.freeTutorialLevels.effect', { amount: n }),
        freeLevels: n
      }
    },
    maxLevel: 5,
    costPerLevel: 1
  },
  freeLevelsRow2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.freeLevelsRow2.effect', { amount: n }),
        freeLevels: n
      }
    },
    maxLevel: 5,
    costPerLevel: 10
  },
  freeLevelsRow3: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.freeLevelsRow3.effect', { amount: n }),
        freeLevels: n
      }
    },
    maxLevel: 5,
    costPerLevel: 250
  },
  freeLevelsRow4: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.freeLevelsRow4.effect', { amount: n }),
        freeLevels: n
      }
    },
    maxLevel: 5,
    costPerLevel: 5000
  },
  freeLevelsRow5: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.freeLevelsRow5.effect', { amount: n }),
        freeLevels: n
      }
    },
    maxLevel: 5,
    costPerLevel: 50000
  },
  blueberryGenerationSpeed: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      const val = 1 + n / 500
      return {
        desc: i18next.t('redAmbrosia.data.blueberryGenerationSpeed.effect', { amount: formatAsPercentIncrease(val) }),
        blueberryGenerationSpeed: val
      }
    },
    maxLevel: 100,
    costPerLevel: 1
  },
  regularLuck: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      const val = 2 * n
      return {
        desc: i18next.t('redAmbrosia.data.regularLuck.effect', { amount: val }),
        ambrosiaLuck: val
      }
    },
    maxLevel: 100,
    costPerLevel: 1
  },
  redGenerationSpeed: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      const val = 1 + 3 * n / 1000
      return {
        desc: i18next.t('redAmbrosia.data.redGenerationSpeed.effect', { amount: formatAsPercentIncrease(val) }),
        redAmbrosiaGenerationSpeed: val
      }
    },
    maxLevel: 100,
    costPerLevel: 12
  },
  redLuck: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      const val = n
      return {
        desc: i18next.t('redAmbrosia.data.redLuck.effect', { amount: val }),
        redAmbrosiaLuck: val
      }
    },
    maxLevel: 100,
    costPerLevel: 4
  },
  redAmbrosiaCube: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      const exponent = 0.4 + getRedAmbrosiaUpgrade('redAmbrosiaCubeImprover').bonus.extraExponent
      return {
        desc: i18next.t('redAmbrosia.data.redAmbrosiaCube.effect', {
          amount: n > 0,
          exponent: format(exponent, 2, true)
        }),
        unlockedRedAmbrosiaCube: n
      }
    },
    maxLevel: 1,
    costPerLevel: 500
  },
  redAmbrosiaObtainium: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.redAmbrosiaObtainium.effect', { amount: n > 0 }),
        unlockRedAmbrosiaObtainium: n
      }
    },
    maxLevel: 1,
    costPerLevel: 1250
  },
  redAmbrosiaOffering: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.redAmbrosiaOffering.effect', { amount: n > 0 }),
        unlockRedAmbrosiaOffering: n
      }
    },
    maxLevel: 1,
    costPerLevel: 4000
  },
  redAmbrosiaCubeImprover: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      const val = 0.01 * n
      return {
        desc: i18next.t('redAmbrosia.data.redAmbrosiaCubeImprover.effect', { newExponent: format(0.4 + val, 2, true) }),
        extraExponent: val
      }
    },
    maxLevel: 20,
    costPerLevel: 100
  },
  viscount: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.viscount.effect', { mark: n > 0 ? '✔' : '❌' }),
        roleUnlock: n > 0,
        quarkBonus: 1 + 0.1 * n,
        luckBonus: 125 * n,
        redLuckBonus: 25 * n
      }
    },
    maxLevel: 1,
    costPerLevel: 99999
  },
  infiniteShopUpgrades: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 100 * level
    },
    rewards: (n: number) => {
      return {
        desc: i18next.t('redAmbrosia.data.infiniteShopUpgrades.effect', { amount: n }),
        freeLevels: n
      }
    },
    maxLevel: 40,
    costPerLevel: 200
  },
  redAmbrosiaAccelerator: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost + level * 0
    },
    rewards: (n: number) => {
      const val = 0.02 * n + ((n > 0) ? 1 : 0)
      return {
        desc: i18next.t('redAmbrosia.data.redAmbrosiaAccelerator.effect', { amount: format(val, 2, true) }),
        ambrosiaTimePerRedAmbrosia: val
      }
    },
    maxLevel: 100,
    costPerLevel: 1000
  },
  regularLuck2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 0 * level
    },
    rewards: (n: number) => {
      const val = 2 * n
      return {
        desc: i18next.t('redAmbrosia.data.regularLuck2.effect', { amount: val }),
        ambrosiaLuck: val
      }
    },
    maxLevel: 500,
    costPerLevel: 2000
  },
  blueberryGenerationSpeed2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 0 * level
    },
    rewards: (n: number) => {
      const val = 1 + n / 1000
      return {
        desc: i18next.t('redAmbrosia.data.blueberryGenerationSpeed2.effect', { amount: formatAsPercentIncrease(val) }),
        blueberryGenerationSpeed: val
      }
    },
    maxLevel: 500,
    costPerLevel: 2000
  }
}

// Create an object that is NOT on the player, but can be used (once initialized).
export type RedAmbrosiaUpgradesMap = {
  [K in RedAmbrosiaKeys]: RedAmbrosiaUpgrade<K>
}
let redAmbrosiaUpgrades: RedAmbrosiaUpgradesMap | null = null

export function initRedAmbrosiaUpgrades (investments: Record<RedAmbrosiaKeys, number>) {
  redAmbrosiaUpgrades = {} as RedAmbrosiaUpgradesMap
  const keys = Object.keys(redAmbrosiaUpgradeData) as RedAmbrosiaKeys[]

  // Use type assertions after careful validation
  for (const key of keys) {
    const data = redAmbrosiaUpgradeData[key]
    const invested = investments[key]

    const dataWithInvestment = {
      ...data,
      redAmbrosiaInvested: invested
    }

    // Use a function that casts the result appropriately
    const upgrade = new RedAmbrosiaUpgrade(dataWithInvestment, key) // Here we need to use type assertion because TypeScript can't track
    // the relationship between the key and the generic parameter in the loop
    redAmbrosiaUpgrades[key as 'tutorial'] = upgrade as RedAmbrosiaUpgrade<'tutorial'>
  }
}

export function getRedAmbrosiaUpgrade<K extends RedAmbrosiaKeys> (key: K): RedAmbrosiaUpgrade<K> {
  if (redAmbrosiaUpgrades === null) {
    throw new Error('RedAmbrosiaUpgrades not initialized. Call initRedAmbrosiaUpgrades first.')
  }
  return redAmbrosiaUpgrades[key]
}

export const displayRedAmbrosiaLevels = () => {
  for (const key of Object.keys(redAmbrosiaUpgradeData)) {
    const k = key as RedAmbrosiaKeys

    const capKey = key.charAt(0).toUpperCase() + key.slice(1)
    const name = `redAmbrosia${capKey}`
    const elm = DOMCacheGetOrSet(name)
    const level = getRedAmbrosiaUpgrade(k).level || 0 // Get the level from the loadout, default to 0 if not present
    const parent = elm.parentElement!

    elm.classList.add('dimmed')
    let levelOverlay = parent.querySelector('.level-overlay') as HTMLDivElement
    if (!levelOverlay) {
      levelOverlay = document.createElement('p')
      levelOverlay.classList.add('level-overlay')

      if (level === redAmbrosiaUpgradeData[k].maxLevel) {
        levelOverlay.classList.add('maxRedAmbrosiaLevel')
      } else {
        levelOverlay.classList.add('notMaxRedAmbrosiaLevel')
      }

      parent.classList.add('relative-container') // Apply relative container to the element
      parent.appendChild(levelOverlay) // Append to the element

      levelOverlay.textContent = String(level) // Set the level text
    }
  }
}

export const resetRedAmbrosiaDisplay = () => {
  for (const key of Object.keys(redAmbrosiaUpgradeData)) {
    const capKey = key.charAt(0).toUpperCase() + key.slice(1)
    const name = `redAmbrosia${capKey}`
    const elm = DOMCacheGetOrSet(name)
    const parent = elm.parentElement!
    elm.classList.remove('dimmed') // Remove the dimmed class

    // Remove the level overlay if it exists
    const levelOverlay = parent.querySelector('.level-overlay')
    if (levelOverlay) {
      levelOverlay.remove()
      parent.classList.remove('relative-container') // Remove relative container
    }
  }
}
