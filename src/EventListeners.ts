import i18next from 'i18next'
import { displayAchievementProgress, resetAchievementProgressDisplay } from './Achievements'
import {
  type AmbrosiaUpgradeNames,
  ambrosiaUpgrades,
  ambrosiaUpgradeToString,
  buyAmbrosiaUpgradeLevel,
  createLoadoutDescription,
  displayLevelsBlueberry,
  displayOnlyLoadout,
  exportBlueberryTree,
  highlightPrerequisites,
  importBlueberryTree,
  loadoutHandler,
  resetBlueberryTree,
  resetHighlights,
  resetLoadoutOnlyDisplay,
  updateMobileAmbrosiaHTML
} from './BlueberryUpgrades'
import {
  boostAccelerator,
  buyAccelerator,
  buyCrystalUpgrades,
  buyMultiplier,
  buyParticleBuilding,
  buyProducer,
  buyTesseractBuilding
} from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { exitOffline, forcedDailyReset, timeWarp } from './Calculate'
import { challengeDisplay, toggleRetryChallenges } from './Challenges'
import { testing } from './Config'
import { corruptionCleanseConfirm, corruptionDisplay } from './Corruptions'
import { buyCubeUpgrades, cubeUpgradeDesc } from './Cubes'
import { buyAllAntMasteries, buyAntMastery } from './Features/Ants/AntMasteries/lib/buy-mastery'
import { antProducerData } from './Features/Ants/AntProducers/data/data'
import { buyAllAntProducers, buyAntProducers } from './Features/Ants/AntProducers/lib/buy-producer'
import { confirmAntSacrifice } from './Features/Ants/AntSacrifice/sacrifice'
import { antUpgradeData } from './Features/Ants/AntUpgrades/data/data'
import { buyAllAntUpgrades, buyAntUpgrade } from './Features/Ants/AntUpgrades/lib/buy-upgrade'
import { AntUpgrades, LAST_ANT_UPGRADE } from './Features/Ants/AntUpgrades/structs/structs'
import { antCornerQuarkHTML, antCornerStageHTML } from './Features/Ants/HTML/modals/ant-quark-corner-modal'
import { allAntProducerHTML, allAntUpgradeHTML } from './Features/Ants/HTML/modals/buy-all-ant-modal'
import { antMasteryHTML } from './Features/Ants/HTML/modals/mastery-modal'
import { antProducerHTML } from './Features/Ants/HTML/modals/producer-modal'
import { antUpgradeHTML } from './Features/Ants/HTML/modals/upgrade-modal'
import { toggleRebornELOInfo } from './Features/Ants/HTML/updates/elo-info'
import { toggleLeaderboardMode } from './Features/Ants/HTML/updates/leaderboard'
import {
  updateAlwaysSacrificeMaxRebornELOToggle,
  updateOnlySacrificeMaxRebornELOToggle
} from './Features/Ants/HTML/updates/toggles/additional-sacrifice-toggles'
import { AntProducers, LAST_ANT_PRODUCER } from './Features/Ants/structs/structs'
import {
  toggleAlwaysSacrificeMaxRebornELO,
  toggleAutoAntSacrificeEnabled,
  toggleAutoAntSacrificeMode,
  toggleOnlySacrificeMaxRebornELO
} from './Features/Ants/toggles/auto-sacrifice'
import { toggleAutobuyAntMastery } from './Features/Ants/toggles/autobuy-mastery'
import { toggleAutobuyAntProducer } from './Features/Ants/toggles/autobuy-producer'
import { toggleAutobuyAntUpgrade } from './Features/Ants/toggles/autobuy-upgrade'
import { toggleMaxBuyAntProducer } from './Features/Ants/toggles/max-producer-buy'
import { toggleMaxBuyAntUpgrade } from './Features/Ants/toggles/max-upgrade-buy'
import {
  craftHepteracts,
  expandHepteracts,
  hepteractDescriptions,
  hepteractKeys,
  hepteractToOverfluxOrbDescription,
  overfluxPowderDescription,
  overfluxPowderWarp,
  toggleAutoBuyOrbs,
  toggleAutomaticHepteracts,
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
import { exitFastForward, getLotusTimeExpiresAt, getOwnedLotus, getTips, sendToWebsocket, setTips } from './Login'
import {
  buyOcteractUpgradeLevel,
  type OcteractDataKeys,
  octeractUpgrades,
  updateMobileOcteractHTML,
  upgradeOcteractToString
} from './Octeracts'
import { buyPlatonicUpgrades, createPlatonicDescription } from './Platonic'
import {
  buyRedAmbrosiaUpgradeLevel,
  displayRedAmbrosiaLevels,
  redAmbrosiaUpgradeToString,
  resetRedAmbrosiaDisplay,
  updateMobileRedAmbrosiaHTML
} from './RedAmbrosiaUpgrades'
import { buyResearch, researchDescriptions, updateResearchAuto } from './Research'
import { resetrepeat, updateAutoCubesOpens, updateAutoReset, updateTesseractAutoBuyAmount } from './Reset'
import { buyAllBlessingLevels, buyBlessingLevels, focusedRuneBlessingHTML, runeBlessingKeys } from './RuneBlessings'
import { focusedRuneHTML, focusedRuneLockedHTML, type RuneKeys, runes, runeToIndex, sacrificeOfferings } from './Runes'
import { buyAllSpiritLevels, buySpiritLevels, focusedRuneSpiritHTML, runeSpiritKeys } from './RuneSpirits'
import {
  buyShopUpgrades,
  resetShopUpgrades,
  shopData,
  shopDescriptions,
  shopUpgradeTypes,
  useConsumablePrompt
} from './Shop'
import {
  buyGoldenQuarks,
  buyGQUpgradeLevel,
  calculateMaxSingularityLookahead,
  getLastUpgradeInfo,
  goldenQuarkUpgrades,
  type SingularityDataKeys,
  singularityPerks,
  teleportToSingularity,
  updateMobileGQHTML,
  updateSingularityElevator,
  upgradeGQToString
} from './singularity'
import type { SingularityChallengeDataKeys } from './SingularityChallenges'
import { displayStats } from './Statistics'
import { generateExportSummary } from './Summary'
import { player, resetCheck, saveSynergy } from './Synergism'
import { changeSubTab, changeTab, Tabs } from './Tabs'
import {
  buyAllTalismanResources,
  buyTalismanLevel,
  buyTalismanLevelToMax,
  buyTalismanLevelToRarityIncrease,
  buyTalismanResources,
  type TalismanKeys,
  talismanRarityInfo,
  talismans,
  talismanToStringHTML,
  toggleTalismanBuy,
  updateTalismanCostDisplay,
  updateTalismanCostHTML
} from './Talismans'
import { IconSets, imgErrorHandler, toggleAnnotation, toggleIconSet, toggleTheme } from './Themes'
import {
  autoCubeUpgradesToggle,
  autoPlatonicUpgradesToggle,
  toggleAscStatPerSecond,
  toggleAutoAscend,
  toggleAutoBuyFragment,
  toggleautobuytesseract,
  toggleAutoChallengeRun,
  toggleAutoChallengesIgnore,
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
  toggleHepteractAutoPercentage,
  toggleHideShop,
  toggleMaxBuyCube,
  toggleResearchBuy,
  toggleMaxPlat,
  toggleSettings,
  toggleShopConfirmation,
  toggleShops,
  toggleStatSymbol,
  updateAutoChallenge,
  updateRuneBlessingBuyAmount
} from './Toggles'
import type { FirstToEighth, FirstToFifth, OneToFive, Player } from './types/Synergism'
import {
  Alert,
  closeChangelog,
  CloseModal,
  Confirm,
  MEDIUM_MODAL_UPDATE_TICK,
  Modal,
  openChangelog,
  Prompt
} from './UpdateHTML'
import { shopMouseover } from './UpdateVisuals'
import {
  buyConstantUpgrades,
  categoryUpgrades,
  clickUpgrades,
  constantUpgradeDescriptions,
  crystalupgradedescriptions,
  upgradedescriptions
} from './Upgrades'
import { isMobile } from './Utility'
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
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth'
  ] satisfies FirstToEighth[]

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

  // Fast forward button
  DOMCacheGetOrSet('exitFastForward').addEventListener('click', () => exitFastForward())
  DOMCacheGetOrSet('fastForwardContainer').addEventListener('dblclick', () => exitFastForward())

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
    function onFocusMouseover () {
      resetButton.classList.add('hover')
    }

    function onBlurMouseout () {
      resetButton.classList.remove('hover')

      if (player.currentChallenge.reincarnation) {
        resetrepeat('reincarnationChallenge')
      } else if (player.currentChallenge.transcension) {
        resetrepeat('transcensionChallenge')
      }
    }

    resetButton.addEventListener('mouseover', onFocusMouseover)
    resetButton.addEventListener('focus', onFocusMouseover)

    resetButton.addEventListener('mouseout', onBlurMouseout)
    resetButton.addEventListener('blur', onBlurMouseout)
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
          ordinals[index2 - 1] as FirstToFifth,
          buildingTypesAlternate3[index],
          index === 0 ? index2 : (index2 * (index2 + 1)) / 2
        ))
    }
  }

  // Crystal Upgrades (Mouseover and Onclick)
  for (let index = 1; index <= 5; index++) {
    const buyUpgrade = DOMCacheGetOrSet(`buycrystalupgrade${index}`)
    buyUpgrade.addEventListener('mouseover', () => crystalupgradedescriptions(index))
    buyUpgrade.addEventListener('focus', () => crystalupgradedescriptions(index))
    buyUpgrade.addEventListener('click', () => buyCrystalUpgrades(index))
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
    const buyConstantUpgrade = DOMCacheGetOrSet(`buyConstantUpgrade${index + 1}`)
    buyConstantUpgrade.addEventListener('mouseover', () => constantUpgradeDescriptions(index + 1))
    buyConstantUpgrade.addEventListener('focus', () => constantUpgradeDescriptions(index + 1))
    buyConstantUpgrade.addEventListener('click', () => buyConstantUpgrades(index + 1))
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
    const upgrade = DOMCacheGetOrSet(`upg${index}`)
    upgrade.addEventListener('mouseover', () => upgradedescriptions(index))
    upgrade.addEventListener('focus', () => upgradedescriptions(index))
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
  /*for (let index = 1; index <= achievementpointvalues.length - 1; index++) {
    // Onmouseover events (Achievement descriptions)
    const achievement = DOMCacheGetOrSet(`ach${index}`)
    achievement.addEventListener('mouseover', () => achievementdescriptions(index))
    achievement.addEventListener('focus', () => achievementdescriptions(index))
  }*/
  DOMCacheGetOrSet('showAchievementProgress').addEventListener('mouseover', () => displayAchievementProgress())
  DOMCacheGetOrSet('showAchievementProgress').addEventListener('focus', () => displayAchievementProgress())
  DOMCacheGetOrSet('showAchievementProgress').addEventListener('mouseout', () => resetAchievementProgressDisplay())
  DOMCacheGetOrSet('showAchievementProgress').addEventListener('blur', () => resetAchievementProgressDisplay())

  for (let index = 0; index < 2; index++) {
    DOMCacheGetOrSet(`toggleAchievementSubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.Achievements, { page: index })
    )
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

  const runeStats = Object.keys(
    runes
  ) as RuneKeys[]
  for (const key of runeStats) {
    const rune = DOMCacheGetOrSet(`${key}RuneContainer`)
    rune.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneHTML(key), e.clientX, e.clientY, { borderColor: runes[key].runeHTMLStyle.borderColor })
      }
    )
    rune.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}Rune`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneHTML(key), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: runes[key].runeHTMLStyle.borderColor
      })
    })
    rune.addEventListener('mouseout', CloseModal)

    const runeIcon = DOMCacheGetOrSet(`${key}Rune`)
    runeIcon.addEventListener('click', () => toggleAutoSacrifice(runeToIndex[key]))

    const activateRune = DOMCacheGetOrSet(`${key}RuneSacrifice`)
    /*activateRune.addEventListener('mouseover', () => updateFocusedRuneHTML(key))
    activateRune.addEventListener('focus', () => updateFocusedRuneHTML(key))*/
    activateRune.addEventListener('click', () => sacrificeOfferings(key, player.offerings, false))

    // Add event listeners for locked rune containers
    const lockedRune = DOMCacheGetOrSet(`${key}RuneLocked`)
    lockedRune.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneLockedHTML(key), e.clientX, e.clientY, { borderColor: 'gray' })
      }
    )
    lockedRune.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}RuneLockedContainer`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneLockedHTML(key), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: 'gray'
      })
    })
    lockedRune.addEventListener('mouseout', CloseModal)
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
    const buyTalisman = DOMCacheGetOrSet(`buyTalismanItem${index + 1}`)
    buyTalisman.addEventListener('mouseover', () => {
      const obtainiumBudget = player.obtainium.mul(player.buyTalismanShardPercent / 100)
      const offeringBudget = player.offerings.mul(player.buyTalismanShardPercent / 100)
      updateTalismanCostDisplay(talismanItemNames[index], obtainiumBudget, offeringBudget)
    })
    buyTalisman.addEventListener('focus', () => {
      const obtainiumBudget = player.obtainium.mul(player.buyTalismanShardPercent / 100)
      const offeringBudget = player.offerings.mul(player.buyTalismanShardPercent / 100)
      updateTalismanCostDisplay(talismanItemNames[index], obtainiumBudget, offeringBudget)
    })
    buyTalisman.addEventListener('click', () => {
      const obtainiumBudget = player.obtainium.mul(player.buyTalismanShardPercent / 100)
      const offeringBudget = player.offerings.mul(player.buyTalismanShardPercent / 100)
      buyTalismanResources(talismanItemNames[index], obtainiumBudget, offeringBudget)
    })
  }

  const buyTalismanAll = DOMCacheGetOrSet('buyTalismanAll')
  buyTalismanAll.addEventListener('mouseover', () => {
    const obtainiumBudget = player.obtainium.mul(player.buyTalismanShardPercent / 100)
    const offeringBudget = player.offerings.mul(player.buyTalismanShardPercent / 100)
    updateTalismanCostDisplay(null, obtainiumBudget, offeringBudget)
  })
  buyTalismanAll.addEventListener('focus', () => {
    const obtainiumBudget = player.obtainium.mul(player.buyTalismanShardPercent / 100)
    const offeringBudget = player.offerings.mul(player.buyTalismanShardPercent / 100)
    updateTalismanCostDisplay(null, obtainiumBudget, offeringBudget)
  })
  buyTalismanAll.addEventListener('click', () => buyAllTalismanResources())

  const talismanStats = Object.keys(
    talismans
  ) as TalismanKeys[]
  for (const key of talismanStats) {
    DOMCacheGetOrSet(`${key}Talisman`).addEventListener(
      'mouseover',
      () => {
        talismanToStringHTML(key)
        talismanRarityInfo(key)
      }
    )
    DOMCacheGetOrSet(`level${key}Once`).addEventListener(
      'click',
      () => buyTalismanLevel(key)
    )
    DOMCacheGetOrSet(`level${key}Once`).addEventListener(
      'mouseover',
      () => updateTalismanCostHTML(key)
    )
    DOMCacheGetOrSet(`level${key}ToRarityIncrease`).addEventListener(
      'click',
      () => buyTalismanLevelToRarityIncrease(key)
    )
    DOMCacheGetOrSet(`level${key}ToRarityIncrease`).addEventListener(
      'mouseover',
      () => updateTalismanCostHTML(key)
    )
    DOMCacheGetOrSet(`level${key}ToMax`).addEventListener(
      'click',
      () => buyTalismanLevelToMax(key)
    )
    DOMCacheGetOrSet(`level${key}ToMax`).addEventListener(
      'mouseover',
      () => updateTalismanCostHTML(key)
    )
  }

  // Part 3: Blessings and Spirits

  for (const key of runeBlessingKeys) {
    const runeBlessing = DOMCacheGetOrSet(`${key}RuneBlessingContainer`)
    runeBlessing.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneBlessingHTML(key), e.clientX, e.clientY, {
          borderColor: runes[key].runeHTMLStyle.borderColor
        })
      }
    )
    runeBlessing.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}RuneBlessing`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneBlessingHTML(key), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: runes[key].runeHTMLStyle.borderColor
      })
    })
    runeBlessing.addEventListener('mouseout', CloseModal)

    DOMCacheGetOrSet(`${key}RuneBlessingPurchase`).addEventListener(
      'click',
      () => buyBlessingLevels(key, player.offerings)
    )
  }

  for (const key of runeSpiritKeys) {
    const runeSpirit = DOMCacheGetOrSet(`${key}RuneSpiritContainer`)
    runeSpirit.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneSpiritHTML(key), e.clientX, e.clientY, {
          borderColor: runes[key].runeHTMLStyle.borderColor
        })
      }
    )
    runeSpirit.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}RuneSpirit`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneSpiritHTML(key), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: runes[key].runeHTMLStyle.borderColor
      })
    })

    runeSpirit.addEventListener('mouseout', CloseModal)

    DOMCacheGetOrSet(`${key}RuneSpiritPurchase`).addEventListener(
      'click',
      () => buySpiritLevels(key, player.offerings)
    )
  }

  DOMCacheGetOrSet('buyRuneBlessingInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(1))
  DOMCacheGetOrSet('buyRuneSpiritInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(2))

  DOMCacheGetOrSet('buyAllBlessings').addEventListener('click', () => buyAllBlessingLevels(player.offerings))
  DOMCacheGetOrSet('buyAllSpirits').addEventListener('click', () => buyAllSpiritLevels(player.offerings))

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

  for (let index = 0; index < 2; index++) {
    DOMCacheGetOrSet(`toggleChallengesSubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.Challenges, { page: index })
    )
  }

  // RESEARCH TAB
  // Part 1: Researches
  // There are 200 researches, ideally in rewrite 200 would instead be length of research list/array
  for (let index = 1; index <= 200; index++) {
    const research = DOMCacheGetOrSet(`res${index}`)
    research.addEventListener('click', () => {
      const auto = false
      const hover = false
      buyResearch(index, auto, hover)
      if (player.autoResearchMode === 'manual' && player.autoResearchToggle) {
        updateResearchAuto(index)
      }
    })
    research.addEventListener('mouseover', () => {
      if (player.toggles[38] && player.highestSingularityCount > 0) {
        const auto = false
        const hover = true
        buyResearch(index, auto, hover)
      }
      researchDescriptions(index)
    })
    research.addEventListener('focus', () => {
      if (player.toggles[38] && player.highestSingularityCount > 0) {
        const auto = false
        const hover = true
        buyResearch(index, auto, hover)
      }
      researchDescriptions(index)
    })
  }

  // Part 2: QoL buttons
  DOMCacheGetOrSet('toggleresearchbuy').addEventListener('click', () => toggleResearchBuy())
  DOMCacheGetOrSet('toggleautoresearch').addEventListener('click', () => toggleAutoResearch())
  DOMCacheGetOrSet('toggleautoresearchmode').addEventListener('click', () => toggleAutoResearchMode())

  for (let index = 0; index < 3; index++) {
    DOMCacheGetOrSet(`toggleAntSubtab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.AntHill, { page: index })
    )
  }

  DOMCacheGetOrSet('buyAllAntUpgrades').addEventListener('click', (e: MouseEvent) => {
    buyAllAntUpgrades(player.ants.toggles.maxBuyUpgrades)
    Modal(allAntUpgradeHTML, e.clientX, e.clientY, { borderColor: 'crimson' }, MEDIUM_MODAL_UPDATE_TICK)
  })
  DOMCacheGetOrSet('buyAllAntProducers').addEventListener('click', (e: MouseEvent) => {
    buyAllAntProducers(player.ants.toggles.maxBuyProducers)
    buyAllAntMasteries()
    Modal(allAntProducerHTML, e.clientX, e.clientY, { borderColor: 'gold' }, MEDIUM_MODAL_UPDATE_TICK)
  })

  DOMCacheGetOrSet('buyAllAntProducers').addEventListener('mousemove', (e: MouseEvent) => {
    Modal(allAntProducerHTML, e.clientX, e.clientY, { borderColor: 'gold' }, MEDIUM_MODAL_UPDATE_TICK)
  })

  DOMCacheGetOrSet('buyAllAntProducers').addEventListener('mouseout', () => CloseModal())

  DOMCacheGetOrSet('buyAllAntUpgrades').addEventListener('mousemove', (e: MouseEvent) => {
    Modal(allAntUpgradeHTML, e.clientX, e.clientY, { borderColor: 'crimson' }, MEDIUM_MODAL_UPDATE_TICK)
  })

  DOMCacheGetOrSet('buyAllAntUpgrades').addEventListener('mouseout', () => CloseModal())

  for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
    const antTier = DOMCacheGetOrSet(`anttier${ant + 1}`)
    antTier.style.setProperty(
      '--glow-color',
      `${antProducerData[ant].color}`
    )
    antTier.addEventListener(
      'mousemove',
      (e: MouseEvent) =>
        Modal(() => antProducerHTML(ant), e.clientX, e.clientY, { borderColor: antProducerData[ant].color })
    )

    // TODO: When we have event listeners for Focus on modals, clicking on the element in question
    // will set the Modal's positioning to be dependent on the element, which causes a jank
    // "Teleport" of the modal for a frame until it's set back to the mouse position.
    // Fix is urgently needed for accessibility.
    /*antTier.addEventListener('focus', () => {
      const elmRect = antTier.getBoundingClientRect()
      Modal(() => antProducerHTML(ant), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: antProducerData[ant].color
      })
    })*/
    antTier.addEventListener('mouseout', () => CloseModal())
    // antTier.addEventListener('blur', () => CloseModal())
    antTier.addEventListener('click', (event) => {
      buyAntProducers(ant, player.ants.toggles.maxBuyProducers)
      Modal(() => antProducerHTML(ant), event.clientX, event.clientY, { borderColor: antProducerData[ant].color })
    })

    const antMastery = DOMCacheGetOrSet(`antMastery${ant + 1}`)
    const blendedColor = `color-mix(in srgb, ${antProducerData[ant].color} 75%, lime 25%)`
    antMastery.style.setProperty(
      '--glow-color',
      blendedColor
    )
    antMastery.addEventListener(
      'mousemove',
      (e: MouseEvent) => Modal(() => antMasteryHTML(ant), e.clientX, e.clientY, { borderColor: blendedColor })
    )
    /*antMastery.addEventListener('focus', () => {
      const elmRect = antMastery.getBoundingClientRect()
      Modal(() => antMasteryHTML(ant), elmRect.x, elmRect.y + elmRect.height / 2, { borderColor: blendedColor })
    })*/
    antMastery.addEventListener('mouseout', () => CloseModal())
    // antMastery.addEventListener('blur', () => CloseModal())
    antMastery.addEventListener('click', (event) => {
      buyAntMastery(ant)
      Modal(() => antMasteryHTML(ant), event.clientX, event.clientY, { borderColor: blendedColor })
    })
  }
  // Part 2: Ant Upgrades
  for (let upgrade = AntUpgrades.AntSpeed; upgrade <= LAST_ANT_UPGRADE; upgrade++) {
    const antUpgrade = DOMCacheGetOrSet(`antUpgrade${upgrade + 1}`)

    antUpgrade.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${antUpgradeData[upgrade].antUpgradeHTML.color} 75%, crimson 25%)`
    )

    antUpgrade.addEventListener(
      'mousemove',
      (e: MouseEvent) => Modal(() => antUpgradeHTML(upgrade), e.clientX, e.clientY, { borderColor: 'burlywood' })
    )
    /*antUpgrade.addEventListener('focus', () => {
      const elmRect = antUpgrade.getBoundingClientRect()
      Modal(() => antUpgradeHTML(upgrade), elmRect.x, elmRect.y + elmRect.height / 2, { borderColor: 'burlywood' })
    })*/
    antUpgrade.addEventListener('mouseout', () => CloseModal())
    // antUpgrade.addEventListener('blur', () => CloseModal())
    antUpgrade.addEventListener('click', (event) => {
      buyAntUpgrade(upgrade, player.ants.toggles.maxBuyUpgrades)
      Modal(() => antUpgradeHTML(upgrade), event.clientX, event.clientY, { borderColor: 'burlywood' })
    })
  }
  // Part 3: Sacrifice
  DOMCacheGetOrSet('antSacrifice').addEventListener('click', () => confirmAntSacrifice())
  DOMCacheGetOrSet('immortalELOInfoToggleButton').addEventListener('click', () => toggleRebornELOInfo())

  const alwaysMaxRebornELOToggle = DOMCacheGetOrSet('alwaysMaxRebornELOToggle')
  const onlyMaxRebornELOToggle = DOMCacheGetOrSet('onlyMaxRebornELOToggle')

  alwaysMaxRebornELOToggle.addEventListener('change', () => {
    toggleAlwaysSacrificeMaxRebornELO()
    updateAlwaysSacrificeMaxRebornELOToggle(player.ants.toggles.alwaysSacrificeMaxRebornELO)
  })

  onlyMaxRebornELOToggle.addEventListener('change', () => {
    toggleOnlySacrificeMaxRebornELO()
    updateOnlySacrificeMaxRebornELOToggle(player.ants.toggles.onlySacrificeMaxRebornELO)
  })

  document.getElementById('use-lotus')?.addEventListener('click', () => {
    const timeNow = Date.now()
    const lotusTime = getLotusTimeExpiresAt()
    let extraHTML = ''
    if (lotusTime !== undefined && timeNow < lotusTime) {
      extraHTML = `${i18next.t('pseudoCoins.lotus.useConfirmMulti')}`
    }
    Confirm(`${i18next.t('pseudoCoins.lotus.useConfirm')} ${extraHTML}`)
      .then((bool) => {
        if (!bool) {
          return
        }

        if (getOwnedLotus() < 1) {
          return Alert(i18next.t('pseudoCoins.lotus.noLotus'))
        }

        sendToWebsocket(
          JSON.stringify({
            type: 'applied-lotus',
            amount: 1
          })
        )
      })
  })

  // Part 3.5: Leaderboard
  DOMCacheGetOrSet('antLeaderboardToggle').addEventListener('click', () => toggleLeaderboardMode())
  DOMCacheGetOrSet('antLeaderboardValueAmount').addEventListener('mousemove', (e: MouseEvent) => {
    Modal(() => antCornerStageHTML(), e.clientX, e.clientY, { borderColor: 'orange' })
  })
  DOMCacheGetOrSet('antLeaderboardValueAmount').addEventListener('mouseout', () => CloseModal())

  DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').addEventListener('mousemove', (e: MouseEvent) => {
    Modal(() => antCornerQuarkHTML(), e.clientX, e.clientY, { borderColor: 'cyan' })
  })
  DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').addEventListener('mouseout', () => CloseModal())

  // Part 4: QoL Buttons
  DOMCacheGetOrSet('toggleBuyAntProducerMax').addEventListener('click', () => toggleMaxBuyAntProducer())
  DOMCacheGetOrSet('toggleBuyAntUpgradesMax').addEventListener('click', () => toggleMaxBuyAntUpgrade())
  DOMCacheGetOrSet('toggleAutobuyAntProducer').addEventListener('click', () => toggleAutobuyAntProducer())
  DOMCacheGetOrSet('toggleAutobuyAntMastery').addEventListener('click', () => toggleAutobuyAntMastery())
  DOMCacheGetOrSet('toggleAutobuyAntUpgrades').addEventListener('click', () => toggleAutobuyAntUpgrade())
  DOMCacheGetOrSet('toggleAutoSacrificeAnt').addEventListener('click', () => toggleAutoAntSacrificeEnabled())
  DOMCacheGetOrSet('autoSacrificeAntMode').addEventListener('click', () => toggleAutoAntSacrificeMode())

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
    const cubeUpgrade = DOMCacheGetOrSet(`cubeUpg${index}`)
    cubeUpgrade.addEventListener('mouseover', () => cubeUpgradeDesc(index))
    cubeUpgrade.addEventListener('focus', () => cubeUpgradeDesc(index))
    cubeUpgrade.addEventListener('click', () => buyCubeUpgrades(index))
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

  DOMCacheGetOrSet('maxPlatToggle').addEventListener('click', () => toggleMaxPlat())
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

  for (const key of hepteractKeys) {
    const moused = DOMCacheGetOrSet(`${key}Hepteract`)
    moused.addEventListener('mouseover', () => hepteractDescriptions(key))
    moused.addEventListener('focus', () => hepteractDescriptions(key))

    const craft = DOMCacheGetOrSet(`${key}HepteractCraft`)
    craft.addEventListener('click', () => craftHepteracts(key))

    const craftMax = DOMCacheGetOrSet(`${key}HepteractCraftMax`)
    craftMax.addEventListener('click', () => craftHepteracts(key, true))

    const cap = DOMCacheGetOrSet(`${key}HepteractCap`)
    cap.addEventListener('click', () => expandHepteracts(key))

    const auto = DOMCacheGetOrSet(`${key}HepteractAuto`)
    auto.addEventListener('click', () => toggleAutomaticHepteracts(key))
  }

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
  DOMCacheGetOrSet('corruptionDisplays').addEventListener('click', () => corruptionDisplay('exit'))
  DOMCacheGetOrSet('corruptionCleanse').addEventListener('click', () => corruptionCleanseConfirm())
  DOMCacheGetOrSet('corruptionCleanseConfirm').addEventListener('click', () => {
    player.corruptions.used.resetCorruptions()
    player.corruptions.next.resetCorruptions()
  })

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
  const saveStringInput = DOMCacheGetOrSet('saveStringInput')

  DOMCacheGetOrSet('exportgame').addEventListener('click', () => exportSynergism())
  saveStringInput.addEventListener('blur', (e) => updateSaveString(e.target as HTMLInputElement))
  DOMCacheGetOrSet('savegame').addEventListener('click', () => saveSynergy(true))
  DOMCacheGetOrSet('deleteGame').addEventListener('click', () => resetGame(false))
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
  DOMCacheGetOrSet('statSymbols').addEventListener('click', () => toggleStatSymbol())

  const html = () =>
    [
      i18next.t('settings.saveString.version'),
      i18next.t('settings.saveString.time'),
      i18next.t('settings.saveString.year'),
      i18next.t('settings.saveString.day'),
      i18next.t('settings.saveString.min'),
      i18next.t('settings.saveString.period'),
      i18next.t('settings.saveString.date'),
      i18next.t('settings.saveString.times'),
      i18next.t('settings.saveString.sing'),
      i18next.t('settings.saveString.quarks'),
      i18next.t('settings.saveString.gq'),
      i18next.t('settings.saveString.stage')
    ].join('<br>')

  saveStringInput.addEventListener('mousemove', (e) => Modal(() => html(), e.clientX, e.clientY))
  saveStringInput.addEventListener('focus', () => {
    const elmRect = saveStringInput.getBoundingClientRect()
    Modal(() => html(), elmRect.x, elmRect.y + elmRect.height / 2)
  })
  saveStringInput.addEventListener('mouseout', CloseModal)

  document.querySelector('#thirdParty > #discord > button')?.addEventListener(
    'click',
    () => location.href = 'https://www.discord.gg/ameCknq' // TODO: redirect with synergism.cc
  )
  document.querySelector('#thirdParty > #patreon > button')?.addEventListener('click', () => {
    changeTab(Tabs.Purchase)
    changeSubTab(Tabs.Purchase, { page: 1 })
  })

  // SHOP TAB

  /*

TODO: Fix this entire tab it's utter shit
- Update (Jan. 23rd 2025) this is still shit PLATONIC! - Khafra

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
  DOMCacheGetOrSet('useofferingpotion').addEventListener('click', () => useConsumablePrompt('offeringPotion'))
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
  DOMCacheGetOrSet('useobtainiumpotion').addEventListener('click', () => useConsumablePrompt('obtainiumPotion'))
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

  // ELEVATOR
  const elevatorInput = DOMCacheGetOrSet('elevatorTargetInput')
  const teleportButton = DOMCacheGetOrSet('elevatorTeleportButton')
  const lockToggle = DOMCacheGetOrSet('elevatorLockToggle')
  const slowClimbToggle = DOMCacheGetOrSet('elevatorSlowClimbToggle')

  elevatorInput.addEventListener('input', () => {
    const value = Number.parseInt((elevatorInput as HTMLInputElement).value) || 1

    const canLookahead = runes.antiquities.level > 0
    let singLook = 0
    if (canLookahead) {
      const lookahead = calculateMaxSingularityLookahead(true)
      singLook = player.singularityCount + lookahead
    }

    const maxTarget = Math.max(1, player.highestSingularityCount, singLook)
    const validValue = Math.max(1, Math.min(value, maxTarget))
    player.singularityElevatorTarget = validValue
    updateSingularityElevator()
  })

  // Do the cool scrolling thing
  elevatorInput.addEventListener('wheel', (e) => {
    if (e.deltaY < 0) {
      // Scroll up: Means we can *increase* singularity
      if (player.singularityElevatorTarget < player.highestSingularityCount) {
        player.singularityElevatorTarget++
        updateSingularityElevator()
      }
    } else if (e.deltaY > 0) {
      // Scroll down: Means we can *decrease* singularity
      if (player.singularityElevatorTarget > 1) {
        player.singularityElevatorTarget--
        updateSingularityElevator()
      }
    }
  })

  teleportButton.addEventListener('click', () => {
    teleportToSingularity()
    updateSingularityElevator()
  })

  lockToggle.addEventListener('change', () => {
    player.singularityElevatorLocked = !player.singularityElevatorLocked
    updateSingularityElevator()
  })

  slowClimbToggle.addEventListener('change', () => {
    player.singularityElevatorSlowClimb = !player.singularityElevatorSlowClimb
    updateSingularityElevator()
  })

  const GQUpgrades = Object.keys(goldenQuarkUpgrades) as SingularityDataKeys[]
  for (const key of GQUpgrades) {
    if (!isMobile) {
      if (key === 'offeringAutomatic') {
        continue
      }
      DOMCacheGetOrSet(key).addEventListener(
        'mousemove',
        (e) => Modal(() => upgradeGQToString(key), e.clientX, e.clientY, { borderColor: 'gold' })
      )
      DOMCacheGetOrSet(key).addEventListener(
        'focus',
        () => {
          const element = DOMCacheGetOrSet(key)
          const elmRect = element.getBoundingClientRect()
          Modal(() => upgradeGQToString(key), elmRect.x, elmRect.y + elmRect.height / 2, { borderColor: 'gold' })
        }
      )

      DOMCacheGetOrSet(key).addEventListener(
        'mouseout',
        CloseModal
      )
      DOMCacheGetOrSet(key).addEventListener(
        'blur',
        CloseModal
      )

      DOMCacheGetOrSet(key).addEventListener(
        'click',
        (event) => {
          buyGQUpgradeLevel(key, event)
          Modal(() => upgradeGQToString(key), event.clientX, event.clientY, { borderColor: 'gold' })
        }
      )
    } else {
      if (key === 'offeringAutomatic') {
        continue
      }
      DOMCacheGetOrSet(key).addEventListener(
        'click',
        () => updateMobileGQHTML(key)
      )
    }
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
  const octUpgrade = Object.keys(octeractUpgrades) as OcteractDataKeys[]
  for (const key of octUpgrade) {
    if (!isMobile) {
      DOMCacheGetOrSet(key).addEventListener(
        'mousemove',
        (e) => Modal(() => upgradeOcteractToString(key), e.clientX, e.clientY, { borderColor: 'lightseagreen' })
      )
      DOMCacheGetOrSet(key).addEventListener(
        'focus',
        () => {
          const element = DOMCacheGetOrSet(key)
          const elmRect = element.getBoundingClientRect()
          Modal(() => upgradeOcteractToString(key), elmRect.x, elmRect.y + elmRect.height / 2, {
            borderColor: 'lightseagreen'
          })
        }
      )
      DOMCacheGetOrSet(key).addEventListener(
        'mouseout',
        CloseModal
      )
      DOMCacheGetOrSet(key).addEventListener(
        'blur',
        CloseModal
      )
      DOMCacheGetOrSet(key).addEventListener(
        'click',
        (event) => {
          buyOcteractUpgradeLevel(key, event)
          Modal(() => upgradeOcteractToString(key), event.clientX, event.clientY, { borderColor: 'lightseagreen' })
        }
      )
    } else {
      DOMCacheGetOrSet(key).addEventListener(
        'click',
        () => updateMobileOcteractHTML(key)
      )
    }
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
  const singularityChallenges = Object.keys(player.singularityChallenges) as SingularityChallengeDataKeys[]
  for (const key of singularityChallenges) {
    DOMCacheGetOrSet(key).addEventListener(
      'mouseover',
      () => player.singularityChallenges[key].updateChallengeHTML()
    )
    DOMCacheGetOrSet(key).addEventListener(
      'click',
      () => player.singularityChallenges[key].challengeEntryHandler()
    )
  }

  // BLUEBERRY UPGRADES
  const blueberryUpgrades = Object.keys(
    ambrosiaUpgrades
  ) as AmbrosiaUpgradeNames[]
  for (const key of blueberryUpgrades) {
    if (!isMobile) {
      DOMCacheGetOrSet(key).addEventListener(
        'mousemove',
        (e) => {
          Modal(() => ambrosiaUpgradeToString(key), e.clientX, e.clientY, { borderColor: 'blue' })
          highlightPrerequisites(key)
        }
      )
      DOMCacheGetOrSet(key).addEventListener(
        'mouseout',
        () => {
          CloseModal()
          resetHighlights()
        }
      )
      DOMCacheGetOrSet(key).addEventListener(
        'focus',
        () => {
          const element = DOMCacheGetOrSet(key)
          const elmRect = element.getBoundingClientRect()
          Modal(() => ambrosiaUpgradeToString(key), elmRect.x, elmRect.y + elmRect.height / 2, { borderColor: 'blue' })
          highlightPrerequisites(key)
        }
      )
      DOMCacheGetOrSet(key).addEventListener(
        'blur',
        () => {
          CloseModal()
          resetHighlights()
        }
      )
      DOMCacheGetOrSet(key).addEventListener(
        'click',
        (event) => {
          buyAmbrosiaUpgradeLevel(key, event)
          Modal(() => ambrosiaUpgradeToString(key), event.clientX, event.clientY, { borderColor: 'blue' })
        }
      )
    } else {
      DOMCacheGetOrSet(key).addEventListener(
        'click',
        () => {
          updateMobileAmbrosiaHTML(key)
          highlightPrerequisites(key)
        }
      )
    }
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
      displayOnlyLoadout(player.blueberryLoadouts[shiftedKey])
    })
    el.addEventListener('mouseout', () => {
      loadoutContainer.classList.remove(`hoveredBlueberryLoadout${shiftedKey}`)
      resetLoadoutOnlyDisplay()
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
  DOMCacheGetOrSet('importBlueberries').addEventListener('change', (e) => importData(e, importBlueberryTree))

  DOMCacheGetOrSet('importBlueberriesButton').addEventListener('click', () => {
    DOMCacheGetOrSet('importBlueberries').click()
  })

  DOMCacheGetOrSet('showCurrAmbrosiaUpgrades').addEventListener('mouseover', () => {
    displayLevelsBlueberry()
    displayRedAmbrosiaLevels()
  })
  DOMCacheGetOrSet('showCurrAmbrosiaUpgrades').addEventListener('mouseout', () => {
    resetLoadoutOnlyDisplay()
    resetRedAmbrosiaDisplay()
  })

  // RED AMBROSIA
  const redAmbrosiaUpgrades = Object.keys(
    player.redAmbrosiaUpgrades
  ) as (keyof Player['redAmbrosiaUpgrades'])[]
  for (const key of redAmbrosiaUpgrades) {
    const capitalizedName = key.charAt(0).toUpperCase() + key.slice(1)
    if (!isMobile) {
      DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`).addEventListener(
        'mousemove',
        (e) => Modal(() => redAmbrosiaUpgradeToString(key), e.clientX, e.clientY, { borderColor: 'red' })
      )
      DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`).addEventListener(
        'mouseout',
        CloseModal
      )
      DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`).addEventListener(
        'focus',
        () => {
          const element = DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`)
          const elmRect = element.getBoundingClientRect()
          Modal(() => redAmbrosiaUpgradeToString(key), elmRect.x, elmRect.y + elmRect.height / 2, {
            borderColor: 'red'
          })
        }
      )
      DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`).addEventListener(
        'blur',
        CloseModal
      )
      DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`).addEventListener(
        'click',
        (event) => {
          buyRedAmbrosiaUpgradeLevel(key, event)
          Modal(() => redAmbrosiaUpgradeToString(key), event.clientX, event.clientY, { borderColor: 'red' })
        }
      )
    } else {
      DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`).addEventListener(
        'click',
        () => updateMobileRedAmbrosiaHTML(key)
      )
    }
  }

  // Toggle subtabs of Singularity tab
  for (let index = 0; index < 5; index++) {
    DOMCacheGetOrSet(`toggleSingularitySubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.Singularity, { page: index })
    )
  }

  // EVENT TAB
  document.querySelector('.consumableButton')?.addEventListener('click', () => {
    changeTab(Tabs.Purchase)
    changeSubTab(Tabs.Purchase, { page: 3 })
  })

  document.getElementById('apply-tips')?.addEventListener('click', () => {
    Prompt(i18next.t('pseudoCoins.consumables.applyTipsPrompt', { tips: getTips() }))
      .then((amount) => {
        const n = Number(amount)

        if (Number.isNaN(n) || !Number.isSafeInteger(n) || n <= 0 || n > getTips()) {
          return
        }

        sendToWebsocket(JSON.stringify({ type: 'applied-tip', amount: n }))
        setTips(getTips() - n)
      })
  })

  // Import button
  DOMCacheGetOrSet('importfile').addEventListener('change', (e) => importData(e, importSynergism))

  // Mobile theme dropdown toggle
  if (isMobile) {
    const themeArea = DOMCacheGetOrSet('themeArea')
    DOMCacheGetOrSet('theme').addEventListener('click', () => {
      themeArea.classList.toggle('open')
    })
  }

  for (let i = 1; i <= 5; i++) {
    DOMCacheGetOrSet(`switchTheme${i}`).addEventListener('click', () => {
      toggleTheme(false, i, true)
      if (isMobile) {
        DOMCacheGetOrSet('themeArea').classList.remove('open')
      }
    })
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

  document.getElementById('patchnotes')?.addEventListener('click', () => openChangelog())
  document.getElementById('changelogBlur')?.addEventListener('click', () => closeChangelog())

  if (isMobile) {
    DOMCacheGetOrSet('modalContent').addEventListener('click', CloseModal)
  }

  // Window
  window.addEventListener('error', imgErrorHandler, { capture: true })
}
