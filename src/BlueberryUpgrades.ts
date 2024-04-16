import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { DynamicUpgrade } from './DynamicUpgrade'
import type { IUpgradeData } from './DynamicUpgrade'
import { exportData, saveFilename } from './ImportExport'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Confirm, Prompt } from './UpdateHTML'
import { visualUpdateAmbrosia } from './UpdateVisuals'

export type blueberryUpgradeNames =
  | 'ambrosiaTutorial'
  | 'ambrosiaQuarks1'
  | 'ambrosiaCubes1'
  | 'ambrosiaLuck1'
  | 'ambrosiaCubeLuck1'
  | 'ambrosiaQuarkLuck1'
  | 'ambrosiaQuarkCube1'
  | 'ambrosiaLuckCube1'
  | 'ambrosiaCubeQuark1'
  | 'ambrosiaLuckQuark1'
  | 'ambrosiaQuarks2'
  | 'ambrosiaCubes2'
  | 'ambrosiaLuck2'
  | 'ambrosiaObtainium1'
  | 'ambrosiaOffering1'

export type BlueberryOpt = Partial<Record<blueberryUpgradeNames, number>>
export type BlueberryLoadoutMode = 'saveTree' | 'loadTree'

export interface IBlueberryData extends Omit<IUpgradeData, 'name' | 'description' | 'effect'> {
  costFormula(this: void, level: number, baseCost: number): number
  rewards(this: void, n: number): Record<string, number | boolean | string>
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

  constructor (data: IBlueberryData, key: string) {
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
    let ambrosiaBudget = player.ambrosia

    if (!this.checkPrerequisites()) {
      return Alert(i18next.t('ambrosia.prereqNotMetAlert'))
    }

    if (event.shiftKey) {
      maxPurchasable = 1000000
      const buy = Number(
        await Prompt(
          i18next.t('ambrosia.ambrosiaBuyPrompt', {
            amount: format(player.ambrosia, 0, true)
          })
        )
      )

      if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
        // nan + Infinity checks
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
      return Alert(
        `${i18next.t('octeract.buyLevel.multiBuy', { n: format(purchased) })}`
      )
    }

    this.updateUpgradeHTML()
    this.updateCaches()
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

    const isAffordable = costNextLevel <= player.ambrosia
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

    let preReqText = i18next.t('ambrosia.prerequisite')
    if (this.preRequisites !== undefined) {
      for (const [prereq, val] of Object.entries(this.preRequisites)) {
        const k = prereq as keyof Player['blueberryUpgrades']
        const color = player.blueberryUpgrades[k].level >= val ? 'green' : 'red'
        const met = player.blueberryUpgrades[k].level >= val
          ? ''
          : i18next.t('ambrosia.prereqNotMet')
        preReqText = `${preReqText}<span style="color:${color}"> ${
          player.blueberryUpgrades[k].name
        } lv.${val} ${met}</span> |`
      }

      preReqText = preReqText.slice(0, -1)
    }

    return `<span style="color: gold">${this.name}</span>
                ${preReqText}
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
    } <span style="color:blue">${this.blueberryCost}</span>
                ${i18next.t('general.spent')} ${
      i18next.t(
        'ambrosia.ambrosia'
      )
    }: <span style="color:orange">${
      format(
        this.ambrosiaInvested,
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

  checkPrerequisites (): boolean {
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

  updateCaches (): void {
    if (this.cacheUpdates !== undefined) {
      for (const cache of this.cacheUpdates) {
        cache()
      }
    }
  }

  refund (): void {
    player.ambrosia += this.ambrosiaInvested
    this.ambrosiaInvested = 0
    this.level = 0

    player.spentBlueberries -= this.blueberriesInvested
    this.blueberriesInvested = 0
  }

  public get rewardDesc (): string {
    const effectiveLevel = (player.singularityChallenges.noAmbrosiaUpgrades.enabled) ? 0: this.level
    if ('desc' in this.rewards(0)) {
      return String(this.rewards(effectiveLevel).desc)
    } else {
      return 'Contact Platonic or Khafra if you see this (should never occur!)'
    }
  }

  public get bonus () {
    const effectiveLevel = (player.singularityChallenges.noAmbrosiaUpgrades.enabled) ? 0: this.level
    return this.rewards(effectiveLevel)
  }
}

export const blueberryUpgradeData: Record<
  keyof Player['blueberryUpgrades'],
  IBlueberryData
> = {
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
        desc: String(
          i18next.t('ambrosia.data.ambrosiaTutorial.effect', {
            cubeAmount: format(100 * (cubeAmount - 1), 0, true),
            quarkAmount: format(100 * (quarkAmount - 1), 0, true)
          })
        )
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
        desc: String(
          i18next.t('ambrosia.data.ambrosiaQuarks1.effect', {
            amount: format(100 * (quarkAmount - 1), 0, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaTutorial: 10
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
        desc: String(
          i18next.t('ambrosia.data.ambrosiaCubes1.effect', {
            amount: format(100 * (cubeAmount - 1), 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaTutorial: 10
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
      const val = 2 * n + 12 * Math.floor(n / 10)
      return {
        ambrosiaLuck: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaLuck1.effect', {
            amount: format(val)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaTutorial: 10
    },
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('BlueberryUpgrade1'),
      () => player.caches.ambrosiaLuck.updateVal('BlueberryUpgrade2')
    ]
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
      const val = 1
        + baseVal
          * Math.floor(Math.pow(Math.log10(Number(player.worlds) + 1) + 1, 2))
      return {
        cubes: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaQuarkCube1.effect', {
            amount: format(100 * (val - 1), 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaCubes1: 30,
      ambrosiaQuarks1: 20
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
      const val = 1 + baseVal * player.caches.ambrosiaLuck.usedTotal
      return {
        cubes: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaLuckCube1.effect', {
            amount: format(100 * (val - 1), 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaCubes1: 30,
      ambrosiaLuck1: 20
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
      const val = 1
        + baseVal
          * (Math.floor(Math.log10(Number(player.wowCubes) + 1))
            + Math.floor(Math.log10(Number(player.wowTesseracts) + 1))
            + Math.floor(Math.log10(Number(player.wowHypercubes) + 1))
            + Math.floor(Math.log10(Number(player.wowPlatonicCubes) + 1))
            + Math.floor(Math.log10(player.wowAbyssals + 1))
            + Math.floor(Math.log10(player.wowOcteracts + 1))
            + 6)
      return {
        quarks: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaCubeQuark1.effect', {
            amount: format(100 * (val - 1), 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaQuarks1: 30,
      ambrosiaCubes1: 20
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
      const effectiveLuck = Math.min(
        player.caches.ambrosiaLuck.usedTotal,
        Math.pow(1000, 0.5)
          * Math.pow(player.caches.ambrosiaLuck.usedTotal, 0.5)
      )
      const val = 1 + baseVal * effectiveLuck
      return {
        quarks: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaLuckQuark1.effect', {
            amount: format(100 * (val - 1), 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaQuarks1: 30,
      ambrosiaLuck1: 20
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
      const baseVal = 0.02 * n
      const val = baseVal
        * (Math.floor(Math.log10(Number(player.wowCubes) + 1))
          + Math.floor(Math.log10(Number(player.wowTesseracts) + 1))
          + Math.floor(Math.log10(Number(player.wowHypercubes) + 1))
          + Math.floor(Math.log10(Number(player.wowPlatonicCubes) + 1))
          + Math.floor(Math.log10(player.wowAbyssals + 1))
          + Math.floor(Math.log10(player.wowOcteracts + 1))
          + 6)
      return {
        ambrosiaLuck: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaCubeLuck1.effect', {
            amount: format(val, 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaLuck1: 30,
      ambrosiaCubes1: 20
    },
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('BlueberryCubeLuck1')
    ]
  },
  ambrosiaQuarkLuck1: {
    maxLevel: 25,
    costPerLevel: 100,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    rewards: (n: number) => {
      const baseVal = 0.02 * n
      const val = baseVal
        * Math.floor(Math.pow(Math.log10(Number(player.worlds) + 1) + 1, 2))
      return {
        ambrosiaLuck: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaQuarkLuck1.effect', {
            amount: format(val, 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaLuck1: 30,
      ambrosiaQuarks1: 20
    },
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('BlueberryQuarkLuck1')
    ]
  },
  ambrosiaQuarks2: {
    maxLevel: 100,
    costPerLevel: 500,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const quarkAmount = 1
        + (0.01
            + Math.floor(player.blueberryUpgrades.ambrosiaQuarks1.level / 10)
              / 1000)
          * n
      return {
        quarks: quarkAmount,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaQuarks2.effect', {
            amount: format(100 * (quarkAmount - 1), 0, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaQuarks1: 40
    }
  },
  ambrosiaCubes2: {
    maxLevel: 100,
    costPerLevel: 500,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const cubeAmount = (1
        + (0.06
            + 6
              * (Math.floor(player.blueberryUpgrades.ambrosiaCubes1.level / 10)
                / 1000))
          * n)
        * Math.pow(1.13, Math.floor(n / 10))
      return {
        cubes: cubeAmount,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaCubes2.effect', {
            amount: format(100 * (cubeAmount - 1), 2, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaCubes1: 40
    }
  },
  ambrosiaLuck2: {
    maxLevel: 100,
    costPerLevel: 250,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = (3
            + 0.3 * Math.floor(player.blueberryUpgrades.ambrosiaLuck1.level / 10))
          * n
        + 40 * Math.floor(n / 10)
      return {
        ambrosiaLuck: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaLuck2.effect', {
            amount: format(val, 1, true)
          })
        )
      }
    },
    prerequisites: {
      ambrosiaLuck1: 40
    },
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('BlueberryUpgrade2')
    ]
  },
  ambrosiaPatreon: {
    maxLevel: 1,
    costPerLevel: 1,
    blueberryCost: 0,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = 1 + (n * player.worlds.BONUS) / 100
      return {
        blueberryGeneration: val,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaPatreon.effect', {
            amount: format(100 * (val - 1), 0, true)
          })
        )
      }
    },
    cacheUpdates: [
      () => player.caches.ambrosiaGeneration.updateVal('BlueberryPatreon')
    ]
  },
  ambrosiaObtainium1: {
    maxLevel: 2,
    costPerLevel: 50000,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * Math.pow(25, level)
    },
    rewards: (n: number) => {
      const luck = player.caches.ambrosiaLuck.usedTotal
      return {
        luckMult: n,
        obtainiumMult: n * luck,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaObtainium1.effect', {
            amount: format((n * luck) / 10, 1, true)
          })
        )
      }
    }
  },
  ambrosiaOffering1: {
    maxLevel: 2,
    costPerLevel: 50000,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * Math.pow(25, level)
    },
    rewards: (n: number) => {
      const luck = player.caches.ambrosiaLuck.usedTotal
      return {
        luckMult: n,
        offeringMult: n * luck,
        desc: String(
          i18next.t('ambrosia.data.ambrosiaOffering1.effect', {
            amount: format((n * luck) / 10, 1, true)
          })
        )
      }
    }
  },
  ambrosiaHyperflux: {
    maxLevel: 7,
    costPerLevel: 33333,
    blueberryCost: 3,
    costFormula: (level: number, baseCost: number): number => {
      return (baseCost + 33333 * Math.min(4, level)) * Math.max(1, Math.pow(3, level - 4))
    },
    rewards: (n: number) => {
      const fourByFourBase = n
      return {
        hyperFlux: Math.pow(
          1 + (1 / 100) * fourByFourBase,
          player.platonicUpgrades[19]
        ),
        desc: String(
          i18next.t('ambrosia.data.ambrosiaHyperflux.effect', {
            amount: format(
              100
                * (Math.pow(
                  1 + fourByFourBase / 100,
                  player.platonicUpgrades[19]
                )
                  - 1)
            )
          })
        )
      }
    }
  }
}

export const resetBlueberryTree = async (giveAlert = true) => {
  for (const upgrade of Object.keys(player.blueberryUpgrades)) {
    const k = upgrade as keyof Player['blueberryUpgrades']
    player.blueberryUpgrades[k].refund()
    player.blueberryUpgrades[k].updateCaches()
  }
  if (giveAlert) return Alert(i18next.t('ambrosia.refund'))
}

export const validateBlueberryTree = (modules: BlueberryOpt) => {
  // Check for empty object (perhaps from the loadouts?)
  if (Object.keys(modules).length === 0) {
    return false
  }

  const ambrosiaBudget = player.lifetimeAmbrosia
  const blueberryBudget = player.caches.blueberryInventory.totalVal

  let spentAmbrosia = 0
  let spentBlueberries = 0

  let meetsPrerequisites = true
  let meetsAmbrosia = true
  let meetsBlueberries = true

  for (const [key, val] of Object.entries(modules)) {
    const k = key as keyof Player['blueberryUpgrades']

    // Nix malicious or bad values
    if (
      val < 0
      || !Number.isFinite(val)
      || !Number.isInteger(val)
      || Number.isNaN(val)
    ) {
      return false
    }
    // Nix nonexistent modules
    if (player.blueberryUpgrades[k] === undefined) return false

    // Set val to max if it exceeds it, since it is possible module caps change over time.
    const effectiveVal = Math.min(player.blueberryUpgrades[k].maxLevel, val)

    // Check prereq for this specific module
    const prereqs = player.blueberryUpgrades[k].preRequisites
    if (prereqs !== undefined && val > 0) {
      for (const [key2, val2] of Object.entries(prereqs)) {
        const k2 = key2 as keyof BlueberryOpt
        const level = modules[k2]
          ?? -1 /* If undefined, this is saying 'We need to have module
        set to level val2 but it isn't even in our module loadout, so it cannot possibly satisfy prereqs'*/

        if (level < val2) {
          meetsPrerequisites = false
        }
      }
    }

    // Check blueberry costs
    if (effectiveVal > 0) {
      spentBlueberries += player.blueberryUpgrades[k].blueberryCost
    }

    // Check ambrosia costs
    if (effectiveVal > 0) {
      const valFunc = player.blueberryUpgrades[k].costFormula
      const baseCost = player.blueberryUpgrades[k].costPerLevel
      let tempCost = 0
      for (let i = 0; i < val; i++) {
        tempCost += valFunc(i, baseCost)
      }
      spentAmbrosia += tempCost
    }
  }

  meetsAmbrosia = ambrosiaBudget >= spentAmbrosia
  meetsBlueberries = blueberryBudget >= spentBlueberries

  return meetsPrerequisites && meetsAmbrosia && meetsBlueberries
}

export const getBlueberryTree = () => {
  return Object.fromEntries(
    Object.entries(player.blueberryUpgrades).map(([key, value]) => {
      return [key, value.level]
    })
  ) as BlueberryOpt
}

export const fixBlueberryLevel = (modules: BlueberryOpt) => {
  return Object.fromEntries(
    Object.entries(modules).map(([key, value]) => {
      return [key, Math.min(value, player.blueberryUpgrades[key].maxLevel)]
    })
  )
}

export const exportBlueberryTree = () => {
  const modules = getBlueberryTree()
  const save = JSON.stringify(modules)
  const name = `BBTree-${saveFilename()}`
  void exportData(save, name)
}

export const createBlueberryTree = async (modules: BlueberryOpt) => {
  // Check to see if tree being created is valid.
  const isPossible = validateBlueberryTree(modules)
  if (!isPossible) {
    void Alert(i18next.t('ambrosia.importTree.failure'))
    return
  }

  // If valid, we will create the tree.
  // Refund (reset) the tree!
  await resetBlueberryTree(false) // no alert; return type is undefined

  // Fix blueberry levels on a valid tree (not done by validation)
  const actualModules = fixBlueberryLevel(modules)

  for (const [key, val] of Object.entries(actualModules)) {
    const k = key as keyof Player['blueberryUpgrades']
    const { costFormula, costPerLevel, blueberryCost } = player.blueberryUpgrades[k]

    if (val > 0) {
      player.blueberryUpgrades[k].blueberriesInvested = blueberryCost
      player.spentBlueberries += blueberryCost
      let tempCost = 0
      for (let i = 0; i < val; i++) {
        tempCost += costFormula(i, costPerLevel)
      }
      player.ambrosia -= tempCost
      player.blueberryUpgrades[k].ambrosiaInvested = tempCost
      player.blueberryUpgrades[k].level = val
      player.blueberryUpgrades[k].updateCaches()
    }
  }
  void Alert(i18next.t('ambrosia.importTree.success'))
}

export const importBlueberryTree = async (input: string | null) => {
  if (typeof input !== 'string') {
    return Alert(i18next.t('importexport.unableImport'))
  } else {
    try {
      const modules = JSON.parse(input) as BlueberryOpt
      await createBlueberryTree(modules)
      createLoadoutDescription(0, modules)
    } catch (err) {
      return Alert(i18next.t('ambrosia.importTree.error'))
    }
  }
}

export const loadoutHandler = async (n: number, modules: BlueberryOpt) => {
  if (player.blueberryLoadoutMode === 'saveTree') {
    await saveBlueberryTree(n, modules)
  }
  if (player.blueberryLoadoutMode === 'loadTree') {
    await createBlueberryTree(modules)
  }
}

export const updateLoadoutHoverClasses = () => {
  const upgradeNames = Object.keys(
    blueberryUpgradeData
  ) as blueberryUpgradeNames[]

  for (const loadoutKey of Object.keys(player.blueberryLoadouts)) {
    const i = Number.parseInt(loadoutKey, 10)
    const loadout = player.blueberryLoadouts[i]

    const upgradeHoverClass = `bbPurchasedLoadout${i}`
    for (const upgradeKey of upgradeNames) {
      if (loadout[upgradeKey]) {
        DOMCacheGetOrSet(upgradeKey).parentElement?.classList.add(
          upgradeHoverClass
        )
      } else {
        DOMCacheGetOrSet(upgradeKey).parentElement?.classList.remove(
          upgradeHoverClass
        )
      }
    }
  }
}

export const saveBlueberryTree = async (
  input: number,
  previous: BlueberryOpt
) => {
  if (Object.keys(previous).length > 0) {
    const p = await Confirm(i18next.t('ambrosia.loadouts.confirmation'))
    if (!p) return
  }

  player.blueberryLoadouts[input] = getBlueberryTree()
  createLoadoutDescription(input, player.blueberryLoadouts[input])

  updateLoadoutHoverClasses()
}

export const createLoadoutDescription = (
  input: number,
  modules: BlueberryOpt
) => {
  let str = ''
  for (const [key, val] of Object.entries(modules)) {
    /*
     * If the entry (saved purchase level) for an upgrade is 0, undefined, or null, we skip it.
     * If 0 - it existed when the loadout was saved; it's just unpurchased
     * If undefined - it's new, so it's unpurchased - the user couldn't have saved it to a loadout yet
     * I don't think anything sets an upgrade to null... but we may as well skip then too.
     */
    if (!val) continue

    const k = key as keyof Player['blueberryUpgrades']
    const name = player.blueberryUpgrades[k].name
    str = `${str}<span style="color:orange">${name}</span> <span style="color:yellow">lv${val}</span> | `
  }

  if (Object.keys(modules).length === 0) {
    str = i18next.t('ambrosia.loadouts.none')
  }

  let loadoutTitle = `${i18next.t('ambrosia.loadouts.loadout')} ${input}`
  if (input === 0) {
    loadoutTitle = i18next.t('ambrosia.loadouts.imported')
  }
  DOMCacheGetOrSet('singularityAmbrosiaMultiline').innerHTML = ` ${loadoutTitle}
  ${str}`
}
