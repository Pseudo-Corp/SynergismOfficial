import Decimal from 'break_infinity.js'
import { achievementaward } from './Achievements'
import { buyUpgrades } from './Buy'
import { player } from './Synergism'
import { clickUpgrades, upgradeupdate } from './Upgrades'
import { Globals as G, Upgrade } from './Variables'

export const buyGenerator = (i: number, state: boolean) => {
  if (i === 1 && player.prestigePoints.gte(1e12) && !player.unlocks.generation) {
    player.unlocks.generation = true
  }
  const q = 100 + i
  let type: 'transcendPoints' | 'coins' | 'prestigePoints' = 'transcendPoints'
  if (q <= 110 && q >= 106) {
    type = 'coins'
  } else if (q <= 115) {
    type = 'prestigePoints'
  }

  const cost = Decimal.pow(10, G.upgradeCosts[q])
  const achievementCheck = Math.max(
    player.upgrades[101],
    player.upgrades[102],
    player.upgrades[103],
    player.upgrades[104],
    player.upgrades[105]
  )

  if (player.upgrades[q] === 0 && player[type].gte(cost)) {
    if (achievementCheck === 0 && q >= 102 && q <= 105) {
      achievementaward(q - 31)
    }
    player[type] = player[type].sub(cost)
    player.upgrades[q] = 1
    upgradeupdate(q, state)
  }
}

export const buyAutobuyers = (i: number, state?: boolean) => {
  const q = i + 80
  let type: 'prestigePoints' | 'transcendPoints' | 'reincarnationPoints' = 'reincarnationPoints'
  if (q <= 87) {
    type = 'prestigePoints'
  } else if (q <= 93) {
    type = 'transcendPoints'
  }

  const cost = Decimal.pow(10, G.upgradeCosts[q])
  if (player.upgrades[q] === 0 && player[type].gte(cost)) {
    player[type] = player[type].sub(cost)
    player.upgrades[q] = 1
    upgradeupdate(q, state)
  }
}

export const autoUpgrades = () => {
  if (player.upgrades[90] > 0.5 && player.shoptoggles.generators) {
    for (let i = 1; i < 6; i++) {
      if (player.upgrades[100 + i] === 0 && player.prestigePoints.gte(Decimal.pow(10, G.upgradeCosts[100 + i]))) {
        buyGenerator(i, true)
      }
    }
    for (let j = 6; j < 11; j++) {
      if (player.upgrades[100 + j] === 0 && player.coins.gte(Decimal.pow(10, G.upgradeCosts[100 + j]))) {
        buyGenerator(j, true)
      }
    }
    for (let k = 11; k < 16; k++) {
      if (player.upgrades[100 + k] === 0 && player.prestigePoints.gte(Decimal.pow(10, G.upgradeCosts[100 + k]))) {
        buyGenerator(k, true)
      }
    }
    for (let l = 16; l < 21; l++) {
      if (player.upgrades[100 + l] === 0 && player.transcendPoints.gte(Decimal.pow(10, G.upgradeCosts[100 + l]))) {
        buyGenerator(l, true)
      }
    }
  }
  if (player.upgrades[91] > 0.5) {
    for (let i = 1; i < 21; i++) {
      if (player.upgrades[i] === 0 && player.coins.gte(Decimal.pow(10, G.upgradeCosts[i])) && player.shoptoggles.coin) {
        buyUpgrades(Upgrade.coin, i, true)
      }
    }
    for (let i = 121; i <= 125; i++) {
      if (
        player.upgrades[i] === 0 && player.coins.gte(Decimal.pow(10, G.upgradeCosts[i])) && player.shoptoggles.coin
        && player.cubeUpgrades[19] > 0
      ) {
        buyUpgrades(Upgrade.coin, i, true)
      }
    }
  }
  if (player.upgrades[92] > 0.5) {
    for (let i = 21; i < 38; i++) {
      if (
        player.upgrades[i] === 0 && player.prestigePoints.gte(Decimal.pow(10, G.upgradeCosts[i]))
        && player.shoptoggles.prestige
      ) {
        buyUpgrades(Upgrade.prestige, i, true)
      }
    }
    if (
      player.upgrades[38] === 0 && player.prestigePoints.gte(Decimal.pow(10, 50000)) && player.shoptoggles.prestige
      && player.achievements[120] === 1
    ) {
      buyUpgrades(Upgrade.prestige, 38, true)
    }
    if (
      player.upgrades[39] === 0 && player.prestigePoints.gte(Decimal.pow(10, 100000)) && player.shoptoggles.prestige
      && player.achievements[127] === 1
    ) {
      buyUpgrades(Upgrade.prestige, 39, true)
    }
    if (
      player.upgrades[40] === 0 && player.prestigePoints.gte(Decimal.pow(10, 200000)) && player.shoptoggles.prestige
      && player.achievements[134] === 1
    ) {
      buyUpgrades(Upgrade.prestige, 40, true)
    }
  }
  if (player.upgrades[99] > 0.5) {
    for (let i = 41; i < 61; i++) {
      if (
        player.upgrades[i] === 0 && player.transcendPoints.gte(Decimal.pow(10, G.upgradeCosts[i]))
        && player.shoptoggles.transcend
      ) {
        buyUpgrades(Upgrade.transcend, i, true)
      }
    }
  }

  if (player.cubeUpgrades[8] > 0) {
    for (let i = 61; i <= 80; i++) {
      if (
        player.upgrades[i] === 0 && player.reincarnationPoints.gte(Decimal.pow(10, G.upgradeCosts[i]))
        && player.shoptoggles.reincarnate
      ) {
        buyUpgrades(Upgrade.reincarnation, i, true)
      }
    }
  }

  if (player.highestSingularityCount >= 25) {
    for (let i = 81; i <= 100; i++) {
      if (player.upgrades[i] === 0) {
        clickUpgrades(i, true)
      }
    }
  }
}
