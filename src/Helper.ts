import { sacrificeAnts } from './Ants'
import { buyAllBlessings } from './Buy'
import {
  calculateAscensionAcceleration,
  calculateAutomaticObtainium,
  calculateGoldenQuarkGain,
  calculateMaxRunes,
  calculateObtainium,
  calculateRequiredBlueberryTime,
  calculateTimeAcceleration,
  octeractGainPerSecond
} from './Calculate'
import { quarkHandler } from './Quark'
import { checkMaxRunes, redeemShards, unlockedRune } from './Runes'
import { useConsumable } from './Shop'
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

/**
 * addTimers will add (in milliseconds) time to the reset counters, and quark export timer
 * @param input
 * @param time
 */
export const addTimers = (input: TimerInput, time = 0) => {
  const timeMultiplier = input === 'ascension'
      || input === 'quarks'
      || input === 'goldenQuarks'
      || input === 'singularity'
      || input === 'octeracts'
      || input === 'autoPotion'
      || input === 'ambrosia'
    ? 1
    : calculateTimeAcceleration().mult

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
      const ascensionSpeedMulti = player.singularityUpgrades.oneMind.getEffect()
          .bonus
        ? 10
        : calculateAscensionAcceleration()
      player.ascensionCounter += time * timeMultiplier * ascensionSpeedMulti
      player.ascensionCounterReal += time * timeMultiplier
      break
    }
    case 'singularity': {
      player.ascensionCounterRealReal += time
      player.singularityCounter += time * timeMultiplier
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
      if (+player.singularityUpgrades.goldenQuarks3.getEffect().bonus === 0) {
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
      if (!player.singularityUpgrades.octeractUnlock.getEffect().bonus) {
        return
      } else {
        player.octeractTimer += time * timeMultiplier
      }
      if (player.octeractTimer >= 1) {
        const amountOfGiveaways = player.octeractTimer - (player.octeractTimer % 1)
        player.octeractTimer %= 1

        const perSecond = octeractGainPerSecond()
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
            const quarkFraction = player.quarksThisSingularity * frac * actualLevel
            player.goldenQuarks += quarkFraction * calculateGoldenQuarkGain(true)
            player.quarksThisSingularity -= quarkFraction
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
          / +player.octeractUpgrades.octeractAutoPotionSpeed.getEffect().bonus

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
          void useConsumable(
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
          void useConsumable(
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
      const compute = player.caches.ambrosiaGeneration.totalVal
      if (compute === 0) {
        break
      }

      G.ambrosiaTimer += time * timeMultiplier

      if (G.ambrosiaTimer < 0.125) {
        break
      }

      const ambrosiaLuck = player.caches.ambrosiaLuck.usedTotal
      const baseBlueberryTime = player.caches.ambrosiaGeneration.totalVal
      player.blueberryTime += Math.floor(8 * G.ambrosiaTimer) / 8 * baseBlueberryTime
      player.ultimateProgress += Math.floor(8 * G.ambrosiaTimer) / 8 * Math.min(baseBlueberryTime, Math.pow(1000 * baseBlueberryTime, 1/2)) * 0.02
      G.ambrosiaTimer %= 0.125

      let timeToAmbrosia = calculateRequiredBlueberryTime()

      while (player.blueberryTime >= timeToAmbrosia) {
        const RNG = Math.random()
        const ambrosiaMult = Math.floor(ambrosiaLuck / 100)
        const luckMult = RNG < ambrosiaLuck / 100 - Math.floor(ambrosiaLuck / 100) ? 1 : 0
        const bonusAmbrosia = (player.singularityChallenges.noAmbrosiaUpgrades.rewards.bonusAmbrosia) ? 1: 0
        const ambrosiaToGain = (ambrosiaMult + luckMult) + bonusAmbrosia

        player.ambrosia += ambrosiaToGain
        player.lifetimeAmbrosia += ambrosiaToGain
        player.blueberryTime -= timeToAmbrosia

        G.ambrosiaTimer += ambrosiaToGain * 0.2 * player.shopUpgrades.shopAmbrosiaAccelerator
        timeToAmbrosia = calculateRequiredBlueberryTime()
      }

      if (player.ultimateProgress > 1e6) {
        player.ultimatePixels += Math.floor(player.ultimateProgress / 1e6)
        player.ultimateProgress -= 1e6 * Math.floor(player.ultimateProgress / 1e6)
      }

      visualUpdateAmbrosia()
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
  const timeMultiplier = input === 'runeSacrifice' || input === 'addOfferings'
    ? 1
    : calculateTimeAcceleration().mult

  switch (input) {
    case 'addObtainium': {
      // If in challenge 14, abort and do not award obtainium
      if (player.currentChallenge.ascension === 14) {
        break
      }
      // Update Obtainium Multipliers + Amount to gain
      calculateObtainium()
      const obtainiumGain = calculateAutomaticObtainium()
      // Add Obtainium
      player.researchPoints = Math.min(
        1e300,
        player.researchPoints + obtainiumGain * time * timeMultiplier
      )
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
      player.runeshards = Math.min(
        1e300,
        player.runeshards + Math.floor(G.autoOfferingCounter)
      )
      G.autoOfferingCounter %= 1
      break
    case 'runeSacrifice':
      // Every real life second this will trigger
      player.sacrificeTimer += time
      if (
        player.sacrificeTimer >= 1
        && isFinite(player.runeshards)
        && player.runeshards > 0
      ) {
        // Automatic purchase of Blessings
        if (player.highestSingularityCount >= 15) {
          let ratio = 4
          if (player.toggles[36]) {
            buyAllBlessings('Blessings', 100 / ratio, true)
            ratio--
          }
          if (player.toggles[37]) {
            buyAllBlessings('Spirits', 100 / ratio, true)
            ratio--
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
          const maxi = player.highestSingularityCount >= 50
            ? 7
            : player.highestSingularityCount >= 30
            ? 6
            : 5
          const notMaxed = maxi - checkMaxRunes(maxi)
          if (notMaxed > 0) {
            const baseAmount = Math.floor(player.runeshards / notMaxed / 2)
            for (let i = 0; i < maxi; i++) {
              if (
                !(
                  !unlockedRune(i + 1)
                  || player.runelevels[i] >= calculateMaxRunes(i + 1)
                )
              ) {
                redeemShards(i + 1, true, baseAmount)
              }
            }
          }
        } else {
          // If you did not buy cube upgrade 2x10 it sacrifices to selected rune.
          const rune = player.autoSacrifice
          redeemShards(rune, true, 0)
        }
        // Modulo used in event of a large delta time (this could happen for a number of reasons)
        player.sacrificeTimer %= 1
      }
      break
    case 'antSacrifice': {
      // Increments real and 'fake' timers. the Real timer is on real life seconds.
      player.antSacrificeTimer += time * timeMultiplier
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
