import { displayProperLoadoutCount } from './BlueberryUpgrades'
import { corruptionLoadoutTableCreate, updateCorruptionLoadoutNames } from './Corruptions'
import { CartTab } from './purchases/CartTab'

export type PseudoCoinUpgradeNames =
  | 'INSTANT_UNLOCK_1'
  | 'INSTANT_UNLOCK_2'
  | 'CUBE_BUFF'
  | 'AMBROSIA_LUCK_BUFF'
  | 'AMBROSIA_GENERATION_BUFF'
  | 'GOLDEN_QUARK_BUFF'
  | 'FREE_UPGRADE_PROMOCODE_BUFF'
  | 'CORRUPTION_LOADOUT_SLOT_QOL'
  | 'AMBROSIA_LOADOUT_SLOT_QOL'
  | 'AUTO_POTION_FREE_POTIONS_QOL'
  | 'OFFLINE_TIMER_CAP_BUFF'
  | 'ADD_CODE_CAP_BUFF'
  | 'BASE_OFFERING_BUFF'
  | 'BASE_OBTAINIUM_BUFF'
  | 'RED_GENERATION_BUFF'
  | 'RED_LUCK_BUFF'
  | 'PURPLE_LUCK_BUFF'
  | 'PURPLE_HONEY_BUFF'
  | 'PURPLE_REACTOR_CAPACITY_BUFF'

type PseudoCoinUpgrades = Record<PseudoCoinUpgradeNames, number>
type PseudoCoinUpgradeEffects = Record<PseudoCoinUpgradeNames, number>

// TODO?: Something more robust to injections?

export const PCoinUpgrades: PseudoCoinUpgrades = {
  'INSTANT_UNLOCK_1': 0,
  'INSTANT_UNLOCK_2': 0,
  'CUBE_BUFF': 0,
  'AMBROSIA_LUCK_BUFF': 0,
  'AMBROSIA_GENERATION_BUFF': 0,
  'GOLDEN_QUARK_BUFF': 0,
  'FREE_UPGRADE_PROMOCODE_BUFF': 0,
  'CORRUPTION_LOADOUT_SLOT_QOL': 0,
  'AMBROSIA_LOADOUT_SLOT_QOL': 0,
  'AUTO_POTION_FREE_POTIONS_QOL': 0,
  'OFFLINE_TIMER_CAP_BUFF': 0,
  'ADD_CODE_CAP_BUFF': 0,
  'BASE_OFFERING_BUFF': 0,
  'BASE_OBTAINIUM_BUFF': 0,
  'RED_GENERATION_BUFF': 0,
  'RED_LUCK_BUFF': 0,
  'PURPLE_LUCK_BUFF': 0,
  'PURPLE_HONEY_BUFF': 0,
  'PURPLE_REACTOR_CAPACITY_BUFF': 0
}

export const PCoinUpgradeEffects: PseudoCoinUpgradeEffects = {
  INSTANT_UNLOCK_1: 0,
  INSTANT_UNLOCK_2: 0,
  CUBE_BUFF: 1,
  AMBROSIA_LUCK_BUFF: 0,
  AMBROSIA_GENERATION_BUFF: 1,
  GOLDEN_QUARK_BUFF: 1,
  FREE_UPGRADE_PROMOCODE_BUFF: 1,
  CORRUPTION_LOADOUT_SLOT_QOL: 0,
  AMBROSIA_LOADOUT_SLOT_QOL: 0,
  AUTO_POTION_FREE_POTIONS_QOL: 0,
  OFFLINE_TIMER_CAP_BUFF: 1,
  ADD_CODE_CAP_BUFF: 1,
  BASE_OFFERING_BUFF: 0,
  BASE_OBTAINIUM_BUFF: 0,
  RED_GENERATION_BUFF: 1,
  RED_LUCK_BUFF: 0,
  PURPLE_LUCK_BUFF: 0,
  PURPLE_HONEY_BUFF: 0,
  PURPLE_REACTOR_CAPACITY_BUFF: 0
}

export const initializePCoinCache = async () => {
  const upgradesList = await CartTab.fetchUpgrades()

  // Reset Cache
  for (const key of Object.keys(PCoinUpgrades)) {
    PCoinUpgrades[key as PseudoCoinUpgradeNames] = 0
    updatePCoinEffects(key as PseudoCoinUpgradeNames, 0)
  }

  // Update Cache only for the upgrades that the player has
  for (const upgrade of upgradesList.playerUpgrades) {
    PCoinUpgrades[upgrade.internalName] = upgrade.level
    updatePCoinEffects(upgrade.internalName, upgrade.level)
  }
}

export const updatePCoinCache = async (name: PseudoCoinUpgradeNames, level: number) => {
  PCoinUpgrades[name] = level
  updatePCoinEffects(name, level)
}

const updatePCoinEffects = (name: PseudoCoinUpgradeNames, level: number) => {
  switch (name) {
    case 'INSTANT_UNLOCK_1':
      PCoinUpgradeEffects.INSTANT_UNLOCK_1 = level > 0 ? 1 : 0
      break
    case 'INSTANT_UNLOCK_2':
      PCoinUpgradeEffects.INSTANT_UNLOCK_2 = level > 0 ? 1 : 0
      break
    case 'CUBE_BUFF':
      PCoinUpgradeEffects.CUBE_BUFF = 1 + level * 0.06
      break
    case 'AMBROSIA_LUCK_BUFF':
      PCoinUpgradeEffects.AMBROSIA_LUCK_BUFF = level * 20
      break
    case 'AMBROSIA_GENERATION_BUFF':
      PCoinUpgradeEffects.AMBROSIA_GENERATION_BUFF = 1 + level * 0.05
      break
    case 'GOLDEN_QUARK_BUFF':
      PCoinUpgradeEffects.GOLDEN_QUARK_BUFF = 1 + level * 0.04
      break
    case 'FREE_UPGRADE_PROMOCODE_BUFF':
      PCoinUpgradeEffects.FREE_UPGRADE_PROMOCODE_BUFF = 1 + level * 0.02
      break
    case 'CORRUPTION_LOADOUT_SLOT_QOL':
      PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL = level
      corruptionLoadoutTableCreate()
      updateCorruptionLoadoutNames()
      break
    case 'AMBROSIA_LOADOUT_SLOT_QOL':
      PCoinUpgradeEffects.AMBROSIA_LOADOUT_SLOT_QOL = level
      displayProperLoadoutCount()
      break
    case 'AUTO_POTION_FREE_POTIONS_QOL':
      PCoinUpgradeEffects.AUTO_POTION_FREE_POTIONS_QOL = level > 0 ? 1 : 0
      break
    case 'OFFLINE_TIMER_CAP_BUFF':
      PCoinUpgradeEffects.OFFLINE_TIMER_CAP_BUFF = 1 + level
      break
    case 'ADD_CODE_CAP_BUFF':
      PCoinUpgradeEffects.ADD_CODE_CAP_BUFF = 1 + level
      break
    case 'BASE_OFFERING_BUFF':
      PCoinUpgradeEffects.BASE_OFFERING_BUFF = 6 * level
      break
    case 'BASE_OBTAINIUM_BUFF':
      PCoinUpgradeEffects.BASE_OBTAINIUM_BUFF = 3 * level
      break
    case 'RED_GENERATION_BUFF':
      PCoinUpgradeEffects.RED_GENERATION_BUFF = 1 + level * 0.05
      break
    case 'RED_LUCK_BUFF':
      PCoinUpgradeEffects.RED_LUCK_BUFF = level * 20
      break
    case 'PURPLE_LUCK_BUFF':
      PCoinUpgradeEffects.PURPLE_LUCK_BUFF = level * 5
      break
    case 'PURPLE_HONEY_BUFF':
      PCoinUpgradeEffects.PURPLE_HONEY_BUFF = level * 0.04
      break
    case 'PURPLE_REACTOR_CAPACITY_BUFF':
      PCoinUpgradeEffects.PURPLE_REACTOR_CAPACITY_BUFF = level * 250_000_000
      break
  }
}

