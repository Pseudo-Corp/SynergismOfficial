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
  resetLoadoutOnlyDisplay
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
import { storageSetItem } from './events/storage-events'
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
import type { OcteractUpgrades } from './Octeracts'
import { buyOcteractUpgradeLevel, octeractUpgrades, upgradeOcteractToString } from './Octeracts'
import { buyPlatonicUpgrades, createPlatonicDescription } from './Platonic'
import {
  buyRedAmbrosiaUpgradeLevel,
  displayRedAmbrosiaLevels,
  redAmbrosiaUpgradeToString,
  resetRedAmbrosiaDisplay
} from './RedAmbrosiaUpgrades'
import { buyResearch, researchDescriptions, researchModalHTML, updateResearchAuto } from './Research'
import { getResetDetails, updateAutoCubesOpens, updateAutoReset, updateTesseractAutoBuyAmount } from './Reset'
import { buyAllBlessingLevels } from './RuneBlessings'
import { runes } from './Runes'
import { buyAllSpiritLevels } from './RuneSpirits'
import type { ShopUpgradeNames } from './Shop'
import {
  buyShopUpgrades,
  createShopHTML,
  resetShopUpgrades,
  shopDescriptions,
  shopUpgrades,
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
  updateSingularityElevator,
  upgradeGQToString
} from './singularity'
import type { SingularityChallengeDataKeys } from './SingularityChallenges'
import { displayStats } from './Statistics'
import { generateExportSummary } from './Summary'
import { player, resetCheck, saveSynergy } from './Synergism'
import { changeSubTab, changeTab, Tabs } from './Tabs'
import { IconSets, imgErrorHandler, toggleAnnotation, toggleIconSet, toggleTheme } from './Themes'
import {
  autoCubeUpgradesToggle,
  autoPlatonicUpgradesToggle,
  toggleAscStatPerSecond,
  toggleAutoAscendResetActive,
  toggleAutoAscendResetMode,
  toggleAutoAscensionMode,
  toggleautobuytesseract,
  toggleAutoChallengeRun,
  toggleAutoChallengesIgnore,
  toggleautoopensCubes,
  toggleAutoPrestigeMode,
  toggleAutoReincarnateMode,
  toggleAutoResearch,
  toggleAutoResearchMode,
  toggleAutoSacrifice,
  toggleAutoTesseracts,
  toggleAutoTranscendMode,
  toggleBlueberryLoadoutmode,
  toggleBuyAmount,
  toggleBuyMaxShop,
  toggleChallenges,
  toggleHepteractAutoPercentage,
  toggleHideShop,
  toggleMaxBuyCube,
  toggleMaxPlat,
  toggleResearchBuy,
  toggleSettings,
  toggleShopConfirmation,
  toggleStatSymbol,
  updateAutoChallenge,
  updateRuneBlessingBuyAmount
} from './Toggles'
import type { FirstToEighth, FirstToFifth, OneToFive, Player, resetNames } from './types/Synergism'
import { Alert, CloseModal, Confirm, MEDIUM_MODAL_UPDATE_TICK, Modal, openIframeOverlay, Prompt } from './UpdateHTML'
import { shopMouseover } from './UpdateVisuals'
import {
  buyAllUpgrades,
  buyConstantUpgrades,
  constantUpgradeDescriptions,
  constantUpgradeHTML,
  crystalupgradedescriptions,
  crystalUpgradeHTML
} from './Upgrades'
import { isMobile } from './Utility'
import { Globals as G } from './Variables'

type PurchasableModalOptions = {
  element: HTMLElement
  html: () => string
  style: Partial<CSSStyleDeclaration>
  buy: (event: MouseEvent, action?: string) => void | Promise<void>
  mobileButtons?: Array<{ action: string; label: string }>
  updateInterval?: number
  onOpen?: () => void
  onClose?: () => void
}

const defaultModalBuyButtons = () => [
  { action: 'one', label: i18next.t('general.buyOne') },
  { action: 'max', label: i18next.t('general.buyMax') }
]

const modalBuyButtonsHTML = (buttons = defaultModalBuyButtons()) =>
  `<br><br><div class="modalButtonRow">${
    buttons.map(({ action, label }) =>
      `<button class="modalBtnBuy" data-modal-action="${action}">${label}</button>`
    ).join('')
  }</div>`

const resetDetailsModalHTML = (input: resetNames, element: HTMLElement, label: string) => {
  const details = getResetDetails(input)
  const rewards = [
    details.offeringVisible
      ? `<span class="resetModalReward" data-modal-preserve="children"><img src="Pictures/${
        IconSets[player.iconSet][0]
      }/Offering.png">${details.offeringText}</span>`
      : '',
    details.currencyVisible
      ? `<span class="resetModalReward" data-modal-preserve="children"><img src="${details.currencySrc}">${details.currencyText}</span>`
      : '',
    details.obtainiumVisible
      ? `<span class="resetModalReward" data-modal-preserve="children"><img src="Pictures/${
        IconSets[player.iconSet][0]
      }/Obtainium.png">${details.obtainiumText}</span>`
      : ''
  ].filter(Boolean).join('')

  return `<div class="resetModal" data-modal-preserve="children">
    <div class="resetModalTitle" data-modal-preserve="children">
      <img src="${(element as HTMLImageElement).src}" alt="">
      <span>${label}</span>
    </div>
    ${rewards ? `<div class="resetModalRewards" data-modal-preserve="children">${rewards}</div>` : ''}
    <div class="resetModalInfo" style="color: ${details.infoColor}">${details.infoText}</div>
  </div>`
}

const registerPurchasableModal = ({
  element,
  html,
  style,
  buy,
  mobileButtons,
  updateInterval,
  onOpen,
  onClose
}: PurchasableModalOptions) => {
  const showDesktopModal = (x: number, y: number) => {
    onOpen?.()
    Modal(html, x, y, style, updateInterval, element)
  }

  const showMobileModal = (event: MouseEvent) => {
    onOpen?.()
    Modal(
      () => `${html()}${modalBuyButtonsHTML(mobileButtons)}`,
      event.clientX,
      event.clientY,
      style,
      updateInterval,
      {
        targetElement: element,
        buttonClick: (button, buttonEvent) => {
          void buy(buttonEvent, button.dataset.modalAction)
        }
      }
    )
  }

  if (isMobile) {
    element.addEventListener('click', showMobileModal)
    return
  }

  element.addEventListener('mousemove', (event) => showDesktopModal(event.clientX, event.clientY))
  element.addEventListener('focus', () => {
    const elmRect = element.getBoundingClientRect()
    showDesktopModal(elmRect.x, elmRect.y + elmRect.height / 2)
  })
  element.addEventListener('mouseout', () => {
    CloseModal()
    onClose?.()
  })
  element.addEventListener('blur', () => {
    CloseModal()
    onClose?.()
  })
  element.addEventListener('click', (event) => {
    void buy(event)
    showDesktopModal(event.clientX, event.clientY)
  })
}

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
  const resetButtons = [
    {
      id: 'prestigebtn',
      input: 'prestige',
      label: i18next.t('reset.buttonLabels.prestige'),
      action: () => resetCheck('prestige'),
      borderColor: 'cyan'
    },
    {
      id: 'transcendbtn',
      input: 'transcension',
      label: i18next.t('reset.buttonLabels.transcension'),
      action: () => resetCheck('transcension'),
      borderColor: 'orchid'
    },
    {
      id: 'reincarnatebtn',
      input: 'reincarnation',
      label: i18next.t('reset.buttonLabels.reincarnation'),
      action: () => resetCheck('reincarnation'),
      borderColor: 'green'
    },
    {
      id: 'acceleratorboostbtn',
      input: 'acceleratorBoost',
      label: i18next.t('reset.buttonLabels.acceleratorBoost'),
      action: () => boostAccelerator(),
      borderColor: 'lightblue'
    },
    {
      id: 'challengebtn',
      input: 'transcensionChallenge',
      label: i18next.t('reset.buttonLabels.transcensionChallenge'),
      action: () => resetCheck('transcensionChallenge', undefined, true),
      borderColor: 'orchid'
    },
    {
      id: 'reincarnatechallengebtn',
      input: 'reincarnationChallenge',
      label: i18next.t('reset.buttonLabels.reincarnationChallenge'),
      action: () => resetCheck('reincarnationChallenge', undefined, true),
      borderColor: 'green'
    },
    {
      id: 'ascendChallengeBtn',
      input: 'ascensionChallenge',
      label: i18next.t('reset.buttonLabels.ascensionChallenge'),
      action: () => resetCheck('ascensionChallenge'),
      borderColor: 'orange'
    },
    {
      id: 'ascendbtn',
      input: 'ascension',
      label: i18next.t('reset.buttonLabels.ascension'),
      action: () => resetCheck('ascension'),
      borderColor: 'orange'
    },
    {
      id: 'singularitybtn',
      input: 'singularity',
      label: i18next.t('reset.buttonLabels.singularity'),
      action: () => resetCheck('singularity'),
      borderColor: 'lightgoldenrodyellow'
    }
  ] satisfies Array<{ id: string; input: resetNames; label: string; action: () => void | Promise<void>; borderColor: string }>

  for (const reset of resetButtons) {
    const element = DOMCacheGetOrSet(reset.id)
    registerPurchasableModal({
      element,
      html: () => resetDetailsModalHTML(reset.input, element, reset.label),
      style: { borderColor: reset.borderColor },
      buy: (_, modalAction) => {
        if (isMobile && modalAction !== 'reset') {
          return
        }
        if (isMobile) {
          CloseModal()
        }
        return reset.action()
      },
      mobileButtons: [{ action: 'reset', label: reset.label }],
      updateInterval: MEDIUM_MODAL_UPDATE_TICK
    })
  }

  for (const resetButton of document.getElementsByClassName('resetbtn')) {
    function onFocusMouseover () {
      resetButton.classList.add('hover')
    }

    function onBlurMouseout () {
      resetButton.classList.remove('hover')
    }

    resetButton.addEventListener('mouseover', onFocusMouseover)
    resetButton.addEventListener('focus', onFocusMouseover)

    resetButton.addEventListener('mouseout', onBlurMouseout)
    resetButton.addEventListener('blur', onBlurMouseout)
  }

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
      ).addEventListener('pointerdown', () =>
        buyProducer(
          ordinals[index2 - 1] as FirstToFifth,
          buildingTypesAlternate3[index],
          index === 0 ? index2 : (index2 * (index2 + 1)) / 2
        ))
    }
  }

  // Crystal Upgrades
  for (let index = 1; index <= 5; index++) {
    const buyUpgrade = DOMCacheGetOrSet(`buycrystalupgrade${index}`)
    registerPurchasableModal({
      element: buyUpgrade,
      html: () => crystalUpgradeHTML(index),
      style: { borderColor: 'cyan' },
      buy: () => {
        buyCrystalUpgrades(index)
        crystalupgradedescriptions(index)
      },
      mobileButtons: [{ action: 'buy', label: i18next.t('general.buyOne') }]
    })
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
      'pointerdown',
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
    registerPurchasableModal({
      element: buyConstantUpgrade,
      html: () => constantUpgradeHTML(index + 1),
      style: { borderColor: 'gold' },
      buy: () => {
        buyConstantUpgrades(index + 1)
        constantUpgradeDescriptions(index + 1)
      },
      mobileButtons: [{ action: 'buy', label: i18next.t('general.buyOne') }]
    })
  }

  // Part 4: Toggles
  // I'm just addressing all global toggles here
  const toggles = document.querySelectorAll<HTMLElement>('.auto[toggleid]')
  toggles.forEach((b) => b.addEventListener('click', () => toggleSettings(b)))
  // Toggles auto reset type (between TIME and AMOUNT for 3 first Tiers, and between PERCENTAGE and AMOUNT for Tesseracts)
  DOMCacheGetOrSet('prestigeautotoggle').addEventListener('click', () => toggleAutoPrestigeMode())
  DOMCacheGetOrSet('transcendautotoggle').addEventListener('click', () => toggleAutoTranscendMode())
  DOMCacheGetOrSet('reincarnateautotoggle').addEventListener('click', () => toggleAutoReincarnateMode())
  DOMCacheGetOrSet('tesseractautobuymode').addEventListener('click', () => toggleAutoAscensionMode())
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
  DOMCacheGetOrSet('buyAllUpgrades').addEventListener('click', () => buyAllUpgrades(false))

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
  DOMCacheGetOrSet('toggleautosacrifice').addEventListener('click', () => toggleAutoSacrifice('0'))
  // Toggle subtabs of Runes tab
  for (let index = 0; index < 4; index++) {
    DOMCacheGetOrSet(`toggleRuneSubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.Runes, { page: index })
    )
  }

  // RUNES TAB

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
    () => {
      updateAutoChallenge(1)
    }
  )
  DOMCacheGetOrSet('exitAutoChallengeTimerInput').addEventListener(
    'input',
    () => {
      updateAutoChallenge(2)
    }
  )
  DOMCacheGetOrSet('enterAutoChallengeTimerInput').addEventListener(
    'input',
    () => {
      updateAutoChallenge(3)
    }
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
    const buySelectedResearch = (buyMaxOverride?: boolean) => {
      buyResearch(index, false, false, buyMaxOverride)
      if (player.autoResearchMode === 'manual' && player.autoResearchToggle) {
        updateResearchAuto(index)
      }
    }

    if (isMobile) {
      const updateDescription = researchDescriptions.bind(null, index)

      research.addEventListener('click', (event) => {
        updateDescription()
        let buyMaxOverride: boolean | undefined

        Modal(
          () => `${researchModalHTML(index, false, buyMaxOverride)}${modalBuyButtonsHTML()}`,
          event.clientX,
          event.clientY,
          { borderColor: 'limegreen' },
          MEDIUM_MODAL_UPDATE_TICK,
          {
            targetElement: research,
            buttonClick: (button) => {
              buyMaxOverride = button.dataset.modalAction === 'max'
              buySelectedResearch(buyMaxOverride)
            }
          }
        )
      })
      continue
    }

    research.addEventListener('click', () => buySelectedResearch())
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

  const buyAllAntUpgradesButton = DOMCacheGetOrSet('buyAllAntUpgrades')
  const buyAllAntProducersButton = DOMCacheGetOrSet('buyAllAntProducers')

  buyAllAntUpgradesButton.addEventListener('click', (e: MouseEvent) => {
    buyAllAntUpgrades(player.ants.toggles.maxBuyUpgrades)
    Modal(
      allAntUpgradeHTML,
      e.clientX,
      e.clientY,
      { borderColor: 'crimson' },
      MEDIUM_MODAL_UPDATE_TICK,
      e.currentTarget as HTMLElement
    )
  })
  buyAllAntProducersButton.addEventListener('click', (e: MouseEvent) => {
    buyAllAntProducers(player.ants.toggles.maxBuyProducers)
    buyAllAntMasteries()
    Modal(
      allAntProducerHTML,
      e.clientX,
      e.clientY,
      { borderColor: 'gold' },
      MEDIUM_MODAL_UPDATE_TICK,
      e.currentTarget as HTMLElement
    )
  })

  if (!isMobile) {
    buyAllAntProducersButton.addEventListener('mousemove', (e: MouseEvent) => {
      Modal(allAntProducerHTML, e.clientX, e.clientY, { borderColor: 'gold' }, MEDIUM_MODAL_UPDATE_TICK)
    })

    buyAllAntProducersButton.addEventListener('mouseout', () => CloseModal())

    buyAllAntUpgradesButton.addEventListener('mousemove', (e: MouseEvent) => {
      Modal(allAntUpgradeHTML, e.clientX, e.clientY, { borderColor: 'crimson' }, MEDIUM_MODAL_UPDATE_TICK)
    })

    buyAllAntUpgradesButton.addEventListener('mouseout', () => CloseModal())
  }

  for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
    const antTier = DOMCacheGetOrSet(`anttier${ant + 1}`)
    antTier.style.setProperty('--glow-color', antProducerData[ant].color)
    registerPurchasableModal({
      element: antTier,
      html: () => antProducerHTML(ant),
      style: { borderColor: antProducerData[ant].color },
      buy: (_event, action) =>
        buyAntProducers(
          ant,
          action === 'max' || (action === undefined && player.ants.toggles.maxBuyProducers)
        )
    })

    const antMastery = DOMCacheGetOrSet(`antMastery${ant + 1}`)
    const blendedColor = `color-mix(in srgb, ${antProducerData[ant].color} 75%, lime 25%)`
    antMastery.style.setProperty(
      '--glow-color',
      blendedColor
    )
    registerPurchasableModal({
      element: antMastery,
      html: () => antMasteryHTML(ant),
      style: { borderColor: blendedColor },
      buy: () => buyAntMastery(ant),
      mobileButtons: [{ action: 'buy', label: i18next.t('ants.buyButton') }]
    })
  }
  // Part 2: Ant Upgrades
  for (let upgrade = AntUpgrades.AntSpeed; upgrade <= LAST_ANT_UPGRADE; upgrade++) {
    const antUpgrade = DOMCacheGetOrSet(`antUpgrade${upgrade + 1}`)

    antUpgrade.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${antUpgradeData[upgrade].antUpgradeHTML.color} 75%, crimson 25%)`
    )

    registerPurchasableModal({
      element: antUpgrade,
      html: () => antUpgradeHTML(upgrade),
      style: { borderColor: 'burlywood' },
      buy: () => buyAntUpgrade(upgrade, player.ants.toggles.maxBuyUpgrades),
      mobileButtons: [{ action: 'buy', label: i18next.t('ants.buyButton') }]
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
      extraHTML = i18next.t('pseudoCoins.lotus.useConfirmMulti')
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
  DOMCacheGetOrSet('antLeaderboardValueAmount').addEventListener('mouseleave', () => CloseModal())

  DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').addEventListener('mousemove', (e: MouseEvent) => {
    Modal(() => antCornerQuarkHTML(), e.clientX, e.clientY, { borderColor: 'cyan' })
  })
  DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').addEventListener('mouseleave', () => CloseModal())

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
  DOMCacheGetOrSet('ascensionAutoEnable').addEventListener('click', () => toggleAutoAscendResetActive())
  DOMCacheGetOrSet('ascensionAutoToggle').addEventListener('click', () => toggleAutoAscendResetMode())

  // SETTNGS TAB
  // Part 0: Subtabs
  const settingSubTabs = document.querySelectorAll('[id^="switchSettingSubTab"]')

  for (let subTabIndex = 0; subTabIndex < settingSubTabs.length; subTabIndex++) {
    settingSubTabs.item(subTabIndex).addEventListener(
      'click',
      changeSubTab.bind(null, Tabs.Settings, { page: subTabIndex })
    )
  }

  const t = document.querySelectorAll<HTMLElement>('button.statsNerds')
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
  const shopKeys = Object.keys(player.shopUpgrades) as ShopUpgradeNames[]
  for (const key of shopKeys) {
    const shopItem = shopUpgrades[key]
    if (shopItem.type === shopUpgradeTypes.UPGRADE) {
      const boundShopDescriptions = shopDescriptions.bind(null, key)
      const boundCreateShopHTML = createShopHTML.bind(null, key)
      DOMCacheGetOrSet(key).addEventListener(
        'mousemove',
        (e) => Modal(boundCreateShopHTML, e.clientX, e.clientY, { borderColor: 'cyan' })
      )
      DOMCacheGetOrSet(key).addEventListener('focus', function(this: HTMLElement) {
        const elmRect = this.getBoundingClientRect()
        Modal(boundCreateShopHTML, elmRect.x, elmRect.y + elmRect.height / 2, { borderColor: 'cyan' })
      })
      DOMCacheGetOrSet(key).addEventListener('mouseout', CloseModal)
      DOMCacheGetOrSet(key).addEventListener('blur', CloseModal)
      DOMCacheGetOrSet(key).addEventListener('mouseover', boundShopDescriptions)
      DOMCacheGetOrSet(`${key}Level`).addEventListener('mouseover', boundShopDescriptions)
      DOMCacheGetOrSet(`${key}Button`).addEventListener('mouseover', boundShopDescriptions)
      // DOMCacheGetOrSet(`${key}`).addEventListener('click', () => buyShopUpgrades(key))  //Allow clicking of image to buy also
      DOMCacheGetOrSet(`${key}Button`).addEventListener('pointerdown', () => buyShopUpgrades(key))
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
    if (key === 'offeringAutomatic') {
      continue
    }
    registerPurchasableModal({
      element: DOMCacheGetOrSet(key),
      html: () => upgradeGQToString(key),
      style: { borderColor: 'gold' },
      buy: (event, action) => buyGQUpgradeLevel(key, event, action === 'max')
    })
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
  const octUpgrade = Object.keys(octeractUpgrades) as OcteractUpgrades[]
  for (const key of octUpgrade) {
    registerPurchasableModal({
      element: DOMCacheGetOrSet(key),
      html: () => upgradeOcteractToString(key),
      style: { borderColor: 'lightseagreen' },
      buy: (event, action) => buyOcteractUpgradeLevel(key, event, action === 'max')
    })
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
    const element = DOMCacheGetOrSet(key)
    const challenge = player.singularityChallenges[key]
    const detailsHTML = () => challenge.modalHTML()
    const style = { borderColor: 'gold' }

    if (isMobile) {
      element.addEventListener('click', (event) => {
        Modal(
          () =>
            `${detailsHTML()}${modalBuyButtonsHTML([
              {
                action: 'toggle',
                label: challenge.enabled
                  ? i18next.t('singularityChallenge.modal.exit', { defaultValue: 'Exit EXALT' })
                  : i18next.t('singularityChallenge.modal.enter', { defaultValue: 'Enter EXALT' })
              }
            ])}`,
          event.clientX,
          event.clientY,
          style,
          MEDIUM_MODAL_UPDATE_TICK,
          {
            targetElement: element,
            buttonClick: () => {
              CloseModal()
              void challenge.challengeEntryHandler()
            }
          }
        )
      })
      continue
    }

    element.addEventListener('mousemove', (event) => {
      Modal(detailsHTML, event.clientX, event.clientY, style, MEDIUM_MODAL_UPDATE_TICK, element)
    })
    element.addEventListener('focus', () => {
      const elmRect = element.getBoundingClientRect()
      Modal(detailsHTML, elmRect.x, elmRect.y + elmRect.height / 2, style, MEDIUM_MODAL_UPDATE_TICK, element)
    })
    element.addEventListener('mouseout', CloseModal)
    element.addEventListener('blur', CloseModal)
    element.addEventListener('click', () => {
      CloseModal()
      void challenge.challengeEntryHandler()
    })
  }

  // BLUEBERRY UPGRADES
  const blueberryUpgrades = Object.keys(
    ambrosiaUpgrades
  ) as AmbrosiaUpgradeNames[]
  for (const key of blueberryUpgrades) {
    registerPurchasableModal({
      element: DOMCacheGetOrSet(key),
      html: () => ambrosiaUpgradeToString(key),
      style: { borderColor: 'blue' },
      buy: (event, action) => buyAmbrosiaUpgradeLevel(key, event, action === 'max'),
      onOpen: () => highlightPrerequisites(key),
      onClose: resetHighlights
    })
  }

  // BLUEBERRY LOADOUTS
  const blueberryLoadouts = document.querySelectorAll('[id^="blueberryLoadout"]')

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
    registerPurchasableModal({
      element: DOMCacheGetOrSet(`redAmbrosia${capitalizedName}`),
      html: () => redAmbrosiaUpgradeToString(key),
      style: { borderColor: 'red' },
      buy: (event, action) => buyRedAmbrosiaUpgradeLevel(key, event, action === 'max')
    })
  }

  // Toggle subtabs of Singularity tab
  for (let index = 0; index < 5; index++) {
    DOMCacheGetOrSet(`toggleSingularitySubTab${index + 1}`).addEventListener(
      'click',
      () => changeSubTab(Tabs.Singularity, { page: index })
    )
  }

  // EVENT TAB
  function visitConsumableTab () {
    changeTab(Tabs.Purchase)
    changeSubTab(Tabs.Purchase, { page: 3 })
  }

  document.querySelector('#consumableEvents > .consumableButton')?.addEventListener('click', visitConsumableTab)
  document.querySelector('#lotusButtons > .consumableButton')?.addEventListener('click', visitConsumableTab)

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
      storageSetItem('copyToClipboard', '')
    } else {
      localStorage.removeItem('copyToClipboard')
    }
  })

  document.getElementById('patchnotes')?.addEventListener(
    'click',
    openIframeOverlay.bind(null, 'https://changelog.synergism.cc/latest')
  )
  document.getElementById('tosLink')?.addEventListener(
    'click',
    openIframeOverlay.bind(null, 'https://synergism.cc/terms-of-service')
  )

  // Window
  window.addEventListener('error', imgErrorHandler, { capture: true })
}
