import { DOMCacheGetOrSet } from './Cache/DOM'
import { player } from './Synergism'
import {
  setActiveSettingScreen,
  toggleBuildingScreen,
  toggleCorruptionLoadoutsStats,
  toggleCubeSubTab,
  toggleRuneScreen,
  toggleSingularityScreen
} from './Toggles'
import { hideStuff, revealStuff } from './UpdateHTML'
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
  subTabList: {
    subTabID: string
    unlocked: boolean
    buttonID?: string
  }[]
}

const subtabInfo: Record<Tabs, SubTab> = {
  [Tabs.Settings]: {
    tabSwitcher: () => setActiveSettingScreen,
    subTabList: [
      { subTabID: 'settingsubtab', unlocked: true },
      { subTabID: 'languagesubtab', unlocked: true },
      { subTabID: 'creditssubtab', unlocked: true },
      { subTabID: 'statisticsSubTab', unlocked: true },
      {
        subTabID: 'resetHistorySubTab',
        get unlocked () {
          return player.unlocks.prestige
        }
      },
      {
        subTabID: 'ascendHistorySubTab',
        get unlocked () {
          return player.ascensionCount > 0
        }
      },
      {
        subTabID: 'singularityHistorySubTab',
        get unlocked () {
          return player.highestSingularityCount > 0
        }
      },
      { subTabID: 'hotkeys', unlocked: true },
      { subTabID: 'accountSubTab', unlocked: true }
    ]
  },
  [Tabs.Shop]: { subTabList: [] },
  [Tabs.Buildings]: {
    tabSwitcher: () => toggleBuildingScreen,
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
          return player.achievements[134] > 0
        },
        buttonID: 'toggleRuneSubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return player.achievements[134] > 0
        },
        buttonID: 'toggleRuneSubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.achievements[204] > 0
        },
        buttonID: 'toggleRuneSubTab4'
      }
    ]
  },
  [Tabs.Challenges]: { subTabList: [] },
  [Tabs.Research]: { subTabList: [] },
  [Tabs.AntHill]: { subTabList: [] },
  [Tabs.WowCubes]: {
    tabSwitcher: () => toggleCubeSubTab,
    subTabList: [
      {
        subTabID: '1',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'switchCubeSubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return player.achievements[197] > 0
        },
        buttonID: 'switchCubeSubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return player.achievements[211] > 0
        },
        buttonID: 'switchCubeSubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.achievements[218] > 0
        },
        buttonID: 'switchCubeSubTab4'
      },
      {
        subTabID: '5',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'switchCubeSubTab5'
      },
      {
        subTabID: '6',
        get unlocked () {
          return player.achievements[218] > 0
        },
        buttonID: 'switchCubeSubTab6'
      },
      {
        subTabID: '7',
        get unlocked () {
          return player.challenge15Exponent >= 1e15
        },
        buttonID: 'switchCubeSubTab7'
      }
    ]
  },
  [Tabs.Corruption]: {
    tabSwitcher: () => toggleCorruptionLoadoutsStats,
    subTabList: [
      {
        subTabID: 'true',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'corrStatsBtn'
      },
      {
        subTabID: 'false',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'corrLoadoutsBtn'
      }
    ]
  },
  [Tabs.Singularity]: {
    tabSwitcher: () => toggleSingularityScreen,
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
          return Boolean(player.singularityUpgrades.octeractUnlock.getEffect().bonus)
        },
        buttonID: 'toggleSingularitySubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.highestSingularityCount >= 25
        },
        buttonID: 'toggleSingularitySubTab4'
      },
      {
        subTabID: '5',
        get unlocked () {
          return player.singularityChallenges.noSingularityUpgrades.completions >= 1
        },
        buttonID: 'toggleSingularitySubTab5'
      }
    ]
  },
  [Tabs.Event]: { subTabList: [] }
}

const tabsUnlockInfo: Record<Tabs, () => boolean> = {
  [Tabs.Settings]: () => true,
  [Tabs.Shop]: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
  [Tabs.Buildings]: () => true,
  [Tabs.Upgrades]: () => true,
  [Tabs.Achievements]: () => player.unlocks.coinfour,
  [Tabs.Runes]: () => player.unlocks.prestige,
  [Tabs.Challenges]: () => player.unlocks.transcend,
  [Tabs.Research]: () => player.unlocks.reincarnate,
  [Tabs.AntHill]: () => player.achievements[127] > 0,
  [Tabs.WowCubes]: () => player.achievements[141] > 0,
  [Tabs.Corruption]: () => player.challengecompletions[11] > 0,
  [Tabs.Singularity]: () => player.highestSingularityCount > 0,
  [Tabs.Event]: () => G.isEvent
} as const

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

  appendButton (...elements: $Tab[]) {
    for (const element of elements) {
      this.#list.push(element)
      this.appendChild(element)
    }

    this.#currentTab = this.#list[0]
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

  getNextTab () {
    const index = this.#list.indexOf(this.#currentTab)

    return this.#list[index + 1] ?? this.#list[0]
  }

  getPreviousTab () {
    const index = this.#list.indexOf(this.#currentTab)

    return this.#list[index - 1] ?? this.#list[this.#list.length - 1]
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
  }

  setUnlockedState (fn: () => boolean) {
    this.#unlocked = fn
    return this
  }

  isUnlocked () {
    return this.#unlocked()
  }
}

customElements.define('tab-row', TabRow, { extends: 'div' })
customElements.define('sub-tab', $Tab, { extends: 'button' })

const tabRow = new TabRow()

tabRow.appendButton(
  new $Tab({ id: 'buildingstab', i18n: 'tabs.main.buildings' }),
  new $Tab({ id: 'upgradestab', i18n: 'tabs.main.upgrades' }),
  new $Tab({ id: 'achievementstab', i18n: 'tabs.main.achievements', class: 'coinunlock4' })
    .setUnlockedState(() => player.unlocks.coinfour),
  new $Tab({ class: 'prestigeunlock', id: 'runestab', i18n: 'tabs.main.runes' })
    .setUnlockedState(() => player.unlocks.prestige),
  new $Tab({ class: 'transcendunlock', id: 'challengetab', i18n: 'tabs.main.challenges' })
    .setUnlockedState(() => player.unlocks.transcend),
  new $Tab({ class: 'reincarnationunlock', id: 'researchtab', i18n: 'tabs.main.research' })
    .setUnlockedState(() => player.unlocks.reincarnate),
  new $Tab({ class: 'chal8', id: 'anttab', i18n: 'tabs.main.antHill' })
    .setUnlockedState(() => player.achievements[127] > 0),
  new $Tab({ class: 'chal10', id: 'cubetab', i18n: 'tabs.main.wowCubes' })
    .setUnlockedState(() => player.achievements[141] > 0),
  new $Tab({ class: 'chal11', id: 'traitstab', i18n: 'tabs.main.corruption' })
    .setUnlockedState(() => player.challengecompletions[11] > 0),
  new $Tab({ class: 'singularity', id: 'singularitytab', i18n: 'tabs.main.singularity' })
    .setUnlockedState(() => player.highestSingularityCount > 0),
  new $Tab({ id: 'settingstab', i18n: 'tabs.main.settings' }),
  new $Tab({ class: 'reincarnationunlock', id: 'shoptab', i18n: 'tabs.main.shop' })
    .setUnlockedState(() => player.unlocks.reincarnate || player.highestSingularityCount > 0),
  new $Tab({ class: 'isEvent', id: 'eventtab', i18n: 'tabs.main.unsmith' }).setUnlockedState(() => G.isEvent)
)

export class Tab {
  name: Tabs

  constructor (_element: HTMLElement) {
    this.name = Tabs.Buildings
  }

  get subtabs () {
    return subtabInfo[this.name]
  }

  get unlocked () {
    return tabsUnlockInfo[this.name]()
  }
}

/**
 * Map each tab by its "index" (place in the nav row)
 */
export const tabs = new Map(
  Array.from(document.querySelectorAll<HTMLElement>('#tabrow > button')).map((tab, index) => {
    return [index + 1, new Tab(tab)]
  })
)

/**
 * @param step 1 to go forward; -1 to go back
 * @param changeSubtab true to change the subtab, false to change the main tabs
 */
export const keyboardTabChange = (step: 1 | -1 = 1, changeSubtab = false) => {
  let tab = step === 1 ? tabRow.getNextTab() : tabRow.getPreviousTab()

  while (!tab?.isUnlocked()) {
    tab = step === 1 ? tabRow.getNextTab() : tabRow.getPreviousTab()
  }

  if (changeSubtab) {
    changeSubTab(tab, { step })
  } else {
    changeTab(idToEnum(tab), step)
  }
}

export const changeTab = (tabs: Tabs, step?: number) => {
  if (step === 1) {
    tabRow.setNextTab()
  } else if (step === -1) {
    tabRow.setPreviousTab()
  } else {
    while (idToEnum(tabRow.getCurrentTab()) !== tabs) {
      tabRow.setNextTab()
    }
  }

  G.currentTab = idToEnum(tabRow.getCurrentTab())
  player.tabnumber = 0

  revealStuff()
  hideStuff()
  ;(document.activeElement as HTMLElement | null)?.blur()

  const subTabList = subtabInfo[G.currentTab].subTabList
  if (G.currentTab !== Tabs.Settings) {
    for (let i = 0; i < subTabList.length; i++) {
      const id = subTabList[i].buttonID
      if (id) {
        const button = DOMCacheGetOrSet(id)

        if (button.style.backgroundColor === 'crimson') { // handles every tab except settings and corruptions
          player.subtabNumber = i
          break
        }
        // what in the shit is this?!
        if (player.tabnumber === 9 && button.style.borderColor === 'dodgerblue') { // handle corruption tab
          player.subtabNumber = i
          break
        }
      }
    }
  } else { // handle settings tab
    // The first getElementById makes sure that it still works if other tabs start using the subtabSwitcher class
    const btns = document.querySelectorAll('[id^="switchSettingSubTab"]')
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].classList.contains('buttonActive')) {
        player.subtabNumber = i
        break
      }
    }
  }
}

export const changeSubTab = (tabOrName: $Tab | Tabs, { page, step }: SubTabSwitchOptions) => {
  const tab = typeof tabOrName === 'string'
    ? [...tabs.values()].find((tab) => tab.name === tabOrName)
    : tabOrName

  if (!tab) return

  const subTabs = tab.subtabs

  if (!tab.unlocked || subTabs.subTabList.length === 0) {
    return
  }

  if (page !== undefined) {
    player.subtabNumber = limitRange(page, 0, subTabs.subTabList.length - 1)
  } else {
    player.subtabNumber = limitRange(player.subtabNumber + step, 0, subTabs.subTabList.length - 1)
  }
  const subTabList = subTabs.subTabList[player.subtabNumber]

  if (subTabList.unlocked) {
    subTabs.tabSwitcher?.()(subTabList.subTabID)
    if (tabOrName === Tabs.Singularity && page === 4) {
      player.visitedAmbrosiaSubtab = true
      player.caches.ambrosiaGeneration.updateVal('DefaultVal')
    }
  }
}

export function subTabsInMainTab (name: Tabs) {
  const tab = [...tabs.values()].find((tab) => tab.name === name)
  assert(tab)

  return tab.subtabs.subTabList.length
}

function idToEnum (element: HTMLButtonElement) {
  switch (element.id) {
    case 'buildingstab':
      return Tabs.Buildings
    case 'upgradestab':
      return Tabs.Upgrades
    case 'achievementstab':
      return Tabs.Achievements
    case 'runestab':
      return Tabs.Runes
    case 'challengetab':
      return Tabs.Challenges
    case 'researchtab':
      return Tabs.Research
    case 'anttab':
      return Tabs.AntHill
    case 'cubetab':
      return Tabs.WowCubes
    case 'traitstab':
      return Tabs.Corruption
    case 'singularitytab':
      return Tabs.Singularity
    case 'settingstab':
      return Tabs.Settings
    case 'shoptab':
      return Tabs.Shop
    case 'eventtab':
      return Tabs.Event
  }

  assert(false)
}
