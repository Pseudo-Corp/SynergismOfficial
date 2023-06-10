import { DynamicUpgrade } from './DynamicUpgrade'
import type { IUpgradeData } from './DynamicUpgrade'
import { Alert, Prompt } from './UpdateHTML'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { visualUpdateAmbrosia } from './UpdateVisuals'

export type blueberryUpgradeNames = 'ambrosiaTutorial' | 'ambrosiaQuarks1' | 'ambrosiaCubes1' | 'ambrosiaLuck1' |
                                    'ambrosiaCubeLuck1' | 'ambrosiaQuarkLuck1' | 'ambrosiaQuarkCube1' | 'ambrosiaLuckCube1' |
                                    'ambrosiaCubeQuark1' | 'ambrosiaLuckQuark1'

type BlueberryOpt = Partial<Record<blueberryUpgradeNames, number>>

export interface IBlueberryData extends Omit<IUpgradeData, 'name' | 'description' | 'effect'> {
    costFormula (this:void, level: number, baseCost: number): number
    rewards(this:void, n: number): Record<string, number | boolean | string>
    blueberryCost: number
    ambrosiaInvested?: number
    blueberriesInvested?: number
    prerequisites?: BlueberryOpt
    cacheUpdates?: (() => void)[] // TODO: Improve this type signature -Plat
}

export class BlueberryUpgrade extends DynamicUpgrade {
  readonly costFormula: (level: number, baseCost: number) => number
  readonly rewards: (n: number) => Record<string, number | boolean | string>
  public ambrosiaInvested = 0
  public blueberriesInvested = 0
  public blueberryCost: number
  readonly preRequisites: BlueberryOpt | undefined
  readonly cacheUpdates: (() => void)[] | undefined

  constructor(data: IBlueberryData, key: string) {
    const name = i18next.t(`ambrosia.data.${key}.name`)
    const description = i18next.t(`ambrosia.data.${key}.description`)

    super({ ...data, name, description })
    this.blueberryCost = data.blueberryCost
    this.costFormula = data.costFormula
    this.rewards = data.rewards
    this.ambrosiaInvested = data.ambrosiaInvested ?? 0
    this.blueberriesInvested = data.blueberriesInvested ?? 0
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
      return Alert(i18next.t('ambrosia.prereqNotMetAlert'))

    if (event.shiftKey) {
      maxPurchasable = 1000000
      const buy = Number(await Prompt(i18next.t('ambrosia.ambrosiaBuyPrompt', { amount: format(player.ambrosia, 0, true) })))

      if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) { // nan + Infinity checks
        return Alert(i18next.t('general.validation.finite'))
      }

      if (buy === -1) {
        ambrosiaBudget = player.ambrosia
      } else if (buy <= 0) {
        return Alert(i18next.t('octeract.buyLevel.cancelPurchase')) // For some reason this is in the Octeract section (???)
      } else {
        ambrosiaBudget = buy
      }
      ambrosiaBudget = Math.min(player.ambrosia, ambrosiaBudget)
    }

    if (this.maxLevel > 0) {
      maxPurchasable = Math.min(maxPurchasable, this.maxLevel - this.level)
    }

    if (maxPurchasable === 0) {
      return Alert(i18next.t('octeract.buyLevel.alreadyMax')) // Once again
    }

    while (maxPurchasable > 0) {
      const cost = this.getCostTNL()
      if (player.ambrosia < cost || ambrosiaBudget < cost) {
        break
      } else {
        if (this.level === 0) {
          const availableBlueberries = player.caches.blueberryInventory.totalVal - player.spentBlueberries
          if (availableBlueberries < this.blueberryCost) {
            return Alert(i18next.t('ambrosia.notEnoughBlueberries'))
          } else {
            player.spentBlueberries += this.blueberryCost
            this.blueberriesInvested = this.blueberryCost
          }
        }
        player.ambrosia -= cost
        ambrosiaBudget -= cost
        this.ambrosiaInvested += cost
        this.level += 1
        purchased += 1
        maxPurchasable -= 1
      }
    }

    if (purchased === 0) {
      return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
    }
    if (purchased > 1) {
      return Alert(`${i18next.t('octeract.buyLevel.multiBuy', { n: format(purchased) })}`)
    }

    this.updateUpgradeHTML()
    this.updateCaches()
  }

  toString(): string {
    const costNextLevel = this.getCostTNL()
    const maxLevel = this.maxLevel === -1
      ? ''
      : `/${format(this.maxLevel, 0, true)}`
    const isMaxLevel = this.maxLevel === this.level
    const color = isMaxLevel ? 'plum' : 'white'

    let freeLevelInfo = this.freeLevels > 0 ?
      `<span style="color: orange"> [+${format(this.freeLevels, 1, true)}]</span>` : ''

    if (this.freeLevels > this.level) {
      freeLevelInfo = freeLevelInfo + `<span style="color: var(--maroon-text-color)">${i18next.t('general.softCapped')}</span>`
    }

    const isAffordable = costNextLevel <= player.ambrosia
    const affordableInfo = isMaxLevel ? `<span style="color: plum"> ${i18next.t('general.maxed')}</span>` :
      isAffordable ? `<span style="color: var(--green-text-color)"> ${i18next.t('general.affordable')}</span>` :
        `<span style="color: yellow"> ${i18next.t('octeract.buyLevel.cannotAfford')}</span>`

    let preReqText = i18next.t('ambrosia.prerequisite')
    if (this.preRequisites !== undefined) {
      for (const [prereq, val] of Object.entries(this.preRequisites)) {
        const k = prereq as keyof Player['blueberryUpgrades']
        const color = (player.blueberryUpgrades[k].level >= val) ? 'green' : 'red'
        const met = (player.blueberryUpgrades[k].level >= val) ? '' : i18next.t('ambrosia.prereqNotMet')
        preReqText = preReqText + `<span style="color:${color}"> ${player.blueberryUpgrades[k].name} lv.${val} ${met}</span> |`
      }

      preReqText = preReqText.slice(0, -1)
    }

    return `<span style="color: gold">${this.name}</span>
                ${preReqText}
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${color}"> ${i18next.t('general.level')} ${format(this.level, 0, true)}${maxLevel}${freeLevelInfo}</span>
                <span style="color: gold">${this.rewardDesc}</span>
                ${i18next.t('octeract.toString.costNextLevel')}: <span style="color:orange">${format(costNextLevel, 2, true, true, true)}</span> ${i18next.t('ambrosia.ambrosia')} ${affordableInfo}
                ${i18next.t('ambrosia.blueberryCost')} <span style="color:blue">${this.blueberryCost}</span>
                ${i18next.t('general.spent')} ${i18next.t('ambrosia.ambrosia')}: <span style="color:orange">${format(this.ambrosiaInvested, 2, true, true, true)}</span>`
  }

  updateUpgradeHTML(): void {
    DOMCacheGetOrSet('singularityAmbrosiaMultiline').innerHTML = this.toString()
    visualUpdateAmbrosia()
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

  refund(): void {
    player.ambrosia += this.ambrosiaInvested
    this.ambrosiaInvested = 0
    this.level = 0

    player.spentBlueberries -= this.blueberriesInvested
    this.blueberriesInvested = 0
  }

  public get rewardDesc(): string {
    if ('desc' in this.rewards(0)) {
      return String(this.rewards(this.level).desc)
    } else {
      return 'Contact Platonic or Khafra if you see this (should never occur!)'
    }
  }

  public get bonus() {
    return this.rewards(this.level)
  }
}

export const blueberryUpgradeData: Record<keyof Player['blueberryUpgrades'], IBlueberryData> = {
  ambrosiaTutorial: {
    maxLevel: 10,
    costPerLevel: 1,
    blueberryCost: 0,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const cubeAmount = 1 + 0.05 * n
      const quarkAmount = 1 + 0.01 * n
      return {
        quarks: quarkAmount,
        cubes: cubeAmount,
        desc: String(i18next.t('ambrosia.data.ambrosiaTutorial.effect', { cubeAmount: format(100 * (cubeAmount - 1), 0, true), quarkAmount: format(100 * (quarkAmount - 1), 0, true) }))
      }
    }
  },
  ambrosiaQuarks1: {
    maxLevel: 100,
    costPerLevel: 1,
    blueberryCost: 0,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const quarkAmount = 1 + 0.01 * n
      return {
        quarks: quarkAmount,
        desc: String(i18next.t('ambrosia.data.ambrosiaQuarks1.effect', { amount: format(100 * (quarkAmount - 1), 0, true) }))
      }
    },
    prerequisites: {
      'ambrosiaTutorial': 10
    }
  },
  ambrosiaCubes1: {
    maxLevel: 100,
    costPerLevel: 1,
    blueberryCost: 0,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const cubeAmount = (1 + 0.05 * n) * Math.pow(1.1, Math.floor(n / 10))
      return {
        cubes: cubeAmount,
        desc: String(i18next.t('ambrosia.data.ambrosiaCubes1.effect', { amount: format(100 * (cubeAmount - 1), 2, true) }))
      }
    },
    prerequisites: {
      'ambrosiaTutorial': 10
    }
  },
  ambrosiaLuck1: {
    maxLevel: 100,
    costPerLevel: 1,
    blueberryCost: 0,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const val = 2 * n + 5 * Math.floor(n/10)
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaLuck1.effect', { amount: format(val) }))
      }
    },
    prerequisites: {
      'ambrosiaTutorial': 10
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('BlueberryUpgrade1')]
  },
  ambrosiaQuarkCube1: {
    maxLevel: 25,
    costPerLevel: 250,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const baseVal = 0.0005 * n
      const val = 1 + baseVal * Math.floor(Math.pow(Math.log10(Number(player.worlds)+1) +1, 2))
      return {
        cubes: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaQuarkCube1.effect', { amount: format(100 * (val - 1), 2, true) }))
      }
    },
    prerequisites: {
      'ambrosiaCubes1': 30,
      'ambrosiaQuarks1': 20
    }
  },
  ambrosiaLuckCube1: {
    maxLevel: 25,
    costPerLevel: 250,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const baseVal = 0.0002 * n
      const val = 1 + baseVal * player.caches.ambrosiaLuck.totalVal
      return {
        cubes: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaLuckCube1.effect', { amount: format(100 * (val - 1), 2, true) }))
      }
    },
    prerequisites: {
      'ambrosiaCubes1': 30,
      'ambrosiaLuck1': 20
    }
  },
  ambrosiaCubeQuark1: {
    maxLevel: 25,
    costPerLevel: 500,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const baseVal = 0.0001 * n
      const val = 1 + baseVal * (Math.floor(Math.log10(Number(player.wowCubes) + 1)) +
                                Math.floor(Math.log10(Number(player.wowTesseracts) + 1)) +
                                Math.floor(Math.log10(Number(player.wowHypercubes) + 1)) +
                                Math.floor(Math.log10(Number(player.wowPlatonicCubes) + 1)) +
                                Math.floor(Math.log10(player.wowAbyssals + 1)) +
                                Math.floor(Math.log10(player.wowOcteracts + 1)) + 6)
      return {
        quarks: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaCubeQuark1.effect', { amount: format(100 * (val - 1), 2, true) }))
      }
    },
    prerequisites: {
      'ambrosiaQuarks1': 30,
      'ambrosiaCubes1': 20
    }
  },
  ambrosiaLuckQuark1: {
    maxLevel: 25,
    costPerLevel: 500,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const baseVal = 0.0001 * n
      const val = 1 + baseVal * player.caches.ambrosiaLuck.totalVal
      return {
        quarks: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaLuckQuark1.effect', { amount: format(100 * (val - 1), 2, true) }))
      }
    },
    prerequisites: {
      'ambrosiaQuarks1': 30,
      'ambrosiaLuck1': 20
    }
  },
  ambrosiaCubeLuck1: {
    maxLevel: 25,
    costPerLevel: 100,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const baseVal = 0.01 * n
      const val = baseVal * (Math.floor(Math.log10(Number(player.wowCubes) + 1)) +
                            Math.floor(Math.log10(Number(player.wowTesseracts) + 1)) +
                            Math.floor(Math.log10(Number(player.wowHypercubes) + 1)) +
                            Math.floor(Math.log10(Number(player.wowPlatonicCubes) + 1)) +
                            Math.floor(Math.log10(player.wowAbyssals + 1)) +
                            Math.floor(Math.log10(player.wowOcteracts + 1)) + 6)
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaCubeLuck1.effect', { amount: val }))
      }
    },
    prerequisites: {
      'ambrosiaLuck1': 30,
      'ambrosiaCubes1': 20
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('BlueberryCubeLuck1')]
  },
  ambrosiaQuarkLuck1: {
    maxLevel: 25,
    costPerLevel: 100,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const baseVal = 0.01 * n
      const val = baseVal * Math.floor(Math.pow(Math.log10(Number(player.worlds)+1)+1, 2))
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaQuarkLuck1.effect', { amount: val }))
      }
    },
    prerequisites: {
      'ambrosiaLuck1': 30,
      'ambrosiaQuarks1': 20
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('BlueberryQuarkLuck1')]
  }

}

export const resetBlueberryTree = () => {
  for (const upgrade of Object.keys(player.blueberryUpgrades)) {
    const k = upgrade as keyof Player['blueberryUpgrades']
    player.blueberryUpgrades[k].refund()
  }
  return Alert(i18next.t('ambrosia.refund'))
}
