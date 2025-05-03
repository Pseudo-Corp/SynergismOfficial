import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateAllCubeMultiplier,
  calculateAmbrosiaAdditiveLuckMult,
  calculateAmbrosiaCubeMult,
  calculateAmbrosiaGenerationOcteractUpgrade,
  calculateAmbrosiaGenerationShopUpgrade,
  calculateAmbrosiaGenerationSingularityUpgrade,
  calculateAmbrosiaGenerationSpeed,
  calculateAmbrosiaGenerationSpeedRaw,
  calculateAmbrosiaLuck,
  calculateAmbrosiaLuckOcteractUpgrade,
  calculateAmbrosiaLuckRaw,
  calculateAmbrosiaLuckShopUpgrade,
  calculateAmbrosiaLuckSingularityUpgrade,
  calculateAmbrosiaQuarkMult,
  calculateAntSacrificeMultipliers,
  calculateAscensionScore,
  calculateAscensionSpeedExponentSpread,
  calculateAscensionSpeedMult,
  calculateBaseObtainium,
  calculateBaseOfferings,
  calculateBlueberryInventory,
  calculateCashGrabBlueberryBonus,
  calculateCashGrabCubeBonus,
  calculateCashGrabQuarkBonus,
  calculateCookieUpgrade29Luck,
  calculateCubeMultFromPowder,
  calculateCubeMultiplier,
  calculateDilatedFiveLeafBonus,
  calculateEffectiveIALevel,
  calculateEventBuff,
  calculateExalt6Penalty,
  calculateEXUltraCubeBonus,
  calculateEXUltraObtainiumBonus,
  calculateEXUltraOfferingBonus,
  calculateFreeShopInfinityUpgrades,
  calculateGlobalSpeedDREnabledMult,
  calculateGlobalSpeedDRIgnoreMult,
  calculateGlobalSpeedMult,
  calculateGoldenQuarkCost,
  calculateGoldenQuarks,
  calculateHepteractMultiplier,
  calculateHypercubeMultiplier,
  calculateLimitedAscensionsDebuff,
  calculateLuckConversion,
  calculateNumberOfThresholds,
  calculateObtainium,
  calculateObtainiumDecimal,
  calculateObtainiumDRIgnoreMult,
  calculateObtainiumPotionBaseObtainium,
  calculateOcteractMultiplier,
  calculateOfferingPotionBaseOfferings,
  calculateOfferings,
  calculateOfferingsDecimal,
  calculatePlatonicMultiplier,
  calculatePowderConversion,
  calculateQuarkMultFromPowder,
  calculateQuarkMultiplier,
  calculateRawAscensionSpeedMult,
  calculateRedAmbrosiaCubes,
  calculateRedAmbrosiaGenerationSpeed,
  calculateRedAmbrosiaLuck,
  calculateRedAmbrosiaObtainium,
  calculateRedAmbrosiaOffering,
  calculateSigmoid,
  calculateSingularityAmbrosiaLuckMilestoneBonus,
  calculateSingularityMilestoneBlueberries,
  calculateSingularityQuarkMilestoneMultiplier,
  calculateTesseractMultiplier,
  calculateTotalOcteractCubeBonus,
  calculateTotalOcteractObtainiumBonus,
  calculateTotalOcteractOfferingBonus,
  calculateTotalOcteractQuarkBonus,
  derpsmithCornucopiaBonus,
  isIARuneUnlocked,
  resetTimeThreshold,
  sumOfExaltCompletions
} from './Calculate'
import { formatAsPercentIncrease } from './Campaign'
import { CalcECC, type Challenge15Rewards, challenge15ScoreMultiplier } from './Challenges'
import { BuffType } from './Event'
import { hepteractEffective } from './Hepteracts'
import {
  addCodeBonuses,
  addCodeInterval,
  addCodeMaxUses,
  addCodeMaxUsesAdditive,
  addCodeSingularityPerkBonus,
  addCodeTimeToNextUse
} from './ImportExport'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getQuarkBonus } from './Quark'
import { getRedAmbrosiaUpgrade } from './RedAmbrosiaUpgrades'
import { shopData } from './Shop'
import { calculateSingularityDebuff, getFastForwardTotalMultiplier } from './singularity'
import { format, player } from './Synergism'
import type { GlobalVariables } from './types/Synergism'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'

export interface StatLine {
  i18n: string
  stat: () => number
  color?: string
  acc?: number
  displayCriterion?: () => boolean
}

export const allCubeStats: StatLine[] = [
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.CUBE_BUFF,
    color: 'gold'
  },
  {
    i18n: 'AscensionTime',
    stat: () =>
      Math.pow(Math.min(1, player.ascensionCounter / resetTimeThreshold()), 2)
      * (1
        + ((1 / 4) * player.achievements[204]
            + (1 / 4) * player.achievements[211]
            + (1 / 2) * player.achievements[218])
          * Math.max(0, player.ascensionCounter / resetTimeThreshold() - 1))
  },
  {
    i18n: 'CampaignTutorial',
    stat: () => player.campaigns.tutorialBonus.cubeBonus,
    displayCriterion: () => player.challengecompletions[11] > 0
  },
  {
    i18n: 'Campaign',
    stat: () => player.campaigns.cubeBonus,
    displayCriterion: () => player.challengecompletions[11] > 0
  },
  {
    i18n: 'SunMoon',
    stat: () =>
      1
      + (6 / 100) * player.achievements[250]
      + (10 / 100) * player.achievements[251],
    displayCriterion: () => player.challengecompletions[14] > 0
  },
  {
    i18n: 'SpeedAchievement',
    stat: () =>
      1
      + player.achievements[240]
        * Math.min(
          0.5,
          Math.max(
            0.1,
            (1 / 20) * Math.log10(calculateGlobalSpeedMult() + 0.01)
          )
        )
  },
  {
    i18n: 'Challenge15',
    stat: () =>
      G.challenge15Rewards.cube1.value
      * G.challenge15Rewards.cube2.value
      * G.challenge15Rewards.cube3.value
      * G.challenge15Rewards.cube4.value
      * G.challenge15Rewards.cube5.value,
    displayCriterion: () => player.challengecompletions[14] > 0
  },
  {
    i18n: 'InfiniteAscent',
    stat: () => 1 + (1 / 100) * calculateEffectiveIALevel()
  },
  {
    i18n: 'Beta',
    stat: () => 1 + player.platonicUpgrades[10],
    displayCriterion: () => player.challengecompletions[14] > 0
  },
  {
    i18n: 'Omega',
    stat: () => Math.pow(1.01, player.platonicUpgrades[15] * player.challengecompletions[9]),
    displayCriterion: () => player.challengecompletions[14] > 0
  },
  {
    i18n: 'Powder',
    stat: () => calculateCubeMultFromPowder(),
    displayCriterion: () => G.challenge15Rewards.hepteractsUnlocked.value > 0
  },
  {
    i18n: 'SingDebuff',
    stat: () => 1 / calculateSingularityDebuff('Cubes'),
    displayCriterion: () => player.highestSingularityCount > 0
  },
  {
    i18n: 'PassY',
    stat: () => 1 + (0.75 * player.shopUpgrades.seasonPassY) / 100,
    displayCriterion: () => player.highestSingularityCount > 0
  },
  {
    i18n: 'PassZ',
    stat: () => 1 + (player.shopUpgrades.seasonPassZ * player.singularityCount) / 100,
    displayCriterion: () => Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
  },
  {
    i18n: 'PassINF',
    stat: () => Math.pow(1.012, player.shopUpgrades.seasonPassInfinity + calculateFreeShopInfinityUpgrades())
  },
  {
    i18n: 'CashGrabUltra',
    stat: () => +calculateCashGrabCubeBonus()
  },
  {
    i18n: 'EXUltra',
    stat: () => +calculateEXUltraCubeBonus()
  },
  {
    i18n: 'StarterPack',
    stat: () => 1 + 4 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0)
  },
  {
    i18n: 'SingCubes1',
    stat: () => +player.singularityUpgrades.singCubes1.getEffect().bonus
  },
  {
    i18n: 'SingCubes2',
    stat: () => +player.singularityUpgrades.singCubes2.getEffect().bonus
  },
  {
    i18n: 'SingCubes3',
    stat: () => +player.singularityUpgrades.singCubes3.getEffect().bonus
  },
  {
    i18n: 'SingCitadel',
    stat: () => +player.singularityUpgrades.singCitadel.getEffect().bonus
  },
  {
    i18n: 'SingCitadel2',
    stat: () => +player.singularityUpgrades.singCitadel2.getEffect().bonus
  },
  {
    i18n: 'Delta',
    stat: () =>
      1 + +player.singularityUpgrades.platonicDelta.getEffect().bonus
        * Math.min(
          9,
          (player.shopUpgrades.shopSingularitySpeedup > 0)
            ? player.singularityCounter * 50 / (3600 * 24)
            : player.singularityCounter / (3600 * 24)
        )
  },
  {
    i18n: 'CookieUpgrade8',
    stat: () => 1 + 0.25 * +G.isEvent * player.cubeUpgrades[58]
  },
  {
    i18n: 'CookieUpgrade16',
    stat: () => 1 + 1 * player.cubeUpgrades[66] * (1 - player.platonicUpgrades[15])
  },
  {
    i18n: 'WowOcteract',
    stat: () => calculateTotalOcteractCubeBonus()
  },
  {
    i18n: 'NoSing',
    stat: () => +player.singularityChallenges.noSingularityUpgrades.rewards.cubes
  },
  {
    i18n: 'Ambrosia',
    stat: () => calculateAmbrosiaCubeMult()
  },
  {
    i18n: 'ModuleTutorial',
    stat: () => +player.blueberryUpgrades.ambrosiaTutorial.bonus.cubes
  },
  {
    i18n: 'ModuleCubes1',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes1.bonus.cubes
  },
  {
    i18n: 'ModuleLuckCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaLuckCube1.bonus.cubes
  },
  {
    i18n: 'ModuleQuarkCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarkCube1.bonus.cubes
  },
  {
    i18n: 'ModuleCubes2',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes2.bonus.cubes
  },
  {
    i18n: 'ModuleHyperflux',
    stat: () => +player.blueberryUpgrades.ambrosiaHyperflux.bonus.hyperFlux
  },
  {
    i18n: 'ModuleCubes3',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes3.bonus.cubes
  },
  {
    i18n: 'RedAmbrosiaTutorial',
    stat: () => getRedAmbrosiaUpgrade('tutorial').bonus.cubeMult
  },
  {
    i18n: 'RedAmbrosia',
    stat: () => calculateRedAmbrosiaCubes()
  },
  {
    i18n: 'Exalt6',
    stat: () => {
      let exaltPenalty = 1
      if (player.singularityChallenges.limitedTime.enabled) {
        const comps = player.singularityChallenges.limitedTime.completions
        const time = player.singChallengeTimer
        exaltPenalty = calculateExalt6Penalty(comps, time)
      }
      return exaltPenalty
    }
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Cubes),
    color: 'lime'
  }
]

export const allWowCubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(calculateAscensionScore().effectiveScore / 3000, 1 / 4.1)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass1',
    stat: () => 1 + (2.25 * player.shopUpgrades.seasonPass) / 100
  },
  {
    i18n: 'Researches',
    stat: () =>
      (1 + player.researches[119] / 400) // 5x19
      * (1 + player.researches[120] / 400) // 5x20
      * (1 + player.researches[137] / 100) // 6x12
      * (1 + (0.9 * player.researches[152]) / 100) // 7x2
      * (1 + (0.8 * player.researches[167]) / 100) // 7x17
      * (1 + (0.7 * player.researches[182]) / 100) // 8x7
      * (1
        + (0.03 / 100) * player.researches[192] * player.antUpgrades[12 - 1]!) // 8x17
      * (1 + (0.6 * player.researches[197]) / 100) // 8x22
  },
  {
    i18n: 'Research8x25',
    stat: () => 1 + (0.004 / 100) * player.researches[200]
  },
  {
    i18n: 'CubeUpgrades',
    stat: () =>
      (1 + player.cubeUpgrades[1] / 6) // 1x1
      * (1 + player.cubeUpgrades[11] / 11) // 2x1
      * (1 + 0.4 * player.cubeUpgrades[30]) // 3x10
  },
  {
    i18n: 'ConstantUpgrade10',
    stat: () =>
      1
      + 0.01
        * Decimal.log(player.ascendShards.add(1), 4)
        * Math.min(1, player.constantUpgrades[10])
  },
  {
    i18n: 'Achievement189',
    stat: () => 1 + player.achievements[189] * Math.min(2, player.ascensionCount / 2.5e8)
  },
  {
    i18n: 'Achievement193',
    stat: () =>
      1
      + (player.achievements[193] * Decimal.log(player.ascendShards.add(1), 10))
        / 400
  },
  {
    i18n: 'Achievement195',
    stat: () =>
      1
      + Math.min(
        250,
        (player.achievements[195]
          * Decimal.log(player.ascendShards.add(1), 10))
          / 400
      )
  },
  {
    i18n: 'Achievement198-201',
    stat: () =>
      1
      + (4 / 100)
        * (player.achievements[198]
          + player.achievements[199]
          + player.achievements[200])
      + (3 / 100) * player.achievements[201]
  },
  {
    i18n: 'Achievement254',
    stat: () =>
      1
      + Math.min(0.15, (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1))
        * player.achievements[254]
  },
  {
    i18n: 'SpiritPower',
    stat: () => 1 + player.corruptions.used.totalCorruptionDifficultyMultiplier * G.effectiveRuneSpiritPower[2]
  },
  {
    i18n: 'PlatonicOpening',
    stat: () => 1 + G.platonicBonusMultiplier[0]
  },
  {
    i18n: 'Platonic1x1',
    stat: () =>
      1
      + 0.00009
        * player.corruptions.used.totalLevels
        * player.platonicUpgrades[1]
  },
  {
    i18n: 'CookieUpgrade13',
    stat: () =>
      1 + Math.pow(1.03, Math.log10(Math.max(1, player.wowAbyssals))) * player.cubeUpgrades[63]
      - player.cubeUpgrades[63]
  }
]

export const allTesseractStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 1e5) / 1e4, 0.35)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass1',
    stat: () => 1 + (2.25 * player.shopUpgrades.seasonPass) / 100
  },
  {
    i18n: 'ConstantUpgrade10',
    stat: () => 1 + 0.01 * Decimal.log(player.ascendShards.add(1), 4) * Math.min(1, player.constantUpgrades[10])
  },
  {
    i18n: 'CubeUpgrade3x10',
    stat: () => 1 + 0.4 * player.cubeUpgrades[30]
  },
  {
    i18n: 'CubeUpgrade4x8',
    stat: () => 1 + (1 / 200) * player.cubeUpgrades[38] * player.corruptions.used.totalLevels
  },
  {
    i18n: 'Achievement195',
    stat: () =>
      1 + Math.min(
        250,
        (player.achievements[195] * Decimal.log(player.ascendShards.add(1), 10)) / 400
      )
  },
  {
    i18n: 'Achievement202',
    stat: () => 1 + player.achievements[202] * Math.min(2, player.ascensionCount / 5e8)
  },
  {
    i18n: 'Achievement205-208',
    stat: () =>
      1 + (4 / 100) * (
          player.achievements[205]
          + player.achievements[206]
          + player.achievements[207]
        )
      + (3 / 100) * player.achievements[208]
  },
  {
    i18n: 'Achievement255',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[255]
  },
  {
    i18n: 'PlatonicCube',
    stat: () => G.platonicBonusMultiplier[1]
  },
  {
    i18n: 'Platonic1x2',
    stat: () => 1 + 0.00018 * player.corruptions.used.totalLevels * player.platonicUpgrades[2]
  }
]

export const allHypercubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 1e9) / 1e8, 0.5)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass2',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass2) / 100
  },
  {
    i18n: 'Achievement212-215',
    stat: () =>
      1 + (4 / 100) * (
          player.achievements[212]
          + player.achievements[213]
          + player.achievements[214]
        )
      + (3 / 100) * player.achievements[215]
  },
  {
    i18n: 'Achievement216',
    stat: () => 1 + player.achievements[216] * Math.min(2, player.ascensionCount / 1e9)
  },
  {
    i18n: 'Achievement253',
    stat: () => 1 + (1 / 10) * player.achievements[253]
  },
  {
    i18n: 'Achievement256',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[256]
  },
  {
    i18n: 'Achievement265',
    stat: () => 1 + Math.min(2, player.ascensionCount / 2.5e10) * player.achievements[265]
  },
  {
    i18n: 'PlatonicCube',
    stat: () => G.platonicBonusMultiplier[2]
  },
  {
    i18n: 'Platonic1x3',
    stat: () => 1 + 0.00054 * player.corruptions.used.totalLevels * player.platonicUpgrades[3]
  },
  {
    i18n: 'HyperrealHepteract',
    stat: () => 1 + (0.6 / 1000) * hepteractEffective('hyperrealism')
  }
]

export const allPlatonicCubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 2.666e12) / 2.666e11, 0.75)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass2',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass2) / 100
  },
  {
    i18n: 'Achievement196',
    stat: () =>
      1 + Math.min(
        20,
        ((player.achievements[196] * 1) / 5000) * Decimal.log(player.ascendShards.add(1), 10)
      )
  },
  {
    i18n: 'Achievement219-222',
    stat: () =>
      1 + (4 / 100) * (
          player.achievements[219]
          + player.achievements[220]
          + player.achievements[221]
        )
      + (3 / 100) * player.achievements[222]
  },
  {
    i18n: 'Achievement223',
    stat: () => 1 + player.achievements[223] * Math.min(2, player.ascensionCount / 1.337e9)
  },
  {
    i18n: 'Achievement257',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[257]
  },
  {
    i18n: 'PlatonicCube',
    stat: () => G.platonicBonusMultiplier[3]
  },
  {
    i18n: 'Platonic1x4',
    stat: () => 1 + (1.2 * player.platonicUpgrades[4]) / 50
  }
]

export const allHepteractCubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 1.666e16) / 3.33e16, 0.85)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass3',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass3) / 100
  },
  {
    i18n: 'Achievement258',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[258]
  },
  {
    i18n: 'Achievement264',
    stat: () => 1 + Math.min(0.4, player.ascensionCount / 2e13) * player.achievements[264]
  },
  {
    i18n: 'Achievement265',
    stat: () => 1 + Math.min(0.2, player.ascensionCount / 8e14) * player.achievements[265]
  },
  {
    i18n: 'Achievement270',
    stat: () =>
      Math.min(
        2,
        1 + (1 / 1000000) * Decimal.log(player.ascendShards.add(1), 10) * player.achievements[270]
      )
  }
]

export const allOcteractCubeStats: StatLine[] = [
  {
    i18n: 'BasePerSecond',
    stat: () => 1 / (24 * 3600 * 365 * 1e15)
  },
  {
    i18n: 'AscensionScore',
    stat: () => {
      const SCOREREQ = 1e23
      const currentScore = calculateAscensionScore().effectiveScore
      return currentScore >= SCOREREQ ? currentScore / SCOREREQ : 0
    }
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.CUBE_BUFF,
    color: 'gold'
  },
  {
    i18n: 'Campaign',
    stat: () => player.campaigns.octeractBonus
  },
  {
    i18n: 'SeasonPass3',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass3) / 100
  },
  {
    i18n: 'SeasonPassY',
    stat: () => 1 + (0.75 * player.shopUpgrades.seasonPassY) / 100
  },
  {
    i18n: 'SeasonPassZ',
    stat: () => 1 + (player.shopUpgrades.seasonPassZ * player.singularityCount) / 100
  },
  {
    i18n: 'SeasonPassLost',
    stat: () => 1 + player.shopUpgrades.seasonPassLost / 1000
  },
  {
    i18n: 'CookieUpgrade20',
    stat: () => 1 + (+(player.corruptions.used.totalLevels >= 14 * 8) * player.cubeUpgrades[70]) / 10000
  },
  {
    i18n: 'DivinePack',
    stat: () => 1 + +(player.corruptions.used.totalLevels) * +player.singularityUpgrades.divinePack.getEffect().bonus
  },
  {
    i18n: 'SingCubes1',
    stat: () => +player.singularityUpgrades.singCubes1.getEffect().bonus
  },
  {
    i18n: 'SingCubes2',
    stat: () => +player.singularityUpgrades.singCubes2.getEffect().bonus
  },
  {
    i18n: 'SingCubes3',
    stat: () => +player.singularityUpgrades.singCubes3.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain',
    stat: () => +player.singularityUpgrades.singOcteractGain.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain2',
    stat: () => +player.singularityUpgrades.singOcteractGain2.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain3',
    stat: () => +player.singularityUpgrades.singOcteractGain3.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain4',
    stat: () => +player.singularityUpgrades.singOcteractGain4.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain5',
    stat: () => +player.singularityUpgrades.singOcteractGain5.getEffect().bonus
  },
  {
    i18n: 'PatreonBonus',
    stat: () => 1 + (getQuarkBonus() / 100) * +player.singularityUpgrades.singOcteractPatreonBonus.getEffect().bonus
  },
  {
    i18n: 'OcteractStarter',
    stat: () => 1 + 0.2 * +player.octeractUpgrades.octeractStarter.getEffect().bonus
  },
  {
    i18n: 'OcteractGain',
    stat: () => +player.octeractUpgrades.octeractGain.getEffect().bonus
  },
  {
    i18n: 'OcteractGain2',
    stat: () => +player.octeractUpgrades.octeractGain2.getEffect().bonus
  },
  {
    i18n: 'DerpsmithCornucopia',
    stat: () => derpsmithCornucopiaBonus()
  },
  {
    i18n: 'DigitalOcteractAccumulator',
    stat: () =>
      Math.pow(
        1 + +player.octeractUpgrades.octeractAscensionsOcteractGain.getEffect().bonus,
        1 + Math.floor(Math.log10(1 + player.ascensionCount))
      )
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Octeract)
  },
  {
    i18n: 'PlatonicDelta',
    stat: () =>
      1 + +player.singularityUpgrades.platonicDelta.getEffect().bonus
        * Math.min(
          9,
          (player.shopUpgrades.shopSingularitySpeedup > 0)
            ? player.singularityCounter * 50 / (3600 * 24)
            : player.singularityCounter / (3600 * 24)
        )
  },
  {
    i18n: 'NoSingUpgrades',
    stat: () => +player.singularityChallenges.noSingularityUpgrades.rewards.cubes
  },
  {
    i18n: 'PassINF',
    stat: () => Math.pow(1.012, (player.shopUpgrades.seasonPassInfinity + calculateFreeShopInfinityUpgrades()) * 1.25)
  },
  {
    i18n: 'Ambrosia',
    stat: () => calculateAmbrosiaCubeMult()
  },
  {
    i18n: 'ModuleTutorial',
    stat: () => +player.blueberryUpgrades.ambrosiaTutorial.bonus.cubes
  },
  {
    i18n: 'ModuleCubes1',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes1.bonus.cubes
  },
  {
    i18n: 'ModuleLuckCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaLuckCube1.bonus.cubes
  },
  {
    i18n: 'ModuleQuarkCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarkCube1.bonus.cubes
  },
  {
    i18n: 'ModuleCubes2',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes2.bonus.cubes
  },
  {
    i18n: 'ModuleCubes3',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes3.bonus.cubes
  },
  {
    i18n: 'RedAmbrosiaTutorial',
    stat: () => getRedAmbrosiaUpgrade('tutorial').bonus.cubeMult
  },
  {
    i18n: 'RedAmbrosia',
    stat: () => calculateRedAmbrosiaCubes()
  },
  {
    i18n: 'CashGrabUltra',
    stat: () => +calculateCashGrabCubeBonus()
  },
  {
    i18n: 'EXUltra',
    stat: () => +calculateEXUltraCubeBonus()
  },
  {
    i18n: 'AscensionSpeed',
    stat: () => {
      const ascensionSpeed = player.singularityUpgrades.oneMind.getEffect().bonus
        ? Math.pow(10, 1 / 2) * Math.pow(
          calculateAscensionSpeedMult() / 10,
          +player.octeractUpgrades.octeractOneMindImprover.getEffect().bonus
        )
        : Math.pow(calculateAscensionSpeedMult(), 1 / 2)
      return ascensionSpeed
    }
  }
]

export const allBaseOfferingStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 6 // Absolute Base
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.BASE_OFFERING_BUFF, // PseudoCoin Upgrade
    color: 'gold'
  },
  {
    i18n: 'Prestige',
    stat: () => player.prestigeCount > 0 ? 1 : 0 // Prestiged
  },
  {
    i18n: 'Transcend',
    stat: () => player.transcendCount > 0 ? 3 : 0 // Transcended
  },
  {
    i18n: 'Reincarnate',
    stat: () => player.reincarnationCount > 0 ? 5 : 0 // Reincarnated
  },
  {
    i18n: 'Achievements',
    stat: () =>
      Math.min(player.prestigecounter / 1800, 1)
      * ((player.achievements[37] > 0 ? 15 : 0)
        + (player.achievements[44] > 0 ? 15 : 0)
        + (player.achievements[52] > 0 ? 25 : 0)) // Achievements 37, 44, 52 (Based on Prestige Timer)
  },
  {
    i18n: 'Challenge1',
    stat: () => (player.challengecompletions[2] > 0) ? 2 : 0 // Challenge 2x1
  },
  {
    i18n: 'ShopPotionBonus',
    stat: () => calculateOfferingPotionBaseOfferings().amount // Potion Permanent Bonus
  },
  {
    i18n: 'ReincarnationUpgrade2',
    stat: () => (player.upgrades[62] > 0) ? Math.min(50, (1 / 50) * sumContents(player.challengecompletions)) : 0 // Reincarnation Upgrade 2
  },
  {
    i18n: 'Research1x24',
    stat: () => 0.4 * player.researches[24] // Research 1x24
  },
  {
    i18n: 'Research1x25',
    stat: () => 0.6 * player.researches[25] // Research 1x25
  },
  {
    i18n: 'Research4x20',
    stat: () => (player.researches[95] > 0) ? 15 : 0 // Research 4x20
  },
  {
    i18n: 'AmbrosiaBaseOffering1',
    stat: () => +player.blueberryUpgrades.ambrosiaBaseOffering1.bonus.offering // Ambrosia Base Offering 1
  },
  {
    i18n: 'AmbrosiaBaseOffering2',
    stat: () => +player.blueberryUpgrades.ambrosiaBaseOffering2.bonus.offering // Ambrosia Base Offering 2
  },
  {
    i18n: 'OfferingEX3',
    stat: () => Math.floor((player.shopUpgrades.offeringEX3 + calculateFreeShopInfinityUpgrades()) / 25) // Offering EX 3
  }
]

export const allOfferingStats = [
  {
    i18n: 'Base',
    stat: () => calculateBaseOfferings()
  },
  {
    i18n: 'PrestigeShards',
    stat: () => 1 + Math.pow(Decimal.log(player.prestigeShards.add(1), 10), 1 / 2) / 5 // Prestige Shards
  },
  {
    i18n: 'SuperiorIntellect',
    stat: () => 1 + (1 / 2000) * G.rune5level * G.effectiveLevelMult // Superior Intellect Rune
  },
  {
    i18n: 'ReincarnationChallenge',
    stat: () =>
      1 + 1 / 50 * CalcECC('reincarnation', player.challengecompletions[6])
      + 1 / 25 * CalcECC('reincarnation', player.challengecompletions[8])
      + 1 / 25 * CalcECC('reincarnation', player.challengecompletions[10]) // Reincarnation Challenges
  },
  {
    i18n: 'AlchemyAchievement5',
    stat: () => 1 + (10 * player.achievements[33]) / 100 // Alchemy Achievement 5
  },
  {
    i18n: 'AlchemyAchievement6',
    stat: () => 1 + (15 * player.achievements[34]) / 100 // Alchemy Achievement 6
  },
  {
    i18n: 'AlchemyAchievement7',
    stat: () => 1 + (25 * player.achievements[35]) / 100 // Alchemy Achievement 7
  },
  {
    i18n: 'DiamondUpgrade4x3',
    stat: () => 1 + (20 * player.upgrades[38]) / 100 // Diamond Upgrade 4x3
  },
  {
    i18n: 'ParticleUpgrade3x5',
    stat: () => 1 + player.upgrades[75] * 2 * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5)) // Particle Upgrade 3x5
  },
  {
    i18n: 'AutoOfferingShop',
    stat: () => 1 + (1 / 50) * player.shopUpgrades.offeringAuto // Auto Offering Shop
  },
  {
    i18n: 'OfferingEXShop',
    stat: () => 1 + (1 / 25) * player.shopUpgrades.offeringEX // Offering EX Shop
  },
  {
    i18n: 'CashGrab',
    stat: () => 1 + (1 / 100) * player.shopUpgrades.cashGrab // Cash Grab
  },
  {
    i18n: 'Research4x10',
    stat: () => 1 + (1 / 10000) * sumContents(player.challengecompletions) * player.researches[85] // Research 4x10
  },
  {
    i18n: 'AntUpgrade',
    stat: () => 1 + Math.pow(player.antUpgrades[6 - 1]! + G.bonusant6, 0.66) // Ant Upgrade
  },
  {
    i18n: 'Brutus',
    stat: () => G.cubeBonusMultiplier[3] // Brutus
  },
  {
    i18n: 'ConstantUpgrade3',
    stat: () => 1 + 0.02 * player.constantUpgrades[3] // Constant Upgrade 3
  },
  {
    i18n: 'ResearchTalismans',
    stat: () =>
      1 + 0.0003 * player.talismanLevels[3 - 1] * player.researches[149]
      + 0.0004 * player.talismanLevels[3 - 1] * player.researches[179] // Research 6x24,8x4
  },
  {
    i18n: 'TutorialBonus',
    stat: () => player.campaigns.tutorialBonus.offeringBonus // Tutorial Offering Bonus
  },
  {
    i18n: 'CampaignBonus',
    stat: () => player.campaigns.offeringBonus // Campaign Offering Bonus
  },
  {
    i18n: 'Challenge12',
    stat: () => 1 + 0.12 * CalcECC('ascension', player.challengecompletions[12]) // Challenge 12
  },
  {
    i18n: 'Research8x25',
    stat: () => 1 + (0.01 / 100) * player.researches[200] // Research 8x25
  },
  {
    i18n: 'AscensionAchievement',
    stat: () => 1 + Math.min(1, player.ascensionCount / 1e6) * player.achievements[187] // Ascension Count Achievement
  },
  {
    i18n: 'SunMoonAchievements',
    stat: () => 1 + 0.6 * player.achievements[250] + 1 * player.achievements[251] // Sun&Moon Achievements
  },
  {
    i18n: 'CubeUpgrade5x6',
    stat: () => 1 + 0.05 * player.cubeUpgrades[46] // Cube Upgrade 5x6
  },
  {
    i18n: 'CubeUpgrade5x10',
    stat: () => 1 + (0.02 / 100) * player.cubeUpgrades[50] // Cube Upgrade 5x10
  },
  {
    i18n: 'PlatonicALPHA',
    stat: () => 1 + player.platonicUpgrades[5] // Platonic ALPHA
  },
  {
    i18n: 'PlatonicBETA',
    stat: () => 1 + 2.5 * player.platonicUpgrades[10] // Platonic BETA
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => 1 + 5 * player.platonicUpgrades[15] // Platonic OMEGA
  },
  {
    i18n: 'Challenge15',
    stat: () => G.challenge15Rewards.offering.value // C15 Reward
  },
  {
    i18n: 'SingularityDebuff',
    stat: () => 1 / calculateSingularityDebuff('Offering'), // Singularity Debuff
    color: 'red'
  },
  {
    i18n: 'StarterPack',
    stat: () => 1 + 5 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0) // Starter Pack Upgrade
  },
  {
    i18n: 'OfferingCharge',
    stat: () => +player.singularityUpgrades.singOfferings1.getEffect().bonus // Offering Charge GQ Upgrade
  },
  {
    i18n: 'OfferingStorm',
    stat: () => +player.singularityUpgrades.singOfferings2.getEffect().bonus // Offering Storm GQ Upgrade
  },
  {
    i18n: 'OfferingTempest',
    stat: () => +player.singularityUpgrades.singOfferings3.getEffect().bonus // Offering Tempest GQ Upgrade
  },
  {
    i18n: 'Citadel',
    stat: () => +player.singularityUpgrades.singCitadel.getEffect().bonus // Citadel GQ Upgrade
  },
  {
    i18n: 'Citadel2',
    stat: () => +player.singularityUpgrades.singCitadel2.getEffect().bonus // Citadel 2 GQ Upgrade
  },
  {
    i18n: 'CubeUpgradeCx4',
    stat: () => 1 + player.cubeUpgrades[54] / 100 // Cube upgrade 6x4 (Cx4)
  },
  {
    i18n: 'CubeUpgradeCx12',
    stat: () => (player.cubeUpgrades[62] > 0 && player.currentChallenge.ascension === 15) ? 8 : 1 // Cube upgrade 7x2 (Cx12)
  },
  {
    i18n: 'OcteractElectrolosis',
    stat: () => +player.octeractUpgrades.octeractOfferings1.getEffect().bonus // Offering Electrolosis OC Upgrade
  },
  {
    i18n: 'OcteractBonus',
    stat: () => calculateTotalOcteractOfferingBonus() // Octeract Bonus
  },
  {
    i18n: 'Ambrosia',
    stat: () => 1 + 0.001 * +player.blueberryUpgrades.ambrosiaOffering1.bonus.offeringMult // Ambrosia!!
  },
  {
    i18n: 'RedAmbrosiaTutorial',
    stat: () => getRedAmbrosiaUpgrade('tutorial').bonus.offeringMult // Red Ambrosia Tutorial
  },
  {
    i18n: 'RedAmbrosia',
    stat: () => calculateRedAmbrosiaOffering() // Red Ambrosia
  },
  {
    i18n: 'CubeUpgradeCx22',
    stat: () => Math.pow(1.04, player.cubeUpgrades[72] * sumContents(player.talismanRarity)) // Cube upgrade 8x2 (Cx22)
  },
  {
    i18n: 'CashGrab2',
    stat: () => 1 + (1 / 200) * player.shopUpgrades.cashGrab2 // Cash Grab 2
  },
  {
    i18n: 'OfferingEX2',
    stat: () => 1 + (1 / 100) * player.shopUpgrades.offeringEX2 * player.singularityCount // Offering EX 2
  },
  {
    i18n: 'OfferingINF',
    stat: () => Math.pow(1.012, player.shopUpgrades.offeringEX3 + calculateFreeShopInfinityUpgrades()) // Offering INF
  },
  {
    i18n: 'EXUltra',
    stat: () => calculateEXUltraOfferingBonus() // EX Ultra Shop Upgrade
  },
  {
    i18n: 'Exalt6Penalty',
    stat: () =>
      (player.singularityChallenges.limitedTime.enabled)
        ? calculateExalt6Penalty(player.singularityChallenges.limitedTime.completions, player.singChallengeTimer)
        : 1, // Singularity Speedrun Penalty
    color: 'red'
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Offering), // Event
    color: 'lime'
  }
]

export const allQuarkStats: StatLine[] = [
  {
    i18n: 'AchievementPoints',
    stat: () => 1 + player.achievementPoints / 50000
  },
  {
    i18n: 'Achievement250',
    stat: () => player.achievements[250] > 0 ? 1.05 : 1
  },
  {
    i18n: 'Achievement251',
    stat: () => player.achievements[251] > 0 ? 1.05 : 1
  },
  {
    i18n: 'Achievement266',
    stat: () => player.achievements[266] > 0 ? 1 + Math.min(0.1, player.ascensionCount / 1e16) : 1
  },
  {
    i18n: 'PlatonicALPHA',
    stat: () => player.platonicUpgrades[5] > 0 ? 1.05 : 1
  },
  {
    i18n: 'PlatonicBETA',
    stat: () => player.platonicUpgrades[10] > 0 ? 1.1 : 1
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => player.platonicUpgrades[15] > 0 ? 1.15 : 1
  },
  {
    i18n: 'Challenge15',
    stat: () =>
      player.challenge15Exponent >= G.challenge15Rewards.quarks.requirement ? G.challenge15Rewards.quarks.value : 1
  },
  {
    i18n: 'CampaignBonus',
    stat: () => player.campaigns.quarkBonus
  },
  {
    i18n: 'InfiniteAscent',
    stat: () => isIARuneUnlocked() ? 1.1 + (5 / 1300) * calculateEffectiveIALevel() : 1
  },
  {
    i18n: 'QuarkHepteract',
    stat: () =>
      player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
        ? 1 + 5 / 10000 * hepteractEffective('quark')
        : 1
  },
  {
    i18n: 'Powder',
    stat: () => calculateQuarkMultFromPowder()
  },
  {
    i18n: 'SingularityCount',
    stat: () => 1 + player.singularityCount / 10
  },
  {
    i18n: 'CookieUpgrade3',
    stat: () => 1 + 0.001 * player.cubeUpgrades[53]
  },
  {
    i18n: 'CookieUpgrade18',
    stat: () => 1 + (1 / 10000) * player.cubeUpgrades[68] + 0.05 * Math.floor(player.cubeUpgrades[68] / 1000)
  },
  {
    i18n: 'SingularityMilestones',
    stat: () => calculateSingularityQuarkMilestoneMultiplier()
  },
  {
    i18n: 'OcteractQuarkBonus',
    stat: () => calculateTotalOcteractQuarkBonus()
  },
  {
    i18n: 'OcteractStarter',
    stat: () => +player.octeractUpgrades.octeractStarter.getEffect().bonus
  },
  {
    i18n: 'OcteractQuarkGain',
    stat: () => +player.octeractUpgrades.octeractQuarkGain.getEffect().bonus
  },
  {
    i18n: 'OcteractQuarkGain2',
    stat: () =>
      1
      + (1 / 10000) * Math.floor(player.octeractUpgrades.octeractQuarkGain.level / 111)
        * player.octeractUpgrades.octeractQuarkGain2.level
        * Math.floor(1 + Math.log10(Math.max(1, player.hepteractCrafts.quark.BAL)))
  },
  {
    i18n: 'SingularityPacks',
    stat: () =>
      1 + 0.02 * player.singularityUpgrades.intermediatePack.level
      + 0.04 * player.singularityUpgrades.advancedPack.level + 0.06 * player.singularityUpgrades.expertPack.level
      + 0.08 * player.singularityUpgrades.masterPack.level + 0.1 * player.singularityUpgrades.divinePack.level
  },
  {
    i18n: 'SingQuarkImprover1',
    stat: () => +player.singularityUpgrades.singQuarkImprover1.getEffect().bonus
  },
  {
    i18n: 'AmbrosiaQuarkMult',
    stat: () => calculateAmbrosiaQuarkMult()
  },
  {
    i18n: 'AmbrosiaTutorial',
    stat: () => +player.blueberryUpgrades.ambrosiaTutorial.bonus.quarks
  },
  {
    i18n: 'AmbrosiaQuarks1',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarks1.bonus.quarks
  },
  {
    i18n: 'AmbrosiaCubeQuark1',
    stat: () => +player.blueberryUpgrades.ambrosiaCubeQuark1.bonus.quarks
  },
  {
    i18n: 'AmbrosiaLuckQuark1',
    stat: () => +player.blueberryUpgrades.ambrosiaLuckQuark1.bonus.quarks
  },
  {
    i18n: 'AmbrosiaQuarks2',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarks2.bonus.quarks
  },
  {
    i18n: 'AmbrosiaQuarks3',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarks3.bonus.quarks
  },
  {
    i18n: 'Viscount',
    stat: () => getRedAmbrosiaUpgrade('viscount').bonus.quarkBonus,
    color: 'red'
  },
  {
    i18n: 'CashGrabQuarkBonus',
    stat: () => calculateCashGrabQuarkBonus()
  },
  {
    i18n: 'LimitedTimeChallenge',
    stat: () => +player.singularityChallenges.limitedTime.rewards.quarkMult
  },
  {
    i18n: 'SadisticPrequel',
    stat: () => +player.singularityChallenges.sadisticPrequel.rewards.quarkMult
  },
  {
    i18n: 'FirstSingularityBonus',
    stat: () => player.highestSingularityCount === 0 ? 1.25 : 1,
    color: 'cyan'
  },
  {
    i18n: 'Event',
    stat: () => G.isEvent ? 1 + calculateEventBuff(BuffType.Quark) + calculateEventBuff(BuffType.OneMind) : 1,
    color: 'lime'
  },
  {
    i18n: 'PatreonBonus',
    stat: () => 1 + getQuarkBonus() / 100,
    acc: 3,
    color: 'gold'
  }
]

export const allBaseObtainiumStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 1 // Absolute base value
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.BASE_OBTAINIUM_BUFF, // PseudoCoin Upgrade
    color: 'gold'
  },
  {
    i18n: 'Achievement51',
    stat: () => (player.achievements[51] > 0) ? 4 : 0 // Achievement 51
  },
  {
    i18n: 'ShopPotionBonus',
    stat: () => calculateObtainiumPotionBaseObtainium().amount // Potion Permanent Bonus
  },
  {
    i18n: 'Research3x13',
    stat: () => player.researches[63] // Research 3x13
  },
  {
    i18n: 'Research3x14',
    stat: () => 2 * player.researches[64] // Research 3x14
  },
  {
    i18n: 'FirstSingularity',
    stat: () => (player.highestSingularityCount > 0) ? 3 : 0 // First Singularity Perk
  },
  {
    i18n: 'SingularityCount',
    stat: () => Math.floor(player.singularityCount / 10) // Singularity Count
  },
  {
    i18n: 'AmbrosiaBaseObtainium1',
    stat: () => +player.blueberryUpgrades.ambrosiaBaseObtainium1.bonus.obtainium // Ambrosia Base Obtainium 1
  },
  {
    i18n: 'AmbrosiaBaseObtainium2',
    stat: () => +player.blueberryUpgrades.ambrosiaBaseObtainium2.bonus.obtainium // Ambrosia Base Obtainium 2
  }
]

export const allObtainiumIgnoreDRStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => calculateBaseObtainium() // Absolute Base
  },
  {
    i18n: 'CubeUpgrade4x2',
    stat: () => 1 + (4 / 100) * player.cubeUpgrades[42] // Cube Upgrade 4x2
  },
  {
    i18n: 'CubeUpgrade4x3',
    stat: () => 1 + (3 / 100) * player.cubeUpgrades[43] // Cube Upgrade 4x3
  },
  {
    i18n: 'TutorialBonus',
    stat: () => player.campaigns.tutorialBonus.obtainiumBonus // Campaign Tutorial Bonus
  },
  {
    i18n: 'CampaignBonus',
    stat: () => player.campaigns.obtainiumBonus // Campaign Obtainium Bonus
  },
  {
    i18n: 'PlatonicALPHA',
    stat: () => 1 + player.platonicUpgrades[5] // Platonic ALPHA
  },
  {
    i18n: 'PlatonicUpgrade9',
    stat: () => 1 + 1.5 * player.platonicUpgrades[9] // 9th Platonic Upgrade
  },
  {
    i18n: 'PlatonicBETA',
    stat: () => 1 + 2.5 * player.platonicUpgrades[10] // Platonic BETA
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => 1 + 5 * player.platonicUpgrades[15] // Platonic OMEGA
  },
  {
    i18n: 'CubeUpgradeCx5',
    stat: () => 1 + player.cubeUpgrades[55] / 100 // Cube Upgrade 6x5 (Cx5)
  },
  {
    i18n: 'CubeUpgradeCx12',
    stat: () => (player.cubeUpgrades[62] > 0 && player.currentChallenge.ascension === 15) ? 8 : 1, // Cube Upgrade 7x2 (Cx12)
    color: 'cyan'
  },
  {
    i18n: 'RedAmbrosiaTutorial',
    stat: () => getRedAmbrosiaUpgrade('tutorial').bonus.obtainiumMult // Red Ambrosia Tutorial
  },
  {
    i18n: 'RedAmbrosia',
    stat: () => calculateRedAmbrosiaObtainium() // Red Ambrosia
  },
  {
    i18n: 'CubeUpgradeCx21',
    stat: () => Math.pow(1.04, player.cubeUpgrades[71] * sumContents(player.talismanRarity)) // Cube Upgrade 8x1
  },
  {
    i18n: 'ObtainiumEX3',
    stat: () =>
      Math.pow(1.06, Math.floor((player.shopUpgrades.obtainiumEX3 + calculateFreeShopInfinityUpgrades()) / 25)) // Obtainium EX 3
  },
  {
    i18n: 'Exalt6Penalty',
    stat: () =>
      (player.singularityChallenges.limitedTime.enabled)
        ? calculateExalt6Penalty(player.singularityChallenges.limitedTime.completions, player.singChallengeTimer)
        : 1, // Singularity Challenge 6 Penalty
    color: 'red'
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Obtainium), // Event Buff
    color: 'lime'
  }
]

export const allObtainiumStats: StatLine[] = [
  {
    i18n: 'TranscendShards',
    stat: () => Math.pow(Decimal.log(player.transcendShards.add(1), 10) / 300, 2) // Transcend Shards
  },
  {
    i18n: 'ReincarnationUpgrade9',
    stat: () =>
      (player.upgrades[69] > 0)
        ? Math.min(10, Decimal.pow(Decimal.log(G.reincarnationPointGain.add(10), 10), 0.5).toNumber())
        : 1 // Reincarnation Upgrade 9
  },
  {
    i18n: 'ReincarnationUpgrade12',
    stat: () =>
      (player.upgrades[72] > 0) ? Math.min(50, 1 + 2 * sumContents(player.challengecompletions.slice(6, 11))) : 1 // Reincarnation Upgrade 12
  },
  {
    i18n: 'ReincarnationUpgrade14',
    stat: () => (player.upgrades[74] > 0) ? 1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5)) : 1 // Reincarnation Upgrade 14
  },
  {
    i18n: 'Research3x15',
    stat: () => 1 + player.researches[65] / 5 // Research 3x15
  },
  {
    i18n: 'Research4x1',
    stat: () => 1 + player.researches[76] / 10 // Research 4x1
  },
  {
    i18n: 'Research4x6',
    stat: () => 1 + player.researches[81] / 10 // Research 4x6
  },
  {
    i18n: 'ShopObtainiumAuto',
    stat: () => 1 + player.shopUpgrades.obtainiumAuto / 50 // Shop Upgrade Auto Obtainium
  },
  {
    i18n: 'ShopCashGrab',
    stat: () => 1 + player.shopUpgrades.cashGrab / 100 // Shop Upgrade Cash Grab
  },
  {
    i18n: 'ShopObtainiumEX',
    stat: () => 1 + player.shopUpgrades.obtainiumEX / 25 // Shop Upgrade Obtainium EX
  },
  {
    i18n: 'Rune5',
    stat: () =>
      1
      + (G.rune5level / 200) * G.effectiveLevelMult
        * (1
          + (player.researches[84] / 200)
            * (1 + G.effectiveRuneSpiritPower[5] * player.corruptions.used.totalCorruptionDifficultyMultiplier)) // Rune 5
  },
  {
    i18n: 'ChallengeAchievements',
    stat: () =>
      1 + 0.01 * player.achievements[84] + 0.03 * player.achievements[91] + 0.05 * player.achievements[98]
      + 0.07 * player.achievements[105] + 0.09 * player.achievements[112] + 0.11 * player.achievements[119]
      + 0.13 * player.achievements[126] + 0.15 * player.achievements[133] + 0.17 * player.achievements[140]
      + 0.19 * player.achievements[147] // Challenge Achievements
  },
  {
    i18n: 'Ant10',
    stat: () => 1 + 2 * Math.pow((player.antUpgrades[10 - 1]! + G.bonusant10) / 50, 2 / 3) // Ant 10
  },
  {
    i18n: 'Achievement53',
    stat: () => (player.achievements[53] > 0) ? 1 + G.runeSum / 800 : 1 // Achievement 53
  },
  {
    i18n: 'Achievement128',
    stat: () => (player.achievements[128] > 0) ? 1.5 : 1 // Achievement 128
  },
  {
    i18n: 'Achievement129',
    stat: () => (player.achievements[129] > 0) ? 1.25 : 1 // Achievement 129
  },
  {
    i18n: 'Achievement188',
    stat: () => (player.achievements[188] > 0) ? 1 + Math.min(2, player.ascensionCount / 5e6) : 1 // Achievement 188
  },
  {
    i18n: 'Achievement250_251',
    stat: () => 1 + 0.6 * player.achievements[250] + player.achievements[251] // Achievement 250, 251
  },
  {
    i18n: 'CubeBonus',
    stat: () => G.cubeBonusMultiplier[5] // Cube Bonus
  },
  {
    i18n: 'ConstantUpgrade4',
    stat: () => 1 + 0.04 * player.constantUpgrades[4] // Constant Upgrade
  },
  {
    i18n: 'CubeUpgrade1x3',
    stat: () => 1 + 0.1 * player.cubeUpgrades[3] // Cube Upgrade 1x3
  },
  {
    i18n: 'CubeUpgrade4x7',
    stat: () => 1 + 0.1 * player.cubeUpgrades[47] // Cube Upgrade 4x7
  },
  {
    i18n: 'Challenge12',
    stat: () => 1 + 0.5 * CalcECC('ascension', player.challengecompletions[12]) // Challenge 12
  },
  {
    i18n: 'SpiritPower',
    stat: () => 1 + player.corruptions.used.totalCorruptionDifficultyMultiplier * G.effectiveRuneSpiritPower[4] // 4th Spirit
  },
  {
    i18n: 'Research6x19',
    stat: () => 1 + ((0.03 * Math.log(player.uncommonFragments + 1)) / Math.log(4)) * player.researches[144] // Research 6x19
  },
  {
    i18n: 'CubeUpgrade5x10',
    stat: () => 1 + 0.0002 * player.cubeUpgrades[50] // Cube Upgrade 5x10
  },
  {
    i18n: 'StarterPack',
    stat: () => 1 + 5 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0) // Starter Pack
  },
  {
    i18n: 'SingObtainium1',
    stat: () => +player.singularityUpgrades.singObtainium1.getEffect().bonus // Obtainium GQ Upgrade 1
  },
  {
    i18n: 'SingObtainium2',
    stat: () => +player.singularityUpgrades.singObtainium2.getEffect().bonus // Obtainium GQ Upgrade 2
  },
  {
    i18n: 'SingObtainium3',
    stat: () => +player.singularityUpgrades.singObtainium3.getEffect().bonus // Obtainium GQ Upgrade 3
  },
  {
    i18n: 'SingCitadel',
    stat: () => +player.singularityUpgrades.singCitadel.getEffect().bonus // Singularity Citadel 1
  },
  {
    i18n: 'SingCitadel2',
    stat: () => +player.singularityUpgrades.singCitadel2.getEffect().bonus // Singularity Citadel 2
  },
  {
    i18n: 'ShopCashGrab2',
    stat: () => 1 + (1 / 200) * player.shopUpgrades.cashGrab2 // Cash Grab 2 Shop Upgrade
  },
  {
    i18n: 'ShopObtainiumEX2',
    stat: () => 1 + (1 / 100) * player.shopUpgrades.obtainiumEX2 * player.singularityCount // Obtainium EX 2 Shop Upgrade
  },
  {
    i18n: 'ShopObtainiumEX3',
    stat: () => Math.pow(1.012, player.shopUpgrades.obtainiumEX3 + calculateFreeShopInfinityUpgrades()) // Obtainium EX 3 Shop Upgrade
  },
  {
    i18n: 'OcteractBonus',
    stat: () => calculateTotalOcteractObtainiumBonus() // Octeract Obtainium Bonus
  },
  {
    i18n: 'OcteractObtainium1',
    stat: () => +player.octeractUpgrades.octeractObtainium1.getEffect().bonus // Octeract Obtainium 1
  },
  {
    i18n: 'AmbrosiaObtainium1',
    stat: () => 1 + 0.001 * +player.blueberryUpgrades.ambrosiaObtainium1.bonus.obtainiumMult // Ambrosia Obtainium 1
  },
  {
    i18n: 'EXUltraObtainium',
    stat: () => calculateEXUltraObtainiumBonus() // EX Ultra Obtainium Bonus
  },
  {
    i18n: 'Challenge14',
    stat: () => (player.currentChallenge.ascension === 14) ? 0 : 1, // Challenge 14: No Obtainium
    color: 'red'
  },
  {
    i18n: 'SingularityDebuff',
    stat: () => 1 / calculateSingularityDebuff('Obtainium'), // Singularity Debuff
    color: 'red'
  }
]

// For use in displaying the second half of Obtainium Multiplier Stats
export const obtainiumDR: StatLine[] = [
  {
    i18n: 'ObtainiumDR',
    stat: () => player.corruptions.used.corruptionEffects('illiteracy'),
    color: 'orange'
  },
  {
    i18n: 'ImmaculateObtainium',
    stat: () => calculateObtainiumDRIgnoreMult()
  }
]

// Ditto (This is used in the display as well as the calculation for total Obtainium / Offerings. Append this to the end of obtainiumDR in displays)
export const offeringObtainiumTimeModifiers = (time: number, timeMultCheck: boolean): StatLine[] => {
  return [
    {
      i18n: 'ThresholdPenalty',
      stat: () => Math.min(1, Math.pow(time / resetTimeThreshold(), 2)),
      color: 'red'
    },
    {
      i18n: 'TimeMultiplier',
      stat: () => timeMultCheck ? Math.max(1, time / resetTimeThreshold()) : 1
    },
    {
      i18n: 'HalfMind',
      stat: () => (player.singularityUpgrades.halfMind.getEffect().bonus) ? calculateGlobalSpeedMult() / 10 : 1
    }
  ]
}

export const antSacrificeRewardStats: StatLine[] = [
  {
    i18n: 'AntUpgrade11',
    stat: () => 1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11 - 1]! + G.bonusant11) / 125))
  },
  {
    i18n: 'Research103',
    stat: () => 1 + player.researches[103] / 20
  },
  {
    i18n: 'Research104',
    stat: () => 1 + player.researches[104] / 20
  },
  {
    i18n: 'Achievement132',
    stat: () => player.achievements[132] === 1 ? 1.25 : 1
  },
  {
    i18n: 'Achievement137',
    stat: () => player.achievements[137] === 1 ? 1.25 : 1
  },
  {
    i18n: 'RuneBlessing',
    stat: () => 1 + (20 / 3) * G.effectiveRuneBlessingPower[3]
  },
  {
    i18n: 'Challenge10',
    stat: () => 1 + (1 / 50) * CalcECC('reincarnation', player.challengecompletions[10])
  },
  {
    i18n: 'Research122',
    stat: () => 1 + (1 / 50) * player.researches[122]
  },
  {
    i18n: 'Research133',
    stat: () => 1 + (3 / 100) * player.researches[133]
  },
  {
    i18n: 'Research163',
    stat: () => 1 + (2 / 100) * player.researches[163]
  },
  {
    i18n: 'Research193',
    stat: () => 1 + (1 / 100) * player.researches[193]
  },
  {
    i18n: 'ParticleUpgrade4x4',
    stat: () => 1 + (1 / 10) * player.upgrades[79]
  },
  {
    i18n: 'AcceleratorBoostUpgrade',
    stat: () => 1 + (1 / 4) * player.upgrades[40]
  },
  {
    i18n: 'CubeBlessingAres',
    stat: () => G.cubeBonusMultiplier[7]
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.AntSacrifice),
    color: 'lime'
  }
]

export const antSacrificeTimeStats = (time: number, timeMultCheck: boolean): StatLine[] => {
  return [
    {
      i18n: 'NoAchievement177',
      stat: () =>
        player.achievements[177] === 0
          ? Math.min(
            1000,
            Math.max(1, player.antSacrificeTimer / resetTimeThreshold())
          )
          : 1
    },
    {
      i18n: 'ThresholdPenalty',
      stat: () => Math.min(1, Math.pow(time / resetTimeThreshold(), 2)),
      color: 'red'
    },
    {
      i18n: 'TimeMultiplier',
      stat: () => timeMultCheck ? Math.max(1, time / resetTimeThreshold()) : 1
    },
    {
      i18n: 'HalfMind',
      stat: () => (player.singularityUpgrades.halfMind.getEffect().bonus) ? calculateGlobalSpeedMult() / 10 : 1
    }
  ]
}

// Add a stat to this if you do not want the multiplier to be affected by >100 or <1 Diminishing Returns
export const allGlobalSpeedIgnoreDRStats: StatLine[] = [
  {
    i18n: 'ChronosStatue',
    stat: () => G.platonicBonusMultiplier[7] // Chronos statue
  },
  {
    i18n: 'SingularityDebuff',
    stat: () => 1.0 / calculateSingularityDebuff('Global Speed'),
    color: 'red'
  },
  {
    i18n: 'IntermediatePack',
    stat: () => 1 + (player.singularityUpgrades.intermediatePack.getEffect().bonus ? 1 : 0) // Intermediate Pack
  },
  {
    i18n: 'OcteractGlobalSpeed',
    stat: () => 1 + +player.octeractUpgrades.octeractImprovedGlobalSpeed.getEffect().bonus * player.singularityCount // Oct Improved Global Speed
  },
  {
    i18n: 'LimitedTimeChallenge',
    stat: () => 1 + +player.singularityChallenges.limitedTime.rewards.globalSpeed // Limited Time Challenge
  },
  {
    i18n: 'ChronometerShop',
    stat: () => Math.max(Math.pow(1.01, (player.singularityCount - 200) * player.shopUpgrades.shopChronometerS), 1) // Limited Time Upg Accels
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.GlobalSpeed), // Event
    color: 'lime'
  }
]

export const allGlobalSpeedStats: StatLine[] = [
  {
    i18n: 'ObtainiumLog',
    stat: () => 1 + (1 / 300) * Math.log10(player.maxobtainium + 1) * player.upgrades[70] // Particle upgrade 2x5
  },
  {
    i18n: 'Research5x21',
    stat: () => 1 + player.researches[121] / 50 // research 5x21
  },
  {
    i18n: 'Research6x11',
    stat: () => 1 + 0.015 * player.researches[136] // research 6x11
  },
  {
    i18n: 'Research7x1',
    stat: () => 1 + 0.012 * player.researches[151] // research 7x1
  },
  {
    i18n: 'Research7x16',
    stat: () => 1 + 0.009 * player.researches[166] // research 7x16
  },
  {
    i18n: 'Research8x6',
    stat: () => 1 + 0.006 * player.researches[181] // research 8x6
  },
  {
    i18n: 'Research8x21',
    stat: () => 1 + 0.003 * player.researches[196] // research 8x21
  },
  {
    i18n: 'SpeedBlessing',
    stat: () => 1 + 8 * G.effectiveRuneBlessingPower[1] // speed blessing
  },
  {
    i18n: 'SpeedSpirit',
    stat: () => 1 + player.corruptions.used.totalCorruptionDifficultyMultiplier * G.effectiveRuneSpiritPower[1] // speed SPIRIT
  },
  {
    i18n: 'ChronosCube',
    stat: () => G.cubeBonusMultiplier[10] // Chronos cube blessing
  },
  {
    i18n: 'CubeUpgrade2x8',
    stat: () => 1 + player.cubeUpgrades[18] / 5 // cube upgrade 2x8
  },
  {
    i18n: 'Ant12',
    stat: () => calculateSigmoid(2, player.antUpgrades[12 - 1]! + G.bonusant12, 69) // ant 12
  },
  {
    i18n: 'ChronosTalisman',
    stat: () => 1 + 0.1 * (player.talismanRarity[2 - 1] - 1) // Chronos Talisman bonus
  },
  {
    i18n: 'Challenge15',
    stat: () => G.challenge15Rewards.globalSpeed.value // Challenge 15 reward
  },
  {
    i18n: 'CubeUpgradeCx2',
    stat: () => 1 + 0.01 * player.cubeUpgrades[52] // cube upgrade 6x2 (Cx2)
  },
  {
    i18n: 'SpacialDilation',
    stat: () => player.corruptions.used.corruptionEffects('dilation'), // Spacial Dilation
    color: 'red'
  }
]

// Use in the second part of the Stats for Nerds for Global Speed
export const allGlobalSpeedDRStats: StatLine[] = [
  {
    i18n: 'FastSpeedDR',
    stat: () => 0.5
  },
  {
    i18n: 'SlowSpeedDR',
    stat: () => 1 - player.platonicUpgrades[7] / 30
  },
  {
    i18n: 'ImmaculateSpeedMult',
    stat: () => calculateGlobalSpeedDRIgnoreMult()
  }
]

export const allAscensionSpeedStats: StatLine[] = [
  {
    i18n: 'Chronometer',
    stat: () => 1 + (1.2 / 100) * player.shopUpgrades.chronometer // Chronometer
  },
  {
    i18n: 'Chronometer2',
    stat: () => 1 + (0.6 / 100) * player.shopUpgrades.chronometer2 // Chronometer 2
  },
  {
    i18n: 'Chronometer3',
    stat: () => 1 + (1.5 / 100) * player.shopUpgrades.chronometer3 // Chronometer 3
  },
  {
    i18n: 'ChronosHepteract',
    stat: () => 1 + (0.6 / 1000) * hepteractEffective('chronos') // Chronos Hepteract
  },
  {
    i18n: 'Achievement262',
    stat: () => 1 + Math.min(0.1, (1 / 100) * Math.log10(player.ascensionCount + 1)) * player.achievements[262] // Achievement 262 Bonus
  },
  {
    i18n: 'Achievement263',
    stat: () => 1 + Math.min(0.1, (1 / 100) * Math.log10(player.ascensionCount + 1)) * player.achievements[263] // Achievement 263 Bonus
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => 1 + 0.002 * player.corruptions.used.totalLevels * player.platonicUpgrades[15] // Platonic Omega
  },
  {
    i18n: 'Challenge15',
    stat: () => G.challenge15Rewards.ascensionSpeed.value // Challenge 15 Reward
  },
  {
    i18n: 'CookieUpgrade9',
    stat: () => 1 + (1 / 400) * player.cubeUpgrades[59] // Cookie Upgrade 9
  },
  {
    i18n: 'IntermediatePack',
    stat: () => 1 + 0.5 * (player.singularityUpgrades.intermediatePack.getEffect().bonus ? 1 : 0) // Intermediate Pack, Sing Shop
  },
  {
    i18n: 'ChronometerZ',
    stat: () => 1 + (1 / 1000) * player.singularityCount * player.shopUpgrades.chronometerZ // Chronometer Z
  },
  {
    i18n: 'AbstractPhotokinetics',
    stat: () => 1 + +player.octeractUpgrades.octeractImprovedAscensionSpeed.getEffect().bonus * player.singularityCount // Abstract Photokinetics, Oct Upg
  },
  {
    i18n: 'AbstractExokinetics',
    stat: () => 1 + +player.octeractUpgrades.octeractImprovedAscensionSpeed2.getEffect().bonus * player.singularityCount // Abstract Exokinetics, Oct Upg
  },
  {
    i18n: 'ChronometerINF',
    stat: () => Math.pow(1.006, player.shopUpgrades.chronometerInfinity + calculateFreeShopInfinityUpgrades()) // Chronometer INF
  },
  {
    i18n: 'LimitedAscensionsBuff',
    stat: () =>
      Math.pow(
        1 + +player.singularityChallenges.limitedAscensions.rewards.ascensionSpeedMult,
        1 + Math.max(0, Math.floor(Math.log10(player.ascensionCount)))
      ) // EXALT Buff
  },
  {
    i18n: 'LimitedTimeChallenge',
    stat: () => 1 + +player.singularityChallenges.limitedTime.rewards.ascensionSpeed // Limited Time Challenge
  },
  {
    i18n: 'ChronometerS',
    stat: () => Math.max(Math.pow(1.01, (player.singularityCount - 200) * player.shopUpgrades.shopChronometerS), 1) // Limited Time Upg Accels
  },
  {
    i18n: 'LimitedAscensionsDebuff',
    stat: () => 1 / calculateLimitedAscensionsDebuff(), // EXALT Debuff
    color: 'red'
  },
  {
    i18n: 'SingularityDebuff',
    stat: () => 1 / calculateSingularityDebuff('Ascension Speed'),
    color: 'red'
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.AscensionSpeed), // Event
    color: 'lime'
  }
]

export const allAscensionSpeedPowerStats: StatLine[] = [
  {
    i18n: 'ExponentialScalingSlow',
    stat: () => 1 - calculateAscensionSpeedExponentSpread(),
    acc: 3
  },
  {
    i18n: 'ExponentialScalingFast',
    stat: () => 1 + calculateAscensionSpeedExponentSpread(),
    acc: 3
  }
]

export const allAdditiveLuckMultStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 1 // Base value of 1.00
  },
  {
    i18n: 'NoSingularityUpgrades',
    stat: () => +player.singularityChallenges.noSingularityUpgrades.rewards.luckBonus // No Singularity Upgrade 1x30
  },
  {
    i18n: 'DilatedFiveLeaf',
    stat: () => calculateDilatedFiveLeafBonus() // Dilated Five Leaf Clover Perk
  },
  {
    i18n: 'ShopUpgrade',
    stat: () => player.shopUpgrades.shopAmbrosiaLuckMultiplier4 / 100 // EXALT-unlocked shop upgrade
  },
  {
    i18n: 'NoAmbrosiaUpgrades',
    stat: () => +player.singularityChallenges.noAmbrosiaUpgrades.rewards.luckBonus // No Ambrosia Challenge Reward
  },
  {
    i18n: 'Cookie5',
    stat: () => 0.001 * player.cubeUpgrades[77] // Cookie 5 (Cx27)
  },
  {
    i18n: 'Event',
    stat: () => G.isEvent ? calculateEventBuff(BuffType.AmbrosiaLuck) : 0, // Event
    color: 'lime'
  }
]

export const allAmbrosiaLuckStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 100 // Base value of 100
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.AMBROSIA_LUCK_BUFF, // Platonic Coin Upgrade
    color: 'gold'
  },
  {
    i18n: 'Campaign',
    stat: () => player.campaigns.ambrosiaLuckBonus // Campaign Bonus
  },
  {
    i18n: 'SingularityMilestones',
    stat: () => calculateSingularityAmbrosiaLuckMilestoneBonus() // Ambrosia Luck Milestones
  },
  {
    i18n: 'ShopUpgrades',
    stat: () => calculateAmbrosiaLuckShopUpgrade() // Ambrosia Luck from Shop Upgrades (I-IV)
  },
  {
    i18n: 'SingularityUpgrades',
    stat: () => calculateAmbrosiaLuckSingularityUpgrade() // Ambrosia Luck from Singularity Upgrades (I-IV)
  },
  {
    i18n: 'OcteractUpgrades',
    stat: () => calculateAmbrosiaLuckOcteractUpgrade() // Ambrosia Luck from Octeract Upgrades (I-IV)
  },
  {
    i18n: 'AmbrosiaLuck1',
    stat: () => +player.blueberryUpgrades.ambrosiaLuck1.bonus.ambrosiaLuck // Ambrosia Luck from Luck Module I
  },
  {
    i18n: 'AmbrosiaLuck2',
    stat: () => +player.blueberryUpgrades.ambrosiaLuck2.bonus.ambrosiaLuck // Ambrosia Luck from Luck Module II
  },
  {
    i18n: 'AmbrosiaLuck3',
    stat: () => +player.blueberryUpgrades.ambrosiaLuck3.bonus.ambrosiaLuck // Ambrosia Luck from Luck Module III
  },
  {
    i18n: 'AmbrosiaCubeLuck1',
    stat: () => +player.blueberryUpgrades.ambrosiaCubeLuck1.bonus.ambrosiaLuck // Ambrosia Luck from Cube-Luck Synergy Module
  },
  {
    i18n: 'AmbrosiaQuarkLuck1',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarkLuck1.bonus.ambrosiaLuck // Ambrosia Luck from Quark-Luck Synergy Module
  },
  {
    i18n: 'Singularity131',
    stat: () => player.highestSingularityCount >= 131 ? 131 : 0 // Singularity Perk "One Hundred Thirty One!"
  },
  {
    i18n: 'Singularity269',
    stat: () => player.highestSingularityCount >= 269 ? 269 : 0 // Singularity Perk "Two Hundred Sixty Nine!"
  },
  {
    i18n: 'OcteractShop',
    stat: () =>
      player.shopUpgrades.shopOcteractAmbrosiaLuck * (1 + Math.floor(Math.log10(player.totalWowOcteracts + 1))) // Octeract -> Ambrosia Shop Upgrade
  },
  {
    i18n: 'NoAmbrosiaUpgrades',
    stat: () => +player.singularityChallenges.noAmbrosiaUpgrades.rewards.additiveLuck // No Ambrosia Challenge Reward
  },
  {
    i18n: 'RedAmbrosiaUpgrade',
    stat: () => getRedAmbrosiaUpgrade('regularLuck').bonus.ambrosiaLuck // Red Ambrosia Upgrade
  },
  {
    i18n: 'RedAmbrosiaUpgrade2',
    stat: () => getRedAmbrosiaUpgrade('regularLuck2').bonus.ambrosiaLuck // Red Ambrosia Upgrade 2
  },
  {
    i18n: 'Viscount',
    stat: () => getRedAmbrosiaUpgrade('viscount').bonus.luckBonus, // Viscount Red Ambrosia Upgrade
    color: 'red'
  },
  {
    i18n: 'Cookie5',
    stat: () => 2 * player.cubeUpgrades[77] // Cookie 5 (Cx27)
  },
  {
    i18n: 'RedBars',
    stat: () => calculateCookieUpgrade29Luck() // Cookie Upgrade 29 (Cx29)
  },
  {
    i18n: 'AmbrosiaUltra',
    stat: () => player.shopUpgrades.shopAmbrosiaUltra * sumOfExaltCompletions() // Ambrosia Ultra Shop Upgrade
  }
]

// Attach to the end of allAmbrosiaLuckStats when displaying.
export const ambrosiaLuckModifiers: StatLine[] = [
  {
    i18n: 'AdditiveLuckMult',
    stat: () => calculateAmbrosiaAdditiveLuckMult() // Ambrosia Additive Luck Multiplier
  }
]

export const allAmbrosiaBlueberryStats: StatLine[] = [
  {
    i18n: 'E1x1Clear',
    stat: () => +(player.singularityChallenges.noSingularityUpgrades.completions > 0) // E1x1 Clear!
  },
  {
    i18n: 'SingBlueberries',
    stat: () => +player.singularityUpgrades.blueberries.getEffect().bonus // Singularity Blueberry Upgrade
  },
  {
    i18n: 'OcteractBlueberries',
    stat: () => +player.octeractUpgrades.octeractBlueberries.getEffect().bonus // Octeract Blueberry Upgrade
  },
  {
    i18n: 'ConglomerateBerries',
    stat: () => calculateSingularityMilestoneBlueberries() // Singularity Milestones (Congealed Blueberries)
  },
  {
    i18n: 'NoAmbrosiaUpgrades',
    stat: () => +player.singularityChallenges.noAmbrosiaUpgrades.rewards.blueberries // No Ambrosia Challenge Reward
  }
]

export const allAmbrosiaGenerationSpeedStats: StatLine[] = [
  {
    i18n: 'VisitedTab',
    stat: () => +(player.visitedAmbrosiaSubtab) // Visited Ambrosia Tab
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.AMBROSIA_GENERATION_BUFF, // Platonic Coin Upgrade
    color: 'gold'
  },
  {
    i18n: 'Campaign',
    stat: () => player.campaigns.blueberrySpeedBonus // Campaign Bonus
  },
  {
    i18n: 'ShopUpgrades',
    stat: () => calculateAmbrosiaGenerationShopUpgrade() // Shop Upgrades (I-IV)
  },
  {
    i18n: 'SingularityUpgrades',
    stat: () => calculateAmbrosiaGenerationSingularityUpgrade() // Singularity Upgrades (I-IV)
  },
  {
    i18n: 'OcteractUpgrades',
    stat: () => calculateAmbrosiaGenerationOcteractUpgrade() // Octeract Upgrades (I-IV)
  },
  {
    i18n: 'PatreonBonus',
    stat: () => +player.blueberryUpgrades.ambrosiaPatreon.bonus.blueberryGeneration // Patreon Bonus
  },
  {
    i18n: 'OneChallengeCap',
    stat: () => +player.singularityChallenges.oneChallengeCap.rewards.blueberrySpeedMult // One Challenge Cap Reward
  },
  {
    i18n: 'NoAmbrosiaUpgradesReward',
    stat: () => +player.singularityChallenges.noAmbrosiaUpgrades.rewards.blueberrySpeedMult // No Ambrosia Upgrades Reward
  },
  {
    i18n: 'RedAmbrosiaUpgrade',
    stat: () => getRedAmbrosiaUpgrade('blueberryGenerationSpeed').bonus.blueberryGenerationSpeed // Red Ambrosia Upgrade
  },
  {
    i18n: 'RedAmbrosiaUpgrade2',
    stat: () => getRedAmbrosiaUpgrade('blueberryGenerationSpeed2').bonus.blueberryGenerationSpeed // Red Ambrosia Upgrade 2
  },
  {
    i18n: 'CookieUpgrade26',
    stat: () => 1 + 0.01 * player.cubeUpgrades[76] * calculateNumberOfThresholds() // Cookie Upgrade 26 (Cx26)
  },
  {
    i18n: 'CashGrabUltra',
    stat: () => calculateCashGrabBlueberryBonus() // Cash Grab ULTRA Blueberry Bonus
  },
  {
    i18n: 'Event',
    stat: () => G.isEvent ? 1 + calculateEventBuff(BuffType.BlueberryTime) : 1, // Event Bonus
    color: 'lime'
  }
]

export const ambrosiaGenerationSpeedModifiers: StatLine[] = [
  {
    i18n: 'BlueberryCount',
    stat: () => calculateBlueberryInventory()
  }
]

export const allPowderMultiplierStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 1 / 100 // Base value of 0.01 (1%)
  },
  {
    i18n: 'Challenge15',
    stat: () => G.challenge15Rewards.powder.value // Challenge 15 Reward
  },
  {
    i18n: 'ShopPowderEX',
    stat: () => 1 + player.shopUpgrades.powderEX / 50 // powderEX shop upgrade (2% per level, max 20%)
  },
  {
    i18n: 'Achievement256',
    stat: () => 1 + player.achievements[256] / 20 // Achievement 256 (5%)
  },
  {
    i18n: 'Achievement257',
    stat: () => 1 + player.achievements[257] / 20 // Achievement 257 (5%)
  },
  {
    i18n: 'PlatonicUpgrade4x1',
    stat: () => 1 + 0.01 * player.platonicUpgrades[16] // Platonic Upgrade 4x1
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.PowderConversion), // Event bonus
    color: 'lime'
  }
]

export const allGoldenQuarkMultiplierStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () =>
      10 + 2 * player.singularityCount + Math.max(0, 5 * (10 - player.singularityCount))
      + player.quarksThisSingularity / 1e5 // Base Value
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.GOLDEN_QUARK_BUFF, // Golden Quark Buff from PseudoCoins
    color: 'gold'
  },
  {
    i18n: 'Campaign',
    stat: () => player.campaigns.goldenQuarkBonus // Golden Quark Bonus from Campaigns
  },
  {
    i18n: 'Challenge15',
    stat: () => 1 + Math.max(0, Math.log10(player.challenge15Exponent + 1) - 20) / 2 // Challenge 15 Exponent
  },
  {
    i18n: 'GoldenQuarks1',
    stat: () => +player.singularityUpgrades.goldenQuarks1.getEffect().bonus // Golden Quarks I
  },
  {
    i18n: 'CookieUpgrade19',
    stat: () => 1 + 0.12 * player.cubeUpgrades[69] // Cookie Upgrade 19
  },
  {
    i18n: 'NoSingularityUpgrades',
    stat: () => +player.singularityChallenges.noSingularityUpgrades.rewards.goldenQuarks // No Singularity Upgrades
  },
  {
    i18n: 'GoldenRevolution2',
    stat: () =>
      player.highestSingularityCount >= 100
        ? 1 + Math.min(1, player.highestSingularityCount / 250)
        : 1 // Golden Revolution II
  },
  {
    i18n: 'FastForwards',
    stat: () => 1 + getFastForwardTotalMultiplier() // Singularity Fast Forwards
  },
  {
    i18n: 'ImmaculateAlchemy',
    stat: () => {
      let perkMultiplier = 1
      if (player.highestSingularityCount >= 200) perkMultiplier = 3
      if (player.highestSingularityCount >= 208) perkMultiplier = 5
      if (player.highestSingularityCount >= 221) perkMultiplier = 8
      return perkMultiplier // Immaculate Alchemy
    }
  },
  {
    i18n: 'PatreonBonus',
    stat: () => 1 + getQuarkBonus() / 100, // Patreon Bonus
    color: 'gold'
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.GoldenQuark), // Event
    color: 'lime'
  }
]

export const allGoldenQuarkPurchaseCostStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 10000 // Base cost of 10,000
  },
  {
    i18n: 'PseudoCoins',
    stat: () => 1 / PCoinUpgradeEffects.GOLDEN_QUARK_BUFF, // Golden Quark Buff from PseudoCoins
    color: 'gold'
  },
  {
    i18n: 'Patreon',
    stat: () => 1 / (1 + getQuarkBonus() / 100),
    color: 'gold'
  },
  {
    i18n: 'AchievementPoints',
    stat: () => 1 - 0.1 * Math.min(1, player.achievementPoints / 10000)
  },
  {
    i18n: 'CubeUpgrade6x10',
    stat: () => 1 - (0.3 * player.cubeUpgrades[60]) / 10000
  },
  {
    i18n: 'GoldenQuarks2',
    stat: () => +player.singularityUpgrades.goldenQuarks2.getEffect().bonus
  },
  {
    i18n: 'OcteractCostReduce',
    stat: () => +player.octeractUpgrades.octeractGQCostReduce.getEffect().bonus
  },
  {
    i18n: 'GoldenRevolution2',
    stat: () =>
      player.highestSingularityCount >= 100
        ? 1 - (0.5 * player.highestSingularityCount) / 250
        : 1
  },
  {
    i18n: 'ImmaculateAlchemy',
    stat: () => {
      let perkDivisor = 1
      if (player.highestSingularityCount >= 200) perkDivisor = 3
      if (player.highestSingularityCount >= 208) perkDivisor = 5
      if (player.highestSingularityCount >= 221) perkDivisor = 8
      return 1 / perkDivisor
    }
  },
  {
    i18n: 'Event',
    stat: () => 1 / (1 + calculateEventBuff(BuffType.GoldenQuark)),
    color: 'lime'
  }
]

export const allAddCodeEffectStats: StatLine[] = [
  {
    i18n: 'Quarks',
    stat: () => {
      const addCodeStuff = addCodeBonuses()
      if (Math.abs(addCodeStuff.maxQuarks - addCodeStuff.minQuarks) >= 0.5) {
        return 1 / 2 * (addCodeStuff.minQuarks + addCodeStuff.maxQuarks)
      } else {
        return addCodeStuff.maxQuarks
      }
    },
    color: 'cyan'
  },
  {
    i18n: 'AscensionTime',
    stat: () => {
      const addCodeStuff = addCodeBonuses()
      return addCodeStuff.ascensionTimer
    },
    color: 'orange'
  },
  {
    i18n: 'GoldenQuarks',
    stat: () => {
      const addCodeStuff = addCodeBonuses()
      return addCodeStuff.gqTimer
    },
    color: 'lightgoldenrodyellow'
  },
  {
    i18n: 'Octeracts',
    stat: () => {
      const addCodeStuff = addCodeBonuses()
      return addCodeStuff.octeractTime
    },
    color: 'lightseagreen'
  },
  {
    i18n: 'Ambrosia',
    stat: () => {
      const addCodeStuff = addCodeBonuses()
      return addCodeStuff.blueberryTime
    },
    color: 'lightblue'
  }
]

export const allAddCodeTimerStats: StatLine[] = [
  {
    i18n: 'BaseTimer',
    stat: () => 3600 * 1000 // Base timer value (3600000ms = 1 hour)
  },
  {
    i18n: 'Calculator4',
    stat: () => 1 - 0.04 * player.shopUpgrades.calculator4, // PL-AT δ discount (4% per level)
    color: 'lime'
  },
  {
    i18n: 'SingularityCount',
    stat: () =>
      1 - Math.min(
        0.6,
        (player.highestSingularityCount >= 125 ? player.highestSingularityCount / 800 : 0)
          + (player.highestSingularityCount >= 200 ? player.highestSingularityCount / 800 : 0)
      ), // Singularity Count reduction (max 60%)
    color: 'lime'
  },
  {
    i18n: 'InfiniteAscent',
    stat: () => player.runelevels[6] > 0 ? 0.8 : 1, // Infinite Ascent rune reduction (20%)
    color: 'lime'
  },
  {
    i18n: 'SingularityPerkBonus',
    stat: () => 1 / addCodeSingularityPerkBonus(), // Singularity Perk bonus (increases with higher singularity milestones)
    color: 'lime'
  }
]

export const allAddCodeCapacityStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 24 // Base capacity (24 codes)
  },
  {
    i18n: 'Calculator2',
    stat: () => 2 * player.shopUpgrades.calculator2, // PL-AT X (2 codes per level)
    color: 'lime'
  },
  {
    i18n: 'Calculator4Max',
    stat: () => player.shopUpgrades.calculator4 === shopData.calculator4.maxLevel ? 32 : 0, // PL-AT δ Maxed (32 codes)
    color: 'lime'
  },
  {
    i18n: 'Calculator5',
    stat: () => {
      let calc5uses = Math.floor(player.shopUpgrades.calculator5 / 10)
      if (player.shopUpgrades.calculator5 === shopData.calculator5.maxLevel) {
        calc5uses += 6
      }
      return calc5uses
    }, // PL-AT Γ (1 code per 10 levels, +6 at max)
    color: 'lime'
  },
  {
    i18n: 'Calculator6Max',
    stat: () => player.shopUpgrades.calculator6 === shopData.calculator6.maxLevel ? 24 : 0, // PL-AT _ Maxed (24 codes)
    color: 'lime'
  },
  {
    i18n: 'Calculator7Max',
    stat: () => player.shopUpgrades.calculator7 === shopData.calculator7.maxLevel ? 48 : 0, // PL-AT ΩΩ Maxed (48 codes)
    color: 'lime'
  }
]

export const allAddCodeCapacityMultiplierStats: StatLine[] = [
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.ADD_CODE_CAP_BUFF, // PseudoCoin Upgrade
    color: 'gold'
  },
  {
    i18n: 'SingularityPerk',
    stat: () => addCodeSingularityPerkBonus() // Singularity Perk bonus
  }
]

export const allLuckConversionStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 20 // Base value of 20.00
  },
  {
    i18n: 'RedAmbrosiaUpgrade1',
    stat: () => getRedAmbrosiaUpgrade('conversionImprovement1').bonus.conversionImprovement // Conversion Improvement I
  },
  {
    i18n: 'RedAmbrosiaUpgrade2',
    stat: () => getRedAmbrosiaUpgrade('conversionImprovement2').bonus.conversionImprovement // Conversion Improvement II
  },
  {
    i18n: 'RedAmbrosiaUpgrade3',
    stat: () => getRedAmbrosiaUpgrade('conversionImprovement3').bonus.conversionImprovement // Conversion Improvement III
  },
  {
    i18n: 'ShopRedLuck1',
    stat: () => -0.01 * Math.floor(player.shopUpgrades.shopRedLuck1 / 20) // Shop Red Luck I
  },
  {
    i18n: 'ShopRedLuck2',
    stat: () => -0.01 * Math.floor(player.shopUpgrades.shopRedLuck2 / 20) // Shop Red Luck II
  },
  {
    i18n: 'ShopRedLuck3',
    stat: () => -0.01 * Math.floor(player.shopUpgrades.shopRedLuck3 / 20) // Shop Red Luck III
  }
]

export const allRedAmbrosiaLuckStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 100 // Base value of 100
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.RED_LUCK_BUFF, // PseudoCoin Upgrade
    color: 'gold'
  },
  {
    i18n: 'LuckConversion',
    stat: () => Math.floor((calculateAmbrosiaLuck() - 100) / calculateLuckConversion()) // Luck Conversion
  },
  {
    i18n: 'RedAmbrosia',
    stat: () => getRedAmbrosiaUpgrade('redLuck').bonus.redAmbrosiaLuck // The Dice That Decide Your Fate
  },
  {
    i18n: 'Exalt5',
    stat: () => +player.singularityChallenges.noAmbrosiaUpgrades.rewards.redLuck
  },
  {
    i18n: 'ShopRedLuck1',
    stat: () => player.shopUpgrades.shopRedLuck1 * 0.05 // Shop Red Luck I
  },
  {
    i18n: 'ShopRedLuck2',
    stat: () => player.shopUpgrades.shopRedLuck2 * 0.075 // Shop Red Luck II
  },
  {
    i18n: 'ShopRedLuck3',
    stat: () => player.shopUpgrades.shopRedLuck3 * 0.1 // Shop Red Luck III
  },
  {
    i18n: 'Viscount',
    stat: () => getRedAmbrosiaUpgrade('viscount').bonus.redLuckBonus, // Viscount Red Ambrosia Upgrade
    color: 'red'
  }
]

export const allRedAmbrosiaGenerationSpeedStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 1 // Base value of 1.00
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.RED_GENERATION_BUFF, // PseudoCoin Upgrade
    color: 'gold'
  },
  {
    i18n: 'BlueberrySpeed',
    stat: () => {
      const bSpeed = calculateAmbrosiaGenerationSpeed()
      return bSpeed > 1000 ? Math.pow(bSpeed * 1000, 1 / 2) : bSpeed // Blueberry Speed
    }
  },
  {
    i18n: 'RedAmbrosia',
    stat: () => getRedAmbrosiaUpgrade('redGenerationSpeed').bonus.redAmbrosiaGenerationSpeed
  },
  {
    i18n: 'Exalt5',
    stat: () => +player.singularityChallenges.noAmbrosiaUpgrades.rewards.redSpeedMult
  }
]

export const infinityShopUpgrades: StatLine[] = [
  {
    i18n: 'Offerings',
    stat: () => player.shopUpgrades.offeringEX3
  },
  {
    i18n: 'Obtainium',
    stat: () => player.shopUpgrades.obtainiumEX3
  },
  {
    i18n: 'WowPass',
    stat: () => player.shopUpgrades.seasonPassInfinity
  },
  {
    i18n: 'Chronometer',
    stat: () => player.shopUpgrades.chronometerInfinity
  }
]

export const allShopTablets: StatLine[] = [
  {
    i18n: 'Red',
    stat: () => getRedAmbrosiaUpgrade('infiniteShopUpgrades').bonus.freeLevels, // Red Ambrosia Upgrade
    acc: 0,
    color: 'red'
  },
  {
    i18n: 'Orange',
    stat: () => {
      if (player.highestSingularityCount >= 280) {
        return Math.floor(0.8 * (player.highestSingularityCount - 200))
      } else if (player.highestSingularityCount >= 250) {
        return Math.floor(0.5 * (player.highestSingularityCount - 200))
      } else {
        return 0
      }
    },
    acc: 0,
    color: 'orange'
  },
  {
    i18n: 'Yellow',
    stat: () => +player.singularityUpgrades.singInfiniteShopUpgrades.getEffect().bonus, // Singularity Upgrade
    acc: 0,
    color: 'yellow'
  },
  {
    i18n: 'Green',
    stat: () => +player.octeractUpgrades.octeractInfiniteShopUpgrades.getEffect().bonus, // Octeract Upgrade
    acc: 0,
    color: 'green'
  },
  {
    i18n: 'Blue',
    stat: () => Math.floor(0.005 * player.shopUpgrades.shopInfiniteShopUpgrades * sumOfExaltCompletions()), // Shop Upgrade
    acc: 0,
    color: 'lightblue'
  },
  {
    i18n: 'Indigo',
    stat: () => +player.blueberryUpgrades.ambrosiaInfiniteShopUpgrades1.bonus.freeLevels, // Blueberry Upgrade
    acc: 0,
    color: 'orchid'
  },
  {
    i18n: 'Violet',
    stat: () => +player.blueberryUpgrades.ambrosiaInfiniteShopUpgrades2.bonus.freeLevels, // Blueberry Upgrade 2
    acc: 0,
    color: 'violet'
  }
]

export const allMiscStats: StatLine[] = [
  {
    i18n: 'PrestigeCount',
    stat: () => player.prestigeCount,
    color: 'cyan'
  },
  {
    i18n: 'FastestPrestige',
    stat: () => 1000 * player.fastestprestige,
    color: 'cyan'
  },
  {
    i18n: 'MaxOfferings',
    stat: () => player.maxofferings,
    color: 'orange'
  },
  {
    i18n: 'RuneSum',
    stat: () => G.runeSum,
    color: 'orange'
  },
  {
    i18n: 'TranscendCount',
    stat: () => player.transcendCount,
    color: 'orchid'
  },
  {
    i18n: 'FastestTranscend',
    stat: () => 1000 * player.fastesttranscend,
    color: 'orchid'
  },
  {
    i18n: 'ReincarnationCount',
    stat: () => player.reincarnationCount,
    color: 'green'
  },
  {
    i18n: 'FastestReincarnation',
    stat: () => 1000 * player.fastestreincarnate,
    color: 'green'
  },
  {
    i18n: 'MaxObtainium',
    stat: () => player.maxobtainium,
    color: 'pink'
  },
  {
    i18n: 'MaxObtainiumPerSecond',
    stat: () => player.maxobtainiumpersecond,
    color: 'pink'
  },
  {
    i18n: 'ObtainiumPerSecond',
    stat: () => player.obtainiumpersecond,
    color: 'pink'
  },
  {
    i18n: 'AscensionCount',
    stat: () => player.ascensionCount,
    color: 'orange'
  },
  {
    i18n: 'QuarksThisSingularity',
    stat: () => player.quarksThisSingularity,
    color: 'cyan'
  },
  {
    i18n: 'TotalQuarks',
    stat: () => player.totalQuarksEver + player.quarksThisSingularity,
    color: 'cyan'
  },
  {
    i18n: 'QuarkTimer',
    stat: () => player.quarkstimer,
    color: 'yellow'
  },
  {
    i18n: 'QuarkTimerMax',
    stat: () => 90000 + 18000 * player.researches[195],
    color: 'yellow'
  }
]

const LOADED_STATS_HTMLS = {
  challenge15: false
}

const associated = new Map<string, string>([
  ['kMisc', 'miscStats'],
  ['kBaseOffering', 'baseOfferingStats'],
  ['kOfferingMult', 'offeringMultiplierStats'],
  ['kBaseObtainium', 'baseObtainiumStats'],
  ['kObtIgnoreDR', 'obtainiumIgnoreDRStats'],
  ['kObtMult', 'obtainiumMultiplierStats'],
  ['kGlobalCubeMult', 'globalCubeMultiplierStats'],
  ['kAntSacrificeMult', 'antSacrificeMultStats'],
  ['kQuarkMult', 'globalQuarkMultiplierStats'],
  ['kGSpeedMultIgnoreDR', 'globalSpeedIgnoreDRStats'],
  ['kGSpeedMult', 'globalSpeedMultiplierStats'],
  ['kCubeMult', 'cubeMultiplierStats'],
  ['kTessMult', 'tesseractMultiplierStats'],
  ['kHypercubeMult', 'hypercubeMultiplierStats'],
  ['kPlatMult', 'platonicMultiplierStats'],
  ['kHeptMult', 'hepteractMultiplierStats'],
  ['kOrbPowderMult', 'powderMultiplierStats'],
  ['kOctMult', 'octeractMultiplierStats'],
  ['kASCMult', 'ascensionSpeedMultiplierStats'],
  ['kGQMult', 'goldenQuarkMultiplierStats'],
  ['kGQCost', 'goldenQuarkPurchaseCostStats'],
  ['kAddStats', 'addCodeStats'],
  ['kAmbrosiaAdditiveLuckMult', 'ambrosiaAdditiveLuckMultStats'],
  ['kAmbrosiaLuck', 'ambrosiaLuckStats'],
  ['kAmbrosiaBlueberries', 'ambrosiaBlueberryStats'],
  ['kAmbrosiaGenMult', 'ambrosiaGenerationStats'],
  ['kLuckConversion', 'luckConversionStats'],
  ['kRedAmbrosiaLuck', 'redAmbrosiaLuckStats'],
  ['kRedAmbrosiaGenMult', 'redAmbrosiaGenerationStats'],
  ['kShopVouchers', 'shopVoucherStats']
])

export const displayStats = (btn: HTMLElement) => {
  for (const e of Array.from(btn.parentElement!.children) as HTMLElement[]) {
    const statsEl = DOMCacheGetOrSet(associated.get(e.id)!)
    if (e.id !== btn.id) {
      e.style.backgroundColor = ''
      statsEl.style.display = 'none'
      statsEl.classList.remove('activeStats')
    } else {
      e.style.backgroundColor = 'crimson'
      statsEl.style.display = 'block'
      statsEl.classList.add('activeStats')
    }
  }
}

export const loadStatisticsUpdate = () => {
  const activeStats = document.getElementsByClassName(
    'activeStats'
  ) as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < activeStats.length; i++) {
    switch (activeStats[i].id) {
      case 'miscStats':
        loadMiscellaneousStats()
        break
      case 'baseOfferingStats':
        loadStatisticsOfferingBase()
        break
      case 'offeringMultiplierStats':
        loadStatisticsOfferingMultipliers()
        break
      case 'baseObtainiumStats':
        loadStatisticsObtainiumBase()
        break
      case 'obtainiumIgnoreDRStats':
        loadStatisticsObtainiumIgnoreDR()
        break
      case 'obtainiumMultiplierStats':
        loadStatisticsObtainiumMultipliers()
        break
      case 'globalQuarkMultiplierStats':
        loadQuarkMultiplier()
        break
      case 'globalSpeedIgnoreDRStats':
        loadStatisticsGlobalSpeedIgnoreDR()
        break
      case 'globalSpeedMultiplierStats':
        loadStatisticsGlobalSpeed()
        break
      case 'antSacrificeMultStats':
        loadStatisticsAntSacrificeMult()
        break
      case 'powderMultiplierStats':
        loadStatisticsPowderMultiplier()
        break
      case 'ascensionSpeedMultiplierStats':
        loadStatisticsAscensionSpeed()
        break
      case 'goldenQuarkMultiplierStats':
        loadStatisticsGoldenQuarkMultipliers()
        break
      case 'goldenQuarkPurchaseCostStats':
        loadStatisticsGoldenQuarkCost()
        break
      case 'addCodeStats':
        loadAddCodeEffects()
        loadAddCodeTimeStats()
        loadAddCodeCapacityStats()
        break
      case 'ambrosiaAdditiveLuckMultStats':
        loadStatisticsAdditiveLuckMult()
        break
      case 'ambrosiaLuckStats':
        loadStatisticsAmbrosiaLuck()
        break
      case 'ambrosiaBlueberryStats':
        loadStatisticsBlueberryInventory()
        break
      case 'ambrosiaGenerationStats':
        loadStatisticsAmbrosiaGeneration()
        break
      case 'globalCubeMultiplierStats':
        loadGlobalCubeMultiplierStats()
        break
      case 'cubeMultiplierStats':
        loadWowCubeMultiplierStats()
        break
      case 'tesseractMultiplierStats':
        loadTesseractMultiplierStats()
        break
      case 'hypercubeMultiplierStats':
        loadHypercubeMultiplierStats()
        break
      case 'platonicMultiplierStats':
        loadPlatonicMultiplierStats()
        break
      case 'hepteractMultiplierStats':
        loadHepteractMultiplierStats()
        break
      case 'octeractMultiplierStats':
        loadOcteractMultiplierStats()
        break
      case 'luckConversionStats':
        loadLuckConversionStats()
        break
      case 'redAmbrosiaLuckStats':
        loadRedAmbrosiaLuckStats()
        break
      case 'redAmbrosiaGenerationStats':
        loadRedAmbrosiaGenerationStats()
        break
      case 'shopVoucherStats':
        loadShopVoucherStats()
        break
    }
  }
}

export const loadStatistics = (
  statsObj: StatLine[],
  parentDiv: string,
  statLinePrefix: string,
  specificClass: string,
  calcTotalFunc: () => number | Decimal,
  summativeName = 'Total',
  hasSummative = true
) => {
  const parent = DOMCacheGetOrSet(parentDiv)
  const numStatLines = document.getElementsByClassName(specificClass).length
  let createdStatLines = 0

  for (const obj of statsObj) {
    const key = obj.i18n
    const statHTMLName = statLinePrefix + key
    const statNumHTMLName = `${statLinePrefix}N${key}`
    if (numStatLines === 0) {
      const statLine = document.createElement('p')
      statLine.id = statHTMLName
      statLine.className = 'statPortion'
      statLine.classList.add(specificClass)
      statLine.style.color = obj.color ?? 'white'
      statLine.style.backgroundColor = createdStatLines % 2 === 0 ? '#1f1f1f' : ''
      statLine.textContent = i18next.t(`statistics.${parentDiv}.${key}`)

      const statNum = document.createElement('span')
      statNum.id = statNumHTMLName
      statNum.className = 'statNumber'

      statLine.appendChild(statNum)
      parent.appendChild(statLine)

      createdStatLines += 1
    }

    const statNumber = DOMCacheGetOrSet(statNumHTMLName)

    const accuracy = obj.acc ?? 2
    const num = obj.stat()

    statNumber.textContent = `${format(num, accuracy, true)}`
  }

  const statTotalHTMLName = `${statLinePrefix}T`
  const statNumTotalHTMLName = `${statLinePrefix}NT`

  if (numStatLines === 0 && hasSummative) {
    const statTotal = document.createElement('p')
    statTotal.id = statTotalHTMLName
    statTotal.className = 'statPortion'
    statTotal.classList.add('statTotal')
    statTotal.style.backgroundColor = '#2f2f2f'
    statTotal.textContent = i18next.t(`statistics.${parentDiv}.${summativeName}`)

    const statTotalNum = document.createElement('span')
    statTotalNum.id = statNumTotalHTMLName
    statTotalNum.className = 'statNumber'

    statTotal.appendChild(statTotalNum)
    parent.appendChild(statTotal)
  }

  if (hasSummative) {
    const statTotalNumber = DOMCacheGetOrSet(statNumTotalHTMLName)
    const total = calcTotalFunc()
    statTotalNumber.textContent = `${format(total, 3, true)}`
  }
}

export const loadQuarkMultiplier = () => {
  loadStatistics(allQuarkStats, 'globalQuarkMultiplierStats', 'sGQM', 'quarkStats', calculateQuarkMultiplier)
}

export const loadGlobalCubeMultiplierStats = () => {
  loadStatistics(allCubeStats, 'globalCubeMultiplierStats', 'statGCM', 'GlobalCubeStat', calculateAllCubeMultiplier)
}

export const loadWowCubeMultiplierStats = () => {
  loadStatistics(allWowCubeStats, 'cubeMultiplierStats', 'statCM', 'WowCubeStat', calculateCubeMultiplier)
}

export const loadTesseractMultiplierStats = () => {
  loadStatistics(
    allTesseractStats,
    'tesseractMultiplierStats',
    'statTeM',
    'TesseractStat',
    calculateTesseractMultiplier
  )
}

export const loadHypercubeMultiplierStats = () => {
  loadStatistics(
    allHypercubeStats,
    'hypercubeMultiplierStats',
    'statHyM',
    'HypercubeStat',
    calculateHypercubeMultiplier
  )
}

export const loadPlatonicMultiplierStats = () => {
  loadStatistics(
    allPlatonicCubeStats,
    'platonicMultiplierStats',
    'statPlM',
    'PlatonicStat',
    calculatePlatonicMultiplier
  )
}

export const loadHepteractMultiplierStats = () => {
  loadStatistics(
    allHepteractCubeStats,
    'hepteractMultiplierStats',
    'statHeM',
    'HepteractCubeStat',
    calculateHepteractMultiplier
  )
}

export const loadOcteractMultiplierStats = () => {
  loadStatistics(
    allOcteractCubeStats,
    'octeractMultiplierStats',
    'statOcM',
    'OcteractCubeStat',
    calculateOcteractMultiplier
  )
}

export const loadStatisticsOfferingBase = () => {
  loadStatistics(allBaseOfferingStats, 'baseOfferingStats', 'statOffB', 'OfferingBaseStat', calculateBaseOfferings)
}

export const loadStatisticsOfferingMultipliers = () => {
  loadStatistics(allOfferingStats, 'offeringMultiplierStats', 'statOff', 'OfferingStat', calculateOfferingsDecimal)
  loadStatistics(
    offeringObtainiumTimeModifiers(player.prestigecounter, player.prestigeCount > 0),
    'offeringMultiplierStats',
    'statOff2',
    'OfferingStat2',
    calculateOfferings,
    'Total2'
  )
}

export const loadStatisticsObtainiumBase = () => {
  loadStatistics(allBaseObtainiumStats, 'baseObtainiumStats', 'statObtB', 'ObtainiumBaseStat', calculateBaseObtainium)
}

export const loadStatisticsObtainiumIgnoreDR = () => {
  loadStatistics(
    allObtainiumIgnoreDRStats,
    'obtainiumIgnoreDRStats',
    'statObtDR',
    'ObtainiumDRStat',
    calculateObtainiumDRIgnoreMult
  )
}

export const loadStatisticsObtainiumMultipliers = () => {
  loadStatistics(allObtainiumStats, 'obtainiumMultiplierStats', 'statObt', 'ObtainiumStat', calculateObtainiumDecimal)
  loadStatistics(
    obtainiumDR.concat(offeringObtainiumTimeModifiers(player.reincarnationcounter, player.reincarnationCount >= 5)),
    'obtainiumMultiplierStats',
    'statObt2',
    'ObtainiumStat2',
    calculateObtainium,
    'Total2'
  )
}

export const loadStatisticsAntSacrificeMult = () => {
  loadStatistics(
    antSacrificeRewardStats,
    'antSacrificeMultStats',
    'statASM',
    'AntSacrificeStat',
    calculateAntSacrificeMultipliers
  )
}

export const loadStatisticsGlobalSpeedIgnoreDR = () => {
  loadStatistics(
    allGlobalSpeedIgnoreDRStats,
    'globalSpeedIgnoreDRStats',
    'statGSMDR',
    'GlobalSpeedDRStat',
    calculateGlobalSpeedDRIgnoreMult
  )
}

export const loadStatisticsGlobalSpeed = () => {
  loadStatistics(
    allGlobalSpeedStats,
    'globalSpeedMultiplierStats',
    'statGSM',
    'GlobalSpeedStat',
    calculateGlobalSpeedDREnabledMult
  )
  loadStatistics(
    allGlobalSpeedDRStats,
    'globalSpeedMultiplierStats',
    'statGSM2',
    'GlobalSpeedStat2',
    calculateGlobalSpeedMult,
    'Total2'
  )
}

export const loadStatisticsAscensionSpeed = () => {
  loadStatistics(
    allAscensionSpeedStats,
    'ascensionSpeedMultiplierStats',
    'statASM',
    'AscensionSpeedStat',
    calculateRawAscensionSpeedMult
  )
  loadStatistics(
    allAscensionSpeedPowerStats,
    'ascensionSpeedMultiplierStats',
    'statASM2',
    'AscensionSpeedStat2',
    calculateAscensionSpeedMult,
    'Total2'
  )
}

export const loadStatisticsAdditiveLuckMult = () => {
  loadStatistics(
    allAdditiveLuckMultStats,
    'ambrosiaAdditiveLuckMultStats',
    'statALM',
    'AdditiveLuckStat',
    calculateAmbrosiaAdditiveLuckMult
  )
}

export const loadStatisticsAmbrosiaLuck = () => {
  loadStatistics(allAmbrosiaLuckStats, 'ambrosiaLuckStats', 'statAL', 'AmbrosiaLuckStat', calculateAmbrosiaLuckRaw)
  loadStatistics(
    ambrosiaLuckModifiers,
    'ambrosiaLuckStats',
    'statAL2',
    'AmbrosiaLuckStat2',
    calculateAmbrosiaLuck,
    'Total2'
  )
}

export const loadStatisticsBlueberryInventory = () => {
  loadStatistics(
    allAmbrosiaBlueberryStats,
    'ambrosiaBlueberryStats',
    'statAB',
    'AmbrosiaBlueberryStat',
    calculateBlueberryInventory
  )
}

export const loadStatisticsAmbrosiaGeneration = () => {
  loadStatistics(
    allAmbrosiaGenerationSpeedStats,
    'ambrosiaGenerationStats',
    'statAG',
    'AmbrosiaGenerationStat',
    calculateAmbrosiaGenerationSpeedRaw
  )
  loadStatistics(
    ambrosiaGenerationSpeedModifiers,
    'ambrosiaGenerationStats',
    'statAG2',
    'AmbrosiaGenerationStat2',
    calculateAmbrosiaGenerationSpeed,
    'Total2'
  )
}

export const loadStatisticsPowderMultiplier = () => {
  loadStatistics(allPowderMultiplierStats, 'powderMultiplierStats', 'statPoM', 'PowderStat', calculatePowderConversion)
}

export const loadStatisticsGoldenQuarkMultipliers = () => {
  loadStatistics(
    allGoldenQuarkMultiplierStats,
    'goldenQuarkMultiplierStats',
    'statGQMS',
    'GoldenQuarkStat',
    calculateGoldenQuarks
  )
}

export const loadStatisticsGoldenQuarkCost = () => {
  loadStatistics(
    allGoldenQuarkPurchaseCostStats,
    'goldenQuarkPurchaseCostStats',
    'statGQC',
    'GoldenQuarkCostStat',
    calculateGoldenQuarkCost
  )
}

export const loadAddCodeEffects = () => {
  loadStatistics(allAddCodeEffectStats, 'addCodeEffects', 'statACEf', 'addCodeEffectStat', () => 0, '', false)
}

export const loadAddCodeTimeStats = () => {
  loadStatistics(allAddCodeTimerStats, 'addCodeTimer', 'statACTi', 'addCodeTimerStat', addCodeInterval)
}

export const loadAddCodeCapacityStats = () => {
  loadStatistics(allAddCodeCapacityStats, 'addCodeCapacity', 'statACC', 'addCodeCapacityStat', addCodeMaxUsesAdditive)
  loadStatistics(
    allAddCodeCapacityMultiplierStats,
    'addCodeCapacity',
    'statACC2',
    'addCodeCapacityStat2',
    addCodeMaxUses,
    'Total2'
  )
  DOMCacheGetOrSet('stat+next').innerHTML = i18next.t('statistics.nextAdd', {
    time: format(addCodeTimeToNextUse(), 0, true)
  })
}

export const loadLuckConversionStats = () => {
  loadStatistics(allLuckConversionStats, 'luckConversionStats', 'statLC', 'LuckConversionStat', calculateLuckConversion)
}

export const loadRedAmbrosiaLuckStats = () => {
  loadStatistics(
    allRedAmbrosiaLuckStats,
    'redAmbrosiaLuckStats',
    'statRAL',
    'redAmbrosiaLuckStat',
    calculateRedAmbrosiaLuck
  )
}

export const loadRedAmbrosiaGenerationStats = () => {
  loadStatistics(
    allRedAmbrosiaGenerationSpeedStats,
    'redAmbrosiaGenerationStats',
    'statRAGM',
    'redAmbrosiaGenStat',
    calculateRedAmbrosiaGenerationSpeed
  )
}

export const loadShopVoucherStats = () => {
  loadStatistics(
    infinityShopUpgrades,
    'shopVoucherStats',
    'statSV',
    'ShopVoucherStat',
    () => 0,
    '',
    false
  )
  loadStatistics(
    allShopTablets,
    'shopVoucherStats',
    'statSV2',
    'ShopVoucherStat2',
    calculateFreeShopInfinityUpgrades
  )
}

export const loadMiscellaneousStats = () => {
  loadStatistics(allMiscStats, 'miscStats', 'sMisc', 'miscStat', () => 0, '', false)
  DOMCacheGetOrSet('gameStageStatistic').innerHTML = i18next.t('statistics.gameStage', { stage: synergismStage(0) })
}

export const c15RewardUpdate = () => {
  type Key = keyof GlobalVariables['challenge15Rewards']
  const e = player.challenge15Exponent

  for (const [k, v] of Object.entries(G.challenge15Rewards)) {
    const key = k as Key
    // Reset values
    v.value = v.baseValue

    if (e >= v.requirement) {
      v.value = G.c15RewardFormulae[key](e)
    }
  }

  if (G.challenge15Rewards.challengeHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.challenge.unlock('the Hepteract of Challenge')
  }
  if (G.challenge15Rewards.abyssHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.abyss.unlock('the Hepteract of the Abyss')
  }
  if (G.challenge15Rewards.acceleratorHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.accelerator.unlock('the Hepteract of Way Too Many Accelerators')
  }
  if (G.challenge15Rewards.acceleratorBoostHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.acceleratorBoost.unlock('the Hepteract of Way Too Many Accelerator Boosts')
  }
  if (G.challenge15Rewards.multiplierHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.multiplier.unlock('the Hepteract of Way Too Many Multipliers')
  }

  updateDisplayC15Rewards()
}

const updateDisplayC15Rewards = () => {
  DOMCacheGetOrSet('c15Reward0').innerHTML = i18next.t('wowCubes.platonicUpgrades.c15Rewards.0', {
    exponent: format(player.challenge15Exponent, 3, true)
  })
  DOMCacheGetOrSet('c15RequiredExponent').innerHTML = i18next.t(
    'wowCubes.platonicUpgrades.c15Rewards.requiredExponent',
    {
      coins: format(Decimal.pow(10, player.challenge15Exponent / challenge15ScoreMultiplier()), 0, true)
    }
  )

  const rewardDiv = DOMCacheGetOrSet('c15Rewards')
  let lowestMissingExponent = Number.MAX_VALUE
  for (const [k, v] of Object.entries(G.challenge15Rewards)) {
    const key = k as Challenge15Rewards
    const value = v.value
    const requirement = v.requirement

    if (!LOADED_STATS_HTMLS.challenge15) {
      const elm = document.createElement('p')
      elm.id = `c15Reward${key}`
      elm.className = 'challengePortion'

      if (v.HTMLColor !== undefined) {
        elm.style.color = v.HTMLColor
      }

      rewardDiv.appendChild(elm)
    }

    const elm = DOMCacheGetOrSet(`c15Reward${key}`)
    if (player.challenge15Exponent >= requirement) {
      elm.style.display = player.challenge15Exponent >= requirement ? 'block' : 'none'
      if (typeof value === 'number') {
        elm.innerHTML = i18next.t(`wowCubes.platonicUpgrades.c15Rewards.${key}`, {
          amount: formatAsPercentIncrease(value, 2)
        })
      } else {
        // Do not pass boolean value (all texts will say 'Unlocked' as you cannot see rewards not yet earned)
        elm.textContent = i18next.t(`wowCubes.platonicUpgrades.c15Rewards.${key}`)
      }
    } else {
      elm.style.display = 'none'
      if (requirement < lowestMissingExponent) {
        lowestMissingExponent = requirement
      }
    }
  }

  if (lowestMissingExponent < Number.MAX_VALUE) {
    DOMCacheGetOrSet('c15NextReward').innerHTML = i18next.t(
      'wowCubes.platonicUpgrades.c15Rewards.nextReward',
      { exponent: format(lowestMissingExponent, 0, true) }
    )
  } else {
    DOMCacheGetOrSet('c15NextReward').innerHTML = i18next.t('wowCubes.platonicUpgrades.c15Rewards.allUnlocked')
  }
  LOADED_STATS_HTMLS.challenge15 = true
}

interface Stage {
  stage: number
  tier: number
  name: string
  unlocked: boolean
  reset: boolean
}

export const gameStages = (): Stage[] => {
  const stages: Stage[] = [
    { stage: 0, tier: 1, name: 'start', unlocked: true, reset: true },
    {
      stage: 1,
      tier: 1,
      name: 'start-prestige',
      unlocked: player.unlocks.prestige,
      reset: player.unlocks.prestige
    },
    {
      stage: 2,
      tier: 2,
      name: 'prestige-transcend',
      unlocked: player.unlocks.transcend,
      reset: player.unlocks.transcend
    },
    {
      stage: 3,
      tier: 3,
      name: 'transcend-reincarnate',
      unlocked: player.unlocks.reincarnate,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 4,
      tier: 4,
      name: 'reincarnate-ant',
      unlocked: player.firstOwnedAnts !== 0,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 5,
      tier: 4,
      name: 'ant-sacrifice',
      unlocked: player.achievements[173] === 1,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 6,
      tier: 4,
      name: 'sacrifice-ascension',
      unlocked: player.achievements[183] === 1,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 7,
      tier: 5,
      name: 'ascension-challenge10',
      unlocked: player.ascensionCount > 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 8,
      tier: 5,
      name: 'challenge10-challenge11',
      unlocked: player.achievements[197] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 9,
      tier: 5,
      name: 'challenge11-challenge12',
      unlocked: player.achievements[204] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 10,
      tier: 5,
      name: 'challenge12-challenge13',
      unlocked: player.achievements[211] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 11,
      tier: 5,
      name: 'challenge13-challenge14',
      unlocked: player.achievements[218] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 12,
      tier: 5,
      name: 'challenge14-w5x10max',
      unlocked: player.cubeUpgrades[50] >= 100000,
      reset: player.achievements[183] === 1
    },
    {
      stage: 13,
      tier: 5,
      name: 'w5x10max-alpha',
      unlocked: player.platonicUpgrades[5] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 14,
      tier: 5,
      name: 'alpha-p2x1x10',
      unlocked: player.platonicUpgrades[6] >= 10,
      reset: player.achievements[183] === 1
    },
    {
      stage: 15,
      tier: 5,
      name: 'p2x1x10-p3x1',
      unlocked: player.platonicUpgrades[11] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 16,
      tier: 5,
      name: 'p3x1-beta',
      unlocked: player.platonicUpgrades[10] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 17,
      tier: 5,
      name: 'beta-1e15-expo',
      unlocked: player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement,
      reset: player.achievements[183] === 1
    },
    {
      stage: 18,
      tier: 5,
      name: '1e15-expo-omega',
      unlocked: player.platonicUpgrades[15] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 19,
      tier: 5,
      name: 'omega-singularity',
      unlocked: player.singularityCount > 0 && player.runelevels[6] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 20,
      tier: 6,
      name: 'singularity-exalt1x1',
      unlocked: player.singularityChallenges.noSingularityUpgrades.completions > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 21,
      tier: 6,
      name: 'exalt1x1-onemind',
      unlocked: player.singularityUpgrades.oneMind.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 22,
      tier: 6,
      name: 'onemind-end',
      unlocked: player.singularityUpgrades.offeringAutomatic.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 23,
      tier: 6,
      name: 'end-pen',
      unlocked: player.singularityUpgrades.ultimatePen.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 24,
      tier: 6,
      name: 'pen',
      unlocked: false,
      reset: player.highestSingularityCount > 0
    }
  ]
  return stages
}

// Calculate which progress in the game you are playing
// The progress displayed is based on Progression Chat and Questions
// This will be used to determine the behavior of the profile of the autopilot function in the future
export const synergismStage = (
  skipTier = player.singularityCount > 0 ? 5 : 0
): string => {
  const stages = gameStages()
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i]
    if (skipTier < stage.tier && (!stage.reset || !stage.unlocked)) {
      return stage.name
    }
  }
  const stagesZero = stages[0]
  return stagesZero.name
}
