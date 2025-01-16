import i18next from 'i18next'
import { displayProperLoadoutCount } from './BlueberryUpgrades'
import { corruptionLoadoutTableCreate, updateCorruptionLoadoutNames } from './Corruptions'
import { CartTab } from './purchases/CartTab'
import { format } from './Synergism'

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

export type PseudoCoinUpgrades = Record<PseudoCoinUpgradeNames, number>
export type PseudoCoinUpgradeEffects = Record<PseudoCoinUpgradeNames, number>

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
  'ADD_CODE_CAP_BUFF': 0
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
  ADD_CODE_CAP_BUFF: 1
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

export const updatePCoinEffects = (name: PseudoCoinUpgradeNames, level: number) => {
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
  }
}

export const displayPCoinEffect = (name: PseudoCoinUpgradeNames, level: number) => {
  switch (name) {
    case 'INSTANT_UNLOCK_1':
      return String(
        i18next.t('pseudoCoins.upgradeEffects.INSTANT_UNLOCK_1', {
          descriptor: level > 0 ? '' : 'NOT',
          amount: 10 * level
        })
      )
    case 'INSTANT_UNLOCK_2':
      return String(
        i18next.t('pseudoCoins.upgradeEffects.INSTANT_UNLOCK_2', {
          descriptor: level > 0 ? '' : 'NOT',
          amount: 6 * level
        })
      )
    case 'CUBE_BUFF':
      return String(i18next.t('pseudoCoins.upgradeEffects.CUBE_BUFF', { amount: format(1 + 0.06 * level, 2, true) }))
    case 'AMBROSIA_LUCK_BUFF':
      return String(i18next.t('pseudoCoins.upgradeEffects.AMBROSIA_LUCK_BUFF', { amount: 20 * level }))
    case 'AMBROSIA_GENERATION_BUFF':
      return String(
        i18next.t('pseudoCoins.upgradeEffects.AMBROSIA_GENERATION_BUFF', { amount: format(1 + 0.05 * level, 2, true) })
      )
    case 'GOLDEN_QUARK_BUFF':
      return String(
        i18next.t('pseudoCoins.upgradeEffects.GOLDEN_QUARK_BUFF', { amount: format(1 + 0.04 * level, 2, true) })
      )
    case 'FREE_UPGRADE_PROMOCODE_BUFF':
      return String(
        i18next.t('pseudoCoins.upgradeEffects.FREE_UPGRADE_PROMOCODE_BUFF', {
          amount: format(1 + 0.02 * level, 2, true)
        })
      )
    case 'CORRUPTION_LOADOUT_SLOT_QOL':
      return String(i18next.t('pseudoCoins.upgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL', { amount: level }))
    case 'AMBROSIA_LOADOUT_SLOT_QOL':
      return String(i18next.t('pseudoCoins.upgradeEffects.AMBROSIA_LOADOUT_SLOT_QOL', { amount: level }))
    case 'AUTO_POTION_FREE_POTIONS_QOL':
      return String(
        i18next.t('pseudoCoins.upgradeEffects.AUTO_POTION_FREE_POTIONS_QOL', { descriptor: level > 0 ? '' : 'NOT' })
      )
    case 'OFFLINE_TIMER_CAP_BUFF':
      return String(i18next.t('pseudoCoins.upgradeEffects.OFFLINE_TIMER_CAP_BUFF', { amount: level + 1 }))
    case 'ADD_CODE_CAP_BUFF':
      return String(i18next.t('pseudoCoins.upgradeEffects.ADD_CODE_CAP_BUFF', { amount: level + 1 }))
  }
}

export const showCostAndEffect = (name: PseudoCoinUpgradeNames) => {
  switch (name) {
    case 'INSTANT_UNLOCK_1':
      return {
        cost: 'Cost: 400 PseudoCoins',
        effect: 'Effect: +10 Levels'
      }
    case 'INSTANT_UNLOCK_2':
      return {
        cost: 'Cost: 600 PseudoCoins',
        effect: 'Effect: +6 Levels'
      }
    case 'CUBE_BUFF':
      return {
        cost: 'Cost: 100/150/200/250/300 PseudoCoins',
        effect: 'Effect: 1.06/1.12/1.18/1.24/1.30x Cubes'
      }
    case 'AMBROSIA_LUCK_BUFF':
      return {
        cost: 'Cost: 100/150/200/250/300 PseudoCoins',
        effect: 'Effect: 20/40/60/80/100 Ambrosia Luck'
      }
    case 'AMBROSIA_GENERATION_BUFF':
      return {
        cost: 'Cost: 100/150/200/250/300 PseudoCoins',
        effect: 'Effect: 1.05/1.10/1.15/1.20/1.25x Ambrosia Generation'
      }
    case 'GOLDEN_QUARK_BUFF':
      return {
        cost: 'Cost: 100/150/200/250/300 PseudoCoins',
        effect: 'Effect: 1.04/1.08/1.12/1.16/1.20x Golden Quarks'
      }
    case 'FREE_UPGRADE_PROMOCODE_BUFF':
      return {
        cost: 'Cost: 100/150/200/250/300 PseudoCoins',
        effect: 'Effect: 1.02/1.04/1.06/1.08/1.10x Free Upgrade Promocodes'
      }
    case 'CORRUPTION_LOADOUT_SLOT_QOL':
      return {
        cost: 'Cost: 125/per PseudoCoins',
        effect: 'Effect: +1 Loadout Slot per level'
      }
    case 'AMBROSIA_LOADOUT_SLOT_QOL':
      return {
        cost: 'Cost: 125/per PseudoCoins',
        effect: 'Effect: +1 Loadout Slot per level'
      }
    case 'AUTO_POTION_FREE_POTIONS_QOL':
      return {
        cost: 'Cost: 500 PseudoCoins',
        effect: 'Effect: Auto Potion gives free potions'
      }
    case 'OFFLINE_TIMER_CAP_BUFF':
      return {
        cost: 'Cost: 400/600 PseudoCoins',
        effect: 'Effect: 2x/3x Offline Time Cap'
      }
    case 'ADD_CODE_CAP_BUFF':
      return {
        cost: 'Cost: 400/600 PseudoCoins',
        effect: 'Effect: 2x/3x Add Code Cap'
      }
  }
}
