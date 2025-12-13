import Decimal from 'break_infinity.js'
import { type AmbrosiaUpgradeNames, ambrosiaUpgrades } from '../BlueberryUpgrades'
import { CorruptionLoadout, type Corruptions, CorruptionSaves } from '../Corruptions'
import { AntProducers } from '../Features/Ants/structs/structs'
import { NUM_SACRIFICE_MODES } from '../Features/Ants/toggles/structs/sacrifice'
import { type HepteractKeys, hepteracts } from '../Hepteracts'
import { type OcteractDataKeys, octeractUpgrades } from '../Octeracts'
import { goldenQuarkUpgrades, type SingularityDataKeys } from '../singularity'
import { updateResourcePredefinedLevel } from '../Talismans'
import { convertArrayToCorruption } from './PlayerJsonSchema'
import { playerSchema } from './PlayerSchema'

export const playerUpdateVarSchema = playerSchema.transform((player) => {
  if (player.usedCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.usedCorruptions)
    player.corruptions.used = new CorruptionLoadout(corrLoadout)
  }

  if (player.prototypeCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.prototypeCorruptions)
    player.corruptions.next = new CorruptionLoadout(corrLoadout)
  }

  if (player.corruptionShowStats !== undefined) {
    player.corruptions.showStats = player.corruptionShowStats
  }

  if (player.corruptionLoadouts !== undefined && player.corruptionLoadoutNames !== undefined) {
    const corruptionSaveStuff = player.corruptionLoadoutNames.reduce(
      (map, key, index) => {
        if (player.corruptionLoadouts?.[index + 1]) {
          map[key] = convertArrayToCorruption(player.corruptionLoadouts[index + 1] ?? Array(100).fill(0))
        }
        return map
      },
      {} as Record<string, Corruptions>
    )

    player.corruptions.saves = new CorruptionSaves(corruptionSaveStuff)
  }

  if (player.ultimatePixels !== undefined || player.cubeUpgradeRedBarFilled !== undefined) {
    // One-time conversion for red bar filled and ultimate pixels (to a lesser degree)

    const redBarFilled = player.cubeUpgradeRedBarFilled ?? 0
    const ultimatePixels = player.ultimatePixels ?? 0

    player.redAmbrosia += Math.floor(ultimatePixels * 0.2 + redBarFilled)
    player.lifetimeRedAmbrosia += Math.floor(ultimatePixels * 0.2 + redBarFilled)
  }

  if (player.talismanLevels !== undefined) {
    updateResourcePredefinedLevel(player.talismanLevels[0], 'exemption')
    updateResourcePredefinedLevel(player.talismanLevels[1], 'chronos')
    updateResourcePredefinedLevel(player.talismanLevels[2], 'midas')
    updateResourcePredefinedLevel(player.talismanLevels[3], 'metaphysics')
    updateResourcePredefinedLevel(player.talismanLevels[4], 'polymath')
    updateResourcePredefinedLevel(player.talismanLevels[5], 'mortuus')
    updateResourcePredefinedLevel(player.talismanLevels[6], 'plastic')
  }

  if (player.runeexp !== undefined) {
    player.runes.speed = new Decimal(player.runeexp[0] ?? 0)
    player.runes.duplication = new Decimal(player.runeexp[1] ?? 0)
    player.runes.prism = new Decimal(player.runeexp[2] ?? 0)
    player.runes.thrift = new Decimal(player.runeexp[3] ?? 0)
    player.runes.superiorIntellect = new Decimal(player.runeexp[4] ?? 0)
    player.runes.infiniteAscent = new Decimal(player.runeexp[5] ?? 0)
    player.runes.antiquities = new Decimal(player.runeexp[6] ?? 0)

    // Retroactively reward players with unlocks, because I don't have a better place here
    player.unlocks.anthill = player.achievements[127] === 1 || (player.highestchallengecompletions[8] ?? 0) > 0
    player.unlocks.talismans = player.achievements[134] === 1 || (player.highestchallengecompletions[9] ?? 0) > 0
    player.unlocks.blessings = player.achievements[134] === 1 || (player.highestchallengecompletions[9] ?? 0) > 0
    player.unlocks.ascensions = player.achievements[141] === 1 || (player.highestchallengecompletions[10] ?? 0) > 0
    player.unlocks.tesseracts = player.achievements[197] === 1 || (player.highestchallengecompletions[11] ?? 0) > 0
    player.unlocks.spirits = player.achievements[204] === 1 || (player.highestchallengecompletions[12] ?? 0) > 0
    player.unlocks.hypercubes = player.achievements[211] === 1 || (player.highestchallengecompletions[13] ?? 0) > 0
    player.unlocks.platonics = player.achievements[218] === 1 || (player.highestchallengecompletions[14] ?? 0) > 0
    player.unlocks.hepteracts = player.challenge15Exponent >= 1e15
  }

  if (player.runeshards !== undefined) {
    player.offerings = new Decimal(player.runeshards)
  }

  if (player.maxofferings !== undefined) {
    player.maxOfferings = new Decimal(player.maxofferings)
  }

  if (player.researchPoints !== undefined) {
    player.obtainium = new Decimal(player.researchPoints)
  }

  if (player.maxobtainium !== undefined) {
    player.maxObtainium = new Decimal(player.maxobtainium)
  }

  if (player.runeBlessingLevels !== undefined) {
    player.runeBlessings.speed = new Decimal(Math.pow(Math.min(1e140, player.runeBlessingLevels[1] ?? 0), 2) * 1e8 / 2)
    player.runeBlessings.duplication = new Decimal(
      Math.pow(Math.min(1e140, player.runeBlessingLevels[2] ?? 0), 2) * 1e8 / 2
    )
    player.runeBlessings.prism = new Decimal(Math.pow(Math.min(1e140, player.runeBlessingLevels[3] ?? 0), 2) * 1e8 / 2)
    player.runeBlessings.thrift = new Decimal(Math.pow(Math.min(1e140, player.runeBlessingLevels[4] ?? 0), 2) * 1e8 / 2)
    player.runeBlessings.superiorIntellect = new Decimal(
      Math.pow(Math.min(1e140, player.runeBlessingLevels[5] ?? 0), 2) * 1e8 / 2
    )
  }

  if (player.runeSpiritLevels !== undefined) {
    player.runeSpirits.speed = new Decimal(Math.pow(Math.min(1e140, player.runeSpiritLevels[1] ?? 0), 2) * 1e20 / 2)
    player.runeSpirits.duplication = new Decimal(
      Math.pow(Math.min(1e140, player.runeSpiritLevels[2] ?? 0), 2) * 1e20 / 2
    )
    player.runeSpirits.prism = new Decimal(Math.pow(Math.min(1e140, player.runeSpiritLevels[3] ?? 0), 2) * 1e20 / 2)
    player.runeSpirits.thrift = new Decimal(Math.pow(Math.min(1e140, player.runeSpiritLevels[4] ?? 0), 2) * 1e20 / 2)
    player.runeSpirits.superiorIntellect = new Decimal(
      Math.pow(Math.min(1e140, player.runeSpiritLevels[5] ?? 0), 2) * 1e20 / 2
    )
  }

  if (player.hepteractCrafts !== undefined) {
    for (const [key, value] of Object.entries(player.hepteractCrafts)) {
      const k = key as HepteractKeys
      if (value !== undefined) {
        const BAL = value.BAL ?? 0
        const TIMES_CAP_EXTENDED = Math.round(Math.log2(value.CAP / value.BASE_CAP)) ?? 0
        const AUTO = value.AUTO ?? false

        player.hepteracts[k] = { BAL, TIMES_CAP_EXTENDED, AUTO }
        hepteracts[k].BAL = BAL
        hepteracts[k].TIMES_CAP_EXTENDED = TIMES_CAP_EXTENDED
        hepteracts[k].AUTO = AUTO
      }
    }
  }

  if (player.singularityUpgrades !== undefined) {
    for (const key of Object.keys(player.singularityUpgrades)) {
      // This is shit - the old SingularityUpgrades object had this upgrade that didn't do anything
      if (key === 'WIP') {
        continue
      }

      const k = key as SingularityDataKeys

      const level = player.singularityUpgrades[k].level ?? 0
      const freeLevel = player.singularityUpgrades[k].freeLevels ?? 0
      const goldenQuarksInvested = player.singularityUpgrades[k].goldenQuarksInvested ?? 0

      player.goldenQuarkUpgrades[k] = {
        level,
        freeLevel,
        goldenQuarksInvested
      }
      goldenQuarkUpgrades[k].level = level
      goldenQuarkUpgrades[k].freeLevel = freeLevel
      goldenQuarkUpgrades[k].goldenQuarksInvested = goldenQuarksInvested
    }
  }

  if (player.octeractUpgrades !== undefined) {
    for (const key of Object.keys(player.octeractUpgrades)) {
      const k = key as OcteractDataKeys

      const level = player.octeractUpgrades[k].level ?? 0
      const freeLevel = player.octeractUpgrades[k].freeLevels ?? 0
      const octeractsInvested = player.octeractUpgrades[k].octeractsInvested ?? 0

      player.octUpgrades[k] = {
        level,
        freeLevel,
        octeractsInvested
      }
      octeractUpgrades[k].level = level
      octeractUpgrades[k].freeLevel = level
      octeractUpgrades[k].octeractsInvested = octeractsInvested
    }
  }

  if (player.blueberryUpgrades !== undefined) {
    for (const key of Object.keys(player.blueberryUpgrades)) {
      const k = key as AmbrosiaUpgradeNames

      const ambrosiaInvested = player.blueberryUpgrades[k].ambrosiaInvested ?? 0
      const blueberriesInvested = player.blueberryUpgrades[k].blueberriesInvested ?? 0

      player.ambrosiaUpgrades[k] = {
        ambrosiaInvested,
        blueberriesInvested
      }
      ambrosiaUpgrades[k].ambrosiaInvested = ambrosiaInvested
      ambrosiaUpgrades[k].blueberriesInvested = blueberriesInvested
    }
  }

  // In the ants rewrite, we assume that anything above 1e1000 crumbs can be 'chopped off'
  // For balancing purposes
  if (player.antPoints !== undefined) {
    player.ants.producers[AntProducers.Workers] = {
      purchased: Math.min(2000, player.firstOwnedAnts ?? 0),
      generated: Decimal.min(new Decimal(1e200), player.firstGeneratedAnts ?? new Decimal(0))
    }

    player.ants.producers[AntProducers.Breeders] = {
      purchased: Math.min(1000, player.secondOwnedAnts ?? 0),
      generated: Decimal.min(new Decimal(1e200), player.secondGeneratedAnts ?? new Decimal(0))
    }

    player.ants.producers[AntProducers.MetaBreeders] = {
      purchased: Math.min(500, player.thirdOwnedAnts ?? 0),
      generated: Decimal.min(new Decimal(1e200), player.thirdGeneratedAnts ?? new Decimal(0))
    }

    player.ants.producers[AntProducers.MegaBreeders] = {
      purchased: Math.min(250, player.fourthOwnedAnts ?? 0),
      generated: Decimal.min(new Decimal(1e200), player.fourthGeneratedAnts ?? new Decimal(0))
    }

    player.ants.producers[AntProducers.Queens] = {
      purchased: Math.min(87, player.fifthOwnedAnts ?? 0),
      generated: Decimal.min(new Decimal(10), player.fifthGeneratedAnts ?? new Decimal(0))
    }

    player.ants.producers[AntProducers.LordRoyals] = {
      purchased: Math.min(1, player.sixthOwnedAnts ?? 0),
      generated: new Decimal(0)
    }

    // The rest cost more than 1e1000 crumbs, so we can ignore

    if (player.antUpgrades !== undefined) {
      player.ants.upgrades[0] = Math.min(1000, player.antUpgrades[0] ?? 0)
      player.ants.upgrades[1] = Math.min(1000, player.antUpgrades[1] ?? 0)
      player.ants.upgrades[2] = Math.min(1000, player.antUpgrades[2] ?? 0)
      player.ants.upgrades[3] = Math.min(1000, player.antUpgrades[3] ?? 0)
      player.ants.upgrades[4] = Math.min(500, player.antUpgrades[4] ?? 0)
      player.ants.upgrades[5] = Math.min(500, player.antUpgrades[5] ?? 0)
      player.ants.upgrades[6] = Math.min(500, player.antUpgrades[6] ?? 0)
      player.ants.upgrades[7] = Math.min(500, player.antUpgrades[7] ?? 0)
      player.ants.upgrades[8] = Math.min(333, player.antUpgrades[8] ?? 0)
      player.ants.upgrades[9] = Math.min(333, player.antUpgrades[9] ?? 0)
      player.ants.upgrades[10] = Math.min(45, player.antUpgrades[10] ?? 0)
      player.ants.upgrades[11] = Math.min(7, player.antUpgrades[11] ?? 0)
    }

    player.ants.crumbs = Decimal.min(new Decimal('1e1000'), Decimal.max(1, player.antPoints))
    player.ants.crumbsThisSacrifice = Decimal.min(new Decimal('1e1000'), Decimal.max(1, player.antPoints))
    player.ants.crumbsEverMade = Decimal.min(new Decimal('1e1000'), Decimal.max(1, player.antPoints))

    if (player.antSacrificePoints !== undefined) {
      player.ants.immortalELO = Math.min(1000, player.antSacrificePoints)
      player.ants.rebornELO = 0
      player.ants.antSacrificeCount = (player.antSacrificePoints > 0) ? 1 : 0
    }

    if (player.autoAntSacrifice !== undefined) {
      player.ants.toggles.autoSacrificeEnabled = player.autoAntSacrifice
    }

    if (player.autoAntSacTimer !== undefined) {
      player.ants.toggles.autoSacrificeThreshold = player.autoAntSacTimer
    }

    if (player.autoAntSacrificeMode !== undefined) {
      player.ants.toggles.autoSacrificeMode = player.autoAntSacrificeMode % NUM_SACRIFICE_MODES
    }

    if (player.antMax !== undefined) {
      player.ants.toggles.maxBuyProducers = player.antMax
      player.ants.toggles.maxBuyUpgrades = player.antMax
    }
  }

  Reflect.deleteProperty(player, 'runeshards')
  Reflect.deleteProperty(player, 'maxofferings')
  Reflect.deleteProperty(player, 'researchPoints')
  Reflect.deleteProperty(player, 'maxobtainium')
  Reflect.deleteProperty(player, 'obtainiumpersecond')
  Reflect.deleteProperty(player, 'maxobtainiumpersecond')
  Reflect.deleteProperty(player, 'runeexp')
  Reflect.deleteProperty(player, 'runelevels')
  Reflect.deleteProperty(player, 'usedCorruptions')
  Reflect.deleteProperty(player, 'prototypeCorruptions')
  Reflect.deleteProperty(player, 'corruptionShowStats')
  Reflect.deleteProperty(player, 'corruptionLoadouts')
  Reflect.deleteProperty(player, 'corruptionLoadoutNames')
  Reflect.deleteProperty(player, 'ultimatePixels')
  Reflect.deleteProperty(player, 'cubeUpgradeRedBarFilled')
  Reflect.deleteProperty(player, 'talismanLevels')
  Reflect.deleteProperty(player, 'talismanRarity')
  Reflect.deleteProperty(player, 'talismanOne')
  Reflect.deleteProperty(player, 'talismanTwo')
  Reflect.deleteProperty(player, 'talismanThree')
  Reflect.deleteProperty(player, 'talismanFour')
  Reflect.deleteProperty(player, 'talismanFive')
  Reflect.deleteProperty(player, 'talismanSix')
  Reflect.deleteProperty(player, 'talismanSeven')
  Reflect.deleteProperty(player, 'offeringpersecond')
  Reflect.deleteProperty(player, 'runeBlessingLevels')
  Reflect.deleteProperty(player, 'runeSpiritLevels')
  Reflect.deleteProperty(player, 'hepteractCrafts')
  Reflect.deleteProperty(player, 'singularityUpgrades')
  Reflect.deleteProperty(player, 'octeractUpgrades')
  Reflect.deleteProperty(player, 'blueberryUpgrades')

  Reflect.deleteProperty(player, 'firstOwnedAnts')
  Reflect.deleteProperty(player, 'firstGeneratedAnts')
  Reflect.deleteProperty(player, 'firstCostAnts')
  Reflect.deleteProperty(player, 'firstProduceAnts')
  Reflect.deleteProperty(player, 'secondOwnedAnts')
  Reflect.deleteProperty(player, 'secondGeneratedAnts')
  Reflect.deleteProperty(player, 'secondCostAnts')
  Reflect.deleteProperty(player, 'secondProduceAnts')
  Reflect.deleteProperty(player, 'thirdOwnedAnts')
  Reflect.deleteProperty(player, 'thirdGeneratedAnts')
  Reflect.deleteProperty(player, 'thirdCostAnts')
  Reflect.deleteProperty(player, 'thirdProduceAnts')
  Reflect.deleteProperty(player, 'fourthOwnedAnts')
  Reflect.deleteProperty(player, 'fourthGeneratedAnts')
  Reflect.deleteProperty(player, 'fourthCostAnts')
  Reflect.deleteProperty(player, 'fourthProduceAnts')
  Reflect.deleteProperty(player, 'fifthOwnedAnts')
  Reflect.deleteProperty(player, 'fifthGeneratedAnts')
  Reflect.deleteProperty(player, 'fifthCostAnts')
  Reflect.deleteProperty(player, 'fifthProduceAnts')
  Reflect.deleteProperty(player, 'sixthOwnedAnts')
  Reflect.deleteProperty(player, 'sixthGeneratedAnts')
  Reflect.deleteProperty(player, 'sixthCostAnts')
  Reflect.deleteProperty(player, 'sixthProduceAnts')
  Reflect.deleteProperty(player, 'seventhOwnedAnts')
  Reflect.deleteProperty(player, 'seventhGeneratedAnts')
  Reflect.deleteProperty(player, 'seventhCostAnts')
  Reflect.deleteProperty(player, 'seventhProduceAnts')
  Reflect.deleteProperty(player, 'eighthOwnedAnts')
  Reflect.deleteProperty(player, 'eighthGeneratedAnts')
  Reflect.deleteProperty(player, 'eighthCostAnts')
  Reflect.deleteProperty(player, 'eighthProduceAnts')
  Reflect.deleteProperty(player, 'antPoints')
  Reflect.deleteProperty(player, 'antSacrificePoints')
  Reflect.deleteProperty(player, 'antUpgrades')
  Reflect.deleteProperty(player, 'autoAntSacrifice')
  Reflect.deleteProperty(player, 'autoAntSacTimer')
  Reflect.deleteProperty(player, 'autoAntSacrificeMode')
  Reflect.deleteProperty(player, 'antMax')

  return player
})
