import i18next from 'i18next'
import { awardUngroupedAchievement, getAchievementReward, UngroupedAchievement } from './Achievements'
import { quarkHandler, worlds } from './Quark'
import { getShopUpgradeEffects } from './Shop'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { sumContents } from './Utility'

const blessings: Record<
  keyof Player['cubeBlessings'],
  { weight: number; pdf: (x: number) => boolean }
> = {
  accelerator: { weight: 4, pdf: (x: number) => 0 <= x && x <= 20 },
  multiplier: { weight: 4, pdf: (x: number) => 20 < x && x <= 40 },
  offering: { weight: 2, pdf: (x: number) => 40 < x && x <= 50 },
  runeExp: { weight: 2, pdf: (x: number) => 50 < x && x <= 60 },
  obtainium: { weight: 2, pdf: (x: number) => 60 < x && x <= 70 },
  antSpeed: { weight: 2, pdf: (x: number) => 70 < x && x <= 80 },
  antSacrifice: { weight: 1, pdf: (x: number) => 80 < x && x <= 85 },
  antELO: { weight: 1, pdf: (x: number) => 85 < x && x <= 90 },
  talismanBonus: { weight: 1, pdf: (x: number) => 90 < x && x <= 95 },
  globalSpeed: { weight: 1, pdf: (x: number) => 95 < x && x <= 100 }
}

const blessingKeys = Object.keys(blessings) as (keyof Player['cubeBlessings'])[]

const platonicBlessings: Record<
  keyof Player['platonicBlessings'],
  { weight: number; pdf: (x: number) => boolean; statue: boolean }
> = {
  cubes: { weight: 13200, pdf: (x: number) => 0 <= x && x <= 33.000, statue: false },
  tesseracts: { weight: 13200, pdf: (x: number) => 33.000 < x && x <= 66.000, statue: false },
  hypercubes: { weight: 13200, pdf: (x: number) => 66.000 < x && x <= 99.000, statue: false },
  platonics: { weight: 396, pdf: (x: number) => 99.000 < x && x <= 99.990, statue: false },
  hypercubeBonus: { weight: 1, pdf: (x: number) => 99.990 < x && x <= 99.9925, statue: true },
  taxes: { weight: 1, pdf: (x: number) => 99.9925 < x && x <= 99.995, statue: true },
  scoreBonus: { weight: 1, pdf: (x: number) => 99.995 < x && x <= 99.9975, statue: true },
  globalSpeed: { weight: 1, pdf: (x: number) => 99.9975 < x && x <= 100, statue: true }
}

const platonicKeys = Object.keys(platonicBlessings) as (keyof Player['platonicBlessings'])[]

const platonicRNGesus = ['hypercubeBonus', 'taxes', 'scoreBonus', 'globalSpeed'] as const
const platonicCommonDrops = ['cubes', 'tesseracts', 'hypercubes', 'platonics'] as const

/**
 * @description Generic class for handling cube subsets.
 * @example
 * class PlatCubes extends Currency {
 *   constructor() {
 *       super('wowPlatonicCubes', player.wowPlatonicCubes);
 *   }
 *
 *   async open(amount: number, value: boolean) {
 *       // implement open logic here
 *   }
 * }
 *
 * new PlatCubes().openCustom();
 */
abstract class Cube {
  /** key on the player object */
  private key: 'wowCubes' | 'wowTesseracts' | 'wowHypercubes' | 'wowPlatonicCubes'

  constructor (type: 'wowCubes' | 'wowTesseracts' | 'wowHypercubes' | 'wowPlatonicCubes') {
    this.key = type
  }

  /**
   * @description Open a given amount of cubes
   * @param amount Number of cubes to open
   * @param max if true, overwrites amount and opens the max amount of cubes.
   * @param free if true, does not decrease the amount of cubes.
   */
  abstract open (amount: number, max: boolean, free: boolean): Promise<void> | void

  /** Open a custom amount of cubes */
  async openCustom () {
    const amount = await Prompt(i18next.t('cubes.howManyCubesOpen', { x: format(player[this.key], 0, true) }))

    if (amount === null) {
      return Alert(i18next.t('cubes.noCubesOpened'))
    }

    const isPercentage = amount.endsWith('%')
    const cubesToOpen = amount.startsWith('-')
      ? (isPercentage ? 100 + Number(amount.slice(0, -1)) : player[this.key] + Number(amount))
      : (isPercentage ? Number(amount.slice(0, -1)) : Number(amount))

    if (Number.isNaN(cubesToOpen) || !Number.isFinite(cubesToOpen) || !Number.isInteger(cubesToOpen)) {
      return Alert(i18next.t('general.validation.finiteInt'))
    } else if (player[this.key] < cubesToOpen) {
      return Alert(i18next.t('cubes.validation.notEnough'))
    } else if (cubesToOpen <= 0) {
      return Alert(i18next.t('cubes.validation.negative'))
    } else if (isPercentage && cubesToOpen > 100) {
      return Alert(i18next.t('cubes.validation.invalidPercent', { x: cubesToOpen }))
    }

    if (isPercentage) {
      return this.open(
        Math.floor(player[this.key] * (cubesToOpen / 100)),
        cubesToOpen === 100,
        false
      )
    }

    return this.open(cubesToOpen, cubesToOpen === player[this.key], false)
  }

  /** @description Check how many quarks you should have gained through opening cubes today */
  checkQuarkGain (base: number, mult: number, cubes: number): number {
    if (cubes < 1) {
      return 0
    }
    // General quark multiplier from other in-game features
    // Multiplier from passed parameter
    const multiplier = mult * quarkHandler().cubeMult

    return Math.floor(worlds.applyBonus(Math.log10(cubes) * base * multiplier))
  }

  /** @description Check how many cubes you need to gain an additional quark from opening */
  checkCubesToNextQuark (base: number, mult: number, quarks: number, cubes: number): number {
    // General quark multiplier from other in-game features
    // Multiplier from passed parameter
    const multiplier = mult * quarkHandler().cubeMult

    return Math.ceil(Math.pow(10, (quarks + 1) / worlds.applyBonus(multiplier * base)) - cubes)
  }

  add (amount: number): this {
    player[this.key] = Math.min(1e300, player[this.key] + amount)
    return this
  }

  sub (amount: number): this {
    player[this.key] = Math.max(0, player[this.key] - amount)
    return this
  }

  set (value: number) {
    player[this.key] = value
  }
}

class WowCubes extends Cube {
  constructor () {
    super('wowCubes')
  }

  open (value: number, max = false, free = false) {
    let toSpend = max ? player.wowCubes : (free ? value : Math.min(player.wowCubes, value))

    if (value === 1 && player.cubeBlessings.accelerator >= 2e11) {
      awardUngroupedAchievement(UngroupedAchievement.OneCubeOfMany)
    }

    if (!free) {
      this.sub(toSpend)
    }
    player.cubeOpenedDaily += toSpend

    const quarkMult = getShopUpgradeEffects('cubeToQuark', 'cubeQuarkMult')
    const gainQuarks = this.checkQuarkGain(5, quarkMult, player.cubeOpenedDaily)
    const actualQuarksGain = Math.max(0, gainQuarks - player.cubeQuarkDaily)
    player.cubeQuarkDaily += actualQuarksGain
    worlds.add(actualQuarksGain, false, true)

    const sumOfTributes = sumContents(Object.values(player.cubeBlessings))
    // if >= 1e300 totalTribute, do not award tributes
    if (sumOfTributes >= 1e300) {
      return
    }

    toSpend *= 1 + player.researches[138] / 1000
    toSpend *= 1 + 0.8 * player.researches[168] / 1000
    toSpend *= 1 + 0.6 * player.researches[198] / 1000

    toSpend = Math.floor(toSpend)

    toSpend = Math.min(toSpend, 1e300 - sumOfTributes)

    if (
      player.singularityChallenges.taxmanLastStand.enabled
      && player.singularityChallenges.taxmanLastStand.completions >= 5
    ) {
      toSpend /= Math.pow(1 + Math.log(1 + sumOfTributes + toSpend), 3)
    }

    let toSpendModulo = toSpend % 20
    let toSpendDiv20 = Math.floor(toSpend / 20)

    if (toSpendDiv20 > 0 && player.cubeUpgrades[13] === 1) {
      toSpendModulo += toSpendDiv20
    }
    if (toSpendDiv20 > 0 && player.cubeUpgrades[23] === 1) {
      toSpendModulo += toSpendDiv20
    }
    if (toSpendDiv20 > 0 && player.cubeUpgrades[33] === 1) {
      toSpendModulo += toSpendDiv20
    }

    toSpendDiv20 += 100 / 100 * Math.floor(toSpendModulo / 20)
    toSpendModulo = toSpendModulo % 20

    // If you're opening more than 20 cubes, it will consume all cubes until remainder mod 20, giving expected values.
    for (const key of blessingKeys) {
      player.cubeBlessings[key] += blessings[key].weight * toSpendDiv20
    }

    // Then, the remaining cubes will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
      const num = 100 * Math.random()
      for (const key of blessingKeys) {
        if (blessings[key].pdf(num)) {
          player.cubeBlessings[key] += 1
        }
      }
    }
  }
}

class WowTesseracts extends Cube {
  constructor () {
    super('wowTesseracts')
  }

  open (value: number, max = false, free = false) {
    const toSpend = max ? player.wowTesseracts : (free ? value : Math.min(player.wowTesseracts, value))

    if (!free) {
      this.sub(toSpend)
    }
    player.tesseractOpenedDaily += toSpend

    const quarkMult = getShopUpgradeEffects('tesseractToQuark', 'tesseractQuarkMult')
    const gainQuarks = this.checkQuarkGain(7, quarkMult, player.tesseractOpenedDaily)
    const actualQuarksGain = Math.max(0, gainQuarks - player.tesseractQuarkDaily)
    player.tesseractQuarkDaily += actualQuarksGain
    worlds.add(actualQuarksGain, false, true)

    const toSpendModulo = toSpend % 20
    const toSpendDiv20 = Math.floor(toSpend / 20)

    // If you're opening more than 20 Tesseracts, it will consume all Tesseracts until remainder mod 20, giving expected values.
    for (const key of blessingKeys) {
      player.tesseractBlessings[key] += blessings[key].weight * toSpendDiv20
    }
    // Then, the remaining tesseract will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
      const num = 100 * Math.random()
      for (const key of blessingKeys) {
        if (blessings[key].pdf(num)) {
          player.tesseractBlessings[key] += 1
        }
      }
    }
    const extraCubeBlessings = Math.floor(12 * toSpend * player.researches[153])
    cubes.wowCubes.open(extraCubeBlessings, false, true)
  }
}

class WowHypercubes extends Cube {
  constructor () {
    super('wowHypercubes')
  }

  open (value: number, max = false, free = false) {
    const toSpend = max ? player.wowHypercubes : (free ? value : Math.min(player.wowHypercubes, value))

    if (!free) {
      this.sub(toSpend)
    }
    player.hypercubeOpenedDaily += toSpend

    const quarkMult = getShopUpgradeEffects('hypercubeToQuark', 'hypercubeQuarkMult')
    const gainQuarks = this.checkQuarkGain(10, quarkMult, player.hypercubeOpenedDaily)
    const actualQuarksGain = Math.max(0, gainQuarks - player.hypercubeQuarkDaily)
    player.hypercubeQuarkDaily += actualQuarksGain
    worlds.add(actualQuarksGain, false, true)

    const toSpendModulo = toSpend % 20
    const toSpendDiv20 = Math.floor(toSpend / 20)

    // If you're opening more than 20 Hypercubes, it will consume all Hypercubes until remainder mod 20, giving expected values.
    for (const key of blessingKeys) {
      player.hypercubeBlessings[key] += blessings[key].weight * toSpendDiv20
    }
    // Then, the remaining hypercubes will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
      const num = 100 * Math.random()
      for (const key of blessingKeys) {
        if (blessings[key].pdf(num)) {
          player.hypercubeBlessings[key] += 1
        }
      }
    }
    const extraTesseractBlessings = Math.floor(100 * toSpend * player.researches[183])
    cubes.wowTesseracts.open(extraTesseractBlessings, false, true)
  }
}

const individualPlatonicBlessingMultiplier = (key: keyof Player['platonicBlessings']) => {
  let multiplier = 1
  if (player.cubeUpgrades[64] && platonicBlessings[key].statue) {
    multiplier = 2
  }
  return multiplier
}

export class WowPlatonicCubes extends Cube {
  constructor () {
    super('wowPlatonicCubes')
  }

  open (value: number, max = false, free = false) {
    const toSpend = max ? player.wowPlatonicCubes : (free ? value : Math.min(player.wowPlatonicCubes, value))

    if (!free) {
      this.sub(toSpend)
    }
    player.platonicCubeOpenedDaily += toSpend

    const quarkMult = 1.5 // There's no platonic to quark upgrade, default as 1.5
    const gainQuarks = this.checkQuarkGain(15, quarkMult, player.platonicCubeOpenedDaily)
    const actualQuarksGain = Math.max(0, gainQuarks - player.platonicCubeQuarkDaily)
    player.platonicCubeQuarkDaily += actualQuarksGain
    worlds.add(actualQuarksGain, false, true)

    let toSpendModulo = toSpend % 40000
    const toSpendDiv40000 = Math.floor(toSpend / 40000)

    // If you're opening more than 40,000 Platonics, it will consume all Platonics until remainder mod 40,000, giving expected values.
    for (const key of platonicKeys) {
      player.platonicBlessings[key] += individualPlatonicBlessingMultiplier(key) * platonicBlessings[key].weight
        * toSpendDiv40000
    }

    // Then, the remaining hypercube will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < platonicRNGesus.length; i++) {
      const num = Math.random()
      if (toSpendModulo / 40000 >= num && toSpendModulo !== 0) {
        player.platonicBlessings[platonicRNGesus[i]] += individualPlatonicBlessingMultiplier(platonicRNGesus[i])
        toSpendModulo -= 1
      }
    }

    // Common items for the remaining (<40k) are given deterministically
    const gainValues = [
      Math.floor(33 * toSpendModulo / 100),
      Math.floor(33 * toSpendModulo / 100),
      Math.floor(33 * toSpendModulo / 100),
      Math.floor(396 * toSpendModulo / 40000)
    ]
    for (let i = 0; i < platonicCommonDrops.length; i++) {
      player.platonicBlessings[platonicCommonDrops[i]] += gainValues[i]
      toSpendModulo -= gainValues[i]
    }

    for (let i = 0; i < toSpendModulo; i++) {
      const num = 100 * Math.random()
      for (const key of platonicKeys) {
        if (platonicBlessings[key].pdf(num)) {
          player.platonicBlessings[key] += individualPlatonicBlessingMultiplier(key)
        }
      }
    }

    const hyperCubesPerPlatonic = getAchievementReward('platonicToHypercubes')
    if (hyperCubesPerPlatonic > 0) {
      const extraHypercubes = Math.floor(
        toSpend * hyperCubesPerPlatonic
      )
      cubes.wowHypercubes.open(extraHypercubes, false, true)
    }
  }
}

export const cubes = {
  wowCubes: new WowCubes(),
  wowTesseracts: new WowTesseracts(),
  wowHypercubes: new WowHypercubes(),
  wowPlatonicCubes: new WowPlatonicCubes()
}
