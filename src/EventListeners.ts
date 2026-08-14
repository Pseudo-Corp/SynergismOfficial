import i18next from 'i18next'
import { displayAchievementProgress, resetAchievementProgressDisplay } from './Achievements'
import {
  ambrosiaEditAction,
  ambrosiaEditToString,
  type AmbrosiaUpgradeNames,
  ambrosiaUpgrades,
  ambrosiaUpgradeToString,
  beginAmbrosiaEdit,
  buyAmbrosiaUpgradeLevel,
  createLoadoutDescription,
  displayLevelsBlueberry,
  displayOnlyLoadout,
  exportBlueberryTree,
  highlightPrerequisites,
  importBlueberryTree,
  isAmbrosiaEditMode,
  loadoutHandler,
  quickSaveBlueberryTree,
  resetBlueberryTree,
  resetHighlights,
  resetLoadoutOnlyDisplay,
  setAmbrosiaEditMode,
  toggleAmbrosiaEditMode
} from './BlueberryUpgrades'
import { boostAccelerator, buyBuilding, buyCrystalUpgrades, buyTesseractBuilding } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { exitOffline, forcedDailyReset, timeWarp } from './Calculate'
import { setChallengeFocus, toggleRetryChallenges } from './Challenges'
import { testing } from './Config'
import { corruptionCleanseConfirm, corruptionDisplay, openCorruptionDetailsModal } from './Corruptions'
import { buyCubeUpgrades, cubeUpgradeDesc, cubeUpgradeModalHTML } from './Cubes'
import { storageGetItem, storageRemoveItem, storageSetItem } from './events/storage-events'
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
import { toggleLotusSection } from './Features/Ants/HTML/updates/lotus-section'
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
import { registerMobileHotkeyPanel, resetHotkeys } from './Hotkeys'
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
import {
  buyOcteractUpgradeLevel,
  octeractUpgrades,
  toggleMaxedOcteractUpgrades,
  upgradeOcteractToString
} from './Octeracts'
import { buyPlatonicUpgrades, createPlatonicDescription, platonicUpgradeModalHTML } from './Platonic'
import { buyPurpleReactorUpgradeLevel, purpleReactorUpgradeNames, purpleReactorUpgradeToString } from './Purple'
import {
  buyRedAmbrosiaUpgradeLevel,
  displayRedAmbrosiaLevels,
  redAmbrosiaUpgradeToString,
  resetRedAmbrosiaDisplay
} from './RedAmbrosiaUpgrades'
import {
  buyResearch,
  researchDescriptions,
  researchModalHTML,
  toggleMaxedResearches,
  updateResearchAuto
} from './Research'
import { getResetDetails, updateAutoCubesOpens, updateAutoReset, updateTesseractAutoBuyAmount } from './Reset'
import { buyAllBlessingLevels } from './RuneBlessings'
import { runes } from './Runes'
import { buyAllSpiritLevels } from './RuneSpirits'
import { buyShopUpgrades, resetShopUpgrades, useConsumablePrompt } from './Shop'
import {
  addSingularityPerkToTree,
  buyGoldenQuarks,
  buyGQUpgradeLevel,
  calculateMaxSingularityLookahead,
  goldenQuarkUpgrades,
  initializeSingularityPerkTree,
  type SingularityDataKeys,
  singularityPerkModalHTML,
  singularityPerks,
  teleportToSingularity,
  toggleMaxedGoldenQuarkUpgrades,
  updateSingularityElevator,
  upgradeGQToString
} from './singularity'
import type { SingularityChallengeDataKeys } from './SingularityChallenges'
import { registerSpriteAlias, updateIconsFromSprites } from './SpriteSheets'
import { displayStats } from './Statistics'
import { generateExportSummary } from './Summary'
import { player, resetCheck, saveSynergy } from './Synergism'
import { changeSubTab, changeTab, registerSubTabSwitches, Tabs } from './Tabs'
import { toggleAllBuildingAutomation, toggleAutomatedBuildingVisibility } from './tabs/buildings'
import { IconSets, imgErrorHandler, themeValues, toggleAnnotation, toggleIconSet, toggleTheme } from './Themes'
import {
  autoCubeUpgradesToggle,
  autoPlatonicUpgradesToggle,
  toggleAscStatPerSecond,
  toggleauto,
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
  toggleMonospaceFont,
  toggleResearchBuy,
  toggleSettings,
  toggleShopConfirmation,
  toggleStatSymbol,
  updateAutoChallenge,
  updateRuneBlessingBuyAmount
} from './Toggles'
import type { OneToFive, Player, resetNames, ZeroToFour } from './types/Synergism'
import { Alert, CloseModal, Confirm, MEDIUM_MODAL_UPDATE_TICK, Modal, openIframeOverlay, Prompt } from './UpdateHTML'
import { cycleCorruptionScoreTarget, selectCorruptionScoreTarget, shopMouseover, visualUpdatePurple } from './UpdateVisuals'
import {
  buyAllUpgrades,
  buyConstantUpgrades,
  constantUpgradeDescriptions,
  constantUpgradeHTML,
  crystalupgradedescriptions,
  crystalUpgradeHTML,
  togglePurchasedUpgrades
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
  disabled?: () => boolean
}

type MobileSubTabIconConfig = {
  wrapperSelector: string
  icons: Record<string, string>
  remainingControlsLayout?: 'inline' | 'fullRow'
}

const MOBILE_HEADER_EXPANDED_STORAGE_VALUE = 'expanded'
const mobileSubTabIconContainerIDs = new Set(['switchSettingSubTab10'])
const purpleReactantPercentages = [0, 10, 25, 50, 100] as const

type PurpleReactantPercentage = typeof purpleReactantPercentages[number]

const mobileSubTabIconConfigs: MobileSubTabIconConfig[] = [
  {
    wrapperSelector: '#buildings > .subTabWrapper',
    icons: {
      switchToCoinBuilding: 'Pictures/Subtab Icons/Buildings/Coin.png',
      switchToDiamondBuilding: 'Pictures/Subtab Icons/Buildings/Diamond.png',
      switchToMythosBuilding: 'Pictures/Subtab Icons/Buildings/Mythos.png',
      switchToParticleBuilding: 'Pictures/Subtab Icons/Buildings/Particle.png',
      switchToTesseractBuilding: 'Pictures/Subtab Icons/Buildings/Tesseract.png'
    }
  },
  {
    wrapperSelector: '#runesToggle',
    icons: {
      toggleRuneSubTab1: 'Pictures/Subtab Icons/Runes/Runes.png',
      toggleRuneSubTab2: 'Pictures/Subtab Icons/Runes/Talismans.png',
      toggleRuneSubTab3: 'Pictures/Subtab Icons/Runes/Blessings.png'
    }
  },
  {
    wrapperSelector: '#achievementsToggle',
    icons: {
      toggleAchievementSubTab1: 'Pictures/Subtab Icons/Achievements/Achievements.png',
      toggleAchievementSubTab2: 'Pictures/Subtab Icons/Achievements/Levels.png'
    }
  },
  {
    wrapperSelector: '#challengesTabsToggle',
    icons: {
      toggleChallengesSubTab1: 'Pictures/Subtab Icons/Challenges/Challenge.png',
      toggleChallengesSubTab2: 'Pictures/Subtab Icons/Challenges/Exalt.png'
    }
  },
  {
    wrapperSelector: '#antSubtabs',
    icons: {
      toggleAntSubtab1: 'Pictures/Subtab Icons/Anthill/Anthill.png',
      toggleAntSubtab2: 'Pictures/Subtab Icons/Anthill/Altar.png',
      toggleAntSubtab3: 'Pictures/Subtab Icons/Anthill/QuarkCorner.png'
    }
  },
  {
    wrapperSelector: '#wowCubeSidebarButtons',
    icons: {
      switchCubeSubTab1: 'Pictures/Subtab Icons/Wow! Cubes/CubeTributes.png',
      switchCubeSubTab2: 'Pictures/Subtab Icons/Wow! Cubes/TesseractGifts.png',
      switchCubeSubTab3: 'Pictures/Subtab Icons/Wow! Cubes/HypercubeBenedictions.png',
      switchCubeSubTab4: 'Pictures/Subtab Icons/Wow! Cubes/PlatonicStatues.png',
      switchCubeSubTab5: 'Pictures/Subtab Icons/Wow! Cubes/CubeUpgrades.png',
      switchCubeSubTab6: 'Pictures/Subtab Icons/Wow! Cubes/PlatonicUpgrades.png',
      switchCubeSubTab7: 'Pictures/Subtab Icons/Wow! Cubes/HepteractForge.png'
    }
  },
  {
    wrapperSelector: '#singularityTabsToggle',
    icons: {
      toggleSingularitySubTab1: 'Pictures/Subtab Icons/Singularity/Elevator.png',
      toggleSingularitySubTab2: 'Pictures/Subtab Icons/Singularity/GoldenQuarkUpgrades.png',
      toggleSingularitySubTab3: 'Pictures/Subtab Icons/Singularity/SingularityPerks.png',
      toggleSingularitySubTab4: 'Pictures/Subtab Icons/Singularity/Octeracts.png',
      toggleSingularitySubTab5: 'Pictures/Subtab Icons/Singularity/Ambrosia.png'
    }
  },
  {
    wrapperSelector: '#settings > .subtabSwitcher',
    remainingControlsLayout: 'fullRow',
    icons: {
      switchSettingSubTab1: 'Pictures/Subtab Icons/Settings/Settings.png',
      switchSettingSubTab2: 'Pictures/Subtab Icons/Settings/Languages.png',
      switchSettingSubTab3: 'Pictures/Subtab Icons/Settings/Credits.png',
      switchSettingSubTab4: 'Pictures/Subtab Icons/Settings/StatsForNerds.png',
      switchSettingSubTab5: 'Pictures/Subtab Icons/Settings/ResetHistory.png',
      switchSettingSubTab6: 'Pictures/Subtab Icons/Settings/AscendHistory.png',
      switchSettingSubTab7: 'Pictures/Subtab Icons/Settings/SingularityHistory.png',
      switchSettingSubTab8: 'Pictures/Subtab Icons/Settings/Hotkeys.png',
      switchSettingSubTab9: 'Pictures/Subtab Icons/Settings/Account.png',
      switchSettingSubTab10: 'Pictures/Default/Notifications.png'
    }
  },
  {
    wrapperSelector: '#pseudoCoins > .subtabSwitcher',
    icons: {
      cartSubTab1: 'Pictures/Subtab Icons/PseudoCoins/PseudoCoins.png',
      cartSubTab2: 'Pictures/Subtab Icons/PseudoCoins/Subscriptions.png',
      cartSubTab3: 'Pictures/Subtab Icons/PseudoCoins/Upgrades.png',
      cartSubTab4: 'Pictures/Subtab Icons/PseudoCoins/Consumables.png',
      cartSubTab5: 'Pictures/Subtab Icons/PseudoCoins/Checkout.png'
    }
  }
]

const mobileStatsIconConfig: Record<string, string> = {
  kMisc: 'Pictures/Stats for Nerds Icons/Categories/Miscellaneous.png',
  kBaseOffering: 'Pictures/Stats for Nerds Icons/Categories/BaseOfferings.png',
  kOfferingMult: 'Pictures/Stats for Nerds Icons/Categories/OfferingMultiplier.png',
  kRuneEffectMult: 'Pictures/Stats for Nerds Icons/Categories/RunePower.png',
  kSalvage: 'Pictures/Stats for Nerds Icons/Categories/Salvage.png',
  kBaseObtainium: 'Pictures/Stats for Nerds Icons/Categories/BaseObtainium.png',
  kObtIgnoreDR: 'Pictures/Stats for Nerds Icons/Categories/ImmaculateObtainium.png',
  kObtMult: 'Pictures/Stats for Nerds Icons/Categories/ObtainiumMultiplier.png',
  kQuarkMult: 'Pictures/Stats for Nerds Icons/Categories/QuarkMultiplier.png',
  kGSpeedMultIgnoreDR: 'Pictures/Stats for Nerds Icons/Categories/GlobalSpeedImmaculate.png',
  kGSpeedMult: 'Pictures/Stats for Nerds Icons/Categories/GlobalSpeedMultiplier.png',
  kAntSpeedMult: 'Pictures/Stats for Nerds Icons/Categories/AntSpeedMultiplier.png',
  kAntSacrificeMult: 'Pictures/Stats for Nerds Icons/Categories/AntSacrificeMultiplier.png',
  kAntELO: 'Pictures/Stats for Nerds Icons/Categories/AntELO.png',
  kAdditiveAntELOMult: 'Pictures/Stats for Nerds Icons/Categories/AntELOMult.png',
  kRebornELOCreationSpeedMult: 'Pictures/Stats for Nerds Icons/Categories/RebornELOCreation.png',
  kTalismanRuneBonusMult: 'Pictures/Stats for Nerds Icons/Categories/TalismanPower.png',
  kASCMult: 'Pictures/Stats for Nerds Icons/Categories/AscensionSpeedMultiplier.png',
  kACountMult: 'Pictures/Stats for Nerds Icons/Categories/AscensionCountMultiplier.png',
  kGlobalCubeMult: 'Pictures/Stats for Nerds Icons/Categories/GlobalCubeMultiplier.png',
  kCubeMult: 'Pictures/Stats for Nerds Icons/Categories/CubeMultiplier.png',
  kTessMult: 'Pictures/Stats for Nerds Icons/Categories/TesseractMultiplier.png',
  kHypercubeMult: 'Pictures/Stats for Nerds Icons/Categories/HypercubeMultiplier.png',
  kPlatMult: 'Pictures/Stats for Nerds Icons/Categories/PlatonicCubeMultiplier.png',
  kHeptMult: 'Pictures/Stats for Nerds Icons/Categories/HepteractMultiplier.png',
  kOrbPowderMult: 'Pictures/img_transparent.png',
  kGQMult: 'Pictures/Stats for Nerds Icons/Categories/GoldenQuarkMultiplier.png',
  kGQCost: 'Pictures/Stats for Nerds Icons/Categories/GoldenQuarkCostMultiplier.png',
  kAddStats: 'Pictures/Stats for Nerds Icons/Categories/AddCodeStats.png',
  kOctMult: 'Pictures/Stats for Nerds Icons/Categories/OcteractMultiplier.png',
  kAmbrosiaAdditiveLuckMult: 'Pictures/Stats for Nerds Icons/Categories/AmbrosiaLuckMult.png',
  kAmbrosiaLuck: 'Pictures/Stats for Nerds Icons/Categories/AmbrosiaLuck.png',
  kAmbrosiaBlueberries: 'Pictures/Stats for Nerds Icons/Categories/BlueberryInventory.png',
  kAmbrosiaGenMult: 'Pictures/Stats for Nerds Icons/Categories/AmbrosiaBarPoints.png',
  kLuckConversion: 'Pictures/Stats for Nerds Icons/Categories/LuckConversion.png',
  kRedAmbrosiaLuck: 'Pictures/Stats for Nerds Icons/Categories/RedLuck.png',
  kRedAmbrosiaGenMult: 'Pictures/Stats for Nerds Icons/Categories/RedBarPoints.png',
  kShopVouchers: 'Pictures/Stats for Nerds Icons/Categories/ShopVouchers.png'
}

const getSubTabI18nKey = (button: HTMLButtonElement) =>
  button.getAttribute('i18n') ?? button.querySelector<HTMLElement>('[i18n]')?.getAttribute('i18n') ?? null

const termsOfServiceUrl = 'https://synergism.cc/terms-of-service'
const privacyPolicyUrl = 'https://synergism.cc/privacy-policy'

const registerIframeOverlayLink = (id: string, url: string) => {
  DOMCacheGetOrSet(id).addEventListener('click', (event) => {
    event.preventDefault()
    openIframeOverlay(url)
  })
}

const defaultModalBuyButtons = () => [
  { action: 'one', label: i18next.t('general.buyOne') },
  { action: 'max', label: i18next.t('general.buyMax') }
]

const modalBuyButtonsHTML = (buttons = defaultModalBuyButtons()) =>
  `<br><br><div class="modalButtonRow">${
    buttons.map(({ action, label }) => `<button class="modalBtnBuy" data-modal-action="${action}">${label}</button>`)
      .join('')
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
  onClose,
  disabled
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
    element.addEventListener('click', (event) => {
      if (disabled?.()) return
      showMobileModal(event)
    })
    return
  }

  element.addEventListener('mousemove', (event) => {
    if (disabled?.()) return
    showDesktopModal(event.clientX, event.clientY)
  })
  element.addEventListener('focus', () => {
    if (disabled?.()) return
    const elmRect = element.getBoundingClientRect()
    showDesktopModal(elmRect.x, elmRect.y + elmRect.height / 2)
  })
  element.addEventListener('mouseout', () => {
    if (disabled?.()) return
    CloseModal()
    onClose?.()
  })
  element.addEventListener('blur', () => {
    if (disabled?.()) return
    CloseModal()
    onClose?.()
  })
  element.addEventListener('click', (event) => {
    if (disabled?.()) return
    void buy(event)
    showDesktopModal(event.clientX, event.clientY)
  })
}

const createMobileIcon = (sourceButton: HTMLButtonElement, src: string, className: string) => {
  const icon = document.createElement('img')

  for (const attribute of sourceButton.attributes) {
    icon.setAttribute(attribute.name, attribute.value)
  }

  icon.classList.add(className)
  icon.src = src
  icon.loading = 'lazy'
  icon.width = 32
  icon.height = 32
  icon.role = 'button'
  icon.tabIndex = 0

  const i18nKey = getSubTabI18nKey(sourceButton)
  if (i18nKey !== null) {
    const label = i18next.t(i18nKey)
    icon.setAttribute('i18n', i18nKey)
    icon.alt = label
    icon.title = label
    icon.setAttribute('aria-label', label)
  } else {
    const label = sourceButton.textContent?.trim()
    if (label !== undefined && label.length > 0) {
      icon.alt = label
      icon.title = label
      icon.setAttribute('aria-label', label)
    }
  }

  icon.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    icon.click()
  })

  return icon
}

const createMobileIconContainer = (sourceButton: HTMLButtonElement, icon: HTMLImageElement) => {
  const container = document.createElement('span')

  for (const attribute of sourceButton.attributes) {
    container.setAttribute(attribute.name, attribute.value)
  }

  container.removeAttribute('style')
  container.removeAttribute('i18n')
  container.classList.remove('active-subtab')
  container.classList.add('mobileSubTabIconContainer')
  container.role = 'button'
  container.tabIndex = 0

  const i18nKey = getSubTabI18nKey(sourceButton)
  if (i18nKey !== null) {
    const label = i18next.t(i18nKey)
    container.title = label
    container.setAttribute('aria-label', label)
    container.setAttribute('i18n-aria-label', i18nKey)
  }

  icon.removeAttribute('id')
  icon.removeAttribute('style')
  icon.removeAttribute('role')
  icon.removeAttribute('tabindex')
  icon.removeAttribute('i18n-aria-label')
  icon.classList.remove('active-subtab')

  container.appendChild(icon)
  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    container.click()
  })

  return container
}

const registerMobileSubTabIcons = () => {
  if (!isMobile) {
    return
  }

  for (const { wrapperSelector, icons, remainingControlsLayout = 'inline' } of mobileSubTabIconConfigs) {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (wrapper === null) {
      continue
    }

    wrapper.classList.add('mobileIconSubTabWrapper')

    for (const [buttonID, src] of Object.entries(icons)) {
      const sourceButton = wrapper.querySelector<HTMLButtonElement>(`button#${buttonID}`)
      if (sourceButton === null) {
        continue
      }

      const icon = createMobileIcon(sourceButton, src, 'mobileSubTabIcon')
      const existingIconContainer = sourceButton.parentElement?.parentElement === wrapper
        ? sourceButton.parentElement
        : null

      if (existingIconContainer !== null) {
        icon.removeAttribute('style')
        existingIconContainer.classList.add('mobileSubTabIconContainer')
        sourceButton.replaceWith(icon)
        continue
      }

      sourceButton.replaceWith(
        mobileSubTabIconContainerIDs.has(buttonID)
          ? createMobileIconContainer(sourceButton, icon)
          : icon
      )
    }

    if (wrapper.querySelector(':scope > :not(.mobileSubTabIcon, .mobileSubTabIconContainer)') !== null) {
      wrapper.classList.add(
        remainingControlsLayout === 'inline'
          ? 'mobileIconSubTabWrapperWithInlineControl'
          : 'mobileIconSubTabWrapperWithFullRowControl'
      )
    }
  }
}

const registerMobileStatsIcons = () => {
  if (!isMobile) {
    return
  }

  const wrapper = DOMCacheGetOrSet('statsForNerds')
  for (const [buttonID, src] of Object.entries(mobileStatsIconConfig)) {
    const sourceButton = wrapper.querySelector<HTMLButtonElement>(`button#${buttonID}`)
    if (sourceButton === null) {
      continue
    }

    const icon = createMobileIcon(sourceButton, src, 'mobileStatsNerdsIcon')
    icon.style.backgroundColor = ''
    sourceButton.replaceWith(icon)
  }

  registerSpriteAlias('overfluxPowderImage', 'kOrbPowderMult', 32)
  updateIconsFromSprites(IconSets[player.iconSet][0])
}

const getMobileHeaderContentMaxHeight = (content: HTMLElement) => {
  return Math.max(0, content.scrollHeight)
}

const clampMobileHeaderContentHeight = (height: number, maxHeight: number) => {
  return Math.round(Math.max(0, Math.min(height, maxHeight)))
}

const updateMobileHeaderResizeHandleValue = (handle: HTMLElement, height: number, maxHeight: number) => {
  handle.setAttribute('aria-valuemin', '0')
  handle.setAttribute('aria-valuemax', `${Math.round(maxHeight)}`)
  handle.setAttribute('aria-valuenow', `${Math.round(height)}`)
}

const setMobileHeaderContentHeight = (
  content: HTMLElement,
  handle: HTMLElement,
  height: number,
  persist: boolean
) => {
  const maxHeight = getMobileHeaderContentMaxHeight(content)
  const nextHeight = clampMobileHeaderContentHeight(height, maxHeight)

  if (nextHeight >= maxHeight) {
    content.style.removeProperty('--mobile-header-content-height')
  } else {
    content.style.setProperty('--mobile-header-content-height', `${nextHeight}px`)
  }

  updateMobileHeaderResizeHandleValue(handle, nextHeight, maxHeight)

  if (persist) {
    storageSetItem(
      'mobileHeaderContentHeight',
      nextHeight >= maxHeight ? MOBILE_HEADER_EXPANDED_STORAGE_VALUE : `${nextHeight}`
    )
  }

  requestAnimationFrame(updateMobileSubTabLayout)
}

const registerMobileHeaderResize = () => {
  if (!isMobile) {
    return
  }

  const content = DOMCacheGetOrSet('mobileHeaderContent')
  const handle = DOMCacheGetOrSet('mobileHeaderResizeHandle')
  const storedHeight = storageGetItem('mobileHeaderContentHeight')
  let storedHeightApplied = false

  if (storedHeight !== null && storedHeight !== 'mobileHeaderContentHeight') {
    const parsedHeight = Number.parseInt(storedHeight, 10)
    if (Number.isFinite(parsedHeight)) {
      setMobileHeaderContentHeight(content, handle, parsedHeight, false)
      storedHeightApplied = true
    }
  }

  if (!storedHeightApplied) {
    updateMobileHeaderResizeHandleValue(
      handle,
      content.getBoundingClientRect().height,
      getMobileHeaderContentMaxHeight(content)
    )
  }

  let activePointerId: number | null = null
  let dragStartY = 0
  let dragStartHeight = 0

  handle.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    activePointerId = event.pointerId
    dragStartY = event.clientY
    dragStartHeight = content.getBoundingClientRect().height
    handle.setPointerCapture(event.pointerId)
    document.body.classList.add('mobileHeaderIsResizing')
    event.preventDefault()
  })

  handle.addEventListener('pointermove', (event) => {
    if (event.pointerId !== activePointerId) {
      return
    }

    setMobileHeaderContentHeight(content, handle, dragStartHeight + event.clientY - dragStartY, false)
    event.preventDefault()
  })

  const finishDragging = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) {
      return
    }

    activePointerId = null
    document.body.classList.remove('mobileHeaderIsResizing')

    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId)
    }

    setMobileHeaderContentHeight(content, handle, content.getBoundingClientRect().height, true)
  }

  handle.addEventListener('pointerup', finishDragging)
  handle.addEventListener('pointercancel', finishDragging)
}

const updateMobileSubTabLayout = () => {
  if (!isMobile) {
    return
  }

  const main = document.querySelector<HTMLElement>('main')
  const mainHeader = DOMCacheGetOrSet('mainHeader')
  if (main === null) {
    return
  }

  const activeMainPanel = Array.from(main.children)
    .find((child): child is HTMLElement => child instanceof HTMLElement && getComputedStyle(child).display !== 'none')
  const activeSubTabWrapper = activeMainPanel?.querySelector<HTMLElement>('.subTabWrapper')
  const subTabHeight = activeSubTabWrapper != null && getComputedStyle(activeSubTabWrapper).display !== 'none'
    ? activeSubTabWrapper.getBoundingClientRect().height
    : 0

  document.body.style.setProperty('--mobile-subtab-height', `${subTabHeight}px`)
  document.body.style.setProperty('--mobile-subtab-top', `${mainHeader.getBoundingClientRect().bottom}px`)
}

const registerMobileSubTabLayout = () => {
  if (!isMobile) {
    return
  }

  const update = () => requestAnimationFrame(updateMobileSubTabLayout)
  const resizeObserver = new ResizeObserver(update)
  resizeObserver.observe(DOMCacheGetOrSet('mainHeader'))
  document.querySelectorAll<HTMLElement>('.subTabWrapper').forEach((element) => resizeObserver.observe(element))

  window.addEventListener('resize', update)
  update()
}

export const generateEventHandlers = () => {
  registerMobileSubTabIcons()
  registerMobileStatsIcons()
  registerMobileHotkeyPanel()
  registerMobileHeaderResize()
  registerSubTabSwitches()
  registerMobileSubTabLayout()

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
  ] satisfies Array<
    { id: string; input: resetNames; label: string; action: () => void | Promise<void>; borderColor: string }
  >

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
  DOMCacheGetOrSet('buyaccelerator').addEventListener('click', () => buyBuilding('accelerator'))
  DOMCacheGetOrSet('buymultiplier').addEventListener('click', () => buyBuilding('multiplier'))
  DOMCacheGetOrSet('buyacceleratorboost').addEventListener('click', () => boostAccelerator())

  // Coin, Diamond and Mythos Buildings
  const buildingTypesAlternate2 = ['coin', 'diamond', 'mythos'] as const
  buildingTypesAlternate2.forEach((type) => {
    for (let index2 = 1; index2 <= 5; index2++) {
      DOMCacheGetOrSet(`buy${type}${index2}`)
        .addEventListener('pointerdown', () => buyBuilding(type, undefined, index2 - 1 as ZeroToFour))
    }
  })

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
      () => buyBuilding('particle', undefined, index as ZeroToFour)
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
  const buildingAutomationToggles = document.querySelectorAll<HTMLButtonElement>('.buildingAutomationToggle')
  buildingAutomationToggles.forEach((button) =>
    button.addEventListener('click', () => {
      toggleAllBuildingAutomation(button)
      toggleauto()
    })
  )
  const automatedBuildingVisibilityToggles = document.querySelectorAll<HTMLButtonElement>(
    '.automatedBuildingVisibilityToggle'
  )
  automatedBuildingVisibilityToggles.forEach((button) =>
    button.addEventListener('click', () => {
      toggleAutomatedBuildingVisibility(button)
    })
  )
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
  DOMCacheGetOrSet('togglePurchasedUpgrades').addEventListener('click', togglePurchasedUpgrades)

  // ACHIEVEMENTS TAB
  // TODO: Remove 1 indexing
  /*for (let index = 1; index <= achievementpointvalues.length - 1; index++) {
    // Onmouseover events (Achievement descriptions)
    const achievement = DOMCacheGetOrSet(`ach${index}`)
    achievement.addEventListener('mouseover', () => achievementdescriptions(index))
    achievement.addEventListener('focus', () => achievementdescriptions(index))
  }*/

  const achievementProgress = DOMCacheGetOrSet('showAchievementProgress')

  if (isMobile) {
    achievementProgress.addEventListener('click', function(this: HTMLElement) {
      const toggled = this.toggleAttribute('show-progress')
      if (!toggled) {
        resetAchievementProgressDisplay()
      } else {
        displayAchievementProgress()
      }
    })
  } else {
    achievementProgress.addEventListener('mouseover', () => displayAchievementProgress())
    achievementProgress.addEventListener('focus', () => displayAchievementProgress())
    achievementProgress.addEventListener('mouseout', () => resetAchievementProgressDisplay())
    achievementProgress.addEventListener('blur', () => resetAchievementProgressDisplay())
  }

  // RUNES TAB [And all corresponding subtabs]
  // Part 0: Upper UI portion
  // Auto sacrifice toggle button
  DOMCacheGetOrSet('toggleautosacrifice').addEventListener('click', () => toggleAutoSacrifice(0))

  // RUNES TAB

  DOMCacheGetOrSet('buyRuneBlessingInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(1))
  DOMCacheGetOrSet('buyRuneSpiritInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(2))

  DOMCacheGetOrSet('buyAllBlessings').addEventListener('click', () => buyAllBlessingLevels(player.offerings))
  DOMCacheGetOrSet('buyAllSpirits').addEventListener('click', () => buyAllSpiritLevels(player.offerings))

  // CHALLENGES TAB
  // Part 1: Challenges
  // Challenge 1-15 buttons
  for (let index = 0; index < 15; index++) {
    DOMCacheGetOrSet(`challenge${index + 1}`).addEventListener('click', () => setChallengeFocus(index + 1))
    DOMCacheGetOrSet(`challenge${index + 1}`).addEventListener(
      'dblclick',
      () => {
        setChallengeFocus(index + 1)
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
  DOMCacheGetOrSet('toggleMaxedResearches').addEventListener('click', toggleMaxedResearches)

  const buyAllAntUpgradesButton = DOMCacheGetOrSet('buyAllAntUpgrades')
  const buyAllAntProducersButton = DOMCacheGetOrSet('buyAllAntProducers')
  const buyAntUpgrades = () => buyAllAntUpgrades(player.ants.toggles.maxBuyUpgrades)
  const buyAntProducersAndMasteries = () => {
    buyAllAntProducers(player.ants.toggles.maxBuyProducers)
    buyAllAntMasteries()
  }

  // Keep the existing modal behavior for browser builds, including browsers on mobile devices.
  if (PLATFORM === 'mobile') {
    buyAllAntUpgradesButton.addEventListener('click', buyAntUpgrades)
    buyAllAntProducersButton.addEventListener('click', buyAntProducersAndMasteries)
  } else {
    registerPurchasableModal({
      element: buyAllAntUpgradesButton,
      html: allAntUpgradeHTML,
      style: { borderColor: 'crimson' },
      buy: buyAntUpgrades,
      mobileButtons: [{ action: 'buyAll', label: i18next.t('ants.buyAllUpgrades') }],
      updateInterval: MEDIUM_MODAL_UPDATE_TICK
    })
    registerPurchasableModal({
      element: buyAllAntProducersButton,
      html: allAntProducerHTML,
      style: { borderColor: 'gold' },
      buy: buyAntProducersAndMasteries,
      mobileButtons: [{ action: 'buyAll', label: i18next.t('ants.buyAllProducers') }],
      updateInterval: MEDIUM_MODAL_UPDATE_TICK
    })
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
      mobileButtons: [{ action: 'buy', label: i18next.t('general.upgrade') }]
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
      mobileButtons: [{ action: 'buy', label: i18next.t('general.upgrade') }]
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

  const useLotus = () => {
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
  }

  DOMCacheGetOrSet('use-lotus').addEventListener('click', useLotus)
  DOMCacheGetOrSet('use-lotus-collapsed').addEventListener('click', useLotus)

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
  // Part 1: Cube Upgrades
  const cubeUpgradeModalStyle = { borderColor: 'gold' }
  const desktopCubeUpgradeModal = (index: number, cubeUpgrade: HTMLElement, x: number, y: number) => {
    cubeUpgradeDesc(index)
    const image = cubeUpgrade.querySelector('img')

    Modal(
      () => cubeUpgradeModalHTML(index, player.cubeUpgradesBuyMaxToggle, image?.src),
      x,
      y,
      cubeUpgradeModalStyle,
      MEDIUM_MODAL_UPDATE_TICK,
      cubeUpgrade
    )
  }

  const mobileCubeUpgradeModal = (index: number, cubeUpgrade: HTMLElement, event: MouseEvent) => {
    cubeUpgradeDesc(index)
    let buyMaxOverride = player.cubeUpgradesBuyMaxToggle
    const image = cubeUpgrade.querySelector('img')

    Modal(
      () => `${cubeUpgradeModalHTML(index, buyMaxOverride, image?.src)}${modalBuyButtonsHTML()}`,
      event.clientX,
      event.clientY,
      cubeUpgradeModalStyle,
      MEDIUM_MODAL_UPDATE_TICK,
      {
        targetElement: cubeUpgrade,
        buttonClick: (button) => {
          buyMaxOverride = button.dataset.modalAction === 'max'
          buyCubeUpgrades(index, buyMaxOverride)
        }
      }
    )
  }

  for (let index = 1; index < player.cubeUpgrades.length; index++) {
    const cubeUpgrade = DOMCacheGetOrSet(`cubeUpg${index}`)
    cubeUpgrade.setAttribute('aria-haspopup', 'dialog')

    if (isMobile) {
      cubeUpgrade.addEventListener('click', (event) => mobileCubeUpgradeModal(index, cubeUpgrade, event))
      continue
    }

    cubeUpgrade.addEventListener('mousemove', (event) => {
      desktopCubeUpgradeModal(index, cubeUpgrade, event.clientX, event.clientY)
    })
    cubeUpgrade.addEventListener('focus', () => {
      const elmRect = cubeUpgrade.getBoundingClientRect()
      desktopCubeUpgradeModal(index, cubeUpgrade, elmRect.x, elmRect.y + elmRect.height / 2)
    })
    cubeUpgrade.addEventListener('mouseout', CloseModal)
    cubeUpgrade.addEventListener('blur', CloseModal)
    cubeUpgrade.addEventListener('click', (event) => {
      buyCubeUpgrades(index)
      desktopCubeUpgradeModal(index, cubeUpgrade, event.clientX, event.clientY)
    })
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
    const platonicUpgrade = platonicUpgrades[index] as HTMLImageElement
    const upgradeIndex = index + 1

    if (isMobile) {
      platonicUpgrade.addEventListener('click', () => createPlatonicDescription(upgradeIndex))
      registerPurchasableModal({
        element: platonicUpgrade,
        html: () => platonicUpgradeModalHTML(upgradeIndex, platonicUpgrade.src),
        style: { borderColor: 'orchid' },
        buy: () => {
          buyPlatonicUpgrades(upgradeIndex)
        },
        mobileButtons: [
          {
            action: 'buy',
            label: i18next.t('wowCubes.platonicUpgrades.descriptionBox.buyButton')
          }
        ],
        updateInterval: MEDIUM_MODAL_UPDATE_TICK
      })
    } else {
      platonicUpgrade.addEventListener('mouseover', () => createPlatonicDescription(upgradeIndex))
      platonicUpgrade.addEventListener('click', () => buyPlatonicUpgrades(upgradeIndex))
    }
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
  // Part 1: Displays
  const corruptionDisplays = DOMCacheGetOrSet('corruptionDisplays')
  corruptionDisplays.addEventListener('click', (event) => {
    if (isMobile) {
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('button')) {
        return
      }

      openCorruptionDetailsModal('exit', event, corruptionDisplays)
      return
    }

    corruptionDisplay('exit')
  })
  DOMCacheGetOrSet('corruptionCleanse').addEventListener('click', () => corruptionCleanseConfirm())
  DOMCacheGetOrSet('corruptionCleanseConfirm').addEventListener('click', () => {
    player.corruptions.used.resetCorruptions()
    player.corruptions.next.resetCorruptions()
  })
  DOMCacheGetOrSet('corruptionScoreProgress').addEventListener('click', cycleCorruptionScoreTarget)
  const corruptionScoreTargetButtons = [
    'corruptionTesseracts',
    'corruptionHypercubes',
    'corruptionPlatonicCubes',
    'corruptionHepteracts'
  ] as const
  for (const [index, id] of corruptionScoreTargetButtons.entries()) {
    DOMCacheGetOrSet(id).addEventListener('click', () => selectCorruptionScoreTarget(index))
  }

  // Extra toggle
  DOMCacheGetOrSet('ascensionAutoEnable').addEventListener('click', () => toggleAutoAscendResetActive())
  DOMCacheGetOrSet('ascensionAutoToggle').addEventListener('click', () => toggleAutoAscendResetMode())

  // SETTNGS TAB
  const t = document.querySelectorAll<HTMLElement>('.statsNerds')
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
  DOMCacheGetOrSet('monospaceFont').addEventListener('click', () => toggleMonospaceFont())
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
  DOMCacheGetOrSet('buyofferingpotion').addEventListener('click', () => buyShopUpgrades('offeringPotion'))
  // DOMCacheGetOrSet('offeringPotions').addEventListener('click', () => buyShopUpgrades("offeringPotion"))  //Allow clicking of image to buy also
  DOMCacheGetOrSet('useofferingpotion').addEventListener('click', () => useConsumablePrompt('offeringPotion'))
  DOMCacheGetOrSet('toggle42').addEventListener('click', () => {
    player.autoPotionTimer = 0
  })
  /*Obtainium Potion*/
  DOMCacheGetOrSet('buyobtainiumpotion').addEventListener('click', () => buyShopUpgrades('obtainiumPotion'))
  // DOMCacheGetOrSet('obtainiumPotions').addEventListener('click', () => buyShopUpgrades("obtainiumPotion"))  //Allow clicking of image to buy also
  DOMCacheGetOrSet('useobtainiumpotion').addEventListener('click', () => useConsumablePrompt('obtainiumPotion'))
  DOMCacheGetOrSet('toggle43').addEventListener('click', () => {
    player.autoPotionTimerObtainium = 0
  })
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
    e.preventDefault()

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

  DOMCacheGetOrSet('toggleMaxedGoldenQuarkUpgrades').addEventListener('click', toggleMaxedGoldenQuarkUpgrades)

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

  initializeSingularityPerkTree()
  for (const perk of singularityPerks) {
    const perkHTML = document.createElement('span')
    const perkIconSrc = () => `Pictures/${IconSets[player.iconSet][0]}/perk${perk.ID}.png`
    const unlockSingularity = perk.levels[0]
    const perkName = perk.name()
    perkHTML.innerHTML = `<img src="${perkIconSrc()}" alt="" loading="lazy">`
    perkHTML.id = perk.ID
    perkHTML.classList.add('oldPerk', 'singularityPerkNode')
    if (isMobile) {
      perkHTML.setAttribute('role', 'button')
    }
    perkHTML.setAttribute('tabindex', '0')
    perkHTML.setAttribute(
      'aria-label',
      i18next.t('singularity.perks.treePerkLabel', {
        name: perkName,
        singularity: unlockSingularity
      })
    )
    perkHTML.style.display = 'none' // Ensure the perk is hidden if not unlocked as an anti-spoiler failsafe.
    addSingularityPerkToTree(perkHTML, perk.ID)
    const singularityPerkElement = DOMCacheGetOrSet(perk.ID)
    if (isMobile) {
      singularityPerkElement.addEventListener('click', (event) => {
        Modal(
          () => singularityPerkModalHTML(perk, perkIconSrc()),
          event.clientX,
          event.clientY,
          { borderColor: 'gold' },
          MEDIUM_MODAL_UPDATE_TICK,
          singularityPerkElement
        )
      })
      continue
    }

    singularityPerkElement.addEventListener('mousemove', (event: MouseEvent) => {
      Modal(
        () => singularityPerkModalHTML(perk, perkIconSrc()),
        event.clientX,
        event.clientY,
        { borderColor: 'gold' },
        MEDIUM_MODAL_UPDATE_TICK,
        singularityPerkElement
      )
    })
    singularityPerkElement.addEventListener('focus', () => {
      const perkRect = singularityPerkElement.getBoundingClientRect()
      Modal(
        () => singularityPerkModalHTML(perk, perkIconSrc()),
        perkRect.x,
        perkRect.y + perkRect.height / 2,
        { borderColor: 'gold' },
        MEDIUM_MODAL_UPDATE_TICK,
        singularityPerkElement
      )
    })
    singularityPerkElement.addEventListener('mouseleave', CloseModal)
    singularityPerkElement.addEventListener('blur', CloseModal)
  }

  // Octeract Upgrades
  DOMCacheGetOrSet('toggleMaxedOcteractUpgrades').addEventListener('click', toggleMaxedOcteractUpgrades)

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

    if (isMobile) {
      element.addEventListener('click', (event) => {
        Modal(
          () =>
            `${player.singularityChallenges[key].modalHTML()}${
              modalBuyButtonsHTML([
                {
                  action: 'toggle',
                  label: player.singularityChallenges[key].enabled
                    ? i18next.t('singularityChallenge.modal.exit', { defaultValue: 'Exit EXALT' })
                    : i18next.t('singularityChallenge.modal.enter', { defaultValue: 'Enter EXALT' })
                }
              ])
            }`,
          event.clientX,
          event.clientY,
          { borderColor: 'gold' },
          MEDIUM_MODAL_UPDATE_TICK,
          {
            targetElement: element,
            buttonClick: () => {
              CloseModal()
              void player.singularityChallenges[key].challengeEntryHandler()
            }
          }
        )
      })
      continue
    }

    element.addEventListener('mouseover', () => player.singularityChallenges[key].updateChallengeHTML())
    element.addEventListener('click', () => {
      void player.singularityChallenges[key].challengeEntryHandler()
    })
  }

  // BLUEBERRY UPGRADES
  const blueberryUpgrades = Object.keys(
    ambrosiaUpgrades
  ) as AmbrosiaUpgradeNames[]
  for (const key of blueberryUpgrades) {
    const element = DOMCacheGetOrSet(key)

    registerPurchasableModal({
      element,
      html: () => ambrosiaUpgradeToString(key),
      style: { borderColor: 'blue' },
      buy: (event, action) => buyAmbrosiaUpgradeLevel(key, event, action === 'max'),
      onOpen: () => highlightPrerequisites(key),
      onClose: resetHighlights,
      disabled: isAmbrosiaEditMode
    })

    element.addEventListener('click', (event) => {
      if (!isAmbrosiaEditMode()) return

      resetHighlights()
      beginAmbrosiaEdit(key)
      highlightPrerequisites(key)

      Modal(
        () => ambrosiaEditToString(key),
        event.clientX,
        event.clientY,
        { borderColor: 'orange' },
        MEDIUM_MODAL_UPDATE_TICK,
        {
          targetElement: element,
          buttonClick: (button) => {
            if (ambrosiaEditAction(key, button.dataset.modalAction)) {
              CloseModal()
              resetHighlights()
            }
          }
        }
      )
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
  DOMCacheGetOrSet('blueberryQuickSave').addEventListener('click', () => quickSaveBlueberryTree())

  setAmbrosiaEditMode(false)
  DOMCacheGetOrSet('ambrosiaEditLevels').addEventListener('click', () => {
    CloseModal()
    resetHighlights()
    toggleAmbrosiaEditMode()
  })

  DOMCacheGetOrSet('getBlueberries').addEventListener('click', () => exportBlueberryTree())
  DOMCacheGetOrSet('refundBlueberries').addEventListener('click', () => resetBlueberryTree())
  // Import blueberries
  DOMCacheGetOrSet('importBlueberries').addEventListener('change', (e) => importData(e, importBlueberryTree))

  DOMCacheGetOrSet('importBlueberriesButton').addEventListener('click', () => {
    DOMCacheGetOrSet('importBlueberries').click()
  })

  const currAmbrosiaUpgrades = DOMCacheGetOrSet('showCurrAmbrosiaUpgrades')

  if (isMobile) {
    currAmbrosiaUpgrades.addEventListener('click', function(this: HTMLElement) {
      const toggled = this.toggleAttribute('show-levels')
      if (!toggled) {
        resetLoadoutOnlyDisplay()
        resetRedAmbrosiaDisplay()
      } else {
        displayLevelsBlueberry()
        displayRedAmbrosiaLevels()
      }
    })
  } else {
    currAmbrosiaUpgrades.addEventListener('mouseover', () => {
      displayLevelsBlueberry()
      displayRedAmbrosiaLevels()
    })
    currAmbrosiaUpgrades.addEventListener('mouseout', () => {
      resetLoadoutOnlyDisplay()
      resetRedAmbrosiaDisplay()
    })
  }

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

  // THE PURPLE
  // PURPLE REACTOR
  for (const key of purpleReactorUpgradeNames) {
    const capitalizedName = key.charAt(0).toUpperCase() + key.slice(1)
    registerPurchasableModal({
      element: DOMCacheGetOrSet(`purpleReactor${capitalizedName}`),
      html: () => purpleReactorUpgradeToString(key),
      style: { borderColor: 'purple' },
      buy: (event, action) => buyPurpleReactorUpgradeLevel(key, event, action === 'max')
    })
  }

  const setPurpleReactantPercentage = (
    reactant: 'ambrosia' | 'redAmbrosia',
    percentage: PurpleReactantPercentage
  ) => {
    if (reactant === 'ambrosia') {
      player.purpleReactor.ambrosiaBarPointPercentage = percentage
    } else {
      player.purpleReactor.redAmbrosiaBarPointPercentage = percentage
    }
    visualUpdatePurple()
  }

  for (const percentage of purpleReactantPercentages) {
    DOMCacheGetOrSet(`ambrosiaBarPointPercentage${percentage}`).addEventListener('click', () => {
      setPurpleReactantPercentage('ambrosia', percentage)
    })
    DOMCacheGetOrSet(`redAmbrosiaBarPointPercentage${percentage}`).addEventListener('click', () => {
      setPurpleReactantPercentage('redAmbrosia', percentage)
    })
  }

  // EVENT TAB
  function visitConsumableTab () {
    changeTab(Tabs.Purchase)
    changeSubTab(Tabs.Purchase, { page: 3 })
  }

  document.querySelector('#consumableEvents > .consumableButton')?.addEventListener('click', visitConsumableTab)
  DOMCacheGetOrSet('lotusConsumablesButton').addEventListener('click', visitConsumableTab)
  DOMCacheGetOrSet('lotusConsumablesButtonCollapsed').addEventListener('click', visitConsumableTab)
  DOMCacheGetOrSet('toggleLotusSection').addEventListener('click', toggleLotusSection)

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

  for (const themeNumber of themeValues) {
    DOMCacheGetOrSet(`switchTheme${themeNumber}`).addEventListener('click', () => {
      toggleTheme(false, themeNumber, true)
      if (isMobile) {
        DOMCacheGetOrSet('themeArea').classList.remove('open')
      }
    })
  }

  DOMCacheGetOrSet('saveType').addEventListener('click', async (event) => {
    const element = event.target as HTMLInputElement

    if (!element.checked) {
      storageRemoveItem('copyToClipboard')
      event.stopPropagation()
      return
    }

    event.preventDefault()

    const confirmed = await Confirm(i18next.t('save.saveToClipboard'))

    if (confirmed) {
      element.checked = !element.checked
      storageSetItem('copyToClipboard', '')
    } else {
      storageRemoveItem('copyToClipboard')
    }
  })

  DOMCacheGetOrSet('patchnotes').addEventListener(
    'click',
    openIframeOverlay.bind(null, 'https://changelog.synergism.cc/latest')
  )
  registerIframeOverlayLink('tosLink', termsOfServiceUrl)
  registerIframeOverlayLink('supportTermsLink', termsOfServiceUrl)
  registerIframeOverlayLink('supportPrivacyLink', privacyPolicyUrl)

  // Window
  window.addEventListener('error', imgErrorHandler, { capture: true })
}
