import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAmbrosiaGenerationSpeed, calculateAmbrosiaLuck, calculateBlueberryInventory, calculatePixelBarLevelBonuses, calculatePixelGenerationSpeed, calculatePixelLuck } from './Calculate'
import { DynamicUpgrade, type IUpgradeData } from './DynamicUpgrade'
import { format, player } from './Synergism'
import { IconSets } from './Themes'
import type { Player } from './types/Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { visualUpdateProgressPixels } from './UpdateVisuals'
import { Globals as G } from './Variables'

export type pixelUpgradeNames =
  | 'pixelTutorial'
  | 'pixelPixelLuck'
  | 'pixelAmbrosiaGeneration'
  | 'pixelAmbrosiaLuck'
  | 'pixelCubes'
  | 'pixelQuarks'
  | 'pixelObtainium'
  | 'pixelOfferings'

export interface IPixelData extends Omit<IUpgradeData, 'name' | 'description'> {
  rewards(this: void, n: number): Record<string, number | boolean | string>
  costPerLevel: number
  pixelsInvested?: number
  qualityOfLife?: boolean
  IconSrc: string
}

export class PixelUpgrade extends DynamicUpgrade {
  public pixelsInvested = 0
  readonly costPerLevel: number
  public qualityOfLife: boolean
  readonly cacheUpdates: (() => void)[] | undefined
  readonly rewards: (n: number) => Record<string, number | boolean | string>
  public IconSrc

  constructor (data: IPixelData, key: string) {
    const name = i18next.t(`ultimatePixels.data.${key}.name`)
    const description = i18next.t(`ultimatePixels.data.${key}.description`)

    super({ ...data, name, description })
    this.pixelsInvested = data.pixelsInvested ?? 0
    this.rewards = data.rewards
    this.costPerLevel = data.costPerLevel
    this.qualityOfLife = data.qualityOfLife ?? false
    this.cacheUpdates = data.cacheUpdates ?? undefined
    this.IconSrc = data.IconSrc
  }

  getCostTNL (): number {
    if (this.level >= this.maxLevel) {
      return 0
    } else {
      return this.costPerLevel
    }
  }

  /**
   * Buy levels up until togglebuy or maxed.
   * @returns An alert indicating cannot afford, already maxed or purchased with how many
   *          levels purchased
   */
  public async buyLevel (event: MouseEvent): Promise<void> {
    let maxPurchasable = 1
    let pixelBudget = player.ultimatePixels

    if (event.shiftKey) {
      maxPurchasable = 100000
      const buy = Number(
        await Prompt(
          i18next.t('ultimatePixels.spendPrompt', {
            pixels: format(player.ultimatePixels, 0, true)
          })
        )
      )

      if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
        // nan + Infinity checks
        return Alert(i18next.t('general.validation.finite'))
      }

      if (buy === -1) {
        pixelBudget = player.ultimatePixels
      } else if (buy <= 0) {
        return Alert(i18next.t('general.validation.zeroOrLess'))
      } else {
        pixelBudget = buy
      }
      pixelBudget = Math.min(player.ultimatePixels, pixelBudget)
    }

    if (this.maxLevel > 0) {
      maxPurchasable = Math.min(
        maxPurchasable,
        this.maxLevel - this.level
      )
    }

    if (maxPurchasable === 0) {
      return Alert(i18next.t('singularity.goldenQuarks.hasUpgrade'))
    }

    const toPurchase = Math.min(maxPurchasable, Math.floor(pixelBudget / this.costPerLevel))
    const totalCost = toPurchase * this.costPerLevel

    this.level += toPurchase
    this.pixelsInvested += totalCost
    player.ultimatePixels -= totalCost

    if (toPurchase === 0) {
      return Alert(i18next.t('general.validation.moreThanPlayerHas'))
    }
    if (toPurchase > 1) {
      void Alert(
        i18next.t('singularity.goldenQuarks.multiBuyPurchased', {
          levels: format(toPurchase)
        })
      )
    }

    this.updateUpgradeHTML()
    this.updateCaches()
    visualUpdateProgressPixels()
  }

  // We do not need this method!
  toString (): string {
    return ''
  }

  public get rewardDesc (): string {
    const effectiveLevel = this.level
    if ('desc' in this.rewards(0)) {
      return String(this.rewards(effectiveLevel).desc)
    } else {
      return 'Contact Platonic or Khafra if you see this (should never occur!)'
    }
  }

  public get bonus () {
    const effectiveLevel = this.level
    return this.rewards(effectiveLevel)
  }

  updateUpgradeHTML (): void {
    DOMCacheGetOrSet('pixelUpgradeName').textContent = this.name
    DOMCacheGetOrSet('pixelUpgradeDescription').innerHTML = this.description
    DOMCacheGetOrSet('pixelUpgradeCost').innerHTML = i18next.t('ultimatePixels.cost', {
      pixels: format(this.getCostTNL(), 0, true)
    })

    const levelColor = (this.level === this.maxLevel) ? 'orchid' : 'white'

    DOMCacheGetOrSet('pixelUpgradeLevel').innerHTML = `<span style="color: ${levelColor}">${
      i18next.t('main.levelText', { level: this.level, maxLevel: this.maxLevel })
    }</span>`
    DOMCacheGetOrSet('pixelUpgradeEffect').innerHTML = this.rewardDesc

    DOMCacheGetOrSet('pixelUpgradeImage').setAttribute(
      'src',
      `Pictures/${IconSets[player.iconSet][0]}/${this.IconSrc}.png`
    )
  }

  refund (): void {
    player.ultimatePixels += this.pixelsInvested
    this.pixelsInvested = 0
    this.level = 0
  }
}

export const pixelData: Record<keyof Player['pixelUpgrades'], IPixelData> = {
  pixelTutorial: {
    maxLevel: 10,
    costPerLevel: 1,
    rewards: (n: number) => {
      const cubeAmount = 1 + 0.05 * n
      const quarkAmount = 1 + 0.01 * n
      return {
        cubes: cubeAmount,
        quarks: quarkAmount,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelTutorial.effect', {
            cubeAmount: format(100 * (cubeAmount - 1), 0, true),
            quarkAmount: format(100 * (quarkAmount - 1), 0, true)
          })
        }
      }
    },
    IconSrc: 'PixelTutorial'
  },
  pixelPixelLuck: {
    maxLevel: 10,
    costPerLevel: 10,
    rewards: (n: number) => {
      return {
        pixelLuck: n,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelPixelLuck.effect', {
            pixelLuck: n
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.pixelCurrStats.pixelLuck = calculatePixelLuck().value}
    ],
    IconSrc: 'PixelPixelLuck'
  },
  pixelAmbrosiaGeneration: {
    maxLevel: 100,
    costPerLevel: 1,
    rewards: (n: number) => {
      const genMult = 1 + n / 200
      return {
        ambrosiaGeneration: genMult,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelAmbrosiaGeneration.effect', {
            ambrosiaGeneration: format(100 * (genMult - 1), 2, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value}
    ],
    IconSrc: 'PixelAmbrosiaGeneration'
  },
  pixelAmbrosiaGeneration2: {
    maxLevel: 100,
    costPerLevel: 10,
    rewards: (n: number) => {
      const genMult = 1 + n / 250
      return {
        ambrosiaGeneration: genMult,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelAmbrosiaGeneration2.effect', {
            ambrosiaGeneration: format(100 * (genMult - 1), 2, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value}
    ],
    IconSrc: 'PixelAmbrosiaGeneration2'
  },
  pixelAmbrosiaGeneration3: {
    maxLevel: 100,
    costPerLevel: 200,
    rewards: (n: number) => {
      const genMult = 1 + 3 * n / 1000
      return {
        ambrosiaGeneration: genMult,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelAmbrosiaGeneration3.effect', {
            ambrosiaGeneration: format(100 * (genMult - 1), 2, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value}
    ],
    IconSrc: 'PixelAmbrosiaGeneration3'
  },
  pixelAmbrosiaLuck: {
    maxLevel: 100,
    costPerLevel: 1,
    rewards: (n: number) => {
      return {
        ambrosiaLuck: 3 * n,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelAmbrosiaLuck.effect', {
            ambrosiaLuck: 3 * n
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaLuck = calculateAmbrosiaLuck().value}
    ],
    IconSrc: 'PixelAmbrosiaLuck'
  },
  pixelAmbrosiaLuck2: {
    maxLevel: 100,
    costPerLevel: 10,
    rewards: (n: number) => {
      return {
        ambrosiaLuck: 4 * n,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelAmbrosiaLuck2.effect', {
            ambrosiaLuck: 4 * n
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaLuck = calculateAmbrosiaLuck().value}
    ],
    IconSrc: 'PixelAmbrosiaLuck2'
  },
  pixelAmbrosiaLuck3: {
    maxLevel: 100,
    costPerLevel: 200,
    rewards: (n: number) => {
      return {
        ambrosiaLuck: 5 * n,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelAmbrosiaLuck3.effect', {
            ambrosiaLuck: 5 * n
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaLuck = calculateAmbrosiaLuck().value}
    ],
    IconSrc: 'PixelAmbrosiaLuck3'
  },
  pixelCubes: {
    maxLevel: 100,
    costPerLevel: 1,
    rewards: (n: number) => {
      const cubeMult = 1 + 3 * n / 200
      return {
        cubes: cubeMult,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelCubes.effect', {
            cubeAmount: format(100 * (cubeMult - 1), 2, true)
          })
        }
      }
    },
    IconSrc: 'PixelCubes'
  },
  pixelQuarks: {
    maxLevel: 100,
    costPerLevel: 1,
    rewards: (n: number) => {
      const quarkMult = 1 + n / 500
      return {
        quarks: quarkMult,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelQuarks.effect', {
            quarkAmount: format(100 * (quarkMult - 1), 2, true)
          })
        }
      }
    },
    IconSrc: 'PixelQuarks'
  },
  pixelObtainium: {
    maxLevel: 100,
    costPerLevel: 1,
    rewards: (n: number) => {
      const obtainiumMult = 1 + n / 100
      return {
        obtainium: obtainiumMult,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelObtainium.effect', {
            obtainiumAmount: format(100 * (obtainiumMult - 1), 2, true)
          })
        }
      }
    },
    IconSrc: 'PixelObtainium'
  },
  pixelOfferings: {
    maxLevel: 100,
    costPerLevel: 1,
    rewards: (n: number) => {
      const offeringMult = 1 + n / 100
      return {
        offerings: offeringMult,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelOfferings.effect', {
            offeringAmount: format(100 * (offeringMult - 1), 2, true)
          })
        }
      }
    },
    IconSrc: 'PixelOfferings'
  },
  pixelPixelGeneration: {
    maxLevel: 40,
    costPerLevel: 1,
    rewards: (n: number) => {
      const addedGeneration = 5 * n
      return {
        pixelGenerationAdd: addedGeneration,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelPixelGeneration.effect', {
            pixelGeneration: format(addedGeneration, 0, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.pixelCurrStats.pixelGenerationSpeed = calculatePixelGenerationSpeed().value}
    ],
    IconSrc: 'PixelPixelGeneration'
  },
  pixelPixelGeneration2: {
    maxLevel: 75,
    costPerLevel: 10,
    rewards: (n: number) => {
      const addedGeneration = 8 * n
      return {
        pixelGenerationAdd: addedGeneration,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelPixelGeneration2.effect', {
            pixelGeneration: format(addedGeneration, 0, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.pixelCurrStats.pixelGenerationSpeed = calculatePixelGenerationSpeed().value}
    ],
    IconSrc: 'PixelPixelGeneration2'
  },
  pixelPixelGeneration3: {
    maxLevel: 100,
    costPerLevel: 200,
    rewards: (n: number) => {
      const addedGeneration = 12 * n
      return {
        pixelGenerationAdd: addedGeneration,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelPixelGeneration3.effect', {
            pixelGeneration: format(addedGeneration, 0, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.pixelCurrStats.pixelGenerationSpeed = calculatePixelGenerationSpeed().value}
    ],
    IconSrc: 'PixelPixelGeneration3'
  },
  pixelBlueberry: {
    maxLevel: 1,
    costPerLevel: 50,
    rewards: (n: number) => {
      const blueberry = n > 0
      return {
        blueberry: blueberry,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelBlueberry.effect', {
            blueberry: blueberry ? '[✔]' : '[✖]'
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaBlueberries = calculateBlueberryInventory().value},
      () => {G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value},
    ],
    IconSrc: 'PixelBlueberry'
  },
  pixelBlueberry2: {
    maxLevel: 1,
    costPerLevel: 500,
    rewards: (n: number) => {
      const blueberry = n > 0
      return {
        blueberry: blueberry,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelBlueberry2.effect', {
            blueberry: blueberry ? '[✔]' : '[✖]'
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaBlueberries = calculateBlueberryInventory().value},
      () => {G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value},
    ],
    IconSrc: 'PixelBlueberry2'
  },
  pixelBlueberry3: {
    maxLevel: 1,
    costPerLevel: 5000,
    rewards: (n: number) => {
      const blueberry = n > 0
      return {
        blueberry: blueberry,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelBlueberry3.effect', {
            blueberry: blueberry ? '[✔]' : '[✖]'
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.ambrosiaCurrStats.ambrosiaBlueberries = calculateBlueberryInventory().value},
      () => {G.ambrosiaCurrStats.ambrosiaGenerationSpeed = calculateAmbrosiaGenerationSpeed().value},
    ],
    IconSrc: 'PixelBlueberry3'
  },
  pixelRoleBonus: {
    maxLevel: 1,
    costPerLevel: 77777,
    rewards: (n: number) => {
      const purchased = n > 0
      return {
        purchased: purchased,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelRoleBonus.effect', {
            purchased: purchased ? '[✔]' : '[✖]'
          })
        }
      }
    },
    IconSrc: 'PixelRoleBonus'
  },
  pixelPixelLuckConverter: {
    maxLevel: 1,
    costPerLevel: 250,
    rewards (n) {
      const purchased = n > 0
      const bonus = +purchased * G.ambrosiaCurrStats.ambrosiaLuck / 1000
      return {
        purchased: purchased,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelPixelLuckConverter.effect', {
            purchased: purchased ? '[✔]' : '[✖]',
            luck: format(bonus, 2, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.pixelCurrStats.pixelLuck = calculatePixelLuck().value},
    ],
    IconSrc: 'PixelPixelLuckConverter'
  },
  pixelPixelLuckConverter2: {
    maxLevel: 1,
    costPerLevel: 10000,
    rewards (n) {
      const purchased = n > 0
      const bonus = +purchased * G.ambrosiaCurrStats.ambrosiaLuck / 1000
      return {
        purchased: purchased,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelPixelLuckConverter2.effect', {
            purchased: purchased ? '[✔]' : '[✖]',
            luck: format(bonus, 2, true)
          })
        }
      }
    },
    cacheUpdates: [
      () => {G.pixelCurrStats.pixelLuck = calculatePixelLuck().value},
    ],
    IconSrc: 'PixelPixelLuckConverter'
  },
  pixelFreeUpgradeImprovement: {
    maxLevel: 10,
    costPerLevel: 25,
    rewards (n) {
      const proportion = n / 1000
      return {
        proportion: proportion,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelFreeUpgradeImprovement.effect', {
            proportion: format(100 * proportion, 1, true)
          })
        }
      }
    },
    IconSrc: 'PixelFreeUpgradeImprovement'
  },
  pixelFreeUpgradeImprovement2: {
    maxLevel: 10,
    costPerLevel: 500,
    rewards (n) {
      const proportion = n / 1000
      return {
        proportion: proportion,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelFreeUpgradeImprovement2.effect', {
            proportion: format(100 * proportion, 1, true)
          })
        }
      }
    },
    IconSrc: 'PixelFreeUpgradeImprovement2'
  },
  pixelFreeUpgradeImprovement3: {
    maxLevel: 10,
    costPerLevel: 5000,
    rewards (n) {
      const proportion = n / 1000
      return {
        proportion: proportion,
        get desc () {
          return i18next.t('ultimatePixels.data.pixelFreeUpgradeImprovement3.effect', {
            proportion: format(100 * proportion, 1, true)
          })
        }
      }
    },
    IconSrc: 'PixelFreeUpgradeImprovement3'
  }
}

export const LEVEL_REQ_ARR = [
  0,
  1,
  2,
  3,
  4,
  5,
  10,
  15,
  20,
  25,
  30, // 1-10
  40,
  50,
  60,
  70,
  80,
  90,
  100,
  125,
  150,
  175, // 11-20
  200,
  250,
  300,
  350,
  400,
  450,
  500,
  550,
  600,
  650, // 21-30
  700,
  750,
  800,
  850,
  900,
  950,
  1000,
  1100,
  1200,
  1300, // 31-40
  1400,
  1500,
  1750,
  2000,
  2250,
  2500,
  3000,
  3500,
  4000,
  5000, // 41-50
  6000,
  7000,
  8000,
  9000,
  10000,
  12000,
  14000,
  16000,
  18000,
  20000, // 51-60
  25000,
  30000,
  35000,
  40000,
  45000,
  50000,
  55000,
  60000,
  70000,
  80000, // 61-70
  90000,
  1e5,
  1.1e5,
  1.2e5,
  1.3e5,
  1.4e5,
  1.5e5,
  1.6e5,
  1.7e5,
  1.8e5, // 71-80
  1.9e5,
  2e5,
  2.25e5,
  2.5e5,
  2.75e5,
  3e5,
  3.5e5,
  4e5,
  4.5e5,
  5e5, // 91-100
  5.5e5,
  6e5,
  6.5e5,
  7e5,
  7.5e5,
  8e5,
  8.5e5,
  9e5,
  9.5e5,
  1e6 // 91-100]
]

export const computeMetaBarLevel = () => {
  const toCompare = player.lifetimeUltimatePixels

  let levelLow = 0
  let levelHigh = LEVEL_REQ_ARR.length - 1

  // Extreme case:
  if (player.lifetimeUltimatePixels >= LEVEL_REQ_ARR[levelHigh]) {
    return levelHigh
  }

  while (true) {
    const i = Math.floor(1 / 2 * (levelLow + levelHigh))
    if (toCompare >= LEVEL_REQ_ARR[i]) {
      const newIndex = Math.floor(1 / 2 * (i + levelHigh))
      if (i === newIndex) {
        break
      }
      levelLow = i
    } else {
      const newIndex = Math.floor(1 / 2 * i)
      if (i === newIndex) {
        break
      }
      levelHigh = i
    }
  }
  return Math.floor(1 / 2 * (levelLow + levelHigh))
}
/*
| 'pixelTutorial'
| 'pixelPixelLuck'
| 'pixelAmbrosiaGeneration'
| 'pixelAmbrosiaLuck'
| 'pixelCubes'
| 'pixelQuarks'
| 'pixelObtainium'
| 'pixelOfferings' */

export const showBarLevelBonuses = () => {
  const bonuses = calculatePixelBarLevelBonuses()

  DOMCacheGetOrSet('pixelBarLuckBonus').textContent = `+${bonuses.AmbrosiaLuck} +${
    bonuses.AmbrosiaLuckMult * 100
  }% ☘ Ambrosia Luck`
  DOMCacheGetOrSet('pixelBarBlueberrySpeedBonus').textContent = `${
    format(bonuses.BlueberrySpeedMult, 2, true)
  }x Blueberry Second Generation`
  DOMCacheGetOrSet('pixelBarPixelLuckBonus').textContent = `${bonuses.PixelLuck} +${
    bonuses.PixelLuckMult * 100
  }% ❖ Pixel Luck`
  DOMCacheGetOrSet('pixelBarPixelProgressBonus').textContent = `${
    format(bonuses.PixelProgressMult, 3, true)
  }x Bar Progress Speed`
  DOMCacheGetOrSet('pixelBarCubeMultBonus').textContent = `${format(bonuses.CubeMult, 2, true)}x Cubes`
  DOMCacheGetOrSet('pixelBarObtainiumMultBonus').textContent = `${format(bonuses.ObtainiumMult, 2, true)}x Obtainium`
  DOMCacheGetOrSet('pixelBarOfferingMultBonus').textContent = `${format(bonuses.OfferingMult, 2, true)}x Offerings`
  DOMCacheGetOrSet('pixelBarQuarkBonus').textContent = `${format(bonuses.QuarkMult, 3, true)}x Quarks`
}
