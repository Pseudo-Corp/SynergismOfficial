import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { hepteractEffective } from './Hepteracts'
import { getGQUpgradeEffect } from './singularity'
import { format, player, resetCheck } from './Synergism'
import { AutoAscensionResetModes, toggleAutoChallengeModeText, toggleChallenges } from './Toggles'
import { Globals as G } from './Variables'

export type Challenge15Rewards =
  | 'cube1'
  | 'ascensions'
  | 'coinExponent'
  | 'taxes'
  | 'obtainium'
  | 'offering'
  | 'accelerator'
  | 'multiplier'
  | 'runeExp'
  | 'runeBonus'
  | 'cube2'
  | 'transcendChallengeReduction'
  | 'reincarnationChallengeReduction'
  | 'antSpeed'
  | 'bonusAntLevel'
  | 'cube3'
  | 'talismanBonus'
  | 'globalSpeed'
  | 'blessingBonus'
  | 'constantBonus'
  | 'cube4'
  | 'spiritBonus'
  | 'score'
  | 'quarks'
  | 'hepteractsUnlocked'
  | 'challengeHepteractUnlocked'
  | 'cube5'
  | 'powder'
  | 'abyssHepteractUnlocked'
  | 'exponent'
  | 'acceleratorHepteractUnlocked'
  | 'acceleratorBoostHepteractUnlocked'
  | 'multiplierHepteractUnlocked'
  | 'freeOrbs'
  | 'ascensionSpeed'
  | 'achievementUnlock'

export type Challenge15RewardsInformation = {
  value: number
  baseValue: number
  requirement: number
  HTMLColor?: string
}

export type Challenge15RewardObject = Record<Challenge15Rewards, Challenge15RewardsInformation>

const challengeScoreArray1 = [0, 8, 10, 12, 15, 20, 60, 80, 120, 180, 300]
const challengeScoreArray2 = [0, 10, 12, 15, 20, 30, 80, 120, 180, 300, 450]
const challengeScoreArray3 = [0, 20, 30, 50, 100, 200, 250, 300, 400, 500, 750]
const challengeScoreArray4 = [0, 10000, 10000, 10000, 10000, 10000, 2000, 3000, 4000, 5000, 7500]

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

    maxChallenge += 2 * getGQUpgradeEffect('singChallengeExtension')
    maxChallenge += 2 * getGQUpgradeEffect('singChallengeExtension2')
    maxChallenge += 2 * getGQUpgradeEffect('singChallengeExtension3')

    maxChallenge += +player.singularityChallenges.oneChallengeCap.rewards.capIncrease
    maxChallenge += +player.singularityChallenges.oneChallengeCap.rewards.reinCapIncrease2
    return maxChallenge
  }
  // Ascension Challenge
  if (i <= 15 && i > 10) {
    // Challenge 15 does not have 'completions'
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

    maxChallenge += getGQUpgradeEffect('singChallengeExtension')
    maxChallenge += getGQUpgradeEffect('singChallengeExtension2')
    maxChallenge += getGQUpgradeEffect('singChallengeExtension3')
    maxChallenge += +player.singularityChallenges.oneChallengeCap.rewards.ascCapIncrease2
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
    const completions = `${format(player.challengecompletions[i])}/${format(maxChallenges)}`
    const special = (i >= 6 && i <= 10) || i === 15
    const goal = format(challengeRequirement(i, player.challengecompletions[i], special ? i : 0))

    let current1 = ''
    let current2 = ''
    let current3 = ''

    switch (i) {
      case 1: {
        current1 = format(2 * CalcECC('transcend', player.challengecompletions[1]))
        current2 = format(0.75 * CalcECC('transcend', player.challengecompletions[1]), 2, true)
        current3 = format(0.04 * CalcECC('transcend', player.challengecompletions[1]), 2, true)
        break
      }
      case 2: {
        current1 = current2 = format(5 * CalcECC('transcend', player.challengecompletions[2]))
        current3 = format(0.25 * CalcECC('transcend', player.challengecompletions[2]))
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
        current3 = format(5 * CalcECC('transcend', player.challengecompletions[5]), 2, true)
        break
      }
      case 6: {
        current1 = format(Math.pow(0.965, CalcECC('reincarnation', player.challengecompletions[6])), 3, true)
        current2 = format(0.3 * CalcECC('reincarnation', player.challengecompletions[6]), 2, true)
        current3 = format(2 * CalcECC('reincarnation', player.challengecompletions[6]))
        break
      }
      case 7: {
        current1 = format(1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7]), 2, true)
        current2 = format(0.3 * CalcECC('reincarnation', player.challengecompletions[7]), 2, true)
        current3 = format(15 * CalcECC('reincarnation', player.challengecompletions[7]), 2, true)
        break
      }
      case 8: {
        current1 = format(0.25 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true)
        current2 = format(0.4 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true)
        current3 = format(4 * CalcECC('reincarnation', player.challengecompletions[8]), 2, true)
        break
      }
      case 9: {
        current1 = format(CalcECC('reincarnation', player.challengecompletions[9]))
        current2 = format(Math.pow(1.1, CalcECC('reincarnation', player.challengecompletions[9])), 2, true)
        current3 = format(0.5 * CalcECC('reincarnation', player.challengecompletions[9]), 2, true)
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
        current3 = format(CalcECC('ascension', player.challengecompletions[11]))
        break
      }
      case 12: {
        current1 = format(50 * CalcECC('ascension', player.challengecompletions[12]))
        current2 = format(12 * CalcECC('ascension', player.challengecompletions[12]))
        current3 = format(20 * CalcECC('ascension', player.challengecompletions[12]))
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
        current2 = format(CalcECC('ascension', player.challengecompletions[14]))
        current3 = format(1.5 * CalcECC('ascension', player.challengecompletions[14]))
        break
      }
    }

    a.textContent = i18next.t(`challenges.${i}.name`, {
      value: completions,
      completions: player.challengecompletions[i],
      max: maxChallenges
    })
    b.textContent = i18next.t(`challenges.${i}.flavor`)
    c.innerHTML = i18next.t(`challenges.${i}.restrictions`)
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

  let scoreDisplay = 0
  if (i <= 5) {
    if (player.highestchallengecompletions[i] >= 9000) {
      scoreDisplay = challengeScoreArray4[i]
    } else if (player.highestchallengecompletions[i] >= 750) {
      scoreDisplay = challengeScoreArray3[i]
    } else if (player.highestchallengecompletions[i] >= 75) {
      scoreDisplay = challengeScoreArray2[i]
    } else {
      scoreDisplay = challengeScoreArray1[i]
    }
  }
  if (i > 5 && i <= 10) {
    if (player.highestchallengecompletions[i] >= 60) {
      scoreDisplay = challengeScoreArray3[i]
    } else if (player.highestchallengecompletions[i] >= 25) {
      scoreDisplay = challengeScoreArray2[i]
    } else {
      scoreDisplay = challengeScoreArray1[i]
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
}

// Works to mitigate the difficulty of calculating challenge multipliers when considering softcapping
const calculateChallengeRequirementMultiplier = (
  type: 'transcend' | 'reincarnation' | 'ascension',
  completions: number,
  special = 0
) => {
  let requirementMultiplier = Math.max(
    1,
    G.hyperchallengeMultiplier[player.corruptions.used.hyperchallenge] / (1 + player.platonicUpgrades[8] / 2.5)
  )
  if (type === 'ascension') {
    // Normalize back to 1 if looking at ascension challenges in particular.
    requirementMultiplier = 1
  }
  switch (type) {
    case 'transcend':
      requirementMultiplier *= G.challenge15Rewards.transcendChallengeReduction.value
      if (completions >= 75) {
        requirementMultiplier *= Math.pow(1 + completions, 12) / Math.pow(75, 8)
      } else {
        requirementMultiplier *= Math.pow(1 + completions, 2)
      }

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
      requirementMultiplier *= G.challenge15Rewards.reincarnationChallengeReduction.value
      return requirementMultiplier
    case 'ascension':
      if (special !== 15) {
        if (completions >= 10) {
          requirementMultiplier *= 2 * (1 + completions) - 10
        } else {
          requirementMultiplier *= 1 + completions
        }
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

// Challenge State Machine
type SweepStates =
  | { kind: 'idle' }
  | { kind: 'initial_wait' }
  // Keep explored set in case we have to use c10_detour (don't run it twice)
  | { kind: 'enter_wait'; toIndex: number; explored: Set<number> }
  | { kind: 'active'; index: number; explored: Set<number> }
  | { kind: 'c15_wait' } // Happens when you can autoGain c15 Exponent
  | { kind: 'finished' } // Challenges 1-10 are all completely maxed
  | { kind: 'c10_detour'; explored: Set<number> } // S101+: You start with Challenge 10 instead of Challenge 1...

// 1-5 are transcension, 6-10 reincarnation
const NUM_ELIGIBLE_CHALLENGES = 10

let currentSweepState: SweepStates = { kind: 'idle' }

function sweepTransitionFunc (
  state: SweepStates,
  elapsedTime: number,
  timers = player.autoChallengeTimer
): SweepStates {
  switch (state.kind) {
    case 'idle':
      // Will be transitioned externally when sweep is enabled
      return state

    case 'initial_wait':
      if (elapsedTime >= timers.start) {
        // Find first valid challenge, which skips the enter time.
        const firstChallenge = getNextRegularChallenge(1, new Set())
        if (firstChallenge === -1) {
          // If we max all the challenges, just don't change the state!
          return { kind: 'finished' }
        }
        if (
          player.highestSingularityCount >= 2
          && player.currentChallenge.ascension !== 0
        ) {
          return { kind: 'c10_detour', explored: new Set([10]) }
        }
        return { kind: 'active', index: firstChallenge, explored: new Set([firstChallenge]) }
      }
      return state

    case 'active':
      if (elapsedTime >= timers.exit) {
        // Find next challenge
        const nextChallenge = getNextRegularChallenge(state.index, state.explored)

        // Check if we've wrapped around or exhausted all challenges
        if (nextChallenge === -1) {
          // Completed a full cycle, check if we need C15 wait
          if (challenge15AutoExponentCheck()) {
            return { kind: 'c15_wait' }
          }
          // Restart the sweep (wait 'start' seconds before first challenge)
          return { kind: 'initial_wait' }
        }

        // Go to enter_wait before next challenge
        return { kind: 'enter_wait', toIndex: nextChallenge, explored: state.explored }
      }
      return state

    case 'enter_wait':
      if (elapsedTime >= timers.enter) {
        return { kind: 'active', index: state.toIndex, explored: new Set([...state.explored, state.toIndex]) }
      }
      return state

    case 'c15_wait':
      if (elapsedTime >= 5) {
        // After 5 seconds, restart the sweep
        return { kind: 'initial_wait' }
      }
      return state

    case 'finished':
      // Check to ensure that the max challenges did not change since we entered this state
      // We check challenge 1 and 6 to represent Transcension and Reincarnation challenges respectively
      if (
        player.highestchallengecompletions[1] === getMaxChallenges(1)
        && player.highestchallengecompletions[6] === getMaxChallenges(6)
      ) {
        return state
      } else {
        return { kind: 'initial_wait' }
      }

    case 'c10_detour':
      if (elapsedTime >= timers.exit) {
        const firstChallenge = getNextRegularChallenge(10, state.explored)
        return { kind: 'enter_wait', toIndex: firstChallenge, explored: state.explored }
      }
      return state
  }
}

function handleStateTransition (oldState: SweepStates, newState: SweepStates): void {
  if (oldState.kind === 'active') {
    const challengeIndex = oldState.index
    if (challengeIndex <= 5) {
      void resetCheck('transcensionChallenge', undefined, true)
    } else {
      void resetCheck('reincarnationChallenge', undefined, true)
    }
  }

  if (oldState.kind === 'c10_detour') {
    void resetCheck('reincarnationChallenge', undefined, true)
  }

  switch (newState.kind) {
    case 'idle':
      toggleAutoChallengeModeText('OFF')
      break

    case 'initial_wait':
      toggleAutoChallengeModeText('START')
      break

    case 'enter_wait':
      toggleAutoChallengeModeText('ENTER')
      break

    case 'active':
      toggleChallenges(newState.index, true)
      toggleAutoChallengeModeText('CHALLENGE')
      break

    case 'c15_wait':
      toggleAutoChallengeModeText('WAIT')
      break

    case 'finished':
      toggleAutoChallengeModeText('COMPLETE')
      break

    case 'c10_detour':
      toggleChallenges(10, true)
      toggleAutoChallengeModeText('CHALLENGE')
  }
}

export type AutoChallengeStates = 'OFF' | 'START' | 'CHALLENGE' | 'ENTER' | 'WAIT' | 'COMPLETE'

// Time (in seconds) that have been spent since the last state shift.
export let timeSinceLastStateChange = 0

function shouldRunSweep (): boolean {
  return player.researches[150] > 0 && player.autoChallengeRunning
}

export function clearStateChangeTimer (): void {
  timeSinceLastStateChange = 0
}

export function resetChallengeSweep (): void {
  if (currentSweepState.kind !== 'idle') {
    currentSweepState = { kind: 'idle' }
    timeSinceLastStateChange = 0
    toggleAutoChallengeModeText('OFF')
  }
}

export function tickChallengeSweep (dt: number): void {
  const wasEnabled = currentSweepState.kind !== 'idle'
  const isEnabled = shouldRunSweep()

  if (!wasEnabled && isEnabled) {
    currentSweepState = { kind: 'initial_wait' }
    timeSinceLastStateChange = 0
    handleStateTransition({ kind: 'idle' }, currentSweepState)
    return
  }

  if (wasEnabled && !isEnabled) {
    const oldState = currentSweepState
    currentSweepState = { kind: 'idle' }
    timeSinceLastStateChange = 0
    handleStateTransition(oldState, currentSweepState)
    return
  }

  if (!isEnabled) {
    return
  }

  timeSinceLastStateChange += dt
  const newState = sweepTransitionFunc(currentSweepState, timeSinceLastStateChange)

  if (newState !== currentSweepState) {
    // State changed, reset timer and handle side effects
    const oldState = currentSweepState
    currentSweepState = newState
    timeSinceLastStateChange = 0
    handleStateTransition(oldState, newState)
  }
}

export const autoAscensionChallengeSweepUnlock = () => {
  return player.highestSingularityCount >= 101 // I believe this is a perk...
    && player.shopUpgrades.instantChallenge2 > 0
}

const challenge15AutoExponentCheck = () => {
  return autoAscensionChallengeSweepUnlock()
    && player.currentChallenge.ascension === 15
    && player.shopUpgrades.challenge15Auto === 0
    && player.autoAscend
    && player.cubeUpgrades[10] > 0
    && player.autoAscendMode === AutoAscensionResetModes.realAscensionTime
    && player.ascensionCounterRealReal >= Math.max(0.1, player.autoAscendThreshold - 5)
}

export const challenge15ScoreMultiplier = () => {
  return (
    player.campaigns.c15Bonus // Campaign Bonus to c15
    * (1 + 5 / 10000 * hepteractEffective('challenge')) // Challenge Hepteract
    * (1 + 0.25 * player.platonicUpgrades[15]) // Omega Upgrade
  )
}

// "Regular" just means not ascension challenge
export const getNextRegularChallenge = (startIndex: number, explored: Set<number>) => {
  let challenge = startIndex
  // Loop around all the first 10 challenges, trying to find an unexplored, maxed one
  while (
    explored.has(challenge)
    || player.highestchallengecompletions[challenge] >= getMaxChallenges(challenge)
    || !player.autoChallengeToggles[challenge]
  ) {
    challenge += 1
    if (challenge > NUM_ELIGIBLE_CHALLENGES) {
      challenge = 1
    }
    // By returning -1 we explicitly say that no challenges have been found...
    if (challenge === startIndex) {
      return -1
    }
  }
  return challenge
}

// Ascension Challenge 'next' Check. We don't have access to explored so we can't just use the same logic again. Sad!
export const getNextAscensionChallenge = (startIndex: number) => {
  let nextChallenge = startIndex

  while (true) {
    nextChallenge += 1
    if (nextChallenge > 15) {
      nextChallenge = 11
    }
    if (nextChallenge === startIndex) {
      // Loop returned itself... just restart itself I guess?
      // That's what it does in 4.1.6.
      return startIndex
    }
    if (
      !player.autoChallengeToggles[nextChallenge]
      || (player.highestchallengecompletions[nextChallenge] >= getMaxChallenges(nextChallenge)
        && nextChallenge !== 15)
    ) {
      // Not our challenge...
      continue
    } else {
      // This is the next one!
      break
    }
  }

  return nextChallenge
}
