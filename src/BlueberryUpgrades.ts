import { DynamicUpgrade } from './DynamicUpgrade'
import type { IUpgradeData } from './DynamicUpgrade'
import { Alert, Prompt } from './UpdateHTML'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import i18next from 'i18next'

export type blueberryUpgradeNames = 'ambrosiaTutorial' | 'ambrosiaQuarks1' | 'ambrosiaCubes1' | 'ambrosiaLuck1'
type BlueberryOpt = Partial<Record<blueberryUpgradeNames, number>>

export interface IBlueberryData extends IUpgradeData {
    costFormula (this:void, level: number, baseCost: number): number
    rewards(n: number): Record<string, number | boolean>
    rewardDesc(n: number): string
    ambrosiaInvested?: number
    prerequisites?: BlueberryOpt
    cacheUpdates?: (() => void)[] // TODO: Improve this type signature -Plat
}

export class BlueberryUpgrade extends DynamicUpgrade {
  readonly costFormula: (level: number, baseCost: number) => number
  public ambrosiaInvested = 0
  readonly preRequisites: BlueberryOpt | undefined
  readonly cacheUpdates: (() => void)[] | undefined

  constructor(data: IBlueberryData, key: string) {
    const name = i18next.t(`singularity.data.${key}.name`)
    const description = i18next.t(`singularity.data.${key}.description`)

    super({ ...data, name, description })
    this.costFormula = data.costFormula
    this.ambrosiaInvested = data.ambrosiaInvested ?? 0
    this.preRequisites = data.prerequisites ?? undefined
    this.cacheUpdates = data.cacheUpdates ?? undefined

  }

  getCostTNL(): number {
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
  public async buyLevel(event: MouseEvent): Promise<void> {
    let purchased = 0
    let maxPurchasable = 1
    let ambrosiaBudget = player.ambrosia

    if (!this.checkPrerequisites())
      return Alert('You do not have the necessary prerequisites to purchase this upgrade.')

    if (event.shiftKey) {
      maxPurchasable = 1000000
      const buy = Number(await Prompt(`How many Ambrosia would you like to spend? You have ${format(player.ambrosia, 0, true)} Ambrosia. Type -1 to use max!`))

      if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) { // nan + Infinity checks
        return Alert('Value must be a finite number!')
      }

      if (buy === -1) {
        ambrosiaBudget = player.ambrosia
      } else if (buy <= 0) {
        return Alert('Purchase cancelled!')
      } else {
        ambrosiaBudget = buy
      }
      ambrosiaBudget = Math.min(player.ambrosia, ambrosiaBudget)
    }

    if (this.maxLevel > 0) {
      maxPurchasable = Math.min(maxPurchasable, this.maxLevel - this.level)
    }

    if (maxPurchasable === 0) {
      return Alert('Hey! You have already maxed this upgrade. :D')
    }

    while (maxPurchasable > 0) {
      const cost = this.getCostTNL()
      if (player.ambrosia < cost || ambrosiaBudget < cost) {
        break
      } else {
        player.ambrosia -= cost
        ambrosiaBudget -= cost
        this.ambrosiaInvested += cost
        this.level += 1
        purchased += 1
        maxPurchasable -= 1
      }
    }

    if (purchased === 0) {
      return Alert('You cannot afford this upgrade. Sorry!')
    }
    if (purchased > 1) {
      return Alert(`Purchased ${format(purchased)} levels, thanks to Multi Buy!`)
    }

    this.updateUpgradeHTML()
  }

  toString(): string {
    return 'WIP'
  }

  updateUpgradeHTML(): void {
    // WIP
  }

  checkPrerequisites(): boolean {
    if (this.preRequisites !== undefined) {
      for (const [prereq, val] of Object.entries(this.preRequisites)) {
        const k = prereq as keyof Player['blueberryUpgrades']
        if (player.blueberryUpgrades[k].level < val) {
          return false
        }
      }
    }
    return true
  }

  updateCaches(): void {
    if (this.cacheUpdates !== undefined) {
      for (const cache of this.cacheUpdates) {
        cache()
      }
    }
  }

}

export const blueberryUpgradeData: Record<blueberryUpgradeNames, IBlueberryData> = {
  ambrosiaTutorial: {
    name: 'Ambrosia Tutorial Module',
    description: 'Blueberries generate Ambrosia over time. Spend them in the Ambrosia "tree"! +5% Cubes/lvl, +1% Quarks/lvl',
    maxLevel: 10,
    costPerLevel: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      return {
        quarks: 1 + 0.01 * n,
        cubes: 1 + 0.05 * n
      }
    },
    rewardDesc: (n: number): string => {
      return `This tutorial module increases cube gain by ${format(5 * n)}% and quarks by ${format(n)}%`
    }
  },
  ambrosiaQuarks1: {
    name: 'Ambrosia Quark Module I',
    description: 'Congrats on completing the tutorial module. You need to have it maxxed to buy levels of this. +1% Quarks/lvl.',
    maxLevel: 100,
    costPerLevel: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      return {
        quarks: 1 + 0.01 * n
      }
    },
    rewardDesc: (n: number): string => {
      return `This quark module increases Quark gain by ${format(n)}%`
    },
    prerequisites: {
      'ambrosiaTutorial': 10
    }
  },
  ambrosiaCubes1: {
    name: 'Ambrosia Cube Module I',
    description: 'Congrats on completing the tutorial module. You need to have it maxxed to buy levels of this. +5% Cubes/lvl. Every 10 levels gives 1.1x Cubes.',
    maxLevel: 100,
    costPerLevel: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      return {
        cubes: (1 + 0.05 * n) * (1 + Math.pow(1.1, Math.floor(n / 10)))
      }
    },
    rewardDesc: (n: number): string => {
      return `This tutorial module increases cube gain by ${format(100 * ((1 + 0.05 * n) * Math.pow(1.1, Math.floor(n/10)) - 1))}%.`
    }
  },
  ambrosiaLuck1: {
    name: 'Ambrosia Luck Module 1',
    description: 'Congrats on completing the tutorial module. You need to have it maxxed to buy levels of this. +2 Ambrosia Luck/lvl. Every 10 levels gives +5 more!',
    maxLevel: 100,
    costPerLevel: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      return {
        ambrosiaLuck: 2 * n + 5 * Math.floor(n/10)
      }
    },
    rewardDesc: (n: number): string => {
      return `This tutorial module increases Ambrosia Luck by ${format(2 * n + 5 * Math.floor(n/10))}`
    },
    prerequisites: {
      'ambrosiaTutorial': 10
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('OcteractBerries')]
  }

}
