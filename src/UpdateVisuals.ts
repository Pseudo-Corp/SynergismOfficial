import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { achievementLevel, achievementPoints, getAchievementReward, toNextAchievementLevelEXP } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  CalcCorruptionStuff,
  calculateActualAntSpeedMult,
  calculateAmbrosiaAdditiveLuckMult,
  calculateAmbrosiaCubeMult,
  calculateAmbrosiaGenerationSpeed,
  calculateAmbrosiaLuck,
  calculateAmbrosiaLuckRaw,
  calculateAmbrosiaQuarkMult,
  calculateAscensionCount,
  calculateBlueberryInventory,
  calculateCookieUpgrade29Luck,
  calculateCubeQuarkMultiplier,
  calculateNumberOfThresholds,
  calculateOcteractMultiplier,
  calculateRedAmbrosiaCubes,
  calculateRedAmbrosiaGenerationSpeed,
  calculateRedAmbrosiaLuck,
  calculateRedAmbrosiaObtainium,
  calculateRedAmbrosiaOffering,
  calculateRequiredBlueberryTime,
  calculateRequiredRedAmbrosiaTime,
  calculateResearchAutomaticObtainium,
  calculateSalvageRuneEXPMultiplier,
  calculateSummationNonLinear,
  calculateToNextThreshold,
  calculateTotalOcteractCubeBonus,
  calculateTotalOcteractObtainiumBonus,
  calculateTotalOcteractOfferingBonus,
  calculateTotalOcteractQuarkBonus,
  calculateTotalSalvage
} from './Calculate'
import { CalcECC, challengeDisplay } from './Challenges'
import { version } from './Config'
import {
  calculateAcceleratorCubeBlessing,
  calculateAntELOCubeBlessing,
  calculateAntSacrificeCubeBlessing,
  calculateAntSpeedCubeBlessing,
  calculateGlobalSpeedCubeBlessing,
  calculateMultiplierCubeBlessing,
  calculateObtainiumCubeBlessing,
  calculateOfferingCubeBlessing,
  calculateRuneEffectivenessCubeBlessing,
  calculateSalvageCubeBlessing,
  type IMultiBuy
} from './Cubes'
import { BuffType, consumableEventBuff, eventBuffType, getEvent, getEventBuff } from './Event'
import { calculateBaseAntsToBeGenerated } from './Features/Ants/AntProducers/lib/calculate-production'
import { hasEnoughCrumbsForSacrifice, MINIMUM_CRUMBS_FOR_SACRIFICE } from './Features/Ants/AntSacrifice/constants'
import { getAntUpgradeEffect } from './Features/Ants/AntUpgrades/lib/upgrade-effects'
import { AntUpgrades } from './Features/Ants/AntUpgrades/structs/structs'
import { updateLeaderboardUI } from './Features/Ants/HTML/updates/leaderboard'
import { showLockedSacrifice, showSacrifice } from './Features/Ants/HTML/updates/sacrifice'
import { autoAntSacrificeModeDescHTML } from './Features/Ants/HTML/updates/toggles/sacrifice-mode'
import { AntProducers } from './Features/Ants/structs/structs'
import { getFinalHepteractCap, type HepteractKeys, hepteractKeys, hepteracts } from './Hepteracts'
import {
  calculateAcceleratorHypercubeBlessing,
  calculateAntELOHypercubeBlessing,
  calculateAntSacrificeHypercubeBlessing,
  calculateAntSpeedHypercubeBlessing,
  calculateGlobalSpeedHypercubeBlessing,
  calculateMultiplierHypercubeBlessing,
  calculateObtainiumHypercubeBlessing,
  calculateOfferingHypercubeBlessing,
  calculateRuneEffectivenessHypercubeBlessing,
  calculateSalvageHypercubeBlessing
} from './Hypercubes'
import { allDurableConsumables, type PseudoCoinConsumableNames } from './Login'
import { getOcteractUpgradeCostTNL, type OcteractDataKeys, octeractUpgrades } from './Octeracts'
import {
  calculateAscensionScorePlatonicBlessing,
  calculateCubeMultiplierPlatonicBlessing,
  calculateGlobalSpeedPlatonicBlessing,
  calculateHypercubeBlessingMultiplierPlatonicBlessing,
  calculateHypercubeMultiplierPlatonicBlessing,
  calculatePlatonicMultiplierPlatonicBlessing,
  calculateTaxPlatonicBlessing,
  calculateTesseractMultiplierPlatonicBlessing
} from './PlatonicCubes'
import { getQuarkBonus, quarkHandler } from './Quark'
import { runeBlessingKeys, updateRuneBlessingHTML } from './RuneBlessings'
import { type RuneKeys, updateRuneHTML } from './Runes'
import { runeSpiritKeys, updateRuneSpiritHTML } from './RuneSpirits'
import { getShopCosts, isShopUpgradeUnlocked, shopData, shopUpgradeTypes } from './Shop'
import {
  computeGQUpgradeFreeLevelSoftcap,
  computeGQUpgradeMaxLevel,
  getGoldenQuarkCost,
  getGQUpgradeCostTNL,
  getGQUpgradeEffect,
  goldenQuarkUpgrades,
  type SingularityDataKeys
} from './singularity'
import { loadStatisticsUpdate } from './Statistics'
import {
  calculateBuildingPower,
  calculateBuildingPowerCoinMultiplier,
  calculateCrystalCoinMultiplier,
  calculateCrystalExponent,
  format,
  formatAsPercentIncrease,
  formatDecimalAsPercentIncrease,
  formatTimeShort,
  player
} from './Synergism'
import { getActiveSubTab, Tabs } from './Tabs'
import { getTalismanLevelCap, type TalismanKeys, talismans, updateAllTalismanHTML } from './Talismans'
import {
  calculateAcceleratorTesseractBlessing,
  calculateAntELOTesseractBlessing,
  calculateAntSacrificeTesseractBlessing,
  calculateAntSpeedTesseractBlessing,
  calculateGlobalSpeedTesseractBlessing,
  calculateMultiplierTesseractBlessing,
  calculateObtainiumTesseractBlessing,
  calculateOfferingTesseractBlessing,
  calculateRuneEffectivenessTesseractBlessing,
  calculateSalvageTesseractBlessing
} from './Tesseracts'
import type { Player, ZeroToFour } from './types/Synergism'
import { updateChallengeDisplay } from './UpdateHTML'
import { sumContents, timeRemainingHours } from './Utility'
import { Globals as G } from './Variables'

export const visualUpdateBuildings = () => {
  if (G.currentTab !== Tabs.Buildings) {
    return
  }

  // When you're in Building --> Coin, update these.
  if (G.buildingSubTab === 'coin') {
    // For the display of Coin Buildings
    const upper = [
      'produceFirst',
      'produceSecond',
      'produceThird',
      'produceFourth',
      'produceFifth'
    ] as const
    const names = [
      null,
      'workers',
      'investments',
      'printers',
      'coinMints',
      'alchemies'
    ]

    let totalProductionDivisor = new Decimal(G.produceTotal)
    if (totalProductionDivisor.equals(0)) {
      totalProductionDivisor = new Decimal(1)
    }

    DOMCacheGetOrSet('coinInformation').innerHTML = i18next.t('buildings.coinInformation', {
      coins: format(player.coins, 2, false),
      coinsPerSecond: format(
        Decimal.min(
          G.producePerSecond.dividedBy(G.taxdivisor),
          Decimal.pow(10, G.maxexponent - Decimal.log(G.taxdivisorcheck, 10))
        ),
        0,
        false
      ),
      totalGenerated: format(player.coinsTotal, 0, true)
    })

    let vanityIndex = 0
    const decimalCoin = Decimal.log10(player.coinsTotal)
    for (let i = 0; i < G.coinVanityThresholds.length; i++) {
      if (decimalCoin < G.coinVanityThresholds[i]) {
        break
      } else {
        vanityIndex += 1
      }
    }

    DOMCacheGetOrSet('coinVanity').innerHTML = `<i>${i18next.t(`buildings.coinFlavorTexts.${vanityIndex}`)}</i>`

    for (let i = 1; i <= 5; i++) {
      const place = G[upper[i - 1]]
      const ith = G.ordinals[(i - 1) as ZeroToFour]

      DOMCacheGetOrSet(`buildtext${2 * i - 1}`).textContent = i18next.t(
        `buildings.names.${names[i]}`,
        {
          amount: format(player[`${ith}OwnedCoin` as const], 0, true),
          gain: format(player[`${ith}GeneratedCoin` as const])
        }
      )

      DOMCacheGetOrSet(`buycoin${i}`).textContent = i18next.t(
        'buildings.costCoins',
        {
          coins: format(player[`${ith}CostCoin` as const])
        }
      )

      const percentage = Decimal.fromMantissaExponent(
        place.mantissa / totalProductionDivisor.mantissa,
        place.exponent - totalProductionDivisor.exponent
      ).times(100)

      DOMCacheGetOrSet(`buildtext${2 * i}`).textContent = i18next.t(
        'buildings.coinsPerSecond',
        {
          coins: format(place.dividedBy(G.taxdivisor).times(40), 0),
          percent: format(percentage, 2)
        }
      )
    }

    DOMCacheGetOrSet('buildtext11').textContent = i18next.t(
      'buildings.names.accelerators',
      {
        amount: format(player.acceleratorBought, 0, true),
        gain: format(G.freeAccelerator, 0, true)
      }
    )

    DOMCacheGetOrSet('buildtext12').textContent = i18next.t(
      'buildings.acceleratorPower',
      {
        power: format((G.acceleratorPower - 1) * 100, 2),
        mult: format(G.acceleratorEffect, 2)
      }
    )

    DOMCacheGetOrSet('buildtext13').textContent = i18next.t(
      'buildings.names.multipliers',
      {
        amount: format(player.multiplierBought, 0, true),
        gain: format(G.freeMultiplier, 0, true)
      }
    )

    DOMCacheGetOrSet('buildtext14').textContent = i18next.t(
      'buildings.multiplierPower',
      {
        power: format(G.multiplierPower, 2),
        mult: format(G.multiplierEffect, 2)
      }
    )

    DOMCacheGetOrSet('buildtext15').textContent = i18next.t(
      'buildings.names.acceleratorBoost',
      {
        amount: format(player.acceleratorBoostBought, 0, true),
        gain: format(G.freeAcceleratorBoost, 0, false)
      }
    )

    DOMCacheGetOrSet('buildtext16').textContent = i18next.t(
      'buildings.acceleratorBoost',
      {
        amount: format(
          100 * (0.01 * G.tuSevenMulti * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20)),
          2
        ),
        accelsPerBoost: format(
          5
            + 2 * player.researches[18]
            + 2 * player.researches[19]
            + 3 * player.researches[20]
            + (calculateAcceleratorCubeBlessing()),
          0,
          true
        )
      }
    )

    DOMCacheGetOrSet('buyaccelerator').textContent = i18next.t(
      'buildings.costCoins',
      {
        coins: format(player.acceleratorCost)
      }
    )
    DOMCacheGetOrSet('buymultiplier').textContent = i18next.t(
      'buildings.costCoins',
      {
        coins: format(player.multiplierCost)
      }
    )
    DOMCacheGetOrSet('buyacceleratorboost').textContent = i18next.t(
      'buildings.costDiamonds',
      {
        diamonds: format(player.acceleratorBoostCost)
      }
    )

    // update the tax text
    let warning = ''
    if (player.reincarnationCount > 0.5) {
      warning = i18next.t('buildings.taxWarning', {
        gain: format(
          Decimal.pow(10, G.maxexponent - Decimal.log(G.taxdivisorcheck, 10))
        )
      })
    }
    DOMCacheGetOrSet('taxinfo').textContent = i18next.t(
      'buildings.excessiveWealth',
      {
        div: format(G.taxdivisor, 2),
        warning
      }
    )
  } else if (G.buildingSubTab === 'diamond') {
    // For the display of Diamond Buildings
    const upper = [
      'produceFirstDiamonds',
      'produceSecondDiamonds',
      'produceThirdDiamonds',
      'produceFourthDiamonds',
      'produceFifthDiamonds'
    ] as const
    const names = [
      'refineries',
      'coalPlants',
      'coalRigs',
      'pickaxes',
      'pandorasBoxes'
    ]
    const perSecNames = ['crystal', 'ref', 'plants', 'rigs', 'pickaxes']

    const crystalExponent = calculateCrystalExponent()
    const crystalCoinMult = calculateCrystalCoinMultiplier(crystalExponent)
    DOMCacheGetOrSet('prestigeshardinfo').innerHTML = i18next.t(
      'buildings.crystalMult',
      {
        crystals: format(player.prestigeShards, 2),
        gain: format(crystalCoinMult, 2),
        exponent: format(crystalExponent, 2, true)
      }
    )

    for (let i = 1; i <= 5; i++) {
      const place = G[upper[i - 1]]
      const ith = G.ordinals[(i - 1) as ZeroToFour]

      DOMCacheGetOrSet(`prestigetext${2 * i - 1}`).textContent = i18next.t(
        `buildings.names.${names[i - 1]}`,
        {
          amount: format(player[`${ith}OwnedDiamonds` as const], 0, true),
          gain: format(player[`${ith}GeneratedDiamonds` as const], 2)
        }
      )

      DOMCacheGetOrSet(`prestigetext${2 * i}`).textContent = i18next.t(
        `buildings.per.${perSecNames[i - 1]}`,
        {
          amount: format(place.times(40), 2)
        }
      )

      DOMCacheGetOrSet(`buydiamond${i}`).textContent = i18next.t(
        'buildings.costDiamonds',
        {
          diamonds: format(player[`${ith}CostDiamonds` as const], 2)
        }
      )
    }

    if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
      const p = Decimal.pow(
        10,
        Decimal.log(G.prestigePointGain.add(1), 10)
          - Decimal.log(player.prestigePoints.sub(1), 10)
      )
      DOMCacheGetOrSet('autoprestige').textContent = i18next.t(
        'buildings.autoPrestige',
        {
          name: 'Diamonds',
          action: 'Prestige',
          factor: format(Decimal.pow(10, player.prestigeamount)),
          mult: format(p)
        }
      )
    } else if (player.resettoggle1 === 2) {
      DOMCacheGetOrSet('autoprestige').textContent = i18next.t(
        'buildings.autoReincarnate',
        {
          name: 'Prestige',
          amount: player.prestigeamount,
          timer: format(G.autoResetTimers.prestige, 1)
        }
      )
    }
  } else if (G.buildingSubTab === 'mythos') {
    // For the display of Mythos Buildings
    const upper = [
      'produceFirstMythos',
      'produceSecondMythos',
      'produceThirdMythos',
      'produceFourthMythos',
      'produceFifthMythos'
    ] as const
    const names = [
      'augments',
      'enchantments',
      'wizards',
      'oracles',
      'grandmasters'
    ]
    const perSecNames = [
      'shards',
      'augments',
      'enchantments',
      'wizards',
      'oracles'
    ]

    DOMCacheGetOrSet('transcendshardinfo').textContent = i18next.t(
      'buildings.mythosYouHave',
      {
        shards: format(player.transcendShards, 2),
        mult: format(G.totalMultiplierBoost, 0, true)
      }
    )

    for (let i = 1; i <= 5; i++) {
      const place = G[upper[i - 1]]
      const ith = G.ordinals[(i - 1) as ZeroToFour]

      DOMCacheGetOrSet(`transcendtext${2 * i - 1}`).textContent = i18next.t(
        `buildings.names.${names[i - 1]}`,
        {
          amount: format(player[`${ith}OwnedMythos` as const], 0, true),
          gain: format(player[`${ith}GeneratedMythos` as const], 2)
        }
      )

      DOMCacheGetOrSet(`transcendtext${2 * i}`).textContent = i18next.t(
        `buildings.per.${perSecNames[i - 1]}`,
        {
          amount: format(place.times(40), 2)
        }
      )

      DOMCacheGetOrSet(`buymythos${i}`).textContent = i18next.t(
        'buildings.costMythos',
        {
          mythos: format(player[`${ith}CostMythos` as const], 2)
        }
      )
    }

    if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
      DOMCacheGetOrSet('autotranscend').textContent = i18next.t(
        'buildings.autoPrestige',
        {
          name: 'Mythos',
          action: 'Prestige',
          factor: format(Decimal.pow(10, player.transcendamount)),
          mult: format(
            Decimal.pow(
              10,
              Decimal.log(G.transcendPointGain.add(1), 10)
                - Decimal.log(player.transcendPoints.add(1), 10)
            ),
            2
          )
        }
      )
    }
    if (player.resettoggle2 === 2) {
      // TODO(@KhafraDev): i18n this
      DOMCacheGetOrSet(
        'autotranscend'
      ).textContent =
        `Transcend when the autotimer is at least ${player.transcendamount} real-life seconds. [Toggle number above]. Current timer: ${
          format(
            G.autoResetTimers.transcension,
            1
          )
        }s.`
    }
  } else if (G.buildingSubTab === 'particle') {
    // For the display of Particle Buildings
    const upper = [
      'FirstParticles',
      'SecondParticles',
      'ThirdParticles',
      'FourthParticles',
      'FifthParticles'
    ] as const
    const names = [
      'protons',
      'elements',
      'pulsars',
      'quasars',
      'galacticNuclei'
    ]
    const perSecNames = ['atoms', 'protons', 'elements', 'pulsars', 'quasars']

    for (let i = 1; i <= 5; i++) {
      const ith = G.ordinals[(i - 1) as ZeroToFour]
      const place = G[`produce${upper[i - 1]}` as const]

      DOMCacheGetOrSet(`reincarnationtext${i}`).textContent = i18next.t(
        `buildings.names.${names[i - 1]}`,
        {
          amount: format(player[`${ith}OwnedParticles` as const], 0, true),
          gain: format(player[`${ith}GeneratedParticles` as const], 2)
        }
      )
      DOMCacheGetOrSet(`reincarnationtext${i + 5}`).textContent = i18next.t(
        `buildings.per.${perSecNames[i - 1]}`,
        {
          amount: format(place.times(40), 2)
        }
      )
      DOMCacheGetOrSet(`buyparticles${i}`).textContent = i18next.t(
        'buildings.costParticles',
        {
          particles: format(player[`${ith}CostParticles` as const], 2)
        }
      )
    }

    const buildingPower = calculateBuildingPower()
    const buildingPowerMult = calculateBuildingPowerCoinMultiplier(buildingPower)

    DOMCacheGetOrSet('reincarnationshardinfo').innerHTML = i18next.t(
      'buildings.atomsYouHave',
      {
        atoms: format(player.reincarnationShards, 2),
        power: format(buildingPower, 4, true),
        mult: format(buildingPowerMult, 2, true)
      }
    )

    DOMCacheGetOrSet('reincarnationCrystalInfo').textContent = i18next.t(
      'buildings.thanksR2x14',
      {
        mult: format(Decimal.pow(buildingPowerMult, 1 / 50), 3, false)
      }
    )

    DOMCacheGetOrSet('reincarnationMythosInfo').textContent = i18next.t(
      'buildings.thanksR2x15',
      {
        mult: format(Decimal.pow(buildingPowerMult, 1 / 250), 3, false)
      }
    )

    if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
      DOMCacheGetOrSet('autoreincarnate').textContent = i18next.t(
        'buildings.autoPrestige',
        {
          name: 'Particles',
          action: 'Reincarnate',
          factor: format(Decimal.pow(10, player.reincarnationamount)),
          mult: format(
            Decimal.pow(
              10,
              Decimal.log(G.reincarnationPointGain.add(1), 10)
                - Decimal.log(player.reincarnationPoints.add(1), 10)
            ),
            2
          )
        }
      )
    } else if (player.resettoggle3 === 2) {
      DOMCacheGetOrSet('autoreincarnate').textContent = i18next.t(
        'buildings.autoReincarnate',
        {
          name: 'Reincarnate',
          amount: player.reincarnationamount,
          timer: format(G.autoResetTimers.reincarnation, 1)
        }
      )
    }
  } else if (G.buildingSubTab === 'tesseract') {
    const names = ['dot', 'vector', 'threeSpace', 'bentTime', 'hilbertSpace']
    const perSecNames = ['constant', 'dot', 'vector', 'threeSpace', 'bentTime']

    for (let i = 1; i <= 5; i++) {
      const ascendBuildingI = `ascendBuilding${i as 1 | 2 | 3 | 4 | 5}` as const

      DOMCacheGetOrSet(`ascendText${i}`).textContent = i18next.t(
        `buildings.names.${names[i - 1]}`,
        {
          amount: format(player[ascendBuildingI].owned, 0, true),
          gain: format(player[ascendBuildingI].generated, 2)
        }
      )

      DOMCacheGetOrSet(`ascendText${5 + i}`).textContent = i18next.t(
        `buildings.per.${perSecNames[i - 1]}`,
        {
          amount: format(
            (G.ascendBuildingProduction as Record<string, Decimal>)[
              G.ordinals[i - 1]
            ],
            2
          )
        }
      )

      DOMCacheGetOrSet(`buyTesseracts${i}`).textContent = i18next.t(
        'buildings.costTesseracts',
        {
          tesseracts: format(player[ascendBuildingI].cost, 0)
        }
      )
    }

    DOMCacheGetOrSet('tesseractInfo').textContent = i18next.t(
      'buildings.tesseractsYouHave',
      {
        tesseracts: format(player.wowTesseracts.valueOf())
      }
    )

    DOMCacheGetOrSet('ascendShardInfo').textContent = i18next.t(
      'buildings.constantYouHave',
      {
        const: format(player.ascendShards, 2),
        amount: format(
          Math.pow(
            Decimal.log(player.ascendShards.add(1), 10) + 1,
            1
              + (0.2 / 60)
                * player.challengecompletions[10]
                * player.upgrades[125]
              + 0.1 * player.platonicUpgrades[5]
              + 0.2 * player.platonicUpgrades[10]
              + calculateTaxPlatonicBlessing()
          ),
          4,
          true
        )
      }
    )

    if (player.resettoggle4 === 1 || player.resettoggle4 === 0) {
      DOMCacheGetOrSet('autotessbuyeramount').textContent = i18next.t(
        'buildings.autoTesseract',
        {
          tesseracts: format(player.tesseractAutoBuyerAmount)
        }
      )
    } else if (player.resettoggle4 === 2) {
      DOMCacheGetOrSet('autotessbuyeramount').textContent = i18next.t(
        'buildings.autoAscensionTesseract',
        {
          percent: format(Math.min(100, player.tesseractAutoBuyerAmount))
        }
      )
    }
  }
}

export const visualUpdateUpgrades = () => {}

export const visualUpdateAchievements = () => {
  if (G.currentTab !== Tabs.Achievements) {
    return
  }

  const tnl = toNextAchievementLevelEXP()

  DOMCacheGetOrSet('achievementprogress').textContent = i18next.t('achievements.achievementPoints', {
    x: format(achievementPoints, 0, true)
  })
  DOMCacheGetOrSet('achievementQuarkBonus').innerHTML = i18next.t('achievements.achievementLevel', {
    level: format(achievementLevel)
  })
  DOMCacheGetOrSet('achievementTNLText').innerHTML = i18next.t('achievements.achievementToNextLevel', {
    level: format(achievementLevel + 1),
    AP: format(tnl, 0, true)
  })

  if (achievementPoints < 2500) {
    DOMCacheGetOrSet('achievementProgressFill').style.width = `${Math.floor(100 * (50 - tnl) / 50)}%`
  } else {
    DOMCacheGetOrSet('achievementProgressFill').style.width = `${Math.floor(100 * (100 - tnl) / 100)}%`
  }
}

const updateOfferingAndSalvageText = () => {
  DOMCacheGetOrSet('offeringCount').textContent = i18next.t(
    'runes.offeringsYouHave',
    {
      offerings: format(player.offerings, 0, true)
    }
  )

  const calculateSalvage = calculateTotalSalvage()
  const calculateRecycle = calculateSalvageRuneEXPMultiplier()

  if (calculateSalvage >= 0) {
    DOMCacheGetOrSet('offeringRecycleInfo').textContent = i18next.t(
      'runes.recycleChance',
      {
        amount: format(calculateSalvage, 1, true),
        mult: format(calculateRecycle, 2, true)
      }
    )
  } else {
    DOMCacheGetOrSet('offeringRecycleInfo').textContent = i18next.t(
      'runes.recycleChanceDividedBy',
      {
        amount: format(calculateSalvage, 1, true),
        div: format(Decimal.pow(calculateRecycle, -1), 2, true)
      }
    )
  }
}

export const visualUpdateRunes = () => {
  if (G.currentTab !== Tabs.Runes) {
    return
  }
  if (getActiveSubTab() === 0) {
    updateOfferingAndSalvageText()
    for (const key of Object.keys(player.runes)) {
      const runeKey = key as RuneKeys
      updateRuneHTML(runeKey)
    }
  }

  if (getActiveSubTab() === 1) {
    for (const t of Object.keys(talismans) as TalismanKeys[]) {
      DOMCacheGetOrSet(`${t}TalismanLevel`).textContent = i18next.t('runes.talismans.level', {
        x: format(talismans[t].level, 0, true),
        y: format(getTalismanLevelCap(t), 0, true)
      })
    }
    updateAllTalismanHTML()
  } else if (getActiveSubTab() === 2) {
    updateOfferingAndSalvageText()
    for (const bless of runeBlessingKeys) {
      updateRuneBlessingHTML(bless)
    }
  } else if (getActiveSubTab() === 3) {
    updateOfferingAndSalvageText()
    for (const spirit of runeSpiritKeys) {
      updateRuneSpiritHTML(spirit)
    }
  }
}

export const visualUpdateChallenges = () => {
  if (G.currentTab !== Tabs.Challenges) {
    return
  }
  updateChallengeDisplay()
  if (G.challengefocus !== 0) {
    challengeDisplay(G.challengefocus)
  }
  if (player.researches[150] > 0) {
    DOMCacheGetOrSet('autoIncrementerAmount').innerHTML = i18next.t(
      'challenges.autoTimer',
      {
        time: format(G.autoChallengeTimerIncrement, 2)
      }
    )
  }
}

export const visualUpdateResearch = () => {
  if (G.currentTab !== Tabs.Research) {
    return
  }

  if (player.researches[61] > 0) {
    DOMCacheGetOrSet('automaticobtainium').innerHTML = i18next.t(
      'researches.thanksToResearches',
      {
        x: format(
          calculateResearchAutomaticObtainium(1),
          3,
          true
        )
      }
    )
  }
}

export const visualUpdateAnts = () => {
  if (G.currentTab !== Tabs.AntHill) {
    return
  }
  const antSpeedMult = calculateActualAntSpeedMult()
  const firstTierProduction = calculateBaseAntsToBeGenerated(AntProducers.Workers, antSpeedMult)
  DOMCacheGetOrSet('crumbcount').textContent = i18next.t(
    'ants.galacticCrumbCount',
    {
      x: format(player.ants.crumbs, 2, true, undefined, undefined, true)
    }
  )

  DOMCacheGetOrSet('crumbsPerSecond').textContent = i18next.t(
    'ants.crumbsPerSecond',
    {
      x: format(firstTierProduction, 2, true, undefined, undefined, true)
    }
  )
  DOMCacheGetOrSet('crumbCoinMultiplier').textContent = i18next.t(
    'ants.crumbsCoinMultiplier',
    {
      x: format(getAntUpgradeEffect(AntUpgrades.Coins).coinMultiplier, 2, true)
    }
  )

  autoAntSacrificeModeDescHTML(player.ants.toggles.autoSacrificeMode)
  DOMCacheGetOrSet('sacrificeSecondsElapsed').innerHTML = i18next.t('ants.timeElapsed', {
    x: format(player.antSacrificeTimerReal, 2, true)
  })

  if (player.ants.crumbsThisSacrifice.gte(MINIMUM_CRUMBS_FOR_SACRIFICE)) {
    DOMCacheGetOrSet('antSacrificeRequired').innerHTML = i18next.t('ants.altar.sacrificeReady.unlocked')
  } else {
    DOMCacheGetOrSet('antSacrificeRequired').innerHTML = i18next.t('ants.altar.sacrificeReady.locked', {
      x: format(player.ants.crumbsThisSacrifice, 0, true),
      y: format(MINIMUM_CRUMBS_FOR_SACRIFICE, 0, true)
    })
  }

  if (getAchievementReward('antSacrificeUnlock')) {
    DOMCacheGetOrSet('antSacrificeTimer').textContent = `⧖ ${
      formatTimeShort(
        player.antSacrificeTimer
      )
    }`
    showSacrifice()
    updateLeaderboardUI()

    if (hasEnoughCrumbsForSacrifice(player.ants.crumbsThisSacrifice)) {
      DOMCacheGetOrSet('antSacrifice').classList.add('canAntSacrifice')
    } else {
      DOMCacheGetOrSet('antSacrifice').classList.remove('canAntSacrifice')
    }
  } else {
    showLockedSacrifice()
  }
}

interface cubeNames {
  cube: number
  tesseract: number
  hypercube: number
  platonicCube: number
}

export const visualUpdateCubes = () => {
  if (G.currentTab !== Tabs.WowCubes) {
    return
  }

  const cubeMult = player.shopUpgrades.cubeToQuark ? 1.5 : 1
  const tesseractMult = player.shopUpgrades.tesseractToQuark ? 1.5 : 1
  const hypercubeMult = player.shopUpgrades.hypercubeToQuark ? 1.5 : 1
  const platonicMult = 1.5

  const toNextQuark: cubeNames = {
    cube: Number(
      player.wowCubes.checkCubesToNextQuark(
        5,
        cubeMult,
        player.cubeQuarkDaily,
        player.cubeOpenedDaily
      )
    ),
    tesseract: Number(
      player.wowTesseracts.checkCubesToNextQuark(
        7,
        tesseractMult,
        player.tesseractQuarkDaily,
        player.tesseractOpenedDaily
      )
    ),
    hypercube: Number(
      player.wowHypercubes.checkCubesToNextQuark(
        10,
        hypercubeMult,
        player.hypercubeQuarkDaily,
        player.hypercubeOpenedDaily
      )
    ),
    platonicCube: Number(
      player.wowPlatonicCubes.checkCubesToNextQuark(
        15,
        platonicMult,
        player.platonicCubeQuarkDaily,
        player.platonicCubeOpenedDaily
      )
    )
  }

  const names = Object.keys(toNextQuark) as (keyof cubeNames)[]
  for (const name of names) {
    DOMCacheGetOrSet(`${name}QuarksToday`).innerHTML = i18next.t(
      `wowCubes.quarks.${name}QuarksToday`,
      {
        amount: format(player[`${name}QuarkDaily` as const])
      }
    )
    DOMCacheGetOrSet(`${name}QuarksOpenToday`).innerHTML = i18next.t(
      `wowCubes.quarks.${name}QuarksOpenToday`,
      {
        amount: format(player[`${name}OpenedDaily` as const])
      }
    )
    DOMCacheGetOrSet(`${name}QuarksOpenRequirement`).innerHTML = i18next.t(
      `wowCubes.quarks.${name}QuarksOpenRequirement`,
      { amount: format(Math.max(1, toNextQuark[name])) }
    )

    // Change color of requirement text if 1 or less required :D
    DOMCacheGetOrSet(`${name}QuarksOpenRequirement`).style.color = Math.max(1, toNextQuark[name]) === 1
      ? 'gold'
      : 'white'
  }

  // TODO: this code is fucking terrible holy shit. Also pretty sure there's a bug.
  switch (getActiveSubTab()) {
    case 0: {
      if (player.autoOpenCubes) {
        DOMCacheGetOrSet('openCubes').textContent = i18next.t(
          'wowCubes.autoOn',
          {
            percent: format(player.openCubes, 0)
          }
        )
      }
      DOMCacheGetOrSet('cubeQuantity').innerHTML = i18next.t(
        'wowCubes.cubes.inventory',
        {
          amount: format(player.wowCubes.valueOf(), 0, true)
        }
      )

      DOMCacheGetOrSet('cubeAcceleratorBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.1',
        {
          amount: format(player.cubeBlessings.accelerator, 0, true),
          bonus: format(calculateAcceleratorCubeBlessing(), 3, true)
        }
      )

      DOMCacheGetOrSet('cubeMultiplierBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.2',
        {
          amount: format(player.cubeBlessings.multiplier, 0, true),
          bonus: formatAsPercentIncrease(calculateMultiplierCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeOfferingBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.3',
        {
          amount: format(player.cubeBlessings.offering, 0, true),
          bonus: formatAsPercentIncrease(calculateOfferingCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeSalvageBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.4',
        {
          amount: format(player.cubeBlessings.runeExp, 0, true),
          bonus: format(calculateSalvageCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeObtainiumBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.5',
        {
          amount: format(player.cubeBlessings.obtainium, 0, true),
          bonus: formatAsPercentIncrease(calculateObtainiumCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeAntSpeedBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.6',
        {
          amount: format(player.cubeBlessings.antSpeed, 0, true),
          bonus: formatDecimalAsPercentIncrease(calculateAntSpeedCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeAntSacrificeBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.7',
        {
          amount: format(player.cubeBlessings.antSacrifice, 0, true),
          bonus: formatDecimalAsPercentIncrease(calculateAntSacrificeCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeAntELOBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.8',
        {
          amount: format(player.cubeBlessings.antELO, 0, true),
          bonus: formatAsPercentIncrease(calculateAntELOCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeRuneEffectBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.9',
        {
          amount: format(player.cubeBlessings.talismanBonus, 0, true),
          bonus: formatAsPercentIncrease(calculateRuneEffectivenessCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeGlobalSpeedBonus').innerHTML = i18next.t(
        'wowCubes.cubes.items.10',
        {
          amount: format(player.cubeBlessings.globalSpeed, 0, true),
          bonus: formatAsPercentIncrease(calculateGlobalSpeedCubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('cubeBlessingsTotal').innerHTML = i18next.t(
        'wowCubes.cubes.total',
        {
          amount: format(sumContents(Object.values(player.cubeBlessings)), 0, true)
        }
      )

      const sumOfTributes = sumContents(Object.values(player.cubeBlessings))

      DOMCacheGetOrSet('cubeFull').innerHTML = sumOfTributes >= 1e300
        ? i18next.t('wowCubes.cubes.full')
        : ''
      break
    }
    case 1: {
      if (player.autoOpenTesseracts) {
        DOMCacheGetOrSet('openTesseracts').textContent = i18next.t(
          'wowCubes.autoOn',
          {
            percent: format(player.openTesseracts, 0)
          }
        )
      }
      DOMCacheGetOrSet('tesseractQuantity').innerHTML = i18next.t(
        'wowCubes.tesseracts.inventory',
        {
          amount: format(player.wowTesseracts.valueOf(), 0, true)
        }
      )

      DOMCacheGetOrSet('tesseractAcceleratorBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.1',
        {
          amount: format(player.tesseractBlessings.accelerator, 0, true),
          bonus: formatAsPercentIncrease(calculateAcceleratorTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractMultiplierBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.2',
        {
          amount: format(player.tesseractBlessings.multiplier, 0, true),
          bonus: formatAsPercentIncrease(calculateMultiplierTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractOfferingBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.3',
        {
          amount: format(player.tesseractBlessings.offering, 0, true),
          bonus: formatAsPercentIncrease(calculateOfferingTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractSalvageBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.4',
        {
          amount: format(player.tesseractBlessings.runeExp, 0, true),
          bonus: formatAsPercentIncrease(calculateSalvageTesseractBlessing(), 2),
          cap: formatAsPercentIncrease(1 + 0.5 * calculateSalvageHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractObtainiumBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.5',
        {
          amount: format(player.tesseractBlessings.obtainium, 0, true),
          bonus: formatAsPercentIncrease(calculateObtainiumTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractAntSpeedBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.6',
        {
          amount: format(player.tesseractBlessings.antSpeed, 0, true),
          bonus: formatDecimalAsPercentIncrease(calculateAntSpeedTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractAntSacrificeBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.7',
        {
          amount: format(player.tesseractBlessings.antSacrifice, 0, true),
          bonus: formatAsPercentIncrease(calculateAntSacrificeTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractAntELOBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.8',
        {
          amount: format(player.tesseractBlessings.antELO, 0, true),
          bonus: formatAsPercentIncrease(calculateAntELOTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractRuneEffectBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.9',
        {
          amount: format(player.tesseractBlessings.talismanBonus, 0, true),
          bonus: formatAsPercentIncrease(calculateRuneEffectivenessTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractGlobalSpeedBonus').innerHTML = i18next.t(
        'wowCubes.tesseracts.items.10',
        {
          amount: format(player.tesseractBlessings.globalSpeed, 0, true),
          bonus: formatAsPercentIncrease(calculateGlobalSpeedTesseractBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('tesseractBlessingsTotal').innerHTML = i18next.t(
        'wowCubes.tesseracts.total',
        {
          amount: format(
            sumContents(Object.values(player.tesseractBlessings)),
            0,
            true
          )
        }
      )
      break
    }
    case 2: {
      if (player.autoOpenHypercubes) {
        DOMCacheGetOrSet('openHypercubes').textContent = i18next.t(
          'wowCubes.autoOn',
          {
            percent: format(player.openHypercubes, 0)
          }
        )
      }
      DOMCacheGetOrSet('hypercubeQuantity').innerHTML = i18next.t(
        'wowCubes.hypercubes.inventory',
        {
          amount: format(player.wowHypercubes.valueOf(), 0, true)
        }
      )

      DOMCacheGetOrSet('hypercubeAcceleratorBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.1',
        {
          amount: format(player.hypercubeBlessings.accelerator, 0, true),
          bonus: formatAsPercentIncrease(calculateAcceleratorHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeMultiplierBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.2',
        {
          amount: format(player.hypercubeBlessings.multiplier, 0, true),
          bonus: formatAsPercentIncrease(calculateMultiplierHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeOfferingBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.3',
        {
          amount: format(player.hypercubeBlessings.offering, 0, true),
          bonus: formatAsPercentIncrease(calculateOfferingHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeSalvageBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.4',
        {
          amount: format(player.hypercubeBlessings.runeExp, 0, true),
          bonus: formatAsPercentIncrease(calculateSalvageHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeObtainiumBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.5',
        {
          amount: format(player.hypercubeBlessings.obtainium, 0, true),
          bonus: formatAsPercentIncrease(calculateObtainiumHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeAntSpeedBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.6',
        {
          amount: format(player.hypercubeBlessings.antSpeed, 0, true),
          bonus: formatAsPercentIncrease(calculateAntSpeedHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeAntSacrificeBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.7',
        {
          amount: format(player.hypercubeBlessings.antSacrifice, 0, true),
          bonus: formatAsPercentIncrease(calculateAntSacrificeHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeAntELOBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.8',
        {
          amount: format(player.hypercubeBlessings.antELO, 0, true),
          bonus: formatAsPercentIncrease(calculateAntELOHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeRuneEffectBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.9',
        {
          amount: format(player.hypercubeBlessings.talismanBonus, 0, true),
          bonus: formatAsPercentIncrease(calculateRuneEffectivenessHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeGlobalSpeedBonus').innerHTML = i18next.t(
        'wowCubes.hypercubes.items.10',
        {
          amount: format(player.hypercubeBlessings.globalSpeed, 0, true),
          bonus: formatAsPercentIncrease(calculateGlobalSpeedHypercubeBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('hypercubeBlessingsTotal').innerHTML = i18next.t(
        'wowCubes.hypercubes.total',
        {
          amount: format(
            sumContents(Object.values(player.hypercubeBlessings)),
            0,
            true
          )
        }
      )
      break
    }
    case 3: {
      if (player.autoOpenPlatonicsCubes) {
        DOMCacheGetOrSet('openPlatonicCube').textContent = i18next.t(
          'wowCubes.autoOn',
          {
            percent: format(player.openPlatonicsCubes, 0)
          }
        )
      }
      DOMCacheGetOrSet('platonicQuantity').innerHTML = i18next.t(
        'wowCubes.platonics.inventory',
        {
          amount: format(player.wowPlatonicCubes.valueOf(), 0, true)
        }
      )

      DOMCacheGetOrSet('platonicCubeMultiplierBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.1',
        {
          amount: format(player.platonicBlessings.cubes, 0, true),
          bonus: formatAsPercentIncrease(calculateCubeMultiplierPlatonicBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('platonicTesseractMultiplierBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.2',
        {
          amount: format(player.platonicBlessings.tesseracts, 0, true),
          bonus: formatAsPercentIncrease(calculateTesseractMultiplierPlatonicBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('platonicHypercubeMultiplierBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.3',
        {
          amount: format(player.platonicBlessings.hypercubes, 0, true),
          bonus: formatAsPercentIncrease(calculateHypercubeMultiplierPlatonicBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('platonicPlatonicMultiplierBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.4',
        {
          amount: format(player.platonicBlessings.platonics, 0, true),
          bonus: formatAsPercentIncrease(calculatePlatonicMultiplierPlatonicBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('platonicHypercubeBlessingBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.5',
        {
          amount: format(player.platonicBlessings.hypercubeBonus, 0, true),
          bonus: formatAsPercentIncrease(calculateHypercubeBlessingMultiplierPlatonicBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('platonicTaxBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.6',
        {
          amount: format(player.platonicBlessings.taxes, 0, true),
          bonus: format(calculateTaxPlatonicBlessing(), 3, true)
        }
      )

      DOMCacheGetOrSet('platonicAscensionScoreBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.7',
        {
          amount: format(player.platonicBlessings.scoreBonus, 0, true),
          bonus: formatAsPercentIncrease(calculateAscensionScorePlatonicBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('platonicGlobalSpeedBonus').innerHTML = i18next.t(
        'wowCubes.platonics.items.8',
        {
          amount: format(player.platonicBlessings.globalSpeed, 0, true),
          bonus: formatAsPercentIncrease(calculateGlobalSpeedPlatonicBlessing(), 2)
        }
      )

      DOMCacheGetOrSet('platonicBlessingsTotal').innerHTML = i18next.t(
        'wowCubes.platonics.total',
        {
          amount: format(sumContents(Object.values(player.platonicBlessings)), 0, true)
        }
      )
      break
    }
    case 4:
      DOMCacheGetOrSet('cubeAmount2').textContent = `You have ${
        format(
          player.wowCubes.valueOf(),
          0,
          true
        )
      } Wow! Cubes =)`
      break
    case 5:
      break
    case 6:
      DOMCacheGetOrSet('hepteractQuantity').innerHTML = i18next.t(
        'wowCubes.hepteractForge.youPossessHepteracts',
        {
          x: format(player.wowAbyssals, 0, true)
        }
      )

      // Update the grid
      for (const key of hepteractKeys) {
        UpdateHeptGridValues(key)
      }

      // orbs
      DOMCacheGetOrSet('heptGridOrbBalance').textContent = format(
        player.overfluxOrbs
      )
      DOMCacheGetOrSet('heptGridOrbEffect').textContent = `${
        format(
          100 * (-1 + calculateCubeQuarkMultiplier()),
          2,
          true
        )
      }%`

      // powder
      DOMCacheGetOrSet('heptGridPowderBalance').textContent = format(
        player.overfluxPowder
      )
      DOMCacheGetOrSet('heptGridPowderWarps').textContent = format(
        player.dailyPowderResetUses
      )
      break
    default:
      break
  }
}

const UpdateHeptGridValues = (hept: HepteractKeys) => {
  const text = `${hept}ProgressBarText`
  const bar = `${hept}ProgressBar`
  const textEl = DOMCacheGetOrSet(text)
  const barEl = DOMCacheGetOrSet(bar)
  const unlocked = hepteracts[hept].UNLOCKED()

  if (!unlocked) {
    textEl.textContent = 'LOCKED'
    barEl.style.width = '100%'
    barEl.style.backgroundColor = 'var(--hepteract-bar-red)'
  } else {
    const balance = hepteracts[hept].BAL
    const cap = getFinalHepteractCap(hept)
    const barWidth = Math.round((balance / cap) * 100)

    let barColor = ''
    if (barWidth < 34) {
      barColor = 'var(--hepteract-bar-red)'
    } else if (barWidth >= 34 && barWidth < 68) {
      barColor = 'var(--hepteract-bar-yellow)'
    } else {
      barColor = 'var(--hepteract-bar-green)'
    }

    textEl.textContent = `${format(balance)} / ${format(cap)}`
    barEl.style.width = `${barWidth}%`
    barEl.style.backgroundColor = barColor
  }
}

export const visualUpdateCorruptions = () => {
  if (G.currentTab !== Tabs.Corruption) {
    return
  }

  const metaData = CalcCorruptionStuff()
  const ascCount = calculateAscensionCount()
  DOMCacheGetOrSet('autoAscend').innerHTML = player.autoAscendMode === 'c10Completions'
    ? i18next.t('corruptions.autoAscend.c10Completions', {
      input: format(player.autoAscendThreshold),
      completions: format(player.challengecompletions[10])
    })
    : i18next.t('corruptions.autoAscend.realTime', {
      input: format(player.autoAscendThreshold),
      time: format(player.ascensionCounterRealReal)
    })
  /*DOMCacheGetOrSet('autoAscendText').textContent = player.autoAscendMode === 'c10Completions' ? ' you\'ve completed Sadistic Challenge I a total of ' : ' the timer is at least ';
    DOMCacheGetOrSet('autoAscendMetric').textContent = format(player.autoAscendThreshold);
    DOMCacheGetOrSet('autoAscendText2').textContent = player.autoAscendMode === 'c10Completions' ? ' times, Currently ' : ' seconds (Real-time), Currently ';
    DOMCacheGetOrSet('autoAscendMetric2').textContent = player.autoAscendMode === 'c10Completions' ? String(player.challengecompletions[10]) : format(player.ascensionCounterRealReal);*/
  DOMCacheGetOrSet('corruptionBank').innerHTML = i18next.t(
    'corruptions.corruptionBank',
    {
      number: format(metaData[0], 0, true)
    }
  )
  DOMCacheGetOrSet('corruptionScore').innerHTML = i18next.t(
    'corruptions.corruptionScore',
    {
      ascScore: format(metaData[1], 1, true),
      corrMult: format(metaData[2], 1, true),
      bonusMult: format(metaData[9], 2, true),
      totalScore: format(metaData[3], 1, true)
    }
  )

  if (metaData[3] > 1e23) {
    DOMCacheGetOrSet('corruptionScoreDR').style.visibility = 'visible'
  } else {
    DOMCacheGetOrSet('corruptionScoreDR').style.visibility = 'hidden'
  }

  DOMCacheGetOrSet('corruptionCubes').innerHTML = i18next.t(
    'corruptions.corruptionCubes',
    {
      cubeAmount: format(metaData[4], 0, true)
    }
  )
  DOMCacheGetOrSet('corruptionTesseracts').innerHTML = i18next.t(
    'corruptions.corruptionTesseracts',
    {
      tesseractAmount: format(metaData[5], 0, true)
    }
  )
  DOMCacheGetOrSet('corruptionHypercubes').innerHTML = i18next.t(
    'corruptions.corruptionHypercubes',
    {
      hypercubeAmount: format(metaData[6], 0, true)
    }
  )
  DOMCacheGetOrSet('corruptionPlatonicCubes').innerHTML = i18next.t(
    'corruptions.corruptionPlatonics',
    {
      platonicAmount: format(metaData[7], 0, true)
    }
  )
  DOMCacheGetOrSet('corruptionHepteracts').innerHTML = i18next.t(
    'corruptions.corruptionHepteracts',
    {
      hepteractAmount: format(metaData[8], 0, true)
    }
  )
  DOMCacheGetOrSet('corruptionMultiplierTotal').textContent = i18next.t('corruptions.totalScoreMultiplier', {
    curr: format(player.corruptions.used.totalCorruptionAscensionMultiplier, 2, true),
    next: format(player.corruptions.next.totalCorruptionAscensionMultiplier, 2, true)
  })
  DOMCacheGetOrSet('corruptionDifficultyTotal').textContent = i18next.t('corruptions.totalDifficulty', {
    curr: format(player.corruptions.used.totalCorruptionDifficultyScore, 2, true),
    next: format(player.corruptions.next.totalCorruptionDifficultyScore, 2, true)
  })
  DOMCacheGetOrSet('corruptionSpiritTotal').textContent = i18next.t('corruptions.totalSpiritContribution', {
    curr: formatAsPercentIncrease(player.corruptions.used.totalCorruptionDifficultyMultiplier),
    next: formatAsPercentIncrease(player.corruptions.next.totalCorruptionDifficultyMultiplier)
  })

  DOMCacheGetOrSet('corruptionAscensionCount').style.display = ascCount > 1 ? 'block' : 'none'

  if (ascCount > 1) {
    DOMCacheGetOrSet('corruptionAscensionCount').innerHTML = i18next.t(
      'corruptions.ascensionCount',
      {
        ascCount: format(calculateAscensionCount())
      }
    )
  }
}

export const visualUpdateSettings = () => {
  if (G.currentTab !== Tabs.Settings) {
    return
  }

  if (getActiveSubTab() === 0) {
    DOMCacheGetOrSet('saveString').textContent = i18next.t(
      'settings.currently',
      {
        x: player.saveString.replace('$VERSION$', `v${version}`)
      }
    )

    const quarkData = quarkHandler()
    const onExportQuarks = quarkData.gain
    const maxExportQuarks = quarkData.capacity

    let goldenQuarkMultiplier = 1
    goldenQuarkMultiplier *= 1 + getQuarkBonus() / 100
    goldenQuarkMultiplier *= player.highestSingularityCount >= 100
      ? 1 + player.highestSingularityCount / 50
      : 1

    DOMCacheGetOrSet('quarktimerdisplay').textContent = i18next.t(
      'settings.exportQuark',
      {
        x: format(
          3600 / quarkData.perHour
            - (player.quarkstimer % (3600.00001 / quarkData.perHour)),
          2
        ),
        y: player.worlds.toString(1)
      }
    )
    DOMCacheGetOrSet('quarktimeramount').textContent = i18next.t(
      'settings.quarksOnExport',
      {
        x: player.worlds.toString(onExportQuarks),
        y: player.worlds.toString(maxExportQuarks)
      }
    )

    DOMCacheGetOrSet('goldenQuarkTimerDisplay').textContent = i18next.t(
      'settings.exportGoldenQuark',
      {
        x: format(
          3600
              / Math.max(
                1,
                getGQUpgradeEffect('goldenQuarks3')
              )
            - (player.goldenQuarksTimer
              % (3600.00001
                / Math.max(
                  1,
                  getGQUpgradeEffect('goldenQuarks3')
                )))
        ),
        y: format(goldenQuarkMultiplier, 2, true)
      }
    )

    DOMCacheGetOrSet('goldenQuarkTimerAmount').textContent = i18next.t(
      'settings.goldenQuarksOnExport',
      {
        x: format(
          Math.floor(
            (player.goldenQuarksTimer
              * getGQUpgradeEffect('goldenQuarks3'))
              / 3600
          ) * goldenQuarkMultiplier,
          2
        ),
        y: format(
          Math.floor(
            168
              * getGQUpgradeEffect('goldenQuarks3')
              * goldenQuarkMultiplier
          )
        )
      }
    )
  } else if (getActiveSubTab() === 3) {
    loadStatisticsUpdate()
  }
}

export const visualUpdateSingularity = () => {
  if (G.currentTab !== Tabs.Singularity) {
    return
  }
  if (getActiveSubTab() === 1) {
    DOMCacheGetOrSet('goldenQuarkamount').textContent = i18next.t(
      'singularity.goldenQuarkAmount',
      {
        goldenQuarks: format(player.goldenQuarks, 0, true)
      }
    )

    const keys = Object.keys(goldenQuarkUpgrades) as SingularityDataKeys[]
    const val = G.shopEnhanceVision

    for (const key of keys) {
      if (key === 'offeringAutomatic') {
        continue
      }
      const singItem = goldenQuarkUpgrades[key]
      const el = DOMCacheGetOrSet(key)
      if (
        singItem.maxLevel !== -1
        && singItem.level >= computeGQUpgradeMaxLevel(key)
      ) {
        el.style.filter = val ? 'brightness(.9)' : 'none'
      } else if (
        getGQUpgradeCostTNL(key) > player.goldenQuarks
        || player.singularityCount < singItem.minimumSingularity
      ) {
        el.style.filter = val ? 'grayscale(.9) brightness(.8)' : 'none'
      } else if (
        singItem.maxLevel === -1
        || singItem.level < computeGQUpgradeMaxLevel(key)
      ) {
        if (computeGQUpgradeFreeLevelSoftcap(key) > singItem.level) {
          el.style.filter = val ? 'blur(1px) invert(.9) saturate(200)' : 'none'
        } else {
          el.style.filter = val ? 'invert(.9) brightness(1.1)' : 'none'
        }
      }
    }
  } else if (getActiveSubTab() === 3) {
    const keys = Object.keys(octeractUpgrades) as OcteractDataKeys[]
    const val = G.shopEnhanceVision

    for (const key of keys) {
      const octItem = octeractUpgrades[key]
      const el = DOMCacheGetOrSet(`${String(key)}`)
      if (octItem.maxLevel !== -1 && octItem.level >= octItem.maxLevel) {
        el.style.filter = val ? 'brightness(.9)' : 'none'
      } else if (getOcteractUpgradeCostTNL(key) > player.wowOcteracts) {
        el.style.filter = val ? 'grayscale(.9) brightness(.8)' : 'none'
      } else if (octItem.maxLevel === -1 || octItem.level < octItem.maxLevel) {
        if (octItem.freeLevel > octItem.level) {
          el.style.filter = val ? 'blur(2px) invert(.9) saturate(200)' : 'none'
        } else {
          el.style.filter = val ? 'invert(.9) brightness(1.1)' : 'none'
        }
      }
    }
  }
}

export const shopMouseover = (value: boolean) => {
  G.shopEnhanceVision = value
}

export const visualUpdateOcteracts = () => {
  if (G.currentTab !== Tabs.Singularity) {
    return
  }
  DOMCacheGetOrSet('octeractAmount').innerHTML = i18next.t('octeract.amount', {
    octeracts: format(player.wowOcteracts, 2, true, true, true)
  })

  const perSecond = calculateOcteractMultiplier()

  DOMCacheGetOrSet('secondsPerOcteract').style.display = perSecond < 1 ? 'block' : 'none'
  DOMCacheGetOrSet('secondsPerOcteract').innerHTML = i18next.t(
    'octeract.secondsPerOcteract',
    {
      seconds: format(1 / perSecond, 2, true)
    }
  )
  DOMCacheGetOrSet('octeractPerSeconds').style.display = perSecond >= 1 ? 'block' : 'none'
  DOMCacheGetOrSet('octeractPerSeconds').innerHTML = i18next.t(
    'octeract.octeractsPerSecond',
    {
      octeracts: format(perSecond, 2, true)
    }
  )

  const cTOCB = (calculateTotalOcteractCubeBonus() - 1) * 100
  const cTOQB = (calculateTotalOcteractQuarkBonus() - 1) * 100
  const cTOOB = (calculateTotalOcteractOfferingBonus() - 1) * 100
  const cTOOOB = (calculateTotalOcteractObtainiumBonus() - 1) * 100
  DOMCacheGetOrSet('totalOcteractAmount').innerHTML = i18next.t(
    'octeract.totalGenerated',
    {
      octeracts: format(player.totalWowOcteracts, 2, true, true, true)
    }
  )
  DOMCacheGetOrSet('totalOcteractCubeBonus').style.display = cTOCB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractQuarkBonus').style.display = cTOQB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractOfferingBonus').style.display = cTOOB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractObtainiumBonus').style.display = cTOOOB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractCubeBonus').innerHTML = i18next.t(
    'octeract.generatedCubeBonus',
    {
      cubeBonus: format(cTOCB, 3, true)
    }
  )
  DOMCacheGetOrSet('totalOcteractQuarkBonus').innerHTML = i18next.t(
    'octeract.generatedQuarkBonus',
    {
      quarkBonus: format(cTOQB, 3, true)
    }
  )
  DOMCacheGetOrSet('totalOcteractOfferingBonus').innerHTML = i18next.t(
    'octeract.generatedOfferingBonus',
    {
      offeringBonus: format(cTOOB, 3, true)
    }
  )
  DOMCacheGetOrSet('totalOcteractObtainiumBonus').innerHTML = i18next.t(
    'octeract.generatedObtainiumBonus',
    {
      obtainiumBonus: format(cTOOOB, 3, true)
    }
  )
}

export const visualUpdateAmbrosia = () => {
  if (G.currentTab !== Tabs.Singularity) {
    return
  }

  const luck = calculateAmbrosiaLuck()
  const baseLuck = calculateAmbrosiaLuckRaw()
  const luckBonusPercent = 100 * (calculateAmbrosiaAdditiveLuckMult() - 1)
  const guaranteed = Math.floor(luck / 100)
  const chance = luck - 100 * Math.floor(luck / 100)

  const luckRed = calculateRedAmbrosiaLuck()
  const guaranteedRed = Math.floor(luckRed / 100)
  const chanceRed = luckRed - 100 * Math.floor(luckRed / 100)

  const requiredTime = calculateRequiredBlueberryTime()
  const requiredTimeRed = calculateRequiredRedAmbrosiaTime()

  const totalBlueberries = calculateBlueberryInventory()
  const availableBlueberries = totalBlueberries - player.spentBlueberries

  const totalTimePerSecond = calculateAmbrosiaGenerationSpeed()
  const totalTimePerSecondRed = calculateRedAmbrosiaGenerationSpeed()
  const barWidth = 100 * Math.min(1, player.blueberryTime / requiredTime)
  const pixelBarWidth = 100 * Math.min(1, player.redAmbrosiaTime / requiredTimeRed)

  const ambCubeBonus = calculateAmbrosiaCubeMult()
  const ambQuarkBonus = calculateAmbrosiaQuarkMult()
  const redAmbCubeBonus = calculateRedAmbrosiaCubes()
  const redAmbObtBonus = calculateRedAmbrosiaObtainium()
  const redAmbOffBonus = calculateRedAmbrosiaOffering()
  const redAmbLuckBonus = calculateCookieUpgrade29Luck()

  DOMCacheGetOrSet('ambrosiaProgress').style.width = `${barWidth}%`

  if (player.visitedAmbrosiaSubtab) {
    DOMCacheGetOrSet('ambrosiaProgressText').textContent = `${format(player.blueberryTime, 0, true)} / ${
      format(requiredTime, 0, true)
    } [+${format(totalTimePerSecond, 0, true)}/s]`
  } else {
    DOMCacheGetOrSet('ambrosiaProgressText').textContent = i18next.t('ambrosia.notUnlocked')
  }

  DOMCacheGetOrSet('pixelProgress').style.width = `${pixelBarWidth}%`

  if (player.visitedAmbrosiaSubtabRed) {
    DOMCacheGetOrSet('pixelProgressText').textContent = `${format(player.redAmbrosiaTime, 0, true)} / ${
      format(requiredTimeRed, 0, true)
    } [+${format(totalTimePerSecondRed, 2, true)}/s]`
  } else {
    DOMCacheGetOrSet('pixelProgressText').textContent = i18next.t('redAmbrosia.notUnlocked')
  }
  const extraLuckHTML = luckBonusPercent > 0.01
    ? `[<span style='color: var(--amber-text-color)'>☘${
      format(
        baseLuck,
        0,
        true
      )
    } +${format(luckBonusPercent, 2, true)}%</span>]`
    : ''

  DOMCacheGetOrSet('ambrosiaAmount').innerHTML = i18next.t('ambrosia.amount', {
    ambrosia: format(player.ambrosia, 0, true),
    lifetimeAmbrosia: format(player.lifetimeAmbrosia, 0, true)
  })

  DOMCacheGetOrSet('ambrosiaCubeBonus').style.display = ambCubeBonus > 1 ? 'block' : 'none'
  DOMCacheGetOrSet('ambrosiaQuarkBonus').style.display = ambQuarkBonus > 1 ? 'block' : 'none'

  DOMCacheGetOrSet('ambrosiaCubeBonus').innerHTML = i18next.t(
    'ambrosia.generatedCubeBonus',
    {
      cubeBonus: formatAsPercentIncrease(ambCubeBonus, 2)
    }
  )
  DOMCacheGetOrSet('ambrosiaQuarkBonus').innerHTML = i18next.t(
    'ambrosia.generatedQuarkBonus',
    {
      quarkBonus: formatAsPercentIncrease(ambQuarkBonus, 2)
    }
  )

  DOMCacheGetOrSet('redAmbrosiaAmount').innerHTML = i18next.t('redAmbrosia.amount', {
    redAmbrosia: format(player.redAmbrosia, 0, true),
    lifetimeRedAmbrosia: format(player.lifetimeRedAmbrosia, 0, true)
  })

  DOMCacheGetOrSet('redAmbrosiaCubeBonus').style.display = redAmbCubeBonus > 1 ? 'block' : 'none'
  DOMCacheGetOrSet('redAmbrosiaObtainiumBonus').style.display = redAmbObtBonus > 1 ? 'block' : 'none'
  DOMCacheGetOrSet('redAmbrosiaOfferingBonus').style.display = redAmbOffBonus > 1 ? 'block' : 'none'
  DOMCacheGetOrSet('redAmbrosiaLuckBonus').style.display = redAmbLuckBonus > 0 ? 'block' : 'none'

  DOMCacheGetOrSet('redAmbrosiaCubeBonus').innerHTML = i18next.t(
    'ambrosia.generatedCubeBonus',
    {
      cubeBonus: formatAsPercentIncrease(redAmbCubeBonus, 2)
    }
  )

  DOMCacheGetOrSet('redAmbrosiaObtainiumBonus').innerHTML = i18next.t(
    'ambrosia.generatedObtainiumBonus',
    {
      obtainiumBonus: formatAsPercentIncrease(redAmbObtBonus, 2)
    }
  )

  DOMCacheGetOrSet('redAmbrosiaOfferingBonus').innerHTML = i18next.t(
    'ambrosia.generatedOfferingBonus',
    {
      offeringBonus: formatAsPercentIncrease(redAmbOffBonus, 2)
    }
  )

  DOMCacheGetOrSet('redAmbrosiaLuckBonus').innerHTML = i18next.t(
    'ambrosia.generatedLuckBonus',
    {
      luckBonus: format(redAmbLuckBonus, 2, true)
    }
  )

  DOMCacheGetOrSet('blueberryAmount').innerHTML = i18next.t(
    'ambrosia.blueberryAmount',
    {
      unspentBlueberries: format(availableBlueberries, 0, true),
      blueberries: format(totalBlueberries, 0, true)
    }
  )

  DOMCacheGetOrSet('ambrosiaAmountPerGeneration').innerHTML = i18next.t(
    'ambrosia.perGen',
    {
      guaranteed: format(guaranteed, 0, true),
      extraChance: format(chance, 0, true),
      ambrosiaLuck: format(luck, 0, true),
      extra: extraLuckHTML
    }
  )

  DOMCacheGetOrSet('redAmbrosiaAmountPerGeneration').innerHTML = i18next.t(
    'redAmbrosia.perGen',
    {
      guaranteed: format(guaranteedRed, 0, true),
      extraChance: format(chanceRed, 0, true),
      ambrosiaLuck: format(luckRed, 0, true)
    }
  )

  if (player.cubeUpgrades[76] > 0) {
    DOMCacheGetOrSet('ambrosiaThresholdInfo').innerHTML = i18next.t(
      'ambrosia.cubeUpgradeThresholds',
      {
        threshold: calculateNumberOfThresholds(),
        toNext: format(calculateToNextThreshold(), 0, true),
        percent: player.cubeUpgrades[76] * calculateNumberOfThresholds()
      }
    )
  } else {
    DOMCacheGetOrSet('ambrosiaThresholdInfo').innerHTML = i18next.t(
      'ambrosia.timeThresholds',
      {
        threshold: calculateNumberOfThresholds(),
        toNext: format(calculateToNextThreshold(), 0, true)
      }
    )
  }
}

export const visualUpdateShop = () => {
  if (G.currentTab !== Tabs.Shop) {
    return
  }
  DOMCacheGetOrSet('quarkamount').textContent = i18next.t(
    'shop.youHaveQuarks',
    { x: format(player.worlds.valueOf(), 0, true) }
  )
  DOMCacheGetOrSet('offeringpotionowned').textContent = format(
    player.shopUpgrades.offeringPotion,
    0,
    true
  )
  DOMCacheGetOrSet('obtainiumpotionowned').textContent = format(
    player.shopUpgrades.obtainiumPotion,
    0,
    true
  )

  // Create Keys with the correct type
  const keys = Object.keys(
    player.shopUpgrades
  ) as (keyof Player['shopUpgrades'])[]
  for (const key of keys) {
    // Create a copy of shopItem instead of accessing many times
    const shopItem = shopData[key]

    if (shopItem.type === shopUpgradeTypes.CONSUMABLE) {
      const maxBuyablePotions = Math.min(
        Math.floor(Number(player.worlds) / getShopCosts(key)),
        shopItem.maxLevel - player.shopUpgrades[key]
      )
      const el = DOMCacheGetOrSet(`buy${key.toLowerCase()}`)
      switch (player.shopBuyMaxToggle) {
        case false:
          el.textContent = 'BUY: 100 Quarks Each'
          break
        case 'TEN':
          el.textContent = `+${Math.min(10, maxBuyablePotions)} for ${
            format(
              getShopCosts(key) * Math.min(10, maxBuyablePotions),
              0,
              true
            )
          } Quarks`
          break
        default:
          el.textContent = `+${maxBuyablePotions} for ${
            format(
              getShopCosts(key) * maxBuyablePotions
            )
          } Quarks`
      }
    }

    if (shopItem.type === shopUpgradeTypes.UPGRADE) {
      if (
        player.shopHideToggle
        && player.shopUpgrades[key] >= shopItem.maxLevel
        && !shopItem.refundable
      ) {
        DOMCacheGetOrSet(`${key}Hide`).style.display = 'none'
        continue
      } else {
        DOMCacheGetOrSet(`${key}Hide`).style.display = isShopUpgradeUnlocked(
            key
          )
          ? 'block'
          : 'none'
      }
      // Case: If max level is 1, then it can be considered a boolean "bought" or "not bought" item
      if (shopItem.maxLevel === 1) {
        // TODO(@KhafraDev): i18n
        DOMCacheGetOrSet(`${key}Level`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel
          ? 'Bought!'
          : 'Not Bought!'
      } else {
        // Case: max level greater than 1, treat it as a fraction out of max level
        // TODO(@KhafraDev): i18n
        DOMCacheGetOrSet(`${key}Level`).textContent = `${
          player.highestSingularityCount > 0 || player.ascensionCount > 0
            ? ''
            : 'Level '
        }${format(player.shopUpgrades[key])}/${format(shopItem.maxLevel)}`
      }
      // Handles Button - max level needs no price indicator, otherwise it's necessary

      const buyMaxAmount = shopItem.maxLevel - player.shopUpgrades[key]
      let buyData: IMultiBuy

      switch (player.shopBuyMaxToggle) {
        case false:
          DOMCacheGetOrSet(`${key}Button`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel
            ? i18next.t('shop.maxed')
            : i18next.t('shop.upgradeFor', { x: format(getShopCosts(key)) })
          break
        case 'TEN':
          buyData = calculateSummationNonLinear(
            player.shopUpgrades[key],
            shopItem.price,
            +player.worlds,
            shopItem.priceIncrease / shopItem.price,
            Math.min(10, buyMaxAmount)
          )
          DOMCacheGetOrSet(`${key}Button`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel
            ? i18next.t('shop.maxed')
            : i18next.t('shop.plusForQuarks', {
              x: format(
                buyData.levelCanBuy - player.shopUpgrades[key],
                0,
                true
              ),
              y: format(buyData.cost)
            })
          break
        default:
          buyData = calculateSummationNonLinear(
            player.shopUpgrades[key],
            shopItem.price,
            +player.worlds,
            shopItem.priceIncrease / shopItem.price,
            buyMaxAmount
          )
          DOMCacheGetOrSet(`${key}Button`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel
            ? i18next.t('shop.maxed')
            : i18next.t('shop.plusForQuarks', {
              x: format(
                buyData.levelCanBuy - player.shopUpgrades[key],
                0,
                true
              ),
              y: format(buyData.cost)
            })
      }
    }
  }

  DOMCacheGetOrSet('buySingularityQuarksAmount').textContent = player.goldenQuarks < 1000
    ? i18next.t('shop.singularityQuarkAmount', { amount: format(player.goldenQuarks) })
    : format(player.goldenQuarks)

  DOMCacheGetOrSet('buySingularityQuarksButton').textContent = i18next.t('shop.singularityQuarkCost', {
    cost: format(getGoldenQuarkCost().cost)
  })
}

export const constructConsumableTimes = (p: PseudoCoinConsumableNames) => {
  const msg: string[] = []
  for (const time of allDurableConsumables[p].ends) {
    msg.push(timeRemainingHours(new Date(time)))
  }
  return msg.join(', ')
}

export const visualUpdateEvent = () => {
  const event = getEvent()
  if (event !== null) {
    const eventEnd = new Date(event.end)
    DOMCacheGetOrSet('globalEventTimer').textContent = timeRemainingHours(eventEnd)
    DOMCacheGetOrSet('globalEventName').textContent = `(${event.name.length}) - ${event.name.join(', ')}`

    for (let i = 0; i < eventBuffType.length; i++) {
      const eventBuff = getEventBuff(BuffType[eventBuffType[i]])

      if (eventBuff !== 0) {
        DOMCacheGetOrSet(`eventBuff${eventBuffType[i]}`).style.display = 'flex'
        DOMCacheGetOrSet(`eventBuff${eventBuffType[i]}Value`).textContent = `+${format(100 * eventBuff, 0, true)}%`
      } else {
        DOMCacheGetOrSet(`eventBuff${eventBuffType[i]}`).style.display = 'none'
      }
    }
  } else {
    DOMCacheGetOrSet('globalEventTimer').textContent = '--:--:--'
    DOMCacheGetOrSet('globalEventName').textContent = ''
    for (let i = 0; i < eventBuffType.length; i++) {
      DOMCacheGetOrSet(`eventBuff${eventBuffType[i]}`).style.display = 'none'
    }
  }
  const { HAPPY_HOUR_BELL } = allDurableConsumables
  if (HAPPY_HOUR_BELL.amount > 0) {
    DOMCacheGetOrSet('consumableEventTimer').textContent = constructConsumableTimes('HAPPY_HOUR_BELL')
    DOMCacheGetOrSet('consumableEventBonus').textContent = `${HAPPY_HOUR_BELL.amount}`

    for (let i = 0; i < eventBuffType.length; i++) {
      const eventBuff = consumableEventBuff(BuffType[eventBuffType[i]])

      if (eventBuff !== 0) {
        DOMCacheGetOrSet(`consumableBuff${eventBuffType[i]}`).style.display = 'flex'
        DOMCacheGetOrSet(`consumableBuff${eventBuffType[i]}Value`).textContent = `+${format(100 * eventBuff, 1, true)}%`
      } else {
        DOMCacheGetOrSet(`consumableBuff${eventBuffType[i]}`).style.display = 'none'
      }
    }
  } else {
    DOMCacheGetOrSet('consumableEventBonus').textContent = 'No active consumable'
    DOMCacheGetOrSet('consumableEventTimer').textContent = '--:--:--'
    for (let i = 0; i < eventBuffType.length; i++) {
      DOMCacheGetOrSet(`consumableBuff${eventBuffType[i]}`).style.display = 'none'
    }
  }
}

export const visualUpdatePurchase = () => {}

export const visualUpdateCampaign = () => {}
