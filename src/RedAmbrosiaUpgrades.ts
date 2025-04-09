import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
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

type RewardTypeMap = {
  'tutorial': TutorialReward
  'conversionImprovement': ConversionImprovementReward
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

    let freeLevelInfo = this.freeLevels > 0
      ? `<span style="color: orange"> [+${
        format(
          this.freeLevels,
          1,
          true
        )
      }]</span>`
      : ''

    if (this.freeLevels > this.level) {
      freeLevelInfo = `${freeLevelInfo}<span style="color: var(--maroon-text-color)">${
        i18next.t(
          'general.softCapped'
        )
      }</span>`
    }

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

    return `<span style="color: gold">${this.name}</span>
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${color}"> ${
      i18next.t(
        'general.level'
      )
    } ${format(this.level, 0, true)}${maxLevel}${freeLevelInfo}</span>
                <span style="color: gold">${this.rewardDesc}</span>
                ${
      i18next.t(
        'octeract.toString.costNextLevel'
      )
    }: <span style="color:orange">${
      format(
        costNextLevel,
        2,
        true,
        true,
        true
      )
    }</span> ${i18next.t('ambrosia.ambrosia')} ${affordableInfo}
                ${
      i18next.t(
        'ambrosia.blueberryCost'
      )
    }           ${i18next.t('general.spent')} ${
      i18next.t(
        'ambrosia.ambrosia'
      )
    }: <span style="color:orange">${
      format(
        this.redAmbrosiaInvested,
        2,
        true,
        true,
        true
      )
    }</span>`
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
      return {
        type: 'tutorial',
        desc: i18next.t('redAmbrosia.data.tutorial.effect', { amount: n }),
        cubeMult: 1 + n / 100,
        obtainiumMult: 1 + n / 100,
        offeringMult: 1 + n / 100
      }
    },
    maxLevel: 100,
    costPerLevel: 1
  },
  conversionImprovement: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    rewards: (n: number) => {
      return {
        type: 'conversionImprovement',
        desc: i18next.t('redAmbrosia.data.conversionImprovement.effect', { amount: 20 - n }),
        conversionImprovement: n
      }
    },
    maxLevel: 5,
    costPerLevel: 5
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

  console.log(redAmbrosiaUpgrades)
}

export function getRedAmbrosiaUpgrade<K extends RedAmbrosiaKeys> (key: K): RedAmbrosiaUpgrade<K> {
  if (redAmbrosiaUpgrades === null) {
    throw new Error('RedAmbrosiaUpgrades not initialized. Call initRedAmbrosiaUpgrades first.')
  }
  return redAmbrosiaUpgrades[key]
}
