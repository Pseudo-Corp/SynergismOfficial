import { DOMCacheGetOrSet } from './Cache/DOM'
import { Synergism } from './Events'
import { calculateSingularityDebuff } from './singularity'
import { format, player } from './Synergism'
import { Alert, revealStuff } from './UpdateHTML'

const platonicUpgradeDesc = [
  '+0.0090% Cubes per Corruption level per level!',
  '+0.018% Tesseracts per Corruption level per level!',
  '+0.054% Hypercubes per Corruption level per level!',
  'Gain +2.4% Platonic Cubes per level! It is that simple.',
  'C10 Exponent: 1.035 --> 1.0375, Constant tax exponent +0.10, 2x faster Constant production, +20% Quarks, +10 Reincarnation Challenge Cap, +5 Ascension Challenge Cap, 2x Obtainium and Offerings, ^1.10 coin gain in C15, as well +1 Corruption Cap Level!',
  'Multiplies Viscosity exponent by (1 + level/30), capacity of ^1 on Multipliers and Accelerators.',
  'Raises speed below 1x to the power of ^(1 - level/30).',
  'Divides Hyperchallenged by (1 + 0.4 * level), with a minimum 1x Challenge requirement multiplier!',
  'Raise Obtainium to the power of (1+(0.09*log10(Obtainium owned))) and add another x2.5 multiplier (Uncorruptable), up until 1e100 Obtainium!',
  'C10 Exponent: 1.0375 --> 1.04, Constant tax exponent +0.20, 10x faster Constant production, +25% Quarks, +10 Reincarnation Challenge Cap, +5 Ascension Challenge Cap, 3.5x Obtainium and Offerings, 2x All Cubes, ^1.25 ant exponent in C15, +1 Corruption Cap Level again!',
  'With this upgrade, you will gain diamonds equal to particle gain on Reincarnation while using Market Deflation 11 or higher! Does not work with Cube upgrade [3x8]!',
  'Gain (1 + lvl/100)x Ant multiplier per Challenge completion, ignoring corruptions to Ants.',
  'Effect of Drought is raised to the power of 0.5.',
  'Reduce the effect of Financial Recession in Challenge 15, multiplying the coin exponent by 1.55.',
  'You begin to find the start of the abyss. Coin Exponent +0.10 in Challenge 15, Challenge 15 Score +25%, Ascension Speed +0.2% per Corruption Level (Max: 20%), +1% all Cube types per C9 Completion (Multiplicative), +30% Quarks, 1e250x Tesseract Building Multiplier, 2x Ascension Count, +30 Reincarnation Challenge Cap, +20 Ascension Challenge Cap, 6x Offerings and Obtainium (Uncorruptable)! Talk about a deep dive.',
  'Increase powder conversion rate by 1% per level, gain +2% Ascension count per level and gain up to 2% more Ascension count per level based on powder, up to 100,000. This will also multiply Tesseract Building production by (Powder + 1)^(10 * level), uncapped.',
  'If Viscosity Corruption is set to level 10 or higher, score multiplier is raised by an exponent. That exponent is 3 + 0.04 per level of this upgrade.',
  'Raise the base percentage of Constant Upgrade 1 by 0.1% and increase the base percentage cap of Constant Upgrade 2 by 0.3% per level!',
  'The diminishing return power on Chronos Hepteract changes from 0.166 to (0.166 + 0.00133 * level) [Max of 0.2333].',
  'You know, maybe some things should be left unbought.'
]

export interface IPlatBaseCost {
  obtainium: number
  offerings: number
  cubes: number
  tesseracts: number
  hypercubes: number
  platonics: number
  abyssals: number
  maxLevel: number
  priceMult?: number
}

export const platUpgradeBaseCosts: Record<number, IPlatBaseCost> = {
  1: {
    obtainium: 1e70,
    offerings: 1e45,
    cubes: 1e13,
    tesseracts: 1e6,
    hypercubes: 1e5,
    platonics: 1e4,
    abyssals: 0,
    maxLevel: 250,
    priceMult: 2
  },
  2: {
    obtainium: 3e70,
    offerings: 2e45,
    cubes: 1e11,
    tesseracts: 1e8,
    hypercubes: 1e5,
    platonics: 1e4,
    abyssals: 0,
    maxLevel: 250,
    priceMult: 2
  },
  3: {
    obtainium: 1e71,
    offerings: 4e45,
    cubes: 1e11,
    tesseracts: 1e6,
    hypercubes: 1e7,
    platonics: 1e4,
    abyssals: 0,
    maxLevel: 250,
    priceMult: 2
  },
  4: {
    obtainium: 4e71,
    offerings: 1e46,
    cubes: 1e12,
    tesseracts: 1e7,
    hypercubes: 1e6,
    platonics: 1e6,
    abyssals: 0,
    maxLevel: 250,
    priceMult: 2
  },
  5: {
    obtainium: 1e80,
    offerings: 1e60,
    cubes: 1e14,
    tesseracts: 1e9,
    hypercubes: 1e8,
    platonics: 1e7,
    abyssals: 0,
    maxLevel: 1
  },
  6: {
    obtainium: 1e82,
    offerings: 1e61,
    cubes: 1e15,
    tesseracts: 1e9,
    hypercubes: 1e8,
    platonics: 1e7,
    abyssals: 0,
    maxLevel: 10
  },
  7: {
    obtainium: 1e84,
    offerings: 3e62,
    cubes: 2e15,
    tesseracts: 2e9,
    hypercubes: 2e8,
    platonics: 1.5e7,
    abyssals: 0,
    maxLevel: 15
  },
  8: {
    obtainium: 1e87,
    offerings: 1e64,
    cubes: 4e15,
    tesseracts: 4e9,
    hypercubes: 4e8,
    platonics: 3e7,
    abyssals: 0,
    maxLevel: 5
  },
  9: {
    obtainium: 1e90,
    offerings: 1e66,
    cubes: 1e16,
    tesseracts: 1e10,
    hypercubes: 1e9,
    platonics: 5e7,
    abyssals: 0,
    maxLevel: 1
  },
  10: {
    obtainium: 1e93,
    offerings: 1e68,
    cubes: 1e18,
    tesseracts: 1e12,
    hypercubes: 1e11,
    platonics: 1e9,
    abyssals: 0,
    maxLevel: 1
  },
  11: {
    obtainium: 2e96,
    offerings: 1e70,
    cubes: 2e17,
    tesseracts: 2e11,
    hypercubes: 2e10,
    platonics: 2e8,
    abyssals: 0,
    maxLevel: 1
  },
  12: {
    obtainium: 1e100,
    offerings: 1e72,
    cubes: 1e18,
    tesseracts: 1e12,
    hypercubes: 1e11,
    platonics: 1e9,
    abyssals: 0,
    maxLevel: 10
  },
  13: {
    obtainium: 2e104,
    offerings: 1e74,
    cubes: 2e19,
    tesseracts: 4e12,
    hypercubes: 4e11,
    platonics: 4e9,
    abyssals: 0,
    maxLevel: 1
  },
  14: {
    obtainium: 1e108,
    offerings: 1e77,
    cubes: 4e20,
    tesseracts: 1e13,
    hypercubes: 1e12,
    platonics: 1e10,
    abyssals: 0,
    maxLevel: 1
  },
  15: {
    obtainium: 1e115,
    offerings: 1e80,
    cubes: 1e23,
    tesseracts: 1e15,
    hypercubes: 1e14,
    platonics: 1e12,
    abyssals: 1,
    maxLevel: 1
  },
  16: {
    obtainium: 1e140,
    offerings: 1e110,
    cubes: 0,
    tesseracts: 0,
    hypercubes: 2.5e15,
    platonics: 0,
    abyssals: 0,
    maxLevel: 100,
    priceMult: 10
  },
  17: {
    obtainium: 1e145,
    offerings: 1e113,
    cubes: 0,
    tesseracts: 0,
    hypercubes: 1e19,
    platonics: 0,
    abyssals: 2,
    maxLevel: 20,
    priceMult: 10
  },
  18: {
    obtainium: 1e150,
    offerings: 1e116,
    cubes: 0,
    tesseracts: 0,
    hypercubes: 1e19,
    platonics: 0,
    abyssals: 4,
    maxLevel: 40,
    priceMult: 500
  },
  19: {
    obtainium: 1e160,
    offerings: 1e121,
    cubes: 0,
    tesseracts: 0,
    hypercubes: 1e21,
    platonics: 0,
    abyssals: 64,
    maxLevel: 50,
    priceMult: 200
  },
  20: {
    obtainium: 1e180,
    offerings: 1e130,
    cubes: 1e45,
    tesseracts: 1e28,
    hypercubes: 1e25,
    platonics: 1e25,
    abyssals: Math.pow(2, 30) - 1,
    maxLevel: 1
  }
}

const checkPlatonicUpgrade = (
  index: number,
  auto = false
): Record<keyof (IPlatBaseCost & { canBuy: boolean }), boolean> => {
  let checksum = 0
  const resources = ['obtainium', 'offerings', 'cubes', 'tesseracts', 'hypercubes', 'platonics', 'abyssals'] as const
  const resourceNames = [
    'researchPoints',
    'runeshards',
    'wowCubes',
    'wowTesseracts',
    'wowHypercubes',
    'wowPlatonicCubes',
    'wowAbyssals'
  ] as const
  const checks: Record<string, boolean> = {
    obtainium: false,
    offerings: false,
    cubes: false,
    tesseracts: false,
    hypercubes: false,
    platonics: false,
    abyssals: false,
    canBuy: false
  }
  let priceMultiplier = 1
  if (platUpgradeBaseCosts[index].priceMult) {
    priceMultiplier = Math.pow(
      platUpgradeBaseCosts[index].priceMult!,
      Math.pow(player.platonicUpgrades[index] / (platUpgradeBaseCosts[index].maxLevel - 1), 1.25)
    )
  }
  priceMultiplier *= calculateSingularityDebuff('Platonic Costs')

  for (let i = 0; i < resources.length - 1; i++) {
    if (auto && (resources[i] === 'obtainium' || resources[i] === 'offerings')) {
      checksum++
      checks[resources[i]] = true
    } else if (
      Math.floor(platUpgradeBaseCosts[index][resources[i]] * priceMultiplier) <= (player[resourceNames[i]] as number)
    ) {
      checksum++
      checks[resources[i]] = true
    }
  }

  if (
    player.hepteractCrafts.abyss.BAL >= Math.floor(platUpgradeBaseCosts[index].abyssals * priceMultiplier)
    || platUpgradeBaseCosts[index].abyssals === 0
  ) {
    checksum++
    checks.abyssals = true
  }

  if (checksum === resources.length && player.platonicUpgrades[index] < platUpgradeBaseCosts[index].maxLevel) {
    checks.canBuy = true
  }
  return checks
}

export const createPlatonicDescription = (index: number) => {
  let maxLevelAppend = ''
  if (player.platonicUpgrades[index] === platUpgradeBaseCosts[index].maxLevel) {
    maxLevelAppend = ' [MAX]'
  }
  const resourceCheck = checkPlatonicUpgrade(index)

  let priceMultiplier = 1
  if (platUpgradeBaseCosts[index].priceMult) {
    priceMultiplier = Math.pow(
      platUpgradeBaseCosts[index].priceMult!,
      Math.pow(player.platonicUpgrades[index] / (platUpgradeBaseCosts[index].maxLevel - 1), 1.25)
    )
  }
  priceMultiplier *= calculateSingularityDebuff('Platonic Costs')

  DOMCacheGetOrSet('platonicUpgradeDescription').textContent = platonicUpgradeDesc[index - 1]
  DOMCacheGetOrSet('platonicUpgradeLevel').textContent = `Level: ${format(player.platonicUpgrades[index])}/${
    format(platUpgradeBaseCosts[index].maxLevel)
  }${maxLevelAppend}`
  DOMCacheGetOrSet('platonicOfferingCost').textContent = `${format(player.runeshards)}/${
    format(platUpgradeBaseCosts[index].offerings * priceMultiplier)
  } Offerings`
  DOMCacheGetOrSet('platonicObtainiumCost').textContent = `${format(player.researchPoints)}/${
    format(platUpgradeBaseCosts[index].obtainium * priceMultiplier)
  } Obtainium`
  DOMCacheGetOrSet('platonicCubeCost').textContent = `${format(player.wowCubes)}/${
    format(platUpgradeBaseCosts[index].cubes * priceMultiplier)
  } Wow! Cubes`
  DOMCacheGetOrSet('platonicTesseractCost').textContent = `${format(player.wowTesseracts)}/${
    format(platUpgradeBaseCosts[index].tesseracts * priceMultiplier)
  } Wow! Tesseracts`
  DOMCacheGetOrSet('platonicHypercubeCost').textContent = `${format(player.wowHypercubes)}/${
    format(platUpgradeBaseCosts[index].hypercubes * priceMultiplier)
  } Wow! Hypercubes`
  DOMCacheGetOrSet('platonicPlatonicCost').textContent = `${format(player.wowPlatonicCubes)}/${
    format(platUpgradeBaseCosts[index].platonics * priceMultiplier)
  } Platonic! Cubes`
  DOMCacheGetOrSet('platonicHepteractCost').textContent = `${format(player.hepteractCrafts.abyss.BAL)}/${
    format(Math.floor(platUpgradeBaseCosts[index].abyssals * priceMultiplier), 0, true)
  } Hepteracts of the Abyss`

  resourceCheck.offerings
    ? DOMCacheGetOrSet('platonicOfferingCost').style.color = 'lime'
    : DOMCacheGetOrSet('platonicOfferingCost').style.color = 'var(--crimson-text-color)'

  resourceCheck.obtainium
    ? DOMCacheGetOrSet('platonicObtainiumCost').style.color = 'lime'
    : DOMCacheGetOrSet('platonicObtainiumCost').style.color = 'var(--crimson-text-color)'

  resourceCheck.cubes
    ? DOMCacheGetOrSet('platonicCubeCost').style.color = 'lime'
    : DOMCacheGetOrSet('platonicCubeCost').style.color = 'var(--crimson-text-color)'

  resourceCheck.tesseracts
    ? DOMCacheGetOrSet('platonicTesseractCost').style.color = 'lime'
    : DOMCacheGetOrSet('platonicTesseractCost').style.color = 'var(--crimson-text-color)'

  resourceCheck.hypercubes
    ? DOMCacheGetOrSet('platonicHypercubeCost').style.color = 'lime'
    : DOMCacheGetOrSet('platonicHypercubeCost').style.color = 'var(--crimson-text-color)'

  resourceCheck.platonics
    ? DOMCacheGetOrSet('platonicPlatonicCost').style.color = 'lime'
    : DOMCacheGetOrSet('platonicPlatonicCost').style.color = 'var(--crimson-text-color)'

  resourceCheck.abyssals
    ? DOMCacheGetOrSet('platonicHepteractCost').style.color = 'lime'
    : DOMCacheGetOrSet('platonicHepteractCost').style.color = 'var(--crimson-text-color)'

  if (player.platonicUpgrades[index] < platUpgradeBaseCosts[index].maxLevel) {
    DOMCacheGetOrSet('platonicUpgradeLevel').style.color = 'cyan'

    if (resourceCheck.canBuy) {
      DOMCacheGetOrSet('platonicCanBuy').style.color = 'gold'
      DOMCacheGetOrSet('platonicCanBuy').textContent = '===Affordable! Click to buy!==='
    } else {
      DOMCacheGetOrSet('platonicCanBuy').style.color = 'var(--crimson-text-color)'
      DOMCacheGetOrSet('platonicCanBuy').textContent = '===You cannot afford this!==='
    }
  }

  if (player.platonicUpgrades[index] === platUpgradeBaseCosts[index].maxLevel) {
    DOMCacheGetOrSet('platonicUpgradeLevel').style.color = 'gold'
    DOMCacheGetOrSet('platonicCanBuy').style.color = 'var(--orchid-text-color)'
    DOMCacheGetOrSet('platonicCanBuy').textContent = '===Maxed==='
  }
}

export const updatePlatonicUpgradeBG = (i: number) => {
  const a = DOMCacheGetOrSet(`platUpg${i}`)

  const maxLevel = platUpgradeBaseCosts[i].maxLevel
  if (player.platonicUpgrades[i] === 0) {
    a.style.backgroundColor = ''
  } else if (player.platonicUpgrades[i] > 0 && player.platonicUpgrades[i] < maxLevel) {
    a.style.backgroundColor = 'purple'
  } else if (player.platonicUpgrades[i] === maxLevel) {
    a.style.backgroundColor = 'green'
  }
}

export const buyPlatonicUpgrades = (index: number, auto = false) => {
  while (index > 0) {
    const resourceCheck = checkPlatonicUpgrade(index, auto)
    let priceMultiplier = 1
    if (platUpgradeBaseCosts[index].priceMult) {
      priceMultiplier = Math.pow(
        platUpgradeBaseCosts[index].priceMult!,
        Math.pow(player.platonicUpgrades[index] / (platUpgradeBaseCosts[index].maxLevel - 1), 1.25)
      )
    }
    priceMultiplier *= calculateSingularityDebuff('Platonic Costs')

    if (resourceCheck.canBuy) {
      player.platonicUpgrades[index] += 1
      // Auto Platonic Upgrades no longer claim the cost of Offerings and Obtainiums
      if (!auto) {
        player.researchPoints -= Math.floor(platUpgradeBaseCosts[index].obtainium * priceMultiplier)
        player.runeshards -= Math.floor(platUpgradeBaseCosts[index].offerings * priceMultiplier)
      }
      player.wowCubes.sub(Math.floor(platUpgradeBaseCosts[index].cubes * priceMultiplier))
      player.wowTesseracts.sub(Math.floor(platUpgradeBaseCosts[index].tesseracts * priceMultiplier))
      player.wowHypercubes.sub(Math.floor(platUpgradeBaseCosts[index].hypercubes * priceMultiplier))
      player.wowPlatonicCubes.sub(Math.floor(platUpgradeBaseCosts[index].platonics * priceMultiplier))
      player.hepteractCrafts.abyss.spend(Math.floor(platUpgradeBaseCosts[index].abyssals * priceMultiplier))

      Synergism.emit('boughtPlatonicUpgrade', platUpgradeBaseCosts[index])
      if (index === 20 && !auto && player.singularityCount === 0) {
        void Alert(
          'While I strongly recommended you not to buy this, you did it anyway. For that, you have unlocked the rune of Grandiloquence, for you are a richass.'
        )
      }
    } else {
      break
    }

    if (player.platonicUpgrades[index] === platUpgradeBaseCosts[index].maxLevel || player.singularityCount === 0) {
      break
    }
  }
  createPlatonicDescription(index)
  updatePlatonicUpgradeBG(index)
  revealStuff()
}

export const autoBuyPlatonicUpgrades = () => {
  if (
    player.autoPlatonicUpgradesToggle
    && ((player.highestSingularityCount >= 100 && player.insideSingularityChallenge)
      || player.highestSingularityCount >= 200)
  ) {
    for (let i = 1; i < player.platonicUpgrades.length; i++) {
      if (player.platonicUpgrades[i] < platUpgradeBaseCosts[i].maxLevel) {
        const resourceCheck = checkPlatonicUpgrade(i, true)
        if (resourceCheck.canBuy) {
          buyPlatonicUpgrades(i, true)
        }
      }
    }
  }
}
