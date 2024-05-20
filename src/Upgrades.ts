import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { buyAutobuyers, buyGenerator } from './Automation'
import { buyUpgrades } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAnts, calculateCorruptionPoints, calculateRuneLevels } from './Calculate'
import { format, player } from './Synergism'
import { revealStuff } from './UpdateHTML'
import { sumContents } from './Utility'
import { Globals as G, Upgrade } from './Variables'

const crystalupgdesc: Record<number, () => Record<string, string>> = {
  3: () => ({
    max: format(
      100 * (0.12 + 0.88 * player.upgrades[122] + 0.001 * player.researches[129]
          * Math.log(player.commonFragments + 1) / Math.log(4)),
      2,
      true
    )
  }),
  4: () => ({
    max: format(
      10 + 0.05 * player.researches[129] * Math.log(player.commonFragments + 1)
          / Math.log(4)
        + 20 * calculateCorruptionPoints() / 400 * G.effectiveRuneSpiritPower[3]
    )
  })
}

const constantUpgDesc: Record<number, () => Record<string, string>> = {
  1: () => ({ level: format(5 + player.achievements[270] + 0.1 * player.platonicUpgrades[18], 1, true) }),
  2: () => ({
    max: format(
      10 + player.achievements[270] + player.shopUpgrades.constantEX + 100
          * (G.challenge15Rewards.exponent - 1)
        + 0.3 * player.platonicUpgrades[18],
      2,
      true
    )
  })
}

const upgradetexts = [
  () => format((G.totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, G.totalCoinOwned)), 2),
  () => format((G.totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, G.totalCoinOwned)), 2),
  () => format((G.totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, G.totalCoinOwned)), 2),
  () => format((G.totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, G.totalCoinOwned)), 2),
  () => format((G.totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, G.totalCoinOwned)), 2),
  () => format((G.totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, G.totalCoinOwned)), 2),
  () => Math.min(4, 1 + Math.floor(Decimal.log(player.fifthOwnedCoin + 1, 10))),
  () => Math.floor(player.multiplierBought / 7),
  () => Math.floor(player.acceleratorBought / 10),
  () => format(Decimal.pow(2, Math.min(50, player.secondOwnedCoin / 15)), 2),
  () => format(Decimal.pow(1.02, G.freeAccelerator), 2),
  () => format(Decimal.min(1e4, Decimal.pow(1.01, player.prestigeCount)), 2),
  () =>
    format(
      Decimal.min(
        1e50,
        Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), 4 / 3).times(1e10)
      ),
      2
    ),
  () => format(Decimal.pow(1.15, G.freeAccelerator), 2),
  () => format(Decimal.pow(1.15, G.freeAccelerator), 2),
  () => format(Decimal.pow(G.acceleratorEffect, 1 / 3), 2),
  () => null,
  () => format(Decimal.min(1e125, player.transcendShards.add(1))),
  () => format(Decimal.min(1e200, player.transcendPoints.times(1e30).add(1))),
  () => format(Decimal.pow((G.totalCoinOwned + 1) * Math.min(1e30, Math.pow(1.008, G.totalCoinOwned)), 10), 2),
  () => ({
    x: format(Math.floor(1 + (1 / 101 * G.freeMultiplier))),
    y: format(Math.floor(5 + (1 / 101 * G.freeAccelerator)))
  }),
  () => ({
    x: format(Math.floor(1 + (1 / 101 * G.freeMultiplier))),
    y: format(Math.floor(4 + (1 / 101 * G.freeAccelerator)))
  }),
  () => ({
    x: format(Math.floor(1 + (1 / 101 * G.freeMultiplier))),
    y: format(Math.floor(3 + (1 / 101 * G.freeAccelerator)))
  }),
  () => ({
    x: format(Math.floor(1 + (1 / 101 * G.freeMultiplier))),
    y: format(Math.floor(2 + (1 / 101 * G.freeAccelerator)))
  }),
  () => ({
    x: format(Math.floor(1 + (1 / 101 * G.freeMultiplier))),
    y: format(Math.floor(1 + (1 / 101 * G.freeAccelerator)))
  }),
  () => null,
  () =>
    format(
      Math.min(250, Math.floor(Decimal.log(player.coins.add(1), 1e3)))
        + Math.max(0, Math.min(1750, Math.floor(Decimal.log(player.coins.add(1), 1e15)) - 50))
    ),
  () =>
    format(
      Math.min(
        1000,
        Math.floor(
          (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin
            + player.fifthOwnedCoin) / 160
        )
      )
    ),
  () =>
    format(
      Math.floor(
        Math.min(
          2000,
          (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin
            + player.fifthOwnedCoin) / 80
        )
      )
    ),
  () =>
    format(
      Math.min(75, Math.floor(Decimal.log(player.coins.add(1), 1e10)))
        + Math.min(925, Math.floor(Decimal.log(player.coins.add(1), 1e30)))
    ),
  () => format(Math.floor(G.totalCoinOwned / 2000)),
  () => format(Math.min(500, Math.floor(Decimal.log(player.prestigePoints.add(1), 1e25)))),
  () => format(G.totalAcceleratorBoost),
  () => format(Math.floor(3 / 103 * G.freeMultiplier)),
  () => format(Math.floor(2 / 102 * G.freeMultiplier)),
  () => format(Decimal.min('1e5000', Decimal.pow(player.prestigePoints, 1 / 500)), 2),
  () => format(Decimal.pow(Decimal.log(player.prestigePoints.add(10), 10), 2), 2),
  () => null,
  () => null,
  () => null,
  () => format(Decimal.min(1e30, Decimal.pow(player.transcendPoints.add(1), 1 / 2))),
  () => format(Decimal.min(1e50, Decimal.pow(player.prestigePoints.add(1), 1 / 50).dividedBy(2.5).add(1)), 2),
  () => format(Decimal.min(1e30, Decimal.pow(1.01, player.transcendCount)), 2),
  () => format(Decimal.min(1e6, Decimal.pow(1.01, player.transcendCount)), 2),
  () => format(Math.min(2500, Math.floor(Decimal.log(player.transcendShards.add(1), 10)))),
  () => null,
  () => format(Math.pow(1.05, player.achievementPoints) * (player.achievementPoints + 1), 2),
  () => format(Math.pow(Math.min(1e25, G.totalMultiplier * G.totalAccelerator) / 1000 + 1, 8)),
  () => format(Math.min(50, Math.floor(Decimal.log(player.transcendPoints.add(1), 1e10)))),
  () => null,
  () => format(Math.pow(G.totalAcceleratorBoost, 2), 2),
  () => format(Decimal.pow(G.globalMythosMultiplier, 0.025), 2),
  () => format(Decimal.min('1e1250', Decimal.pow(G.acceleratorEffect, 1 / 125)), 2),
  () => format(Decimal.min('1e2000', Decimal.pow(G.multiplierEffect, 1 / 180)), 2),
  () => format(Decimal.pow('1e1000', Math.min(1000, G.buildingPower - 1)), 2),
  () => null,
  () => null,
  () => null,
  () => null,
  () => null,
  () => null,
  () => Math.floor(1 / 5 * (sumContents(player.challengecompletions))),
  () => format(Decimal.min('1e6000', Decimal.pow(player.reincarnationPoints.add(1), 6))),
  () => format(Decimal.pow(player.reincarnationPoints.add(1), 2)),
  () => null,
  () => null,
  () =>
    format(
      Decimal.pow(
        1.03,
        player.firstOwnedParticles + player.secondOwnedParticles + player.thirdOwnedParticles
          + player.fourthOwnedParticles + player.fifthOwnedParticles
      ),
      2
    ),
  () => format(Math.min(2500, Math.floor(1 / 1000 * Decimal.log(G.taxdivisor, 10)))),
  () => {
    const a = Decimal.pow(Decimal.log(G.reincarnationPointGain.add(10), 10), 0.5)
    const b = Decimal.pow(Decimal.log(G.reincarnationPointGain.add(10), 10), 0.5)
    return {
      x: format(Math.min(10, new Decimal(a).toNumber()), 2),
      y: format(Math.min(3, new Decimal(b).toNumber()), 2)
    }
  },
  () => format(1 / 3 * Math.log(player.maxobtainium + 1) / Math.log(10), 2, true),
  () => null,
  () =>
    Math.min(
      50,
      1 + 2 * player.challengecompletions[6] + 2 * player.challengecompletions[7] + 2 * player.challengecompletions[8]
        + 2 * player.challengecompletions[9] + 2 * player.challengecompletions[10]
    ),
  () => null,
  () => format(1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5)), 2),
  () => format(1 + 2 * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5)), 2),
  () => null,
  () =>
    format(
      Decimal.pow(
        1.004 + 4 / 100000 * player.researches[96],
        player.firstOwnedAnts + player.secondOwnedAnts + player.thirdOwnedAnts + player.fourthOwnedAnts
          + player.fifthOwnedAnts + player.sixthOwnedAnts + player.seventhOwnedAnts + player.eighthOwnedAnts
      ),
      3
    ),
  () => format(1 + 0.005 * Math.pow(Math.log(player.maxofferings + 1) / Math.log(10), 2), 2, true),
  () => null,
  () => null,
  ...Array.from({ length: 39 }, () => () => null),
  () => null,
  () => null,
  () => null,
  () => null,
  () => format(0.333 * player.challengecompletions[10], 0),
  () => format(0.333 * player.challengecompletions[10], 0)
]

export const upgradeeffects = (i: number) => {
  const effect = upgradetexts[i - 1]?.()
  const type = typeof effect
  const element = DOMCacheGetOrSet('upgradeeffect')

  if (i >= 81 && i <= 119) {
    element.textContent = i18next.t('upgrades.effects.81')
  } else if (effect == null) {
    element.textContent = i18next.t(`upgrades.effects.${i}`)
  } else if (type === 'string' || type === 'number') {
    element.textContent = i18next.t(`upgrades.effects.${i}`, { x: effect })
  } else {
    element.textContent = i18next.t(`upgrades.effects.${i}`, effect as Exclude<typeof effect, string | number>)
  }
}

export const upgradedescriptions = (i: number) => {
  const y = i18next.t(`upgrades.descriptions.${i}`)
  const z = player.upgrades[i] > 0.5 ? ' BOUGHT!' : ''

  const el = DOMCacheGetOrSet('upgradedescription')
  el.textContent = y + z
  el.style.color = player.upgrades[i] > 0.5 ? 'gold' : 'white'

  if (player.toggles[9]) {
    clickUpgrades(i, false)
  }

  let currency = ''
  let color = ''
  if ((i <= 20 && i >= 1) || (i <= 110 && i >= 106) || (i <= 125 && i >= 121)) {
    currency = 'Coins'
    color = 'yellow'
  }
  if ((i <= 40 && i >= 21) || (i <= 105 && i >= 101) || (i <= 115 && i >= 111) || (i <= 87 && i >= 81)) {
    currency = 'Diamonds'
    color = 'cyan'
  }
  if ((i <= 60 && i >= 41) || (i <= 120 && i >= 116) || (i <= 93 && i >= 88)) {
    currency = 'Mythos'
    color = 'plum'
  }
  if ((i <= 80 && i >= 61) || (i <= 100 && i >= 94)) {
    currency = 'Particles'
    color = 'limegreen'
  }

  DOMCacheGetOrSet('upgradecost').textContent = `Cost: ${format(Decimal.pow(10, G.upgradeCosts[i]))} ${currency}`
  DOMCacheGetOrSet('upgradecost').style.color = color
  upgradeeffects(i)
}

export const clickUpgrades = (i: number, auto: boolean) => {
  // Make sure the upgrade is locked
  if (
    player.upgrades[i] !== 0
    || (i <= 40 && i >= 21 && !player.unlocks.prestige)
    || (i <= 60 && i >= 41 && !player.unlocks.transcend)
    || (i <= 80 && i >= 61 && !player.unlocks.reincarnate)
    || (i <= 120 && i >= 81 && !player.unlocks.prestige)
    || DOMCacheGetOrSet(`upg${i}`)!.style.display === 'none'
  ) {
    return
  }

  let type: Upgrade | undefined
  if (i <= 20 && i >= 1) {
    type = Upgrade.coin
  }
  if (i <= 40 && i >= 21) {
    type = Upgrade.prestige
  }
  if (i <= 60 && i >= 41) {
    type = Upgrade.transcend
  }
  if (i <= 80 && i >= 61) {
    type = Upgrade.reincarnation
  }
  if (i <= 87 && i >= 81) {
    type = Upgrade.prestige
  }
  if (i <= 93 && i >= 88) {
    type = Upgrade.transcend
  }
  if (i <= 100 && i >= 94) {
    type = Upgrade.reincarnation
  }
  if (type && i <= 80 && i >= 1) {
    buyUpgrades(type, i, auto)
  }
  if (type && i <= 100 && i >= 81) {
    buyAutobuyers(i - 80, auto)
  }
  if (i <= 120 && i >= 101) {
    buyGenerator(i - 100, auto)
  }
  if (i <= 125 && i >= 121) {
    buyUpgrades(Upgrade.coin, i, auto)
  }
}

export const categoryUpgrades = (i: number, auto: boolean) => {
  let min = 0
  let max = 0
  if (i === 1) {
    min = 121
    max = 125
    for (let i = 1; i <= 20; i++) {
      clickUpgrades(i, auto)
    }
  }
  if (i === 2) {
    min = 21
    max = 40
  }
  if (i === 3) {
    min = 41
    max = 60
  }
  if (i === 4) {
    min = 101
    max = 120
  }
  if (i === 5) {
    min = 81
    max = 100
  }
  if (i === 6) {
    min = 61
    max = 80
  }
  for (let i = min; i <= max; i++) {
    clickUpgrades(i, auto)
  }
}

const crystalupgeffect: Record<number, () => Record<string, string>> = {
  1: () => ({
    x: format(
      Decimal.min(
        Decimal.pow(10, 50 + 2 * player.crystalUpgrades[0]),
        Decimal.pow(1.05, player.achievementPoints * player.crystalUpgrades[0])
      ),
      2,
      true
    )
  }),
  2: () => ({
    x: format(
      Decimal.min(
        Decimal.pow(10, 100 + 5 * player.crystalUpgrades[1]),
        Decimal.pow(Decimal.log(player.coins.add(1), 10), player.crystalUpgrades[1] / 3)
      ),
      2,
      true
    )
  }),
  3: () => ({
    x: format(
      Decimal.pow(
        1
          + Math.min(
            0.12 + 0.88 * player.upgrades[122]
              + 0.001 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4),
            0.001 * player.crystalUpgrades[2]
          ),
        player.firstOwnedDiamonds + player.secondOwnedDiamonds + player.thirdOwnedDiamonds + player.fourthOwnedDiamonds
          + player.fifthOwnedDiamonds
      ),
      2,
      true
    )
  }),
  4: () => ({
    x: format(
      Math.min(
        10 + 0.05 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4)
          + 20 * calculateCorruptionPoints() / 400 * G.effectiveRuneSpiritPower[3],
        0.05 * player.crystalUpgrades[3]
      ),
      2,
      true
    )
  }),
  5: () => ({
    x: format(
      Decimal.pow(
        1.01,
        (player.challengecompletions[1] + player.challengecompletions[2] + player.challengecompletions[3]
          + player.challengecompletions[4] + player.challengecompletions[5]) * player.crystalUpgrades[4]
      ),
      2,
      true
    )
  })
}

const returnCrystalUpgDesc = (i: number) => i18next.t(`upgrades.crystalUpgrades.${i}`, crystalupgdesc[i]?.())
const returnCrystalUpgEffect = (i: number) =>
  i18next.t('buildings.crystalUpgrades.currentEffect', {
    effect: i in crystalupgeffect ? i18next.t(`upgrades.crystalEffects.${i}`, crystalupgeffect[i]()) : ''
  })

export const crystalupgradedescriptions = (i: number) => {
  const p = player.crystalUpgrades[i - 1]
  const c = (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0 ? 10 : 0)
    + (Math.floor(G.rune3level * G.effectiveLevelMult / 16) * 100 / 100)

  const q = Decimal.pow(
    10,
    G.crystalUpgradesCost[i - 1]
      + G.crystalUpgradeCostIncrement[i - 1] * Math.floor(Math.pow(player.crystalUpgrades[i - 1] + 0.5 - c, 2) / 2)
  )
  DOMCacheGetOrSet('crystalupgradedescription').textContent = returnCrystalUpgDesc(i)
  DOMCacheGetOrSet('crystalupgradeslevel1').innerHTML = i18next.t('buildings.crystalUpgrades.currentLevel', {
    amount: format(p, 0, true)
  })
  DOMCacheGetOrSet('crystalupgradescost1').innerHTML = i18next.t('buildings.crystalUpgrades.cost', {
    amount: format(q)
  })
  DOMCacheGetOrSet('crystalupgradeseffect1').innerHTML = returnCrystalUpgEffect(i)
}

export const upgradeupdate = (num: number, fast?: boolean) => {
  const el = DOMCacheGetOrSet(`upg${num}`)
  if (player.upgrades[num] > 0.5) {
    el.style.backgroundColor = 'green'
  } else {
    el.style.backgroundColor = ''
  }

  const b = i18next.t(`upgrades.descriptions.${num}`)
  const c = player.upgrades[num] > 0.5 ? ' BOUGHT!' : ''
  if (player.upgrades[num] > 0.5) {
    if (!fast) {
      DOMCacheGetOrSet('upgradedescription').textContent = b + c
      DOMCacheGetOrSet('upgradedescription').style.color = 'gold'
    }
  }

  if (!fast) {
    revealStuff()
  }
}

export const ascendBuildingDR = () => {
  const sum = player.ascendBuilding1.owned + player.ascendBuilding2.owned + player.ascendBuilding3.owned
    + player.ascendBuilding4.owned + player.ascendBuilding5.owned

  if (sum > 100000) {
    return Math.pow(100000, 0.5) * Math.pow(sum, 0.5)
  } else {
    return sum
  }
}

const constUpgEffect: Record<number, () => Record<string, string>> = {
  1: () => ({
    x: format(
      Decimal.pow(
        1.05 + 0.01 * player.achievements[270] + 0.001 * player.platonicUpgrades[18],
        player.constantUpgrades[1]
      ),
      2,
      true
    )
  }),
  2: () => ({
    x: format(
      Decimal.pow(
        1
          + 0.001
            * Math.min(
              100 + 10 * player.achievements[270] + 10 * player.shopUpgrades.constantEX
                + 3 * player.platonicUpgrades[18] + 1000 * (G.challenge15Rewards.exponent - 1),
              player.constantUpgrades[2]
            ),
        ascendBuildingDR()
      ),
      2,
      true
    )
  }),
  3: () => ({
    x: format(1 + 0.02 * player.constantUpgrades[3], 2, true)
  }),
  4: () => ({
    x: format(1 + 0.04 * player.constantUpgrades[4], 2, true)
  }),
  5: () => ({
    x: format(Decimal.pow(1 + 0.1 * Decimal.log(player.ascendShards.add(1), 10), player.constantUpgrades[5]), 2, true)
  }),
  6: () => ({
    x: format(2 * player.constantUpgrades[6])
  }),
  7: () => ({
    x: format(7 * player.constantUpgrades[7]),
    y: format(3 * player.constantUpgrades[7])
  }),
  8: () => ({
    x: format(1 + 1 / 10 * player.constantUpgrades[8], 2, true)
  }),
  9: () => ({
    x: format(
      1 + 0.01 * Math.log(player.talismanShards + 1) / Math.log(4) * Math.min(1, player.constantUpgrades[9]),
      4,
      true
    )
  }),
  10: () => ({
    x: format(1 + 0.01 * Decimal.log(player.ascendShards.add(1), 4) * Math.min(1, player.constantUpgrades[10]), 4, true)
  })
}

const returnConstUpgDesc = (i: number) => i18next.t(`upgrades.constantUpgrades.${i}`, constantUpgDesc[i]?.())
const returnConstUpgEffect = (i: number) => i18next.t(`upgrades.constantEffects.${i}`, constUpgEffect[i]?.())

export const getConstUpgradeMetadata = (i: number): [number, Decimal] => {
  let toBuy: number
  let cost: Decimal

  if (i >= 9) {
    if (player.constantUpgrades[i]! >= 1) {
      toBuy = 0
    } else {
      toBuy = Math.min(
        1,
        Math.max(
          0,
          Math.floor(
            1 + Decimal.log(Decimal.max(0.01, player.ascendShards), 10)
              - Math.log(G.constUpgradeCosts[i]!) / Math.log(10)
          )
        )
      )
    }
  } else {
    toBuy = Math.max(
      0,
      Math.floor(
        1 + Decimal.log(Decimal.max(0.01, player.ascendShards), 10) - Math.log(G.constUpgradeCosts[i]!) / Math.log(10)
      )
    )
  }

  if (toBuy > player.constantUpgrades[i]!) {
    cost = Decimal.pow(10, toBuy - 1).times(G.constUpgradeCosts[i]!)
  } else {
    cost = i >= 9 && player.constantUpgrades[i]! >= 1
      ? new Decimal('0')
      : Decimal.pow(10, player.constantUpgrades[i]!).times(G.constUpgradeCosts[i]!)
  }

  return [Math.max(1, toBuy - player.constantUpgrades[i]!), cost]
}

export const constantUpgradeDescriptions = (i: number) => {
  const [level, cost] = getConstUpgradeMetadata(i)
  DOMCacheGetOrSet('constUpgradeDescription').textContent = returnConstUpgDesc(i)
  if (i >= 9) {
    DOMCacheGetOrSet('constUpgradeLevel2').textContent = `${format(Math.min(1, player.constantUpgrades[i]!))}/1`
  } else DOMCacheGetOrSet('constUpgradeLevel2').textContent = format(player.constantUpgrades[i])
  DOMCacheGetOrSet('constUpgradeCost2').textContent = `${format(cost)} [+${format(level)} LVL]`
  DOMCacheGetOrSet('constUpgradeEffect2').textContent = returnConstUpgEffect(i)
}

export const buyConstantUpgrades = (i: number, fast = false) => {
  const [level, cost] = getConstUpgradeMetadata(i)
  if (i <= 8 || (i >= 9 && player.constantUpgrades[i]! < 1)) {
    if (player.ascendShards.gte(cost)) {
      player.constantUpgrades[i]! += level
      if (player.researches[175] === 0) {
        player.ascendShards = player.ascendShards.sub(cost)
      }
      if (!fast) {
        constantUpgradeDescriptions(i)
      }
    }
  }
  calculateAnts()
  calculateRuneLevels()
}
