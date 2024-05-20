// August 22, 2022: Creation of Exportable Statistics.

import ClipboardJS from 'clipboard'
import i18next from 'i18next'
import { totalachievementpoints } from './Achievements'
import {
  calculateAscensionAcceleration,
  calculateGoldenQuarkGain,
  calculateMaxRunes,
  calculateTimeAcceleration,
  calculateTotalOcteractCubeBonus,
  calculateTotalOcteractQuarkBonus,
  octeractGainPerSecond
} from './Calculate'
import { getMaxChallenges } from './Challenges'
import { version } from './Config'
import { saveFilename } from './ImportExport'
import { friendlyShopName, isShopUpgradeUnlocked, shopData, shopUpgradeTypes } from './Shop'
import { calculateEffectiveSingularities } from './singularity'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert } from './UpdateHTML'
import { formatS, sumContents } from './Utility'
import { Globals as G } from './Variables'

export const generateExportSummary = async (): Promise<void> => {
  const titleText = '===== SUMMARY STATS ====='
  const time = `Time Generated: ${(new Date()).toString()}`
  const ver = `Version: ${version}`

  const subCategoryDivisor = '-----+-----\n'

  const firstPlayed = `First Played: ${player.firstPlayed}\n`

  let resources = '===== RESOURCES =====\n'
  resources = resources
    + (player.reincarnationCount > 0 || player.highestSingularityCount > 0
      ? `Quarks: ${format(Number(player.worlds), 0, true)}\n`
      : '')
  resources = resources
    + (player.highestSingularityCount > 0 ? `Golden Quarks: ${format(player.goldenQuarks, 2, true)}\n` : '')
  resources = resources + subCategoryDivisor
  resources = `${resources}Coins: ${format(player.coins, 2, true)}\n`
  if (player.prestigeCount > 0 || player.highestSingularityCount > 0) {
    resources = `${resources}Diamonds: ${format(player.prestigePoints, 2, true)}\n`
    resources = `${resources}Crystals: ${format(player.prestigeShards, 2, true)}\n`
    resources = `${resources}Offerings: ${format(player.runeshards, 0, true)}\n`
  }
  if (player.transcendCount > 0 || player.highestSingularityCount > 0) {
    resources = `${resources}Mythos: ${format(player.transcendPoints, 2, true)}\n`
    resources = `${resources}Mythos Shards: ${format(player.transcendShards, 2, true)}\n`
  }
  if (player.reincarnationCount > 0 || player.highestSingularityCount > 0) {
    resources = `${resources}Particles: ${format(player.reincarnationPoints, 2, true)}\n`
    resources = `${resources}Atoms: ${format(player.reincarnationShards, 2, true)}\n`
    resources = `${resources}Obtainium: ${format(player.researchPoints, 0, true)}\n`
  }
  if (player.ascensionCount > 0 || player.highestSingularityCount > 0) {
    const cubeArray = [
      null,
      player.cubeBlessings.accelerator,
      player.cubeBlessings.multiplier,
      player.cubeBlessings.offering,
      player.cubeBlessings.runeExp,
      player.cubeBlessings.obtainium,
      player.cubeBlessings.antSpeed,
      player.cubeBlessings.antSacrifice,
      player.cubeBlessings.antELO,
      player.cubeBlessings.talismanBonus,
      player.cubeBlessings.globalSpeed
    ]
    const tesseractArray = [
      null,
      player.tesseractBlessings.accelerator,
      player.tesseractBlessings.multiplier,
      player.tesseractBlessings.offering,
      player.tesseractBlessings.runeExp,
      player.tesseractBlessings.obtainium,
      player.tesseractBlessings.antSpeed,
      player.tesseractBlessings.antSacrifice,
      player.tesseractBlessings.antELO,
      player.tesseractBlessings.talismanBonus,
      player.tesseractBlessings.globalSpeed
    ]
    const hypercubeArray = [
      null,
      player.hypercubeBlessings.accelerator,
      player.hypercubeBlessings.multiplier,
      player.hypercubeBlessings.offering,
      player.hypercubeBlessings.runeExp,
      player.hypercubeBlessings.obtainium,
      player.hypercubeBlessings.antSpeed,
      player.hypercubeBlessings.antSacrifice,
      player.hypercubeBlessings.antELO,
      player.hypercubeBlessings.talismanBonus,
      player.hypercubeBlessings.globalSpeed
    ]
    const platonicArray = [
      player.platonicBlessings.cubes,
      player.platonicBlessings.tesseracts,
      player.platonicBlessings.hypercubes,
      player.platonicBlessings.platonics,
      player.platonicBlessings.hypercubeBonus,
      player.platonicBlessings.taxes,
      player.platonicBlessings.scoreBonus,
      player.platonicBlessings.globalSpeed
    ]
    const cubeSum = format(sumContents(cubeArray.slice(1) as number[]), 0, true)
    const tesseractSum = format(sumContents(tesseractArray.slice(1) as number[]), 0, true)
    const hypercubeSum = format(sumContents(hypercubeArray.slice(1) as number[]), 0, true)
    const platonicSum = format(sumContents(platonicArray), 0, true)

    resources = resources + subCategoryDivisor
    resources = `${resources}Wow! Cubes: ${format(Number(player.wowCubes), 0, true)} -+- Total Tributes: ${cubeSum}\n`
    resources = `${resources}Wow! Tesseracts: ${
      format(Number(player.wowTesseracts), 0, true)
    } -+- Total Gifts: ${tesseractSum}\n`
    resources = `${resources}Wow! Hypercubes: ${
      format(Number(player.wowHypercubes), 0, true)
    } -+- Total Benedictions: ${hypercubeSum}\n`
    resources = `${resources}Wow! Platonic Cubes: ${
      format(Number(player.wowPlatonicCubes), 0, true)
    } -+- Total Plats Opened: ${platonicSum}\n`
    resources = `${resources}Wow! Hepteracts: ${format(player.wowAbyssals, 0, true)}\n`
    if (player.singularityUpgrades.octeractUnlock.getEffect().bonus) {
      resources = `${resources}Wow! Octeracts: ${format(player.wowOcteracts, 0, true)}\n`
    }
  }

  // Octeract Subportion!
  let octeract = ''
  if (player.singularityUpgrades.octeractUnlock.getEffect().bonus) {
    octeract = '===== OCTERACTS =====\n'
    octeract = `${octeract}Current Octeracts: ${format(player.wowOcteracts, 2, true)}\n`
    octeract = `${octeract}Current Per Second: ${format(octeractGainPerSecond(), 2, true)}\n`
    octeract = `${octeract}Total Generated Octeracts: ${format(player.totalWowOcteracts, 2, true)}\n`
    octeract = `${octeract}Octeract Cube Bonus: ${format(100 * (calculateTotalOcteractCubeBonus() - 1), 2, true)}%\n`
    octeract = `${octeract}Octeract Quark Bonus: ${format(100 * (calculateTotalOcteractQuarkBonus() - 1), 2, true)}%\n`
  }

  // Singularity Subportion!
  let singularity = ''
  if (player.highestSingularityCount > 0) {
    singularity = '===== SINGULARITY =====\n'
    singularity = `${singularity}Current Singularity: ${player.singularityCount}\n`
    singularity = `${singularity}Highest Singularity Reached: ${player.highestSingularityCount}\n`
    singularity = `${singularity}Golden Quarks: ${format(player.goldenQuarks, 2, true)}\n`
    singularity = `${singularity}+Golden Quarks on Singularity: ${format(calculateGoldenQuarkGain(), 2, true)}\n`
    singularity = `${singularity}Time in Singularity: ${formatS(player.singularityCounter)}\n`
    singularity = `${singularity}Effective Singularity [for penalties]: ${
      format(calculateEffectiveSingularities(), 2, true)
    }\n`
    singularity = `${singularity}Antiquity of Ant God Upgraded: ${(player.runelevels[6] > 0) ? '✔' : '✖'}\n`
  }

  // Ascension Subportion!
  let ascension = ''
  if (player.ascensionCount > 0 || player.highestSingularityCount > 0) {
    ascension = '===== ASCENSION ===== \n'
    ascension = `${ascension}Ascension Count: ${format(player.ascensionCount, 0, true)}\n`
    ascension = `${ascension}Ascension Timer: ${formatS(player.ascensionCounter)}\n`
    ascension = `${ascension}Real Life Ascension Timer: ${formatS(player.ascensionCounterReal)}\n`
    ascension = `${ascension}Truly Real Life Ascension Timer: ${formatS(player.ascensionCounterRealReal)}\n`
    ascension = `${ascension}Ascension Speed Multiplier: ${format(calculateAscensionAcceleration(), 2, true)}\n`
    ascension = `${ascension}Challenge 11 Completions: ${player.challengecompletions[11]}/${getMaxChallenges(11)}\n`
    ascension = `${ascension}Challenge 12 Completions: ${player.challengecompletions[12]}/${getMaxChallenges(12)}\n`
    ascension = `${ascension}Challenge 13 Completions: ${player.challengecompletions[13]}/${getMaxChallenges(13)}\n`
    ascension = `${ascension}Challenge 14 Completions: ${player.challengecompletions[14]}/${getMaxChallenges(14)}\n`
    if (player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0) {
      ascension = `${ascension}Challenge 15 Exponent: ${format(player.challenge15Exponent, 2, true)}\n`
      ascension = `${ascension}Research [8x25] MAXED: ${(player.researches[200] === 1e5) ? '✔' : '✖'}\n`
      ascension = `${ascension}Cube [w5x10] MAXED: ${(player.cubeUpgrades[50] === 1e5) ? '✔' : '✖'}\n`
      ascension = `${ascension}Platonic α: ${player.platonicUpgrades[5] > 0 ? '✔' : '✖'}\n`
      ascension = `${ascension}Platonic β: ${player.platonicUpgrades[10] > 0 ? '✔' : '✖'}\n`
      ascension = `${ascension}Platonic Ω: ${player.platonicUpgrades[15] > 0 ? '✔' : '✖'}\n`
    }
    if (player.challenge15Exponent >= 1e15 || player.highestSingularityCount > 0) {
      ascension = `${ascension}----- HEPTERACTS -----\n`
      ascension = `${ascension}Chronos Hepteract: ${format(player.hepteractCrafts.chronos.BAL, 0, true)}/${
        format(player.hepteractCrafts.chronos.CAP, 0, true)
      }\n`
      ascension = `${ascension}Hyperreal Hepteract: ${format(player.hepteractCrafts.hyperrealism.BAL, 0, true)}/${
        format(player.hepteractCrafts.hyperrealism.CAP, 0, true)
      }\n`
      ascension = `${ascension}Quark Hepteract: ${format(player.hepteractCrafts.quark.BAL, 0, true)}/${
        format(player.hepteractCrafts.quark.CAP, 0, true)
      }\n`
      ascension = `${ascension}Challenge Hepteract: ${format(player.hepteractCrafts.challenge.BAL, 0, true)}/${
        format(player.hepteractCrafts.challenge.CAP, 0, true)
      }\n`
      ascension = `${ascension}Abyss Hepteract: ${format(player.hepteractCrafts.abyss.BAL, 0, true)}/${
        format(player.hepteractCrafts.abyss.CAP, 0, true)
      }\n`
      ascension = `${ascension}Accelerators Hepteract: ${format(player.hepteractCrafts.accelerator.BAL, 0, true)}/${
        format(player.hepteractCrafts.accelerator.CAP, 0, true)
      }\n`
      ascension = `${ascension}Accelerator Boosts Hepteract: ${
        format(player.hepteractCrafts.acceleratorBoost.BAL, 0, true)
      }/${format(player.hepteractCrafts.acceleratorBoost.CAP, 0, true)}\n`
      ascension = `${ascension}Multipliers Hepteract: ${format(player.hepteractCrafts.multiplier.BAL, 0, true)}/${
        format(player.hepteractCrafts.multiplier.CAP, 0, true)
      }\n`
      ascension = `${ascension}----- POWDER & ORBS -----\n`
      ascension = `${ascension}Orbs: ${format(player.overfluxOrbs, 0, true)}\n`
      ascension = `${ascension}Powder: ${format(player.overfluxPowder, 2, true)}\n`
    }
  }

  // Reincarnation Portion!
  let reincarnation = ''
  if (player.reincarnationCount > 0 || player.highestSingularityCount > 0) {
    reincarnation = '===== REINCARNATION =====\n'
    reincarnation = `${reincarnation}Reincarnation Count: ${format(player.reincarnationCount, 0, true)}\n`
    reincarnation = `${reincarnation}Reincarnation Timer: ${formatS(player.reincarnationcounter)}\n`
    reincarnation = `${reincarnation}Fastest Reincarnation: ${formatS(player.fastestreincarnate)}\n`
    reincarnation = `${reincarnation}Global Speed Multiplier: ${format(calculateTimeAcceleration().mult, 2, true)}\n`
    reincarnation = `${reincarnation}Challenge 6 Completions: ${player.highestchallengecompletions[6]}/${
      getMaxChallenges(6)
    }\n`
    reincarnation = `${reincarnation}Challenge 7 Completions: ${player.highestchallengecompletions[7]}/${
      getMaxChallenges(7)
    }\n`
    reincarnation = `${reincarnation}Challenge 8 Completions: ${player.highestchallengecompletions[8]}/${
      getMaxChallenges(8)
    }\n`
    reincarnation = `${reincarnation}Challenge 9 Completions: ${player.highestchallengecompletions[9]}/${
      getMaxChallenges(9)
    }\n`
    reincarnation = `${reincarnation}Challenge 10 Completions: ${player.highestchallengecompletions[10]}/${
      getMaxChallenges(10)
    }\n`
  }

  // Transcension Portion!
  let transcension = ''
  if (player.transcendCount > 0 || player.highestSingularityCount > 0) {
    transcension = '===== TRANSCENSION =====\n'
    transcension = `${transcension}Transcension Count: ${format(player.transcendCount, 0, true)}\n`
    transcension = `${transcension}Transcension Timer: ${formatS(player.transcendcounter)}\n`
    transcension = `${transcension}Fastest Transcension: ${formatS(player.fastesttranscend)}\n`
    transcension = `${transcension}Challenge 1 Completions: ${player.highestchallengecompletions[1]}/${
      getMaxChallenges(1)
    }\n`
    transcension = `${transcension}Challenge 2 Completions: ${player.highestchallengecompletions[2]}/${
      getMaxChallenges(2)
    }\n`
    transcension = `${transcension}Challenge 3 Completions: ${player.highestchallengecompletions[3]}/${
      getMaxChallenges(3)
    }\n`
    transcension = `${transcension}Challenge 4 Completions: ${player.highestchallengecompletions[4]}/${
      getMaxChallenges(4)
    }\n`
    transcension = `${transcension}Challenge 5 Completions: ${player.highestchallengecompletions[5]}/${
      getMaxChallenges(5)
    }\n`
  }

  // Prestige Portion!
  let prestige = ''
  if (player.prestigeCount > 0 || player.highestSingularityCount > 0) {
    prestige = '===== PRESTIGE & RUNES =====\n'
    prestige = `${prestige}Prestige Count: ${format(player.prestigeCount, 0, true)}\n`
    prestige = `${prestige}Prestige Timer: ${formatS(player.prestigecounter)}\n`
    prestige = `${prestige}Fastest Prestige: ${formatS(player.fastestprestige)}\n`
    prestige = `${
      prestige + i18next.t('achievements.totalPoints', {
        x: format(player.achievementPoints),
        y: format(totalachievementpoints),
        z: (100 * player.achievementPoints / totalachievementpoints).toPrecision(4)
      })
    }\n`
    prestige = `${prestige}Speed Rune: Level ${format(player.runelevels[0], 0, true)}/${
      format(calculateMaxRunes(1))
    } [Bonus: ${format(G.rune1level - player.runelevels[0], 0, true)}]\n`
    if (player.achievements[38] > 0 || player.highestSingularityCount > 0) {
      prestige = `${prestige}Duplication Rune: Level ${format(player.runelevels[1], 0, true)}/${
        format(calculateMaxRunes(2))
      } [Bonus: ${format(G.rune2level - player.runelevels[1], 0, true)}]\n`
    }
    if (player.achievements[44] > 0 || player.highestSingularityCount > 0) {
      prestige = `${prestige}Prism Rune: Level ${format(player.runelevels[2], 0, true)}/${
        format(calculateMaxRunes(3))
      } [Bonus: ${format(G.rune3level - player.runelevels[2], 0, true)}]\n`
    }
    if (player.achievements[102] > 0 || player.highestSingularityCount > 0) {
      prestige = `${prestige}Thrift Rune: Level ${format(player.runelevels[3], 0, true)}/${
        format(calculateMaxRunes(4))
      } [Bonus: ${format(G.rune4level - player.runelevels[3], 0, true)}]\n`
    }
    if (player.researches[82] > 0 || player.highestSingularityCount > 0) {
      prestige = `${prestige}Superior Intellect: Level ${format(player.runelevels[4], 0, true)}/${
        format(calculateMaxRunes(5))
      } [Bonus: ${format(G.rune5level - player.runelevels[4], 0, true)}]\n`
    }
    if (player.shopUpgrades.infiniteAscent > 0 || player.highestSingularityCount > 0) {
      prestige = `${prestige}Infinite Ascent: Level ${format(player.runelevels[5], 0, true)}/${
        format(calculateMaxRunes(6))
      }\n`
    }
    if (player.platonicUpgrades[20] > 0 || player.highestSingularityCount > 0) {
      prestige = `${prestige}Antiquities: Level ${format(player.runelevels[6], 0, true)}/${
        format(calculateMaxRunes(7))
      }\n`
    }
  }

  // Create Shop Stuffs
  let shopUpgradeStats = '\n'
  if (player.reincarnationCount > 0 || player.highestSingularityCount > 0) {
    shopUpgradeStats =
      '===== SHOP UPGRADES =====\n - [★]: Upgrade is MAXED - \n - [✔]: Upgrade is unlocked - \n - [✖]: Upgrade is locked - \n'
    const shopUpgrade = Object.keys(player.shopUpgrades) as (keyof Player['shopUpgrades'])[]
    let totalShopUpgradeCount = 0
    let totalShopUpgradeUnlocked = 0
    let totalShopUpgradeMax = 0
    let totalQuarksSpent = 0

    for (const key of shopUpgrade) {
      const shopUpg = player.shopUpgrades[key]
      let upgradeText = ''

      if (shopData[key].type !== shopUpgradeTypes.CONSUMABLE) {
        totalShopUpgradeCount += 1
        if (isShopUpgradeUnlocked(key)) {
          totalShopUpgradeUnlocked += 1
        }
        if (shopUpg === shopData[key].maxLevel) {
          totalShopUpgradeMax += 1
        }
      }

      totalQuarksSpent += shopData[key].price * shopUpg
        + shopData[key].priceIncrease * shopUpg * (shopUpg - 1) / 2

      upgradeText = upgradeText + (isShopUpgradeUnlocked(key)
        ? (shopUpg === shopData[key].maxLevel ? '[★]' : '[✔]')
        : '[✖]')

      upgradeText = `${upgradeText} ${friendlyShopName(key)}:`
      upgradeText = `${upgradeText} ${
        (shopData[key].type !== shopUpgradeTypes.CONSUMABLE)
          ? `Level ${shopUpg}/${shopData[key].maxLevel}`
          : `${shopUpg}/${shopData[key].maxLevel}`
      }`

      upgradeText = `${upgradeText}\n`
      shopUpgradeStats = shopUpgradeStats + upgradeText
    }
    shopUpgradeStats = shopUpgradeStats + subCategoryDivisor
    shopUpgradeStats = `${shopUpgradeStats}Upgrades Unlocked: ${totalShopUpgradeUnlocked}/${totalShopUpgradeCount}\n`
    shopUpgradeStats = `${shopUpgradeStats}Upgrades MAXED ${totalShopUpgradeMax}/${totalShopUpgradeCount}\n`
    shopUpgradeStats = `${shopUpgradeStats}Quarks Spent in Shop: ${format(totalQuarksSpent, 0, true)}\n`
    shopUpgradeStats = shopUpgradeStats + subCategoryDivisor
  }

  // Create Singularity Stuffs
  let singularityUpgradeStats = '\n'
  if (player.highestSingularityCount > 0) {
    singularityUpgradeStats =
      '===== SINGULARITY UPGRADES =====\n - [★]: Upgrade is MAXED - \n - [∞]: Upgrade is infinite - \n - [✔]: Upgrade is unlocked - \n - [✖]: Upgrade is locked - \n'
    const singUpgrade = Object.keys(player.singularityUpgrades) as (keyof Player['singularityUpgrades'])[]
    let totalSingUpgradeCount = -1 // One upgrade cannot ever be leveled, by design, so subtract that from the actual count
    let totalSingInfiniteLevel = 0
    let totalSingUpgradeUnlocked = 0
    let totalSingUpgradeMax = 0
    let totalGoldenQuarksSpent = 0
    for (const key of singUpgrade) {
      let upgradeText = ''
      const singUpg = player.singularityUpgrades[key]

      totalSingUpgradeCount += 1
      if (singUpg.maxLevel === -1) {
        totalSingInfiniteLevel += 1
      }
      if (singUpg.level === singUpg.maxLevel) {
        totalSingUpgradeMax += 1
      }
      if (player.singularityCount >= singUpg.minimumSingularity) {
        totalSingUpgradeUnlocked += 1
      }

      totalGoldenQuarksSpent += singUpg.goldenQuarksInvested

      let unicodeSymbol = '[✖]'
      if (player.singularityCount >= singUpg.minimumSingularity) {
        if (singUpg.maxLevel === -1) {
          unicodeSymbol = '[∞]'
        } else if (singUpg.level === singUpg.maxLevel) {
          unicodeSymbol = '[★]'
        } else {
          unicodeSymbol = '[✔]'
        }
      }

      upgradeText = upgradeText + unicodeSymbol
      upgradeText = `${upgradeText} ${singUpg.name}:`
      upgradeText = upgradeText + (singUpg.maxLevel === -1
        ? ` Level ${singUpg.level}`
        : ` Level ${singUpg.level}/${singUpg.maxLevel}`)
      upgradeText = upgradeText + (singUpg.freeLevels > 0
        ? ` [+${format(singUpg.computeFreeLevelSoftcap(), 2, true)}]`
        : '')

      upgradeText = upgradeText + (singUpg.freeLevels > 0
        ? ` =+= Effective Level: ${format(singUpg.actualTotalLevels(), 2, true)}`
        : '')

      upgradeText = `${upgradeText}\n`
      singularityUpgradeStats = singularityUpgradeStats + upgradeText
    }
    singularityUpgradeStats = singularityUpgradeStats + subCategoryDivisor
    singularityUpgradeStats =
      `${singularityUpgradeStats}Upgrades Unlocked: ${totalSingUpgradeUnlocked}/${totalSingUpgradeCount}\n`
    singularityUpgradeStats = `${singularityUpgradeStats}Upgrades MAXED: ${totalSingUpgradeMax}/${
      totalSingUpgradeCount - totalSingInfiniteLevel
    }\n`
    singularityUpgradeStats = `${singularityUpgradeStats}Golden Quarks Spent on Upgrades: ${
      format(totalGoldenQuarksSpent, 0, true)
    }\n`
    singularityUpgradeStats = singularityUpgradeStats + subCategoryDivisor
  }

  // Create Octeract Stuff
  let octeractUpgradeStats = '\n'
  if (player.singularityUpgrades.octeractUnlock.getEffect().bonus) {
    octeractUpgradeStats =
      '===== OCTERACT UPGRADES =====\n - [★]: Upgrade is MAXED - \n - [∞]: Upgrade is infinite - \n - [ ]: Upgrade INCOMPLETE - \n'
    const octUpgrade = Object.keys(player.octeractUpgrades) as (keyof Player['octeractUpgrades'])[]
    let totalOctUpgradeCount = 0
    let totalOctUpgradeMax = 0
    let totalOcteractsSpent = 0

    for (const key of octUpgrade) {
      let upgradeText = ''
      const octUpg = player.octeractUpgrades[key]

      if (octUpg.maxLevel !== -1) {
        totalOctUpgradeCount += 1
      }
      if (octUpg.level === octUpg.maxLevel) {
        totalOctUpgradeMax += 1
      }
      totalOcteractsSpent += octUpg.octeractsInvested

      let unicodeSymbol = '[ ]'
      if (octUpg.maxLevel === -1) {
        unicodeSymbol = '[∞]'
      } else if (octUpg.level === octUpg.maxLevel) {
        unicodeSymbol = '[★]'
      }

      upgradeText = upgradeText + unicodeSymbol
      upgradeText = `${upgradeText + octUpg.name}:`
      upgradeText = upgradeText + (octUpg.maxLevel === -1
        ? ` Level ${octUpg.level}`
        : ` Level ${octUpg.level}/${octUpg.maxLevel}`)
      upgradeText = upgradeText + (octUpg.freeLevels > 0
        ? ` [+${format(octUpg.computeFreeLevelSoftcap(), 2, true)}]`
        : '')

      upgradeText = upgradeText + (octUpg.freeLevels > 0
        ? ` =+= Effective Level: ${format(octUpg.actualTotalLevels(), 2, true)}`
        : '')

      upgradeText = `${upgradeText}\n`
      octeractUpgradeStats = octeractUpgradeStats + upgradeText
    }
    octeractUpgradeStats = octeractUpgradeStats + subCategoryDivisor
    octeractUpgradeStats = `${octeractUpgradeStats}Upgrades MAXED: ${totalOctUpgradeMax}/${totalOctUpgradeCount}\n`
    octeractUpgradeStats = `${octeractUpgradeStats}Octeracts Spent on Upgrades: ${
      format(totalOcteractsSpent, 0, true)
    }\n`
    octeractUpgradeStats = octeractUpgradeStats + subCategoryDivisor
  }

  const returnString =
    `${titleText}\n${time}\n${ver}\n${firstPlayed}${resources}${octeract}${singularity}${ascension}${reincarnation}${transcension}${prestige}${shopUpgradeStats}${singularityUpgradeStats}${octeractUpgradeStats}`

  try {
    await navigator.clipboard.writeText(returnString)
  } catch (err) {
    // So we fallback to the deprecated way of doing it,
    // which isn't limited by any browser other than Safari
    // because Apple is ran by a monkey in a human skin suit.

    // Old/bad browsers (legacy Edge, Safari because of limitations)
    const textArea = document.createElement('textarea')

    textArea.setAttribute('style', 'top: 0; left: 0; position: fixed;')
    textArea.setAttribute('data-clipboard-text', returnString)

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const clipboard = new ClipboardJS(textArea)

    const cleanup = () => {
      clipboard.destroy()
      document.body.removeChild(textArea)
    }

    clipboard.on('success', () => {
      document.getElementById('exportinfo')!.textContent = 'Copied save to clipboard!'
      cleanup()
    })

    clipboard.on('error', () => {
      void Alert('Unable to write the save to clipboard.').finally(cleanup)
    })
  }

  const a = document.createElement('a')
  a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(returnString)}`)
  a.setAttribute('download', `Statistics-${saveFilename()}`)
  a.setAttribute('id', 'downloadSave')
  // "Starting in Firefox 75, the click() function works even when the element is not attached to a DOM tree."
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
  // so let's have it work on older versions of Firefox, doesn't change functionality.
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  return Alert(
    'Summary Stats saved to clipboard! We also gave you a file, for easy sharing, if that is available on your browser.'
  )
}
