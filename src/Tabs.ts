import i18next from 'i18next'
import { awardUngroupedAchievement } from './Achievements'
import { DOMCacheGetOrSet, DOMCacheHas } from './Cache/DOM'
import { platform } from './Config'
import { pressedKeys } from './Hotkeys'
import { hasUnreadMessages } from './Messages'
import { initializeCart } from './purchases/CartTab'
import { getGQUpgradeEffect } from './singularity'
import { player } from './Synergism'
import {
  setActiveSettingScreen,
  toggleAchievementScreen,
  toggleAntsSubtab,
  toggleBuildingScreen,
  toggleChallengesScreen,
  toggleCorruptionLoadoutsStats,
  toggleCubeSubTab,
  toggleRuneScreen,
  toggleSingularityScreen
} from './Toggles'
import { changeTabColor, CloseModal, hideStuff, revealStuff } from './UpdateHTML'
import { assert, limitRange } from './Utility'
import { Globals as G } from './Variables'

export enum Tabs {
  Buildings = 0,
  Upgrades = 1,
  Achievements = 2,
  Runes = 3,
  Challenges = 4,
  Research = 5,
  AntHill = 6,
  WowCubes = 7,
  Campaign = 8,
  Corruption = 9,
  Singularity = 10,
  Settings = 11,
  Shop = 12,
  Event = 13,
  Purchase = 14
}

/**
 * If step is provided, move the page back/forward {step} pages.
 * If page is provided, change the subtab to {page}
 */
type SubTabSwitchOptions = { step: number; page?: undefined } | { page: number; step?: undefined }

interface SubTab {
  tabSwitcher?: () => (id: string) => unknown
  subtabIndex: number
  subTabList: {
    subTabID: string
    unlocked: () => boolean
    buttonID: string
  }[]
}

const subtabInfo: Record<Tabs, SubTab> = {
  [Tabs.Settings]: {
    tabSwitcher: () => setActiveSettingScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: 'settingsubtab', unlocked: () => true, buttonID: 'switchSettingSubTab1' },
      { subTabID: 'languagesubtab', unlocked: () => true, buttonID: 'switchSettingSubTab2' },
      { subTabID: 'creditssubtab', unlocked: () => true, buttonID: 'switchSettingSubTab3' },
      { subTabID: 'statisticsSubTab', unlocked: () => true, buttonID: 'switchSettingSubTab4' },
      {
        subTabID: 'resetHistorySubTab',
        unlocked: () => player.unlocks.prestige,
        buttonID: 'switchSettingSubTab5'
      },
      {
        subTabID: 'ascendHistorySubTab',
        unlocked: () => player.ascensionCount > 0,
        buttonID: 'switchSettingSubTab6'
      },
      {
        subTabID: 'singularityHistorySubTab',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'switchSettingSubTab7'
      },
      { subTabID: 'hotkeys', unlocked: () => true, buttonID: 'switchSettingSubTab8' },
      { subTabID: 'accountSubTab', unlocked: () => true, buttonID: 'switchSettingSubTab9' },
      {
        subTabID: 'messagesSubTab',
        unlocked: hasUnreadMessages,
        buttonID: 'switchSettingSubTab10'
      }
    ]
  },
  [Tabs.Shop]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Buildings]: {
    tabSwitcher: () => toggleBuildingScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: 'coin', unlocked: () => true, buttonID: 'switchToCoinBuilding' },
      {
        subTabID: 'diamond',
        unlocked: () => player.unlocks.prestige,
        buttonID: 'switchToDiamondBuilding'
      },
      {
        subTabID: 'mythos',
        unlocked: () => player.unlocks.transcend,
        buttonID: 'switchToMythosBuilding'
      },
      {
        subTabID: 'particle',
        unlocked: () => player.unlocks.reincarnate,
        buttonID: 'switchToParticleBuilding'
      },
      {
        subTabID: 'tesseract',
        unlocked: () => player.ascensionCount > 0,
        buttonID: 'switchToTesseractBuilding'
      }
    ]
  },
  [Tabs.Upgrades]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Achievements]: {
    tabSwitcher: () => toggleAchievementScreen,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => true,
        buttonID: 'toggleAchievementSubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => true,
        buttonID: 'toggleAchievementSubTab2'
      }
    ]
  },
  [Tabs.Runes]: {
    tabSwitcher: () => toggleRuneScreen,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => player.unlocks.prestige,
        buttonID: 'toggleRuneSubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => player.unlocks.talismans,
        buttonID: 'toggleRuneSubTab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.unlocks.blessings,
        buttonID: 'toggleRuneSubTab3'
      },
      {
        subTabID: '4',
        unlocked: () => player.unlocks.spirits,
        buttonID: 'toggleRuneSubTab4'
      }
    ]
  },
  [Tabs.Challenges]: {
    tabSwitcher: () => toggleChallengesScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: '1', unlocked: () => true, buttonID: 'toggleChallengesSubTab1' },
      {
        subTabID: '2',
        unlocked: () => player.highestSingularityCount >= 25,
        buttonID: 'toggleChallengesSubTab2'
      }
    ]
  },
  [Tabs.Research]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.AntHill]: {
    tabSwitcher: () => toggleAntsSubtab,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => true,
        buttonID: 'toggleAntSubtab1'
      },
      {
        subTabID: '2',
        unlocked: () => true,
        buttonID: 'toggleAntSubtab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.ants.antSacrificeCount > 0,
        buttonID: 'toggleAntSubtab3'
      }
    ]
  },
  [Tabs.WowCubes]: {
    tabSwitcher: () => toggleCubeSubTab,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => player.unlocks.ascensions,
        buttonID: 'switchCubeSubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => player.unlocks.tesseracts,
        buttonID: 'switchCubeSubTab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.unlocks.hypercubes,
        buttonID: 'switchCubeSubTab3'
      },
      {
        subTabID: '4',
        unlocked: () => player.unlocks.platonics,
        buttonID: 'switchCubeSubTab4'
      },
      {
        subTabID: '5',
        unlocked: () => player.unlocks.ascensions,
        buttonID: 'switchCubeSubTab5'
      },
      {
        subTabID: '6',
        unlocked: () => player.unlocks.platonics,
        buttonID: 'switchCubeSubTab6'
      },
      {
        subTabID: '7',
        unlocked: () => player.unlocks.hepteracts,
        buttonID: 'switchCubeSubTab7'
      }
    ]
  },
  [Tabs.Campaign]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Corruption]: {
    tabSwitcher: () => toggleCorruptionLoadoutsStats,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: 'true',
        unlocked: () => true,
        buttonID: 'corrStatsBtn'
      },
      {
        subTabID: 'false',
        unlocked: () => true,
        buttonID: 'corrLoadoutsBtn'
      }
    ]
  },
  [Tabs.Singularity]: {
    tabSwitcher: () => toggleSingularityScreen,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'toggleSingularitySubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'toggleSingularitySubTab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'toggleSingularitySubTab3'
      },
      {
        subTabID: '4',
        unlocked: () => Boolean(getGQUpgradeEffect('octeractUnlock')),
        buttonID: 'toggleSingularitySubTab4'
      },
      {
        subTabID: '5',
        unlocked: () => player.highestSingularityCount >= 25,
        buttonID: 'toggleSingularitySubTab5'
      }
    ]
  },
  [Tabs.Event]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Purchase]: {
    tabSwitcher: () => initializeCart,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: 'productContainer',
        unlocked: () => true,
        buttonID: 'cartSubTab1'
      },
      {
        subTabID: 'subscriptionContainer',
        unlocked: () => platform !== 'steam',
        buttonID: 'cartSubTab2'
      },
      {
        subTabID: 'upgradesContainer',
        unlocked: () => true,
        buttonID: 'cartSubTab3'
      },
      {
        subTabID: 'consumablesSection',
        unlocked: () => true,
        buttonID: 'cartSubTab4'
      },
      {
        subTabID: 'cartContainer',
        unlocked: () => true,
        buttonID: 'cartSubTab5'
      },
      {
        subTabID: 'merchContainer',
        unlocked: () => platform === 'browser', // Steam disallows purchases outside of the Steam ecosystem
        buttonID: 'cartSubTab6'
      }
    ]
  }
}

class TabRow extends HTMLDivElement {
  #list: $Tab[] = []
  #currentTab!: $Tab

  constructor () {
    super()

    this.id = 'tabrow'
    this.style.cssText = `
      text-align: center;
      width: 100%;
      list-style: none;
      margin: 0;
      margin-inline: unset;
      margin-block: unset;
      padding-inline: unset;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0 5px;
    `
  }

  getSubs () {
    return this.#list
  }

  appendButton (...elements: $Tab[]) {
    for (const element of elements) {
      this.#list.push(element)
      this.appendChild(element)
    }

    this.#currentTab = this.#list[0]
    this.#createDrag()
  }

  getCurrentTab (): $Tab {
    return this.#currentTab
  }

  setNextTab () {
    const index = this.#list.indexOf(this.#currentTab)

    this.#currentTab = this.#list[index + 1] ?? this.#list[0]
    changeSubTab(this.#currentTab.getType(), { page: subtabInfo[this.#currentTab.getType()].subtabIndex })
    return this.#currentTab
  }

  setPreviousTab () {
    const index = this.#list.indexOf(this.#currentTab)

    this.#currentTab = this.#list[index - 1] ?? this.#list[this.#list.length - 1]
    changeSubTab(this.#currentTab.getType(), { page: subtabInfo[this.#currentTab.getType()].subtabIndex })
    return this.#currentTab
  }

  getNextTab (tab = this.#currentTab) {
    const index = this.#list.indexOf(tab)

    return this.#list[index + 1] ?? this.#list[0]
  }

  getPreviousTab (tab = this.#currentTab) {
    const index = this.#list.indexOf(tab)

    return this.#list[index - 1] ?? this.#list[this.#list.length - 1]
  }

  reappend () {
    this.replaceChildren()

    for (const item of this.#list) {
      this.appendChild(item)
    }

    this.#list.forEach((el) => el.resetHidden())
  }

  #createDrag () {
    let dragSrcEl: HTMLElement | null = null

    const handleDragStart = (e: DragEvent) => {
      assert(e.target instanceof HTMLElement)

      e.target.style.opacity = '0.4'

      dragSrcEl = e.target

      e.dataTransfer!.effectAllowed = 'move'
    }

    const handleDragEnter = (e: DragEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add('over')
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.remove('over')
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.stopPropagation()

      if (dragSrcEl !== e.target && dragSrcEl !== null) {
        this.insertBefore(dragSrcEl, e.target as HTMLElement)

        const dragIndex = this.#list.indexOf(dragSrcEl as $Tab)
        const targetIndex = this.#list.indexOf(e.target as $Tab)

        this.#list.splice(targetIndex, 0, this.#list[dragIndex])
        this.#list.splice(this.#list.indexOf(dragSrcEl as $Tab, dragIndex), 1)
      }

      return false
    }

    const handleDragEnd = (e: DragEvent) => {
      assert(e.target instanceof HTMLElement)
      e.target.style.opacity = '1'

      this.#list.forEach((item) => {
        item.classList.remove('over')
      })
    }

    this.#list.forEach((item) => {
      item.addEventListener('dragstart', handleDragStart, false)
      item.addEventListener('dragenter', handleDragEnter, false)
      item.addEventListener('dragover', handleDrop, false)
      item.addEventListener('dragleave', handleDragLeave, false)
      item.addEventListener('drop', handleDrop, false)
      item.addEventListener('dragend', handleDragEnd, false)
    })
  }
}

interface kSubTabOptionsBag {
  id: string
  class?: string
  i18n: string
  borderColor?: string
}

class $Tab extends HTMLButtonElement {
  #unlocked = () => true
  #type!: Tabs
  #removeable = false
  #hidden = false

  constructor (options: kSubTabOptionsBag) {
    super()

    this.id = options.id
    if (options.class) {
      this.classList.add(options.class)
    }

    this.setAttribute('i18n', options.i18n)

    if (options.borderColor) {
      this.style.borderColor = options.borderColor
    }

    this.addEventListener('click', () => {
      if (this.#removeable && pressedKeys.has('ControlLeft') && pressedKeys.has('KeyX')) {
        // When clicking on a tab while holding CTRL + X
        if (G.currentTab !== this.#type) {
          tabRow.removeChild(this)
          this.#hidden = true
        }
      } else {
        changeTab(this.#type)
        changeTabColor()
      }
    })
  }

  setUnlockedState (fn: () => boolean) {
    this.#unlocked = fn
    return this
  }

  isUnlocked () {
    return this.#unlocked() && !this.#hidden
  }

  setType (type: Tabs) {
    this.#type = type
    return this
  }

  getType () {
    return this.#type!
  }

  getSubTabs () {
    return subtabInfo[this.#type]
  }

  makeDraggable () {
    this.setAttribute('draggable', 'true')
    return this
  }

  makeRemoveable () {
    this.#removeable = true
    return this
  }

  resetHidden () {
    this.#hidden = false
  }
}

customElements.define('tab-row', TabRow, { extends: 'div' })
customElements.define('sub-tab', $Tab, { extends: 'button' })

export const tabRow = new TabRow()
document.getElementsByClassName('navbar').item(0)?.appendChild(tabRow)

tabRow.appendButton(
  new $Tab({ id: 'buildingstab', i18n: 'tabs.main.buildings' })
    .setType(Tabs.Buildings)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'upgradestab', i18n: 'tabs.main.upgrades' })
    .setType(Tabs.Upgrades)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ /*class: 'prestigeunlock',*/ id: 'achievementstab', i18n: 'tabs.main.achievements' })
    // .setUnlockedState(() => player.unlocks.prestige)
    .setType(Tabs.Achievements)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'prestigeunlock', id: 'runestab', i18n: 'tabs.main.runes' })
    .setUnlockedState(() => player.unlocks.prestige)
    .setType(Tabs.Runes)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'transcendunlock', id: 'challengetab', i18n: 'tabs.main.challenges' })
    .setUnlockedState(() => player.unlocks.transcend)
    .setType(Tabs.Challenges)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'reincarnationunlock', id: 'researchtab', i18n: 'tabs.main.research' })
    .setUnlockedState(() => player.unlocks.reincarnate)
    .setType(Tabs.Research)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal8', id: 'anttab', i18n: 'tabs.main.antHill' })
    .setUnlockedState(() => player.unlocks.anthill)
    .setType(Tabs.AntHill)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal10', id: 'cubetab', i18n: 'tabs.main.wowCubes' })
    .setUnlockedState(() => player.unlocks.ascensions)
    .setType(Tabs.WowCubes)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal11', id: 'campaigntab', i18n: 'tabs.main.campaign' })
    .setUnlockedState(() => player.challengecompletions[11] > 0)
    .setType(Tabs.Campaign)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal11', id: 'traitstab', i18n: 'tabs.main.corruption' })
    .setUnlockedState(() => (player.challengecompletions[11] > 0))
    .setType(Tabs.Corruption)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'singularity', id: 'singularitytab', i18n: 'tabs.main.singularity' })
    .setUnlockedState(() => player.highestSingularityCount > 0)
    .setType(Tabs.Singularity)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'settingstab', i18n: 'tabs.main.settings' })
    .setType(Tabs.Settings)
    .makeDraggable(),
  new $Tab({ class: 'reincarnationunlock', id: 'shoptab', i18n: 'tabs.main.shop' })
    .setUnlockedState(() => player.unlocks.reincarnate || player.highestSingularityCount > 0)
    .setType(Tabs.Shop)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'isEvent', id: 'eventtab', i18n: 'tabs.main.unsmith' })
    .setType(Tabs.Event)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'pseudoCoinstab', i18n: 'tabs.main.purchase' })
    .setType(Tabs.Purchase)
    .makeDraggable()
)

// Mobile menu toggle functionality
const mobileMenuToggle = DOMCacheGetOrSet('mobileMenuToggle')
const navbar = document.querySelector('.navbar')

const toggleMobileMenu = () => {
  const isOpen = navbar?.classList.toggle('menu-open')
  mobileMenuToggle.classList.toggle('menu-open', isOpen)
  mobileMenuToggle.setAttribute('aria-expanded', String(isOpen))
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu)

// Close mobile menu when a tab is clicked
tabRow.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'BUTTON' && navbar?.classList.contains('menu-open')) {
    toggleMobileMenu()
  }
})

/**
 * @param step 1 to go forward; -1 to go back
 * @param changeSubtab true to change the subtab, false to change the main tabs
 */
export const keyboardTabChange = (step: 1 | -1 = 1, changeSubtab = false) => {
  if (changeSubtab) {
    // When changing subtabs, use the current tab instead of calculating next/previous
    changeSubTab(tabRow.getCurrentTab().getType(), { step })
  } else {
    let tab = step === 1 ? tabRow.getNextTab() : tabRow.getPreviousTab()

    while (!tab?.isUnlocked()) {
      tab = step === 1 ? tabRow.getNextTab(tab) : tabRow.getPreviousTab(tab)
    }

    changeTab(tab.getType(), step)
    changeTabColor()
  }
}

export const changeTab = (tabs: Tabs, step?: number) => {
  if (step === 1) {
    tabRow.setNextTab()
  } else if (step === -1) {
    tabRow.setPreviousTab()
  } else {
    while (tabRow.getCurrentTab().getType() !== tabs) {
      tabRow.setNextTab()
    }
  }

  while (!tabRow.getCurrentTab().isUnlocked()) {
    if (step === 1 || step === undefined) {
      tabRow.setNextTab()
    } else {
      tabRow.setPreviousTab()
    }
  }

  G.currentTab = tabRow.getCurrentTab().getType()
  subtabInfo[tabRow.getCurrentTab().getType()].subtabIndex

  if (G.currentTab === Tabs.Achievements) {
    awardUngroupedAchievement('participationTrophy')
  }

  revealStuff()
  hideStuff()
  CloseModal()
  ;(document.activeElement as HTMLElement | null)?.blur()

  const subTabList = subtabInfo[G.currentTab].subTabList
  for (let i = 0; i < subTabList.length; i++) {
    const id = subTabList[i].buttonID
    if (DOMCacheHas(id)) {
      const button = DOMCacheGetOrSet(id)

      if (!subTabList[i].unlocked()) {
        button.classList.add('none')
      } else {
        button.classList.remove('none')
      }

      if (button.classList.contains('active-subtab')) {
        subtabInfo[tabRow.getCurrentTab().getType()].subtabIndex = i
      }
    }
  }

  if (platform === 'steam') {
    import('./steam/discord').then(({ setRichPresenceDiscord }) => {
      const i18n = tabRow.getCurrentTab().getAttribute('i18n')
      setRichPresenceDiscord({
        details: 'Playing Synergism',
        state: `Looking at ${i18next.t(i18n!)}...`,
        startTimestamp: new Date()
      })
    })
  }
}

export const changeSubTab = (tabs: Tabs, { page, step }: SubTabSwitchOptions) => {
  let tab = tabRow.getCurrentTab()

  if (tab.getType() !== tabs) {
    changeTab(tabs)
    tab = tabRow.getCurrentTab()
  }

  const subTabs = tab.getSubTabs()

  if (!tab.isUnlocked() || subTabs.subTabList.length === 0) {
    return
  }

  if (page !== undefined) {
    subtabInfo[tab.getType()].subtabIndex = limitRange(page, 0, subTabs.subTabList.length - 1)
  } else {
    subtabInfo[tab.getType()].subtabIndex = limitRange(
      subtabInfo[tab.getType()].subtabIndex + step,
      0,
      subTabs.subTabList.length - 1
    )
  }

  let subTabList = subTabs.subTabList[subtabInfo[tab.getType()].subtabIndex]

  while (!subTabList.unlocked()) {
    subtabInfo[tab.getType()].subtabIndex = limitRange(
      subtabInfo[tab.getType()].subtabIndex + (step ?? 1),
      0,
      subTabs.subTabList.length - 1
    )
    subTabList = subTabs.subTabList[subtabInfo[tab.getType()].subtabIndex]
  }

  if (subTabList.unlocked()) {
    for (const subtab of subTabs.subTabList) {
      const element = DOMCacheGetOrSet(subtab.buttonID)

      if (subtab === subTabList) {
        element.classList.add('active-subtab')
      } else {
        element.classList.remove('active-subtab')
      }
    }

    subTabs.tabSwitcher?.()(subTabList.subTabID)
    if (tab.getType() === Tabs.Singularity && page === 4) {
      if (player.singularityChallenges.noSingularityUpgrades.completions > 0) {
        player.visitedAmbrosiaSubtab = true
      }

      if (player.singularityChallenges.noAmbrosiaUpgrades.completions > 0) {
        player.visitedAmbrosiaSubtabRed = true
      }
    }
  }

  CloseModal()
}

export function subTabsInMainTab (name: Tabs) {
  let tab = tabRow.getCurrentTab()

  while (tab.getType() !== name) {
    tab = tabRow.setNextTab()
  }

  return tab.getSubTabs().subTabList.length
}

export function getActiveSubTab () {
  return subtabInfo[tabRow.getCurrentTab().getType()].subtabIndex
}

export function getActiveTab () {
  return tabRow.getCurrentTab().getType()
}
