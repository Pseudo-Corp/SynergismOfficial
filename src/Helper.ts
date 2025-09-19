import Decimal from 'break_infinity.js'
import { sacrificeAnts } from './Ants'
import {
  calculateAmbrosiaGenerationSpeed,
  calculateAmbrosiaLuck,
  calculateAscensionSpeedMult,
  calculateGlobalSpeedMult,
  calculateGoldenQuarks,
  calculateOcteractMultiplier,
  calculateRedAmbrosiaGenerationSpeed,
  calculateRedAmbrosiaLuck,
  calculateRequiredBlueberryTime,
  calculateRequiredRedAmbrosiaTime,
  calculateResearchAutomaticObtainium
} from './Calculate'
import { getOcteractUpgradeEffect } from './Octeracts'
import { quarkHandler } from './Quark'
import { getRedAmbrosiaUpgradeEffects } from './RedAmbrosiaUpgrades'
import { Seed, seededRandom } from './RNG'
import { buyAllBlessingLevels } from './RuneBlessings'
import { getNumberUnlockedRunes, indexToRune, type RuneKeys, runes, sacrificeOfferings } from './Runes'
import { buyAllSpiritLevels } from './RuneSpirits'
import { useConsumable } from './Shop'
import { getGQUpgradeEffect } from './singularity'
import { player } from './Synergism'
import { Tabs } from './Tabs'
import { buyAllTalismanResources } from './Talismans'
import { visualUpdateAmbrosia, visualUpdateOcteracts, visualUpdateResearch } from './UpdateVisuals'
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

/**
 * addTimers will add (in milliseconds) time to the reset counters, and quark export timer
 * @param input
 * @param time
 */
export const addTimers = (input: TimerInput, time = 0) => {
  const globalTimeMultiplier = getGQUpgradeEffect('halfMind')
    ? 10
    : calculateGlobalSpeedMult()

  const timeMultiplier = input === 'ascension'
      || input === 'quarks'
      || input === 'goldenQuarks'
      || input === 'singularity'
      || input === 'octeracts'
      || input === 'autoPotion'
      || input === 'ambrosia'
      || input === 'redAmbrosia'
    ? 1
    : globalTimeMultiplier

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
      const ascensionSpeedMulti = getGQUpgradeEffect('oneMind')
        ? 10
        : calculateAscensionSpeedMult()
      player.ascensionCounter += time * timeMultiplier * ascensionSpeedMulti
      player.ascensionCounterReal += time * timeMultiplier
      break
    }
    case 'singularity': {
      player.ascensionCounterRealReal += time
      player.singularityCounter += time * timeMultiplier

      if (player.insideSingularityChallenge) {
        player.singChallengeTimer += time * timeMultiplier
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
      if (getGQUpgradeEffect('goldenQuarks3') === 0) {
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
      if (!getGQUpgradeEffect('octeractUnlock')) {
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
          const levels = [160, 173, 185, 194, 204, 210, 219, 229, 240, 249]
          const frac = 1e-6
          let actualLevel = 0
          for (const sing of levels) {
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
        visualUpdateOcteracts()
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
          / getOcteractUpgradeEffect('octeractAutoPotionSpeed')

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
    case 'ambrosia': {
      const compute = calculateAmbrosiaGenerationSpeed()
      if (compute === 0) {
        break
      }

      G.ambrosiaTimer += time * timeMultiplier

      if (G.ambrosiaTimer < 0.125) {
        break
      }

      const ambrosiaLuck = calculateAmbrosiaLuck()
      const baseBlueberryTime = calculateAmbrosiaGenerationSpeed()
      player.blueberryTime += Math.floor(8 * G.ambrosiaTimer) / 8 * baseBlueberryTime
      G.ambrosiaTimer %= 0.125

      let timeToAmbrosia = calculateRequiredBlueberryTime()

      while (player.blueberryTime >= timeToAmbrosia) {
        const RNG = seededRandom(Seed.Ambrosia)
        const ambrosiaMult = Math.floor(ambrosiaLuck / 100)
        const luckMult = RNG < ambrosiaLuck / 100 - Math.floor(ambrosiaLuck / 100) ? 1 : 0
        const bonusAmbrosia = (player.singularityChallenges.noAmbrosiaUpgrades.rewards.bonusAmbrosia) ? 1 : 0
        const ambrosiaToGain = (ambrosiaMult + luckMult) + bonusAmbrosia

        player.ambrosia += ambrosiaToGain
        player.lifetimeAmbrosia += ambrosiaToGain
        player.blueberryTime -= timeToAmbrosia

        timeToAmbrosia = calculateRequiredBlueberryTime()
      }

      visualUpdateAmbrosia()
      break
    }
    case 'redAmbrosia': {
      if (!player.visitedAmbrosiaSubtabRed) {
        break
      } else {
        const speed = calculateRedAmbrosiaGenerationSpeed()
        G.redAmbrosiaTimer += time * timeMultiplier
        if (G.redAmbrosiaTimer < 0.125) {
          break
        }

        player.redAmbrosiaTime += Math.floor(8 * G.redAmbrosiaTimer) / 8 * speed
        G.redAmbrosiaTimer %= 0.125
        let timeToRedAmbrosia = calculateRequiredRedAmbrosiaTime()

        let ambrosiaTimeToGrant = 0
        const timeCoeff = getRedAmbrosiaUpgradeEffects('redAmbrosiaAccelerator').ambrosiaTimePerRedAmbrosia

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

        visualUpdateAmbrosia()
      }
    }
  }
}

type AutoToolInput =
  | 'addObtainium'
  | 'addOfferings'
  | 'runeSacrifice'
  | 'antSacrifice'

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
      // Update visual displays if appropriate
      if (G.currentTab === Tabs.Research) {
        visualUpdateResearch()
      }
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
        player.sacrificeTimer >= 1
        && player.offerings.gt(0)
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
        // Modulo used in event of a large delta time (this could happen for a number of reasons)
        player.sacrificeTimer %= 1
      }
      break
    case 'antSacrifice': {
      const globalDelta = getGQUpgradeEffect('halfMind') ? 10 : calculateGlobalSpeedMult()

      player.antSacrificeTimer += time * globalDelta
      player.antSacrificeTimerReal += time

      // Equal to real time iff "Real Time" option selected in ants tab.
      const antSacrificeTimer = player.autoAntSacrificeMode === 2
        ? player.antSacrificeTimerReal
        : player.antSacrificeTimer

      if (
        antSacrificeTimer >= player.autoAntSacTimer
        && player.antSacrificeTimerReal > 0.1
        && player.researches[124] === 1
        && player.autoAntSacrifice
        && player.antPoints.gte('1e40')
      ) {
        void sacrificeAnts(true)
      }
      break
    }
  }
}
