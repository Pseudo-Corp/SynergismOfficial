import { DOMCacheGetOrSet } from './Cache/DOM'
import { pressedKeys } from './Hotkeys'
import { player } from './Synergism'
import {
  setActiveSettingScreen,
  toggleBuildingScreen,
  toggleCorruptionLoadoutsStats,
  toggleChallengesScreen,
  toggleCubeSubTab,
  toggleRuneScreen,
  toggleSingularityScreen
} from './Toggles'
import { changeTabColor, hideStuff, revealStuff } from './UpdateHTML'
import { assert, limitRange } from './Utility'
import { Globals as G } from './Variables'
import { displayStats } from './Statistics'

export enum Tabs {
  Buildings = 0,
  Upgrades = 1,
  Achievements = 2,
  Runes = 3,
  Challenges = 4,
  Research = 5,
  AntHill = 6,
  WowCubes = 7,
  Corruption = 8,
  Singularity = 9,
  Settings = 10,
  Shop = 11,
  Event = 12
}

/**
 * If step is provided, move the page back/forward {step} pages.
 * If page is provided, change the subtab to {page}
 */
type SubTabSwitchOptions = { step: number; page?: undefined } | { page: number; step?: undefined }

interface SubTab {
  tabSwitcher?: () => (id: string) => unknown
  subTabDisplay?: 'block' | 'flex'
  subTabList: {
    subTabID: string
    unlocked: boolean
    buttonID: string
  }[]
}

const subtabInfo: Record<Tabs, SubTab> = {
  [Tabs.Settings]: {
    tabSwitcher: () => setActiveSettingScreen,
    subTabDisplay: 'flex',
    subTabList: [
      {
        subTabID: 'settingsubtab',
        unlocked: true,
        buttonID: 'switchSettingSubTab1'
      },
      {
        subTabID: 'languagesubtab',
        unlocked: true,
        buttonID: 'switchSettingSubTab2'
      },
      {
        subTabID: 'creditssubtab',
        unlocked: true,
        buttonID: 'switchSettingSubTab3'
      },
      {
        subTabID: 'statisticsSubTab',
        unlocked: true,
        buttonID: 'switchSettingSubTab4'
      },
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
      {
        subTabID: 'hotkeys', 
        unlocked: true, 
        buttonID: 'switchSettingSubTab8'
      },
      {
        subTabID: 'accountSubTab', 
        unlocked: true, 
        buttonID: 'switchSettingSubTab9'
      }
    ]
  },
  [Tabs.Shop]: { subTabList: [] },
  [Tabs.Buildings]: {
    tabSwitcher: () => toggleBuildingScreen,
    subTabDisplay: 'flex',
    subTabList: [
      {
        subTabID: 'coinBuildings',
        unlocked: true,
        buttonID: 'switchToCoinBuilding'
      },
      {
        subTabID: 'prestige',
        get unlocked () {
          return player.unlocks.prestige
        },
        buttonID: 'switchToDiamondBuilding'
      },
      {
        subTabID: 'transcension',
        get unlocked () {
          return player.unlocks.transcend
        },
        buttonID: 'switchToMythosBuilding'
      },
      {
        subTabID: 'reincarnation',
        get unlocked () {
          return player.unlocks.reincarnate
        },
        buttonID: 'switchToParticleBuilding'
      },
      {
        subTabID: 'ascension',
        get unlocked () {
          return player.achievements[183] > 0
        },
        buttonID: 'switchToTesseractBuilding'
      }
    ]
  },
  [Tabs.Upgrades]: { subTabList: [] },
  [Tabs.Achievements]: { subTabList: [] },
  [Tabs.Runes]: {
    tabSwitcher: () => toggleRuneScreen,
    subTabDisplay: 'flex',
    subTabList: [
      {
        subTabID: 'runeContainer1',
        get unlocked () {
          return player.unlocks.prestige
        },
        buttonID: 'toggleRuneSubTab1'
      },
      {
        subTabID: 'runeContainer2',
        get unlocked () {
          return player.achievements[134] > 0
        },
        buttonID: 'toggleRuneSubTab2'
      },
      {
        subTabID: 'runeContainer3',
        get unlocked () {
          return player.achievements[134] > 0
        },
        buttonID: 'toggleRuneSubTab3'
      },
      {
        subTabID: 'runeContainer4',
        get unlocked () {
          return player.achievements[204] > 0
        },
        buttonID: 'toggleRuneSubTab4'
      }
    ]
  },
  [Tabs.Challenges]: {
    tabSwitcher: () => toggleChallengesScreen,
    subTabDisplay: 'block',
    subTabList: [
      {
        subTabID: 'challengesWrapper1',
        unlocked: true,
        buttonID: 'toggleChallengesSubTab1'
      },
      {
        subTabID: 'challengesWrapper2',
        get unlocked () {
          return player.highestSingularityCount >= 25
        },
        buttonID: 'toggleChallengesSubTab2'
      },
    ]
  },
  [Tabs.Research]: { subTabList: [] },
  [Tabs.AntHill]: { subTabList: [] },
  [Tabs.WowCubes]: {
    tabSwitcher: () => toggleCubeSubTab,
    subTabDisplay: 'flex',
    subTabList: [
      {
        subTabID: 'cubeTab1',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'switchCubeSubTab1'
      },
      {
        subTabID: 'cubeTab2',
        get unlocked () {
          return player.achievements[197] > 0
        },
        buttonID: 'switchCubeSubTab2'
      },
      {
        subTabID: 'cubeTab3',
        get unlocked () {
          return player.achievements[211] > 0
        },
        buttonID: 'switchCubeSubTab3'
      },
      {
        subTabID: 'cubeTab4',
        get unlocked () {
          return player.achievements[218] > 0
        },
        buttonID: 'switchCubeSubTab4'
      },
      {
        subTabID: 'cubeTab5',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'switchCubeSubTab5'
      },
      {
        subTabID: 'cubeTab6',
        get unlocked () {
          return player.achievements[218] > 0
        },
        buttonID: 'switchCubeSubTab6'
      },
      {
        subTabID: 'cubeTab7',
        get unlocked () {
          return player.challenge15Exponent >= 1e15
        },
        buttonID: 'switchCubeSubTab7'
      }
    ]
  },
  [Tabs.Corruption]: {
    tabSwitcher: () => toggleCorruptionLoadoutsStats,
    subTabDisplay: 'flex',
    subTabList: [
      {
        subTabID: 'corruptionStats',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'corrStatsBtn'
      },
      {
        subTabID: 'corruptionLoadouts',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'corrLoadoutsBtn'
      }
    ]
  },
  [Tabs.Singularity]: {
    tabSwitcher: () => toggleSingularityScreen,
    subTabDisplay: 'block',
    subTabList: [
      {
        subTabID: 'singularityContainerShop',
        get unlocked () {
          return player.highestSingularityCount > 0
        },
        buttonID: 'toggleSingularitySubTabShop'
      },
      {
        subTabID: 'singularityContainerPerks',
        get unlocked () {
          return player.highestSingularityCount > 0
        },
        buttonID: 'toggleSingularitySubTabPerks'
      },
      {
        subTabID: 'singularityContainerOcteracts',
        get unlocked () {
          return Boolean(player.singularityUpgrades.octeractUnlock.getEffect().bonus)
        },
        buttonID: 'toggleSingularitySubTabOcteracts'
      },
      {
        subTabID: 'singularityContainerAmbrosia',
        get unlocked () {
          return player.singularityChallenges.noSingularityUpgrades.completions >= 1
        },
        buttonID: 'toggleSingularitySubTabAmbrosia'
      }
    ]
  },
  [Tabs.Event]: { subTabList: [] }
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
      justify-content: center;
      gap: 0 5px;
    `

    document.getElementsByClassName('navbar').item(0)?.appendChild(this)
  }

  getSubs () {
    return this.#list
  }

  getTab(tab: Tabs) {
    return this.#list[tab]
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
    return this.#currentTab
  }

  setPreviousTab () {
    const index = this.#list.indexOf(this.#currentTab)

    this.#currentTab = this.#list[index - 1] ?? this.#list[this.#list.length - 1]
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

tabRow.appendButton(
  new $Tab({ id: 'buildingstab', i18n: 'tabs.main.buildings' })
    .setType(Tabs.Buildings)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'upgradestab', i18n: 'tabs.main.upgrades' })
    .setType(Tabs.Upgrades)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'achievementstab', i18n: 'tabs.main.achievements', class: 'coinunlock4' })
    .setUnlockedState(() => player.unlocks.coinfour)
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
    .setUnlockedState(() => player.achievements[127] > 0)
    .setType(Tabs.AntHill)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal10', id: 'cubetab', i18n: 'tabs.main.wowCubes' })
    .setUnlockedState(() => player.achievements[141] > 0)
    .setType(Tabs.WowCubes)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal11', id: 'traitstab', i18n: 'tabs.main.corruption' })
    .setUnlockedState(() => player.challengecompletions[11] > 0)
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
    .setUnlockedState(() => G.isEvent)
    .setType(Tabs.Event)
    .makeDraggable()
    .makeRemoveable()
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

  // Updates the state of a subtab
  player.subtabNumber = getShowSubTab(tabRow.getCurrentTab())
  const subTabs = tabRow.getCurrentTab().getSubTabs()
  updateSubTab(subTabs, player.subtabNumber)
  subTabs.tabSwitcher?.()(subTabs.subTabList[player.subtabNumber].subTabID)

  revealStuff()
  hideStuff()
    ; (document.activeElement as HTMLElement | null)?.blur()
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
    player.subtabNumber = limitRange(page, 0, subTabs.subTabList.length - 1)
  } else {
    player.subtabNumber = limitRange(player.subtabNumber + step, 0, subTabs.subTabList.length - 1)
  }

  let subTabList = subTabs.subTabList[player.subtabNumber]

  if (step !== undefined) {
    while (!subTabList.unlocked) {
      assert(page === undefined)
      player.subtabNumber = limitRange(player.subtabNumber + step, 0, subTabs.subTabList.length - 1)
      subTabList = subTabs.subTabList[player.subtabNumber]
    }
  }

  if (subTabList.unlocked) {
    updateSubTab(subTabs, player.subtabNumber)

    subTabs.tabSwitcher?.()(subTabList.subTabID)
  }
}

export function subTabsInMainTab (name: Tabs) {
  let tab = tabRow.getCurrentTab()

  while (tab.getType() !== name) {
    tab = tabRow.setNextTab()
  }

  return tab.getSubTabs().subTabList.length
}

// Find the buttonActive class on the subtab element to get the open tab number
export function getShowSubTab(tab: $Tab) {
  let subtabNumber = 0
  const tabUnlocked = tab.isUnlocked()

  const subTabList = tab.getSubTabs().subTabList
  for (let i = 0; i < subTabList.length; i++) {
    const subTab = subTabList[i]
    const buttonEl = DOMCacheGetOrSet(subTab.buttonID)
    if (buttonEl.classList.contains('buttonActive')) {
      if (subtabNumber === 0 && tabUnlocked && subTab.unlocked) {
        subtabNumber = i
      } else {
        buttonEl.classList.remove('buttonActive')
      }
    }
  }

  return subtabNumber
}

// Update the display state of the subtabs
export function updateSubTab(subTabs: SubTab, subtabNumber: number) {
  const subTabList = subTabs.subTabList
  for (let i = 0; i < subTabList.length; i++) {
    const subTab = subTabList[i]
    const buttonEl = DOMCacheGetOrSet(subTab.buttonID)
    buttonEl.classList.toggle('buttonActive', i === subtabNumber)

    const subtabEl = DOMCacheGetOrSet(subTab.subTabID)
    subtabEl.classList.toggle('subtabActive', i === subtabNumber)
    if (subTabs.subTabDisplay) {
      subtabEl.style.display = i === subtabNumber ? subTabs.subTabDisplay : 'none'
    }
  }
}

// Checks all subtabs and resets them if they are locked
export const resetSubTabs = () => {
  tabRow.getSubs().forEach((tab) => {
    const subTabs = tab.getSubTabs()
    const resetSubtabNumber = getShowSubTab(tab)
    updateSubTab(subTabs, resetSubtabNumber)
    subTabs.tabSwitcher?.()(subTabs.subTabList[resetSubtabNumber].subTabID)
  })
  player.subtabNumber = getShowSubTab(tabRow.getCurrentTab())

  // Stats for Nerds
  document.querySelectorAll<HTMLElement>('button.statsNerds').forEach((button, _, arr) => {
    if (button.classList.contains('buttonActive') && button.style.display === 'none') {
      displayStats(arr[0]);
    }
    button.classList.remove('buttonActive')
  })

  revealStuff()
  hideStuff()
}

export const subTubsEventListener = () => {
  // Toggle All SubTubs
  tabRow.getSubs().forEach((tab) => {
    tab.getSubTabs().subTabList.forEach((subtab, index) => {
      DOMCacheGetOrSet(subtab.buttonID).addEventListener('click', () => {
        changeSubTab(tab.getType(), { page: index })
      })
    })
  })
}
