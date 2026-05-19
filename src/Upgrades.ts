import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { achievementPoints, getAchievementReward } from './Achievements'
import { buyAutobuyers, buyGenerator } from './Automation'
import { buyUpgrades } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateGlobalSpeedMult, calculateTotalCoinOwned } from './Calculate'
import { AntProducers } from './Features/Ants/structs/structs'
import { getRuneEffects } from './Runes'
import { getShopUpgradeEffects } from './Shop'
import {
  calculateBuildingPower,
  crystalUpgrade3Base,
  crystalUpgrade3CrystalMultiplier,
  crystalUpgrade3MaxBase,
  crystalUpgrade4MaxExponent,
  format,
  formatAsPercentIncrease,
  player
} from './Synergism'
import type { upgradeAutos } from './Toggles'
import { toggleShops } from './Toggles'
import { CloseModal, Modal, revealStuff } from './UpdateHTML'
import { sumContents } from './Utility'
import { Globals as G, Upgrade } from './Variables'
import { platform } from './Config'

const crystalupgdesc: Record<number, () => Record<string, string>> = {
  3: () => ({
    max: formatAsPercentIncrease(
      crystalUpgrade3MaxBase(),
      2
    )
  }),
  4: () => ({
    max: format(
      crystalUpgrade4MaxExponent(),
      2,
      true
    )
  })
}

const constantUpgDesc: Record<number, () => Record<string, string>> = {
  1: () => ({
    level: format(
      5 + 100 * +getAchievementReward('constUpgrade1Buff') + 0.1 * player.platonicUpgrades[18],
      1,
      true
    )
  }),
  2: () => ({
    max: format(
      10 + 100 * +getAchievementReward('constUpgrade2Buff') + getShopUpgradeEffects('constantEX', 'maxPercentIncrease')
        + 100
          * (G.challenge15Rewards.exponent.value - 1)
        + 0.3 * player.platonicUpgrades[18],
      2,
      true
    )
  })
}

export enum UpgradeCategories {
  Coin,
  Diamond,
  Mythos,
  Generator,
  Autobuyer,
  Particle
}

type Interval = [number, number]

const intervalToArray = (interval: Interval) =>
  Array.from({ length: interval[1] - interval[0] + 1 }, (_, i) => i + interval[0])

interface CategoryData {
  upgradeIds: number[]
  mainIconName: string
  listIconName: string
  i18n: string
  unlockHTMLClass: string
  autoToggle: upgradeAutos | ''
  color: string
  ariaLabelledBy: string
}

const categoryData: Record<UpgradeCategories, CategoryData> = {
  [UpgradeCategories.Coin]: {
    upgradeIds: intervalToArray([1, 20]).concat(intervalToArray([121, 125])),
    mainIconName: 'Coin',
    listIconName: 'Coin',
    i18n: 'coin',
    unlockHTMLClass: '',
    autoToggle: 'coin',
    color: 'gold',
    ariaLabelledBy: 'cointext'
  },
  [UpgradeCategories.Diamond]: {
    upgradeIds: intervalToArray([21, 40]),
    mainIconName: 'Diamond',
    listIconName: 'Diamond',
    i18n: 'diamond',
    unlockHTMLClass: 'prestigeunlock',
    autoToggle: 'prestige',
    color: 'cyan',
    ariaLabelledBy: 'prestigetext'
  },
  [UpgradeCategories.Mythos]: {
    upgradeIds: intervalToArray([41, 60]),
    mainIconName: 'Mythos',
    listIconName: 'Mythos',
    i18n: 'mythos',
    unlockHTMLClass: 'transcendunlock',
    autoToggle: 'transcend',
    color: 'plum',
    ariaLabelledBy: 'transcendtext'
  },
  [UpgradeCategories.Particle]: {
    upgradeIds: intervalToArray([61, 80]),
    mainIconName: 'Particle',
    listIconName: 'Particle',
    i18n: 'particles',
    unlockHTMLClass: 'reincarnationunlock',
    autoToggle: 'reincarnate',
    color: 'limegreen',
    ariaLabelledBy: 'reincarnationtext'
  },
  [UpgradeCategories.Autobuyer]: {
    upgradeIds: intervalToArray([81, 100]),
    mainIconName: 'Automation',
    listIconName: 'Automation',
    i18n: 'automation',
    unlockHTMLClass: 'prestigeunlock',
    autoToggle: '',
    color: 'crimson',
    ariaLabelledBy: 'autobuyertext'
  },
  [UpgradeCategories.Generator]: {
    upgradeIds: intervalToArray([101, 120]),
    mainIconName: 'Generators',
    listIconName: 'Generator',
    i18n: 'generator',
    unlockHTMLClass: 'prestigeunlock',
    autoToggle: 'generators',
    color: 'lightgray',
    ariaLabelledBy: 'generatortext'
  }
}

const upgradetexts = [
  () => format((calculateTotalCoinOwned() + 1) * Math.min(1e30, Math.pow(1.008, calculateTotalCoinOwned())), 2),
  () => format((calculateTotalCoinOwned() + 1) * Math.min(1e30, Math.pow(1.008, calculateTotalCoinOwned())), 2),
  () => format((calculateTotalCoinOwned() + 1) * Math.min(1e30, Math.pow(1.008, calculateTotalCoinOwned())), 2),
  () => format((calculateTotalCoinOwned() + 1) * Math.min(1e30, Math.pow(1.008, calculateTotalCoinOwned())), 2),
  () => format((calculateTotalCoinOwned() + 1) * Math.min(1e30, Math.pow(1.008, calculateTotalCoinOwned())), 2),
  () => format((calculateTotalCoinOwned() + 1) * Math.min(1e30, Math.pow(1.008, calculateTotalCoinOwned())), 2),
  () => Math.min(4, 1 + Math.floor(Decimal.log(player.fifthOwnedCoin + 1, 10))),
  () => format(Math.floor(player.multiplierBought / 7), 0, true),
  () => format(Math.floor(player.acceleratorBought / 10), 0, true),
  () => format(Decimal.pow(2, Math.min(50, player.secondOwnedCoin / 15)), 2),
  () => format(Decimal.pow(1.02, G.freeAccelerator), 2),
  () => format(Decimal.min(1e4, Decimal.pow(1.01, player.prestigeCount)), 2),
  () =>
    format(
      Decimal.min(
        1e50,
        Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), 4 / 3).times(1e22)
      ),
      2
    ),
  () => format(Decimal.pow(1.15, G.freeAccelerator).times(1e5), 2),
  () => format(Decimal.pow(1.15, G.freeAccelerator).times(1e5), 2),
  () =>
    format(
      Decimal.min(
        Decimal.pow(10, 1e33),
        Decimal.pow(G.acceleratorEffect, G.deflationMultiplier[player.corruptions.used.deflation] / 3)
      ),
      2
    ),
  () =>
    format(
      Decimal.min(1e125, player.transcendShards.add(1)),
      0,
      true
    ),
  () => format(Decimal.min(1e125, player.transcendShards.add(1))),
  () => format(Decimal.min(1e200, player.transcendPoints.times(1e30).add(1))),
  () =>
    format(
      Decimal.pow((calculateTotalCoinOwned() + 1) * Math.min(1e30, Math.pow(1.008, calculateTotalCoinOwned())), 10),
      2
    ),
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
      Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e10)))
        + Math.max(0, Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e50)) - 10))
    ),
  () =>
    format(
      Math.min(
        100,
        Math.floor(
          (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin
            + player.fifthOwnedCoin) / 400
        )
      )
    ),
  () =>
    format(
      Math.floor(
        Math.min(
          100,
          (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin
            + player.fifthOwnedCoin) / 400
        )
      )
    ),
  () =>
    format(
      Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e30)))
        + Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e300)))
    ),
  () => format(Math.floor(calculateTotalCoinOwned() / 2000)),
  () => format(Math.min(500, Math.floor(Decimal.log(player.prestigePoints.add(1), 1e25)))),
  () => format(G.totalAcceleratorBoost),
  () => format(Math.floor(3 / 103 * G.freeMultiplier)),
  () => format(Math.floor(2 / 102 * G.freeMultiplier)),
  () => format(Decimal.min('1e5000', Decimal.pow(player.prestigePoints, 1 / 500)), 2),
  () => format(Decimal.pow(Decimal.log(player.prestigePoints.add(10), 10), 2), 2),
  () => null,
  () => null,
  () => null,
  () => format(Decimal.min(1e30, Decimal.pow(player.transcendPoints.add(4), 1 / 2))),
  () => format(Decimal.min(1e50, Decimal.pow(player.prestigePoints.add(1), 1 / 50).dividedBy(2.5).add(1)), 2),
  () => format(Decimal.min(1e30, Decimal.pow(1.01, player.transcendCount)), 2),
  () => format(Decimal.min(1e6, Decimal.pow(1.01, player.transcendCount)), 2),
  () => format(Math.min(2500, Math.floor(Decimal.log(player.transcendShards.add(1), 10)))),
  () => null,
  () => format(Math.pow(1.01, achievementPoints) * (achievementPoints / 5 + 1), 2),
  () => format(Math.pow(Math.min(1e25, G.totalMultiplier * G.totalAccelerator) / 1000 + 1, 8)),
  () => format(Math.min(50, Math.floor(Decimal.log(player.transcendPoints.add(1), 1e10)))),
  () => null,
  () => format(Math.pow(G.totalAcceleratorBoost, 2), 2),
  () => format(Decimal.pow(G.globalMythosMultiplier, 0.025), 2),
  () => format(Decimal.min('1e1250', Decimal.pow(G.acceleratorEffect, 1 / 125)), 2),
  () => format(Decimal.min('1e2000', Decimal.pow(G.multiplierEffect, 1 / 180)), 2),
  () => format(Decimal.pow('1e1000', Math.min(1000, calculateBuildingPower() - 1)), 2),
  () => null,
  () => null,
  () => null,
  () => null,
  () => null,
  () => null,
  () => Math.min(12, Math.floor(1 / 50 * (sumContents(player.challengecompletions)))),
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
  () => format(1 / 3 * Decimal.log10(player.maxObtainium.plus(1)), 2, true),
  () => null,
  () =>
    Math.min(
      50,
      1 + 2 * player.challengecompletions[6] + 2 * player.challengecompletions[7] + 2 * player.challengecompletions[8]
        + 2 * player.challengecompletions[9] + 2 * player.challengecompletions[10]
    ),
  () => null,
  () => format(1 + 4 * Math.min(1, Math.pow(Decimal.min(player.maxOfferings, 1e10).toNumber() / 100000, 0.5)), 2),
  () => format(1 + 2 * Math.min(1, Math.pow(Decimal.min(player.maxObtainium, 1e10).toNumber() / 30000000, 0.5)), 2),
  () => null,
  () =>
    format(
      Decimal.pow(
        1.004,
        player.ants.producers[AntProducers.Workers].purchased
      ),
      3
    ),
  () => format(1 + 0.005 * Math.pow(Decimal.log10(player.maxOfferings.plus(1)), 2), 2, true),
  () => format(Decimal.max(Decimal.pow(calculateGlobalSpeedMult(), 3), 1), 2, true),
  () =>
    format(
      10 * Math.min(50, player.ants.antSacrificeCount)
        + 5 * Math.min(50, Math.max(player.ants.antSacrificeCount - 50, 0))
        + Math.min(250, Math.max(0, player.ants.antSacrificeCount - 100)),
      0,
      true
    ),
  ...Array.from({ length: 39 }, () => () => null),
  () => null,
  () => null,
  () => null,
  () => null,
  () => format(0.333 * player.challengecompletions[10], 0),
  () => format(0.333 * player.challengecompletions[10], 0)
]

// TODO: We really should make a more unified Upgrade Data object...
export const upgradeRequirements = [
  // Zeroth Upgrade, because upgrades are 1-indexed (FUCK YOU PLATONIC)
  () => true,
  // Coin Upgrades 1-5
  () => true,
  () => true,
  () => true,
  () => true,
  () => true,
  // Coin Upgrades 6-10
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  // Coin Upgrades 11-15
  () => player.unlocks.generation,
  () => player.unlocks.generation,
  () => player.unlocks.generation,
  () => player.unlocks.generation,
  () => player.unlocks.generation,
  // Coin Upgrades 16-20
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Diamond Upgrades 1-5
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  // Diamond Upgrades 6-10
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  // Diamond Upgrades 11-15
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Diamond Upgrades 16-20
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => getAchievementReward('diamondUpgrade18'),
  () => getAchievementReward('diamondUpgrade19'),
  () => getAchievementReward('diamondUpgrade20'),
  // Mythos Upgrade 1-5
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Mythos Upgrade 6-10
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Mythos Upgrade 11-15
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  // Mythos Upgrade 16-20
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  // Reincarnation Upgrade 1-5
  () => player.researches[47] > 0,
  () => player.researches[47] > 0,
  () => player.researches[47] > 0,
  () => player.researches[47] > 0,
  () => player.researches[47] > 0,
  // Reincarnation Upgrade 6-10
  () => player.researches[48] > 0,
  () => player.researches[48] > 0,
  () => player.researches[48] > 0,
  () => player.researches[48] > 0,
  () => player.researches[48] > 0,
  // Reincarnation Upgrade 11-15
  () => player.researches[49] > 0,
  () => player.researches[49] > 0,
  () => player.researches[49] > 0,
  () => player.researches[49] > 0,
  () => player.researches[49] > 0,
  // Reincarnation Upgrade 16-20
  () => player.researches[50] > 0,
  () => player.researches[50] > 0,
  () => player.researches[50] > 0,
  () => player.researches[50] > 0,
  () => player.researches[50] > 0,
  // Automation Upgrade 1-5
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  // Automation Upgrade 6-10
  () => player.unlocks.prestige,
  () => player.unlocks.prestige,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Automation Upgrade 11-15
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  // Automation Upgrade 16-20
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  () => player.unlocks.reincarnate,
  // Generation Upgrades 1-5
  () => player.unlocks.prestige,
  () => player.unlocks.generation,
  () => player.unlocks.generation,
  () => player.unlocks.generation,
  () => player.unlocks.generation,
  // Generation Upgrades 6-10
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Generation Upgrades 11-15
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Generation Upgrades 16-20
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  () => player.unlocks.transcend,
  // Coin Upgrades 21-25
  () => player.cubeUpgrades[19] > 0,
  () => player.cubeUpgrades[19] > 0,
  () => player.cubeUpgrades[19] > 0,
  () => player.cubeUpgrades[19] > 0,
  () => player.cubeUpgrades[19] > 0
]

// WHAT THE FUCK.
const upgradeeffects = (i: number): string => {
  const effect = upgradetexts[i - 1]?.()
  const type = typeof effect

  if (i >= 81 && i <= 119) {
    return i18next.t('upgrades.effects.81')
  } else if (effect == null) {
    return i18next.t(`upgrades.effects.${i}`)
  } else if (type === 'string' || type === 'number') {
    return i18next.t(`upgrades.effects.${i}`, { x: effect })
  } else {
    return i18next.t(`upgrades.effects.${i}`, effect as Exclude<typeof effect, string | number>)
  }
}

// TODO: How the fuck do you i18n this
export const upgradeDescriptionHTML = (i: number) => {
  // Hover-to-buy toggle.
  if (player.toggles[9]) {
    clickUpgrades(i, false)
  }

  let descriptionText = i18next.t(`upgrades.descriptions.${i}`)
  let descColor = 'white'
  if (player.upgrades[i]) { 
    descriptionText += ` ${i18next.t('upgrades.bought')}`
    descColor = 'gold'
  }

  const descHTML = `<span style="color:${descColor}">${descriptionText}</span>`

  let currency = ''
  let costColor = ''
  if ((i <= 20 && i >= 1) || (i <= 110 && i >= 106) || (i <= 125 && i >= 121)) {
    currency = 'Coins'
    costColor = 'yellow'
  }
  if ((i <= 40 && i >= 21) || (i <= 105 && i >= 101) || (i <= 115 && i >= 111) || (i <= 87 && i >= 81)) {
    currency = 'Diamonds'
    costColor = 'cyan'
  }
  if ((i <= 60 && i >= 41) || (i <= 120 && i >= 116) || (i <= 93 && i >= 88)) {
    currency = 'Mythos'
    costColor = 'plum'
  }
  if ((i <= 80 && i >= 61) || (i <= 100 && i >= 94)) {
    currency = 'Particles'
    costColor = 'limegreen'
  }

  const costText = `Cost: ${format(Decimal.pow(10, G.upgradeCosts[i]))} ${currency}`
  const costHTML = `<span style="color:${costColor}">${costText}</span>`
  const effectText = upgradeeffects(i)
  const effectHTML = `<span style="color:gold">${effectText}</span>`
  return `${descHTML}<br>${costHTML}<br>${effectHTML}`
}

export const updateMobileUpgradeDescription = (i: number) => {
  let currency = ''
  let costColor = ''
  if ((i <= 20 && i >= 1) || (i <= 110 && i >= 106) || (i <= 125 && i >= 121)) {
    currency = 'Coins'
    costColor = 'yellow'
  }
  if ((i <= 40 && i >= 21) || (i <= 105 && i >= 101) || (i <= 115 && i >= 111) || (i <= 87 && i >= 81)) {
    currency = 'Diamonds'
    costColor = 'cyan'
  }
  if ((i <= 60 && i >= 41) || (i <= 120 && i >= 116) || (i <= 93 && i >= 88)) {
    currency = 'Mythos'
    costColor = 'plum'
  }
  if ((i <= 80 && i >= 61) || (i <= 100 && i >= 94)) {
    currency = 'Particles'
    costColor = 'limegreen'
  }

  if (!player.upgrades[i]) {
    const costText = `Cost: ${format(Decimal.pow(10, G.upgradeCosts[i]))} ${currency}`
    DOMCacheGetOrSet(`upg${i}Cost`).innerHTML = `<span style="color:${costColor}">${costText}</span>`
  }
  else {
    const boughtText = i18next.t('upgrades.bought')
    DOMCacheGetOrSet(`upg${i}Cost`).innerHTML = `<span style="color: gold">${boughtText}</span>`
  }

  let descText = i18next.t(`upgrades.descriptions.${i}`)
  DOMCacheGetOrSet(`upg${i}Description`).innerHTML = descText

  const effectText = `<span style="color: gold">${upgradeeffects(i)}</span>`
  DOMCacheGetOrSet(`upg${i}Effect`).innerHTML = effectText

}

export const clickUpgrades = (i: number, auto: boolean) => {
  // Make sure the upgrade is locked
  if (
    player.upgrades[i] !== 0
    || (i <= 40 && i >= 21 && !player.unlocks.prestige)
    || (i <= 60 && i >= 41 && !player.unlocks.transcend)
    || (i <= 80 && i >= 61 && !player.unlocks.reincarnate)
    || (i <= 120 && i >= 81 && !player.unlocks.prestige)
    || DOMCacheGetOrSet(`upg${i}`).style.display === 'none'
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

export const buyUpgradeByCategory = (category: UpgradeCategories, auto: boolean) => {
  for (const id of categoryData[category].upgradeIds) {
    clickUpgrades(id, auto)
  }
}

export const buyAllUpgrades = (auto: boolean) => {
  for (let i = UpgradeCategories.Coin; i <= UpgradeCategories.Particle; i++) {
    buyUpgradeByCategory(i, auto)
  }
}

const crystalupgeffect: Record<number, () => Record<string, string>> = {
  1: () => ({
    x: format(
      Decimal.pow(1 + 0.01 * player.crystalUpgrades[0], achievementPoints),
      2,
      true
    )
  }),
  2: () => ({
    x: format(
      Decimal.pow(
        1 + player.crystalUpgrades[1] * Decimal.log(player.coins.add(1), 10) / 100,
        2 + Math.log2(player.crystalUpgrades[1] + 1)
      ),
      2,
      true
    )
  }),
  3: () => ({
    base: formatAsPercentIncrease(
      crystalUpgrade3Base(),
      2
    ),
    x: format(
      crystalUpgrade3CrystalMultiplier(),
      2,
      true
    )
  }),
  4: () => ({
    x: format(
      crystalUpgrade4MaxExponent() * (1 - Math.pow(0.995, player.crystalUpgrades[3])),
      2,
      true
    )
  }),
  5: () => ({
    x: format(
      Decimal.pow(
        1 + player.crystalUpgrades[4] / 20,
        player.challengecompletions[1] + player.challengecompletions[2] + player.challengecompletions[3]
          + player.challengecompletions[4] + player.challengecompletions[5]
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
  const c = player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0 ? 10 : 0

  const q = Decimal.pow(
    10,
    G.crystalUpgradesCost[i - 1] - getRuneEffects('prism', 'costDivisorLog10')
      + G.crystalUpgradeCostIncrement[i - 1] * Math.floor(Math.pow(player.crystalUpgrades[i - 1] + 0.5 - c, 2) / 2)
  )
  DOMCacheGetOrSet('crystalupgradedescription').innerHTML = returnCrystalUpgDesc(i)
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
    el.classList.add('green-background')
  } else {
    el.classList.remove('green-background')
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
        1.05 + +getAchievementReward('constUpgrade1Buff') + 0.001 * player.platonicUpgrades[18],
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
              100 + 1000 * +getAchievementReward('constUpgrade2Buff')
                + 10 * getShopUpgradeEffects('constantEX', 'maxPercentIncrease')
                + 3 * player.platonicUpgrades[18] + 1000 * (G.challenge15Rewards.exponent.value - 1),
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
    x: format(1 + 0.1 * player.constantUpgrades[5] * Decimal.log(player.ascendShards.add(1), 10), 2, true)
  }),
  6: () => ({
    x: format(Math.round(2000 * (1 - Math.pow(0.999, player.constantUpgrades[6]))), 0, true)
  }),
  7: () => ({
    x: format(7 * Math.min(1000, player.constantUpgrades[7]))
  }),
  8: () => ({
    x: format(1 + 1 / 10 * player.constantUpgrades[8], 2, true)
  }),
  9: () => ({
    x: format(
      1 + 0.01 * Decimal.log(player.talismanShards.add(1), 4) * Math.min(1, player.constantUpgrades[9]),
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
}

const upgradeUnlockConditions: { int: Interval; unlockHTMLClass: string }[] = [
  { int: [1, 5], unlockHTMLClass: '' },
  { int: [6, 10], unlockHTMLClass: 'prestigeunlock' },
  { int: [11, 15], unlockHTMLClass: 'generationunlock' },
  { int: [16, 20], unlockHTMLClass: 'transcendunlock' },
  { int: [21, 30], unlockHTMLClass: 'prestigeunlock' },
  { int: [31, 35], unlockHTMLClass: 'transcendunlock' },
  { int: [36, 37], unlockHTMLClass: 'reincarnationunlock' },
  { int: [38, 38], unlockHTMLClass: 'chal7' },
  { int: [39, 39], unlockHTMLClass: 'chal8' },
  { int: [40, 40], unlockHTMLClass: 'chal9' },
  { int: [41, 50], unlockHTMLClass: 'transcendunlock' },
  { int: [51, 60], unlockHTMLClass: 'reincarnationunlock' },
  { int: [61, 65], unlockHTMLClass: 'reinrow1' },
  { int: [66, 70], unlockHTMLClass: 'reinrow2' },
  { int: [71, 75], unlockHTMLClass: 'reinrow3' },
  { int: [76, 80], unlockHTMLClass: 'reinrow4' },
  { int: [81, 87], unlockHTMLClass: 'prestigeunlock' },
  { int: [88, 93], unlockHTMLClass: 'transcendunlock' },
  { int: [94, 100], unlockHTMLClass: 'reincarnationunlock' },
  { int: [101, 101], unlockHTMLClass: 'prestigeunlock' },
  { int: [102, 105], unlockHTMLClass: 'generationunlock' },
  { int: [106, 110], unlockHTMLClass: 'transcendunlock' },
  { int: [111, 115], unlockHTMLClass: 'transcendunlock' },
  { int: [116, 120], unlockHTMLClass: 'transcendunlock' },
  { int: [121, 125], unlockHTMLClass: 'cubeUpgrade19' }
]

// Convert upgradeunlockconditions into a map of upgradeID to unlockHTMLClass for easier access when creating the upgrade elements
const upgradeUnlockMap: Record<number, string> = Object.fromEntries(
  upgradeUnlockConditions.flatMap(({ int: [start, end], unlockHTMLClass }) =>
    Array.from({ length: end - start + 1 }, (_, i) => [start + i, unlockHTMLClass])
  )
)

let createdHTMLThisSession = false

const createUpgradeSectionIcon = (category: UpgradeCategories) => {
  const data = categoryData[category]

  const img = document.createElement('img')
  img.classList.add('currency-icon')
  img.setAttribute('aria-label', `${data.i18n} Upgrade Information`)
  img.src = `Pictures/Default/${data.mainIconName}.png`
  img.id = `upgrades${category}`
  img.loading = 'lazy'

  return img
}

const createUpgradeSectionText = (category: UpgradeCategories) => {
  const data = categoryData[category]
  const text = document.createElement('h3')
  text.id = data.ariaLabelledBy
  text.style.color = data.color
  text.textContent = i18next.t(`upgrades.shopTitles.${data.i18n}`)
  text.setAttribute('i18n', `upgrades.shopTitles.${data.i18n}`)

  return text
}

const createUpgradeSectionButtons = (category: UpgradeCategories) => {
  const data = categoryData[category]

  const buttonRow = document.createElement('div')
  buttonRow.classList.add('upgradeCategoryBtnRow')

  const buyAllBtn = document.createElement('button')
  buyAllBtn.classList.add('buyAllUpgradeButton')
  buyAllBtn.setAttribute('i18n-label', `Buy all affordable upgrades in ${data.i18n} section`)
  buyAllBtn.style.border = '2px solid green'
  buyAllBtn.textContent = i18next.t('upgrades.buyAll')

  buyAllBtn.addEventListener('click', () => buyUpgradeByCategory(category, false))
  buttonRow.appendChild(buyAllBtn)

  // Automator category doesn't have automation. Don't know why.
  if (category !== UpgradeCategories.Autobuyer) {
    const toggleAutoBtn = document.createElement('button')
    toggleAutoBtn.id = `${data.autoToggle}AutoUpgrade`
    toggleAutoBtn.classList.add('autobuyerToggleButton')
    toggleAutoBtn.ariaPressed = 'true'
    toggleAutoBtn.setAttribute('aria-label', `Toggle ${data.autoToggle} auto-upgrader`)
    toggleAutoBtn.style.border = '2px solid green'

    toggleAutoBtn.addEventListener('click', () => {
      toggleShops(data.autoToggle as upgradeAutos)
    })
    buttonRow.appendChild(toggleAutoBtn)
  }

  return buttonRow
}

const createWebUpgradesTable = (category: UpgradeCategories) => {
  const data = categoryData[category]
  const table = document.createElement('table')
  table.style.border = `2px solid ${data.color}`
  const numRows = Math.ceil(data.upgradeIds.length / 5)
  for (let row = 0; row < numRows; row++) {
    const rowElm = document.createElement('tr')
    for (let column = 0; column < 5; column++) {
      const orderedIndex = 5 * row + column
      const columnElm = document.createElement('td')
      const id = data.upgradeIds[orderedIndex]
      const btn = document.createElement('button')
      btn.classList.add('upgrade-button')
      if (upgradeUnlockMap[id] !== '') {
        btn.classList.add(upgradeUnlockMap[id])
      }
      btn.id = `upg${id}`
      btn.setAttribute('i18n-aria-label', i18next.t(`upgrades.descriptions.${id}`))
      btn.addEventListener('click', () => clickUpgrades(id, false))

      btn.addEventListener('mousemove', (e: MouseEvent) =>
            Modal(
              () => upgradeDescriptionHTML(id),
              e.clientX,
              e.clientY,
              { borderColor: 'gold' }
            ))
      btn.addEventListener('mouseout', CloseModal)

      const img = document.createElement('img')
      img.src = `Pictures/Default/${data.listIconName}${orderedIndex + 1}.png`

      btn.appendChild(img)
      columnElm.appendChild(btn)
      rowElm.appendChild(columnElm)
    }
    table.appendChild(rowElm)
  }

  return table
}

const createMobileUpgradesDiv = (category: UpgradeCategories) => {
  const data = categoryData[category]
  const div = document.createElement('div')

  // Contains 2 elements per row. Need to show all info.
  div.classList.add('mobileUpgradeTabContainer')
  div.style.border = `2px solid ${data.color}`

  let picIndex = 0
  data.upgradeIds.forEach((id) => {
    picIndex++
    const elm = document.createElement('div')
    elm.id = `upg${id}`
    elm.classList.add('mobileUpgradeBox')
    if (upgradeUnlockMap[id] !== '') {
      elm.classList.add(upgradeUnlockMap[id])
    }
    elm.setAttribute('i18n-aria-label', i18next.t(`upgrades.descriptions.${id}`))
    elm.addEventListener('click', () => {
      clickUpgrades(id, false)
      updateMobileUpgradeDescription(id)
    })

    // Need to insert icon, description, cost and effect info...
    const iconAndCostDiv = document.createElement('div')
    iconAndCostDiv.classList.add('mobileUpgradeIconAndCost')

    const img = document.createElement('img')
    img.src = `Pictures/Default/${data.listIconName}${picIndex}.png`
    iconAndCostDiv.appendChild(img)

    const costButton = document.createElement('button')
    costButton.id = `upg${id}Cost`

    costButton.addEventListener('click', () => {
      clickUpgrades(id, false)
      updateMobileUpgradeDescription(id)
    })

    iconAndCostDiv.appendChild(costButton)

    elm.appendChild(iconAndCostDiv)

    const descriptionP = document.createElement('p')
    descriptionP.id = `upg${id}Description`
    descriptionP.style.color = 'lightblue'

    elm.appendChild(descriptionP)
    
    const effectP = document.createElement('p')
    effectP.id = `upg${id}Effect`
    
    elm.appendChild(effectP)

    div.appendChild(elm)
  })

  return div
}

const createUpgradeSection = (category: UpgradeCategories) => {
  const data = categoryData[category]
  const section = document.createElement('section')
  section.setAttribute('aria-labelledby', categoryData[category].ariaLabelledBy)
  section.classList.add('shop-section')
  if (data.unlockHTMLClass !== '') {
    section.classList.add(data.unlockHTMLClass)
  }

  section.appendChild(createUpgradeSectionIcon(category))
  section.appendChild(createUpgradeSectionText(category))
  section.appendChild(createUpgradeSectionButtons(category))

  if (platform === 'mobile') {
    section.appendChild(createMobileUpgradesDiv(category))
  }
  else {
    section.appendChild(createWebUpgradesTable(category))
  }
  return section
}


export const generateUpgradesTab = () => {
  if (createdHTMLThisSession) {
    return
  }
  const flexTab = DOMCacheGetOrSet('upgradesFlex')
  for (let i = UpgradeCategories.Coin; i <= UpgradeCategories.Particle; i++) {
    flexTab.appendChild(createUpgradeSection(i))
  }
  createdHTMLThisSession = true
}
