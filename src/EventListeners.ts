import i18next from 'i18next'
import { achievementdescriptions, achievementpointvalues } from './Achievements'
import {
  antRepeat,
  antUpgradeDescription,
  buyAntProducers,
  buyAntUpgrade,
  sacrificeAnts,
  updateAntDescription
} from './Ants'
import {
  createLoadoutDescription,
  exportBlueberryTree,
  importBlueberryTree,
  loadoutHandler,
  resetBlueberryTree
} from './BlueberryUpgrades'
import {
  boostAccelerator,
  buyAccelerator,
  buyAllBlessings,
  buyCrystalUpgrades,
  buyMultiplier,
  buyParticleBuilding,
  buyProducer,
  buyRuneBonusLevels,
  buyTesseractBuilding
} from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { exitOffline, forcedDailyReset, timeWarp } from './Calculate'
import { challengeDisplay, toggleRetryChallenges } from './Challenges'
import { testing } from './Config'
import { corruptionCleanseConfirm, corruptionDisplay } from './Corruptions'
import { buyCubeUpgrades, cubeUpgradeDesc } from './Cubes'
import { clickSmith } from './Event'
import {
  hepteractDescriptions,
  hepteractToOverfluxOrbDescription,
  overfluxPowderDescription,
  overfluxPowderWarp,
  toggleAutoBuyOrbs,
  tradeHepteractToOverfluxOrb
} from './Hepteracts'
import { resetHistoryTogglePerSecond } from './History'
import { resetHotkeys } from './Hotkeys'
import {
  addCodeAvailableUses,
  exportSynergism,
  importData,
  importSynergism,
  promocodes,
  promocodesInfo,
  promocodesPrompt,
  reloadDeleteGame,
  resetGame,
  updateSaveString
} from './ImportExport'
import { buyPlatonicUpgrades, createPlatonicDescription } from './Platonic'
import { buyResearch, researchDescriptions } from './Research'
import { resetrepeat, updateAutoCubesOpens, updateAutoReset, updateTesseractAutoBuyAmount } from './Reset'
import { displayRuneInformation, redeemShards } from './Runes'
import { buyShopUpgrades, resetShopUpgrades, shopData, shopDescriptions, shopUpgradeTypes, useConsumable } from './Shop'
import { buyGoldenQuarks, getLastUpgradeInfo, singularityPerks } from './singularity'
import { displayStats } from './Statistics'
import { generateExportSummary } from './Summary'
import { player, resetCheck, saveSynergy } from './Synergism'
import { changeSubTab, Tabs } from './Tabs'
import {
  buyAllTalismanResources,
  buyTalismanEnhance,
  buyTalismanLevels,
  buyTalismanResources,
  changeTalismanModifier,
  respecTalismanCancel,
  respecTalismanConfirm,
  showEnhanceTalismanPrices,
  showRespecInformation,
  showTalismanEffect,
  showTalismanPrices,
  toggleTalismanBuy,
  updateTalismanCostDisplay
} from './Talismans'
import { IconSets, imgErrorHandler, toggleAnnotation, toggleIconSet, toggleTheme } from './Themes'
import {
  autoCubeUpgradesToggle,
  autoPlatonicUpgradesToggle,
  toggleAntAutoSacrifice,
  toggleAntMaxBuy,
  toggleAscStatPerSecond,
  toggleAutoAscend,
  toggleAutoBuyFragment,
  toggleautobuytesseract,
  toggleAutoChallengeRun,
  toggleAutoChallengesIgnore,
  toggleautoenhance,
  toggleautofortify,
  toggleautoopensCubes,
  toggleAutoResearch,
  toggleAutoResearchMode,
  toggleautoreset,
  toggleAutoSacrifice,
  toggleAutoTesseracts,
  toggleBlueberryLoadoutmode,
  toggleBuyAmount,
  toggleBuyMaxShop,
  toggleChallenges,
  toggleCorruptionLevel,
  toggleHepteractAutoPercentage,
  toggleHideShop,
  toggleMaxBuyCube,
  toggleResearchBuy,
  toggleSaveOff,
  toggleSettings,
  toggleShopConfirmation,
  toggleShops,
  updateAutoChallenge,
  updateRuneBlessingBuyAmount
} from './Toggles'
import type { OneToFive, Player } from './types/Synergism'
import { Confirm } from './UpdateHTML'
import { shopMouseover } from './UpdateVisuals'
import {
  buyConstantUpgrades,
  categoryUpgrades,
  clickUpgrades,
  constantUpgradeDescriptions,
  crystalupgradedescriptions,
  upgradedescriptions
} from './Upgrades'
import { Globals as G } from './Variables'

/* STYLE GUIDE */
/*
    1) When adding event handlers please put it in respective tabs, in the correct subcategory.
    Generally it would be preferred to put it in the lowest spot.
    2) Please put any Mouseover events before Click events, if two event handlers are needed for an element.
    3) Do *NOT* add event handlers to index.html. You may only add them in js/ts files!
    4) Using for loops: be careful about passing arguments. If necessary, please use a currying function (See: Line 80-90)
    5) If you are documenting a new tab or subtab, please comment out the order in which you add event handlers.
    6) It is strongly recommended you only add event handlers in the generateEventHandlers() function, but if you are
    creating new elements through js/ts you may do so outside of this file (E.g. corruptions)

    Platonic and/or Khafra have the right to close PRs that do not conform to this style guide

    If you are editing this script, please update the below time:
    Last Edited: June 10, 2021 3:04 AM UTC-8
*/

export const generateEventHandlers = () => {
  const ordinals = [
    'null',
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth'
  ] as const

  if (testing) {
    const warp = document.createElement('button')
    const dayReset = document.createElement('button')
    warp.textContent = 'Click here to warp time! [TESTING ONLY]'
    warp.setAttribute(
      'style',
      'width: auto; height: 30px; border: 6px solid gold;'
    )
    warp.addEventListener('click', () => timeWarp())
    dayReset.textContent = 'Click to force a new day! [TESTING ONLY]'
    dayReset.setAttribute(
      'style',
      'width: auto; height: 30px; border: 6px solid orange;'
    )
    dayReset.addEventListener('click', () => forcedDailyReset())

    const consumables = DOMCacheGetOrSet('actualConsumables')
    consumables.appendChild(warp)
    consumables.appendChild(dayReset)
  }
  // Offline Button
  DOMCacheGetOrSet('exitOffline').addEventListener('click', () => exitOffline())
  DOMCacheGetOrSet('offlineContainer').addEventListener('dblclick', () => exitOffline())
  // UPPER UI ELEMENTS
  // Prelude: Cube/Tesseract/Hypercube/Platonic display UIs (Onclicks)
  DOMCacheGetOrSet('ascCubeStats').addEventListener('click', () => toggleAscStatPerSecond(1))
  DOMCacheGetOrSet('ascTessStats').addEventListener('click', () => toggleAscStatPerSecond(2))
  DOMCacheGetOrSet('ascHyperStats').addEventListener('click', () => toggleAscStatPerSecond(3))
  DOMCacheGetOrSet('ascPlatonicStats').addEventListener('click', () => toggleAscStatPerSecond(4))
  DOMCacheGetOrSet('ascHepteractStats').addEventListener('click', () => toggleAscStatPerSecond(5))
  DOMCacheGetOrSet('ascTimeTakenStats').addEventListener('click', () => toggleAscStatPerSecond(6))
  // Part 1: Reset Tiers
  // Onmouseover Events
  DOMCacheGetOrSet('prestigebtn').addEventListener('mouseover', () => resetrepeat('prestige'))
  DOMCacheGetOrSet('transcendbtn').addEventListener('mouseover', () => resetrepeat('transcension'))
  DOMCacheGetOrSet('reincarnatebtn').addEventListener('mouseover', () => resetrepeat('reincarnation'))
  DOMCacheGetOrSet('acceleratorboostbtn').addEventListener('mouseover', () => resetrepeat('acceleratorBoost'))
  DOMCacheGetOrSet('challengebtn').addEventListener('mouseover', () => resetrepeat('transcensionChallenge'))
  DOMCacheGetOrSet('reincarnatechallengebtn').addEventListener(
    'mouseover',
    () => resetrepeat('reincarnationChallenge')
  )
  DOMCacheGetOrSet('ascendChallengeBtn').addEventListener('mouseover', () => resetrepeat('ascensionChallenge'))
  DOMCacheGetOrSet('ascendbtn').addEventListener('mouseover', () => resetrepeat('ascension'))
  DOMCacheGetOrSet('singularitybtn').addEventListener('mouseover', () => resetrepeat('singularity'))

  for (
    const resetButton of Array.from(
      document.getElementsByClassName('resetbtn')
    )
  ) {
    resetButton.addEventListener('mouseover', () => {
      resetButton.classList.add('hover')
    })

    resetButton.addEventListener('mouseout', () => {
      resetButton.classList.remove('hover')

      if (player.currentChallenge.reincarnation) {
        resetrepeat('reincarnationChallenge')
      } else if (player.currentChallenge.transcension) {
        resetrepeat('transcensionChallenge')
      }
    })
  }

  // Onclick Events (this is particularly bad)
  DOMCacheGetOrSet('prestigebtn').addEventListener('click', () => resetCheck('prestige'))
  DOMCacheGetOrSet('transcendbtn').addEventListener('click', () => resetCheck('transcension'))
  DOMCacheGetOrSet('reincarnatebtn').addEventListener('click', () => resetCheck('reincarnation'))
  DOMCacheGetOrSet('acceleratorboostbtn').addEventListener('click', () => boostAccelerator())
  DOMCacheGetOrSet('challengebtn').addEventListener('click', () => resetCheck('transcensionChallenge', undefined, true))
  DOMCacheGetOrSet('reincarnatechallengebtn').addEventListener(
    'click',
    () => resetCheck('reincarnationChallenge', undefined, true)
  )
  DOMCacheGetOrSet('ascendChallengeBtn').addEventListener('click', () => resetCheck('ascensionChallenge'))
  DOMCacheGetOrSet('ascendbtn').addEventListener('click', () => resetCheck('ascension'))
  DOMCacheGetOrSet('singularitybtn').addEventListener('click', () => resetCheck('singularity'))

  // BUILDINGS TAB
  // Part 1: Upper portion (Subtab toggle)
  const buildingTypes = ['Coin', 'Diamond', 'Mythos', 'Particle', 'Tesseract']
  for (let index = 0; index < buildingTypes.length; index++) {
    DOMCacheGetOrSet(
      `switchTo${buildingTypes[index]}Building`
    ).addEventListener('click', () => changeSubTab(Tabs.Buildings, { page: index }))
  }
  // Part 2: Building Amount Toggles
  const buildingTypesAlternate = [
    'coin',
    'crystal',
    'mythos',
    'particle',
    'tesseract',
    'offering'
  ] as const
  const buildingOrds = ['one', 'ten', 'hundred', 'thousand', '10k', '100k']
  const buildingOrdsToNum = [1, 10, 100, 1000, 10000, 100000] as const
  for (let index = 0; index < buildingOrds.length; index++) {
    for (let index2 = 0; index2 < buildingTypesAlternate.length; index2++) {
      DOMCacheGetOrSet(
        buildingTypesAlternate[index2] + buildingOrds[index]
      ).addEventListener('click', () =>
        toggleBuyAmount(
          buildingOrdsToNum[index],
          buildingTypesAlternate[index2]
        ))
    }
  }
  // Part 3: Building Purchasers + Upgrades
  // Accelerator, Multiplier, Accelerator Boost
  DOMCacheGetOrSet('buyaccelerator').addEventListener('click', () => buyAccelerator())
  DOMCacheGetOrSet('buymultiplier').addEventListener('click', () => buyMultiplier())
  DOMCacheGetOrSet('buyacceleratorboost').addEventListener('click', () => boostAccelerator())

  // Coin, Diamond and Mythos Buildings
  const buildingTypesAlternate2 = ['coin', 'diamond', 'mythos']
  const buildingTypesAlternate3 = ['Coin', 'Diamonds', 'Mythos'] as const // TODO: A cleaner way to implement this dumb shit
  for (let index = 0; index < 3; index++) {
    for (let index2 = 1; index2 <= 5; index2++) {
      DOMCacheGetOrSet(
        `buy${buildingTypesAlternate2[index]}${index2}`
      ).addEventListener('click', () =>
        buyProducer(
          ordinals[index2 as OneToFive],
          buildingTypesAlternate3[index],
          index === 0 ? index2 : (index2 * (index2 + 1)) / 2
        ))
    }
  }

  // Crystal Upgrades (Mouseover and Onclick)
  for (let index = 1; index <= 5; index++) {
    DOMCacheGetOrSet(`buycrystalupgrade${index}`).addEventListener(
      'mouseover',
      () => crystalupgradedescriptions(index)
    )
    DOMCacheGetOrSet(`buycrystalupgrade${index}`).addEventListener(
      'click',
      () => buyCrystalUpgrades(index)
    )
  }

  // Particle Buildings
  for (let index = 0; index < 5; index++) {
    DOMCacheGetOrSet(`buyparticles${index + 1}`).addEventListener(
      'click',
      () => buyParticleBuilding((index + 1) as OneToFive)
    )
  }

  // Tesseract Buildings
  for (let index = 0; index < 5; index++) {
    DOMCacheGetOrSet(`buyTesseracts${index + 1}`).addEventListener(
      'click',
      () => buyTesseractBuilding((index + 1) as OneToFive)
    )
    DOMCacheGetOrSet(`tesseractAutoToggle${index + 1}`).addEventListener(
      'click',
      () => toggleAutoTesseracts(index + 1)
    )
  }

  // Constant Upgrades
  for (let index = 0; index < 10; index++) {
    DOMCacheGetOrSet(`buyConstantUpgrade${index + 1}`).addEventListener(
      'mouseover',
      () => constantUpgradeDescriptions(index + 1)
    )
    DOMCacheGetOrSet(`buyConstantUpgrade${index + 1}`).addEventListener(
      'click',
      () => buyConstantUpgrades(index + 1)
    )
  }

  // Part 4: Toggles
  // I'm just addressing all global toggles here
  const toggles = document.querySelectorAll<HTMLElement>('.auto[toggleid]')
  toggles.forEach((b) => b.addEventListener('click', () => toggleSettings(b)))
  // Toggles auto reset type (between TIME and AMOUNT for 3 first Tiers, and between PERCENTAGE and AMOUNT for Tesseracts)
  DOMCacheGetOrSet('prestigeautotoggle').addEventListener('click', () => toggleautoreset(1))
  DOMCacheGetOrSet('transcendautotoggle').addEventListener('click', () => toggleautoreset(2))
  DOMCacheGetOrSet('reincarnateautotoggle').addEventListener('click', () => toggleautoreset(3))
  DOMCacheGetOrSet('tesseractautobuymode').addEventListener('click', () => toggleautoreset(4))
  // Toggles auto reset amount required to trigger
  DOMCacheGetOrSet('prestigeamount').addEventListener('blur', () => updateAutoReset(1))
  DOMCacheGetOrSet('transcendamount').addEventListener('blur', () => updateAutoReset(2))
  DOMCacheGetOrSet('reincarnationamount').addEventListener('blur', () => updateAutoReset(3))
  DOMCacheGetOrSet('ascensionAmount').addEventListener('blur', () => updateAutoReset(4))
  DOMCacheGetOrSet('autoAntSacrificeAmount').addEventListener('blur', () => updateAutoReset(5))
  // Tesseract-specific of the above. I don't know why I didn't standardize names here.
  DOMCacheGetOrSet('tesseractautobuytoggle').addEventListener('click', () => toggleautobuytesseract())
  DOMCacheGetOrSet('tesseractAmount').addEventListener('blur', () => updateTesseractAutoBuyAmount())
  // Auto Opening of Cubes
  DOMCacheGetOrSet('cubeOpensInput').addEventListener('blur', () => updateAutoCubesOpens(1))
  DOMCacheGetOrSet('tesseractsOpensInput').addEventListener('blur', () => updateAutoCubesOpens(2))
  DOMCacheGetOrSet('hypercubesOpensInput').addEventListener('blur', () => updateAutoCubesOpens(3))
  DOMCacheGetOrSet('platonicCubeOpensInput').addEventListener('blur', () => updateAutoCubesOpens(4))
  DOMCacheGetOrSet('openCubes').addEventListener('click', () => toggleautoopensCubes(1))
  DOMCacheGetOrSet('openTesseracts').addEventListener('click', () => toggleautoopensCubes(2))
  DOMCacheGetOrSet('openHypercubes').addEventListener('click', () => toggleautoopensCubes(3))
  DOMCacheGetOrSet('openPlatonicCube').addEventListener('click', () => toggleautoopensCubes(4))

  // UPGRADES TAB
  // For all upgrades in the Upgrades Tab (125) count, we have the same mouseover event. So we'll work on those first.
  for (let index = 1; index <= 125; index++) {
    // Onmouseover events ()
    DOMCacheGetOrSet(`upg${index}`).addEventListener('mouseover', () => upgradedescriptions(index))
  }

  // Generates all upgrade button events
  for (let index = 1; index <= 125; index++) {
    DOMCacheGetOrSet(`upg${index}`).addEventListener('click', () => clickUpgrades(index, false))
  }

  for (let index = 1; index <= 6; index++) {
    DOMCacheGetOrSet(`upgrades${index}`).addEventListener('click', () => categoryUpgrades(index, false))
  }

  // Next part: Shop-specific toggles
  DOMCacheGetOrSet('coinAutoUpgrade').addEventListener('click', () => toggleShops('coin'))
  DOMCacheGetOrSet('prestigeAutoUpgrade').addEventListener('click', () => toggleShops('prestige'))
  DOMCacheGetOrSet('transcendAutoUpgrade').addEventListener('click', () => toggleShops('transcend'))
  DOMCacheGetOrSet('generatorsAutoUpgrade').addEventListener('click', () => toggleShops('generators'))
  DOMCacheGetOrSet('reincarnateAutoUpgrade').addEventListener('click', () => toggleShops('reincarnate'))

  // ACHIEVEMENTS TAB
  // TODO: Remove 1 indexing
  for (let index = 1; index <= achievementpointvalues.length - 1; index++) {
    // Onmouseover events (Achievement descriptions)
    DOMCacheGetOrSet(`ach${index}`).addEventListener('mouseover', () => achievementdescriptions(index))
  }

  // RUNES TAB [And all corresponding subtabs]
  // Part 0: Upper UI portion
  // Auto sacrifice toggle button
  DOMCacheGetOrSet('toggleautosacrifice').addEventListener('click', () => toggleAutoSacrifice(0))
  // Toggle subtabs of Runes tab
  for (let index = 0; index < 4; index++) {
    DOMCacheGetOrSet(`toggleRuneSubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.Runes, { page: index })
    )
  }

  // Part 1: Runes Subtab
  for (let index = 0; index < 7; index++) {
    DOMCacheGetOrSet(`rune${index + 1}`).addEventListener('mouseover', () => displayRuneInformation(index + 1))
    DOMCacheGetOrSet(`rune${index + 1}`).addEventListener('click', () => toggleAutoSacrifice(index + 1))

    DOMCacheGetOrSet(`activaterune${index + 1}`).addEventListener(
      'mouseover',
      () => displayRuneInformation(index + 1)
    )
    DOMCacheGetOrSet(`activaterune${index + 1}`).addEventListener('click', () => redeemShards(index + 1))
  }

  // Part 2: Talismans Subtab
  const talismanBuyPercents = [10, 25, 50, 100]
  const talismanBuyPercentsOrd = ['Ten', 'TwentyFive', 'Fifty', 'Hundred']

  for (let index = 0; index < talismanBuyPercents.length; index++) {
    DOMCacheGetOrSet(
      `talisman${talismanBuyPercentsOrd[index]}`
    ).addEventListener('click', () => toggleTalismanBuy(talismanBuyPercents[index]))
  }

  DOMCacheGetOrSet('toggleautoBuyFragments').addEventListener('click', () => toggleAutoBuyFragment())
  DOMCacheGetOrSet('toggleautoenhance').addEventListener('click', () => toggleautoenhance())
  DOMCacheGetOrSet('toggleautofortify').addEventListener('click', () => toggleautofortify())

  // Talisman Fragments/Shards
  const talismanItemNames = [
    'shard',
    'commonFragment',
    'uncommonFragment',
    'rareFragment',
    'epicFragment',
    'legendaryFragment',
    'mythicalFragment'
  ] as const
  for (let index = 0; index < talismanItemNames.length; index++) {
    DOMCacheGetOrSet(`buyTalismanItem${index + 1}`).addEventListener(
      'mouseover',
      () => updateTalismanCostDisplay(talismanItemNames[index])
    )
    DOMCacheGetOrSet(`buyTalismanItem${index + 1}`).addEventListener(
      'click',
      () => buyTalismanResources(talismanItemNames[index])
    )
  }

  DOMCacheGetOrSet('buyTalismanAll').addEventListener('mouseover', () => updateTalismanCostDisplay(null))
  DOMCacheGetOrSet('buyTalismanAll').addEventListener('click', () => buyAllTalismanResources())

  for (let index = 0; index < 7; index++) {
    DOMCacheGetOrSet(`talisman${index + 1}`).addEventListener('click', () => showTalismanEffect(index))
    DOMCacheGetOrSet(`leveluptalisman${index + 1}`).addEventListener(
      'mouseover',
      () => showTalismanPrices(index)
    )
    DOMCacheGetOrSet(`leveluptalisman${index + 1}`).addEventListener(
      'click',
      () => buyTalismanLevels(index)
    )
    DOMCacheGetOrSet(`enhancetalisman${index + 1}`).addEventListener(
      'mouseover',
      () => showEnhanceTalismanPrices(index)
    )
    DOMCacheGetOrSet(`enhancetalisman${index + 1}`).addEventListener(
      'click',
      () => buyTalismanEnhance(index)
    )
    DOMCacheGetOrSet(`respectalisman${index + 1}`).addEventListener(
      'click',
      () => showRespecInformation(index)
    )
  }

  DOMCacheGetOrSet('respecAllTalismans').addEventListener('click', () => showRespecInformation(7))
  DOMCacheGetOrSet('confirmTalismanRespec').addEventListener('click', () => respecTalismanConfirm(G.talismanRespec))
  DOMCacheGetOrSet('cancelTalismanRespec').addEventListener('click', () => respecTalismanCancel(G.talismanRespec))

  for (let index = 0; index < 5; index++) {
    DOMCacheGetOrSet(`talismanRespecButton${index + 1}`).addEventListener(
      'click',
      () => changeTalismanModifier(index + 1)
    )
  }

  // Part 3: Blessings and Spirits
  for (let index = 0; index < 5; index++) {
    DOMCacheGetOrSet(`runeBlessingPurchase${index + 1}`).addEventListener(
      'click',
      () => buyRuneBonusLevels('Blessings', index + 1)
    )
    DOMCacheGetOrSet(`runeSpiritPurchase${index + 1}`).addEventListener(
      'click',
      () => buyRuneBonusLevels('Spirits', index + 1)
    )
  }
  DOMCacheGetOrSet('buyRuneBlessingInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(1))
  DOMCacheGetOrSet('buyRuneSpiritInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(2))

  DOMCacheGetOrSet('buyAllBlessings').addEventListener('click', () => buyAllBlessings('Blessings'))
  DOMCacheGetOrSet('buyAllSpirits').addEventListener('click', () => buyAllBlessings('Spirits'))

  // CHALLENGES TAB
  // Part 1: Challenges
  // Challenge 1-15 buttons
  for (let index = 0; index < 15; index++) {
    DOMCacheGetOrSet(`challenge${index + 1}`).addEventListener('click', () => challengeDisplay(index + 1))
    DOMCacheGetOrSet(`challenge${index + 1}`).addEventListener(
      'dblclick',
      () => {
        challengeDisplay(index + 1)
        toggleChallenges(G.triggerChallenge, false)
      }
    )
  }
  // Part 2: QoL Buttons
  // Individual buttons (Start, Retry)
  DOMCacheGetOrSet('startChallenge').addEventListener('click', () => toggleChallenges(G.triggerChallenge, false))
  DOMCacheGetOrSet('retryChallenge').addEventListener('click', () => toggleRetryChallenges())
  // Autochallenge buttons
  DOMCacheGetOrSet('toggleAutoChallengeIgnore').addEventListener(
    'click',
    () => toggleAutoChallengesIgnore(G.triggerChallenge)
  )
  DOMCacheGetOrSet('toggleAutoChallengeStart').addEventListener('click', () => toggleAutoChallengeRun())
  DOMCacheGetOrSet('startAutoChallengeTimerInput').addEventListener(
    'input',
    () => updateAutoChallenge(1)
  )
  DOMCacheGetOrSet('exitAutoChallengeTimerInput').addEventListener(
    'input',
    () => updateAutoChallenge(2)
  )
  DOMCacheGetOrSet('enterAutoChallengeTimerInput').addEventListener(
    'input',
    () => updateAutoChallenge(3)
  )

  // RESEARCH TAB
  // Part 1: Researches
  // There are 200 researches, ideally in rewrite 200 would instead be length of research list/array
  for (let index = 1; index < 200; index++) {
    // Eliminates listeners on index.html 1404-1617
    DOMCacheGetOrSet(`res${index}`).addEventListener('click', () => buyResearch(index))
    DOMCacheGetOrSet(`res${index}`).addEventListener('mouseover', () => researchDescriptions(index))
  }
  // Research 200 is special, uses more params
  DOMCacheGetOrSet('res200').addEventListener('click', () => buyResearch(200, false, 0.01))
  DOMCacheGetOrSet('res200').addEventListener('mouseover', () => researchDescriptions(200, false, 0.01))

  // Part 2: QoL buttons
  DOMCacheGetOrSet('toggleresearchbuy').addEventListener('click', () => toggleResearchBuy())
  DOMCacheGetOrSet('toggleautoresearch').addEventListener('click', () => toggleAutoResearch())
  DOMCacheGetOrSet('toggleautoresearchmode').addEventListener('click', () => toggleAutoResearchMode())

  // ANTHILL TAB
  // Part 1: Ant Producers (Tiers 1-8)
  const antProducerCostVals = [
    'null',
    '1e700',
    '3',
    '100',
    '10000',
    '1e12',
    '1e36',
    '1e100',
    '1e300'
  ]
  for (let index = 1; index <= 8; index++) {
    // Onmouse Events
    DOMCacheGetOrSet(`anttier${index}`).addEventListener('mouseover', () => updateAntDescription(index))
    DOMCacheGetOrSet(`anttier${index}`).addEventListener('mouseover', () => antRepeat(index))
    // Onclick Events
    DOMCacheGetOrSet(`anttier${index}`).addEventListener('click', () =>
      buyAntProducers(
        ordinals[index] as Parameters<typeof buyAntProducers>[0],
        antProducerCostVals[index],
        index
      ))
  }
  // Part 2: Ant Upgrades (1-12)
  const antUpgradeCostVals = [
    'null',
    '100',
    '100',
    '1000',
    '1000',
    '1e5',
    '1e6',
    '1e8',
    '1e11',
    '1e15',
    '1e20',
    '1e40',
    '1e100'
  ]
  for (let index = 1; index <= 12; index++) {
    // Onmouse Event
    DOMCacheGetOrSet(`antUpgrade${index}`).addEventListener('mouseover', () => antUpgradeDescription(index))
    // Onclick Event
    DOMCacheGetOrSet(`antUpgrade${index}`).addEventListener(
      'click',
      () => buyAntUpgrade(antUpgradeCostVals[index], false, index)
    )
  }
  // Part 3: Sacrifice
  DOMCacheGetOrSet('antSacrifice').addEventListener('click', () => sacrificeAnts())

  // Part 4: QoL Buttons
  DOMCacheGetOrSet('toggleAntMax').addEventListener('click', () => toggleAntMaxBuy())
  DOMCacheGetOrSet('toggleAutoSacrificeAnt').addEventListener('click', () => toggleAntAutoSacrifice(0))
  DOMCacheGetOrSet('autoSacrificeAntMode').addEventListener('click', () => toggleAntAutoSacrifice(1))

  // WOW! Cubes Tab
  // Part 0: Subtab UI
  for (let index = 0; index < 7; index++) {
    DOMCacheGetOrSet(`switchCubeSubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.WowCubes, { page: index })
    )
  }

  // Part 1: Cube Upgrades
  for (let index = 1; index < player.cubeUpgrades.length; index++) {
    DOMCacheGetOrSet(`cubeUpg${index}`).addEventListener('mouseover', () => cubeUpgradeDesc(index))
    DOMCacheGetOrSet(`cubeUpg${index}`).addEventListener('click', () => buyCubeUpgrades(index))
  }

  // Toggle
  DOMCacheGetOrSet('toggleCubeBuy').addEventListener('click', () => toggleMaxBuyCube())
  DOMCacheGetOrSet('toggleAutoCubeUpgrades').addEventListener('click', () => autoCubeUpgradesToggle())

  // Part 2: Cube Opening Buttons
  // Wow Cubes
  DOMCacheGetOrSet('open1Cube').addEventListener('click', () => player.wowCubes.open(1, false))
  DOMCacheGetOrSet('open20Cube').addEventListener(
    'click',
    () => player.wowCubes.open(Math.floor(Number(player.wowCubes) / 10), false)
  )
  DOMCacheGetOrSet('open1000Cube').addEventListener(
    'click',
    () => player.wowCubes.open(Math.floor(Number(player.wowCubes) / 2), false)
  )
  DOMCacheGetOrSet('openCustomCube').addEventListener('click', () => player.wowCubes.openCustom())
  DOMCacheGetOrSet('openMostCube').addEventListener('click', () => player.wowCubes.open(0, true))
  // Wow Tesseracts
  DOMCacheGetOrSet('open1Tesseract').addEventListener('click', () => player.wowTesseracts.open(1, false))
  DOMCacheGetOrSet('open20Tesseract').addEventListener('click', () =>
    player.wowTesseracts.open(
      Math.floor(Number(player.wowTesseracts) / 10),
      false
    ))
  DOMCacheGetOrSet('open1000Tesseract').addEventListener('click', () =>
    player.wowTesseracts.open(
      Math.floor(Number(player.wowTesseracts) / 2),
      false
    ))
  DOMCacheGetOrSet('openCustomTesseract').addEventListener('click', () => player.wowTesseracts.openCustom())
  DOMCacheGetOrSet('openMostTesseract').addEventListener('click', () => player.wowTesseracts.open(1, true))
  // Wow Hypercubes
  DOMCacheGetOrSet('open1Hypercube').addEventListener('click', () => player.wowHypercubes.open(1, false))
  DOMCacheGetOrSet('open20Hypercube').addEventListener('click', () =>
    player.wowHypercubes.open(
      Math.floor(Number(player.wowHypercubes) / 10),
      false
    ))
  DOMCacheGetOrSet('open1000Hypercube').addEventListener('click', () =>
    player.wowHypercubes.open(
      Math.floor(Number(player.wowHypercubes) / 2),
      false
    ))
  DOMCacheGetOrSet('openCustomHypercube').addEventListener('click', () => player.wowHypercubes.openCustom())
  DOMCacheGetOrSet('openMostHypercube').addEventListener('click', () => player.wowHypercubes.open(1, true))
  // Wow Platonic Cubes
  DOMCacheGetOrSet('open1PlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1, false))
  DOMCacheGetOrSet('open40kPlatonicCube').addEventListener('click', () =>
    player.wowPlatonicCubes.open(
      Math.floor(Number(player.wowPlatonicCubes) / 10),
      false
    ))
  DOMCacheGetOrSet('open1mPlatonicCube').addEventListener('click', () =>
    player.wowPlatonicCubes.open(
      Math.floor(Number(player.wowPlatonicCubes) / 2),
      false
    ))
  DOMCacheGetOrSet('openCustomPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.openCustom())
  DOMCacheGetOrSet('openMostPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1, true))

  DOMCacheGetOrSet('saveOffToggle').addEventListener('click', () => toggleSaveOff())
  // Part 3: Platonic Upgrade Section
  const platonicUpgrades = document.getElementsByClassName(
    'platonicUpgradeImage'
  )
  for (let index = 0; index < platonicUpgrades.length; index++) {
    platonicUpgrades[index].addEventListener('mouseover', () => createPlatonicDescription(index + 1))
    platonicUpgrades[index].addEventListener('click', () => buyPlatonicUpgrades(index + 1))
  }
  DOMCacheGetOrSet('toggleAutoPlatonicUpgrades').addEventListener('click', () => autoPlatonicUpgradesToggle())

  // Part 4: Hepteract Subtab
  DOMCacheGetOrSet('chronosHepteract').addEventListener('mouseover', () => hepteractDescriptions('chronos'))
  DOMCacheGetOrSet('hyperrealismHepteract').addEventListener('mouseover', () => hepteractDescriptions('hyperrealism'))
  DOMCacheGetOrSet('quarkHepteract').addEventListener('mouseover', () => hepteractDescriptions('quark'))
  DOMCacheGetOrSet('challengeHepteract').addEventListener('mouseover', () => hepteractDescriptions('challenge'))
  DOMCacheGetOrSet('abyssHepteract').addEventListener('mouseover', () => hepteractDescriptions('abyss'))
  DOMCacheGetOrSet('acceleratorHepteract').addEventListener('mouseover', () => hepteractDescriptions('accelerator'))
  DOMCacheGetOrSet('acceleratorBoostHepteract').addEventListener(
    'mouseover',
    () => hepteractDescriptions('acceleratorBoost')
  )
  DOMCacheGetOrSet('multiplierHepteract').addEventListener('mouseover', () => hepteractDescriptions('multiplier'))

  DOMCacheGetOrSet('chronosHepteractCraft').addEventListener('click', () => player.hepteractCrafts.chronos.craft())
  DOMCacheGetOrSet('hyperrealismHepteractCraft').addEventListener(
    'click',
    () => player.hepteractCrafts.hyperrealism.craft()
  )
  DOMCacheGetOrSet('quarkHepteractCraft').addEventListener('click', () => player.hepteractCrafts.quark.craft())
  DOMCacheGetOrSet('challengeHepteractCraft').addEventListener('click', () => player.hepteractCrafts.challenge.craft())
  DOMCacheGetOrSet('abyssHepteractCraft').addEventListener('click', () => player.hepteractCrafts.abyss.craft())
  DOMCacheGetOrSet('acceleratorHepteractCraft').addEventListener(
    'click',
    () => player.hepteractCrafts.accelerator.craft()
  )
  DOMCacheGetOrSet('acceleratorBoostHepteractCraft').addEventListener(
    'click',
    () => player.hepteractCrafts.acceleratorBoost.craft()
  )
  DOMCacheGetOrSet('multiplierHepteractCraft').addEventListener(
    'click',
    () => player.hepteractCrafts.multiplier.craft()
  )

  DOMCacheGetOrSet('chronosHepteractCraftMax').addEventListener(
    'click',
    () => player.hepteractCrafts.chronos.craft(true)
  )
  DOMCacheGetOrSet('hyperrealismHepteractCraftMax').addEventListener(
    'click',
    () => player.hepteractCrafts.hyperrealism.craft(true)
  )
  DOMCacheGetOrSet('quarkHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.quark.craft(true))
  DOMCacheGetOrSet('challengeHepteractCraftMax').addEventListener(
    'click',
    () => player.hepteractCrafts.challenge.craft(true)
  )
  DOMCacheGetOrSet('abyssHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.abyss.craft(true))
  DOMCacheGetOrSet('acceleratorHepteractCraftMax').addEventListener(
    'click',
    () => player.hepteractCrafts.accelerator.craft(true)
  )
  DOMCacheGetOrSet('acceleratorBoostHepteractCraftMax').addEventListener(
    'click',
    () => player.hepteractCrafts.acceleratorBoost.craft(true)
  )
  DOMCacheGetOrSet('multiplierHepteractCraftMax').addEventListener(
    'click',
    () => player.hepteractCrafts.multiplier.craft(true)
  )

  DOMCacheGetOrSet('chronosHepteractCap').addEventListener('click', () => player.hepteractCrafts.chronos.expand())
  DOMCacheGetOrSet('hyperrealismHepteractCap').addEventListener(
    'click',
    () => player.hepteractCrafts.hyperrealism.expand()
  )
  DOMCacheGetOrSet('quarkHepteractCap').addEventListener('click', () => player.hepteractCrafts.quark.expand())
  DOMCacheGetOrSet('challengeHepteractCap').addEventListener('click', () => player.hepteractCrafts.challenge.expand())
  DOMCacheGetOrSet('abyssHepteractCap').addEventListener('click', () => player.hepteractCrafts.abyss.expand())
  DOMCacheGetOrSet('acceleratorHepteractCap').addEventListener(
    'click',
    () => player.hepteractCrafts.accelerator.expand()
  )
  DOMCacheGetOrSet('acceleratorBoostHepteractCap').addEventListener(
    'click',
    () => player.hepteractCrafts.acceleratorBoost.expand()
  )
  DOMCacheGetOrSet('multiplierHepteractCap').addEventListener('click', () => player.hepteractCrafts.multiplier.expand())

  DOMCacheGetOrSet('chronosHepteractAuto').addEventListener(
    'click',
    () => player.hepteractCrafts.chronos.toggleAutomatic()
  )
  DOMCacheGetOrSet('hyperrealismHepteractAuto').addEventListener(
    'click',
    () => player.hepteractCrafts.hyperrealism.toggleAutomatic()
  )
  DOMCacheGetOrSet('quarkHepteractAuto').addEventListener('click', () => player.hepteractCrafts.quark.toggleAutomatic())
  DOMCacheGetOrSet('challengeHepteractAuto').addEventListener(
    'click',
    () => player.hepteractCrafts.challenge.toggleAutomatic()
  )
  DOMCacheGetOrSet('abyssHepteractAuto').addEventListener('click', () => player.hepteractCrafts.abyss.toggleAutomatic())
  DOMCacheGetOrSet('acceleratorHepteractAuto').addEventListener(
    'click',
    () => player.hepteractCrafts.accelerator.toggleAutomatic()
  )
  DOMCacheGetOrSet('acceleratorBoostHepteractAuto').addEventListener(
    'click',
    () => player.hepteractCrafts.acceleratorBoost.toggleAutomatic()
  )
  DOMCacheGetOrSet('multiplierHepteractAuto').addEventListener(
    'click',
    () => player.hepteractCrafts.multiplier.toggleAutomatic()
  )

  DOMCacheGetOrSet('hepteractToQuark').addEventListener('mouseover', () => hepteractToOverfluxOrbDescription())
  DOMCacheGetOrSet('hepteractToQuarkTrade').addEventListener('click', () => tradeHepteractToOverfluxOrb())
  DOMCacheGetOrSet('hepteractToQuarkTradeMax').addEventListener('click', () => tradeHepteractToOverfluxOrb(true))
  DOMCacheGetOrSet('hepteractToQuarkTradeAuto').addEventListener('click', () => toggleAutoBuyOrbs())
  DOMCacheGetOrSet('overfluxPowder').addEventListener('mouseover', () => overfluxPowderDescription())
  DOMCacheGetOrSet('powderDayWarp').addEventListener('click', () => overfluxPowderWarp(false))
  DOMCacheGetOrSet('warpAuto').addEventListener('click', () => overfluxPowderWarp(true))

  DOMCacheGetOrSet('hepteractAutoPercentageButton').addEventListener(
    'click',
    () => toggleHepteractAutoPercentage()
  )

  // CORRUPTION TAB
  // Part 0: Subtabs
  DOMCacheGetOrSet('corrStatsBtn').addEventListener('click', () => changeSubTab(Tabs.Corruption, { page: 0 }))
  DOMCacheGetOrSet('corrLoadoutsBtn').addEventListener('click', () => changeSubTab(Tabs.Corruption, { page: 1 }))

  // Part 1: Displays
  DOMCacheGetOrSet('corruptionDisplays').addEventListener('click', () => corruptionDisplay(10))
  DOMCacheGetOrSet('corruptionCleanse').addEventListener('click', () => corruptionCleanseConfirm())
  DOMCacheGetOrSet('corruptionCleanseConfirm').addEventListener('click', () => toggleCorruptionLevel(10, 999))

  // Extra toggle
  DOMCacheGetOrSet('ascensionAutoEnable').addEventListener('click', () => toggleAutoAscend(0))
  DOMCacheGetOrSet('ascensionAutoToggle').addEventListener('click', () => toggleAutoAscend(1))

  // SETTNGS TAB
  // Part 0: Subtabs
  const settingSubTabs = Array.from<HTMLElement>(
    document.querySelectorAll('[id^="switchSettingSubTab"]')
  )
  for (const subtab of settingSubTabs) {
    subtab.addEventListener('click', () => changeSubTab(Tabs.Settings, { page: settingSubTabs.indexOf(subtab) }))
  }

  const t = Array.from(
    document.querySelectorAll<HTMLElement>('button.statsNerds')
  )
  for (const s of t) {
    s.addEventListener('click', (e) => displayStats(e.target as HTMLElement))
  }

  DOMCacheGetOrSet('summaryGeneration').addEventListener('click', () => generateExportSummary())

  // Various functions
  DOMCacheGetOrSet('exportgame').addEventListener('click', () => exportSynergism())
  DOMCacheGetOrSet('saveStringInput').addEventListener('blur', (e) => updateSaveString(e.target as HTMLInputElement))
  DOMCacheGetOrSet('savegame').addEventListener('click', () => saveSynergy(true))
  DOMCacheGetOrSet('deleteGame').addEventListener('click', () => resetGame())
  DOMCacheGetOrSet('preloadDeleteGame').addEventListener('click', () => reloadDeleteGame())
  DOMCacheGetOrSet('promocodes').addEventListener('click', () => promocodesPrompt())
  DOMCacheGetOrSet('addCodeBox').addEventListener('mouseover', () => promocodesInfo('add'))
  DOMCacheGetOrSet('addCode').addEventListener('click', () => promocodes('add'))
  DOMCacheGetOrSet('addCodeAll').addEventListener('click', () => promocodes('add', addCodeAvailableUses()))
  DOMCacheGetOrSet('addCodeOne').addEventListener('click', () => promocodes('add', 1))
  DOMCacheGetOrSet('dailyCode').addEventListener('click', () => promocodes('daily'))
  DOMCacheGetOrSet('dailyCode').addEventListener('mouseover', () => promocodesInfo('daily'))
  DOMCacheGetOrSet('timeCode').addEventListener('click', () => promocodes('time'))
  DOMCacheGetOrSet('timeCode').addEventListener('mouseover', () => promocodesInfo('time'))
  DOMCacheGetOrSet('historyTogglePerSecondButton').addEventListener(
    'click',
    () => resetHistoryTogglePerSecond()
  )
  DOMCacheGetOrSet('resetHotkeys').addEventListener('click', () => resetHotkeys())
  DOMCacheGetOrSet('notation').addEventListener('click', () => toggleAnnotation())
  DOMCacheGetOrSet('iconSet').addEventListener('click', () => toggleIconSet(player.iconSet + 1))

  // SHOP TAB

  /*

TODO: Fix this entire tab it's utter shit

  */

  // Part 1: The Settings
  /*Respec The Upgrades*/ DOMCacheGetOrSet(
    'resetShopUpgrades'
  ).addEventListener('click', () => resetShopUpgrades())
  /*Toggle Shop Confirmations*/ DOMCacheGetOrSet(
    'toggleConfirmShop'
  ).addEventListener('click', () => toggleShopConfirmation())
  /*Toggle Shop Buy Max*/ DOMCacheGetOrSet('toggleBuyMaxShop').addEventListener(
    'click',
    (event) => toggleBuyMaxShop(event)
  )
  /*Toggle Hide Permanent Maxed*/ DOMCacheGetOrSet(
    'toggleHideShop'
  ).addEventListener('click', () => toggleHideShop())

  // Part 2: Potions
  /*Offering Potion*/
  DOMCacheGetOrSet('offeringPotions').addEventListener('mouseover', () => shopDescriptions('offeringPotion'))
  DOMCacheGetOrSet('offeringpotionowned').addEventListener('mouseover', () => shopDescriptions('offeringPotion'))
  DOMCacheGetOrSet('buyofferingpotion').addEventListener('mouseover', () => shopDescriptions('offeringPotion'))
  DOMCacheGetOrSet('useofferingpotion').addEventListener('mouseover', () => shopDescriptions('offeringPotion'))
  DOMCacheGetOrSet('buyofferingpotion').addEventListener('click', () => buyShopUpgrades('offeringPotion'))
  // DOMCacheGetOrSet('offeringPotions').addEventListener('click', () => buyShopUpgrades("offeringPotion"))  //Allow clicking of image to buy also
  DOMCacheGetOrSet('useofferingpotion').addEventListener('click', () => useConsumable('offeringPotion'))
  DOMCacheGetOrSet('toggle42').addEventListener('click', () => {
    player.autoPotionTimer = 0
  })
  /*Obtainium Potion*/
  DOMCacheGetOrSet('obtainiumPotions').addEventListener('mouseover', () => shopDescriptions('obtainiumPotion'))
  DOMCacheGetOrSet('obtainiumpotionowned').addEventListener('mouseover', () => shopDescriptions('obtainiumPotion'))
  DOMCacheGetOrSet('buyobtainiumpotion').addEventListener('mouseover', () => shopDescriptions('obtainiumPotion'))
  DOMCacheGetOrSet('useobtainiumpotion').addEventListener('mouseover', () => shopDescriptions('obtainiumPotion'))
  DOMCacheGetOrSet('buyobtainiumpotion').addEventListener('click', () => buyShopUpgrades('obtainiumPotion'))
  // DOMCacheGetOrSet('obtainiumPotions').addEventListener('click', () => buyShopUpgrades("obtainiumPotion"))  //Allow clicking of image to buy also
  DOMCacheGetOrSet('useobtainiumpotion').addEventListener('click', () => useConsumable('obtainiumPotion'))
  DOMCacheGetOrSet('toggle43').addEventListener('click', () => {
    player.autoPotionTimerObtainium = 0
  })
  /* Permanent Upgrade Images */
  const shopKeys = Object.keys(
    player.shopUpgrades
  ) as (keyof Player['shopUpgrades'])[]
  for (const key of shopKeys) {
    const shopItem = shopData[key]
    if (shopItem.type === shopUpgradeTypes.UPGRADE) {
      DOMCacheGetOrSet(`${key}`).addEventListener('mouseover', () => shopDescriptions(key))
      DOMCacheGetOrSet(`${key}Level`).addEventListener('mouseover', () => shopDescriptions(key))
      DOMCacheGetOrSet(`${key}Button`).addEventListener('mouseover', () => shopDescriptions(key))
      // DOMCacheGetOrSet(`${key}`).addEventListener('click', () => buyShopUpgrades(key))  //Allow clicking of image to buy also
      DOMCacheGetOrSet(`${key}Button`).addEventListener('click', () => buyShopUpgrades(key))
    }
  }
  DOMCacheGetOrSet('buySingularityQuarksButton').addEventListener('click', () => buyGoldenQuarks())
  // SINGULARITY TAB
  const singularityUpgrades = Object.keys(
    player.singularityUpgrades
  ) as (keyof Player['singularityUpgrades'])[]
  for (const key of singularityUpgrades) {
    if (key === 'offeringAutomatic') {
      continue
    }
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'mouseover',
      () => player.singularityUpgrades[`${String(key)}`].updateUpgradeHTML()
    )
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'click',
      (event) => player.singularityUpgrades[`${String(key)}`].buyLevel(event)
    )
  }
  DOMCacheGetOrSet('actualSingularityUpgradeContainer').addEventListener(
    'mouseover',
    () => shopMouseover(true)
  )
  DOMCacheGetOrSet('actualSingularityUpgradeContainer').addEventListener(
    'mouseout',
    () => shopMouseover(false)
  )

  const perkImage = DOMCacheGetOrSet(
    'singularityPerksIcon'
  ) as HTMLImageElement
  const perksText = DOMCacheGetOrSet('singularityPerksText')
  const perksDesc = DOMCacheGetOrSet('singularityPerksDesc')
  for (const perk of singularityPerks) {
    const perkHTML = document.createElement('span')
    perkHTML.innerHTML = `<img src="Pictures/${IconSets[player.iconSet][0]}/perk${perk.ID}.png">${perk.name()}`
    perkHTML.id = perk.ID
    perkHTML.classList.add('oldPerk')
    perkHTML.style.display = 'none' // Ensure the perk is hidden if not unlocked as an anti-spoiler failsafe.
    DOMCacheGetOrSet('singularityPerksGrid').append(perkHTML)
    DOMCacheGetOrSet(perk.ID).addEventListener('mouseover', () => {
      const perkInfo = getLastUpgradeInfo(perk, player.highestSingularityCount)
      const levelInfo = i18next.t('singularity.perks.levelInfo', {
        level: perkInfo.level,
        singularity: perkInfo.singularity
      })
      perkImage.src = `Pictures/${IconSets[player.iconSet][0]}/perk${perk.ID}.png`
      perksText.innerHTML = levelInfo
      perksDesc.innerHTML = perk.description(
        player.highestSingularityCount,
        perk.levels
      )
    })
  }

  // Octeract Upgrades
  const octeractUpgrades = Object.keys(
    player.octeractUpgrades
  ) as (keyof Player['octeractUpgrades'])[]
  for (const key of octeractUpgrades) {
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'mouseover',
      () => player.octeractUpgrades[`${String(key)}`].updateUpgradeHTML()
    )
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'click',
      (event) => player.octeractUpgrades[`${String(key)}`].buyLevel(event)
    )
  }

  DOMCacheGetOrSet('octeractUpgradeContainer').addEventListener(
    'mouseover',
    () => shopMouseover(true)
  )
  DOMCacheGetOrSet('octeractUpgradeContainer').addEventListener(
    'mouseout',
    () => shopMouseover(false)
  )

  // EXALT
  const singularityChallenges = Object.keys(
    player.singularityChallenges
  ) as (keyof Player['singularityChallenges'])[]
  for (const key of singularityChallenges) {
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'mouseover',
      () => player.singularityChallenges[`${String(key)}`].updateChallengeHTML()
    )
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'click',
      () => player.singularityChallenges[`${String(key)}`].challengeEntryHandler()
    )
  }

  // BLUEBERRY UPGRADES
  const blueberryUpgrades = Object.keys(
    player.blueberryUpgrades
  ) as (keyof Player['blueberryUpgrades'])[]
  for (const key of blueberryUpgrades) {
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'mouseover',
      () => player.blueberryUpgrades[`${String(key)}`].updateUpgradeHTML()
    )
    DOMCacheGetOrSet(`${String(key)}`).addEventListener(
      'click',
      (event) => player.blueberryUpgrades[`${String(key)}`].buyLevel(event)
    )
  }

  // BLUEBERRY LOADOUTS
  const blueberryLoadouts = Array.from(
    document.querySelectorAll('[id^="blueberryLoadout"]')
  )
  const loadoutContainer = DOMCacheGetOrSet('blueberryUpgradeContainer')

  for (let i = 0; i < blueberryLoadouts.length; i++) {
    const shiftedKey = i + 1
    const el = blueberryLoadouts[i]
    el.addEventListener('mouseover', () => {
      createLoadoutDescription(
        shiftedKey,
        player.blueberryLoadouts[shiftedKey] ?? { ambrosiaTutorial: 0 }
      )
      loadoutContainer.classList.add(`hoveredBlueberryLoadout${shiftedKey}`)
    })
    el.addEventListener('mouseout', () => {
      loadoutContainer.classList.remove(`hoveredBlueberryLoadout${shiftedKey}`)
    })
    el.addEventListener('click', () =>
      loadoutHandler(
        shiftedKey,
        player.blueberryLoadouts[shiftedKey] ?? { ambrosiaTutorial: 0 }
      ))
  }

  DOMCacheGetOrSet('blueberryToggleMode').addEventListener('click', () => toggleBlueberryLoadoutmode())

  DOMCacheGetOrSet('getBlueberries').addEventListener('click', () => exportBlueberryTree())
  DOMCacheGetOrSet('refundBlueberries').addEventListener('click', () => resetBlueberryTree())
  // Import blueberries
  DOMCacheGetOrSet('importBlueberries').addEventListener('change', async (e) => importData(e, importBlueberryTree))

  // Toggle subtabs of Singularity tab
  for (let index = 0; index < 5; index++) {
    DOMCacheGetOrSet(`toggleSingularitySubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.Singularity, { page: index })
    )
  }

  // EVENT TAB (Replace as events are created)
  DOMCacheGetOrSet('unsmith').addEventListener('click', () => clickSmith())

  // Import button
  DOMCacheGetOrSet('importfile').addEventListener('change', async (e) => importData(e, importSynergism))

  for (let i = 1; i <= 5; i++) {
    DOMCacheGetOrSet(`switchTheme${i}`).addEventListener('click', () => toggleTheme(false, i, true))
  }

  DOMCacheGetOrSet('saveType').addEventListener('click', async (event) => {
    const element = event.target as HTMLInputElement

    if (!element.checked) {
      localStorage.removeItem('copyToClipboard')
      event.stopPropagation()
      return
    }

    event.preventDefault()

    const confirmed = await Confirm(i18next.t('save.saveToClipboard'))

    if (confirmed) {
      element.checked = !element.checked
      localStorage.setItem('copyToClipboard', '')
    } else {
      localStorage.removeItem('copyToClipboard')
    }
  })

  // Window
  window.addEventListener('error', imgErrorHandler, { capture: true })
}
