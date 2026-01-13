import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { calculateSigmoid } from './Calculate'
import { format, formatAsPercentIncrease, formatDecimalAsPercentIncrease, player } from './Synergism'

export enum SingularityPerkTags {
  QualityOfLife = 0,
  Automation = 1,
  FeatureUnlock = 2,
  Salvage = 3,
  Runes = 4,
  Blessings = 5,
  Spirits = 6,
  Talismans = 7,
  Challenges = 8,
  Corruptions = 9,
  Campaigns = 10,
  Research = 11,
  Anthill = 12,
  Ascension = 13,
  Cubes = 14,
  PlatonicUpgrades = 15,
  Hepteracts = 16,
  Powder = 17,
  Challenge15 = 18,
  Quarks = 19,
  GoldenQuarks = 20,
  Ambrosia = 21,
  Luck = 22,
  Miscellaneous = 23
}

type SingPerkMap = {
  welcomeToSingularity: {
    autoHepteract: boolean
    platonicBuyMax: boolean
  }
  unlimitedGrowth: {
    quarkMultiplier: number
    ascensionCountMultiplier: number
  }
  goldenCoins: { coinMultiplier: Decimal }
  xyz: {
    GQUnlocked: boolean
    dailyUnlocked: boolean
    quarkMultiplierDaily: number
    goldenQuarkFromDaily: number
    goldenQuark1FreeDaily: number
    goldenQuark2FreeDaily: number
    goldenQuark3FreeDaily: number
    freeUpgradeFromDaily: number
    freeUpgradeMultiplier: number
  }
  generousOrbs: {
    cubeQuarkMultCap: number
    cubeQuarkCurrentMult: number
  }
  researchDummies: {
    hoverToBuyUnlock: boolean
    keepAutobuyer: boolean
  }
  recycledContent: { salvage: number }
  antGodsCornucopia: { antSpeed: number }
  bringToLife: { perStageReduction: number }
  tokenInheritance: { initialTokens: number }
  sweepomatic: {
    startWithC10: boolean
    sweepAscensionChallenges: boolean
  }
  superStart: {
    mythosStart: number
    particleStart: Decimal
    obtainiumStart: number
  }
  invigoratedSpirits: {
    antELO: number
    firstTrancheFraction: number
    secondTrancheFraction: number
  }
  eloBonus: { eloAdditiveMult: number }
  notSoChallenging: {
    challenge6Comp: number
    challenge7Comp: number
    challenge8Comp: number
    challenge9Comp: number
  }
  autoCampaigns: {
    autoCampaignsEnabled: boolean
  }
  automationUpgrades: {
    w1x4Through7: boolean
    w1x8: boolean
    w2x10: boolean
    autoAutomationShop: boolean
    r6x5: boolean
    r6x10: boolean
    r6x20: boolean
    chocolateChipCookies: boolean
  }
  evenMoreQuarks: {
    quarkMultiplier: number
  }
  shopSpecialOffer: {
    freeLevels: number
    keepPermanently: boolean
  }
  potionAutogenerator: {
    autoPotions: boolean
    interval: number
  }
  persistentGlobalResets: {
    keepPrestige: boolean
    keepTranscension: boolean
    keepReincarnation: boolean
  }
  forTheLoveOfTheAntGod: {
    keepAntAutobuyers: boolean
    startWithTier1Ant: boolean
    startWithTier2Ant: boolean
  }
  itAllAddsUp: {
    addIntervalDivisor: number
    addRewardDivisor: number
    addCapacityMultiplier: number
  }
  automagicalRunes: {
    autoBlessings: boolean
    autoSpirits: boolean
    autoInfiniteAscent: boolean
    autoTalismanShards: boolean
    autoAntiquities: boolean
  }
  firstClearTokens: {
    bonusTokens: number
  }
  derpSmithsCornucopia: {
    octeractBonus: number
  }
  eternalAscensions: {
    realTimeMode: boolean
  }
  exaltedAchievements: {
    unlocked: boolean
  }
  coolQOLCubes: {
    keepResearches: boolean
    autoOpen: boolean
  }
  infiniteRecycling: {
    salvageBonus: number
  }
  irishAnt: {
    luckBonus: number
  }
  bonusTokens: {
    bonusTokenMult: number
  }
  immaculateAlchemy: {
    alchemyMultiplier: number
  }
  overclocked: {
    levelCapIncrease: number
  }
  wowCubeAutomatedShipping: {
    autobuyCubeUpgrade: boolean
  }
  congealedblueberries: {
    additionalBlueberries: number
  }
  lastClearTokens: {
    bonusTokens: number
  }
  recyclistsDesktop: {
    negativeSalvageReduction: number
  }
  goldenRevolution: {
    goldenQuarkMult: number
  }
  goldenRevolution2: {
    goldenQuarkCostMult: number
  }
  goldenRevolution3: {
    exportGoldenQuarkMult: number
  }
  platonicClones: {
    autobuyPlatonicUpgrades: boolean
  }
  irishAnt2: {
    additiveAmbrosiaLuckMult: number
  }
  platSigma: {
    addIntervalMultiplier: number
  }
  primalPower: {
    sing131Luck: number
    sing269Luck: number
  }
  midasMilleniumAgedGold: {
    freeGQ1UpgradePerAdd: number
    freeGQ3UpgradePerAdd: number
  }
  goldenRevolution4: {
    goldenQuarksPerSecondCoefficient: number
  }
  octeractMetagenesis: {
    octeractCogenesisBonusUnlocked: boolean
    octeractTrigenesisBonusUnlocked: boolean
  }
  skrauQ: {
    quarkMultiplier: number
  }
  demeterHarvest: {
    positiveSalvageMult: number
  }
  permanentBenefaction: {
    pandoraAlwaysUnlocked: boolean
    vysharethAlwaysUnlocked: boolean
  }
  infiniteShopUpgrades: {
    bonusVouchers: number
  }
  taxReduction: {
    taxMultiplier: number
  }
}

export type SingularityPerkKeys = keyof SingPerkMap

export interface SingularityPerk<K extends SingularityPerkKeys> {
  name: () => string
  description: () => string
  effect: (level: number, singCount: number) => SingPerkMap[K]
  level0Value: SingPerkMap[K]
  levelThresholds: number[]
  currentSingularityUsed: boolean
  tags: SingularityPerkTags[]
  precomputedlevel: number
  enabled: boolean
}

export const singularityPerks: { [K in SingularityPerkKeys]: SingularityPerk<K> } = {
  welcomeToSingularity: {
    name: () => i18next.t('singularity.perks.welcomeToSingularity.name'),
    description: () => i18next.t('singularity.perks.welcomeToSingularity.default'),
    effect: (level: number) => ({
      autoHepteract: level >= 1,
      platonicBuyMax: level >= 1
    }),
    level0Value: {
      autoHepteract: false,
      platonicBuyMax: false
    },
    levelThresholds: [1],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.QualityOfLife, SingularityPerkTags.PlatonicUpgrades, SingularityPerkTags.Hepteracts],
    precomputedlevel: 0,
    enabled: true
  },
  unlimitedGrowth: {
    name: () => i18next.t('singularity.perks.unlimitedGrowth.name'),
    description: () => {
      const defaultText = i18next.t('singularity.perks.unlimitedGrowth.default')
      const effect = getSingularityPerkEffect('unlimitedGrowth')
      const effectText = i18next.t('singularity.perks.unlimitedGrowth.effect', {
        quark: formatAsPercentIncrease(effect.quarkMultiplier, 0),
        ascension: formatAsPercentIncrease(effect.ascensionCountMultiplier, 0)
      })
      return `${defaultText}<br>${effectText}`
    },
    levelThresholds: [1],
    effect: (level: number, singCount: number) => ({
      quarkMultiplier: 1 + 0.1 * level * singCount,
      ascensionCountMultiplier: 1 + 0.1 * level * singCount
    }),
    level0Value: {
      quarkMultiplier: 1,
      ascensionCountMultiplier: 1
    },
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Ascension, SingularityPerkTags.Quarks],
    precomputedlevel: 0,
    enabled: true
  },
  goldenCoins: {
    name: () => i18next.t('singularity.perks.goldenCoins.name'),
    description: () => {
      const defaultText = i18next.t('singularity.perks.goldenCoins.default')
      const effect = getSingularityPerkEffect('goldenCoins')
      const formulaText = i18next.t('singularity.perks.goldenCoins.formula')
      const effectText = i18next.t('singularity.perks.goldenCoins.effect', {
        coin: formatDecimalAsPercentIncrease(effect.coinMultiplier, 0)
      })
      return `${defaultText}<br>${formulaText}<br>${effectText}`
    },
    levelThresholds: [1],
    effect: (level: number, singCount: number) => ({
      coinMultiplier: Decimal.pow(player.goldenQuarks + 1, 1.5)
        .times(Math.pow(singCount, 2))
        .times(level)
        .plus(1)
    }),
    level0Value: {
      coinMultiplier: new Decimal(1)
    },
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.GoldenQuarks, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  xyz: {
    name: () => i18next.t('singularity.perks.xyz.name'),
    description: () => {
      const defaultText = i18next.t('singularity.perks.xyz.default')
      const level = calculateSingularityPerkLevel('xyz')
      const effect = getSingularityPerkEffect('xyz', level)
      const effectText1 = i18next.t('singularity.perks.xyz.effectLevel1', {
        goldQuarks: format(effect.goldenQuarkFromDaily, 0, true),
        freeLevels: format(effect.freeUpgradeFromDaily, 0, true),
        quarkMult: format(effect.quarkMultiplierDaily, 0, true)
      })
      const effectText2 = i18next.t('singularity.perks.xyz.effectLevel2', {
        x: format(effect.goldenQuark1FreeDaily, 1, true),
        y: format(effect.goldenQuark3FreeDaily, 0, true)
      })
      const effectText3 = i18next.t('singularity.perks.xyz.effectLevel3')
      if (level >= 3) return `${defaultText}<br>${effectText1}<br>${effectText2}<br>${effectText3}`
      else if (level >= 2) return `${defaultText}<br>${effectText1}<br>${effectText2}`
      else return `${defaultText}<br>${effectText1}`
    },
    levelThresholds: [1, 20, 200],
    effect: (level: number, singCount: number) => ({
      GQUnlocked: level >= 1,
      dailyUnlocked: level >= 1,
      quarkMultiplierDaily: level >= 1 ? 1 + Math.min(49, singCount) : 1,
      goldenQuarkFromDaily: level >= 1 ? 2 + 3 * singCount : 0,
      goldenQuark1FreeDaily: level >= 2 ? 0.2 : 0,
      goldenQuark2FreeDaily: level >= 2 ? 0.2 : 0,
      goldenQuark3FreeDaily: level >= 2 ? 1 : 0,
      freeUpgradeFromDaily: level >= 1 ? Math.round(3 * Math.sqrt(singCount)) : 0,
      freeUpgradeMultiplier: level >= 3 ? 2 : 1
    }),
    level0Value: {
      GQUnlocked: false,
      dailyUnlocked: false,
      quarkMultiplierDaily: 1,
      goldenQuarkFromDaily: 0,
      goldenQuark1FreeDaily: 0,
      goldenQuark2FreeDaily: 0,
      goldenQuark3FreeDaily: 0,
      freeUpgradeFromDaily: 0,
      freeUpgradeMultiplier: 1
    },
    currentSingularityUsed: false,
    tags: [
      SingularityPerkTags.GoldenQuarks,
      SingularityPerkTags.FeatureUnlock,
      SingularityPerkTags.Miscellaneous,
      SingularityPerkTags.Quarks
    ],
    precomputedlevel: 0,
    enabled: true
  },
  generousOrbs: {
    name: () => i18next.t('singularity.perks.generousOrbs.name'),
    description: () => {
      const effect = getSingularityPerkEffect('generousOrbs')
      return i18next.t('singularity.perks.generousOrbs.default', {
        cap: format(100 * effect.cubeQuarkMultCap, 0),
        current: format(100 * effect.cubeQuarkCurrentMult, 0, true)
      })
    },
    levelThresholds: [1, 2, 5, 10, 15, 20, 25, 30, 35],
    effect: (level: number) => {
      const overfluxData = [
        {
          sigmoidMax: 1.15,
          power: 0.45,
          coefficient: 2_560
        },
        {
          sigmoidMax: 1.15,
          power: 0.4,
          coefficient: 10_000
        },
        {
          sigmoidMax: 1.25,
          power: 0.35,
          coefficient: 40_000
        },
        {
          sigmoidMax: 1.25,
          power: 0.32,
          coefficient: 160_000
        },
        {
          sigmoidMax: 1.35,
          power: 0.27,
          coefficient: 640_000
        },
        {
          sigmoidMax: 1.45,
          power: 0.24,
          coefficient: 2e6
        },
        {
          sigmoidMax: 1.55,
          power: 0.21,
          coefficient: 1e7
        },
        {
          sigmoidMax: 1.85,
          power: 0.18,
          coefficient: 4e7
        },
        {
          sigmoidMax: 3,
          power: 0.15,
          coefficient: 1e8
        }
      ]
      let maxIncrease = 0
      let increase = 0
      let levelCheck = 1
      for (const data of overfluxData) {
        if (level < levelCheck) break
        else {
          levelCheck += 1
          maxIncrease += data.sigmoidMax - 1
          increase += calculateSigmoid(data.sigmoidMax, Math.pow(player.overfluxOrbs, data.power), data.coefficient)
        }
      }
      return {
        cubeQuarkMultCap: maxIncrease,
        cubeQuarkCurrentMult: increase
      }
    },
    level0Value: {
      cubeQuarkMultCap: 0,
      cubeQuarkCurrentMult: 0
    },
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Quarks, SingularityPerkTags.Powder],
    precomputedlevel: 0,
    enabled: true
  },
  researchDummies: {
    name: () => i18next.t('singularity.perks.researchDummies.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('researchDummies')
      const defaultText = i18next.t('singularity.perks.researchDummies.default')
      const effectText1 = i18next.t('singularity.perks.researchDummies.effectLevel1')
      const effectText2 = i18next.t('singularity.perks.researchDummies.effectLevel2')
      if (level >= 2) return `${defaultText}<br>${effectText1}<br>${effectText2}`
      else return `${defaultText}<br>${effectText1}`
    },
    levelThresholds: [1, 11],
    effect: (level: number) => ({
      hoverToBuyUnlock: level >= 1,
      keepAutobuyer: level >= 2
    }),
    level0Value: {
      hoverToBuyUnlock: false,
      keepAutobuyer: false
    },
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Research, SingularityPerkTags.Automation, SingularityPerkTags.QualityOfLife],
    precomputedlevel: 0,
    enabled: true
  },
  recycledContent: {
    name: () => i18next.t('singularity.perks.recycledContent.name'),
    description: () => {
      const effect = getSingularityPerkEffect('recycledContent')
      const defaultText = i18next.t('singularity.perks.recycledContent.default')
      const effectText = i18next.t('singularity.perks.recycledContent.effect', {
        x: format(effect.salvage, 0, true)
      })
      return `${defaultText}<br>${effectText}`
    },
    effect: (level: number) => ({
      salvage: 5 * level
    }),
    level0Value: {
      salvage: 0
    },
    levelThresholds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Salvage, SingularityPerkTags.Runes],
    precomputedlevel: 0,
    enabled: true
  },
  antGodsCornucopia: {
    name: () => i18next.t('singularity.perks.antGodsCornucopia.name'),
    description: () => {
      const effect = getSingularityPerkEffect('antGodsCornucopia')
      const defaultText = i18next.t('singularity.perks.antGodsCornucopia.default')
      const effectText = i18next.t('singularity.perks.antGodsCornucopia.effect', {
        x: format(effect.antSpeed, 0, true)
      })
      return `${defaultText}<br>${effectText}`
    },
    effect: (level: number) => {
      if (level >= 4) return { antSpeed: 1e12 }
      else if (level >= 3) return { antSpeed: 1e6 }
      else if (level >= 2) return { antSpeed: 1e3 }
      else return { antSpeed: 4 }
    },
    level0Value: {
      antSpeed: 1
    },
    levelThresholds: [1, 30, 70, 100],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Anthill],
    precomputedlevel: 0,
    enabled: true
  },
  bringToLife: {
    name: () => i18next.t('singularity.perks.bringToLife.name'),
    description: () => {
      const effect = getSingularityPerkEffect('bringToLife')
      const defaultText = i18next.t('singularity.perks.bringToLife.default')
      const effectText = i18next.t('singularity.perks.bringToLife.effect', {
        amount: format(2 - effect.perStageReduction, 3, true)
      })
      return `${defaultText}<br>${effectText}`
    },
    effect: (level: number) => ({
      perStageReduction: 0.01 * +(level > 0) + 0.009 * Math.max(0, level - 1)
    }),
    level0Value: {
      perStageReduction: 0
    },
    levelThresholds: [1, 9, 25, 49, 81, 121, 169, 196, 225, 256, 289],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Anthill],
    precomputedlevel: 0,
    enabled: true
  },
  tokenInheritance: {
    name: () => i18next.t('singularity.perks.tokenInheritance.name'),
    description: () => {
      const effect = getSingularityPerkEffect('tokenInheritance')
      const defaultText = i18next.t('singularity.perks.tokenInheritance.default')
      const effectText = i18next.t('singularity.perks.tokenInheritance.effect', {
        tokens: format(effect.initialTokens, 0, true)
      })
      return `${defaultText}<br>${effectText}`
    },
    effect: (level: number) => {
      const tokens = [1, 10, 25, 40, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 750]
      return { initialTokens: tokens[level - 1] ?? 0 }
    },
    level0Value: {
      initialTokens: 0
    },
    levelThresholds: [2, 5, 10, 17, 26, 37, 50, 65, 82, 101, 220, 240, 260, 270, 277],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Corruptions, SingularityPerkTags.Campaigns],
    precomputedlevel: 0,
    enabled: true
  },
  sweepomatic: {
    name: () => i18next.t('singularity.perks.sweepomatic.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('sweepomatic')
      const defaultText = i18next.t('singularity.perks.sweepomatic.default')
      const effectText1 = i18next.t('singularity.perks.sweepomatic.effectLevel1')
      const effectText2 = i18next.t('singularity.perks.sweepomatic.effectLevel1')
      if (level >= 2) return `${defaultText}<br>${effectText1}<br>${effectText2}`
      else return `${defaultText}<br>${effectText1}`
    },
    effect: (level: number) => ({
      startWithC10: level >= 1,
      sweepAscensionChallenges: level >= 2
    }),
    level0Value: {
      startWithC10: false,
      sweepAscensionChallenges: false
    },
    levelThresholds: [2, 101],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Automation, SingularityPerkTags.QualityOfLife, SingularityPerkTags.Challenge15],
    precomputedlevel: 0,
    enabled: true
  },
  superStart: {
    name: () => i18next.t('singularity.perks.superStart.name'),
    description: () => {
      const effect = getSingularityPerkEffect('superStart')
      const level = calculateSingularityPerkLevel('superStart')
      const defaultText = i18next.t('singularity.perks.superStart.default')
      const effectText1 = i18next.t('singularity.perks.superStart.effectLevel1', {
        mythos: format(effect.mythosStart, 0, true)
      })
      const effectText2 = i18next.t('singularity.perks.superStart.effectLevel2', {
        particles: format(effect.particleStart, 0, true)
      })
      const effectText3 = i18next.t('singularity.perks.superStart.effectLevel3', {
        obtainium: format(effect.obtainiumStart, 0, true)
      })
      if (level >= 3) return `${defaultText}<br>${effectText1}<br>${effectText2}<br>${effectText3}`
      else if (level >= 2) return `${defaultText}<br>${effectText1}<br>${effectText2}`
      else return `${defaultText}<br>${effectText1}`
    },
    effect: (level: number) => {
      const mythos = [1001, 1001, 1001, 1001, 1001]
      const particles = [
        Decimal.fromString('0'),
        Decimal.fromString('10'),
        Decimal.fromString('1e16'),
        Decimal.fromString('1e100'),
        Decimal.fromString('1e2222')
      ]
      const obtainium = [0, 0, 500, 500, 500]
      return {
        mythosStart: mythos[level - 1] ?? 0,
        particleStart: particles[level - 1] ?? 0,
        obtainiumStart: obtainium[level - 1] ?? 0
      }
    },
    level0Value: {
      mythosStart: 0,
      particleStart: new Decimal(0),
      obtainiumStart: 0
    },
    levelThresholds: [2, 3, 4, 7, 15],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.QualityOfLife, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  invigoratedSpirits: {
    name: () => i18next.t('singularity.perks.invigoratedSpirits.name'),
    description: () => {
      const effect = getSingularityPerkEffect('invigoratedSpirits')
      const defaultText = i18next.t('singularity,perks.invigoratedSpirits.default')
      const line2 = i18next.t('singularity.perks.invigoratedSpirits.line2', {
        x: format(100 * effect.firstTrancheFraction, 1, true)
      })
      const line3 = i18next.t('singularity.perks.invigoratedSpirits.line3', {
        x: format(100 * effect.secondTrancheFraction, 2, true)
      })
      const effectText = i18next.t('singularity.perks.invigoratedSpirits.effect', {
        x: format(effect.antELO, 2, true)
      })
      return `${defaultText}<br>${line2}<br>${line3}<br>${effectText}`
    },
    effect: (level: number) => {
      const immortalELO = player.ants.immortalELO
      const trancheFraction1 = 0.02 * +(level > 0) + 0.018 * Math.max(0, level - 1)
      const tranchFraction2 = 0.001 * +(level > 0) + 0.0009 * Math.max(0, level - 1)

      const addedELO = trancheFraction1 * Math.min(200_000, immortalELO)
        + tranchFraction2 * Math.max(0, Math.min(1_800_000, immortalELO - 200_000))
      return {
        antELO: addedELO,
        firstTrancheFraction: trancheFraction1,
        secondTrancheFraction: tranchFraction2
      }
    },
    level0Value: {
      antELO: 0,
      firstTrancheFraction: 0,
      secondTrancheFraction: 0
    },
    levelThresholds: [2, 10, 26, 50, 82, 122, 170, 197, 226, 257, 290],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Anthill],
    precomputedlevel: 0,
    enabled: true
  },
  eloBonus: {
    name: () => i18next.t('singularity.perks.eloBonus.name'),
    description: () => {
      const effect = getSingularityPerkEffect('eloBonus')
      const defaultText = i18next.t('singularity.perks.eloBonus.default')
      const effectText = i18next.t('singularity.perks.eloBonus.effect', {
        amount: format(100 * effect.eloAdditiveMult, 2, true)
      })
      return `${defaultText}<br>${effectText}`
    },
    effect: (level: number) => ({
      eloAdditiveMult: 0.001 * +(level > 0) + 0.0009 * Math.max(0, level - 1)
    }),
    level0Value: {
      eloAdditiveMult: 0
    },
    levelThresholds: [3, 11, 27, 51, 83, 123, 171, 198, 227, 258, 291],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Anthill],
    precomputedlevel: 0,
    enabled: true
  },
  notSoChallenging: {
    name: () => i18next.t('singularity.perks.notSoChallenging.name'),
    description: () => {
      const effect = getSingularityPerkEffect('notSoChallenging')
      const level = calculateSingularityPerkLevel('notSoChallenging')
      const defaultText = i18next.t('singularity.perks.notSoChallenging.default')
      const effectText1 = i18next.t('singularity.perks.notSoChallenging.effectLevel1', {
        x: format(effect.challenge6Comp, 0, true)
      })
      const effectText2 = i18next.t('singularity.perks.notSoChallenging.effectLevel2', {
        x: format(effect.challenge7Comp, 0, true)
      })
      const effectText3 = i18next.t('singularity.perks.notSoChallenging.effectLevel3', {
        x: format(effect.challenge8Comp, 0, true)
      })
      const effectText4 = i18next.t('singularity.perks.notSoChallenging.effectLevel4', {
        x: format(effect.challenge9Comp, 0, true)
      })
      if (level >= 5) return `${defaultText}<br>${effectText1}<br>${effectText2}<br>${effectText3}<br>${effectText4}`
      else if (level >= 3) return `${defaultText}<br>${effectText1}<br>${effectText2}<br>${effectText3}`
      else if (level >= 2) return `${defaultText}<br>${effectText1}<br>${effectText2}`
      else return `${defaultText}<br>${effectText1}`
    },
    effect: (level: number) => ({
      challenge6Comp: level >= 1 ? 1 : 0,
      challenge7Comp: level >= 2 ? 1 : 0,
      challenge8Comp: level >= 4 ? 5 : (level >= 3 ? 1 : 0),
      challenge9Comp: level >= 5 ? 1 : 0
    }),
    level0Value: {
      challenge6Comp: 0,
      challenge7Comp: 0,
      challenge8Comp: 0,
      challenge9Comp: 0
    },
    levelThresholds: [4, 7, 10, 15, 20],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.QualityOfLife, SingularityPerkTags.Ascension, SingularityPerkTags.Challenges],
    precomputedlevel: 0,
    enabled: true
  },
  autoCampaigns: {
    name: () => i18next.t('singularity.perks.autoCampaigns.name'),
    description: () => i18next.t('singularity.perks.autoCampaigns.default'),
    effect: (level: number) => ({
      autoCampaignsEnabled: level >= 1
    }),
    level0Value: {
      autoCampaignsEnabled: false
    },
    levelThresholds: [4],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Automation, SingularityPerkTags.Campaigns],
    precomputedlevel: 0,
    enabled: true
  },
  automationUpgrades: {
    name: () => i18next.t('singularity.perks.automationUpgrades.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('automationUpgrades')
      if (level >= 6) return i18next.t('singularity.perks.automationUpgrades.hasLevel5')
      else if (level >= 5) return i18next.t('singularity.perks.automationUpgrades.hasLevel4')
      else if (level >= 4) return i18next.t('singularity.perks.automationUpgrades.hasLevel3')
      else if (level >= 3) return i18next.t('singularity.perks.automationUpgrades.hasLevel2')
      else if (level >= 2) return i18next.t('singularity.perks.automationUpgrades.hasLevel1')
      else return i18next.t('singularity.perks.automationUpgrades.default')
    },
    effect: (level: number) => ({
      w1x4Through7: level >= 1,
      w1x8: level >= 2,
      w2x10: level >= 3,
      autoAutomationShop: level >= 4,
      r6x5: level >= 5,
      r6x10: level >= 5,
      r6x20: level >= 5,
      chocolateChipCookies: level >= 6
    }),
    level0Value: {
      w1x4Through7: false,
      w1x8: false,
      w2x10: false,
      autoAutomationShop: false,
      r6x5: false,
      r6x10: false,
      r6x20: false,
      chocolateChipCookies: false
    },
    levelThresholds: [5, 10, 15, 25, 30, 100],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Automation, SingularityPerkTags.QualityOfLife],
    precomputedlevel: 0,
    enabled: true
  },
  evenMoreQuarks: {
    name: () => i18next.t('singularity.perks.evenMoreQuarks.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('evenMoreQuarks')
      return i18next.t('singularity.perks.evenMoreQuarks.default', {
        stack: level,
        inc: format(100 * (Math.pow(1.05, level) - 1), 2)
      })
    },
    effect: (level: number) => ({
      quarkMultiplier: Math.pow(1.05, Math.min(50, level))
    }),
    level0Value: {
      quarkMultiplier: 1
    },
    levelThresholds: [
      5,
      7,
      10,
      20,
      35,
      50,
      65,
      80,
      90,
      100,
      121,
      144,
      150,
      160,
      166,
      169,
      170,
      175,
      180,
      190,
      196,
      200,
      201,
      202,
      203,
      204,
      205,
      210,
      213,
      216,
      219,
      225,
      228,
      231,
      234,
      237,
      240,
      244,
      248,
      252,
      256,
      260,
      264,
      268,
      272,
      276,
      280,
      284,
      288,
      290
    ],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Quarks],
    precomputedlevel: 0,
    enabled: true
  },
  shopSpecialOffer: {
    name: () => i18next.t('singularity.perks.shopSpecialOffer.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('shopSpecialOffer')
      if (level >= 3) return i18next.t('singularity.perks.shopSpecialOffer.hasLevel2')
      else if (level >= 2) return i18next.t('singularity.perks.shopSpecialOffer.hasLevel1')
      else return i18next.t('singularity.perks.shopSpecialOffer.default')
    },
    effect: (level: number) => ({
      freeLevels: level >= 2 ? 100 : (level >= 1 ? 10 : 0),
      keepPermanently: level >= 3
    }),
    level0Value: {
      freeLevels: 0,
      keepPermanently: false
    },
    levelThresholds: [5, 20, 51],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.QualityOfLife, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  potionAutogenerator: {
    name: () => i18next.t('singularity.perks.potionAutogenerator.name'),
    description: () => i18next.t('singularity.perks.potionAutogenerator.default'),
    effect: (level: number, singCount: number) => ({
      autoPotions: level >= 1,
      interval: 180 * Math.pow(0.97, singCount)
    }),
    level0Value: {
      autoPotions: false,
      interval: 180
    },
    levelThresholds: [6],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Automation, SingularityPerkTags.QualityOfLife],
    precomputedlevel: 0,
    enabled: true
  },
  persistentGlobalResets: {
    name: () => i18next.t('singularity.perks.persistentGlobalResets.name'),
    description: () => i18next.t('singularity.perks.persistentGlobalResets.default'),
    effect: (level: number) => ({
      keepPrestige: level >= 1,
      keepTranscension: level >= 1,
      keepReincarnation: level >= 1
    }),
    level0Value: {
      keepPrestige: false,
      keepTranscension: false,
      keepReincarnation: false
    },
    levelThresholds: [8],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.QualityOfLife, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  forTheLoveOfTheAntGod: {
    name: () => i18next.t('singularity.perks.forTheLoveOfTheAntGod.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('forTheLoveOfTheAntGod')
      if (level >= 3) return i18next.t('singularity.perks.forTheLoveOfTheAntGod.hasLevel2')
      else if (level >= 2) return i18next.t('singularity.perks.forTheLoveOfTheAntGod.hasLevel1')
      else return i18next.t('singularity.perks.forTheLoveOfTheAntGod.default')
    },
    effect: (level: number) => ({
      keepAntAutobuyers: level >= 1,
      startWithTier1Ant: level >= 2,
      startWithTier2Ant: level >= 3
    }),
    level0Value: {
      keepAntAutobuyers: false,
      startWithTier1Ant: false,
      startWithTier2Ant: false
    },
    levelThresholds: [10, 15, 25],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Anthill, SingularityPerkTags.Automation],
    precomputedlevel: 0,
    enabled: true
  },
  itAllAddsUp: {
    name: () => i18next.t('singularity.perks.itAllAddsUp.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('itAllAddsUp')
      const effect = getSingularityPerkEffect('itAllAddsUp', level)
      return i18next.t('singularity.perks.itAllAddsUp.default', {
        div: format(effect.addIntervalDivisor, 2, true)
      })
    },
    effect: (level: number) => ({
      addIntervalDivisor: 1 + level / 5,
      addRewardDivisor: 1 + level / 5,
      addCapacityMultiplier: 1 + level / 5
    }),
    level0Value: {
      addIntervalDivisor: 1,
      addRewardDivisor: 1,
      addCapacityMultiplier: 1
    },
    levelThresholds: [10, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 235, 240],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  automagicalRunes: {
    name: () => i18next.t('singularity.perks.automagicalRunes.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('automagicalRunes')
      if (level >= 4) return i18next.t('singularity.perks.automagicalRunes.hasLevel3')
      else if (level >= 3) return i18next.t('singularity.perks.automagicalRunes.hasLevel2')
      else if (level >= 2) return i18next.t('singularity.perks.automagicalRunes.hasLevel1')
      else return i18next.t('singularity.perks.automagicalRunes.default')
    },
    effect: (level: number) => ({
      autoBlessings: level >= 1,
      autoSpirits: level >= 1,
      autoInfiniteAscent: level >= 2,
      autoTalismanShards: level >= 3,
      autoAntiquities: level >= 4
    }),
    level0Value: {
      autoBlessings: false,
      autoSpirits: false,
      autoInfiniteAscent: false,
      autoTalismanShards: false,
      autoAntiquities: false
    },
    levelThresholds: [15, 30, 40, 50],
    currentSingularityUsed: false,
    tags: [
      SingularityPerkTags.Automation,
      SingularityPerkTags.Blessings,
      SingularityPerkTags.Spirits,
      SingularityPerkTags.Runes
    ],
    precomputedlevel: 0,
    enabled: true
  },
  firstClearTokens: {
    name: () => i18next.t('singularity.perks.firstClearTokens.name'),
    description: () => i18next.t('singularity.perks.firstClearTokens.default'),
    effect: (level: number) => ({
      bonusTokens: level >= 1 ? 5 : 0
    }),
    level0Value: {
      bonusTokens: 0
    },
    levelThresholds: [16],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Campaigns],
    precomputedlevel: 0,
    enabled: true
  },
  derpSmithsCornucopia: {
    name: () => i18next.t('singularity.perks.derpSmithsCornucopia.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('derpSmithsCornucopia')
      return i18next.t('singularity.perks.derpSmithsCornucopia.default', {
        counter: level
      })
    },
    effect: (level: number, singCount: number) => ({
      octeractBonus: 1 + level * singCount / 100
    }),
    level0Value: {
      octeractBonus: 1
    },
    levelThresholds: [18, 38, 58, 78, 88, 98, 118, 148, 178, 188, 198, 208, 218, 228, 238, 248],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  eternalAscensions: {
    name: () => i18next.t('singularity.perks.eternalAscensions.name'),
    description: () => i18next.t('singularity.perks.eternalAscensions.default'),
    effect: (level: number) => ({
      realTimeMode: level >= 1
    }),
    level0Value: {
      realTimeMode: false
    },
    levelThresholds: [25],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Ascension, SingularityPerkTags.QualityOfLife, SingularityPerkTags.Automation],
    precomputedlevel: 0,
    enabled: true
  },
  exaltedAchievements: {
    name: () => i18next.t('singularity.perks.exaltedAchievements.name'),
    description: () => i18next.t('singularity.perks.exaltedAchievements.default'),
    effect: (level: number) => ({
      unlocked: level >= 1
    }),
    level0Value: {
      unlocked: false
    },
    levelThresholds: [25],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.FeatureUnlock, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  coolQOLCubes: {
    name: () => i18next.t('singularity.perks.coolQOLCubes.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('coolQOLCubes')
      if (level >= 2) return i18next.t('singularity.perks.coolQOLCubes.hasLevel1')
      else return i18next.t('singularity.perks.coolQOLCubes.default')
    },
    effect: (level: number) => ({
      keepResearches: level >= 1,
      autoOpen: level >= 2
    }),
    level0Value: {
      keepResearches: false,
      autoOpen: false
    },
    levelThresholds: [25, 35],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.QualityOfLife, SingularityPerkTags.Cubes],
    precomputedlevel: 0,
    enabled: true
  },
  infiniteRecycling: {
    name: () => i18next.t('singularity.perks.infiniteRecycling.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('infiniteRecycling')
      const effect = getSingularityPerkEffect('infiniteRecycling', level)
      return i18next.t('singularity.perks.infiniteRecycling.default', {
        salvage: format(effect.salvageBonus, 3, true)
      })
    },
    effect: (level: number) => ({
      salvageBonus: 0.025 * level
    }),
    level0Value: {
      salvageBonus: 0
    },
    levelThresholds: [30, 40, 61, 81, 111, 131, 161, 191, 236, 260],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Salvage, SingularityPerkTags.Runes],
    precomputedlevel: 0,
    enabled: true
  },
  irishAnt: {
    name: () => i18next.t('singularity.perks.irishAnt.name'),
    description: () => {
      const effect = getSingularityPerkEffect('irishAnt')
      return i18next.t('singularity.perks.irishAnt.default', {
        i: format(effect.luckBonus, 0, true)
      })
    },
    effect: (level: number) => {
      let luckBonus: number
      if (level >= 8) {
        luckBonus = (6 * (level - 7)) + 35
      } else {
        luckBonus = 5 * level
      }
      return { luckBonus }
    },
    level0Value: {
      luckBonus: 0
    },
    levelThresholds: [35, 42, 49, 56, 63, 70, 77, 135, 142, 149, 156, 163, 170, 177],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Anthill, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  bonusTokens: {
    name: () => i18next.t('singularity.perks.bonusTokens.name'),
    description: () => {
      const effect = getSingularityPerkEffect('bonusTokens')
      return i18next.t('singularity.perks.bonusTokens.default', {
        amount: format(100 * (effect.bonusTokenMult - 1), 0, true)
      })
    },
    effect: (level: number) => ({
      bonusTokenMult: 1 + 2 * level / 100
    }),
    level0Value: {
      bonusTokenMult: 1
    },
    levelThresholds: [41, 58, 113, 163, 229],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Campaigns],
    precomputedlevel: 0,
    enabled: true
  },
  immaculateAlchemy: {
    name: () => i18next.t('singularity.perks.immaculateAlchemy.name'),
    description: () => {
      const effect = getSingularityPerkEffect('immaculateAlchemy')
      return i18next.t('singularity.perks.immaculateAlchemy.default', {
        multiplier: format(effect.alchemyMultiplier, 2, true)
      })
    },
    effect: (level: number, singCount: number) => ({
      alchemyMultiplier: level >= 1 ? 1 + singCount / 10 : 1
    }),
    level0Value: {
      alchemyMultiplier: 1
    },
    levelThresholds: [50],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  overclocked: {
    name: () => i18next.t('singularity.perks.overclocked.name'),
    description: () => {
      const effect = getSingularityPerkEffect('overclocked')
      return i18next.t('singularity.perks.overclocked.default', {
        i: effect.levelCapIncrease
      })
    },
    effect: (level: number) => ({
      levelCapIncrease: level
    }),
    level0Value: {
      levelCapIncrease: 0
    },
    levelThresholds: [50, 60, 75, 100, 125, 150, 175, 200, 225, 250],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  wowCubeAutomatedShipping: {
    name: () => i18next.t('singularity.perks.wowCubeAutomatedShipping.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('wowCubeAutomatedShipping')
      if (level >= 2) return i18next.t('singularity.perks.wowCubeAutomatedShipping.hasLevel1')
      else return i18next.t('singularity.perks.wowCubeAutomatedShipping.default')
    },
    effect: (level: number) => ({
      autobuyCubeUpgrade: level >= 1
    }),
    level0Value: {
      autobuyCubeUpgrade: false
    },
    levelThresholds: [50],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Automation, SingularityPerkTags.Cubes],
    precomputedlevel: 0,
    enabled: true
  },
  congealedblueberries: {
    name: () => i18next.t('singularity.perks.congealedblueberries.name'),
    description: () => {
      const effect = getSingularityPerkEffect('congealedblueberries')
      return i18next.t('singularity.perks.congealedblueberries.default', {
        i: effect.additionalBlueberries
      })
    },
    effect: (level: number) => ({
      additionalBlueberries: level
    }),
    level0Value: {
      additionalBlueberries: 0
    },
    levelThresholds: [64, 128, 192, 256, 270],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  lastClearTokens: {
    name: () => i18next.t('singularity.perks.lastClearTokens.name'),
    description: () => i18next.t('singularity.perks.lastClearTokens.default'),
    effect: (level: number) => ({
      bonusTokens: level >= 1 ? 10 : 0
    }),
    level0Value: {
      bonusTokens: 0
    },
    levelThresholds: [69],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Campaigns],
    precomputedlevel: 0,
    enabled: true
  },
  recyclistsDesktop: {
    name: () => i18next.t('singularity.perks.recyclistsDesktop.name'),
    description: () => {
      const effect = getSingularityPerkEffect('recyclistsDesktop')
      return i18next.t('singularity.perks.recyclistsDesktop.default', {
        i: effect.negativeSalvageReduction * 100
      })
    },
    effect: (level: number) => ({
      negativeSalvageReduction: -level / 100
    }),
    level0Value: {
      negativeSalvageReduction: 0
    },
    levelThresholds: [75, 85, 105, 125, 155, 185, 215, 245, 260, 275],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Salvage, SingularityPerkTags.Runes],
    precomputedlevel: 0,
    enabled: true
  },
  goldenRevolution: {
    name: () => i18next.t('singularity.perks.goldenRevolution.name'),
    description: () => {
      const effect = getSingularityPerkEffect('goldenRevolution')
      return i18next.t('singularity.perks.goldenRevolution.default', {
        current: format(effect.goldenQuarkMult, 1)
      })
    },
    effect: (level: number, singCount: number) => ({
      goldenQuarkMult: level >= 1 ? 1 + Math.min(100, 0.4 * singCount) / 100 : 1
    }),
    level0Value: {
      goldenQuarkMult: 1
    },
    levelThresholds: [100],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.GoldenQuarks],
    precomputedlevel: 0,
    enabled: true
  },
  goldenRevolution2: {
    name: () => i18next.t('singularity.perks.goldenRevolutionII.name'),
    description: () => {
      const effect = getSingularityPerkEffect('goldenRevolution2')
      return i18next.t('singularity.perks.goldenRevolutionII.default', {
        current: format(effect.goldenQuarkCostMult, 1)
      })
    },
    effect: (level: number, singCount: number) => ({
      goldenQuarkCostMult: level >= 1 ? 1 - Math.min(50, 0.2 * singCount) / 100 : 1
    }),
    level0Value: {
      goldenQuarkCostMult: 1
    },
    levelThresholds: [100],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.GoldenQuarks],
    precomputedlevel: 0,
    enabled: true
  },
  goldenRevolution3: {
    name: () => i18next.t('singularity.perks.goldenRevolutionIII.name'),
    description: () => {
      const effect = getSingularityPerkEffect('goldenRevolution3')
      return i18next.t('singularity.perks.goldenRevolutionIII.default', {
        current: format(effect.exportGoldenQuarkMult, 0)
      })
    },
    effect: (level: number, singCount: number) => ({
      exportGoldenQuarkMult: level >= 1 ? 1 + Math.min(500, 2 * singCount) / 100 : 1
    }),
    level0Value: {
      exportGoldenQuarkMult: 1
    },
    levelThresholds: [100],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.GoldenQuarks, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  platonicClones: {
    name: () => i18next.t('singularity.perks.platonicClones.name'),
    description: () => {
      return i18next.t('singularity.perks.platonicClones.default')
    },
    effect: (level: number) => ({
      autobuyPlatonicUpgrades: level >= 1
    }),
    level0Value: {
      autobuyPlatonicUpgrades: false
    },
    levelThresholds: [100],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.PlatonicUpgrades, SingularityPerkTags.QualityOfLife],
    precomputedlevel: 0,
    enabled: true
  },
  irishAnt2: {
    name: () => i18next.t('singularity.perks.irishAnt2.name'),
    description: () => {
      const effect = getSingularityPerkEffect('irishAnt2')
      return i18next.t('singularity.perks.irishAnt2.default', {
        percent: format(100 * effect.additiveAmbrosiaLuckMult, 0, true)
      })
    },
    effect: (level: number) => ({
      additiveAmbrosiaLuckMult: level / 100
    }),
    level0Value: {
      additiveAmbrosiaLuckMult: 0
    },
    levelThresholds: [100, 150, 200, 225, 250, 255, 260, 265, 269, 272],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Anthill, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  platSigma: {
    name: () => i18next.t('singularity.perks.platSigma.name'),
    description: () => {
      const effect = getSingularityPerkEffect('platSigma')
      return i18next.t('singularity.perks.platSigma.default', {
        counter: format(effect.addIntervalMultiplier * 100, 2, true)
      })
    },
    effect: (level: number, singCount: number) => ({
      addIntervalMultiplier: 1 - Math.min(60, level * singCount / 800) / 100
    }),
    level0Value: {
      addIntervalMultiplier: 1
    },
    levelThresholds: [125, 200],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.PlatonicUpgrades, SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  primalPower: {
    name: () => i18next.t('singularity.perks.primalPower.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('primalPower')
      if (level >= 2) return i18next.t('singularity.perks.primalPower.hasLevel1')
      else return i18next.t('singularity.perks.primalPower.default')
    },
    effect: (level: number) => ({
      sing131Luck: level >= 1 ? 131 : 0,
      sing269Luck: level >= 2 ? 269 : 0
    }),
    level0Value: {
      sing131Luck: 0,
      sing269Luck: 0
    },
    levelThresholds: [131, 269],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Luck],
    precomputedlevel: 0,
    enabled: true
  },
  midasMilleniumAgedGold: {
    name: () => i18next.t('singularity.perks.midasMilleniumAgedGold.name'),
    description: () => i18next.t('singularity.perks.midasMilleniumAgedGold.default'),
    effect: (level: number) => ({
      freeGQ1UpgradePerAdd: level >= 1 ? 0.10 : 0,
      freeGQ3UpgradePerAdd: level >= 1 ? 0.05 : 0
    }),
    level0Value: {
      freeGQ1UpgradePerAdd: 0,
      freeGQ3UpgradePerAdd: 0
    },
    levelThresholds: [150],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.GoldenQuarks, SingularityPerkTags.QualityOfLife],
    precomputedlevel: 0,
    enabled: true
  },
  goldenRevolution4: {
    name: () => i18next.t('singularity.perks.goldenRevolution4.name'),
    description: () => {
      const effect = getSingularityPerkEffect('goldenRevolution4')
      return i18next.t('singularity.perks.goldenRevolution4.default', {
        gq: format(1 / effect.goldenQuarksPerSecondCoefficient, 0, true)
      })
    },
    effect: (level: number) => ({
      goldenQuarksPerSecondCoefficient: 1e-6 * level
    }),
    level0Value: {
      goldenQuarksPerSecondCoefficient: 0
    },
    levelThresholds: [160, 173, 185, 194, 204, 210, 219, 229, 240, 249],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.GoldenQuarks],
    precomputedlevel: 0,
    enabled: true
  },
  octeractMetagenesis: {
    name: () => i18next.t('singularity.perks.octeractMetagenesis.name'),
    description: () => {
      const level = calculateSingularityPerkLevel('octeractMetagenesis')
      if (level >= 2) return i18next.t('singularity.perks.octeractMetagenesis.hasLevel1')
      else return i18next.t('singularity.perks.octeractMetagenesis.default')
    },
    effect: (level: number) => ({
      octeractCogenesisBonusUnlocked: level >= 1,
      octeractTrigenesisBonusUnlocked: level >= 2
    }),
    level0Value: {
      octeractCogenesisBonusUnlocked: false,
      octeractTrigenesisBonusUnlocked: false
    },
    levelThresholds: [200, 205],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  skrauQ: {
    name: () => i18next.t('singularity.perks.skrauQ.name'),
    description: () => {
      const effect = getSingularityPerkEffect('skrauQ')
      return i18next.t('singularity.perks.skrauQ.default', {
        amt: format(effect.quarkMultiplier, 4)
      })
    },
    effect: (level: number, singCount: number) => ({
      quarkMultiplier: level >= 1 && singCount >= 200 ? Math.pow(1 + (singCount - 199) / 25, 2) : 1
    }),
    level0Value: {
      quarkMultiplier: 1
    },
    levelThresholds: [200],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Quarks],
    precomputedlevel: 0,
    enabled: true
  },
  demeterHarvest: {
    name: () => i18next.t('singularity.perks.demeterHarvest.name'),
    description: () => {
      const effect = getSingularityPerkEffect('demeterHarvest')
      return i18next.t('singularity.perks.demeterHarvest.default', {
        i: format(100 * effect.positiveSalvageMult, 0, true)
      })
    },
    effect: (level: number) => ({
      positiveSalvageMult: level / 100
    }),
    level0Value: {
      positiveSalvageMult: 0
    },
    levelThresholds: [230, 245, 260, 275, 290],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Salvage],
    precomputedlevel: 0,
    enabled: true
  },
  permanentBenefaction: {
    name: () => i18next.t('singularity.perks.permanentBenefaction.name'),
    description: () => i18next.t('singularity.perks.permanentBenefaction.default'),
    effect: (level: number) => ({
      pandoraAlwaysUnlocked: level >= 1,
      vysharethAlwaysUnlocked: level >= 1
    }),
    level0Value: {
      pandoraAlwaysUnlocked: false,
      vysharethAlwaysUnlocked: false
    },
    levelThresholds: [244],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  infiniteShopUpgrades: {
    name: () => i18next.t('singularity.perks.infiniteShopUpgrades.name'),
    description: () => {
      const effect = getSingularityPerkEffect('infiniteShopUpgrades')
      const level = calculateSingularityPerkLevel('infiniteShopUpgrades')
      if (level >= 2) {
        return i18next.t('singularity.perks.infiniteShopUpgrades.level2', {
          amt: format(effect.bonusVouchers, 0, true)
        })
      } else {
        return i18next.t('singularity.perks.infiniteShopUpgrades.default', {
          amt: format(effect.bonusVouchers, 0, true)
        })
      }
    },
    effect: (level: number, singCount: number) => ({
      bonusVouchers: level >= 2
        ? Math.floor(0.8 * (singCount - 200))
        : (level >= 1 ? Math.floor(0.5 * (singCount - 200)) : 0)
    }),
    level0Value: {
      bonusVouchers: 0
    },
    levelThresholds: [250, 280],
    currentSingularityUsed: true,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  },
  taxReduction: {
    name: () => i18next.t('singularity.perks.taxReduction.name'),
    description: () => {
      const effect = getSingularityPerkEffect('taxReduction')
      return i18next.t('singularity.perks.taxReduction.default', {
        amt: format(100 * (1 - effect.taxMultiplier), 0, true)
      })
    },
    effect: (level: number) => ({
      taxMultiplier: level >= 1 ? 0.5 : 1
    }),
    level0Value: {
      taxMultiplier: 1
    },
    levelThresholds: [281],
    currentSingularityUsed: false,
    tags: [SingularityPerkTags.Miscellaneous],
    precomputedlevel: 0,
    enabled: true
  }
}

export const calculateSingularityPerkLevel = (key: SingularityPerkKeys): number => {
  const perk = singularityPerks[key]
  const currentSingularityUsed = perk.currentSingularityUsed
  const singularity = currentSingularityUsed ? player.singularityCount : player.highestSingularityCount
  for (let i = perk.levelThresholds.length; i >= 0; i--) {
    if (singularity >= perk.levelThresholds[i]) {
      return i + 1
    }
  }
  return 0
}

export const updatePrecomputedSingularityPerkLevels = () => {
  for (const key in singularityPerks) {
    const perkKey = key as SingularityPerkKeys
    singularityPerks[perkKey].precomputedlevel = calculateSingularityPerkLevel(perkKey)
  }
}

export const getSingularityPerkEffect = <K extends SingularityPerkKeys>(key: K, level?: number): SingPerkMap[K] => {
  const lvl = level ?? singularityPerks[key].precomputedlevel
  const singCount = singularityPerks[key].currentSingularityUsed
    ? player.singularityCount
    : player.highestSingularityCount

  if (lvl === 0 || !singularityPerks[key].enabled) return singularityPerks[key].level0Value
  else return singularityPerks[key].effect(lvl, singCount)
}
