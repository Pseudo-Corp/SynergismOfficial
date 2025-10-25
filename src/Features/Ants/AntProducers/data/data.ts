import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { calculateELOMult } from '../../../../Calculate'
import { format, player } from '../../../../Synergism'
import { calculateSelfSpeedFromMastery } from '../../AntMasteries/lib/ant-speed'
import { AntProducers } from '../../structs/structs'
import type { AntProducerData } from '../structs/structs'

export const antProducerData: Record<AntProducers, AntProducerData> = {
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
        displayCondition: () => player.ants.masteries[AntProducers.Workers].mastery > 0
      },
      {
        text: () =>
          i18next.t('ants.producers.0.eloInformation', {
            // TODO: Place into Ants folder somewhere
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
    ]
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
        displayCondition: () => player.ants.masteries[AntProducers.Breeders].mastery > 0
      }
    ],
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
        displayCondition: () => player.ants.masteries[AntProducers.MetaBreeders].mastery > 0
      }
    ],
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
        displayCondition: () => player.ants.masteries[AntProducers.MegaBreeders].mastery > 0
      }
    ],
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
        displayCondition: () => player.ants.masteries[AntProducers.Queens].mastery > 0
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
        displayCondition: () => player.ants.masteries[AntProducers.LordRoyals].mastery > 0
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
        displayCondition: () => player.ants.masteries[AntProducers.Almighties].mastery > 0
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
        displayCondition: () => player.ants.masteries[AntProducers.Disciples].mastery > 0
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
        displayCondition: () => player.ants.masteries[AntProducers.HolySpirit].mastery > 0
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
    produces: AntProducers.Disciples
  }
}
