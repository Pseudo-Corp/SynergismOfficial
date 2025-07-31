import { awardUngroupedAchievement } from './Achievements'
import { DOMCacheGetOrSet, DOMCacheHas } from './Cache/DOM'
import { prod } from './Config'
import { pressedKeys } from './Hotkeys'
import { isLoggedIn } from './Login'
import { initializeCart } from './purchases/CartTab'
import { getGQUpgradeEffect } from './singularity'
import { player } from './Synergism'
import {
  setActiveSettingScreen,
  toggleAchievementScreen,
  toggleBuildingScreen,
  toggleChallengesScreen,
  toggleCorruptionLoadoutsStats,
  toggleCubeSubTab,
  toggleRuneScreen,
  toggleSingularityScreen
} from './Toggles'
import { changeTabColor, hideStuff, revealStuff } from './UpdateHTML'
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
    unlocked: boolean
    buttonID?: string
  }[]
}

const subtabInfo: Record<Tabs, SubTab> = {
  [Tabs.Settings]: {
    tabSwitcher: () => setActiveSettingScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: 'settingsubtab', unlocked: true, buttonID: 'switchSettingSubTab1' },
      { subTabID: 'languagesubtab', unlocked: true, buttonID: 'switchSettingSubTab2' },
      { subTabID: 'creditssubtab', unlocked: true, buttonID: 'switchSettingSubTab3' },
      { subTabID: 'statisticsSubTab', unlocked: true, buttonID: 'switchSettingSubTab4' },
      {
        subTabID: 'resetHistorySubTab',
        get unlocked () {
          return player.unlocks.prestige
        },
        buttonID: 'switchSettingSubTab5'
      },
      {
        subTabID: 'ascendHistorySubTab',
        get unlocked () {
          return player.ascensionCount > 0
        },
        buttonID: 'switchSettingSubTab6'
      },
      {
        subTabID: 'singularityHistorySubTab',
        get unlocked () {
          return player.highestSingularityCount > 0
        },
        buttonID: 'switchSettingSubTab7'
      },
      { subTabID: 'hotkeys', unlocked: true, buttonID: 'switchSettingSubTab8' },
      { subTabID: 'accountSubTab', unlocked: true, buttonID: 'switchSettingSubTab9' }
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
      { subTabID: 'coin', unlocked: true, buttonID: 'switchToCoinBuilding' },
      {
        subTabID: 'diamond',
        get unlocked () {
          return player.unlocks.prestige
        },
        buttonID: 'switchToDiamondBuilding'
      },
      {
        subTabID: 'mythos',
        get unlocked () {
          return player.unlocks.transcend
        },
        buttonID: 'switchToMythosBuilding'
      },
      {
        subTabID: 'particle',
        get unlocked () {
          return player.unlocks.reincarnate
        },
        buttonID: 'switchToParticleBuilding'
      },
      {
        subTabID: 'tesseract',
        get unlocked () {
          return player.ascensionCount > 0
        },
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
        get unlocked () {
          return true
        },
        buttonID: 'toggleAchievementSubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return true
        },
        buttonID: 'toggleAchievementSubTab2'
      }
    ],
  },
  [Tabs.Runes]: {
    tabSwitcher: () => toggleRuneScreen,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        get unlocked () {
          return player.unlocks.prestige
        },
        buttonID: 'toggleRuneSubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return player.unlocks.talismans
        },
        buttonID: 'toggleRuneSubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return player.unlocks.blessings
        },
        buttonID: 'toggleRuneSubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.unlocks.spirits
        },
        buttonID: 'toggleRuneSubTab4'
      }
    ]
  },
  [Tabs.Challenges]: {
    tabSwitcher: () => toggleChallengesScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: '1', unlocked: true, buttonID: 'toggleChallengesSubTab1' },
      {
        subTabID: '2',
        get unlocked () {
          return player.highestSingularityCount >= 25
        },
        buttonID: 'toggleChallengesSubTab2'
      }
    ]
  },
  [Tabs.Research]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.AntHill]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.WowCubes]: {
    tabSwitcher: () => toggleCubeSubTab,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        get unlocked () {
          return player.unlocks.ascensions
        },
        buttonID: 'switchCubeSubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return player.unlocks.tesseracts
        },
        buttonID: 'switchCubeSubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return player.unlocks.hypercubes
        },
        buttonID: 'switchCubeSubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.unlocks.platonics
        },
        buttonID: 'switchCubeSubTab4'
      },
      {
        subTabID: '5',
        get unlocked () {
          return player.unlocks.ascensions
        },
        buttonID: 'switchCubeSubTab5'
      },
      {
        subTabID: '6',
        get unlocked () {
          return player.unlocks.platonics
        },
        buttonID: 'switchCubeSubTab6'
      },
      {
        subTabID: '7',
        get unlocked () {
          return player.unlocks.hepteracts
        },
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
        unlocked: true,
        buttonID: 'corrStatsBtn'
      },
      {
        subTabID: 'false',
        unlocked: true,
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
        get unlocked () {
          return player.highestSingularityCount > 0
        },
        buttonID: 'toggleSingularitySubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return player.highestSingularityCount > 0
        },
        buttonID: 'toggleSingularitySubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return Boolean(getGQUpgradeEffect('octeractUnlock'))
        },
        buttonID: 'toggleSingularitySubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.highestSingularityCount >= 25
        },
        buttonID: 'toggleSingularitySubTab4'
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
        get unlocked () {
          return isLoggedIn() || !prod
        },
        buttonID: 'cartSubTab1'
      },
      {
        subTabID: 'subscriptionContainer',
        get unlocked () {
          return isLoggedIn() || !prod
        },
        buttonID: 'cartSubTab2'
      },
      {
        subTabID: 'upgradesContainer',
        unlocked: true,
        buttonID: 'cartSubTab3'
      },
      {
        subTabID: 'consumablesSection',
        unlocked: true,
        buttonID: 'cartSubTab4'
      },
      {
        subTabID: 'cartContainer',
        get unlocked () {
          return isLoggedIn() || !prod
        },
        buttonID: 'cartSubTab5'
      },
      {
        subTabID: 'merchContainer',
        unlocked: true,
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
  i18n?: string
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
    if (options.i18n) {
      this.setAttribute('i18n', options.i18n)
    }
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
    //.setUnlockedState(() => player.unlocks.prestige)
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

/**
 * @param step 1 to go forward; -1 to go back
 * @param changeSubtab true to change the subtab, false to change the main tabs
 */
export const keyboardTabChange = (step: 1 | -1 = 1, changeSubtab = false) => {
  let tab = step === 1 ? tabRow.getNextTab() : tabRow.getPreviousTab()

  while (!tab?.isUnlocked()) {
    tab = step === 1 ? tabRow.getNextTab(tab) : tabRow.getPreviousTab(tab)
  }

  if (changeSubtab) {
    changeSubTab(tab.getType(), { step })
  } else {
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
  ;(document.activeElement as HTMLElement | null)?.blur()

  const subTabList = subtabInfo[G.currentTab].subTabList
  for (let i = 0; i < subTabList.length; i++) {
    const id = subTabList[i].buttonID
    if (id && DOMCacheHas(id)) {
      const button = DOMCacheGetOrSet(id)

      if (button.classList.contains('active-subtab')) {
        subtabInfo[tabRow.getCurrentTab().getType()].subtabIndex = i
        break
      }
    }
  }
}

export const changeSubTab = (tabs: Tabs, { page, step }: SubTabSwitchOptions) => {
  let tab = tabRow.getCurrentTab()

  if (tab.getType() !== tabs) {
    changeTab(tab.getType())
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

  while (!subTabList.unlocked) {
    subtabInfo[tab.getType()].subtabIndex = limitRange(
      subtabInfo[tab.getType()].subtabIndex + (step ?? 1),
      0,
      subTabs.subTabList.length - 1
    )
    subTabList = subTabs.subTabList[subtabInfo[tab.getType()].subtabIndex]
  }

  if (subTabList.unlocked) {
    for (const subtab of subTabs.subTabList) {
      if (!subtab.buttonID) continue

      const element = DOMCacheGetOrSet(subtab.buttonID)

      if (subtab === subTabList) {
        element.classList.add('active-subtab')
      } else {
        element.classList.remove('active-subtab')
      }
    }

    subTabs.tabSwitcher?.()(subTabList.subTabID)
    if (tab.getType() === Tabs.Singularity && page === 3) {
      if (player.singularityChallenges.noSingularityUpgrades.completions > 0) {
        player.visitedAmbrosiaSubtab = true
      }

      if (player.singularityChallenges.noAmbrosiaUpgrades.completions > 0) {
        player.visitedAmbrosiaSubtabRed = true
      }
    }
  }
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
