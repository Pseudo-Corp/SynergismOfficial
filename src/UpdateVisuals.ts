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
  calculatePurpleHoneyConversionFactor,
  calculatePurpleHoneyExtractionMultiplier,
  calculatePurpleHoneyLuck,
  calculatePurpleHoneyPerExtraction,
  calculatePurpleReactantCapacity,
  calculatePurpleReactantConversion,
  calculatePurpleReactantHalfLife,
  calculatePurpleReactantRouting,
  calculateRedAmbrosiaCubes,
  calculateRedAmbrosiaGenerationSpeed,
  calculateRedAmbrosiaLuck,
  calculateRedAmbrosiaObtainium,
  calculateRedAmbrosiaOffering,
  calculateRedAmbrosiaReactantCapacity,
  calculateRequiredBlueberryTime,
  calculateRequiredRedAmbrosiaTime,
  calculateResearchAutomaticObtainium,
  calculateSalvageRuneEXPMultiplier,
  calculateToNextThreshold,
  calculateTotalOcteractCubeBonus,
  calculateTotalOcteractObtainiumBonus,
  calculateTotalOcteractOfferingBonus,
  calculateTotalOcteractQuarkBonus,
  calculateTotalSalvage
} from './Calculate'
import { CalcECC, challengeDisplay, timeSinceLastStateChange } from './Challenges'
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
  calculateSalvageCubeBlessing
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
import type { OcteractUpgrades } from './Octeracts'
import { getOcteractUpgradeCostTNL, octeractUpgrades, updateOcteractUpgradeVisibility } from './Octeracts'
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
import {
  calculatePurpleReactorAP,
  getPurpleReactorUpgradeEffects,
  maxPurpleReactorAP,
  purpleReactorUpgrades
} from './Purple'
import { updatePurpleUpgradeTab } from './PurpleUpgradeTab'
import { getQuarkBonus, quarkHandler } from './Quark'
import { runeBlessingKeys, updateRuneBlessingHTML } from './RuneBlessings'
import { type RuneKeys, updateRuneHTML } from './Runes'
import { runeSpiritKeys, updateRuneSpiritHTML } from './RuneSpirits'
import { getShopCosts, getShopUpgradeEffects, shopUpgradeNames, shopUpgrades, shopUpgradeTypes } from './Shop'
import { updateShopTab } from './ShopTab'
import {
  computeGQUpgradeFreeLevelSoftcap,
  computeGQUpgradeMaxLevel,
  getGoldenQuarkCost,
  getGQUpgradeCostTNL,
  getGQUpgradeEffect,
  goldenQuarkUpgrades,
  type SingularityDataKeys,
  updateGoldenQuarkUpgradeVisibility
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
import { getBuildingCostElement } from './tabs/buildings'
import {
  getTalismanLevelCap,
  talismanCraftItems,
  type TalismanKeys,
  talismans,
  updateAllTalismanHTML,
  updateMobileTalismanInventoryPurchaseInfo
} from './Talismans'
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
import { AutoAscensionModes, AutoAscensionResetModes, AutoResetModes } from './Toggles'
import type { OneToFive, ZeroToFour } from './types/Synergism'
import { updateChallengeDisplay } from './UpdateHTML'
import { updateMobileUpgradeDescription } from './Upgrades'
import { isMobile, sumContents, timeRemainingHours } from './Utility'
import { Globals as G } from './Variables'

const coinUpper = [
  'produceFirst',
  'produceSecond',
  'produceThird',
  'produceFourth',
  'produceFifth'
] as const
const coinNames = [
  'workers',
  'investments',
  'printers',
  'coinMints',
  'alchemies'
]
const updateProgressBarAccessibility = (elementId: string, progress: number, valueText: string) => {
  const progressBar = DOMCacheGetOrSet(elementId)
  progressBar.setAttribute('aria-valuenow', String(Math.round(progress * 100) / 100))
  progressBar.setAttribute('aria-valuetext', valueText)
}

const updateInnerHTMLIfChanged = (elementId: string, html: string) => {
  const element = DOMCacheGetOrSet(elementId)
  if (element.innerHTML !== html) {
    element.innerHTML = html
  }
}

const updatePurpleReactantSlider = (sliderId: string, outputId: string, percentage: number) => {
  const normalizedPercentage = Math.min(100, Math.round(percentage))
  const slider = DOMCacheGetOrSet(sliderId) as HTMLInputElement
  const percentageText = i18next.t('purpleReactor.reactantRoutingPercentage', {
    percentage: format(normalizedPercentage, 0, true)
  })

  slider.value = String(normalizedPercentage)
  slider.style.setProperty('--routing-percentage', `${normalizedPercentage}%`)
  slider.setAttribute(
    'aria-valuetext',
    i18next.t('purpleReactor.reactantRoutingPercentageAria', {
      percentage: format(normalizedPercentage, 0, true)
    })
  )
  DOMCacheGetOrSet(outputId).textContent = percentageText
}

const normalizePurpleReactantNetRate = (netRate: number, capacity: number) => {
  const roundingTolerance = 16 * Number.EPSILON * capacity
  return Math.abs(netRate) <= roundingTolerance ? 0 : netRate
}

const isPurpleReactantAtCapacity = (barPoints: number, capacity: number) => {
  const roundingTolerance = 16 * Number.EPSILON * capacity
  return capacity > 0 && barPoints >= capacity - roundingTolerance
}

const formatPurpleReactantNetRate = (netRate: number) => {
  if (netRate > 0) {
    return i18next.t('purpleReactor.reactantNetRatePositive', { amount: format(netRate, 2, true) })
  }

  if (netRate < 0) {
    return i18next.t('purpleReactor.reactantNetRateNegative', { amount: format(-netRate, 2, true) })
  }

  return i18next.t('purpleReactor.reactantNetRateZero')
}

export const animatePurpleHoneyGain = (amount: number) => {
  if (G.currentTab !== Tabs.Singularity || getActiveSubTab() !== 5) {
    return
  }

  const gain = document.createElement('span')
  gain.classList.add('purpleHoneyGain')
  gain.textContent = i18next.t('purpleReactor.purpleHoneyGain', {
    amount: format(amount, 2, true)
  })
  const removeGain = () => gain.remove()
  gain.addEventListener('animationend', removeGain, { once: true })

  DOMCacheGetOrSet('purpleHoneyGainContainer').appendChild(gain)
  requestAnimationFrame(() => gain.classList.add('purpleHoneyGainAnimating'))
  setTimeout(removeGain, 1000)
}

const diamondUpper = [
  'produceFirstDiamonds',
  'produceSecondDiamonds',
  'produceThirdDiamonds',
  'produceFourthDiamonds',
  'produceFifthDiamonds'
] as const
const diamondNames = [
  'refineries',
  'coalPlants',
  'coalRigs',
  'pickaxes',
  'pandorasBoxes'
]
const diamondPerSecNames = ['crystal', 'ref', 'plants', 'rigs', 'pickaxes']

const mythosUpper = [
  'produceFirstMythos',
  'produceSecondMythos',
  'produceThirdMythos',
  'produceFourthMythos',
  'produceFifthMythos'
] as const
const mythosNames = [
  'augments',
  'enchantments',
  'wizards',
  'oracles',
  'grandmasters'
]
const mythosPerSecNames = [
  'shards',
  'augments',
  'enchantments',
  'wizards',
  'oracles'
]

const particleUpper = [
  'FirstParticles',
  'SecondParticles',
  'ThirdParticles',
  'FourthParticles',
  'FifthParticles'
] as const
const particleNames = [
  'protons',
  'elements',
  'pulsars',
  'quasars',
  'galacticNuclei'
]
const particlePerSecNames = ['atoms', 'protons', 'elements', 'pulsars', 'quasars']

const tesseractNames = ['dot', 'vector', 'threeSpace', 'bentTime', 'hilbertSpace']
const tesseractPerSecNames = ['constant', 'dot', 'vector', 'threeSpace', 'bentTime']

export const visualUpdateBuildings = () => {
  if (G.currentTab !== Tabs.Buildings) {
    return
  }

  // When you're in Building --> Coin, update these.
  if (G.buildingSubTab === 'coin') {
    let totalProductionDivisor: Decimal
    if (G.produceTotal.equals(new Decimal())) {
      totalProductionDivisor = new Decimal(G.dOne)
    } else {
      totalProductionDivisor = new Decimal(G.produceTotal)
    }

    DOMCacheGetOrSet('coinInformation').innerHTML = i18next.t('buildings.coinInformation', {
      coins: format(player.coins, 0, false, false),
      coinsPerSecond: format(
        Decimal.min(
          G.producePerSecond.dividedBy(G.taxdivisor),
          Decimal.pow(10, G.maxexponent - Decimal.log(G.taxdivisorcheck, 10))
        ),
        2,
        false,
        false
      ),
      totalGenerated: format(player.coinsTotal, 0, false, false)
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
      const place = G[coinUpper[i - 1]]
      const ith = G.ordinals[(i - 1) as ZeroToFour]

      DOMCacheGetOrSet(`buildtext${2 * i - 1}`).textContent = i18next.t(
        `buildings.names.${coinNames[i - 1]}`,
        {
          amount: format(player[`${ith}OwnedCoin` as const], 0, true, false),
          gain: format(player[`${ith}GeneratedCoin` as const], 0, false, false)
        }
      )

      getBuildingCostElement(`buycoin${i}`).textContent = i18next.t(
        'buildings.costCoins',
        {
          coins: format(player[`${ith}CostCoin` as const], 0, false, false)
        }
      )

      const percentage = Decimal.fromMantissaExponent(
        place.mantissa / totalProductionDivisor.mantissa,
        place.exponent - totalProductionDivisor.exponent
      ).times(100)

      DOMCacheGetOrSet(`buildtext${2 * i}`).textContent = i18next.t(
        'buildings.coinsPerSecond',
        {
          coins: format(place.dividedBy(G.taxdivisor).times(40), 2, false, false),
          percent: format(percentage, 2, true, false)
        }
      )
    }

    DOMCacheGetOrSet('buildtext11').textContent = i18next.t(
      'buildings.names.accelerators',
      {
        amount: format(player.acceleratorBought, 0, true, false),
        gain: format(G.freeAccelerator, 0, true, false)
      }
    )

    DOMCacheGetOrSet('buildtext12').innerHTML = i18next.t(
      'buildings.acceleratorPower',
      {
        power: format((G.acceleratorPower - 1) * 100, 2, false, false),
        mult: format(G.acceleratorEffect, 2, false, false)
      }
    )

    DOMCacheGetOrSet('buildtext13').innerHTML = i18next.t(
      'buildings.names.multipliers',
      {
        amount: format(player.multiplierBought, 0, true, false),
        gain: format(G.freeMultiplier, 0, true, false)
      }
    )

    DOMCacheGetOrSet('buildtext14').innerHTML = i18next.t(
      'buildings.multiplierPower',
      {
        power: format(G.multiplierPower, 2, false, false),
        mult: format(G.multiplierEffect, 2, false, false)
      }
    )

    DOMCacheGetOrSet('buildtext15').textContent = i18next.t(
      'buildings.names.acceleratorBoost',
      {
        amount: format(player.acceleratorBoostBought, 0, true, false),
        gain: format(G.freeAcceleratorBoost, 0, false, false)
      }
    )

    DOMCacheGetOrSet('buildtext16').textContent = i18next.t(
      'buildings.acceleratorBoost',
      {
        amount: format(
          100 * (0.01 * G.tuSevenMulti * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20)),
          2,
          false,
          false
        ),
        accelsPerBoost: format(
          5
            + 2 * player.researches[18]
            + 2 * player.researches[19]
            + 3 * player.researches[20]
            + (calculateAcceleratorCubeBlessing()),
          0,
          true,
          false
        )
      }
    )

    getBuildingCostElement('buyaccelerator').textContent = i18next.t(
      'buildings.costCoins',
      {
        coins: format(player.acceleratorCost, 0, false, false)
      }
    )
    getBuildingCostElement('buymultiplier').textContent = i18next.t(
      'buildings.costCoins',
      {
        coins: format(player.multiplierCost, 0, false, false)
      }
    )
    getBuildingCostElement('buyacceleratorboost').textContent = i18next.t(
      'buildings.costDiamonds',
      {
        diamonds: format(player.acceleratorBoostCost, 0, false, false)
      }
    )

    // update the tax text
    let warning = ''
    if (player.reincarnationCount > 0) {
      warning = i18next.t('buildings.taxWarning', {
        gain: format(
          Decimal.pow(10, G.maxexponent - Decimal.log(G.taxdivisorcheck, 10)),
          2,
          false,
          false
        )
      })
    }
    DOMCacheGetOrSet('taxinfo').innerHTML = i18next.t(
      'buildings.excessiveWealth',
      {
        div: format(G.taxdivisor, 2, false, false),
        warning
      }
    )
  } else if (G.buildingSubTab === 'diamond') {
    const crystalExponent = calculateCrystalExponent()
    const crystalCoinMult = calculateCrystalCoinMultiplier(crystalExponent)
    DOMCacheGetOrSet('prestigeshardinfo').innerHTML = i18next.t(
      'buildings.crystalMult',
      {
        crystals: format(player.prestigeShards, 2, false, false),
        gain: format(crystalCoinMult, 2, false, false),
        exponent: format(crystalExponent, 2, true, false)
      }
    )

    for (let i = 1; i <= 5; i++) {
      const place = G[diamondUpper[i - 1]]
      const ith = G.ordinals[(i - 1) as ZeroToFour]

      DOMCacheGetOrSet(`prestigetext${2 * i - 1}`).textContent = i18next.t(
        `buildings.names.${diamondNames[i - 1]}`,
        {
          amount: format(player[`${ith}OwnedDiamonds` as const], 0, true, false),
          gain: format(player[`${ith}GeneratedDiamonds` as const], 2, false, false)
        }
      )

      DOMCacheGetOrSet(`prestigetext${2 * i}`).textContent = i18next.t(
        `buildings.per.${diamondPerSecNames[i - 1]}`,
        {
          amount: format(place.times(40), 2, false, false)
        }
      )

      getBuildingCostElement(`buydiamond${i}`).textContent = i18next.t(
        'buildings.costDiamonds',
        {
          diamonds: format(player[`${ith}CostDiamonds` as const], 2, false, false)
        }
      )
    }

    if (player.resetToggleModes.prestige === AutoResetModes.amount) {
      const p = Decimal.pow(
        10,
        Decimal.log(G.prestigePointGain.add(1), 10)
          - Decimal.log(player.prestigePoints.sub(1), 10)
      )
      DOMCacheGetOrSet('autoprestige').textContent = i18next.t(
        'buildings.autoPrestige',
        {
          // TODO: make separate i18n for 'Prestige', 'Transcend', etc.
          name: 'Diamonds',
          action: 'Prestige',
          factor: format(Decimal.pow(10, player.prestigeamount), 0, false, false),
          mult: format(p, 0, false, false)
        }
      )
    } else if (player.resetToggleModes.prestige === AutoResetModes.time) {
      DOMCacheGetOrSet('autoprestige').textContent = i18next.t(
        'buildings.autoReincarnate',
        {
          name: 'Prestige',
          amount: format(player.prestigeamount, 0, false, false),
          timer: format(G.autoResetTimers.prestige, 1, false, false)
        }
      )
    }
  } else if (G.buildingSubTab === 'mythos') {
    DOMCacheGetOrSet('transcendshardinfo').textContent = i18next.t(
      'buildings.mythosYouHave',
      {
        shards: format(player.transcendShards, 2, false, false),
        mult: format(G.totalMultiplierBoost, 0, true, false)
      }
    )

    for (let i = 1; i <= 5; i++) {
      const place = G[mythosUpper[i - 1]]
      const ith = G.ordinals[(i - 1) as ZeroToFour]

      DOMCacheGetOrSet(`transcendtext${2 * i - 1}`).textContent = i18next.t(
        `buildings.names.${mythosNames[i - 1]}`,
        {
          amount: format(player[`${ith}OwnedMythos` as const], 0, true, false),
          gain: format(player[`${ith}GeneratedMythos` as const], 2, false, false)
        }
      )

      DOMCacheGetOrSet(`transcendtext${2 * i}`).textContent = i18next.t(
        `buildings.per.${mythosPerSecNames[i - 1]}`,
        {
          amount: format(place.times(40), 2, false, false)
        }
      )

      getBuildingCostElement(`buymythos${i}`).textContent = i18next.t(
        'buildings.costMythos',
        {
          mythos: format(player[`${ith}CostMythos` as const], 2, false, false)
        }
      )
    }

    if (player.resetToggleModes.transcend === AutoResetModes.amount) {
      DOMCacheGetOrSet('autotranscend').textContent = i18next.t(
        'buildings.autoPrestige',
        {
          name: 'Mythos',
          action: 'Transcend',
          factor: format(Decimal.pow(10, player.transcendamount), 0, false, false),
          mult: format(
            Decimal.pow(
              10,
              Decimal.log(G.transcendPointGain.add(1), 10)
                - Decimal.log(player.transcendPoints.add(1), 10)
            ),
            2,
            false,
            false
          )
        }
      )
    }
    if (player.resetToggleModes.transcend === AutoResetModes.time) {
      DOMCacheGetOrSet('autotranscend').textContent = i18next.t(
        'buildings.autoReincarnate',
        {
          name: 'Transcend',
          amount: format(player.transcendamount, 0, false, false),
          timer: format(G.autoResetTimers.transcension, 1, false, false)
        }
      )
    }
  } else if (G.buildingSubTab === 'particle') {
    for (let i = 1; i <= 5; i++) {
      const ith = G.ordinals[(i - 1) as ZeroToFour]
      const place = G[`produce${particleUpper[i - 1]}` as const]

      DOMCacheGetOrSet(`reincarnationtext${i}`).textContent = i18next.t(
        `buildings.names.${particleNames[i - 1]}`,
        {
          amount: format(player[`${ith}OwnedParticles` as const], 0, true, false),
          gain: format(player[`${ith}GeneratedParticles` as const], 2, false, false)
        }
      )
      DOMCacheGetOrSet(`reincarnationtext${i + 5}`).textContent = i18next.t(
        `buildings.per.${particlePerSecNames[i - 1]}`,
        {
          amount: format(place.times(40), 2, false, false)
        }
      )
      getBuildingCostElement(`buyparticles${i}`).textContent = i18next.t(
        'buildings.costParticles',
        {
          particles: format(player[`${ith}CostParticles` as const], 2, false, false)
        }
      )
    }

    const buildingPower = calculateBuildingPower()
    const buildingPowerMult = calculateBuildingPowerCoinMultiplier(buildingPower)

    DOMCacheGetOrSet('reincarnationshardinfo').innerHTML = i18next.t(
      'buildings.atomsYouHave',
      {
        atoms: format(player.reincarnationShards, 2, false, false),
        power: format(buildingPower, 4, true, false),
        mult: format(buildingPowerMult, 2, true, false)
      }
    )

    DOMCacheGetOrSet('reincarnationCrystalInfo').textContent = i18next.t(
      'buildings.thanksR2x14',
      {
        mult: format(Decimal.pow(buildingPowerMult, 1 / 50), 3, false, false)
      }
    )

    DOMCacheGetOrSet('reincarnationMythosInfo').textContent = i18next.t(
      'buildings.thanksR2x15',
      {
        mult: format(Decimal.pow(buildingPowerMult, 1 / 250), 3, false, false)
      }
    )

    if (player.resetToggleModes.reincarnation === AutoResetModes.amount) {
      DOMCacheGetOrSet('autoreincarnate').textContent = i18next.t(
        'buildings.autoPrestige',
        {
          name: 'Particles',
          action: 'Reincarnate',
          factor: format(Decimal.pow(10, player.reincarnationamount), 0, false, false),
          mult: format(
            Decimal.pow(
              10,
              Decimal.log(G.reincarnationPointGain.add(1), 10)
                - Decimal.log(player.reincarnationPoints.add(1), 10)
            ),
            2,
            false,
            false
          )
        }
      )
    } else if (player.resetToggleModes.reincarnation === AutoResetModes.time) {
      DOMCacheGetOrSet('autoreincarnate').textContent = i18next.t(
        'buildings.autoReincarnate',
        {
          name: 'Reincarnate',
          amount: format(player.reincarnationamount, 0, false, false),
          timer: format(G.autoResetTimers.reincarnation, 1, false, false)
        }
      )
    }
  } else if (G.buildingSubTab === 'tesseract') {
    for (let i = 1; i <= 5; i++) {
      const ascendBuildingI = `ascendBuilding${i as OneToFive}` as const

      DOMCacheGetOrSet(`ascendText${i}`).textContent = i18next.t(
        `buildings.names.${tesseractNames[i - 1]}`,
        {
          amount: format(player[ascendBuildingI].owned, 0, true, false),
          gain: format(player[ascendBuildingI].generated, 2, false, false)
        }
      )

      DOMCacheGetOrSet(`ascendText${5 + i}`).textContent = i18next.t(
        `buildings.per.${tesseractPerSecNames[i - 1]}`,
        {
          amount: format(
            (G.ascendBuildingProduction as Record<string, Decimal>)[
              G.ordinals[i - 1]
            ],
            2,
            false,
            false
          )
        }
      )

      getBuildingCostElement(`buyTesseracts${i}`).textContent = i18next.t(
        'buildings.costTesseracts',
        {
          tesseracts: format(player[ascendBuildingI].cost, 0, false, false)
        }
      )
    }

    DOMCacheGetOrSet('tesseractInfo').textContent = i18next.t(
      'buildings.tesseractsYouHave',
      {
        tesseracts: format(player.wowTesseracts.valueOf(), 0, false, false)
      }
    )

    DOMCacheGetOrSet('ascendShardInfo').textContent = i18next.t(
      'buildings.constantYouHave',
      {
        const: format(player.ascendShards, 2, false, false),
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
          true,
          false
        )
      }
    )

    if (player.resetToggleModes.ascension === AutoAscensionModes.amount) {
      DOMCacheGetOrSet('autotessbuyeramount').textContent = i18next.t(
        'buildings.autoTesseract',
        {
          tesseracts: format(player.tesseractAutoBuyerAmount, 0, false, false)
        }
      )
    } else if (player.resetToggleModes.ascension === AutoAscensionModes.percentage) {
      DOMCacheGetOrSet('autotessbuyeramount').textContent = i18next.t(
        'buildings.autoAscensionTesseract',
        {
          percent: format(Math.min(100, player.tesseractAutoBuyerAmount), 0, false, false)
        }
      )
    }
  }
}

export const visualUpdateUpgrades = () => {
  if (isMobile) {
    for (let upgId = 1; upgId <= 125; upgId++) {
      updateMobileUpgradeDescription(upgId)
    }
  }
}

export const visualUpdateAchievements = () => {
  if (G.currentTab !== Tabs.Achievements) {
    return
  }

  const tnl = toNextAchievementLevelEXP()

  DOMCacheGetOrSet('achievementprogress').textContent = i18next.t(
    isMobile ? 'achievements.achievementPointsMobile' : 'achievements.achievementPoints',
    {
      x: format(achievementPoints, 0, true)
    }
  )
  DOMCacheGetOrSet('achievementQuarkBonus').innerHTML = i18next.t(
    isMobile ? 'achievements.achievementLevelMobile' : 'achievements.achievementLevel',
    {
      level: format(achievementLevel)
    }
  )
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
      offerings: format(player.offerings, 0, true, false)
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
      if (isMobile) {
        for (const item of talismanCraftItems) {
          updateMobileTalismanInventoryPurchaseInfo(item)
        }
      } else {
        // We already update this on mobile, no need for additional updates
        DOMCacheGetOrSet(`${t}TalismanLevel`).textContent = i18next.t('runes.talismans.level', {
          x: format(talismans[t].level, 0, true),
          y: format(getTalismanLevelCap(t), 0, true)
        })
      }
    }
    updateAllTalismanHTML()
  } else if (getActiveSubTab() === 2) {
    updateOfferingAndSalvageText()
    for (const bless of runeBlessingKeys) {
      updateRuneBlessingHTML(bless)
    }
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
        time: format(timeSinceLastStateChange, 2, false, false)
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
          true,
          false
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
      x: format(player.ants.crumbs, 2, true, false)
    }
  )

  DOMCacheGetOrSet('crumbsPerSecond').textContent = i18next.t(
    'ants.crumbsPerSecond',
    {
      x: format(firstTierProduction, 2, true, false)
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
    x: format(player.antSacrificeTimerReal, 2, true, false)
  })

  if (player.ants.crumbsThisSacrifice.gte(MINIMUM_CRUMBS_FOR_SACRIFICE)) {
    DOMCacheGetOrSet('antSacrificeRequired').innerHTML = i18next.t('ants.altar.sacrificeReady.unlocked')
  } else {
    DOMCacheGetOrSet('antSacrificeRequired').innerHTML = i18next.t('ants.altar.sacrificeReady.locked', {
      x: format(player.ants.crumbsThisSacrifice, 0, true, false),
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

  const cubeMult = getShopUpgradeEffects('cubeToQuark', 'cubeQuarkMult')
  const tesseractMult = getShopUpgradeEffects('tesseractToQuark', 'tesseractQuarkMult')
  const hypercubeMult = getShopUpgradeEffects('hypercubeToQuark', 'hypercubeQuarkMult')
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
          bonus: formatDecimalAsPercentIncrease(calculateOfferingCubeBlessing(), 2)
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
          bonus: formatDecimalAsPercentIncrease(calculateObtainiumCubeBlessing(), 2)
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
    const balance = player.hepteracts[hept].BAL
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

const corruptionScoreTargets = [
  {
    score: 1e5,
    color: 'var(--tesseract-color)',
    textKey: 'corruptions.rewards.moreTesseracts'
  },
  {
    score: 1e9,
    color: 'var(--hypercube-color)',
    textKey: 'corruptions.rewards.scoreRequirement'
  },
  {
    score: 2.666e12,
    color: 'var(--platonic-color)',
    textKey: 'corruptions.rewards.scoreRequirement'
  },
  {
    score: 1.666e17,
    color: 'var(--hepteract-color)',
    textKey: 'corruptions.rewards.scoreRequirement'
  }
] as const

const corruptionScoreTargetRewardIds = [
  'corruptionTesseracts',
  'corruptionHypercubes',
  'corruptionPlatonicCubes',
  'corruptionHepteracts'
] as const

let corruptionScoreTargetIndex: number | null = null

const updateCorruptionReward = (
  containerId: string,
  valueId: string,
  translationKey: string,
  amount: number
) => {
  const formattedAmount = format(amount, 0)
  const label = i18next.t(translationKey, { amount: formattedAmount })
  const container = DOMCacheGetOrSet(containerId)

  DOMCacheGetOrSet(valueId).textContent = formattedAmount
  container.setAttribute('aria-label', label)
  container.title = label
}

const updateCorruptionScoreProgress = (effectiveScore: number) => {
  if (corruptionScoreTargetIndex === null) {
    const firstUnmetTarget = corruptionScoreTargets.findIndex(({ score }) => effectiveScore < score)
    corruptionScoreTargetIndex = firstUnmetTarget === -1
      ? corruptionScoreTargets.length - 1
      : firstUnmetTarget
  }

  const target = corruptionScoreTargets[corruptionScoreTargetIndex]
  const formattedTarget = format(target.score, 3, true)
  const progress = Math.min(100, Math.max(effectiveScore ? 0.2 : 0, 100 * effectiveScore / target.score))
  const progressButton = DOMCacheGetOrSet('corruptionScoreProgress')

  progressButton.style.setProperty('--corruption-progress-color', target.color)
  DOMCacheGetOrSet('corruptionScoreProgressFill').style.width = `${progress}%`
  DOMCacheGetOrSet('corruptionScoreProgressText').textContent = i18next.t(target.textKey, {
    score: formattedTarget
  })

  for (const [index, rewardId] of corruptionScoreTargetRewardIds.entries()) {
    const reward = DOMCacheGetOrSet(rewardId)
    const isSelected = index === corruptionScoreTargetIndex
    reward.setAttribute('aria-pressed', `${isSelected}`)
    reward.classList.toggle('selected', isSelected)
  }
}

export const visualUpdateCorruptions = () => {
  if (G.currentTab !== Tabs.Corruption) {
    return
  }

  const ascensionRewards = CalcCorruptionStuff()
  const ascCount = calculateAscensionCount()

  const autoAscendDOM = DOMCacheGetOrSet('autoAscend')
  if (player.autoAscendMode === AutoAscensionResetModes.c10Completions) {
    autoAscendDOM.innerHTML = i18next.t('corruptions.autoAscend.c10Completions', {
      input: format(player.autoAscendThreshold),
      completions: format(player.challengecompletions[10])
    })
  } else if (player.autoAscendMode === AutoAscensionResetModes.realAscensionTime) {
    autoAscendDOM.innerHTML = i18next.t('corruptions.autoAscend.realTime', {
      input: format(player.autoAscendThreshold),
      time: format(player.ascensionCounterRealReal, 2, false, false)
    })
  }

  DOMCacheGetOrSet('corruptionScore').innerHTML = i18next.t(
    'corruptions.corruptionScore',
    {
      ascScore: format(ascensionRewards.baseScore, 1, true),
      corrMult: format(ascensionRewards.corruptionMultiplier, 1, true),
      bonusMult: format(ascensionRewards.bonusMultiplier, 2, true),
      totalScore: format(ascensionRewards.effectiveScore, 1, true)
    }
  )

  if (ascensionRewards.effectiveScore > 1e23) {
    DOMCacheGetOrSet('corruptionScoreDR').style.visibility = 'visible'
  } else {
    DOMCacheGetOrSet('corruptionScoreDR').style.visibility = 'hidden'
  }

  updateCorruptionReward(
    'corruptionCubes',
    'corruptionCubesValue',
    'corruptions.rewards.cube',
    ascensionRewards.wowCubes
  )
  updateCorruptionReward(
    'corruptionTesseracts',
    'corruptionTesseractsValue',
    'corruptions.rewards.tesseract',
    ascensionRewards.wowTesseracts
  )
  updateCorruptionReward(
    'corruptionHypercubes',
    'corruptionHypercubesValue',
    'corruptions.rewards.hypercube',
    ascensionRewards.wowHypercubes
  )
  updateCorruptionReward(
    'corruptionPlatonicCubes',
    'corruptionPlatonicCubesValue',
    'corruptions.rewards.platonic',
    ascensionRewards.wowPlatonicCubes
  )
  updateCorruptionReward(
    'corruptionHepteracts',
    'corruptionHepteractsValue',
    'corruptions.rewards.hepteract',
    ascensionRewards.wowHepteracts
  )
  updateCorruptionScoreProgress(ascensionRewards.effectiveScore)
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

  DOMCacheGetOrSet('corruptionAscensionCount').style.display = ascCount > 1 ? 'flex' : 'none'

  if (ascCount > 1) {
    updateCorruptionReward(
      'corruptionAscensionCount',
      'corruptionAscensionCountValue',
      'corruptions.rewards.ascensionCount',
      ascCount
    )
  }
}

export const cycleCorruptionScoreTarget = () => {
  corruptionScoreTargetIndex = ((corruptionScoreTargetIndex ?? -1) + 1) % corruptionScoreTargets.length
  visualUpdateCorruptions()
}

export const selectCorruptionScoreTarget = (index: number) => {
  if (index < 0 || index >= corruptionScoreTargets.length) {
    return
  }

  corruptionScoreTargetIndex = index
  visualUpdateCorruptions()
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
          2,
          false,
          false
        ),
        // eslint-disable-next-line number-arg-out-of-range
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
                getGQUpgradeEffect('goldenQuarks3', 'exportGQPerHour')
              )
            - (player.goldenQuarksTimer
              % (3600.00001
                / Math.max(
                  1,
                  getGQUpgradeEffect('goldenQuarks3', 'exportGQPerHour')
                ))),
          0,
          false,
          false
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
              * getGQUpgradeEffect('goldenQuarks3', 'exportGQPerHour'))
              / 3600
          ) * goldenQuarkMultiplier,
          2
        ),
        y: format(
          Math.floor(
            168
              * getGQUpgradeEffect('goldenQuarks3', 'exportGQPerHour')
              * goldenQuarkMultiplier
          ),
          2
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
        goldenQuarks: format(player.goldenQuarks, 0, true, false)
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
      if (updateGoldenQuarkUpgradeVisibility(key, el)) {
        el.style.filter = val ? 'brightness(.9)' : 'none'
      } else if (
        player.highestSingularityCount < singItem.minimumSingularity
        || getGQUpgradeCostTNL(key) > player.goldenQuarks
      ) {
        el.style.filter = val ? 'grayscale(.9) brightness(.8)' : 'none'
      } else if (
        singItem.maxLevel === -1
        || player.goldenQuarkUpgrades[key].level < computeGQUpgradeMaxLevel(key)
      ) {
        if (computeGQUpgradeFreeLevelSoftcap(key) > player.goldenQuarkUpgrades[key].level) {
          el.style.filter = val ? 'blur(1px) invert(.9) saturate(200)' : 'none'
        } else {
          el.style.filter = val ? 'invert(.9) brightness(1.1)' : 'none'
        }
      }
    }
  } else if (getActiveSubTab() === 3) {
    const keys = Object.keys(octeractUpgrades) as OcteractUpgrades[]
    const val = G.shopEnhanceVision

    for (const key of keys) {
      const octItem = octeractUpgrades[key]
      const el = DOMCacheGetOrSet(key)
      if (updateOcteractUpgradeVisibility(key, el)) {
        el.style.filter = val ? 'brightness(.9)' : 'none'
      } else if (getOcteractUpgradeCostTNL(key) > player.wowOcteracts) {
        el.style.filter = val ? 'grayscale(.9) brightness(.8)' : 'none'
      } else if (octItem.maxLevel === -1 || octeractUpgrades[key].level < octItem.maxLevel) {
        if (player.octUpgrades[key].freeLevel > octeractUpgrades[key].level) {
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
    octeracts: format(player.wowOcteracts, 2, true, false)
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
      octeracts: format(player.totalWowOcteracts, 2, true, false)
    }
  )
  DOMCacheGetOrSet('totalOcteractCubeBonus').style.display = cTOCB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractQuarkBonus').style.display = cTOQB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractOfferingBonus').style.display = cTOOB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractObtainiumBonus').style.display = cTOOOB >= 0.001 ? 'block' : 'none'
  DOMCacheGetOrSet('totalOcteractCubeBonus').innerHTML = i18next.t(
    'octeract.generatedCubeBonus',
    {
      cubeBonus: format(cTOCB, 3, true, false)
    }
  )
  DOMCacheGetOrSet('totalOcteractQuarkBonus').innerHTML = i18next.t(
    'octeract.generatedQuarkBonus',
    {
      quarkBonus: format(cTOQB, 3, true, false)
    }
  )
  DOMCacheGetOrSet('totalOcteractOfferingBonus').innerHTML = i18next.t(
    'octeract.generatedOfferingBonus',
    {
      offeringBonus: format(cTOOB, 3, true, false)
    }
  )
  DOMCacheGetOrSet('totalOcteractObtainiumBonus').innerHTML = i18next.t(
    'octeract.generatedObtainiumBonus',
    {
      obtainiumBonus: format(cTOOOB, 3, true, false)
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
  const ambrosiaReactantCapacity = calculatePurpleReactantCapacity()
  const redAmbrosiaReactantCapacity = calculateRedAmbrosiaReactantCapacity()
  const reactantHalfLife = calculatePurpleReactantHalfLife()
  const conversionFractionPerSecond = 1 - Math.pow(2, -1 / reactantHalfLife)
  const {
    ambrosiaBarPointsSpent: ambrosiaReactantDissolutionRate,
    redAmbrosiaBarPointsSpent: redAmbrosiaReactantDissolutionRate
  } = calculatePurpleReactantConversion(
    player.purpleReactor.storedAmbrosiaBarPoints,
    player.purpleReactor.storedRedAmbrosiaBarPoints,
    conversionFractionPerSecond
  )
  const ambrosiaRouting = calculatePurpleReactantRouting(
    player.singularityChallenges.noSingularityUpgrades.completions > 0 ? totalTimePerSecond : 0,
    player.purpleReactor.ambrosiaBarPointPercentage,
    player.purpleReactor.storedAmbrosiaBarPoints,
    ambrosiaReactantCapacity,
    1,
    ambrosiaReactantDissolutionRate
  )
  const redAmbrosiaRouting = calculatePurpleReactantRouting(
    player.singularityChallenges.noAmbrosiaUpgrades.completions > 0 ? totalTimePerSecondRed : 0,
    player.purpleReactor.redAmbrosiaBarPointPercentage,
    player.purpleReactor.storedRedAmbrosiaBarPoints,
    redAmbrosiaReactantCapacity,
    1,
    redAmbrosiaReactantDissolutionRate
  )
  const barWidth = 100 * Math.min(1, player.blueberryTime / requiredTime)
  const pixelBarWidth = 100 * Math.min(1, player.redAmbrosiaTime / requiredTimeRed)

  const ambCubeBonus = calculateAmbrosiaCubeMult()
  const ambQuarkBonus = calculateAmbrosiaQuarkMult()
  const redAmbCubeBonus = calculateRedAmbrosiaCubes()
  const redAmbObtBonus = calculateRedAmbrosiaObtainium()
  const redAmbOffBonus = calculateRedAmbrosiaOffering()
  const redAmbLuckBonus = calculateCookieUpgrade29Luck()

  DOMCacheGetOrSet('ambrosiaProgress').style.width = `${barWidth}%`

  if (player.singularityChallenges.noSingularityUpgrades.completions > 0) {
    DOMCacheGetOrSet('ambrosiaProgressText').textContent = `${format(player.blueberryTime, 0, true, false)} / ${
      format(requiredTime, 0, true)
    } [+${format(ambrosiaRouting.regularRate, 0, true)}/s]`
  } else {
    DOMCacheGetOrSet('ambrosiaProgressText').textContent = i18next.t('ambrosia.notUnlocked')
  }

  DOMCacheGetOrSet('pixelProgress').style.width = `${pixelBarWidth}%`

  if (player.singularityChallenges.noAmbrosiaUpgrades.completions > 0) {
    DOMCacheGetOrSet('pixelProgressText').textContent = `${format(player.redAmbrosiaTime, 0, true, false)} / ${
      format(requiredTimeRed, 0, true)
    } [+${format(redAmbrosiaRouting.regularRate, 2, true)}/s]`
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

export const visualUpdatePurple = () => {
  if (G.currentTab !== Tabs.Singularity) {
    return
  }

  const ambrosiaBarPoints = player.purpleReactor.storedAmbrosiaBarPoints
  const redAmbrosiaBarPoints = player.purpleReactor.storedRedAmbrosiaBarPoints

  const ambrosiaReactantCapacity = calculatePurpleReactantCapacity()
  const redAmbrosiaReactantCapacity = calculateRedAmbrosiaReactantCapacity()

  const conversionFactor = calculatePurpleHoneyConversionFactor()
  const purpleHoneyPerExtraction = calculatePurpleHoneyPerExtraction()
  const purpleHoneyLuck = calculatePurpleHoneyLuck()
  const { guaranteedMultiplier, bonusMultiplierChance } = calculatePurpleHoneyExtractionMultiplier(purpleHoneyLuck)
  const reactantHalfLife = calculatePurpleReactantHalfLife()
  const purpleReactorAP = calculatePurpleReactorAP()

  const conversionFractionPerSecond = 1 - Math.pow(2, -1 / reactantHalfLife)
  const {
    ambrosiaBarPointsSpent: ambrosiaReactantDissolutionRate,
    redAmbrosiaBarPointsSpent: redAmbrosiaReactantDissolutionRate,
    purpleBarPointsGained: purpleHoneyProgressPerSecond
  } = calculatePurpleReactantConversion(ambrosiaBarPoints, redAmbrosiaBarPoints, conversionFractionPerSecond)

  const purpleHoneyProgress = player.purpleHoneyProgress

  const ambrosiaReactantRouting = calculatePurpleReactantRouting(
    player.singularityChallenges.noSingularityUpgrades.completions > 0 ? calculateAmbrosiaGenerationSpeed() : 0,
    player.purpleReactor.ambrosiaBarPointPercentage,
    ambrosiaBarPoints,
    ambrosiaReactantCapacity,
    1,
    ambrosiaReactantDissolutionRate
  )
  const redAmbrosiaReactantRouting = calculatePurpleReactantRouting(
    player.singularityChallenges.noAmbrosiaUpgrades.completions > 0 ? calculateRedAmbrosiaGenerationSpeed() : 0,
    player.purpleReactor.redAmbrosiaBarPointPercentage,
    redAmbrosiaBarPoints,
    redAmbrosiaReactantCapacity,
    1,
    redAmbrosiaReactantDissolutionRate
  )

  const ambrosiaBarPointReserveRate = ambrosiaReactantRouting.reserveRate
  const redAmbrosiaBarPointReserveRate = redAmbrosiaReactantRouting.reserveRate
  const ambrosiaBarPointNetRate = normalizePurpleReactantNetRate(
    ambrosiaBarPointReserveRate - ambrosiaReactantDissolutionRate,
    ambrosiaReactantCapacity
  )
  const redAmbrosiaBarPointNetRate = normalizePurpleReactantNetRate(
    redAmbrosiaBarPointReserveRate - redAmbrosiaReactantDissolutionRate,
    redAmbrosiaReactantCapacity
  )

  const ambrosiaAtCapacity = isPurpleReactantAtCapacity(
    ambrosiaReactantRouting.storedBarPoints,
    ambrosiaReactantCapacity
  )
  const redAmbrosiaAtCapacity = isPurpleReactantAtCapacity(
    redAmbrosiaReactantRouting.storedBarPoints,
    redAmbrosiaReactantCapacity
  )
  const displayedAmbrosiaBarPoints = ambrosiaAtCapacity ? ambrosiaReactantCapacity : ambrosiaBarPoints
  const displayedRedAmbrosiaBarPoints = redAmbrosiaAtCapacity ? redAmbrosiaReactantCapacity : redAmbrosiaBarPoints
  const ambrosiaProgress = ambrosiaReactantCapacity > 0
    ? Math.min(100, 100 * displayedAmbrosiaBarPoints / ambrosiaReactantCapacity)
    : 0
  const redAmbrosiaProgress = redAmbrosiaReactantCapacity > 0
    ? Math.min(100, 100 * displayedRedAmbrosiaBarPoints / redAmbrosiaReactantCapacity)
    : 0
  const purpleHoneyProgressPercentage = conversionFactor > 0
    ? Math.min(100, 100 * purpleHoneyProgress / conversionFactor)
    : 0
  const purpleHoneyProgressText = i18next.t('purpleReactor.purpleHoneyProgress', {
    current: format(purpleHoneyProgress, 2, true),
    conversion: format(conversionFactor, 2, true)
  })
  const formattedAmbrosiaBarPoints = format(displayedAmbrosiaBarPoints, 2, true)
  const formattedRedAmbrosiaBarPoints = format(displayedRedAmbrosiaBarPoints, 2, true)
  const formattedAmbrosiaReactantCapacity = format(ambrosiaReactantCapacity, 2, true)
  const formattedRedAmbrosiaReactantCapacity = format(redAmbrosiaReactantCapacity, 2, true)
  const ambrosiaProgressText = i18next.t('purpleReactor.reactantTankProgress', {
    stored: formattedAmbrosiaBarPoints,
    capacity: formattedAmbrosiaReactantCapacity
  })
  const redAmbrosiaProgressText = i18next.t('purpleReactor.reactantTankProgress', {
    stored: formattedRedAmbrosiaBarPoints,
    capacity: formattedRedAmbrosiaReactantCapacity
  })
  const ambrosiaProgressAriaText = i18next.t('purpleReactor.reactantTankProgressAria', {
    stored: formattedAmbrosiaBarPoints,
    capacity: formattedAmbrosiaReactantCapacity,
    percentage: format(ambrosiaProgress, 2, true)
  })
  const redAmbrosiaProgressAriaText = i18next.t('purpleReactor.reactantTankProgressAria', {
    stored: formattedRedAmbrosiaBarPoints,
    capacity: formattedRedAmbrosiaReactantCapacity,
    percentage: format(redAmbrosiaProgress, 2, true)
  })
  const reactorActive = purpleHoneyProgressPerSecond > 0

  updateInnerHTMLIfChanged(
    'purpleUpgradeAP',
    i18next.t('purpleReactor.purpleUpgradeAP', {
      current: format(purpleReactorAP, 0, true),
      max: format(maxPurpleReactorAP, 0, true)
    })
  )
  updateInnerHTMLIfChanged(
    'purpleHoneyAmount',
    i18next.t('purpleReactor.purpleHoneyAmount', {
      amount: format(player.purpleReactor.purpleHoney, 2, true),
      lifetimeAmount: format(player.purpleReactor.lifetimePurpleHoney, 2, true)
    })
  )
  updateInnerHTMLIfChanged(
    'highestPurpleHoney',
    i18next.t('purpleReactor.highestPurpleHoney', {
      amount: format(player.stats.highestPurpleHoney, 2, true)
    })
  )
  const highestPurpleHoneyModifierLines = [
    [
      purpleReactorUpgrades.highestHoneyQuarks.level > 0
        ? i18next.t('purpleReactor.highestPurpleHoneyQuarks', {
          amount: formatAsPercentIncrease(getPurpleReactorUpgradeEffects('highestHoneyQuarks', 'quarkMultiplier'), 2)
        })
        : null,
      purpleReactorUpgrades.highestHoneyGlobalSpeed.level > 0
        ? i18next.t('purpleReactor.highestPurpleHoneyGlobalSpeed', {
          amount: formatAsPercentIncrease(
            getPurpleReactorUpgradeEffects('highestHoneyGlobalSpeed', 'globalSpeedMultiplier'),
            2
          )
        })
        : null,
      purpleReactorUpgrades.highestHoneyAscensionSpeed.level > 0
        ? i18next.t('purpleReactor.highestPurpleHoneyAscensionSpeed', {
          amount: formatAsPercentIncrease(
            getPurpleReactorUpgradeEffects('highestHoneyAscensionSpeed', 'ascensionSpeedMultiplier'),
            2
          )
        })
        : null
    ].filter((modifier): modifier is string => modifier !== null).join(' · '),
    [
      purpleReactorUpgrades.highestHoneyAmbrosia.level > 0
        ? i18next.t('purpleReactor.highestPurpleHoneyAmbrosia', {
          amount: formatAsPercentIncrease(
            getPurpleReactorUpgradeEffects('highestHoneyAmbrosia', 'ambrosiaGenerationSpeed'),
            2
          )
        })
        : null,
      purpleReactorUpgrades.highestHoneyRedAmbrosia.level > 0
        ? i18next.t('purpleReactor.highestPurpleHoneyRedAmbrosia', {
          amount: formatAsPercentIncrease(
            getPurpleReactorUpgradeEffects('highestHoneyRedAmbrosia', 'redAmbrosiaGenerationSpeed'),
            2
          )
        })
        : null
    ].filter((modifier): modifier is string => modifier !== null).join(' · '),
    [
      purpleReactorUpgrades.highestHoneyAntELO.level > 0
        ? i18next.t('purpleReactor.highestPurpleHoneyAntELO', {
          amount: formatAsPercentIncrease(
            1 + getPurpleReactorUpgradeEffects('highestHoneyAntELO', 'additiveAntELOPercent'),
            3
          )
        })
        : null,
      purpleReactorUpgrades.highestHoneyRebornELOSpeed.level > 0
        ? i18next.t('purpleReactor.highestPurpleHoneyRebornELOSpeed', {
          amount: formatAsPercentIncrease(
            getPurpleReactorUpgradeEffects('highestHoneyRebornELOSpeed', 'rebornELOSpeedMult'),
            2
          )
        })
        : null
    ].filter((modifier): modifier is string => modifier !== null).join(' · ')
  ].filter((line) => line.length > 0)
  updateInnerHTMLIfChanged(
    'highestPurpleHoneyModifiers',
    highestPurpleHoneyModifierLines.length === 0
      ? ''
      : `↳ ${highestPurpleHoneyModifierLines.join('<br>&nbsp;&nbsp;')}`
  )
  updateInnerHTMLIfChanged(
    'purpleHoneyGeneration',
    i18next.t(
      'purpleReactor.purpleHoneyBaseYield',
      { amount: format(purpleHoneyPerExtraction, 2, true) }
    )
  )
  updateInnerHTMLIfChanged(
    'purpleHoneyLuck',
    i18next.t(
      'purpleReactor.purpleHoneyLuck',
      {
        luck: format(purpleHoneyLuck, 2, true)
      }
    )
  )
  updateInnerHTMLIfChanged(
    'purpleHoneyExtractionMultiplier',
    i18next.t(
      'purpleReactor.purpleHoneyExtractionMultiplier',
      { multiplier: `${format(guaranteedMultiplier, 0, true)}x` }
    )
  )
  updateInnerHTMLIfChanged(
    'purpleHoneyExtractionBonusChance',
    i18next.t(
      'purpleReactor.purpleHoneyExtractionBonusChance',
      { chance: format(100 * bonusMultiplierChance, 2, true) }
    )
  )

  updateInnerHTMLIfChanged(
    'purpleReactantHalfLife',
    i18next.t(
      'purpleReactor.reactantContainerHalfLife',
      { time: format(reactantHalfLife, 0, true) }
    )
  )

  const reactorContainer = DOMCacheGetOrSet('purpleReactantContainers')
  reactorContainer.classList.toggle('purpleReactorActive', reactorActive)

  DOMCacheGetOrSet('purpleHoneyProgressFill').style.width = `${purpleHoneyProgressPercentage}%`
  DOMCacheGetOrSet('purpleHoneyProgressText').textContent = purpleHoneyProgressText
  DOMCacheGetOrSet('purpleHoneyProgressRate').textContent = i18next.t(
    'purpleReactor.purpleHoneyProgressRate',
    { rate: format(purpleHoneyProgressPerSecond, 2, true) }
  )
  updateProgressBarAccessibility('purpleHoneyProgressBar', purpleHoneyProgressPercentage, purpleHoneyProgressText)

  DOMCacheGetOrSet('ambrosiaContainerProgress').style.width = `${ambrosiaProgress}%`
  DOMCacheGetOrSet('ambrosiaContainerProgressText').textContent = ambrosiaProgressText
  DOMCacheGetOrSet('ambrosiaReactantNetRate').textContent = formatPurpleReactantNetRate(ambrosiaBarPointNetRate)
  updateInnerHTMLIfChanged(
    'ambrosiaReactantRoutedRate',
    i18next.t(
      'purpleReactor.reactantRoutedRate',
      { amount: format(ambrosiaBarPointReserveRate, 2, true) }
    )
  )
  updateInnerHTMLIfChanged(
    'ambrosiaReactantSpentRate',
    i18next.t(
      'purpleReactor.reactantSpentRate',
      { amount: format(ambrosiaReactantDissolutionRate, 2, true) }
    )
  )
  updateProgressBarAccessibility('ambrosiaContainerProgressBar', ambrosiaProgress, ambrosiaProgressAriaText)

  DOMCacheGetOrSet('redAmbrosiaContainerProgress').style.width = `${redAmbrosiaProgress}%`
  DOMCacheGetOrSet('redAmbrosiaContainerProgressText').textContent = redAmbrosiaProgressText
  DOMCacheGetOrSet('redAmbrosiaReactantNetRate').textContent = formatPurpleReactantNetRate(redAmbrosiaBarPointNetRate)
  updateInnerHTMLIfChanged(
    'redAmbrosiaReactantRoutedRate',
    i18next.t(
      'purpleReactor.reactantRoutedRate',
      { amount: format(redAmbrosiaBarPointReserveRate, 2, true) }
    )
  )
  updateInnerHTMLIfChanged(
    'redAmbrosiaReactantSpentRate',
    i18next.t(
      'purpleReactor.reactantSpentRate',
      { amount: format(redAmbrosiaReactantDissolutionRate, 2, true) }
    )
  )
  updateProgressBarAccessibility('redAmbrosiaContainerProgressBar', redAmbrosiaProgress, redAmbrosiaProgressAriaText)

  updatePurpleReactantSlider(
    'ambrosiaBarPointPercentageSlider',
    'ambrosiaBarPointPercentageValue',
    player.purpleReactor.ambrosiaBarPointPercentage
  )
  updatePurpleReactantSlider(
    'redAmbrosiaBarPointPercentageSlider',
    'redAmbrosiaBarPointPercentageValue',
    player.purpleReactor.redAmbrosiaBarPointPercentage
  )
  if (getActiveSubTab() === 5) {
    updatePurpleUpgradeTab()
  }
}

export const visualUpdateShop = () => {
  if (G.currentTab !== Tabs.Shop) {
    return
  }

  DOMCacheGetOrSet('offeringpotionowned').textContent = format(
    player.shopUpgrades.offeringPotion,
    0,
    false
  )
  DOMCacheGetOrSet('obtainiumpotionowned').textContent = format(
    player.shopUpgrades.obtainiumPotion,
    0,
    false
  )

  // Create Keys with the correct type
  for (const key of shopUpgradeNames) {
    // Create a copy of shopItem instead of accessing many times
    const shopItem = shopUpgrades[key]

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
          el.textContent = `+${format(maxBuyablePotions, 0)} for ${
            format(
              getShopCosts(key) * maxBuyablePotions
            )
          } Quarks`
      }
    }
  }

  updateShopTab()

  DOMCacheGetOrSet('buySingularityQuarksAmount').textContent = player.goldenQuarks < 1000
    ? i18next.t('shop.singularityQuarkAmount', { amount: format(player.goldenQuarks) })
    : format(player.goldenQuarks, 0, false, false)

  DOMCacheGetOrSet('buySingularityQuarksButton').textContent = i18next.t('shop.singularityQuarkCost', {
    cost: format(getGoldenQuarkCost().cost)
  })
}

const constructConsumableTimes = (p: PseudoCoinConsumableNames) => {
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
    DOMCacheGetOrSet('globalEventTimer').innerHTML = i18next.t('pseudoCoins.consumables.globalEventSome', {
      time: timeRemainingHours(eventEnd)
    })
    DOMCacheGetOrSet('globalEventName').innerHTML = i18next.t('pseudoCoins.consumables.globalEventActive', {
      events: `(${event.name.length}) - ${event.name.join(', ')}`
    })

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
    DOMCacheGetOrSet('globalEventTimer').innerHTML = i18next.t('pseudoCoins.consumables.globalEventNone')
    DOMCacheGetOrSet('globalEventName').textContent = i18next.t('pseudoCoins.consumables.globalEvent')
    for (let i = 0; i < eventBuffType.length; i++) {
      DOMCacheGetOrSet(`eventBuff${eventBuffType[i]}`).style.display = 'none'
    }
  }
  const { HAPPY_HOUR_BELL } = allDurableConsumables
  if (HAPPY_HOUR_BELL.amount > 0) {
    DOMCacheGetOrSet('event-timer').innerHTML = i18next.t('pseudoCoins.consumables.currentTimersSome', {
      timers: constructConsumableTimes('HAPPY_HOUR_BELL')
    })
    DOMCacheGetOrSet('event-bonus').innerHTML = i18next.t('pseudoCoins.consumables.currentAmountSome', {
      amount: HAPPY_HOUR_BELL.amount
    })

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
    DOMCacheGetOrSet('event-bonus').innerHTML = i18next.t('pseudoCoins.consumables.currentAmountNone')
    DOMCacheGetOrSet('event-timer').innerHTML = i18next.t('pseudoCoins.consumables.currentTimersNone')

    for (let i = 0; i < eventBuffType.length; i++) {
      DOMCacheGetOrSet(`consumableBuff${eventBuffType[i]}`).style.display = 'none'
    }
  }
}

export const visualUpdatePurchase = () => {}
