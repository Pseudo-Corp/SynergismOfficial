import i18next from 'i18next'
import { getAmbrosiaUpgradeEffects } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateExalt4EffectiveSingularityMultiplier,
  calculateGoldenQuarkCost,
  calculateImmaculateAlchemyBonus
} from './Calculate'
import { updateMaxTokens, updateTokens } from './Campaign'
import { getOcteractUpgradeEffect, octeractUpgrades } from './Octeracts'
import { getGlobalBonus, getPersonalBonus, getQuarkBonus } from './Quark'
import { redAmbrosiaUpgrades } from './RedAmbrosiaUpgrades'
import { singularity } from './Reset'
import { runes } from './Runes'
import { getShopUpgradeEffects } from './Shop'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, Confirm, Prompt, revealStuff } from './UpdateHTML'
import { isMobile, toOrdinal } from './Utility'

type GoldenQuarkUpgradeRewards = {
  goldenQuarks1: { goldenQuarkMult: number }
  goldenQuarks2: { goldenQuarkCostMult: number }
  goldenQuarks3: { exportGQPerHour: number }
  starterPack: {
    obtainiumMult: number
    offeringMult: number
    cubeMult: number
  }
  cookies: { unlocked: boolean }
  cookies2: { unlocked: boolean }
  cookies3: { unlocked: boolean }
  cookies4: { unlocked: boolean }
  cookies5: { unlocked: boolean }
  ascensions: { ascensionCountMult: number }
  corruptionFourteen: { unlocked: boolean }
  corruptionFifteen: { freeCorruptionLevel: number }
  singOfferings1: { offeringMult: number }
  singOfferings2: { offeringMult: number }
  singOfferings3: { offeringMult: number }
  singObtainium1: { obtainiumMult: number }
  singObtainium2: { obtainiumMult: number }
  singObtainium3: { obtainiumMult: number }
  singCubes1: { cubeMult: number }
  singCubes2: { cubeMult: number }
  singCubes3: { cubeMult: number }
  singCitadel: {
    offeringMult: number
    obtainiumMult: number
    cubeMult: number
  }
  singCitadel2: {
    offeringMult: number
    obtainiumMult: number
    cubeMult: number
    citadel1FreeLevels: number
  }
  octeractUnlock: { unlocked: boolean }
  singOcteractPatreonBonus: { octeractMult: number }
  offeringAutomatic: { unlocked: boolean }
  intermediatePack: {
    globalSpeedMult: number
    ascensionSpeedMult: number
    packQuarkAdd: number
  }
  advancedPack: {
    packQuarkAdd: number
    corruptionScoreIncrease: number
  }
  expertPack: {
    packQuarkAdd: number
    ascensionScoreMult: number
    addCodeAscensionTimeMult: number
  }
  masterPack: {
    packQuarkAdd: number
    ascensionScoreMult: number
  }
  divinePack: {
    packQuarkAdd: number
    octeractMult: number
  }
  wowPass: { unlocked: boolean }
  wowPass2: { unlocked: boolean }
  wowPass3: { unlocked: boolean }
  wowPass4: { unlocked: boolean }
  potionBuff: { potionPowerMult: number }
  potionBuff2: { potionPowerMult: number }
  potionBuff3: { potionPowerMult: number }
  singChallengeExtension: {
    reincarnationCapIncrease: number
    ascensionCapIncrease: number
  }
  singChallengeExtension2: {
    reincarnationCapIncrease: number
    ascensionCapIncrease: number
  }
  singChallengeExtension3: {
    reincarnationCapIncrease: number
    ascensionCapIncrease: number
  }
  singQuarkImprover1: { quarkMult: number }
  singQuarkHepteract: { quarkHeptExponent: number }
  singQuarkHepteract2: { quarkHeptExponent: number }
  singQuarkHepteract3: { quarkHeptExponent: number }
  singOcteractGain: { octeractMult: number }
  singOcteractGain2: { octeractMult: number }
  singOcteractGain3: { octeractMult: number }
  singOcteractGain4: { octeractMult: number }
  singOcteractGain5: { octeractMult: number }
  platonicTau: {
    unlocked: boolean
    tauPower: number
  }
  platonicAlpha: { unlocked: boolean }
  platonicDelta: { cubeMult: number }
  platonicPhi: { dailyCodes: number }
  singFastForward: { lookahead: number }
  singFastForward2: { lookahead: number }
  singAscensionSpeed: { exponentSpread: number }
  singAscensionSpeed2: { exponentSpread: number }
  ultimatePen: { platonicPowers: boolean }
  halfMind: { unlocked: boolean }
  oneMind: { unlocked: boolean }
  blueberries: { blueberries: number }
  singAmbrosiaLuck: { ambrosiaLuck: number }
  singAmbrosiaLuck2: { ambrosiaLuck: number }
  singAmbrosiaLuck3: { ambrosiaLuck: number }
  singAmbrosiaLuck4: { ambrosiaLuck: number }
  singAmbrosiaGeneration: { ambrosiaBarSpeedMult: number }
  singAmbrosiaGeneration2: { ambrosiaBarSpeedMult: number }
  singAmbrosiaGeneration3: { ambrosiaBarSpeedMult: number }
  singAmbrosiaGeneration4: { ambrosiaBarSpeedMult: number }
  singBonusTokens1: { firstCompletionBonusTokens: number }
  singBonusTokens2: { tokenMultiplier: number }
  singBonusTokens3: { lastCompletionBonusTokens: number }
  singBonusTokens4: { initialTokenBonus: number }
  singInfiniteShopUpgrades: { infinityVouchers: number }
  singTalismanBonusRunes1: { talismanRuneEffect: number }
  singTalismanBonusRunes2: { talismanRuneEffect: number }
  singTalismanBonusRunes3: { talismanRuneEffect: number }
  singTalismanBonusRunes4: { talismanRuneEffect: number }
  favoriteUpgrade: { quarkMult: number }
}

export type SingularityDataKeys = keyof GoldenQuarkUpgradeRewards

const overclockPerks = [50, 60, 75, 100, 125, 150, 175, 200, 225, 250]
const tokenInheritanceTokens = [1, 10, 25, 40, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 750]
const singularityPenaltyThresholds = [11, 26, 37, 51, 101, 151, 201, 216, 230, 270]

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
    i18next.t('singularity.penalties.salvage', {
      amount: format(
        -calculateSingularityDebuff('Salvage', singularityCount),
        0,
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
    i18next.t('singularity.penalties.antELOGain', {
      amount: format(
        -calculateSingularityDebuff('Ant ELO', singularityCount),
        3,
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
    runes.antiquities.level > 0
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

type SingularitySpecialCostFormulae =
  | 'Default'
  | 'Quadratic'
  | 'Cubic'
  | 'Exponential2'

interface GoldenQuarkUpgrade<T extends SingularityDataKeys, K extends keyof GoldenQuarkUpgradeRewards[T]> {
  level: number
  freeLevel: number
  goldenQuarksInvested: number
  maxLevel: number
  canExceedCap: boolean
  qualityOfLife: boolean
  costPerLevel: number
  minimumSingularity: number
  specialCostForm: SingularitySpecialCostFormulae
  effect(n: number, key: K): GoldenQuarkUpgradeRewards[T][K]
  effectDescription(): string
  name(): string
  description(): string
}

export const goldenQuarkUpgrades: {
  [K in SingularityDataKeys]: GoldenQuarkUpgrade<K, keyof GoldenQuarkUpgradeRewards[K]>
} = {
  goldenQuarks1: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 15,
    canExceedCap: true,
    qualityOfLife: true,
    costPerLevel: 12,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.1 * n
    },
    effectDescription: function() {
      const goldenQuarkMult = getGQUpgradeEffect('goldenQuarks1', 'goldenQuarkMult')
      return i18next.t('singularity.data.goldenQuarks1.effect', {
        n: formatAsPercentIncrease(goldenQuarkMult, 2)
      })
    },
    name: () => {
      return i18next.t('singularity.data.goldenQuarks1.name')
    },
    description: () => {
      return i18next.t('singularity.data.goldenQuarks1.description')
    }
  },
  goldenQuarks2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 75,
    canExceedCap: true,
    qualityOfLife: true,
    costPerLevel: 60,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 250 ? 1 / Math.log2(n / 62.5) : 1 - Math.min(0.5, n / 500)
    },
    effectDescription: function() {
      const goldenQuarkCostMult = getGQUpgradeEffect('goldenQuarks2', 'goldenQuarkCostMult')
      const percentageValue = 100 * (1 - goldenQuarkCostMult)
      return i18next.t('singularity.data.goldenQuarks2.effect', {
        n: format(percentageValue, 2, true)
      })
    },
    name: () => {
      return i18next.t('singularity.data.goldenQuarks2.name')
    },
    description: () => {
      return i18next.t('singularity.data.goldenQuarks2.description')
    }
  },
  goldenQuarks3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1000,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1000,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return (n * (n + 1)) / 2
    },
    effectDescription: function() {
      const exportGQPerHour = getGQUpgradeEffect('goldenQuarks3', 'exportGQPerHour')
      return i18next.t('singularity.data.goldenQuarks3.effect', {
        n: format(exportGQPerHour, 1, true)
      })
    },
    name: () => {
      return i18next.t('singularity.data.goldenQuarks3.name')
    },
    description: () => {
      return i18next.t('singularity.data.goldenQuarks3.description')
    }
  },
  starterPack: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 10,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'obtainiumMult') {
        return 1 + 5 * n
      }
      if (key === 'offeringMult') {
        return 1 + 5 * n
      } else {
        return 1 + 4 * n // cubeMult
      }
    },
    effectDescription: () => {
      const n = getGQUpgradeEffect('starterPack', 'obtainiumMult') // simply need to check that one is >1
      return i18next.t(
        `singularity.data.starterPack.effect${n > 1 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => {
      return i18next.t('singularity.data.starterPack.name')
    },
    description: () => i18next.t('singularity.data.starterPack.description')
  },
  wowPass: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 350,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('wowPass', 'unlocked')
      return i18next.t(
        `singularity.data.wowPass.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.wowPass.name'),
    description: () => i18next.t('singularity.data.wowPass.description')
  },
  cookies: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 100,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('cookies', 'unlocked')
      return i18next.t(
        `singularity.data.cookies.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.cookies.name'),
    description: () => i18next.t('singularity.data.cookies.description')
  },
  cookies2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 500,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('cookies2', 'unlocked')
      return i18next.t(
        `singularity.data.cookies2.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.cookies2.name'),
    description: () => i18next.t('singularity.data.cookies2.description')
  },
  cookies3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 24999,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('cookies3', 'unlocked')
      return i18next.t(
        `singularity.data.cookies3.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.cookies3.name'),
    description: () => i18next.t('singularity.data.cookies3.description')
  },
  cookies4: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 499999,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('cookies4', 'unlocked')
      return i18next.t(
        `singularity.data.cookies4.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.cookies4.name'),
    description: () => i18next.t('singularity.data.cookies4.description')
  },
  cookies5: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1.66e15,
    minimumSingularity: 209,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('cookies5', 'unlocked')
      return i18next.t(
        `singularity.data.cookies5.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.cookies5.name'),
    description: () => i18next.t('singularity.data.cookies5.description')
  },
  ascensions: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 5,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return (1 + (2 * n) / 100) * (1 + Math.floor(n / 10) / 100)
    },
    effectDescription: () => {
      const ascensionCountMult = getGQUpgradeEffect('ascensions', 'ascensionCountMult')
      return i18next.t('singularity.data.ascensions.effect', {
        n: formatAsPercentIncrease(ascensionCountMult, 1)
      })
    },
    name: () => i18next.t('singularity.data.ascensions.name'),
    description: () => i18next.t('singularity.data.ascensions.description')
  },
  corruptionFourteen: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1000,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('corruptionFourteen', 'unlocked')
      return i18next.t(
        `singularity.data.corruptionFourteen.effect${unlocked ? 'Have' : 'HaveNot'}`,
        {
          m: unlocked ? ':)' : ':('
        }
      )
    },
    name: () => i18next.t('singularity.data.corruptionFourteen.name'),
    description: () => i18next.t('singularity.data.corruptionFourteen.description')
  },
  corruptionFifteen: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 40000,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n
    },
    effectDescription: () => {
      const freeCorruptionLevel = getGQUpgradeEffect('corruptionFifteen', 'freeCorruptionLevel')
      return i18next.t(
        `singularity.data.corruptionFifteen.effect${freeCorruptionLevel > 0 ? 'Have' : 'HaveNot'}`,
        {
          m: freeCorruptionLevel > 0 ? ':)' : ':('
        }
      )
    },
    name: () => i18next.t('singularity.data.corruptionFifteen.name'),
    description: () => i18next.t('singularity.data.corruptionFifteen.description')
  },
  singOfferings1: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.02 * n
    },
    effectDescription: () => {
      const offeringMult = getGQUpgradeEffect('singOfferings1', 'offeringMult')
      return i18next.t('singularity.data.singOfferings1.effect', {
        n: formatAsPercentIncrease(offeringMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOfferings1.name'),
    description: () => i18next.t('singularity.data.singOfferings1.description')
  },
  singOfferings2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 25,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 25,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.08 * n
    },
    effectDescription: () => {
      const offeringMult = getGQUpgradeEffect('singOfferings2', 'offeringMult')
      return i18next.t('singularity.data.singOfferings2.effect', {
        n: formatAsPercentIncrease(offeringMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOfferings2.name'),
    description: () => i18next.t('singularity.data.singOfferings2.description')
  },
  singOfferings3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 40,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 500,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.04 * n
    },
    effectDescription: () => {
      const offeringMult = getGQUpgradeEffect('singOfferings3', 'offeringMult')
      return i18next.t('singularity.data.singOfferings3.effect', {
        n: formatAsPercentIncrease(offeringMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOfferings3.name'),
    description: () => i18next.t('singularity.data.singOfferings3.description')
  },
  singObtainium1: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.02 * n
    },
    effectDescription: () => {
      const obtainiumMult = getGQUpgradeEffect('singObtainium1', 'obtainiumMult')
      return i18next.t('singularity.data.singObtainium1.effect', {
        n: formatAsPercentIncrease(obtainiumMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singObtainium1.name'),
    description: () => i18next.t('singularity.data.singObtainium1.description')
  },
  singObtainium2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 25,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 25,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.08 * n
    },
    effectDescription: () => {
      const obtainiumMult = getGQUpgradeEffect('singObtainium2', 'obtainiumMult')
      return i18next.t('singularity.data.singObtainium2.effect', {
        n: formatAsPercentIncrease(obtainiumMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singObtainium2.name'),
    description: () => i18next.t('singularity.data.singObtainium2.description')
  },
  singObtainium3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 40,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 500,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.04 * n
    },
    effectDescription: () => {
      const obtainiumMult = getGQUpgradeEffect('singObtainium3', 'obtainiumMult')
      return i18next.t('singularity.data.singObtainium3.effect', {
        n: formatAsPercentIncrease(obtainiumMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singObtainium3.name'),
    description: () => i18next.t('singularity.data.singObtainium3.description')
  },
  singCubes1: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.006 * n
    },
    effectDescription: () => {
      const cubeMult = getGQUpgradeEffect('singCubes1', 'cubeMult')
      return i18next.t('singularity.data.singCubes1.effect', {
        n: formatAsPercentIncrease(cubeMult, 3)
      })
    },
    name: () => i18next.t('singularity.data.singCubes1.name'),
    description: () => i18next.t('singularity.data.singCubes1.description')
  },
  singCubes2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 25,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 25,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.08 * n
    },
    effectDescription: () => {
      const cubeMult = getGQUpgradeEffect('singCubes2', 'cubeMult')
      return i18next.t('singularity.data.singCubes2.effect', {
        n: formatAsPercentIncrease(cubeMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singCubes2.name'),
    description: () => i18next.t('singularity.data.singCubes2.description')
  },
  singCubes3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 40,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 500,
    minimumSingularity: 0,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.04 * n
    },
    effectDescription: () => {
      const cubeMult = getGQUpgradeEffect('singCubes3', 'cubeMult')
      return i18next.t('singularity.data.singCubes3.effect', {
        n: formatAsPercentIncrease(cubeMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singCubes3.name'),
    description: () => i18next.t('singularity.data.singCubes3.description')
  },
  singCitadel: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 500000,
    minimumSingularity: 100,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return (1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100)
    },
    effectDescription: () => {
      const citadelMult = getGQUpgradeEffect('singCitadel', 'cubeMult')
      return i18next.t('singularity.data.singCitadel.effect', {
        n: formatAsPercentIncrease(citadelMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singCitadel.name'),
    description: () => i18next.t('singularity.data.singCitadel.description')
  },
  singCitadel2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 100,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e14,
    minimumSingularity: 204,
    specialCostForm: 'Quadratic',
    effect: (n, key) => {
      if (key === 'citadel1FreeLevels') {
        return n
      }
      return (1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100) // other keys!
    },
    effectDescription: () => {
      const citadelMult = getGQUpgradeEffect('singCitadel2', 'cubeMult')
      return i18next.t('singularity.data.singCitadel2.effect', {
        n: formatAsPercentIncrease(citadelMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singCitadel2.name'),
    description: () => i18next.t('singularity.data.singCitadel2.description')
  },
  octeractUnlock: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 8888,
    minimumSingularity: 8,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('octeractUnlock', 'unlocked')
      return i18next.t(
        `singularity.data.octeractUnlock.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.octeractUnlock.name'),
    description: () => i18next.t('singularity.data.octeractUnlock.description')
  },
  singOcteractPatreonBonus: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 9999,
    minimumSingularity: 12,
    specialCostForm: 'Default',
    effect: (n: number) => {
      const quarkBonus = getQuarkBonus()
      return (n > 0) ? 1 + quarkBonus / 100 : 1
    },
    effectDescription: () => {
      const octeractMult = getGQUpgradeEffect('singOcteractPatreonBonus', 'octeractMult')
      return i18next.t('singularity.data.singOcteractPatreonBonus.effect', {
        n: format(octeractMult, 3, true),
        x: format(1 + getGlobalBonus() / 100, 3, true),
        y: format(1 + getPersonalBonus() / 100, 3, true)
      })
    },
    name: () => i18next.t('singularity.data.singOcteractPatreonBonus.name'),
    description: () => i18next.t('singularity.data.singOcteractPatreonBonus.description')
  },
  offeringAutomatic: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e14,
    minimumSingularity: 222,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => i18next.t('singularity.data.offeringAutomatic.effect'),
    name: () => i18next.t('singularity.data.offeringAutomatic.name'),
    description: () => i18next.t('singularity.data.offeringAutomatic.description')
  },
  intermediatePack: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1,
    minimumSingularity: 4,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'globalSpeedMult') {
        return n > 0 ? 2 : 1
      } else if (key === 'ascensionSpeedMult') {
        return n > 0 ? 1.5 : 1
      } else {
        return n > 0 ? 0.02 : 0 // packQuarkAdd
      }
    },
    effectDescription: () => {
      const globalSpeedMult = getGQUpgradeEffect('intermediatePack', 'globalSpeedMult')
      return i18next.t(
        `singularity.data.intermediatePack.effect${globalSpeedMult > 1 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.intermediatePack.name'),
    description: () => i18next.t('singularity.data.intermediatePack.description')
  },
  advancedPack: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 200,
    minimumSingularity: 9,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'corruptionScoreIncrease') {
        return n > 0 ? 0.33 : 0
      } else {
        return n > 0 ? 0.04 : 0 // packQuarkAdd
      }
    },
    effectDescription: () => {
      const corruptionScoreIncrease = getGQUpgradeEffect('advancedPack', 'corruptionScoreIncrease')
      return i18next.t(
        `singularity.data.advancedPack.effect${corruptionScoreIncrease > 0 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.advancedPack.name'),
    description: () => i18next.t('singularity.data.advancedPack.description')
  },
  expertPack: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 800,
    minimumSingularity: 16,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'addCodeAscensionTimeMult') {
        return n > 0 ? 1.2 : 1
      } else if (key === 'ascensionScoreMult') {
        return n > 0 ? 1.5 : 1
      } else {
        return n > 0 ? 0.06 : 0 // packQuarkAdd
      }
    },
    effectDescription: () => {
      const addCodeAscensionTimeMult = getGQUpgradeEffect('expertPack', 'addCodeAscensionTimeMult')
      return i18next.t(
        `singularity.data.expertPack.effect${addCodeAscensionTimeMult > 1 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.expertPack.name'),
    description: () => i18next.t('singularity.data.expertPack.description')
  },
  masterPack: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 3200,
    minimumSingularity: 25,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'ascensionScoreMult') {
        return n > 0 ? 2 : 1
      } else {
        return n > 0 ? 0.08 : 0 // packQuarkAdd
      }
    },
    effectDescription: () => {
      const ascensionScoreMult = getGQUpgradeEffect('masterPack', 'ascensionScoreMult')
      return i18next.t(
        `singularity.data.masterPack.effect${ascensionScoreMult > 1 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.masterPack.name'),
    description: () => i18next.t('singularity.data.masterPack.description')
  },
  divinePack: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 12800,
    minimumSingularity: 36,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'octeractMult') {
        if (n === 0) {
          return 1
        } else {
          const corruptions = player.corruptions.used
          const octMult = Object.values(corruptions.loadout).reduce(
            (acc, curr) => acc * (curr === 16 ? 1.4 : (curr === 15 ? 1.3 : (curr === 14 ? 1.25 : 1))),
            1
          )
          return octMult
        }
      } else {
        return n > 0 ? 0.1 : 0 // packQuarkAdd
      }
    },
    effectDescription: () => {
      const octeractMult = getGQUpgradeEffect('divinePack', 'octeractMult')
      return i18next.t(
        `singularity.data.divinePack.effect${octeractMult > 1 ? 'Have' : 'HaveNot'}`,
        {
          n: formatAsPercentIncrease(octeractMult, 0)
        }
      )
    },
    name: () => i18next.t('singularity.data.divinePack.name'),
    description: () => i18next.t('singularity.data.divinePack.description')
  },
  wowPass2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 12500,
    minimumSingularity: 9,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('wowPass2', 'unlocked')
      return i18next.t(
        `singularity.data.wowPass2.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.wowPass2.name'),
    description: () => i18next.t('singularity.data.wowPass2.description')
  },
  wowPass3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 3e7 - 1,
    minimumSingularity: 83,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('wowPass3', 'unlocked')
      return i18next.t(
        `singularity.data.wowPass3.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.wowPass3.name'),
    description: () => i18next.t('singularity.data.wowPass3.description')
  },
  potionBuff: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 999,
    minimumSingularity: 4,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return Math.max(1, 10 * Math.pow(n, 2))
    },
    effectDescription: () => {
      const potionPowerMult = getGQUpgradeEffect('potionBuff', 'potionPowerMult')
      return i18next.t('singularity.data.potionBuff.effect', {
        n: format(potionPowerMult, 0, true)
      })
    },
    name: () => i18next.t('singularity.data.potionBuff.name'),
    description: () => i18next.t('singularity.data.potionBuff.description')
  },
  potionBuff2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 1e8,
    minimumSingularity: 119,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return Math.max(1, 2 * n)
    },
    effectDescription: () => {
      const potionPowerMult = getGQUpgradeEffect('potionBuff2', 'potionPowerMult')
      return i18next.t('singularity.data.potionBuff2.effect', {
        n: format(potionPowerMult, 0, true)
      })
    },
    name: () => i18next.t('singularity.data.potionBuff2.name'),
    description: () => i18next.t('singularity.data.potionBuff2.description')
  },
  potionBuff3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 1e12,
    minimumSingularity: 191,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return Math.max(1, 1 + 0.5 * n)
    },
    effectDescription: () => {
      const potionPowerMult = getGQUpgradeEffect('potionBuff3', 'potionPowerMult')
      return i18next.t('singularity.data.potionBuff3.effect', {
        n: format(potionPowerMult, 2, true)
      })
    },
    name: () => i18next.t('singularity.data.potionBuff3.name'),
    description: () => i18next.t('singularity.data.potionBuff3.description')
  },
  singChallengeExtension: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 4,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 999,
    minimumSingularity: 11,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'ascensionCapIncrease') {
        return n
      }
      return 2 * n // reincarnationCapIncrease
    },
    effectDescription: () => {
      const reincarnationCapIncrease = getGQUpgradeEffect('singChallengeExtension', 'reincarnationCapIncrease')
      const ascensionCapIncrease = getGQUpgradeEffect('singChallengeExtension', 'ascensionCapIncrease')
      return i18next.t('singularity.data.singChallengeExtension.effect', {
        n: reincarnationCapIncrease,
        m: ascensionCapIncrease
      })
    },
    name: () => i18next.t('singularity.data.singChallengeExtension.name'),
    description: () => i18next.t('singularity.data.singChallengeExtension.description')
  },
  singChallengeExtension2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 3,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 29999,
    minimumSingularity: 26,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'ascensionCapIncrease') {
        return n
      }
      return 2 * n // reincarnationCapIncrease
    },
    effectDescription: () => {
      const reincarnationCapIncrease = getGQUpgradeEffect('singChallengeExtension2', 'reincarnationCapIncrease')
      const ascensionCapIncrease = getGQUpgradeEffect('singChallengeExtension2', 'ascensionCapIncrease')
      return i18next.t('singularity.data.singChallengeExtension2.effect', {
        n: reincarnationCapIncrease,
        m: ascensionCapIncrease
      })
    },
    name: () => i18next.t('singularity.data.singChallengeExtension2.name'),
    description: () => i18next.t('singularity.data.singChallengeExtension2.description')
  },
  singChallengeExtension3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 3,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 749999,
    minimumSingularity: 51,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'ascensionCapIncrease') {
        return n
      }
      return 2 * n // reincarnationCapIncrease
    },
    effectDescription: () => {
      const reincarnationCapIncrease = getGQUpgradeEffect('singChallengeExtension3', 'reincarnationCapIncrease')
      const ascensionCapIncrease = getGQUpgradeEffect('singChallengeExtension3', 'ascensionCapIncrease')
      return i18next.t('singularity.data.singChallengeExtension3.effect', {
        n: reincarnationCapIncrease,
        m: ascensionCapIncrease
      })
    },
    name: () => i18next.t('singularity.data.singChallengeExtension3.name'),
    description: () => i18next.t('singularity.data.singChallengeExtension3.description')
  },
  singQuarkImprover1: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 30,
    canExceedCap: true,
    qualityOfLife: true,
    costPerLevel: 1,
    minimumSingularity: 173,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return 1 + n / 200
    },
    effectDescription: () => {
      const quarkMult = getGQUpgradeEffect('singQuarkImprover1', 'quarkMult')
      return i18next.t('singularity.data.singQuarkImprover1.effect', {
        n: formatAsPercentIncrease(quarkMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singQuarkImprover1.name'),
    description: () => i18next.t('singularity.data.singQuarkImprover1.description')
  },
  singQuarkHepteract: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 14999,
    minimumSingularity: 5,
    specialCostForm: 'Quadratic',
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: () => {
      const quarkHeptExponent = getGQUpgradeEffect('singQuarkHepteract', 'quarkHeptExponent')
      return i18next.t('singularity.data.singQuarkHepteract.effect', {
        n: format(quarkHeptExponent, 2, true)
      })
    },
    name: () => i18next.t('singularity.data.singQuarkHepteract.name'),
    description: () => i18next.t('singularity.data.singQuarkHepteract.description')
  },
  singQuarkHepteract2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 449999,
    minimumSingularity: 30,
    specialCostForm: 'Cubic',
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: () => {
      const quarkHeptExponent = getGQUpgradeEffect('singQuarkHepteract2', 'quarkHeptExponent')
      return i18next.t('singularity.data.singQuarkHepteract2.effect', {
        n: format(quarkHeptExponent, 2, true)
      })
    },
    name: () => i18next.t('singularity.data.singQuarkHepteract2.name'),
    description: () => i18next.t('singularity.data.singQuarkHepteract2.description')
  },
  singQuarkHepteract3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: true,
    qualityOfLife: true,
    costPerLevel: 13370000,
    minimumSingularity: 61,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return n / 200
    },
    effectDescription: () => {
      const quarkHeptExponent = getGQUpgradeEffect('singQuarkHepteract3', 'quarkHeptExponent')
      return i18next.t('singularity.data.singQuarkHepteract3.effect', {
        n: format(quarkHeptExponent, 2, true)
      })
    },
    name: () => i18next.t('singularity.data.singQuarkHepteract3.name'),
    description: () => i18next.t('singularity.data.singQuarkHepteract3.description')
  },
  singOcteractGain: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 20000,
    minimumSingularity: 36,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.0125 * n
    },
    effectDescription: () => {
      const octeractMult = getGQUpgradeEffect('singOcteractGain', 'octeractMult')
      return i18next.t('singularity.data.singOcteractGain.effect', {
        n: formatAsPercentIncrease(octeractMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOcteractGain.name'),
    description: () => i18next.t('singularity.data.singOcteractGain.description')
  },
  singOcteractGain2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 25,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 40000,
    minimumSingularity: 36,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.05 * n
    },
    effectDescription: () => {
      const octeractMult = getGQUpgradeEffect('singOcteractGain2', 'octeractMult')
      return i18next.t('singularity.data.singOcteractGain2.effect', {
        n: formatAsPercentIncrease(octeractMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOcteractGain2.name'),
    description: () => i18next.t('singularity.data.singOcteractGain2.description')
  },
  singOcteractGain3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 50,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 250000,
    minimumSingularity: 55,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.025 * n
    },
    effectDescription: () => {
      const octeractMult = getGQUpgradeEffect('singOcteractGain3', 'octeractMult')
      return i18next.t('singularity.data.singOcteractGain3.effect', {
        n: formatAsPercentIncrease(octeractMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOcteractGain3.name'),
    description: () => i18next.t('singularity.data.singOcteractGain3.description')
  },
  singOcteractGain4: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 100,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 750000,
    minimumSingularity: 77,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.02 * n
    },
    effectDescription: () => {
      const octeractMult = getGQUpgradeEffect('singOcteractGain4', 'octeractMult')
      return i18next.t('singularity.data.singOcteractGain4.effect', {
        n: formatAsPercentIncrease(octeractMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOcteractGain4.name'),
    description: () => i18next.t('singularity.data.singOcteractGain4.description')
  },
  singOcteractGain5: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 200,
    canExceedCap: true,
    qualityOfLife: false,
    costPerLevel: 7777777,
    minimumSingularity: 100,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + 0.01 * n
    },
    effectDescription: () => {
      const octeractMult = getGQUpgradeEffect('singOcteractGain5', 'octeractMult')
      return i18next.t('singularity.data.singOcteractGain5.effect', {
        n: formatAsPercentIncrease(octeractMult, 2)
      })
    },
    name: () => i18next.t('singularity.data.singOcteractGain5.name'),
    description: () => i18next.t('singularity.data.singOcteractGain5.description')
  },
  platonicTau: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 100000,
    minimumSingularity: 29,
    specialCostForm: 'Default',
    effect: (n, key) => {
      if (key === 'tauPower') {
        return n > 0 ? 1.01 : 1
      }
      return n > 0 // unlocked
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('platonicTau', 'unlocked')
      return i18next.t(
        `singularity.data.platonicTau.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.platonicTau.name'),
    description: () => i18next.t('singularity.data.platonicTau.description')
  },
  platonicAlpha: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 2e7,
    minimumSingularity: 70,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('platonicAlpha', 'unlocked')
      return i18next.t(
        `singularity.data.platonicAlpha.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.platonicAlpha.name'),
    description: () => i18next.t('singularity.data.platonicAlpha.description')
  },
  platonicDelta: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 5e9,
    minimumSingularity: 110,
    specialCostForm: 'Default',
    effect: (n) => {
      const speedMult = getShopUpgradeEffects('shopSingularitySpeedup', 'singularityUpgradeSpeedMult')
      return n > 0 ? 1 + Math.min((player.singularityCounter + 1) * speedMult / (3600 * 24), 9) : 1
    },
    effectDescription: () => {
      const cubeMult = getGQUpgradeEffect('platonicDelta', 'cubeMult')
      return i18next.t(
        `singularity.data.platonicDelta.effect${cubeMult > 1 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.platonicDelta.name'),
    description: () => i18next.t('singularity.data.platonicDelta.description')
  },
  platonicPhi: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 2e11,
    minimumSingularity: 149,
    specialCostForm: 'Default',
    effect: (n: number) => {
      const speedMult = getShopUpgradeEffects('shopSingularitySpeedup', 'singularityUpgradeSpeedMult')
      return n > 0 ? Math.floor(5 * Math.min(player.singularityCounter * speedMult / (3600 * 24), 10)) : 0
    },
    effectDescription: () => {
      const level = player.goldenQuarkUpgrades.platonicPhi.level
      return i18next.t(
        `singularity.data.platonicPhi.effect${level > 0 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.platonicPhi.name'),
    description: () => i18next.t('singularity.data.platonicPhi.description')
  },
  singFastForward: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 7e6 - 1,
    minimumSingularity: 50,
    specialCostForm: 'Default',
    effect: (n) => {
      return n
    },
    effectDescription: () => {
      const lookahead = getGQUpgradeEffect('singFastForward', 'lookahead')
      return i18next.t(
        `singularity.data.singFastForward.effect${lookahead > 0 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.singFastForward.name'),
    description: () => i18next.t('singularity.data.singFastForward.description')
  },
  singFastForward2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1e11 - 1,
    minimumSingularity: 147,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n
    },
    effectDescription: () => {
      const lookahead = getGQUpgradeEffect('singFastForward2', 'lookahead')
      return i18next.t(
        `singularity.data.singFastForward2.effect${lookahead > 0 ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.singFastForward2.name'),
    description: () => i18next.t('singularity.data.singFastForward2.description')
  },
  singAscensionSpeed: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e10,
    minimumSingularity: 128,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return (n > 0) ? 0.03 : 0
    },
    effectDescription: () => {
      const exponentSpread = getGQUpgradeEffect('singAscensionSpeed', 'exponentSpread')
      return i18next.t('singularity.data.singAscensionSpeed.effect', {
        n: format(1 + exponentSpread, 2, true),
        m: format(1 - exponentSpread, 2, true)
      })
    },
    name: () => i18next.t('singularity.data.singAscensionSpeed.name'),
    description: () => i18next.t('singularity.data.singAscensionSpeed.description')
  },
  singAscensionSpeed2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 30,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e12,
    minimumSingularity: 147,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return 0.001 * n
    },
    effectDescription: () => {
      const exponentSpread = getGQUpgradeEffect('singAscensionSpeed2', 'exponentSpread')
      return i18next.t('singularity.data.singAscensionSpeed2.effect', {
        n: format(exponentSpread, 3, true)
      })
    },
    name: () => i18next.t('singularity.data.singAscensionSpeed2.name'),
    description: () => i18next.t('singularity.data.singAscensionSpeed2.description')
  },
  ultimatePen: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 2.22e26,
    minimumSingularity: 300,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const platonicPowers = getGQUpgradeEffect('ultimatePen', 'platonicPowers')
      return i18next.t('singularity.data.ultimatePen.effect', {
        n: platonicPowers ? '' : 'NOT',
        m: platonicPowers
          ? ' However, the pen just ran out of ink. How will you get more?'
          : ''
      })
    },
    name: () => i18next.t('singularity.data.ultimatePen.name'),
    description: () => i18next.t('singularity.data.ultimatePen.description')
  },
  halfMind: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1.66e12,
    minimumSingularity: 150,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('halfMind', 'unlocked')
      return i18next.t(
        `singularity.data.halfMind.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.halfMind.name'),
    description: () => i18next.t('singularity.data.halfMind.description')
  },
  oneMind: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1.66e13,
    minimumSingularity: 162,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('oneMind', 'unlocked')
      return i18next.t(
        `singularity.data.oneMind.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.oneMind.name'),
    description: () => i18next.t('singularity.data.oneMind.description')
  },
  wowPass4: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 66666666666,
    minimumSingularity: 147,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n > 0
    },
    effectDescription: () => {
      const unlocked = getGQUpgradeEffect('wowPass4', 'unlocked')
      return i18next.t(
        `singularity.data.wowPass4.effect${unlocked ? 'Have' : 'HaveNot'}`
      )
    },
    name: () => i18next.t('singularity.data.wowPass4.name'),
    description: () => i18next.t('singularity.data.wowPass4.description')
  },
  blueberries: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1e16,
    minimumSingularity: 215,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return n
    },
    effectDescription: () => {
      const blueberries = getGQUpgradeEffect('blueberries', 'blueberries')
      return i18next.t('singularity.data.blueberries.effect', { n: blueberries })
    },
    name: () => i18next.t('singularity.data.blueberries.name'),
    description: () => i18next.t('singularity.data.blueberries.description')
  },
  singAmbrosiaLuck: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1e9,
    minimumSingularity: 187,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return 4 * n
    },
    effectDescription: () => {
      const ambrosiaLuck = getGQUpgradeEffect('singAmbrosiaLuck', 'ambrosiaLuck')
      return i18next.t('singularity.data.singAmbrosiaLuck.effect', {
        n: format(ambrosiaLuck)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaLuck.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaLuck.description')
  },
  singAmbrosiaLuck2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 30,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 4e5,
    minimumSingularity: 50,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 2 * n
    },
    effectDescription: () => {
      const ambrosiaLuck = getGQUpgradeEffect('singAmbrosiaLuck2', 'ambrosiaLuck')
      return i18next.t('singularity.data.singAmbrosiaLuck2.effect', {
        n: format(ambrosiaLuck)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaLuck2.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaLuck2.description')
  },
  singAmbrosiaLuck3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 30,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 2e8,
    minimumSingularity: 119,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 3 * n
    },
    effectDescription: () => {
      const ambrosiaLuck = getGQUpgradeEffect('singAmbrosiaLuck3', 'ambrosiaLuck')
      return i18next.t('singularity.data.singAmbrosiaLuck3.effect', {
        n: format(ambrosiaLuck)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaLuck3.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaLuck3.description')
  },
  singAmbrosiaLuck4: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 50,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1e19,
    minimumSingularity: 256,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 5 * n
    },
    effectDescription: () => {
      const ambrosiaLuck = getGQUpgradeEffect('singAmbrosiaLuck4', 'ambrosiaLuck')
      return i18next.t('singularity.data.singAmbrosiaLuck4.effect', {
        n: format(ambrosiaLuck)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaLuck4.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaLuck4.description')
  },
  singAmbrosiaGeneration: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: -1,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1e9,
    minimumSingularity: 187,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: () => {
      const ambrosiaBarSpeedMult = getGQUpgradeEffect('singAmbrosiaGeneration', 'ambrosiaBarSpeedMult')
      return i18next.t('singularity.data.singAmbrosiaGeneration.effect', {
        n: formatAsPercentIncrease(ambrosiaBarSpeedMult, 0)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaGeneration.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaGeneration.description')
  },
  singAmbrosiaGeneration2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 20,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 8e5,
    minimumSingularity: 50,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: () => {
      const ambrosiaBarSpeedMult = getGQUpgradeEffect('singAmbrosiaGeneration2', 'ambrosiaBarSpeedMult')
      return i18next.t('singularity.data.singAmbrosiaGeneration2.effect', {
        n: formatAsPercentIncrease(ambrosiaBarSpeedMult, 0)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaGeneration2.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaGeneration2.description')
  },
  singAmbrosiaGeneration3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 35,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 3e8,
    minimumSingularity: 119,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: () => {
      const ambrosiaBarSpeedMult = getGQUpgradeEffect('singAmbrosiaGeneration3', 'ambrosiaBarSpeedMult')
      return i18next.t('singularity.data.singAmbrosiaGeneration3.effect', {
        n: formatAsPercentIncrease(ambrosiaBarSpeedMult, 0)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaGeneration3.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaGeneration3.description')
  },
  singAmbrosiaGeneration4: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 50,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1e19,
    minimumSingularity: 256,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return 1 + (2 * n) / 100
    },
    effectDescription: () => {
      const ambrosiaBarSpeedMult = getGQUpgradeEffect('singAmbrosiaGeneration4', 'ambrosiaBarSpeedMult')
      return i18next.t('singularity.data.singAmbrosiaGeneration4.effect', {
        n: formatAsPercentIncrease(ambrosiaBarSpeedMult, 0)
      })
    },
    name: () => i18next.t('singularity.data.singAmbrosiaGeneration4.name'),
    description: () => i18next.t('singularity.data.singAmbrosiaGeneration4.description')
  },
  singBonusTokens1: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 5,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 25,
    minimumSingularity: 1,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return n
    },
    effectDescription: () => {
      const firstCompletionBonusTokens = getGQUpgradeEffect('singBonusTokens1', 'firstCompletionBonusTokens')
      return i18next.t('singularity.data.singBonusTokens1.effect', {
        n: format(firstCompletionBonusTokens)
      })
    },
    name: () => i18next.t('singularity.data.singBonusTokens1.name'),
    description: () => i18next.t('singularity.data.singBonusTokens1.description')
  },
  singBonusTokens2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 5,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 10000,
    minimumSingularity: 25,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: () => {
      const tokenMultiplier = getGQUpgradeEffect('singBonusTokens2', 'tokenMultiplier')
      return i18next.t('singularity.data.singBonusTokens2.effect', {
        n: formatAsPercentIncrease(tokenMultiplier, 0)
      })
    },
    name: () => i18next.t('singularity.data.singBonusTokens2.name'),
    description: () => i18next.t('singularity.data.singBonusTokens2.description')
  },
  singBonusTokens3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 5,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e8,
    minimumSingularity: 100,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return 2 * n
    },
    effectDescription: () => {
      const lastCompletionBonusTokens = getGQUpgradeEffect('singBonusTokens3', 'lastCompletionBonusTokens')
      return i18next.t('singularity.data.singBonusTokens3.effect', {
        n: format(lastCompletionBonusTokens)
      })
    },
    name: () => i18next.t('singularity.data.singBonusTokens3.name'),
    description: () => i18next.t('singularity.data.singBonusTokens3.description')
  },
  singBonusTokens4: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 30,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e13,
    minimumSingularity: 166,
    specialCostForm: 'Exponential2',
    effect: (n: number) => {
      return 5 * n
    },
    effectDescription: () => {
      const initialTokenBonus = getGQUpgradeEffect('singBonusTokens4', 'initialTokenBonus')
      return i18next.t('singularity.data.singBonusTokens4.effect', {
        n: format(initialTokenBonus)
      })
    },
    name: () => i18next.t('singularity.data.singBonusTokens4.name'),
    description: () => i18next.t('singularity.data.singBonusTokens4.description')
  },
  singInfiniteShopUpgrades: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 80,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e18,
    minimumSingularity: 233,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n
    },
    effectDescription: () => {
      const infinityVouchers = getGQUpgradeEffect('singInfiniteShopUpgrades', 'infinityVouchers')
      return i18next.t('singularity.data.singInfiniteShopUpgrades.effect', {
        n: format(infinityVouchers)
      })
    },
    name: () => i18next.t('singularity.data.singInfiniteShopUpgrades.name'),
    description: () => i18next.t('singularity.data.singInfiniteShopUpgrades.description')
  },
  singTalismanBonusRunes1: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 5,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 25,
    minimumSingularity: 1,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: () => {
      const talismanRuneEffect = getGQUpgradeEffect('singTalismanBonusRunes1', 'talismanRuneEffect')
      return i18next.t('singularity.data.singTalismanBonusRunes1.effect', {
        n: formatAsPercentIncrease(1 + talismanRuneEffect, 0)
      })
    },
    name: () => i18next.t('singularity.data.singTalismanBonusRunes1.name'),
    description: () => i18next.t('singularity.data.singTalismanBonusRunes1.description')
  },
  singTalismanBonusRunes2: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 5,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 10000,
    minimumSingularity: 27,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: () => {
      const talismanRuneEffect = getGQUpgradeEffect('singTalismanBonusRunes2', 'talismanRuneEffect')
      return i18next.t('singularity.data.singTalismanBonusRunes2.effect', {
        n: formatAsPercentIncrease(1 + talismanRuneEffect, 0)
      })
    },
    name: () => i18next.t('singularity.data.singTalismanBonusRunes2.name'),
    description: () => i18next.t('singularity.data.singTalismanBonusRunes2.description')
  },
  singTalismanBonusRunes3: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 5,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 1e8,
    minimumSingularity: 99,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: () => {
      const talismanRuneEffect = getGQUpgradeEffect('singTalismanBonusRunes3', 'talismanRuneEffect')
      return i18next.t('singularity.data.singTalismanBonusRunes3.effect', {
        n: formatAsPercentIncrease(1 + talismanRuneEffect, 0)
      })
    },
    name: () => i18next.t('singularity.data.singTalismanBonusRunes3.name'),
    description: () => i18next.t('singularity.data.singTalismanBonusRunes3.description')
  },
  singTalismanBonusRunes4: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 10,
    canExceedCap: false,
    qualityOfLife: false,
    costPerLevel: 3e15,
    minimumSingularity: 211,
    specialCostForm: 'Default',
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: () => {
      const talismanRuneEffect = getGQUpgradeEffect('singTalismanBonusRunes4', 'talismanRuneEffect')
      return i18next.t('singularity.data.singTalismanBonusRunes4.effect', {
        n: formatAsPercentIncrease(1 + talismanRuneEffect, 0)
      })
    },
    name: () => i18next.t('singularity.data.singTalismanBonusRunes4.name'),
    description: () => i18next.t('singularity.data.singTalismanBonusRunes4.description')
  },
  favoriteUpgrade: {
    level: 0,
    freeLevel: 0,
    goldenQuarksInvested: 0,
    maxLevel: 100,
    canExceedCap: false,
    qualityOfLife: true,
    costPerLevel: 1,
    specialCostForm: 'Exponential2',
    minimumSingularity: 2,
    effect: (n: number) => {
      const upgrade1 = +(goldenQuarkUpgrades.goldenQuarks1.level >= goldenQuarkUpgrades.goldenQuarks1.maxLevel)
      const upgrade2 = +(goldenQuarkUpgrades.platonicDelta.level >= goldenQuarkUpgrades.platonicDelta.maxLevel)
      const upgrade3 = +(goldenQuarkUpgrades.oneMind.level >= goldenQuarkUpgrades.oneMind.maxLevel)
      const upgrade4 = +(octeractUpgrades.octeractImprovedFree.level >= octeractUpgrades.octeractImprovedFree.maxLevel)
      const upgrade5 = +(octeractUpgrades.octeractCorruption.level >= octeractUpgrades.octeractCorruption.maxLevel)
      const upgrade6 = +(octeractUpgrades.octeractBlueberries.level >= octeractUpgrades.octeractBlueberries.maxLevel)
      const upgrade7 = +(redAmbrosiaUpgrades.tutorial.level >= redAmbrosiaUpgrades.tutorial.maxLevel)
      const upgrade8 =
        +(redAmbrosiaUpgrades.infiniteShopUpgrades.level >= redAmbrosiaUpgrades.infiniteShopUpgrades.maxLevel)
      const upgrade9 =
        +(redAmbrosiaUpgrades.blueberryGenerationSpeed2.level >= redAmbrosiaUpgrades.blueberryGenerationSpeed2.maxLevel)
      const sumOfUpgrades = upgrade1 + upgrade2 + upgrade3 + upgrade4 + upgrade5 + upgrade6 + upgrade7 + upgrade8
        + upgrade9
      return 1 + n / 5000 * (sumOfUpgrades + 6)
    },
    name: () => i18next.t('singularity.data.favoriteUpgrade.name'),
    description: () => {
      const titleText = i18next.t('singularity.data.favoriteUpgrade.description')
      const upgrade1 = i18next.t('singularity.data.favoriteUpgrade.upgrade1', {
        checkMark: goldenQuarkUpgrades.goldenQuarks1.level >= goldenQuarkUpgrades.goldenQuarks1.maxLevel ? '✔️' : '❌'
      })
      const upgrade2 = i18next.t('singularity.data.favoriteUpgrade.upgrade2', {
        checkMark: goldenQuarkUpgrades.platonicDelta.level >= goldenQuarkUpgrades.platonicDelta.maxLevel ? '✔️' : '❌'
      })
      const upgrade3 = i18next.t('singularity.data.favoriteUpgrade.upgrade3', {
        checkMark: goldenQuarkUpgrades.oneMind.level >= goldenQuarkUpgrades.oneMind.maxLevel ? '✔️' : '❌'
      })
      const upgrade4 = i18next.t('singularity.data.favoriteUpgrade.upgrade4', {
        checkMark: octeractUpgrades.octeractImprovedFree.level >= octeractUpgrades.octeractImprovedFree.maxLevel
          ? '✔️'
          : '❌'
      })
      const upgrade5 = i18next.t('singularity.data.favoriteUpgrade.upgrade5', {
        checkMark: octeractUpgrades.octeractCorruption.level >= octeractUpgrades.octeractCorruption.maxLevel
          ? '✔️'
          : '❌'
      })
      const upgrade6 = i18next.t('singularity.data.favoriteUpgrade.upgrade6', {
        checkMark: octeractUpgrades.octeractBlueberries.level >= octeractUpgrades.octeractBlueberries.maxLevel
          ? '✔️'
          : '❌'
      })
      const upgrade7 = i18next.t('singularity.data.favoriteUpgrade.upgrade7', {
        checkMark: redAmbrosiaUpgrades.tutorial.level >= redAmbrosiaUpgrades.tutorial.maxLevel ? '✔️' : '❌'
      })
      const upgrade8 = i18next.t('singularity.data.favoriteUpgrade.upgrade8', {
        checkMark: redAmbrosiaUpgrades.infiniteShopUpgrades.level >= redAmbrosiaUpgrades.infiniteShopUpgrades.maxLevel
          ? '✔️'
          : '❌'
      })
      const upgrade9 = i18next.t('singularity.data.favoriteUpgrade.upgrade9', {
        checkMark:
          redAmbrosiaUpgrades.blueberryGenerationSpeed2.level >= redAmbrosiaUpgrades.blueberryGenerationSpeed2.maxLevel
            ? '✔️'
            : '❌'
      })
      return `${titleText}<br>${upgrade1}<br>${upgrade2}<br>${upgrade3}<br>${upgrade4}<br>${upgrade5}<br>${upgrade6}<br>${upgrade7}<br>${upgrade8}<br>${upgrade9}`
    },
    effectDescription: () => {
      const bonus = getGQUpgradeEffect('favoriteUpgrade', 'quarkMult')
      return i18next.t('singularity.data.favoriteUpgrade.effect', {
        n: formatAsPercentIncrease(bonus, 2)
      })
    }
  }
}

export const blankGQLevelObject: Record<
  SingularityDataKeys,
  { level: number; freeLevel: number; goldenQuarksInvested: number }
> = Object.fromEntries(
  Object.keys(goldenQuarkUpgrades).map((key) => [
    key as SingularityDataKeys,
    {
      level: 0,
      freeLevel: 0,
      goldenQuarksInvested: 0
    }
  ])
) as Record<SingularityDataKeys, { level: number; freeLevel: number; goldenQuarksInvested: number }>

export const maxGoldenQuarkUpgradeAP = Object.values(goldenQuarkUpgrades).reduce((acc, upgrade) => {
  if (upgrade.maxLevel === -1) {
    return acc
  }
  return acc + 5
}, 0)

/**
 * Get the upgrade's HTML representation with all relevant information
 */
export function upgradeGQToString (upgradeKey: SingularityDataKeys): string {
  const upgrade = goldenQuarkUpgrades[upgradeKey]
  const name = upgrade.name()
  const description = upgrade.description()
  const costNextLevel = getGQUpgradeCostTNL(upgradeKey)
  const maxLevel = upgrade.maxLevel === -1 ? '' : `/${format(computeGQUpgradeMaxLevel(upgradeKey), 0, true)}`
  const effectDesc = upgrade.effectDescription()
  const freeLevelMult = computeFreeLevelMultiplier()
  const freeLevelsWithMult = upgrade.freeLevel * freeLevelMult
  const totalEffectiveLevels = actualGQUpgradeTotalLevels(upgradeKey)
  const color = computeGQUpgradeMaxLevel(upgradeKey) === upgrade.level ? 'plum' : 'white'

  // Upgrade Name Text
  const nameHTML = `<span style="color: gold">${name}</span>`

  // Upgrade Description Text
  const descriptionHTML = `<span style="color: lightblue">${description}</span>`

  // 'Minimum Singularity' Text
  const minReqColor = player.highestSingularityCount < upgrade.minimumSingularity
    ? 'var(--crimson-text-color)'
    : 'var(--green-text-color)'
  const minimumSingularity = upgrade.minimumSingularity > 0
    ? i18next.t('singularity.toString.minimum', {
      minSingularity: upgrade.minimumSingularity
    })
    : i18next.t('singularity.toString.noMinimum')

  const minSingularityHTML = `<span style="color: ${minReqColor}">${minimumSingularity}</span>`

  // Level Text
  const freeMultText = freeLevelMult > 1
    ? `<span style="color: crimson"> (x${format(freeLevelMult, 2, true)})</span>`
    : ''

  let freeLevelText = freeLevelsWithMult > 0
    ? `<span style="color: orange"> [+${format(upgrade.freeLevel, 2, true)}${freeMultText}]</span>`
    : ''

  if (freeLevelsWithMult > upgrade.level) {
    freeLevelText = `${freeLevelText}<span style="color: lightgray"> ${
      i18next.t(
        'general.softCapped'
      )
    }</span>`
  }

  const effectiveLevelText = totalEffectiveLevels !== upgrade.level
    ? `<br><b><span style="color: white">${
      i18next.t('general.effectiveLevel', {
        level: format(totalEffectiveLevels, 2, true)
      })
    }</span></b>`
    : ''

  const levelText = `<span style="color: ${color}">${i18next.t('general.level')} ${
    format(upgrade.level, 0, true)
  }${maxLevel}${freeLevelText}</span>`

  // Upgrade Effect Text
  const upgradeEffectHTML = `<span style="color: gold">${effectDesc}</span>`

  // TNL Cost Text
  const costHTML = computeGQUpgradeMaxLevel(upgradeKey) === upgrade.level
    ? ''
    : i18next.t('singularity.toString.costNextLevel', { amount: format(costNextLevel, 0, true) })

  const investedGQHTML = upgrade.goldenQuarksInvested > 0
    ? `<br><span style="color: orange">${
      i18next.t('singularity.toString.spentGQ', { spent: format(upgrade.goldenQuarksInvested, 0, true) })
    }</span>`
    : ''

  // QoL Text
  const qualityOfLifeText = upgrade.qualityOfLife
    ? `<br><span style="color: orchid">${i18next.t('general.alwaysEnabled')}</span>`
    : ''

  return `${nameHTML}<br>${levelText}${effectiveLevelText}<br>${descriptionHTML}<br>${minSingularityHTML}<br>${upgradeEffectHTML}<br>${costHTML}${investedGQHTML}${qualityOfLifeText}`
}

export function updateMobileGQHTML (k: SingularityDataKeys) {
  const elm = DOMCacheGetOrSet('goldenQuarkMultiline')
  elm.innerHTML = upgradeGQToString(k)

  // MOBILE ONLY - Add a button for buying upgrades
  if (isMobile) {
    const buttonDiv = document.createElement('div')

    const buyOne = document.createElement('button')
    const buyMax = document.createElement('button')

    buyOne.classList.add('modalBtnBuy')
    buyOne.textContent = i18next.t('general.buyOne')
    buyOne.addEventListener('click', (event: MouseEvent) => {
      buyGQUpgradeLevel(k, event, false)
      updateMobileGQHTML(k)
    })

    buyMax.classList.add('modalBtnBuy')
    buyMax.textContent = i18next.t('general.buyMax')
    buyMax.addEventListener('click', (event: MouseEvent) => {
      buyGQUpgradeLevel(k, event, true)
      updateMobileGQHTML(k)
    })

    buttonDiv.appendChild(buyOne)
    buttonDiv.appendChild(buyMax)
    elm.appendChild(buttonDiv)
  }
}

/**
 * Get the cost for upgrading once. Returns 0 if maxed.
 */
export function getGQUpgradeCostTNL (upgradeKey: SingularityDataKeys): number {
  const upgrade = goldenQuarkUpgrades[upgradeKey]
  let costMultiplier = 1

  if (computeGQUpgradeMaxLevel(upgradeKey) === upgrade.level) {
    return 0
  }

  // Overcap
  if (computeGQUpgradeMaxLevel(upgradeKey) > upgrade.maxLevel && upgrade.level >= upgrade.maxLevel) {
    costMultiplier *= Math.pow(4, upgrade.level - upgrade.maxLevel + 1)
  }

  if (upgrade.specialCostForm === 'Exponential2') {
    return (
      upgrade.costPerLevel * Math.sqrt(costMultiplier) * Math.pow(2, upgrade.level)
    )
  }

  if (upgrade.specialCostForm === 'Cubic') {
    return (
      upgrade.costPerLevel
      * costMultiplier
      * (Math.pow(upgrade.level + 1, 3) - Math.pow(upgrade.level, 3))
    )
  }

  if (upgrade.specialCostForm === 'Quadratic') {
    return (
      upgrade.costPerLevel
      * costMultiplier
      * (Math.pow(upgrade.level + 1, 2) - Math.pow(upgrade.level, 2))
    )
  }

  costMultiplier *= upgrade.maxLevel === -1 && upgrade.level >= 100 ? upgrade.level / 50 : 1
  costMultiplier *= upgrade.maxLevel === -1 && upgrade.level >= 400 ? upgrade.level / 100 : 1

  return computeGQUpgradeMaxLevel(upgradeKey) === upgrade.level
    ? 0
    : Math.ceil(upgrade.costPerLevel * (1 + upgrade.level) * costMultiplier)
}

/**
 * Buy levels for an upgrade
 */
export async function buyGQUpgradeLevel (
  upgradeKey: SingularityDataKeys,
  event: MouseEvent,
  buyMax = false
): Promise<void> {
  const upgrade = goldenQuarkUpgrades[upgradeKey]
  let purchased = 0
  let maxPurchasable = 1
  let GQBudget = player.goldenQuarks

  if (event.shiftKey || buyMax) {
    maxPurchasable = 100000000
    const buy = Number(
      await Prompt(
        i18next.t('singularity.goldenQuarks.spendPrompt', {
          gq: format(player.goldenQuarks, 0, true)
        })
      )
    )

    if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
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

  if (upgrade.maxLevel > 0) {
    maxPurchasable = Math.min(
      maxPurchasable,
      computeGQUpgradeMaxLevel(upgradeKey) - upgrade.level
    )
  }

  if (maxPurchasable === 0) {
    return Alert(i18next.t('singularity.goldenQuarks.hasUpgrade'))
  }

  if (player.highestSingularityCount < upgrade.minimumSingularity) {
    return Alert(i18next.t('singularity.goldenQuarks.notHighEnoughLevel'))
  }

  while (maxPurchasable > 0) {
    const cost = getGQUpgradeCostTNL(upgradeKey)
    if (player.goldenQuarks < cost || GQBudget < cost) {
      break
    } else {
      player.goldenQuarks -= cost
      upgrade.goldenQuarksInvested += cost
      GQBudget -= cost
      upgrade.level += 1
      purchased += 1
      maxPurchasable -= 1
    }

    // Special upgrade effects
    if (upgradeKey === 'oneMind') {
      player.ascensionCounter = 0
      player.ascensionCounterReal = 0
      player.ascensionCounterRealReal = 0
      void Alert(i18next.t('singularity.goldenQuarks.ascensionReset'))
    }

    if (upgradeKey === 'singCitadel2') {
      goldenQuarkUpgrades.singCitadel.freeLevel = upgrade.level
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

  updateSingularityPenalties()
  updateSingularityPerks()
  updateTokens()
  updateMaxTokens()
  revealStuff()
}

function computeFreeLevelMultiplier (): number {
  return getShopUpgradeEffects('shopSingularityPotency', 'freeUpgradeMult') + 0.3 / 100 * player.cubeUpgrades[75]
}

export function computeGQUpgradeFreeLevelSoftcap (upgradeKey: SingularityDataKeys): number {
  const upgrade = goldenQuarkUpgrades[upgradeKey]
  const freeLevelMult = computeFreeLevelMultiplier()
  const baseRealFreeLevels = freeLevelMult * upgrade.freeLevel
  return (
    Math.min(upgrade.level, baseRealFreeLevels)
    + Math.sqrt(Math.max(0, baseRealFreeLevels - upgrade.level))
  )
}

export function computeGQUpgradeMaxLevel (upgradeKey: SingularityDataKeys): number {
  const upgrade = goldenQuarkUpgrades[upgradeKey]
  if (!upgrade.canExceedCap) {
    return upgrade.maxLevel
  } else {
    let cap = upgrade.maxLevel
    for (const perk of overclockPerks) {
      if (player.highestSingularityCount >= perk) {
        cap += 1
      } else {
        break
      }
    }
    cap += getOcteractUpgradeEffect('octeractSingUpgradeCap', 'goldenQuarkUpgradeCapIncrease')
    return cap
  }
}

export function actualGQUpgradeTotalLevels (upgradeKey: SingularityDataKeys): number {
  const upgrade = goldenQuarkUpgrades[upgradeKey]

  if (
    (player.singularityChallenges.noSingularityUpgrades.enabled
      || player.singularityChallenges.sadisticPrequel.enabled)
    && !upgrade.qualityOfLife
  ) {
    return 0
  }

  if (
    (player.singularityChallenges.limitedAscensions.enabled || player.singularityChallenges.limitedTime.enabled
      || player.singularityChallenges.sadisticPrequel.enabled)
    && upgradeKey === 'platonicDelta'
  ) {
    return 0
  }

  const actualFreeLevels = computeGQUpgradeFreeLevelSoftcap(upgradeKey)
  const linearLevels = upgrade.level + actualFreeLevels
  let polynomialLevels = 0

  if (getOcteractUpgradeEffect('octeractImprovedFree', 'unlocked')) {
    let exponent = getOcteractUpgradeEffect('octeractImprovedFree', 'freeLevelPower')
    exponent += getOcteractUpgradeEffect('octeractImprovedFree2', 'freeLevelPowerIncrease')
    exponent += getOcteractUpgradeEffect('octeractImprovedFree3', 'freeLevelPowerIncrease')
    exponent += getOcteractUpgradeEffect('octeractImprovedFree4', 'freeLevelPowerIncrease')
    polynomialLevels = Math.pow(upgrade.level * actualFreeLevels, exponent)
  }

  return Math.max(linearLevels, polynomialLevels)
}

/**
 * Gets effect of a Golden Quark upgrade, using actualTotalLevels
 */
export const getGQUpgradeEffect = <
  T extends SingularityDataKeys,
  K extends keyof GoldenQuarkUpgradeRewards[T]
>(upgradeKey: T, key: K): GoldenQuarkUpgradeRewards[T][K] => {
  const upgrade = goldenQuarkUpgrades[upgradeKey]
  const totalLevels = actualGQUpgradeTotalLevels(upgradeKey)
  return upgrade.effect(totalLevels, key) as GoldenQuarkUpgradeRewards[T][K]
}

const currentSingularityText = () => i18next.t('singularity.perks.usesCurrentSing')

/**
 * Singularity Perks are automatically obtained and upgraded, based on player.singularityCount
 * They can have one or several levels with a description for each level
 */
interface SingularityPerk {
  readonly name: () => string
  readonly levels: number[]
  readonly description: (n: number, levels: number[]) => string
  readonly ID: string
}

// List of Singularity Perks based on player.highestSingularityCount
// The list is ordered on first level acquisition, so be careful when inserting a new one ;)
export const singularityPerks: SingularityPerk[] = [
  {
    name: () => {
      return i18next.t('singularity.perks.welcometoSingularity.name')
    },
    levels: [1],
    description: () => {
      return i18next.t('singularity.perks.welcometoSingularity.default')
    },
    ID: 'welcometoSingularity'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.unlimitedGrowth.name')
    },
    levels: [1],
    description: () => {
      return i18next.t('singularity.perks.unlimitedGrowth.default', {
        amount: format(10 * player.singularityCount)
      })
    },
    ID: 'unlimitedGrowth'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.goldenCoins.name')
    },
    levels: [1],
    description: () => {
      return i18next.t('singularity.perks.goldenCoins.default', {
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
      return i18next.t('singularity.perks.xyz.name')
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
      return i18next.t('singularity.perks.generousOrbs.name')
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
          return i18next.t('singularity.perks.generousOrbs.default', {
            amount: overfluxBonus[i]
          })
        }
      }
      return i18next.t('singularity.perks.generousOrbs.default', { amount: '215' })
    },
    ID: 'generousOrbs'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.researchDummies.name')
    },
    levels: [1, 11],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.researchDummies.hasLevel1')
      } else {
        return i18next.t('singularity.perks.researchDummies.default')
      }
    },
    ID: 'researchDummies'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.recycledContent.name')
    },
    levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    description: (n: number, _levels: number[]) => {
      const salvageBonus = Math.min(50, 5 * n)
      return i18next.t('singularity.perks.recycledContent.default', {
        amount: salvageBonus
      })
    },
    ID: 'recycledContent'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.antGodsCornucopia.name')
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
      return i18next.t('singularity.perks.bringToLife.name')
    },
    levels: [1, 9, 25, 49, 81, 121, 169, 196, 225, 256, 289],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i > 0; i--) {
        if (n >= levels[i]) {
          const effectText = i18next.t('singularity.perks.bringToLife.default', {
            amount: format(2 - 0.01 - i * 0.009, 3, true)
          })
          return `${effectText}<br><b>${currentSingularityText()}</b>`
        }
      }
      return i18next.t('singularity.perks.bringToLife.default', { amount: 2 })
    },
    ID: 'bringToLife'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.tokenInheritance.name')
    },
    levels: [2, 5, 10, 17, 26, 37, 50, 65, 82, 101, 220, 240, 260, 270, 277],
    description: (n: number, levels: number[]) => {
      for (let i = 15; i > 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.tokenInheritance.default', {
            amount: tokenInheritanceTokens[i]
          })
        }
      }
      return i18next.t('singularity.perks.tokenInheritance.default', { amount: 0 })
    },
    ID: 'tokenInheritance'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.sweepomatic.name')
    },
    levels: [2, 101],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.sweepomatic.hasLevel1')
      } else {
        return i18next.t('singularity.perks.sweepomatic.default')
      }
    },
    ID: 'sweepomatic'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.superStart.name')
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
      return i18next.t('singularity.perks.invigoratedSpirits.name')
    },
    levels: [2, 10, 26, 50, 82, 122, 170, 197, 226, 257, 290],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          const intro = i18next.t('singularity.perks.invigoratedSpirits.default')
          const line2 = i18next.t('singularity.perks.invigoratedSpirits.line2', {
            x: format(2 + 1.8 * i, 1, true)
          })
          const line3 = i18next.t('singularity.perks.invigoratedSpirits.line3', {
            x: format(0.1 + 0.09 * i, 2, true)
          })
          return `${intro}<br>${line2}<br>${line3}<br><b>${currentSingularityText()}</b>`
        }
      }
      return i18next.t('singularity.perks.invigoratedSpirits.default', { amount: 0 })
    },
    ID: 'invigoratedSpirits'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.eloBonus.name')
    },
    levels: [3, 11, 27, 51, 83, 123, 171, 198, 227, 258, 291],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          const effectText = i18next.t('singularity.perks.eloBonus.default', {
            amount: format(0.1 + 0.09 * i, 2, true)
          })
          return `${effectText}<br><b>${currentSingularityText()}</b>`
        }
      }
      return i18next.t('singularity.perks.eloBonus.default', { amount: 0 })
    },
    ID: 'eloBonus'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.notSoChallenging.name')
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
      return i18next.t('singularity.perks.autoCampaigns.name')
    },
    levels: [4],
    description: () => {
      return i18next.t('singularity.perks.autoCampaigns.default')
    },
    ID: 'autoCampaigns'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.automationUpgrades.name')
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
      return i18next.t('singularity.perks.evenMoreQuarks.name')
    },
    // dprint-ignore
    levels: [
      5, 7, 10, 20, 35, 50, 65, 80, 90, 100, 121, 144, 150, 160, 166, 169, 170,
      175, 180, 190, 196, 200, 201, 202, 203, 204, 205, 210, 213, 216, 219, 225,
      228, 231, 234, 237, 240, 244, 248, 252, 256, 260, 264, 268, 272, 276, 280,
      284, 288, 290
    ],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.evenMoreQuarks.default', {
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
      return i18next.t('singularity.perks.potionAutogenerator.name')
    },
    levels: [6],
    description: () => {
      return i18next.t('singularity.perks.potionAutogenerator.default')
    },
    ID: 'potionAutogenerator'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.persistentGlobalResets.name')
    },
    levels: [8],
    description: () => {
      return i18next.t('singularity.perks.persistentGlobalResets.default')
    },
    ID: 'persistentGlobalResets'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.shopSpecialOffer.name')
    },
    levels: [10, 50],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.shopSpecialOffer.hasLevel2')
      } else if (n >= levels[0]) {
        return i18next.t('singularity.perks.shopSpecialOffer.hasLevel1')
      } else {
        return i18next.t('singularity.perks.shopSpecialOffer.default')
      }
    },
    ID: 'shopSpecialOffer'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.forTheLoveOfTheAntGod.name')
    },
    levels: [10, 15, 20],
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
      return i18next.t('singularity.perks.itAllAddsUp.name')
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
          return i18next.t('singularity.perks.itAllAddsUp.default', {
            div: format(1 + (i + 1) / 5, 2, true)
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'itAllAddsUp'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.automagicalRunes.name')
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
      return i18next.t('singularity.perks.firstClearTokens.name')
    },
    levels: [16],
    description: () => {
      return i18next.t('singularity.perks.firstClearTokens.default')
    },
    ID: 'firstClearTokens'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.derpSmithsCornucopia.name')
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
          return i18next.t('singularity.perks.derpSmithsCornucopia.default', {
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
      return i18next.t('singularity.perks.eternalAscensions.name')
    },
    levels: [25],
    description: () => {
      return i18next.t('singularity.perks.eternalAscensions.default')
    },
    ID: 'eternalAscensions'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.exaltedAchievements.name')
    },
    levels: [25],
    description: () => {
      return i18next.t('singularity.perks.exaltedAchievements.default')
    },
    ID: 'exaltedAchievements'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.coolQOLCubes.name')
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
      return i18next.t('singularity.perks.infiniteRecycling.name')
    },
    levels: [30, 40, 61, 81, 111, 131, 161, 191, 236, 260],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          const salvage = 0.025 * (i + 1) * (runes.infiniteAscent.level + runes.infiniteAscent.freeLevels())
          return i18next.t('singularity.perks.infiniteRecycling.default', {
            salvage: format(salvage, 3, true)
          })
        }
      }
      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'infiniteRecycling'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.irishAnt.name')
    },
    levels: [35, 42, 49, 56, 63, 70, 77, 135, 142, 149, 156, 163, 170, 177],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          if (i >= 7) {
            return i18next.t('singularity.perks.irishAnt.default', { i: (6 * (i - 6)) + 35 })
          } else {
            return i18next.t('singularity.perks.irishAnt.default', { i: 5 * (i + 1) })
          }
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'irishAnt'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.bonusTokens.name')
    },
    levels: [41, 58, 113, 163, 229],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.bonusTokens.default', {
            amount: format(2 * (i + 1))
          })
        }
      }
      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'bonusTokens'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.immaculateAlchemy.name')
    },
    levels: [50],
    description: (_n: number, _levels: number[]) => {
      const multiplier = calculateImmaculateAlchemyBonus()
      return i18next.t('singularity.perks.immaculateAlchemy.default', {
        multiplier: format(multiplier, 2, true)
      })
    },
    ID: 'immaculateAlchemy'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.overclocked.name')
    },
    levels: [50, 60, 75, 100, 125, 150, 175, 200, 225, 250],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.overclocked.default', { i: i + 1 })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'overclocked'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.wowCubeAutomatedShipping.name')
    },
    levels: [50],
    description: () => {
      return i18next.t(
        'singularity.perks.wowCubeAutomatedShipping.default'
      )
    },
    ID: 'wowCubeAutomatedShipping'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.platonicClones.name')
    },
    levels: [50],
    description: () => {
      return i18next.t('singularity.perks.platonicClones.default')
    },
    ID: 'platonicClones'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.congealedblueberries.name')
    },
    levels: [64, 128, 192, 256, 270],
    description (n, levels) {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.congealedblueberries.default', {
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
      return i18next.t('singularity.perks.lastClearTokens.name')
    },
    levels: [69],
    description: () => {
      return i18next.t('singularity.perks.lastClearTokens.default')
    },
    ID: 'lastClearTokens'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.recyclistsDesktop.name')
    },
    levels: [75, 85, 105, 125, 155, 185, 215, 245, 260, 275],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.recyclistsDesktop.default', {
            i: i + 1
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'recyclistsDesktop'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.goldenRevolution.name')
    },
    levels: [100],
    description: () => {
      return i18next.t('singularity.perks.goldenRevolution.default', {
        current: format(Math.min(100, 0.4 * player.singularityCount), 1)
      })
    },
    ID: 'goldenRevolution'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.goldenRevolutionII.name')
    },
    levels: [100],
    description: () => {
      return i18next.t('singularity.perks.goldenRevolutionII.default', {
        current: format(Math.min(50, 0.2 * player.singularityCount), 1)
      })
    },
    ID: 'goldenRevolution2'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.goldenRevolutionIII.name')
    },
    levels: [100],
    description: () => {
      return i18next.t('singularity.perks.goldenRevolutionIII.default', {
        current: format(Math.min(500, 2 * player.singularityCount))
      })
    },
    ID: 'goldenRevolution3'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.irishAnt2.name')
    },
    levels: [100, 150, 200, 225, 250, 255, 260, 265, 269, 272],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.irishAnt2.default', {
            percent: i + 1
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'irishAnt2'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.platSigma.name')
    },
    levels: [125, 200],
    description: (n: number, levels: number[]) => {
      let counter = 0
      for (const singCount of levels) {
        if (n >= singCount) {
          counter += 0.125
        }
      }

      return i18next.t('singularity.perks.platSigma.default', {
        counter,
        current: format(Math.min(60, counter * player.singularityCount), 1)
      })
    },
    ID: 'platSigma'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.primalPower.name')
    },
    levels: [131, 269],
    description: (n: number, levels: number[]) => {
      if (n >= levels[1]) {
        return i18next.t('singularity.perks.primalPower.hasLevel1')
      } else {
        return i18next.t('singularity.perks.primalPower.default')
      }
    },
    ID: 'primalPower'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.midasMilleniumAgedGold.name')
    },
    levels: [150],
    description: () => {
      return i18next.t('singularity.perks.midasMilleniumAgedGold.default')
    },
    ID: 'midasMilleniumAgedGold'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.goldenRevolution4.name')
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

      return i18next.t('singularity.perks.goldenRevolution4.default', {
        gq: format(perSecond / divisor, 0, true)
      })
    },
    ID: 'goldenRevolution4'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.octeractMetagenesis.name')
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
      return i18next.t('singularity.perks.skrauQ.name')
    },
    levels: [200],
    description: () => {
      const amt = (player.singularityCount >= 200)
        ? format(Math.pow(1 + (player.singularityCount - 199) / 20, 2), 4)
        : format(1, 4)
      return i18next.t('singularity.perks.skrauQ.default', { amt })
    },
    ID: 'skrauQ'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.demeterHarvest.name')
    },
    levels: [230, 245, 260, 275, 290],
    description: (n: number, levels: number[]) => {
      for (let i = levels.length - 1; i >= 0; i--) {
        if (n >= levels[i]) {
          return i18next.t('singularity.perks.demeterHarvest.default', {
            i: i + 1
          })
        }
      }

      return i18next.t('singularity.perks.evenMoreQuarks.bug')
    },
    ID: 'demeterHarvest'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.permanentBenefaction.name')
    },
    levels: [244],
    description: () => {
      return i18next.t('singularity.perks.permanentBenefaction.default')
    },
    ID: 'permanentBenefaction'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.infiniteShopUpgrades.name')
    },
    levels: [250, 280],
    description: () => {
      if (player.highestSingularityCount < 280) {
        const effect = Math.floor(0.5 * (player.highestSingularityCount - 200))
        return i18next.t('singularity.perks.infiniteShopUpgrades.default', {
          amt: format(effect, 0, true)
        })
      } else {
        const effect = Math.floor(0.8 * (player.highestSingularityCount - 200))
        return i18next.t('singularity.perks.infiniteShopUpgrades.level2', {
          amt: format(effect, 0, true)
        })
      }
    },
    ID: 'infiniteShopUpgrades'
  },
  {
    name: () => {
      return i18next.t('singularity.perks.taxReduction.name')
    },
    levels: [281],
    description: () => {
      return i18next.t('singularity.perks.taxReduction.default', {
        amt: format(50, 0)
      })
    },
    ID: 'taxReduction'
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

interface ISingularityPerkDisplayInfo {
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
    const singTolerance = calculateMaxSingularityLookahead(true) - 1
    const perkId = DOMCacheGetOrSet(availablePerk.htmlID)
    perkId.style.display = ''
    DOMCacheGetOrSet('singularityPerksGrid').append(perkId)
    if (singularityCount - availablePerk.lastUpgraded <= singTolerance) { // Is new?
      perkId.classList.replace('oldPerk', 'newPerk')
    } else {
      perkId.classList.replace('newPerk', 'oldPerk')
    }
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

export const calculateMaxSingularityLookahead = (nonZero: boolean): number => {
  if (!nonZero) {
    return 0
  } else {
    let maxLookahead = 1
    maxLookahead += getGQUpgradeEffect('singFastForward', 'lookahead')
    maxLookahead += getGQUpgradeEffect('singFastForward2', 'lookahead')
    maxLookahead += getOcteractUpgradeEffect('octeractFastForward', 'lookahead')
    return maxLookahead
  }
}

export const getGoldenQuarkCost = (): {
  cost: number
  costReduction: number
} => {
  const cost = calculateGoldenQuarkCost()
  const baseCost = 10000

  return {
    cost: cost,
    costReduction: Math.max(0, baseCost - cost)
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
    buyAmount = maxBuy
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
      spent: format(buyAmount, 0, true),
      cost: format(cost, 0, true)
    })
  )
}

type SingularityDebuffs =
  | 'Offering'
  | 'Obtainium'
  | 'Salvage'
  | 'Global Speed'
  | 'Researches'
  | 'Ant ELO'
  | 'Ascension Speed'
  | 'Cubes'
  | 'Cube Upgrades'
  | 'Platonic Costs'
  | 'Hepteract Costs'

const calculateSingularityReductions = () => {
  return (
    getShopUpgradeEffects('shopSingularityPenaltyDebuff', 'singularityPenaltyReducers')
    + (player.insideSingularityChallenge
      ? getAmbrosiaUpgradeEffects('ambrosiaSingReduction2').singularityReduction
      : getAmbrosiaUpgradeEffects('ambrosiaSingReduction1').singularityReduction)
  )
}

export const calculateEffectiveSingularities = (
  singularityCount: number = player.singularityCount
): number => {
  let effectiveSingularities = singularityCount
  effectiveSingularities *= Math.min(4.75, (0.75 * singularityCount) / 10 + 1)

  effectiveSingularities *= calculateExalt4EffectiveSingularityMultiplier(
    player.singularityChallenges.noOcteracts.completions,
    false
  )

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

  if (
    player.singularityChallenges.taxmanLastStand.enabled
    && player.singularityChallenges.taxmanLastStand.completions >= 8
    && player.platonicUpgrades[15] === 0
  ) {
    effectiveSingularities = Math.pow(effectiveSingularities, 3 / 2)
  }

  return effectiveSingularities
}

const calculateNextSpike = (
  singularityCount: number = player.singularityCount
): number => {
  const penaltyDebuff = calculateSingularityReductions()

  for (const sing of singularityPenaltyThresholds) {
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
  if (singularityCount === 0 || runes.antiquities.level > 0) {
    return (debuff === 'Salvage' || debuff === 'Ant ELO') ? 0 : 1
  }

  const constitutiveSingularityCount = singularityCount - calculateSingularityReductions()
  if (constitutiveSingularityCount < 1) {
    return 1
  }

  const effectiveSingularities = calculateEffectiveSingularities(
    constitutiveSingularityCount
  )

  let baseDebuffMultiplier = 1
  baseDebuffMultiplier *= getShopUpgradeEffects('shopHorseShoe', 'singularityPenaltyMult')

  if (debuff === 'Offering') {
    const extraMult = Math.pow(1.02, constitutiveSingularityCount)
    return extraMult * baseDebuffMultiplier * (constitutiveSingularityCount < 150
      ? 3 * (Math.sqrt(effectiveSingularities) + 1)
      : Math.pow(effectiveSingularities, 2 / 3) / 400)
  } else if (debuff === 'Salvage') {
    return -(4 * constitutiveSingularityCount
      + 4 * Math.max(0, constitutiveSingularityCount - 100)
      + 4 * Math.max(0, constitutiveSingularityCount - 200)
      + 3 * Math.max(0, constitutiveSingularityCount - 250)
      + 3 * Math.max(0, constitutiveSingularityCount - 270)
      + 2 * Math.max(0, constitutiveSingularityCount - 280))
  } else if (debuff === 'Ant ELO') {
    return -Math.min(1, 0.001 * constitutiveSingularityCount)
  } else if (debuff === 'Global Speed') {
    return baseDebuffMultiplier * (1 + Math.sqrt(effectiveSingularities) / 4)
  } else if (debuff === 'Obtainium') {
    const extraMult = Math.pow(1.02, constitutiveSingularityCount)
    return extraMult * baseDebuffMultiplier * (constitutiveSingularityCount < 150
      ? 3 * (Math.sqrt(effectiveSingularities) + 1)
      : Math.pow(effectiveSingularities, 2 / 3) / 400)
  } else if (debuff === 'Researches') {
    return baseDebuffMultiplier * (1 + Math.sqrt(effectiveSingularities) / 2)
  } else if (debuff === 'Ascension Speed') {
    return baseDebuffMultiplier * (constitutiveSingularityCount < 150
      ? 1 + Math.sqrt(effectiveSingularities) / 5
      : 1 + Math.pow(effectiveSingularities, 0.75) / 10000)
  } else if (debuff === 'Cubes') {
    const extraMult = constitutiveSingularityCount > 100
      ? 2 * Math.pow(1.03, constitutiveSingularityCount - 100)
      : 2
    return baseDebuffMultiplier * (constitutiveSingularityCount < 150
      ? 3 * (1 + (Math.sqrt(effectiveSingularities) * extraMult) / 4)
      : 1 + (Math.pow(effectiveSingularities, 0.75) * extraMult) / 1000)
  } else if (debuff === 'Platonic Costs') {
    return baseDebuffMultiplier * (constitutiveSingularityCount > 36
      ? 1 + Math.pow(effectiveSingularities, 3 / 10) / 12
      : 1)
  } else if (debuff === 'Hepteract Costs') {
    return baseDebuffMultiplier * (constitutiveSingularityCount > 50
      ? 1 + Math.pow(effectiveSingularities, 11 / 50) / 25
      : 1)
  } else {
    // Cube upgrades
    return baseDebuffMultiplier * Math.cbrt(effectiveSingularities + 1)
  }
}

export const updateSingularityElevatorVisibility = (): void => {
  if (player.highestSingularityCount < 10) {
    DOMCacheGetOrSet('singularityElevator').style.display = 'none'
    DOMCacheGetOrSet('lockedSingularityElevator').style.display = ''
  } else {
    DOMCacheGetOrSet('singularityElevator').style.display = ''
    DOMCacheGetOrSet('lockedSingularityElevator').style.display = 'none'
  }
}

export const updateSingularityElevator = (): void => {
  const input = DOMCacheGetOrSet('elevatorTargetInput') as HTMLInputElement
  const description = DOMCacheGetOrSet('elevatorDescription')
  const teleportButton = DOMCacheGetOrSet('elevatorTeleportButton')
  const lock = DOMCacheGetOrSet('elevatorLockToggle') as HTMLInputElement
  const slowClimb = DOMCacheGetOrSet('elevatorSlowClimbToggle') as HTMLInputElement
  const slowClimbLabel = DOMCacheGetOrSet('elevatorSlowClimbLabel')
  const lockStatus = DOMCacheGetOrSet('elevatorLockStatus')

  const highestSingularity = DOMCacheGetOrSet('highestSingularity')
  const lookaheadDisplay = DOMCacheGetOrSet('lookahead')
  const maxLookahead = DOMCacheGetOrSet('maxLookahead')
  const extraLookahead = DOMCacheGetOrSet('extraLookahead')

  highestSingularity.innerHTML = i18next.t('singularity.elevator.highestSingularity', {
    num: player.highestSingularityCount
  })

  const canLookahead = runes.antiquities.level > 0
  let singLook = 0
  if (canLookahead) {
    const lookahead = calculateMaxSingularityLookahead(true)
    singLook = player.singularityCount + lookahead
  }

  const maxTarget = Math.max(1, player.highestSingularityCount, singLook, player.singularityCount - 1)

  const theoreticalLookahead = calculateMaxSingularityLookahead(true)

  lookaheadDisplay.innerHTML = i18next.t('singularity.elevator.lookahead')
  maxLookahead.innerHTML = i18next.t('singularity.elevator.maxLookahead', { num: theoreticalLookahead })
  extraLookahead.innerHTML = i18next.t('singularity.elevator.lookaheadExtra')

  if (input) {
    input.max = maxTarget.toString()
    input.value = player.singularityElevatorTarget.toString()
  }

  description.innerHTML = i18next.t('singularity.elevator.description', { limit: maxTarget })

  if (player.singularityElevatorTarget > player.singularityCount) {
    teleportButton.textContent = i18next.t('singularity.elevator.teleportButtonHigher')
  } else if (player.singularityElevatorTarget < player.singularityCount) {
    teleportButton.textContent = i18next.t('singularity.elevator.teleportButtonLower')
  } else {
    teleportButton.textContent = i18next.t('singularity.elevator.teleportButtonStay')
  }

  lock.checked = player.singularityElevatorLocked
  slowClimb.checked = player.singularityElevatorSlowClimb

  slowClimbLabel.style.display = player.singularityElevatorLocked ? 'none' : 'flex'

  if (player.singularityElevatorLocked) {
    lockStatus.innerHTML = i18next.t('singularity.elevator.lockEnabled', { target: player.singularityCount })
  } else {
    const introText = i18next.t('singularity.elevator.lockDisabledIntro')
    if (player.singularityElevatorSlowClimb) {
      lockStatus.innerHTML = `${introText}<br>${
        i18next.t('singularity.elevator.lockDisabledSing', { target: player.singularityCount + 1 })
      }`
    } else {
      const maxTarget2 = Math.max(player.singularityCount + theoreticalLookahead, player.highestSingularityCount)
      lockStatus.innerHTML = `${introText}<br>${
        i18next.t('singularity.elevator.lockDisabledSing', { target: maxTarget2 })
      }`
    }
  }
}

export const teleportToSingularity = async (): Promise<void> => {
  const target = player.singularityElevatorTarget

  const canLookahead = runes.antiquities.level > 0
  let singLook = 0
  if (canLookahead) {
    const lookahead = calculateMaxSingularityLookahead(true)
    singLook = player.singularityCount + lookahead
  }

  const maxTarget = Math.max(1, player.highestSingularityCount, singLook)

  // Just to prevent some bugs ahead of time. These should probably not be needed...

  if (target < 1 || target > maxTarget) {
    Alert(i18next.t('singularity.elevator.invalidTarget', { max: maxTarget }))
    return
  }
  if (!target) {
    Alert(i18next.t('singularity.elevator.noTarget'))
    return
  }
  if (player.insideSingularityChallenge) {
    Alert(i18next.t('singularity.elevator.inEXALTError'))
    return
  }

  const confirmed = await Confirm(i18next.t('singularity.elevator.confirmTeleport', { target }))
  if (confirmed) {
    if (player.singularityCount <= target) {
      const extraConfirm = await Confirm(i18next.t('singularity.elevator.confirmTeleportHigher'))
      if (extraConfirm) {
        const heldSingTime = player.singularityCounter
        const antiquitiesLevel = runes.antiquities.level
        // Reset
        singularity(target)
        if (antiquitiesLevel === 0) {
          player.singularityCounter = heldSingTime
        }
      } else {
        return
      }
    } else {
      player.singularityCount = target
    }

    // Update display
    updateSingularityElevator()
    Alert(i18next.t('singularity.elevator.teleportSuccess', { target }))
  }
}
