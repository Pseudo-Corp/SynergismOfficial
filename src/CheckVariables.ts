import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { type IBlueberryData, updateLoadoutHoverClasses } from './BlueberryUpgrades'
import { BlueberryUpgrade, blueberryUpgradeData } from './BlueberryUpgrades'
import { calculateMaxRunes, calculateTimeAcceleration } from './Calculate'
import { testing } from './Config'
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from './CubeExperimental'
import {
  AbyssHepteract,
  AcceleratorBoostHepteract,
  AcceleratorHepteract,
  ChallengeHepteract,
  ChronosHepteract,
  createHepteract,
  HyperrealismHepteract,
  MultiplierHepteract,
  QuarkHepteract
} from './Hepteracts'
import type { IOcteractData } from './Octeracts'
import { octeractData, OcteractUpgrade } from './Octeracts'
import { buyResearch } from './Research'
import { getQuarkInvestment, shopData } from './Shop'
import type { ISingularityData } from './singularity'
import { singularityData, SingularityUpgrade } from './singularity'
import type { ISingularityChallengeData } from './SingularityChallenges'
import { SingularityChallenge, singularityChallengeData } from './SingularityChallenges'
import {
  AmbrosiaGenerationCache,
  AmbrosiaLuckAdditiveMultCache,
  AmbrosiaLuckCache,
  BlueberryInventoryCache,
  cacheReinitialize
} from './StatCache'
import { c15RewardUpdate } from './Statistics'
import { blankSave, player, resetCheck } from './Synergism'
import type { LegacyShopUpgrades, PlayerSave } from './types/LegacySynergism'
import type { Player } from './types/Synergism'
import { Alert } from './UpdateHTML'
import { padArray } from './Utility'
import { Globals } from './Variables'

/**
 * Given player data, it checks, on load if variables are undefined
 * or set incorrectly, and corrects it. This should be where all new
 * variable declarations for `player` should go!
 * @param data
 */
export const checkVariablesOnLoad = (data: PlayerSave) => {
  if (data.currentChallenge?.transcension === undefined) {
    player.currentChallenge = {
      transcension: 0,
      reincarnation: 0,
      ascension: 0
    }
  }

  data.shopUpgrades ??= { ...blankSave.shopUpgrades }
  data.ascStatToggles ??= { ...blankSave.ascStatToggles }

  if (
    typeof data.promoCodeTiming === 'object'
    && data.promoCodeTiming != null
  ) {
    for (const key of Object.keys(data.promoCodeTiming)) {
      const k = key as keyof typeof data.promoCodeTiming
      player.promoCodeTiming[k] = data.promoCodeTiming[k]
    }
  } else {
    player.promoCodeTiming.time = Date.now() - 60 * 1000 * 15
  }

  // backwards compatibility for v1.0101 (and possibly older) saves
  if (
    !Array.isArray(data.challengecompletions)
    && data.challengecompletions != null
  ) {
    player.challengecompletions = Object.values(data.challengecompletions)
    padArray(
      player.challengecompletions,
      0,
      blankSave.challengecompletions.length
    )
  }

  // backwards compatibility for v1.0101 (and possibly older) saves
  if (!Array.isArray(data.highestchallengecompletions)) {
    // if highestchallengecompletions is every added onto, this will need to be padded.
    player.highestchallengecompletions = Object.values(
      data.highestchallengecompletions as unknown as object
    ) as number[]
  }

  if (data.wowCubes === undefined) {
    player.wowCubes = new WowCubes()
    player.wowTesseracts = new WowTesseracts(0)
    player.wowHypercubes = new WowHypercubes(0)
    // dprint-ignore
    player.cubeUpgrades = [
      null,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
  }
  if (data.shoptoggles?.reincarnate === undefined) {
    player.shoptoggles.reincarnate = true
  }
  if (data.ascendBuilding1 === undefined) {
    player.ascendBuilding1 = {
      cost: 1,
      owned: 0,
      generated: new Decimal('0'),
      multiplier: 0.01
    }
    player.ascendBuilding2 = {
      cost: 10,
      owned: 0,
      generated: new Decimal('0'),
      multiplier: 0.01
    }
    player.ascendBuilding3 = {
      cost: 100,
      owned: 0,
      generated: new Decimal('0'),
      multiplier: 0.01
    }
    player.ascendBuilding4 = {
      cost: 1000,
      owned: 0,
      generated: new Decimal('0'),
      multiplier: 0.01
    }
    player.ascendBuilding5 = {
      cost: 10000,
      owned: 0,
      generated: new Decimal('0'),
      multiplier: 0.01
    }
  }
  if (data.tesseractbuyamount === undefined) {
    player.tesseractbuyamount = 1
  }
  if (data.tesseractBlessings === undefined) {
    player.tesseractBlessings = {
      accelerator: 0,
      multiplier: 0,
      offering: 0,
      runeExp: 0,
      obtainium: 0,
      antSpeed: 0,
      antSacrifice: 0,
      antELO: 0,
      talismanBonus: 0,
      globalSpeed: 0
    }
    player.hypercubeBlessings = {
      accelerator: 0,
      multiplier: 0,
      offering: 0,
      runeExp: 0,
      obtainium: 0,
      antSpeed: 0,
      antSacrifice: 0,
      antELO: 0,
      talismanBonus: 0,
      globalSpeed: 0
    }
  }
  if (data.prototypeCorruptions === undefined) {
    player.prototypeCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    player.usedCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
  if (data.constantUpgrades === undefined) {
    player.ascendShards = new Decimal('0')
    player.constantUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
  if (data.roombaResearchIndex === undefined) {
    player.roombaResearchIndex = 0
  }
  if (data.history === undefined) {
    player.history = { ants: [], ascend: [], reset: [], singularity: [] }
  }
  if (data.autoChallengeRunning === undefined) {
    player.autoChallengeRunning = false
    player.autoChallengeIndex = 1
    // dprint-ignore
    player.autoChallengeToggles = [
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ];
    player.autoChallengeStartExponent = 10
    player.autoChallengeTimer = {
      start: 10,
      exit: 2,
      enter: 2
    }
  }
  if (data.autoAscend === undefined) {
    player.autoAscend = false
    player.autoAscendMode = 'c10Completions'
    player.autoAscendThreshold = 1
  }
  if (data.runeBlessingLevels === undefined) {
    player.runeBlessingLevels = [0, 0, 0, 0, 0, 0]
    player.runeSpiritLevels = [0, 0, 0, 0, 0, 0]
    player.runeBlessingBuyAmount = 0
    player.runeSpiritBuyAmount = 0
  }
  if (data.autoBuyFragment === undefined) {
    player.autoBuyFragment = false
    player.saveOfferingToggle = false
  }

  if (data.autoTesseracts === undefined) {
    player.autoTesseracts = [false, false, false, false, false, false]
  }

  if (data.autoOpenCubes === undefined) {
    player.autoOpenCubes = false
    player.openCubes = 0
  }
  if (data.autoOpenTesseracts === undefined) {
    player.autoOpenTesseracts = false
    player.openTesseracts = 0
  }
  if (data.autoOpenHypercubes === undefined) {
    player.autoOpenHypercubes = false
    player.openHypercubes = 0
  }
  if (data.autoOpenPlatonicsCubes === undefined) {
    player.autoOpenPlatonicsCubes = false
    player.openPlatonicsCubes = 0
  }

  if (
    player.prototypeCorruptions[0] === null
    || player.prototypeCorruptions[0] === undefined
  ) {
    player.usedCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    player.prototypeCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  if (player.corruptionLoadouts === undefined) {
    player.corruptionLoadouts = { ...blankSave.corruptionLoadouts }
    player.corruptionShowStats = true
  }

  const corruptionLoadouts = Object.keys(
    blankSave.corruptionLoadouts
  ) as `${keyof Player['corruptionLoadouts']}`[]

  for (const key of corruptionLoadouts.map((k) => Number(k))) {
    if (player.corruptionLoadouts[key] !== undefined) {
      continue
    }

    player.corruptionLoadouts[key] = blankSave.corruptionLoadouts[key]
  }

  if (
    player.corruptionLoadoutNames.length
      < blankSave.corruptionLoadoutNames.length
  ) {
    const diff = blankSave.corruptionLoadoutNames.slice(
      player.corruptionLoadoutNames.length
    )

    player.corruptionLoadoutNames.push(...diff)
  }

  for (let i = 0; i <= 4; i++) {
    if (player.runelevels[i] > calculateMaxRunes(i + 1)) {
      player.runelevels[i] = 0
    }
  }

  if (data.shopUpgrades.challengeExtension === undefined) {
    player.shopUpgrades.challengeExtension = 0
    player.shopUpgrades.challengeTome = 0
    player.shopUpgrades.seasonPass = 0
    player.shopUpgrades.cubeToQuark = 0
    player.shopUpgrades.tesseractToQuark = 0
    player.shopUpgrades.hypercubeToQuark = 0
  }
  if (
    data.cubeUpgrades == null
    || data.cubeUpgrades[19] === 0
    || player.cubeUpgrades[19] === 0
  ) {
    for (let i = 121; i <= 125; i++) {
      player.upgrades[i] = 0
    }
  }

  // assign the save's toggles to the player toggles
  // will overwrite player.toggles keys that exist on both objects,
  // but new keys will default to the values on the player object
  Object.assign(player.toggles, data.toggles)

  for (const key in blankSave.toggles) {
    if (player.toggles[key] === undefined) {
      player.toggles[key] = blankSave.toggles[key]
    }
  }

  if (data.dayCheck === undefined) {
    player.dayCheck = null
    player.dayTimer = 0
    player.cubeQuarkDaily = 0
    player.tesseractQuarkDaily = 0
    player.hypercubeQuarkDaily = 0
    player.cubeOpenedDaily = 0
    player.tesseractOpenedDaily = 0
    player.hypercubeOpenedDaily = 0
  }

  player.singularityUpgrades = {
    goldenQuarks1: new SingularityUpgrade(
      singularityData.goldenQuarks1,
      'goldenQuarks1'
    ),
    goldenQuarks2: new SingularityUpgrade(
      singularityData.goldenQuarks2,
      'goldenQuarks2'
    ),
    goldenQuarks3: new SingularityUpgrade(
      singularityData.goldenQuarks3,
      'goldenQuarks3'
    ),
    starterPack: new SingularityUpgrade(
      singularityData.starterPack,
      'starterPack'
    ),
    wowPass: new SingularityUpgrade(singularityData.wowPass, 'wowPass'),
    cookies: new SingularityUpgrade(singularityData.cookies, 'cookies'),
    cookies2: new SingularityUpgrade(singularityData.cookies2, 'cookies2'),
    cookies3: new SingularityUpgrade(singularityData.cookies3, 'cookies3'),
    cookies4: new SingularityUpgrade(singularityData.cookies4, 'cookies4'),
    cookies5: new SingularityUpgrade(singularityData.cookies5, 'cookies5'),
    ascensions: new SingularityUpgrade(
      singularityData.ascensions,
      'ascensions'
    ),
    corruptionFourteen: new SingularityUpgrade(
      singularityData.corruptionFourteen,
      'corruptionFourteen'
    ),
    corruptionFifteen: new SingularityUpgrade(
      singularityData.corruptionFifteen,
      'corruptionFifteen'
    ),
    singOfferings1: new SingularityUpgrade(
      singularityData.singOfferings1,
      'singOfferings1'
    ),
    singOfferings2: new SingularityUpgrade(
      singularityData.singOfferings2,
      'singOfferings2'
    ),
    singOfferings3: new SingularityUpgrade(
      singularityData.singOfferings3,
      'singOfferings3'
    ),
    singObtainium1: new SingularityUpgrade(
      singularityData.singObtainium1,
      'singObtainium1'
    ),
    singObtainium2: new SingularityUpgrade(
      singularityData.singObtainium2,
      'singObtainium2'
    ),
    singObtainium3: new SingularityUpgrade(
      singularityData.singObtainium3,
      'singObtainium3'
    ),
    singCubes1: new SingularityUpgrade(
      singularityData.singCubes1,
      'singCubes1'
    ),
    singCubes2: new SingularityUpgrade(
      singularityData.singCubes2,
      'singCubes2'
    ),
    singCubes3: new SingularityUpgrade(
      singularityData.singCubes3,
      'singCubes3'
    ),
    singCitadel: new SingularityUpgrade(
      singularityData.singCitadel,
      'singCitadel'
    ),
    singCitadel2: new SingularityUpgrade(
      singularityData.singCitadel2,
      'singCitadel2'
    ),
    octeractUnlock: new SingularityUpgrade(
      singularityData.octeractUnlock,
      'octeractUnlock'
    ),
    singOcteractPatreonBonus: new SingularityUpgrade(
      singularityData.singOcteractPatreonBonus,
      'singOcteractPatreonBonus'
    ),
    intermediatePack: new SingularityUpgrade(
      singularityData.intermediatePack,
      'intermediatePack'
    ),
    advancedPack: new SingularityUpgrade(
      singularityData.advancedPack,
      'advancedPack'
    ),
    expertPack: new SingularityUpgrade(
      singularityData.expertPack,
      'expertPack'
    ),
    masterPack: new SingularityUpgrade(
      singularityData.masterPack,
      'masterPack'
    ),
    divinePack: new SingularityUpgrade(
      singularityData.divinePack,
      'divinePack'
    ),
    wowPass2: new SingularityUpgrade(singularityData.wowPass2, 'wowPass2'),
    potionBuff: new SingularityUpgrade(
      singularityData.potionBuff,
      'potionBuff'
    ),
    potionBuff2: new SingularityUpgrade(
      singularityData.potionBuff2,
      'potionBuff2'
    ),
    potionBuff3: new SingularityUpgrade(
      singularityData.potionBuff3,
      'potionBuff3'
    ),
    singChallengeExtension: new SingularityUpgrade(
      singularityData.singChallengeExtension,
      'singChallengeExtension'
    ),
    singChallengeExtension2: new SingularityUpgrade(
      singularityData.singChallengeExtension2,
      'singChallengeExtension2'
    ),
    singChallengeExtension3: new SingularityUpgrade(
      singularityData.singChallengeExtension3,
      'singChallengeExtension3'
    ),
    singQuarkImprover1: new SingularityUpgrade(
      singularityData.singQuarkImprover1,
      'singQuarkImprover1'
    ),
    singQuarkHepteract: new SingularityUpgrade(
      singularityData.singQuarkHepteract,
      'singQuarkHepteract'
    ),
    singQuarkHepteract2: new SingularityUpgrade(
      singularityData.singQuarkHepteract2,
      'singQuarkHepteract2'
    ),
    singQuarkHepteract3: new SingularityUpgrade(
      singularityData.singQuarkHepteract3,
      'singQuarkHepteract3'
    ),
    singOcteractGain: new SingularityUpgrade(
      singularityData.singOcteractGain,
      'singOcteractGain'
    ),
    singOcteractGain2: new SingularityUpgrade(
      singularityData.singOcteractGain2,
      'singOcteractGain2'
    ),
    singOcteractGain3: new SingularityUpgrade(
      singularityData.singOcteractGain3,
      'singOcteractGain3'
    ),
    singOcteractGain4: new SingularityUpgrade(
      singularityData.singOcteractGain4,
      'singOcteractGain4'
    ),
    singOcteractGain5: new SingularityUpgrade(
      singularityData.singOcteractGain5,
      'singOcteractGain5'
    ),
    wowPass3: new SingularityUpgrade(singularityData.wowPass3, 'wowPass3'),
    ultimatePen: new SingularityUpgrade(
      singularityData.ultimatePen,
      'ultimatePen'
    ),
    platonicTau: new SingularityUpgrade(
      singularityData.platonicTau,
      'platonicTau'
    ),
    platonicAlpha: new SingularityUpgrade(
      singularityData.platonicAlpha,
      'platonicAlpha'
    ),
    platonicDelta: new SingularityUpgrade(
      singularityData.platonicDelta,
      'platonicDelta'
    ),
    platonicPhi: new SingularityUpgrade(
      singularityData.platonicPhi,
      'platonicPhi'
    ),
    singFastForward: new SingularityUpgrade(
      singularityData.singFastForward,
      'singFastForward'
    ),
    singFastForward2: new SingularityUpgrade(
      singularityData.singFastForward2,
      'singFastForward2'
    ),
    singAscensionSpeed: new SingularityUpgrade(
      singularityData.singAscensionSpeed,
      'singAscensionSpeed'
    ),
    singAscensionSpeed2: new SingularityUpgrade(
      singularityData.singAscensionSpeed2,
      'singAscensionSpeed2'
    ),
    oneMind: new SingularityUpgrade(singularityData.oneMind, 'oneMind'),
    wowPass4: new SingularityUpgrade(singularityData.wowPass4, 'wowPass4'),
    offeringAutomatic: new SingularityUpgrade(
      singularityData.offeringAutomatic,
      'offeringAutomatic'
    ),
    blueberries: new SingularityUpgrade(
      singularityData.blueberries,
      'blueberries'
    ),
    singAmbrosiaLuck: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck,
      'singAmbrosiaLuck'
    ),
    singAmbrosiaLuck2: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck2,
      'singAmbrosiaLuck2'
    ),
    singAmbrosiaLuck3: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck3,
      'singAmbrosiaLuck3'
    ),
    singAmbrosiaLuck4: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck4,
      'singAmbrosiaLuck4'
    ),
    singAmbrosiaGeneration: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration,
      'singAmbrosiaGeneration'
    ),
    singAmbrosiaGeneration2: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration2,
      'singAmbrosiaGeneration2'
    ),
    singAmbrosiaGeneration3: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration3,
      'singAmbrosiaGeneration3'
    ),
    singAmbrosiaGeneration4: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration4,
      'singAmbrosiaGeneration4'
    )
  }

  player.octeractUpgrades = {
    octeractStarter: new OcteractUpgrade(
      octeractData.octeractStarter,
      'octeractStarter'
    ),
    octeractGain: new OcteractUpgrade(
      octeractData.octeractGain,
      'octeractGain'
    ),
    octeractGain2: new OcteractUpgrade(
      octeractData.octeractGain2,
      'octeractGain2'
    ),
    octeractQuarkGain: new OcteractUpgrade(
      octeractData.octeractQuarkGain,
      'octeractQuarkGain'
    ),
    octeractQuarkGain2: new OcteractUpgrade(
      octeractData.octeractQuarkGain2,
      'octeractQuarkGain2'
    ),
    octeractCorruption: new OcteractUpgrade(
      octeractData.octeractCorruption,
      'octeractCorruption'
    ),
    octeractGQCostReduce: new OcteractUpgrade(
      octeractData.octeractGQCostReduce,
      'octeractGQCostReduce'
    ),
    octeractExportQuarks: new OcteractUpgrade(
      octeractData.octeractExportQuarks,
      'octeractExportQuarks'
    ),
    octeractImprovedDaily: new OcteractUpgrade(
      octeractData.octeractImprovedDaily,
      'octeractImprovedDaily'
    ),
    octeractImprovedDaily2: new OcteractUpgrade(
      octeractData.octeractImprovedDaily2,
      'octeractImprovedDaily2'
    ),
    octeractImprovedDaily3: new OcteractUpgrade(
      octeractData.octeractImprovedDaily3,
      'octeractImprovedDaily3'
    ),
    octeractImprovedQuarkHept: new OcteractUpgrade(
      octeractData.octeractImprovedQuarkHept,
      'octeractImprovedQuarkHept'
    ),
    octeractImprovedGlobalSpeed: new OcteractUpgrade(
      octeractData.octeractImprovedGlobalSpeed,
      'octeractImprovedGlobalSpeed'
    ),
    octeractImprovedAscensionSpeed: new OcteractUpgrade(
      octeractData.octeractImprovedAscensionSpeed,
      'octeractImprovedAscensionSpeed'
    ),
    octeractImprovedAscensionSpeed2: new OcteractUpgrade(
      octeractData.octeractImprovedAscensionSpeed2,
      'octeractImprovedAscensionSpeed2'
    ),
    octeractImprovedFree: new OcteractUpgrade(
      octeractData.octeractImprovedFree,
      'octeractImprovedFree'
    ),
    octeractImprovedFree2: new OcteractUpgrade(
      octeractData.octeractImprovedFree2,
      'octeractImprovedFree2'
    ),
    octeractImprovedFree3: new OcteractUpgrade(
      octeractData.octeractImprovedFree3,
      'octeractImprovedFree3'
    ),
    octeractImprovedFree4: new OcteractUpgrade(
      octeractData.octeractImprovedFree4,
      'octeractImprovedFree4'
    ),
    octeractSingUpgradeCap: new OcteractUpgrade(
      octeractData.octeractSingUpgradeCap,
      'octeractSingUpgradeCap'
    ),
    octeractOfferings1: new OcteractUpgrade(
      octeractData.octeractOfferings1,
      'octeractOfferings1'
    ),
    octeractObtainium1: new OcteractUpgrade(
      octeractData.octeractObtainium1,
      'octeractObtainium1'
    ),
    octeractAscensions: new OcteractUpgrade(
      octeractData.octeractAscensions,
      'octeractAscensions'
    ),
    octeractAscensions2: new OcteractUpgrade(
      octeractData.octeractAscensions2,
      'octeractAscensions2'
    ),
    octeractAscensionsOcteractGain: new OcteractUpgrade(
      octeractData.octeractAscensionsOcteractGain,
      'octeractAscensionsOcteractGain'
    ),
    octeractFastForward: new OcteractUpgrade(
      octeractData.octeractFastForward,
      'octeractFastForward'
    ),
    octeractAutoPotionSpeed: new OcteractUpgrade(
      octeractData.octeractAutoPotionSpeed,
      'octeractAutoPotionSpeed'
    ),
    octeractAutoPotionEfficiency: new OcteractUpgrade(
      octeractData.octeractAutoPotionEfficiency,
      'octeractAutoPotionEfficiency'
    ),
    octeractOneMindImprover: new OcteractUpgrade(
      octeractData.octeractOneMindImprover,
      'octeractOneMindImprover'
    ),
    octeractAmbrosiaLuck: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck,
      'octeractAmbrosiaLuck'
    ),
    octeractAmbrosiaLuck2: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck2,
      'octeractAmbrosiaLuck2'
    ),
    octeractAmbrosiaLuck3: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck3,
      'octeractAmbrosiaLuck3'
    ),
    octeractAmbrosiaLuck4: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck4,
      'octeractAmbrosiaLuck4'
    ),
    octeractAmbrosiaGeneration: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration,
      'octeractAmbrosiaGeneration'
    ),
    octeractAmbrosiaGeneration2: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration2,
      'octeractAmbrosiaGeneration2'
    ),
    octeractAmbrosiaGeneration3: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration3,
      'octeractAmbrosiaGeneration3'
    ),
    octeractAmbrosiaGeneration4: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration4,
      'octeractAmbrosiaGeneration4'
    )
  }

  player.singularityChallenges = {
    noSingularityUpgrades: new SingularityChallenge(
      singularityChallengeData.noSingularityUpgrades,
      'noSingularityUpgrades'
    ),
    oneChallengeCap: new SingularityChallenge(
      singularityChallengeData.oneChallengeCap,
      'oneChallengeCap'
    ),
    noOcteracts: new SingularityChallenge(
      singularityChallengeData.noOcteracts,
      'noOcteracts'
    ),
    limitedAscensions: new SingularityChallenge(
      singularityChallengeData.limitedAscensions,
      'limitedAscensions'
    ),
    noAmbrosiaUpgrades: new SingularityChallenge(
      singularityChallengeData.noAmbrosiaUpgrades,
      'noAmbrosiaUpgrades'
    )
  }

  player.blueberryUpgrades = {
    ambrosiaTutorial: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaTutorial,
      'ambrosiaTutorial'
    ),
    ambrosiaQuarks1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarks1,
      'ambrosiaQuarks1'
    ),
    ambrosiaCubes1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubes1,
      'ambrosiaQuarks1'
    ),
    ambrosiaLuck1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuck1,
      'ambrosiaLuck1'
    ),
    ambrosiaCubeQuark1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubeQuark1,
      'ambrosiaCubeQuark1'
    ),
    ambrosiaLuckQuark1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuckQuark1,
      'ambrosiaLuckQuark1'
    ),
    ambrosiaLuckCube1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuckCube1,
      'ambrosiaLuckCube1'
    ),
    ambrosiaQuarkCube1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarkCube1,
      'ambrosiaQuarkCube1'
    ),
    ambrosiaCubeLuck1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubeLuck1,
      'ambrosiaCubeLuck1'
    ),
    ambrosiaQuarkLuck1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarkLuck1,
      'ambrosiaQuarkLuck1'
    ),
    ambrosiaQuarks2: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarks2,
      'ambrosiaQuarks2'
    ),
    ambrosiaCubes2: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubes2,
      'ambrosiaQuarks2'
    ),
    ambrosiaLuck2: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuck2,
      'ambrosiaLuck2'
    ),
    ambrosiaPatreon: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaPatreon,
      'ambrosiaPatreon'
    ),
    ambrosiaObtainium1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaObtainium1,
      'ambrosiaObtainium1'
    ),
    ambrosiaOffering1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaOffering1,
      'ambrosiaOffering1'
    ),
    ambrosiaHyperflux: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaHyperflux,
      'ambrosiaHyperflux'
    )
  }

  if (data.loadedOct4Hotfix === undefined || !player.loadedOct4Hotfix) {
    player.loadedOct4Hotfix = true
    // Only process refund if the save's researches array is already updated to v2
    if (player.researches.length > 200) {
      player.researchPoints += player.researches[200] * 1e56
      player.researches[200] = 0
      buyResearch(200, true, 0.01)
      player.researchPoints += player.researches[195] * 1e60
      player.worlds.add(250 * player.researches[195])
      player.researches[195] = 0
      player.wowCubes.add(player.cubeUpgrades[50] * 5e10)
      player.cubeUpgrades[50] = 0
    }
  }

  if (
    player.ascStatToggles === undefined
    || data.ascStatToggles === undefined
  ) {
    player.ascStatToggles = {
      1: false,
      2: false,
      3: false,
      4: false
    }
  }
  if (
    player.ascStatToggles[4] === undefined
    || !('ascStatToggles' in data)
    || data.ascStatToggles[4] === undefined
  ) {
    player.ascStatToggles[4] = false
  }

  if (
    player.usedCorruptions[0] > 0
    || (Array.isArray(data.usedCorruptions) && data.usedCorruptions[0] > 0)
  ) {
    player.prototypeCorruptions[0] = 0
    player.usedCorruptions[0] = 0
  }
  if (player.antSacrificeTimerReal === undefined) {
    player.antSacrificeTimerReal = player.antSacrificeTimer / calculateTimeAcceleration().mult
  }
  if (player.subtabNumber === undefined || data.subtabNumber === undefined) {
    player.subtabNumber = 0
  }
  if (data.wowPlatonicCubes === undefined) {
    player.wowPlatonicCubes = new WowPlatonicCubes(0)
    player.wowAbyssals = 0
  }
  if (data.platonicBlessings === undefined) {
    const ascCount = player.ascensionCount
    if (
      player.currentChallenge.ascension !== 0
      && player.currentChallenge.ascension !== 15
    ) {
      void resetCheck('ascensionChallenge', false, true)
    }
    if (player.currentChallenge.ascension === 15) {
      void resetCheck('ascensionChallenge', false, true)
      player.challenge15Exponent = 0
      c15RewardUpdate()
    }
    player.ascensionCount = ascCount
    player.challengecompletions[15] = 0
    player.highestchallengecompletions[15] = 0
    player.platonicBlessings = {
      cubes: 0,
      tesseracts: 0,
      hypercubes: 0,
      platonics: 0,
      hypercubeBonus: 0,
      taxes: 0,
      scoreBonus: 0,
      globalSpeed: 0
    }
    player.platonicUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    player.challenge15Exponent = 0
    player.loadedNov13Vers = false
  }
  if (player.researches.some((k) => typeof k !== 'number')) {
    for (let i = 0; i < 200; i++) {
      player.researches[i + 1] = player.researches[i + 1] || 0
    }
  }
  if (data.loadedDec16Vers === false || data.loadedDec16Vers === undefined) {
    if (player.currentChallenge.ascension === 15) {
      void resetCheck('ascensionChallenge', false, true)
      player.challenge15Exponent = 0
      c15RewardUpdate()
    }
    player.challenge15Exponent = 0
    c15RewardUpdate()
    player.loadedDec16Vers = true
  }

  // in old versions of the game (pre 2.5.0), the import function will only work
  // if this variable = "YES!". Don't ask Platonic why.
  if (typeof data.exporttest === 'string') {
    player.exporttest = !testing
  } else {
    player.exporttest = !!data.exporttest
  }

  const shop = data.shopUpgrades as LegacyShopUpgrades | Player['shopUpgrades']
  if (shop && 'offeringTimerLevel' in shop) {
    player.shopUpgrades = {
      offeringPotion: shop.offeringPotion,
      obtainiumPotion: shop.obtainiumPotion,
      offeringEX: 0,
      offeringAuto: Math.min(1, Number(shop.offeringAutoLevel)),
      obtainiumEX: 0,
      obtainiumAuto: Math.min(1, Number(shop.obtainiumAutoLevel)), // Number(shop.obtainiumAutoLevel),
      instantChallenge: Number(shop.instantChallengeBought),
      antSpeed: 0,
      cashGrab: 0,
      shopTalisman: Number(shop.talismanBought),
      seasonPass: 0,
      challengeExtension: shop.challengeExtension,
      challengeTome: 0, // This was shop.challenge10Tomes
      cubeToQuark: Number(shop.cubeToQuarkBought),
      tesseractToQuark: Number(shop.tesseractToQuarkBought),
      hypercubeToQuark: Number(shop.hypercubeToQuarkBought),
      seasonPass2: 0,
      seasonPass3: 0,
      chronometer: 0,
      infiniteAscent: 0,
      calculator: 0,
      calculator2: 0,
      calculator3: 0,
      calculator4: 0,
      calculator5: 0,
      calculator6: 0,
      calculator7: 0,
      constantEX: 0,
      powderEX: 0,
      chronometer2: 0,
      chronometer3: 0,
      seasonPassY: 0,
      seasonPassZ: 0,
      challengeTome2: 0,
      instantChallenge2: 0,
      cashGrab2: 0,
      cubeToQuarkAll: 0,
      obtainiumEX2: 0,
      offeringEX2: 0,
      powderAuto: 0,
      chronometerZ: 0,
      seasonPassLost: 0,
      challenge15Auto: 0,
      extraWarp: 0,
      autoWarp: 0,
      improveQuarkHept: 0,
      improveQuarkHept2: 0,
      improveQuarkHept3: 0,
      improveQuarkHept4: 0,
      shopImprovedDaily: 0,
      shopImprovedDaily2: 0,
      shopImprovedDaily3: 0,
      shopImprovedDaily4: 0,
      offeringEX3: 0,
      obtainiumEX3: 0,
      improveQuarkHept5: 0,
      seasonPassInfinity: 0,
      chronometerInfinity: 0,
      shopSingularityPenaltyDebuff: 0,
      shopAmbrosiaLuckMultiplier4: 0,
      shopOcteractAmbrosiaLuck: 0,
      shopAmbrosiaGeneration1: 0,
      shopAmbrosiaGeneration2: 0,
      shopAmbrosiaGeneration3: 0,
      shopAmbrosiaGeneration4: 0,
      shopAmbrosiaLuck1: 0,
      shopAmbrosiaLuck2: 0,
      shopAmbrosiaLuck3: 0,
      shopAmbrosiaLuck4: 0,
      shopCashGrabUltra: 0,
      shopAmbrosiaAccelerator: 0,
      shopEXUltra: 0,
    }

    player.worlds.add(
      150 * shop.offeringTimerLevel
        + (25 / 2) * (shop.offeringTimerLevel - 1) * shop.offeringTimerLevel,
      false
    )
    player.worlds.add(
      150 * shop.obtainiumTimerLevel
        + (25 / 2) * (shop.obtainiumTimerLevel - 1) * shop.obtainiumTimerLevel,
      false
    )
    player.worlds.add(
      150 * shop.offeringAutoLevel
        + (25 / 2) * (shop.offeringAutoLevel - 1) * shop.offeringAutoLevel
        - 150 * Math.min(1, shop.offeringAutoLevel),
      false
    )
    player.worlds.add(
      150 * shop.obtainiumAutoLevel
        + (25 / 2) * (shop.obtainiumAutoLevel - 1) * shop.obtainiumAutoLevel
        - 150 * Math.min(1, shop.obtainiumAutoLevel),
      false
    )
    player.worlds.add(
      100 * shop.cashGrabLevel
        + (100 / 2) * (shop.cashGrabLevel - 1) * shop.cashGrabLevel,
      false
    )
    player.worlds.add(
      200 * shop.antSpeedLevel
        + (80 / 2) * (shop.antSpeedLevel - 1) * shop.antSpeedLevel,
      false
    )

    const tomes = shop.challenge10Tomes ?? shop.challengeTome
    player.worlds.add(500 * tomes + (250 / 2) * (tomes - 1) * tomes, false)

    player.worlds.add(
      typeof shop.seasonPass === 'number'
        ? 500 * shop.seasonPass
          + (250 / 2) * (shop.seasonPass - 1) * shop.seasonPass
        : 500 * shop.seasonPassLevel
          + (250 / 2) * (shop.seasonPassLevel - 1) * shop.seasonPassLevel,
      false
    )
  }

  if (player.shopUpgrades.seasonPass2 === undefined) {
    player.shopUpgrades.seasonPass2 = 0
    player.shopUpgrades.seasonPass3 = 0
    player.shopUpgrades.chronometer = 0
    player.shopUpgrades.infiniteAscent = 0
  }

  if (player.runeexp[5] === undefined) {
    player.runeexp[5] = player.runeexp[6] = 0
    player.runelevels[5] = player.runelevels[6] = 0
  }

  // resets all hepteract values on the player object
  player.hepteractCrafts = {
    chronos: ChronosHepteract,
    hyperrealism: HyperrealismHepteract,
    quark: QuarkHepteract,
    challenge: ChallengeHepteract,
    abyss: AbyssHepteract,
    accelerator: AcceleratorHepteract,
    acceleratorBoost: AcceleratorBoostHepteract,
    multiplier: MultiplierHepteract
  }

  // if the player has hepteracts, we need to overwrite the player values
  // with the ones the save has.
  if (data.hepteractCrafts != null) {
    for (const item in blankSave.hepteractCrafts) {
      const k = item as keyof Player['hepteractCrafts']
      // if more crafts are added, some keys might not exist in the save
      if (data.hepteractCrafts[k]) {
        player.hepteractCrafts[k] = createHepteract({
          ...player.hepteractCrafts[k],
          ...data.hepteractCrafts[k]
        })
      }
    }
  }

  if (data.platonicCubeOpenedDaily === undefined) {
    player.platonicCubeOpenedDaily = 0
    player.platonicCubeQuarkDaily = 0
  }

  if (data.shopUpgrades.calculator === undefined) {
    player.shopUpgrades.calculator = 0
    player.shopUpgrades.calculator2 = 0
    player.shopUpgrades.calculator3 = 0
    player.shopUpgrades.constantEX = 0
  }

  while (player.achievements[280] === undefined) {
    player.achievements.push(0)
  }

  if (data.overfluxOrbs === undefined) {
    player.overfluxOrbs = 0
  }
  if (data.overfluxOrbsAutoBuy === undefined) {
    player.overfluxOrbsAutoBuy = false
  }
  if (data.overfluxPowder === undefined) {
    player.overfluxPowder = 0
    player.shopUpgrades.powderEX = 0
    player.dailyPowderResetUses = 1
  }

  if (data.ascStatToggles[5] === undefined) {
    player.ascStatToggles[5] = false
  }

  while (player.platonicUpgrades[20] === undefined) {
    player.platonicUpgrades.push(0)
  }

  if (data.loadedV253 === undefined) {
    player.loadedV253 = true
    player.worlds.add(
      10000 * player.shopUpgrades.calculator
        + (10000 / 2)
          * (player.shopUpgrades.calculator - 1)
          * player.shopUpgrades.calculator,
      false
    )
    player.worlds.add(
      10000 * player.shopUpgrades.calculator2
        + (5000 / 2)
          * (player.shopUpgrades.calculator2 - 1)
          * player.shopUpgrades.calculator2,
      false
    )
    player.worlds.add(
      25000 * player.shopUpgrades.calculator3
        + (25000 / 2)
          * (player.shopUpgrades.calculator3 - 1)
          * player.shopUpgrades.calculator3,
      false
    )
    player.shopUpgrades.calculator = 0
    player.shopUpgrades.calculator2 = 0
    player.shopUpgrades.calculator3 = 0
    player.wowAbyssals += 1e8 * player.platonicUpgrades[16] // Refund based off of abyss hepteracts spent
    void Alert(i18next.t('general.updateAlerts.june282021'))
  }

  if (data.loadedV255 === undefined) {
    player.loadedV255 = true
    player.worlds.add(
      1000 * player.shopUpgrades.powderEX
        + (1000 / 2)
          * (player.shopUpgrades.powderEX - 1)
          * player.shopUpgrades.powderEX,
      false
    )
    player.shopUpgrades.powderEX = 0
    void Alert(i18next.t('general.updateAlerts.july22021'))
    player.firstCostAnts = new Decimal('1e700')
    player.firstOwnedAnts = 0
  }

  if (data.autoResearchMode === undefined) {
    player.autoResearchMode = 'manual'
  }

  if (data.singularityCount === undefined) {
    player.singularityCount = 0
    player.goldenQuarks = 0

    player.quarksThisSingularity = 0
    player.quarksThisSingularity += +player.worlds
    const keys = Object.keys(
      player.shopUpgrades
    ) as (keyof Player['shopUpgrades'])[]
    for (const key of keys) {
      player.quarksThisSingularity += getQuarkInvestment(key)
    }
  }

  if (data.totalQuarksEver === undefined) {
    player.totalQuarksEver = 0
  }

  if (data.hotkeys === undefined) {
    player.hotkeys = {}
    player.theme = 'Dark Mode'
    player.notation = 'Default'
  }

  // Update (read: check) for undefined shop upgrades. Also checks above max level.
  const shopKeys = Object.keys(
    blankSave.shopUpgrades
  ) as (keyof Player['shopUpgrades'])[]
  for (const shopUpgrade of shopKeys) {
    if (player.shopUpgrades[shopUpgrade] === undefined) {
      player.shopUpgrades[shopUpgrade] = 0
    }
    if (player.shopUpgrades[shopUpgrade] > shopData[shopUpgrade].maxLevel) {
      player.shopUpgrades[shopUpgrade] = shopData[shopUpgrade].maxLevel
    }
  }

  if (data.singularityUpgrades != null) {
    for (const item in blankSave.singularityUpgrades) {
      const k = item as keyof Player['singularityUpgrades']
      // if more crafts are added, some keys might not exist in the save
      let updatedData: ISingularityData
      if (data.singularityUpgrades[k]) {
        const { level, goldenQuarksInvested, toggleBuy, freeLevels } = data.singularityUpgrades[k]

        updatedData = {
          maxLevel: singularityData[k].maxLevel,
          costPerLevel: singularityData[k].costPerLevel,

          level,
          goldenQuarksInvested,
          toggleBuy,
          freeLevels,
          minimumSingularity: singularityData[k].minimumSingularity,
          effect: singularityData[k].effect,
          canExceedCap: singularityData[k].canExceedCap,
          specialCostForm: singularityData[k].specialCostForm,
          qualityOfLife: singularityData[k].qualityOfLife,
          cacheUpdates: singularityData[k].cacheUpdates
        }
        player.singularityUpgrades[k] = new SingularityUpgrade(
          updatedData,
          k.toString()
        )

        if (
          player.singularityUpgrades[k].minimumSingularity
            > player.highestSingularityCount
        ) {
          player.singularityUpgrades[k].refund()
        }

        const cost = (player.singularityUpgrades[k].level
          * (player.singularityUpgrades[k].level + 1)
          * player.singularityUpgrades[k].costPerLevel)
          / 2
        if (
          player.singularityUpgrades[k].maxLevel !== -1
          && player.singularityUpgrades[k].level
            <= player.singularityUpgrades[k].maxLevel
          && player.singularityUpgrades[k].goldenQuarksInvested.toExponential(
              10
            ) !== cost.toExponential(10)
          && player.singularityUpgrades[k].specialCostForm === 'Default'
        ) {
          player.singularityUpgrades[k].refund()
        }
      } else {
        player.singularityUpgrades[
          k
        ].name = `[NEW!] ${player.singularityUpgrades[k].name}`
      }
    }
  }

  if (data.octeractUpgrades != null) {
    // TODO: Make this more DRY -Platonic, July 15 2022
    for (const item in blankSave.octeractUpgrades) {
      const k = item as keyof Player['octeractUpgrades']
      let updatedData: IOcteractData
      if (data.octeractUpgrades[k]) {
        const { level, octeractsInvested, toggleBuy, freeLevels } = data.octeractUpgrades[k]
        updatedData = {
          maxLevel: octeractData[k].maxLevel,
          costPerLevel: octeractData[k].costPerLevel,
          level,
          octeractsInvested,
          toggleBuy,
          effect: octeractData[k].effect,
          costFormula: octeractData[k].costFormula,
          freeLevels,
          qualityOfLife: octeractData[k].qualityOfLife,
          cacheUpdates: octeractData[k].cacheUpdates
        }
        player.octeractUpgrades[k] = new OcteractUpgrade(
          updatedData,
          k.toString()
        )

        if (
          player.octeractUpgrades[k].maxLevel !== -1
          && player.octeractUpgrades[k].level > player.octeractUpgrades[k].maxLevel
        ) {
          player.octeractUpgrades[k].refund()
        }
      } else {
        player.octeractUpgrades[
          k
        ].name = `[NEW!] ${player.octeractUpgrades[k].name}`
      }
    }
  }

  if (data.blueberryUpgrades != null) {
    // blueberry loading here!
    for (const item of Object.keys(blankSave.blueberryUpgrades)) {
      const k = item as keyof Player['blueberryUpgrades']
      let updatedData: IBlueberryData
      if (data.blueberryUpgrades[k]) {
        const {
          level,
          ambrosiaInvested,
          blueberriesInvested,
          toggleBuy,
          freeLevels
        } = data.blueberryUpgrades[k]
        updatedData = {
          maxLevel: blueberryUpgradeData[k].maxLevel,
          costPerLevel: blueberryUpgradeData[k].costPerLevel,
          level,
          ambrosiaInvested,
          blueberriesInvested,
          toggleBuy,
          blueberryCost: blueberryUpgradeData[k].blueberryCost,
          rewards: blueberryUpgradeData[k].rewards,
          costFormula: blueberryUpgradeData[k].costFormula,
          freeLevels,
          prerequisites: blueberryUpgradeData[k].prerequisites,
          cacheUpdates: blueberryUpgradeData[k].cacheUpdates
        }
        player.blueberryUpgrades[k] = new BlueberryUpgrade(
          updatedData,
          k.toString()
        )

        if (
          player.blueberryUpgrades[k].maxLevel !== -1
          && player.blueberryUpgrades[k].level
            > player.blueberryUpgrades[k].maxLevel
        ) {
          player.blueberryUpgrades[k].refund()
        }
      } else {
        player.blueberryUpgrades[
          k
        ].name = `[NEW!] ${player.blueberryUpgrades[k].name}`
      }
    }

    updateLoadoutHoverClasses()
  }

  if (data.singularityChallenges != null) {
    for (const item in blankSave.singularityChallenges) {
      const k = item as keyof Player['singularityChallenges']
      let updatedData: ISingularityChallengeData
      if (data.singularityChallenges[k]) {
        // This is a HOTFIX. Please do not remove unless you can think of a better way
        if (
          data.loadedV2927Hotfix1 === undefined
          && k === 'noSingularityUpgrades'
        ) {
          const comps = data.singularityChallenges[k].completions
          if (comps > 0) {
            data.singularityChallenges[k].highestSingularityCompleted = 4 * comps - 3
          }
        }

        const { completions, highestSingularityCompleted, enabled } = data.singularityChallenges[k]
        updatedData = {
          baseReq: singularityChallengeData[k].baseReq,
          completions,
          maxCompletions: singularityChallengeData[k].maxCompletions,
          unlockSingularity: singularityChallengeData[k].unlockSingularity,
          HTMLTag: singularityChallengeData[k].HTMLTag,
          highestSingularityCompleted,
          enabled,
          singularityRequirement: singularityChallengeData[k].singularityRequirement,
          effect: singularityChallengeData[k].effect,
          cacheUpdates: singularityChallengeData[k].cacheUpdates
        }

        if (enabled) {
          Globals.currentSingChallenge = singularityChallengeData[k].HTMLTag
        }
        
        player.singularityChallenges[k] = new SingularityChallenge(
          updatedData,
          k.toString()
        )
      }
    }
  }

  while (player.cubeUpgrades.length < 71) {
    player.cubeUpgrades.push(0)
  }

  if (data.dailyCodeUsed === undefined) {
    player.dailyCodeUsed = false
  }

  if (player.usedCorruptions[1] > 0 || player.prototypeCorruptions[1] > 0) {
    player.usedCorruptions[1] = 0
    player.prototypeCorruptions[1] = 0
  }

  if (
    data.goldenQuarksTimer === undefined
    || player.goldenQuarksTimer === undefined
  ) {
    player.goldenQuarksTimer = 90000
  }

  if (data.hepteractAutoCraftPercentage === undefined) {
    player.hepteractAutoCraftPercentage = 50
  }

  if (data.autoWarpCheck === undefined || player.shopUpgrades.autoWarp === 0) {
    player.autoWarpCheck = false
  }

  if (data.loadedV297Hotfix1 === undefined) {
    player.loadedV297Hotfix1 = true

    player.singularityUpgrades.singCubes1.refund()
    player.singularityUpgrades.singObtainium1.refund()
    player.singularityUpgrades.singOfferings1.refund()
    player.singularityUpgrades.ascensions.refund()

    if (player.codes.get(40) && player.singularityCount > 0) {
      player.singularityUpgrades.singCubes1.freeLevels += 5
      player.singularityUpgrades.singOfferings1.freeLevels += 5
      player.singularityUpgrades.singObtainium1.freeLevels += 5
      player.singularityUpgrades.ascensions.freeLevels += 5
    }

    if (player.singularityCount > 0) {
      void Alert(i18next.t('general.updateAlerts.v297hotfix1Sing'))
    } else {
      void Alert(i18next.t('general.updateAlerts.v297hotfix1NoSing'))
    }
  }

  if (data.shopBuyMaxToggle === undefined) {
    player.shopBuyMaxToggle = false
    player.shopConfirmationToggle = true
  }

  if (data.wowOcteracts === undefined) {
    player.wowOcteracts = 0
    player.octeractTimer = 0
  }

  if (data.shopHideToggle === undefined) {
    player.shopHideToggle = false
  }

  if (data.researchBuyMaxToggle === undefined) {
    player.researchBuyMaxToggle = false
  }

  if (data.cubeUpgradesBuyMaxToggle === undefined) {
    player.cubeUpgradesBuyMaxToggle = false
  }

  if (data.ascensionCounterRealReal === undefined) {
    player.ascensionCounterRealReal = 0
  }

  if (data.totalWowOcteracts === undefined) {
    player.totalWowOcteracts = 0
  }

  if (data.highestSingularityCount === undefined) {
    player.highestSingularityCount = player.singularityCount
    if (player.singularityCount > 0) {
      player.goldenQuarks += 200
      player.goldenQuarks += 100 * Math.min(10, player.singularityCount)

      if (player.singularityCount >= 5) {
        player.singularityUpgrades.goldenQuarks3.freeLevels += 1
      }

      if (player.singularityCount >= 10) {
        player.singularityUpgrades.goldenQuarks3.freeLevels += 2
      }
    }
  }

  if (data.autoPotionTimer === undefined) {
    player.autoPotionTimer = 0
  }
  if (data.autoPotionTimerObtainium === undefined) {
    player.autoPotionTimerObtainium = 0
  }
  if (data.insideSingularityChallenge === undefined) {
    player.insideSingularityChallenge = false
  }

  if (data.loadedV2930Hotfix1 === undefined) {
    if (player.singularityCount > 230) {
      player.singularityCount = 230
    }
    if (player.highestSingularityCount > 230) {
      player.highestSingularityCount = 230
      void Alert(i18next.t('general.updateAlerts.sing230Balancing'))
    }
    player.loadedV2930Hotfix1 = true
  }

  if (data.loadedV2931Hotfix1 === undefined) {
    player.loadedV2931Hotfix1 = true
    player.shopUpgrades.obtainiumEX3 = Math.min(
      1000,
      player.shopUpgrades.obtainiumEX3 * 2
    )
    player.shopUpgrades.offeringEX3 = Math.min(
      1000,
      player.shopUpgrades.offeringEX3 * 2
    )
    player.shopUpgrades.seasonPassInfinity = Math.min(
      1000,
      player.shopUpgrades.seasonPassInfinity * 2
    )
    player.shopUpgrades.chronometerInfinity = Math.min(
      1000,
      player.shopUpgrades.chronometerInfinity * 2
    )
    player.shopUpgrades.improveQuarkHept5 = Math.min(
      100,
      player.shopUpgrades.improveQuarkHept5 * 2
    )
    player.singularityUpgrades.offeringAutomatic.refund()
    void Alert(i18next.t('general.updateAlerts.december22xxxx'))
  }

  if (data.loadedV21003Hotfix1 === undefined) {
    player.loadedV21003Hotfix1 = true
    player.singularityUpgrades.blueberries.refund()
    void Alert(i18next.t('general.updateAlerts.january42023'))
  }

  if (data.loadedV21007Hotfix1 === undefined) {
    player.loadedV21007Hotfix1 = true
    if (player.octeractUpgrades.octeractQuarkGain.level >= 10000) {
      player.octeractUpgrades.octeractQuarkGain.refund()
    }
  }

  if (data.ambrosia === undefined) {
    player.ambrosia = 0
    player.lifetimeAmbrosia = 0
    player.ambrosiaRNG = 0 // NOW DEPRECIATED
    player.visitedAmbrosiaSubtab = false
  }

  if (data.blueberryTime === undefined) {
    player.blueberryTime = player.ambrosiaRNG
  }

  if (data.spentBlueberries === undefined) {
    player.spentBlueberries = 0
    if (player.singularityUpgrades.blueberries.level > 10) {
      player.singularityUpgrades.blueberries.refund()
    }

    if (player.highestSingularityCount >= 100) {
      const reduce = Math.min(
        6,
        Math.ceil((1 / 20) * (player.highestSingularityCount - 100))
      )
      player.highestSingularityCount -= reduce
      if (!player.insideSingularityChallenge) {
        player.singularityCount -= reduce
      }
      void Alert(
        `Due to recent balance changes your highest singularity count was reduced by ${reduce}. This is for your own good!`
      )
    }
  }

  player.caches = {
    ambrosiaLuckAdditiveMult: new AmbrosiaLuckAdditiveMultCache(),
    ambrosiaLuck: new AmbrosiaLuckCache(),
    ambrosiaGeneration: new AmbrosiaGenerationCache(),
    blueberryInventory: new BlueberryInventoryCache()
  }

  cacheReinitialize()

  const oldest = localStorage.getItem('firstPlayed')

  if (data.firstPlayed == null) {
    // If the save is from before v2.9.7 staticians
    player.firstPlayed = oldest ?? new Date().toISOString()
  } else if (data.firstPlayed?.includes('Before')) {
    // The first version with player.firstPlayed set the date to
    // "Before {date.toString}"
    player.firstPlayed = oldest ?? new Date().toISOString()
  } else {
    // Otherwise just set the firstPlayed time to either the oldest
    // stored, or the date in the save being loaded.
    player.firstPlayed = oldest ?? data.firstPlayed
  }

  if (data.autoCubeUpgradesToggle === undefined) {
    player.autoCubeUpgradesToggle = false
    player.autoPlatonicUpgradesToggle = false
  }

  if (player.shopUpgrades.calculator7 === undefined) {
    player.shopUpgrades.calculator7 = 0
    player.shopUpgrades.shopAmbrosiaLuckMultiplier4 = 0
    player.shopUpgrades.shopOcteractAmbrosiaLuck = 0
  }

  if (player.ultimatePixels === undefined) {
    player.ultimatePixels = 0
    player.ultimateProgress = 0
  }

  if (player.shopUpgrades.shopAmbrosiaAccelerator === undefined) { 
    player.shopUpgrades.shopCashGrabUltra = 0
    player.shopUpgrades.shopAmbrosiaAccelerator = 0
    player.shopUpgrades.shopEXUltra = 0
  }
}
