import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { octeractGainPerSecond } from './Calculate'
import type { IUpgradeData } from './DynamicUpgrade'
import { DynamicUpgrade } from './DynamicUpgrade'
import { format, formatTimeShort, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Prompt } from './UpdateHTML'

export interface IOcteractData extends Omit<IUpgradeData, 'name' | 'description'> {
  costFormula(this: void, level: number, baseCost: number): number
  cacheUpdates?: (() => void)[] // TODO: Improve this type signature -Plat
  octeractsInvested?: number
  qualityOfLife?: boolean
}

export class OcteractUpgrade extends DynamicUpgrade {
  readonly costFormula: (level: number, baseCost: number) => number
  public octeractsInvested = 0
  public qualityOfLife: boolean
  readonly cacheUpdates: (() => void)[] | undefined

  constructor (data: IOcteractData, key: string) {
    const name = i18next.t(`octeract.data.${key}.name`)
    const description = i18next.t(`octeract.data.${key}.description`)
    super({ ...data, name, description })
    this.costFormula = data.costFormula
    this.octeractsInvested = data.octeractsInvested ?? 0
    this.qualityOfLife = data.qualityOfLife ?? false
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
    let OCTBudget = player.wowOcteracts

    if (event.shiftKey) {
      maxPurchasable = 1000000
      const buy = Number(
        await Prompt(`${i18next.t('octeract.buyLevel.buyPrompt', { n: format(player.wowOcteracts, 0, true) })}`)
      )

      if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) { // nan + Infinity checks
        return Alert(i18next.t('general.validation.finite'))
      }

      if (buy === -1) {
        OCTBudget = player.wowOcteracts
      } else if (buy <= 0) {
        return Alert(i18next.t('octeract.buyLevel.cancelPurchase'))
      } else {
        OCTBudget = buy
      }
      OCTBudget = Math.min(player.wowOcteracts, OCTBudget)
    }

    if (this.maxLevel > 0) {
      maxPurchasable = Math.min(maxPurchasable, this.maxLevel - this.level)
    }

    if (maxPurchasable === 0) {
      return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
    }

    while (maxPurchasable > 0) {
      const cost = this.getCostTNL()
      if (player.wowOcteracts < cost || OCTBudget < cost) {
        break
      } else {
        player.wowOcteracts -= cost
        OCTBudget -= cost
        this.octeractsInvested += cost
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

    if (this.name === player.octeractUpgrades.octeractAmbrosiaLuck.name) {
      player.caches.ambrosiaLuck.updateVal('OcteractBerries')
    }

    this.updateCaches()
    this.updateUpgradeHTML()
  }

  /**
   * Given an upgrade, give a concise information regarding its data.
   * @returns A string that details the name, description, level statistic, and next level cost.
   */
  toString (): string {
    const costNextLevel = this.getCostTNL()
    const maxLevel = this.maxLevel === -1
      ? ''
      : `/${format(this.maxLevel, 0, true)}`
    const isMaxLevel = this.maxLevel === this.level
    const color = isMaxLevel ? 'plum' : 'white'

    let freeLevelInfo = this.freeLevels > 0
      ? `<span style="color: orange"> [+${format(this.freeLevels, 1, true)}]</span>`
      : ''

    if (this.freeLevels > this.level) {
      freeLevelInfo = `${freeLevelInfo}<span style="color: var(--maroon-text-color)">${
        i18next.t('general.softCapped')
      }</span>`
    }

    const isAffordable = costNextLevel <= player.wowOcteracts
    let affordTime = ''
    if (!isMaxLevel && !isAffordable) {
      const octPerSecond = octeractGainPerSecond()
      affordTime = octPerSecond > 0
        ? formatTimeShort((costNextLevel - player.wowOcteracts) / octPerSecond)
        : `${i18next.t('general.infinity')}`
    }
    const affordableInfo = isMaxLevel
      ? `<span style="color: plum"> ${i18next.t('general.maxed')}</span>`
      : isAffordable
      ? `<span style="color: var(--green-text-color)"> ${i18next.t('general.affordable')}</span>`
      : `<span style="color: yellow"> ${i18next.t('octeract.toString.becomeAffordable', { n: affordTime })}</span>`

    return `<span style="color: gold">${this.name}</span>
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${color}"> ${i18next.t('general.level')} ${
      format(this.level, 0, true)
    }${maxLevel}${freeLevelInfo}</span>
                <span style="color: gold">${this.getEffect().desc}</span>
                ${i18next.t('octeract.toString.costNextLevel')} ${
      format(costNextLevel, 2, true, true, true)
    } Octeracts${affordableInfo}
                ${i18next.t('general.spent')} Octeracts: ${format(this.octeractsInvested, 2, true, true, true)}`
  }

  public updateUpgradeHTML (): void {
    DOMCacheGetOrSet('singularityOcteractsMultiline').innerHTML = this.toString()
    DOMCacheGetOrSet('octeractAmount').innerHTML = i18next.t('octeract.amount', {
      octeracts: format(player.wowOcteracts, 2, true, true, true)
    })
  }

  public computeFreeLevelSoftcap (): number {
    return Math.min(this.level, this.freeLevels) + Math.sqrt(Math.max(0, this.freeLevels - this.level))
  }

  public actualTotalLevels (): number {
    if (player.singularityChallenges.noOcteracts.enabled && !this.qualityOfLife) {
      return 0
    }
    const actualFreeLevels = this.computeFreeLevelSoftcap()
    const linearLevels = this.level + actualFreeLevels
    return linearLevels // There is currently no 'improvement' to oct free upgrades.
  }

  public getEffect (): { bonus: number | boolean; desc: string } {
    return this.effect(this.actualTotalLevels())
  }

  public refund (): void {
    player.wowOcteracts += this.octeractsInvested
    this.level = 0
    this.octeractsInvested = 0
  }

  updateCaches (): void {
    if (this.cacheUpdates !== undefined) {
      for (const cache of this.cacheUpdates) {
        cache()
      }
    }
  }
}

export const octeractData: Record<keyof Player['octeractUpgrades'], IOcteractData> = {
  octeractStarter: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    maxLevel: 1,
    costPerLevel: 1e-15,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t('octeract.data.octeractStarter.effect', { n: (n > 0) ? '' : 'not' })
        }
      }
    }
  },
  octeractGain: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 6) - Math.pow(level, 6))
    },
    maxLevel: 1e8,
    costPerLevel: 1e-8,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.011 * n,
        get desc () {
          return i18next.t('octeract.data.octeractGain.effect', { n: format(n, 0, true) })
        }
      }
    }
  },
  octeractGain2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, Math.pow(level, 0.5) / 3)
    },
    maxLevel: -1,
    costPerLevel: 1e10,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.01 * n,
        get desc () {
          return i18next.t('octeract.data.octeractGain2.effect', { n: format(n, 0, true) })
        }
      }
    }
  },
  octeractQuarkGain: {
    costFormula: (level: number, baseCost: number) => {
      if (level < 1000) {
        return baseCost * (Math.pow(level + 1, 7) - Math.pow(level, 7))
      } else {
        const fasterMult = (level >= 10000) ? (Math.pow(10, (level - 10000) / 250)) : 1
        const fasterMult2 = (level >= 15000) ? (Math.pow(10, (level - 15000) / 250)) : 1
        return baseCost * (Math.pow(1001, 7) - Math.pow(1000, 7)) * Math.pow(10, level / 1000) * fasterMult
          * fasterMult2
      }
    },
    maxLevel: 20000,
    costPerLevel: 1e-7,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.011 * n,
        get desc () {
          return i18next.t('octeract.data.octeractQuarkGain.effect', { n: format(1.1 * n, 0, true) })
        }
      }
    }
  },
  octeractQuarkGain2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e20, level)
    },
    maxLevel: 5,
    costPerLevel: 1e22,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t('octeract.data.octeractQuarkGain2.effect', { n: n > 0 ? '' : 'NOT' })
        }
      }
    }
  },
  octeractCorruption: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level * 10)
    },
    maxLevel: 2,
    costPerLevel: 10,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('octeract.data.octeractCorruption.effect', { n })
        }
      }
    }
  },
  octeractGQCostReduce: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    maxLevel: 50,
    costPerLevel: 1e-9,
    effect: (n: number) => {
      return {
        bonus: 1 - n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractGQCostReduce.effect', { n })
        }
      }
    }
  },
  octeractExportQuarks: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 100,
    costPerLevel: 1,
    effect: (n: number) => {
      return {
        bonus: 4 * n / 10 + 1,
        get desc () {
          return i18next.t('octeract.data.octeractExportQuarks.effect', { n: format(40 * n, 0, true) })
        }
      }
    }
  },
  octeractImprovedDaily: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1.6, level)
    },
    maxLevel: 50,
    costPerLevel: 1e-3,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedDaily.effect', { n })
        }
      }
    },
    qualityOfLife: true
  },
  octeractImprovedDaily2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    maxLevel: 50,
    costPerLevel: 1e-2,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.01 * n,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedDaily2.effect', { n })
        }
      }
    },
    qualityOfLife: true
  },
  octeractImprovedDaily3: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(20, level)
    },
    maxLevel: -1,
    costPerLevel: 1e20,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedDaily3.effect', { n: `${n} +${0.5 * n}%` })
        }
      }
    },
    qualityOfLife: true
  },
  octeractImprovedQuarkHept: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e6, level)
    },
    maxLevel: 3,
    costPerLevel: 1 / 10,
    effect: (n: number) => {
      return {
        bonus: n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedQuarkHept.effect', { n: format(n / 100, 2, true) })
        }
      }
    }
  },
  octeractImprovedGlobalSpeed: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1000,
    costPerLevel: 1e-5,
    effect: (n: number) => {
      return {
        bonus: n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedGlobalSpeed.effect', { n: format(n, 0, true) })
        }
      }
    }
  },
  octeractImprovedAscensionSpeed: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e9, level / 100)
    },
    maxLevel: 100,
    costPerLevel: 100,
    effect: (n: number) => {
      return {
        bonus: n / 2000,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedAscensionSpeed.effect', { n: format(n / 20, 2, true) })
        }
      }
    }
  },
  octeractImprovedAscensionSpeed2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e12, level / 250)
    },
    maxLevel: 250,
    costPerLevel: 1e5,
    effect: (n: number) => {
      return {
        bonus: n / 2000,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedAscensionSpeed2.effect', { n: format(n / 50, 2, true) })
        }
      }
    }
  },
  octeractImprovedFree: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1,
    costPerLevel: 100,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedFree.effect', { n: (n > 0) ? '' : 'NOT' })
        }
      }
    }
  },
  octeractImprovedFree2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1,
    costPerLevel: 1e7,
    effect: (n: number) => {
      return {
        bonus: 0.05 * n,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedFree2.effect', { n: format(n / 20, 2, true) })
        }
      }
    }
  },
  octeractImprovedFree3: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1,
    costPerLevel: 1e17,
    effect: (n: number) => {
      return {
        bonus: 0.05 * n,
        get desc () {
          return i18next.t('octeract.data.octeractImprovedFree3.effect', { n: format(n / 20, 2, true) })
        }
      }
    }
  },
  octeractImprovedFree4: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e20, level / 40)
    },
    maxLevel: 40,
    costPerLevel: 1e20,
    effect: (n: number) => {
      return {
        bonus: 0.001 * n + ((n > 0) ? 0.01 : 0),
        get desc () {
          return i18next.t('octeract.data.octeractImprovedFree4.effect', {
            n: format(0.001 * n + ((n > 0) ? 0.01 : 0), 3, true)
          })
        }
      }
    }
  },
  octeractSingUpgradeCap: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e3, level)
    },
    maxLevel: 10,
    costPerLevel: 1e10,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('octeract.data.octeractSingUpgradeCap.effect', { n })
        }
      }
    },
    qualityOfLife: true
  },
  octeractOfferings1: {
    costFormula: (level: number, baseCost: number) => {
      if (level < 25) {
        return baseCost * Math.pow(level + 1, 5)
      } else {
        return baseCost * 1e15 * Math.pow(10, level / 25 - 1)
      }
    },
    maxLevel: -1,
    costPerLevel: 1e-15,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.01 * n,
        get desc () {
          return i18next.t('octeract.data.octeractOfferings1.effect', { n: format(n) })
        }
      }
    }
  },
  octeractObtainium1: {
    costFormula: (level: number, baseCost: number) => {
      if (level < 25) {
        return baseCost * Math.pow(level + 1, 5)
      } else {
        return baseCost * 1e15 * Math.pow(10, level / 25 - 1)
      }
    },
    maxLevel: -1,
    costPerLevel: 1e-15,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.01 * n,
        get desc () {
          return i18next.t('octeract.data.octeractObtainium1.effect', { n: format(n) })
        }
      }
    }
  },
  octeractAscensions: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1000000,
    costPerLevel: 1,
    effect: (n: number) => {
      return {
        bonus: (1 + n / 100) * (1 + 2 * Math.floor(n / 10) / 100),
        get desc () {
          return i18next.t('octeract.data.octeractAscensions.effect', {
            n: format((100 + n) * (1 + 2 * Math.floor(n / 10) / 100) - 100, 1, true)
          })
        }
      }
    }
  },
  octeractAscensions2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, Math.pow(level, 0.5) / 3)
    },
    maxLevel: -1,
    costPerLevel: 1e12,
    effect: (n: number) => {
      return {
        bonus: (1 + n / 100) * (1 + 2 * Math.floor(n / 10) / 100),
        get desc () {
          return i18next.t('octeract.data.octeractAscensions2.effect', {
            n: format((100 + n) * (1 + 2 * Math.floor(n / 10) / 100) - 100, 1, true)
          })
        }
      }
    }
  },
  octeractAscensionsOcteractGain: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(40, level)
    },
    maxLevel: -1,
    costPerLevel: 1000,
    effect: (n: number) => {
      return {
        bonus: n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractAscensionsOcteractGain.effect', { n: format(n, 1, true) })
        }
      }
    }
  },
  octeractFastForward: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e8, level)
    },
    maxLevel: 2,
    costPerLevel: 1e8,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('octeract.data.octeractFastForward.effect', { n100: 100 * n, n })
        }
      }
    }
  },
  octeractAutoPotionSpeed: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level)
    },
    maxLevel: -1,
    costPerLevel: 1e-10,
    effect: (n: number) => {
      return {
        bonus: 1 + 4 * n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractAutoPotionSpeed.effect', { n: 4 * n })
        }
      }
    }
  },
  octeractAutoPotionEfficiency: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level)
    },
    maxLevel: 100,
    costPerLevel: 1e-10 * Math.pow(10, 0.5),
    effect: (n: number) => {
      return {
        bonus: 1 + 2 * n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractAutoPotionEfficiency.effect', { n: 2 * n })
        }
      }
    }
  },
  octeractOneMindImprover: {
    costFormula: (level: number, baseCost: number) => {
      const fasterMult = (level >= 10) ? (Math.pow(1e3, level - 10)) : 1
      return baseCost * Math.pow(1e5, level) * fasterMult
    },
    maxLevel: 16,
    costPerLevel: 1e25,
    effect: (n: number) => {
      return {
        bonus: 0.55 + n / 150,
        get desc () {
          return i18next.t('octeract.data.octeractOneMindImprover.effect', { n: format(0.55 + n / 150, 3, true) })
        }
      }
    },
    qualityOfLife: true
  },
  octeractAmbrosiaLuck: {
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(10, useLevel) - Math.pow(10, useLevel - 1))
    },
    maxLevel: -1,
    costPerLevel: 1e60 / 9,
    effect: (n: number) => {
      return {
        bonus: 4 * n,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaLuck.effect', { n: format(4 * n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('OcteractBerries')]
  },
  octeractAmbrosiaLuck2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 6) - Math.pow(level, 6))
    },
    maxLevel: 30,
    costPerLevel: 1,
    effect: (n: number) => {
      return {
        bonus: 2 * n,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaLuck2.effect', { n: format(2 * n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('OcteractBerries')]
  },
  octeractAmbrosiaLuck3: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 8) - Math.pow(level, 8))
    },
    maxLevel: 30,
    costPerLevel: 1e30,
    effect: (n: number) => {
      return {
        bonus: 3 * n,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaLuck3.effect', { n: format(3 * n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('OcteractBerries')]
  },
  octeractAmbrosiaLuck4: {
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(3, useLevel) - Math.pow(3, useLevel - 1))
    },
    maxLevel: 50,
    costPerLevel: 1e70 / 2,
    effect: (n: number) => {
      return {
        bonus: 5 * n,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaLuck4.effect', { n: format(5 * n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaLuck.updateVal('OcteractBerries')]
  },
  octeractAmbrosiaGeneration: {
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(10, useLevel) - Math.pow(10, useLevel - 1))
    },
    maxLevel: -1,
    costPerLevel: 1e60 / 9,
    effect: (n: number) => {
      return {
        bonus: 1 + n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaGeneration.effect', { n: format(n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaGeneration.updateVal('OcteractBerries')]
  },
  octeractAmbrosiaGeneration2: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 6) - Math.pow(level, 6))
    },
    maxLevel: 20,
    costPerLevel: 1,
    effect: (n: number) => {
      return {
        bonus: 1 + n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaGeneration2.effect', { n: format(n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaGeneration.updateVal('OcteractBerries')]
  },
  octeractAmbrosiaGeneration3: {
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 8) - Math.pow(level, 8))
    },
    maxLevel: 35,
    costPerLevel: 1e30,
    effect: (n: number) => {
      return {
        bonus: 1 + n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaGeneration3.effect', { n: format(n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaGeneration.updateVal('OcteractBerries')]
  },
  octeractAmbrosiaGeneration4: {
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(3, useLevel) - Math.pow(3, useLevel - 1))
    },
    maxLevel: 50,
    costPerLevel: 1e70 / 2,
    effect: (n: number) => {
      return {
        bonus: 1 + 2 * n / 100,
        get desc () {
          return i18next.t('octeract.data.octeractAmbrosiaGeneration4.effect', { n: format(2 * n) })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [() => player.caches.ambrosiaGeneration.updateVal('OcteractBerries')]
  }
}
