import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import type { IUpgradeData } from './DynamicUpgrade'
import { DynamicUpgrade } from './DynamicUpgrade'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Prompt, revealStuff } from './UpdateHTML'
import { toOrdinal } from './Utility'

export const updateSingularityPenalties = (): void => {
  const singularityCount = player.singularityCount
  const platonic = singularityCount > 36
    ? i18next.t('singularity.penalties.platonicCosts', {
      multiplier: format(
        calculateSingularityDebuff('Platonic Costs', singularityCount),
        2,
        true
      )
    })
    : '<span class="grayText">???????? ??????? ????? ??? ?????????? ?? ???</span> <span class="redText">(37)</span>'
  const hepteract = singularityCount > 50
    ? i18next.t('singularity.penalties.hepteractCosts', {
      multiplier: format(
        calculateSingularityDebuff('Hepteract Costs', singularityCount),
        2,
        true
      )
    })
    : '<span class="grayText">????????? ????? ????? ??? ?????????? ?? ???</span> <span class="redText">(51)</span>'
  const str = `${getSingularityOridnalText(singularityCount)}<br>${
    i18next.t(
      'singularity.penalties.globalSpeed',
      {
        divisor: format(
          calculateSingularityDebuff('Global Speed', singularityCount),
          2,
          true
        )
      }
    )
  }
        ${
    i18next.t('singularity.penalties.ascensionSpeed', {
      divisor: format(
        calculateSingularityDebuff('Ascension Speed', singularityCount),
        2,
        true
      )
    })
  }
        ${
    i18next.t('singularity.penalties.offeringGain', {
      divisor: format(
        calculateSingularityDebuff('Offering', singularityCount),
        2,
        true
      )
    })
  }
        ${
    i18next.t('singularity.penalties.obtainiumGain', {
      divisor: format(
        calculateSingularityDebuff('Obtainium', singularityCount),
        2,
        true
      )
    })
  }
        ${
    i18next.t('singularity.penalties.cubeGain', {
      divisor: format(
        calculateSingularityDebuff('Cubes', singularityCount),
        2,
        true
      )
    })
  }
        ${
    i18next.t('singularity.penalties.researchCosts', {
      multiplier: format(
        calculateSingularityDebuff('Researches', singularityCount),
        2,
        true
      )
    })
  }
        ${
    i18next.t('singularity.penalties.cubeUpgradeCosts', {
      multiplier: format(
        calculateSingularityDebuff('Cube Upgrades', singularityCount),
        2,
        true
      )
    })
  }
        ${platonic}
        ${hepteract}
        ${
    singularityCount >= 270
      ? i18next.t('singularity.penalties.penaltySmooth')
      : i18next.t('singularity.penalties.penaltyRough', {
        num: format(
          calculateNextSpike(player.singularityCount),
          0,
          true
        )
      })
  }
        ${
    player.runelevels[6] > 0
      ? i18next.t('singularity.penalties.antiquitiesBought')
      : i18next.t('singularity.penalties.antiquitiesNotBought')
  }`

  DOMCacheGetOrSet('singularityPenaltiesMultiline').innerHTML = str
}

function getSingularityOridnalText (singularityCount: number): string {
  return i18next.t('general.youAreInThe', {
    number: toOrdinal(singularityCount)
  })
}

// Need a better way of handling the ones without a special formulae than 'Default' variant
type SingularitySpecialCostFormulae =
  | 'Default'
  | 'Quadratic'
  | 'Cubic'
  | 'Exponential2'

export interface ISingularityData extends Omit<IUpgradeData, 'name' | 'description'> {
  goldenQuarksInvested?: number
  minimumSingularity?: number
  canExceedCap?: boolean
  specialCostForm?: SingularitySpecialCostFormulae
  qualityOfLife?: boolean
  cacheUpdates?: (() => void)[] // TODO: Improve this type signature -Plat
}

/**
 * Singularity Upgrades are bought in the Shop of the singularity tab, and all have their own
 * name, description, level and maxlevel, plus a feature to toggle buy on each.
 */
export class SingularityUpgrade extends DynamicUpgrade {
  // Field Initialization
  public goldenQuarksInvested = 0
  public minimumSingularity: number
  public canExceedCap: boolean
  public specialCostForm: SingularitySpecialCostFormulae
  public qualityOfLife: boolean
  readonly cacheUpdates: (() => void)[] | undefined

  public constructor (data: ISingularityData, key: string) {
    const name = i18next.t(`singularity.data.${key}.name`)
    const description = i18next.t(`singularity.data.${key}.description`)

    super({ ...data, name, description })
    this.goldenQuarksInvested = data.goldenQuarksInvested ?? 0
    this.minimumSingularity = data.minimumSingularity ?? 0
    this.canExceedCap = data.canExceedCap ?? false
    this.specialCostForm = data.specialCostForm ?? 'Default'
    this.qualityOfLife = data.qualityOfLife ?? false
    this.cacheUpdates = data.cacheUpdates ?? undefined
  }

  /**
   * Given an upgrade, give a concise information regarding its data.
   * @returns A string that details the name, description, level statistic, and next level cost.
   */
  toString (): string {
    const costNextLevel = this.getCostTNL()
    const maxLevel = this.maxLevel === -1 ? '' : `/${format(this.computeMaxLevel(), 0, true)}`
    const color = this.computeMaxLevel() === this.level ? 'plum' : 'white'
    const minReqColor = player.highestSingularityCount < this.minimumSingularity
      ? 'var(--crimson-text-color)'
      : 'var(--green-text-color)'
    const minimumSingularity = this.minimumSingularity > 0
      ? `${i18next.t('general.minimum')} Singularity: ${this.minimumSingularity}`
      : i18next.t('singularity.toString.noMinimum')

    let freeLevelInfo = this.freeLevels > 0
      ? `<span style="color: orange"> [+${
        format(
          this.freeLevels,
          2,
          true
        )
      }]</span>`
      : ''

    if (this.freeLevels > this.level) {
      freeLevelInfo = `${freeLevelInfo}<span style="color: var(--maroon-text-color)"> ${
        i18next.t(
          'general.softCapped'
        )
      }</span>`
    }

    return `<span style="color: gold">${this.name}</span>
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${minReqColor}">${minimumSingularity}</span>
                <span style="color: ${color}"> ${
      i18next.t(
        'general.level'
      )
    } ${format(this.level, 0, true)}${maxLevel}${freeLevelInfo}</span>
                <span style="color: gold">${this.getEffect().desc}</span>
                ${i18next.t('singularity.toString.costNextLevel')}: ${
      format(
        costNextLevel,
        0,
        true
      )
    } Golden Quarks.
                ${i18next.t('general.spent')} Quarks: ${
      format(
        this.goldenQuarksInvested,
        0,
        true
      )
    }`
  }

  public updateUpgradeHTML (): void {
    DOMCacheGetOrSet('testingMultiline').innerHTML = this.toString()
  }

  /**
   * Retrieves the cost for upgrading the singularity upgrade once. Return 0 if maxed.
   * @returns A number representing how many Golden Quarks a player must have to upgrade once.
   */
  getCostTNL (): number {
    let costMultiplier = 1
    if (this.computeMaxLevel() > this.maxLevel && this.level >= this.maxLevel) {
      costMultiplier *= Math.pow(4, this.level - this.maxLevel + 1)
    }

    if (this.specialCostForm === 'Exponential2') {
      return (
        this.costPerLevel * Math.sqrt(costMultiplier) * Math.pow(2, this.level)
      )
    }

    if (this.specialCostForm === 'Cubic') {
      return (
        this.costPerLevel
        * costMultiplier
        * (Math.pow(this.level + 1, 3) - Math.pow(this.level, 3))
      )
    }

    if (this.specialCostForm === 'Quadratic') {
      return (
        this.costPerLevel
        * costMultiplier
        * (Math.pow(this.level + 1, 2) - Math.pow(this.level, 2))
      )
    }

    costMultiplier *= this.maxLevel === -1 && this.level >= 100 ? this.level / 50 : 1
    costMultiplier *= this.maxLevel === -1 && this.level >= 400 ? this.level / 100 : 1

    return this.computeMaxLevel() === this.level
      ? 0
      : Math.ceil(this.costPerLevel * (1 + this.level) * costMultiplier)
  }

  /**
   * Buy levels up until togglebuy or maxed.
   * @returns An alert indicating cannot afford, already maxed or purchased with how many
   *          levels purchased
   */
  public async buyLevel (event: MouseEvent): Promise<void> {
    let purchased = 0
    let maxPurchasable = 1
    let GQBudget = player.goldenQuarks

    if (event.shiftKey) {
      maxPurchasable = 100000
      const buy = Number(
        await Prompt(
          i18next.t('singularity.goldenQuarks.spendPrompt', {
            gq: format(player.goldenQuarks, 0, true)
          })
        )
      )

      if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
        // nan + Infinity checks
        return Alert(i18next.t('general.validation.finite'))
      }

      if (buy === -1) {
        GQBudget = player.goldenQuarks
      } else if (buy <= 0) {
        return Alert(i18next.t('general.validation.zeroOrLess'))
      } else {
        GQBudget = buy
      }
      GQBudget = Math.min(player.goldenQuarks, GQBudget)
    }

    if (this.maxLevel > 0) {
      maxPurchasable = Math.min(
        maxPurchasable,
        this.computeMaxLevel() - this.level
      )
    }

    if (maxPurchasable === 0) {
      return Alert(i18next.t('singularity.goldenQuarks.hasUpgrade'))
    }

    if (player.highestSingularityCount < this.minimumSingularity) {
      return Alert(i18next.t('singularity.goldenQuarks.notHighEnoughLevel'))
    }
    while (maxPurchasable > 0) {
      const cost = this.getCostTNL()
      if (player.goldenQuarks < cost || GQBudget < cost) {
        break
      } else {
        player.goldenQuarks -= cost
        GQBudget -= cost
        this.goldenQuarksInvested += cost
        this.level += 1
        purchased += 1
        maxPurchasable -= 1
      }
      if (this.name === player.singularityUpgrades.oneMind.name) {
        player.ascensionCounter = 0
        player.ascensionCounterReal = 0
        player.ascensionCounterRealReal = 0
        void Alert(i18next.t('singularity.goldenQuarks.ascensionReset'))
      }

      if (this.name === player.singularityUpgrades.singCitadel2.name) {
        player.singularityUpgrades.singCitadel.freeLevels = player.singularityUpgrades.singCitadel2.level
      }

      if (this.name === player.singularityUpgrades.blueberries.name) {
        player.caches.ambrosiaGeneration.updateVal('SingularityBerries')
      }
    }

    if (purchased === 0) {
      return Alert(i18next.t('general.validation.moreThanPlayerHas'))
    }
    if (purchased > 1) {
      void Alert(
        i18next.t('singularity.goldenQuarks.multiBuyPurchased', {
          levels: format(purchased)
        })
      )
    }

    this.updateUpgradeHTML()
    this.updateCaches()
    updateSingularityPenalties()
    updateSingularityPerks()
    revealStuff()
  }

  public computeFreeLevelSoftcap (): number {
    return (
      Math.min(this.level, this.freeLevels)
      + Math.sqrt(Math.max(0, this.freeLevels - this.level))
    )
  }

  public computeMaxLevel (): number {
    if (!this.canExceedCap) {
      return this.maxLevel
    } else {
      let cap = this.maxLevel
      const overclockPerks = [50, 60, 75, 100, 125, 150, 175, 200, 225, 250]
      for (const perk of overclockPerks) {
        if (player.highestSingularityCount >= perk) {
          cap += 1
        } else {
          break
        }
      }
      cap += +player.octeractUpgrades.octeractSingUpgradeCap.getEffect().bonus
      return cap
    }
  }

  public actualTotalLevels (): number {
    if (
      player.singularityChallenges.noSingularityUpgrades.enabled
      && !this.qualityOfLife
    ) {
      return 0
    }

    if (
      player.singularityChallenges.limitedAscensions.enabled
      && this.name === player.singularityUpgrades.platonicDelta.name
    ) {
      return 0
    }

    const actualFreeLevels = this.computeFreeLevelSoftcap()
    const linearLevels = this.level + actualFreeLevels
    let polynomialLevels = 0
    if (player.octeractUpgrades.octeractImprovedFree.getEffect().bonus) {
      let exponent = 0.6
      exponent += +player.octeractUpgrades.octeractImprovedFree2.getEffect().bonus
      exponent += +player.octeractUpgrades.octeractImprovedFree3.getEffect().bonus
      exponent += +player.octeractUpgrades.octeractImprovedFree4.getEffect().bonus
      polynomialLevels = Math.pow(this.level * actualFreeLevels, exponent)
    }

    return Math.max(linearLevels, polynomialLevels)
  }

  public getEffect (): { bonus: number | boolean; desc: string } {
    return this.effect(this.actualTotalLevels())
  }

  updateCaches (): void {
    if (this.cacheUpdates !== undefined) {
      for (const cache of this.cacheUpdates) {
        cache()
      }
    }
  }

  public refund (): void {
    player.goldenQuarks += this.goldenQuarksInvested
    this.level = 0
    this.goldenQuarksInvested = 0
  }
}

export const singularityData: Record<
  keyof Player['singularityUpgrades'],
  ISingularityData
> = {
  goldenQuarks1: {
    maxLevel: 15,
    costPerLevel: 12,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.1 * n,
        get desc () {
          return i18next.t('singularity.data.goldenQuarks1.effect', {
            n: format(10 * n, 0, true)
          })
        }
      }
    },
    qualityOfLife: true
  },
  goldenQuarks2: {
    maxLevel: 75,
    costPerLevel: 60,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: n > 250 ? 1 / Math.log2(n / 62.5) : 1 - Math.min(0.5, n / 500),
        get desc () {
          return i18next.t('singularity.data.goldenQuarks2.effect', {
            n: n > 250
              ? format(100 - 100 / Math.log2(n / 62.5), 2, true)
              : format(Math.min(50, n / 5), 2, true)
          })
        }
      }
    },
    qualityOfLife: true
  },
  goldenQuarks3: {
    maxLevel: 1000,
    costPerLevel: 1000,
    effect: (n: number) => {
      return {
        bonus: (n * (n + 1)) / 2,
        get desc () {
          return i18next.t('singularity.data.goldenQuarks3.effect', {
            n: format((n * (n + 1)) / 2)
          })
        }
      }
    }
  },
  starterPack: {
    maxLevel: 1,
    costPerLevel: 10,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.starterPack.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    }
  },
  wowPass: {
    maxLevel: 1,
    costPerLevel: 350,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.wowPass.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  cookies: {
    maxLevel: 1,
    costPerLevel: 100,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.cookies.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  cookies2: {
    maxLevel: 1,
    costPerLevel: 500,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.cookies2.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  cookies3: {
    maxLevel: 1,
    costPerLevel: 24999,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.cookies3.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  cookies4: {
    maxLevel: 1,
    costPerLevel: 499999,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.cookies4.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  cookies5: {
    maxLevel: 1,
    costPerLevel: 1.66e15,
    minimumSingularity: 209,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.cookies5.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  ascensions: {
    maxLevel: -1,
    costPerLevel: 5,
    effect: (n: number) => {
      return {
        bonus: (1 + (2 * n) / 100) * (1 + Math.floor(n / 10) / 100),
        get desc () {
          return i18next.t('singularity.data.ascensions.effect', {
            n: format(
              (100 + 2 * n) * (1 + Math.floor(n / 10) / 100) - 100,
              1,
              true
            )
          })
        }
      }
    }
  },
  corruptionFourteen: {
    maxLevel: 1,
    costPerLevel: 1000,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.corruptionFourteen.effect${n > 0 ? 'Have' : 'HaveNot'}`,
            {
              m: n > 0 ? ':)' : ':('
            }
          )
        }
      }
    }
  },
  corruptionFifteen: {
    maxLevel: 1,
    costPerLevel: 40000,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.corruptionFifteen.effect${n > 0 ? 'Have' : 'HaveNot'}`,
            {
              m: n > 0 ? ':)' : ':('
            }
          )
        }
      }
    }
  },
  singOfferings1: {
    maxLevel: -1,
    costPerLevel: 1,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.02 * n,
        get desc () {
          return i18next.t('singularity.data.singOfferings1.effect', {
            n: format(2 * n, 0, true)
          })
        }
      }
    }
  },
  singOfferings2: {
    maxLevel: 25,
    costPerLevel: 25,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.08 * n,
        get desc () {
          return i18next.t('singularity.data.singOfferings2.effect', {
            n: format(8 * n, 0, true)
          })
        }
      }
    }
  },
  singOfferings3: {
    maxLevel: 40,
    costPerLevel: 500,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.04 * n,
        get desc () {
          return i18next.t('singularity.data.singOfferings3.effect', {
            n: format(4 * n, 0, true)
          })
        }
      }
    }
  },
  singObtainium1: {
    maxLevel: -1,
    costPerLevel: 1,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.02 * n,
        get desc () {
          return i18next.t('singularity.data.singObtainium1.effect', {
            n: format(2 * n, 0, true)
          })
        }
      }
    }
  },
  singObtainium2: {
    maxLevel: 25,
    costPerLevel: 25,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.08 * n,
        get desc () {
          return i18next.t('singularity.data.singObtainium2.effect', {
            n: format(8 * n, 0, true)
          })
        }
      }
    }
  },
  singObtainium3: {
    maxLevel: 40,
    costPerLevel: 500,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.04 * n,
        get desc () {
          return i18next.t('singularity.data.singObtainium3.effect', {
            n: format(4 * n, 0, true)
          })
        }
      }
    }
  },
  singCubes1: {
    maxLevel: -1,
    costPerLevel: 1,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.01 * n,
        get desc () {
          return i18next.t('singularity.data.singCubes1.effect', {
            n: format(1 * n, 0, true)
          })
        }
      }
    }
  },
  singCubes2: {
    maxLevel: 25,
    costPerLevel: 25,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.08 * n,
        get desc () {
          return i18next.t('singularity.data.singCubes2.effect', {
            n: format(8 * n, 0, true)
          })
        }
      }
    }
  },
  singCubes3: {
    maxLevel: 40,
    costPerLevel: 500,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.04 * n,
        get desc () {
          return i18next.t('singularity.data.singCubes3.effect', {
            n: format(4 * n, 0, true)
          })
        }
      }
    }
  },
  singCitadel: {
    maxLevel: -1,
    costPerLevel: 500000,
    minimumSingularity: 100,
    effect: (n: number) => {
      return {
        bonus: (1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100),
        get desc () {
          return i18next.t('singularity.data.singCubes2.effect', {
            n: format(
              100 * ((1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100) - 1)
            )
          })
        }
      }
    }
  },
  singCitadel2: {
    maxLevel: 100,
    costPerLevel: 1e14,
    minimumSingularity: 204,
    specialCostForm: 'Quadratic',
    effect: (n: number) => {
      return {
        bonus: (1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100),
        get desc () {
          return i18next.t('singularity.data.singCubes3.effect', {
            n: format(
              100 * ((1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100) - 1)
            )
          })
        }
      }
    }
  },
  octeractUnlock: {
    maxLevel: 1,
    costPerLevel: 8888,
    minimumSingularity: 8,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.octeractUnlock.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  singOcteractPatreonBonus: {
    maxLevel: 1,
    costPerLevel: 9999,
    minimumSingularity: 12,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t('singularity.data.singOcteractPatreonBonus.effect', {
            n
          })
        }
      }
    }
  },
  offeringAutomatic: {
    maxLevel: -1,
    costPerLevel: 1e14,
    minimumSingularity: 222,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.offeringAutomatic.effect', { n })
        }
      }
    }
  },
  intermediatePack: {
    maxLevel: 1,
    costPerLevel: 1,
    minimumSingularity: 4,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.intermediatePack.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    }
  },
  advancedPack: {
    maxLevel: 1,
    costPerLevel: 200,
    minimumSingularity: 9,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.advancedPack.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    }
  },
  expertPack: {
    maxLevel: 1,
    costPerLevel: 800,
    minimumSingularity: 16,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.expertPack.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    }
  },
  masterPack: {
    maxLevel: 1,
    costPerLevel: 3200,
    minimumSingularity: 25,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.masterPack.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    }
  },
  divinePack: {
    maxLevel: 1,
    costPerLevel: 12800,
    minimumSingularity: 36,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.divinePack.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    }
  },
  wowPass2: {
    maxLevel: 1,
    costPerLevel: 19999,
    minimumSingularity: 11,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.wowPass2.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  wowPass3: {
    maxLevel: 1,
    costPerLevel: 3e7 - 1,
    minimumSingularity: 83,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.wowPass3.effect${n > 0 ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  potionBuff: {
    maxLevel: 10,
    costPerLevel: 999,
    minimumSingularity: 4,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: Math.max(1, 10 * Math.pow(n, 2)),
        get desc () {
          return i18next.t('singularity.data.potionBuff.effect', {
            n: format(Math.max(1, 10 * Math.pow(n, 2)), 0, true)
          })
        }
      }
    }
  },
  potionBuff2: {
    maxLevel: 10,
    costPerLevel: 1e8,
    minimumSingularity: 119,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: Math.max(1, 2 * n),
        get desc () {
          return i18next.t('singularity.data.potionBuff2.effect', {
            n: format(Math.max(1, 2 * n), 0, true)
          })
        }
      }
    }
  },
  potionBuff3: {
    maxLevel: 10,
    costPerLevel: 1e12,
    minimumSingularity: 191,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: Math.max(1, 1 + 0.5 * n),
        get desc () {
          return i18next.t('singularity.data.potionBuff3.effect', {
            n: format(Math.max(1, 1 + 0.5 * n), 2, true)
          })
        }
      }
    }
  },
  singChallengeExtension: {
    maxLevel: 4,
    costPerLevel: 999,
    minimumSingularity: 11,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.singChallengeExtension.effect', {
            n: 2 * n,
            m: n
          })
        }
      }
    }
  },
  singChallengeExtension2: {
    maxLevel: 3,
    costPerLevel: 29999,
    minimumSingularity: 26,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.singChallengeExtension2.effect', {
            n: 2 * n,
            m: n
          })
        }
      }
    }
  },
  singChallengeExtension3: {
    maxLevel: 3,
    costPerLevel: 749999,
    minimumSingularity: 51,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.singChallengeExtension3.effect', {
            n: 2 * n,
            m: n
          })
        }
      }
    }
  },
  singQuarkImprover1: {
    maxLevel: 30,
    costPerLevel: 1,
    minimumSingularity: 173,
    canExceedCap: true,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return {
        bonus: n / 200,
        get desc () {
          return i18next.t('singularity.data.singQuarkImprover1.effect', {
            n: format(n / 2, 2, true)
          })
        }
      }
    },
    qualityOfLife: true
  },
  singQuarkHepteract: {
    maxLevel: 1,
    costPerLevel: 14999,
    minimumSingularity: 5,
    effect: (n: number) => {
      return {
        bonus: n / 100,
        get desc () {
          return i18next.t('singularity.data.singQuarkHepteract.effect', {
            n: format(2 * n, 2, true)
          })
        }
      }
    },
    qualityOfLife: true
  },
  singQuarkHepteract2: {
    maxLevel: 1,
    costPerLevel: 449999,
    minimumSingularity: 30,
    effect: (n: number) => {
      return {
        bonus: n / 100,
        get desc () {
          return i18next.t('singularity.data.singQuarkHepteract2.effect', {
            n: format(2 * n, 2, true)
          })
        }
      }
    },
    qualityOfLife: true
  },
  singQuarkHepteract3: {
    maxLevel: 1,
    costPerLevel: 13370000,
    minimumSingularity: 61,
    effect: (n: number) => {
      return {
        bonus: n / 100,
        get desc () {
          return i18next.t('singularity.data.singQuarkHepteract3.effect', {
            n: format(2 * n, 2, true)
          })
        }
      }
    },
    qualityOfLife: true
  },
  singOcteractGain: {
    maxLevel: -1,
    costPerLevel: 20000,
    minimumSingularity: 36,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.0125 * n,
        get desc () {
          return i18next.t('singularity.data.singOcteractGain.effect', {
            n: format(1.25 * n, 2, true)
          })
        }
      }
    }
  },
  singOcteractGain2: {
    maxLevel: 25,
    costPerLevel: 40000,
    minimumSingularity: 36,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.05 * n,
        get desc () {
          return i18next.t('singularity.data.singOcteractGain2.effect', {
            n: format(5 * n, 0, true)
          })
        }
      }
    }
  },
  singOcteractGain3: {
    maxLevel: 50,
    costPerLevel: 250000,
    minimumSingularity: 55,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.025 * n,
        get desc () {
          return i18next.t('singularity.data.singOcteractGain3.effect', {
            n: format(2.5 * n, 0, true)
          })
        }
      }
    }
  },
  singOcteractGain4: {
    maxLevel: 100,
    costPerLevel: 750000,
    minimumSingularity: 77,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.02 * n,
        get desc () {
          return i18next.t('singularity.data.singOcteractGain4.effect', {
            n: format(2 * n, 0, true)
          })
        }
      }
    }
  },
  singOcteractGain5: {
    maxLevel: 200,
    costPerLevel: 7777777,
    minimumSingularity: 100,
    canExceedCap: true,
    effect: (n: number) => {
      return {
        bonus: 1 + 0.01 * n,
        get desc () {
          return i18next.t('singularity.data.singOcteractGain5.effect', {
            n: format(n, 0, true)
          })
        }
      }
    }
  },
  platonicTau: {
    maxLevel: 1,
    costPerLevel: 100000,
    minimumSingularity: 29,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.platonicTau.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  platonicAlpha: {
    maxLevel: 1,
    costPerLevel: 2e7,
    minimumSingularity: 70,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.platonicAlpha.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  platonicDelta: {
    maxLevel: 1,
    costPerLevel: 5e9,
    minimumSingularity: 110,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.platonicDelta.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    }
  },
  platonicPhi: {
    maxLevel: 1,
    costPerLevel: 2e11,
    minimumSingularity: 149,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.platonicPhi.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  singFastForward: {
    maxLevel: 1,
    costPerLevel: 7e6 - 1,
    minimumSingularity: 50,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.singFastForward.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  singFastForward2: {
    maxLevel: 1,
    costPerLevel: 1e11 - 1,
    minimumSingularity: 147,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.singFastForward2.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  singAscensionSpeed: {
    maxLevel: 1,
    costPerLevel: 1e10,
    minimumSingularity: 128,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.singAscensionSpeed.effect', {
            n: format(1 + 0.03 * n, 2, true),
            m: format(1 - 0.03 * n, 2, true)
          })
        }
      }
    }
  },
  singAscensionSpeed2: {
    maxLevel: 1,
    costPerLevel: 1e12,
    minimumSingularity: 147,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.singAscensionSpeed2.effect')
        }
      }
    }
  },
  WIP: {
    maxLevel: 100,
    costPerLevel: 1e300,
    minimumSingularity: 251,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.WIP.effect')
        }
      }
    }
  },
  ultimatePen: {
    maxLevel: 1,
    costPerLevel: 2.22e22,
    minimumSingularity: 300,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t('singularity.data.ultimatePen.effect', {
            n: n ? '' : 'NOT',
            m: n > 0
              ? ' However, the pen just ran out of ink. How will you get more?'
              : ''
          })
        }
      }
    }
  },
  oneMind: {
    maxLevel: 1,
    costPerLevel: 1.66e13,
    minimumSingularity: 162,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.oneMind.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  wowPass4: {
    maxLevel: 1,
    costPerLevel: 66666666666,
    minimumSingularity: 147,
    effect: (n: number) => {
      return {
        bonus: n > 0,
        get desc () {
          return i18next.t(
            `singularity.data.wowPass4.effect${n ? 'Have' : 'HaveNot'}`
          )
        }
      }
    },
    qualityOfLife: true
  },
  blueberries: {
    maxLevel: 10,
    costPerLevel: 1e16,
    minimumSingularity: 215,
    effect: (n: number) => {
      return {
        bonus: n,
        get desc () {
          return i18next.t('singularity.data.blueberries.effect', { n })
        }
      }
    },
    specialCostForm: 'Exponential2',
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.blueberryInventory.updateVal('SingularityUpgrade')
    ]
  },
  singAmbrosiaLuck: {
    maxLevel: -1,
    costPerLevel: 1e9,
    minimumSingularity: 187,
    effect: (n: number) => {
      return {
        bonus: 4 * n,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaLuck.effect', {
            n: format(4 * n)
          })
        }
      }
    },
    specialCostForm: 'Exponential2',
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('SingularityBerries')
    ]
  },
  singAmbrosiaLuck2: {
    maxLevel: 30,
    costPerLevel: 4e5,
    minimumSingularity: 50,
    effect: (n: number) => {
      return {
        bonus: 2 * n,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaLuck2.effect', {
            n: format(2 * n)
          })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('SingularityBerries')
    ]
  },
  singAmbrosiaLuck3: {
    maxLevel: 30,
    costPerLevel: 2e8,
    minimumSingularity: 119,
    effect: (n: number) => {
      return {
        bonus: 3 * n,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaLuck3.effect', {
            n: format(3 * n)
          })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('SingularityBerries')
    ]
  },
  singAmbrosiaLuck4: {
    maxLevel: 50,
    costPerLevel: 1e19,
    minimumSingularity: 256,
    effect: (n: number) => {
      return {
        bonus: 5 * n,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaLuck4.effect', {
            n: format(5 * n)
          })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaLuck.updateVal('SingularityBerries')
    ]
  },
  singAmbrosiaGeneration: {
    maxLevel: -1,
    costPerLevel: 1e9,
    minimumSingularity: 187,
    effect: (n: number) => {
      return {
        bonus: 1 + n / 100,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaGeneration.effect', {
            n: format(n)
          })
        }
      }
    },
    specialCostForm: 'Exponential2',
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaGeneration.updateVal('SingularityBerries')
    ]
  },
  singAmbrosiaGeneration2: {
    maxLevel: 20,
    costPerLevel: 8e5,
    minimumSingularity: 50,
    effect: (n: number) => {
      return {
        bonus: 1 + n / 100,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaGeneration2.effect', {
            n: format(n)
          })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaGeneration.updateVal('SingularityBerries')
    ]
  },
  singAmbrosiaGeneration3: {
    maxLevel: 35,
    costPerLevel: 3e8,
    minimumSingularity: 119,
    effect: (n: number) => {
      return {
        bonus: 1 + n / 100,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaGeneration3.effect', {
            n: format(n)
          })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaGeneration.updateVal('SingularityBerries')
    ]
  },
  singAmbrosiaGeneration4: {
    maxLevel: 50,
    costPerLevel: 1e19,
    minimumSingularity: 256,
    effect: (n: number) => {
      return {
        bonus: 1 + (2 * n) / 100,
        get desc () {
          return i18next.t('singularity.data.singAmbrosiaGeneration4.effect', {
            n: format(2 * n)
          })
        }
      }
    },
    qualityOfLife: true,
    cacheUpdates: [
      () => player.caches.ambrosiaGeneration.updateVal('SingularityBerries')
    ]
  }
}

/**
 * Singularity Perks are automatically obtained and upgraded, based on player.singularityCount
 * They can have one or several levels with a description for each level
 */
export class SingularityPerk {
  public readonly name: () => string
  public readonly levels: number[]
  public readonly description: (n: number, levels: number[]) => string
  public readonly ID: string

  public constructor (perk: SingularityPerk) {
    this.name = perk.name
    this.levels = perk.levels
    this.description = perk.description
    this.ID = perk.ID
  }
}

// List of Singularity Perks based on player.highestSingularityCount
// The list is ordered on first level acquisition, so be careful when inserting a new one ;)
export const singularityPerks: SingularityPerk[] = [
  {
    name: () => {
      return i18next.t('singularity.perkNames.welcometoSingularity')
    },
    levels: [1],
    description: () => {
      return i18next.t('singularity.perks.welcometoSingularity')
    },
    ID: 'welcometoSingularity'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.unlimitedGrowth')
    },
    levels: [1],
    description: () => {
      return i18next.t('singularity.perks.unlimitedGrowth', {
        amount: format(10 * player.singularityCount)
      })
    },
    ID: 'unlimitedGrowth'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.goldenCoins')
    },
    levels: [1],
    description: () => {
      return i18next.t('singularity.perks.goldenCoins', {
        amount: format(
          Math.pow(player.goldenQuarks + 1, 1.5)
            * Math.pow(player.highestSingularityCount + 1, 2),
          2
        )
      })
    },
    ID: 'goldenCoins'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.xyz')
    },
    levels: [1, 20, 200],
    description: (n: number, levels: number[]) => {
      if (n >= levels[2]) {
        return i18next.t('singularity.perks.xyz.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.xyz.hasLevel1')
      } else {
        return i18next.t('singularity.perks.xyz.default')
      }
    },
    ID: 'xyz'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.generousOrbs')
    },
    levels: [1, 2, 5, 10, 15, 20, 25, 30, 35],
    description: (n: number, levels: number[]) => {
      const overfluxBonus: Record<number, number> = {
        8: 700, // How to read: levels[8] -> Sing 35 gives 700%
        7: 500,
        6: 415,
        5: 360,
        4: 315,
        3: 280,
        2: 255,
        1: 230
      }

      for (let i = 8; i > 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.generousOrbs', {
            amount: overfluxBonus[i]
          })
        }
      }
      return i18next.t('singularity.perks.generousOrbs', { amount: '215' })
    },
    ID: 'generousOrbs'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.researchDummies')
    },
    levels: [1, 11],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.researchDummies.hasLevel1')
      } else {
        return i18next.t('singularity.perks.researchDummies.otherwise')
      }
    },
    ID: 'researchDummies'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.eternalAscensions')
    },
    levels: [1, 25],
    description: (n: number, levels: number[]) => {
      const amount = format(1 + player.singularityCount / 10, 1)
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.eternalAscensions.hasLevel1', {
          amount
        })
      } else {
        return i18next.t('singularity.perks.eternalAscensions.default', {
          amount
        })
      }
    },
    ID: 'eternalAscensions'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.antGodsCornucopia')
    },
    levels: [1, 30, 70, 100],
    description: (n: number, levels: number[]) => {
      if (n >= levels[3]) {
        return i18next.t('singularity.perks.antGodsCornucopia.hasLevel3')
      } else if (n >= levels[2]) {
        return i18next.t('singularity.perks.antGodsCornucopia.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.antGodsCornucopia.hasLevel1')
      } else {
        return i18next.t('singularity.perks.antGodsCornucopia.default')
      }
    },
    ID: 'antGodsCornucopia'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.sweepomatic')
    },
    levels: [2, 101],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.sweepomatic.hasLevel1')
      } else {
        return i18next.t('singularity.perks.sweepomatic.otherwise')
      }
    },
    ID: 'sweepomatic'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.superStart')
    },
    levels: [2, 3, 4, 7, 15],
    description: (n: number, levels: number[]) => {
      if (n >= levels[4]) {
        return i18next.t('singularity.perks.superStart.hasLevel4')
      } else if (n >= levels[3]) {
        return i18next.t('singularity.perks.superStart.hasLevel3')
      } else if (n >= levels[2]) {
        return i18next.t('singularity.perks.superStart.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.superStart.hasLevel1')
      } else {
        return i18next.t('singularity.perks.superStart.default')
      }
    },
    ID: 'superStart'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.notSoChallenging')
    },
    levels: [4, 7, 10, 15, 20],
    description: (n: number, levels: number[]) => {
      if (n >= levels[4]) {
        return i18next.t('singularity.perks.notSoChallenging.hasLevel4')
      } else if (n >= levels[3]) {
        return i18next.t('singularity.perks.notSoChallenging.hasLevel3')
      } else if (n >= levels[2]) {
        return i18next.t('singularity.perks.notSoChallenging.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.notSoChallenging.hasLevel1')
      } else {
        return i18next.t('singularity.perks.notSoChallenging.default')
      }
    },
    ID: 'notSoChallenging'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.automationUpgrades')
    },
    levels: [5, 10, 15, 25, 30, 100],
    description: (n: number, levels: number[]) => {
      if (n >= levels[5]) {
        return i18next.t('singularity.perks.automationUpgrades.hasLevel5')
      } else if (n >= levels[4]) {
        return i18next.t('singularity.perks.automationUpgrades.hasLevel4')
      } else if (n >= levels[3]) {
        return i18next.t('singularity.perks.automationUpgrades.hasLevel3')
      } else if (n >= levels[2]) {
        return i18next.t('singularity.perks.automationUpgrades.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.automationUpgrades.hasLevel1')
      } else {
        return i18next.t('singularity.perks.automationUpgrades.default')
      }
    },
    ID: 'automationUpgrades'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.evenMoreQuarks')
    },
    // dprint-ignore
    levels: [
      5, 7, 10, 20, 35, 50, 65, 80, 90, 100, 121, 144, 150, 160, 166, 169, 170,
      175, 180, 190, 196, 200, 201, 202, 203, 204, 205, 210, 212, 214, 216, 218,
      220, 225, 250, 255, 260, 261, 262,
    ],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.evenMoreQuarks.m', {
            stack: i + 1,
            inc: format(100 * (Math.pow(1.05, i + 1) - 1), 2)
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'evenMoreQuarks'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.shopSpecialOffer')
    },
    levels: [5, 20, 51],
    description: (n: number, levels: number[]) => {
      if (n >= levels[2]) {
        return i18next.t('singularity.perks.shopSpecialOffer.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.shopSpecialOffer.hasLevel1')
      } else {
        return i18next.t('singularity.perks.shopSpecialOffer.default')
      }
    },
    ID: 'shopSpecialOffer'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.potionAutogenerator')
    },
    levels: [6],
    description: () => {
      return i18next.t('singularity.perks.potionAutogenerator')
    },
    ID: 'potionAutogenerator'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.respecBeGone')
    },
    levels: [7],
    description: () => {
      return i18next.t('singularity.perks.respecBeGone')
    },
    ID: 'respecBeGone'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.forTheLoveOfTheAntGod')
    },
    levels: [10, 15, 25],
    description: (n: number, levels: number[]) => {
      if (n >= levels[2]) {
        return i18next.t('singularity.perks.forTheLoveOfTheAntGod.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.forTheLoveOfTheAntGod.hasLevel1')
      } else {
        return i18next.t('singularity.perks.forTheLoveOfTheAntGod.default')
      }
    },
    ID: 'forTheLoveOfTheAntGod'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.itAllAddsUp')
    },
    levels: [
      10,
      16,
      25,
      36,
      49,
      64,
      81,
      100,
      121,
      144,
      169,
      196,
      225,
      235,
      240
    ],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.itAllAddsUp', {
            div: format(1 + (i + 1) / 5, 2, true),
            div2: format(1 + (i + 1) / 5, 2, true),
            cap: format(1 + (i + 1) / 5, 2, true)
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'itAllAddsUp'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.automagicalRunes')
    },
    levels: [15, 30, 40, 50],
    description: (n: number, levels: number[]) => {
      if (n >= levels[3]) {
        return i18next.t('singularity.perks.automagicalRunes.hasLevel3')
      } else if (n >= levels[2]) {
        return i18next.t('singularity.perks.automagicalRunes.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.automagicalRunes.hasLevel1')
      } else {
        return i18next.t('singularity.perks.automagicalRunes.default')
      }
    },
    ID: 'automagicalRunes'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.derpSmithsCornucopia')
    },
    levels: [
      18,
      38,
      58,
      78,
      88,
      98,
      118,
      148,
      178,
      188,
      198,
      208,
      218,
      228,
      238,
      248
    ],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.derpSmithsCornucopia', {
            counter: i + 1
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'derpSmithsCornucopia'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.exaltedAchievements')
    },
    levels: [25],
    description: () => {
      return i18next.t('singularity.perks.exaltedAchievements')
    },
    ID: 'exaltedAchievements'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.coolQOLCubes')
    },
    levels: [25, 35],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.coolQOLCubes.hasLevel1')
      } else {
        return i18next.t('singularity.perks.coolQOLCubes.default')
      }
    },
    ID: 'coolQOLCubes'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.irishAnt')
    },
    levels: [35, 42, 49, 56, 63, 70, 77],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.irishAnt', { i: 5 * (i + 1) })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'irishAnt'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.overclocked')
    },
    levels: [50, 60, 75, 100, 125, 150, 175, 200, 225, 250],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.overclocked', { i: i + 1 })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'overclocked'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.wowCubeAutomatedShipping')
    },
    levels: [50, 150],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t(
          'singularity.perks.wowCubeAutomatedShipping.hasLevel1'
        )
      } else {
        return i18next.t('singularity.perks.wowCubeAutomatedShipping.default')
      }
    },
    ID: 'wowCubeAutomatedShipping'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.congealedblueberries')
    },
    levels: [64, 128, 192, 256, 270],
    description (n, levels) {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.congealedblueberries', {
            i: i + 1
          })
        }
      }
      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'congealedblueberries'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.goldenRevolution')
    },
    levels: [100],
    description: () => {
      return i18next.t('singularity.perks.goldenRevolution', {
        current: format(Math.min(100, 0.4 * player.singularityCount), 1)
      })
    },
    ID: 'goldenRevolution'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.goldenRevolutionII')
    },
    levels: [100],
    description: () => {
      return i18next.t('singularity.perks.goldenRevolutionII', {
        current: format(Math.min(50, 0.2 * player.singularityCount), 1)
      })
    },
    ID: 'goldenRevolution2'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.goldenRevolutionIII')
    },
    levels: [100],
    description: () => {
      return i18next.t('singularity.perks.goldenRevolutionIII', {
        current: format(Math.min(500, 2 * player.singularityCount))
      })
    },
    ID: 'goldenRevolution3'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.platonicClones')
    },
    levels: [100, 200],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.platonicClones.hasLevel1')
      } else {
        return i18next.t('singularity.perks.platonicClones.default')
      }
    },
    ID: 'platonicClones'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.dilatedFiveLeaf')
    },
    levels: [100, 200, 250, 260, 266],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.dilatedFiveLeaf.desc', {
            percent: i + 1
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'dilatedFiveLeaf'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.platSigma')
    },
    levels: [125, 200],
    description: (n: number, levels: number[]) => {
      let counter = 0
      for (const singCount of levels) {
        if (n >= singCount) {
          counter += 0.125
        }
      }

      return i18next.t('singularity.perks.platSigma', {
        counter,
        current: format(Math.min(60, counter * player.singularityCount), 1)
      })
    },
    ID: 'platSigma'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.oneHundredThirtyOne')
    },
    levels: [131],
    description: () => {
      return i18next.t('singularity.perks.oneHundredThirtyOne')
    },
    ID: 'oneHundredThirtyOne'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.irishAnt2')
    },
    levels: [135, 142, 149, 156, 163, 170, 177],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.irishAnt2', { i: 6 * (i + 1) })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'irishAnt2'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.midasMilleniumAgedGold')
    },
    levels: [150],
    description: () => {
      return i18next.t('singularity.perks.midasMilleniumAgedGold')
    },
    ID: 'midasMilleniumAgedGold'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.goldenRevolution4')
    },
    levels: [160, 173, 185, 194, 204, 210, 219, 229, 240, 249],
    description: (n: number, levels: number[]) => {
      const perSecond = 1000000
      let divisor = 0
      for (const singCount of levels) {
        if (n >= singCount) {
          divisor += 1
        }
      }

      return i18next.t('singularity.perks.goldenRevolution4', {
        gq: format(perSecond / divisor, 0, true)
      })
    },
    ID: 'goldenRevolution4'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.octeractMetagenesis')
    },
    levels: [200, 205],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.octeractMetagenesis.hasLevel1')
      } else {
        return i18next.t('singularity.perks.octeractMetagenesis.default')
      }
    },
    ID: 'octeractMetagenesis'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.immaculateAlchemy')
    },
    levels: [200, 208, 221],
    description: (n: number, levels: number[]) => {
      if (n >= levels[2]) {
        return i18next.t('singularity.perks.immaculateAlchemy.hasLevel2')
      } else if (n >= levels[1]) {
        return i18next.t('singularity.perks.immaculateAlchemy.hasLevel1')
      } else {
        return i18next.t('singularity.perks.immaculateAlchemy.default')
      }
    },
    ID: 'immaculateAlchemy'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.skrauQ')
    },
    levels: [200],
    description: () => {
      const amt = format(Math.pow((player.singularityCount - 179) / 20, 2), 4)
      return i18next.t('singularity.perks.skrauQ', { amt })
    },
    ID: 'skrauQ'
  },
  {
    name: () => {
      return i18next.t('singularity.perkNames.twoHundredSixtyNine')
    },
    levels: [269],
    description: () => {
      return i18next.t('singularity.perks.twoHundredSixtyNine')
    },
    ID: 'twoHundredSixtyNine'
  }
]

// Placeholder text for Perk Info that is seen upon first load, check Line 645 EventListeners.ts for actual Perk Info code.
export const updateSingularityPerks = (): void => {
  const singularityCount = player.highestSingularityCount
  DOMCacheGetOrSet('singularityPerksHeader').innerHTML = i18next.t(
    'singularity.perks.header',
    {
      ord: toOrdinal(singularityCount)
    }
  )
  DOMCacheGetOrSet('singularityPerksText').innerHTML = i18next.t(
    'singularity.perks.levelInfo',
    {
      level: '#',
      singularity: '#'
    }
  )
  DOMCacheGetOrSet('singularityPerksDesc').innerHTML = i18next.t(
    'singularity.perks.description'
  )
  handlePerks(singularityCount)
}

export interface ISingularityPerkDisplayInfo {
  name: string
  lastUpgraded: number
  acquired: number
  htmlID: string
}

/*
 * Indicate current level of the Perk and when it was reached
 */
export const getLastUpgradeInfo = (
  perk: SingularityPerk,
  singularityCount: number
): { level: number; singularity: number; next: number | null } => {
  for (let i = perk.levels.length - 1; i >= 0; i--) {
    if (singularityCount >= perk.levels[i]) {
      return {
        level: i + 1,
        singularity: perk.levels[i],
        next: i < perk.levels.length - 1 ? perk.levels[i + 1] : null
      }
    }
  }

  return { level: 0, singularity: perk.levels[0], next: perk.levels[0] }
}

const handlePerks = (singularityCount: number) => {
  const availablePerks: ISingularityPerkDisplayInfo[] = []
  let singularityCountForNextPerk: number | null = null
  let singularityCountForNextPerkUpgrade = Number.POSITIVE_INFINITY
  for (const perk of singularityPerks) {
    const upgradeInfo = getLastUpgradeInfo(perk, singularityCount)
    if (upgradeInfo.level > 0) {
      availablePerks.push({
        name: perk.name(),
        lastUpgraded: upgradeInfo.singularity,
        acquired: perk.levels[0],
        htmlID: perk.ID
      })
      if (upgradeInfo.next) {
        singularityCountForNextPerkUpgrade = Math.min(
          singularityCountForNextPerkUpgrade,
          upgradeInfo.next
        )
      }
    } else {
      if (singularityCountForNextPerk === null) {
        singularityCountForNextPerk = upgradeInfo.singularity
      }
      DOMCacheGetOrSet(perk.ID).style.display = 'none'
    }
  }
  // We want to sort the perks so that the most recently upgraded or lastUpgraded are listed first
  availablePerks.sort((p1, p2) => {
    if (p1.acquired === p2.acquired && p1.lastUpgraded === p2.lastUpgraded) {
      return 0
    }
    if (p1.lastUpgraded > p2.lastUpgraded) {
      return -1
    } else if (
      p1.lastUpgraded === p2.lastUpgraded
      && p1.acquired > p2.acquired
    ) {
      return -1
    }
    return 1
  })

  for (const availablePerk of availablePerks) {
    const singTolerance = getFastForwardTotalMultiplier()
    const perkId = DOMCacheGetOrSet(availablePerk.htmlID)
    perkId.style.display = ''
    DOMCacheGetOrSet('singularityPerksGrid').append(perkId)
    singularityCount - availablePerk.lastUpgraded <= singTolerance // Is new?
      ? perkId.classList.replace('oldPerk', 'newPerk')
      : perkId.classList.replace('newPerk', 'oldPerk')
  }
  const nextUnlockedId = DOMCacheGetOrSet('singualrityUnlockNext')
  if (singularityCountForNextPerk) {
    nextUnlockedId.style.display = ''
    nextUnlockedId.innerHTML = i18next.t('singularity.perks.unlockedIn', {
      sing: singularityCountForNextPerk
    })
  } else {
    nextUnlockedId.style.display = 'none'
  }
  const countNext = DOMCacheGetOrSet('singualrityImproveNext')
  if (singularityCountForNextPerkUpgrade < Number.POSITIVE_INFINITY) {
    countNext.style.display = ''
    countNext.innerHTML = i18next.t('singularity.perks.improvedIn', {
      sing: singularityCountForNextPerkUpgrade
    })
  } else {
    countNext.style.display = 'none'
  }
}
// Indicates the number of extra Singularity count gained on Singularity reset
export const getFastForwardTotalMultiplier = (): number => {
  let fastForward = 0
  fastForward += +player.singularityUpgrades.singFastForward.getEffect().bonus
  fastForward += +player.singularityUpgrades.singFastForward2.getEffect().bonus
  fastForward += +player.octeractUpgrades.octeractFastForward.getEffect().bonus

  // Stop at sing 200 even if you include fast forward
  fastForward = Math.max(
    0,
    Math.min(fastForward, 200 - player.singularityCount - 1)
  )

  // Please for the love of god don't allow FF during a challenge
  if (player.insideSingularityChallenge) {
    return 0
  }

  // If the next singularityCount is greater than the highestSingularityCount, fast forward to be equal to the highestSingularityCount
  if (
    player.highestSingularityCount !== player.singularityCount
    && player.singularityCount + fastForward + 1 >= player.highestSingularityCount
  ) {
    return Math.max(
      0,
      Math.min(
        fastForward,
        player.highestSingularityCount - player.singularityCount - 1
      )
    )
  }

  return fastForward
}

export const getGoldenQuarkCost = (): {
  cost: number
  costReduction: number
} => {
  const baseCost = 10000

  let costReduction = 10000 // We will construct our cost reduction by subtracting 10000 - this value.

  costReduction *= 1 - 0.1 * Math.min(1, player.achievementPoints / 10000)
  costReduction *= 1 - (0.3 * player.cubeUpgrades[60]) / 10000
  costReduction *= +player.singularityUpgrades.goldenQuarks2.getEffect().bonus
  costReduction *= +player.octeractUpgrades.octeractGQCostReduce.getEffect().bonus
  costReduction *= player.highestSingularityCount >= 100
    ? 1 - (0.5 * player.highestSingularityCount) / 250
    : 1

  let perkDivisor = 1
  if (player.highestSingularityCount >= 200) {
    perkDivisor = 3
  }
  if (player.highestSingularityCount >= 208) {
    perkDivisor = 5
  }
  if (player.highestSingularityCount >= 221) {
    perkDivisor = 8
  }
  costReduction /= perkDivisor

  costReduction = 10000 - costReduction

  return {
    cost: baseCost - costReduction,
    costReduction
  }
}

export async function buyGoldenQuarks (): Promise<void> {
  const goldenQuarkCost = getGoldenQuarkCost()
  const maxBuy = Math.floor(+player.worlds / goldenQuarkCost.cost)
  let buyAmount = null

  if (maxBuy === 0) {
    return Alert(i18next.t('singularity.goldenQuarks.poor'))
  }

  const buyPrompt = await Prompt(
    i18next.t('singularity.goldenQuarks.buyPrompt', {
      cost: format(goldenQuarkCost.cost, 0, true),
      discount: format(goldenQuarkCost.costReduction, 0, true),
      max: format(maxBuy, 0, true)
    })
  )

  if (buyPrompt === null) {
    // Number(null) is 0. Yeah..
    return Alert(i18next.t('general.cancelled'))
  }

  buyAmount = Number(buyPrompt)
  // Check these lol
  if (Number.isNaN(buyAmount) || !Number.isFinite(buyAmount)) {
    // nan + Infinity checks
    return Alert(i18next.t('general.validation.finite'))
  } else if (buyAmount <= 0 && buyAmount !== -1) {
    // 0 or less selected
    return Alert(i18next.t('general.validation.zeroOrLess'))
  } else if (buyAmount > maxBuy) {
    return Alert(i18next.t('general.validation.goldenQuarksTooMany'))
  } else if (!Number.isInteger(buyAmount)) {
    // non integer
    return Alert(i18next.t('general.validation.fraction'))
  }

  let cost: number

  if (buyAmount === -1) {
    cost = maxBuy * goldenQuarkCost.cost
    player.worlds.sub(cost)
    player.goldenQuarks += maxBuy
  } else {
    cost = buyAmount * goldenQuarkCost.cost
    player.worlds.sub(cost)
    player.goldenQuarks += buyAmount
  }

  return Alert(
    i18next.t('singularity.goldenQuarks.transaction', {
      spent: format(maxBuy, 0, true),
      cost: format(cost, 0, true)
    })
  )
}

export type SingularityDebuffs =
  | 'Offering'
  | 'Obtainium'
  | 'Global Speed'
  | 'Researches'
  | 'Ascension Speed'
  | 'Cubes'
  | 'Cube Upgrades'
  | 'Platonic Costs'
  | 'Hepteract Costs'

export const calculateEffectiveSingularities = (
  singularityCount: number = player.singularityCount
): number => {
  let effectiveSingularities = singularityCount
  effectiveSingularities *= Math.min(4.75, (0.75 * singularityCount) / 10 + 1)

  if (player.insideSingularityChallenge) {
    if (player.singularityChallenges.noOcteracts.enabled) {
      effectiveSingularities *= Math.pow(
        player.singularityChallenges.noOcteracts.completions + 1,
        3
      )
    }
  }

  if (singularityCount > 10) {
    effectiveSingularities *= 1.5
    effectiveSingularities *= Math.min(
      4,
      (1.25 * singularityCount) / 10 - 0.25
    )
  }
  if (singularityCount > 25) {
    effectiveSingularities *= 2.5
    effectiveSingularities *= Math.min(6, (1.5 * singularityCount) / 25 - 0.5)
  }
  if (singularityCount > 36) {
    effectiveSingularities *= 4
    effectiveSingularities *= Math.min(5, singularityCount / 18 - 1)
    effectiveSingularities *= Math.pow(
      1.1,
      Math.min(singularityCount - 36, 64)
    )
  }
  if (singularityCount > 50) {
    effectiveSingularities *= 5
    effectiveSingularities *= Math.min(8, (2 * singularityCount) / 50 - 1)
    effectiveSingularities *= Math.pow(
      1.1,
      Math.min(singularityCount - 50, 50)
    )
  }
  if (singularityCount > 100) {
    effectiveSingularities *= 2
    effectiveSingularities *= singularityCount / 25
    effectiveSingularities *= Math.pow(1.1, singularityCount - 100)
  }
  if (singularityCount > 150) {
    effectiveSingularities *= 2
    effectiveSingularities *= Math.pow(1.05, singularityCount - 150)
  }
  if (singularityCount > 200) {
    effectiveSingularities *= 1.5
    effectiveSingularities *= Math.pow(1.275, singularityCount - 200)
  }
  if (singularityCount > 215) {
    effectiveSingularities *= 1.25
    effectiveSingularities *= Math.pow(1.2, singularityCount - 215)
  }
  if (singularityCount > 230) {
    effectiveSingularities *= 2
  }
  if (singularityCount > 269) {
    effectiveSingularities *= 3
    effectiveSingularities *= Math.pow(3, singularityCount - 269)
  }

  return effectiveSingularities
}

export const calculateNextSpike = (
  singularityCount: number = player.singularityCount
): number => {
  const singularityPenaltyThreshold = [11, 26, 37, 51, 101, 151, 201, 216, 230, 270]
  let penaltyDebuff = 0
  penaltyDebuff += player.shopUpgrades.shopSingularityPenaltyDebuff

  for (const sing of singularityPenaltyThreshold) {
    if (sing + penaltyDebuff > singularityCount) {
      return sing + penaltyDebuff
    }
  }
  return -1
}
export const calculateSingularityDebuff = (
  debuff: SingularityDebuffs,
  singularityCount: number = player.singularityCount
) => {
  if (singularityCount === 0) {
    return 1
  }
  if (player.runelevels[6] > 0) {
    return 1
  }

  let constitutiveSingularityCount = singularityCount
  constitutiveSingularityCount -= player.shopUpgrades.shopSingularityPenaltyDebuff
  if (constitutiveSingularityCount < 1) {
    return 1
  }

  const effectiveSingularities = calculateEffectiveSingularities(
    constitutiveSingularityCount
  )

  if (debuff === 'Offering') {
    return Math.sqrt(
      Math.min(effectiveSingularities, calculateEffectiveSingularities(150)) + 1
    )
  } else if (debuff === 'Global Speed') {
    return 1 + Math.sqrt(effectiveSingularities) / 4
  } else if (debuff === 'Obtainium') {
    return Math.sqrt(
      Math.min(effectiveSingularities, calculateEffectiveSingularities(150)) + 1
    )
  } else if (debuff === 'Researches') {
    return 1 + Math.sqrt(effectiveSingularities) / 2
  } else if (debuff === 'Ascension Speed') {
    return singularityCount < 150
      ? 1 + Math.sqrt(effectiveSingularities) / 5
      : 1 + Math.pow(effectiveSingularities, 0.75) / 10000
  } else if (debuff === 'Cubes') {
    const extraMult = player.singularityCount > 100
      ? Math.pow(1.02, player.singularityCount - 100)
      : 1
    return player.singularityCount < 150
      ? 1 + (Math.sqrt(effectiveSingularities) * extraMult) / 4
      : 1 + (Math.pow(effectiveSingularities, 0.75) * extraMult) / 1000
  } else if (debuff === 'Platonic Costs') {
    return singularityCount > 36
      ? 1 + Math.pow(effectiveSingularities, 3 / 10) / 12
      : 1
  } else if (debuff === 'Hepteract Costs') {
    return singularityCount > 50
      ? 1 + Math.pow(effectiveSingularities, 11 / 50) / 25
      : 1
  } else {
    // Cube upgrades
    return Math.cbrt(effectiveSingularities + 1)
  }
}
