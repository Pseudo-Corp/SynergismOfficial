import Decimal from 'break_infinity.js'
import { getAmbrosiaUpgradeEffects } from './BlueberryUpgrades'
import {
  calculateAmbrosiaGenerationSpeed,
  calculateAmbrosiaLuck,
  calculateAscensionSpeedMult,
  calculateGlobalSpeedMult,
  calculateGoldenQuarks,
  calculateOcteractMultiplier,
  calculatePurpleHoneyConversionFactor,
  calculatePurpleHoneyExtractionMultiplier,
  calculatePurpleHoneyLuck,
  calculatePurpleHoneyPerExtraction,
  calculatePurpleReactantCapacity,
  calculatePurpleReactantConversion,
  calculatePurpleReactantHalfLife,
  calculatePurpleReactantRouting,
  calculateRedAmbrosiaGenerationSpeed,
  calculateRedAmbrosiaLuck,
  calculateRedAmbrosiaReactantCapacity,
  calculateRequiredBlueberryTime,
  calculateRequiredRedAmbrosiaTime,
  calculateResearchAutomaticObtainium
} from './Calculate'
import { sacrificeAnts } from './Features/Ants/AntSacrifice/sacrifice'
import { canAutoSacrifice } from './Features/Ants/Automation/sacrifice'
import { getLevelMilestone } from './Levels'
import { getOcteractUpgradeEffect } from './Octeracts'
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
import { buyAllTalismanResources } from './Talismans'
import { animatePurpleHoneyGain, visualUpdatePurple } from './UpdateVisuals'
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
  | 'ambrosia'
  | 'redAmbrosia'
  | 'purpleHoney'

const octeractGiveawayLevels = [160, 173, 185, 194, 204, 210, 219, 229, 240, 249]

type PurpleReactant = 'ambrosia' | 'redAmbrosia'

const AMBROSIA_TICK_THRESHOLD = 0.125

/**
 * Routes one reactant's Bar Points into its Purple Honey container.
 * The Bar Points route to the container before being allocated to Ambrosia/Red Bar Point containers
 * in the Ambrosia Subtab.
 */
const processPurpleReactant = (
  reactant: PurpleReactant,
  elapsedSeconds: number,
  productionPerSecond: number
) => {
  const capacity = reactant === 'ambrosia'
    ? calculatePurpleReactantCapacity()
    : calculateRedAmbrosiaReactantCapacity()
  let stored = 0
  let percentage = 0

  if (reactant === 'ambrosia') {
    stored = player.purpleReactor.storedAmbrosiaBarPoints
    percentage = player.purpleReactor.ambrosiaBarPointPercentage
  } else {
    stored = player.purpleReactor.storedRedAmbrosiaBarPoints
    percentage = player.purpleReactor.redAmbrosiaBarPointPercentage
  }

  const routing = calculatePurpleReactantRouting(
    productionPerSecond,
    percentage,
    stored,
    capacity,
    elapsedSeconds
  )

  if (reactant === 'ambrosia') {
    player.purpleReactor.storedAmbrosiaBarPoints = routing.storedBarPoints
  } else {
    player.purpleReactor.storedRedAmbrosiaBarPoints = routing.storedBarPoints
  }

  return routing.regularBarPoints
}

const convertPurpleReactants = (elapsedSeconds: number) => {

  const halfLife = calculatePurpleReactantHalfLife()
  const conversionFraction = 1 - Math.pow(2, -elapsedSeconds / halfLife)
  const {
    ambrosiaBarPointsSpent,
    redAmbrosiaBarPointsSpent,
    purpleBarPointsGained
  } = calculatePurpleReactantConversion(player.purpleReactor.storedAmbrosiaBarPoints, player.purpleReactor.storedRedAmbrosiaBarPoints, conversionFraction)

  const conversionFactor = calculatePurpleHoneyConversionFactor()
  const purpleHoneyProgress = player.purpleHoneyProgress + purpleBarPointsGained
  const completedExtractions = Math.floor(purpleHoneyProgress / conversionFactor)
  const { guaranteedMultiplier, bonusMultiplierChance } = calculatePurpleHoneyExtractionMultiplier(
    calculatePurpleHoneyLuck()
  )
  let bonusExtractions = 0

  if (bonusMultiplierChance > 0) {
    for (let i = 0; i < completedExtractions; i++) {
      if (seededRandom(Seed.PurpleHoney) < bonusMultiplierChance) {
        bonusExtractions++
      }
    }
  }

  const purpleHoneyGained = (completedExtractions * guaranteedMultiplier + bonusExtractions)
    * calculatePurpleHoneyPerExtraction()

  player.purpleReactor.storedAmbrosiaBarPoints -= ambrosiaBarPointsSpent
  player.purpleReactor.storedRedAmbrosiaBarPoints -= redAmbrosiaBarPointsSpent
  player.purpleHoneyProgress = purpleHoneyProgress % conversionFactor
  player.purpleReactor.purpleHoney += purpleHoneyGained
  player.purpleReactor.lifetimePurpleHoney += purpleHoneyGained
  player.stats.highestPurpleHoney = Math.max(
    player.stats.highestPurpleHoney,
    player.purpleReactor.purpleHoney
  )

  if (purpleHoneyGained > 0) {
    animatePurpleHoneyGain(purpleHoneyGained)
  }
}

/**
 * addTimers will add (in milliseconds) time to the reset counters, and quark export timer
 * @param input
 * @param time
 * @param globalSpeedMult
 */
export const addTimers = (input: TimerInput, time = 0, globalSpeedMult?: () => number) => {
  const timeMultiplier = input === 'prestige'
      || input === 'transcension'
      || input === 'reincarnation'
    ? getGQUpgradeEffect('halfMind', 'unlocked')
      ? G.MIND_DIVISOR
      : globalSpeedMult?.() ?? calculateGlobalSpeedMult()
    : 1

  switch (input) {
    case 'prestige': {
      player.prestigecounter += time * timeMultiplier
      break
    }
    case 'transcension': {
      player.transcendcounter += time * timeMultiplier
      break
    }
    case 'reincarnation': {
      player.reincarnationcounter += time * timeMultiplier
      break
    }
    case 'ascension': {
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
    case 'purpleHoney': {
      G.purpleHoneyTimer += time * timeMultiplier
      if (G.purpleHoneyTimer < AMBROSIA_TICK_THRESHOLD) {
        break
      }

      const elapsed = Math.floor(G.purpleHoneyTimer / AMBROSIA_TICK_THRESHOLD)
        * AMBROSIA_TICK_THRESHOLD
      G.purpleHoneyTimer %= AMBROSIA_TICK_THRESHOLD
      convertPurpleReactants(elapsed)
      visualUpdatePurple()
      break
    }
    case 'ambrosia': {
      G.ambrosiaTimer += time * timeMultiplier

      if (G.ambrosiaTimer < AMBROSIA_TICK_THRESHOLD) {
        break
      }

      const elapsed = Math.floor(G.ambrosiaTimer / AMBROSIA_TICK_THRESHOLD) * AMBROSIA_TICK_THRESHOLD
      G.ambrosiaTimer %= AMBROSIA_TICK_THRESHOLD
      const isUnlocked = player.singularityChallenges.noSingularityUpgrades.completions > 0
      const baseBlueberryTime = isUnlocked ? calculateAmbrosiaGenerationSpeed() : 0
      const normalBarPoints = processPurpleReactant('ambrosia', elapsed, baseBlueberryTime)

      if (!isUnlocked) {
        break
      }

      const ambrosiaLuck = calculateAmbrosiaLuck()
      player.blueberryTime += normalBarPoints
      let timeToAmbrosia = calculateRequiredBlueberryTime()

      while (player.blueberryTime >= timeToAmbrosia) {
        const RNG = seededRandom(Seed.Ambrosia)
        const ambrosiaMult = Math.floor(ambrosiaLuck / 100)
        const luckMult = RNG < ambrosiaLuck / 100 - Math.floor(ambrosiaLuck / 100) ? 1 : 0
        const bonusAmbrosia = getSingularityChallengeEffect('noAmbrosiaUpgrades', 'bonusAmbrosia')
        const ambrosiaToGain = (ambrosiaMult + luckMult) + bonusAmbrosia

        player.ambrosia += ambrosiaToGain
        player.lifetimeAmbrosia += ambrosiaToGain
        player.blueberryTime -= timeToAmbrosia

        timeToAmbrosia = calculateRequiredBlueberryTime()
      }

      break
    }
    case 'redAmbrosia': {
      G.redAmbrosiaTimer += time * timeMultiplier
      if (G.redAmbrosiaTimer < AMBROSIA_TICK_THRESHOLD) {
        break
      }

      const elapsed = Math.floor(G.redAmbrosiaTimer / AMBROSIA_TICK_THRESHOLD) * AMBROSIA_TICK_THRESHOLD
      G.redAmbrosiaTimer %= AMBROSIA_TICK_THRESHOLD
      const isUnlocked = player.singularityChallenges.noAmbrosiaUpgrades.completions > 0
      const speed = isUnlocked ? calculateRedAmbrosiaGenerationSpeed() : 0
      const normalBarPoints = processPurpleReactant('redAmbrosia', elapsed, speed)

      if (!isUnlocked) {
        break
      }

      player.redAmbrosiaTime += normalBarPoints
      let timeToRedAmbrosia = calculateRequiredRedAmbrosiaTime()

      let ambrosiaTimeToGrant = 0
      const timeCoeff = getRedAmbrosiaUpgradeEffects('redAmbrosiaAccelerator', 'ambrosiaTimePerRedAmbrosia')

      while (player.redAmbrosiaTime >= timeToRedAmbrosia) {
        const redAmbrosiaLuck = calculateRedAmbrosiaLuck()
        const RNG = seededRandom(Seed.RedAmbrosia)
        const redAmbrosiaMult = Math.floor(redAmbrosiaLuck / 100)
        const luckMult = RNG < redAmbrosiaLuck / 100 - Math.floor(redAmbrosiaLuck / 100) ? 1 : 0
        const redAmbrosiaToGain = redAmbrosiaMult + luckMult

        player.redAmbrosia += redAmbrosiaToGain
        player.lifetimeRedAmbrosia += redAmbrosiaToGain
        ambrosiaTimeToGrant += redAmbrosiaToGain * timeCoeff
        player.redAmbrosiaTime -= timeToRedAmbrosia
        timeToRedAmbrosia = calculateRequiredRedAmbrosiaTime()
      }

      if (ambrosiaTimeToGrant > 0) {
        addTimers('ambrosia', ambrosiaTimeToGrant)
      }
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
