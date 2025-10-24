import {
  calculateActualAntSpeedMult,
  calculateAntSacrificeMultiplier,
  calculateAntSacrificeRewards,
  calculateBaseAntELO,
  calculateEffectiveAntELO,
  calculateELOMult,
  calculateSigmoidExponential
} from './Calculate'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { awardAchievementGroup, awardUngroupedAchievement, getAchievementReward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcECC } from './Challenges'
import { calculateAntELOCubeBlessing } from './Cubes'
import { resetHistoryAdd, type ResetHistoryEntryAntSacrifice } from './History'
import { resetAnts, resetTiers } from './Reset'
import { offeringObtainiumTimeModifiers } from './Statistics'
import { getTalismanEffects, updateTalismanInventory } from './Talismans'
import { Confirm } from './UpdateHTML'

/**
 * PART 1: Ant Producers (Crumbs, Ants, Ant Queens, etc.)
 */

export interface AntProducerTexts {
  text: () => string
  displayCondition: () => boolean
}

export interface AntProducerData {
  baseCost: Decimal
  costIncrease: number
  baseProduction: Decimal
  color: string
  additionalTexts: AntProducerTexts[]
  masteryInfo: {
    totalELORequirements: number[]
    particleCosts: Decimal[]
    selfSpeedMultipliers: Decimal[]
    // Ant Speed Multiplier = (1 + selfPowerIncrement)^purchased
    selfPowerIncrement: number
  }
  produces?: AntProducers
}

export interface PlayerAntProducers {
  purchased: number
  generated: Decimal
  mastery: number
  highestMastery: number
}

export const emptyAntProducer: PlayerAntProducers = {
  purchased: 0,
  generated: new Decimal(0),
  mastery: 0,
  highestMastery: 0
}

export enum AntProducers {
  'Workers' = 0,
  'Breeders' = 1,
  'MetaBreeders' = 2,
  'MegaBreeders' = 3,
  'Queens' = 4,
  'LordRoyals' = 5,
  'Almighties' = 6,
  'Disciples' = 7,
  'HolySpirit' = 8
}

export const LAST_ANT = AntProducers.HolySpirit
export const MAX_ANT_MASTERY_LEVEL = 12

export const baseAntInfo: Record<AntProducers, AntProducerData> = {
  [AntProducers.Workers]: {
    baseCost: new Decimal(1),
    costIncrease: 3,
    baseProduction: new Decimal(0.01),
    color: '#AB8654',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.0.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.Workers), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.Workers].mastery > 0
      },
      {
        text: () =>
          i18next.t('ants.producers.0.eloInformation', {
            x: format(calculateELOMult(), 2, true)
          }),
        displayCondition: () => player.ants.antSacrificeCount > 0 || player.ants.highestCrumbsThisSacrifice.gte(1e70)
      },
      {
        text: () =>
          i18next.t('ants.producers.0.reincarnationUpgrade17', {
            x: format(Decimal.pow(1.004, player.ants.producers[AntProducers.Workers].purchased), 2, true)
          }),
        displayCondition: () => player.upgrades[77] > 0
      },
      {
        text: () =>
          i18next.t('ants.producers.0.research', {
            x: format(
              Decimal.pow(1 + player.researches[96] / 5000, player.ants.producers[AntProducers.Workers].purchased),
              2,
              true
            )
          }),
        displayCondition: () => player.researches[96] > 0
      },
      {
        text: () =>
          i18next.t('ants.producers.0.cookieUpgrade', {
            x: format(Decimal.pow(1.004, player.ants.producers[AntProducers.Workers].purchased), 2, true)
          }),
        displayCondition: () => player.cubeUpgrades[65] > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [0, 0, 0, 0, 100, 500, 1_250, 4_000, 10_000, 25_000, 256_000, 1_024_000],
      particleCosts: [
        new Decimal('1e700'),
        new Decimal('1e1200'),
        new Decimal('1e2600'),
        new Decimal('1e5000'),
        new Decimal('1e12500'),
        new Decimal('1e40000'),
        new Decimal('1e100000'),
        new Decimal('1e250000'),
        new Decimal('1e500000'),
        new Decimal('1e1000000'),
        new Decimal('1e10000000'),
        new Decimal('1e100000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(3),
        new Decimal(9),
        new Decimal(20),
        new Decimal(100),
        new Decimal(1e4),
        new Decimal(1e6),
        new Decimal(1e8),
        new Decimal(1e11),
        new Decimal(1e20),
        new Decimal(1e50),
        new Decimal(1e200),
        new Decimal('1e1000')
      ],
      selfPowerIncrement: 0.001
    }
  },
  [AntProducers.Breeders]: {
    baseCost: new Decimal(10),
    costIncrease: 10,
    baseProduction: new Decimal(1e-4),
    color: '#B77D48',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.1.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.Breeders), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.Breeders].mastery > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [0, 0, 0, 750, 2_500, 7_500, 15_000, 30_000, 60_000, 115_000, 403_000, 1_344_000],
      particleCosts: [
        new Decimal('1e1200'),
        new Decimal('1e2600'),
        new Decimal('1e5000'),
        new Decimal('1e12500'),
        new Decimal('1e40000'),
        new Decimal('1e100000'),
        new Decimal('1e250000'),
        new Decimal('1e500000'),
        new Decimal('1e1000000'),
        new Decimal('1e1750000'),
        new Decimal('1e17500000'),
        new Decimal('1e175000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(4),
        new Decimal(16),
        new Decimal(100),
        new Decimal(1e5),
        new Decimal(1e8),
        new Decimal(1e13),
        new Decimal(1e25),
        new Decimal(1e40),
        new Decimal(1e70),
        new Decimal(1e120),
        new Decimal('1e400'),
        new Decimal('1e1400')
      ],
      selfPowerIncrement: 0.002
    },
    produces: AntProducers.Workers
  },
  [AntProducers.MetaBreeders]: {
    baseCost: new Decimal(1e5),
    costIncrease: 1e2,
    baseProduction: new Decimal(1e-7),
    color: '#C2783D',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.2.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.MetaBreeders), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.MetaBreeders].mastery > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [0, 0, 1_250, 3_000, 6_000, 13_000, 27_000, 55_000, 100_000, 180_000, 598_000, 1_996_000],
      particleCosts: [
        new Decimal('1e2500'),
        new Decimal('1e6000'),
        new Decimal('1e20000'),
        new Decimal('1e60000'),
        new Decimal('1e125000'),
        new Decimal('1e300000'),
        new Decimal('1e600000'),
        new Decimal('1e1250000'),
        new Decimal('1e3000000'),
        new Decimal('1e8000000'),
        new Decimal('1e40000000'),
        new Decimal('1e300000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(10),
        new Decimal(200),
        new Decimal(1e4),
        new Decimal(1e6),
        new Decimal(1e9),
        new Decimal(1e16),
        new Decimal(1e32),
        new Decimal(1e55),
        new Decimal(1e100),
        new Decimal(1e160),
        new Decimal('1e600'),
        new Decimal('1e2000')
      ],
      selfPowerIncrement: 0.005
    },
    produces: AntProducers.Breeders
  },
  [AntProducers.MegaBreeders]: {
    baseCost: new Decimal(1e12),
    costIncrease: 1e4,
    baseProduction: new Decimal(1e-12),
    color: '#CA7035',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.3.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.MegaBreeders), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.MegaBreeders].mastery > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [
        0,
        2_500,
        5_500,
        13_000,
        25_000,
        42_000,
        65_000,
        102_000,
        160_000,
        260_000,
        800_000,
        2,
        900_000
      ],
      particleCosts: [
        new Decimal('1e6000'),
        new Decimal('1e15000'),
        new Decimal('1e35000'),
        new Decimal('1e80000'),
        new Decimal('1e240000'),
        new Decimal('1e1000000'),
        new Decimal('1e2500000'),
        new Decimal('1e6000000'),
        new Decimal('1e12000000'),
        new Decimal('1e30000000'),
        new Decimal('1e100000000'),
        new Decimal('1e500000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(60),
        new Decimal(1e4),
        new Decimal(1e7),
        new Decimal(1e12),
        new Decimal(1e24),
        new Decimal(1e48),
        new Decimal(1e80),
        new Decimal(1e120),
        new Decimal(1e200),
        new Decimal(1e300),
        new Decimal('1e800'),
        new Decimal('1e3000')
      ],
      selfPowerIncrement: 0.01
    },
    produces: AntProducers.MetaBreeders
  },
  [AntProducers.Queens]: {
    baseCost: new Decimal(1e300),
    costIncrease: 1e8,
    baseProduction: new Decimal(1e-80),
    color: '#D26B2D',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.4.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.Queens), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.Queens].mastery > 0
      },
      {
        text: () => i18next.t('ants.producers.4.eloMult'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      },
      {
        text: () => i18next.t('ants.producers.4.eloSpeedup'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [
        3_000,
        5_000,
        11_000,
        22_000,
        44_000,
        83_000,
        142_000,
        221_000,
        333_333,
        500_000,
        1_500_000,
        4_300_000
      ],
      particleCosts: [
        new Decimal('1e15000'),
        new Decimal('1e40000'),
        new Decimal('1e100000'),
        new Decimal('1e250000'),
        new Decimal('1e600000'),
        new Decimal('1e1250000'),
        new Decimal('1e3000000'),
        new Decimal('1e8000000'),
        new Decimal('1e20000000'),
        new Decimal('1e50000000'),
        new Decimal('1e200000000'),
        new Decimal('1e800000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(100),
        new Decimal(1e5),
        new Decimal(1e12),
        new Decimal(1e24),
        new Decimal(1e48),
        new Decimal(1e80),
        new Decimal(1e120),
        new Decimal(1e200),
        new Decimal(1e300),
        new Decimal('1e600'),
        new Decimal('1e1550'),
        new Decimal('1e4500')
      ],
      selfPowerIncrement: 0.02
    },
    produces: AntProducers.MegaBreeders
  },
  [AntProducers.LordRoyals]: {
    baseCost: new Decimal('1e1000'),
    costIncrease: 1e16,
    baseProduction: new Decimal(1e-220),
    color: '#DC6623',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.5.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.LordRoyals), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.LordRoyals].mastery > 0
      },
      {
        text: () => i18next.t('ants.producers.5.eloMult'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      },
      {
        text: () => i18next.t('ants.producers.5.eloSpeedup'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [
        6_000,
        14_000,
        31_000,
        61_000,
        122_000,
        200_000,
        340_000,
        525_000,
        740_000,
        1_115_000,
        2_400_000,
        6_200_000
      ],
      particleCosts: [
        new Decimal('1e40000'),
        new Decimal('1e100000'),
        new Decimal('1e250000'),
        new Decimal('1e600000'),
        new Decimal('1e1250000'),
        new Decimal('1e3000000'),
        new Decimal('1e8000000'),
        new Decimal('1e20000000'),
        new Decimal('1e50000000'),
        new Decimal('1e150000000'),
        new Decimal('1e600000000'),
        new Decimal('1e1250000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(1e5),
        new Decimal(1e12),
        new Decimal(1e24),
        new Decimal(1e48),
        new Decimal(1e80),
        new Decimal(1e120),
        new Decimal(1e200),
        new Decimal(1e300),
        new Decimal('1e600'),
        new Decimal('1e1000'),
        new Decimal('1e2500'),
        new Decimal('1e7000')
      ],
      selfPowerIncrement: 0.04
    },
    produces: AntProducers.Queens
  },
  [AntProducers.Almighties]: {
    baseCost: new Decimal('1e5000'),
    costIncrease: 1e32,
    baseProduction: new Decimal('1e-850'),
    color: '#E76118',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.6.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.Almighties), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.Almighties].mastery > 0
      },
      {
        text: () => i18next.t('ants.producers.6.eloMult'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      },
      {
        text: () => i18next.t('ants.producers.6.eloSpeedup'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [
        23_000,
        53_000,
        100_000,
        190_000,
        377_000,
        621_000,
        1_021_000,
        1_600_000,
        2_340_000,
        3_400_000,
        4_400_000,
        5_999_000
      ],
      particleCosts: [
        new Decimal('1e100000'),
        new Decimal('1e400000'),
        new Decimal('1e1250000'),
        new Decimal('1e4000000'),
        new Decimal('1e6000000'),
        new Decimal('1e13000000'),
        new Decimal('1e26000000'),
        new Decimal('1e50000000'),
        new Decimal('1e150000000'),
        new Decimal('1e400000000'),
        new Decimal('1e1000000000'),
        new Decimal('1e3000000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(1e24),
        new Decimal(1e48),
        new Decimal(1e80),
        new Decimal(1e120),
        new Decimal(1e200),
        new Decimal(1e300),
        new Decimal('1e600'),
        new Decimal('1e1000'),
        new Decimal('1e1800'),
        new Decimal('1e3000'),
        new Decimal('1e5000'),
        new Decimal('1e10000')
      ],
      selfPowerIncrement: 0.1
    },
    produces: AntProducers.LordRoyals
  },
  [AntProducers.Disciples]: {
    baseCost: new Decimal('1e25000'),
    costIncrease: 1e64,
    baseProduction: new Decimal('1e-3500'),
    color: '#F65D09',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.7.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.Disciples), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.Disciples].mastery > 0
      },
      {
        text: () => i18next.t('ants.producers.7.eloMult'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      },
      {
        text: () => i18next.t('ants.producers.7.eloSpeedup'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [
        100_000,
        200_000,
        400_000,
        750_000,
        1_400_000,
        2_400_000,
        3_500_000,
        4_666_000,
        6_020_000,
        7_250_000,
        9_000_000,
        10_000_000
      ],
      particleCosts: [
        new Decimal('1e400000'),
        new Decimal('1e1250000'),
        new Decimal('1e4000000'),
        new Decimal('1e6000000'),
        new Decimal('1e13000000'),
        new Decimal('1e26000000'),
        new Decimal('1e50000000'),
        new Decimal('1e150000000'),
        new Decimal('1e400000000'),
        new Decimal('1e1000000000'),
        new Decimal('1e3000000000'),
        new Decimal('1e10000000000')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal(1e80),
        new Decimal(1e120),
        new Decimal(1e200),
        new Decimal(1e300),
        new Decimal('1e600'),
        new Decimal('1e1000'),
        new Decimal('1e1800'),
        new Decimal('1e3000'),
        new Decimal('1e5000'),
        new Decimal('1e11000'),
        new Decimal('1e25000'),
        new Decimal('1e60000')
      ],
      selfPowerIncrement: 0.3
    },
    produces: AntProducers.Almighties
  },
  [AntProducers.HolySpirit]: {
    baseCost: new Decimal('1e1000000'),
    costIncrease: 1e128,
    baseProduction: new Decimal('1e-125000'),
    color: '#FFFFFF',
    additionalTexts: [
      {
        text: () =>
          i18next.t('ants.mastery.8.effect', {
            x: format(calculateSelfSpeedFromMastery(AntProducers.HolySpirit), 2, false)
          }),
        displayCondition: () => player.ants.producers[AntProducers.HolySpirit].mastery > 0
      },
      {
        text: () => i18next.t('ants.producers.8.eloMult'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      },
      {
        text: () => i18next.t('ants.producers.8.eloSpeedup'),
        displayCondition: () => player.ants.antSacrificeCount > 0
      }
    ],
    masteryInfo: {
      totalELORequirements: [
        2_500_000,
        3_500_000,
        4_500_000,
        5_500_000,
        6_500_000,
        8_000_000,
        9_500_000,
        11_000_000,
        12_500_000,
        14_000_000,
        16_000_000,
        18_000_000
      ],
      particleCosts: [
        new Decimal('1'),
        new Decimal('2'),
        new Decimal('3'),
        new Decimal('4'),
        new Decimal('5'),
        new Decimal('6'),
        new Decimal('7'),
        new Decimal('8'),
        new Decimal('9'),
        new Decimal('10'),
        new Decimal('11'),
        new Decimal('12')
      ],
      selfSpeedMultipliers: [
        new Decimal(1),
        new Decimal('1e2500'),
        new Decimal('1e4200'),
        new Decimal('1e8000'),
        new Decimal('1e13000'),
        new Decimal('1e19000'),
        new Decimal('1e26000'),
        new Decimal('1e34000'),
        new Decimal('1e43000'),
        new Decimal('1e55000'),
        new Decimal('1e70000'),
        new Decimal('1e90000'),
        new Decimal('1e150000')
      ],
      selfPowerIncrement: 0.5
    },
    produces: AntProducers.Disciples
  }
}

export const calculateSelfSpeedFromMastery = (ant: AntProducers) => {
  const level = player.ants.producers[ant].mastery
  const selfPowerIncrement = level * baseAntInfo[ant].masteryInfo.selfPowerIncrement
  const selfBaseMult = baseAntInfo[ant].masteryInfo.selfSpeedMultipliers[level]
  return Decimal.pow(1 + selfPowerIncrement, player.ants.producers[ant].purchased).times(selfBaseMult)
}

export const calculateBaseAntsToBeGenerated = (ant: AntProducers, antSpeedMult = new Decimal(1)) => {
  return player.ants.producers[ant].generated
    .add(player.ants.producers[ant].purchased)
    .times(baseAntInfo[ant].baseProduction)
    .times(calculateSelfSpeedFromMastery(ant))
    .times(antSpeedMult)
}

export const generateAntsAndCrumbs = (dt: number): void => {
  const antSpeedMult = calculateActualAntSpeedMult()

  for (let antType = LAST_ANT; antType > AntProducers.Workers; antType--) {
    const baseGeneration = calculateBaseAntsToBeGenerated(antType, antSpeedMult)
    const producedAnt = baseAntInfo[antType].produces!
    player.ants.producers[producedAnt].generated = player.ants.producers[producedAnt].generated.add(
      baseGeneration
        .times(dt)
    )
  }

  // Separately handle Crumbs in the same way
  player.ants.crumbs = player.ants.crumbs.add(
    calculateBaseAntsToBeGenerated(AntProducers.Workers, antSpeedMult)
      .times(dt)
  )

  player.ants.highestCrumbsThisSacrifice = Decimal.max(player.ants.highestCrumbsThisSacrifice, player.ants.crumbs)
  player.ants.highestCrumbsEver = Decimal.max(player.ants.highestCrumbsEver, player.ants.crumbs)

  // Activate ELO if appropriate
  activateELO(dt)
}

export const getCostNextAnt = (ant: AntProducers) => {
  const data = baseAntInfo[ant]
  const nextCost = data.baseCost.times(
    Decimal.pow(
      data.costIncrease,
      player.ants.producers[ant].purchased
    )
  )
  const lastCost = player.ants.producers[ant].purchased > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.producers[ant].purchased - 1
      )
    )
    : new Decimal(0)
  return nextCost.sub(lastCost)
}

export const getCostMaxAnts = (ant: AntProducers) => {
  const maxBuyable = getMaxPurchasableAnts(ant, player.ants.crumbs)
  const data = baseAntInfo[ant]

  const spent = player.ants.producers[ant].purchased > 0
    ? Decimal.pow(data.costIncrease, player.ants.producers[ant].purchased - 1).times(data.baseCost)
    : new Decimal(0)

  const maxAntCost = Decimal.pow(data.costIncrease, maxBuyable - 1).times(data.baseCost)

  return maxAntCost.sub(spent)
}

export const getMaxPurchasableAnts = (ant: AntProducers, budget: Decimal): number => {
  const data = baseAntInfo[ant]
  const sunkCost = player.ants.producers[ant].purchased > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.producers[ant].purchased - 1
      )
    )
    : new Decimal(0)
  const realBudget = budget.add(sunkCost)

  return Math.max(0, 1 + Math.floor(Decimal.log(realBudget.div(data.baseCost), data.costIncrease)))
}

export const buyAntProducers = (ant: AntProducers, max: boolean) => {
  if (max) {
    const buyTo = getMaxPurchasableAnts(ant, player.ants.crumbs)
    if (buyTo <= player.ants.producers[ant].purchased) {
      return
    } else {
      const cost = getCostMaxAnts(ant)
      if (player.ants.crumbs.gte(cost)) {
        player.ants.crumbs = player.ants.crumbs.sub(cost)
        player.ants.producers[ant].purchased = buyTo
      }
    }
  } else {
    const cost = getCostNextAnt(ant)
    if (player.ants.crumbs.gte(cost)) {
      player.ants.crumbs = player.ants.crumbs.sub(cost)
      player.ants.producers[ant].purchased += 1
    }
  }
}

export const autobuyAntProducers = () => {
  const tiersUnlocked = +getAchievementReward('antAutobuyers') - 1
  for (let ant = LAST_ANT; ant >= AntProducers.Workers; ant--) {
    if (ant <= tiersUnlocked) {
      buyAntProducers(ant, player.antMax)
    }
  }
}

export const antProducerHTML = (ant: AntProducers) => {
  let nameText = i18next.t(`ants.producers.${ant}.name`)
  if (player.ants.producers[ant].mastery > 0) {
    nameText += ` <span style="color:green">[★${player.ants.producers[ant].mastery}]</span>`
  }
  const nameHTML = `<span style="font-size: 1.2em; color: ${
    baseAntInfo[ant].color
  }" class="titleTextFont">${nameText}</span>`
  const flavorHTML = `<span class="titleTextFont" style="color: lightgray">${
    i18next.t(`ants.producers.${ant}.flavor`)
  }</span>`

  const producerCountHTML = `<span>${
    i18next.t('ants.producerCount', {
      x: format(player.ants.producers[ant].purchased, 0, true),
      y: format(player.ants.producers[ant].generated, 2)
    })
  }</span>`

  const antSpeedMult = calculateActualAntSpeedMult()
  const antsToBeGenerated = calculateBaseAntsToBeGenerated(ant, antSpeedMult)
  const generationHTML = `<span>${
    i18next.t(`ants.producers.${ant}.generates`, {
      x: format(antsToBeGenerated, 5, true)
    })
  }</span>`

  let costHTML: string
  const maxBuy = getMaxPurchasableAnts(ant, player.ants.crumbs)
  if (player.antMax && maxBuy > player.ants.producers[ant].purchased) {
    const cost = getCostMaxAnts(ant)
    costHTML = i18next.t('ants.costMaxLevels', {
      x: format(maxBuy - player.ants.producers[ant].purchased, 0, true),
      y: format(cost, 2, true)
    })
  } else {
    const cost = getCostNextAnt(ant)
    costHTML = i18next.t('ants.costSingleLevel', { x: format(cost, 2, true) })
  }

  if (baseAntInfo[ant].additionalTexts.length > 0) {
    let additionalTextHTML = ''
    for (const texts of baseAntInfo[ant].additionalTexts) {
      if (texts.displayCondition()) {
        additionalTextHTML += `<br>${texts.text()}`
      }
    }
    return `${nameHTML}<br>${flavorHTML}<br><br>${producerCountHTML}<br>${generationHTML}<br>${additionalTextHTML}<br><br>${costHTML}`
  }

  return `${nameHTML}<br>${flavorHTML}<br><br>${producerCountHTML}<br>${generationHTML}<br><br>${costHTML}`
}

/**
 * PART 1.5: Ant Producer Masteries
 */

export const canBuyAntMastery = (ant: AntProducers): boolean => {
  const level = player.ants.producers[ant].mastery
  if (level >= MAX_ANT_MASTERY_LEVEL) {
    return false
  } else {
    const reqELO = baseAntInfo[ant].masteryInfo.totalELORequirements[level]
    const elo = player.ants.immortalELO
    const eloCheck = elo >= reqELO
    const particleCheck = player.reincarnationPoints.gte(baseAntInfo[ant].masteryInfo.particleCosts[level])
    return eloCheck && particleCheck
  }
}

export const buyAntMastery = (ant: AntProducers): void => {
  if (canBuyAntMastery(ant)) {
    const level = player.ants.producers[ant].mastery
    player.ants.producers[ant].mastery += 1
    player.ants.producers[ant].highestMastery = Math.max(
      player.ants.producers[ant].highestMastery,
      player.ants.producers[ant].mastery
    )
    player.reincarnationPoints = player.reincarnationPoints.sub(baseAntInfo[ant].masteryInfo.particleCosts[level])
  }
}

export const autobuyAntMasteries = (): void => {
  const highestUnlockedTier = +getAchievementReward('antAutobuyers') - 1
  for (let ant = LAST_ANT; ant >= AntProducers.Workers; ant--) {
    if (ant <= highestUnlockedTier) {
      while (canBuyAntMastery(ant) && player.ants.producers[ant].mastery < player.ants.producers[ant].highestMastery) {
        buyAntMastery(ant)
      }
    }
  }
}

export const antMasteryHTML = (ant: AntProducers): string => {
  const nameColor = `color-mix(in srgb, ${baseAntInfo[ant].color} 60%, lime 40%)`
  const nameHTML = `<span style="font-size: 1.2em; color: ${nameColor}" class="titleTextFont">${
    i18next.t(`ants.mastery.${ant}.name`)
  }</span>`
  const flavorHTML = `<span style="color: lightgray" class="titleTextFont">${
    i18next.t(`ants.mastery.${ant}.flavor`)
  }</span>`

  const level = player.ants.producers[ant].mastery
  const selfBaseMult = baseAntInfo[ant].masteryInfo.selfSpeedMultipliers[level]
  const selfPowerBase = level * baseAntInfo[ant].masteryInfo.selfPowerIncrement
  const selfTotalMult = calculateSelfSpeedFromMastery(ant)

  const levelHTML = `<span>${
    i18next.t('ants.mastery.level', { x: format(level, 0, true), y: format(MAX_ANT_MASTERY_LEVEL) })
  }</span>`
  const multHTML = `<span>${i18next.t(`ants.mastery.${ant}.effect`, { x: format(selfTotalMult, 2, false) })}</span>`

  let effectHTML = ''
  if (level >= MAX_ANT_MASTERY_LEVEL) {
    effectHTML = `<span>${
      i18next.t('ants.mastery.maxedSelfAnt', {
        x: format(selfBaseMult, 2, false)
      })
    }</span>`
    effectHTML += `<br><span>${
      i18next.t(`ants.mastery.${ant}.maxedSelfPer`, {
        x: format(1 + selfPowerBase, 2, true)
      })
    }</span>`

    return `${nameHTML}<br>${flavorHTML}<br><br>${levelHTML}<br>${effectHTML}<br>${multHTML}`
  } else {
    const selfBaseMultNextLevel = baseAntInfo[ant].masteryInfo.selfSpeedMultipliers[level + 1]
    const selfPowerBaseNextLevel = (level + 1) * baseAntInfo[ant].masteryInfo.selfPowerIncrement
    effectHTML = `<span>${
      i18next.t('ants.mastery.notMaxedSelfAnt', {
        x: format(selfBaseMult, 2, false),
        y: format(selfBaseMultNextLevel, 2, false)
      })
    }</span>`
    effectHTML += `<br><span>${
      i18next.t(`ants.mastery.${ant}.notMaxedSelfPer`, {
        x: format(1 + selfPowerBase, 3, true),
        y: format(1 + selfPowerBaseNextLevel, 3, true)
      })
    }</span>`

    const autoBuyer = +getAchievementReward('antAutobuyers')
    let autoBuyerHTML = ''
    if (autoBuyer >= ant && player.ants.producers[ant].mastery < player.ants.producers[ant].highestMastery) {
      autoBuyerHTML = `<span style="color:lime">${i18next.t('ants.mastery.alreadyPurchased')}</span><br>`
    }

    const reqELO = baseAntInfo[ant].masteryInfo.totalELORequirements[level]
    const reqELOHTML = `<span>${
      i18next.t('ants.mastery.eloRequirement', {
        x: format(reqELO, 0, true),
        y: format(player.ants.immortalELO, 0, true)
      })
    }</span>`

    const reqParticleCost = baseAntInfo[ant].masteryInfo.particleCosts[level]
    const reqParticleCostHTML = `<span>${
      i18next.t('ants.mastery.particleCost', {
        x: format(reqParticleCost, 0, true, undefined, undefined, true)
      })
    }</span>`

    return `${nameHTML}<br>${flavorHTML}<br><br>${levelHTML}<br>${effectHTML}<br>${multHTML}<br><br>${autoBuyerHTML}${reqELOHTML}<br>${reqParticleCostHTML}`
  }
}

/**
 * PART 2: Ant Upgrades (WOAH!)
 */

export enum AntUpgrades {
  AntSpeed = 0,
  Coins = 1,
  Taxes = 2,
  AcceleratorBoosts = 3,
  Multipliers = 4,
  Offerings = 5,
  BuildingCostScale = 6,
  Salvage = 7,
  FreeRunes = 8,
  Obtainium = 9,
  AntSacrifice = 10,
  Mortuus = 11
}

export const LAST_ANT_UPGRADE = AntUpgrades.Mortuus

type AntUpgradeTypeMap = {
  [AntUpgrades.AntSpeed]: { antSpeed: Decimal }
  [AntUpgrades.Coins]: {
    crumbToCoinExp: number
    coinMultiplier: Decimal
  }
  [AntUpgrades.Taxes]: { taxReduction: number }
  [AntUpgrades.AcceleratorBoosts]: { acceleratorBoostMult: number }
  [AntUpgrades.Multipliers]: { multiplierMult: number }
  [AntUpgrades.Offerings]: { offeringMult: number }
  [AntUpgrades.BuildingCostScale]: { buildingCostScale: number }
  [AntUpgrades.Salvage]: { salvage: number }
  [AntUpgrades.FreeRunes]: { freeRuneLevel: number }
  [AntUpgrades.Obtainium]: { obtainiumMult: number }
  [AntUpgrades.AntSacrifice]: { antSacrificeMultiplier: number }
  [AntUpgrades.Mortuus]: {
    talismanUnlock: boolean
    globalSpeed: number
  }
}

interface AntUpgradeData<K extends AntUpgrades> {
  baseCost: Decimal
  costIncrease: number
  antUpgradeHTML: {
    color: string
  }
  minimumResetTier: resetTiers
  name: () => string
  intro: () => string
  description: () => string
  effect: (n: number) => AntUpgradeTypeMap[K]
  effectDescription: () => string
}

export const antUpgrades: { [K in AntUpgrades]: AntUpgradeData<K> } = {
  [AntUpgrades.AntSpeed]: {
    baseCost: new Decimal(100),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.antSpeed.name'),
    intro: () => i18next.t('ants.upgrades.antSpeed.intro'),
    description: () => {
      let baseMul = 1.1
      baseMul += player.researches[101] / 1000 // Research 5x1
      baseMul += player.researches[162] / 1000 // Research 7x12
      return i18next.t('ants.upgrades.antSpeed.description', { x: format(baseMul, 3, true) })
    },
    effect: (n: number) => {
      let baseMul = 1.1
      baseMul += player.researches[101] / 1000 // Research 5x1
      baseMul += player.researches[162] / 1000 // Research 7x12
      return {
        antSpeed: Decimal.pow(baseMul, n)
      }
    },
    effectDescription: () => {
      const antSpeed = getAntUpgradeEffect(AntUpgrades.AntSpeed).antSpeed
      return i18next.t('ants.upgrades.antSpeed.effect', { x: format(antSpeed, 2, true) })
    }
  },
  [AntUpgrades.Coins]: {
    baseCost: new Decimal(100),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'yellow'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.coins.name'),
    intro: () => i18next.t('ants.upgrades.coins.intro'),
    description: () => i18next.t('ants.upgrades.coins.description'),
    effect: (n: number) => {
      let divisor = player.corruptions.used.corruptionEffects('extinction')
      if (player.currentChallenge.ascension === 15) {
        divisor *= 1000
      }
      const exponent = (99999 + calculateSigmoidExponential(49900001, n / 5000 * 500 / 499)) / divisor
      const coinMult = Decimal.max(1, Decimal.pow(player.ants.crumbs, exponent))
      return {
        crumbToCoinExp: exponent,
        coinMultiplier: coinMult
      }
    },
    effectDescription: () => {
      const crumbToCoinExp = getAntUpgradeEffect(AntUpgrades.Coins).crumbToCoinExp
      const overallEffect = Decimal.max(1, Decimal.pow(player.ants.crumbs, crumbToCoinExp))
      const effect1 = i18next.t('ants.upgrades.coins.effect', { x: format(crumbToCoinExp, 0, true) })
      const effect2 = i18next.t('ants.upgrades.coins.effect2', { x: format(overallEffect, 2, true) })
      return `${effect1}<br>${effect2}`
    }
  },
  [AntUpgrades.Taxes]: {
    baseCost: new Decimal(1000),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'lightgray'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.taxes.name'),
    intro: () => i18next.t('ants.upgrades.taxes.intro'),
    description: () => i18next.t('ants.upgrades.taxes.description'),
    effect: (n: number) => {
      return {
        taxReduction: 0.005 + 0.995 * Math.pow(0.99, n)
      }
    },
    effectDescription: () => {
      const taxReduction = getAntUpgradeEffect(AntUpgrades.Taxes).taxReduction
      return i18next.t('ants.upgrades.taxes.effect', { x: formatAsPercentIncrease(taxReduction, 4) })
    }
  },
  [AntUpgrades.AcceleratorBoosts]: {
    baseCost: new Decimal(1000),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.acceleratorBoosts.name'),
    intro: () => i18next.t('ants.upgrades.acceleratorBoosts.intro'),
    description: () => i18next.t('ants.upgrades.acceleratorBoosts.description'),
    effect: (n: number) => {
      return {
        acceleratorBoostMult: calculateSigmoidExponential(40, n / 1000 * 40 / 39)
      }
    },
    effectDescription: () => {
      const acceleratorBoostMult = getAntUpgradeEffect(AntUpgrades.AcceleratorBoosts).acceleratorBoostMult
      return i18next.t('ants.upgrades.acceleratorBoosts.effect', {
        x: formatAsPercentIncrease(acceleratorBoostMult, 2)
      })
    }
  },
  [AntUpgrades.Multipliers]: {
    baseCost: new Decimal(1e5),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.multipliers.name'),
    intro: () => i18next.t('ants.upgrades.multipliers.intro'),
    description: () => i18next.t('ants.upgrades.multipliers.description'),
    effect: (n: number) => {
      return {
        multiplierMult: calculateSigmoidExponential(40, n / 1000 * 80 / 79)
      }
    },
    effectDescription: () => {
      const multiplierMult = getAntUpgradeEffect(AntUpgrades.Multipliers).multiplierMult
      return i18next.t('ants.upgrades.multipliers.effect', { x: formatAsPercentIncrease(multiplierMult, 2) })
    }
  },
  [AntUpgrades.Offerings]: {
    baseCost: new Decimal(1e6),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'orange'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.offerings.name'),
    intro: () => i18next.t('ants.upgrades.offerings.intro'),
    description: () => i18next.t('ants.upgrades.offerings.description'),
    effect: (n: number) => {
      return {
        offeringMult: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const offeringMult = getAntUpgradeEffect(AntUpgrades.Offerings).offeringMult
      return i18next.t('ants.upgrades.offerings.effect', { x: formatAsPercentIncrease(offeringMult, 2) })
    }
  },
  [AntUpgrades.BuildingCostScale]: {
    baseCost: new Decimal(1e11),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'lime'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.buildingCostScale.name'),
    intro: () => i18next.t('ants.upgrades.buildingCostScale.intro'),
    description: () => i18next.t('ants.upgrades.buildingCostScale.description'),
    effect: (n: number) => {
      const scalePercent = Math.min(9999999, 3 * n)
      return {
        buildingCostScale: scalePercent / 100
      }
    },
    effectDescription: () => {
      const buildingCostScale = getAntUpgradeEffect(AntUpgrades.BuildingCostScale).buildingCostScale
      return i18next.t('ants.upgrades.buildingCostScale.effect', {
        x: formatAsPercentIncrease(1 + buildingCostScale, 0)
      })
    }
  },
  [AntUpgrades.Salvage]: {
    baseCost: new Decimal(1e15),
    costIncrease: 1000,
    antUpgradeHTML: {
      color: 'green'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.salvage.name'),
    intro: () => i18next.t('ants.upgrades.salvage.intro'),
    description: () => i18next.t('ants.upgrades.salvage.description'),
    effect: (n: number) => {
      return {
        salvage: 120 * (1 - Math.pow(0.995, n))
      }
    },
    effectDescription: () => {
      const salvage = getAntUpgradeEffect(AntUpgrades.Salvage).salvage
      return i18next.t('ants.upgrades.salvage.effect', { x: format(salvage, 2) })
    }
  },
  [AntUpgrades.FreeRunes]: {
    baseCost: new Decimal(1e20),
    costIncrease: 1000,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.freeRunes.name'),
    intro: () => i18next.t('ants.upgrades.freeRunes.intro'),
    description: () => i18next.t('ants.upgrades.freeRunes.description'),
    effect: (n: number) => {
      return {
        freeRuneLevel: 3000 * (1 - Math.pow(1 - 1 / 3000, n))
      }
    },
    effectDescription: () => {
      const freeRuneLevel = getAntUpgradeEffect(AntUpgrades.FreeRunes).freeRuneLevel
      return i18next.t('ants.upgrades.freeRunes.effect', { x: format(freeRuneLevel, 0, true) })
    }
  },
  [AntUpgrades.Obtainium]: {
    baseCost: new Decimal(1e6),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.obtainium.name'),
    intro: () => i18next.t('ants.upgrades.obtainium.intro'),
    description: () => i18next.t('ants.upgrades.obtainium.description'),
    effect: (n: number) => {
      return {
        obtainiumMult: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const obtainiumMult = getAntUpgradeEffect(AntUpgrades.Obtainium).obtainiumMult
      return i18next.t('ants.upgrades.obtainium.effect', { x: formatAsPercentIncrease(obtainiumMult, 2) })
    }
  },
  [AntUpgrades.AntSacrifice]: {
    baseCost: new Decimal(1e120),
    costIncrease: 1e20,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.antSacrifice.name'),
    intro: () => i18next.t('ants.upgrades.antSacrifice.intro'),
    description: () => i18next.t('ants.upgrades.antSacrifice.description'),
    effect: (n: number) => {
      return {
        antSacrificeMultiplier: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const antSacrificeMultiplier = getAntUpgradeEffect(AntUpgrades.AntSacrifice).antSacrificeMultiplier
      return i18next.t('ants.upgrades.antSacrifice.effect', { x: formatAsPercentIncrease(antSacrificeMultiplier, 2) })
    }
  },
  [AntUpgrades.Mortuus]: {
    baseCost: new Decimal(1e300),
    costIncrease: 1e100,
    antUpgradeHTML: {
      color: 'gray'
    },
    minimumResetTier: resetTiers.singularity,
    name: () => i18next.t('ants.upgrades.mortuus.name'),
    intro: () => i18next.t('ants.upgrades.mortuus.intro'),
    description: () => i18next.t('ants.upgrades.mortuus.description'),
    effect: (n: number) => {
      return {
        talismanUnlock: n > 0,
        globalSpeed: 2 - Math.pow(0.99, n)
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.Mortuus)
      const effect1 = i18next.t('ants.upgrades.mortuus.effect', { checkMark: effects.talismanUnlock ? '✔️' : '❌' })
      const effect2 = i18next.t('ants.upgrades.mortuus.effect2', { x: formatAsPercentIncrease(effects.globalSpeed, 2) })
      return `${effect1}<br>${effect2}`
    }
  }
}

export const computeFreeAntUpgradeLevels = () => {
  let bonusLevels = 0
  bonusLevels += CalcECC('reincarnation', player.challengecompletions[9])
  bonusLevels += 2000 * (1 - Math.pow(0.999, player.constantUpgrades[6]))
  bonusLevels += 12 * CalcECC('ascension', player.challengecompletions[11])
  bonusLevels += 4 * player.researches[97]
  bonusLevels += player.researches[102]
  bonusLevels += 2 * player.researches[132]
  bonusLevels += Math.floor((1 / 200) * player.researches[200])
  bonusLevels *= G.challenge15Rewards.bonusAntLevel.value

  if (player.currentChallenge.ascension === 11) {
    bonusLevels += Math.floor(
      (4 * player.challengecompletions[8]
        + 23 * player.challengecompletions[9])
        * Math.max(0, 1 - player.challengecompletions[11] / 10)
    )
    return bonusLevels
  }

  return bonusLevels
}

export const calculateTrueAntLevel = (antUpgrade: AntUpgrades) => {
  const freeLevels = computeFreeAntUpgradeLevels()
  const corruptionDivisor = player.corruptions.used.corruptionEffects('extinction')
  if (player.currentChallenge.ascension === 11) {
    return freeLevels / corruptionDivisor
  } else {
    return (player.ants.upgrades[antUpgrade]
      + Math.min(player.ants.upgrades[antUpgrade], freeLevels)) / corruptionDivisor
  }
}

export const getAntUpgradeEffect = <K extends AntUpgrades>(antUpgrade: K): AntUpgradeTypeMap[K] => {
  const actualLevel = calculateTrueAntLevel(antUpgrade)
  return antUpgrades[antUpgrade].effect(actualLevel)
}

export const getCostNextAntUpgrade = (antUpgrade: AntUpgrades) => {
  const data = antUpgrades[antUpgrade]
  const nextCost = data.baseCost.times(
    Decimal.pow(
      data.costIncrease,
      player.ants.upgrades[antUpgrade]
    )
  )
  const lastCost = player.ants.upgrades[antUpgrade] > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.upgrades[antUpgrade] - 1
      )
    )
    : new Decimal(0)
  return nextCost.sub(lastCost)
}

export const getCostMaxAntUpgrades = (antUpgrade: AntUpgrades) => {
  const maxBuyable = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
  const data = antUpgrades[antUpgrade]

  const spent = player.ants.upgrades[antUpgrade] > 0
    ? Decimal.pow(data.costIncrease, player.ants.upgrades[antUpgrade] - 1).times(data.baseCost)
    : new Decimal(0)

  const maxAntUpgradeCost = Decimal.pow(data.costIncrease, maxBuyable - 1).times(data.baseCost)

  return maxAntUpgradeCost.sub(spent)
}

export const getMaxPurchasableAntUpgrades = (antUpgrade: AntUpgrades, budget: Decimal): number => {
  const data = antUpgrades[antUpgrade]
  const sunkCost = player.ants.upgrades[antUpgrade] > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.upgrades[antUpgrade] - 1
      )
    )
    : new Decimal(0)
  const realBudget = budget.add(sunkCost)

  return Math.max(0, 1 + Math.floor(Decimal.log(realBudget.div(data.baseCost), data.costIncrease)))
}

export const buyAntUpgrade = (antUpgrade: AntUpgrades, max: boolean) => {
  if (max) {
    const buyTo = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
    if (buyTo <= player.ants.upgrades[antUpgrade]) {
      return
    } else {
      const cost = getCostMaxAntUpgrades(antUpgrade)
      if (player.ants.crumbs.gte(cost)) {
        player.ants.crumbs = player.ants.crumbs.sub(cost)
        player.ants.upgrades[antUpgrade] = buyTo
      }
    }
  } else {
    const cost = getCostNextAntUpgrade(antUpgrade)
    if (player.ants.crumbs.gte(cost)) {
      player.ants.crumbs = player.ants.crumbs.sub(cost)
      player.ants.upgrades[antUpgrade] += 1
    }
  }
}

export const autoBuyAntUpgrades = () => {
  const upgradesUnlocked = +getAchievementReward('antUpgradeAutobuyers')
  for (let upgrade = AntUpgrades.AntSpeed; upgrade < LAST_ANT_UPGRADE; upgrade++) {
    if (upgrade < upgradesUnlocked) {
      buyAntUpgrade(upgrade, player.antMax)
    }
  }

  // The way mortuus autobuy is unlocked is
  // research 6x20. The above loop won't catch it!
  if (player.researches[145] > 0) {
    buyAntUpgrade(AntUpgrades.Mortuus, player.antMax)
  }
}

export const antUpgradeHTML = (antUpgrade: AntUpgrades) => {
  const upgradeData = antUpgrades[antUpgrade]
  const nameHTML = `<span style="font-size: 1.2em;" class="titleTextFont">${upgradeData.name()}</span>`
  const introHTML = `<span class="titleTextFont" style="color: lightgray">${upgradeData.intro()}</span>`

  const freeLevels = computeFreeAntUpgradeLevels()
  const levelHTML = `<span class="crimsonText">${
    i18next.t('ants.level', { x: format(player.ants.upgrades[antUpgrade], 0, true), y: format(freeLevels, 0, true) })
  }</span>`

  let challengeHTML = ''
  if (player.currentChallenge.ascension === 11) {
    challengeHTML = `<br><span style="color: orange">${i18next.t('ants.challenge11Modifier')}</span>`
  }

  let extinctionHTML = ''
  if (player.corruptions.used.extinction > 0) {
    extinctionHTML = `<br><span style="color: #00DDFF">${
      i18next.t('ants.corruptionDivisor', {
        x: format(player.corruptions.used.extinction, 0, true),
        y: format(player.corruptions.used.corruptionEffects('extinction'), 0, true)
      })
    }</span>`
  }
  const effectiveLevelHTML = `<span><b>${
    i18next.t('ants.effectiveLevel', { level: format(calculateTrueAntLevel(antUpgrade), 2, true) })
  }</b></span>`

  const descriptionHTML = `<span>${upgradeData.description()}</span>`

  const effectHTML = `<span style="color: gold">${upgradeData.effectDescription()}</span>`

  let costHTML: string
  const maxBuy = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
  if (player.antMax && maxBuy > player.ants.upgrades[antUpgrade]) {
    const cost = getCostMaxAntUpgrades(antUpgrade)
    costHTML = i18next.t('ants.costMaxLevels', {
      x: format(maxBuy - player.ants.upgrades[antUpgrade], 0, true),
      y: format(cost, 2, true)
    })
  } else {
    const cost = getCostNextAntUpgrade(antUpgrade)
    costHTML = i18next.t('ants.costSingleLevel', { x: format(cost, 2, true) })
  }

  return `${nameHTML}<br>${introHTML}<br><br>${levelHTML}${challengeHTML}${extinctionHTML}<br>${effectiveLevelHTML}<br><br>${descriptionHTML}<br>${effectHTML}<br><br>${costHTML}`
}

export const calculateRebornELOThresholds = (elo?: number) => {
  const rebornELO = elo ?? player.ants.rebornELO
  let thresholds = 0

  thresholds += Math.floor(Math.min(100, rebornELO / 100))
  thresholds += Math.floor(Math.min(100, Math.max(0, (rebornELO - 10_000) / 1000)))
  thresholds += Math.floor(Math.min(100, Math.max(0, (rebornELO - 110_000) / 3000)))
  thresholds += Math.floor(Math.min(700, Math.max(0, (rebornELO - 410_000) / 20000)))
  thresholds += Math.floor(Math.max(0, (rebornELO - 14_410_000) / 100000))
  return thresholds
}

export const thresholdModifiers = () => {
  const thresholds = calculateRebornELOThresholds()
  return {
    rebornSpeedMult: Math.pow(0.99, thresholds),
    antSacrificeObtainiumMult: Math.pow(1.05, thresholds),
    antSacrificeOfferingMult: Math.pow(1.05, thresholds),
    antSacrificeTalismanFragmentMult: Math.pow(1.2, thresholds)
  }
}

export const showSacrifice = () => {
  const sacRewards = calculateAntSacrificeRewards()

  const baseELO = calculateBaseAntELO()
  const effectiveELO = calculateEffectiveAntELO(baseELO)

  const timeMultiplier = offeringObtainiumTimeModifiers(player.antSacrificeTimer, true).reduce(
    (a, b) => a * b.stat(),
    1
  )
  DOMCacheGetOrSet('ELO').innerHTML = i18next.t('ants.yourAntELO', {
    x: format(effectiveELO, 2, true)
  })

  DOMCacheGetOrSet('crumbCountAgain').textContent = i18next.t(
    'ants.galacticCrumbCountThisSacrifice',
    {
      x: format(player.ants.highestCrumbsThisSacrifice, 2, true, undefined, undefined, true)
    }
  )

  DOMCacheGetOrSet('sacrificeUpgradeMultiplier').innerHTML = i18next.t('ants.altarRewardMultiplier', {
    x: format(calculateAntSacrificeMultiplier(), 3, true)
  })

  DOMCacheGetOrSet('sacrificeTimeMultiplier').innerHTML = i18next.t('ants.altarTimeMultiplier', {
    x: format(timeMultiplier, 3, true)
  })

  DOMCacheGetOrSet('immortalELO').innerHTML = i18next.t('ants.immortalELO', {
    x: format(player.ants.immortalELO, 0, true)
  })
  DOMCacheGetOrSet('activatedImmortalELO').innerHTML = i18next.t('ants.activatedImmortalELO', {
    x: format(player.ants.rebornELO, 2, true),
    y: format(calculateAvailableActivatableELO(), 2, true)
  })

  DOMCacheGetOrSet('ELOStage').innerHTML = i18next.t('ants.eloStage', {
    x: format(calculateRebornELOThresholds(), 0, true)
  })

  DOMCacheGetOrSet('immortalELOAntSpeed').innerHTML = i18next.t('ants.immortalELOAntSpeed', {
    x: format(calculateAntSpeedMultFromELO(), 2, true)
  })

  const thresholdMods = thresholdModifiers()

  DOMCacheGetOrSet('immortalELOOfferings').innerHTML = i18next.t('ants.rebornOfferingMult', {
    x: format(thresholdMods.antSacrificeOfferingMult, 2, false)
  })
  DOMCacheGetOrSet('immortalELOObtainium').innerHTML = i18next.t('ants.rebornObtainiumMult', {
    x: format(thresholdMods.antSacrificeObtainiumMult, 2, false)
  })
  DOMCacheGetOrSet('immortalELOTalismanFragments').innerHTML = i18next.t('ants.rebornTalismanShardMult', {
    x: format(thresholdMods.antSacrificeTalismanFragmentMult, 2, false)
  })

  DOMCacheGetOrSet('immortalELOCreationSpeed').innerHTML = i18next.t('ants.rebornELOGainSpeed', {
    x: format(thresholdMods.rebornSpeedMult, 3, true)
  })

  if (player.ants.immortalELO < effectiveELO) {
    DOMCacheGetOrSet('immortalELOGain').innerHTML = i18next.t('ants.immortalELOGain', {
      x: format(sacRewards.antSacrificePoints, 0, true)
    })
  } else {
    DOMCacheGetOrSet('immortalELOGain').innerHTML = i18next.t('ants.immortalELOUntilGain', {
      x: format(player.ants.immortalELO - effectiveELO, 0, true)
    })
  }

  DOMCacheGetOrSet('antSacrificeOffering').textContent = `+${format(sacRewards.offerings)}`
  DOMCacheGetOrSet('antSacrificeObtainium').textContent = `+${format(sacRewards.obtainium)}`

  // ELO requirements for each reward type
  const eloRequirements = {
    talismanShards: 200,
    commonFragments: 400,
    uncommonFragments: 700,
    rareFragments: 1200,
    epicFragments: 2000,
    legendaryFragments: 4000,
    mythicalFragments: 10000
  }

  if (player.challengecompletions[9] > 0) {
    // Helper function to update reward display and styling
    const updateRewardDisplay = (
      elementId: string,
      reward: Decimal,
      requirement: number,
      parentElementClass?: string
    ) => {
      const element = DOMCacheGetOrSet(elementId)
      const parentElement = parentElementClass ? element.closest(`.${parentElementClass}`) : element.parentElement

      if (effectiveELO >= requirement) {
        // Unlocked: show reward amount, remove locked styling
        element.textContent = i18next.t('ants.elo', { x: format(reward) })
        parentElement?.classList.remove('antSacrificeRewardLocked')
        const img = parentElement?.querySelector('img')
        img?.classList.remove('antSacrificeRewardImageLocked')
      } else {
        // Locked: show ELO requirement, add locked styling
        element.textContent = i18next.t('ants.eloRequirement', { x: format(requirement, 0, true) })
        parentElement?.classList.add('antSacrificeRewardLocked')
        const img = parentElement?.querySelector('img')
        img?.classList.add('antSacrificeRewardImageLocked')
      }
    }

    updateRewardDisplay(
      'antSacrificeTalismanShard',
      sacRewards.talismanShards,
      eloRequirements.talismanShards,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeCommonFragment',
      sacRewards.commonFragments,
      eloRequirements.commonFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeUncommonFragment',
      sacRewards.uncommonFragments,
      eloRequirements.uncommonFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeRareFragment',
      sacRewards.rareFragments,
      eloRequirements.rareFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeEpicFragment',
      sacRewards.epicFragments,
      eloRequirements.epicFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeLegendaryFragment',
      sacRewards.legendaryFragments,
      eloRequirements.legendaryFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeMythicalFragment',
      sacRewards.mythicalFragments,
      eloRequirements.mythicalFragments,
      'antSacrificeRewardColumn'
    )
  }
}

export const sacrificeAnts = async (auto = false) => {
  let p = true

  if (player.ants.crumbs.gte('1e70')) {
    if (!auto && player.toggles[32]) {
      p = await Confirm(i18next.t('ants.autoReset'))
    }
    if (p) {
      const antSacrificePointsBefore = player.ants.immortalELO

      const sacRewards = calculateAntSacrificeRewards()
      player.ants.immortalELO += sacRewards.antSacrificePoints
      player.offerings = player.offerings.add(sacRewards.offerings)

      if (player.currentChallenge.ascension !== 14) {
        player.obtainium = player.obtainium.add(sacRewards.obtainium)
      }

      const baseELO = calculateBaseAntELO()
      const effectiveELO = calculateEffectiveAntELO(baseELO)
      const crumbsPerSecond = player.antSacrificeTimer > 0
        ? player.ants.crumbs.div(player.antSacrificeTimer)
        : 0

      const historyEntry: ResetHistoryEntryAntSacrifice = {
        date: Date.now(),
        seconds: player.antSacrificeTimer,
        kind: 'antsacrifice',
        offerings: sacRewards.offerings,
        obtainium: sacRewards.obtainium,
        antSacrificePointsBefore,
        antSacrificePointsAfter: player.ants.immortalELO,
        baseELO: baseELO,
        effectiveELO: effectiveELO,
        crumbs: player.ants.crumbs.toString(),
        crumbsPerSecond: crumbsPerSecond.toString()
      }

      if (player.challengecompletions[9] > 0) {
        player.talismanShards = player.talismanShards.add(sacRewards.talismanShards)
        player.commonFragments = player.commonFragments.add(sacRewards.commonFragments)
        player.uncommonFragments = player.uncommonFragments.add(sacRewards.uncommonFragments)
        player.rareFragments = player.rareFragments.add(sacRewards.rareFragments)
        player.epicFragments = player.epicFragments.add(sacRewards.epicFragments)
        player.legendaryFragments = player.legendaryFragments.add(sacRewards.legendaryFragments)
        player.mythicalFragments = player.mythicalFragments.add(sacRewards.mythicalFragments)
      }
      awardAchievementGroup('sacMult')
      // Now we're safe to reset the ants.
      resetAnts(resetTiers.reincarnation)
      updateTalismanInventory()
      resetHistoryAdd('ants', historyEntry)
    }
  }

  if (player.mythicalFragments.gte(1e11) && player.currentChallenge.ascension === 14) {
    awardUngroupedAchievement('seeingRedNoBlue')
  }
}

export const calculateAvailableActivatableELO = () => {
  const pool = player.ants.immortalELO
  const alreadyActivated = player.ants.rebornELO
  const currentELO = calculateEffectiveAntELO()
  return Math.max(0, Math.min(pool, currentELO) - alreadyActivated)
}

export const activationSpeedMult = () => {
  let multiplier = 1
  if (player.ants.producers[AntProducers.Queens].purchased > 0) {
    multiplier *= 1.15
  }
  if (player.ants.producers[AntProducers.LordRoyals].purchased > 0) {
    multiplier *= 1.25
  }
  if (player.ants.producers[AntProducers.Almighties].purchased > 0) {
    multiplier *= 1.4
  }
  if (player.ants.producers[AntProducers.Disciples].purchased > 0) {
    multiplier *= 2
  }
  if (player.ants.producers[AntProducers.HolySpirit].purchased > 0) {
    multiplier *= 3
  }
  multiplier *= 1 + 0.1 * player.upgrades[124]
  multiplier *= calculateAntELOCubeBlessing()
  multiplier *= +getAchievementReward('antELOMultiplicative')
  multiplier *= 1 + player.researches[110] / 100
  multiplier *= 1 + player.researches[148] / 100
  multiplier *= 1 + player.platonicUpgrades[12] / 10
  multiplier *= getTalismanEffects('mortuus').antBonus
  multiplier *= thresholdModifiers().rebornSpeedMult
  return multiplier
}

export const activateELO = (dt: number) => {
  const toActivate = calculateAvailableActivatableELO()
  if (toActivate > 0) {
    const activationSpeed = dt * activationSpeedMult()
    const decayedGain = toActivate * (1 - Math.pow(0.999, activationSpeed))
    const linearGain = 100 * activationSpeed
    const actualGain = Math.min(decayedGain, linearGain)
    player.ants.rebornELO += actualGain

    // Make it so that *eventually* the ELO is fully activated
    const smallLeak = Math.min(0.001 * activationSpeed, toActivate - actualGain)
    player.ants.rebornELO += smallLeak
  }
  updateAntLeaderboards()
  const quarksToBeGained = availableQuarksFromELO()
  player.worlds.add(quarksToBeGained, false)
  player.ants.quarksGainedFromAnts += quarksToBeGained
}

export const calculateAntSpeedMultFromELO = () => {
  return Decimal.pow(1.02, player.ants.rebornELO)
}

export const quarksFromELOMult = () => {
  const lifetimeTotalELOValue = calculateLeaderboardValue(player.ants.highestRebornELOEver)
  const numStages = calculateRebornELOThresholds(lifetimeTotalELOValue)
  return 2 - Math.pow(0.8, numStages / 100)
}

export const availableQuarksFromELO = () => {
  const totalELOValue = calculateLeaderboardValue(player.ants.highestRebornELODaily)
  const numStages = calculateRebornELOThresholds(totalELOValue)
  let baseQuarks = 0
  baseQuarks += Math.min(100, numStages)
  baseQuarks += 2 * Math.min(100, Math.max(0, numStages - 100))
  baseQuarks += 3 * Math.min(100, Math.max(0, numStages - 200))
  baseQuarks += 4 * Math.min(700, Math.max(0, numStages - 300))
  baseQuarks += 5 * Math.max(0, numStages - 1000)

  const antQuarkMult = quarksFromELOMult()
  return player.worlds.applyBonus(baseQuarks) * antQuarkMult - player.ants.quarksGainedFromAnts
}

let ELOInformation: 'overview' | 'info' = 'overview'

export const toggleRebornELOInfo = () => {
  ELOInformation = ELOInformation === 'overview' ? 'info' : 'overview'
  const info = DOMCacheGetOrSet('immortalELOInfo')
  const overview = DOMCacheGetOrSet('immortalELOOverview')
  const toggleButton = DOMCacheGetOrSet('immortalELOInfoToggleButton')

  if (ELOInformation === 'overview') {
    info.style.display = 'none'
    overview.style.display = 'flex'
  } else {
    info.style.display = 'flex'
    overview.style.display = 'none'
  }

  const mode = ELOInformation === 'overview' ? 'toggleOverview' : 'toggleInfo'
  toggleButton.setAttribute('data-mode', ELOInformation)
  toggleButton.querySelector('span')!.textContent = i18next.t(`ants.compendium.${mode}`)
  toggleButton.querySelector('span')!.setAttribute('i18n', `ants.compendium.${mode}`)
}

/**
 * PART 3: Ant ELO Leaderboard System
 */

const LEADERBOARD_WEIGHTS = [1, 0.7, 0.5, 0.3, 0.2, 0.15, 0.1, 0.05]

export const updateAntLeaderboards = () => {
  const currentELO = player.ants.rebornELO
  const currentSacrificeId = player.ants.currentSacrificeId

  // Update daily leaderboard
  updateSingleLeaderboard(player.ants.highestRebornELODaily, currentELO, currentSacrificeId)

  // Update all-time leaderboard
  updateSingleLeaderboard(player.ants.highestRebornELOEver, currentELO, currentSacrificeId)
}

const updateSingleLeaderboard = (
  leaderboard: Array<{ elo: number; sacrificeId: number }>,
  currentELO: number,
  currentSacrificeId: number
) => {
  // First, check if currentELO suffices (if it does not... no action needed)
  if (leaderboard.length === 8) {
    if (currentELO < leaderboard[leaderboard.length - 1].elo) {
      return
    }
  }

  // Find if current sacrifice is already in the leaderboard
  const existingIndex = leaderboard.findIndex((entry) => entry.sacrificeId === currentSacrificeId)
  if (existingIndex !== -1) {
    // Update existing entry
    leaderboard[existingIndex].elo = currentELO
    if (existingIndex > 0 && leaderboard[existingIndex].elo > leaderboard[existingIndex - 1].elo) {
      // Sort again
      leaderboard.sort((a, b) => b.elo - a.elo)
    }
  } else {
    // Add new entry
    leaderboard.push({ elo: currentELO, sacrificeId: currentSacrificeId })
    leaderboard.sort((a, b) => b.elo - a.elo)
  }

  // Keep only top 8
  if (leaderboard.length > 8) {
    leaderboard.length = 8
  }
}

export const calculateLeaderboardValue = (leaderboard: Array<{ elo: number; sacrificeId: number }>): number => {
  let total = 0
  for (let i = 0; i < Math.min(leaderboard.length, LEADERBOARD_WEIGHTS.length); i++) {
    total += leaderboard[i].elo * LEADERBOARD_WEIGHTS[i]
  }
  return total
}

export const clearDailyLeaderboard = () => {
  player.ants.highestRebornELODaily = []
}

let currentLeaderboardMode: 'daily' | 'allTime' = 'daily'

export const toggleLeaderboardMode = () => {
  currentLeaderboardMode = currentLeaderboardMode === 'daily' ? 'allTime' : 'daily'
  updateLeaderboardUI()
}

export const updateLeaderboardUI = () => {
  const leaderboard = currentLeaderboardMode === 'daily'
    ? player.ants.highestRebornELODaily
    : player.ants.highestRebornELOEver

  // Update toggle button text
  const toggleButton = DOMCacheGetOrSet('antLeaderboardToggle')
  const modeKey = currentLeaderboardMode === 'daily' ? 'toggleDaily' : 'toggleAllTime'
  toggleButton.querySelector('span')!.setAttribute('i18n', `ants.leaderboard.${modeKey}`)
  toggleButton.querySelector('span')!.textContent = i18next.t(`ants.leaderboard.${modeKey}`)
  toggleButton.setAttribute('data-mode', currentLeaderboardMode)

  // Update leaderboard value
  const leaderboardValue = calculateLeaderboardValue(leaderboard)
  DOMCacheGetOrSet('antLeaderboardValueAmount').innerHTML = i18next.t('ants.leaderboard.value', {
    x: format(leaderboardValue, 0, true),
    y: format(calculateRebornELOThresholds(leaderboardValue), 0, true)
  })

  if (currentLeaderboardMode === 'daily') {
    DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').innerHTML = i18next.t('ants.leaderboard.quarksGained', {
      x: format(player.ants.quarksGainedFromAnts, 0, false)
    })
  } else {
    DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').innerHTML = i18next.t('ants.leaderboard.quarkMult', {
      x: formatAsPercentIncrease(quarksFromELOMult(), 2)
    })
  }

  // Update table rows
  const tbody = DOMCacheGetOrSet('antLeaderboardTableBody')
  tbody.innerHTML = ''

  const currentSacrificeId = player.ants.currentSacrificeId

  for (let i = 0; i < leaderboard.length; i++) {
    const entry = leaderboard[i]
    const row = document.createElement('tr')

    // Highlight current ongoing sacrifice
    if (entry.sacrificeId === currentSacrificeId) {
      row.classList.add('antLeaderboardCurrentSacrifice')
    }

    // Rank column
    const rankCell = document.createElement('td')
    rankCell.textContent = `#${i + 1}`
    row.appendChild(rankCell)

    // ELO column
    const eloCell = document.createElement('td')
    eloCell.textContent = format(entry.elo, 0, true)
    row.appendChild(eloCell)

    const stageCell = document.createElement('td')
    stageCell.textContent = format(calculateRebornELOThresholds(entry.elo), 0, true)
    row.appendChild(stageCell)

    const weightCell = document.createElement('td')
    weightCell.textContent = `${LEADERBOARD_WEIGHTS[i]}`
    row.appendChild(weightCell)

    tbody.appendChild(row)
  }
}
