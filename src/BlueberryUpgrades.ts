import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAmbrosiaLuck, calculateBlueberryInventory } from './Calculate'
import { exportData, saveFilename } from './ImportExport'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getQuarkBonus } from './Quark'
import { getRedAmbrosiaUpgradeEffects } from './RedAmbrosiaUpgrades'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, Confirm, Prompt } from './UpdateHTML'
import { assert, isMobile } from './Utility'

export type BlueberryOpt = Partial<Record<AmbrosiaUpgradeNames, number>>
export type BlueberryLoadoutMode = 'saveTree' | 'loadTree'

type AmbrosiaUpgradeRewards = {
  ambrosiaTutorial: { quarks: number; cubes: number }
  ambrosiaQuarks1: { quarks: number }
  ambrosiaCubes1: { cubes: number }
  ambrosiaLuck1: { ambrosiaLuck: number }
  ambrosiaQuarkCube1: { cubes: number }
  ambrosiaLuckCube1: { cubes: number }
  ambrosiaCubeQuark1: { quarks: number }
  ambrosiaLuckQuark1: { quarks: number }
  ambrosiaCubeLuck1: { ambrosiaLuck: number }
  ambrosiaQuarkLuck1: { ambrosiaLuck: number }
  ambrosiaQuarks2: { quarks: number }
  ambrosiaCubes2: { cubes: number }
  ambrosiaLuck2: { ambrosiaLuck: number }
  ambrosiaQuarks3: { quarks: number }
  ambrosiaCubes3: { cubes: number }
  ambrosiaLuck3: { ambrosiaLuck: number }
  ambrosiaLuck4: { ambrosiaLuckPercentage: number }
  ambrosiaPatreon: { blueberryGeneration: number }
  ambrosiaObtainium1: { luckMult: number; obtainiumMult: number }
  ambrosiaOffering1: { luckMult: number; offeringMult: number }
  ambrosiaHyperflux: { hyperFlux: number }
  ambrosiaBaseOffering1: { offering: number }
  ambrosiaBaseObtainium1: { obtainium: number }
  ambrosiaBaseOffering2: { offering: number }
  ambrosiaBaseObtainium2: { obtainium: number }
  ambrosiaSingReduction1: { singularityReduction: number }
  ambrosiaInfiniteShopUpgrades1: { freeLevels: number }
  ambrosiaInfiniteShopUpgrades2: { freeLevels: number }
  ambrosiaSingReduction2: { singularityReduction: number }
  ambrosiaTalismanBonusRuneLevel: { talismanBonusRuneLevel: number }
  ambrosiaRuneOOMBonus: { runeOOMBonus: number; infiniteAscentOOMBonus: number }
}

export type AmbrosiaUpgradeNames = keyof AmbrosiaUpgradeRewards

export interface AmbrosiaUpgrade<T extends AmbrosiaUpgradeNames> {
  name: () => string
  description: () => string
  level: number
  maxLevel: number
  costPerLevel: number
  costFormula: (level: number, baseCost: number) => number
  effects: (n: number) => AmbrosiaUpgradeRewards[T]
  effectsDescription: (n: number) => string
  extraLevelCalc: () => number
  ambrosiaInvested: number
  blueberriesInvested: number
  blueberryCost: number
  prerequisites: BlueberryOpt
  ignoreEXALT: boolean
}

export const ambrosiaUpgrades: {
  [K in AmbrosiaUpgradeNames]: AmbrosiaUpgrade<K>
} = {
  ambrosiaTutorial: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 10,
    costPerLevel: 1,
    blueberryCost: 0,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    effects: (n: number) => {
      const cubeAmount = 1 + 0.05 * n
      const quarkAmount = 1 + 0.01 * n
      return {
        quarks: quarkAmount,
        cubes: cubeAmount
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaTutorial.effect', {
        cubeAmount: format(100 * (vals.cubes - 1), 0, true),
        quarkAmount: format(100 * (vals.quarks - 1), 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeTutorialLevels').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaTutorial.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaTutorial.description')
  },
  ambrosiaQuarks1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 1,
    blueberryCost: 0,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaTutorial: 10
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const quarkAmount = 1 + 0.01 * n
      return {
        quarks: quarkAmount
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaQuarks1.effect', {
        amount: format(100 * (vals.quarks - 1), 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow2').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaQuarks1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaQuarks1.description')
  },
  ambrosiaCubes1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 1,
    blueberryCost: 0,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaTutorial: 10
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const cubeAmount = (1 + 0.05 * n) * Math.pow(1.1, Math.floor(n / 5))
      return {
        cubes: cubeAmount
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaCubes1.effect', {
        amount: format(100 * (vals.cubes - 1), 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow2').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaCubes1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaCubes1.description')
  },
  ambrosiaLuck1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 1,
    blueberryCost: 0,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaTutorial: 10
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const val = 2 * n + 12 * Math.floor(n / 10)
      return {
        ambrosiaLuck: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaLuck1.effect', {
        amount: format(vals.ambrosiaLuck)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow2').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaLuck1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaLuck1.description')
  },
  ambrosiaQuarkCube1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 25,
    costPerLevel: 250,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaCubes1: 30,
      ambrosiaQuarks1: 20
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const baseVal = 0.001 * n
      const val = 1
        + baseVal
          * Math.floor(Math.pow(Math.log10(Number(player.worlds) + 1) + 1, 2))
      return {
        cubes: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaQuarkCube1.effect', {
        amount: format(100 * (vals.cubes - 1), 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow3').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaQuarkCube1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaQuarkCube1.description')
  },
  ambrosiaLuckCube1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 25,
    costPerLevel: 250,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaCubes1: 30,
      ambrosiaLuck1: 20
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const baseVal = 0.0005 * n
      const val = 1 + baseVal * calculateAmbrosiaLuck()
      return {
        cubes: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaLuckCube1.effect', {
        amount: format(100 * (vals.cubes - 1), 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow3').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaLuckCube1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaLuckCube1.description')
  },
  ambrosiaCubeQuark1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 25,
    costPerLevel: 500,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaQuarks1: 30,
      ambrosiaCubes1: 20
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const baseVal = 0.0001 * n
      const val = 1
        + baseVal
          * (Math.floor(Math.log10(Number(player.wowCubes) + 1))
            + Math.floor(Math.log10(Number(player.wowTesseracts) + 1))
            + Math.floor(Math.log10(Number(player.wowHypercubes) + 1))
            + Math.floor(Math.log10(Number(player.wowPlatonicCubes) + 1))
            + Math.floor(Math.log10(player.wowAbyssals + 1))
            + Math.floor(Math.log10(player.wowOcteracts + 1))
            + 6)
      return {
        quarks: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaCubeQuark1.effect', {
        amount: format(100 * (vals.quarks - 1), 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow3').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaCubeQuark1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaCubeQuark1.description')
  },
  ambrosiaLuckQuark1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 25,
    costPerLevel: 500,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaQuarks1: 30,
      ambrosiaLuck1: 20
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const baseVal = 0.0001 * n
      const luck = calculateAmbrosiaLuck()
      const effectiveLuck = Math.min(
        luck,
        Math.pow(1000, 0.5) * Math.pow(luck, 0.5)
      )
      const val = 1 + baseVal * effectiveLuck
      return {
        quarks: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaLuckQuark1.effect', {
        amount: format(100 * (vals.quarks - 1), 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow3').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaLuckQuark1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaLuckQuark1.description')
  },
  ambrosiaCubeLuck1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 25,
    costPerLevel: 100,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaLuck1: 30,
      ambrosiaCubes1: 20
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const baseVal = 0.02 * n
      const val = baseVal
        * (Math.floor(Math.log10(Number(player.wowCubes) + 1))
          + Math.floor(Math.log10(Number(player.wowTesseracts) + 1))
          + Math.floor(Math.log10(Number(player.wowHypercubes) + 1))
          + Math.floor(Math.log10(Number(player.wowPlatonicCubes) + 1))
          + Math.floor(Math.log10(player.wowAbyssals + 1))
          + Math.floor(Math.log10(player.wowOcteracts + 1))
          + 6)
      return {
        ambrosiaLuck: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaCubeLuck1.effect', {
        amount: format(vals.ambrosiaLuck, 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow3').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaCubeLuck1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaCubeLuck1.description')
  },
  ambrosiaQuarkLuck1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 25,
    costPerLevel: 100,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaLuck1: 30,
      ambrosiaQuarks1: 20
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const baseVal = 0.02 * n
      const val = baseVal * Math.floor(Math.pow(Math.log10(Number(player.worlds) + 1) + 1, 2))
      return {
        ambrosiaLuck: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaQuarkLuck1.effect', {
        amount: format(vals.ambrosiaLuck, 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow3').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaQuarkLuck1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaQuarkLuck1.description')
  },
  ambrosiaQuarks2: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 500,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaQuarks1: 40
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    effects: (n: number) => {
      const quarkAmount = 1
        + (0.01
            + Math.floor(getAmbrosiaUpgradeEffectiveLevels('ambrosiaQuarks1') / 10)
              / 1000)
          * n
      return {
        quarks: quarkAmount
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaQuarks2.effect', {
        amount: format(100 * (vals.quarks - 1), 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow4').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaQuarks2.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaQuarks2.description')
  },
  ambrosiaCubes2: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 500,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaCubes1: 40
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    effects: (n: number) => {
      const cubeAmount = (1
        + (0.1
            + 10
              * (Math.floor(getAmbrosiaUpgradeEffectiveLevels('ambrosiaCubes1') / 10)
                / 1000))
          * n)
        * Math.pow(1.15, Math.floor(n / 5))
      return {
        cubes: cubeAmount
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaCubes2.effect', {
        amount: format(100 * (vals.cubes - 1), 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow4').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaCubes2.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaCubes2.description')
  },
  ambrosiaLuck2: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 250,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaLuck1: 40
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    effects: (n: number) => {
      const val = (3
            + 0.3 * Math.floor(getAmbrosiaUpgradeEffectiveLevels('ambrosiaLuck1') / 10))
          * n
        + 40 * Math.floor(n / 10)
      return {
        ambrosiaLuck: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaLuck2.effect', {
        amount: format(vals.ambrosiaLuck, 1, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow4').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaLuck2.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaLuck2.description')
  },
  ambrosiaQuarks3: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 10,
    costPerLevel: 750000,
    blueberryCost: 3,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaQuarks1: 100,
      ambrosiaQuarks2: 50
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost + 50000 * level
    },
    effects: (n: number) => {
      const quark2Mult = 1 + getAmbrosiaUpgradeEffectiveLevels('ambrosiaQuarks2') / 100
      const quark3Base = 0.05 * n
      const quarkAmount = 1 + quark3Base * quark2Mult
      return {
        quarks: quarkAmount
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaQuarks3.effect', {
        amount: format(100 * (vals.quarks - 1), 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow5').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaQuarks3.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaQuarks3.description')
  },
  ambrosiaCubes3: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 75000,
    blueberryCost: 3,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaCubes1: 100,
      ambrosiaCubes2: 50
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost + 5000 * level
    },
    effects: (n: number) => {
      const cube2Multi = 1 + 3 * getAmbrosiaUpgradeEffectiveLevels('ambrosiaCubes2') / 100
      const cube3Base = 0.2 * n
      const cube3Exponential = Math.pow(1.2, Math.floor(n / 5))
      const cubeAmount = (1 + cube3Base * cube2Multi) * cube3Exponential
      return {
        cubes: cubeAmount
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaCubes3.effect', {
        amount: format(100 * (vals.cubes - 1), 2, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow5').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaCubes3.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaCubes3.description')
  },
  ambrosiaLuck3: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 50000,
    blueberryCost: 3,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaLuck1: 90,
      ambrosiaLuck2: 50
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost + 0 * level // Level has no effect
    },
    effects: (n: number) => {
      const perLevel = calculateBlueberryInventory()
      return {
        ambrosiaLuck: perLevel * n
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaLuck3.effect', {
        amount: format(vals.ambrosiaLuck, 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow5').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaLuck3.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaLuck3.description')
  },
  ambrosiaLuck4: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 50,
    costPerLevel: 250000,
    blueberryCost: 5,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level, baseCost): number => {
      return baseCost + 20000 * level
    },
    effects: (n: number) => {
      const digits = Math.ceil(Math.log10(player.lifetimeRedAmbrosia + 1))
        + Math.ceil(Math.log10(player.lifetimeAmbrosia + 1))
      return {
        ambrosiaLuckPercentage: 1 / 10000 * digits * n
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaLuck4.effect', {
        amount: formatAsPercentIncrease(1 + vals.ambrosiaLuckPercentage, 2)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow5').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaLuck4.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaLuck4.description')
  },
  ambrosiaPatreon: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 1,
    costPerLevel: 1,
    blueberryCost: 0,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    effects: (n: number) => {
      const val = 1 + (n * getQuarkBonus()) / 100
      return {
        blueberryGeneration: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaPatreon.effect', {
        amount: format(100 * (vals.blueberryGeneration - 1), 0, true)
      })
    },
    extraLevelCalc: () => 0,
    name: () => i18next.t('ambrosia.data.ambrosiaPatreon.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaPatreon.description')
  },
  ambrosiaObtainium1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 2,
    costPerLevel: 50000,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * Math.pow(25, level)
    },
    effects: (n: number) => {
      const luck = calculateAmbrosiaLuck()
      return {
        luckMult: n,
        obtainiumMult: n * luck
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaObtainium1.effect', {
        amount: format(vals.obtainiumMult / 10, 1, true)
      })
    },
    extraLevelCalc: () => 0,
    name: () => i18next.t('ambrosia.data.ambrosiaObtainium1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaObtainium1.description')
  },
  ambrosiaOffering1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 2,
    costPerLevel: 50000,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * Math.pow(25, level)
    },
    effects: (n: number) => {
      const luck = calculateAmbrosiaLuck()
      return {
        luckMult: n,
        offeringMult: n * luck
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaOffering1.effect', {
        amount: format(vals.offeringMult / 10, 1, true)
      })
    },
    extraLevelCalc: () => 0,
    name: () => i18next.t('ambrosia.data.ambrosiaOffering1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaOffering1.description')
  },
  ambrosiaHyperflux: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 7,
    costPerLevel: 33333,
    blueberryCost: 3,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return (baseCost + 33333 * Math.min(4, level)) * Math.max(1, Math.pow(3, level - 4))
    },
    effects: (n: number) => {
      const fourByFourBase = n
      return {
        hyperFlux: Math.pow(
          1 + (1 / 100) * fourByFourBase,
          player.platonicUpgrades[19]
        )
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaHyperflux.effect', {
        amount: format(100 * (vals.hyperFlux - 1))
      })
    },
    extraLevelCalc: () => 0,
    name: () => i18next.t('ambrosia.data.ambrosiaHyperflux.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaHyperflux.description')
  },
  ambrosiaBaseOffering1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 40,
    costPerLevel: 5,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      return {
        offering: n
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaBaseOffering1.effect', {
        amount: format(vals.offering, 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow2').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaBaseOffering1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaBaseOffering1.description')
  },
  ambrosiaBaseObtainium1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 20,
    costPerLevel: 40,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const val = n
      return {
        obtainium: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaBaseObtainium1.effect', {
        amount: format(vals.obtainium, 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow2').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaBaseObtainium1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaBaseObtainium1.description')
  },
  ambrosiaBaseOffering2: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 60,
    costPerLevel: 20,
    blueberryCost: 2,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaBaseOffering1: 30,
      ambrosiaBaseObtainium1: 10
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const val = n
      return {
        offering: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaBaseOffering2.effect', {
        amount: format(vals.offering, 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow4').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaBaseOffering2.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaBaseOffering2.description')
  },
  ambrosiaBaseObtainium2: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 30,
    costPerLevel: 160,
    blueberryCost: 2,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaBaseObtainium1: 15,
      ambrosiaBaseOffering1: 20
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 3) - Math.pow(level, 3))
    },
    effects: (n: number) => {
      const val = n
      return {
        obtainium: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaBaseObtainium2.effect', {
        amount: format(vals.obtainium, 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow4').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaBaseObtainium2.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaBaseObtainium2.description')
  },
  ambrosiaSingReduction1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 2,
    costPerLevel: 100000,
    blueberryCost: 2,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaHyperflux: 4
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * Math.pow(99, level)
    },
    effects: (n: number) => {
      const val = (player.insideSingularityChallenge) ? 0 : n
      return {
        singularityReduction: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaSingReduction1.effect', {
        amount: format(vals.singularityReduction, 0, true)
      })
    },
    extraLevelCalc: () => 0,
    name: () => i18next.t('ambrosia.data.ambrosiaSingReduction1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaSingReduction1.description')
  },
  ambrosiaInfiniteShopUpgrades1: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 20,
    costPerLevel: 25000,
    blueberryCost: 1,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaCubes1: 70,
      ambrosiaBaseOffering1: 20,
      ambrosiaBaseObtainium1: 10
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost + 0 * level
    },
    effects: (n: number) => {
      const val = n
      return {
        freeLevels: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaInfiniteShopUpgrades1.effect', {
        amount: format(vals.freeLevels, 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow4').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaInfiniteShopUpgrades1.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaInfiniteShopUpgrades1.description')
  },
  ambrosiaInfiniteShopUpgrades2: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 20,
    costPerLevel: 75000,
    blueberryCost: 2,
    ignoreEXALT: false,
    prerequisites: {
      ambrosiaInfiniteShopUpgrades1: 20,
      ambrosiaCubes2: 50,
      ambrosiaBaseOffering2: 20,
      ambrosiaBaseObtainium2: 10
    },
    costFormula: (level: number, baseCost: number): number => {
      return baseCost + 0 * level
    },
    effects: (n: number) => {
      const val = n
      return {
        freeLevels: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaInfiniteShopUpgrades2.effect', {
        amount: format(vals.freeLevels, 0, true)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow5').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaInfiniteShopUpgrades2.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaInfiniteShopUpgrades2.description')
  },
  ambrosiaSingReduction2: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 2,
    costPerLevel: 1.25e7,
    blueberryCost: 4,
    ignoreEXALT: true,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * Math.pow(3, level)
    },
    effects: (n: number) => {
      const val = (player.insideSingularityChallenge) ? n : 0
      return {
        singularityReduction: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaSingReduction2.effect', {
        amount: format(vals.singularityReduction, 0, true)
      })
    },
    extraLevelCalc: () => 0,
    name: () => i18next.t('ambrosia.data.ambrosiaSingReduction2.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaSingReduction2.description')
  },
  ambrosiaTalismanBonusRuneLevel: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 100,
    blueberryCost: 0,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
    },
    effects: (n: number) => {
      const val = n / 200
      return {
        talismanBonusRuneLevel: val
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaTalismanBonusRuneLevel.effect', {
        amount: formatAsPercentIncrease(1 + vals.talismanBonusRuneLevel, 2)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow2').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaTalismanBonusRuneLevel.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaTalismanBonusRuneLevel.description')
  },
  ambrosiaRuneOOMBonus: {
    level: 0,
    ambrosiaInvested: 0,
    blueberriesInvested: 0,
    maxLevel: 100,
    costPerLevel: 2500,
    blueberryCost: 0,
    ignoreEXALT: false,
    prerequisites: {},
    costFormula: (level: number, baseCost: number): number => {
      return Math.ceil(baseCost * (Math.pow(level + 1, 1.5) - Math.pow(level, 1.5)))
    },
    effects: (n: number) => {
      const val = n
      const val2 = n / 1000
      return {
        runeOOMBonus: val,
        infiniteAscentOOMBonus: val2
      }
    },
    effectsDescription: function(n: number) {
      const vals = this.effects(n)
      return i18next.t('ambrosia.data.ambrosiaRuneOOMBonus.effect', {
        amount: format(vals.runeOOMBonus, 0, false),
        amount2: format(vals.infiniteAscentOOMBonus, 3, false)
      })
    },
    extraLevelCalc: () => getRedAmbrosiaUpgradeEffects('freeLevelsRow4').freeLevels,
    name: () => i18next.t('ambrosia.data.ambrosiaRuneOOMBonus.name'),
    description: () => i18next.t('ambrosia.data.ambrosiaRuneOOMBonus.description')
  }
}

export const ambrosiaUpgradeNames = Object.keys(ambrosiaUpgrades) as AmbrosiaUpgradeNames[]

export const blankAmbrosiaUpgradeObject: Record<
  AmbrosiaUpgradeNames,
  { ambrosiaInvested: number; blueberriesInvested: number }
> = Object.fromEntries(
  Object.keys(ambrosiaUpgrades).map((key) => [
    key as AmbrosiaUpgradeNames,
    {
      ambrosiaInvested: 0,
      blueberriesInvested: 0
    }
  ])
) as Record<AmbrosiaUpgradeNames, { ambrosiaInvested: number; blueberriesInvested: number }>

export const setAmbrosiaUpgradeLevels = () => {
  for (const upgradeKey of Object.keys(ambrosiaUpgrades) as AmbrosiaUpgradeNames[]) {
    const invested = ambrosiaUpgrades[upgradeKey].ambrosiaInvested
    const upgradeCost = ambrosiaUpgrades[upgradeKey].costFormula
    const perLevelCost = ambrosiaUpgrades[upgradeKey].costPerLevel

    let level = 0
    let budget = invested

    let nextCost = upgradeCost(level, perLevelCost)

    while (budget >= nextCost) {
      budget -= nextCost
      level += 1
      nextCost = upgradeCost(level, perLevelCost)

      if (level >= ambrosiaUpgrades[upgradeKey].maxLevel) {
        break
      }
    }

    // If there is leftover budget, then the formulae has probably changed, or above max.
    // We refund the remaining budget.
    if (budget > 0) {
      player.ambrosiaUpgrades[upgradeKey].ambrosiaInvested -= budget
      player.ambrosia += budget
    }

    ambrosiaUpgrades[upgradeKey].level = level
    ambrosiaUpgrades[upgradeKey].ambrosiaInvested = invested - budget
  }
}

export const getAmbrosiaUpgradeEffectiveLevels = (upgradeKey: AmbrosiaUpgradeNames): number => {
  const upgrade = ambrosiaUpgrades[upgradeKey]
  return ((player.singularityChallenges.noAmbrosiaUpgrades.enabled
      || player.singularityChallenges.sadisticPrequel.enabled) && !upgrade.ignoreEXALT)
    ? 0
    : upgrade.level + upgrade.extraLevelCalc()
}

export const getAmbrosiaUpgradeEffects = <T extends AmbrosiaUpgradeNames>(
  upgradeKey: T
): AmbrosiaUpgradeRewards[T] => {
  const effectiveLevels = getAmbrosiaUpgradeEffectiveLevels(upgradeKey)
  return ambrosiaUpgrades[upgradeKey].effects(effectiveLevels)
}

export const getAmbrosiaUpgradeEffectsDescription = (upgradeKey: AmbrosiaUpgradeNames): string => {
  const effectiveLevels = getAmbrosiaUpgradeEffectiveLevels(upgradeKey)
  return ambrosiaUpgrades[upgradeKey].effectsDescription(effectiveLevels)
}

export const getAmbrosiaUpgradeCostTNL = (upgradeKey: AmbrosiaUpgradeNames): number => {
  const upgrade = ambrosiaUpgrades[upgradeKey]
  if (upgrade.level === upgrade.maxLevel) {
    return 0
  }
  return upgrade.costFormula(upgrade.level, upgrade.costPerLevel)
}

export const checkAmbrosiaUpgradePrerequisites = (upgradeKey: AmbrosiaUpgradeNames): boolean => {
  const upgrade = ambrosiaUpgrades[upgradeKey]
  const prerequisites = upgrade.prerequisites

  for (const [prereq, val] of Object.entries(prerequisites)) {
    const k = prereq as AmbrosiaUpgradeNames
    if (ambrosiaUpgrades[k].level < val!) {
      return false
    }
  }
  return true
}

export const ambrosiaUpgradeToString = (upgradeKey: AmbrosiaUpgradeNames): string => {
  const upgrade = ambrosiaUpgrades[upgradeKey]
  const costNextLevel = getAmbrosiaUpgradeCostTNL(upgradeKey)
  const maxLevel = upgrade.maxLevel === -1 ? '' : `/${format(upgrade.maxLevel, 0, true)}`
  const isMaxLevel = upgrade.maxLevel === upgrade.level
  const color = isMaxLevel ? 'plum' : 'white'

  const extraLevels = upgrade.extraLevelCalc()
  const freeLevelInfo = extraLevels > 0
    ? `<span style="color: pink"> [+${format(extraLevels, 0, true)}]</span>`
    : ''

  let preReqText: string | undefined

  if (Object.keys(upgrade.prerequisites).length > 0) {
    preReqText = String(i18next.t('ambrosia.prerequisite'))
    for (const [prereq, val] of Object.entries(upgrade.prerequisites)) {
      const k = prereq as AmbrosiaUpgradeNames
      const color = ambrosiaUpgrades[k].level >= val! ? 'green' : 'red'
      const met = ambrosiaUpgrades[k].level >= val!
        ? ''
        : i18next.t('ambrosia.prereqNotMet')
      preReqText = `${preReqText}<span style="color:${color}"> ${ambrosiaUpgrades[k].name()} lv.${val} ${met}</span> |`
    }

    preReqText = preReqText.slice(0, -1)
  }

  const effectsDescription = getAmbrosiaUpgradeEffectsDescription(upgradeKey)

  const nameHTML = `<span style="color: gold">${upgrade.name()}</span>`
  const levelHTML = `<span style="color: ${color}"> ${i18next.t('general.level')} ${
    format(upgrade.level, 0, true)
  }${maxLevel}${freeLevelInfo}</span>`
  const preReqHTML = preReqText ? `${preReqText}<br>` : ''
  const descriptionHTML = `<span style="color: lightblue">${upgrade.description()}</span>`
  const effectsHTML = `<span style="color: gold">${effectsDescription}</span>`
  const costNextLevelHTML = `${
    i18next.t('ambrosia.ambrosiaCost', {
      amount: format(costNextLevel, 0, true)
    })
  }`
  const blueberryCostHTML = `${
    i18next.t('ambrosia.blueberryCost')
  } <span style="color:blue">${upgrade.blueberryCost}</span>`
  const spentAmbrosiaHTML = `${i18next.t('general.spent')} ${
    i18next.t('ambrosia.ambrosia')
  }: <span style="color:orange">${format(upgrade.ambrosiaInvested, 0, true)}</span>`
  const ignoreEXALTHTML = upgrade.ignoreEXALT
    ? `<br><span style="color: orchid"> ${i18next.t('ambrosia.ignoreEXALT')}</span>`
    : ''

  return `${nameHTML}<br>${levelHTML}<br>${preReqHTML}${descriptionHTML}<br>${effectsHTML}<br>${costNextLevelHTML}<br>${blueberryCostHTML}<br>${spentAmbrosiaHTML}${ignoreEXALTHTML}`
}

export const updateMobileAmbrosiaHTML = (k: AmbrosiaUpgradeNames) => {
  const elm = DOMCacheGetOrSet('singularityAmbrosiaMultiline')
  elm.innerHTML = ambrosiaUpgradeToString(k)
  // MOBILE ONLY - Add a button for buying upgrades
  if (isMobile) {
    const buttonDiv = document.createElement('div')

    const buyOne = document.createElement('button')
    const buyMax = document.createElement('button')

    buyOne.classList.add('modalBtnBuy')
    buyOne.textContent = i18next.t('general.buyOne')
    buyOne.addEventListener('click', (event: MouseEvent) => {
      buyAmbrosiaUpgradeLevel(k, event, false)
      updateMobileAmbrosiaHTML(k)
    })

    buyMax.classList.add('modalBtnBuy')
    buyMax.textContent = i18next.t('general.buyMax')
    buyMax.addEventListener('click', (event: MouseEvent) => {
      buyAmbrosiaUpgradeLevel(k, event, true)
      updateMobileAmbrosiaHTML(k)
    })

    buttonDiv.appendChild(buyOne)
    buttonDiv.appendChild(buyMax)
    elm.appendChild(buttonDiv)
  }
}

export const buyAmbrosiaUpgradeLevel = async (
  upgradeKey: AmbrosiaUpgradeNames,
  event: MouseEvent,
  buyMax = false
): Promise<void> => {
  const upgrade = ambrosiaUpgrades[upgradeKey]
  let purchased = 0
  let maxPurchasable = 1
  let ambrosiaBudget = player.ambrosia

  if (!checkAmbrosiaUpgradePrerequisites(upgradeKey)) {
    return Alert(i18next.t('ambrosia.prereqNotMetAlert'))
  }

  if (event.shiftKey || buyMax) {
    maxPurchasable = 1000000
    const buy = Number(
      await Prompt(
        i18next.t('ambrosia.ambrosiaBuyPrompt', {
          amount: format(player.ambrosia, 0, true)
        })
      )
    )

    if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
      // nan + Infinity checks
      return Alert(i18next.t('general.validation.finite'))
    }

    if (buy === -1) {
      ambrosiaBudget = player.ambrosia
    } else if (buy <= 0) {
      return Alert(i18next.t('octeract.buyLevel.cancelPurchase'))
    } else {
      ambrosiaBudget = buy
    }
    ambrosiaBudget = Math.min(player.ambrosia, ambrosiaBudget)
  }

  if (upgrade.maxLevel > 0) {
    maxPurchasable = Math.min(maxPurchasable, upgrade.maxLevel - upgrade.level)
  }

  if (maxPurchasable === 0) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  while (maxPurchasable > 0) {
    const cost = getAmbrosiaUpgradeCostTNL(upgradeKey)
    if (player.ambrosia < cost || ambrosiaBudget < cost) {
      break
    } else {
      if (upgrade.level === 0) {
        const availableBlueberries = calculateBlueberryInventory() - player.spentBlueberries
        if (availableBlueberries < upgrade.blueberryCost) {
          return Alert(i18next.t('ambrosia.notEnoughBlueberries'))
        } else {
          player.spentBlueberries += upgrade.blueberryCost
          upgrade.blueberriesInvested = upgrade.blueberryCost
        }
      }
      player.ambrosia -= cost
      ambrosiaBudget -= cost
      upgrade.ambrosiaInvested += cost
      upgrade.level += 1
      purchased += 1
      maxPurchasable -= 1
    }
  }

  if (purchased === 0) {
    return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
  }
  if (purchased > 1) {
    return Alert(
      `${i18next.t('octeract.buyLevel.multiBuy', { n: format(purchased) })}`
    )
  }
}

export const displayProperLoadoutCount = () => {
  const loadoutCount = 8 + PCoinUpgradeEffects.AMBROSIA_LOADOUT_SLOT_QOL
  assert(loadoutCount <= 16, 'Yeah. Nice try.')

  for (let i = 1; i <= 16; i++) {
    const elm = DOMCacheGetOrSet(`blueberryLoadout${i}`)
    if (i <= loadoutCount) {
      elm.style.display = 'flex'
    } else {
      elm.style.display = 'none'
    }
  }
}

export const resetBlueberryTree = (giveAlert = true) => {
  for (const k of Object.keys(ambrosiaUpgrades) as AmbrosiaUpgradeNames[]) {
    ambrosiaUpgrades[k].level = 0
    ambrosiaUpgrades[k].ambrosiaInvested = 0
    ambrosiaUpgrades[k].blueberriesInvested = 0
    player.ambrosiaUpgrades[k].ambrosiaInvested = 0
    player.ambrosiaUpgrades[k].blueberriesInvested = 0
  }
  player.ambrosia = player.lifetimeAmbrosia
  player.spentBlueberries = 0
  if (giveAlert) return Alert(i18next.t('ambrosia.refund'))
}

export const validateBlueberryTree = (modules: BlueberryOpt) => {
  // Check for empty object (perhaps from the loadouts?)
  if (Object.keys(modules).length === 0) {
    return false
  }

  const ambrosiaBudget = player.lifetimeAmbrosia
  const blueberryBudget = calculateBlueberryInventory()

  let spentAmbrosia = 0
  let spentBlueberries = 0

  let meetsPrerequisites = true
  let meetsAmbrosia = true
  let meetsBlueberries = true

  for (const [key, val] of Object.entries(modules)) {
    const k = key as AmbrosiaUpgradeNames

    // Nix malicious or bad values
    if (
      val! < 0
      || !Number.isFinite(val)
      || !Number.isInteger(val)
      || Number.isNaN(val)
    ) {
      return false
    }
    // Nix nonexistent modules
    if (ambrosiaUpgrades[k] === undefined) return false

    // Set val to max if it exceeds it, since it is possible module caps change over time.
    const effectiveVal = Math.min(ambrosiaUpgrades[k].maxLevel, val!)

    // Check prereq for this specific module
    const prereqs = ambrosiaUpgrades[k].prerequisites
    if (prereqs !== undefined && val! > 0) {
      for (const [key2, val2] of Object.entries(prereqs)) {
        const k2 = key2 as keyof BlueberryOpt
        const level = modules[k2]
          ?? -1 /* If undefined, this is saying 'We need to have module
        set to level val2 but it isn't even in our module loadout, so it cannot possibly satisfy prereqs'*/

        if (level < val2!) {
          meetsPrerequisites = false
        }
      }
    }

    // Check blueberry costs
    if (effectiveVal > 0) {
      spentBlueberries += ambrosiaUpgrades[k].blueberryCost
    }

    // Check ambrosia costs
    if (effectiveVal > 0) {
      const valFunc = ambrosiaUpgrades[k].costFormula
      const baseCost = ambrosiaUpgrades[k].costPerLevel
      let tempCost = 0
      for (let i = 0; i < val!; i++) {
        tempCost += valFunc(i, baseCost)
      }
      spentAmbrosia += tempCost
    }
  }

  meetsAmbrosia = ambrosiaBudget >= spentAmbrosia
  meetsBlueberries = blueberryBudget >= spentBlueberries

  return meetsPrerequisites && meetsAmbrosia && meetsBlueberries
}

export const getBlueberryTree = () => {
  return Object.fromEntries(
    Object.entries(ambrosiaUpgrades).map(([key, value]) => {
      return [key, value.level]
    })
  ) as BlueberryOpt
}

export const fixBlueberryLevel = (modules: BlueberryOpt) => {
  return Object.fromEntries(
    Object.entries(modules).map(([key, value]) => {
      const k = key as AmbrosiaUpgradeNames
      return [k, Math.min(value!, ambrosiaUpgrades[k].maxLevel)]
    })
  )
}

export const exportBlueberryTree = () => {
  const modules = getBlueberryTree()
  const save = JSON.stringify(modules)
  const name = `BBTree-${saveFilename()}`
  void exportData(save, name)
}

export const createBlueberryTree = (modules: BlueberryOpt) => {
  // Check to see if tree being created is valid.
  const isPossible = validateBlueberryTree(modules)
  if (!isPossible) {
    void Alert(i18next.t('ambrosia.importTree.failure'))
    return
  }

  // If valid, we will create the tree.
  // Refund (reset) the tree!
  resetBlueberryTree(false) // no alert; return type is undefined

  // Fix blueberry levels on a valid tree (not done by validation)
  const actualModules = fixBlueberryLevel(modules)

  for (const [key, val] of Object.entries(actualModules)) {
    const k = key as AmbrosiaUpgradeNames
    const { costFormula, costPerLevel, blueberryCost } = ambrosiaUpgrades[k]

    if (val > 0) {
      ambrosiaUpgrades[k].blueberriesInvested = blueberryCost
      player.spentBlueberries += blueberryCost
      let tempCost = 0
      for (let i = 0; i < val; i++) {
        tempCost += costFormula(i, costPerLevel)
      }
      player.ambrosia -= tempCost
      ambrosiaUpgrades[k].ambrosiaInvested = tempCost
      ambrosiaUpgrades[k].level = val
    }
  }
  void Alert(i18next.t('ambrosia.importTree.success'))
}

export const importBlueberryTree = (input: string | null) => {
  if (typeof input !== 'string') {
    return Alert(i18next.t('importexport.unableImport'))
  } else {
    try {
      const modules = JSON.parse(input) as BlueberryOpt
      createBlueberryTree(modules)
      createLoadoutDescription(0, modules)
    } catch (err) {
      return Alert(i18next.t('ambrosia.importTree.error'))
    }
  }
}

export const loadoutHandler = (n: number, modules: BlueberryOpt) => {
  if (player.blueberryLoadoutMode === 'saveTree') {
    saveBlueberryTree(n, modules)
  }
  if (player.blueberryLoadoutMode === 'loadTree') {
    createBlueberryTree(modules)
  }
}

export const saveBlueberryTree = async (
  input: number,
  previous: BlueberryOpt
) => {
  if (Object.keys(previous).length > 0) {
    const p = await Confirm(i18next.t('ambrosia.loadouts.confirmation'))
    if (!p) return
  }

  player.blueberryLoadouts[input] = getBlueberryTree()
  createLoadoutDescription(input, player.blueberryLoadouts[input])
}

export const createLoadoutDescription = (
  input: number,
  modules: BlueberryOpt
) => {
  let str = ''
  for (const [key, val] of Object.entries(modules)) {
    /*
     * If the entry (saved purchase level) for an upgrade is 0, undefined, or null, we skip it.
     * If 0 - it existed when the loadout was saved; it's just unpurchased
     * If undefined - it's new, so it's unpurchased - the user couldn't have saved it to a loadout yet
     * I don't think anything sets an upgrade to null... but we may as well skip then too.
     */
    if (!val) continue

    const k = key as AmbrosiaUpgradeNames
    const name = ambrosiaUpgrades[k].name()
    str = `${str}<span style="color:orange">${name}</span> <span style="color:yellow">lv${val}</span> | `
  }

  if (Object.keys(modules).length === 0) {
    str = i18next.t('ambrosia.loadouts.none')
  }

  let loadoutTitle = `${i18next.t('ambrosia.loadouts.loadout')} ${input}`
  if (input === 0) {
    loadoutTitle = i18next.t('ambrosia.loadouts.imported')
  }
  DOMCacheGetOrSet('singularityAmbrosiaMultiline').innerHTML = ` ${loadoutTitle}
  ${str}`
}

export const updateBlueberryLoadoutCount = () => {
  const maxLoadouts = 16
  const loadoutCount = Object.keys(player.blueberryLoadouts).length

  if (loadoutCount < maxLoadouts) {
    for (let i = loadoutCount + 1; i <= maxLoadouts; i++) {
      player.blueberryLoadouts[i] = {}
    }
  }
}

export const highlightPrerequisites = (k: AmbrosiaUpgradeNames) => {
  const preReq = ambrosiaUpgrades[k].prerequisites
  if (preReq === undefined) return

  for (const key of Object.keys(ambrosiaUpgrades)) {
    const k2 = key as AmbrosiaUpgradeNames
    const elm = DOMCacheGetOrSet(k2)
    const img = elm.querySelector('img') as HTMLImageElement
    if (preReq[k2] !== undefined) {
      img.classList.add('blueberryPrereq')
    } else {
      img.classList.remove('blueberryPrereq')
    }
  }
}

export const resetHighlights = () => {
  for (const key of Object.keys(ambrosiaUpgrades)) {
    const k = key as AmbrosiaUpgradeNames
    const elm = DOMCacheGetOrSet(k)
    const img = elm.querySelector('img') as HTMLImageElement
    img.classList.remove('blueberryPrereq')
  }
}

export const displayOnlyLoadout = (loadout: BlueberryOpt) => {
  const loadoutKeys = Object.keys(loadout)

  for (const key of Object.keys(ambrosiaUpgrades)) {
    const k = key as AmbrosiaUpgradeNames
    const elm = DOMCacheGetOrSet(k)
    const img = elm.querySelector('img') as HTMLImageElement
    const level = loadout[k] || 0 // Get the level from the loadout, default to 0 if not present

    let levelOverlay = elm.querySelector('.level-overlay') as HTMLDivElement
    if (!levelOverlay) {
      levelOverlay = document.createElement('div') // Changed from 'p' to 'div'
      levelOverlay.classList.add('level-overlay')
      elm.classList.add('relative-container') // Apply relative container to the element
      elm.appendChild(levelOverlay) // Append to the element
    }

    if (loadoutKeys.includes(k) && level > 0) {
      img.classList.add('dimmed') // Apply the dimmed class
      levelOverlay.textContent = String(level) // Set the level text
      if (level === ambrosiaUpgrades[k].maxLevel) {
        levelOverlay.classList.add('maxBlueberryLevel')
      }
    } else {
      img.classList.add('superDimmed')
      levelOverlay!.textContent = ''
    }
  }
}

export const resetLoadoutOnlyDisplay = () => {
  for (const key of Object.keys(ambrosiaUpgrades)) {
    const k = key as AmbrosiaUpgradeNames
    const elm = DOMCacheGetOrSet(k)
    const img = elm.querySelector('img') as HTMLImageElement
    img.classList.remove('dimmed') // Remove the dimmed class
    img.classList.remove('superDimmed') // Remove the superDimmed class

    // Remove the level overlay if it exists
    const levelOverlay = elm.querySelector('.level-overlay')
    if (levelOverlay) {
      levelOverlay.remove()
      elm.classList.remove('relative-container') // Remove relative container
    }
  }
}

export const displayLevelsBlueberry = () => {
  const curr = getBlueberryTree()
  displayOnlyLoadout(curr)
}
