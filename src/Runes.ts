import {
  calculateCorruptionPoints,
  calculateEffectiveIALevel,
  calculateMaxRunes,
  calculateOfferings,
  calculateRuneExpGiven,
  calculateRuneExpToLevel,
  calculateRuneLevels
} from './Calculate'
import { format, player } from './Synergism'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import i18next, { type StringMap } from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import type { resetNames } from './types/Synergism'

export const displayRuneInformation = (i: number, updatelevelup = true) => {
  const m = G.effectiveLevelMult
  const SILevelMult = 1
    + player.researches[84] / 200 * (1 + 1 * G.effectiveRuneSpiritPower[5] * calculateCorruptionPoints() / 400)
  const amountPerOffering = calculateRuneExpGiven(i - 1, false, player.runelevels[i - 1])

  let options: StringMap

  if (i === 1) {
    options = {
      bonus: format(Math.floor(Math.pow(G.rune1level * m / 4, 1.25))),
      percent: format(G.rune1level / 4 * m, 2, true),
      boost: format(Math.floor(G.rune1level / 20 * m))
    }
  } else if (i === 2) {
    options = {
      mult1: format(Math.floor(G.rune2level * m / 10) * Math.floor(1 + G.rune2level * m / 10) / 2),
      mult2: format(m * G.rune2level / 4, 1, true),
      tax: (99.9 * (1 - Math.pow(6, -(G.rune2level * m) / 1000))).toPrecision(4)
    }
  } else if (i === 3) {
    options = {
      mult: format(Decimal.pow(G.rune3level * m / 2, 2).times(Decimal.pow(2, G.rune3level * m / 2 - 8)).add(1), 3),
      gain: format(Math.floor(G.rune3level / 16 * m))
    }
  } else if (i === 4) {
    options = {
      delay: (G.rune4level / 8 * m).toPrecision(3),
      chance: Math.min(25, G.rune4level / 16),
      tax: (99 * (1 - Math.pow(4, Math.min(0, (400 - G.rune4level) / 1100)))).toPrecision(4)
    }
  } else if (i === 5) {
    options = {
      gain: format(1 + G.rune5level / 200 * m * SILevelMult, 2, true),
      speed: format(1 + Math.pow(G.rune5level * m * SILevelMult, 2) / 2500),
      offerings: format(G.rune5level * m * SILevelMult * 0.005, 3, true)
    }
  } else if (i === 6) {
    options = {
      percent1: format(10 + 15 / 75 * calculateEffectiveIALevel(), 1, true),
      percent2: format(1 * calculateEffectiveIALevel(), 0, true)
    }
  } else if (i === 7 && updatelevelup) {
    options = { exp: format(1e256 * (1 + player.singularityCount)) }
  }

  if (updatelevelup) {
    DOMCacheGetOrSet('runeshowlevelup').textContent = i18next.t(`runes.levelup.${i}`, options!)
  }

  DOMCacheGetOrSet(`runeshowpower${i}`).textContent = i18next.t(`runes.power.${i}`, options!)

  if (updatelevelup) {
    const arr = calculateOfferingsToLevelXTimes(i - 1, player.runelevels[i - 1], player.offeringbuyamount)
    let offerings = 0
    let j = 0
    while (j < arr.length && (offerings + arr[j] <= player.runeshards || j === 0)) {
      offerings += arr[j]
      j++
    }
    const s = j === 1 ? 'once' : `${j} times`

    DOMCacheGetOrSet('runeDisplayInfo').textContent = i18next.t('runes.perOfferingText', {
      exp: format(amountPerOffering),
      x: format(offerings),
      y: s
    })
  }
}

export const resetofferings = (input: resetNames) => {
  player.runeshards = Math.min(1e300, player.runeshards + calculateOfferings(input))
}

export const unlockedRune = (runeIndexPlusOne: number) => {
  // Whether or not a rune is unlocked array
  const unlockedRune = [
    false,
    true,
    player.achievements[38] > 0.5,
    player.achievements[44] > 0.5,
    player.achievements[102] > 0.5,
    player.researches[82] > 0.5,
    player.shopUpgrades.infiniteAscent,
    player.platonicUpgrades[20] > 0
  ]
  return unlockedRune[runeIndexPlusOne]
}

/**
 * checkMaxRunes returns how many unique runes are at the maximum level.
 * Does not take in params, returns a number equal to number of maxed runes.
 */
export const checkMaxRunes = (runeIndex: number) => {
  let maxed = 0
  for (let i = 0; i < runeIndex; i++) {
    if (!unlockedRune(i + 1) || player.runelevels[i] >= calculateMaxRunes(i + 1)) {
      maxed++
    }
  }
  return maxed
}

export const redeemShards = (runeIndexPlusOne: number, auto = false, cubeUpgraded = 0) => {
  // if automated && 2x10 cube upgrade bought, this will be >0.
  // runeIndex, the rune being added to
  const runeIndex = runeIndexPlusOne - 1

  let levelsToAdd = player.offeringbuyamount
  if (auto) {
    levelsToAdd = Math.pow(2, player.shopUpgrades.offeringAuto)
  }
  if (auto && cubeUpgraded > 0) {
    levelsToAdd = Math.min(1e4, calculateMaxRunes(runeIndex + 1)) // limit to max 10k levels per call so the execution doesn't take too long if things get stuck
  }
  let levelsAdded = 0
  if (
    player.runeshards > 0 && player.runelevels[runeIndex] < calculateMaxRunes(runeIndex + 1)
    && unlockedRune(runeIndex + 1)
  ) {
    let all = 0
    const maxLevel = calculateMaxRunes(runeIndex + 1)
    const amountArr = calculateOfferingsToLevelXTimes(runeIndex, player.runelevels[runeIndex], levelsToAdd)
    let toSpendTotal = Math.min(player.runeshards, amountArr.reduce((x, y) => x + y, 0))
    if (cubeUpgraded > 0) {
      toSpendTotal = Math.min(player.runeshards, cubeUpgraded)
    }
    const fact = calculateRuneExpGiven(runeIndex, false, player.runelevels[runeIndex], true)
    const a = player.upgrades[71] / 25
    const add = fact[0] - a * player.runelevels[runeIndex]
    const mult = fact.slice(1, fact.length).reduce((x, y) => x * y, 1)
    while (toSpendTotal > 0 && levelsAdded < levelsToAdd && player.runelevels[runeIndex] < maxLevel) {
      const exp = calculateRuneExpToLevel(runeIndex, player.runelevels[runeIndex]) - player.runeexp[runeIndex]
      const expPerOff = Math.min(1e300, (add + a * player.runelevels[runeIndex]) * mult)
      let toSpend = Math.min(toSpendTotal, Math.ceil(exp / expPerOff))
      if (isNaN(toSpend)) {
        toSpend = toSpendTotal
      }
      toSpendTotal -= toSpend
      player.runeshards -= toSpend
      player.runeexp[runeIndex] += toSpend * expPerOff
      all += toSpend
      while (
        player.runeexp[runeIndex] >= calculateRuneExpToLevel(runeIndex) && player.runelevels[runeIndex] < maxLevel
      ) {
        player.runelevels[runeIndex] += 1
        levelsAdded++
      }
    }
    for (let runeToUpdate = 0; runeToUpdate < 5; ++runeToUpdate) {
      if (unlockedRune(runeToUpdate + 1)) {
        if (runeToUpdate !== runeIndex) {
          player.runeexp[runeToUpdate] += all * calculateRuneExpGiven(runeToUpdate, true)
        }
        while (
          player.runeexp[runeToUpdate] >= calculateRuneExpToLevel(runeToUpdate)
          && player.runelevels[runeToUpdate] < calculateMaxRunes(runeToUpdate + 1)
        ) {
          player.runelevels[runeToUpdate] += 1
        }
      }
    }
    if (!auto) {
      displayRuneInformation(runeIndexPlusOne)
    }
  }
  calculateRuneLevels()
  if (player.runeshards < 0 || !player.runeshards) {
    player.runeshards = 0
  }
}

export const calculateOfferingsToLevelXTimes = (runeIndex: number, runeLevel: number, levels: number) => {
  let exp = calculateRuneExpToLevel(runeIndex, runeLevel) - player.runeexp[runeIndex]
  const maxLevel = calculateMaxRunes(runeIndex + 1)
  const arr = []
  let sum = 0
  const off = player.runeshards
  let levelsAdded = 0
  const fact = calculateRuneExpGiven(runeIndex, false, runeLevel, true)
  const a = player.upgrades[71] / 25
  const add = fact[0] - a * runeLevel
  const mult = fact.slice(1, fact.length).reduce((x, y) => x * y, 1)
  while (levelsAdded < levels && runeLevel + levelsAdded < maxLevel && sum < off) {
    const expPerOff = (add + a * (runeLevel + levelsAdded)) * mult
    const amount = Math.ceil(exp / expPerOff)
    sum += amount
    arr.push(amount)
    levelsAdded += 1
    exp = calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded)
      - calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded - 1)
  }
  return arr
}
