import Decimal from 'break_infinity.js'
import { getAmbrosiaUpgradeEffects } from './BlueberryUpgrades'
import {
  calculateAmbrosiaGenerationSpeed,
  calculateAmbrosiaRewardLuck,
  calculateAscensionSpeedMult,
  calculateEncabulatorSpeed,
  calculateGlobalSpeedMult,
  calculateGoldenQuarks,
  calculateOcteractMultiplier,
  calculatePurpleHoneyConversionFactor,
  calculatePurpleHoneyExtractionMultiplier,
  calculatePurpleHoneyPerExtraction,
  calculatePurpleHoneyRewardLuck,
  calculatePurpleOverflowResolution,
  calculatePurpleReactantCapacity,
  calculatePurpleReactantConversion,
  calculatePurpleReactantRouting,
  calculateRedAmbrosiaGenerationSpeed,
  calculateRedAmbrosiaReactantCapacity,
  calculateRedAmbrosiaRewardLuck,
  calculateRequiredBlueberryTime,
  calculateRequiredRedAmbrosiaTime,
  calculateResearchAutomaticObtainium
} from './Calculate'
import { sacrificeAnts } from './Features/Ants/AntSacrifice/sacrifice'
import { canAutoSacrifice } from './Features/Ants/Automation/sacrifice'
import { getLevelMilestone } from './Levels'
import { getOcteractUpgradeEffect } from './Octeracts'
import { getPurpleReactorUpgradeEffects } from './Purple'
import { getPurpleAmbrosiaUpgradeEffects } from './PurpleAmbrosiaUpgrades'
import { PURPLE_REACTOR_TICK_INTERVAL } from './PurpleReactor'
import { quarkHandler } from './Quark'
import { getRedAmbrosiaUpgradeEffects } from './RedAmbrosiaUpgrades'
import { Seed, seededRandom } from './RNG'
import { buyAllBlessingLevels } from './RuneBlessings'
import { getNumberUnlockedRunes, indexToRune, type RuneKeys, runes, sacrificeOfferings } from './Runes'
import { buyAllSpiritLevels } from './RuneSpirits'
import { getShopUpgradeEffects, useConsumable } from './Shop'
import { getGQUpgradeEffect } from './singularity'
import { getSingularityChallengeEffect } from './SingularityChallenges'
import { player } from './Synergism'
import { autoCraftSynthesis } from './Synthesis'
import { buyAllTalismanResources } from './Talismans'
import { animatePurpleHoneyGain } from './UpdateVisuals'
import { Globals as G } from './Variables'

type TimerInput =
  | 'prestige'
  | 'transcension'
  | 'reincarnation'
  | 'ascension'
  | 'quarks'
  | 'goldenQuarks'
  | 'singularity'
  | 'octeracts'
  | 'autoPotion'
  | 'purpleReactor'

const octeractGiveawayLevels = [160, 173, 185, 194, 204, 210, 219, 229, 240, 249]

const awardAmbrosiaBarFill = (globalSpeedMult?: () => number) => {
  const ambrosiaLuck = calculateAmbrosiaRewardLuck()
  const RNG = seededRandom(Seed.Ambrosia)
  const ambrosiaMult = Math.floor(ambrosiaLuck / 100)
  const luckMult = RNG < ambrosiaLuck / 100 - Math.floor(ambrosiaLuck / 100) ? 1 : 0
  const bonusAmbrosia = getSingularityChallengeEffect('noAmbrosiaUpgrades', 'bonusAmbrosia')
  const ambrosiaToGain = (ambrosiaMult + luckMult) + bonusAmbrosia

  if (player.singularityChallenges.barDependence.enabled) {
    addTimers('prestige', ambrosiaToGain * 0.01, globalSpeedMult, true)
    addTimers('transcension', ambrosiaToGain * 0.01, globalSpeedMult, true)
    addTimers('reincarnation', ambrosiaToGain * 0.01, globalSpeedMult, true)
    addTimers('autoPotion', ambrosiaToGain * 0.01, globalSpeedMult, true)
  } else {
    player.ambrosia += ambrosiaToGain
    player.lifetimeAmbrosia += ambrosiaToGain
  }
  player.purpleHoneyProgress += getPurpleAmbrosiaUpgradeEffects('cancer', 'purpleBarPointsOnFill')
}

/**
 * @returns seconds of Ambrosia generation granted by Red Ambrosia Accelerator
 */
const awardRedAmbrosiaBarFill = () => {
  const redAmbrosiaLuck = calculateRedAmbrosiaRewardLuck()
  const RNG = seededRandom(Seed.RedAmbrosia)
  const redAmbrosiaMult = Math.floor(redAmbrosiaLuck / 100)
  const luckMult = RNG < redAmbrosiaLuck / 100 - Math.floor(redAmbrosiaLuck / 100) ? 1 : 0
  const redAmbrosiaToGain = redAmbrosiaMult + luckMult

  if (player.singularityChallenges.barDependence.enabled) {
    addTimers('ascension', redAmbrosiaToGain * 0.05, undefined, true)
  } else {
    player.redAmbrosia += redAmbrosiaToGain
    player.lifetimeRedAmbrosia += redAmbrosiaToGain
  }
  player.purpleHoneyProgress += getPurpleAmbrosiaUpgradeEffects('cancer', 'purpleBarPointsOnFill')
  return redAmbrosiaToGain * getRedAmbrosiaUpgradeEffects('redAmbrosiaAccelerator', 'ambrosiaTimePerRedAmbrosia')
}

const gainAmbrosia = (globalSpeedMult?: () => number) => {
  if (player.singularityChallenges.noSingularityUpgrades.completions === 0) {
    return
  }

  let timeToAmbrosia = calculateRequiredBlueberryTime()

  while (player.blueberryTime >= timeToAmbrosia) {
    awardAmbrosiaBarFill(globalSpeedMult)
    player.blueberryTime -= timeToAmbrosia
    timeToAmbrosia = calculateRequiredBlueberryTime()
  }
}

/**
 * Converts Red Ambrosia Bar Points into Red Ambrosia.
 * @returns seconds of Ambrosia generation granted by Red Ambrosia Accelerator
 */
const gainRedAmbrosia = () => {
  if (player.singularityChallenges.noAmbrosiaUpgrades.completions === 0) {
    return 0
  }

  let timeToRedAmbrosia = calculateRequiredRedAmbrosiaTime()
  let ambrosiaTimeToGrant = 0

  while (player.redAmbrosiaTime >= timeToRedAmbrosia) {
    ambrosiaTimeToGrant += awardRedAmbrosiaBarFill()
    player.redAmbrosiaTime -= timeToRedAmbrosia
    timeToRedAmbrosia = calculateRequiredRedAmbrosiaTime()
  }

  return ambrosiaTimeToGrant
}

/**
 * Routes Bar Points into their tanks, runs the main reaction, and then reacts any excess against the
 * stock left over. Bar Points that are not reacted go to the regular Ambrosia/Red Ambrosia bars.
 * @returns Purple Bar Points gained
 */
const reactPurpleReactants = (
  ambrosiaBarPoints: number,
  redAmbrosiaBarPoints: number,
  reactionSeconds: number
) => {
  const ambrosiaRouting = calculatePurpleReactantRouting(
    ambrosiaBarPoints,
    player.purpleReactor.ambrosiaBarPointPercentage,
    player.purpleReactor.storedAmbrosiaBarPoints,
    calculatePurpleReactantCapacity(),
    1
  )
  const redAmbrosiaRouting = calculatePurpleReactantRouting(
    redAmbrosiaBarPoints,
    player.purpleReactor.redAmbrosiaBarPointPercentage,
    player.purpleReactor.storedRedAmbrosiaBarPoints,
    calculateRedAmbrosiaReactantCapacity(),
    1
  )

  const reaction = calculatePurpleReactantConversion(
    ambrosiaRouting.storedBarPoints,
    redAmbrosiaRouting.storedBarPoints,
    calculatePurpleReactantCapacity() * calculateEncabulatorSpeed() / 100 / 3600 * reactionSeconds
  )
  const ambrosiaAfterReaction = Math.max(0, ambrosiaRouting.storedBarPoints - reaction.ambrosiaBarPointsSpent)
  const redAmbrosiaAfterReaction = Math.max(0, redAmbrosiaRouting.storedBarPoints - reaction.redAmbrosiaBarPointsSpent)

  // Overflow reacts only with stock the main reaction did not consume.
  const overflow = calculatePurpleOverflowResolution(
    ambrosiaRouting.excessBarPoints,
    redAmbrosiaRouting.excessBarPoints,
    ambrosiaAfterReaction,
    redAmbrosiaAfterReaction
  )

  player.purpleReactor.storedAmbrosiaBarPoints = Math.max(
    0,
    ambrosiaAfterReaction - overflow.storedAmbrosiaBarPointsSpent
  )
  player.purpleReactor.storedRedAmbrosiaBarPoints = Math.max(
    0,
    redAmbrosiaAfterReaction - overflow.storedRedAmbrosiaBarPointsSpent
  )
  player.blueberryTime += ambrosiaRouting.regularBarPoints + overflow.ambrosiaRefundBarPoints
  player.redAmbrosiaTime += redAmbrosiaRouting.regularBarPoints + overflow.redAmbrosiaRefundBarPoints

  return reaction.purpleBarPointsGained + overflow.purpleBarPointsGained
}

const calculateAmbrosiaBarPointsGenerated = (seconds: number) =>
  seconds > 0 && player.singularityChallenges.noSingularityUpgrades.completions > 0
    ? calculateAmbrosiaGenerationSpeed() * seconds
    : 0

const calculateRedAmbrosiaBarPointsGenerated = (seconds: number) =>
  seconds > 0 && player.singularityChallenges.noAmbrosiaUpgrades.completions > 0
    ? calculateRedAmbrosiaGenerationSpeed() * seconds
    : 0

/**
 * Runs the Chroma-Encabulator in one pass, then converts full bars into Ambrosia/Red Ambrosia.
 * Every source of Bar Points is routed through the tanks first.
 * @param ambrosiaSeconds seconds of Ambrosia Bar Point generation
 * @param redAmbrosiaSeconds seconds of Red Ambrosia Bar Point generation
 * @param reactionSeconds seconds of Encabulator reaction
 */
export const runPurpleReactor = (
  ambrosiaSeconds: number,
  redAmbrosiaSeconds: number,
  reactionSeconds: number,
  globalSpeedMult?: () => number
) => {
  const purpleBarPointsGained = reactPurpleReactants(
    calculateAmbrosiaBarPointsGenerated(ambrosiaSeconds),
    calculateRedAmbrosiaBarPointsGenerated(redAmbrosiaSeconds),
    reactionSeconds
  )

  const conversionFactor = calculatePurpleHoneyConversionFactor()
  const purpleHoneyProgress = player.purpleHoneyProgress + purpleBarPointsGained
  const completedExtractions = Math.floor(purpleHoneyProgress / conversionFactor)
  const { guaranteedMultiplier, bonusMultiplierChance } = calculatePurpleHoneyExtractionMultiplier(
    calculatePurpleHoneyRewardLuck()
  )
  let bonusExtractions = 0

  if (bonusMultiplierChance > 0) {
    let extractionsToLoop = completedExtractions
    if (completedExtractions > 100) {
      const hundredBundles = Math.floor(completedExtractions / 100)
      extractionsToLoop %= 100
      bonusExtractions = Math.floor(bonusMultiplierChance * 100 * hundredBundles)
    }
    for (let i = 0; i < extractionsToLoop; i++) {
      if (seededRandom(Seed.PurpleHoney) < bonusMultiplierChance) {
        bonusExtractions++
      }
    }
  }

  const purpleHoneyExtracted = completedExtractions * guaranteedMultiplier + bonusExtractions
  const purpleHoneyGained = purpleHoneyExtracted * calculatePurpleHoneyPerExtraction()

  player.purpleHoneyProgress = purpleHoneyProgress % conversionFactor

  const ambrosiaBarPointsRebated = completedExtractions * (
    getPurpleAmbrosiaUpgradeEffects('gemini', 'ambrosiaBarPointsOnFill')
    + getShopUpgradeEffects('shopPurpleBarRebate', 'ambrosiaBarPointsPerFill')
  )
  const redAmbrosiaBarPointsRebated = completedExtractions * (
    getPurpleAmbrosiaUpgradeEffects('gemini', 'redAmbrosiaBarPointsOnFill')
    + getShopUpgradeEffects('shopPurpleBarRebate', 'redAmbrosiaBarPointsPerFill')
  )
  let ambrosiaTimeToGrant = 0

  if (completedExtractions > 0) {
    if (player.singularityChallenges.barDependence.enabled) {
      // Each Purple Honey extracted (from Purple Honey Luck) grants the effect of both bars directly.
      for (let i = 0; i < purpleHoneyExtracted; i++) {
        if (player.singularityChallenges.noSingularityUpgrades.completions > 0) {
          awardAmbrosiaBarFill(globalSpeedMult)
        }
        if (player.singularityChallenges.noAmbrosiaUpgrades.completions > 0) {
          ambrosiaTimeToGrant += awardRedAmbrosiaBarFill()
        }
      }
    } else {
      player.purpleReactor.purpleHoney += purpleHoneyGained
      player.purpleReactor.lifetimePurpleHoney += purpleHoneyGained
      animatePurpleHoneyGain(purpleHoneyGained)
      player.stats.highestPurpleHoney = Math.max(
        player.stats.highestPurpleHoney,
        player.purpleReactor.purpleHoney
      )
      if (player.singularityCounter >= 3600 && !player.singularityChallenges.barDependence.enabled) {
        const quarksToAdd = purpleHoneyGained
          * getPurpleReactorUpgradeEffects('purpleQuarkGain', 'quarksPerPurpleHoney')
        player.worlds.add(quarksToAdd, true, true)
      }
    }
  }

  // Bar Points granted after the reaction are routed without reacting again. Purple Bar Points from
  // their overflow count toward the next extraction, which keeps this pass from feeding itself.
  if (ambrosiaBarPointsRebated > 0 || redAmbrosiaBarPointsRebated > 0) {
    player.purpleHoneyProgress += reactPurpleReactants(ambrosiaBarPointsRebated, redAmbrosiaBarPointsRebated, 0)
  }

  gainAmbrosia(globalSpeedMult)
  ambrosiaTimeToGrant += gainRedAmbrosia()
  if (ambrosiaTimeToGrant > 0) {
    player.purpleHoneyProgress += reactPurpleReactants(calculateAmbrosiaBarPointsGenerated(ambrosiaTimeToGrant), 0, 0)
    gainAmbrosia(globalSpeedMult)
  }
}

/**
 * addTimers will add (in milliseconds) time to the reset counters, and quark export timer
 * @param input
 * @param time
 * @param globalSpeedMult
 */
export const addTimers = (input: TimerInput, time = 0, globalSpeedMult?: () => number, barDependenceSrc = false) => {
  const timeMultiplier = input === 'prestige'
      || input === 'transcension'
      || input === 'reincarnation'
    ? getGQUpgradeEffect('halfMind', 'unlocked')
      ? G.MIND_DIVISOR
      : globalSpeedMult?.() ?? calculateGlobalSpeedMult()
    : 1

  switch (input) {
    case 'prestige': {
      if (player.singularityChallenges.barDependence.enabled && !barDependenceSrc) {
        return
      }
      player.prestigecounter += time * timeMultiplier
      break
    }
    case 'transcension': {
      if (player.singularityChallenges.barDependence.enabled && !barDependenceSrc) {
        return
      }
      player.transcendcounter += time * timeMultiplier
      break
    }
    case 'reincarnation': {
      if (player.singularityChallenges.barDependence.enabled && !barDependenceSrc) {
        return
      }
      player.reincarnationcounter += time * timeMultiplier
      break
    }
    case 'ascension': {
      if (player.singularityChallenges.barDependence.enabled && !barDependenceSrc) {
        return
      }
      // Anything in here is affected by add code
      const ascensionSpeedMulti = getGQUpgradeEffect('oneMind', 'unlocked')
        ? G.MIND_DIVISOR
        : calculateAscensionSpeedMult()
      player.ascensionCounter += time * timeMultiplier * ascensionSpeedMulti
      player.ascensionCounterReal += time * timeMultiplier
      break
    }
    case 'singularity': {
      const singularitySpeedMulti = getAmbrosiaUpgradeEffects('ambrosiaBrickOfLead', 'singularitySpeedMult')
      player.ascensionCounterRealReal += time
      player.singularityCounter += time * timeMultiplier * singularitySpeedMulti

      if (player.insideSingularityChallenge) {
        player.singChallengeTimer += time * timeMultiplier * singularitySpeedMulti
      } else {
        player.singChallengeTimer = 0
      }

      break
    }
    case 'quarks': {
      // First get maximum Quark Clock (25h, up to +25 from Research 8x20)
      const maxQuarkTimer = quarkHandler().maxTime
      player.quarkstimer += time * timeMultiplier
      // Checks if this new time is greater than maximum, in which it will default to that time.
      // Otherwise returns itself.
      player.quarkstimer = player.quarkstimer > maxQuarkTimer ? maxQuarkTimer : player.quarkstimer
      break
    }
    case 'goldenQuarks': {
      if (getGQUpgradeEffect('goldenQuarks3', 'exportGQPerHour') === 0) {
        return
      } else {
        player.goldenQuarksTimer += time * timeMultiplier
        player.goldenQuarksTimer = player.goldenQuarksTimer > 3600 * 168
          ? 3600 * 168
          : player.goldenQuarksTimer
      }
      break
    }
    case 'octeracts': {
      if (!getGQUpgradeEffect('octeractUnlock', 'unlocked')) {
        return
      } else {
        player.octeractTimer += time * timeMultiplier
      }
      if (player.octeractTimer >= 1) {
        const amountOfGiveaways = player.octeractTimer - (player.octeractTimer % 1)
        player.octeractTimer %= 1

        const perSecond = calculateOcteractMultiplier()
        player.wowOcteracts += amountOfGiveaways * perSecond
        player.totalWowOcteracts += amountOfGiveaways * perSecond

        if (player.highestSingularityCount >= 160) {
          const frac = 1e-6
          let actualLevel = 0
          for (const sing of octeractGiveawayLevels) {
            if (player.highestSingularityCount >= sing) {
              actualLevel += 1
            }
          }

          for (let i = 0; i < amountOfGiveaways; i++) {
            const quarkFraction = frac * actualLevel
            player.goldenQuarks += quarkFraction * calculateGoldenQuarks()
            player.quarksThisSingularity *= 1 - quarkFraction
          }
        }
      }
      break
    }
    case 'autoPotion': {
      if (player.singularityChallenges.barDependence.enabled && !barDependenceSrc) {
        return
      }
      if (player.highestSingularityCount < 6) {
        return
      } else {
        // player.toggles[42] enables FAST Offering Potion Expenditure, but actually spends the potion.
        // Hence, you need at least one potion to be able to use fast spend.
        const toggleOfferingOn = player.toggles[42] && player.shopUpgrades.offeringPotion > 0
        // player.toggles[43] enables FAST Obtainium Potion Expenditure, but actually spends the potion.
        const toggleObtainiumOn = player.toggles[43] && player.shopUpgrades.obtainiumPotion > 0

        player.autoPotionTimer += time * timeMultiplier
        player.autoPotionTimerObtainium += time * timeMultiplier

        const timerThreshold = (180 * Math.pow(1.03, -player.highestSingularityCount))
          / getOcteractUpgradeEffect('octeractAutoPotionSpeed', 'autoPotionSpeedMult')

        const effectiveOfferingThreshold = toggleOfferingOn
          ? Math.min(1, timerThreshold) / 20
          : timerThreshold
        const effectiveObtainiumThreshold = toggleObtainiumOn
          ? Math.min(1, timerThreshold) / 20
          : timerThreshold

        if (player.autoPotionTimer >= effectiveOfferingThreshold) {
          const amountOfPotions = (player.autoPotionTimer
            - (player.autoPotionTimer % effectiveOfferingThreshold))
            / effectiveOfferingThreshold
          player.autoPotionTimer %= effectiveOfferingThreshold
          useConsumable(
            'offeringPotion',
            true,
            amountOfPotions,
            toggleOfferingOn
          )
        }

        if (player.autoPotionTimerObtainium >= effectiveObtainiumThreshold) {
          const amountOfPotions = (player.autoPotionTimerObtainium
            - (player.autoPotionTimerObtainium % effectiveObtainiumThreshold))
            / effectiveObtainiumThreshold
          player.autoPotionTimerObtainium %= effectiveObtainiumThreshold
          useConsumable(
            'obtainiumPotion',
            true,
            amountOfPotions,
            toggleObtainiumOn
          )
        }
      }
      break
    }
    case 'purpleReactor': {
      G.purpleReactorTimer += time * timeMultiplier
      if (G.purpleReactorTimer < PURPLE_REACTOR_TICK_INTERVAL) {
        break
      }

      const elapsed = Math.floor(G.purpleReactorTimer / PURPLE_REACTOR_TICK_INTERVAL)
        * PURPLE_REACTOR_TICK_INTERVAL
      G.purpleReactorTimer %= PURPLE_REACTOR_TICK_INTERVAL
      runPurpleReactor(elapsed, elapsed, elapsed, globalSpeedMult)
      autoCraftSynthesis()
      break
    }
  }
}

type AutoToolInput =
  | 'addObtainium'
  | 'addOfferings'
  | 'runeSacrifice'
  | 'antSacrifice'

const calculateAutoSacrificeInterval = () => {
  let interval = 1
  interval /= getShopUpgradeEffects('offeringAuto', 'autoRuneSpeedMult')
  if (player.cubeUpgrades[20] > 0) {
    interval /= 2
  }
  interval /= getLevelMilestone('runeAutobuyImprover')
  return interval
}
let autoSacrificeInterval = 1

/**
 * Assortment of tools which are used when actions are automated.
 * @param input
 * @param time
 */
export const automaticTools = (input: AutoToolInput, time: number) => {
  switch (input) {
    case 'addObtainium': {
      // If in challenge 14, abort and do not award obtainium
      if (player.currentChallenge.ascension === 14) {
        break
      }

      let obtainiumGain = calculateResearchAutomaticObtainium(time)
      if (
        player.singularityChallenges.taxmanLastStand.enabled
        && player.singularityChallenges.taxmanLastStand.completions >= 2
      ) {
        obtainiumGain = Decimal.min(
          obtainiumGain,
          player.obtainium.times(100).plus(1)
        )
      }

      // Add Obtainium
      player.obtainium = player.obtainium.add(obtainiumGain)
      break
    }
    case 'addOfferings':
      // This counter can be increased through challenge 3 reward
      // As well as cube upgrade 1x2 (2).
      G.autoOfferingCounter += time
      // Any time this exceeds 1 it adds an offering
      player.offerings = player.offerings.add(Math.floor(G.autoOfferingCounter))
      G.autoOfferingCounter %= 1
      break
    case 'runeSacrifice':
      // Every real life second this will trigger
      player.sacrificeTimer += time
      if (
        player.sacrificeTimer >= autoSacrificeInterval
        && player.offerings.gt(new Decimal())
      ) {
        // Automatic purchase of Blessings
        if (player.highestSingularityCount >= 15) {
          if (player.toggles[36]) {
            buyAllBlessingLevels(player.offerings.div(2))
          }
          if (player.toggles[37]) {
            buyAllSpiritLevels(player.offerings.div(2))
          }
        }
        if (
          player.autoBuyFragment
          && player.highestSingularityCount >= 40
          && player.cubeUpgrades[51] > 0
        ) {
          buyAllTalismanResources()
        }

        // If you bought cube upgrade 2x10 then it sacrifices to all runes equally
        if (player.cubeUpgrades[20] === 1) {
          let numUnlocked = getNumberUnlockedRunes()

          // Do not purchase AoAG under s50
          if (player.highestSingularityCount < 50 && runes.antiquities.isUnlocked()) {
            numUnlocked -= 1
          }

          // Do not purchase IA under s30
          if (player.highestSingularityCount < 30 && runes.infiniteAscent.isUnlocked()) {
            numUnlocked -= 1
          }

          const offeringPerRune = Decimal.floor(player.offerings.mul(0.5).div(numUnlocked))

          for (const key of Object.keys(player.runes)) {
            const runeKey = key as RuneKeys
            sacrificeOfferings(runeKey, offeringPerRune, true)
          }
        } else {
          // If you did not buy cube upgrade 2x10 it sacrifices to selected rune.
          const rune = player.autoSacrifice
          if (rune !== 0) {
            sacrificeOfferings(indexToRune[rune], player.offerings, true)
          }
        }
        autoSacrificeInterval = calculateAutoSacrificeInterval()
        player.sacrificeTimer = 0
      }
      break
    case 'antSacrifice': {
      const globalDelta = getGQUpgradeEffect('halfMind', 'unlocked') ? G.MIND_DIVISOR : calculateGlobalSpeedMult()

      player.antSacrificeTimer += time * globalDelta
      player.antSacrificeTimerReal += time

      const timeElapsed = player.antSacrificeTimerReal
      const crumbs = player.ants.crumbsThisSacrifice
      const mode = player.ants.toggles.autoSacrificeMode
      if (
        canAutoSacrifice(crumbs, mode, timeElapsed)
      ) {
        sacrificeAnts()
      }
      break
    }
  }
}
