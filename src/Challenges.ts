import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateRuneLevels } from './Calculate'
import { hepteractEffective } from './Hepteracts'
import { autoResearchEnabled } from './Research'
import { format, player, resetCheck } from './Synergism'
import { toggleAutoChallengeModeText, toggleChallenges } from './Toggles'
import { productContents } from './Utility'
import { Globals as G } from './Variables'

export const getMaxChallenges = (i: number) => {
  let maxChallenge = 0
  // Transcension Challenges
  if (i <= 5) {
    if (player.singularityChallenges.oneChallengeCap.enabled) {
      return 1
    }
    // Start with base 25 max completions
    maxChallenge = 25
    // Check Research 5x5 ('Infinite' T. Challenges)
    if (player.researches[105] > 0) {
      return 9001
    }
    // Max T. Challenge depends on researches 3x16 to 3x20
    maxChallenge += 5 * player.researches[65 + i]
    return maxChallenge
  }
  // Reincarnation Challenges
  if (i <= 10 && i > 5) {
    if (player.singularityChallenges.oneChallengeCap.enabled) {
      return 1
    }
    // Start with base of 40 max completions
    maxChallenge = 40
    // Cube Upgrade 2x9: +4/level
    maxChallenge += 4 * player.cubeUpgrades[29]
    // Shop Upgrade "Challenge Extension": +2/level
    maxChallenge += 2 * player.shopUpgrades.challengeExtension
    // Platonic Upgrade 5 (ALPHA): +10
    if (player.platonicUpgrades[5] > 0) {
      maxChallenge += 10
    }
    // Platonic Upgrade 10 (BETA): +10
    if (player.platonicUpgrades[10] > 0) {
      maxChallenge += 10
    }
    // Platonic Upgrade 15 (OMEGA): +30
    if (player.platonicUpgrades[15] > 0) {
      maxChallenge += 30
    }

    maxChallenge += 2 * +player.singularityUpgrades.singChallengeExtension.getEffect().bonus
    maxChallenge += 2 * +player.singularityUpgrades.singChallengeExtension2.getEffect().bonus
    maxChallenge += 2 * +player.singularityUpgrades.singChallengeExtension3.getEffect().bonus

    maxChallenge += +player.singularityChallenges.oneChallengeCap.rewards.capIncrease
    return maxChallenge
  }
  // Ascension Challenge
  if (i <= 15 && i > 10) {
    // Challenge 15 has no formal cap, so return 9001.
    if (i === 15) {
      return 0
    }
    if (player.singularityChallenges.oneChallengeCap.enabled) {
      return 1
    }
    // Start with base of 30 max completions
    maxChallenge = 30
    // Platonic Upgrade 5 (ALPHA): +5
    if (player.platonicUpgrades[5] > 0) {
      maxChallenge += 5
    }
    // Platonic Upgrade 10 (BETA): +5
    if (player.platonicUpgrades[10] > 0) {
      maxChallenge += 5
    }
    // Platonic Upgrade 15 (OMEGA): +20
    if (player.platonicUpgrades[15] > 0) {
      maxChallenge += 20
    }

    maxChallenge += +player.singularityUpgrades.singChallengeExtension.getEffect().bonus
    maxChallenge += +player.singularityUpgrades.singChallengeExtension2.getEffect().bonus
    maxChallenge += +player.singularityUpgrades.singChallengeExtension3.getEffect().bonus
    return maxChallenge
  }

  return maxChallenge
}

export const challengeDisplay = (i: number, changefocus = true) => {
  let quarksMultiplier = 1

  if (changefocus) {
    G.challengefocus = i
    DOMCacheGetOrSet('oneChallengeDetails').style.display = 'flex'
    DOMCacheGetOrSet('startChallenge').style.display = 'block'
    DOMCacheGetOrSet('retryChallenge').style.display = 'block'
    G.triggerChallenge = i
  }

  const maxChallenges = getMaxChallenges(i)
  if (i <= 5 && changefocus) {
    if (player.challengecompletions[i] >= 100) {
      DOMCacheGetOrSet('completionSoftcap').innerHTML = i18next.t('challenges.perCompletionBonus', {
        x: 100,
        y: format(CalcECC('transcend', player.challengecompletions[i]), 2, true)
      })
    } else {
      DOMCacheGetOrSet('completionSoftcap').textContent = i18next.t('challenges.perCompletionBonusEmpty')
    }
  }

  if (i > 5 && i <= 10) {
    quarksMultiplier = 10
    if (player.challengecompletions[i] >= 25 && changefocus) {
      DOMCacheGetOrSet('completionSoftcap').innerHTML = i18next.t('challenges.perCompletionBonus', {
        x: 25,
        y: format(CalcECC('reincarnation', player.challengecompletions[i]), 2, true)
      })
    } else {
      DOMCacheGetOrSet('completionSoftcap').textContent = i18next.t('challenges.perCompletionBonusEmpty')
    }
  }
  if (i > 10) {
    if (player.challengecompletions[i] >= 10) {
      DOMCacheGetOrSet('completionSoftcap').innerHTML = i18next.t('challenges.perCompletionBonus', {
        x: 10,
        y: format(CalcECC('ascension', player.challengecompletions[i]), 2, true)
      })
    } else {
      DOMCacheGetOrSet('completionSoftcap').textContent = i18next.t('challenges.perCompletionBonusEmpty')
    }
  }
  let descriptor = ''
  const a = DOMCacheGetOrSet('challengeName')
  const b = DOMCacheGetOrSet('challengeFlavor')
  const c = DOMCacheGetOrSet('challengeRestrictions')
  const d = DOMCacheGetOrSet('challengeGoal')
  const e = DOMCacheGetOrSet('challengePer1').childNodes[0]
  const f = DOMCacheGetOrSet('challengePer2').childNodes[0]
  const g = DOMCacheGetOrSet('challengePer3').childNodes[0]
  const h = DOMCacheGetOrSet('challengeFirst1')
  const j = DOMCacheGetOrSet('challengeQuarkBonus')
  const k = DOMCacheGetOrSet('startChallenge')
  const l = DOMCacheGetOrSet('challengeCurrent1')
  const m = DOMCacheGetOrSet('challengeCurrent2')
  const n = DOMCacheGetOrSet('challengeCurrent3')

  if (i === G.challengefocus) {
    const completions = `${player.challengecompletions[i]}/${format(maxChallenges)}`
    const special = (i >= 6 && i <= 10) || i === 15
    const goal = format(challengeRequirement(i, player.challengecompletions[i], special ? i : 0))

    let current1 = ''
    let current2 = ''
    let current3 = ''

    switch (i) {
      case 1: {
        current1 = current2 = format(10 * CalcECC('transcend', player.challengecompletions[1]))
        current3 = format(0.04 * CalcECC('transcend', player.challengecompletions[1]), 2, true)
        break
      }
      case 2: {
        current1 = current2 = format(5 * CalcECC('transcend', player.challengecompletions[2]))
        break
      }
      case 3: {
        current1 = format(0.04 * player.challengecompletions[3], 2, true)
        current2 = format(0.5 * CalcECC('transcend', player.challengecompletions[3]), 2, true)
        current3 = format(0.01 * CalcECC('transcend', player.challengecompletions[3]), 2, true)
        break
      }
      case 4: {
        current1 = format(5 * CalcECC('transcend', player.challengecompletions[4]))
        current2 = format(2 * CalcECC('transcend', player.challengecompletions[4]))
        current3 = format(0.5 * CalcECC('transcend', player.challengecompletions[4]), 2, true)
        break
      }
      case 5: {
        current1 = format(0.5 + CalcECC('transcend', player.challengecompletions[5]) / 100, 2, true)
        current2 = format(Math.pow(10, CalcECC('transcend', player.challengecompletions[5])))
        break
      }
      case 6: {
        current1 = format(Math.pow(0.965, CalcECC('reincarnation', player.challengecompletions[6])), 3, true)
        current2 = format(10 * CalcECC('reincarnation', player.challengecompletions[6]))
        current3 = format(2 * CalcECC('reincarnation', player.challengecompletions[6]))
        break
      }
      case 7: {
        current1 = format(1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7]), 2, true)
        current2 = current3 = format(10 * CalcECC('reincarnation', player.challengecompletions[7]))
        break
      }
      case 8: {
        current1 = format(0.25 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true)
        current2 = format(20 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true)
        current3 = format(4 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true)
        break
      }
      case 9: {
        current1 = format(CalcECC('reincarnation', player.challengecompletions[9]))
        current2 = format(Math.pow(1.1, CalcECC('reincarnation', player.challengecompletions[9])), 2, true)
        current3 = format(20 * CalcECC('reincarnation', player.challengecompletions[9]), 2, true)
        break
      }
      case 10: {
        current1 = format(100 * CalcECC('reincarnation', player.challengecompletions[10]))
        current2 = format(2 * CalcECC('reincarnation', player.challengecompletions[10]))
        current3 = format(10 * CalcECC('reincarnation', player.challengecompletions[10]), 2, true)
        break
      }
      case 11: {
        current1 = format(12 * CalcECC('ascension', player.challengecompletions[11]))
        current2 = format(Decimal.pow(1e5, CalcECC('ascension', player.challengecompletions[11])))
        current3 = format(80 * CalcECC('ascension', player.challengecompletions[11]))
        break
      }
      case 12: {
        current1 = format(50 * CalcECC('ascension', player.challengecompletions[12]))
        current2 = format(12 * CalcECC('ascension', player.challengecompletions[12]))
        current3 = format(CalcECC('ascension', player.challengecompletions[12]))
        break
      }
      case 13: {
        current1 = format(100 - 100 * Math.pow(0.966, CalcECC('ascension', player.challengecompletions[13])), 3, true)
        current2 = format(6 * CalcECC('ascension', player.challengecompletions[13]))
        current3 = format(3 * CalcECC('ascension', player.challengecompletions[13]))
        break
      }
      case 14: {
        current1 = format(50 * CalcECC('ascension', player.challengecompletions[14]))
        current2 = format(1 * player.challengecompletions[14])
        current3 = format(200 * CalcECC('ascension', player.challengecompletions[14]))
        break
      }
    }

    a.textContent = i18next.t(`challenges.${i}.name`, {
      value: completions,
      completions: player.challengecompletions[i],
      max: maxChallenges
    })
    b.textContent = i18next.t(`challenges.${i}.flavor`)
    c.textContent = i18next.t(`challenges.${i}.restrictions`)
    d.textContent = i18next.t(`challenges.${i}.goal`, { value: goal })
    e.textContent = i18next.t(`challenges.${i}.per.1`)
    f.textContent = i18next.t(`challenges.${i}.per.2`)
    g.textContent = i18next.t(`challenges.${i}.per.3`)
    h.textContent = i18next.t(`challenges.${i}.first`)
    k.textContent = i18next.t(`challenges.${i}.start`)
    l.textContent = i18next.t(`challenges.${i}.current.1`, { value: current1 })
    m.textContent = i18next.t(`challenges.${i}.current.2`, { value: current2 })
    n.textContent = i18next.t(`challenges.${i}.current.3`, { value: current3 })
  }

  if (i === 15 && G.challengefocus === 15 && maxChallenges === 0) {
    d.textContent = i18next.t('challenges.15.noGoal')
  }

  const scoreArray1 = [0, 8, 10, 12, 15, 20, 60, 80, 120, 180, 300]
  const scoreArray2 = [0, 10, 12, 15, 20, 30, 80, 120, 180, 300, 450]
  const scoreArray3 = [0, 20, 30, 50, 100, 200, 250, 300, 400, 500, 750]
  const scoreArray4 = [0, 10000, 10000, 10000, 10000, 10000, 2000, 3000, 4000, 5000, 7500]
  let scoreDisplay = 0
  if (i <= 5) {
    if (player.highestchallengecompletions[i] >= 9000) {
      scoreDisplay = scoreArray4[i]
    } else if (player.highestchallengecompletions[i] >= 750) {
      scoreDisplay = scoreArray3[i]
    } else if (player.highestchallengecompletions[i] >= 75) {
      scoreDisplay = scoreArray2[i]
    } else {
      scoreDisplay = scoreArray1[i]
    }
  }
  if (i > 5 && i <= 10) {
    if (player.highestchallengecompletions[i] >= 60) {
      scoreDisplay = scoreArray3[i]
    } else if (player.highestchallengecompletions[i] >= 25) {
      scoreDisplay = scoreArray2[i]
    } else {
      scoreDisplay = scoreArray1[i]
    }
  }
  if (changefocus) {
    j.textContent = ''
  }
  if (player.ascensionCount === 0) {
    descriptor = 'Quarks'
    j.style.color = 'cyan'
  }
  if (
    player.challengecompletions[i] >= player.highestchallengecompletions[i]
    && player.highestchallengecompletions[i] < maxChallenges && changefocus && player.ascensionCount < 1
  ) {
    j.textContent = i18next.t(descriptor ? 'challenges.firstTimeBonusQuarks' : 'challenges.firstTimeBonus', {
      x: Math.floor(
        quarksMultiplier * player.highestchallengecompletions[i] / 10 + 1 + player.cubeUpgrades[1]
          + player.cubeUpgrades[11] + player.cubeUpgrades[21] + player.cubeUpgrades[31] + player.cubeUpgrades[41]
      )
    })
  }
  if (
    player.challengecompletions[i] >= player.highestchallengecompletions[i]
    && player.highestchallengecompletions[i] < maxChallenges && changefocus && player.ascensionCount >= 1
  ) {
    j.textContent = i18next.t('challenges.ascensionBankAdd', {
      x: i > 5 ? 2 : 1,
      y: scoreDisplay
    })
  }
  if (
    player.challengecompletions[i] >= player.highestchallengecompletions[i]
    && player.highestchallengecompletions[i] < 10 && i > 10
  ) {
    j.textContent = i18next.t('challenges.hypercubeOneTimeBonus')
  }

  if (changefocus) {
    const el = DOMCacheGetOrSet('toggleAutoChallengeIgnore')
    el.style.display = i <= (autoAscensionChallengeSweepUnlock() ? 15 : 10) && player.researches[150] > 0
      ? 'block'
      : 'none'
    el.style.border = player.autoChallengeToggles[i] ? '2px solid green' : '2px solid red'

    if (i >= 11 && i <= 15) {
      if (player.autoChallengeToggles[i]) {
        el.textContent = i18next.t('challenges.autoAscRunChalOn', { x: i })
      } else {
        el.textContent = i18next.t('challenges.autoAscRunChalOff', { x: i })
      }
    } else {
      if (player.autoChallengeToggles[i]) {
        el.textContent = i18next.t('challenges.autoRunChalOn', { x: i })
      } else {
        el.textContent = i18next.t('challenges.autoRunChalOff', { x: i })
      }
    }
  }

  const ella = DOMCacheGetOrSet('toggleAutoChallengeStart')
  if (player.autoChallengeRunning) {
    ella.textContent = i18next.t('challenges.autoChallengeSweepOn')
    ella.style.border = '2px solid gold'
  } else {
    ella.textContent = i18next.t('challenges.autoChallengeSweepOff')
    ella.style.border = '2px solid red'
  }
}

export const getChallengeConditions = (i?: number) => {
  if (player.currentChallenge.reincarnation === 9) {
    G.rune1level = 1
    G.rune2level = 1
    G.rune3level = 1
    G.rune4level = 1
    G.rune5level = 1
    player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
  }
  G.prestigePointGain = new Decimal('0')
  if (typeof i === 'number') {
    if (i >= 6) {
      G.transcendPointGain = new Decimal('0')
    }
    if (i >= 11) {
      G.reincarnationPointGain = new Decimal('0')
    }
  }
  calculateRuneLevels()
}

export const toggleRetryChallenges = () => {
  DOMCacheGetOrSet('retryChallenge').textContent = player.retrychallenges
    ? i18next.t('challenges.retryChallengesOff')
    : i18next.t('challenges.retryChallengesOn')

  player.retrychallenges = !player.retrychallenges
}

export const highestChallengeRewards = (chalNum: number, highestValue: number) => {
  let multiplier = 1 / 10
  if (chalNum >= 6) {
    multiplier = 1
  }
  if (player.ascensionCount === 0) {
    player.worlds.add(1 + Math.floor(highestValue * multiplier) * 100 / 100)
  }
  // Addresses a bug where auto research does not work even if you unlock research
  if (autoResearchEnabled() && player.ascensionCount === 0 && chalNum >= 6 && chalNum <= 10) {
    player.roombaResearchIndex = 0
    player.autoResearch = G.researchOrderByCost[player.roombaResearchIndex]
  }
}

// Works to mitigate the difficulty of calculating challenge multipliers when considering softcapping
export const calculateChallengeRequirementMultiplier = (
  type: 'transcend' | 'reincarnation' | 'ascension',
  completions: number,
  special = 0
) => {
  let requirementMultiplier = Math.max(
    1,
    G.hyperchallengedMultiplier[player.usedCorruptions[4]] / (1 + player.platonicUpgrades[8] / 2.5)
  )
  if (type === 'ascension') {
    // Normalize back to 1 if looking at ascension challenges in particular.
    requirementMultiplier = 1
  }
  switch (type) {
    case 'transcend':
      requirementMultiplier *= G.challenge15Rewards.transcendChallengeReduction
      ;(completions >= 75)
        ? requirementMultiplier *= Math.pow(1 + completions, 12) / Math.pow(75, 8)
        : requirementMultiplier *= Math.pow(1 + completions, 2)

      if (completions >= 1000) {
        requirementMultiplier *= 10 * Math.pow(completions / 1000, 3)
      }
      if (completions >= 9000) {
        requirementMultiplier *= 1337
      }
      if (completions >= 9001) {
        requirementMultiplier *= completions - 8999
      }
      return requirementMultiplier
    case 'reincarnation':
      if (completions >= 100 && (special === 9 || special === 10)) {
        requirementMultiplier *= Math.pow(1.05, (completions - 100) * (1 + (completions - 100) / 20))
      }
      if (completions >= 90) {
        if (special === 6) {
          requirementMultiplier *= 100
        } else if (special === 7) {
          requirementMultiplier *= 50
        } else if (special === 8) {
          requirementMultiplier *= 10
        } else {
          requirementMultiplier *= 4
        }
      }
      if (completions >= 80) {
        if (special === 6) {
          requirementMultiplier *= 50
        } else if (special === 7) {
          requirementMultiplier *= 20
        } else if (special === 8) {
          requirementMultiplier *= 4
        } else {
          requirementMultiplier *= 2
        }
      }
      if (completions >= 70) {
        if (special === 6) {
          // Multiplier is reduced significantly for challenges requiring mythos shards
          requirementMultiplier *= 20
        } else if (special === 7) {
          requirementMultiplier *= 10
        } else if (special === 8) {
          requirementMultiplier *= 2
        } else {
          requirementMultiplier *= 1
        }
      }
      if (completions >= 60) {
        if (special === 9 || special === 10) {
          requirementMultiplier *= Math.pow(
            1000,
            (completions - 60)
              * (1 - 0.01 * player.shopUpgrades.challengeTome - 0.01 * player.shopUpgrades.challengeTome2) / 10
          )
        }
      }
      if (completions >= 25) {
        requirementMultiplier *= Math.pow(1 + completions, 5) / 625
      }
      if (completions < 25) {
        requirementMultiplier *= Math.min(Math.pow(1 + completions, 2), Math.pow(1.3797, completions))
      }
      requirementMultiplier *= G.challenge15Rewards.reincarnationChallengeReduction
      return requirementMultiplier
    case 'ascension':
      if (special !== 15) {
        ;(completions >= 10)
          ? requirementMultiplier *= 2 * (1 + completions) - 10
          : requirementMultiplier *= 1 + completions
      } else {
        requirementMultiplier *= Math.pow(1000, completions)
      }
      return requirementMultiplier
  }
}

/**
 * Works to mitigate the difficulty of calculating challenge reward multipliers when considering softcapping
 */
export const CalcECC = (type: 'transcend' | 'reincarnation' | 'ascension', completions: number) => { // ECC stands for "Effective Challenge Completions"
  let effective = 0
  switch (type) {
    case 'transcend':
      effective += Math.min(100, completions)
      effective += 1 / 20 * (Math.min(1000, Math.max(100, completions)) - 100)
      effective += 1 / 100 * (Math.max(1000, completions) - 1000)
      return effective
    case 'reincarnation':
      effective += Math.min(25, completions)
      effective += 1 / 2 * (Math.min(75, Math.max(25, completions)) - 25)
      effective += 1 / 10 * (Math.max(75, completions) - 75)
      return effective
    case 'ascension':
      effective += Math.min(10, completions)
      effective += 1 / 2 * (Math.max(10, completions) - 10)
      return effective
  }
}

export const challengeRequirement = (challenge: number, completion: number, special = 0) => {
  const base = G.challengeBaseRequirements[challenge - 1]
  if (challenge <= 5) {
    return Decimal.pow(10, base * calculateChallengeRequirementMultiplier('transcend', completion, special))
  } else if (challenge <= 10) {
    let c10Reduction = 0
    if (challenge === 10) {
      c10Reduction =
        1e8 * (player.researches[140] + player.researches[155] + player.researches[170] + player.researches[185])
        + 2e7 * (player.shopUpgrades.challengeTome + player.shopUpgrades.challengeTome2)
    }
    return Decimal.pow(
      10,
      (base - c10Reduction) * calculateChallengeRequirementMultiplier('reincarnation', completion, special)
    )
  } else if (challenge <= 14) {
    return calculateChallengeRequirementMultiplier('ascension', completion, special)
  } else if (challenge === 15) {
    return Decimal.pow(
      10,
      1 * Math.pow(10, 30) * calculateChallengeRequirementMultiplier('ascension', completion, special)
    )
  } else {
    return 0
  }
}

/**
 * Function that handles the autochallenge feature.
 * Currently includes ability to enter a challenge, leave a challenge
 * and start a challenge loop with specified challenges from index 1 to 10.
 * @param dt
 * @returns none
 */
export const runChallengeSweep = (dt: number) => {
  // Do not run if any of these conditions hold
  if (
    player.researches[150] === 0 // Research 6x25 is 0
    || !player.autoChallengeRunning // Auto challenge is toggled off
  ) {
    return
  }

  // Increment auto challenge timer
  G.autoChallengeTimerIncrement += dt

  // Determine what Action you can take with the current state of the savefile
  let action = 'none'
  if (
    player.currentChallenge.reincarnation !== 0
    || player.currentChallenge.transcension !== 0
  ) {
    // If you are in a challenge, you'd only want the automation to exit the challenge
    action = 'exit'
  } else if (player.autoChallengeIndex === 1) {
    // If the index is set to 1, then you are at the start of a loop
    action = 'start'
  } else {
    // If neither of the above are true, automation will want to enter a challenge
    action = 'enter'
  }

  // In order to earn C15 Exponent, stop runChallengeSweep() 5 seconds before the auto ascension
  // runs during the C15, Auto Challenge Sweep, Autcension and Mode: Real Time.
  if (
    autoAscensionChallengeSweepUnlock() && player.currentChallenge.ascension === 15
    && player.shopUpgrades.challenge15Auto === 0
    && (action === 'start' || action === 'enter') && player.autoAscend && player.challengecompletions[11] > 0
    && player.cubeUpgrades[10] > 0
    && player.autoAscendMode === 'realAscensionTime'
    && player.ascensionCounterRealReal >= Math.max(0.1, player.autoAscendThreshold - 5)
  ) {
    action = 'wait'
    toggleAutoChallengeModeText('WAIT')
    return
  }

  // Action: Exit challenge
  if (G.autoChallengeTimerIncrement >= player.autoChallengeTimer.exit && action === 'exit') {
    // Determine if you're in a reincarnation or transcension challenge
    const challengeType = player.currentChallenge.reincarnation !== 0 ? 'reincarnation' : 'transcension'

    // Reset our autochallenge timer
    G.autoChallengeTimerIncrement = 0

    // Increment our challenge index for when we enter (or start) next challenge
    const nowChallenge = player.autoChallengeIndex
    const nextChallenge = getNextChallenge(nowChallenge + 1)

    // Reset based on challenge type
    if (challengeType === 'transcension') {
      void resetCheck('transcensionChallenge', undefined, true)
    }
    if (challengeType === 'reincarnation') {
      void resetCheck('reincarnationChallenge', undefined, true)
    }

    // If you don't need to start all the challenges, the challenges will end.
    if (nextChallenge <= 10) {
      /* If the next challenge is before the current challenge,
               it will be in 'START' mode, otherwise it will be in 'ENTER' mode. */
      if (nextChallenge < nowChallenge) {
        player.autoChallengeIndex = 1
        toggleAutoChallengeModeText('START')
      } else {
        player.autoChallengeIndex = nextChallenge
        toggleAutoChallengeModeText('ENTER')
      }
    }
    return
  }

  // Action: Enter a challenge (not inside one)
  if (
    (G.autoChallengeTimerIncrement >= player.autoChallengeTimer.start && action === 'start')
    || (G.autoChallengeTimerIncrement >= player.autoChallengeTimer.enter && action === 'enter')
  ) {
    // Reset our autochallenge timer
    G.autoChallengeTimerIncrement = 0

    // This calculates which challenge this algorithm will run first, based on
    // the first challenge which has automation toggled ON
    const nowChallenge = player.autoChallengeIndex
    const nextChallenge = getNextChallenge(nowChallenge)

    // Do not start the challenge if all the challenges have been completed.
    if (nextChallenge === 11) {
      return
    }

    // Set our index to calculated starting challenge and run the challenge
    player.autoChallengeIndex = nextChallenge
    toggleChallenges(player.autoChallengeIndex, true)

    // Sets Mode to "EXIT" as displayed in the challenge tab
    toggleAutoChallengeModeText('EXIT')
    return
  }
}

// Look for the next uncompleted challenge.
export const getNextChallenge = (startChallenge: number, maxSkip = false, min = 1, max = 10) => {
  let nextChallenge = startChallenge
  /* Calculate the smallest challenge index we want to enter.
       Our minimum is the current index, but if that challenge is fully completed
       or toggled off we shouldn't run it, so we increment upwards in these cases. */
  for (let index = nextChallenge; index <= max; index++) {
    if (
      !player.autoChallengeToggles[index]
      || (!maxSkip && index !== 15 && player.highestchallengecompletions[index] >= getMaxChallenges(index))
    ) {
      nextChallenge += 1
    } else {
      break
    }
  }

  /* If the above algorithm sets the index above 10, the loop is complete
       and thus do not need to enter more challenges. This sets our index to 1
       so in the next iteration it knows we want to start a loop. */
  if (nextChallenge > max) {
    // If the challenge reaches 11 or higher, return it to 1 and check again.
    nextChallenge = min
    for (let index = nextChallenge; index <= max; index++) {
      if (
        !player.autoChallengeToggles[index]
        || (!maxSkip && index !== 15 && player.highestchallengecompletions[index] >= getMaxChallenges(index))
      ) {
        nextChallenge += 1
      } else {
        break
      }
    }
  }
  return nextChallenge
}

export const autoAscensionChallengeSweepUnlock = () => {
  return player.highestSingularityCount >= 101 && player.shopUpgrades.instantChallenge2 > 0
}

export const challenge15ScoreMultiplier = () => {
  const arr = [
    1 + 5 / 10000 * hepteractEffective('challenge'), // Challenge Hepteract
    1 + 0.25 * player.platonicUpgrades[15] // Omega Upgrade
  ]
  return productContents(arr)
}
