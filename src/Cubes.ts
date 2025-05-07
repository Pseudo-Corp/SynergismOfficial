import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateCubicSumData, calculateSummationNonLinear } from './Calculate'
import { researchData, updateResearchBG } from './Research'
import { calculateSingularityDebuff, getGQUpgradeEffect } from './singularity'
import { format, player } from './Synergism'
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
import { revealStuff } from './UpdateHTML'
import { upgradeupdate } from './Upgrades'

export interface IMultiBuy {
  levelCanBuy: number
  cost: number
}

// dprint-ignore
const cubeAutomationIndices = [
  4, 5, 6, 7, 8, 9, 10, // row 1
  20,                   // row 2
  26, 27,               // row 3
  48, 49                // row 5
]

// dprint-ignore
const researchAutomationIndices = [
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, // row 2
  61, 71, 72, 73, 74, 75, // row 3
  124,                    // row 5
  130, 135, 145, 150,     // row 6
  175,                    // row 7
  190                     // row 8
]

// dprint-ignore
const cubeBaseCost = [
  200, 200, 200, 500, 500, 500, 500, 500, 2000, 40000,
  5000, 1000, 10000, 20000, 40000, 10000, 4000, 1e4, 50000, 12500,
  5e4, 3e4, 3e4, 4e4, 2e5, 4e5, 1e5, 177777, 1e5, 1e6,
  5e5, 3e5, 2e6, 4e6, 2e6, 4e6, 1e6, 2e7, 5e7, 1e7,
  5e6, 1e7, 1e8, 4e7, 2e7, 4e7, 5e7, 1e8, 5e8, 1e8,
  1, 1e4, 1e8, 1e12, 1e16, 10, 1e5, 1e9, 1e13, 1e17,
  1e2, 1e6, 1e10, 1e14, 1e18, 1e20, 1e30, 1e40, 1e50, 1e60,
  1, 1, 1e8, 1e16, 1e30, 1e100, 1e100, 1e200, 1e250, 1e300, 
]

// dprint-ignore
export const cubeMaxLevel = [
  3, 10, 5, 1, 1, 1, 1, 1, 1, 1,
  3, 10, 1, 10, 10, 10, 5, 1, 1, 1,
  5, 10, 1, 10, 10, 10, 1, 1, 5, 1,
  5, 1, 1, 10, 10, 10, 10, 1, 1, 10,
  5, 10, 10, 10, 10, 20, 20, 1, 1, 100000,
  1, 900, 100, 900, 900, 20, 1, 1, 400, 10000,
  100, 1, 1, 1, 1, 1, 1, 1000, 1, 100000,
  1, 1, 5, 1, 30, 2, 25, 30, 1, 1
]

const getCubeCost = (i: number, buyMax: boolean): IMultiBuy => {
  const linGrowth = i === 50 ? 0.01 : 0
  const cubic = i > 50
  const maxLevel = getCubeMax(i)
  let amountToBuy = buyMax ? 1e5 : 1
  const cubeUpgrade = player.cubeUpgrades[i]!
  amountToBuy = Math.min(maxLevel - cubeUpgrade, amountToBuy)
  const singularityMultiplier = (i <= 50) ? calculateSingularityDebuff('Cube Upgrades') : 1

  let metaData: IMultiBuy

  if (cubic) {
    // TODO: Fix this inconsistency later.
    amountToBuy = buyMax ? maxLevel : Math.min(maxLevel, cubeUpgrade + 1)
    metaData = calculateCubicSumData(cubeUpgrade, cubeBaseCost[i - 1], Number(player.wowCubes), amountToBuy)
  } else {
    metaData = calculateSummationNonLinear(
      cubeUpgrade,
      cubeBaseCost[i - 1] * singularityMultiplier,
      Number(player.wowCubes),
      linGrowth,
      amountToBuy
    )
  }

  return metaData
}

const getCubeMax = (i: number) => {
  let baseValue = cubeMaxLevel[i - 1]

  if (player.cubeUpgrades[57] > 0 && i < 50 && i % 10 === 1) {
    baseValue += 1
  }

  return baseValue
}

export const cubeUpgradeDesc = (i: number, buyMax = player.cubeUpgradesBuyMaxToggle) => {
  const metaData = getCubeCost(i, buyMax)
  const a = DOMCacheGetOrSet('cubeUpgradeName')
  const b = DOMCacheGetOrSet('cubeUpgradeDescription')
  const c = DOMCacheGetOrSet('cubeUpgradeCost')
  const d = DOMCacheGetOrSet('cubeUpgradeLevel')
  const maxLevel = getCubeMax(i)

  a.textContent = i18next.t(`cubes.upgradeNames.${i}`)
  b.innerHTML = i18next.t(`cubes.upgradeDescriptions.${i}`)
  c.textContent = i18next.t('cubes.cubeMetadata.cost', {
    value1: format(metaData.cost, 0, true),
    value2: format(metaData.levelCanBuy - player.cubeUpgrades[i]!, 0, true)
  })
  c.style.color = 'var(--green-text-color)'
  d.textContent = i18next.t('cubes.cubeMetadata.level', {
    value1: format(player.cubeUpgrades[i], 0, true),
    value2: format(maxLevel, 0, true)
  })
  d.style.color = 'white'

  // This conditional is true only in the case where you can buy zero levels.
  if (Number(player.wowCubes) < metaData.cost) {
    c.style.color = 'var(--crimson-text-color)'
  }
  if (player.cubeUpgrades[i] === maxLevel) {
    c.style.color = 'gold'
    c.textContent = i18next.t('cubes.cubeMetadata.maxLevel')
    d.style.color = 'plum'
  }
}

export const updateCubeUpgradeBG = (i: number) => {
  const a = DOMCacheGetOrSet(`cubeUpg${i}`)
  const maxCubeLevel = getCubeMax(i)
  const cubeUpgrade = player.cubeUpgrades[i]!
  if (cubeUpgrade > maxCubeLevel) {
    player.wowCubes.add((cubeUpgrade - maxCubeLevel) * cubeBaseCost[i - 1])
    player.cubeUpgrades[i] = maxCubeLevel
  }

  a.classList.remove('green-background', 'purple-background')

  if (cubeUpgrade > 0 && cubeUpgrade < maxCubeLevel) {
    a.classList.add('purple-background')
  }
  if (player.cubeUpgrades[i] === maxCubeLevel) {
    a.classList.add('green-background')
  }
}

export const awardAutosCookieUpgrade = () => {
  for (const i of cubeAutomationIndices) {
    const maxLevel = getCubeMax(i)
    player.cubeUpgrades[i] = maxLevel
    updateCubeUpgradeBG(i)
  }

  for (const i of researchAutomationIndices) {
    player.researches[i] = researchData[i].maxLevel
    updateResearchBG(i)
  }
}

export const buyCubeUpgrades = (i: number, buyMax = player.cubeUpgradesBuyMaxToggle, auto = false) => {
  // Actually lock for HTML exploit
  if (
    (i > 50 && i <= 55 && !getGQUpgradeEffect('cookies'))
    || (i > 55 && i <= 60 && !getGQUpgradeEffect('cookies2'))
    || (i > 60 && i <= 65 && !getGQUpgradeEffect('cookies3'))
    || (i > 65 && i <= 70 && !getGQUpgradeEffect('cookies4'))
    || (i > 70 && !getGQUpgradeEffect('cookies5'))
  ) {
    return
  }

  const metaData = getCubeCost(i, buyMax)
  const maxLevel = getCubeMax(i)
  if (Number(player.wowCubes) >= metaData.cost && player.cubeUpgrades[i]! < maxLevel) {
    player.wowCubes.sub(100 / 100 * metaData.cost)
    player.cubeUpgrades[i] = metaData.levelCanBuy
  } else {
    return
  }

  if (i === 4 && player.cubeUpgrades[4] > 0) {
    for (let j = 94; j <= 98; j++) {
      player.upgrades[j] = 1
      upgradeupdate(j, true)
    }
  }
  if (i === 5 && player.cubeUpgrades[5] > 0) {
    player.upgrades[99] = 1
    upgradeupdate(99, true)
  }
  if (i === 6 && player.cubeUpgrades[6] > 0) {
    player.upgrades[100] = 1
    upgradeupdate(100, true)
  }

  if (i === 51 && player.cubeUpgrades[51] > 0) {
    awardAutosCookieUpgrade()
  }

  if (i === 57 && player.cubeUpgrades[57] > 0) {
    for (let j = 1; j < player.cubeUpgrades.length; j++) {
      updateCubeUpgradeBG(j)
    }
  }

  if (!auto) {
    cubeUpgradeDesc(i)
    revealStuff()
  }
  updateCubeUpgradeBG(i)
}

export const autoBuyCubeUpgrades = () => {
  if (
    player.autoCubeUpgradesToggle
    && ((player.highestSingularityCount >= 50 && player.insideSingularityChallenge)
      || player.highestSingularityCount >= 150)
  ) {
    const cheapet = []

    for (let i = 1; i < player.cubeUpgrades.length; i++) {
      const maxLevel = getCubeMax(i)
      if (player.cubeUpgrades[i]! < maxLevel) {
        const metaData = getCubeCost(i, true)
        cheapet.push([i, metaData.cost, metaData.levelCanBuy])
      }
    }

    if (cheapet.length > 0) {
      let update = false

      cheapet.sort((a, b) => {
        return a[1] - b[1]
      })

      for (const value of cheapet) {
        const maxLevel = getCubeMax(value[0])
        const metaData = getCubeCost(value[0], true)
        if (
          Number(player.wowCubes) >= metaData.cost && player.cubeUpgrades[value[0]]! < maxLevel
          && (player.cubeUpgradesBuyMaxToggle || maxLevel === metaData.levelCanBuy)
        ) {
          buyCubeUpgrades(value[0], true, true)
          update = true
        }
      }

      if (update) {
        revealStuff()
      }
    }
  }
}

export const calculateAcceleratorCubeBlessing = () => {
  const DR = 1 / 3
  const effectPerBlessing = calculateAcceleratorTesseractBlessing() / 500
  const limit = 1000
  const DRIncrease = player.cubeUpgrades[45] / 300

  if (player.cubeBlessings.accelerator < limit) {
    return Math.pow(effectPerBlessing * player.cubeBlessings.accelerator, 1 + DRIncrease)
  } else {
    const limitMult = Math.pow(limit, 1 - DR + DRIncrease)
    return effectPerBlessing * limitMult * Math.pow(player.cubeBlessings.accelerator, DR + DRIncrease)
  }
}

export const calculateMultiplierCubeBlessing = () => {
  const DR = 1 / 3
  const effectPerBlessing = calculateMultiplierTesseractBlessing() / 5000
  const limit = 1000
  const DRIncrease = player.cubeUpgrades[35] / 300

  if (player.cubeBlessings.multiplier < limit) {
    return Math.pow(1 + effectPerBlessing * player.cubeBlessings.multiplier, 1 + DRIncrease)
  } else {
    const limitMult = Math.pow(limit, 1 - DR + DRIncrease)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.cubeBlessings.multiplier, DR + DRIncrease)
  }
}

export const calculateOfferingCubeBlessing = () => {
  const DR = 2 / 3
  const effectPerBlessing = new Decimal(calculateOfferingTesseractBlessing()).div(2000)
  const limit = 1000
  const DRIncrease = player.cubeUpgrades[24] * 2 / 300

  if (player.cubeBlessings.offering < limit) {
    return Decimal.min(
      1e300,
      Decimal.pow(effectPerBlessing.times(player.cubeBlessings.offering).plus(1), 1 + DRIncrease)
    ).toNumber()
  } else {
    const limitMult = Decimal.pow(limit, 1 - DR + DRIncrease)
    return Decimal.min(
      1e300,
      limitMult.times(effectPerBlessing).times(Math.pow(player.cubeBlessings.offering, DR + DRIncrease)).plus(1)
    ).toNumber()
  }
}

export const calculateSalvageCubeBlessing = () => {
  const limit = 1000
  const effectMultiplier = (1 + player.cubeUpgrades[14] / 100) * calculateSalvageTesseractBlessing()

  if (player.cubeBlessings.runeExp < limit) {
    return effectMultiplier * (player.cubeBlessings.runeExp * 10 / limit)
  } else {
    const limitBonus = 10
    return effectMultiplier * (limitBonus + 10 * Math.log10(player.cubeBlessings.runeExp / limit))
  }
}

export const calculateObtainiumCubeBlessing = () => {
  const DR = 2 / 3
  const effectPerBlessing = new Decimal(calculateObtainiumTesseractBlessing()).div(2000)
  const limit = 1000
  const DRIncrease = player.cubeUpgrades[40] * 2 / 300

  if (player.cubeBlessings.obtainium < limit) {
    return Decimal.min(
      1e300,
      Decimal.pow(effectPerBlessing.times(player.cubeBlessings.obtainium).plus(1), 1 + DRIncrease)
    ).toNumber()
  } else {
    const limitMult = Decimal.pow(limit, 1 - DR + DRIncrease)
    return Decimal.min(
      1e300,
      limitMult.times(effectPerBlessing).times(Math.pow(player.cubeBlessings.obtainium, DR + DRIncrease)).plus(1)
    ).toNumber()
  }
}

export const calculateAntSpeedCubeBlessing = () => {
  const effectPerBlessing = 1 / 10000
  const exponentIncrease = player.cubeUpgrades[22] / 40

  return Decimal.pow(1 + effectPerBlessing * player.cubeBlessings.antSpeed, 2 + exponentIncrease)
    .times(calculateAntSpeedTesseractBlessing())
}

export const calculateAntSacrificeCubeBlessing = (): Decimal => {
  const DR = 2 / 3
  const effectPerBlessing = calculateAntSacrificeTesseractBlessing() / 5000
  const limit = 1000
  const DRIncrease = player.cubeUpgrades[15] / 50

  if (player.cubeBlessings.antSacrifice < limit) {
    return Decimal.pow(1 + effectPerBlessing * player.cubeBlessings.antSacrifice, 1 + DRIncrease)
  } else {
    const limitMult = Math.pow(limit, 1 - DR + DRIncrease)
    return Decimal.pow(player.cubeBlessings.antSacrifice, DR + DRIncrease).times(effectPerBlessing).times(limitMult)
      .add(1)
  }
}

export const calculateAntELOCubeBlessing = () => {
  const effectExponent = 1 + player.cubeUpgrades[25] / 100

  return Math.pow(
    1 + Math.log10(1 + player.cubeBlessings.antELO) / 100 * calculateAntELOTesseractBlessing(),
    effectExponent
  )
}

export const calculateRuneEffectivenessCubeBlessing = () => {
  const DR = 1 / 16
  const effectPerBlessing = calculateRuneEffectivenessTesseractBlessing() / 10000
  const limit = 1000
  const DRIncrease = player.cubeUpgrades[44] / 1600

  if (player.cubeBlessings.talismanBonus < limit) {
    return Math.pow(1 + effectPerBlessing * player.cubeBlessings.talismanBonus, 1 + DRIncrease)
  } else {
    const limitMult = Math.pow(limit, 1 - DR + DRIncrease)
    return Math.min(
      1e300,
      1 + limitMult * effectPerBlessing * Math.pow(player.cubeBlessings.talismanBonus, DR + DRIncrease)
    )
  }
}

export const calculateGlobalSpeedCubeBlessing = () => {
  const DR = 1 / 16
  const effectPerBlessing = calculateGlobalSpeedTesseractBlessing() / 1000
  const limit = 1000
  const DRIncrease = player.cubeUpgrades[34] / 1600

  if (player.cubeBlessings.globalSpeed < limit) {
    return Math.pow(1 + effectPerBlessing * player.cubeBlessings.globalSpeed, 1 + DRIncrease)
  } else {
    const limitMult = Math.pow(limit, 1 - DR + DRIncrease)
    return Math.min(
      1e300,
      1 + limitMult * effectPerBlessing * Math.pow(player.cubeBlessings.globalSpeed, DR + DRIncrease)
    )
  }
}
