import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import localforage from 'localforage'
import { updateLoadoutHoverClasses } from '../BlueberryUpgrades'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { calculateAnts, calculateCubeBlessings, calculateObtainium, calculateRuneLevels } from '../Calculate'
import { challengeDisplay, getChallengeConditions } from '../Challenges'
import { lastUpdated, prod, testing } from '../Config'
import {
  corrChallengeMinimum,
  corruptionLoadoutTableUpdate,
  corruptionStatsUpdate,
  maxCorruptionLevel,
  updateCorruptionLoadoutNames
} from '../Corruptions'
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from '../CubeExperimental'
import { updateCubeUpgradeBG } from '../Cubes'
import { toggleAutoBuyOrbs } from '../Hepteracts'
import { resetHistoryRenderAllTables } from '../History'
import { calculateHypercubeBlessings } from '../Hypercubes'
import { updatePlatonicUpgradeBG } from '../Platonic'
import { calculatePlatonicBlessings } from '../PlatonicCubes'
import { autoResearchEnabled, updateResearchBG } from '../Research'
import {
  resetrepeat,
  updateAutoCubesOpens,
  updateAutoReset,
  updateSingularityAchievements,
  updateSingularityGlobalPerks,
  updateTesseractAutoBuyAmount
} from '../Reset'
import { c15RewardUpdate } from '../Statistics'
import { blankSave, format, player } from '../Synergism'
import { toggleTalismanBuy, updateTalismanAppearance, updateTalismanInventory } from '../Talismans'
import { calculateTesseractBlessings } from '../Tesseracts'
import { clearTimers } from '../Timers'
import {
  autoCubeUpgradesToggle,
  autoPlatonicUpgradesToggle,
  toggleAntAutoSacrifice,
  toggleAntMaxBuy,
  toggleAscStatPerSecond,
  toggleauto,
  toggleAutoAscend,
  toggleShops,
  updateAutoChallenge,
  updateRuneBlessingBuyAmount
} from '../Toggles'
import { OneToFive } from '../types/Synergism'
import {
  Alert,
  revealStuff,
  showCorruptionStatsLoadouts,
  updateAchievementBG,
  updateChallengeDisplay
} from '../UpdateHTML'
import { upgradeupdate } from '../Upgrades'
import { cleanString, sortWithIndices } from '../Utility'
import { blankGlobals, Globals as G } from '../Variables'
import { playerSchema } from './PlayerSchema'

export const loadSynergism = async () => {
  let saveString: string | null = null
  let data: unknown

  try {
    const blob = await localforage.getItem<Blob>('Synergysave2')

    if (blob === null) {
      saveString = localStorage.getItem('Synergysave2')
    } else {
      saveString = await blob.text()
    }

    if (saveString) {
      data = JSON.parse(atob(saveString))
    }
  } catch (e) {
    console.log(e)
    Alert('Failed to load save!')
    return
  }

  if (testing || !prod) {
    Object.defineProperties(window, {
      player: { value: player },
      G: { value: G },
      Decimal: { value: Decimal },
      i18n: { value: i18next }
    })
  }

  // TODO(@KhafraDev): blankGlobals likely needs to be deeply copied
  Object.assign(G, { ...blankGlobals })

  if (data) {
    // size before loading
    const size = player.codes.size

    // const oldPromoKeys = Object.keys(data).filter((k) => k.includes('offerpromo'))
    // if (oldPromoKeys.length > 0) {
    //   oldPromoKeys.forEach((k) => {
    //     const value = data[k]
    //     const num = +k.replace(/[^\d]/g, '')
    //     player.codes.set(num, Boolean(value))
    //   })
    // }

    const validatedPlayer = playerSchema.safeParse(data)

    if (validatedPlayer.success) {
      Object.assign(player, validatedPlayer.data)
    } else {
      console.log(validatedPlayer.error)
      console.log(data)
      clearTimers()
      return
    }

    if (!player.exporttest && !testing) {
      Alert(i18next.t('testing.saveInLive2'))
      return
    } else if (testing) {
      player.exporttest = true
    }

    updateLoadoutHoverClasses()

    // sets all non-existent codes to default value false
    if (player.codes.size < size) {
      for (let i = player.codes.size + 1; i <= size; i++) {
        if (!player.codes.has(i)) {
          player.codes.set(i, false)
        }
      }
    }

    // if (data.loaded1009 === undefined || !data.loaded1009) {
    //   player.loaded1009 = false
    // }
    // if (data.loaded1009hotfix1 === undefined || !data.loaded1009hotfix1) {
    //   player.loaded1009hotfix1 = false
    // }
    // if (data.loaded10091 === undefined) {
    //   player.loaded10091 = false
    // }
    // if (data.loaded1010 === undefined) {
    //   player.loaded1010 = false
    // }
    // if (data.loaded10101 === undefined) {
    //   player.loaded10101 = false
    // }

    // if (
    //   !data.loaded1009
    //   || data.loaded1009hotfix1 === null
    //   || data.shopUpgrades?.offeringPotion === undefined
    // ) {
    //   player.firstOwnedParticles = 0
    //   player.secondOwnedParticles = 0
    //   player.thirdOwnedParticles = 0
    //   player.fourthOwnedParticles = 0
    //   player.fifthOwnedParticles = 0
    //   player.firstCostParticles = new Decimal('1')
    //   player.secondCostParticles = new Decimal('1e2')
    //   player.thirdCostParticles = new Decimal('1e4')
    //   player.fourthCostParticles = new Decimal('1e8')
    //   player.fifthCostParticles = new Decimal('1e16')
    //   player.autoSacrificeToggle = false
    //   player.autoResearchToggle = false
    //   player.autoResearchMode = 'manual'
    //   player.autoResearch = 0
    //   player.autoSacrifice = 0
    //   player.sacrificeTimer = 0
    //   player.loaded1009 = true
    //   player.codes.set(18, false)
    // }
    // if (!data.loaded1009hotfix1) {
    //   player.loaded1009hotfix1 = true
    //   player.codes.set(19, true)
    //   player.firstOwnedParticles = 0
    //   player.secondOwnedParticles = 0
    //   player.thirdOwnedParticles = 0
    //   player.fourthOwnedParticles = 0
    //   player.fifthOwnedParticles = 0
    //   player.firstCostParticles = new Decimal('1')
    //   player.secondCostParticles = new Decimal('1e2')
    //   player.thirdCostParticles = new Decimal('1e4')
    //   player.fourthCostParticles = new Decimal('1e8')
    //   player.fifthCostParticles = new Decimal('1e16')
    // }
    // if (
    //   data.loaded10091 === undefined
    //   || !data.loaded10091
    //   || player.researches[86] > 100
    //   || player.researches[87] > 100
    //   || player.researches[88] > 100
    //   || player.researches[89] > 100
    //   || player.researches[90] > 10
    // ) {
    //   player.loaded10091 = true
    //   player.researchPoints += 7.5e8 * player.researches[82]
    //   player.researchPoints += 2e8 * player.researches[83]
    //   player.researchPoints += 4.5e9 * player.researches[84]
    //   player.researchPoints += 2.5e7 * player.researches[86]
    //   player.researchPoints += 7.5e7 * player.researches[87]
    //   player.researchPoints += 3e8 * player.researches[88]
    //   player.researchPoints += 1e9 * player.researches[89]
    //   player.researchPoints += 2.5e7 * player.researches[90]
    //   player.researchPoints += 1e8 * player.researches[91]
    //   player.researchPoints += 2e9 * player.researches[92]
    //   player.researchPoints += 9e9 * player.researches[93]
    //   player.researchPoints += 7.25e10 * player.researches[94]
    //   player.researches[86] = 0
    //   player.researches[87] = 0
    //   player.researches[88] = 0
    //   player.researches[89] = 0
    //   player.researches[90] = 0
    //   player.researches[91] = 0
    //   player.researches[92] = 0
    // }

    // // const shop = data.shopUpgrades as LegacyShopUpgrades & Player['shopUpgrades'];
    // if (
    //   data.achievements?.[169] === undefined
    //   || typeof player.achievements[169] === 'undefined'
    //   //    (shop.antSpeed === undefined && shop.antSpeedLevel === undefined) ||
    //   //    (shop.antSpeed === undefined && typeof shop.antSpeedLevel === 'undefined') ||
    //   || data.loaded1010 === undefined
    //   || data.loaded1010 === false
    // ) {
    //   player.loaded1010 = true
    //   player.codes.set(21, false)

    //   player.firstOwnedAnts = 0
    //   player.firstGeneratedAnts = new Decimal('0')
    //   player.firstCostAnts = new Decimal('1e700')
    //   player.firstProduceAnts = 0.0001

    //   player.secondOwnedAnts = 0
    //   player.secondGeneratedAnts = new Decimal('0')
    //   player.secondCostAnts = new Decimal('3')
    //   player.secondProduceAnts = 0.00005

    //   player.thirdOwnedAnts = 0
    //   player.thirdGeneratedAnts = new Decimal('0')
    //   player.thirdCostAnts = new Decimal('100')
    //   player.thirdProduceAnts = 0.00002

    //   player.fourthOwnedAnts = 0
    //   player.fourthGeneratedAnts = new Decimal('0')
    //   player.fourthCostAnts = new Decimal('1e4')
    //   player.fourthProduceAnts = 0.00001

    //   player.fifthOwnedAnts = 0
    //   player.fifthGeneratedAnts = new Decimal('0')
    //   player.fifthCostAnts = new Decimal('1e12')
    //   player.fifthProduceAnts = 0.000005

    //   player.sixthOwnedAnts = 0
    //   player.sixthGeneratedAnts = new Decimal('0')
    //   player.sixthCostAnts = new Decimal('1e36')
    //   player.sixthProduceAnts = 0.000002

    //   player.seventhOwnedAnts = 0
    //   player.seventhGeneratedAnts = new Decimal('0')
    //   player.seventhCostAnts = new Decimal('1e100')
    //   player.seventhProduceAnts = 0.000001

    //   player.eighthOwnedAnts = 0
    //   player.eighthGeneratedAnts = new Decimal('0')
    //   player.eighthCostAnts = new Decimal('1e300')
    //   player.eighthProduceAnts = 0.00000001

    //   player.achievements.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    //   player.antPoints = new Decimal('1')

    //   player.upgrades[38] = 0
    //   player.upgrades[39] = 0
    //   player.upgrades[40] = 0

    //   player.upgrades[76] = 0
    //   player.upgrades[77] = 0
    //   player.upgrades[78] = 0
    //   player.upgrades[79] = 0
    //   player.upgrades[80] = 0

    //   //    player.shopUpgrades.antSpeed = 0;
    //   //    player.shopUpgrades.shopTalisman = 0;

    //   player.antUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    //   player.unlocks.rrow4 = false
    //   player.researchPoints += 3e7 * player.researches[50]
    //   player.researchPoints += 2e9 * player.researches[96]
    //   player.researchPoints += 5e9 * player.researches[97]
    //   player.researchPoints += 3e10 * player.researches[98]
    //   player.researches[50] = 0
    //   player.researches[96] = 0
    //   player.researches[97] = 0
    //   player.researches[98] = 0
    //   player.researches.push(
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0,
    //     0
    //   )

    //   player.talismanLevels = [0, 0, 0, 0, 0, 0, 0]
    //   player.talismanRarity = [1, 1, 1, 1, 1, 1, 1]

    //   player.talismanShards = 0
    //   player.commonFragments = 0
    //   player.uncommonFragments = 0
    //   player.rareFragments = 0
    //   player.epicFragments = 0
    //   player.legendaryFragments = 0
    //   player.mythicalFragments = 0
    //   player.buyTalismanShardPercent = 10

    //   player.talismanOne = [null, -1, 1, 1, 1, -1]
    //   player.talismanTwo = [null, 1, 1, -1, -1, 1]
    //   player.talismanThree = [null, 1, -1, 1, 1, -1]
    //   player.talismanFour = [null, -1, -1, 1, 1, 1]
    //   player.talismanFive = [null, 1, 1, -1, -1, 1]
    //   player.talismanSix = [null, 1, 1, 1, -1, -1]
    //   player.talismanSeven = [null, -1, 1, -1, 1, 1]

    //   player.antSacrificePoints = 0
    //   player.antSacrificeTimer = 0

    //   player.obtainiumpersecond = 0
    //   player.maxobtainiumpersecond = 0
    // }

    // if (data.loaded10101 === undefined || data.loaded10101 === false) {
    //   player.loaded10101 = true

    //   // dprint-ignore
    //   const refundThese = [
    //     0, 31, 32, 61, 62, 63, 64, 76, 77, 78, 79, 80, 81, 98, 104, 105, 106,
    //     107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
    //     121, 122, 123, 125,
    //   ];
    //   // dprint-ignore
    //   const refundReward = [
    //     0, 2, 20, 5, 10, 80, 5e3, 1e7, 1e7, 2e7, 3e7, 4e7, 2e8, 3e10, 1e11,
    //     1e12, 2e11, 1e12, 2e10, 2e11, 1e12, 2e13, 5e13, 1e14, 2e14, 5e14, 1e15,
    //     2e15, 1e16, 1e15, 1e16, 1e14, 1e15, 1e15, 1e20,
    //   ];
    //   for (let i = 1; i < refundThese.length; i++) {
    //     player.researchPoints += player.researches[refundThese[i]] * refundReward[i]
    //     player.researches[refundThese[i]] = 0
    //   }
    //   player.autoAntSacrifice = false
    //   player.antMax = false
    // }

    if (player.firstOwnedAnts < 1 && player.firstCostAnts.gte('1e1200')) {
      player.firstCostAnts = new Decimal('1e700')
      player.firstOwnedAnts = 0
    }

    if (player.ascensionCount === 0) {
      if (player.prestigeCount > 0) {
        player.ascensionCounter = 86400 * 90
      }

      if (player.singularityCount === 0) {
        player.cubeUpgrades = [...blankSave.cubeUpgrades]
      }
      player.wowCubes = new WowCubes(0)
      player.wowTesseracts = new WowTesseracts(0)
      player.wowHypercubes = new WowHypercubes(0)
      player.wowPlatonicCubes = new WowPlatonicCubes(0)
      player.cubeBlessings = {
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

    if (player.transcendCount < 0) {
      player.transcendCount = 0
    }
    if (player.reincarnationCount < 0) {
      player.reincarnationCount = 0
    }
    if (player.runeshards < 0) {
      player.runeshards = 0
    }
    if (player.researchPoints < 0) {
      player.researchPoints = 0
    }

    if (player.resettoggle1 === 0) {
      player.resettoggle1 = 1
      player.resettoggle2 = 1
      player.resettoggle3 = 1
      player.resettoggle4 = 1
    }
    if (player.tesseractAutoBuyerToggle === 0) {
      player.tesseractAutoBuyerToggle = 1
    }
    if (player.reincarnationCount < 0.5 && player.unlocks.rrow4) {
      player.unlocks = {
        coinone: false,
        cointwo: false,
        cointhree: false,
        coinfour: false,
        prestige: false,
        generation: false,
        transcend: false,
        reincarnate: false,
        rrow1: false,
        rrow2: false,
        rrow3: false,
        rrow4: false
      }
    }

    if (!Number.isInteger(player.ascendBuilding1.cost)) {
      player.ascendBuilding1.cost = 1
      player.ascendBuilding1.owned = 0
      player.ascendBuilding2.cost = 10
      player.ascendBuilding2.owned = 0
      player.ascendBuilding3.cost = 100
      player.ascendBuilding3.owned = 0
      player.ascendBuilding4.cost = 1000
      player.ascendBuilding4.owned = 0
      player.ascendBuilding5.cost = 10000
      player.ascendBuilding5.owned = 0
    }

    if (!player.dayCheck) {
      player.dayCheck = new Date()
    }
    if (typeof player.dayCheck === 'string') {
      player.dayCheck = new Date(player.dayCheck)
      if (isNaN(player.dayCheck.getTime())) {
        player.dayCheck = new Date()
      }
    }
    // Measures for people who play the past
    let updatedLast = lastUpdated
    if (!isNaN(updatedLast.getTime())) {
      updatedLast = new Date(
        updatedLast.getFullYear(),
        updatedLast.getMonth(),
        updatedLast.getDate() - 1
      )
      if (player.dayCheck.getTime() < updatedLast.getTime()) {
        player.dayCheck = updatedLast
      }
    } else if (player.dayCheck.getTime() < 1654009200000) {
      player.dayCheck = new Date('06/01/2022 00:00:00')
    }
    // Calculate daily
    player.dayCheck = new Date(
      player.dayCheck.getFullYear(),
      player.dayCheck.getMonth(),
      player.dayCheck.getDate()
    )

    const maxLevel = maxCorruptionLevel()
    player.usedCorruptions = player.usedCorruptions.map(
      (curr: number, index: number) => {
        if (index >= 2 && index <= 9) {
          return Math.min(
            maxLevel
              * (player.challengecompletions[corrChallengeMinimum(index)] > 0
                ? 1
                : 0),
            curr
          )
        }
        return curr
      }
    )

    for (let i = 1; i <= 5; i++) {
      const ascendBuildingI = `ascendBuilding${i as OneToFive}` as const
      player[ascendBuildingI].generated = new Decimal(
        player[ascendBuildingI].generated
      )
    }

    if (
      player.saveString === ''
      || player.saveString === 'Synergism-v1011Test.txt'
    ) {
      player.saveString = player.singularityCount === 0
        ? 'Synergism-$VERSION$-$TIME$.txt'
        : 'Synergism-$VERSION$-$TIME$-$SING$.txt'
    }
    ;(DOMCacheGetOrSet('saveStringInput') as HTMLInputElement).value = cleanString(player.saveString)

    for (let j = 1; j < 126; j++) {
      upgradeupdate(j, true)
    }

    for (let j = 1; j <= 200; j++) {
      updateResearchBG(j)
    }
    for (let j = 1; j < player.cubeUpgrades.length; j++) {
      updateCubeUpgradeBG(j)
    }
    const platUpg = document.querySelectorAll('img[id^="platUpg"]')
    for (let j = 1; j <= platUpg.length; j++) {
      updatePlatonicUpgradeBG(j)
    }

    const q = [
      'coin',
      'crystal',
      'mythos',
      'particle',
      'offering',
      'tesseract'
    ] as const
    if (
      player.coinbuyamount !== 1
      && player.coinbuyamount !== 10
      && player.coinbuyamount !== 100
      && player.coinbuyamount !== 1000
    ) {
      player.coinbuyamount = 1
    }
    if (
      player.crystalbuyamount !== 1
      && player.crystalbuyamount !== 10
      && player.crystalbuyamount !== 100
      && player.crystalbuyamount !== 1000
    ) {
      player.crystalbuyamount = 1
    }
    if (
      player.mythosbuyamount !== 1
      && player.mythosbuyamount !== 10
      && player.mythosbuyamount !== 100
      && player.mythosbuyamount !== 1000
    ) {
      player.mythosbuyamount = 1
    }
    if (
      player.particlebuyamount !== 1
      && player.particlebuyamount !== 10
      && player.particlebuyamount !== 100
      && player.particlebuyamount !== 1000
    ) {
      player.particlebuyamount = 1
    }
    if (
      player.offeringbuyamount !== 1
      && player.offeringbuyamount !== 10
      && player.offeringbuyamount !== 100
      && player.offeringbuyamount !== 1000
    ) {
      player.offeringbuyamount = 1
    }
    if (
      player.tesseractbuyamount !== 1
      && player.tesseractbuyamount !== 10
      && player.tesseractbuyamount !== 100
      && player.tesseractbuyamount !== 1000
    ) {
      player.tesseractbuyamount = 1
    }
    for (let j = 0; j <= 5; j++) {
      for (let k = 0; k < 4; k++) {
        const d = {
          0: 'one',
          1: 'ten',
          2: 'hundred',
          3: 'thousand'
        }[k] ?? ''

        const e = `${q[j]}${d}`
        DOMCacheGetOrSet(e).style.backgroundColor = ''
      }

      const curBuyAmount = player[`${q[j]}buyamount` as const]
      const c = {
        1: 'one',
        10: 'ten',
        100: 'hundred',
        1000: 'thousand'
      }[curBuyAmount] ?? ''

      const b = `${q[j]}${c}`
      DOMCacheGetOrSet(b).style.backgroundColor = 'green'
    }

    G.researchOrderByCost = sortWithIndices([...G.researchBaseCosts])
    player.roombaResearchIndex = 0

    // June 09, 2021: Updated toggleShops() and removed boilerplate - Platonic
    toggleShops()
    getChallengeConditions()
    updateChallengeDisplay()
    revealStuff()
    toggleauto()

    // Challenge summary should be displayed
    if (player.currentChallenge.transcension > 0) {
      challengeDisplay(player.currentChallenge.transcension)
    } else if (player.currentChallenge.reincarnation > 0) {
      challengeDisplay(player.currentChallenge.reincarnation)
    } else if (player.currentChallenge.ascension > 0) {
      challengeDisplay(player.currentChallenge.ascension)
    } else {
      challengeDisplay(1)
    }

    corruptionStatsUpdate()
    const corrs = Math.min(8, Object.keys(player.corruptionLoadouts).length) + 1
    for (let i = 0; i < corrs; i++) {
      corruptionLoadoutTableUpdate(i)
    }
    showCorruptionStatsLoadouts()
    updateCorruptionLoadoutNames()

    DOMCacheGetOrSet('researchrunebonus').textContent = i18next.t(
      'runes.thanksResearches',
      {
        percent: format(100 * G.effectiveLevelMult - 100, 4, true)
      }
    )

    DOMCacheGetOrSet('talismanlevelup').style.display = 'none'
    DOMCacheGetOrSet('talismanrespec').style.display = 'none'

    DOMCacheGetOrSet('antSacrificeSummary').style.display = 'none'

    // This must be initialized at the beginning of the calculation
    c15RewardUpdate()

    calculatePlatonicBlessings()
    calculateHypercubeBlessings()
    calculateTesseractBlessings()
    calculateCubeBlessings()
    updateTalismanAppearance(0)
    updateTalismanAppearance(1)
    updateTalismanAppearance(2)
    updateTalismanAppearance(3)
    updateTalismanAppearance(4)
    updateTalismanAppearance(5)
    updateTalismanAppearance(6)
    for (const id in player.ascStatToggles) {
      toggleAscStatPerSecond(+id) // toggle each stat twice to make sure the displays are correct and match what they used to be
      toggleAscStatPerSecond(+id)
    }

    // Strictly check the input and data with values other than numbers
    const omit = /e\+/
    let inputd = player.autoChallengeTimer.start
    let inpute = Number(
      (DOMCacheGetOrSet('startAutoChallengeTimerInput') as HTMLInputElement)
        .value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(
        DOMCacheGetOrSet('startAutoChallengeTimerInput') as HTMLInputElement
      ).value = `${player.autoChallengeTimer.start || blankSave.autoChallengeTimer.start}`.replace(omit, 'e')
      updateAutoChallenge(1)
    }

    DOMCacheGetOrSet('startTimerValue').innerHTML = i18next.t(
      'challenges.timeStartSweep',
      {
        time: format(player.autoChallengeTimer.start, 2, true)
      }
    )

    inputd = player.autoChallengeTimer.exit
    inpute = Number(
      (DOMCacheGetOrSet('exitAutoChallengeTimerInput') as HTMLInputElement)
        .value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(
        DOMCacheGetOrSet('exitAutoChallengeTimerInput') as HTMLInputElement
      ).value = `${player.autoChallengeTimer.exit || blankSave.autoChallengeTimer.exit}`.replace(omit, 'e')
      updateAutoChallenge(2)
    }

    DOMCacheGetOrSet('exitTimerValue').innerHTML = i18next.t(
      'challenges.timeExitChallenge',
      {
        time: format(player.autoChallengeTimer.exit, 2, true)
      }
    )

    inputd = player.autoChallengeTimer.enter
    inpute = Number(
      (DOMCacheGetOrSet('enterAutoChallengeTimerInput') as HTMLInputElement)
        .value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(
        DOMCacheGetOrSet('enterAutoChallengeTimerInput') as HTMLInputElement
      ).value = `${player.autoChallengeTimer.enter || blankSave.autoChallengeTimer.enter}`.replace(omit, 'e')
      updateAutoChallenge(3)
    }

    DOMCacheGetOrSet('enterTimerValue').innerHTML = i18next.t(
      'challenges.timeEnterChallenge',
      {
        time: format(player.autoChallengeTimer.enter, 2, true)
      }
    )

    inputd = player.prestigeamount
    inpute = Number(
      (DOMCacheGetOrSet('prestigeamount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('prestigeamount') as HTMLInputElement).value = `${
        player.prestigeamount || blankSave.prestigeamount
      }`.replace(omit, 'e')
      updateAutoReset(1)
    }
    inputd = player.transcendamount
    inpute = Number(
      (DOMCacheGetOrSet('transcendamount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('transcendamount') as HTMLInputElement).value = `${
        player.transcendamount || blankSave.transcendamount
      }`.replace(omit, 'e')
      updateAutoReset(2)
    }
    inputd = player.reincarnationamount
    inpute = Number(
      (DOMCacheGetOrSet('reincarnationamount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('reincarnationamount') as HTMLInputElement).value = `${
        player.reincarnationamount || blankSave.reincarnationamount
      }`.replace(omit, 'e')
      updateAutoReset(3)
    }
    inputd = player.autoAscendThreshold
    inpute = Number(
      (DOMCacheGetOrSet('ascensionAmount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('ascensionAmount') as HTMLInputElement).value = `${
        player.autoAscendThreshold || blankSave.autoAscendThreshold
      }`.replace(omit, 'e')
      updateAutoReset(4)
    }
    inputd = player.autoAntSacTimer
    inpute = Number(
      (DOMCacheGetOrSet('autoAntSacrificeAmount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('autoAntSacrificeAmount') as HTMLInputElement).value = `${
        player.autoAntSacTimer || blankSave.autoAntSacTimer
      }`.replace(
        omit,
        'e'
      )
      updateAutoReset(5)
    }
    inputd = player.tesseractAutoBuyerAmount
    inpute = Number(
      (DOMCacheGetOrSet('tesseractAmount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('tesseractAmount') as HTMLInputElement).value = `${
        player.tesseractAutoBuyerAmount || blankSave.tesseractAutoBuyerAmount
      }`.replace(omit, 'e')
      updateTesseractAutoBuyAmount()
    }
    inputd = player.openCubes
    inpute = Number(
      (DOMCacheGetOrSet('cubeOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('cubeOpensInput') as HTMLInputElement).value = `${player.openCubes || blankSave.openCubes}`
        .replace(omit, 'e')
      updateAutoCubesOpens(1)
    }
    inputd = player.openTesseracts
    inpute = Number(
      (DOMCacheGetOrSet('tesseractsOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('tesseractsOpensInput') as HTMLInputElement).value = `${
        player.openTesseracts || blankSave.openTesseracts
      }`.replace(omit, 'e')
      updateAutoCubesOpens(2)
    }
    inputd = player.openHypercubes
    inpute = Number(
      (DOMCacheGetOrSet('hypercubesOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('hypercubesOpensInput') as HTMLInputElement).value = `${
        player.openHypercubes || blankSave.openHypercubes
      }`.replace(omit, 'e')
      updateAutoCubesOpens(3)
    }
    inputd = player.openPlatonicsCubes
    inpute = Number(
      (DOMCacheGetOrSet('platonicCubeOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('platonicCubeOpensInput') as HTMLInputElement).value = `${
        player.openPlatonicsCubes || blankSave.openPlatonicsCubes
      }`.replace(
        omit,
        'e'
      )
      updateAutoCubesOpens(4)
    }
    inputd = player.runeBlessingBuyAmount
    inpute = Number(
      (DOMCacheGetOrSet('buyRuneBlessingInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('buyRuneBlessingInput') as HTMLInputElement).value = `${
        player.runeBlessingBuyAmount || blankSave.runeBlessingBuyAmount
      }`.replace(omit, 'e')
      updateRuneBlessingBuyAmount(1)
    }

    DOMCacheGetOrSet('buyRuneBlessingToggle').innerHTML = i18next.t(
      'runes.blessings.buyUpTo',
      {
        amount: format(player.runeBlessingBuyAmount)
      }
    )

    inputd = player.runeSpiritBuyAmount
    inpute = Number(
      (DOMCacheGetOrSet('buyRuneSpiritInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('buyRuneSpiritInput') as HTMLInputElement).value = `${
        player.runeSpiritBuyAmount || blankSave.runeSpiritBuyAmount
      }`.replace(omit, 'e')
      updateRuneBlessingBuyAmount(2)
    }
    DOMCacheGetOrSet('buyRuneSpiritToggleValue').innerHTML = i18next.t(
      'runes.spirits.buyUpTo',
      {
        amount: format(player.runeSpiritBuyAmount, 0, true)
      }
    )

    if (player.resettoggle1 === 1) {
      DOMCacheGetOrSet('prestigeautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
    if (player.resettoggle2 === 1) {
      DOMCacheGetOrSet('transcendautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
    if (player.resettoggle3 === 1) {
      DOMCacheGetOrSet('reincarnateautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
    if (player.resettoggle4 === 1) {
      DOMCacheGetOrSet('tesseractautobuymode').textContent = i18next.t('toggles.modeAmount')
    }

    if (player.resettoggle1 === 2) {
      DOMCacheGetOrSet('prestigeautotoggle').textContent = i18next.t('toggles.modeTime')
    }
    if (player.resettoggle2 === 2) {
      DOMCacheGetOrSet('transcendautotoggle').textContent = i18next.t('toggles.modeTime')
    }
    if (player.resettoggle3 === 2) {
      DOMCacheGetOrSet('reincarnateautotoggle').textContent = i18next.t('toggles.modeTime')
    }
    if (player.resettoggle4 === 2) {
      DOMCacheGetOrSet('tesseractautobuymode').textContent = i18next.t(
        'toggles.modePercentage'
      )
    }

    if (player.tesseractAutoBuyerToggle === 1) {
      DOMCacheGetOrSet('tesseractautobuytoggle').textContent = i18next.t(
        'runes.talismans.autoBuyOn'
      )
      DOMCacheGetOrSet('tesseractautobuytoggle').style.border = '2px solid green'
    }
    if (player.tesseractAutoBuyerToggle === 2) {
      DOMCacheGetOrSet('tesseractautobuytoggle').textContent = i18next.t(
        'runes.talismans.autoBuyOff'
      )
      DOMCacheGetOrSet('tesseractautobuytoggle').style.border = '2px solid red'
    }

    if (player.autoOpenCubes) {
      DOMCacheGetOrSet('openCubes').textContent = i18next.t('wowCubes.autoOn', {
        percent: format(player.openCubes, 0)
      })
      DOMCacheGetOrSet('openCubes').style.border = '1px solid green'
      DOMCacheGetOrSet('cubeOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openCubes').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openCubes').style.border = '1px solid red'
      DOMCacheGetOrSet('cubeOpensInput').style.border = '1px solid red'
    }
    if (player.autoOpenTesseracts) {
      DOMCacheGetOrSet('openTesseracts').textContent = i18next.t(
        'wowCubes.autoOn',
        {
          percent: format(player.openTesseracts, 0)
        }
      )
      DOMCacheGetOrSet('openTesseracts').style.border = '1px solid green'
      DOMCacheGetOrSet('tesseractsOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openTesseracts').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openTesseracts').style.border = '1px solid red'
      DOMCacheGetOrSet('tesseractsOpensInput').style.border = '1px solid red'
    }
    if (player.autoOpenHypercubes) {
      DOMCacheGetOrSet('openHypercubes').textContent = i18next.t(
        'wowCubes.autoOn',
        {
          percent: format(player.openHypercubes, 0)
        }
      )
      DOMCacheGetOrSet('openHypercubes').style.border = '1px solid green'
      DOMCacheGetOrSet('hypercubesOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openHypercubes').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openHypercubes').style.border = '1px solid red'
      DOMCacheGetOrSet('hypercubesOpensInput').style.border = '1px solid red'
    }
    if (player.autoOpenPlatonicsCubes) {
      DOMCacheGetOrSet('openPlatonicCube').textContent = i18next.t(
        'wowCubes.autoOn',
        {
          percent: format(player.openPlatonicsCubes, 0)
        }
      )
      DOMCacheGetOrSet('openPlatonicCube').style.border = '1px solid green'
      DOMCacheGetOrSet('platonicCubeOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openPlatonicCube').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openPlatonicCube').style.border = '1px solid red'
      DOMCacheGetOrSet('platonicCubeOpensInput').style.border = '1px solid red'
    }

    if (player.autoResearchToggle) {
      DOMCacheGetOrSet('toggleautoresearch').textContent = i18next.t(
        'researches.automaticOn'
      )
    } else {
      DOMCacheGetOrSet('toggleautoresearch').textContent = i18next.t(
        'researches.automaticOff'
      )
    }
    if (player.autoResearchMode === 'cheapest') {
      DOMCacheGetOrSet('toggleautoresearchmode').textContent = i18next.t(
        'researches.autoModeCheapest'
      )
    } else {
      DOMCacheGetOrSet('toggleautoresearchmode').textContent = i18next.t(
        'researches.autoModeManual'
      )
    }
    if (player.autoSacrificeToggle) {
      DOMCacheGetOrSet('toggleautosacrifice').textContent = i18next.t(
        'runes.blessings.autoRuneOn'
      )
      DOMCacheGetOrSet('toggleautosacrifice').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('toggleautosacrifice').textContent = i18next.t(
        'runes.blessings.autoRuneOff'
      )
      DOMCacheGetOrSet('toggleautosacrifice').style.border = '2px solid red'
    }
    if (player.autoBuyFragment) {
      DOMCacheGetOrSet('toggleautoBuyFragments').textContent = i18next.t(
        'runes.talismans.autoBuyOn'
      )
      DOMCacheGetOrSet('toggleautoBuyFragments').style.border = '2px solid white'
      DOMCacheGetOrSet('toggleautoBuyFragments').style.color = 'orange'
    } else {
      DOMCacheGetOrSet('toggleautoBuyFragments').textContent = i18next.t(
        'runes.talismans.autoBuyOff'
      )
      DOMCacheGetOrSet('toggleautoBuyFragments').style.border = '2px solid orange'
      DOMCacheGetOrSet('toggleautoBuyFragments').style.color = 'white'
    }
    if (player.autoFortifyToggle) {
      DOMCacheGetOrSet('toggleautofortify').textContent = i18next.t(
        'runes.autoFortifyOn'
      )
      DOMCacheGetOrSet('toggleautofortify').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('toggleautofortify').textContent = i18next.t(
        'runes.autoFortifyOff'
      )
      DOMCacheGetOrSet('toggleautofortify').style.border = '2px solid red'
    }
    if (player.autoEnhanceToggle) {
      DOMCacheGetOrSet('toggleautoenhance').textContent = i18next.t(
        'runes.autoEnhanceOn'
      )
      DOMCacheGetOrSet('toggleautoenhance').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('toggleautoenhance').textContent = i18next.t(
        'runes.autoEnhanceOff'
      )
      DOMCacheGetOrSet('toggleautoenhance').style.border = '2px solid red'
    }
    player.saveOfferingToggle = false // Lint doesnt like it being inside if
    DOMCacheGetOrSet('saveOffToggle').textContent = i18next.t(
      'toggles.saveOfferingsOff'
    )
    DOMCacheGetOrSet('saveOffToggle').style.color = 'white'
    if (player.autoAscend) {
      DOMCacheGetOrSet('ascensionAutoEnable').textContent = i18next.t(
        'corruptions.autoAscend.on'
      )
      DOMCacheGetOrSet('ascensionAutoEnable').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('ascensionAutoEnable').textContent = i18next.t(
        'corruptions.autoAscend.off'
      )
      DOMCacheGetOrSet('ascensionAutoEnable').style.border = '2px solid red'
    }
    if (player.shopConfirmationToggle) {
      DOMCacheGetOrSet('toggleConfirmShop').textContent = i18next.t(
        'shop.shopConfirmationOn'
      )
    } else {
      DOMCacheGetOrSet('toggleConfirmShop').textContent = i18next.t(
        'shop.shopConfirmationOff'
      )
    }
    switch (player.shopBuyMaxToggle) {
      case false:
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buy1')
        break
      case 'TEN':
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buy10')
        break
      case true:
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buyMax')
        break
      case 'ANY':
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buyAny')
    }
    if (player.shopHideToggle) {
      DOMCacheGetOrSet('toggleHideShop').textContent = i18next.t('shop.hideMaxedOn')
    } else {
      DOMCacheGetOrSet('toggleHideShop').textContent = i18next.t('shop.hideMaxedOff')
    }
    if (player.researchBuyMaxToggle) {
      DOMCacheGetOrSet('toggleresearchbuy').textContent = i18next.t(
        'researches.upgradeMax'
      )
    } else {
      DOMCacheGetOrSet('toggleresearchbuy').textContent = i18next.t(
        'researches.upgradeOne'
      )
    }
    if (player.cubeUpgradesBuyMaxToggle) {
      DOMCacheGetOrSet('toggleCubeBuy').textContent = i18next.t(
        'toggles.upgradeMaxIfPossible'
      )
    } else {
      DOMCacheGetOrSet('toggleCubeBuy').textContent = i18next.t(
        'toggles.upgradeOneLevelWow'
      )
    }
    autoCubeUpgradesToggle(false)
    autoPlatonicUpgradesToggle(false)

    for (let i = 0; i < 2; i++) {
      toggleAntMaxBuy()
      toggleAntAutoSacrifice(0)
      toggleAntAutoSacrifice(1)
    }

    for (let i = 0; i < 2; i++) {
      toggleAutoAscend(0)
      toggleAutoAscend(1)
    }

    DOMCacheGetOrSet(
      'historyTogglePerSecondButton'
    ).textContent = `Per second: ${player.historyShowPerSecond ? 'ON' : 'OFF'}`
    DOMCacheGetOrSet('historyTogglePerSecondButton').style.borderColor = player.historyShowPerSecond ? 'green' : 'red'

    // If auto research is enabled and runing; Make sure there is something to try to research if possible
    if (
      player.autoResearchToggle
      && autoResearchEnabled()
      && player.autoResearchMode === 'cheapest'
    ) {
      player.autoResearch = G.researchOrderByCost[player.roombaResearchIndex]
    }

    player.autoResearch = Math.min(200, player.autoResearch)
    player.autoSacrifice = Math.min(5, player.autoSacrifice)

    if (player.researches[61] === 0) {
      DOMCacheGetOrSet('automaticobtainium').textContent = i18next.t(
        'main.buyResearch3x11'
      )
    }

    if (player.autoSacrificeToggle && player.autoSacrifice > 0.5) {
      DOMCacheGetOrSet(`rune${player.autoSacrifice}`).style.backgroundColor = 'orange'
    }

    if (player.autoWarpCheck) {
      DOMCacheGetOrSet('warpAuto').textContent = i18next.t(
        'general.autoOnColon'
      )
      DOMCacheGetOrSet('warpAuto').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('warpAuto').textContent = i18next.t(
        'general.autoOffColon'
      )
      DOMCacheGetOrSet('warpAuto').style.border = '2px solid red'
    }
    DOMCacheGetOrSet('autoHepteractPercentage').textContent = i18next.t(
      'wowCubes.hepteractForge.autoSetting',
      {
        x: `${player.hepteractAutoCraftPercentage}`
      }
    )
    DOMCacheGetOrSet('hepteractToQuarkTradeAuto').textContent = player.overfluxOrbsAutoBuy
      ? i18next.t('general.autoOnColon')
      : i18next.t('general.autoOffColon')
    DOMCacheGetOrSet('hepteractToQuarkTradeAuto').style.border = `2px solid ${
      player.overfluxOrbsAutoBuy ? 'green' : 'red'
    }`
    toggleAutoBuyOrbs(true, true)

    DOMCacheGetOrSet('blueberryToggleMode').innerHTML = player.blueberryLoadoutMode === 'saveTree'
      ? i18next.t('ambrosia.loadouts.save')
      : i18next.t('ambrosia.loadouts.load')

    toggleTalismanBuy(player.buyTalismanShardPercent)
    updateTalismanInventory()
    calculateObtainium()
    calculateAnts()
    calculateRuneLevels()
    resetHistoryRenderAllTables()
    updateSingularityAchievements()
    updateSingularityGlobalPerks()
  }

  updateAchievementBG()
  if (player.currentChallenge.reincarnation) {
    resetrepeat('reincarnationChallenge')
  } else if (player.currentChallenge.transcension) {
    resetrepeat('transcensionChallenge')
  }

  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes()
  const s = d.getSeconds()
  player.dayTimer = 60 * 60 * 24 - (s + 60 * m + 60 * 60 * h)
}
