import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { awardAchievementGroup, challengeAchievementCheck, getAchievementReward } from './Achievements'
import type { BlueberryLoadoutMode } from './BlueberryUpgrades'
import { buyTesseractBuilding, calculateTessBuildingsInBudget } from './Buy'
import type { TesseractBuildings } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calcAscensionCount,
  CalcCorruptionStuff,
  calculateAnts,
  calculateAntSacrificeELO,
  calculateCubeBlessings,
  calculateGoldenQuarks,
  calculateObtainium,
  calculateOfferings,
  calculatePowderConversion
} from './Calculate'
import {
  campaignCorruptionStatsHTMLReset,
  campaignDatas,
  campaignIconHTMLUpdate,
  campaignIconHTMLUpdates,
  type CampaignKeys,
  campaignTokenRewardHTMLUpdate,
  updateMaxTokens,
  updateTokens
} from './Campaign'
import { CalcECC, challengeRequirement } from './Challenges'
import { c15Corruptions, CorruptionLoadout, corruptionStatsUpdate, type SavedCorruption } from './Corruptions'
import { WowCubes } from './CubeExperimental'
import { autoBuyCubeUpgrades, awardAutosCookieUpgrade, updateCubeUpgradeBG } from './Cubes'
import { autoCraftHepteracts, hepteractKeys, hepteracts, resetHepteracts } from './Hepteracts'
import {
  resetHistoryAdd,
  type ResetHistoryEntryAscend,
  type ResetHistoryEntryPrestige,
  type ResetHistoryEntryReincarnate,
  type ResetHistoryEntrySingularity,
  type ResetHistoryEntryTranscend
} from './History'
import { calculateHypercubeBlessings } from './Hypercubes'
import { importSynergism } from './ImportExport'
import { autoBuyPlatonicUpgrades, updatePlatonicUpgradeBG } from './Platonic'
import { buyResearch, updateResearchBG } from './Research'
import { resetRuneBlessings } from './RuneBlessings'
import { resetOfferings, resetRunes, runes } from './Runes'
import { resetRuneSpirits } from './RuneSpirits'
import { playerJsonSchema } from './saves/PlayerJsonSchema'
import { forceResetShopUpgrades, shopData } from './Shop'
import {
  calculateSingularityDebuff,
  getFastForwardTotalMultiplier,
  getGQUpgradeEffect,
  goldenQuarkUpgrades
} from './singularity'
import { blankSave, deepClone, format, player, saveSynergy, updateAll, updateEffectiveLevelMult } from './Synergism'
import { changeSubTab, changeTab, Tabs } from './Tabs'
import { resetTalismanData, updateTalismanInventory } from './Talismans'
import { calculateTesseractBlessings } from './Tesseracts'
import { IconSets } from './Themes'
import { clearInterval, setInterval } from './Timers'
import { toggleAutoChallengeModeText } from './Toggles'
import type { OneToFive, Player, resetNames } from './types/Synergism'
import { Alert, revealStuff, updateChallengeDisplay } from './UpdateHTML'
import { upgradeupdate } from './Upgrades'
import { getElementById } from './Utility'
import { updateClassList } from './Utility'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'
import { getLevelMilestone } from './Levels'

let repeatreset: number

export enum resetTiers {
  prestige = 1,
  transcension = 2,
  reincarnation = 3,
  ascension = 4,
  singularity = 5,
  never = 6
}

export const resetrepeat = (input: resetNames) => {
  clearInterval(repeatreset)
  repeatreset = +setInterval(() => resetdetails(input), 50)
}

export const resetdetails = (input: resetNames) => {
  DOMCacheGetOrSet('resetofferings1').style.display = 'block'

  const transcensionChallenge = player.currentChallenge.transcension
  const reincarnationChallenge = player.currentChallenge.reincarnation

  const offering = calculateOfferings()
  const offeringImage = getElementById<HTMLImageElement>('resetofferings1')
  const offeringText = DOMCacheGetOrSet('resetofferings2')
  const currencyImage1 = getElementById<HTMLImageElement>('resetcurrency1')
  const resetObtainiumImage = DOMCacheGetOrSet('resetobtainium')
  const resetObtainiumText = DOMCacheGetOrSet('resetobtainium2')
  const resetInfo = DOMCacheGetOrSet('resetinfo')
  const resetCurrencyGain = DOMCacheGetOrSet('resetcurrency2')
  if (input === 'reincarnation') {
    resetObtainiumImage.style.display = 'block'
    resetObtainiumText.textContent = format(Decimal.floor(calculateObtainium()))
  } else {
    resetObtainiumImage.style.display = 'none'
    resetObtainiumText.textContent = ''
  }

  ;(input === 'ascensionChallenge' || input === 'ascension' || input === 'singularity')
    ? offeringImage.style.display = offeringText.style.display = 'none'
    : offeringImage.style.display = offeringText.style.display = 'block'

  switch (input) {
    case 'prestige':
      if (!currencyImage1.src.endsWith(`Pictures/${IconSets[player.iconSet][0]}/Diamond.png`)) {
        currencyImage1.src = `Pictures/${IconSets[player.iconSet][0]}/Diamond.png`
      }
      currencyImage1.style.display = 'block'
      resetCurrencyGain.textContent = `+${format(G.prestigePointGain)}`
      resetInfo.textContent = i18next.t('reset.details.prestige', {
        amount: format(player.coinsThisPrestige),
        timeSpent: format(player.prestigecounter)
      })
      resetInfo.style.color = 'turquoise'
      break
    case 'transcension':
      if (!currencyImage1.src.endsWith(`Pictures/${IconSets[player.iconSet][0]}/Mythos.png`)) {
        currencyImage1.src = `Pictures/${IconSets[player.iconSet][0]}/Mythos.png`
      }
      currencyImage1.style.display = 'block'
      resetCurrencyGain.textContent = `+${format(G.transcendPointGain)}`
      resetInfo.textContent = i18next.t('reset.details.transcension', {
        amount: format(player.coinsThisTranscension),
        timeSpent: format(player.transcendcounter)
      })
      resetInfo.style.color = 'var(--orchid-text-color)'
      break
    case 'reincarnation':
      if (!currencyImage1.src.endsWith(`Pictures/${IconSets[player.iconSet][0]}/Particle.png`)) {
        currencyImage1.src = `Pictures/${IconSets[player.iconSet][0]}/Particle.png`
      }
      currencyImage1.style.display = 'block'
      resetCurrencyGain.textContent = `+${format(G.reincarnationPointGain)}`
      resetInfo.textContent = i18next.t('reset.details.reincarnation', {
        amount: format(player.transcendShards),
        timeSpent: format(player.reincarnationcounter)
      })
      resetInfo.style.color = 'limegreen'
      break
    case 'acceleratorBoost':
      if (!currencyImage1.src.endsWith(`Pictures/${IconSets[player.iconSet][0]}/Diamond.png`)) {
        currencyImage1.src = `Pictures/${IconSets[player.iconSet][0]}/Diamond.png`
      }
      currencyImage1.style.display = 'block'
      resetCurrencyGain.textContent = `-${format(player.acceleratorBoostCost)}`
      resetInfo.textContent = i18next.t('reset.details.acceleratorBoost', {
        amount: format(player.prestigePoints),
        required: format(player.acceleratorBoostCost)
      })
      resetInfo.style.color = 'cyan'
      break
    case 'transcensionChallenge':
      currencyImage1.style.display = 'none'
      resetCurrencyGain.textContent = ''

      if (transcensionChallenge !== 0) {
        resetInfo.style.color = 'aquamarine'
        resetInfo.textContent = i18next.t('reset.details.transcensionChallenge.in', {
          n: transcensionChallenge,
          amount: format(player.coinsThisTranscension),
          required: format(
            challengeRequirement(transcensionChallenge, player.challengecompletions[transcensionChallenge])
          ),
          timeSpent: format(player.transcendcounter)
        })
      } else {
        resetInfo.style.color = 'var(--crimson-text-color)'
        resetInfo.textContent = i18next.t('reset.details.transcensionChallenge.out')
      }
      break
    case 'reincarnationChallenge':
      currencyImage1.style.display = 'none'
      resetCurrencyGain.textContent = ''

      if (reincarnationChallenge !== 0) {
        const goal = reincarnationChallenge >= 9 ? 'coins' : 'transcendShards'

        resetInfo.style.color = 'silver'
        resetInfo.textContent = i18next.t(`reset.details.reincarnationChallenge.in.${goal}`, {
          n: reincarnationChallenge,
          amount: format(player[goal]),
          required: format(
            challengeRequirement(
              reincarnationChallenge,
              player.challengecompletions[reincarnationChallenge],
              reincarnationChallenge
            )
          ),
          timeSpent: format(player.reincarnationcounter)
        })
      } else {
        resetInfo.style.color = 'var(--crimson-text-color)'
        resetInfo.textContent = i18next.t('reset.details.reincarnationChallenge.out')
      }
      break
    case 'ascensionChallenge':
      currencyImage1.style.display = 'none'
      resetCurrencyGain.textContent = ''
      resetInfo.textContent = i18next.t('reset.details.ascensionChallenge')
      resetInfo.style.color = 'gold'
      break
    case 'ascension':
      currencyImage1.style.display = 'none'
      resetCurrencyGain.textContent = ''
      resetInfo.textContent = i18next.t('reset.details.ascension', {
        cubeAmount: format(CalcCorruptionStuff()[4], 0, true),
        timeSpent: format(player.ascensionCounter, 0, false),
        realTimeSpent: format(player.ascensionCounterRealReal, 0, false)
      })
      resetInfo.style.color = 'gold'
      break
    case 'singularity':
      currencyImage1.style.display = 'none'
      resetCurrencyGain.textContent = ''
      resetInfo.textContent = i18next.t('reset.details.singularity', {
        gqAmount: format(calculateGoldenQuarks(), 2, true),
        timeSpent: format(player.singularityCounter, 0, false)
      })
      resetInfo.style.color = 'lightgoldenrodyellow'
  }
  DOMCacheGetOrSet('resetofferings2').textContent = `+${format(offering)}`
}

export const updateAutoReset = (i: number) => {
  let value = null
  if (i === 1) {
    value = Number.parseFloat((DOMCacheGetOrSet('prestigeamount') as HTMLInputElement).value) || 0
    player.prestigeamount = Math.max(value, 0)
  } else if (i === 2) {
    value = Number.parseFloat((DOMCacheGetOrSet('transcendamount') as HTMLInputElement).value) || 0
    player.transcendamount = Math.max(value, 0)
  } else if (i === 3) {
    value = Number.parseFloat((DOMCacheGetOrSet('reincarnationamount') as HTMLInputElement).value) || 0
    player.reincarnationamount = Math.max(value, 0)
  } else if (i === 4) {
    value = Math.floor(Number.parseFloat((DOMCacheGetOrSet('ascensionAmount') as HTMLInputElement).value)) || 1
    player.autoAscendThreshold = Math.max(value, 1)
  } else if (i === 5) {
    value = Number.parseFloat((DOMCacheGetOrSet('autoAntSacrificeAmount') as HTMLInputElement).value) || 0
    player.autoAntSacTimer = Math.max(value, 0)
  }
}

export const updateTesseractAutoBuyAmount = () => {
  const value = Math.floor(Number.parseFloat((DOMCacheGetOrSet('tesseractAmount') as HTMLInputElement).value)) || 0
  player.tesseractAutoBuyerAmount = Math.max(value, 0)
}

export const updateAutoCubesOpens = (i: number) => {
  let value = null
  if (i === 1) {
    value = Number((DOMCacheGetOrSet('cubeOpensInput') as HTMLInputElement).value) || 0
    player.openCubes = Math.max(Math.min(value, 100), 0)
  } else if (i === 2) {
    value = Number((DOMCacheGetOrSet('tesseractsOpensInput') as HTMLInputElement).value) || 0
    player.openTesseracts = Math.max(Math.min(value, 100), 0)
  } else if (i === 3) {
    value = Number((DOMCacheGetOrSet('hypercubesOpensInput') as HTMLInputElement).value) || 0
    player.openHypercubes = Math.max(Math.min(value, 100), 0)
  } else if (i === 4) {
    value = Number((DOMCacheGetOrSet('platonicCubeOpensInput') as HTMLInputElement).value) || 0
    player.openPlatonicsCubes = Math.max(Math.min(value, 100), 0)
  }
}

const resetAddHistoryEntry = (input: resetNames, from = 'unknown') => {
  const offeringsGiven = calculateOfferings()
  const obtainiumGiven = calculateObtainium()
  const isChallenge = ['enterChallenge', 'leaveChallenge'].includes(from)

  if (input === 'prestige') {
    const historyEntry: ResetHistoryEntryPrestige = {
      seconds: player.prestigecounter,
      date: Date.now(),
      offerings: offeringsGiven,
      kind: 'prestige',
      diamonds: G.prestigePointGain.toString()
    }

    resetHistoryAdd('reset', historyEntry)
  } else if (input === 'transcension' || input === 'transcensionChallenge') {
    // Heuristics: transcend entries are not added when entering or leaving a challenge,
    // unless a meaningful gain in particles was made. This prevents spam when using the challenge automator.
    const historyEntry: ResetHistoryEntryTranscend = {
      seconds: player.transcendcounter,
      date: Date.now(),
      offerings: offeringsGiven,
      kind: 'transcend',
      mythos: G.transcendPointGain.toString()
    }

    resetHistoryAdd('reset', historyEntry)
  } else if (input === 'reincarnation' || input === 'reincarnationChallenge') {
    // Heuristics: reincarnate entries are not added when entering or leaving a challenge,
    // unless a meaningful gain in particles was made. This prevents spam when using the challenge automator.
    if (!isChallenge || G.reincarnationPointGain.gte(player.reincarnationPoints.div(10))) {
      const historyEntry: ResetHistoryEntryReincarnate = {
        seconds: player.reincarnationcounter,
        date: Date.now(),
        offerings: offeringsGiven,
        kind: 'reincarnate',
        particles: G.reincarnationPointGain.toString(),
        obtainium: obtainiumGiven
      }

      resetHistoryAdd('reset', historyEntry)
    }
  } else if (input === 'ascension' || input === 'ascensionChallenge') {
    // Ascension entries will only be logged if C10 was completed.
    if (player.challengecompletions[10] > 0) {
      const corruptionMetaData = CalcCorruptionStuff()
      const historyEntry: ResetHistoryEntryAscend = {
        seconds: player.ascensionCounter,
        date: Date.now(),
        c10Completions: player.challengecompletions[10],
        usedCorruptions: player.corruptions.used.loadout,
        corruptionScore: corruptionMetaData[3],
        wowCubes: corruptionMetaData[4],
        wowTesseracts: corruptionMetaData[5],
        wowHypercubes: corruptionMetaData[6],
        wowPlatonicCubes: corruptionMetaData[7],
        wowHepteracts: corruptionMetaData[8],
        kind: 'ascend'
      }

      // If we are _leaving_ an ascension challenge, log that too.
      if (from !== 'enterChallenge' && player.currentChallenge.ascension !== 0) {
        historyEntry.currentChallenge = player.currentChallenge.ascension
      }

      resetHistoryAdd('ascend', historyEntry)
    }
  }
}

export const updatePrestigeCount = (count: number) => {
  let multiplier = 1
  multiplier *= +getAchievementReward('prestigeCountMultiplier')
  multiplier *= 1 + 0.05 * CalcECC('transcend', player.challengecompletions[5])

  const prestigeToAdd = Math.floor(count * multiplier)
  if (prestigeToAdd > 0) {
    player.prestigeCount += prestigeToAdd
    awardAchievementGroup('prestigeCount')
  }
}

export const updateTranscensionCount = (count: number) => {
  let multiplier = 1
  multiplier *= +getAchievementReward('transcensionCountMultiplier')
  multiplier *= 1 + 0.15 * CalcECC('reincarnation', player.challengecompletions[7])

  const transcendToAdd = Math.floor(count * multiplier)
  if (transcendToAdd > 0) {
    player.transcendCount += transcendToAdd
    awardAchievementGroup('transcensionCount')
  }
  if (getAchievementReward('transcendToPrestige')) {
    updatePrestigeCount(transcendToAdd)
  }
}

export const updateReincarnationCount = (count: number) => {
  let multiplier = 1
  multiplier *= +getAchievementReward('reincarnationCountMultiplier')
  multiplier *= 1 + 0.2 * CalcECC('ascension', player.challengecompletions[12])

  const reincarnationToAdd = Math.floor(count * multiplier)
  if (reincarnationToAdd > 0) {
    player.reincarnationCount += reincarnationToAdd
    awardAchievementGroup('reincarnationCount')
  }
  if (getAchievementReward('reincarnationToTranscend')) {
    updateTranscensionCount(reincarnationToAdd)
  }
}

export const reset = (input: resetNames, fast = false, from = 'unknown') => {
  // Handle adding history entries before actually resetting data, to ensure optimal accuracy.
  resetAddHistoryEntry(input, from)

  const obtainiumToGain = calculateObtainium()

  resetOfferings()
  resetUpgrades(1)
  player.coins = new Decimal('102')
  player.coinsThisPrestige = new Decimal('100')
  player.firstOwnedCoin = 0
  player.firstGeneratedCoin = new Decimal('0')
  player.firstCostCoin = new Decimal('100')
  player.secondOwnedCoin = 0
  player.secondGeneratedCoin = new Decimal('0')
  player.secondCostCoin = new Decimal('1e3')
  player.thirdOwnedCoin = 0
  player.thirdGeneratedCoin = new Decimal('0')
  player.thirdCostCoin = new Decimal('2e4')
  player.fourthOwnedCoin = 0
  player.fourthGeneratedCoin = new Decimal('0')
  player.fourthCostCoin = new Decimal('4e5')
  player.fifthOwnedCoin = 0
  player.fifthGeneratedCoin = new Decimal('0')
  player.fifthCostCoin = new Decimal('8e6')
  player.firstGeneratedDiamonds = new Decimal('0')
  player.secondGeneratedDiamonds = new Decimal('0')
  player.thirdGeneratedDiamonds = new Decimal('0')
  player.fourthGeneratedDiamonds = new Decimal('0')
  player.fifthGeneratedDiamonds = new Decimal('0')
  player.multiplierCost = new Decimal('1e4')
  player.multiplierBought = 0
  player.acceleratorCost = new Decimal('500')
  player.acceleratorBought = 0

  updatePrestigeCount(1)

  player.prestigePoints = player.prestigePoints.add(G.prestigePointGain)
  player.prestigeShards = new Decimal('0')
  player.prestigenoaccelerator = true
  player.prestigenomultiplier = true
  player.prestigenocoinupgrades = true

  // Notify new players the reset
  if (player.highestSingularityCount === 0) {
    if (input === 'prestige' && !player.unlocks.prestige) {
      DOMCacheGetOrSet('prestigebtn').style.boxShadow = ''
    }
    if (input === 'transcension' && !player.unlocks.transcend) {
      DOMCacheGetOrSet('transcendbtn').style.boxShadow = ''
    }
    if (input === 'reincarnation' && !player.unlocks.reincarnate) {
      DOMCacheGetOrSet('reincarnatebtn').style.boxShadow = ''
    }
    if (input === 'ascension' && player.ascensionCount === 0) {
      DOMCacheGetOrSet('ascendbtn').style.boxShadow = ''
    }
  }

  player.unlocks.prestige = true

  if (player.prestigecounter < player.fastestprestige) {
    player.fastestprestige = player.prestigecounter
  }

  G.prestigePointGain = new Decimal('0')

  player.prestigecounter = 0
  G.autoResetTimers.prestige = 0

  G.generatorPower = new Decimal(1)

  const types = [
    'transcension',
    'transcensionChallenge',
    'reincarnation',
    'reincarnationChallenge',
    'ascension',
    'ascensionChallenge'
  ]
  if (types.includes(input)) {
    resetUpgrades(2)
    player.coinsThisTranscension = new Decimal('100')
    player.firstOwnedDiamonds = 0
    player.firstCostDiamonds = new Decimal('100')
    player.secondOwnedDiamonds = 0
    player.secondCostDiamonds = new Decimal('1e5')
    player.thirdOwnedDiamonds = 0
    player.thirdCostDiamonds = new Decimal('1e15')
    player.fourthOwnedDiamonds = 0
    player.fourthCostDiamonds = new Decimal('1e40')
    player.fifthOwnedDiamonds = 0
    player.fifthCostDiamonds = new Decimal('1e100')
    player.firstGeneratedMythos = new Decimal('0')
    player.secondGeneratedMythos = new Decimal('0')
    player.thirdGeneratedMythos = new Decimal('0')
    player.fourthGeneratedMythos = new Decimal('0')
    player.fifthGeneratedMythos = new Decimal('0')
    player.acceleratorBoostBought = 0
    player.acceleratorBoostCost = new Decimal('1e3')

    updateTranscensionCount(1)
    awardAchievementGroup('transcensionCount')

    player.prestigePoints = new Decimal('0')
    player.transcendPoints = player.transcendPoints.add(G.transcendPointGain)
    player.transcendShards = new Decimal('0')
    player.transcendnocoinupgrades = true
    player.transcendnocoinorprestigeupgrades = true
    player.transcendnoaccelerator = true
    player.transcendnomultiplier = true

    G.transcendPointGain = new Decimal('0')

    if (getLevelMilestone('tier1CrystalAutobuy') === 1) {
      player.firstOwnedDiamonds += 1
    }
    if (getLevelMilestone('tier2CrystalAutobuy') === 1) {
      player.secondOwnedDiamonds += 1
    }
    if (getLevelMilestone('tier3CrystalAutobuy') === 1) {
      player.thirdOwnedDiamonds += 1
    }
    if (getLevelMilestone('tier4CrystalAutobuy') === 1) {
      player.fourthOwnedDiamonds += 1
    }
    if (getLevelMilestone('tier5CrystalAutobuy') === 1) {
      player.fifthOwnedDiamonds += 1
    }

    if (player.transcendcounter < player.fastesttranscend && player.currentChallenge.transcension === 0) {
      player.fastesttranscend = player.transcendcounter
    }

    player.transcendcounter = 0
    G.autoResetTimers.transcension = 0
  }

  if (input === 'reincarnation' || input === 'reincarnationChallenge') {
    if (player.corruptions.used.deflation > 10 && player.platonicUpgrades[11] > 0) {
      player.prestigePoints = player.prestigePoints.add(G.reincarnationPointGain)
    }
  }

  if (
    input === 'reincarnation' || input === 'reincarnationChallenge' || input === 'ascension'
    || input === 'ascensionChallenge' || input === 'singularity'
  ) {
    // Fail safe if for some reason ascension achievement isn't awarded. hacky solution but am too tired to fix right now

    awardAchievementGroup('ascensionCount')

    player.obtainium = player.obtainium.add(obtainiumToGain)

    player.currentChallenge.transcension = 0
    resetUpgrades(3)
    player.coinsThisReincarnation = new Decimal('100')
    player.firstOwnedMythos = 0
    player.firstCostMythos = new Decimal('1')
    player.secondOwnedMythos = 0
    player.secondCostMythos = new Decimal('1e2')
    player.thirdOwnedMythos = 0
    player.thirdCostMythos = new Decimal('1e4')
    player.fourthOwnedMythos = 0
    player.fourthCostMythos = new Decimal('1e8')
    player.fifthOwnedMythos = 0
    player.fifthCostMythos = new Decimal('1e16')
    player.firstGeneratedParticles = new Decimal('0')
    player.secondGeneratedParticles = new Decimal('0')
    player.thirdGeneratedParticles = new Decimal('0')
    player.fourthGeneratedParticles = new Decimal('0')
    player.fifthGeneratedParticles = new Decimal('0')

    updateReincarnationCount(1)
    awardAchievementGroup('reincarnationCount')

    player.transcendPoints = new Decimal('0')
    player.reincarnationPoints = player.reincarnationPoints.add(G.reincarnationPointGain)
    player.reincarnationShards = new Decimal('0')
    player.challengecompletions[1] = 0
    player.challengecompletions[2] = 0
    player.challengecompletions[3] = 0
    player.challengecompletions[4] = 0
    player.challengecompletions[5] = 0

    G.reincarnationPointGain = new Decimal('0')

    if (player.shopUpgrades.instantChallenge > 0 && player.currentChallenge.reincarnation === 0) {
      player.challengecompletions[1] = player.highestchallengecompletions[1]
      player.challengecompletions[2] = player.highestchallengecompletions[2]
      player.challengecompletions[3] = player.highestchallengecompletions[3]
      player.challengecompletions[4] = player.highestchallengecompletions[4]
      player.challengecompletions[5] = player.highestchallengecompletions[5]
    }

    player.reincarnatenocoinupgrades = true
    player.reincarnatenocoinorprestigeupgrades = true
    player.reincarnatenocoinprestigeortranscendupgrades = true
    player.reincarnatenocoinprestigetranscendorgeneratorupgrades = true
    player.reincarnatenoaccelerator = true
    player.reincarnatenomultiplier = true

    if (player.reincarnationcounter < player.fastestreincarnate && player.currentChallenge.reincarnation === 0) {
      player.fastestreincarnate = player.reincarnationcounter
    }

    calculateCubeBlessings()
    player.reincarnationcounter = 0
    G.autoResetTimers.reincarnation = 0

    if (player.autoResearchToggle && player.autoResearch > 0.5) {
      const linGrowth = (player.autoResearch === 200) ? 0.01 : 0
      buyResearch(player.autoResearch, true, linGrowth)
    }

    calculateAnts()
  }

  if (input === 'ascension' || input === 'ascensionChallenge' || input === 'singularity') {
    const metaData = CalcCorruptionStuff()
    if (player.challengecompletions[10] > 0) {
      awardAchievementGroup('ascensionScore')
    }
    // reset auto challenges
    player.currentChallenge.transcension = 0
    player.currentChallenge.reincarnation = 0

    // The start of the auto challenge to improve QoL starts with C10
    if (
      input === 'ascensionChallenge' && player.currentChallenge.ascension > 10 && player.highestSingularityCount >= 2
      && player.autoChallengeToggles[10]
    ) {
      player.autoChallengeIndex = 10
    } else {
      player.autoChallengeIndex = 1
    }
    toggleAutoChallengeModeText('START')

    G.autoChallengeTimerIncrement = 0
    // reset rest
    resetResearches()
    resetAnts()
    resetTalismanData('ascension')
    player.reincarnationPoints = new Decimal('0')
    player.reincarnationShards = new Decimal('0')
    player.antSacrificePoints = 0
    player.antSacrificeTimer = 0
    player.antSacrificeTimerReal = 0

    player.antUpgrades[12 - 1] = 0
    for (let j = 61; j <= 80; j++) {
      player.upgrades[j] = 0
    }
    for (let j = 94; j <= 100; j++) {
      player.upgrades[j] = 0
    }
    player.firstOwnedParticles = 0
    player.secondOwnedParticles = 0
    player.thirdOwnedParticles = 0
    player.fourthOwnedParticles = 0
    player.fifthOwnedParticles = 0
    player.firstCostParticles = new Decimal('1')
    player.secondCostParticles = new Decimal('100')
    player.thirdCostParticles = new Decimal('1e4')
    player.fourthCostParticles = new Decimal('1e8')
    player.fifthCostParticles = new Decimal('1e16')
    player.offerings = new Decimal('0')
    player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]

    resetRunes('ascension')

    if (player.cubeUpgrades[27] === 1) {
      player.firstOwnedParticles = 1
      player.secondOwnedParticles = 1
      player.thirdOwnedParticles = 1
      player.fourthOwnedParticles = 1
      player.fifthOwnedParticles = 1
    }

    const c10Completions = player.challengecompletions[10]

    // If challenge 10 is incomplete, you won't get a cube no matter what
    if (player.challengecompletions[10] > 0 && player.ascensionCounter > 0) {
      player.ascensionCount += calcAscensionCount()
      // Metadata is defined up in the top of the (i > 3.5) case
      // Protect the cube from developer mistakes
      if (
        isFinite(metaData[4]) && isFinite(metaData[5]) && isFinite(metaData[6]) && isFinite(metaData[7])
        && isFinite(metaData[8])
      ) {
        player.wowCubes.add(metaData[4])
        player.wowTesseracts.add(metaData[5])
        player.wowHypercubes.add(metaData[6])
        player.wowPlatonicCubes.add(metaData[7])
        player.wowAbyssals = Math.min(1e300, player.wowAbyssals + metaData[8])
      }
    }

    for (let j = 1; j <= 10; j++) {
      player.challengecompletions[j] = 0
      player.highestchallengecompletions[j] = 0
    }

    player.challengecompletions[6] = player.highestchallengecompletions[6] = player.cubeUpgrades[49]
    player.challengecompletions[7] = player.highestchallengecompletions[7] = player.cubeUpgrades[49]
    player.challengecompletions[8] = player.highestchallengecompletions[8] = player.cubeUpgrades[49]

    DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
    player.roombaResearchIndex = 0
    player.autoResearch = 1

    for (let j = 1; j <= (200); j++) {
      const k = `res${j}`
      if (player.researches[j] > 0.5 && player.researches[j] < G.researchMaxLevels[j]) {
        updateClassList(k, ['researchPurchased'], [
          'researchAvailable',
          'researchMaxed',
          'researchPurchasedAvailable'
        ])
      } else if (player.researches[j] > 0.5 && player.researches[j] >= G.researchMaxLevels[j]) {
        updateClassList(k, ['researchMaxed'], [
          'researchAvailable',
          'researchPurchased',
          'researchPurchasedAvailable'
        ])
      } else {
        updateClassList(k, [], [
          'researchAvailable',
          'researchPurchased',
          'researchPurchasedAvailable',
          'researchMaxed'
        ])
      }
    }

    calculateAnts()
    calculateAntSacrificeELO()
    calculateObtainium()
    awardAchievementGroup('ascensionCount')

    player.ascensionCounter = 0
    player.ascensionCounterReal = 0
    player.ascensionCounterRealReal = 0

    updateTalismanInventory()
    calculateCubeBlessings()
    calculateTesseractBlessings()
    calculateHypercubeBlessings()

    if (player.cubeUpgrades[4] === 1) {
      player.upgrades[94] = 1
      player.upgrades[95] = 1
      player.upgrades[96] = 1
      player.upgrades[97] = 1
      player.upgrades[98] = 1
    }
    if (player.cubeUpgrades[5] === 1) {
      player.upgrades[99] = 1
    }
    if (player.cubeUpgrades[6] === 1) {
      player.upgrades[100] = 1
    }

    for (let j = 61; j <= 80; j++) {
      DOMCacheGetOrSet(`upg${j}`).classList.remove('green-background')
    }
    for (let j = 94; j <= 100; j++) {
      if (player.upgrades[j] === 0) {
        DOMCacheGetOrSet(`upg${j}`).classList.remove('green-background')
      }
    }

    if (player.highestSingularityCount >= 4) {
      const currCorruptionDifficulty = player.corruptions.used.totalCorruptionDifficultyScore
      for (const campaign of Object.keys(player.campaigns.allCampaigns)) {
        const campaignName = campaign as CampaignKeys
        const campaignDifficulty =
          player.campaigns.getCampaign(campaignName).usableLoadout.totalCorruptionDifficultyScore
        if (!campaignDatas[campaignName].unlockRequirement()) {
          continue
        }

        if (campaignDifficulty <= currCorruptionDifficulty) {
          player.campaigns.setC10ToArbitrary(campaignName, c10Completions)
        }
        campaignIconHTMLUpdate(campaignName)
      }
      updateTokens()
      updateMaxTokens()
      campaignTokenRewardHTMLUpdate()
    }

    if (player.campaigns.current) {
      player.campaigns.resetCampaign(c10Completions)
    }
    player.corruptions.used = new CorruptionLoadout(player.corruptions.next.loadout)

    // fix c15 ascension bug by restoring the corruptions if the player ascended instead of leaving
    if (player.currentChallenge.ascension === 15 && (input === 'ascension' || input === 'ascensionChallenge')) {
      player.corruptions.used = new CorruptionLoadout(c15Corruptions)
    }

    corruptionStatsUpdate()
    updateSingularityMilestoneAwards(false)
  }

  if (input === 'ascension' || input === 'ascensionChallenge') {
    // Hepteract Autocraft
    const numberOfAutoCraftsAndOrbs = Object.values(hepteracts).filter((v) => v.AUTO).length
      + (player.overfluxOrbsAutoBuy ? 1 : 0)
    if (player.highestSingularityCount >= 1 && numberOfAutoCraftsAndOrbs > 0) {
      // Computes the max number of Hepteracts to spend on each auto Hepteract craft
      const heptAutoSpend = Math.floor(
        (player.wowAbyssals / numberOfAutoCraftsAndOrbs) * (player.hepteractAutoCraftPercentage / 100)
      )

      for (const hept of hepteractKeys) {
        if (player.hepteracts[hept].AUTO) {
          autoCraftHepteracts(hept, heptAutoSpend)
        }
      }

      if (player.overfluxOrbsAutoBuy) {
        const orbsAmount = Math.floor(heptAutoSpend / 250000)
        if (player.wowAbyssals - (250000 * orbsAmount) >= 0) {
          player.overfluxOrbs += orbsAmount
          player.overfluxPowder += player.shopUpgrades.powderAuto * calculatePowderConversion() * orbsAmount / 100
          player.wowAbyssals -= 250000 * orbsAmount
        }
        if (player.wowAbyssals < 0) {
          player.wowAbyssals = 0
        }
      }
    }

    // Autobuy tesseract buildings (Mode: PERCENTAGE)
    if (player.researches[190] > 0 && player.tesseractAutoBuyerToggle === 1 && player.resettoggle4 === 2) {
      const ownedBuildings: TesseractBuildings = [null, null, null, null, null]
      for (let i = 1; i <= 5; i++) {
        if (player.autoTesseracts[i]) {
          ownedBuildings[i - 1] = player[`ascendBuilding${i as OneToFive}` as const].owned
        }
      }
      const percentageToSpend = 100 - Math.min(100, player.tesseractAutoBuyerAmount)
      const budget = Number(player.wowTesseracts) * percentageToSpend / 100
      const buyToBuildings = calculateTessBuildingsInBudget(ownedBuildings, budget)
      // Prioritise buying buildings from highest tier to lowest,
      // in case there are any off-by-ones or floating point errors.
      for (let i = 5; i >= 1; i--) {
        const buyFrom = ownedBuildings[i - 1]
        const buyTo = buyToBuildings[i - 1]
        if (buyFrom !== null && buyTo !== null && buyTo !== buyFrom) {
          buyTesseractBuilding(i as OneToFive, buyTo - buyFrom)
        }
      }
    }

    // Automation Platonic Upgrades
    autoBuyPlatonicUpgrades()

    // Automation Cube Upgrades
    autoBuyCubeUpgrades()

    // Auto open Cubes. If to remove !== 0, game will lag a bit if it was set to 0
    if (player.highestSingularityCount >= 35) {
      if (player.autoOpenCubes && player.openCubes !== 0 && player.cubeUpgrades[51] > 0) {
        player.wowCubes.open(Math.floor(Number(player.wowCubes) * player.openCubes / 100), false)
      }
      if (player.autoOpenTesseracts && player.openTesseracts !== 0 && player.challengecompletions[11] > 0) {
        if (player.tesseractAutoBuyerToggle !== 1 || player.resettoggle4 === 2) {
          player.wowTesseracts.open(Math.floor(Number(player.wowTesseracts) * player.openTesseracts / 100), false)
        }
      }
      if (player.autoOpenHypercubes && player.openHypercubes !== 0 && player.challengecompletions[13] > 0) {
        player.wowHypercubes.open(Math.floor(Number(player.wowHypercubes) * player.openHypercubes / 100), false)
      }
      if (player.autoOpenPlatonicsCubes && player.openPlatonicsCubes !== 0 && player.challengecompletions[14] > 0) {
        player.wowPlatonicCubes.open(
          Math.floor(Number(player.wowPlatonicCubes) * player.openPlatonicsCubes / 100),
          false
        )
      }
    }
  }

  // Always unlocks
  player.unlocks.prestige = true

  if (input === 'transcension' || input === 'transcensionChallenge') {
    player.unlocks.transcend = true
  }
  if (input === 'reincarnation' || input === 'reincarnationChallenge') {
    player.unlocks.reincarnate = true
  }

  if (input === 'singularity') {
    player.unlocks.coinone = false
    player.unlocks.cointwo = false
    player.unlocks.cointhree = false
    player.unlocks.coinfour = false
    player.unlocks.generation = false
    player.unlocks.prestige = false
    player.unlocks.transcend = false
    player.unlocks.reincarnate = false
    player.unlocks.rrow1 = false
    player.unlocks.rrow2 = false
    player.unlocks.rrow3 = false
    player.unlocks.rrow4 = false
    player.unlocks.anthill = false
    player.unlocks.talismans = false
    player.unlocks.ascensions = false
    player.unlocks.blessings = false
    player.unlocks.tesseracts = false
    player.unlocks.hypercubes = false
    player.unlocks.spirits = false
    player.unlocks.platonics = false

    player.ascendBuilding1.owned = 0
    player.ascendBuilding1.generated = new Decimal('0')
    player.ascendBuilding2.owned = 0
    player.ascendBuilding2.generated = new Decimal('0')
    player.ascendBuilding3.owned = 0
    player.ascendBuilding3.generated = new Decimal('0')
    player.ascendBuilding4.owned = 0
    player.ascendBuilding4.generated = new Decimal('0')
    player.ascendBuilding5.owned = 0
    player.ascendBuilding5.generated = new Decimal('0')

    player.constantUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    player.wowCubes = new WowCubes(0)
    player.wowTesseracts = new WowCubes(0)
    player.wowHypercubes = new WowCubes(0)
    player.wowTesseracts = new WowCubes(0)
    player.wowAbyssals = 0

    for (let index = 1; index <= 50; index++) {
      player.cubeUpgrades[index] = 0
    }
  }

  if (!fast) {
    revealStuff()
  }
  if (input === 'transcensionChallenge' || input === 'reincarnationChallenge' || input === 'ascensionChallenge') {
    updateChallengeDisplay()
  }

  updateAll()
}

/**
 * Computes which achievements in 274-280 are achievable given current singularity number
 */
export const updateSingularityAchievements = (): void => {
  awardAchievementGroup('singularityCount')
}

export const updateSingularityMilestoneAwards = (singularityReset = true): void => {
  // 1 transcension, 1001 mythos
  if (player.highestSingularityCount >= 2) { // Singularity 2
    if (singularityReset) {
      player.prestigeCount = 1
      player.transcendCount = 1
    }
    player.transcendPoints = new Decimal('1001')

    player.unlocks.coinone = true
    player.unlocks.cointwo = true
    player.unlocks.cointhree = true
    player.unlocks.coinfour = true
    player.unlocks.prestige = true
    player.unlocks.generation = true
    player.unlocks.transcend = true
  }
  if (player.highestSingularityCount >= 3) { // Singularity 3
    if (player.currentChallenge.ascension !== 12) {
      if (singularityReset) {
        player.reincarnationCount = 1
      }
      player.reincarnationPoints = new Decimal('10')
    }
    player.unlocks.reincarnate = true
    player.unlocks.rrow1 = true
    player.researches[47] = 1
  }
  if (player.highestSingularityCount >= 4) { // Singularity 4
    if (player.currentChallenge.ascension !== 14) {
      player.obtainium = new Decimal(Math.floor(
        500 * calculateSingularityDebuff('Researches')
      ))
    }
    if (player.currentChallenge.ascension !== 12) {
      player.reincarnationPoints = new Decimal('1e16')
    }
    player.challengecompletions[6] = 1
    player.highestchallengecompletions[6] = 1
  }
  const shopItemPerk_5 = ['offeringAuto', 'offeringEX', 'obtainiumAuto', 'obtainiumEX', 'antSpeed', 'cashGrab'] as const
  const perk_5 = player.highestSingularityCount >= 5
  if (perk_5 && singularityReset) { // Singularity 5
    for (const key of shopItemPerk_5) {
      player.shopUpgrades[key] = 10
    }
    player.cubeUpgrades[7] = 1
  }
  if (player.highestSingularityCount >= 7) { // Singularity 7
    player.challengecompletions[7] = 1
    player.highestchallengecompletions[7] = 1
    if (player.currentChallenge.ascension !== 12) {
      player.reincarnationPoints = new Decimal('1e100')
    }
  }
  if (player.highestSingularityCount >= 10) { // Singularity 10
    player.challengecompletions[8] = 1
    player.highestchallengecompletions[8] = 1
    player.cubeUpgrades[8] = 1
    player.cubeUpgrades[4] = 1 // Adding these ones,
    player.cubeUpgrades[5] = 1 // so they wont reset
    player.cubeUpgrades[6] = 1 // on first Ascension
    player.unlocks.anthill = true
    player.firstOwnedAnts = 1
  }
  if (player.highestSingularityCount > 10) { // Must be the same as autoResearchEnabled()
    player.cubeUpgrades[9] = 1
  }
  if (player.highestSingularityCount >= 15) {
    player.challengecompletions[8] = 5
    player.highestchallengecompletions[8] = 5
    if (player.currentChallenge.ascension !== 12) {
      player.reincarnationPoints = new Decimal('2.22e2222')
    }
    player.fifthOwnedAnts = 1
    player.cubeUpgrades[20] = 1
  }
  const perk_20 = player.highestSingularityCount >= 20
  if (perk_20) {
    const shopItemPerk_20 = [
      'offeringAuto',
      'offeringEX',
      'obtainiumAuto',
      'obtainiumEX',
      'antSpeed',
      'cashGrab'
    ] as const
    player.challengecompletions[9] = 1
    player.highestchallengecompletions[9] = 1
    player.unlocks.talismans = true
    player.unlocks.blessings = true
    player.antPoints = new Decimal('1e100')
    player.antUpgrades[11] = 1
    for (const key of shopItemPerk_20) {
      player.shopUpgrades[key] = shopData[key].maxLevel
    }
  }
  if (player.highestSingularityCount >= 25) {
    player.eighthOwnedAnts = 1
  }
  if (player.highestSingularityCount >= 30) {
    player.researches[130] = 1
    player.researches[135] = 1
    player.researches[145] = 1
  }
  if (player.highestSingularityCount >= 100 && singularityReset) {
    player.cubeUpgrades[51] = 1
    awardAutosCookieUpgrade()
  }

  if (player.highestSingularityCount >= 244) {
    player.cubeUpgrades[71] = 1
    player.cubeUpgrades[72] = 1
  }

  if (getGQUpgradeEffect('platonicAlpha') && player.platonicUpgrades[5] === 0) {
    player.platonicUpgrades[5] = 1
    updatePlatonicUpgradeBG(5)
  }

  if (singularityReset) {
    for (let j = 1; j <= 15; j++) {
      challengeAchievementCheck(j)
    }
  }
  resetUpgrades(3)
  if (singularityReset) {
    for (let j = 1; j < player.cubeUpgrades.length; j++) {
      updateCubeUpgradeBG(j)
    }
  }
  for (let j = 1; j < player.researches.length; j++) {
    if (player.researches[j] > 0) {
      updateResearchBG(j)
    }
  }
  updateSingularityGlobalPerks()
  revealStuff()
}

// updates singularity perks that do not get saved to player object
// so that we can call on save load to fix game state
export const updateSingularityGlobalPerks = () => {
  const perk_5 = player.highestSingularityCount >= 5
  const shopItemPerk_5 = ['offeringAuto', 'offeringEX', 'obtainiumAuto', 'obtainiumEX', 'antSpeed', 'cashGrab'] as const
  for (const key of shopItemPerk_5) {
    shopData[key].refundMinimumLevel = perk_5 ? 10 : key.endsWith('Auto') ? 1 : 0
  }

  const perk_20 = player.highestSingularityCount >= 20
  const shopItemPerk_20 = [
    'offeringAuto',
    'offeringEX',
    'obtainiumAuto',
    'obtainiumEX',
    'antSpeed',
    'cashGrab'
  ] as const
  for (const key of shopItemPerk_20) {
    shopData[key].refundable = !perk_20
  }

  const perk_51 = player.highestSingularityCount >= 51
  const shopItemPerk_51 = [
    'seasonPass',
    'seasonPass2',
    'seasonPass3',
    'seasonPassY',
    'chronometer',
    'chronometer2'
  ] as const
  for (const key of shopItemPerk_51) {
    shopData[key].refundable = !perk_51
  }
}

export const singularity = (setSingNumber = -1) => {
  if (runes.antiquities.level === 0 && setSingNumber === -1) {
    Alert(
      'You nearly triggered a double singularity bug! Oh no! Luckily, our staff prevented this from happening.'
    )
    return
  }

  // setSingNumber is only not -1 when we are entering and exiting a challenge.
  if (setSingNumber === -1) {
    // get total cube blessings for history
    const cubeArray = Object.values(player.cubeBlessings)
    const tesseractArray = Object.values(player.tesseractBlessings)
    const hypercubeArray = Object.values(player.hypercubeBlessings)
    const platonicArray = Object.values(player.platonicBlessings)
    // Update sing history
    const historyEntry: ResetHistoryEntrySingularity = {
      seconds: player.singularityCounter,
      date: Date.now(),
      singularityCount: player.singularityCount,
      quarks: player.quarksThisSingularity,
      c15Score: player.challenge15Exponent,
      goldenQuarks: calculateGoldenQuarks(),
      wowTribs: sumContents(cubeArray),
      tessTribs: sumContents(tesseractArray),
      hyperTribs: sumContents(hypercubeArray),
      platTribs: sumContents(platonicArray),
      octeracts: player.totalWowOcteracts,
      quarkHept: hepteracts.quark.BAL,
      kind: 'singularity'
    }
    resetHistoryAdd('singularity', historyEntry)
  }

  resetRunes('singularity')
  resetRuneBlessings('singularity')
  resetRuneSpirits('singularity')
  resetTalismanData('singularity')

  player.goldenQuarks += calculateGoldenQuarks()

  if (setSingNumber === -1) {
    const incrementSingCount = 1 + getFastForwardTotalMultiplier()
    player.singularityCount += incrementSingCount
    if (player.singularityCount >= player.highestSingularityCount) {
      player.highestSingularityCount = player.singularityCount

      if (player.highestSingularityCount === 5) {
        goldenQuarkUpgrades.goldenQuarks3.freeLevel += 1
      }
      if (player.highestSingularityCount === 10) {
        goldenQuarkUpgrades.goldenQuarks3.freeLevel += 2
      }
    }
  } else {
    player.singularityCount = setSingNumber
  }

  player.totalQuarksEver += player.quarksThisSingularity
  forceResetShopUpgrades()

  const hold = playerJsonSchema.parse(deepClone()(blankSave))

  // Reset Displays
  changeTab(Tabs.Buildings)
  changeSubTab(Tabs.Buildings, { page: 0 })
  changeSubTab(Tabs.Runes, { page: 0 }) // Set 'runes' subtab back to 'runes' tab
  changeSubTab(Tabs.Challenges, { page: 0 }) // Set 'challenges' subtab back to 'normal' tab
  changeSubTab(Tabs.WowCubes, { page: 0 }) // Set 'cube tribues' subtab back to 'cubes' tab
  changeSubTab(Tabs.Corruption, { page: 0 }) // set 'corruption main'
  changeSubTab(Tabs.Singularity, { page: 0 }) // set 'singularity main'
  changeSubTab(Tabs.Settings, { page: 0 }) // set 'statistics main'

  hold.achievements = [...player.achievements]
  hold.progressiveAchievements = { ...player.progressiveAchievements }

  hold.history.singularity = player.history.singularity
  hold.totalQuarksEver = player.totalQuarksEver
  hold.singularityCount = player.singularityCount
  hold.highestSingularityCount = player.highestSingularityCount
  hold.goldenQuarks = player.goldenQuarks
  hold.shopUpgrades = player.shopUpgrades
  hold.shopPotionsConsumed = player.shopPotionsConsumed

  if (!player.singularityChallenges.limitedTime.rewards.preserveQuarks) {
    player.worlds.reset()
    hold.worlds = Number(hold.worlds)
  } else {
    hold.worlds = Number(player.worlds)
  }

  hold.goldenQuarkUpgrades = { ...player.goldenQuarkUpgrades }
  hold.octUpgrades = { ...player.octUpgrades }
  hold.ambrosiaUpgrades = { ...player.ambrosiaUpgrades }

  hold.spentBlueberries = player.spentBlueberries
  hold.autoChallengeToggles = player.autoChallengeToggles
  hold.autoChallengeTimer = player.autoChallengeTimer
  hold.saveString = player.saveString
  hold.corruptions.saves = Object.fromEntries(
    player.corruptions.saves.saves.map((save: SavedCorruption) => {
      return [save.name, save.loadout.loadout]
    })
  )
  hold.corruptions.showStats = player.corruptions.showStats
  hold.toggles = player.toggles
  hold.retrychallenges = player.retrychallenges
  hold.resettoggle1 = player.resettoggle1
  hold.resettoggle2 = player.resettoggle2
  hold.resettoggle3 = player.resettoggle3
  hold.resettoggle4 = player.resettoggle4
  hold.coinbuyamount = player.coinbuyamount
  hold.crystalbuyamount = player.crystalbuyamount
  hold.mythosbuyamount = player.mythosbuyamount
  hold.particlebuyamount = player.particlebuyamount
  hold.offeringbuyamount = player.offeringbuyamount
  hold.tesseractbuyamount = player.tesseractbuyamount
  hold.shoptoggles = player.shoptoggles
  hold.autoSacrificeToggle = player.autoSacrificeToggle
  hold.autoBuyFragment = player.autoBuyFragment
  hold.autoFortifyToggle = player.autoFortifyToggle
  hold.autoEnhanceToggle = player.autoEnhanceToggle
  hold.autoResearchToggle = player.autoResearchToggle
  hold.autoResearchMode = player.autoResearchMode
  hold.dailyCodeUsed = player.dailyCodeUsed
  hold.runeBlessingBuyAmount = player.runeBlessingBuyAmount
  hold.runeSpiritBuyAmount = player.runeSpiritBuyAmount
  hold.prestigeamount = player.prestigeamount
  hold.transcendamount = player.transcendamount
  hold.reincarnationamount = player.reincarnationamount
  hold.buyTalismanShardPercent = player.buyTalismanShardPercent
  hold.antMax = player.antMax
  hold.autoAntSacrifice = player.autoAntSacrifice
  hold.autoAntSacrificeMode = player.autoAntSacrificeMode
  hold.autoAntSacTimer = player.autoAntSacTimer
  hold.autoAscend = player.autoAscend
  hold.autoAscendMode = player.autoAscendMode
  hold.autoAscendThreshold = player.autoAscendThreshold
  hold.autoResearch = 0
  hold.autoTesseracts = player.autoTesseracts
  hold.tesseractAutoBuyerToggle = player.tesseractAutoBuyerToggle
  hold.tesseractAutoBuyerAmount = player.tesseractAutoBuyerAmount
  hold.autoOpenCubes = player.autoOpenCubes
  hold.openCubes = player.openCubes
  hold.autoOpenTesseracts = player.autoOpenTesseracts
  hold.openTesseracts = player.openTesseracts
  hold.autoOpenHypercubes = player.autoOpenHypercubes
  hold.openHypercubes = player.openHypercubes
  hold.autoOpenPlatonicsCubes = player.autoOpenPlatonicsCubes
  hold.openPlatonicsCubes = player.openPlatonicsCubes
  hold.historyShowPerSecond = player.historyShowPerSecond
  hold.exporttest = typeof player.exporttest === 'boolean' ? player.exporttest : player.exporttest === 'YES!'
  hold.dayTimer = player.dayTimer
  hold.dayCheck = player.dayCheck?.toISOString() ?? null
  hold.ascStatToggles = player.ascStatToggles
  hold.hepteractAutoCraftPercentage = player.hepteractAutoCraftPercentage
  hold.autoWarpCheck = player.autoWarpCheck
  hold.shopBuyMaxToggle = player.shopBuyMaxToggle
  hold.shopHideToggle = player.shopHideToggle
  hold.shopConfirmationToggle = player.shopConfirmationToggle
  hold.researchBuyMaxToggle = player.researchBuyMaxToggle
  hold.cubeUpgradesBuyMaxToggle = player.cubeUpgradesBuyMaxToggle
  hold.wowOcteracts = player.wowOcteracts
  hold.totalWowOcteracts = player.totalWowOcteracts
  hold.overfluxOrbsAutoBuy = player.overfluxOrbsAutoBuy
  hold.hotkeys = player.hotkeys
  hold.theme = player.theme
  hold.notation = player.notation
  hold.firstPlayed = player.firstPlayed
  hold.autoCubeUpgradesToggle = player.autoCubeUpgradesToggle
  hold.autoPlatonicUpgradesToggle = player.autoPlatonicUpgradesToggle
  hold.insideSingularityChallenge = player.insideSingularityChallenge
  hold.redAmbrosia = player.redAmbrosia
  hold.lifetimeRedAmbrosia = player.lifetimeRedAmbrosia
  hold.redAmbrosiaTime = player.redAmbrosiaTime
  hold.redAmbrosiaUpgrades = player.redAmbrosiaUpgrades
  hold.visitedAmbrosiaSubtabRed = player.visitedAmbrosiaSubtabRed
  hold.singularityChallenges = Object.fromEntries(
    Object.entries(player.singularityChallenges).map(([key, value]) => {
      return [key, {
        completions: value.completions,
        highestSingularityCompleted: value.highestSingularityCompleted,
        enabled: value.enabled
      }]
    })
  ) as Player['singularityChallenges']
  hold.iconSet = player.iconSet

  resetHepteracts('singularity')
  // Hold hepteract data needed in player after resetHepteracts (preserving AUTO and Quark ValueOf)
  hold.hepteracts = player.hepteracts

  hold.ambrosia = player.ambrosia
  hold.lifetimeAmbrosia = player.lifetimeAmbrosia
  hold.visitedAmbrosiaSubtab = player.visitedAmbrosiaSubtab
  hold.blueberryTime = player.blueberryTime
  hold.blueberryLoadouts = player.blueberryLoadouts
  hold.blueberryLoadoutMode = player.blueberryLoadoutMode as BlueberryLoadoutMode

  const saveCode42 = player.codes.get(42) ?? false
  const saveCode43 = player.codes.get(43) ?? false
  const saveCode44 = player.codes.get(44) ?? false
  const saveCode45 = player.codes.get(45) ?? false
  const saveCode46 = player.codes.get(46) ?? false
  const saveCode47 = player.codes.get(47) ?? false
  const saveCode48 = player.codes.get(48) ?? false

  importSynergism(btoa(JSON.stringify(hold)), true)
  // Techically possible to import game during reset. But that will only "hurt" that imported save

  // TODO: Do not enable data that has never used an event code
  player.codes.set(39, true)
  player.codes.set(40, true)
  player.codes.set(41, true)
  player.codes.set(42, saveCode42)
  player.codes.set(43, saveCode43)
  player.codes.set(44, saveCode44)
  player.codes.set(45, saveCode45)
  player.codes.set(46, saveCode46)
  player.codes.set(47, saveCode47)
  player.codes.set(48, saveCode48)
  updateSingularityMilestoneAwards()

  player.rngCode = Date.now()
  player.promoCodeTiming.time = Date.now()

  // Campaign HTML updates
  campaignIconHTMLUpdates()
  campaignCorruptionStatsHTMLReset()
  campaignTokenRewardHTMLUpdate()

  // Save again at the end of singularity reset
  saveSynergy()
}

const resetUpgrades = (i: number) => {
  if (i > 2.5) {
    for (let i = 41; i < 61; i++) {
      if (i !== 46) {
        player.upgrades[i] = 0
      }
    }

    if (player.researches[41] === 0) {
      player.upgrades[46] = 0
    }

    if (player.researches[41] === 0) {
      player.upgrades[88] = 0
    }
    if (player.researches[42] === 0) {
      player.upgrades[90] = 0
    }
    if (player.researches[43] === 0) {
      player.upgrades[91] = 0
    }
    if (player.researches[44] === 0) {
      player.upgrades[92] = 0
    }
    if (player.researches[45] === 0) {
      player.upgrades[93] = 0
    }

    player.upgrades[116] = 0
    player.upgrades[117] = 0
    player.upgrades[118] = 0
    player.upgrades[119] = 0
    player.upgrades[120] = 0
  }

  for (let j = 1; j <= 20; j++) {
    player.upgrades[j] = 0
  }

  // both indices go up by 5, so we can put them together!
  for (let j = 121, k = 106; j <= 125; j++, k++) {
    player.upgrades[j] = 0
    player.upgrades[k] = 0
  }

  if (i > 1.5) {
    player.upgrades[101] = 0
    player.upgrades[102] = 0
    player.upgrades[103] = 0
    player.upgrades[104] = 0
    player.upgrades[105] = 0
  }

  if (i > 1.5) {
    for (let k = 21; k < 41; k++) {
      player.upgrades[k] = 0
    }

    player.upgrades[111] = 0
    player.upgrades[112] = 0
    player.upgrades[113] = 0
    player.upgrades[114] = 0
    player.upgrades[115] = 0
  }

  if (i > 1.5) {
    player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
    player.crystalUpgradesCost = [7, 15, 20, 40, 100, 200, 500, 1000]

    updateEffectiveLevelMult() // update before prism rune, fixes c15 bug

    let m = 0
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
      m += 10
    }
    player.crystalUpgrades = [m, m, m, m, m, m, m, m]
  }

  for (let x = 1; x <= 125; x++) {
    upgradeupdate(x, true)
  }
}

export const resetAnts = () => {
  player.firstOwnedAnts = 0
  player.secondOwnedAnts = 0
  player.thirdOwnedAnts = 0
  player.fourthOwnedAnts = 0
  player.fifthOwnedAnts = 0
  player.sixthOwnedAnts = 0
  player.seventhOwnedAnts = 0
  player.eighthOwnedAnts = 0

  player.firstGeneratedAnts = new Decimal('0')
  player.secondGeneratedAnts = new Decimal('0')
  player.thirdGeneratedAnts = new Decimal('0')
  player.fourthGeneratedAnts = new Decimal('0')
  player.fifthGeneratedAnts = new Decimal('0')
  player.sixthGeneratedAnts = new Decimal('0')
  player.seventhGeneratedAnts = new Decimal('0')
  player.eighthGeneratedAnts = new Decimal('0')

  player.firstCostAnts = new Decimal('1e700')
  player.secondCostAnts = new Decimal('3')
  player.thirdCostAnts = new Decimal('100')
  player.fourthCostAnts = new Decimal('1e4')
  player.fifthCostAnts = new Decimal('1e12')
  player.sixthCostAnts = new Decimal('1e36')
  player.seventhCostAnts = new Decimal('1e100')
  player.eighthCostAnts = new Decimal('1e300')

  if (player.cubeUpgrades[48] > 0) {
    player.firstOwnedAnts = 1
    player.firstCostAnts = new Decimal('1e741')
  }

  const ant12 = player.antUpgrades[12 - 1]
  player.antUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ant12]
  player.antPoints = new Decimal('1')

  if (player.currentChallenge.ascension === 12) {
    player.antPoints = new Decimal('7')
  }

  calculateAnts()
}

export const getResetResearches = () => {
  // Array listing all the research indexes deserving of removal
  // dprint-ignore
  const destroy = [
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
    51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70,
    76, 81, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 97, 98,
    101, 102, 103, 104, 106, 107, 108, 109, 110, 116, 117, 118, 121, 122, 123,
    126, 127, 128, 129, 131, 132, 133, 134, 136, 137, 139, 141, 142, 143, 144, 146, 147, 148, 149,
    151, 152, 154, 156, 157, 158, 159, 161, 162, 163, 164, 166, 167, 169, 171, 172, 173, 174,
    176, 177, 178, 179, 181, 182, 184, 186, 187, 188, 189, 191, 192, 193, 194, 196, 197, 199
  ]

  if (player.highestSingularityCount < 25) {
    destroy.push(138, 153, 168, 183, 198)
  }

  return destroy
}

const resetResearches = () => {
  player.obtainium = new Decimal(0)

  for (const item of getResetResearches()) {
    player.researches[item] = 0
  }
}
