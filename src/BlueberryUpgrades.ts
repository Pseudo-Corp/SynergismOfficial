import { DynamicUpgrade } from './DynamicUpgrade'
import type { IUpgradeData } from './DynamicUpgrade'
import { Alert, Confirm, Prompt } from './UpdateHTML'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { visualUpdateAmbrosia } from './UpdateVisuals'
import { exportData, saveFilename } from './ImportExport'
import { getTotalCubeDigits } from './DynamicCubes'
import { Globals } from './Variables'
import { numOfTimeThresholds } from './Calculate'

export type blueberryUpgradeNames = 'ambrosiaTutorial' | 'ambrosiaQuarks1' | 'ambrosiaCubes1' | 'ambrosiaLuck1' |
                                    'ambrosiaCubeLuck1' | 'ambrosiaQuarkLuck1' | 'ambrosiaQuarkCube1' | 'ambrosiaLuckCube1' |
                                    'ambrosiaCubeQuark1' | 'ambrosiaLuckQuark1' | 'ambrosiaQuarks2' | 'ambrosiaCubes2' | 'ambrosiaLuck2' |
                                    'ambrosiaChallenge1' | 'ambrosiaChallenge2' | 'ambrosiaChallenge3' | 'ambrosiaChallenge4' |
                                    'ambrosiaDivision1' | 'ambrosiaLuckUlt'

export type BlueberryOpt = Partial<Record<blueberryUpgradeNames, number>> | Record<'Ambrosia Luck', number>
export type BlueberryLoadoutMode = 'saveTree' | 'loadTree'

export interface IBlueberryData extends Omit<IUpgradeData, 'name' | 'description' | 'effect'> {
    costFormula (this:void, level: number, baseCost: number): number
    rewards(this:void, n: number): Record<string, number | boolean | string>
    blueberryCost: number
    ambrosiaInvested?: number
    blueberriesInvested?: number
    prerequisites?: BlueberryOpt
    exclusions?: blueberryUpgradeNames[]
    cacheUpdates?: (() => void)[] // TODO: Improve this type signature -Plat
}

export class BlueberryUpgrade extends DynamicUpgrade {
  readonly costFormula: (level: number, baseCost: number) => number
  readonly rewards: (n: number) => Record<string, number | boolean | string>
  public ambrosiaInvested = 0
  public blueberriesInvested = 0
  public blueberryCost: number
  readonly preRequisites: BlueberryOpt | undefined
  readonly exclusions: blueberryUpgradeNames[] | undefined
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
    this.exclusions = data.exclusions ?? undefined
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

    if (this.exclusions !== undefined) {
      for (const exclusion of this.exclusions) {
        const c = exclusion as keyof Player['blueberryUpgrades']
        if (player.blueberryUpgrades[c].level > 0) {
          return Alert('You cannot purchase due to a conflict!!! 1111')
        }
      }
    }

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
          const availableBlueberries = player.caches.blueberryInventory.total - player.spentBlueberries
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

    let freeLevelInfo = this.freeLv > 0 ?
      `<span style="color: aquamarine"> [+${format(this.freeLv, 1, true)}]</span>` : ''

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
        if (prereq === 'Ambrosia Luck') {
          const color = (player.caches.ambrosiaLuck.totalVal >= val) ? 'green': 'red'
          const met = (player.caches.ambrosiaLuck.totalVal >= val) ? '' : i18next.t('ambrosia.prereqNotMet')
          preReqText = preReqText + `<span style="color:${color}"> ${i18next.t('ambrosia.ambrosiaLuck', { amount: val })} ${met}</span> |`
        } else {
          const k = prereq as keyof Player['blueberryUpgrades']
          const color = (player.blueberryUpgrades[k].level >= val) ? 'green' : 'red'
          const met = (player.blueberryUpgrades[k].level >= val) ? '' : i18next.t('ambrosia.prereqNotMet')
          preReqText = preReqText + `<span style="color:${color}"> ${player.blueberryUpgrades[k].name} lv.${val} ${met}</span> |`
        }
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

  public get freeLv(): number {
    if (this.level === 0) return 0
    if (this.maxLevel === 1) return 0
    else {
      let extraFree = 0
      extraFree += Globals.challenge15Rewards.freeAmbrosiaLevel // 1e111 challenge 15 score
      return this.freeLevels + extraFree
    }
  }

  public get rewardDesc(): string {
    if ('desc' in this.rewards(0)) {
      return String(this.rewards(this.level + this.freeLv).desc)
    } else {
      return 'Contact Platonic or Khafra if you see this (should never occur!)'
    }
  }

  public get bonus() {
    return this.rewards(this.level + this.freeLv)
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
      const val = 2 * n + 12 * Math.floor(n/10)
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaLuck1.effect', { amount: format(val) }))
      }
    },
    prerequisites: {
      'ambrosiaTutorial': 10
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('BlueberryUpgrade1'),
      () => player.caches.ambrosiaLuck.updateVal('BlueberryUpgrade2')]
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
      const val = 1 + baseVal * player.caches.ambrosiaLuck.total
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
      const val = 1 + baseVal * getTotalCubeDigits()
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
      const effectiveLuck = Math.min(player.caches.ambrosiaLuck.total,
        Math.pow(1000, 0.5) * Math.pow(player.caches.ambrosiaLuck.total, 0.5))
      const val = 1 + baseVal * effectiveLuck
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
      const baseVal = 0.02 * n
      const val = baseVal * getTotalCubeDigits()
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaCubeLuck1.effect', { amount: format(val, 2, true) }))
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
      const baseVal = 0.02 * n
      const val = baseVal * Math.floor(Math.pow(Math.log10(Number(player.worlds)+1)+1, 2))
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaQuarkLuck1.effect', { amount: format(val, 2, true) }))
      }
    },
    prerequisites: {
      'ambrosiaLuck1': 30,
      'ambrosiaQuarks1': 20
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('BlueberryQuarkLuck1')]
  },
  ambrosiaQuarks2: {
    maxLevel: 100,
    costPerLevel: 500,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const quarkAmount = 1 + (0.01 + Math.floor(player.blueberryUpgrades.ambrosiaQuarks1.level / 10) / 1000)  * n
      return {
        quarks: quarkAmount,
        desc: String(i18next.t('ambrosia.data.ambrosiaQuarks2.effect', { amount: format(100 * (quarkAmount - 1), 0, true) }))
      }
    },
    prerequisites: {
      'ambrosiaQuarks1': 40
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
      const cubeAmount = (1 + (0.06 + 6 * (Math.floor(player.blueberryUpgrades.ambrosiaCubes1.level / 10) / 1000)) * n) * Math.pow(1.13, Math.floor(n / 10))
      return {
        cubes: cubeAmount,
        desc: String(i18next.t('ambrosia.data.ambrosiaCubes2.effect', { amount: format(100 * (cubeAmount - 1), 2, true) }))
      }
    },
    prerequisites: {
      'ambrosiaCubes1': 40
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
      const val = (3 + 0.3 * Math.floor(player.blueberryUpgrades.ambrosiaLuck1.level / 10))* n + 40 * Math.floor(n/10)
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaLuck2.effect', { amount: format(val, 1, true) }))
      }
    },
    prerequisites: {
      'ambrosiaLuck1': 40
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('BlueberryUpgrade2')]
  },
  ambrosiaPatreon: {
    maxLevel: 1,
    costPerLevel: 1,
    blueberryCost: 0,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = (1 + n * player.worlds.BONUS / 100)
      return {
        blueberryGeneration: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaPatreon.effect', { amount: format(100 * (val - 1), 0, true) }))
      }
    },
    cacheUpdates: [() => player.caches.ambrosiaGeneration.updateVal('BlueberryPatreon')]
  },
  ambrosiaDivision1: {
    maxLevel: 1,
    costPerLevel: 750000,
    blueberryCost: 3,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = (n > 0)
      return {
        luckDivisor: val ? 2 : 1,
        generationMultiplier: val ? 3 : 1,
        desc: String(i18next.t('ambrosia.data.ambrosiaDivision1.effect', { bool: val? 'active' : 'inactive' }))
      }
    },
    prerequisites: {
      'ambrosiaLuck2': 40
    }
  },
  ambrosiaMultiplication1: {
    maxLevel: 3,
    costPerLevel: 300000,
    blueberryCost: 3,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost + 100000 * level
    },
    rewards: (n: number) => {
      const val = (n > 0)
      return {
        luckMultiplier: n + 1,
        generationMultiplier: val ? 0.5 : 1,
        desc: String(i18next.t('ambrosia.data.ambrosiaMultiplication1.effect', { bool: val? 'active' : 'inactive', amount: format(100 * n, 0, true) }))
      }
    },
    prerequisites: {
      'ambrosiaLuck2': 40
    }
  },
  ambrosiaChallenge1: {
    maxLevel: 1,
    costPerLevel: 50000,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = (n > 0)
      return {
        presetGenerationRequirement: (val)? 1e8: -1,
        desc: String(i18next.t('ambrosia.data.ambrosiaChallenge1.effect', { bool: val? 'active' : 'inactive', fills: player.ambrosiaChallengeFills[1] }))
      }
    },
    exclusions: ['ambrosiaChallenge2', 'ambrosiaChallenge3', 'ambrosiaChallenge4']
  },
  ambrosiaChallenge2: {
    maxLevel: 1,
    costPerLevel: 2000000,
    blueberryCost: 3,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = (n > 0)
      return {
        presetGenerationRequirement: (val)? 1e8: -1,
        desc: String(i18next.t('ambrosia.data.ambrosiaChallenge2.effect', { bool: val? 'active' : 'inactive', fills: player.ambrosiaChallengeFills[2] }))
      }
    },
    exclusions: ['ambrosiaChallenge1', 'ambrosiaChallenge3', 'ambrosiaChallenge4']
  },
  ambrosiaChallenge3: {
    maxLevel: 1,
    costPerLevel: 25000000,
    blueberryCost: 5,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = (n > 0)
      return {
        presetGenerationRequirement: (val)? 1e8: -1,
        desc: String(i18next.t('ambrosia.data.ambrosiaChallenge3.effect', { bool: val? 'active' : 'inactive', fills: player.ambrosiaChallengeFills[3] }))
      }
    },
    exclusions: ['ambrosiaChallenge1', 'ambrosiaChallenge2', 'ambrosiaChallenge4']
  },
  ambrosiaChallenge4: {
    maxLevel: 1,
    costPerLevel: 1,
    blueberryCost: 1,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    rewards: (n: number) => {
      const val = (n > 0)
      return {
        presetGenerationRequirement: (val)? 1e8: -1,
        desc: String(i18next.t('ambrosia.data.ambrosiaChallenge4.effect', { bool: val? 'active' : 'inactive', fills: player.ambrosiaChallengeFills[4] }))
      }
    },
    exclusions: ['ambrosiaChallenge1', 'ambrosiaChallenge2', 'ambrosiaChallenge3']
  },
  ambrosiaLuckUlt: {
    maxLevel: 4,
    costPerLevel: 2250000,
    blueberryCost: 5,
    costFormula: (level: number, baseCost: number): number => {
      return baseCost + 250000 * level
    },
    rewards: (n: number) => {
      const val = 250 * n * numOfTimeThresholds().numThresholds
      return {
        ambrosiaLuck: val,
        desc: String(i18next.t('ambrosia.data.ambrosiaLuckUlt.effect', { amount: format(val, 0, true) }))
      }
    },
    prerequisites: {
      'Ambrosia Luck': 7000
    },
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('AmbrosiaLuckUlt')]
  }
}

export const resetBlueberryTree = async (giveAlert = true) => {
  for (const upgrade of Object.keys(player.blueberryUpgrades)) {
    const k = upgrade as keyof Player['blueberryUpgrades']
    player.blueberryUpgrades[k].refund()
  }
  if (giveAlert) return Alert(i18next.t('ambrosia.refund'))
}

export const validateBlueberryTree = (modules: BlueberryOpt) => {

  // Check for empty object (perhaps from the loadouts?)
  if (Object.keys(modules).length === 0) {
    return false
  }

  const ambrosiaBudget = player.lifetimeAmbrosia
  const blueberryBudget = player.caches.blueberryInventory.total

  let spentAmbrosia = 0
  let spentBlueberries = 0

  let meetsPrerequisites = true
  let meetsAmbrosia = true
  let meetsBlueberries = true

  for (const [key, val] of Object.entries(modules)) {
    const k = key as keyof Player['blueberryUpgrades']

    // Nix malicious or bad values
    if (val < 0 || !Number.isFinite(val) || !Number.isInteger(val) || Number.isNaN(val)) {
      return false
    }
    // Nix nonexistent modules
    // eslint-disable-next-line
    if (player.blueberryUpgrades[k] === undefined) return false

    // Set val to max if it exceeds it, since it is possible module caps change over time.
    const effectiveVal = Math.min(player.blueberryUpgrades[k].maxLevel, val)

    // Check prereq for this specific module
    const prereqs = player.blueberryUpgrades[k].preRequisites
    if (prereqs !== undefined && val > 0) {
      for (const [key2, val2] of Object.entries(prereqs)) {
        const k2 = key2 as keyof BlueberryOpt
        // eslint-disable-next-line
        const level = modules[k2] ?? -1 /* If undefined, this is saying 'We need to have module
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

  meetsAmbrosia = (ambrosiaBudget >= spentAmbrosia)
  meetsBlueberries = (blueberryBudget >= spentBlueberries)

  return (meetsPrerequisites && meetsAmbrosia && meetsBlueberries)
}

export const getBlueberryTree = () => {
  return Object.fromEntries(Object.entries(player.blueberryUpgrades).map(([key, value]) => {
    return [key, value.level]
  })) as BlueberryOpt
}

export const fixBlueberryLevel = (modules: BlueberryOpt) => {
  return Object.fromEntries(Object.entries(modules).map(([key, value]) => {
    return [key, Math.min(value, player.blueberryUpgrades[key].maxLevel)]
  }))
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

export const saveBlueberryTree = async (input: number, previous: BlueberryOpt) => {

  if (Object.keys(previous).length > 0) {
    const p = await Confirm(i18next.t('ambrosia.loadouts.confirmation'))
    if (!p) return
  }

  player.blueberryLoadouts[input] = getBlueberryTree()
  // eslint-disable-next-line
  createLoadoutDescription(input, player.blueberryLoadouts[input])
}

export const createLoadoutDescription = (input: number, modules: BlueberryOpt) => {

  let str = ''
  for (const [key, val] of Object.entries(modules)) {
    const k = key as keyof Player['blueberryUpgrades']
    const name = player.blueberryUpgrades[k].name
    str = str + `<span style="color:orange">${name}</span> <span style="color:yellow">lv${val}</span> | `
  }

  if (Object.keys(modules).length === 0) {
    str = i18next.t('ambrosia.loadouts.none')
  }
  DOMCacheGetOrSet('singularityAmbrosiaMultiline').innerHTML = ` ${i18next.t('ambrosia.loadouts.loadout')} ${input}
  ${str}`
}
