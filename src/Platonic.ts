import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { hepteracts } from './Hepteracts'
import { calculateSingularityDebuff } from './singularity'
import { format, player } from './Synergism'
import { Alert, revealStuff } from './UpdateHTML'

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
    // obtainium: 1e70,
    obtainium: 1,
    offerings: 1e45,
    cubes: 1e13,
    tesseracts: 1e6,
    hypercubes: 1e5,
    platonics: 1e4,
    abyssals: 0,
    maxLevel: 300,
    priceMult: 2
  },
  2: {
    // obtainium: 3e70,
    obtainium: 1,
    offerings: 3e45,
    cubes: 1e11,
    tesseracts: 1e8,
    hypercubes: 1e5,
    platonics: 1e4,
    abyssals: 0,
    maxLevel: 300,
    priceMult: 2
  },
  3: {
    // obtainium: 1e74,
    obtainium: 1,
    offerings: 1e46,
    cubes: 1e11,
    tesseracts: 1e6,
    hypercubes: 1e7,
    platonics: 1e4,
    abyssals: 0,
    maxLevel: 300,
    priceMult: 2
  },
  4: {
    // obtainium: 3e74,
    obtainium: 1,
    offerings: 3e46,
    cubes: 1e12,
    tesseracts: 1e7,
    hypercubes: 1e6,
    platonics: 1e6,
    abyssals: 0,
    maxLevel: 300,
    priceMult: 2
  },
  5: {
    // obtainium: 1e80,
    obtainium: 1,
    offerings: 1e59,
    cubes: 1e14,
    tesseracts: 1e9,
    hypercubes: 1e8,
    platonics: 1e7,
    abyssals: 0,
    maxLevel: 1
  },
  6: {
    // obtainium: 1e82,
    obtainium: 1,
    offerings: 1e61,
    cubes: 1e15,
    tesseracts: 1e9,
    hypercubes: 1e8,
    platonics: 1e7,
    abyssals: 0,
    maxLevel: 10
  },
  7: {
    // obtainium: 1e84,
    obtainium: 1,
    offerings: 3e62,
    cubes: 2e15,
    tesseracts: 2e9,
    hypercubes: 2e8,
    platonics: 1.5e7,
    abyssals: 0,
    maxLevel: 15
  },
  8: {
    // obtainium: 1e87,
    obtainium: 1,
    offerings: 1e64,
    cubes: 4e15,
    tesseracts: 4e9,
    hypercubes: 4e8,
    platonics: 3e7,
    abyssals: 0,
    maxLevel: 5
  },
  9: {
    // obtainium: 1e90,
    obtainium: 1,
    offerings: 1e66,
    cubes: 1e16,
    tesseracts: 1e10,
    hypercubes: 1e9,
    platonics: 5e7,
    abyssals: 0,
    maxLevel: 1
  },
  10: {
    // obtainium: 1e93,
    obtainium: 1,
    offerings: 1e68,
    cubes: 1e18,
    tesseracts: 1e12,
    hypercubes: 1e11,
    platonics: 1e9,
    abyssals: 0,
    maxLevel: 1
  },
  11: {
    // obtainium: 2e96,
    obtainium: 1,
    offerings: 1e70,
    cubes: 2e17,
    tesseracts: 2e11,
    hypercubes: 2e10,
    platonics: 2e8,
    abyssals: 0,
    maxLevel: 1
  },
  12: {
    // obtainium: 1e100,
    obtainium: 1,
    offerings: 1e72,
    cubes: 1e18,
    tesseracts: 1e12,
    hypercubes: 1e11,
    platonics: 1e9,
    abyssals: 0,
    maxLevel: 10
  },
  13: {
    // obtainium: 2e104,
    obtainium: 1,
    offerings: 1e74,
    cubes: 2e19,
    tesseracts: 4e12,
    hypercubes: 4e11,
    platonics: 4e9,
    abyssals: 0,
    maxLevel: 1
  },
  14: {
    // obtainium: 1e108,
    obtainium: 1,
    offerings: 1e77,
    cubes: 4e20,
    tesseracts: 1e13,
    hypercubes: 1e12,
    platonics: 1e10,
    abyssals: 0,
    maxLevel: 1
  },
  15: {
    // obtainium: 1e115,
    obtainium: 1,
    offerings: 1e80,
    cubes: 1e23,
    tesseracts: 1e15,
    hypercubes: 1e14,
    platonics: 1e12,
    abyssals: 1,
    maxLevel: 1
  },
  16: {
    // obtainium: 1e140,
    obtainium: 1,
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
    // obtainium: 1e145,
    obtainium: 1,
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
    // obtainium: 1e150,
    obtainium: 1,
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
    // obtainium: 1e160,
    obtainium: 1,
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
    // obtainium: 1e180,
    obtainium: 1,
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
    'obtainium',
    'offerings',
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
    hepteracts.abyss.BAL >= Math.floor(platUpgradeBaseCosts[index].abyssals * priceMultiplier)
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
  let translationKey = 'wowCubes.platonicUpgrades.descriptionBox.upgradeLevel'
  if (player.platonicUpgrades[index] === platUpgradeBaseCosts[index].maxLevel) {
    translationKey = 'wowCubes.platonicUpgrades.descriptionBox.upgradeLevelMaxed'
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

  DOMCacheGetOrSet('platonicUpgradeDescription').innerHTML = i18next.t(
    `wowCubes.platonicUpgrades.descriptions.${index}`
  )
  DOMCacheGetOrSet('platonicUpgradeLevel').textContent = i18next.t(translationKey, {
    a: format(player.platonicUpgrades[index]),
    b: format(platUpgradeBaseCosts[index].maxLevel)
  })
  DOMCacheGetOrSet('platonicOfferingCost').textContent = i18next.t(
    'wowCubes.platonicUpgrades.descriptionBox.offeringCost',
    {
      a: format(player.offerings),
      b: format(platUpgradeBaseCosts[index].offerings * priceMultiplier)
    }
  )
  DOMCacheGetOrSet('platonicObtainiumCost').textContent = i18next.t(
    'wowCubes.platonicUpgrades.descriptionBox.obtainiumCost',
    {
      a: format(player.obtainium),
      b: format(platUpgradeBaseCosts[index].obtainium * priceMultiplier)
    }
  )
  DOMCacheGetOrSet('platonicCubeCost').textContent = i18next.t('wowCubes.platonicUpgrades.descriptionBox.cubeCost', {
    a: format(player.wowCubes.valueOf()),
    b: format(platUpgradeBaseCosts[index].cubes * priceMultiplier)
  })
  DOMCacheGetOrSet('platonicTesseractCost').textContent = i18next.t(
    'wowCubes.platonicUpgrades.descriptionBox.tesseractCost',
    {
      a: format(player.wowTesseracts.valueOf()),
      b: format(platUpgradeBaseCosts[index].tesseracts * priceMultiplier)
    }
  )
  DOMCacheGetOrSet('platonicHypercubeCost').textContent = i18next.t(
    'wowCubes.platonicUpgrades.descriptionBox.hypercubeCost',
    {
      a: format(player.wowHypercubes.valueOf()),
      b: format(platUpgradeBaseCosts[index].hypercubes * priceMultiplier)
    }
  )
  DOMCacheGetOrSet('platonicPlatonicCost').textContent = i18next.t(
    'wowCubes.platonicUpgrades.descriptionBox.platonicCost',
    {
      a: format(player.wowPlatonicCubes.valueOf()),
      b: format(platUpgradeBaseCosts[index].platonics * priceMultiplier)
    }
  )
  DOMCacheGetOrSet('platonicHepteractCost').textContent = i18next.t(
    'wowCubes.platonicUpgrades.descriptionBox.hepteractCost',
    {
      a: format(hepteracts.abyss.BAL, 0, true),
      b: format(Math.floor(platUpgradeBaseCosts[index].abyssals * priceMultiplier), 0, true)
    }
  )

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
      DOMCacheGetOrSet('platonicCanBuy').textContent = i18next.t(
        'wowCubes.platonicUpgrades.descriptionBox.platonicCanBuy'
      )
    } else {
      DOMCacheGetOrSet('platonicCanBuy').style.color = 'var(--crimson-text-color)'
      DOMCacheGetOrSet('platonicCanBuy').textContent = i18next.t(
        'wowCubes.platonicUpgrades.descriptionBox.platonicCannotBuy'
      )
    }
  }

  if (player.platonicUpgrades[index] === platUpgradeBaseCosts[index].maxLevel) {
    DOMCacheGetOrSet('platonicUpgradeLevel').style.color = 'gold'
    DOMCacheGetOrSet('platonicCanBuy').style.color = 'var(--orchid-text-color)'
    DOMCacheGetOrSet('platonicCanBuy').textContent = i18next.t(
      'wowCubes.platonicUpgrades.descriptionBox.platonicCanBuyMaxed'
    )
  }
}

export const updatePlatonicUpgradeBG = (i: number) => {
  const a = DOMCacheGetOrSet(`platUpg${i}`)

  const maxLevel = platUpgradeBaseCosts[i].maxLevel
  a.classList.remove('green-background', 'purple-background')

  if (player.platonicUpgrades[i] > 0 && player.platonicUpgrades[i] < maxLevel) {
    a.classList.add('purple-background')
  } else if (player.platonicUpgrades[i] === maxLevel) {
    a.classList.add('green-background')
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
        player.obtainium = player.obtainium.sub(Math.floor(platUpgradeBaseCosts[index].obtainium * priceMultiplier))
        player.offerings = player.offerings.sub(Math.floor(platUpgradeBaseCosts[index].offerings * priceMultiplier))
      }
      player.wowCubes.sub(Math.floor(platUpgradeBaseCosts[index].cubes * priceMultiplier))
      player.wowTesseracts.sub(Math.floor(platUpgradeBaseCosts[index].tesseracts * priceMultiplier))
      player.wowHypercubes.sub(Math.floor(platUpgradeBaseCosts[index].hypercubes * priceMultiplier))
      player.wowPlatonicCubes.sub(Math.floor(platUpgradeBaseCosts[index].platonics * priceMultiplier))
      hepteracts.abyss.BAL -= Math.floor(platUpgradeBaseCosts[index].abyssals * priceMultiplier)

      if (index === 20 && !auto && player.singularityCount === 0) {
        void Alert(
          i18next.t('wowCubes.platonicUpgrades.20Bought')
        )
      }
    } else {
      break
    }

    if (player.platonicUpgrades[index] === platUpgradeBaseCosts[index].maxLevel || player.singularityCount === 0 || !player.maxPlatToggle) {
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
